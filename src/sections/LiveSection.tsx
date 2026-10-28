import { useEffect, useState } from 'react'
import { config, isBackendConfigured } from '../config'
import { usePolling } from '../lib/polling'
import { getResults, type BoardResult, type ResultsEnvelope, type VoteResult, type WordResult } from '../lib/api'
import { findBoardPrompt, findWordCloudPrompt } from '../content/prompts'
import { findScenario } from '../content/scenarios'
import type { Section } from '../content/types'
import { Stamp, TornSheet } from '../collage'
import { WordField } from '../modules/WordCloud/WordField'
import { VoteBars } from '../modules/Vote/VoteBars'
import { Note } from '../modules/Board/Note'

/** Counts down the vote window from the moment the section was entered. */
function Countdown({ from, seconds }: { from: number; seconds: number }) {
  const [left, setLeft] = useState(() => Math.max(0, seconds - Math.floor((Date.now() - from) / 1000)))
  useEffect(() => {
    const id = window.setInterval(() => {
      setLeft(Math.max(0, seconds - Math.floor((Date.now() - from) / 1000)))
    }, 250)
    return () => window.clearInterval(id)
  }, [from, seconds])

  return (
    <p
      style={{
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-title)',
        color: left === 0 ? 'var(--color-sepia)' : 'var(--color-cobalt)',
      }}
    >
      {left === 0 ? 'Time' : `${left}s`}
    </p>
  )
}

function Question({ children }: { children: string }) {
  return (
    <h1
      className="m-0"
      style={{
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-statement)',
        lineHeight: 0.95,
        textWrap: 'balance',
      }}
    >
      {children}
    </h1>
  )
}

/**
 * A live module on the projector. Results are polled only while the section is
 * on screen; if the backend cannot be reached the question stays up on its own,
 * which is the printed-card fallback.
 */
export function LiveSection({
  section,
  revealed,
  enteredAt,
  paused,
}: {
  section: Section
  revealed: boolean
  enteredAt: number
  /** Blackout or a frozen module: stop asking the backend. */
  paused: boolean
}) {
  const module = section.module
  const promptId = module?.promptId ?? ''
  const kind = module?.kind ?? 'wordcloud'

  const poll = usePolling<ResultsEnvelope>(() => getResults(promptId, kind), {
    every: config.resultsPollMs,
    enabled: Boolean(promptId) && isBackendConfigured() && !paused,
    pauseWhenHidden: false,
  })

  const wordPrompt = kind === 'wordcloud' ? findWordCloudPrompt(promptId) : undefined
  const boardPrompt = kind === 'board' ? findBoardPrompt(promptId) : undefined
  const scenario = kind === 'vote' ? findScenario(promptId) : undefined
  const results = poll.data?.results ?? null

  if (kind === 'wordcloud') {
    const words = (results as { words: WordResult[] } | null)?.words ?? []
    return (
      <div style={{ display: 'grid', gap: 'clamp(1rem, 2.5vw, 2rem)', justifyItems: 'center' }}>
        <Question>{wordPrompt?.question ?? section.title}</Question>
        <TornSheet seed={`sheet-${section.id}`} style={{ width: 'min(90%, 68rem)' }}>
          {words.length ? (
            <WordField words={words} />
          ) : (
            <p style={{ margin: 0, textAlign: 'center', fontFamily: 'var(--font-type)', fontSize: 'var(--text-stamp)', letterSpacing: '0.14em', color: 'var(--color-sepia)' }}>
              Waiting for the room
            </p>
          )}
        </TornSheet>
      </div>
    )
  }

  if (kind === 'board') {
    const board = (results as BoardResult | null) ?? { drains: [], energises: [] }
    return (
      <div style={{ display: 'grid', gap: 'clamp(1rem, 2vw, 1.75rem)', justifyItems: 'center', width: '100%' }}>
        <Question>{boardPrompt?.question ?? section.title}</Question>
        <TornSheet seed={`sheet-${section.id}`} style={{ width: 'min(94%, 82rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(1rem, 3vw, 2.5rem)' }}>
            {boardPrompt?.columns.map((column) => (
              <div key={column.id}>
                <p
                  style={{
                    margin: '0 0 1rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-title)',
                    color: column.id === 'drains' ? 'var(--color-sepia)' : 'var(--color-cobalt)',
                  }}
                >
                  {column.label}
                </p>
                <ul style={{ display: 'grid', gap: '1.4rem', margin: 0, padding: 0 }}>
                  {board[column.id].map((note, index) => (
                    <Note
                      key={note.id}
                      index={index}
                      note={{ id: note.id, text: note.text, column: column.id, starred: note.starred }}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TornSheet>
      </div>
    )
  }

  const vote = (results as VoteResult | null) ?? { counts: {}, total: 0 }
  return (
    <div style={{ display: 'grid', gap: 'clamp(1rem, 2vw, 1.75rem)', justifyItems: 'center', width: '100%' }}>
      <TornSheet seed={`sheet-${section.id}`} style={{ width: 'min(92%, 76rem)' }}>
        <div style={{ display: 'grid', gap: 'clamp(0.6rem, 1.4vw, 1.1rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1.5rem' }}>
            <Stamp seed={section.id}>{revealed ? 'Revealed' : 'Vote now'}</Stamp>
            {revealed ? (
              <Stamp seed={`${section.id}-total`}>{`${vote.total} votes`}</Stamp>
            ) : (
              <Countdown from={enteredAt} seconds={scenario?.seconds ?? 30} />
            )}
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-body)',
              fontSize: 'calc(var(--text-title) * 0.88)',
              lineHeight: 1.25,
            }}
          >
            {scenario?.vignette}
          </p>
          {scenario ? (
            <VoteBars options={scenario.options} counts={vote.counts} revealed={revealed} />
          ) : null}
        </div>
      </TornSheet>
    </div>
  )
}
