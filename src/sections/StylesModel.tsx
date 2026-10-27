import { Drop } from '../collage'
import { formatCorrelation } from '../content/styles'
import type { StyleCard } from '../content/types'

/* ---------------------------------------------------------------------------
   Goleman's six styles, drawn as a card index.

   Six cards at once cannot be read from row fifteen, so only one is in hand
   at a time. Each card that has been seen files itself along the bottom edge,
   name and measure only, so the model accumulates in front of the room and
   the sixth card completes a picture rather than starting a new one.

   The correlation is drawn as a ruled measure from a zero line rather than
   printed as a badge: it is a scale, so all six become comparable the moment
   they are all on the strip, without anyone having to hold six numbers in
   their head.
   --------------------------------------------------------------------------- */

// The published correlations run from −.26 to +.54; the scale is drawn a
// little wider than the data so no bar touches an edge.
const MIN = -0.3
const MAX = 0.6
const SPAN = MAX - MIN
const ZERO_PCT = ((0 - MIN) / SPAN) * 100

function Measure({ value, compact = false }: { value: number; compact?: boolean }) {
  const negative = value < 0
  const width = (Math.abs(value) / SPAN) * 100
  return (
    <div
      className="measure"
      style={
        compact
          ? ({ '--measure-height': '0.4rem', '--measure-figure': '0.95rem' } as React.CSSProperties)
          : undefined
      }
    >
      <div className="measure__track">
        <span className="measure__zero" style={{ left: `${ZERO_PCT}%` }} />
        <span
          className={negative ? 'measure__bar measure__bar--negative' : 'measure__bar'}
          style={
            negative
              ? { right: `${100 - ZERO_PCT}%`, width: `${width}%` }
              : { left: `${ZERO_PCT}%`, width: `${width}%` }
          }
        />
      </div>
      <span className={negative ? 'measure__figure measure__figure--negative' : 'measure__figure'}>
        {formatCorrelation(value)}
      </span>
    </div>
  )
}

export function StylesModel({
  cards,
  closing,
  step,
}: {
  cards: StyleCard[]
  closing: string
  step: number
}) {
  // Steps 0–5 put one card in hand; the last step clears the stage for the
  // closing claim and lifts the four styles that build climate.
  const closingStep = step >= cards.length
  const current = closingStep ? null : cards[Math.min(step, cards.length - 1)]
  const seen = closingStep ? cards.length : step

  return (
    <div className="styles">
      <div className="styles__stage">
        {current ? (
          <Drop key={current.name} seed={`styles:${current.name}`} rotate={step % 2 ? 1.4 : -1.6}>
            <article className="style-card">
              <h2 className="style-card__name">{current.name}</h2>
              <p className="style-card__phrase">&ldquo;{current.phrase}&rdquo;</p>
              <p className="style-card__when">{current.whenItWorks}</p>
              <Measure value={current.correlation} />
            </article>
          </Drop>
        ) : (
          <Drop seed="styles:closing" rotate={-0.8}>
            <p className="style-card__closing">{closing}</p>
          </Drop>
        )}
      </div>

      <div className="styles__strip">
        {seen > 0 ? (
          <p className="styles__legend">Correlation with working climate</p>
        ) : null}
        <div className="styles__filed">
          {cards.map((card, index) => {
            const revealed = index < seen
            const lifted = closingStep && card.correlation > 0
            const dimmed = closingStep && card.correlation < 0
            return (
              <div
                key={card.name}
                className={[
                  'filed',
                  revealed ? '' : 'filed--empty',
                  lifted ? 'filed--lifted' : '',
                  dimmed ? 'filed--dimmed' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {revealed ? (
                  <>
                    <span className="filed__name">{card.name}</span>
                    <Measure value={card.correlation} compact />
                  </>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
