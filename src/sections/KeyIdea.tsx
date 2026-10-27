import { useEffect, useRef, useState } from 'react'
import { useReducedEffects } from '../collage'

/* ---------------------------------------------------------------------------
   The line that closes a block. One sentence, typed in the typewriter face,
   with a cobalt rule ruled under it as the last character lands. No label:
   the face and the silence say what it is.
   --------------------------------------------------------------------------- */

const CHAR_MS = 42

export function KeyIdea({ text, sectionId }: { text: string; sectionId: string }) {
  const reduced = useReducedEffects()
  const [typed, setTyped] = useState(() => (reduced ? text.length : 0))
  const timer = useRef(0)

  useEffect(() => {
    if (reduced) {
      setTyped(text.length)
      return
    }
    setTyped(0)
    let index = 0
    timer.current = window.setInterval(() => {
      index += 1
      setTyped(index)
      if (index >= text.length) window.clearInterval(timer.current)
    }, CHAR_MS)
    return () => window.clearInterval(timer.current)
    // Re-types when the screen changes, not on every render.
  }, [reduced, sectionId, text])

  const done = typed >= text.length

  return (
    <div className="keyidea">
      <p className="keyidea__line" aria-label={text}>
        <span aria-hidden="true">{text.slice(0, typed)}</span>
        {done ? null : (
          <span className="keyidea__caret" aria-hidden="true">
            _
          </span>
        )}
      </p>
      <div
        className="keyidea__rule"
        aria-hidden="true"
        style={{ width: 'min(80%, 58rem)', transform: `scaleX(${done ? 1 : 0})` }}
      />
    </div>
  )
}
