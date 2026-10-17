import { useEffect, useState } from 'react'
import Container from '../ui/Container'
import testimonials from '../../data/testimonials.json'

const n = testimonials.length
const CARD_H = 180
const GAP = 16
const STEP = CARD_H + GAP
const OFFSET = 48 // how far down the active card sits (leaves a faded sliver of the previous one)
const AUTOPLAY_MS = 4500

// Three copies so the column can loop forever without a visible jump
const loop = [...testimonials, ...testimonials, ...testimonials]

function Stars() {
  return (
    <div className="flex gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 fill-gold" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [pos, setPos] = useState(n) // start in the middle copy
  const [animate, setAnimate] = useState(true)
  const [paused, setPaused] = useState(false)
  const active = pos % n

  // Autoplay: advance one step after each delay, unless the cursor is over the section
  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => setPos((p) => p + 1), AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [pos, paused])

  // After sliding, silently jump back into the middle copy
  const normalize = (e) => {
    if (e.target !== e.currentTarget) return
    if (pos >= 2 * n || pos < n) {
      setAnimate(false)
      setPos((p) => (p >= 2 * n ? p - n : p + n))
    }
  }

  // Turn the slide animation back on after the silent jump
  useEffect(() => {
    if (animate) return
    const id = setTimeout(() => setAnimate(true), 50)
    return () => clearTimeout(id)
  }, [animate])

  return (
    <section
      className="bg-[#f5f5f5] py-14 md:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr_1.15fr] lg:gap-12">
          {/* Heading */}
          <div>
            <h2 className="font-display font-medium tracking-tight text-5xl leading-tight text-ink md:text-[48px]">
              What Our Guests Say
            </h2>
            <p className="mt-5 max-w-[360px] text-[17px] leading-7 text-body">
              Real stays and honest feedback from the guests who have booked with us.
            </p>
          </div>

          {/* Big selected review */}
          <div className="relative h-[460px] overflow-hidden rounded-3xl bg-black">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                aria-hidden={i !== active}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === active ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img src={t.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-7">
                  <p className="text-[18px] font-medium leading-snug md:text-[19px]">{t.quote}</p>
                  <p className="mt-4 text-sm">
                    <span className="font-semibold">{t.name}</span>
                    <span className="ml-2 text-white/70">{t.role}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Auto-scrolling list */}
          <div
            className="relative h-[460px] overflow-hidden"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
              maskImage: 'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
            }}
          >
            <div
              className="flex flex-col"
              style={{
                gap: GAP,
                transform: `translateY(${OFFSET - pos * STEP}px)`,
                transition: animate ? 'transform 700ms ease' : 'none',
              }}
              onTransitionEnd={normalize}
            >
              {loop.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPos(i)}
                  aria-current={i % n === active}
                  style={{ height: CARD_H }}
                  className={`flex w-full shrink-0 flex-col justify-between rounded-2xl bg-white p-6 text-left shadow-sm transition-shadow ${
                    i % n === active ? 'ring-2 ring-gold' : 'hover:shadow-md'
                  }`}
                >
                  <p className="line-clamp-3 text-[15px] leading-6 text-ink">{t.quote}</p>
                  <div>
                    <Stars />
                    <div className="mt-3 flex items-center gap-3">
                      <img src={t.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                      <div>
                        <p className="text-[14px] font-medium text-ink">{t.name}</p>
                        <p className="text-[12px] text-body">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}