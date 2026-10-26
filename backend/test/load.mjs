/**
 * Simulates N independent phones against the deployed backend.
 *
 *   node backend/test/load.mjs --phones 150 --prompt wc-opposite --kind wordcloud
 *   node backend/test/load.mjs --phones 150 --prompt wc-opposite --pin 1910
 *
 * Why this exists as a Node script rather than only in #/test: Apps Script
 * serialises concurrent requests that share one client session, so 150 virtual
 * phones driven from a single browser tab queue behind each other and time out —
 * which says nothing about the real room. Node's fetch sends no cookies, so each
 * request here is an independent client, like 150 real phones.
 *
 * With --pin it opens the prompt first and closes it at the end. Without one,
 * open the section from #/presenter yourself, or every submission comes back
 * "closed" (still a useful read-path test).
 *
 * It writes real rows. Reset the prompt afterwards (--reset, or the console).
 */

import { readFileSync } from 'node:fs'

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, token, index, all) => {
    if (token.startsWith('--')) pairs.push([token.slice(2), all[index + 1]?.startsWith('--') ? 'true' : all[index + 1] ?? 'true'])
    return pairs
  }, []),
)

const phones = Number(args.phones ?? 150)
const windowSeconds = Number(args.window ?? 45)
const durationSeconds = Number(args.duration ?? Math.max(windowSeconds + 15, 60))
const promptId = args.prompt ?? 'wc-opposite'
const kind = args.kind ?? 'wordcloud'
const pin = args.pin ?? process.env.PRESENTER_PIN ?? ''
const POLL_MS = 9000
const JITTER_MS = 2000

const url =
  args.url ??
  (() => {
    const source = readFileSync(new URL('../../src/config.ts', import.meta.url), 'utf8')
    const match = source.match(/https:\/\/script\.google\.com\/macros\/s\/[^']+/)
    if (!match) throw new Error('No backend URL in src/config.ts — pass --url')
    return match[0]
  })()

const WORDS = ['ego', 'silence', 'blame', 'fear', 'apathy', 'shouting', 'absent', 'arrogance', 'tidak apa', 'burnout']
const NOTES = [
  'Being blamed for something nobody told me about.',
  'Ward round at 7, clinic at 8, no handover.',
  'A specialist who actually answers the phone.',
  'Covering three wards with one HO.',
]

const stats = { polls: 0, pollOk: 0, pollFail: 0, submits: 0, accepted: 0, duplicate: 0, closed: 0, failed: 0, latencies: [], inFlight: 0, peak: 0 }
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const jitter = () => POLL_MS + (Math.random() * 2 - 1) * JITTER_MS

async function call(request) {
  const started = Date.now()
  stats.inFlight += 1
  stats.peak = Math.max(stats.peak, stats.inFlight)
  try {
    return await request()
  } finally {
    stats.inFlight -= 1
    stats.latencies.push(Date.now() - started)
  }
}

const getJson = (query) => call(() => fetch(`${url}?${query}`, { redirect: 'follow' }).then((r) => r.json()))

const postJson = (body) =>
  call(() =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow',
    }).then((r) => r.json()),
  )

const percentile = (values, p) => {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))]
}

async function phone(index, deadline) {
  const deviceId = `load-${Date.now().toString(36)}-${index}`

  const submitAt = Date.now() + Math.random() * windowSeconds * 1000
  const payload =
    kind === 'vote'
      ? { option: 'ABCD'[Math.floor(Math.random() * 4)] }
      : kind === 'board'
        ? { text: NOTES[Math.floor(Math.random() * NOTES.length)], column: Math.random() < 0.5 ? 'drains' : 'energises' }
        : { text: WORDS[Math.floor(Math.random() * WORDS.length)] }

  let submitted = false
  await sleep(Math.random() * POLL_MS)

  while (Date.now() < deadline) {
    stats.polls += 1
    try {
      const state = await getJson('action=state')
      if (state?.ok) stats.pollOk += 1
      else stats.pollFail += 1
    } catch {
      stats.pollFail += 1
    }

    if (!submitted && Date.now() >= submitAt) {
      submitted = true
      stats.submits += 1
      try {
        const result = await postJson({ action: 'submit', kind, promptId, deviceId, ...payload })
        if (!result?.ok) stats.failed += 1
        else if (result.data.accepted) stats.accepted += 1
        else if (result.data.reason === 'duplicate') stats.duplicate += 1
        else if (result.data.reason === 'closed') stats.closed += 1
        else stats.failed += 1
      } catch {
        stats.failed += 1
      }
    }

    await sleep(jitter())
  }
}

function report(final = false) {
  const { polls, pollOk, pollFail, submits, accepted, duplicate, closed, failed, latencies, peak } = stats
  const line = [
    `requests ${latencies.length}`,
    `in flight ${stats.inFlight} (peak ${peak})`,
    `polls ${pollOk}/${polls}${pollFail ? ` fail ${pollFail}` : ''}`,
    `submits ${submits} → ok ${accepted} dup ${duplicate} closed ${closed} err ${failed}`,
    `p50 ${percentile(latencies, 50)}ms p95 ${percentile(latencies, 95)}ms max ${Math.max(0, ...latencies)}ms`,
  ].join(' · ')
  console.log(`${final ? 'FINAL  ' : '       '}${line}`)
}

console.log(`${phones} phones · prompt ${promptId} (${kind}) · ${windowSeconds}s arrival · ${durationSeconds}s run`)
console.log(url)

if (pin) {
  const opened = await postJson({ action: 'control', pin, op: 'set', sectionId: `load-${promptId}`, moduleKind: kind, promptId, open: true })
  if (!opened?.ok) {
    console.error(`Could not open the prompt: ${opened?.error}`)
    process.exit(1)
  }
  console.log('Prompt opened for the run.')
} else {
  console.log('No --pin: open the section from #/presenter, or submissions come back "closed".')
}

const ticker = setInterval(() => report(), 5000)
const deadline = Date.now() + durationSeconds * 1000
await Promise.all(Array.from({ length: phones }, (_, index) => phone(index, deadline)))
clearInterval(ticker)
report(true)

if (pin) {
  await postJson({ action: 'control', pin, op: 'close' })
  console.log('Prompt closed.')
  if (args.reset === 'true') {
    await postJson({ action: 'control', pin, op: 'reset', promptId })
    console.log(`Cleared every answer for ${promptId}.`)
  } else {
    console.log(`Rows kept. Clear them with --reset, or from the console.`)
  }
}
