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
      initial={{ opacity: 0, y: -54, scale: 1.07, rotate: from, filter: 'blur(1.5px)' }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: settle,
        filter: 'blur(0px)',
        boxShadow: [
          '0 2.5rem 3.5rem -1rem rgba(20,18,16,0.45)',
          '0 0.5rem 1.1rem -0.5rem rgba(20,18,16,0.38)',
        ],
      }}
      transition={{
        type: 'spring',
        stiffness: 180,
        damping: 15,
        mass: 0.9,
        delay,
        boxShadow: { duration: 0.45, delay: delay + 0.12 },
        filter: { duration: 0.3, delay },
      }}
    >
      {children}
    </motion.div>
  )
}
