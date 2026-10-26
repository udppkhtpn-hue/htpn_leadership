import { useEffect, useRef, useState } from 'react'

interface PollOptions {
  /** Base interval in ms. */
  every: number
  /** Random +/- jitter in ms, so 150 phones do not arrive together. */
  jitter?: number
  /** Stop polling entirely (module closed, no backend). */
  enabled?: boolean
  /** Pause while the tab is hidden — phones in pockets must not poll. */
  pauseWhenHidden?: boolean
}

export interface PollState<T> {
  data: T | null
  error: string | null
  /** True until the first answer arrives. */
  loading: boolean
  /** Fetch now, outside the schedule (after a submission, say). */
  refresh: () => void
}

/**
 * A self-rescheduling poll. One timer, never overlapping requests, and it
 * always waits for the previous answer before scheduling the next — which is
 * what keeps 150 phones inside Apps Script's ~30 concurrent executions.
 */
export function usePolling<T>(
  fetcher: () => Promise<{ ok: true; data: T } | { ok: false; error: string }>,
  { every, jitter = 0, enabled = true, pauseWhenHidden = true }: PollOptions,
): PollState<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(enabled)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher
  const timer = useRef(0)
  const live = useRef(true)
  const inFlight = useRef(false)
  const runRef = useRef<() => void>(() => {})

  useEffect(() => {
    live.current = true
    if (!enabled) {
      setLoading(false)
      return () => {
        live.current = false
        window.clearTimeout(timer.current)
      }
    }

    const schedule = () => {
      const wait = every + (jitter ? (Math.random() * 2 - 1) * jitter : 0)
      timer.current = window.setTimeout(run, Math.max(500, wait))
    }

    const run = async () => {
      if (!live.current || inFlight.current) return
      if (pauseWhenHidden && document.hidden) {
        schedule()
        return
      }
      inFlight.current = true
      const result = await fetcherRef.current()
      inFlight.current = false
      if (!live.current) return
      if (result.ok) {
        setData(result.data)
        setError(null)
      } else {
        setError(result.error)
      }
      setLoading(false)
      schedule()
    }

    runRef.current = run
    run()

    const onVisible = () => {
      if (!document.hidden) {
        window.clearTimeout(timer.current)
        run()
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      live.current = false
      window.clearTimeout(timer.current)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [enabled, every, jitter, pauseWhenHidden])

  return {
    data,
    error,
    loading,
    // A refresh is simply the next poll, brought forward; the chain continues
    // from there as usual.
    refresh: () => {
      window.clearTimeout(timer.current)
      runRef.current()
    },
  }
}
