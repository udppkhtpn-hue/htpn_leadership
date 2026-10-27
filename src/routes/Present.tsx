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
  // itself, and the cold open and the close belong to nothing but themselves.
  const showMap =
    section.type !== 'actcard' && section.type !== 'close' && section.id !== 'cold-open'

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
