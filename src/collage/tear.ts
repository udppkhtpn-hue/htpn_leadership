import { between, makeRandom } from '../lib/random'

export type EdgeStyle = 'torn' | 'scissor' | 'straight'

interface TearOptions {
  /** How far the edge wanders, in percent of the box. */
  amplitude?: number
  /** Points generated per edge. Fewer reads as scissor-cut. */
  steps?: number
  /** Which edges are cut; the rest stay straight (e.g. a clipping's spine). */
  edges?: { top?: boolean; right?: boolean; bottom?: boolean; left?: boolean }
}

const PRESETS: Record<EdgeStyle, Required<Pick<TearOptions, 'amplitude' | 'steps'>>> = {
  torn: { amplitude: 1.6, steps: 14 },
  scissor: { amplitude: 0.7, steps: 5 },
  straight: { amplitude: 0, steps: 1 },
}

/**
 * A CSS `polygon()` whose edges are irregular, like paper pulled apart by hand.
 * Deterministic for a given seed, so a piece lands identically on every reload,
 * and computed once — clip-path with a static polygon costs nothing per frame.
 */
export function tornPolygon(seed: string, style: EdgeStyle = 'torn', options: TearOptions = {}): string {
  const preset = PRESETS[style]
  const amplitude = options.amplitude ?? preset.amplitude
  const steps = options.steps ?? preset.steps
  const edges = { top: true, right: true, bottom: true, left: true, ...options.edges }
  const random = makeRandom(seed)
  const points: string[] = []

  const wander = (cut: boolean) => (cut ? between(random, -amplitude, amplitude) : 0)

  // Clockwise from the top-left corner.
  for (let i = 0; i <= steps; i += 1) {
    const x = (i / steps) * 100
    points.push(`${x.toFixed(2)}% ${Math.max(0, wander(edges.top)).toFixed(2)}%`)
  }
  for (let i = 1; i <= steps; i += 1) {
    const y = (i / steps) * 100
    points.push(`${(100 - Math.max(0, wander(edges.right))).toFixed(2)}% ${y.toFixed(2)}%`)
  }
  for (let i = 1; i <= steps; i += 1) {
    const x = 100 - (i / steps) * 100
    points.push(`${x.toFixed(2)}% ${(100 - Math.max(0, wander(edges.bottom))).toFixed(2)}%`)
  }
  for (let i = 1; i < steps; i += 1) {
    const y = 100 - (i / steps) * 100
    points.push(`${Math.max(0, wander(edges.left)).toFixed(2)}% ${y.toFixed(2)}%`)
  }

  return `polygon(${points.join(', ')})`
}

/** An organic closed path for ink blots and bleeds, in a 100x100 viewBox. */
export function blotPath(seed: string, lobes = 9, radius = 34, wobble = 0.42): string {
  const random = makeRandom(seed)
  const points: { x: number; y: number }[] = []
  for (let i = 0; i < lobes; i += 1) {
    const angle = (i / lobes) * Math.PI * 2
    const r = radius * between(random, 1 - wobble, 1 + wobble)
    points.push({ x: 50 + Math.cos(angle) * r, y: 50 + Math.sin(angle) * r })
  }

  // Closed Catmull-Rom through the lobes, emitted as cubic beziers so the
  // outline stays soft rather than faceted.
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`
  for (let i = 0; i < points.length; i += 1) {
    const p0 = points[(i - 1 + points.length) % points.length]
    const p1 = points[i]
    const p2 = points[(i + 1) % points.length]
    const p3 = points[(i + 2) % points.length]
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    d += ` C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}, ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }
  return `${d} Z`
}
