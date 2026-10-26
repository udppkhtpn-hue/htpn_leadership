import { motion } from 'motion/react'
import { TapeStrip } from '../../collage'
import { between, makeRandom } from '../../lib/random'
import { useReducedEffects } from '../../collage'

export interface BoardNote {
  id: string
  text: string
  column: 'drains' | 'energises'
  starred?: boolean
}

/** An approved note fluttering onto the board, taped down as it lands. */
export function Note({ note, index = 0 }: { note: BoardNote; index?: number }) {
  const reduced = useReducedEffects()
  const random = makeRandom(note.id)
  const tilt = between(random, -3.5, 3.5)

  return (
    <motion.li
      layout={!reduced}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -40, rotate: tilt - 9 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      transition={
        reduced
          ? { duration: 0.001 }
          : { type: 'spring', stiffness: 170, damping: 14, delay: index * 0.06 }
      }
      style={{
        position: 'relative',
        listStyle: 'none',
        background:
          note.column === 'drains'
            ? 'color-mix(in srgb, var(--color-sepia-light) 42%, #fff)'
            : 'color-mix(in srgb, #fff 78%, var(--color-cream))',
        padding: note.starred ? '1.1rem 1.2rem' : '0.75rem 0.9rem',
        boxShadow: '0.2rem 0.25rem 0 color-mix(in srgb, var(--color-ink) 16%, transparent)',
        fontFamily: 'var(--font-body)',
        fontSize: note.starred ? 'var(--text-lead)' : '1.05rem',
        lineHeight: 1.35,
        maxWidth: note.starred ? '34ch' : '30ch',
      }}
    >
      <TapeStrip seed={`${note.id}:pin`} length="3.4rem" style={{ top: '-0.9rem', left: '0.9rem' }} />
      {note.text}
    </motion.li>
  )
}

export const SAMPLE_NOTES: BoardNote[] = [
  { id: 'n1', text: 'Being blamed for something I was never told about.', column: 'drains', starred: true },
  { id: 'n2', text: 'Ward round at 7, clinic at 8, nobody handed over.', column: 'drains' },
  { id: 'n3', text: 'A specialist who answers the phone at 3am.', column: 'energises', starred: true },
  { id: 'n4', text: 'Seeing a patient I admitted walk out well.', column: 'energises' },
]
