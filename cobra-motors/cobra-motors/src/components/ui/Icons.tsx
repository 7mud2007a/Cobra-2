import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa6'
import type { SocialKey } from '../../config/site'

export const SocialIcon = ({ name }: { name: SocialKey }) => {
  const P = { 'aria-hidden': true, focusable: false } as const
  switch (name) {
    case 'instagram': return <FaInstagram {...P} />
    case 'facebook': return <FaFacebookF {...P} />
    case 'whatsapp': return <FaWhatsapp {...P} />
    case 'tiktok': return <FaTiktok {...P} />
  }
}

const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false } as const
export const ChevronIcon = () => <svg {...base} className="icon-dir"><path d="M9 5l7 7-7 7" /></svg>
export const SendIcon = () => <svg {...base} className="icon-dir"><path d="M4 12l16-8-6 16-3-7z" /></svg>
export const CloseIcon = () => <svg {...base}><path d="M6 6l12 12M18 6L6 18" /></svg>
export const BackIcon = () => <svg {...base} className="icon-dir"><path d="M15 5l-7 7 7 7" /></svg>
export const ChatIcon = () => <svg {...base}><path d="M5 5h14v10H10l-5 4z" /></svg>
