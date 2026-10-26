import type { CSSProperties } from 'react'
import { between, makeRandom } from '../lib/random'

interface StampProps {
  children: string
  /** A rubber stamp gets a cobalt box; a typewriter label does not. */
  variant?: 'typewriter' | 'rubber'
  seed?: string
  rotate?: number
  style?: CSSProperties
}

export function Stamp({ children, variant = 'typewriter', seed, rotate, style }: StampProps) {
  const tilt = rotate ?? (seed ? between(makeRandom(`${seed}:stamp`), -4, 4) : 0)
  return (
    <span
      className={variant === 'rubber' ? 'stamp stamp--rubber' : 'stamp'}
      style={{ transform: `rotate(${tilt}deg)`, ...style }}
    >
      {children}
    </span>
  )
}
