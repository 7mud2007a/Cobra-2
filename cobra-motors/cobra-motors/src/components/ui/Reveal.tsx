import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'
import { cx } from '../../lib/format'

interface Props { as?: 'div' | 'li' | 'header' | 'article' | 'p'; delay?: number; className?: string; children: ReactNode }

/** Fades content in once, when it first scrolls into view. Disabled by CSS under reduced motion. */
export function Reveal({ as = 'div', delay = 0, className, children }: Props) {
  const [ref, seen] = useInView<HTMLDivElement>()
  const Tag = as as 'div' // the tag is only a semantic choice (e.g. <li>); every option accepts the same props
  return (
    <Tag ref={ref} className={cx('reveal', seen && 'is-in', className)} style={{ '--d': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  )
}
