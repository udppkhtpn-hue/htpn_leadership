import { config } from '../config'
import type { ModuleKind } from '../content/types'

/* ---------------------------------------------------------------------------
   Client for the Apps Script web app.

   Two rules the backend imposes on us:
   - POST bodies are sent as text/plain, so the browser never fires a CORS
     preflight that Apps Script cannot answer.
   - Every request follows Apps Script's redirect to script.googleusercontent.com.
   --------------------------------------------------------------------------- */

export interface BackendState {
  sectionId: string
  moduleKind: ModuleKind | ''
  promptId: string
  open: boolean
  revealed: boolean
  frozen: boolean
  seq: number
}

export interface WordResult {
  word: string
  count: number
}

export interface BoardResult {
  drains: { id: string; text: string; starred: boolean }[]
  energises: { id: string; text: string; starred: boolean }[]
}

export interface VoteResult {
  counts: Record<string, number>
  total: number
}

export interface ResultsEnvelope {
  promptId: string
  kind: ModuleKind
  seq: number
  revealed: boolean
  results: { words: WordResult[] } | BoardResult | VoteResult | null
}

export interface PendingNote {
  id: string
  text: string
  column: 'drains' | 'energises'
  status: 'pending' | 'approved' | 'hidden'
  starred: boolean
  flagged: boolean
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string }

const DEFAULT_TIMEOUT = 9000

/** Tracks whether the backend is answering, for the console's health light. */
export const health = {
  lastOkAt: 0,
  lastErrorAt: 0,
  consecutiveFailures: 0,
  get reachable() {
    return this.consecutiveFailures < 3
  },
}

function record(ok: boolean) {
  if (ok) {
    health.lastOkAt = Date.now()
    health.consecutiveFailures = 0
  } else {
    health.lastErrorAt = Date.now()
    health.consecutiveFailures += 1
  }
}

async function request<T>(
  input: string,
  init: RequestInit,
  timeout = DEFAULT_TIMEOUT,
): Promise<ApiResult<T>> {
  if (!config.backendUrl) return { ok: false, error: 'no backend url' }

  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(input, { ...init, redirect: 'follow', signal: controller.signal })
    if (!response.ok) {
      record(false)
      return { ok: false, error: `http ${response.status}` }
    }
    const body = (await response.json()) as ApiResult<T>
    record(body.ok)
    return body
  } catch (error) {
    record(false)
    return { ok: false, error: error instanceof Error ? error.message : 'network error' }
  } finally {
    window.clearTimeout(timer)
  }
}

const query = (params: Record<string, string>) =>
  `${config.backendUrl}?${new URLSearchParams(params).toString()}`

export const getState = (timeout?: number) =>
  request<BackendState>(query({ action: 'state' }), { method: 'GET' }, timeout)

export const getResults = (promptId: string, kind: ModuleKind, timeout?: number) =>
  request<ResultsEnvelope>(query({ action: 'results', promptId, kind }), { method: 'GET' }, timeout)

export const getPending = (pin: string, promptId: string) =>
  request<{ notes: PendingNote[] }>(query({ action: 'pending', pin, promptId }), { method: 'GET' })

export const ping = () => request<{ ts: number }>(query({ action: 'ping' }), { method: 'GET' }, 6000)

function post<T>(body: Record<string, unknown>, timeout?: number) {
  return request<T>(
    config.backendUrl,
    {
      method: 'POST',
      // text/plain on purpose: see the note at the top of this file.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
    },
    timeout,
  )
}

export interface SubmitOutcome {
  accepted: boolean
  reason?: 'closed' | 'duplicate' | 'empty' | 'bad column' | 'bad option'
  moderated?: boolean
}

export const submit = (payload: {
  kind: ModuleKind
  promptId: string
  deviceId: string
  text?: string
  column?: string
  option?: string
}) => post<SubmitOutcome>({ action: 'submit', ...payload })

export type ControlOp =
  | { op: 'set'; sectionId: string; moduleKind: ModuleKind | ''; promptId: string; open: boolean }
  | { op: 'open' }
  | { op: 'close' }
  | { op: 'reveal'; revealed: boolean }
  | { op: 'freeze'; frozen: boolean }
  | { op: 'moderate'; id: string; status: 'approved' | 'hidden' | 'pending'; promptId: string }
  | { op: 'star'; id: string; starred: boolean; promptId: string }
  | { op: 'reset'; promptId: string }

export const control = (pin: string, operation: ControlOp) =>
  post<BackendState | Record<string, unknown>>({ action: 'control', pin, ...operation })

/** The PIN is only ever checked by the backend; we just hold it for the session. */
export const verifyPin = async (pin: string): Promise<boolean> => {
  const result = await control(pin, { op: 'reveal', revealed: false })
  return result.ok
}

export const exportUrl = (pin: string) => query({ action: 'export', pin })
