import { useCallback, useEffect, useState } from 'react'

const MAX_TILES = 5 // 1 large + 4 small

export default function Gallery({ images, title }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const total = images.length

  const openAt = (i) => {
    setIndex(i)
    setOpen(true)
  }
  const close = () => setOpen(false)
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total])

  // Keyboard controls + stop the page scrolling behind the viewer
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, prev, next])

  const tiles = images.slice(0, MAX_TILES)
  const extra = total - MAX_TILES

  const round = 'flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25'

  return (
    <>
      <div className="grid h-[320px] grid-cols-4 grid-rows-2 gap-2 sm:h-[420px] md:h-[540px] md:gap-3">
        {tiles.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => openAt(i)}
            aria-label={`Open photo ${i + 1} of ${total}`}
            className={`group relative overflow-hidden bg-gray-100 ${
              i === 0 ? 'col-span-4 row-span-2 md:col-span-2' : 'hidden md:block'
            }`}
          >
            <img
              src={src}
              alt={i === 0 ? title : ''}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </button>
        ))}

        {/* "+N photos" button */}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="absolute"
          hidden
        />
      </div>

      {total > 1 && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => openAt(0)}
            className="border border-navy px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-navy transition-colors hover:bg-navy hover:text-white"
          >
            View all {total} photos
          </button>
        </div>
      )}

      {/* Full-screen viewer */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photos`}
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          onClick={close}
        >
          <div className="flex items-center justify-between px-5 py-4 text-white" onClick={(e) => e.stopPropagation()}>
            <span className="text-[13px] tracking-[0.15em]">
              {index + 1} / {total}
            </span>
            <button type="button" onClick={close} aria-label="Close" className={round}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-8 md:px-20">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Previous photo"
              className={`${round} absolute left-3 z-10 md:left-6`}
            >
              ←
            </button>
            <img
              src={images[index]}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="max-h-[78vh] max-w-full object-contain"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Next photo"
              className={`${round} absolute right-3 z-10 md:right-6`}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}