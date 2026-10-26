import type { CSSProperties } from 'react'
import { between, makeRandom } from '../lib/random'

interface TapeStripProps {
  seed: string
  /** Length of the strip, any CSS length. */
  length?: string
  rotate?: number
  idle?: boolean
  style?: CSSProperties
}

/** Semi-transparent masking tape. Lifts very slightly on a long loop. */
export function TapeStrip({ seed, length = '9rem', rotate, idle = true, style }: TapeStripProps) {
  const random = makeRandom(`${seed}:tape`)
  const tilt = rotate ?? between(random, -14, 14)
  return (
    <span
      aria-hidden="true"
      className={['tape', idle ? 'idle-tape' : ''].filter(Boolean).join(' ')}
      style={{
        width: length,
        ['--tape-rotate' as string]: `${tilt}deg`,
        ['--idle-duration' as string]: `${between(random, 7, 13).toFixed(1)}s`,
        transform: `rotate(${tilt}deg)`,
        ...style,
      }}
    />
  )
}
