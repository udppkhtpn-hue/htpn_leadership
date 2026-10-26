/**
 * Resolves a path in /public against the deployment base.
 *
 * GitHub Pages serves this app from /htpn_leadership/, so a bare '/images/x.jpg'
 * misses in both dev and production. Content files keep writing clean paths and
 * this puts the base back on.
 */
export function asset(path?: string): string | undefined {
  if (!path) return undefined
  if (/^(https?:|data:|blob:)/.test(path)) return path
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`
}
