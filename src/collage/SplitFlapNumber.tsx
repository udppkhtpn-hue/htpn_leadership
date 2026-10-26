import { useEffect, useRef, useState } from 'react'
import { useReducedEffects } from './effects'

const GLYPHS = '0123456789'

/**
 * A figure arriving the way a split-flap board or a typewriter would: each
 * character cycles for a moment, then locks, left to right. Works for plain
 * counts ("1889"), percentages ("62%") and correlations ("+.54").
 */
export function SplitFlapNumber({
  value,
  delay = 0,
  className,
  style,
}: {
  value: string
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  const reduced = useReducedEffects()
  const [shown, setShown] = useState(() => (reduced ? value : value.replace(/[0-9]/g, '0')))
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (reduced) {
      setShown(value)
      return
    }
    const chars = value.split('')
    const locked = chars.map((c) => (/[0-9]/.test(c) ? null : c))
    setShown(chars.map((c) => (/[0-9]/.test(c) ? '0' : c)).join(''))

    const render = () =>
      setShown(
        locked.map((c) => (c === null ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : c)).join(''),
      )

    const spin = window.setInterval(render, 55)
    timers.current.push(spin)

    chars.forEach((char, index) => {
      if (!/[0-9]/.test(char)) return
      const lock = window.setTimeout(
        () => {
          locked[index] = char
          render()
          if (locked.every((c) => c !== null)) window.clearInterval(spin)
        },
        (delay + 0.35 + index * 0.16) * 1000,
      )
      timers.current.push(lock)
    })

    const current = timers.current
    return () => {
      current.forEach((id) => {
        window.clearTimeout(id)
        window.clearInterval(id)
      })
      current.length = 0
    }
  }, [value, delay, reduced])

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {shown}
    </span>
  )
}
