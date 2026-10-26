import { useEffect, useRef, useState } from 'react'
import '../styles/presenter.css'
import { config, isBackendConfigured } from '../config'
import { control, getState, submit } from '../lib/api'
import type { ModuleKind } from '../content/types'
import { useClock } from '../lib/time'

/* ---------------------------------------------------------------------------
   Simulated phones against the real deployment.

   Each virtual phone does what a real one does: polls state every ~9 s with
   jitter, and submits once inside the arrival window.

   Read the numbers with one thing in mind: Apps Script serialises requests that
   share a client session, so every virtual phone in THIS tab queues behind the
   others. Measured on this deployment, ten parallel reads from one browser come
   back in an even 0.9 s staircase, while 150 parallel reads from independent
   clients all answer inside 4.3 s. A browser therefore under-reports badly past
   a dozen or so phones.

   For a true 150-phone picture use the Node script, where every request is an
   independent client:

       npm run test:load -- --phones 150 --prompt wc-opposite --pin YOUR_PIN

   This page is still the right tool for the real UI on real devices: open it on
   a few phones at a rehearsal and watch the projector.

   It writes real rows. Reset the prompt afterwards.
   --------------------------------------------------------------------------- */

const WORDS = [
  'ego', 'silence', 'blame', 'fear', 'apathy', 'shouting', 'absent', 'arrogance',
  'indifference', 'bullying', 'tidak apa', 'ketuanan', 'burnout', 'neglect', 'excuses',
]

const NOTES = [
  'Being blamed for something nobody told me about.',
  'Ward round at 7, clinic at 8, no handover.',
  'A specialist who actually answers the phone.',
  'Seeing a patient I admitted walk out well.',
  'Covering three wards with one HO.',
  'Being asked how I am, and being meant.',
]

interface Stats {
  pollSent: number
  pollOk: number
  pollFail: number
  subSent: number
  accepted: number
  duplicate: number
  closed: number
  failed: number
  latencies: number[]
  inFlight: number
  peakInFlight: number
  startedAt: number
}

const freshStats = (): Stats => ({
  pollSent: 0,
  pollOk: 0,
  pollFail: 0,
  subSent: 0,
  accepted: 0,
  duplicate: 0,
  closed: 0,
  failed: 0,
  latencies: [],
  inFlight: 0,
  peakInFlight: 0,
  startedAt: Date.now(),
})

function percentile(values: number[], p: number) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  return Math.round(sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))])
}

export function Test() {
  const [phones, setPhones] = useState(20)
  const [window_, setWindow] = useState(45)
  const [running, setRunning] = useState(false)
  const [promptId, setPromptId] = useState('')
  const [kind, setKind] = useState<ModuleKind>('wordcloud')
  const [message, setMessage] = useState<string | null>(null)
  const stats = useRef<Stats>(freshStats())
  const timers = useRef<number[]>([])
  const live = useRef(false)
  useClock(500) // re-render twice a second so the counters move

  useEffect(() => {
    void getState().then((result) => {
      if (result.ok) {
        setPromptId(result.data.promptId)
        if (result.data.moduleKind) setKind(result.data.moduleKind)
      }
    })
    return () => stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function track<T>(promise: Promise<T>): Promise<T> {
    const started = performance.now()
    stats.current.inFlight += 1
    stats.current.peakInFlight = Math.max(stats.current.peakInFlight, stats.current.inFlight)
    return promise.finally(() => {
      stats.current.inFlight -= 1
      stats.current.latencies.push(performance.now() - started)
    })
  }

  function stop() {
    live.current = false
    timers.current.forEach((id) => clearTimeout(id))
    timers.current = []
    setRunning(false)
  }

  function start() {
    if (!isBackendConfigured() || !promptId) {
      setMessage('Open a live section from the console first, so there is a prompt to answer.')
      return
    }
    stats.current = freshStats()
    live.current = true
    setRunning(true)
    setMessage(null)

    const later = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms))
    }

    for (let i = 0; i < phones; i += 1) {
      const device = `test-${Date.now().toString(36)}-${i}`

      // Polling, exactly as a real phone does it.
      const poll = () => {
        if (!live.current) return
        stats.current.pollSent += 1
        void track(getState(20000)).then((result) => {
          if (result.ok) stats.current.pollOk += 1
          else stats.current.pollFail += 1
          later(poll, config.statePollMs + (Math.random() * 2 - 1) * config.statePollJitterMs)
        })
      }
      later(poll, Math.random() * config.statePollMs)

      // One submission, somewhere in the arrival window.
      later(
        () => {
          if (!live.current) return
          stats.current.subSent += 1
          const payload =
            kind === 'vote'
              ? { option: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)] }
              : kind === 'board'
                ? {
                    text: NOTES[Math.floor(Math.random() * NOTES.length)],
                    column: Math.random() < 0.5 ? 'drains' : 'energises',
                  }
                : { text: WORDS[Math.floor(Math.random() * WORDS.length)] }

          void track(submit({ kind, promptId, deviceId: device, ...payload })).then((result) => {
            if (!result.ok) stats.current.failed += 1
            else if (result.data.accepted) stats.current.accepted += 1
            else if (result.data.reason === 'duplicate') stats.current.duplicate += 1
            else if (result.data.reason === 'closed') stats.current.closed += 1
            else stats.current.failed += 1
          })
        },
        Math.random() * window_ * 1000,
      )
    }
  }

  async function resetPrompt() {
    const pin = sessionStorage.getItem('htpn.pin')
    if (!pin) {
      setMessage('Unlock #/presenter first — the reset needs your PIN.')
      return
    }
    const result = await control(pin, { op: 'reset', promptId })
    setMessage(result.ok ? `Cleared every answer for ${promptId}.` : `Reset failed: ${result.error}`)
  }

  const s = stats.current
  const elapsed = running ? Math.round((Date.now() - s.startedAt) / 1000) : 0
  const requests = s.pollSent + s.subSent

  return (
    <div className="console" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
      <section className="console__panel">
        <p className="console__label">Load test</p>
        <h1 className="console__now">{phones} simulated phones</h1>
        <p className="console__warn" style={{ marginTop: '0.75rem' }}>
          Writes real rows against whichever prompt is open. Reset the prompt afterwards.
        </p>
        <p className="console__warn" style={{ marginTop: '0.5rem' }}>
          Apps Script serialises requests from one browser session, so past a dozen or so phones the
          failures and latencies here are this tab queueing, not the backend. For the real
          150-phone answer run{' '}
          <code>npm run test:load -- --phones 150 --prompt wc-opposite --pin YOUR_PIN</code>, where
          every request is an independent client.
        </p>
      </section>

      <section className="console__panel">
        <p className="console__label">Setup</p>
        <div className="console__row" style={{ alignItems: 'end' }}>
          <label style={{ display: 'grid', gap: '0.3rem' }}>
            <span className="console__label" style={{ margin: 0 }}>Phones</span>
            <input
              type="number"
              min={1}
              max={400}
              value={phones}
              onChange={(event) => setPhones(Number(event.target.value) || 1)}
              style={{ width: '7rem' }}
            />
          </label>
          <label style={{ display: 'grid', gap: '0.3rem' }}>
            <span className="console__label" style={{ margin: 0 }}>Arrival window (s)</span>
            <input
              type="number"
              min={5}
              max={300}
              value={window_}
              onChange={(event) => setWindow(Number(event.target.value) || 5)}
              style={{ width: '7rem' }}
            />
          </label>
          <label style={{ display: 'grid', gap: '0.3rem' }}>
            <span className="console__label" style={{ margin: 0 }}>Prompt</span>
            <input value={promptId} onChange={(event) => setPromptId(event.target.value)} />
          </label>
          <label style={{ display: 'grid', gap: '0.3rem' }}>
            <span className="console__label" style={{ margin: 0 }}>Kind</span>
            <select value={kind} onChange={(event) => setKind(event.target.value as ModuleKind)}>
              <option value="wordcloud">wordcloud</option>
              <option value="board">board</option>
              <option value="vote">vote</option>
            </select>
          </label>
          {running ? (
            <button type="button" onClick={stop}>Stop</button>
          ) : (
            <button type="button" onClick={start}>Start</button>
          )}
          <button type="button" onClick={resetPrompt} disabled={running || !promptId}>
            Reset this prompt
          </button>
        </div>
        {message ? <p className="console__warn" style={{ marginTop: '0.75rem' }}>{message}</p> : null}
      </section>

      <section className="console__panel">
        <p className="console__label">Live · {elapsed}s elapsed</p>
        <div
          style={{
            display: 'grid',
            gap: '0.75rem 2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            fontSize: '0.95rem',
          }}
        >
          <Metric label="Requests" value={requests} />
          <Metric label="In flight" value={s.inFlight} />
          <Metric label="Peak in flight" value={s.peakInFlight} />
          <Metric label="Polls ok" value={`${s.pollOk}/${s.pollSent}`} />
          <Metric label="Poll failures" value={s.pollFail} warn={s.pollFail > 0} />
          <Metric label="Accepted" value={s.accepted} />
          <Metric label="Duplicates" value={s.duplicate} />
          <Metric label="Closed" value={s.closed} warn={s.closed > 0} />
          <Metric label="Errors" value={s.failed} warn={s.failed > 0} />
          <Metric label="p50 latency" value={`${percentile(s.latencies, 50)} ms`} />
          <Metric label="p95 latency" value={`${percentile(s.latencies, 95)} ms`} />
          <Metric
            label="p99 latency"
            value={`${percentile(s.latencies, 99)} ms`}
            warn={percentile(s.latencies, 99) > 8000}
          />
        </div>
      </section>
    </div>
  )
}

function Metric({ label, value, warn }: { label: string; value: string | number; warn?: boolean }) {
  return (
    <div>
      <p className="console__label" style={{ margin: 0 }}>{label}</p>
      <p className={warn ? 'console__over' : undefined} style={{ margin: 0, fontSize: '1.4rem' }}>
        {value}
      </p>
    </div>
  )
}
