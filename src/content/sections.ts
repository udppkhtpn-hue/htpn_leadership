import type { Section } from './types'

/* ---------------------------------------------------------------------------
   Every screen of the talk lives here. Change text, order, timings and notes
   in this file only — no component needs touching.

   TODO_WRITE marks copy that still needs Ferwahn's own words.
   --------------------------------------------------------------------------- */

export const SECTIONS: Section[] = [
  // ---------------------------------------------------------------- Cold open
  {
    id: 'cold-open',
    act: 1,
    type: 'image',
    title: 'Cold open — the 1910 building',
    layout: 'full-bleed',
    minutes: 1.5,
    morphId: 'building-1910',
    notes:
      'Say nothing for the first 15 seconds. Let the collage assemble.\n\nThen: this building opened in 1910. It is still open. Every one of us is passing through it.',
    props: {
      src: '/images/1910-building.jpg',
      alt: 'The 1910 hospital building at HTPN, photographed from the courtyard.',
      stamp: 'HTPN · 1910',
      caption: 'Still in use.',
    },
  },
  {
    id: 'title',
    act: 1,
    type: 'statement',
    title: 'Title',
    layout: 'hero-left',
    minutes: 1,
    notes: 'Read the title out loud, slowly. Then: this is not a talk about promotion.',
    props: {
      headline: 'Be the senior you needed.',
      sub: 'Leadership is a choice, not a rank.',
      stamp: 'HTPN · Kajang',
    },
  },
  {
    id: 'join',
    act: 1,
    type: 'qr',
    title: 'Join on your phone',
    layout: 'hero-center',
    minutes: 1.5,
    notes:
      'Everyone takes out a phone now, not later. Say it plainly: anonymous, no names, I cannot see who wrote what.',
    props: {
      headline: 'Take out your phone.',
      sub: 'Anonymous. No names, no login.',
    },
  },

  // ------------------------------------------------------------------- Act I
  {
    id: 'act-1',
    act: 1,
    type: 'actcard',
    title: 'Act I — What is',
    layout: 'hero-center',
    minutes: 0.5,
    notes: 'Beat. Let the ink splash land.',
    props: { headline: 'ACT I', sub: 'What is' },
  },
  {
    id: 'wc-opposite',
    act: 1,
    type: 'wordcloud',
    title: 'Word cloud — opposite of leadership',
    layout: 'board',
    minutes: 4,
    module: { kind: 'wordcloud', promptId: 'wc-opposite' },
    notes:
      'Read a few words out as they land. Do not editorialise yet.\n\nFreeze when it stops growing. Point at the biggest word and ask: who have you worked for like that?',
    props: {},
  },
  {
    id: 'already-led',
    act: 1,
    type: 'statement',
    title: 'You have already led today',
    layout: 'hero-left',
    minutes: 2,
    notes:
      'The HO who answered a call at 3am for a patient who was not theirs led. Nobody gave them a title for it.',
    props: {
      headline: 'You have already led today. You just did not call it that.',
    },
  },
  {
    id: 'data-cost',
    act: 1,
    type: 'data',
    title: 'Data — the cost',
    layout: 'clipping-right',
    minutes: 2,
    notes: 'Give the number, then be quiet for three seconds.',
    props: {
      value: 'TODO_WRITE',
      unit: '%',
      label: 'TODO_WRITE — what this number measures, in one short line.',
      source: 'TODO_WRITE — source and year.',
    },
  },
  {
    id: 'board-drains',
    act: 1,
    type: 'board',
    title: 'Board — drains / energises',
    layout: 'board',
    minutes: 6,
    module: { kind: 'board', promptId: 'board-drains' },
    notes:
      'Approve as they come in. Hide anything with a name in it.\n\nStar three on each side and read them out. The drains column is almost never about clinical work.',
    props: {},
  },
  {
    id: 'video-swenson',
    act: 1,
    type: 'video',
    title: 'Video — Swenson',
    layout: 'full-bleed',
    minutes: 4,
    notes: 'Plays on enter. Press B if the room needs to talk before it ends.',
    props: {
      src: '/media/swenson.mp4',
      caption: 'TODO_WRITE — one line of attribution.',
    },
  },
  {
    id: 'what-it-costs',
    act: 1,
    type: 'statement',
    title: 'What it costs',
    layout: 'hero-center',
    minutes: 2,
    notes: 'This closes Act I. The room should be uncomfortable here.',
    props: {
      quote: 'TODO_WRITE — the sentence that names what bad seniority costs a patient.',
      attribution: 'TODO_WRITE',
    },
  },

  // ------------------------------------------------------------------ Act II
  {
    id: 'act-2',
    act: 2,
    type: 'actcard',
    title: 'Act II — What could be',
    layout: 'hero-center',
    minutes: 0.5,
    notes: 'Shift the energy. Stand somewhere else in the room.',
    props: { headline: 'ACT II', sub: 'What could be' },
  },
  {
    id: 'vote-potassium',
    act: 2,
    type: 'vote',
    title: 'Boss or Leader? — K+ 6.8',
    layout: 'board',
    minutes: 5,
    module: { kind: 'vote', promptId: 'sc-potassium' },
    notes:
      'Read the vignette. 30 seconds. Do not reveal until everyone has voted.\n\nOn reveal: D is the trap. Warmth with no standards is not kindness.',
    props: {},
  },
  {
    id: 'data-climate',
    act: 2,
    type: 'data',
    title: 'Data — climate correlation',
    layout: 'clipping-right',
    minutes: 2.5,
    notes:
      'Goleman, Leadership That Gets Results, HBR 2000. Authoritative +.54 is the strongest single style.',
    props: {
      value: '+.54',
      label: 'Authoritative leadership, correlation with working climate.',
      source: 'Goleman, "Leadership That Gets Results", Harvard Business Review, 2000.',
    },
  },
  {
    id: 'vote-two',
    act: 2,
    type: 'vote',
    title: 'Boss or Leader? — scenario 2',
    layout: 'board',
    minutes: 4,
    module: { kind: 'vote', promptId: 'sc-placeholder-2' },
    notes: 'TODO_WRITE — what this scenario is for.',
    props: {},
  },
  {
    id: 'video-empathy',
    act: 2,
    type: 'video',
    title: 'Video — empathy',
    layout: 'full-bleed',
    minutes: 3,
    notes: 'Plays on enter.',
    props: {
      src: '/media/empathy.mp4',
      caption: 'TODO_WRITE — one line of attribution.',
    },
  },
  {
    id: 'wc-admire',
    act: 2,
    type: 'wordcloud',
    title: 'Word cloud — a leader you admire',
    layout: 'board',
    minutes: 4,
    module: { kind: 'wordcloud', promptId: 'wc-admire' },
    notes:
      'Nobody writes "clever". It is always patience, calm, took responsibility. Say that out loud when the cloud settles.',
    props: {},
  },
  {
    id: 'micro-acts',
    act: 2,
    type: 'statement',
    title: 'The smallest unit of leadership',
    layout: 'hero-left',
    minutes: 2.5,
    notes: 'Name three concrete things an MO can do on the next shift. Keep them small.',
    props: {
      headline: 'The smallest unit of leadership is one handover done properly.',
    },
  },
  {
    id: 'timeline-shift',
    act: 2,
    type: 'timeline',
    title: 'Timeline — one shift',
    layout: 'split',
    minutes: 3,
    notes: 'Walk it hour by hour. This is the practical core of the talk.',
    props: {
      events: [
        { year: '07:00', text: 'TODO_WRITE — handover.' },
        { year: '11:00', text: 'TODO_WRITE — the HO who is drowning.' },
        { year: '16:00', text: 'TODO_WRITE — the call you do not want to make.' },
        { year: '22:00', text: 'TODO_WRITE — what you write in the notes.' },
      ],
    },
  },

  // ----------------------------------------------------------------- Act III
  {
    id: 'act-3',
    act: 3,
    type: 'actcard',
    title: 'Act III — The legacy',
    layout: 'hero-center',
    minutes: 0.5,
    notes: 'Slow down. Quieter voice from here to the end.',
    props: { headline: 'ACT III', sub: 'The legacy' },
  },
  {
    id: 'building-return',
    act: 3,
    type: 'image',
    title: 'The 1910 building returns',
    layout: 'hero-center',
    minutes: 2,
    morphId: 'building-1910',
    notes: 'Same photograph as the cold open. Say: this room has had this conversation before.',
    props: {
      src: '/images/1910-building.jpg',
      alt: 'The 1910 hospital building at HTPN.',
      stamp: 'HTPN · 1910',
    },
  },
  {
    id: 'data-1889',
    act: 3,
    type: 'data',
    title: 'Data — 1889',
    layout: 'hero-center',
    minutes: 2,
    notes: 'The hospital was here before you and will be here after you. The only question is what you leave in it.',
    props: {
      value: '1889',
      label: 'The year this hospital opened.',
      source: 'Ministry of Health Malaysia.',
    },
  },
  {
    id: 'wc-hear-most',
    act: 3,
    type: 'wordcloud',
    title: 'Word cloud — which one do you hear most',
    layout: 'board',
    minutes: 3,
    module: { kind: 'wordcloud', promptId: 'wc-hear-most' },
    notes: 'Five phrases, one tap. Whichever wins, the answer is the same: it is a choice, repeated.',
    props: {},
  },
  {
    id: 'commitment',
    act: 3,
    type: 'statement',
    title: 'Commitment card',
    layout: 'hero-center',
    minutes: 3,
    notes:
      'Paper cards go out now. Nothing is collected and nothing is typed. They keep the card.',
    props: {
      headline: 'This month I will be the senior I needed by…',
      sub: 'Write it on the card. Keep it where you can see it.',
    },
  },
  {
    id: 'close',
    act: 3,
    type: 'close',
    title: 'Close — peel away',
    layout: 'hero-center',
    minutes: 2,
    notes:
      'The collage peels away. When only the blot and the line are left, press B and ask everyone to switch on their phone torch.',
    props: { headline: 'Be the senior you needed.' },
  },
]

/** The 60-minute running order. */
export const SEQUENCE_60: string[] = SECTIONS.map((s) => s.id)

/** The 45-minute cut: no second vote, no second video, no timeline, one word cloud fewer. */
export const SEQUENCE_45: string[] = SEQUENCE_60.filter(
  (id) => !['data-cost', 'vote-two', 'video-empathy', 'wc-admire', 'timeline-shift'].includes(id),
)

export type SequenceId = 'full60' | 'short45'

export const SEQUENCES: Record<SequenceId, { label: string; ids: string[] }> = {
  full60: { label: '60 minutes', ids: SEQUENCE_60 },
  short45: { label: '45 minutes', ids: SEQUENCE_45 },
}

const BY_ID = new Map(SECTIONS.map((s) => [s.id, s]))

export function sectionsFor(sequence: SequenceId): Section[] {
  return SEQUENCES[sequence].ids
    .map((id) => BY_ID.get(id))
    .filter((s): s is Section => Boolean(s))
}

export const totalMinutes = (sequence: SequenceId) =>
  sectionsFor(sequence).reduce((sum, s) => sum + s.minutes, 0)
