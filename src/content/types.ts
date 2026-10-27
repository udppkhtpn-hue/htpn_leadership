export type Act = 1 | 2 | 3

export type SectionType =
  | 'actcard'
  | 'statement'
  | 'framework'
  | 'keyidea'
  | 'data'
  | 'image'
  | 'video'
  | 'timeline'
  | 'qr'
  | 'wordcloud'
  | 'board'
  | 'vote'
  | 'close'

export type LayoutPreset =
  | 'hero-center'
  | 'hero-left'
  | 'clipping-right'
  | 'full-bleed'
  | 'board'
  | 'split'

export type ModuleKind = 'wordcloud' | 'board' | 'vote'

/** A live module opens for phones when its section is entered, closes on exit. */
export interface SectionModule {
  kind: ModuleKind
  /** Prompt or scenario id; the backend keys responses on this. */
  promptId: string
}

/**
 * Where this screen sits on the progress map. The map shows four stations;
 * `purpose` and `ei` share the Leading Self station, `trust` and `styles`
 * share Leading Others, and the station names the part when one is current.
 */
export type BlockId = 'leadership' | 'purpose' | 'ei' | 'trust' | 'styles' | 'legacy'

/* ----------------------------------------------------------------- models --
   A framework's model is drawn, not bulleted. Each kind is a different
   physical object on the poster, and each reveals one element per clicker
   press. Only `styles` is drawn so far; the rest render a visible [TODO]
   plate until their block is built.
   -------------------------------------------------------------------------- */

export interface StyleCard {
  name: string
  /** The phrase a leader using this style says. Shown in quotes. */
  phrase: string
  /** One sentence: when this style is the right one. */
  whenItWorks: string
  /** Goleman's published correlation with organisational climate. */
  correlation: number
}

export type FrameworkModel =
  | { kind: 'styles'; cards: StyleCard[]; closing: string }
  | {
      kind: 'compare'
      left: string
      right: string
      rows: { left: string; right: string }[]
      closing?: string
    }
  | { kind: 'cards'; cards: { name: string; body: string; group?: string }[] }
  | { kind: 'equation'; terms: { name: string; body: string }[]; divisor: { name: string; body: string } }
  | { kind: 'pyramid'; levels: { name: string; body: string }[] }
  | { kind: 'loop'; steps: { name: string; body: string }[]; note?: string }
  | { kind: 'venn'; left: { name: string; body: string }; right: { name: string; body: string }; overlap: string }
  | { kind: 'circles'; rings: { name: string; body: string }[] }
  | { kind: 'quotes'; quotes: { text: string; source: string }[] }
  | { kind: 'list'; items: { name: string; body: string }[] }

export interface Framework {
  /** The framework's own name, set as a label rather than a hero. */
  name: string
  /** One sentence. What this framework says. */
  definition?: string
  /** Author and year, pressed in as a stamp. Always shown. */
  source?: string
  model?: FrameworkModel
}

export interface SectionBase {
  id: string
  act: Act
  type: SectionType
  /** Shown on #/presenter and #/print, not necessarily on the projector. */
  title: string
  layout: LayoutPreset
  /** What I say here. Plain text; blank lines separate paragraphs. */
  notes: string
  /** Target duration in minutes, used for the per-section timer. */
  minutes: number
  /** Which block of the teaching spine this screen belongs to. */
  block?: BlockId
  /**
   * How many clicker presses this screen takes before moving on. 1 (the
   * default) means the screen is whole the moment it lands. A framework
   * screen counts one step per element it reveals.
   */
  steps?: number
  /** One note per step, shown on #/presenter beside "3 of 6". */
  stepNotes?: string[]
  module?: SectionModule
  /** Collage density override, 1 (quiet) to 3 (dense). Defaults from act. */
  density?: 1 | 2 | 3
  /** Shared-element id, so the same photo morphs across sections. */
  morphId?: string
  props: SectionProps
}

export interface SectionProps {
  /** Big line, set in the display face. */
  headline?: string
  /** Supporting line under the headline. */
  sub?: string
  /** Attributed quote, set in the serif. */
  quote?: string
  attribution?: string
  /** framework sections */
  framework?: Framework
  /** data sections */
  value?: string
  unit?: string
  label?: string
  source?: string
  /** image / video sections */
  src?: string
  alt?: string
  caption?: string
  /** timeline sections */
  events?: { year: string; text: string }[]
  /** stamp text, e.g. "WARD 7 · 1910" */
  stamp?: string
  /** A line drawing for this screen's margin, when one earns its place. */
  drawing?: 'hand' | 'stethoscope' | 'lamp' | 'window' | 'circle-of-figures'
  /**
   * Extra photographs for the collage, beyond the section's own `src`.
   * `plain` marks an image that already arrives as a collage piece — torn,
   * taped, on its own ground — so it is not cut out a second time.
   */
  extras?: { src?: string; alt: string; plain?: boolean }[]
  /** Pulled quote set as a newspaper clipping in the margin. */
  clipping?: { kicker?: string; headline?: string; body: string }
}

export type Section = SectionBase
