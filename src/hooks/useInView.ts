import { useEffect, useRef, useState } from 'react'

/** True once the element has entered the viewport (observer disconnects afterwards). */
export function useInView<T extends HTMLElement>(margin = '0px 0px -8% 0px') {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { setSeen(true); return }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } },
      { rootMargin: margin, threshold: 0.06 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return [ref, seen] as const
}
