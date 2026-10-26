import { useCallback, useEffect } from 'react'
import { usePresentation } from '../state/PresentationProvider'
import { toggleFullscreen, usePresentationKeys } from '../lib/keys'
import { SectionScreen } from '../sections/SectionScreen'
import { EffectsProvider, PaperGrain, Sheet } from '../collage'
import '../styles/collage.css'

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

  return (
    <EffectsProvider reduced={state.reducedEffects}>
      <main className="poster" data-act={section.act} data-density={density} aria-live="polite">
        <div className="poster-creases" aria-hidden="true" />
        <PaperGrain density={density} />
        <Sheet sheetKey={section.id}>
          <SectionScreen
            section={section}
            revealed={state.revealed}
            enteredAt={state.sectionEnteredAt}
            paused={state.blackout || state.frozen}
          />
        </Sheet>
        {state.blackout ? <div className="blackout" aria-hidden="true" /> : null}
      </main>
    </EffectsProvider>
  )
}
