import type { GolemanStyle } from './goleman'

export interface ScenarioOption {
  key: 'A' | 'B' | 'C' | 'D'
  text: string
  /** Hidden until reveal. */
  style: GolemanStyle
  /** Shown on reveal when the style label alone would mislead. */
  caveat?: string
}

export interface Scenario {
  id: string
  /** 2–3 sentence ward vignette. */
  vignette: string
  options: ScenarioOption[]
  /** Countdown shown on the projector, in seconds. */
  seconds: number
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'sc-potassium',
    vignette:
      "You're the MO on call. The HO missed a K+ of 6.8 for four hours. The patient is now stable.",
    seconds: 30,
    options: [
      {
        key: 'A',
        text: 'Shout at him in front of the nurses so it never happens again.',
        style: 'coercive',
      },
      {
        key: 'B',
        text: "Fix it yourself and quietly decide he can't be trusted.",
        style: 'pacesetting',
      },
      {
        key: 'C',
        text: 'Once the patient is safe, take him aside: \u201cWhat happened? What got in the way? What do we change?\u201d',
        style: 'coaching',
      },
      {
        key: 'D',
        text: 'Tell him not to worry, everyone makes mistakes, and move on.',
        style: 'affiliative',
        caveat: 'warmth without standards',
      },
    ],
  },

  // TODO_WRITE — three more vignettes. Placeholders so the vote, countdown and
  // reveal can be built and tested end to end.
  {
    id: 'sc-placeholder-2',
    vignette: 'TODO_WRITE — scenario 2 vignette (2–3 sentences, a real ward moment).',
    seconds: 30,
    options: [
      { key: 'A', text: 'TODO_WRITE — option A', style: 'coercive' },
      { key: 'B', text: 'TODO_WRITE — option B', style: 'democratic' },
      { key: 'C', text: 'TODO_WRITE — option C', style: 'authoritative' },
      { key: 'D', text: 'TODO_WRITE — option D', style: 'pacesetting' },
    ],
  },
  {
    id: 'sc-placeholder-3',
    vignette: 'TODO_WRITE — scenario 3 vignette.',
    seconds: 30,
    options: [
      { key: 'A', text: 'TODO_WRITE — option A', style: 'affiliative' },
      { key: 'B', text: 'TODO_WRITE — option B', style: 'coaching' },
      { key: 'C', text: 'TODO_WRITE — option C', style: 'coercive' },
      { key: 'D', text: 'TODO_WRITE — option D', style: 'democratic' },
    ],
  },
  {
    id: 'sc-placeholder-4',
    vignette: 'TODO_WRITE — scenario 4 vignette.',
    seconds: 30,
    options: [
      { key: 'A', text: 'TODO_WRITE — option A', style: 'authoritative' },
      { key: 'B', text: 'TODO_WRITE — option B', style: 'pacesetting' },
      { key: 'C', text: 'TODO_WRITE — option C', style: 'coaching' },
      { key: 'D', text: 'TODO_WRITE — option D', style: 'affiliative' },
    ],
  },
]

export const findScenario = (id: string) => SCENARIOS.find((s) => s.id === id)
