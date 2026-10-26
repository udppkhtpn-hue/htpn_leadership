import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'motion/react'
import { between, makeRandom } from '../lib/random'
import { useReducedEffects } from './effects'

interface DropProps {
  seed: string
  children: ReactNode
  /** Seconds before this piece lands. Stagger pieces to assemble a collage. */
  delay?: number
  /** Final rotation; the piece overshoots it and settles. */
  rotate?: number
  style?: CSSProperties
  className?: string
}

/**
 * A piece dropped onto the poster: it falls in slightly oversized and
 * over-rotated, settles on a spring, and its shadow tightens as it lands.
 */
export function Drop({ seed, children, delay = 0, rotate, style, className }: DropProps) {
  const reduced = useReducedEffects()
  const random = makeRandom(`${seed}:drop`)
  const settle = rotate ?? between(random, -3, 3)
  const from = settle + between(random, -7, 7)

  if (reduced) {
    return (
      <div className={className} style={{ rotate: `${settle}deg`, ...style }}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      style={style}
      // Transform and opacity only: a blur or box-shadow keyframe would drop the
      // projector laptop off the compositor for the whole arrival.
      initial={{ opacity: 0, y: -54, scale: 1.07, rotate: from }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: settle }}
      transition={{ type: 'spring', stiffness: 180, damping: 15, mass: 0.9, delay }}
    >
      {children}
    </motion.div>
  )
}
