import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../lib/nav'

/** Counts from 0 to `target` once `start` becomes true. Jumps straight to the value under reduced motion. */
export function useCountUp(target: number, start: boolean, duration = 1800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    if (prefersReducedMotion()) { setValue(target); return }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 4))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target, duration])
  return value
}
