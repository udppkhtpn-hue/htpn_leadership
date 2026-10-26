/**
 * Deployment config. The Apps Script web app URL is public by design — it is
 * not a secret. The presenter PIN lives only in Script Properties on the
 * backend and is never bundled here.
 */
export const config = {
  /** Apps Script web app. Public by design; the PIN is not in here. */
  backendUrl:
    'https://script.google.com/macros/s/AKfycbwwSilczIDZ8AXOJ-TIAB909lkA6Ye3EcbHdYFcb2e0D_KaVDEO63LU5DQRDDkqnLd8/exec',
  /** Public URL the audience QR code points at. */
  joinUrl: 'https://udppkhtpn-hue.github.io/htpn_leadership/#/join',
  /** Shown under the QR code so people can type it. */
  joinUrlShort: 'udppkhtpn-hue.github.io/htpn_leadership',
  /** Phones re-read state on this interval, with jitter. */
  statePollMs: 9000,
  statePollJitterMs: 2000,
  /** Only the projector and presenter poll results, and only while open. */
  resultsPollMs: 2500,
} as const

export const isBackendConfigured = () => config.backendUrl.length > 0
