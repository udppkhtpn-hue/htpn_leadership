export type Act = 1 | 2 | 3

export type SectionType =
  | 'actcard'
  | 'statement'
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
  /** Extra photographs for the collage, beyond the section's own `src`. */
  extras?: { src?: string; alt: string }[]
  /** Pulled quote set as a newspaper clipping in the margin. */
  clipping?: { kicker?: string; headline?: string; body: string }
}

export type Section = SectionBase
