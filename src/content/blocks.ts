import type { BlockId } from './types'

/* ---------------------------------------------------------------------------
   The teaching spine, as the audience sees it on the progress map: four
   stations along one ruled line. Two of them carry parts, named only while
   that part is the current one.
   --------------------------------------------------------------------------- */

export interface Station {
  id: string
  label: string
  /** Blocks that belong to this station, in running order. */
  parts: { id: BlockId; label?: string }[]
}

export const STATIONS: Station[] = [
  { id: 'leadership', label: 'Leadership', parts: [{ id: 'leadership' }] },
  {
    id: 'self',
    label: 'Leading Self',
    parts: [
      { id: 'purpose', label: 'Purpose' },
      { id: 'ei', label: 'EI' },
    ],
  },
  {
    id: 'others',
    label: 'Leading Others',
    parts: [
      { id: 'trust', label: 'Trust' },
      { id: 'styles', label: 'Styles' },
    ],
  },
  { id: 'legacy', label: 'Legacy', parts: [{ id: 'legacy' }] },
]

export function stationOf(block: BlockId | undefined) {
  if (!block) return null
  for (const station of STATIONS) {
    const part = station.parts.find((p) => p.id === block)
    if (part) return { station, part }
  }
  return null
}
