import { Drop } from '../collage'

/* ---------------------------------------------------------------------------
   Values and Purpose, as two discs cut from paper by hand.

   The overlap is not a tint: it is where the cobalt pools, the way ink soaks
   through at the one place two sheets lie on top of each other. That is the
   claim — the problem you actually care about exists only where both are
   present — so it is drawn rather than captioned.

   Geometry: each disc is 58% of the sheet's width, so together they overlap by
   16%. The lens is the right-hand disc clipped by the left-hand one, which a
   circle inside an overflow-hidden circle gives for free.
   --------------------------------------------------------------------------- */

const DISC = 58
// The right disc's left edge, measured from the left disc's own left edge.
const LENS_OFFSET = ((100 - DISC) / DISC) * 100

export function VennModel({
  left,
  right,
  overlap,
  step,
}: {
  left: { name: string; body: string }
  right: { name: string; body: string }
  /** `name` is for the presenter's notes and the handout, not the sheet. */
  overlap: { name: string; body: string }
  step: number
}) {
  return (
    <div className="venn">
      <div className="venn__figure">
        <Drop seed="venn:left" rotate={-1.6} style={{ position: 'absolute', inset: '0 auto 0 0', width: `${DISC}%` }}>
          <div className="venn__disc">
            <div className="venn__label venn__label--left">
              <p className="venn__name">{left.name}</p>
              <p className="venn__body">{left.body}</p>
            </div>
            {step >= 2 ? (
              <div
                className="venn__lens"
                style={{ left: `${LENS_OFFSET}%` }}
                aria-hidden="true"
              />
            ) : null}
          </div>
        </Drop>

        {step >= 1 ? (
          <Drop
            seed="venn:right"
            rotate={1.4}
            style={{ position: 'absolute', inset: '0 0 0 auto', width: `${DISC}%` }}
          >
            <div className="venn__disc venn__disc--right">
              <div className="venn__label venn__label--right">
                <p className="venn__name">{right.name}</p>
                <p className="venn__body">{right.body}</p>
              </div>
            </div>
          </Drop>
        ) : null}
      </div>

      <p className="venn__overlap" data-shown={step >= 2}>
        {overlap.body}
      </p>
    </div>
  )
}
