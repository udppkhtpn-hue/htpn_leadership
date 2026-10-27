import { SIX_STYLES, formatCorrelation } from './styles'

/**
 * The six styles keyed for the scenario vote, reading their labels and
 * correlations from the same cards the framework screen reveals — the vote's
 * reveal and the teaching screen must never disagree about a number.
 */
const card = (name: string) => {
  const match = SIX_STYLES.find((style) => style.name === name)
  if (!match) throw new Error(`Unknown leadership style: ${name}`)
  return { label: match.name, correlation: match.correlation, gloss: match.phrase }
}

export const GOLEMAN = {
  coercive: card('Coercive'),
  pacesetting: card('Pacesetting'),
  affiliative: card('Affiliative'),
  democratic: card('Democratic'),
  coaching: card('Coaching'),
  authoritative: card('Authoritative'),
} as const

export type GolemanStyle = keyof typeof GOLEMAN

export { formatCorrelation }
