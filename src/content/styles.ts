import type { StyleCard } from './types'

/**
 * Goleman's six leadership styles, with the published correlation between
 * each style and organisational climate.
 *
 * Daniel Goleman, "Leadership That Gets Results", Harvard Business Review,
 * March–April 2000. Order is the order of the reveal: the two that damage
 * climate are not hidden at the end, they are met first and last, so the
 * room sees that a negative style still has a right moment.
 */
export const SIX_STYLES: StyleCard[] = [
  {
    name: 'Coercive',
    phrase: 'Do what I tell you.',
    whenItWorks: 'In a crisis or a genuine emergency.',
    correlation: -0.26,
  },
  {
    name: 'Authoritative',
    phrase: 'Come with me.',
    whenItWorks: 'When a clear direction is needed.',
    correlation: 0.54,
  },
  {
    name: 'Affiliative',
    phrase: 'People come first.',
    whenItWorks: 'To heal rifts, or support people under stress.',
    correlation: 0.46,
  },
  {
    name: 'Democratic',
    phrase: 'What do you think?',
    whenItWorks: 'To build buy-in and get ideas from capable staff.',
    correlation: 0.43,
  },
  {
    name: 'Pacesetting',
    phrase: 'Do as I do, now.',
    whenItWorks: 'Briefly, with a highly competent, self-motivated team.',
    correlation: -0.25,
  },
  {
    name: 'Coaching',
    phrase: 'Try this.',
    whenItWorks: 'When people want to grow.',
    correlation: 0.42,
  },
]

export const SIX_STYLES_CLOSING =
  'Leaders who master four or more styles, especially authoritative, democratic, affiliative and coaching, create the best climate. Climate drives about a third of results.'

/** "+.54" / "−.26" — a true minus sign, not a hyphen, at projector size. */
export const formatCorrelation = (value: number) =>
  `${value < 0 ? '−' : '+'}.${String(Math.round(Math.abs(value) * 100)).padStart(2, '0')}`
