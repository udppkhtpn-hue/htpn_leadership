import { Drop } from '../collage'

/* ---------------------------------------------------------------------------
   A row of index cards, one per press, with the card just laid described in a
   line beneath the row. On the last press the row parts into its groups and a
   bracket is ruled under each, so the grouping is drawn, not listed.

   Every card has its place from the first press, so the row never shifts as
   it fills. Cards without a group sit in one unbracketed run.
   --------------------------------------------------------------------------- */

interface Card {
  name: string
  body: string
  group?: string
}

/** Consecutive cards that share a group, in order. */
function runs(cards: Card[]) {
  const out: { label?: string; cards: { card: Card; index: number }[] }[] = []
  cards.forEach((card, index) => {
    const last = out[out.length - 1]
    if (last && last.label === card.group) last.cards.push({ card, index })
    else out.push({ label: card.group, cards: [{ card, index }] })
  })
  return out
}

export function CardsModel({ cards, step }: { cards: Card[]; step: number }) {
  const grouped = step >= cards.length
  const current = grouped ? null : cards[step]

  return (
    <div className="cards">
      <div className="cards__row" data-grouped={grouped}>
        {runs(cards).map((run) => (
          <div className="cards__group" key={run.cards[0].card.name}>
            <ol className="cards__set" start={run.cards[0].index + 1}>
              {run.cards.map(({ card, index }) => (
                <li key={card.name} className="cards__slot">
                  {index <= step ? (
                    <Drop seed={`cards:${card.name}`} rotate={index % 2 ? 1.1 : -1.1} style={{ height: '100%' }}>
                      <div className="cards__card">
                        <span className="cards__name">{card.name}</span>
                      </div>
                    </Drop>
                  ) : (
                    <div className="cards__card cards__card--ghost" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
            {run.label ? (
              <p className="cards__bracket" data-shown={grouped}>
                {run.label}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <p className="cards__body" key={current?.name ?? 'grouped'}>
        {current?.body}
      </p>
    </div>
  )
}
