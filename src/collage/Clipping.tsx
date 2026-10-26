import type { CSSProperties } from 'react'
import { tornPolygon } from './tear'
import { between, makeRandom } from '../lib/random'

interface ClippingProps {
  seed: string
  kicker?: string
  headline?: string
  /** Body copy, set as a justified newspaper column. */
  body: string
  columns?: 1 | 2
  rotate?: number
  idle?: boolean
  style?: CSSProperties
}

/** A column cut out of a newspaper: small serif type on yellowed stock. */
export function Clipping({
  seed,
  kicker,
  headline,
  body,
  columns = 2,
  rotate,
  idle = true,
  style,
}: ClippingProps) {
  const random = makeRandom(`${seed}:clip`)
  const tilt = rotate ?? between(random, -4, 4)
  return (
    <aside
      className={['clipping', columns === 1 ? 'clipping--single' : '', idle ? 'idle-drift' : '']
        .filter(Boolean)
        .join(' ')}
      style={{
        rotate: `${tilt}deg`,
        clipPath: tornPolygon(`${seed}:clip-edge`, 'scissor', {
          edges: { left: false, right: false },
        }),
        ['--drift-x' as string]: `${between(random, -5, 5).toFixed(1)}px`,
        ['--drift-y' as string]: `${between(random, -4, 4).toFixed(1)}px`,
        ['--idle-duration' as string]: `${between(random, 18, 28).toFixed(1)}s`,
        ...style,
      }}
    >
      {kicker ? <p className="clipping__kicker">{kicker}</p> : null}
      <div className="clipping__rule" aria-hidden="true" />
      {headline ? <h2 className="clipping__head">{headline}</h2> : null}
      <p className="clipping__body">{body}</p>
    </aside>
  )
}
