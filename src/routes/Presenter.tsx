import { useCallback, useState } from 'react'
import '../styles/presenter.css'
import { usePresentation } from '../state/PresentationProvider'
import { toggleFullscreen, usePresentationKeys } from '../lib/keys'
import { SEQUENCES, totalMinutes, type SequenceId } from '../content/sections'
import { formatClock, formatSigned, useClock } from '../lib/time'
import { isBackendConfigured } from '../config'

const PIN_KEY = 'htpn.pin'

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('')
  return (
    <form
      className="console"
      style={{ gridTemplateColumns: 'minmax(0, 420px)', alignContent: 'center', justifyContent: 'center' }}
      onSubmit={(event) => {
        event.preventDefault()
        if (!pin.trim()) return
        sessionStorage.setItem(PIN_KEY, pin.trim())
        onUnlock()
      }}
    >
      <div className="console__panel">
        <p className="console__label">Presenter console</p>
        <label htmlFor="pin" style={{ display: 'block', marginBottom: '0.75rem' }}>
          Enter your PIN
        </label>
        <input
          id="pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          style={{ width: '100%', marginBottom: '0.75rem' }}
        />
        <button type="submit">Unlock console</button>
        <p className="console__warn" style={{ marginTop: '1rem' }}>
          The PIN is checked by the backend from Phase 3. Until then any value unlocks this screen
          locally; nothing is sent anywhere.
        </p>
      </div>
    </form>
  )
}

export function Presenter() {
  const [unlocked, setUnlocked] = useState(() => Boolean(sessionStorage.getItem(PIN_KEY)))
  const { state, sections, section, nextSection, moduleOpen, goTo, next, prev, toggle, setSequence, restart } =
    usePresentation()
  const now = useClock()

  const keys = {
    next,
    prev,
    jump: goTo,
    blackout: useCallback(() => toggle('blackout'), [toggle]),
    reveal: useCallback(() => toggle('revealed'), [toggle]),
    hideCursor: useCallback(() => toggle('hideCursor'), [toggle]),
    fullscreen: toggleFullscreen,
  }
  usePresentationKeys(keys, unlocked)

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />

  const elapsed = state.startedAt ? now - state.startedAt : 0
  const onSection = now - state.sectionEnteredAt
  const budget = section.minutes * 60_000
  const drift = onSection - budget

  return (
    <div className="console">
      <div style={{ display: 'grid', gap: '1rem', alignContent: 'start' }}>
        <section className="console__panel">
          <p className="console__label">
            Now · {state.index + 1} of {sections.length} · Act {section.act} · {section.minutes} min
          </p>
          <h1 className="console__now">{section.title}</h1>
          <div className="console__timers" style={{ marginTop: '0.75rem' }}>
            <span title="Talk elapsed">{formatClock(elapsed)}</span>
            <span title="This section" className={drift > 0 ? 'console__over' : undefined}>
              {formatClock(onSection)} <small>({formatSigned(drift)})</small>
            </span>
          </div>
          <p className="console__label" style={{ marginTop: '0.75rem' }}>
            Next · {nextSection ? nextSection.title : 'end of talk'}
          </p>
        </section>

        <section className="console__panel">
          <p className="console__label">Notes</p>
          <p className="console__notes">{section.notes}</p>
        </section>

        <section className="console__panel">
          <p className="console__label">Controls</p>
          <div className="console__row">
            <button type="button" onClick={prev}>
              ← Previous
            </button>
            <button type="button" onClick={next}>
              Next →
            </button>
            <button type="button" aria-pressed={state.blackout} onClick={() => toggle('blackout')}>
              Blackout (B)
            </button>
            <button type="button" aria-pressed={state.revealed} onClick={() => toggle('revealed')}>
              Reveal (R)
            </button>
            <button type="button" aria-pressed={state.frozen} onClick={() => toggle('frozen')}>
              Freeze module
            </button>
            <button type="button" aria-pressed={state.hideCursor} onClick={() => toggle('hideCursor')}>
              Hide cursor (H)
            </button>
            <button type="button" aria-pressed={state.reducedEffects} onClick={() => toggle('reducedEffects')}>
              Reduced effects
            </button>
            <button type="button" onClick={toggleFullscreen}>
              Fullscreen (F)
            </button>
            <button type="button" onClick={restart}>
              Back to start
            </button>
          </div>
          <p className="console__label" style={{ marginTop: '0.75rem' }}>
            → / PageDown / Space next · ← / PageUp back · 1–9 jump · B blackout · R reveal · F fullscreen · H
            cursor
          </p>
        </section>

        <section className="console__panel">
          <p className="console__label">Live module</p>
          {section.module ? (
            <p style={{ margin: 0 }}>
              {section.module.kind} · {section.module.promptId} ·{' '}
              {moduleOpen ? 'open for phones' : 'closed'}
            </p>
          ) : (
            <p style={{ margin: 0 }}>No module on this section.</p>
          )}
          <p className="console__warn" style={{ marginTop: '0.75rem' }}>
            {isBackendConfigured()
              ? 'Backend configured.'
              : 'No backend URL in src/config.ts — live modules are inert and phones cannot submit. Fallback: printed A/B/C/D cards and hands up.'}
          </p>
        </section>
      </div>

      <div style={{ display: 'grid', gap: '1rem', alignContent: 'start' }}>
        <section className="console__panel">
          <p className="console__label">Running order</p>
          <label htmlFor="seq" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Sequence
          </label>
          <select
            id="seq"
            value={state.sequence}
            onChange={(event) => setSequence(event.target.value as SequenceId)}
            style={{ width: '100%', marginBottom: '0.75rem' }}
          >
            {(Object.keys(SEQUENCES) as SequenceId[]).map((id) => (
              <option key={id} value={id}>
                {SEQUENCES[id].label} — {totalMinutes(id)} min planned
              </option>
            ))}
          </select>
          <ol className="console__list">
            {sections.map((item, itemIndex) => (
              <li key={item.id} data-current={itemIndex === state.index}>
                <button type="button" onClick={() => goTo(itemIndex)}>
                  {String(itemIndex + 1).padStart(2, '0')} · {item.title}
                </button>
              </li>
            ))}
          </ol>
        </section>

        <section className="console__panel">
          <p className="console__label">Moderation</p>
          <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>
            The approve / hide / star queue for the drains board arrives in Phase 4, once the Apps Script
            backend is deployed.
          </p>
        </section>
      </div>
    </div>
  )
}
