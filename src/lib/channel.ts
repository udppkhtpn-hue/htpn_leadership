/**
 * Window-to-window sync for the two windows on the presenting laptop
 * (#/present on the projector, #/presenter on the built-in screen).
 * BroadcastChannel is instant and needs no network; the storage event is a
 * fallback for browsers or contexts where it is unavailable.
 */
const CHANNEL = 'htpn-lead-live'
const MIRROR_KEY = 'htpn.live'

export type Envelope<T> = { kind: 'state'; state: T } | { kind: 'request' }

export interface Channel<T> {
  post: (message: Envelope<T>) => void
  close: () => void
}

export function openChannel<T>(onMessage: (message: Envelope<T>) => void): Channel<T> {
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL) : null
  const onBc = (event: MessageEvent) => onMessage(event.data as Envelope<T>)
  bc?.addEventListener('message', onBc)

  const onStorage = (event: StorageEvent) => {
    if (event.key !== MIRROR_KEY || !event.newValue) return
    try {
      onMessage({ kind: 'state', state: JSON.parse(event.newValue) as T })
    } catch {
      /* ignore a half-written mirror */
    }
  }
  window.addEventListener('storage', onStorage)

  return {
    post(message) {
      bc?.postMessage(message)
      if (message.kind === 'state') {
        try {
          localStorage.setItem(MIRROR_KEY, JSON.stringify(message.state))
        } catch {
          /* private mode: sync still works over BroadcastChannel */
        }
      }
    },
    close() {
      bc?.removeEventListener('message', onBc)
      bc?.close()
      window.removeEventListener('storage', onStorage)
    },
  }
}

export function readMirror<T>(): T | null {
  try {
    const raw = localStorage.getItem(MIRROR_KEY)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}
