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
            // 1-9 jump to that section, 0 jumps to the tenth.
            const digit = Number(event.key)
            actions.jump(digit === 0 ? 9 : digit - 1)
          }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
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
