import { STATIONS, stationOf } from '../content/blocks'
import type { BlockId } from '../content/types'

/* ---------------------------------------------------------------------------
   Where we are in the talk, marked on a route rather than filled in as a
   bar. Four stations along one line, typewriter labels in sepia; the current
   station turns cobalt and names its part. Small, low-contrast, bottom-left:
   it must never compete with the hero.
   --------------------------------------------------------------------------- */

export function ProgressMap({ block }: { block?: BlockId }) {
  const here = stationOf(block)
  if (!here) return null

  return (
    <nav className="progress-map" aria-label="Where we are in the talk">
      {STATIONS.map((station, index) => {
        const current = station.id === here.station.id
        return (
          <span
            key={station.id}
            className={current ? 'progress-map__station progress-map__station--current' : 'progress-map__station'}
            aria-current={current ? 'step' : undefined}
          >
            {index > 0 ? (
              <span className="progress-map__arrow" aria-hidden="true">
                →
              </span>
            ) : null}
            <span className="progress-map__tick" aria-hidden="true" />
            {station.label}
            {current && here.part.label ? (
              <span className="progress-map__part"> · {here.part.label}</span>
            ) : null}
          </span>
        )
      })}
    </nav>
  )
}
