import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useReducedEffects } from './effects'

/**
 * The close: pieces lift off the poster one by one, until only cream paper,
 * one cobalt blot and the last line are left.
 */
export function PeelAway({
  peeled,
  index,
  children,
}: {
  peeled: boolean
  /** Order in the peel; earlier pieces leave first. */
  index: number
  children: ReactNode
}) {
  const reduced = useReducedEffects()
  return (
    <motion.div
      animate={
        peeled
          ? reduced
            ? { opacity: 0 }
            : { opacity: 0, y: -140, rotate: index % 2 ? 14 : -11, scale: 1.08 }
          : { opacity: 1, y: 0, rotate: 0, scale: 1 }
      }
      transition={
        reduced
          ? { duration: 0.001 }
          : { duration: 0.7, delay: peeled ? index * 0.16 : 0, ease: [0.2, 0.7, 0.3, 1] }
      }
      style={{ position: 'absolute', inset: 0 }}
    >
      {children}
    </motion.div>
  )
}
