/** Word cloud and board prompts. Edit freely; ids are referenced by sections. */
export interface WordCloudPrompt {
  id: string
  kind: 'wordcloud'
  /** Shown on the projector and on phones. */
  question: string
  /** Short Bahasa Melayu label for the phone input. */
  phoneHint: string
  maxChars: 30
  /** When present, phones show these as buttons instead of a free text input. */
  choices?: string[]
}

export interface BoardPrompt {
  id: string
  kind: 'board'
  question: string
  columns: [{ id: 'drains'; label: string }, { id: 'energises'; label: string }]
  maxChars: 80
}

export const WORDCLOUD_PROMPTS: WordCloudPrompt[] = [
  {
    id: 'wc-opposite',
    kind: 'wordcloud',
    question: 'What is the opposite of leadership?',
    phoneHint: 'Satu perkataan sahaja',
    maxChars: 30,
  },
  {
    id: 'wc-admire',
    kind: 'wordcloud',
    question: 'A leader you admire, and the ONE quality that made them great.',
    phoneHint: 'Satu kualiti sahaja',
    maxChars: 30,
  },
  {
    id: 'wc-hear-most',
    kind: 'wordcloud',
    question: 'Which one do you hear most?',
    phoneHint: 'Pilih satu',
    maxChars: 30,
    choices: [
      'Bukan kerja saya',
      'Memang macam ni dari dulu',
      'Tunggu HOD decide',
      'Saya HO je',
      'Specialist tak angkat call',
    ],
  },
]

export const BOARD_PROMPTS: BoardPrompt[] = [
  {
    id: 'board-drains',
    kind: 'board',
    question: 'What drains you, and what gives you energy, on a normal shift?',
    columns: [
      { id: 'drains', label: 'Drains me' },
      { id: 'energises', label: 'Energises me' },
    ],
    maxChars: 80,
  },
]

export const findWordCloudPrompt = (id: string) => WORDCLOUD_PROMPTS.find((p) => p.id === id)
export const findBoardPrompt = (id: string) => BOARD_PROMPTS.find((p) => p.id === id)
