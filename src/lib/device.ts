const KEY = 'htpn.deviceId'

/**
 * A random per-browser id so the backend can enforce one submission per device
 * per prompt. Deliberately not tied to any person: no names, no emails, no
 * phone numbers, no IC.
 */
export function deviceId(): string {
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}
