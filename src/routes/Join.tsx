import { deviceId } from '../lib/device'
import { isBackendConfigured } from '../config'

/**
 * The audience screen. Fast and light: no photographs, no heavy motion — it
 * has to work on a cheap Android phone over 4G.
 */
export function Join() {
  const id = deviceId()
  return (
    <main
      style={{
        minHeight: '100svh',
        background: 'var(--color-cream)',
        color: 'var(--color-ink)',
        padding: '1.5rem 1.25rem 3rem',
        display: 'grid',
        gap: '1.5rem',
        alignContent: 'start',
      }}
    >
      <header style={{ display: 'grid', gap: '0.35rem' }}>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-type)',
            fontSize: '0.75rem',
            letterSpacing: '0.18em',
            color: 'var(--color-sepia)',
          }}
        >
          HTPN · Be the senior you needed
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 9vw, 3rem)',
            lineHeight: 0.95,
          }}
        >
          You are in.
        </h1>
      </header>

      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-body)',
          fontSize: '1.05rem',
          lineHeight: 1.55,
          maxWidth: '38ch',
        }}
      >
        Anonymous. I can&rsquo;t see who wrote what, and neither can your HOD.
      </p>

      <section
        style={{
          background: 'color-mix(in srgb, #fff 55%, var(--color-cream))',
          border: '1px solid color-mix(in srgb, var(--color-sepia) 35%, transparent)',
          padding: '1.25rem',
          display: 'grid',
          gap: '0.75rem',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem',
            lineHeight: 1.25,
          }}
        >
          Waiting for the next question
        </h2>
        <p style={{ margin: 0, fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
          Keep this page open. Tunggu sekejap — soalan akan keluar di skrin.
        </p>
        {!isBackendConfigured() ? (
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-type)',
              fontSize: '0.8rem',
              lineHeight: 1.5,
              color: 'var(--color-cobalt)',
            }}
          >
            Not connected yet — the backend lands in Phase 3 and this screen goes live in Phase 4.
          </p>
        ) : null}
      </section>

      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-type)',
          fontSize: '0.7rem',
          color: 'color-mix(in srgb, var(--color-sepia) 90%, var(--color-ink))',
        }}
      >
        Device {id.slice(0, 8)} · no name, no email, no phone number is collected.
      </p>
    </main>
  )
}
