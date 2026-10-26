import { useEffect, useState } from 'react'

/** Ticks once a second, for the elapsed and per-section timers. */
export function useClock(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatSigned(ms: number): string {
  const sign = ms < 0 ? '-' : '+'
  return sign + formatClock(Math.abs(ms))
}
