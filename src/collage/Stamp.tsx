import type { CSSProperties } from 'react'
import { between, makeRandom } from '../lib/random'

interface StampProps {
  children: string
  /** A rubber stamp gets a cobalt box; a typewriter label does not. */
  variant?: 'typewriter' | 'rubber'
  seed?: string
  rotate?: number
  className?: string
  style?: CSSProperties
}

export function Stamp({ children, variant = 'typewriter', seed, rotate, className, style }: StampProps) {
  const tilt = rotate ?? (seed ? between(makeRandom(`${seed}:stamp`), -4, 4) : 0)
  return (
    <span
      className={[variant === 'rubber' ? 'stamp stamp--rubber' : 'stamp', className]
        .filter(Boolean)
        .join(' ')}
      style={{ transform: `rotate(${tilt}deg)`, ...style }}
    >
      {children}
    </span>
  )
}
