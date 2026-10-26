/** Pre-rendered grain, multiplied over the cream base. Two layers: fine grain
 *  and coarser fibre blotching. Density follows the act. */
export function PaperGrain({ density = 2 }: { density?: 1 | 2 | 3 }) {
  const fine = [0.18, 0.28, 0.38][density - 1]
  const fibre = [0.14, 0.24, 0.34][density - 1]
  return (
    <>
      <div className="grain" style={{ opacity: fine }} aria-hidden="true" />
      <div className="grain grain--fibre" style={{ opacity: fibre }} aria-hidden="true" />
    </>
  )
}
