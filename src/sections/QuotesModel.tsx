import { Drop, TapeStrip } from '../collage'

/* ---------------------------------------------------------------------------
   Three sources, one claim. Each quotation is a slip of paper taped to the
   sheet on its own, so each gets its own silence; on the last press all three
   lie side by side, and three traditions read as one sentence.

   A slip keeps its key when the row forms, so the one already on the sheet
   slides into place while the other two drop in beside it.
   --------------------------------------------------------------------------- */

/** Settled tilt of each slip once they lie together. */
const TOGETHER = [-1.6, 0.9, -0.7]

export function QuotesModel({
  quotes,
  step,
}: {
  quotes: { text: string; source: string }[]
  step: number
}) {
  const together = step >= quotes.length
  const shown = together ? quotes : [quotes[step]]

  return (
    <div className={together ? 'quotes quotes--together' : 'quotes'}>
      {shown.map((quote, index) => (
        <Drop
          key={quote.source}
          seed={`quotes:${quote.source}`}
          rotate={together ? TOGETHER[index % TOGETHER.length] : -0.8}
          className="quotes__drop"
        >
          <figure className="quote">
            <TapeStrip
              seed={`quotes:${quote.source}`}
              length="32%"
              rotate={index % 2 ? 5 : -4}
              idle={false}
              style={{ top: '-1.1rem', left: '34%' }}
            />
            <blockquote className="quote__text">“{quote.text}”</blockquote>
            <figcaption className="quote__source">{quote.source}</figcaption>
          </figure>
        </Drop>
      ))}
    </div>
  )
}
