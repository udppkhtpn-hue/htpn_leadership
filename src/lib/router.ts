import { useEffect, useState } from 'react'

export const ROUTES = ['present', 'presenter', 'join', 'styleguide', 'test', 'print', 'home'] as const
export type Route = (typeof ROUTES)[number]

function parse(hash: string): Route {
  const name = hash.replace(/^#\/?/, '').split('?')[0].split('/')[0]
  return (ROUTES as readonly string[]).includes(name) ? (name as Route) : 'home'
}

/** Hash routing: GitHub Pages has no server-side rewrites. */
export function useRoute(): Route {
  const [route, setRoute] = useState(() => parse(window.location.hash))
  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

/** Query string after the hash route, e.g. #/join?prompt=wc-opposite */
export function hashQuery(): URLSearchParams {
  const hash = window.location.hash
  const index = hash.indexOf('?')
  return new URLSearchParams(index === -1 ? '' : hash.slice(index + 1))
}

export const go = (route: Route) => {
  window.location.hash = `#/${route}`
}
