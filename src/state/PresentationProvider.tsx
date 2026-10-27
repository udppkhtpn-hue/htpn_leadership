import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { openChannel, readMirror, type Channel } from '../lib/channel'
import { sectionsFor, stepsOf, type SequenceId } from '../content/sections'
import type { Section } from '../content/types'

export interface LiveState {
  /** Monotonic revision: a received state wins only if its rev is higher. */
  rev: number
  sequence: SequenceId
  index: number
  /** Reveal step within the current section, 0-based. */
  step: number
  blackout: boolean
  revealed: boolean
  frozen: boolean
  hideCursor: boolean
  reducedEffects: boolean
  /** Wall-clock start of the talk, set when I leave the first section. */
  startedAt: number | null
  sectionEnteredAt: number
}

const initialState = (): LiveState => ({
  rev: 0,
  sequence: 'full60',
  index: 0,
  step: 0,
  blackout: false,
  revealed: false,
  frozen: false,
  hideCursor: false,
  reducedEffects: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  startedAt: null,
  sectionEnteredAt: Date.now(),
})

interface PresentationValue {
  state: LiveState
  sections: Section[]
  section: Section
  nextSection: Section | null
  /** True while the current section's live module should accept phone input. */
  moduleOpen: boolean
  update: (patch: Partial<Omit<LiveState, 'rev'>>) => void
  goTo: (index: number) => void
  next: () => void
  prev: () => void
  /** How many clicker presses this section takes before it moves on. */
  steps: number
  toggle: (key: 'blackout' | 'revealed' | 'frozen' | 'hideCursor' | 'reducedEffects') => void
  setSequence: (sequence: SequenceId) => void
  restart: () => void
}

const PresentationContext = createContext<PresentationValue | null>(null)

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LiveState>(() => readMirror<LiveState>() ?? initialState())
  const channelRef = useRef<Channel<LiveState> | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const channel = openChannel<LiveState>((message) => {
      if (message.kind === 'request') {
        channel.post({ kind: 'state', state: stateRef.current })
        return
      }
      // Last writer wins, ordered by rev. Equal revs are ignored, so a window
      // never fights its own echo.
      if (message.state.rev > stateRef.current.rev) setState(message.state)
    })
    channelRef.current = channel
    channel.post({ kind: 'request' })
    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [])

  const commit = useCallback((patch: Partial<Omit<LiveState, 'rev'>>) => {
    setState((current) => {
      const nextState: LiveState = { ...current, ...patch, rev: current.rev + 1 }
      channelRef.current?.post({ kind: 'state', state: nextState })
      return nextState
    })
  }, [])

  const sections = useMemo(() => sectionsFor(state.sequence), [state.sequence])
  const index = Math.min(state.index, sections.length - 1)
  const section = sections[index]

  const goTo = useCallback(
    (target: number, atStep: 'first' | 'last' = 'first') => {
      const clamped = Math.max(0, Math.min(target, sections.length - 1))
      if (clamped === stateRef.current.index) return
      commit({
        index: clamped,
        // Arriving forwards, a sheet starts bare; arriving backwards it is
        // already fully revealed, so stepping back never replays a model.
        step: atStep === 'last' ? stepsOf(sections[clamped]) - 1 : 0,
        revealed: false,
        frozen: false,
        sectionEnteredAt: Date.now(),
        startedAt: stateRef.current.startedAt ?? Date.now(),
      })
    },
    [commit, sections],
  )

  // Each clicker press reveals the next element of the current screen, and
  // only moves on once the screen is whole.
  const steps = stepsOf(section)
  const step = Math.min(state.step, steps - 1)

  const value = useMemo<PresentationValue>(
    () => ({
      state: { ...state, index, step },
      steps,
      sections,
      section,
      nextSection: sections[index + 1] ?? null,
      moduleOpen: Boolean(section?.module) && !state.blackout && !state.frozen,
      update: commit,
      goTo,
      next: () => (step < steps - 1 ? commit({ step: step + 1 }) : goTo(index + 1)),
      prev: () => (step > 0 ? commit({ step: step - 1 }) : goTo(index - 1, 'last')),
      toggle: (key) => commit({ [key]: !state[key] } as Partial<LiveState>),
      setSequence: (sequence) =>
        commit({ sequence, index: 0, step: 0, sectionEnteredAt: Date.now() }),
      restart: () =>
        commit({
          index: 0,
          step: 0,
          revealed: false,
          frozen: false,
          startedAt: null,
          sectionEnteredAt: Date.now(),
        }),
    }),
    [commit, goTo, index, section, sections, state, step, steps],
  )

  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>
}

export function usePresentation(): PresentationValue {
  const value = useContext(PresentationContext)
  if (!value) throw new Error('usePresentation must be used inside PresentationProvider')
  return value
}
