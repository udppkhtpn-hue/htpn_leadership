import { Drop } from '../collage'

/* ---------------------------------------------------------------------------
   Concentric rings, revealed from the centre outwards — which is the whole
   argument of the golden circle, so the reveal order carries the teaching and
   nothing has to say it.

   Rings arrive innermost first. Each name sits inside its own band; the body
   line of the ring just revealed sits on one line beneath the figure, so the
   figure stays the only hero.
   --------------------------------------------------------------------------- */

/** Diameters as a percentage of the sheet, innermost first. */
function diameters(count: number): number[] {
  if (count <= 1) return [100]
  const inner = count === 2 ? 46 : 38
  return Array.from({ length: count }, (_, i) => inner + ((100 - inner) * i) / (count - 1))
}

export function CirclesModel({
  rings,
  step,
}: {
  rings: { name: string; body: string }[]
  step: number
}) {
  const sizes = diameters(rings.length)
  const current = rings[Math.min(step, rings.length - 1)]

  return (
    <div className="circles">
      <div className="circles__figure">
        {/* Outermost first in the DOM, innermost on top by z-index, so a ring
            revealed later lands behind the ones already drawn. */}
        {rings
          .map((ring, index) => ({ ring, index }))
          .reverse()
          .map(({ ring, index }) =>
            index <= step ? (
              <Drop
                key={ring.name}
                seed={`circles:${ring.name}`}
                rotate={0}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: `${sizes[index]}%`,
                  translate: '-50% -50%',
                  // Inner rings sit on top: each one's fill is what cuts the
                  // ring outside it down to a band.
                  zIndex: 10 + (rings.length - index),
                }}
              >
                <div className={index === 0 ? 'circles__ring circles__ring--core' : 'circles__ring'}>
                  <span className="circles__name">{ring.name}</span>
                </div>
              </Drop>
            ) : null,
          )}
      </div>
      <p className="circles__body" key={current.name}>
        {current.body}
      </p>
    </div>
  )
}
