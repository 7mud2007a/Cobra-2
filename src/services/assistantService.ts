/**
 * COBRA Assistant — local (frontend-only) response logic.
 *
 * DEMONSTRATION VERSION: answers are produced by rules that read src/data/vehicles.ts.
 * Nothing is sent over the network and no AI model is involved.
 *
 * The chat UI only talks to the `AssistantProvider` interface below. To connect a real AI
 * later, create another provider that implements `reply()` and export it as `assistantProvider`.
 */
import { vehicles, vehicleName, type Vehicle } from '../data/vehicles'
import { assistantConfig, copy } from '../data/assistantConfig'
import { siteConfig } from '../config/site'
import { formatKm, formatHp, formatPrice, type Lang } from '../lib/format'
import { en } from '../i18n/en'
import { ar } from '../i18n/ar'

/* ───────────── Public contract (used by the chat UI) ───────────── */
export type AssistantAction = { kind: 'vehicle'; id: string } | { kind: 'section'; id: 'contact' }
export interface AssistantReply {
  text: string
  lang: Lang
  actions?: AssistantAction[]
  suggestions?: string[]
  /** Vehicles this answer was about — passed back as context for follow-up questions. */
  focusIds?: string[]
}
export interface ChatContext { uiLang: Lang; lastFocusIds: string[] }
export interface AssistantProvider {
  id: string
  reply(message: string, ctx: ChatContext): Promise<AssistantReply>
}

/* ───────────── Text helpers ───────────── */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/(\d),(\d{3})/g, '$1$2')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
const norm = (list: string[]) => list.map(normalize)

const reCache = new Map<string, RegExp>()
function phraseRe(p: string): RegExp {
  let r = reCache.get(p)
  if (!r) {
    const esc = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const arabic = /[\u0600-\u06FF]/.test(p) // Arabic clitics may attach: و، ب، ل، ال …
    r = new RegExp(`(?:^| )${arabic ? '(?:وال|بال|لل|ال|و|ب|ل|ف|ك)?' : ''}${esc}(?: |$)`)
    reCache.set(p, r)
  }
  return r
}
const hasAny = (n: string, list: string[]) => list.some((p) => phraseRe(p).test(n))

export function detectLang(message: string, fallback: Lang): Lang {
  const arN = (message.match(/[\u0600-\u06FF]/g) ?? []).length
  const enN = (message.match(/[a-z]/gi) ?? []).length
  if (arN >= 3 && enN <= arN * 3) return 'ar'
  if (enN >= 2 && arN < 3) return 'en'
  return fallback
}

/* ───────────── Keyword sets (English + Arabic, normalised once) ───────────── */
const K = {
  greet: norm(['hi', 'hello', 'hey', 'good morning', 'good evening', 'salam', 'salaam', 'مرحبا', 'اهلا', 'هلا', 'السلام عليكم', 'صباح الخير', 'مساء الخير', 'هاي', 'سلام']),
  thanks: norm(['thanks', 'thank you', 'thx', 'شكرا', 'مشكور', 'تسلم', 'يعطيك العافية']),
  contactStrong: norm(['contact', 'phone', 'call you', 'call', 'telephone', 'whatsapp', 'email', 'address', 'location', 'where are you', 'opening hours', 'working hours', 'hours', 'reach you', 'تواصل', 'اتصل', 'اتصال', 'هاتف', 'جوال', 'واتساب', 'واتس اب', 'ايميل', 'بريد', 'عنوان', 'موقعكم', 'وين مكانكم', 'ساعات الدوام', 'ساعات العمل', 'دوام']),
  contactSoft: norm(['book', 'appointment', 'test drive', 'visit', 'showroom', 'buy', 'purchase', 'موعد', 'تجربة قيادة', 'زيارة', 'المعرض', 'شراء', 'احجز']),
  phoneWords: norm(['phone', 'call', 'telephone', 'number', 'هاتف', 'رقم', 'جوال', 'اتصال', 'اتصل']),
  compare: norm(['compare', 'comparison', 'versus', 'vs', 'difference between', 'difference', 'which is better', 'better than', 'قارن', 'مقارنة', 'الفرق بين', 'الفرق', 'ايهما افضل', 'افضل من', 'مقابل', 'ضد']),
  price: norm(['price', 'prices', 'cost', 'how much', 'pricing', 'priced', 'worth', 'سعر', 'اسعار', 'بكم', 'كم سعر', 'كم ثمن', 'ثمن', 'تكلفة', 'كم يكلف', 'كم سعرها']),
  avail: norm(['available', 'availability', 'in stock', 'do you have', 'have you got', 'do you sell', 'is there', 'exist', 'still', 'for sale', 'متوفر', 'متاح', 'موجود', 'عندكم', 'لديكم', 'عندك', 'هل يوجد', 'هل توجد', 'للبيع', 'ما زال', 'لسه']),
  statusSold: norm(['sold', 'مباع', 'مباعة', 'بيعت', 'انباعت']),
  statusReserved: norm(['reserved', 'booked', 'محجوز', 'محجوزة']),
  specs: norm(['spec', 'specs', 'specification', 'specifications', 'details', 'detail', 'tell me about', 'info', 'information', 'مواصفات', 'تفاصيل', 'معلومات', 'اخبرني عن', 'حدثني عن']),
  recommend: norm(['recommend', 'suggest', 'suggestion', 'looking for', 'which car', 'options', 'i want', 'i need', 'need a', 'want a', 'something', 'best', 'اقترح', 'انصحني', 'انصح', 'ابحث عن', 'ابي', 'ابغى', 'ابغي', 'اريد', 'خيارات', 'افضل', 'ارشحلي']),
  alt: norm(['alternative', 'alternatives', 'similar', 'instead', 'another', 'other options', 'بديل', 'بدائل', 'شبيه', 'مشابه', 'غيرها', 'خيار اخر', 'خيارات اخري']),
  list: norm(['all cars', 'all vehicles', 'inventory', 'collection', 'catalog', 'catalogue', 'what cars', 'what vehicles', 'what do you have', 'show me everything', 'list', 'كل السيارات', 'جميع السيارات', 'المخزون', 'المعروض', 'ماذا لديكم', 'ماذا عندكم', 'وش عندكم', 'ايش عندكم', 'قائمة']),
  over: norm(['above', 'over', 'more than', 'at least', 'فوق', 'اكثر من', 'اعلي من', 'لا يقل']),
}
const ATTR: Record<string, string[]> = {
  engine: norm(['engine', 'motor', 'cylinder', 'محرك', 'ماكينة', 'سلندر']),
  power: norm(['horsepower', 'power', 'hp', 'bhp', 'قوة', 'حصان', 'قدرة', 'احصنة']),
  transmission: norm(['transmission', 'gearbox', 'gear', 'ناقل', 'قير', 'جير', 'جيربوكس']),
  drivetrain: norm(['drivetrain', 'awd', 'rwd', '4wd', 'four wheel', 'all wheel', 'rear wheel', 'نظام الدفع', 'نوع الدفع']),
  fuel: norm(['fuel', 'petrol', 'gas', 'gasoline', 'diesel', 'hybrid', 'وقود', 'بنزين', 'ديزل', 'هجين', 'هايبرد']),
  mileage: norm(['mileage', 'kilometers', 'kilometres', 'km', 'miles', 'odometer', 'ممشى', 'كيلومتر', 'كيلو', 'مسافة مقطوعة', 'عداد']),
  year: norm(['year', 'model year', 'manufactured', 'سنة', 'سنة الصنع', 'موديل', 'صنع']),
  color: norm(['color', 'colour', 'paint', 'interior', 'exterior', 'لون', 'الوان', 'داخلي', 'خارجي']),
}
const CAT: Record<string, string[]> = {
  suv: norm(['suv', 'suvs', '4x4', 'off road', 'offroad', 'جيب', 'دفع رباعي', 'رباعية الدفع', 'رباعيه', 'سيارات كبيرة']),
  sedan: norm(['sedan', 'sedans', 'saloon', 'سيدان', 'صالون']),
  coupe: norm(['coupe', 'coupes', 'كوبيه']),
  sports: norm(['sport', 'sports', 'sporty', 'fast', 'performance', 'رياضية', 'رياضي', 'سريعة', 'سبورت']),
  family: norm(['family', 'spacious', 'عائلية', 'عائلي', 'عائلة']),
  hybrid: norm(['hybrid', 'hybrids', 'هجين', 'هايبرد']),
  electric: norm(['electric', 'ev', 'كهربائية', 'كهربائي']),
  petrol: norm(['petrol', 'gasoline', 'بنزين']),
  diesel: norm(['diesel', 'diesels', 'ديزل']),
}

/* ───────────── Vehicle matching ───────────── */
interface Matches { named: Vehicle[]; specific: Vehicle[]; hasUnknownModel: boolean; unknownMake?: string }

function aliasesFor(v: Vehicle) {
  const make = normalize(v.make)
  const makeAliases = [make, ...norm(assistantConfig.makeAliases[make] ?? [])]
  const modelAliases = [normalize(v.model), normalize(`${v.make} ${v.model}`), ...norm(v.aliases ?? [])]
  return { makeAliases, modelAliases }
}
const firstIndex = (n: string, list: string[]) => {
  let best = -1
  for (const p of list) { const m = phraseRe(p).exec(n); if (m && (best < 0 || m.index < best)) best = m.index }
  return best
}

function matchVehicles(n: string): Matches {
  const hits: { v: Vehicle; idx: number; specific: boolean }[] = []
  for (const v of vehicles) {
    const { makeAliases, modelAliases } = aliasesFor(v)
    const mi = firstIndex(n, modelAliases)
    const ki = firstIndex(n, makeAliases)
    if (mi >= 0) hits.push({ v, idx: mi, specific: true })
    else if (ki >= 0) hits.push({ v, idx: ki, specific: false })
  }
  // If a specific model of a make matched, drop make-only hits of that same make.
  const specificMakes = new Set(hits.filter((h) => h.specific).map((h) => h.v.make))
  const kept = hits.filter((h) => h.specific || !specificMakes.has(h.v.make)).sort((a, b) => a.idx - b.idx)
  const named = kept.map((h) => h.v)
  const specific = kept.filter((h) => h.specific).map((h) => h.v)

  // A make was mentioned together with a model-like token that matches no vehicle (e.g. "BMW X5").
  const known = new Set(vehicles.flatMap((v) => aliasesFor(v).modelAliases.flatMap((a) => a.split(' '))))
  const tokens = n.split(' ')
  const modelLike = tokens.some(
    (t) => /^(?:[a-z]{1,3}\d{1,3}[a-z]{0,3}|\d{3}[a-z]{0,2})$/.test(t) && !/^\d+k$/.test(t) && !known.has(t),
  )
  const makeOnlyHit = kept.some((h) => !h.specific)
  const hasUnknownModel = makeOnlyHit && specific.length === 0 && modelLike

  let unknownMake: string | undefined
  for (const b of assistantConfig.externalBrands) {
    if (phraseRe(normalize(b)).test(n)) { unknownMake = b.replace(/^./, (c) => c.toUpperCase()); break }
  }
  return { named, specific, hasUnknownModel, unknownMake }
}

/* ───────────── Formatting helpers ───────────── */
function makeFmt(lang: Lang) {
  const iso = (s: string | number) => (lang === 'ar' ? `\u2068${s}\u2069` : String(s))
  const c = copy[lang]
  const dict = lang === 'ar' ? ar : en
  const name = (v: Vehicle) => iso(vehicleName(v))
  const price = (v: Vehicle) => iso(formatPrice(v.price))
  const line = (v: Vehicle) => `• ${name(v)} — ${v.year} — ${price(v)} — ${c.status[v.status]}`
  const value: Record<string, (v: Vehicle) => string> = {
    price: (v) => price(v),
    year: (v) => String(v.year),
    engine: (v) => iso(v.engine),
    power: (v) => iso(formatHp(v.horsepower, lang)),
    transmission: (v) => v.transmission[lang],
    drivetrain: (v) => dict.drivetrain[v.drivetrain],
    fuel: (v) => dict.fuel[v.fuel],
    mileage: (v) => iso(formatKm(v.mileage, lang)),
    exterior: (v) => v.exteriorColor[lang],
    interior: (v) => v.interiorColor[lang],
    status: (v) => c.status[v.status],
  }
  const labels = c.labels as Record<string, string>
  const specLine = (v: Vehicle, k: string) => `• ${labels[k]}: ${value[k](v)}`
  return { iso, c, name, price, line, value, labels, specLine }
}

const byPrice = (a: Vehicle, b: Vehicle) => a.price - b.price
const rank = (v: Vehicle) => (v.status === 'available' ? 0 : v.status === 'reserved' ? 1 : 2)

function alternativesFor(v: Vehicle, limit = 2): Vehicle[] {
  return vehicles
    .filter((x) => x.id !== v.id && x.status === 'available')
    .sort((a, b) => Number(b.bodyType === v.bodyType) - Number(a.bodyType === v.bodyType) || Math.abs(a.price - v.price) - Math.abs(b.price - v.price))
    .slice(0, limit)
}

function parseBudget(n: string): { min?: number; max?: number } {
  const re = /(\d+)\s*(k|الف|الاف|thousand)?(?= |$)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(n))) {
    const raw = parseInt(m[1], 10)
    const val = m[2] ? raw * 1000 : raw
    if (!m[2] && raw >= 1990 && raw <= 2030) continue // looks like a year
    if (val < 1000) continue
    return hasAny(n, K.over) ? { min: val } : { max: val }
  }
  return {}
}

function filtersFrom(n: string) {
  const f = {
    suv: hasAny(n, CAT.suv), sedan: hasAny(n, CAT.sedan), coupe: hasAny(n, CAT.coupe),
    sports: hasAny(n, CAT.sports), family: hasAny(n, CAT.family),
    fuel: hasAny(n, CAT.hybrid) ? 'hybrid' : hasAny(n, CAT.electric) ? 'electric' : hasAny(n, CAT.diesel) ? 'diesel' : hasAny(n, CAT.petrol) ? 'petrol' : null,
    ...parseBudget(n),
  }
  const active = f.suv || f.sedan || f.coupe || f.sports || f.family || !!f.fuel || f.min !== undefined || f.max !== undefined
  const test = (v: Vehicle) => {
    const body = [f.suv && v.bodyType === 'suv', f.sedan && (v.bodyType === 'sedan' || v.bodyType === 'sportback'), f.coupe && v.bodyType === 'coupe', f.family && v.bodyType !== 'coupe']
    const wantsBody = f.suv || f.sedan || f.coupe || f.family
    if (wantsBody && !body.some(Boolean)) return false
    if (f.sports && v.horsepower < 440) return false
    if (f.fuel && v.fuel !== f.fuel) return false
    if (f.max !== undefined && v.price > f.max) return false
    if (f.min !== undefined && v.price < f.min) return false
    return true
  }
  return { f, active, test }
}

/* ───────────── The responder ───────────── */
function respond(message: string, ctx: ChatContext): AssistantReply {
  const lang = detectLang(message, ctx.uiLang)
  const F = makeFmt(lang)
  const { c } = F
  const n = normalize(message)
  const words = n ? n.split(' ').length : 0
  const defaults = assistantConfig.suggestions[lang]
  const reply = (text: string, extra: Partial<AssistantReply> = {}): AssistantReply => ({ text, lang, ...extra })
  const vehicleActions = (list: Vehicle[], max = 2): AssistantAction[] => list.slice(0, max).map((v) => ({ kind: 'vehicle', id: v.id }))

  if (!n) return reply(c.askWhich, { suggestions: defaults })

  const m = matchVehicles(n)
  let named = m.named
  const I = {
    greet: hasAny(n, K.greet), thanks: hasAny(n, K.thanks),
    contactStrong: hasAny(n, K.contactStrong), contactSoft: hasAny(n, K.contactSoft),
    compare: hasAny(n, K.compare), price: hasAny(n, K.price), avail: hasAny(n, K.avail),
    sold: hasAny(n, K.statusSold), reserved: hasAny(n, K.statusReserved),
    specs: hasAny(n, K.specs), recommend: hasAny(n, K.recommend), alt: hasAny(n, K.alt), list: hasAny(n, K.list),
  }
  const attrs = Object.keys(ATTR).filter((k) => hasAny(n, ATTR[k]))
  const flt = filtersFrom(n)

  /* small talk */
  if (I.thanks && !named.length && !I.price && !I.avail) return reply(c.thanks, { suggestions: defaults })
  if (I.greet && !named.length && words <= 5 && !I.contactStrong && !I.price && !I.avail && !I.list) return reply(c.greet, { suggestions: defaults })

  /* contact */
  if (I.contactStrong || (I.contactSoft && !named.length && !flt.active && !I.price && !I.avail)) {
    const lines = [c.contactIntro]
    const { phone, whatsapp, email } = siteConfig.contact
    if (phone) lines.push(c.contactPhone(F.iso(phone)))
    if (whatsapp) lines.push(c.contactWhatsapp(F.iso(`+${whatsapp.replace(/\D/g, '')}`)))
    if (email) lines.push(c.contactEmail(F.iso(email)))
    const anyConfigured = !!(phone || whatsapp || email)
    if (!anyConfigured) lines.length = 0
    if (!phone && hasAny(n, K.phoneWords)) lines.push(c.phoneNotConfigured)
    lines.push(anyConfigured ? c.contactForm : c.contactFormOnly)
    return reply(lines.join('\n'), { actions: [{ kind: 'section', id: 'contact' }], suggestions: defaults })
  }

  /* comparison */
  if (I.compare) {
    if (named.length >= 2) {
      const [a, b] = named
      const keys = ['price', 'year', 'engine', 'power', 'transmission', 'drivetrain', 'fuel', 'mileage', 'status']
      const lines = [c.compareHead(F.name(a), F.name(b))]
      for (const k of keys) lines.push(`• ${F.labels[k]}: ${F.value[k](a)}  |  ${F.value[k](b)}`)
      const verdicts: string[] = []
      if (a.horsepower !== b.horsepower) { const w = a.horsepower > b.horsepower ? a : b; verdicts.push(c.verdictPower(F.name(w), F.value.power(w))) }
      if (a.price !== b.price) verdicts.push(c.verdictPrice(F.name(a.price < b.price ? a : b)))
      if (a.mileage !== b.mileage) verdicts.push(c.verdictMileage(F.name(a.mileage < b.mileage ? a : b)))
      lines.push('', ...verdicts)
      for (const v of [a, b]) if (v.status === 'sold') lines.push(c.soldNoteOne(F.name(v)))
      if (named.length > 2) lines.push(c.compareMore)
      return reply(lines.join('\n'), { actions: vehicleActions([a, b]), focusIds: [a.id, b.id] })
    }
    if (named.length === 1 && m.unknownMake) {
      const v = named[0]
      const lines = [c.compareOnlyOne(F.name(v), m.unknownMake), ...['price', 'year', 'engine', 'power', 'status'].map((k) => F.specLine(v, k))]
      return reply(lines.join('\n'), { actions: vehicleActions([v]), focusIds: [v.id] })
    }
    return reply(c.compareNeedTwo, { suggestions: defaults })
  }

  /* brand / model that is not in the inventory */
  if (m.unknownMake && !named.length) {
    const near = vehicles.filter((v) => v.status === 'available').sort(byPrice).slice(0, 3)
    return reply([c.notFound(F.iso(m.unknownMake)), '', c.closest, ...near.map(F.line)].join('\n'), { actions: vehicleActions(near, 3), suggestions: defaults })
  }
  if (m.hasUnknownModel) {
    const make = named[0].make
    const same = vehicles.filter((v) => v.make === make)
    return reply([c.notFoundModel(F.iso(make)), ...same.map(F.line)].join('\n'), { actions: vehicleActions(same), focusIds: same.map((v) => v.id) })
  }

  /* follow-up that relies on the previous vehicle ("and its price?") */
  const wantsSomething = I.price || I.avail || I.specs || attrs.length > 0
  if (!named.length && wantsSomething && !flt.active && !I.list && ctx.lastFocusIds.length) {
    named = ctx.lastFocusIds.map((id) => vehicles.find((v) => v.id === id)).filter((v): v is Vehicle => !!v)
  }

  /* questions about named vehicle(s) */
  if (named.length) {
    const shown = named.slice(0, 3)
    const focusIds = shown.map((v) => v.id)
    const out: string[] = []
    const extraAlt: Vehicle[] = []

    if (I.alt && shown.length) {
      const alts = alternativesFor(shown[0], 3)
      out.push(alts.length ? c.alternatives : c.noAlternatives, ...alts.map(F.line))
      return reply(out.join('\n'), { actions: vehicleActions(alts, 3), focusIds: alts.map((v) => v.id) })
    }

    if (I.price) {
      for (const v of shown) {
        out.push(c.priceLine(F.name(v), F.price(v)))
        if (v.status !== 'available') { out.push(c.statusSentence[v.status]); extraAlt.push(...alternativesFor(v, 2)) }
      }
    } else if (attrs.length && !I.specs) {
      for (const v of shown.slice(0, 2)) {
        out.push(c.specsHead(F.name(v), v.year), ...attrs.map((k) => F.specLine(v, k === 'color' ? 'exterior' : k)))
        if (attrs.includes('color')) out.push(F.specLine(v, 'interior'))
      }
    } else if (I.specs) {
      for (const v of shown.slice(0, 2)) {
        out.push(c.specsHead(F.name(v), v.year), ...['price', 'engine', 'power', 'transmission', 'drivetrain', 'fuel', 'mileage', 'exterior', 'interior', 'status'].map((k) => F.specLine(v, k)))
        out.push('')
      }
    } else if (I.sold || I.reserved || I.avail || shown.length) {
      // existence / status (also the default for a bare vehicle name)
      if (shown.length > 1 || (shown.length === 1 && named.length > 1)) {
        out.push(c.makeHas(F.iso(shown[0].make), shown.length), ...shown.map(F.line))
      } else {
        const v = shown[0]
        out.push(`${c.existsYes(F.name(v), v.year)} ${c.statusSentence[v.status]}`, F.specLine(v, 'price'))
        if (v.status !== 'available') extraAlt.push(...alternativesFor(v, 2))
      }
    }
    if (extraAlt.length) {
      const uniq = Array.from(new Set(extraAlt)).slice(0, 2)
      out.push('', c.alternatives, ...uniq.map(F.line))
    }
    const acts = [...vehicleActions(shown, 2), ...vehicleActions(Array.from(new Set(extraAlt)), 1)]
    return reply(out.join('\n').trim(), { actions: acts, focusIds })
  }

  /* inventory-level questions */
  if (I.sold || I.reserved) {
    const st = I.sold ? 'sold' : 'reserved'
    const list = vehicles.filter((v) => v.status === st)
    if (!list.length) return reply(c.noneFit, { suggestions: defaults })
    return reply([c.statusList(st, list.length), ...list.map(F.line)].join('\n'), { actions: vehicleActions(list, 3), focusIds: list.map((v) => v.id) })
  }
  if (flt.active || I.recommend || I.alt) {
    const pool = vehicles.filter((v) => v.status !== 'sold').sort((a, b) => rank(a) - rank(b) || byPrice(a, b))
    const fit = pool.filter(flt.test)
    if (fit.length) {
      const top = fit.slice(0, 4)
      return reply([c.recommendIntro, ...top.map(F.line), ...(fit.length > 4 ? [c.more(fit.length - 4)] : [])].join('\n'), { actions: vehicleActions(top, 3), focusIds: top.map((v) => v.id) })
    }
    const target = flt.f.max ?? flt.f.min
    const near = vehicles.filter((v) => v.status === 'available').sort((a, b) => (target ? Math.abs(a.price - target) - Math.abs(b.price - target) : byPrice(a, b))).slice(0, 3)
    return reply([c.noneFit, '', c.closest, ...near.map(F.line)].join('\n'), { actions: vehicleActions(near, 3), focusIds: near.map((v) => v.id) })
  }
  if (I.list || I.avail) {
    const list = I.list ? [...vehicles].sort((a, b) => rank(a) - rank(b) || byPrice(a, b)) : vehicles.filter((v) => v.status === 'available').sort(byPrice)
    return reply([c.listIntro(list.length), ...list.map(F.line)].join('\n'), { actions: vehicleActions(list, 3), focusIds: list.map((v) => v.id) })
  }
  if (I.price) {
    const ps = vehicles.map((v) => v.price)
    return reply(`${c.priceRange(F.iso(formatPrice(Math.min(...ps))), F.iso(formatPrice(Math.max(...ps))))}\n${c.askWhich}`, { suggestions: defaults })
  }
  if (I.specs || attrs.length) return reply(c.askWhich, { suggestions: defaults })

  return reply(c.redirect, { suggestions: defaults })
}

/** Local, rule-based provider used by this demonstration build. */
export const localAssistantProvider: AssistantProvider = {
  id: 'local-demo',
  async reply(message, ctx) {
    return respond(message, ctx)
  },
}

/** The provider the chat UI uses. Swap this single export to integrate a real AI later. */
export const assistantProvider: AssistantProvider = localAssistantProvider
