import { useState } from 'react'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const sameDay = (a, b) => !!a && !!b && a.getTime() === b.getTime()

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

  return (
    <div className="absolute bottom-full left-0 z-30 mb-3 w-full rounded-2xl border border-white/30 bg-[#5f7f9f]/70 p-5 text-white shadow-xl backdrop-blur-xl sm:w-[330px]">
      <div className="flex items-center justify-between text-[13px]">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="px-2 disabled:opacity-30"
        >
          ←
        </button>
        <span>{view.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}</span>
        <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month" className="px-2">
          →
        </button>
      </div>

      <div className="mt-5 grid grid-cols-7 text-center text-[11px] text-white/60">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-2">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-[13px]">
        {cells.map((day) => {
          const inMonth = day.getMonth() === view.getMonth()
          const disabled = !inMonth || day < today
          const selected = sameDay(day, start) || sameDay(day, end)
          const inRange = start && end && day > start && day < end

          let style = 'hover:bg-white/20'
          if (disabled) style = 'cursor-default text-white/30'
          else if (selected) style = 'bg-white font-semibold text-slate-800'
          else if (inRange) style = 'bg-white/25'

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => pick(day)}
              className={`h-9 transition-colors ${style}`}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onConfirm}
        disabled={!start}
        className="mt-4 flex w-full items-center justify-between border-t border-white/30 pt-4 text-[11px] font-medium uppercase tracking-[0.18em] disabled:opacity-40"
      >
        Confirm <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}