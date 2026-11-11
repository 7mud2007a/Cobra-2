import { useCallback, useRef, useState } from 'react'
import { useLang } from '../i18n'
import { asset, cx } from '../lib/format'
import { BackIcon, ChevronIcon } from './ui/Icons'

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const { t, dir, fmt } = useLang()
  const [i, setI] = useState(0)
  const startX = useRef<number | null>(null)
  const go = useCallback((d: number) => setI((x) => (x + d + images.length) % images.length), [images.length])

  const onKey = (e: React.KeyboardEvent) => {
    // arrow keys follow the visual direction, so they are mirrored in RTL
    const visual = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (visual) { e.preventDefault(); go(dir === 'rtl' ? -visual : visual) }
  }
  const onUp = (e: React.PointerEvent) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > 48) go((dir === 'rtl' ? dx > 0 : dx < 0) ? 1 : -1)
  }

  return (
    <div className="gallery" role="region" aria-roledescription="carousel" aria-label={t.a11y.gallery} tabIndex={0} onKeyDown={onKey}>
      <div className="gallery__stage" onPointerDown={(e) => { startX.current = e.clientX }} onPointerUp={onUp} onPointerCancel={() => { startX.current = null }}>
        {images.map((src, n) => (
          <img
            key={src}
            className={cx('gallery__slide', n === i && 'is-active')}
            src={asset(src)}
            alt={fmt(t.details.imageAlt, { name, n: n + 1 })}
            width={1600}
            height={1000}
            loading={n === 0 ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            aria-hidden={n !== i}
          />
        ))}
        {images.length > 1 && (
          <>
            <button type="button" className="gallery__nav gallery__nav--prev" onClick={() => go(-1)} aria-label={t.a11y.prev}><BackIcon /></button>
            <button type="button" className="gallery__nav gallery__nav--next" onClick={() => go(1)} aria-label={t.a11y.next}><ChevronIcon /></button>
            <p className="gallery__count" aria-live="polite"><bdi>{fmt(t.details.counter, { n: i + 1, total: images.length })}</bdi></p>
          </>
        )}
      </div>
      {images.length > 1 && (
        <ul className="gallery__thumbs">
          {images.map((src, n) => (
            <li key={src}>
              <button type="button" className={cx('gallery__thumb', n === i && 'is-active')} onClick={() => setI(n)} aria-label={fmt(t.a11y.showImage, { n: n + 1 })} aria-current={n === i}>
                <img src={asset(src)} alt="" width={240} height={150} loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
