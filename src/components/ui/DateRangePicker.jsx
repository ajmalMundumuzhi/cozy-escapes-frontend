import { useState } from 'react'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const sameDay = (a, b) => !!a && !!b && a.getTime() === b.getTime()
const short = (d) => d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })

// 6 weeks, Monday first
function buildGrid(year, month) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  return Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - offset + i))
}

export default function DateRangePicker({ start, end, onChange, onConfirm }) {
  const today = startOfDay(new Date())
  const [view, setView] = useState(() => {
    const base = start || today
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const cells = buildGrid(view.getFullYear(), view.getMonth())
  const canGoBack = view > new Date(today.getFullYear(), today.getMonth(), 1)
  const shiftMonth = (n) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1))

  const pick = (day) => {
    if (!start || end || day <= start) onChange(day, null)
    else onChange(start, day)
  }

  const nights = start && end ? Math.round((end - start) / 86400000) : 0
  const hint = !start ? 'Select your check-in date' : !end ? 'Now select your check-out date' : null

  const arrow =
    'flex h-9 w-9 items-center justify-center border border-gold/50 text-ink transition-colors hover:border-gold-deep hover:bg-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-gold/50 disabled:hover:bg-transparent'

  return (
    <div
      role="dialog"
      aria-label="Choose your dates"
      className="absolute bottom-full left-0 z-40 mb-3 w-full border border-gold/50 bg-white p-5 text-ink shadow-2xl ring-1 ring-black/10 sm:w-[340px]"
    >
      {/* Month header */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => shiftMonth(-1)} disabled={!canGoBack} aria-label="Previous month" className={arrow}>
          ←
        </button>
        <span className="font-display text-xl font-medium">
          {view.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
        </span>
        <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month" className={arrow}>
          →
        </button>
      </div>

      {/* Weekdays */}
      <div className="mt-5 grid grid-cols-7 border-b border-gold/30 pb-2 text-center text-[11px] font-medium uppercase tracking-[0.1em] text-body">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Days */}
      <div className="mt-2 grid grid-cols-7 text-center text-[14px]">
        {cells.map((day) => {
          if (day.getMonth() !== view.getMonth()) {
            return <span key={day.toISOString()} className="h-10" aria-hidden="true" />
          }

          const past = day < today
          const isStart = sameDay(day, start)
          const isEnd = sameDay(day, end)
          const inRange = start && end && day > start && day < end
          const isToday = sameDay(day, today)

          let style = 'text-ink hover:bg-cream'
          if (past) style = 'cursor-not-allowed text-gray-300 line-through'
          else if (isStart || isEnd) style = 'bg-navy font-semibold text-white'
          else if (inRange) style = 'bg-gold/25 text-ink'

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={past}
              onClick={() => pick(day)}
              aria-label={day.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              aria-pressed={isStart || isEnd}
              className={`relative h-10 transition-colors ${style}`}
            >
              {day.getDate()}
              {isToday && !isStart && !isEnd && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-deep" aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-gold/30 pt-4">
        <p className="min-h-[20px] text-[13px] text-body" aria-live="polite">
          {hint ?? (
            <>
              <span className="font-medium text-ink">
                {short(start)} – {short(end)}
              </span>{' '}
              · {nights} {nights === 1 ? 'night' : 'nights'}
            </>
          )}
        </p>

        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange(null, null)}
            disabled={!start}
            className="px-2 py-3 text-[12px] font-medium uppercase tracking-[0.15em] text-body underline underline-offset-4 transition-colors hover:text-ink disabled:no-underline disabled:opacity-40"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!start}
            className="flex-1 bg-gold-deep py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-navy disabled:opacity-40 disabled:hover:bg-gold-deep"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}