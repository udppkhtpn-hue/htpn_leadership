import { useCallback, useEffect, useRef, useState } from 'react'
import '../styles/presenter.css'
import { usePresentation } from '../state/PresentationProvider'
import { toggleFullscreen, usePresentationKeys } from '../lib/keys'
import { SEQUENCES, totalMinutes, type SequenceId } from '../content/sections'
import { formatClock, formatSigned, useClock } from '../lib/time'
import { config, isBackendConfigured } from '../config'
import { usePolling } from '../lib/polling'
import {
  control,
  exportUrl,
  getPending,
  getResults,
  health,
  ping,
  verifyPin,
  type ControlOp,
  type PendingNote,
  type ResultsEnvelope,
} from '../lib/api'

const PIN_KEY = 'htpn.pin'
const MAX_STARS = 3

function PinGate({ onUnlock }: { onUnlock: (pin: string) => void }) {
  const [pin, setPin] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <form
      className="console"
      style={{ gridTemplateColumns: 'minmax(0, 420px)', alignContent: 'center', justifyContent: 'center' }}
      onSubmit={async (event) => {
        event.preventDefault()
        const value = pin.trim()
        if (!value) return
        setChecking(true)
        setError(null)
        const good = isBackendConfigured() ? await verifyPin(value) : true
        setChecking(false)
        if (!good) {
          setError('The backend rejected that PIN.')
          return
        }
        sessionStorage.setItem(PIN_KEY, value)
        onUnlock(value)
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
        <button type="submit" disabled={checking}>
          {checking ? 'Checking…' : 'Unlock console'}
        </button>
        {error ? (
          <p className="console__warn console__over" style={{ marginTop: '1rem' }}>
            {error}
          </p>
        ) : null}
      </div>
    </form>
  )
}

export function Presenter() {
  const [pin, setPin] = useState(() => sessionStorage.getItem(PIN_KEY) ?? '')
  const {
    state,
    sections,
    section,
    nextSection,
    steps,
    moduleOpen,
    goTo,
    next,
    prev,
    toggle,
    setSequence,
    restart,
  } = usePresentation()
  const now = useClock()
  const stepNote = steps > 1 ? (section.stepNotes?.[state.step] ?? null) : null
  const [lastControl, setLastControl] = useState<string | null>(null)
  const pushedFor = useRef('')

  const send = useCallback(
    async (operation: ControlOp) => {
      if (!pin || !isBackendConfigured()) return
      const result = await control(pin, operation)
      setLastControl(result.ok ? null : `${operation.op}: ${result.error}`)
    },
    [pin],
  )

  // Entering a section with a live module opens it for phones; leaving closes it.
  useEffect(() => {
    if (!pin || !isBackendConfigured()) return
    if (pushedFor.current === section.id) return
    pushedFor.current = section.id
    void send({
      op: 'set',
      sectionId: section.id,
      moduleKind: section.module?.kind ?? '',
      promptId: section.module?.promptId ?? '',
      open: Boolean(section.module),
    })
  }, [pin, section.id, section.module, send])

  // Reveal and freeze have to reach the phones and the projector, not just this
  // window, so they go to the backend as well as over BroadcastChannel.
  useEffect(() => {
    if (!pin) return
    void send({ op: 'reveal', revealed: state.revealed })
  }, [pin, state.revealed, send])

  useEffect(() => {
    if (!pin) return
    void send({ op: 'freeze', frozen: state.frozen })
  }, [pin, state.frozen, send])

  const keys = {
    next,
    prev,
    jump: goTo,
    blackout: useCallback(() => toggle('blackout'), [toggle]),
    reveal: useCallback(() => toggle('revealed'), [toggle]),
    hideCursor: useCallback(() => toggle('hideCursor'), [toggle]),
    fullscreen: toggleFullscreen,
  }
  usePresentationKeys(keys, Boolean(pin))

  const promptId = section.module?.promptId ?? ''
  const kind = section.module?.kind

  const results = usePolling<ResultsEnvelope>(() => getResults(promptId, kind ?? 'wordcloud'), {
    every: config.resultsPollMs,
    enabled: Boolean(pin && promptId && isBackendConfigured()),
    pauseWhenHidden: false,
  })

  const queue = usePolling<{ notes: PendingNote[] }>(() => getPending(pin, promptId), {
    every: 3000,
    enabled: Boolean(pin && promptId && kind === 'board' && isBackendConfigured()),
    pauseWhenHidden: false,
  })

  const heartbeat = usePolling(ping, { every: 15000, enabled: Boolean(pin && isBackendConfigured()) })

  if (!pin) return <PinGate onUnlock={setPin} />

  const elapsed = state.startedAt ? now - state.startedAt : 0
  const onSection = now - state.sectionEnteredAt
  const drift = onSection - section.minutes * 60_000
  const notes = queue.data?.notes ?? []
  const pending = notes.filter((note) => note.status === 'pending')
  const starsUsed = (column: string) =>
    notes.filter((note) => note.column === column && note.starred && note.status === 'approved').length

  const submissions = (() => {
    const data = results.data?.results
    if (!data) return null
    if ('words' in data) return data.words.reduce((sum, word) => sum + word.count, 0)
    if ('total' in data) return data.total
    return data.drains.length + data.energises.length
  })()

  const moderate = async (note: PendingNote, status: 'approved' | 'hidden') => {
    // A flagged note may name a colleague. One click should not put that on a
    // screen in front of 150 people.
    if (status === 'approved' && note.flagged) {
      const ok = window.confirm(
        `This note may name someone:\n\n"${note.text}"\n\nPut it on the projector?`,
      )
      if (!ok) return
    }
    await send({ op: 'moderate', id: note.id, status, promptId })
    queue.refresh()
    results.refresh()
  }

  const star = async (note: PendingNote) => {
    await send({ op: 'star', id: note.id, starred: !note.starred, promptId })
    queue.refresh()
    results.refresh()
  }

  return (
    <div className="console">
      <div style={{ display: 'grid', gap: '1rem', alignContent: 'start' }}>
        <section className="console__panel">
          <p className="console__label">
            Now · {state.index + 1} of {sections.length} · Act {section.act} · {section.minutes} min
            {steps > 1 ? ` · reveal ${state.step + 1} of ${steps}` : ''}
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
          {stepNote ? (
            <>
              <p className="console__label" style={{ marginTop: '0.75rem' }}>
                This reveal · {state.step + 1} of {steps}
              </p>
              <p className="console__notes console__notes--step">{stepNote}</p>
            </>
          ) : null}
        </section>

        <section className="console__panel">
          <p className="console__label">Controls</p>
          <div className="console__row">
            <button type="button" onClick={prev}>← Previous</button>
            <button type="button" onClick={next}>Next →</button>
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
            <button type="button" onClick={toggleFullscreen}>Fullscreen (F)</button>
            <button type="button" onClick={restart}>Back to start</button>
          </div>
          <p className="console__label" style={{ marginTop: '0.75rem' }}>
            → / PageDown / Space next · ← / PageUp back · type a section number (1, or 1 then 2 for 12) ·
            B blackout · R reveal · F fullscreen · H cursor
          </p>
        </section>

        {kind === 'board' ? (
          <section className="console__panel">
            <p className="console__label">
              Moderation · {pending.length} waiting · {notes.length} total
            </p>
            {pending.length === 0 ? (
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Nothing waiting.</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.6rem' }}>
                {pending.map((note) => (
                  <li
                    key={note.id}
                    style={{
                      display: 'grid',
                      gap: '0.5rem',
                      padding: '0.6rem',
                      border: '1px solid color-mix(in srgb, var(--color-cream) 18%, transparent)',
                      borderLeft: note.flagged ? '3px solid #ff8a6b' : '3px solid transparent',
                    }}
                  >
                    <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.4 }}>
                      {note.text}
                    </p>
                    <p className="console__label" style={{ margin: 0 }}>
                      {note.column}
                      {note.flagged ? ' · possible name' : ''}
                    </p>
                    <div className="console__row">
                      <button type="button" onClick={() => moderate(note, 'approved')}>
                        Approve
                      </button>
                      <button type="button" onClick={() => moderate(note, 'hidden')}>
                        Hide
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <p className="console__label" style={{ marginTop: '1rem' }}>
              Approved · star up to {MAX_STARS} per column
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.4rem' }}>
              {notes
                .filter((note) => note.status === 'approved')
                .map((note) => (
                  <li key={note.id} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      aria-pressed={note.starred}
                      disabled={!note.starred && starsUsed(note.column) >= MAX_STARS}
                      onClick={() => star(note)}
                      title={note.starred ? 'Unstar' : 'Star — enlarges it on screen'}
                      style={{ minHeight: '34px', padding: '0.3rem 0.6rem' }}
                    >
                      {note.starred ? '★' : '☆'}
                    </button>
                    <button
                      type="button"
                      onClick={() => moderate(note, 'hidden')}
                      title="Take it off the projector"
                      style={{ minHeight: '34px', padding: '0.3rem 0.6rem' }}
                    >
                      Hide
                    </button>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        color: note.flagged ? '#ff8a6b' : undefined,
                      }}
                    >
                      {note.text}
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        ) : null}
      </div>

      <div style={{ display: 'grid', gap: '1rem', alignContent: 'start' }}>
        <section className="console__panel">
          <p className="console__label">Backend</p>
          <p style={{ margin: 0 }}>
            {!isBackendConfigured()
              ? 'No URL in src/config.ts'
              : heartbeat.error || !health.reachable
                ? 'UNREACHABLE — use the printed cards'
                : 'Connected'}
          </p>
          {lastControl ? <p className="console__warn console__over">{lastControl}</p> : null}
          <p className="console__label" style={{ marginTop: '0.75rem' }}>
            Live module ·{' '}
            {section.module
              ? `${section.module.kind} · ${moduleOpen ? 'open for phones' : 'closed'}${
                  submissions === null ? '' : ` · ${submissions} in`
                }`
              : 'none on this section'}
          </p>
          <div className="console__row" style={{ marginTop: '0.75rem' }}>
            {promptId ? (
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm(`Delete every answer for ${promptId}?`)) return
                  await send({ op: 'reset', promptId })
                  results.refresh()
                  queue.refresh()
                }}
              >
                Reset this prompt
              </button>
            ) : null}
            <a
              href={exportUrl(pin)}
              target="_blank"
              rel="noreferrer"
              style={{ alignSelf: 'center', color: 'inherit' }}
            >
              Export CSV
            </a>
          </div>
        </section>

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
                  {item.module ? ' ·' : ''}
                </button>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
