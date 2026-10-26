import { useState } from 'react'
import type { WordCloudPrompt } from '../../content/prompts'

/** One word, or one of five phrases. Thirty characters, one per device. */
export function PhoneWord({
  prompt,
  busy,
  onSend,
}: {
  prompt: WordCloudPrompt
  busy: boolean
  onSend: (text: string) => void
}) {
  const [text, setText] = useState('')
  const [choice, setChoice] = useState<string | null>(null)
  const value = prompt.choices ? (choice ?? '') : text
  const remaining = prompt.maxChars - text.length

  if (prompt.choices) {
    return (
      <div className="join__card">
        {prompt.choices.map((option) => (
          <button
            key={option}
            type="button"
            className="join__option"
            aria-pressed={choice === option}
            onClick={() => setChoice(option)}
          >
            <span>{option}</span>
          </button>
        ))}
        <button
          type="button"
          className="join__submit"
          disabled={!value || busy}
          onClick={() => onSend(value)}
        >
          {busy ? 'Menghantar…' : 'Hantar'}
        </button>
      </div>
    )
  }

  return (
    <form
      className="join__card"
      onSubmit={(event) => {
        event.preventDefault()
        if (value.trim() && !busy) onSend(value.trim())
      }}
    >
      <label className="join__hint" htmlFor="word">
        {prompt.phoneHint}
      </label>
      <input
        id="word"
        name="word"
        className="join__field"
        type="text"
        value={text}
        maxLength={prompt.maxChars}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="send"
        onChange={(event) => setText(event.target.value)}
      />
      <p
        className={remaining <= 5 ? 'join__count join__count--limit' : 'join__count'}
        aria-live="polite"
      >
        {remaining} left
      </p>
      <button type="submit" className="join__submit" disabled={!text.trim() || busy}>
        {busy ? 'Menghantar…' : 'Hantar'}
      </button>
    </form>
  )
}
