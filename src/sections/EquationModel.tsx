import { Drop } from '../collage'

/* ---------------------------------------------------------------------------
   The trust equation, built as a fraction one term at a time.

   The three terms on top are index-card slips laid in a row. Self-orientation
   arrives with the line under them, because the line is what it does: it
   divides everything already on the sheet. On the last press the left-hand
   side is written in and the divisor inverts to cobalt — the leverage is on
   the bottom, and the drawing says so without a caption.

   Every slot is laid out from the first press, hidden until its turn, so the
   fraction never shifts as it fills.
   --------------------------------------------------------------------------- */

export function EquationModel({
  terms,
  divisor,
  step,
}: {
  terms: { name: string; body: string }[]
  divisor: { name: string; body: string }
  step: number
}) {
  const dividedAt = terms.length
  const whole = step > dividedAt
  const current = step >= dividedAt ? divisor : terms[step]

  return (
    <div className="equation">
      <div className="equation__figure">
        <p className="equation__lhs" data-shown={whole}>
          Trustworthiness =
        </p>

        <div className="equation__fraction">
          <div className="equation__top">
            {terms.map((term, index) => (
              <div className="equation__slot" key={term.name}>
                {index > 0 ? (
                  <span className="equation__plus" data-shown={index <= step} aria-hidden="true">
                    +
                  </span>
                ) : null}
                {index <= step ? (
                  <Drop seed={`equation:${term.name}`} rotate={index % 2 ? 1.2 : -1.2}>
                    <span className="equation__slip">{term.name}</span>
                  </Drop>
                ) : (
                  <span className="equation__slip equation__slip--ghost">{term.name}</span>
                )}
              </div>
            ))}
          </div>

          <div className="equation__bar" data-shown={step >= dividedAt} />

          <div className="equation__bottom">
            {step >= dividedAt ? (
              <Drop seed={`equation:${divisor.name}`} rotate={0.8}>
                <span className={whole ? 'equation__slip equation__slip--lever' : 'equation__slip'}>
                  {divisor.name}
                </span>
              </Drop>
            ) : (
              <span className="equation__slip equation__slip--ghost">{divisor.name}</span>
            )}
          </div>
        </div>
      </div>

      <p className="equation__body" key={current.name}>
        {current.body}
      </p>
    </div>
  )
}
