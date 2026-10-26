import type { CSSProperties } from 'react'
import { motion } from 'motion/react'

export type DrawingName = 'hand' | 'stethoscope' | 'lamp' | 'window' | 'circle-of-figures'

/** Minimalist single-line illustrations, drawn in one continuous stroke where
 *  the subject allows it. 100x100 viewBox, stroke colour from currentColor. */
const PATHS: Record<DrawingName, string[]> = {
  hand: [
    'M30 96 C 28 78, 26 70, 24 60 C 21 47, 23 40, 29 40 C 34 40, 36 46, 37 53',
    'M37 53 C 36 40, 35 24, 36 16 C 37 9, 45 8, 46 16 C 47 25, 47 40, 47 52',
    'M47 52 C 48 38, 49 20, 51 13 C 53 6, 61 7, 61 15 C 61 26, 60 41, 59 53',
    'M59 53 C 61 42, 63 28, 66 22 C 69 15, 76 18, 75 26 C 73 38, 71 48, 70 57',
    'M70 57 C 73 52, 78 46, 82 46 C 87 46, 88 53, 84 60 C 78 71, 72 82, 68 96',
    'M30 96 C 40 94, 58 94, 68 96',
  ],
  stethoscope: [
    'M24 14 C 24 44, 32 58, 46 58 C 60 58, 68 44, 68 14',
    'M20 12 C 22 9, 26 9, 28 12',
    'M64 12 C 66 9, 70 9, 72 12',
    'M46 58 C 46 70, 50 78, 62 80',
    'M62 80 m -10 0 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0',
    'M72 72 C 80 70, 86 74, 86 80',
  ],
  lamp: [
    'M50 6 L 50 24',
    'M22 52 C 22 36, 34 24, 50 24 C 66 24, 78 36, 78 52 Z',
    'M22 52 L 78 52',
    'M50 52 L 50 62',
    'M50 62 m -7 0 a 7 7 0 1 0 14 0 a 7 7 0 1 0 -14 0',
    'M30 74 L 24 86',
    'M50 76 L 50 90',
    'M70 74 L 76 86',
  ],
  window: [
    'M22 94 L 22 36 C 22 18, 34 8, 50 8 C 66 8, 78 18, 78 36 L 78 94',
    'M22 94 L 78 94',
    'M50 8 L 50 94',
    'M22 46 L 78 46',
    'M22 70 L 78 70',
  ],
  'circle-of-figures': [
    'M50 18 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0',
    'M78 34 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0',
    'M78 66 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0',
    'M50 82 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0',
    'M22 66 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0',
    'M22 34 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0',
    'M50 50 m -32 0 a 32 32 0 1 0 64 0 a 32 32 0 1 0 -64 0',
  ],
}

interface LineDrawingProps {
  name: DrawingName
  size?: string
  /** Animate the stroke on, once, as part of a section's arrival. */
  draw?: boolean
  delay?: number
  tone?: 'ink' | 'cobalt'
  style?: CSSProperties
  title?: string
}

export function LineDrawing({
  name,
  size = '12rem',
  draw = false,
  delay = 0,
  tone = 'ink',
  style,
  title,
}: LineDrawingProps) {
  const strokes = PATHS[name]
  return (
    <span
      className="line-drawing"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      aria-label={title}
      style={{
        width: size,
        height: size,
        color: tone === 'cobalt' ? 'var(--color-cobalt)' : 'var(--color-ink)',
        ...style,
      }}
    >
      <svg viewBox="0 0 100 100">
        {strokes.map((d, index) =>
          draw ? (
            <motion.path
              key={d}
              d={d}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: delay + index * 0.18, ease: 'easeInOut' }}
            />
          ) : (
            <path key={d} d={d} />
          ),
        )}
      </svg>
    </span>
  )
}
