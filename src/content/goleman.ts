/**
 * Goleman's six leadership styles with their published correlation to
 * organisational climate. Used by the "Boss or Leader?" vote: each option is
 * secretly mapped to a style, revealed only when I press R.
 */
export const GOLEMAN = {
  coercive: { label: 'Coercive', correlation: -0.26, gloss: 'Do what I tell you.' },
  pacesetting: { label: 'Pacesetting', correlation: -0.25, gloss: 'Do as I do, now.' },
  affiliative: { label: 'Affiliative', correlation: 0.46, gloss: 'People come first.' },
  democratic: { label: 'Democratic', correlation: 0.43, gloss: 'What do you think?' },
  coaching: { label: 'Coaching', correlation: 0.42, gloss: 'Try this.' },
  authoritative: { label: 'Authoritative', correlation: 0.54, gloss: 'Come with me.' },
} as const

export type GolemanStyle = keyof typeof GOLEMAN

export const formatCorrelation = (value: number) =>
  `${value < 0 ? '−' : '+'}.${String(Math.round(Math.abs(value) * 100)).padStart(2, '0')}`
