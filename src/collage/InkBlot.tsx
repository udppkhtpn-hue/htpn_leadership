import type { CSSProperties } from 'react'
import { blotPath } from './tear'
import { between, makeRandom } from '../lib/random'

interface InkBlotProps {
  seed: string
  size?: string
  opacity?: number
  /** A watercolour bleed adds a soft second pass around the core. */
  bleed?: boolean
  idle?: boolean
  style?: CSSProperties
}

/** Cobalt watercolour blot, multiplied into the paper. */
export function InkBlot({ seed, size = '14rem', opacity = 0.5, bleed = true, idle = true, style }: InkBlotProps) {
  const random = makeRandom(`${seed}:blot`)
  const core = blotPath(`${seed}:core`, Math.round(between(random, 8, 12)), 32, 0.4)
  const halo = blotPath(`${seed}:halo`, Math.round(between(random, 7, 10)), 42, 0.5)
  return (
    <span
      aria-hidden="true"
      className={['blot', idle ? 'idle-bleed' : ''].filter(Boolean).join(' ')}
      style={{
        width: size,
        height: size,
        ['--blot-opacity' as string]: opacity,
        ['--idle-duration' as string]: `${between(random, 12, 20).toFixed(1)}s`,
        opacity,
        ...style,
      }}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {bleed ? <path d={halo} fill="currentColor" opacity={0.28} /> : null}
        <path d={core} fill="currentColor" />
      </svg>
    </span>
  )
}
