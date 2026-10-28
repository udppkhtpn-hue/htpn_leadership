/* ---------------------------------------------------------------------------
   Myth-busting, drawn as the correction happening in front of the room: the
   myth is typed out, struck through in cobalt, and the truth is written
   underneath it.

   One pair at a time, and nothing accumulates. Five corrections in a row land
   harder than five rows of a table nobody can read past the third line.
   --------------------------------------------------------------------------- */

export function MythsModel({
  pairs,
  step,
}: {
  pairs: { myth: string; truth: string }[]
  step: number
}) {
  const pair = pairs[Math.min(step, pairs.length - 1)]
  return (
    <div className="myths" key={pair.myth}>
      <p className="myths__myth">
        {pair.myth}
        <span className="myths__strike" aria-hidden="true" />
      </p>
      <p className="myths__truth">{pair.truth}</p>
    </div>
  )
}
