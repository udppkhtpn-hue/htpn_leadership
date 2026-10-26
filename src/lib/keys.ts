import { useEffect } from 'react'

export interface KeyActions {
  next: () => void
  prev: () => void
  blackout: () => void
  reveal: () => void
  hideCursor: () => void
  fullscreen: () => void
  jump: (index: number) => void
  help?: () => void
}

/**
 * Presentation keys. Bound on both #/present and #/presenter so a clicker
 * works whichever window has focus; state syncs over BroadcastChannel.
 */
export function usePresentationKeys(actions: KeyActions, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    // Section numbers run past nine, so digits are buffered briefly: "1" then
    // "2" within the window jumps to 12, while a lone "7" still jumps to 7.
    let digits = ''
    let digitTimer = 0
    const flushDigits = () => {
      if (!digits) return
      const target = Number(digits)
      digits = ''
      if (target >= 1) actions.jump(target - 1)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (event.metaKey || event.ctrlKey || event.altKey) return

      switch (event.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          event.preventDefault()
          actions.next()
          break
        case 'ArrowLeft':
        case 'PageUp':
          event.preventDefault()
          actions.prev()
          break
        case 'b':
        case 'B':
          actions.blackout()
          break
        case 'r':
        case 'R':
          actions.reveal()
          break
        case 'h':
        case 'H':
          actions.hideCursor()
          break
        case 'f':
        case 'F':
          actions.fullscreen()
          break
        case '?':
          actions.help?.()
          break
        default:
          if (/^[0-9]$/.test(event.key)) {
            digits += event.key
            window.clearTimeout(digitTimer)
            // Three digits can only be one section, so go at once.
            if (digits.length >= 3) flushDigits()
            else digitTimer = window.setTimeout(flushDigits, 650)
          }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(digitTimer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [actions, enabled])
}

export async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await document.documentElement.requestFullscreen()
  } catch {
    /* some projectors / browsers refuse; not worth surfacing */
  }
}
