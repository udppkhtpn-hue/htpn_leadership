import type { CSSProperties, ReactNode } from 'react'
import { Clipping, Drop, InkBlot, LineDrawing, PhotoCutout, TapeStrip } from '../collage'
import { between, makeRandom } from '../lib/random'
import type { Section } from '../content/types'

/* ---------------------------------------------------------------------------
   The collage around the hero.

   Pieces sit in the margins — the outer fifths and the top and bottom edges —
   never in the middle column where the hero lives. Placement is seeded from
   the section id, so a screen looks hand-assembled but lands identically every
   time, including on the second run-through.

   Density follows the act: Act I is crowded and sepia, Act II opens up and
   turns cobalt, Act III is nearly bare.

   Each piece is positioned by its Drop wrapper rather than by itself: Drop
   animates a transform, which would otherwise become the containing block and
   collapse the piece onto the wrapper's own zero-sized box.
   --------------------------------------------------------------------------- */

const FILL: CSSProperties = { position: 'relative', inset: 'auto', width: '100%', height: '100%' }

interface Piece {
  key: string
  delay: number
  frame: CSSProperties
  node: ReactNode
}

export function Composition({
  section,
  animate = true,
  /** Multiplies the delays, so the cold open can assemble over 15-20 seconds. */
  stretch = 1,
}: {
  section: Section
  animate?: boolean
  stretch?: number
}) {
  const density = section.density ?? (section.act === 1 ? 3 : section.act === 2 ? 2 : 1)
  const random = makeRandom(`${section.id}:composition`)
  const p = section.props

  // The section's own photograph is the hero on an image screen; everywhere
  // else it can go in the margin alongside any extras.
  const extras = p.extras ?? []
  const photos =
    section.type === 'image'
      ? extras
      : [...(p.src && section.type !== 'video' ? [{ src: p.src, alt: p.alt ?? '' }] : []), ...extras]

  const pieces: Piece[] = []
  let delay = 0.25
  const add = (key: string, frame: CSSProperties, node: ReactNode) => {
    pieces.push({ key, delay, frame, node })
    delay += between(random, 0.12, 0.26)
  }

  photos.slice(0, density >= 3 ? 2 : density === 2 ? 1 : 0).forEach((photo, index) => {
    const left = index % 2 === 0
    add(
      `photo-${index}`,
      {
        position: 'absolute',
        width: `${between(random, 13, 18).toFixed(1)}%`,
        aspectRatio: left ? '4 / 3' : '3 / 4',
        [left ? 'left' : 'right']: `${between(random, 2.5, 5).toFixed(1)}%`,
        top: `${between(random, 10, 58).toFixed(1)}%`,
      },
      <PhotoCutout
        seed={`${section.id}:photo-${index}`}
        src={photo.src}
        alt={photo.alt}
        halftone={density >= 3 && index === 0}
        edge={left ? 'torn' : 'scissor'}
        style={FILL}
      />,
    )
  })

  if (density >= 3 && p.clipping) {
    add(
      'clipping',
      { position: 'absolute', top: '7%', right: '3%', width: '19%' },
      <Clipping
        seed={`${section.id}:clipping`}
        kicker={p.clipping.kicker}
        headline={p.clipping.headline}
        body={p.clipping.body}
        style={{ ...FILL, opacity: 0.92 }}
      />,
    )
  }

  // Cobalt grows through the talk even as everything else thins out.
  const blots = density === 2 ? 2 : 1
  for (let index = 0; index < blots; index += 1) {
    const left = index % 2 === 0
    const size = between(random, density === 2 ? 11 : 8, density === 2 ? 19 : 14)
    add(
      `blot-${index}`,
      {
        position: 'absolute',
        width: `${size.toFixed(1)}rem`,
        height: `${size.toFixed(1)}rem`,
        [left ? 'left' : 'right']: `${between(random, -4, 6).toFixed(1)}%`,
        [index % 2 === 0 ? 'bottom' : 'top']: `${between(random, -4, 12).toFixed(1)}%`,
      },
      <InkBlot
        seed={`${section.id}:blot-${index}`}
        size="100%"
        opacity={density === 2 ? 0.42 : 0.3}
        style={FILL}
      />,
    )
  }

  if (p.drawing) {
    const size = between(random, 6, 9)
    add(
      'drawing',
      {
        position: 'absolute',
        width: `${size.toFixed(1)}rem`,
        height: `${size.toFixed(1)}rem`,
        right: `${between(random, 3, 8).toFixed(1)}%`,
        bottom: `${between(random, 6, 16).toFixed(1)}%`,
        opacity: density === 1 ? 0.4 : 0.55,
      },
      <LineDrawing name={p.drawing} size="100%" tone={section.act === 2 ? 'cobalt' : 'ink'} style={FILL} />,
    )
  }

  if (density >= 3) {
    add(
      'tape',
      {
        position: 'absolute',
        width: `${between(random, 6, 9).toFixed(1)}rem`,
        top: `${between(random, 2, 7).toFixed(1)}%`,
        left: `${between(random, 14, 24).toFixed(1)}%`,
      },
      <TapeStrip seed={`${section.id}:tape`} length="100%" style={{ ...FILL, height: '2.2rem' }} />,
    )
  }

  return (
    <div className="collage-layer" aria-hidden="true">
      {pieces.map((piece) =>
        animate ? (
          <Drop
            key={piece.key}
            seed={`${section.id}:${piece.key}`}
            delay={piece.delay * stretch}
            style={piece.frame}
          >
            {piece.node}
          </Drop>
        ) : (
          <div key={piece.key} style={piece.frame}>
            {piece.node}
          </div>
        ),
      )}
    </div>
  )
}
