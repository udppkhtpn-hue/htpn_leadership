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

  /* Each scenario makes a different style the right one, and sets a different
     trap — otherwise the room learns "be nice" four times and goes home.

       1  K+ 6.8        coaching is right     affiliative is the trap
       2  the arrest    coercive is right     coaching is the trap
       3  the summaries authoritative/democratic   pacesetting is the trap
       4  the referrals authoritative/coaching     affiliative is the trap

     Draft vignettes. Change the details to ones the room will recognise —
     the closer to an actual HTPN night, the harder they land.

     Keep a vignette under about 100 characters, which is two lines on the
     sheet. The projector cannot scroll, and at three lines the fourth
     option's tally bar falls off the bottom. */
  {
    id: 'sc-arrest',
    vignette:
      'A patient arrests during your ward round. The HO freezes, and nobody has started compressions.',
    // Short, because the scenario is about a moment that does not wait.
    seconds: 20,
    options: [
      {
        key: 'A',
        text: 'Point at people and give orders: you compress, you bag, you get the trolley. No discussion.',
        style: 'coercive',
        caveat: 'right here — and almost nowhere else',
      },
      {
        key: 'B',
        text: 'Ask the team what they think we should do first.',
        style: 'democratic',
      },
      {
        key: 'C',
        text: 'Talk the HO through it step by step so he learns the algorithm properly.',
        style: 'coaching',
        caveat: 'the right style, the wrong ninety seconds',
      },
      {
        key: 'D',
        text: "Reassure the HO that it is alright to panic, and take the airway yourself.",
        style: 'affiliative',
      },
    ],
  },
  {
    id: 'sc-summaries',
    vignette:
      'Discharge summaries from your ward run a week late, every week. The team is good and stretched.',
    seconds: 30,
    options: [
      {
        key: 'A',
        text: 'Come in on your off day and clear the backlog yourself so they can see how it is done.',
        style: 'pacesetting',
        caveat: 'heroic, and it teaches nobody',
      },
      {
        key: 'B',
        text: 'Announce that any summary over 48 hours old gets named at the morning meeting.',
        style: 'coercive',
      },
      {
        key: 'C',
        text: 'Say where this has to get to and why it matters to the patient, and leave the how to them.',
        style: 'authoritative',
      },
      {
        key: 'D',
        text: 'Put twenty minutes aside and ask the team to design the fix themselves.',
        style: 'democratic',
      },
    ],
  },
  {
    id: 'sc-referrals',
    vignette:
      'You are the MO. The on-call specialist stopped answering night calls, and the HOs no longer try.',
    seconds: 30,
    options: [
      {
        key: 'A',
        text: 'Tell the HOs you understand, back them up at night yourself, and keep the peace.',
        style: 'affiliative',
        caveat: 'kindness that leaves the problem exactly where it is',
      },
      {
        key: 'B',
        text: 'File an incident report every time a call goes unanswered.',
        style: 'coercive',
      },
      {
        key: 'C',
        text: 'Name the standard the ward works to, keep the call log, and take the case to the HOD.',
        style: 'authoritative',
      },
      {
        key: 'D',
        text: 'Go to the specialist privately: "This is what happens at 3am when that call does not connect."',
        style: 'coaching',
      },
    ],
  },
]

export const findScenario = (id: string) => SCENARIOS.find((s) => s.id === id)
