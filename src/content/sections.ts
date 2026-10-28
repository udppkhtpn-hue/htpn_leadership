import { SIX_STYLES, SIX_STYLES_CLOSING } from './styles'
import type { Section } from './types'

/* ---------------------------------------------------------------------------
   Every screen of the talk lives here. Change text, order, timings and notes
   in this file only — no component needs touching.

   The talk runs on one spine, "Leading Self and Others", in seven blocks.
   Each block repeats the same four beats:

     Teach  — framework screens, one model drawn per screen
     Show   — a story, a number or a clip that makes the model real
     Try    — the room does something: a cloud, a board, a vote
     Key    — one typed line that closes the block

   `steps` is how many clicker presses a screen takes before moving on, and
   `stepNotes` is what I say at each one.

   TODO_WRITE marks copy that still needs Ferwahn's own words. [TODO] inside
   a framework marks a model that is specified but not yet drawn.
   --------------------------------------------------------------------------- */

export const SECTIONS: Section[] = [
  /* ===================================================== BLOCK 0 · Leadership
     0:00–0:10 · What leadership is
     ===================================================================== */
  {
    id: 'cold-open',
    act: 1,
    type: 'image',
    title: 'Cold open — the 1984 building',
    layout: 'full-bleed',
    minutes: 1.5,
    block: 'leadership',
    morphId: 'building-1910',
    notes:
      'Say nothing for the first 15 seconds. Let the collage assemble.\n\nThen: this building opened in 1910. It is still open. Every one of us is passing through it.',
    props: {
      extras: [
        { src: '/images/ward-corridor.jpg', alt: 'An empty ward corridor, benches along one wall' },
        {
          // Arrives already torn, taped and mounted on cobalt: left uncut.
          src: '/images/ward-corridor-collage.jpg',
          alt: 'A torn print of a ward corridor, taped to a cobalt ground',
          plain: true,
        },
      ],
      src: '/images/kajang-hospital-1984.jpg',
      alt: 'Hospital Daerah Kajang, front view, photographed in 1984.',
      stamp: 'Hospital Daerah Kajang · 1984',
      caption: 'Still in use.',
    },
  },
  {
    id: 'title',
    act: 1,
    type: 'titlecard',
    title: 'Title — the session, and who is giving it',
    layout: 'hero-left',
    minutes: 0.5,
    block: 'leadership',
    notes:
      'Read the title out loud, slowly. Then: this is not a talk about promotion.\n\nThe room can read the rest for itself — do not read the credits out.',
    props: {
      drawing: 'window',
      // Assembled by hand, already torn and taped and already in the palette,
      // so it is mounted as it is rather than cut out again.
      src: '/images/landing-collage.jpg',
      alt: 'A hand-assembled collage: a ward team conferring in the corridor at HTPN, torn prints of the hospital, on a cobalt ground.',
      headline: 'Be the senior you needed.',
      sub: 'Leadership is a choice, not a rank.',
      // No venue row: the course title already names the hospital, and the
      // room is sitting in it.
      credits: [
        { label: 'Presenter', value: 'Ferwahn Fairis' },
        {
          label: 'Course',
          value:
            'Kursus Kepimpinan Jabatan Perubatan, Hospital Tengku Permaisuri Norashikin (HTPN) 2026',
        },
      ],
      dateStamp: 'Friday 30 October 2026',
    },
  },
  {
    id: 'join',
    act: 1,
    type: 'qr',
    title: 'Join on your phone',
    layout: 'hero-center',
    minutes: 1,
    block: 'leadership',
    notes:
      'Everyone takes out a phone now, not later. Say it plainly: anonymous, no names, I cannot see who wrote what.',
    props: {
      drawing: 'hand',
      headline: 'Take out your phone.',
      sub: 'Anonymous. No names, no login.',
    },
  },
  {
    id: 'fw-what-is',
    act: 1,
    type: 'framework',
    title: 'Framework — what leadership is',
    layout: 'hero-center',
    minutes: 1.5,
    block: 'leadership',
    steps: 4,
    stepNotes: [
      'The definition. Read it word for word, then stop. "Human energy" is the phrase to sit on.',
      'Sinek. A choice, not a rank — the whole talk in six words.',
      'The hadith. Read it slowly. Every one of you is a shepherd. Nobody in this room is exempt.',
      'All three together. Three traditions, one claim: it is a responsibility you already hold.',
    ],
    notes:
      'Teach. Three sources, one claim. Do not rush between them — each gets its own silence.',
    props: {
      framework: {
        name: 'What leadership is',
        definition:
          'Leadership is the art of harnessing human energy towards the creation of a better future.',
        source: 'Rajeev Peshawaria, Iclif',
        model: {
          kind: 'quotes',
          quotes: [
            {
              text: 'Leadership is the art of harnessing human energy towards the creation of a better future.',
              source: 'Rajeev Peshawaria, Iclif',
            },
            { text: 'Leadership is a choice. It is not a rank.', source: 'Simon Sinek, TED 2014' },
            {
              text: 'Every one of you is a shepherd and every one of you is responsible for his flock.',
              source: 'Sahih al-Bukhari 7138; Sahih Muslim 1829',
            },
          ],
        },
      },
    },
  },
  {
    id: 'already-led',
    act: 1,
    type: 'statement',
    title: 'Show — the security guard',
    layout: 'hero-left',
    minutes: 1,
    block: 'leadership',
    notes:
      'Tell it in your own words, from the clipping. Green zone ED; a Grab dropped her at the wrong emergency department; her husband trying to book another car to WCC; the guard comes out with a wheelchair and pushes her all the way to the labour ward, which was still the old one then.\n\nThen the line: pushing patients is not in her job scope. She did it anyway. Nobody gave her a rank for it. That is the Sinek quote they have just read, in our own corridor.',
    props: {
      drawing: 'hand',
      clipping: {
        kicker: 'Green zone, ED',
        headline: 'The wrong emergency department',
        body: 'A Grab dropped a woman in labour at the wrong emergency department. She sat outside in a chair while her husband tried to book another car to WCC. A security guard went in, came back with a wheelchair, and pushed her all the way to the labour ward herself.',
      },
      headline: 'Not her job. She did it anyway.',
    },
  },
  {
    id: 'wc-opposite',
    act: 1,
    type: 'wordcloud',
    title: 'Try — the opposite of leadership',
    layout: 'board',
    minutes: 2,
    block: 'leadership',
    module: { kind: 'wordcloud', promptId: 'wc-opposite' },
    notes:
      'Read a few words out as they land. Do not editorialise yet.\n\nFreeze when it stops growing. Point at the biggest word and ask: who have you worked for like that?',
    props: {},
  },
  {
    id: 'key-leadership',
    act: 1,
    type: 'keyidea',
    title: 'Key idea — already someone’s senior',
    layout: 'hero-center',
    minutes: 0.5,
    block: 'leadership',
    notes: 'Let it type. Say nothing until the line finishes.',
    props: { headline: 'Every one of us is already someone’s senior.' },
  },

  /* ================================================== BLOCK 1 · Boss / Leader
     0:10–0:17 · The reality, then the distinction
     ===================================================================== */
  {
    id: 'data-resignations',
    act: 1,
    type: 'data',
    title: 'Show — resignations',
    layout: 'clipping-right',
    minutes: 0.5,
    block: 'leadership',
    notes:
      'Give the number, then be quiet for three seconds.\n\nIf asked: 4,380 contract and 1,832 permanent. Contract resignations peaked at 1,354 in 2022; permanent ones have risen every year, 238 in 2021 to 498 in 2025. Written Dewan Negara reply to Senator Robert Lau, 4 August 2026, reported by CodeBlue on 14 August.',
    props: {
      clipping: {
        kicker: 'Dewan Negara, August 2026',
        headline: 'Five years, 6,212 doctors',
        body: 'Between 2021 and 2025, 4,380 contract and 1,832 permanent medical officers resigned from the Ministry of Health. Contract resignations peaked in 2022. Permanent ones rose every year, from 238 in 2021 to 498 in 2025.',
      },
      value: '6,212',
      label: 'Medical officers who resigned from the Ministry of Health, 2021–2025.',
      source: 'Dzulkefly Ahmad, written Dewan Negara reply, 2026.',
    },
  },
  {
    id: 'data-vacancies',
    act: 1,
    type: 'data',
    title: 'Show — vacant posts',
    layout: 'clipping-right',
    minutes: 0.5,
    block: 'leadership',
    notes:
      'Give the number, then be quiet for three seconds.\n\nIf asked: 1,660 specialist and 11,412 non-specialist posts, as at 30 June 2026. Written Dewan Rakyat reply to the Klang MP, 21 October 2026.',
    props: {
      drawing: 'stethoscope',
      value: '13,072',
      label: 'Vacant doctors’ posts in the Ministry of Health, as at 30 June 2026.',
      source: 'Dzulkefly Ahmad, written Dewan Rakyat reply, 2026.',
    },
  },
  {
    id: 'data-bullying',
    act: 1,
    type: 'data',
    title: 'Show — bullying',
    layout: 'clipping-right',
    minutes: 1,
    block: 'leadership',
    notes: 'This is the one the room already knows. Do not labour it.',
    props: {
      value: 'TODO_WRITE',
      unit: '%',
      label: 'TODO_WRITE — what the bullying study measured, in one line.',
      source: 'TODO_WRITE — study, journal and year.',
    },
  },
  {
    id: 'fw-boss-leader',
    act: 1,
    type: 'framework',
    title: 'Framework — Boss vs Leader',
    layout: 'board',
    minutes: 2.5,
    block: 'leadership',
    steps: 6,
    stepNotes: [
      'Leaders create a better future. Bosses cope with the present.',
      'Leaders are clear about their purpose. Bosses react.',
      'Leaders lead with values. Bosses command with position power.',
      'Leaders share authority. Bosses keep authority and hand out responsibility.',
      'Leaders move from "I" to "We".',
      'The closing line. Say it, then stop: coercion gets all of their hands, some of their minds, none of their hearts.',
    ],
    notes: 'Teach. One row per press. Let the two columns build side by side.',
    props: {
      framework: {
        name: 'Boss vs Leader',
        definition: 'The same post. Two entirely different jobs.',
        source: 'Rajeev Peshawaria, Iclif',
        model: {
          kind: 'compare',
          left: 'Leaders',
          right: 'Bosses',
          rows: [
            { left: 'create a better future', right: 'cling to the past and cope with the present' },
            { left: 'are clear about their purpose', right: 'live a reactive existence' },
            { left: 'lead with values', right: 'command with position power' },
            { left: 'share authority and responsibility', right: 'assign responsibility but keep authority' },
            { left: 'move from “I” to “We”', right: 'stay fixated on “I”' },
          ],
          closing: 'Coercion gets all of their hands, some of their minds, none of their hearts.',
        },
      },
    },
  },
  {
    id: 'vote-excuses',
    act: 1,
    type: 'wordcloud',
    title: 'Try — which excuse do you hear most',
    layout: 'board',
    minutes: 2,
    block: 'leadership',
    module: { kind: 'wordcloud', promptId: 'wc-hear-most' },
    notes:
      'Five phrases, one tap. Whichever wins, the answer is the same: it is a choice, repeated.',
    props: {},
  },
  {
    id: 'key-boss-leader',
    act: 1,
    type: 'keyidea',
    title: 'Key idea — indifference',
    layout: 'hero-center',
    minutes: 0.5,
    block: 'leadership',
    notes: 'Call back to the word cloud. Most of them wrote a version of this.',
    props: { headline: 'The opposite of leadership is indifference.' },
  },

  /* ==================================== BLOCK 2 · Leading Self · Purpose
     0:17–0:27
     ===================================================================== */
  {
    id: 'act-self',
    act: 2,
    type: 'actcard',
    title: 'Leading Self',
    layout: 'hero-center',
    minutes: 0.5,
    block: 'purpose',
    notes: 'Shift the energy. Stand somewhere else in the room.',
    props: { headline: 'LEADING SELF', sub: 'Purpose · Emotional intelligence' },
  },
  {
    id: 'fw-purpose',
    act: 2,
    type: 'framework',
    title: 'Framework — purpose and values',
    layout: 'hero-center',
    minutes: 2,
    block: 'purpose',
    steps: 3,
    stepNotes: [
      'Values: WHO you are. The principles that hold when you are tested.',
      'Purpose: WHAT you lead toward. The results you want to create.',
      'The overlap: the problem you care about. That is your why.',
    ],
    notes: 'Teach. Only two sources of lasting leadership energy, and neither is rank.',
    props: {
      framework: {
        name: 'Purpose and Values',
        definition:
          'The only two sources of lasting leadership energy are purpose — the results you want to create — and values, the principles that guide you when you are tested.',
        source: 'Iclif / Asia School of Business',
        model: {
          kind: 'venn',
          left: { name: 'Values', body: 'WHO you are. The principles that guide you when tested.' },
          right: { name: 'Purpose', body: 'WHAT you lead toward. The results you want to create.' },
          overlap: { name: 'Your why', body: 'The problem you care about.' },
        },
      },
    },
  },
  {
    id: 'fw-golden-circle',
    act: 2,
    type: 'framework',
    title: 'Framework — the golden circle',
    layout: 'hero-center',
    minutes: 1.5,
    block: 'purpose',
    steps: 3,
    stepNotes: [
      'Why. The belief. Start here.',
      'How. The way of working that makes the belief real.',
      'What. The tasks on the list. Most of us start here and never get back out.',
    ],
    notes:
      'Teach. Short — it is a lens on the previous screen, not a new idea.\n\nIt builds outwards from the centre, which is the whole argument. Do not let anyone read it from the outside in.',
    props: {
      framework: {
        name: 'The Golden Circle',
        definition: 'Start from the inside out: why, then how, then what.',
        source: 'Simon Sinek, Start With Why, 2009',
        model: {
          kind: 'circles',
          rings: [
            { name: 'Why', body: 'The belief that gets you out of bed.' },
            { name: 'How', body: 'The way you work that makes it real.' },
            { name: 'What', body: 'The tasks on the list.' },
          ],
        },
      },
    },
  },
  {
    id: 'fw-purpose-myths',
    act: 2,
    type: 'framework',
    title: 'Framework — five myths about purpose',
    layout: 'board',
    minutes: 1.5,
    block: 'purpose',
    steps: 5,
    stepNotes: [
      'A verb, not a noun. Not a cause you sign up to.',
      'A universal need, not a luxury for people whose money is sorted.',
      'A journey, not a revelation. Nobody gets struck by lightning.',
      'Any job. Including this one, on a bad week.',
      'Constant hard work. It is maintained, not discovered.',
    ],
    notes:
      'Teach. Aimed at the HO who thinks purpose is for people with time.\n\nRead the myth, let it sit for a beat, then strike it. Five presses, five corrections.',
    props: {
      framework: {
        name: 'Purpose myth-busting',
        definition: 'Purpose is not a calling that arrives. It is something you do.',
        source: 'Aaron Hurst, The Purpose Economy, 2014',
        model: {
          kind: 'myths',
          pairs: [
            {
              myth: 'Purpose is a cause.',
              truth: 'It is an approach to work and to serving others. A verb, not a noun.',
            },
            {
              myth: 'Purpose is a luxury.',
              truth: 'It is a universal need, not something you earn once the money is sorted.',
            },
            {
              myth: 'Purpose arrives as a revelation.',
              truth: 'It is a journey. It comes from living awake and seeking new experiences, not from above.',
            },
            {
              myth: 'Only some work generates purpose.',
              truth: 'You can find it in any job. It is all in how you approach it.',
            },
            {
              myth: 'Purpose is easy.',
              truth: 'It takes constant hard work, and giving of yourself.',
            },
          ],
        },
      },
    },
  },
  {
    id: 'wc-admire',
    act: 2,
    type: 'wordcloud',
    title: 'Try — a leader you admire',
    layout: 'board',
    minutes: 3,
    block: 'purpose',
    module: { kind: 'wordcloud', promptId: 'wc-admire' },
    notes:
      'Two minutes in threes first: who, and the one quality. Then the cloud.\n\nNobody writes "clever". It is always patience, calm, took responsibility. Say that out loud when the cloud settles.',
    props: { drawing: 'circle-of-figures' },
  },
  {
    id: 'key-purpose',
    act: 2,
    type: 'keyidea',
    title: 'Key idea — know your why',
    layout: 'hero-center',
    minutes: 0.5,
    block: 'purpose',
    notes: 'The 3 a.m. call back to the cold open.',
    props: { headline: 'Know your why before 3 a.m. asks you for it.' },
  },

  /* ========================================= BLOCK 3 · Leading Self · EI
     0:27–0:33
     ===================================================================== */
  {
    id: 'fw-ei',
    act: 2,
    type: 'framework',
    title: 'Framework — emotional intelligence',
    layout: 'board',
    minutes: 2.5,
    block: 'ei',
    steps: 6,
    stepNotes: [
      'Self-awareness.',
      'Self-regulation.',
      'Motivation.',
      'Empathy.',
      'Social skill.',
      'The grouping: the first three are leading self, the last two are leading others. And all five can be learned.',
    ],
    notes: 'Teach. One card per press. The last press groups them.',
    props: {
      framework: {
        name: 'Emotional intelligence',
        definition:
          'The ability to manage ourselves and our relationships effectively. It can be learned.',
        source: 'Daniel Goleman, "What Makes a Leader?", HBR 1998',
        model: {
          kind: 'cards',
          cards: [
            {
              name: 'Self-awareness',
              body: 'Knowing your moods, emotions and drives, and their effect on others.',
              group: 'Leading self',
            },
            {
              name: 'Self-regulation',
              body: 'Controlling or redirecting disruptive impulses; thinking before acting.',
              group: 'Leading self',
            },
            { name: 'Motivation', body: 'Working for reasons beyond money or status.', group: 'Leading self' },
            {
              name: 'Empathy',
              body: "Understanding others' emotional makeup and treating people accordingly.",
              group: 'Leading others',
            },
            {
              name: 'Social skill',
              body: 'Managing relationships, building networks, finding common ground.',
              group: 'Leading others',
            },
          ],
        },
      },
    },
  },
  {
    id: 'video-empathy',
    act: 2,
    type: 'video',
    title: 'Show — empathy clip',
    layout: 'full-bleed',
    minutes: 3,
    block: 'ei',
    notes: 'Plays on enter. Press B if the room needs to talk before it ends.',
    props: {
      src: '/media/empathy.mp4',
      caption: 'TODO_WRITE — one line of attribution.',
    },
  },
  {
    id: 'key-ei',
    act: 2,
    type: 'keyidea',
    title: 'Key idea — empathy',
    layout: 'hero-center',
    minutes: 0.5,
    block: 'ei',
    notes: 'Say it before it finishes typing if the clip has already landed it.',
    props: { headline: 'Empathy is concern for the human being, not just their output.' },
  },

  /* ====================================== BLOCK 4 · Leading Others · Trust
     0:33–0:44
     ===================================================================== */
  {
    id: 'act-others',
    act: 2,
    type: 'actcard',
    title: 'Leading Others',
    layout: 'hero-center',
    minutes: 0.5,
    block: 'trust',
    notes: 'Beat. Let the ink splash land.',
    props: { headline: 'LEADING OTHERS', sub: 'Trust · Styles' },
  },
  {
    id: 'fw-trust-equation',
    act: 2,
    type: 'framework',
    title: 'Framework — the trust equation',
    layout: 'board',
    minutes: 2,
    block: 'trust',
    steps: 5,
    stepNotes: [
      'Credibility.',
      'Reliability.',
      'Intimacy.',
      'Self-orientation. It sits under the line: it divides everything above it.',
      'The whole equation. Most people work on the top. The leverage is on the bottom.',
    ],
    notes: 'Teach. Build the fraction one term at a time.',
    props: {
      framework: {
        name: 'The trust equation',
        definition: 'Trustworthiness = (Credibility + Reliability + Intimacy) ÷ Self-orientation.',
        source: 'Maister, Green & Galford, The Trusted Advisor, 2000',
        model: {
          kind: 'equation',
          terms: [
            { name: 'Credibility', body: 'You know your stuff, and are honest about what you do not know.' },
            { name: 'Reliability', body: 'You do what you said, consistently.' },
            { name: 'Intimacy', body: 'People feel safe telling you things.' },
          ],
          divisor: {
            name: 'Self-orientation',
            body: 'Focus on yourself rather than them. It divides everything else.',
          },
        },
      },
    },
  },
  {
    id: 'fw-circle-safety',
    act: 2,
    type: 'framework',
    title: 'Framework — the circle of safety',
    layout: 'hero-center',
    minutes: 1,
    block: 'trust',
    steps: 2,
    stepNotes: [
      'The circle. Inside it, people are protected by their leader.',
      'The dangers stay outside, and the team faces them together.',
    ],
    notes: 'Teach, briefly. Then straight into Swenson.',
    props: {
      framework: {
        name: 'The circle of safety',
        definition:
          'People inside the circle are protected by their leader, so they face the dangers outside it together.',
        source: 'Simon Sinek, TED 2014',
        model: {
          kind: 'circles',
          rings: [
            { name: 'Inside', body: 'Protected by their leader.' },
            { name: 'Outside', body: 'The dangers, faced together.' },
          ],
        },
      },
    },
  },
  {
    id: 'video-swenson',
    act: 2,
    type: 'video',
    title: 'Show — Swenson',
    layout: 'full-bleed',
    minutes: 2,
    block: 'trust',
    notes: 'Plays on enter. Press B if the room needs to talk before it ends.',
    props: {
      src: '/media/swenson.mp4',
      caption: 'Capt. William Swenson, Ganjgal, Afghanistan, 2009. US Army helmet-camera footage.',
    },
  },
  {
    id: 'data-edmondson',
    act: 2,
    type: 'data',
    title: 'Show — Edmondson',
    layout: 'clipping-right',
    minutes: 1,
    block: 'trust',
    notes:
      'The counter-intuitive one. Better units reported MORE errors, because people felt safe to report them. Let them work it out.',
    props: {
      clipping: {
        kicker: 'Edmondson, 1996',
        headline: 'The better units reported more',
        body: 'Edmondson expected the best-led hospital units to make the fewest medication errors. They reported the most. The difference was not the error rate. It was whether staff felt safe enough to write it down.',
      },
      value: 'More',
      label: 'Errors reported by better-led hospital units.',
      source: 'Edmondson, 1996.',
    },
  },
  {
    id: 'data-shanafelt',
    act: 2,
    type: 'data',
    title: 'Show — Shanafelt',
    layout: 'clipping-right',
    minutes: 1,
    block: 'trust',
    notes:
      '2,813 physicians. One point of leadership score on your immediate supervisor. 3.3% lower odds of burnout, 9% higher odds of satisfaction.',
    props: {
      value: '3.3',
      unit: '%',
      label:
        'Lower odds of burnout for each one-point rise in the immediate supervisor’s leadership score.',
      source: 'Shanafelt et al., Mayo Clinic Proceedings, 2015. 2,813 physicians.',
    },
  },
  {
    id: 'fw-lencioni',
    act: 2,
    type: 'framework',
    title: 'Framework — the five dysfunctions',
    layout: 'hero-center',
    minutes: 1.5,
    block: 'trust',
    steps: 5,
    stepNotes: [
      'Trust: being vulnerable without fear.',
      'Constructive conflict: it only happens on top of trust.',
      'Commitment: clarity and buy-in.',
      'Accountability.',
      'Results. Note that results are at the top, not the bottom. You cannot start here.',
    ],
    notes: 'Teach. Build base to top, one level per press.',
    props: {
      framework: {
        name: 'The five dysfunctions of a team',
        definition: 'Each level only stands on the one below it.',
        source: 'Patrick Lencioni, The Five Dysfunctions of a Team, 2002',
        model: {
          kind: 'pyramid',
          levels: [
            { name: 'Trust', body: 'Being vulnerable without fear.' },
            { name: 'Constructive conflict', body: 'Disagreeing about the work, openly.' },
            { name: 'Commitment', body: 'Clarity and buy-in.' },
            { name: 'Accountability', body: 'Holding each other to it.' },
            { name: 'Results', body: 'Collective outcomes.' },
          ],
        },
      },
    },
  },
  {
    id: 'board-drains',
    act: 2,
    type: 'board',
    title: 'Try — drains / energises',
    layout: 'board',
    minutes: 1.5,
    block: 'trust',
    module: { kind: 'board', promptId: 'board-drains' },
    notes:
      'Approve as they come in. Hide anything with a name in it.\n\nStar three on each side and read them out. The drains column is almost never about clinical work.',
    props: {},
  },
  {
    id: 'key-trust',
    act: 2,
    type: 'keyidea',
    title: 'Key idea — thank you for telling me',
    layout: 'hero-center',
    minutes: 0.5,
    block: 'trust',
    notes: 'This is the single most portable line in the talk. Say it twice.',
    props: { headline: 'When someone reports a mistake, your first words are: thank you for telling me.' },
  },

  /* ===================================== BLOCK 5 · Leading Others · Styles
     0:44–0:54
     ===================================================================== */
  {
    id: 'fw-six-styles',
    act: 2,
    type: 'framework',
    title: 'Framework — six leadership styles',
    layout: 'board',
    minutes: 4,
    block: 'styles',
    steps: 7,
    stepNotes: [
      'Coercive. "Do what I tell you." Right in a crisis. Negative the rest of the time.',
      'Authoritative. "Come with me." The strongest single style, +.54.',
      'Affiliative. "People come first." Heals rifts. On its own, it has no standards.',
      'Democratic. "What do you think?" Not in an emergency.',
      'Pacesetting. "Do as I do, now." Looks like excellence. Burns a team out.',
      'Coaching. "Try this." The least used, and the one this room needs most.',
      'The closing line. Four or more styles, especially those four. Climate drives about a third of results.',
    ],
    notes:
      'Teach. One card per press; each card files itself along the bottom as the next arrives.\n\nBy the sixth, all six measures are on the strip and the pattern is visible without me saying it. Then the closing press.',
    props: {
      framework: {
        name: 'Six leadership styles',
        definition:
          'The most effective leaders use several distinct styles, each in the right measure at the right time.',
        source: 'Daniel Goleman, "Leadership That Gets Results", HBR 2000',
        model: { kind: 'styles', cards: SIX_STYLES, closing: SIX_STYLES_CLOSING },
      },
    },
  },
  {
    id: 'vote-potassium',
    act: 2,
    type: 'vote',
    title: 'Try — Boss or Leader? K+ 6.8',
    layout: 'board',
    minutes: 1.5,
    block: 'styles',
    module: { kind: 'vote', promptId: 'sc-potassium' },
    notes:
      'Read the vignette. 30 seconds. Do not reveal until everyone has voted.\n\nOn reveal: D is the trap. Warmth with no standards is not kindness.',
    props: {},
  },
  {
    id: 'vote-two',
    act: 2,
    type: 'vote',
    title: 'Try — Boss or Leader? scenario 2',
    layout: 'board',
    minutes: 1.5,
    block: 'styles',
    module: { kind: 'vote', promptId: 'sc-placeholder-2' },
    notes: 'TODO_WRITE — what this scenario is for.',
    props: {},
  },
  {
    id: 'vote-three',
    act: 2,
    type: 'vote',
    title: 'Try — Boss or Leader? scenario 3',
    layout: 'board',
    minutes: 1.5,
    block: 'styles',
    module: { kind: 'vote', promptId: 'sc-placeholder-3' },
    notes: 'TODO_WRITE — what this scenario is for.',
    props: {},
  },
  {
    id: 'vote-four',
    act: 2,
    type: 'vote',
    title: 'Try — Boss or Leader? scenario 4',
    layout: 'board',
    minutes: 1,
    block: 'styles',
    module: { kind: 'vote', promptId: 'sc-placeholder-4' },
    notes: 'TODO_WRITE — what this scenario is for.',
    props: {},
  },
  {
    id: 'key-styles',
    act: 2,
    type: 'keyidea',
    title: 'Key idea — the right style at the right time',
    layout: 'hero-center',
    minutes: 0.5,
    block: 'styles',
    notes: 'The whole block in one sentence. Nobody in this room disagrees with it.',
    props: { headline: 'Coercive at a resuscitation is right. Coercive on a ward round is not.' },
  },

  /* ======================================================= BLOCK 6 · Legacy
     0:54–1:00
     ===================================================================== */
  {
    id: 'act-legacy',
    act: 3,
    type: 'actcard',
    title: 'Legacy',
    layout: 'hero-center',
    minutes: 0.5,
    block: 'legacy',
    notes: 'Slow down. Quieter voice from here to the end.',
    props: { headline: 'LEGACY', sub: 'What you leave in the building' },
  },
  {
    id: 'timeline-135',
    act: 3,
    type: 'timeline',
    title: 'Show — 135 years',
    layout: 'split',
    minutes: 1.5,
    block: 'legacy',
    morphId: 'building-1910',
    notes:
      'The hospital was here before you and will be here after you. The only question is what you leave in it.',
    props: {
      drawing: 'window',
      src: '/images/kajang-hospital-1984.jpg',
      alt: 'Hospital Daerah Kajang, front view, photographed in 1984.',
      events: [
        { year: '1889', text: 'The hospital opens.' },
        { year: '1910', text: 'The building that is still in use goes up.' },
        { year: '1984', text: 'The photograph on the first screen of this talk.' },
        { year: 'Today', text: 'You are the senior somebody is working under.' },
      ],
    },
  },
  {
    id: 'fw-compassionate',
    act: 3,
    type: 'framework',
    title: 'Framework — compassionate leadership',
    layout: 'hero-center',
    minutes: 1.5,
    block: 'legacy',
    steps: 4,
    stepNotes: [
      'Attending: listening with fascination.',
      'Understanding: what is actually going on for them.',
      'Empathising: feeling it without drowning in it.',
      'Helping: doing something. This includes dealing firmly with poor behaviour. It is not soft.',
    ],
    notes: 'Teach. Four behaviours in a loop, not a ladder — it comes round again.',
    props: {
      framework: {
        name: 'Compassionate leadership',
        definition:
          'Four behaviours in a loop. It includes dealing firmly with poor behaviour; it is not “soft”.',
        source: 'Michael West, The King’s Fund',
        model: {
          kind: 'loop',
          steps: [
            { name: 'Attending', body: 'Listening with fascination.' },
            { name: 'Understanding', body: 'What is actually going on for them.' },
            { name: 'Empathising', body: 'Feeling it, without drowning in it.' },
            { name: 'Helping', body: 'Doing something about it.' },
          ],
          note: 'It is not soft.',
        },
      },
    },
  },
  {
    id: 'commitment',
    act: 3,
    type: 'statement',
    title: 'Try — commitment card',
    layout: 'hero-center',
    minutes: 1.5,
    block: 'legacy',
    notes: 'Paper cards go out now. Nothing is collected and nothing is typed. They keep the card.',
    props: {
      drawing: 'circle-of-figures',
      headline: 'This month I will be the senior I needed by…',
      sub: 'Write it on the card. Keep it where you can see it.',
    },
  },

  /* ========================================================= Close · 4 min */
  {
    id: 'building-return',
    act: 3,
    type: 'image',
    title: 'The building returns',
    layout: 'hero-center',
    minutes: 1.5,
    morphId: 'building-1910',
    notes: 'Same photograph as the cold open. Say: this room has had this conversation before.',
    props: {
      drawing: 'window',
      src: '/images/kajang-hospital-1984.jpg',
      alt: 'Hospital Daerah Kajang, front view, photographed in 1984.',
      stamp: 'Hospital Daerah Kajang · 1984',
    },
  },
  {
    id: 'close',
    act: 3,
    type: 'close',
    title: 'Close — torch ritual',
    layout: 'hero-center',
    minutes: 2.5,
    notes:
      'The collage peels away. When only the blot and the line are left, press B and ask everyone to switch on their phone torch.',
    props: { headline: 'Be the senior you needed.' },
  },
]

/** The 60-minute running order. */
export const SEQUENCE_60: string[] = SECTIONS.map((s) => s.id)

/**
 * The 45-minute cut: same blocks and the same frameworks, minus the empathy
 * clip, the Lencioni pyramid, the drains board, compassionate leadership and
 * two of the four scenarios.
 */
export const SEQUENCE_45: string[] = SEQUENCE_60.filter(
  (id) =>
    ![
      'video-empathy',
      'fw-lencioni',
      'board-drains',
      'fw-compassionate',
      'vote-three',
      'vote-four',
    ].includes(id),
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

/**
 * The facts of the session, read off the title screen so the index page and
 * the projector can never disagree about the date or who is giving it.
 */
export const SESSION = {
  get topic() {
    return BY_ID.get('title')?.props.headline ?? ''
  },
  get sub() {
    return BY_ID.get('title')?.props.sub ?? ''
  },
  get credits() {
    return BY_ID.get('title')?.props.credits ?? []
  },
  get date() {
    return BY_ID.get('title')?.props.dateStamp ?? ''
  },
}

/** How many clicker presses a section takes before it moves on. */
export const stepsOf = (section: Section | undefined) => Math.max(1, section?.steps ?? 1)
