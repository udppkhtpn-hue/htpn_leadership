import { AnimatePresence, motion } from 'motion/react'
import { GOLEMAN } from '../../content/goleman'
import { useReducedEffects } from '../../collage'

export interface WordCount {
  word: string
  count: number
}

/**
 * The word cloud itself: words spring in as they arrive and push their
 * neighbours aside (Motion's layout animation does the pushing). Size follows
 * the count, clamped so one runaway word cannot swallow the sheet.
 */
export function WordField({
  words,
  hidden = [],
  frozen = false,
}: {
  words: WordCount[]
  /** Words the presenter has hidden. */
  hidden?: string[]
  frozen?: boolean
}) {
  const reduced = useReducedEffects()
  const visible = words.filter((w) => !hidden.includes(w.word))
  const max = Math.max(1, ...visible.map((w) => w.count))

  return (
    <motion.div
      layout={!reduced}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        justifyContent: 'center',
        gap: '0.2em 0.5em',
      }}
    >
      <AnimatePresence initial={false}>
        {visible.map((item) => {
          const weight = item.count / max
          const size = 1 + weight * 2.6
          return (
            <motion.span
              key={item.word}
              layout={!reduced}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.5, rotate: -4 }}
              animate={{ opacity: frozen ? 0.85 : 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={
                reduced ? { duration: 0.001 } : { type: 'spring', stiffness: 320, damping: 18 }
              }
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: `clamp(${(size * 0.7).toFixed(2)}rem, ${(size * 1.6).toFixed(2)}vw, ${(size * 2.4).toFixed(2)}rem)`,
                lineHeight: 0.95,
                color: weight > 0.6 ? 'var(--color-cobalt)' : 'var(--color-ink)',
                opacity: 0.45 + weight * 0.55,
              }}
            >
              {item.word}
            </motion.span>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}

/** Shared by the styleguide and #/test so both show the real thing. */
export const SAMPLE_WORDS: WordCount[] = [
  { word: 'ego', count: 9 },
  { word: 'silence', count: 7 },
  { word: 'blame', count: 6 },
  { word: 'fear', count: 5 },
  { word: 'apathy', count: 4 },
  { word: 'ketuanan', count: 3 },
  { word: 'shouting', count: 3 },
  { word: 'absent', count: 2 },
  { word: 'tidak apa', count: 2 },
]

export const STYLE_LABELS = GOLEMAN
