import { useCallback, useEffect } from 'react'
import { usePresentation } from '../state/PresentationProvider'
import { toggleFullscreen, usePresentationKeys } from '../lib/keys'
import { SectionScreen } from '../sections/SectionScreen'
import { ProgressMap } from '../sections/ProgressMap'
import { EffectsProvider, PaperGrain, Sheet } from '../collage'
import '../styles/collage.css'
import '../styles/framework.css'

/** The projector screen. No chrome, ever. */
export function Present() {
  const { state, section, next, prev, goTo, toggle } = usePresentation()

  const keys = {
    next,
    prev,
    jump: goTo,
    blackout: useCallback(() => toggle('blackout'), [toggle]),
    reveal: useCallback(() => toggle('revealed'), [toggle]),
    hideCursor: useCallback(() => toggle('hideCursor'), [toggle]),
    fullscreen: toggleFullscreen,
  }
  usePresentationKeys(keys)

  useEffect(() => {
    document.body.classList.toggle('cursor-hidden', state.hideCursor)
  }, [state.hideCursor])

  const density = section.density ?? (section.act === 1 ? 3 : section.act === 2 ? 2 : 1)

  // The map is for orientation mid-block. An act card announces the station
  // itself; the cold open, the title and the close belong to nothing but
  // themselves, and nothing has started yet for the map to orient anyone in.
  // A live module owns the whole sheet, and on a revealed vote the map sat on
  // top of the last option's attribution — the one line that block is for.
  const OFF_MAP = ['actcard', 'titlecard', 'close', 'wordcloud', 'board', 'vote']
  const showMap = !OFF_MAP.includes(section.type) && section.id !== 'cold-open'

  return (
    <EffectsProvider reduced={state.reducedEffects}>
      <main className="poster" data-act={section.act} data-density={density} aria-live="polite">
        <div className="poster-creases" aria-hidden="true" />
        <PaperGrain density={density} />
        <Sheet sheetKey={section.id}>
          <SectionScreen
            section={section}
            step={state.step}
            revealed={state.revealed}
            enteredAt={state.sectionEnteredAt}
            paused={state.blackout || state.frozen}
          />
        </Sheet>
        {showMap ? <ProgressMap block={section.block} /> : null}
        {state.blackout ? <div className="blackout" aria-hidden="true" /> : null}
      </main>
    </EffectsProvider>
  )
}
