import { useState } from 'react'
import type { BoardPrompt } from '../../content/prompts'

/** Pick a column, write up to eighty characters. Goes to the moderation queue. */
export function PhoneBoard({
  prompt,
  busy,
  onSend,
}: {
  prompt: BoardPrompt
  busy: boolean
  onSend: (text: string, column: string) => void
}) {
  const [column, setColumn] = useState<string | null>(null)
  const [text, setText] = useState('')
  const remaining = prompt.maxChars - text.length

  return (
    <form
      className="join__card"
      onSubmit={(event) => {
        event.preventDefault()
        if (column && text.trim() && !busy) onSend(text.trim(), column)
      }}
    >
      <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: '0.6rem' }}>
        <legend className="join__hint" style={{ padding: 0, marginBottom: '0.4rem' }}>
          Pilih satu
        </legend>
        {prompt.columns.map((option) => (
          <button
            key={option.id}
            type="button"
            className="join__option"
            aria-pressed={column === option.id}
            onClick={() => setColumn(option.id)}
          >
            <span>{option.label}</span>
          </button>
        ))}
      </fieldset>

      <label className="join__hint" htmlFor="note">
        In your own words. No names.
      </label>
      <textarea
        id="note"
        className="join__field"
        value={text}
        maxLength={prompt.maxChars}
        rows={3}
        onChange={(event) => setText(event.target.value)}
      />
      <p className={remaining <= 10 ? 'join__count join__count--limit' : 'join__count'}>
        {remaining} left
      </p>
      <button type="submit" className="join__submit" disabled={!column || !text.trim() || busy}>
        {busy ? 'Menghantar…' : 'Hantar'}
      </button>
    </form>
  )
}
