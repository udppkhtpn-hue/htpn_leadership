import { motion } from 'motion/react'
import { formatCorrelation, GOLEMAN } from '../../content/goleman'
import { useReducedEffects } from '../../collage'
import type { ScenarioOption } from '../../content/scenarios'

export interface VoteBarsProps {
  options: ScenarioOption[]
  counts: Record<string, number>
  /** Bars and styles stay hidden until the presenter presses R. */
  revealed: boolean
}

/** Vote results as paper strips growing across the sheet. */
export function VoteBars({ options, counts, revealed }: VoteBarsProps) {
  const reduced = useReducedEffects()
  const total = Math.max(1, Object.values(counts).reduce((sum, n) => sum + n, 0))

  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.9rem' }}>
      {options.map((option, index) => {
        const count = counts[option.key] ?? 0
        const share = count / total
        const style = GOLEMAN[option.style]
        return (
          <li key={option.key} style={{ display: 'grid', gap: '0.35rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-title)',
                  color: 'var(--color-cobalt)',
                  minWidth: '1.2em',
                }}
              >
                {option.key}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-lead)',
                  lineHeight: 1.3,
                }}
              >
                {option.text}
              </span>
            </div>

            <div
              style={{
                position: 'relative',
                height: '1.6rem',
                background: 'color-mix(in srgb, var(--color-sepia-light) 35%, transparent)',
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: revealed ? share : 0 }}
                transition={
                  reduced
                    ? { duration: 0.001 }
                    : { type: 'spring', stiffness: 90, damping: 18, delay: index * 0.1 }
                }
                style={{
                  position: 'absolute',
                  inset: 0,
                  transformOrigin: 'left center',
                  background: 'var(--color-cobalt)',
                  // A torn right edge, so the bar reads as a strip of paper.
                  clipPath:
                    'polygon(0 0, 99.2% 4%, 100% 28%, 98.8% 52%, 100% 74%, 99.3% 100%, 0 100%)',
                }}
              />
              {revealed ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.45 + index * 0.1 }}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    translate: '0 -50%',
                    fontFamily: 'var(--font-type)',
                    fontSize: 'var(--text-stamp)',
                  }}
                >
                  {count} · {Math.round(share * 100)}%
                </motion.span>
              ) : null}
            </div>

            {revealed ? (
              <motion.p
                initial={reduced ? { opacity: 0 } : { opacity: 0, rotateX: -80 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={
                  reduced ? { duration: 0.001 } : { duration: 0.45, delay: 0.5 + index * 0.1 }
                }
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-type)',
                  fontSize: 'var(--text-stamp)',
                  letterSpacing: '0.14em',
                  color: style.correlation < 0 ? 'var(--color-sepia)' : 'var(--color-cobalt)',
                }}
              >
                {style.label} · climate {formatCorrelation(style.correlation)}
                {option.caveat ? ` · ${option.caveat}` : ''}
              </motion.p>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
