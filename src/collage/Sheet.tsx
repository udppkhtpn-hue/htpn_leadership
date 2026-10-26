import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useReducedEffects } from './effects'

/**
 * A section change: the new sheet is laid over the one before it, which stays
 * put underneath rather than sliding away. Native View Transitions handle this
 * where available (see useSheetTransition); this is the Motion fallback.
 */
export function Sheet({ sheetKey, children }: { sheetKey: string; children: ReactNode }) {
  const reduced = useReducedEffects()

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={sheetKey}
        style={{ position: 'absolute', inset: 0 }}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: '3%', scale: 1.015, rotate: 0.4 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.28, delay: 0.1 } }}
        transition={
          reduced
            ? { duration: 0.001 }
            : { type: 'spring', stiffness: 150, damping: 20, mass: 0.85 }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
