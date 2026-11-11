/**
 * COBRA Assistant — configuration and wording.
 * Demonstration version: all answers are produced locally from src/data/vehicles.ts.
 * No external AI service is used. To add a real AI later, replace the provider
 * exported from src/services/assistantService.ts — the chat UI does not change.
 */
import type { Lang } from '../lib/format'

export const assistantConfig = {
  isDemo: true,
  /** Simulated "typing" time in ms (local answers are instant; this only paces the UI). */
  typingDelay: { min: 650, max: 1150 },
  welcome: {
    en: 'Welcome. I’m COBRA Assistant, the demonstration assistant for this showroom. I can check whether a vehicle is in our inventory, tell you its status, price and specifications, compare two vehicles, or suggest alternatives.',
    ar: 'أهلًا بك. أنا مساعد كوبرا، المساعد التجريبي لهذا المعرض. أستطيع التحقق من وجود سيارة في مخزوننا، وإخبارك بحالتها وسعرها ومواصفاتها، والمقارنة بين سيارتين، أو اقتراح بدائل.',
  } satisfies Record<Lang, string>,
  suggestions: {
    en: ['Is the BMW M4 available?', 'Compare the Audi RS 7 and the Porsche 911', 'Which SUVs do you have?', 'How can I contact you?'],
    ar: ['هل BMW M4 متوفرة؟', 'قارن بين أودي RS 7 وبورش 911', 'ما السيارات الرباعية الدفع لديكم؟', 'كيف يمكنني التواصل معكم؟'],
  } satisfies Record<Lang, string[]>,
  /** Manufacturer names a customer might type, keyed by the `make` used in vehicles.ts (lower-case). */
  makeAliases: {
    bmw: ['بي ام دبليو', 'بي ام', 'بيام'],
    'mercedes-benz': ['mercedes', 'benz', 'مرسيدس', 'مرسيدس بنز', 'بنز'],
    audi: ['اودي'],
    porsche: ['بورش', 'بورشه'],
    'range rover': ['rangerover', 'رنج روفر', 'رينج روفر', 'ريج روفر', 'لاند روفر', 'land rover'],
    lexus: ['لكزس', 'لكسز'],
    toyota: ['تويوتا'],
    cadillac: ['كاديلاك', 'كاديلك'],
  } as Record<string, string[]>,
  /** Brands that are NOT in the inventory — lets the assistant say so clearly instead of guessing. */
  externalBrands: [
    'ferrari', 'فيراري', 'lamborghini', 'لامبورغيني', 'لامبورجيني', 'bentley', 'بنتلي', 'rolls royce', 'رولز رويس',
    'tesla', 'تسلا', 'maserati', 'مازيراتي', 'ford', 'فورد', 'nissan', 'نيسان', 'hyundai', 'هيونداي', 'kia', 'كيا',
    'honda', 'هوندا', 'mazda', 'مازدا', 'jaguar', 'جاكوار', 'volvo', 'فولفو', 'bugatti', 'بوغاتي', 'mclaren', 'ماكلارين',
    'aston martin', 'استون مارتن', 'chevrolet', 'شيفروليه', 'شيفرولية', 'gmc', 'جي ام سي', 'lincoln', 'لينكولن', 'infiniti',
    'انفينيتي', 'genesis', 'جينيسيس', 'jeep', 'جيب', 'dodge', 'دودج', 'volkswagen', 'فولكس فاجن', 'فولكسفاجن', 'mini cooper',
    'mitsubishi', 'ميتسوبيشي', 'suzuki', 'سوزوكي', 'bugatti', 'pagani', 'koenigsegg', 'lotus', 'لوتس', 'maybach', 'مايباخ',
  ],
}

export interface Copy {
  status: Record<'available' | 'reserved' | 'sold', string>
  statusSentence: Record<'available' | 'reserved' | 'sold', string>
  greet: string
  thanks: string
  redirect: string
  askWhich: string
  notFound: (label: string) => string
  notFoundModel: (make: string) => string
  existsYes: (name: string, year: number) => string
  makeHas: (make: string, n: number) => string
  priceLine: (name: string, price: string) => string
  priceRange: (lo: string, hi: string) => string
  specsHead: (name: string, year: number) => string
  labels: { price: string; year: string; engine: string; power: string; transmission: string; drivetrain: string; fuel: string; mileage: string; exterior: string; interior: string; status: string }
  alternatives: string
  noAlternatives: string
  recommendIntro: string
  noneFit: string
  closest: string
  listIntro: (n: number) => string
  compareHead: (a: string, b: string) => string
  compareNeedTwo: string
  compareOnlyOne: (known: string, unknown: string) => string
  compareMore: string
  verdictPower: (n: string, hp: string) => string
  verdictPrice: (n: string) => string
  verdictMileage: (n: string) => string
  contactIntro: string
  contactPhone: (p: string) => string
  contactWhatsapp: (p: string) => string
  contactEmail: (e: string) => string
  contactForm: string
  contactFormOnly: string
  statusList: (st: 'reserved' | 'sold', n: number) => string
  phoneNotConfigured: string
  soldNoteOne: (name: string) => string
  more: (n: number) => string
}

export const copy: Record<Lang, Copy> = {
  en: {
    status: { available: 'Available', reserved: 'Reserved', sold: 'Sold' },
    statusSentence: {
      available: 'It is currently available.',
      reserved: 'It is currently reserved, so it is not available for sale at the moment.',
      sold: 'It has been sold and is no longer available.',
    },
    greet: 'Hello. Ask me about any vehicle in our inventory: availability, price, specifications, comparisons or alternatives.',
    thanks: 'You’re welcome. Ask me anything else about our vehicles.',
    redirect:
      'I can only help with the vehicles in our inventory: availability, prices, specifications, comparisons, alternatives and how to contact the dealership. For anything else, please use the Contact section.',
    askWhich: 'Which vehicle do you mean? You can name a make or a model, for example “BMW M4”.',
    notFound: (l) => `I can’t find ${l} in our inventory, so I can’t confirm anything about it.`,
    notFoundModel: (m) => `I can’t find that model in our inventory. This is what we have from ${m}:`,
    existsYes: (n, y) => `Yes, the ${n} (${y}) is in our inventory.`,
    makeHas: (m, n) => `We have ${n} ${m} ${n === 1 ? 'vehicle' : 'vehicles'} in our inventory:`,
    priceLine: (n, p) => `${n}: ${p} (registered price).`,
    priceRange: (lo, hi) => `Registered prices in our inventory range from ${lo} to ${hi}.`,
    specsHead: (n, y) => `${n} (${y})`,
    labels: { price: 'Price', year: 'Year', engine: 'Engine', power: 'Power', transmission: 'Transmission', drivetrain: 'Drivetrain', fuel: 'Fuel', mileage: 'Mileage', exterior: 'Exterior', interior: 'Interior', status: 'Status' },
    alternatives: 'Alternatives that are currently available:',
    noAlternatives: 'There are no other vehicles currently available in our inventory.',
    recommendIntro: 'These vehicles in our inventory fit what you described:',
    noneFit: 'No vehicle in our inventory matches all of that.',
    closest: 'The closest options currently available are:',
    listIntro: (n) => `Here is everything registered in our inventory (${n}):`,
    compareHead: (a, b) => `${a} vs ${b}`,
    compareNeedTwo: 'To compare, please name two vehicles from our inventory, for example “BMW M4 vs Audi RS 7”.',
    compareOnlyOne: (k, u) => `${u} is not in our inventory, so I can’t compare it. Here is the ${k} instead:`,
    compareMore: 'I compared the first two vehicles you mentioned.',
    verdictPower: (n, hp) => `More powerful: ${n} (${hp}).`,
    verdictPrice: (n) => `Lower registered price: ${n}.`,
    verdictMileage: (n) => `Lower mileage: ${n}.`,
    contactIntro: 'You can reach the dealership as follows:',
    contactPhone: (p) => `Management phone: ${p}`,
    contactWhatsapp: (p) => `WhatsApp: ${p}`,
    contactEmail: (e) => `Email: ${e}`,
    contactForm: 'You can also send an inquiry through the form in the Contact section of this website.',
    contactFormOnly: 'You can reach the dealership by sending an inquiry through the form in the Contact section of this website.',
    statusList: (st, n) => `Vehicles currently marked as ${st} (${n}):`,
    phoneNotConfigured: 'The dealership’s official phone number has not been configured on this website yet, so I can’t share one.',
    soldNoteOne: (n) => `Note: the ${n} has been sold.`,
    more: (n) => `…and ${n} more.`,
  },
  ar: {
    status: { available: 'متاح', reserved: 'محجوز', sold: 'مباع' },
    statusSentence: {
      available: 'هي متاحة حاليًا.',
      reserved: 'هي محجوزة حاليًا، لذلك ليست متاحة للبيع في الوقت الحالي.',
      sold: 'تم بيعها ولم تعد متاحة.',
    },
    greet: 'أهلًا بك. اسألني عن أي سيارة في مخزوننا: التوفر، السعر، المواصفات، المقارنة أو البدائل.',
    thanks: 'على الرحب والسعة. اسألني عن أي شيء آخر يخص سياراتنا.',
    redirect:
      'يمكنني المساعدة فقط في السيارات الموجودة في مخزوننا: التوفر والأسعار والمواصفات والمقارنة والبدائل وطريقة التواصل مع المعرض. لأي أمر آخر يرجى استخدام قسم التواصل.',
    askWhich: 'أي سيارة تقصد؟ يمكنك ذكر الشركة أو الطراز، مثل «BMW M4».',
    notFound: (l) => `لا أجد ${l} في مخزوننا، ولذلك لا أستطيع تأكيد أي معلومة عنها.`,
    notFoundModel: (m) => `لا أجد هذا الطراز في مخزوننا. هذه سيارات ${m} المتوفرة لدينا:`,
    existsYes: (n, y) => `نعم، ${n} (${y}) موجودة في مخزوننا.`,
    makeHas: (m, n) => `لدينا في المخزون ${n === 1 ? 'سيارة واحدة' : `${n} سيارات`} من ${m}:`,
    priceLine: (n, p) => `${n}: ${p} (السعر المسجّل).`,
    priceRange: (lo, hi) => `تتراوح الأسعار المسجّلة في مخزوننا بين ${lo} و${hi}.`,
    specsHead: (n, y) => `${n} (${y})`,
    labels: { price: 'السعر', year: 'سنة الصنع', engine: 'المحرك', power: 'القوة', transmission: 'ناقل الحركة', drivetrain: 'نظام الدفع', fuel: 'الوقود', mileage: 'المسافة المقطوعة', exterior: 'اللون الخارجي', interior: 'اللون الداخلي', status: 'الحالة' },
    alternatives: 'البدائل المتاحة حاليًا:',
    noAlternatives: 'لا توجد سيارات أخرى متاحة حاليًا في مخزوننا.',
    recommendIntro: 'هذه السيارات في مخزوننا تناسب ما وصفته:',
    noneFit: 'لا توجد سيارة في مخزوننا تطابق كل ذلك.',
    closest: 'أقرب الخيارات المتاحة حاليًا:',
    listIntro: (n) => `هذا كل ما هو مسجّل في مخزوننا (${n}):`,
    compareHead: (a, b) => `${a} مقابل ${b}`,
    compareNeedTwo: 'للمقارنة، يرجى ذكر سيارتين من مخزوننا، مثل «BMW M4 مقابل Audi RS 7».',
    compareOnlyOne: (k, u) => `${u} غير موجودة في مخزوننا، لذلك لا أستطيع مقارنتها. إليك ${k} بدلًا من ذلك:`,
    compareMore: 'قارنت بين أول سيارتين ذكرتهما.',
    verdictPower: (n, hp) => `الأقوى: ${n} (${hp}).`,
    verdictPrice: (n) => `الأقل سعرًا (حسب السعر المسجّل): ${n}.`,
    verdictMileage: (n) => `الأقل مسافة مقطوعة: ${n}.`,
    contactIntro: 'يمكنك التواصل مع المعرض كما يلي:',
    contactPhone: (p) => `هاتف الإدارة: ${p}`,
    contactWhatsapp: (p) => `واتساب: ${p}`,
    contactEmail: (e) => `البريد الإلكتروني: ${e}`,
    contactForm: 'ويمكنك أيضًا إرسال استفسار عبر النموذج في قسم التواصل في هذا الموقع.',
    contactFormOnly: 'يمكنك التواصل مع المعرض بإرسال استفسار عبر النموذج في قسم التواصل في هذا الموقع.',
    statusList: (st, n) => `السيارات المصنّفة حاليًا ${st === 'sold' ? 'مباعة' : 'محجوزة'} (${n}):`,
    phoneNotConfigured: 'لم يتم إعداد رقم الهاتف الرسمي للمعرض في هذا الموقع بعد، لذلك لا أستطيع تزويدك برقم.',
    soldNoteOne: (n) => `ملاحظة: ${n} تم بيعها.`,
    more: (n) => `…و${n} أخرى.`,
  },
}
