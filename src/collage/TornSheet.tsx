import type { CSSProperties, ReactNode } from 'react'
import { TapeStrip } from './TapeStrip'
import { tornPolygon } from './tear'

interface TornSheetProps {
  seed: string
  children: ReactNode
  /** Tape at the corners, as if pinned to the poster. */
  pinned?: boolean
  style?: CSSProperties
}

/**
 * The large cream sheet live results are pinned to, so a word cloud or a vote
 * stays clean and legible on top of a busy collage.
 */
export function TornSheet({ seed, children, pinned = true, style }: TornSheetProps) {
  return (
    <div style={{ position: 'relative', ...style }}>
      <div
        className="torn-sheet"
        style={{ clipPath: tornPolygon(`${seed}:sheet`, 'torn', { amplitude: 1.1, steps: 18 }) }}
      >
        {children}
      </div>
      {pinned ? (
        <>
          <TapeStrip seed={`${seed}:tl`} length="7rem" style={{ top: '-1.1rem', left: '-2rem' }} />
          <TapeStrip seed={`${seed}:br`} length="7rem" style={{ bottom: '-1.1rem', right: '-2rem' }} />
        </>
      ) : null}
    </div>
  )
}
