import { useEffect, useMemo, useState } from 'react'
import '../styles/join.css'
import { config, isBackendConfigured } from '../config'
import { deviceId } from '../lib/device'
import { usePolling } from '../lib/polling'
import { hashQuery } from '../lib/router'
import { getState, submit, type BackendState } from '../lib/api'
import { findBoardPrompt, findWordCloudPrompt } from '../content/prompts'
import { findScenario } from '../content/scenarios'
import { PhoneWord } from '../modules/WordCloud/PhoneWord'
import { PhoneBoard } from '../modules/Board/PhoneBoard'
import { PhoneVote } from '../modules/Vote/PhoneVote'
import type { ModuleKind } from '../content/types'

const SENT_KEY = 'htpn.sent'

function readSent(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(SENT_KEY) || '{}') as Record<string, string>
  } catch {
    return {}
  }
}

function rememberSent(promptId: string, answer: string) {
  try {
    const sent = readSent()
    sent[promptId] = answer
    localStorage.setItem(SENT_KEY, JSON.stringify(sent))
  } catch {
    /* private mode: the backend still refuses a second submission */
  }
}

/**
 * The audience screen. It knows every prompt already — only the id travels over
 * the wire, so the phone needs one small JSON answer every nine seconds.
 */
export function Join() {
  const id = useMemo(() => deviceId(), [])
  const [sent, setSent] = useState(readSent)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const poll = usePolling<BackendState>(getState, {
    every: config.statePollMs,
    jitter: config.statePollJitterMs,
    enabled: isBackendConfigured(),
  })

  // #/join?prompt=wc-opposite&kind=wordcloud shows one question without waiting
  // for the console, for rehearsing the phone screen. Submissions still go to
  // the backend, which refuses them unless that prompt is actually open.
  const preview = useMemo(() => {
    const query = hashQuery()
    const prompt = query.get('prompt')
    return prompt ? { promptId: prompt, kind: (query.get('kind') || 'wordcloud') as ModuleKind } : null
  }, [])

  const state = poll.data
  const promptId = preview?.promptId ?? state?.promptId ?? ''
  const kind = preview?.kind ?? state?.moduleKind ?? ''
  const isOpen = preview ? true : Boolean(state?.open) && !state?.frozen && Boolean(promptId)
  const answer = promptId ? sent[promptId] : undefined

  // A new question clears the last one's notice.
  useEffect(() => {
    setNotice(null)
  }, [promptId])

  const wordPrompt = kind === 'wordcloud' ? findWordCloudPrompt(promptId) : undefined
  const boardPrompt = kind === 'board' ? findBoardPrompt(promptId) : undefined
  const scenario = kind === 'vote' ? findScenario(promptId) : undefined

  const question =
    wordPrompt?.question ??
    boardPrompt?.question ??
    (scenario ? 'Boss or leader?' : 'Waiting for the next question')

  async function send(payload: { text?: string; column?: string; option?: string }, shown: string) {
    if (!promptId || !kind) return
    setBusy(true)
    const result = await submit({ kind, promptId, deviceId: id, ...payload })
    setBusy(false)

    if (!result.ok) {
      setNotice('Could not send — check your signal and try again. Cuba lagi.')
      return
    }
    if (result.data.accepted || result.data.reason === 'duplicate') {
      rememberSent(promptId, shown)
      setSent(readSent())
      setNotice(
        result.data.reason === 'duplicate'
          ? 'Already counted — one answer per phone.'
          : result.data.moderated
            ? 'Sent. It appears on screen once it is approved.'
            : 'Sent.',
      )
      return
    }
    if (result.data.reason === 'closed') setNotice('That question just closed. Sudah tutup.')
    else setNotice('Not sent — try again.')
  }

  return (
    <main className="join">
      <header style={{ display: 'grid', gap: '0.5rem' }}>
        <p className="join__eyebrow">HTPN · Be the senior you needed</p>
        <h1 className="join__question">{question}</h1>
        {scenario ? <p className="join__hint">{scenario.vignette}</p> : null}
      </header>

      {!isBackendConfigured() ? (
        <div className="join__card">
          <p className="join__hint">Not connected. Follow the printed cards instead.</p>
        </div>
      ) : answer ? (
        <>
          <div className="join__pasted">{answer}</div>
          <p className="join__status" role="status">
            {notice ?? 'Counted. Keep this page open — tunggu soalan seterusnya.'}
          </p>
        </>
      ) : !isOpen ? (
        <div className="join__card">
          <p className="join__hint">
            {poll.loading
              ? 'Connecting…'
              : state?.frozen
                ? 'Answers are closed for this one. Tunggu sekejap.'
                : 'Nothing to answer yet. Keep this page open — tunggu sekejap.'}
          </p>
          {poll.error ? (
            <p className="join__status">Signal is weak. It will retry on its own.</p>
          ) : null}
        </div>
      ) : wordPrompt ? (
        <PhoneWord prompt={wordPrompt} busy={busy} onSend={(text) => send({ text }, text)} />
      ) : boardPrompt ? (
        <PhoneBoard
          prompt={boardPrompt}
          busy={busy}
          onSend={(text, column) => send({ text, column }, text)}
        />
      ) : scenario ? (
        <PhoneVote
          scenario={scenario}
          busy={busy}
          onSend={(option) =>
            send(
              { option },
              `${option} — ${scenario.options.find((o) => o.key === option)?.text ?? ''}`,
            )
          }
        />
      ) : (
        <div className="join__card">
          <p className="join__hint">Waiting for the next question. Tunggu sekejap.</p>
        </div>
      )}

      {notice && !answer ? (
        <p className="join__status" role="status">
          {notice}
        </p>
      ) : null}

      <p className="join__footer">
        Anonymous. I can&rsquo;t see who wrote what, and neither can your HOD. No name, no email, no
        phone number is collected.
      </p>
    </main>
  )
}
