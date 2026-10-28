import { Drop } from '../collage'

/* ---------------------------------------------------------------------------
   Lencioni's pyramid, built from the base up, one level per press.

   The whole outline is faintly on the sheet from the first press, so the room
   sees how far Results is from where the building starts. Trust, the base, is
   the one level in cobalt: it is the subject of the block, and everything else
   stands on it.

   Each level is its own trapezoid, cut from the same triangle with a flat top,
   so a level can drop into place on its own without the others moving.
   --------------------------------------------------------------------------- */

/** Half the width of the flat top, as a fraction of the base. */
const TOP_HALF = 0.07
/** Gap between levels, as a percentage of the figure's height. */
const GAP = 1.4

/** The pyramid's left edge at depth `y` (0 at the top, 1 at the base). */
function leftAt(y: number) {
  return (0.5 - (TOP_HALF + (0.5 - TOP_HALF) * y)) * 100
}

function band(index: number, count: number) {
  const height = 100 / count
  const top = 100 - height * (index + 1)
  const bottom = top + height - GAP
  const l1 = leftAt(top / 100)
  const l2 = leftAt(bottom / 100)
  return {
    top,
    height: height - GAP,
    clipPath: `polygon(${l1}% 0, ${100 - l1}% 0, ${100 - l2}% 100%, ${l2}% 100%)`,
  }
}

export function PyramidModel({
  levels,
  step,
}: {
  /** Base first. */
  levels: { name: string; body: string }[]
  step: number
}) {
  const current = levels[Math.min(step, levels.length - 1)]

  return (
    <div className="pyramid">
      <div className="pyramid__figure">
        {levels.map((level, index) => {
          const { top, height, clipPath } = band(index, levels.length)
          const place = { position: 'absolute', left: 0, right: 0, top: `${top}%`, height: `${height}%` } as const
          if (index > step) {
            return <div key={level.name} className="pyramid__level pyramid__level--ghost" style={{ ...place, clipPath }} />
          }
          return (
            <Drop key={level.name} seed={`pyramid:${level.name}`} rotate={0} style={place}>
              <div
                className={index === 0 ? 'pyramid__level pyramid__level--base' : 'pyramid__level'}
                style={{ clipPath }}
              >
                <span className="pyramid__name">{level.name}</span>
              </div>
            </Drop>
          )
        })}
      </div>
      <p className="pyramid__body" key={current.name}>
        {current.body}
      </p>
    </div>
  )
}
