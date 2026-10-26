import { useState } from 'react'
import type { Scenario } from '../../content/scenarios'

/** Four options. Tap one, then send — a mis-tap cannot be taken back. */
export function PhoneVote({
  scenario,
  busy,
  onSend,
}: {
  scenario: Scenario
  busy: boolean
  onSend: (option: string) => void
}) {
  const [option, setOption] = useState<string | null>(null)

  return (
    <div className="join__card">
      {scenario.options.map((choice) => (
        <button
          key={choice.key}
          type="button"
          className="join__option"
          aria-pressed={option === choice.key}
          onClick={() => setOption(choice.key)}
        >
          <span className="join__option-key" aria-hidden="true">
            {choice.key}
          </span>
          <span>{choice.text}</span>
        </button>
      ))}
      <button
        type="button"
        className="join__submit"
        disabled={!option || busy}
        onClick={() => option && onSend(option)}
      >
        {busy ? 'Menghantar…' : 'Hantar undi'}
      </button>
    </div>
  )
}
