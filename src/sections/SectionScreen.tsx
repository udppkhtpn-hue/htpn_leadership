import type { CSSProperties } from 'react'
import { config } from '../config'
import type { Section } from '../content/types'
import { QrCode } from './QrCode'
import { LiveSection } from './LiveSection'
import { Composition } from './Composition'
import { VideoSection } from './VideoSection'
import { FrameworkScreen } from './FrameworkScreen'
import { KeyIdea } from './KeyIdea'
import { Drop, InkBlot, PhotoCutout, SplitFlapNumber, Stamp, TapeStrip } from '../collage'

/* ---------------------------------------------------------------------------
   One hero per screen, in a column the collage never enters. Rotation stays
   inside the brief's 3 degrees and contrast stays at full: everything else on
   the poster is atmosphere.
   --------------------------------------------------------------------------- */

const HERO_WIDTH: Record<string, string> = {
  'hero-center': 'min(72%, 68rem)',
  'hero-left': 'min(66%, 62rem)',
  'clipping-right': 'min(56%, 50rem)',
  'full-bleed': 'min(76%, 74rem)',
  board: 'min(96%, 82rem)',
  split: 'min(74%, 62rem)',
}

/**
 * Display type is sized against the length of the line, not just the viewport.
 * A four-word statement should fill the sheet; a forty-word one still has to
 * fit on it, and on a projector there is no scrolling to rescue an overflow.
 */
function displaySize(text: string): string {
  const n = text.length
  if (n <= 16) return 'var(--text-hero)'
  if (n <= 30) return 'calc(var(--text-hero) * 0.8)'
  if (n <= 52) return 'calc(var(--text-hero) * 0.6)'
  if (n <= 88) return 'calc(var(--text-hero) * 0.46)'
  return 'calc(var(--text-hero) * 0.36)'
}

function figureSize(value: string): string {
  if (value.length <= 4) return 'var(--text-number)'
  if (value.length <= 6) return 'calc(var(--text-number) * 0.78)'
  return 'calc(var(--text-number) * 0.5)'
}

function stage(section: Section): CSSProperties {
  const left = section.layout === 'hero-left' || section.layout === 'clipping-right'
  return {
    position: 'absolute',
    inset: 0,
    zIndex: 20,
    display: 'grid',
    placeContent: 'center',
    justifyItems: left ? 'start' : 'center',
    textAlign: left ? 'left' : 'center',
    padding: 'clamp(2rem, 6vw, 7rem)',
  }
}

function Display({ children, size }: { children: string; size?: string }) {
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontSize: size ?? displaySize(children),
        lineHeight: 0.92,
        letterSpacing: '-0.01em',
        color: 'var(--color-ink)',
        textWrap: 'balance',
      }}
    >
      {children}
    </h1>
  )
}

function Lead({ children }: { children: string }) {
  return (
    <p
      style={{
        margin: 0,
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--text-lead)',
        lineHeight: 1.45,
        color: 'color-mix(in srgb, var(--color-ink) 86%, var(--color-cream))',
      }}
    >
      {children}
    </p>
  )
}

export interface SectionScreenProps {
  section: Section
  /** Reveal step within this screen, 0-based. */
  step: number
  revealed: boolean
  enteredAt: number
  paused: boolean
}

export function SectionScreen({ section, step, revealed, enteredAt, paused }: SectionScreenProps) {
  const p = section.props
  const heroStyle: CSSProperties = {
    maxWidth: HERO_WIDTH[section.layout] ?? 'min(70%, 62rem)',
    display: 'grid',
    gap: 'clamp(0.75rem, 1.5vw, 1.5rem)',
    justifyItems: 'inherit',
  }

  // Live modules own the whole sheet; the collage stays thin behind them.
  if (section.type === 'wordcloud' || section.type === 'board' || section.type === 'vote') {
    return (
      <>
        <Composition section={section} />
        <div style={{ ...stage(section), padding: 'clamp(1rem, 3vw, 3rem)' }}>
          <div className="hero" style={{ maxWidth: HERO_WIDTH.board, width: '100%' }}>
            <LiveSection section={section} revealed={revealed} enteredAt={enteredAt} paused={paused} />
          </div>
        </div>
      </>
    )
  }

  // Teaching screens. The collage stays thin: a framework has to be copied
  // into a notebook from the back row, and a key idea is one line of type.
  if (section.type === 'framework' && p.framework) {
    return (
      <>
        <Composition section={section} />
        <FrameworkScreen framework={p.framework} step={step} />
      </>
    )
  }

  if (section.type === 'keyidea') {
    return (
      <>
        <Composition section={section} />
        <KeyIdea text={p.headline ?? ''} sectionId={section.id} />
      </>
    )
  }

  if (section.type === 'actcard') {
    return (
      <>
        <Composition section={section} />
        <div style={stage(section)}>
          <InkBlot
            seed={`${section.id}:splash`}
            size="min(46vw, 34rem)"
            opacity={0.5}
            style={{ left: '50%', top: '50%', translate: '-50% -50%', zIndex: 10 }}
          />
          <div className="hero" style={{ ...heroStyle, justifyItems: 'center' }}>
            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontSize: figureSize(p.headline ?? ''),
                lineHeight: 0.82,
                color: 'var(--color-ink)',
                whiteSpace: 'nowrap',
              }}
            >
              {p.headline}
            </h1>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'var(--text-title)',
              }}
            >
              {p.sub}
            </p>
          </div>
        </div>
      </>
    )
  }

  if (section.type === 'video') {
    return (
      <>
        <Composition section={section} />
        <VideoSection section={section} paused={paused} />
      </>
    )
  }

  if (section.type === 'image') {
    const coldOpen = section.id === 'cold-open'
    return (
      <>
        <Composition section={section} stretch={coldOpen ? 5 : 1} />
        <div style={{ ...stage(section), padding: 'clamp(1.5rem, 4vw, 4rem)' }}>
          <div className="hero" style={{ display: 'grid', gap: '1rem', justifyItems: 'center', maxWidth: '62%' }}>
            <Drop seed={`${section.id}:hero-photo`} delay={coldOpen ? 13 : 0.35} rotate={-1.5}>
              <PhotoCutout
                seed={`${section.id}:hero`}
                morphId={section.morphId}
                src={p.src}
                alt={p.alt ?? section.title}
                edge="torn"
                halftone={section.act === 1}
                idle={false}
                style={{ width: '100%', aspectRatio: '3 / 2' }}
              />
            </Drop>
            {p.stamp ? <Stamp seed={section.id}>{p.stamp}</Stamp> : null}
            {p.caption ? <Display size="var(--text-statement)">{p.caption}</Display> : null}
          </div>
        </div>
      </>
    )
  }

  if (section.type === 'data') {
    return (
      <>
        <Composition section={section} />
        <div style={stage(section)}>
          <Drop seed={`${section.id}:figure`} delay={0.3} rotate={-1.2}>
            <div
              className="hero"
              style={{
                background: 'color-mix(in srgb, var(--color-sepia-light) 32%, #fff)',
                padding: 'clamp(1.25rem, 3vw, 2.75rem)',
                boxShadow: '0.35rem 0.4rem 0 color-mix(in srgb, var(--color-ink) 18%, transparent)',
                display: 'grid',
                gap: '0.5rem',
                justifyItems: 'start',
                textAlign: 'left',
                maxWidth: 'min(62vw, 44rem)',
              }}
            >
              <div style={{ height: 2, width: '100%', background: 'var(--color-ink)' }} />
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontSize: figureSize(p.value ?? ''),
                  lineHeight: 0.8,
                  color: 'var(--color-cobalt)',
                  whiteSpace: 'nowrap',
                }}
              >
                <SplitFlapNumber value={p.value ?? ''} delay={0.5} />
                {p.unit ? <span style={{ fontSize: '0.4em' }}>{p.unit}</span> : null}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-title)',
                  lineHeight: 1.25,
                }}
              >
                {p.label}
              </p>
              {p.source ? <Stamp seed={`${section.id}:source`}>{p.source}</Stamp> : null}
            </div>
          </Drop>
        </div>
      </>
    )
  }

  if (section.type === 'timeline') {
    return (
      <>
        <Composition section={section} />
        <div style={{ ...stage(section), justifyItems: 'center' }}>
          <ol
            className="hero"
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'grid',
              gap: 'clamp(0.75rem, 1.8vw, 1.5rem)',
              maxWidth: 'min(80%, 54rem)',
              textAlign: 'left',
            }}
          >
            {(p.events ?? []).map((event, index) => (
              <li key={event.year} style={{ display: 'flex', gap: 'clamp(1rem, 2.5vw, 2rem)', alignItems: 'baseline' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-type)',
                    fontSize: 'var(--text-title)',
                    color: 'var(--color-cobalt)',
                    minWidth: '5.5ch',
                  }}
                >
                  {event.year}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lead)', lineHeight: 1.35 }}>
                  {event.text}
                </span>
                {index === 0 ? null : null}
              </li>
            ))}
          </ol>
        </div>
      </>
    )
  }

  if (section.type === 'qr') {
    return (
      <>
        <Composition section={section} />
        <div style={stage(section)}>
          <div className="hero" style={{ ...heroStyle, justifyItems: 'center', maxWidth: 'min(70%, 40rem)' }}>
            {p.headline ? <Display size="var(--text-statement)">{p.headline}</Display> : null}
            <div style={{ position: 'relative', padding: '1rem', background: '#fff' }}>
              <TapeStrip seed={`${section.id}:qr-tape`} length="6rem" style={{ top: '-1rem', left: '20%' }} />
              <QrCode value={config.joinUrl} size={360} />
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-type)',
                fontSize: 'var(--text-title)',
                color: 'var(--color-cobalt)',
                whiteSpace: 'nowrap',
              }}
            >
              {config.joinUrlShort}
            </p>
            {p.sub ? <Lead>{p.sub}</Lead> : null}
          </div>
        </div>
      </>
    )
  }

  if (section.type === 'close') {
    return (
      <>
        <div className="collage-layer" aria-hidden="true">
          <InkBlot
            seed={`${section.id}:final`}
            size="min(30vw, 22rem)"
            opacity={0.55}
            style={{ left: '12%', bottom: '14%' }}
          />
        </div>
        <div style={stage(section)}>
          <div className="hero" style={{ ...heroStyle, maxWidth: 'min(74%, 56rem)' }}>
            <Display>{p.headline ?? 'Be the senior you needed.'}</Display>
          </div>
        </div>
      </>
    )
  }

  // statement, and anything else that is one line of type on paper
  return (
    <>
      <Composition section={section} />
      <div style={stage(section)}>
        <div className="hero" style={heroStyle}>
          {p.stamp ? <Stamp seed={section.id}>{p.stamp}</Stamp> : null}
          {p.headline ? <Display>{p.headline}</Display> : null}
          {p.quote ? (
            <blockquote
              style={{
                margin: 0,
                fontFamily: 'var(--font-serif)',
                fontSize: `calc(${displaySize(p.quote)} * 0.82)`,
                lineHeight: 1.12,
              }}
            >
              {p.quote}
            </blockquote>
          ) : null}
          {p.attribution ? <Stamp seed={`${section.id}:attr`}>{p.attribution}</Stamp> : null}
          {p.sub ? <Lead>{p.sub}</Lead> : null}
        </div>
      </div>
    </>
  )
}
