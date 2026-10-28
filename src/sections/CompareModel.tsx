/* ---------------------------------------------------------------------------
   Two columns of a ledger, one row per press, split by a ruled line. The left
   column is set in ink and the right recedes to sepia: the same post, and the
   eye is meant to land on one side of it.

   Rows not yet revealed are laid out and hidden, so the ledger never reflows
   as it fills. The closing line is typed across the foot on the last press.
   --------------------------------------------------------------------------- */

export function CompareModel({
  left,
  right,
  rows,
  closing,
  step,
}: {
  left: string
  right: string
  rows: { left: string; right: string }[]
  closing?: string
  step: number
}) {
  const closed = Boolean(closing) && step >= rows.length

  return (
    <div className="compare">
      <table className="compare__ledger">
        <thead>
          <tr>
            <th scope="col">{left}</th>
            <th scope="col">{right}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.left}
              data-state={index > step ? 'hidden' : index === step ? 'current' : 'past'}
            >
              <td>{row.left}</td>
              <td>{row.right}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {closing ? (
        <p className="compare__closing" data-shown={closed}>
          {closing}
        </p>
      ) : null}
    </div>
  )
}
