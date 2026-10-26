import { useState, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { tornPolygon, type EdgeStyle } from './tear'
import { between, makeRandom } from '../lib/random'
import { asset } from '../lib/asset'

interface PhotoCutoutProps {
  /** A file in /public/images. Falls back to a labelled placeholder. */
  src?: string
  alt: string
  /** Seed for the tear and the rotation; use the section or piece id. */
  seed: string
  edge?: EdgeStyle
  tone?: 'sepia' | 'grayscale'
  halftone?: boolean
  /** Degrees; clamped to the brief's -6 to +6. */
  rotate?: number
  /** Shared-element id, so the same photograph morphs between sections. */
  morphId?: string
  idle?: boolean
  style?: CSSProperties
  className?: string
  children?: ReactNode
}

export function PhotoCutout({
  src,
  alt,
  seed,
  edge = 'torn',
  tone = 'sepia',
  halftone = false,
  rotate,
  morphId,
  idle = true,
  style,
  className,
  children,
}: PhotoCutoutProps) {
  // A photograph that is missing, or that the dev server answers with an HTML
  // fallback, must not leave a broken-image icon on a screen in front of 150
  // people: fall back to the labelled placeholder instead.
  const [failed, setFailed] = useState(false)
  const random = makeRandom(`${seed}:photo`)
  const tilt = rotate ?? between(random, -6, 6)
  const driftX = `${between(random, -7, 7).toFixed(1)}px`
  const driftY = `${between(random, -6, 6).toFixed(1)}px`
  const duration = `${between(random, 16, 26).toFixed(1)}s`

  return (
    <motion.figure
      layoutId={morphId}
      className={['cutout', tone === 'grayscale' ? 'cutout--grayscale' : '', idle ? 'idle-drift' : '', className]
        .filter(Boolean)
        .join(' ')}
      style={{
        margin: 0,
        rotate: tilt,
        clipPath: tornPolygon(`${seed}:edge`, edge),
        ['--drift-x' as string]: driftX,
        ['--drift-y' as string]: driftY,
        ['--idle-duration' as string]: duration,
        ...style,
      }}
    >
      {src && !failed ? (
        <img
          className="cutout__img"
          src={asset(src)}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="cutout__missing" role="img" aria-label={alt}>
          <span>photograph</span>
          <span style={{ opacity: 0.75 }}>{alt}</span>
        </div>
      )}
      {halftone ? <div className="cutout__halftone" aria-hidden="true" /> : null}
      {children}
    </motion.figure>
  )
}
