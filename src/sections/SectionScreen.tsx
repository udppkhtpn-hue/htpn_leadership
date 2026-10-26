import { config } from '../config'
import { findBoardPrompt, findWordCloudPrompt } from '../content/prompts'
import { findScenario } from '../content/scenarios'
import type { Section } from '../content/types'
import { QrCode } from './QrCode'

/* ---------------------------------------------------------------------------
   Phase 1 screens: correct type, scale, palette and one hero per section.
   The collage layers (cutouts, tape, ink, clippings) arrive in Phase 2 and
   sit behind .hero — never over it.
   --------------------------------------------------------------------------- */

function Stamp({ children }: { children: string }) {
  return (
    <p
      className="m-0"
      style={{
        fontFamily: 'var(--font-type)',
        fontSize: 'var(--text-stamp)',
        letterSpacing: '0.18em',
        color: 'color-mix(in srgb, var(--color-sepia) 85%, var(--color-ink))',
      }}
    >
      {children}
    </p>
  )
}

function Display({ children, size = 'var(--text-hero)' }: { children: string; size?: string }) {
  return (
    <h1
      className="m-0"
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: size,
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
      className="m-0"
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--text-lead)',
        lineHeight: 1.45,
        maxWidth: '46ch',
        color: 'color-mix(in srgb, var(--color-ink) 88%, var(--color-cream))',
      }}
    >
      {children}
    </p>
  )
}

function ModulePlaceholder({ question, detail }: { question: string; detail: string }) {
  return (
    <div
      className="hero"
      style={{
        background: 'color-mix(in srgb, var(--color-cream) 92%, #fff)',
        padding: 'clamp(1.5rem, 4vw, 3.5rem)',
        boxShadow: '0 1.5rem 3rem -1rem color-mix(in srgb, var(--color-ink) 40%, transparent)',
        maxWidth: '68ch',
      }}
    >
      <Display size="var(--text-statement)">{question}</Display>
      <p
        style={{
          fontFamily: 'var(--font-type)',
          fontSize: 'var(--text-stamp)',
          letterSpacing: '0.12em',
          marginTop: '2rem',
          color: 'var(--color-cobalt)',
        }}
      >
        {detail}
      </p>
    </div>
  )
}

const frame: React.CSSProperties = {
  position: 'relative',
  zIndex: 20,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 'clamp(1rem, 2vw, 2rem)',
  padding: 'clamp(2rem, 5vw, 6rem)',
}

export function SectionScreen({ section, revealed }: { section: Section; revealed: boolean }) {
  const p = section.props
  const alignment: React.CSSProperties =
    section.layout === 'hero-left'
      ? { justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left' }
      : { justifyContent: 'center', alignItems: 'center', textAlign: 'center' }

  switch (section.type) {
    case 'actcard':
      return (
        <div style={{ ...frame, ...alignment }}>
          <div className="hero">
            <h1
              className="m-0"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-number)',
                lineHeight: 0.82,
                color: 'var(--color-cobalt)',
              }}
            >
              {p.headline}
            </h1>
            <p
              className="m-0"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'var(--text-title)',
                color: 'var(--color-ink)',
              }}
            >
              {p.sub}
            </p>
          </div>
        </div>
      )

    case 'statement':
      return (
        <div style={{ ...frame, ...alignment }}>
          <div className="hero" style={{ display: 'grid', gap: '1.25rem' }}>
            {p.stamp ? <Stamp>{p.stamp}</Stamp> : null}
            {p.headline ? <Display>{p.headline}</Display> : null}
            {p.quote ? (
              <blockquote
                className="m-0"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--text-statement)',
                  lineHeight: 1.1,
                  color: 'var(--color-ink)',
                }}
              >
                {p.quote}
              </blockquote>
            ) : null}
            {p.attribution ? <Stamp>{p.attribution}</Stamp> : null}
            {p.sub ? <Lead>{p.sub}</Lead> : null}
          </div>
        </div>
      )

    case 'data':
      return (
        <div style={{ ...frame, justifyContent: 'center', alignItems: 'flex-start' }}>
          <div className="hero" style={{ display: 'grid', gap: '0.5rem' }}>
            <p
              className="m-0"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-number)',
                lineHeight: 0.8,
                color: 'var(--color-cobalt)',
              }}
            >
              {p.value}
              {p.unit ? <span style={{ fontSize: '0.4em' }}>{p.unit}</span> : null}
            </p>
            <p
              className="m-0"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-title)',
                lineHeight: 1.25,
                maxWidth: '34ch',
              }}
            >
              {p.label}
            </p>
            {p.source ? <Stamp>{p.source}</Stamp> : null}
          </div>
        </div>
      )

    case 'image':
      return (
        <div style={{ ...frame, justifyContent: 'flex-end', alignItems: 'flex-start' }}>
          <div className="hero" style={{ display: 'grid', gap: '0.75rem' }}>
            {p.stamp ? <Stamp>{p.stamp}</Stamp> : null}
            {p.caption ? <Display size="var(--text-statement)">{p.caption}</Display> : null}
            <Stamp>{`image: ${p.src ?? 'missing'}`}</Stamp>
          </div>
        </div>
      )

    case 'video':
      return (
        <div style={{ ...frame, justifyContent: 'flex-end', alignItems: 'flex-start' }}>
          <div className="hero" style={{ display: 'grid', gap: '0.75rem' }}>
            <Display size="var(--text-statement)">{section.title}</Display>
            <Stamp>{`video: ${p.src ?? 'missing'} — plays on enter from Phase 5`}</Stamp>
          </div>
        </div>
      )

    case 'timeline':
      return (
        <div style={{ ...frame, justifyContent: 'center' }}>
          <ol className="hero m-0" style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.25rem' }}>
            {(p.events ?? []).map((event) => (
              <li key={event.year} style={{ display: 'flex', gap: '1.5rem', alignItems: 'baseline' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-type)',
                    fontSize: 'var(--text-title)',
                    color: 'var(--color-cobalt)',
                    minWidth: '6ch',
                  }}
                >
                  {event.year}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lead)' }}>
                  {event.text}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )

    case 'qr':
      return (
        <div style={{ ...frame, ...alignment }}>
          <div className="hero" style={{ display: 'grid', gap: '1.5rem', justifyItems: 'center' }}>
            {p.headline ? <Display size="var(--text-statement)">{p.headline}</Display> : null}
            <QrCode value={config.joinUrl} />
            <p
              className="m-0"
              style={{
                fontFamily: 'var(--font-type)',
                fontSize: 'var(--text-title)',
                letterSpacing: '0.04em',
                color: 'var(--color-cobalt)',
              }}
            >
              {config.joinUrlShort}
            </p>
            {p.sub ? <Lead>{p.sub}</Lead> : null}
          </div>
        </div>
      )

    case 'wordcloud': {
      const prompt = section.module ? findWordCloudPrompt(section.module.promptId) : undefined
      return (
        <div style={{ ...frame, ...alignment }}>
          <ModulePlaceholder
            question={prompt?.question ?? section.title}
            detail="Live word cloud — wired to the backend in Phase 4"
          />
        </div>
      )
    }

    case 'board': {
      const prompt = section.module ? findBoardPrompt(section.module.promptId) : undefined
      return (
        <div style={{ ...frame, ...alignment }}>
          <ModulePlaceholder
            question={prompt?.question ?? section.title}
            detail="Moderated board — wired to the backend in Phase 4"
          />
        </div>
      )
    }

    case 'vote': {
      const scenario = section.module ? findScenario(section.module.promptId) : undefined
      return (
        <div style={{ ...frame, justifyContent: 'center' }}>
          <div
            className="hero"
            style={{
              background: 'color-mix(in srgb, var(--color-cream) 92%, #fff)',
              padding: 'clamp(1.5rem, 4vw, 3.5rem)',
              boxShadow: '0 1.5rem 3rem -1rem color-mix(in srgb, var(--color-ink) 40%, transparent)',
              maxWidth: '72ch',
              display: 'grid',
              gap: '1.5rem',
            }}
          >
            <p
              className="m-0"
              style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-title)', lineHeight: 1.3 }}
            >
              {scenario?.vignette}
            </p>
            <ol className="m-0" style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.9rem' }}>
              {(scenario?.options ?? []).map((option) => (
                <li key={option.key} style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-title)',
                      color: 'var(--color-cobalt)',
                    }}
                  >
                    {option.key}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lead)' }}>
                    {option.text}
                    {revealed ? ` — ${option.style}` : ''}
                  </span>
                </li>
              ))}
            </ol>
            <Stamp>{revealed ? 'Revealed' : 'Press R to reveal the styles'}</Stamp>
          </div>
        </div>
      )
    }

    case 'close':
      return (
        <div style={{ ...frame, ...alignment }}>
          <div className="hero">
            <Display>{p.headline ?? 'Be the senior you needed.'}</Display>
          </div>
        </div>
      )
  }
}
