import { Fragment } from 'react'
import { SESSION } from '../content/sections'
import { go, type Route } from '../lib/router'
// The index borrows the title screen's stamp and form, so it needs their rules.
import '../styles/collage.css'

const LINKS: { route: Route; label: string; detail: string }[] = [
  { route: 'present', label: '#/present', detail: 'Projector screen' },
  { route: 'presenter', label: '#/presenter', detail: 'Laptop console, PIN-gated' },
  { route: 'join', label: '#/join', detail: 'Audience phones' },
  { route: 'styleguide', label: '#/styleguide', detail: 'Collage components — Phase 2' },
  { route: 'test', label: '#/test', detail: '150 simulated phones — Phase 4' },
  { route: 'print', label: '#/print', detail: 'Backup PDF of static sections — Phase 5' },
]

/**
 * The index. Not the projector screen, but the first thing anyone opening the
 * link sees, so it says what the session is, who is giving it and when before
 * it offers the routes.
 */
export function Placeholder({ title, detail }: { title: string; detail?: string }) {
  return (
    <main
      style={{
        minHeight: '100svh',
        background: 'var(--color-cream)',
        color: 'var(--color-ink)',
        padding: 'clamp(1.5rem, 5vw, 4rem)',
        display: 'grid',
        gap: '1.5rem',
        alignContent: 'start',
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          lineHeight: 0.95,
        }}
      >
        {title}
      </h1>
      {detail ? (
        <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '1.1rem', maxWidth: '54ch' }}>
          {detail}
        </p>
      ) : null}
      <div className="titlecard__foot" style={{ maxWidth: '54ch' }}>
        <dl className="titlecard__credits">
          {SESSION.credits.map((credit) => (
            <Fragment key={credit.label}>
              <dt className="titlecard__label">{credit.label}</dt>
              <dd className="titlecard__value">{credit.value}</dd>
            </Fragment>
          ))}
        </dl>
        <span className="stamp stamp--rubber titlecard__date">{SESSION.date}</span>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '0.5rem' }}>
        {LINKS.map((link) => (
          <li key={link.route}>
            <button
              type="button"
              onClick={() => go(link.route)}
              style={{
                font: 'inherit',
                fontFamily: 'var(--font-type)',
                background: 'transparent',
                border: 0,
                borderBottom: '1px solid color-mix(in srgb, var(--color-sepia) 45%, transparent)',
                padding: '0.75rem 0',
                minHeight: '44px',
                cursor: 'pointer',
                color: 'var(--color-cobalt)',
                textAlign: 'left',
                width: '100%',
              }}
            >
              {link.label} — <span style={{ color: 'var(--color-ink)' }}>{link.detail}</span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
