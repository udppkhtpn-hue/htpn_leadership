import '../styles/print.css'
import { SECTIONS, SEQUENCES, totalMinutes, type SequenceId } from '../content/sections'
import { useState } from 'react'
import { findBoardPrompt, findWordCloudPrompt } from '../content/prompts'
import { findScenario } from '../content/scenarios'
import { formatCorrelation, GOLEMAN } from '../content/goleman'
import type { Section } from '../content/types'

const ACT_NAMES = { 1: 'Act I — What is', 2: 'Act II — What could be', 3: 'Act III — The legacy' }

function Sheet({ section, index }: { section: Section; index: number }) {
  const p = section.props
  const wordPrompt = section.module?.kind === 'wordcloud' ? findWordCloudPrompt(section.module.promptId) : undefined
  const boardPrompt = section.module?.kind === 'board' ? findBoardPrompt(section.module.promptId) : undefined
  const scenario = section.module?.kind === 'vote' ? findScenario(section.module.promptId) : undefined

  return (
    <section className="print__sheet">
      <p className="print__meta">
        {String(index + 1).padStart(2, '0')} · {ACT_NAMES[section.act]} · {section.minutes} min
        {section.module ? ` · live ${section.module.kind}` : ''}
      </p>

      {p.headline ? <h2 className="print__hero">{p.headline}</h2> : null}
      {p.quote ? <h2 className="print__hero">“{p.quote}”</h2> : null}
      {p.attribution ? <p className="print__meta">{p.attribution}</p> : null}
      {p.sub ? <p className="print__body">{p.sub}</p> : null}

      {p.value ? (
        <>
          <p className="print__figure">
            {p.value}
            {p.unit}
          </p>
          <p className="print__body">{p.label}</p>
          {p.source ? <p className="print__meta">{p.source}</p> : null}
        </>
      ) : null}

      {p.events ? (
        <ul className="print__options">
          {p.events.map((event) => (
            <li key={event.year}>
              <span className="print__option-key">{event.year}</span>
              {event.text}
            </li>
          ))}
        </ul>
      ) : null}

      {p.src ? <p className="print__meta">{p.src}</p> : null}

      {/* Live modules, written out so they can be run from paper with a show
          of hands if the backend is unreachable. */}
      {wordPrompt ? (
        <>
          <h2 className="print__hero">{wordPrompt.question}</h2>
          {wordPrompt.choices ? (
            <ul className="print__options">
              {wordPrompt.choices.map((choice, choiceIndex) => (
                <li key={choice}>
                  <span className="print__option-key">{'ABCDE'[choiceIndex]}</span>
                  {choice}
                </li>
              ))}
            </ul>
          ) : (
            <p className="print__body">Ask for shouted answers and write them on the flip chart.</p>
          )}
        </>
      ) : null}

      {boardPrompt ? (
        <>
          <h2 className="print__hero">{boardPrompt.question}</h2>
          <ul className="print__options">
            {boardPrompt.columns.map((column) => (
              <li key={column.id}>
                <span className="print__option-key">·</span>
                {column.label}
              </li>
            ))}
          </ul>
          <p className="print__body">Paper slips, two piles at the front, read out the ones you choose.</p>
        </>
      ) : null}

      {scenario ? (
        <>
          <p className="print__body">{scenario.vignette}</p>
          <ul className="print__options">
            {scenario.options.map((option) => (
              <li key={option.key}>
                <span className="print__option-key">{option.key}</span>
                {option.text}
                <br />
                <span className="print__meta">
                  {GOLEMAN[option.style].label} · climate {formatCorrelation(GOLEMAN[option.style].correlation)}
                  {option.caveat ? ` · ${option.caveat}` : ''}
                </span>
              </li>
            ))}
          </ul>
          <p className="print__body">Hands up for A, B, C, D. Count roughly; the ratio is the point.</p>
        </>
      ) : null}

      <p className="print__notes">{section.notes}</p>
    </section>
  )
}

/** A print-friendly run of the whole talk: one section per page. */
export function Print() {
  const [sequence, setSequence] = useState<SequenceId>('full60')
  const ids = SEQUENCES[sequence].ids
  const sections = ids
    .map((id) => SECTIONS.find((section) => section.id === id))
    .filter((section): section is Section => Boolean(section))

  return (
    <main className="print">
      <header className="print__intro">
        <p className="print__meta">HTPN · Be the Senior You Needed · paper backup</p>
        <h1 className="print__hero">
          {SEQUENCES[sequence].label} · {sections.length} sections · {totalMinutes(sequence)} min planned
        </h1>
        <p className="print__body print__hide">
          Print this to PDF and keep it on the lectern. Every live module is written out so it can be run
          with printed cards and a show of hands.
        </p>
        <p className="print__hide" style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          {(Object.keys(SEQUENCES) as SequenceId[]).map((id) => (
            <button
              key={id}
              type="button"
              className="print__hint"
              aria-pressed={sequence === id}
              onClick={() => setSequence(id)}
              style={{
                border: '2px solid #000',
                background: sequence === id ? '#000' : 'transparent',
                color: sequence === id ? '#fff' : '#000',
                padding: '0.5rem 0.9rem',
                minHeight: '44px',
                cursor: 'pointer',
              }}
            >
              {SEQUENCES[id].label}
            </button>
          ))}
          <button
            type="button"
            className="print__hint"
            onClick={() => window.print()}
            style={{
              border: '2px solid #000',
              background: 'transparent',
              padding: '0.5rem 0.9rem',
              minHeight: '44px',
              cursor: 'pointer',
            }}
          >
            Print
          </button>
        </p>
      </header>

      {sections.map((section, index) => (
        <Sheet key={section.id} section={section} index={index} />
      ))}
    </main>
  )
}
