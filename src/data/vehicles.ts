/**
 * COBRA MOTORS — central vehicle inventory.
 * Every vehicle shown on the site (cards, details pages, assistant answers,
 * "vehicles available" statistic) is read from this one file.
 *
 * To add a vehicle:   copy an entry, give it a new unique `id`, edit the values.
 * To remove one:      delete its entry.
 * To change status:   set `status` to 'available' | 'reserved' | 'sold'.
 * Images:             put files in public/images/cars/<id>/ and list their paths in `images`
 *                     (first image is used on the card). Current images are TEMPORARY placeholders.
 * All prices / specs below are demonstration samples, not real listings.
 */

export type Availability = 'available' | 'reserved' | 'sold'
export type Fuel = 'petrol' | 'diesel' | 'hybrid' | 'electric'
export type Drivetrain = 'awd' | 'rwd' | 'fwd' | '4wd'
export type BodyType = 'coupe' | 'sedan' | 'sportback' | 'suv'
export interface Localized { en: string; ar: string }

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  price: number            // sample price, in siteConfig.currency
  engine: string
  horsepower: number
  transmission: Localized
  drivetrain: Drivetrain
  fuel: Fuel
  mileage: number          // km
  bodyType: BodyType
  exteriorColor: Localized
  interiorColor: Localized
  description: Localized
  images: string[]
  status: Availability
  /** Extra words the COBRA Assistant should recognise for this model (English + Arabic). */
  aliases?: string[]
}

const img = (id: string) => [1, 2, 3].map((n) => `images/cars/${id}/${n}.jpg`)

export const vehicles: Vehicle[] = [
  {
    id: 'bmw-m4-competition',
    make: 'BMW',
    model: 'M4 Competition xDrive',
    year: 2023,
    price: 79500,
    engine: '3.0L Twin-Turbo Inline-6',
    horsepower: 503,
    transmission: { en: '8-speed automatic', ar: 'أوتوماتيك 8 سرعات' },
    drivetrain: 'awd',
    fuel: 'petrol',
    mileage: 12400,
    bodyType: 'coupe',
    exteriorColor: { en: 'Black Sapphire', ar: 'أسود سافاير' },
    interiorColor: { en: 'Black leather with red stitching', ar: 'جلد أسود بخياطة حمراء' },
    description: {
      en: 'A track-bred coupe that remains entirely at ease in daily use. The M4 Competition pairs a razor-sharp chassis with a flexible twin-turbo straight-six and the traction of xDrive, in a specification that is complete without being excessive.',
      ar: 'كوبيه وُلدت في أجواء السباقات لكنها تبقى مريحة تمامًا في الاستخدام اليومي. تجمع M4 Competition بين هيكل دقيق للغاية ومحرك سداسي بتوربينين مرن وثبات نظام xDrive، بتجهيزات متكاملة دون مبالغة.',
    },
    images: img('bmw-m4-competition'),
    status: 'available',
    aliases: ['m4', 'm4 competition', 'ام 4', 'ام4', 'ام فور'],
  },
  {
    id: 'mercedes-s580',
    make: 'Mercedes-Benz',
    model: 'S 580 4MATIC',
    year: 2022,
    price: 118000,
    engine: '4.0L V8 Biturbo + 48V mild hybrid',
    horsepower: 496,
    transmission: { en: '9G-TRONIC automatic', ar: 'أوتوماتيك 9G-TRONIC' },
    drivetrain: 'awd',
    fuel: 'hybrid',
    mileage: 21500,
    bodyType: 'sedan',
    exteriorColor: { en: 'Selenite Grey', ar: 'رمادي سيلينايت' },
    interiorColor: { en: 'Macchiato beige Nappa leather', ar: 'جلد نابا بيج ماكياتو' },
    description: {
      en: 'The benchmark for quiet, effortless travel. This S 580 combines a smooth V8 with air suspension, rear-axle steering and a rear cabin designed for those who prefer to be driven.',
      ar: 'المرجع في الهدوء والراحة. تجمع S 580 بين محرك V8 سلس ونظام تعليق هوائي وتوجيه للمحور الخلفي ومقصورة خلفية صُممت لمن يفضّل أن يُقاد به.',
    },
    images: img('mercedes-s580'),
    status: 'available',
    aliases: ['s580', 's 580', 's class', 's-class', 'اس كلاس', 'اس 580', 'الفئة اس', 'اس ٥٨٠'],
  },
  {
    id: 'audi-rs7-sportback',
    make: 'Audi',
    model: 'RS 7 Sportback',
    year: 2022,
    price: 104900,
    engine: '4.0L V8 TFSI',
    horsepower: 591,
    transmission: { en: '8-speed Tiptronic', ar: 'تيبترونيك 8 سرعات' },
    drivetrain: 'awd',
    fuel: 'petrol',
    mileage: 21800,
    bodyType: 'sportback',
    exteriorColor: { en: 'Nardo Grey', ar: 'رمادي نارديو' },
    interiorColor: { en: 'Black Valcona leather', ar: 'جلد فالكونا أسود' },
    description: {
      en: 'Four doors, a generous hatch and a twin-turbo V8 that delivers its power with composure. The RS 7 is the practical answer to anyone who refuses to choose between space and speed.',
      ar: 'أربعة أبواب وصندوق واسع ومحرك V8 بتوربينين يقدّم قوته بثبات. RS 7 هي الإجابة العملية لمن يرفض الاختيار بين المساحة والسرعة.',
    },
    images: img('audi-rs7-sportback'),
    status: 'available',
    aliases: ['rs7', 'rs 7', 'a7', 'ار اس 7', 'ار اس7', 'ار اس سبعة'],
  },
  {
    id: 'porsche-911-carrera-s',
    make: 'Porsche',
    model: '911 Carrera S',
    year: 2023,
    price: 139000,
    engine: '3.0L Twin-Turbo Flat-6',
    horsepower: 443,
    transmission: { en: '8-speed PDK', ar: 'PDK بـ 8 سرعات' },
    drivetrain: 'rwd',
    fuel: 'petrol',
    mileage: 8900,
    bodyType: 'coupe',
    exteriorColor: { en: 'Agate Grey', ar: 'رمادي عقيقي' },
    interiorColor: { en: 'Black leather', ar: 'جلد أسود' },
    description: {
      en: 'The 911 in its most balanced form: rear-engined, rear-driven and endlessly communicative. Low mileage, full service history and the Sport Chrono package.',
      ar: 'الـ 911 في أكثر صورها توازنًا: محرك خلفي ودفع خلفي وتفاعل لا ينتهي مع السائق. مسافة قصيرة وسجل صيانة كامل وحزمة Sport Chrono.',
    },
    images: img('porsche-911-carrera-s'),
    status: 'reserved',
    aliases: ['911', 'carrera', 'carrera s', '911 carrera', 'كاريرا', 'بورش 911', 'تسعمية واحد عشر'],
  },
  {
    id: 'range-rover-autobiography',
    make: 'Range Rover',
    model: 'Autobiography P440',
    year: 2023,
    price: 159000,
    engine: '3.0L Turbo Inline-6 + 48V mild hybrid',
    horsepower: 395,
    transmission: { en: '8-speed automatic', ar: 'أوتوماتيك 8 سرعات' },
    drivetrain: 'awd',
    fuel: 'hybrid',
    mileage: 15600,
    bodyType: 'suv',
    exteriorColor: { en: 'Santorini Black', ar: 'أسود سانتوريني' },
    interiorColor: { en: 'Ivory and Ebony semi-aniline leather', ar: 'جلد نصف أنيلين عاجي وأبنوسي' },
    description: {
      en: 'Presence, refinement and genuine capability. The Autobiography adds executive rear seating, a Meridian audio system and a level of finish that sets the standard for large luxury SUVs.',
      ar: 'حضور ورقيّ وقدرات حقيقية. تضيف Autobiography مقاعد خلفية تنفيذية ونظام صوت Meridian ومستوى تشطيب يضع المعيار للسيارات الفاخرة الكبيرة.',
    },
    images: img('range-rover-autobiography'),
    status: 'available',
    aliases: ['autobiography', 'p440', 'اوتوبايوجرافي', 'رينج', 'رنج'],
  },
  {
    id: 'lexus-lc-500',
    make: 'Lexus',
    model: 'LC 500',
    year: 2021,
    price: 86500,
    engine: '5.0L Naturally Aspirated V8',
    horsepower: 471,
    transmission: { en: '10-speed Direct-Shift', ar: 'Direct-Shift بـ 10 سرعات' },
    drivetrain: 'rwd',
    fuel: 'petrol',
    mileage: 19300,
    bodyType: 'coupe',
    exteriorColor: { en: 'Eminent White', ar: 'أبيض لؤلؤي' },
    interiorColor: { en: 'Rioja red semi-aniline leather', ar: 'جلد نصف أنيلين أحمر ريوخا' },
    description: {
      en: 'A grand tourer with one of the last great naturally aspirated V8s and a cabin crafted with remarkable care. This example has been sold.',
      ar: 'سيارة جراند توريسمو بأحد آخر محركات V8 العظيمة بدون شاحن، ومقصورة صُنعت بعناية لافتة. تم بيع هذه السيارة.',
    },
    images: img('lexus-lc-500'),
    status: 'sold',
    aliases: ['lc500', 'lc 500', 'ال سي 500', 'ال سي500'],
  },
  {
    id: 'toyota-land-cruiser-gr',
    make: 'Toyota',
    model: 'Land Cruiser GR Sport',
    year: 2023,
    price: 92000,
    engine: '3.5L Twin-Turbo V6',
    horsepower: 409,
    transmission: { en: '10-speed automatic', ar: 'أوتوماتيك 10 سرعات' },
    drivetrain: '4wd',
    fuel: 'petrol',
    mileage: 18700,
    bodyType: 'suv',
    exteriorColor: { en: 'Pearl White', ar: 'أبيض لؤلؤي' },
    interiorColor: { en: 'Black leather', ar: 'جلد أسود' },
    description: {
      en: 'Legendary durability in a more refined, more powerful package. The GR Sport adds sharper styling, a multi-terrain system and a cabin that feels at home on both city streets and desert tracks.',
      ar: 'متانة أسطورية في تجربة أكثر رقيًا وقوة. تضيف GR Sport تصميمًا أكثر حدة ونظام تضاريس متعدد ومقصورة تناسب شوارع المدينة والمسارات الصحراوية معًا.',
    },
    images: img('toyota-land-cruiser-gr'),
    status: 'available',
    aliases: ['land cruiser', 'landcruiser', 'lc300', 'lc 300', 'gr sport', 'لاند كروزر', 'لاندكروزر', 'كروزر', 'جي ار سبورت'],
  },
  {
    id: 'cadillac-escalade',
    make: 'Cadillac',
    model: 'Escalade Platinum',
    year: 2023,
    price: 98500,
    engine: '6.2L V8',
    horsepower: 420,
    transmission: { en: '10-speed automatic', ar: 'أوتوماتيك 10 سرعات' },
    drivetrain: '4wd',
    fuel: 'petrol',
    mileage: 11200,
    bodyType: 'suv',
    exteriorColor: { en: 'Black Raven', ar: 'أسود ريفن' },
    interiorColor: { en: 'Jet Black with Sky Cool Grey accents', ar: 'أسود مع لمسات رمادية' },
    description: {
      en: 'Three rows of genuine space, a curved OLED display and an AKG studio audio system. The Escalade Platinum is the most complete expression of American full-size luxury.',
      ar: 'ثلاثة صفوف بمساحة حقيقية وشاشة OLED منحنية ونظام صوت AKG استوديو. تمثل Escalade Platinum أكمل صور الفخامة الأمريكية كبيرة الحجم.',
    },
    images: img('cadillac-escalade'),
    status: 'available',
    aliases: ['escalade', 'platinum', 'اسكاليد', 'إسكاليد', 'سكاليد'],
  },
]

export const getVehicle = (id: string) => vehicles.find((v) => v.id === id)
export const vehicleName = (v: Vehicle) => `${v.make} ${v.model}`
export const makes = Array.from(new Set(vehicles.map((v) => v.make)))
export const availableCount = () => vehicles.filter((v) => v.status === 'available').length
