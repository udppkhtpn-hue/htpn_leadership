import { useId } from 'react'
import { Drop } from '../collage'

/* ---------------------------------------------------------------------------
   A loop, not a ladder: the behaviours sit on a ring, clockwise from the top,
   and the arc into each one is inked as it arrives. When the last one lands,
   the arc back to the first is inked with it — it comes round again — and the
   note is set in the middle of the ring.

   The ring is faintly on the sheet from the first press, so the room can see
   it is a circle before it is closed.
   --------------------------------------------------------------------------- */

/** Ring radius, in the SVG's 0–100 box and in percent of the figure's height. */
const R = 40
/** Degrees of arc left clear either side of a slip. */
const GAP = 26

const rad = (deg: number) => (deg * Math.PI) / 180
const at = (deg: number) => [50 + R * Math.cos(rad(deg)), 50 + R * Math.sin(rad(deg))] as const

function arc(from: number, to: number) {
  const [x1, y1] = at(from + GAP)
  const [x2, y2] = at(to - GAP)
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

export function LoopModel({
  steps,
  note,
  step,
}: {
  steps: { name: string; body: string }[]
  note?: string
  step: number
}) {
  const arrow = useId()
  const count = steps.length
  const angles = steps.map((_, index) => -90 + (360 / count) * index)
  const last = count - 1
  const closed = step >= last
  const current = steps[Math.min(step, last)]

  return (
    <div className="loop">
      <div className="loop__figure">
        <svg className="loop__ring" viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <marker id={arrow} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </marker>
          </defs>
          <circle className="loop__track" cx="50" cy="50" r={R} />
          {angles.map((from, index) => {
            const to = index === last ? angles[0] + 360 : angles[index + 1]
            // The arc into a behaviour inks when it arrives; the closing arc
            // inks with the last one.
            const shown = step >= Math.min(index + 1, last)
            return shown ? (
              <path
                key={index}
                className={index === last ? 'loop__arc loop__arc--closing' : 'loop__arc'}
                d={arc(from, to)}
                markerEnd={`url(#${CSS.escape(arrow)})`}
              />
            ) : null
          })}
        </svg>

        {/* Clockwise from the top, the order they are taught and read in. */}
        <ol className="loop__steps">
          {steps.map((item, index) => {
            const [x, y] = at(angles[index])
            const place = {
              position: 'absolute',
              // Laid out against the ring, which is as wide as the figure is tall.
              left: `calc(50cqw + ${(x - 50).toFixed(2)}cqh)`,
              top: `${y.toFixed(2)}%`,
              translate: '-50% -50%',
            } as const
            return index <= step ? (
              <li key={item.name} style={place}>
                <Drop seed={`loop:${item.name}`} rotate={index % 2 ? 1.2 : -1.2}>
                  <span className="loop__slip">{item.name}</span>
                </Drop>
              </li>
            ) : null
          })}
        </ol>

        {note ? (
          <p className="loop__note" data-shown={closed}>
            {note}
          </p>
        ) : null}
      </div>
      <p className="loop__body" key={current.name}>
        {current.body}
      </p>
    </div>
  )
}
