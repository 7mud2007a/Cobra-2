/**
 * COBRA MOTORS — site-wide configuration (all values are editable placeholders).
 * Nothing here is verified company information.
 */
export const siteConfig = {
  brand: 'COBRA MOTORS',

  /** When true, forms and the assistant tell visitors they are running in demonstration mode. */
  demoMode: true,

  currency: { symbol: '$', code: 'USD' },

  /**
   * Leave a value empty ('') until the real one is available.
   * Empty values are never displayed and the assistant will never invent them.
   */
  contact: {
    phone: '' as string, // official management phone, e.g. '+000 000 0000' — the assistant shares it only once set
    whatsapp: '' as string, // number in international format, digits only
    email: '' as string,
    address: { en: '' as string, ar: '' as string },
    hours: { en: '' as string, ar: '' as string },
  },

  /** Placeholder links point to each platform's home page. Replace with the real company accounts. */
  social: {
    instagram: { url: 'https://www.instagram.com/' },
    facebook: { url: 'https://www.facebook.com/' },
    whatsapp: { url: 'https://wa.me/' },
    tiktok: { url: 'https://www.tiktok.com/' },
  },

  /** About-section statistics — demonstration placeholders. "Vehicles available" is computed from the inventory. */
  stats: {
    yearsOfExperience: 12,
    vehiclesSold: 850,
    satisfiedCustomers: 1200,
  },

  developer: { name: 'Hamoud', url: 'https://sevenmud-web-y0dt.onrender.com/' },
}

export type SocialKey = keyof typeof siteConfig.social
