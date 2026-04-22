import type { CircuitNode, Direction, Terminal } from './types'

/**
 * Bezier from 2016 canvas: control points (x1+d, y1) and (x2-d, y2) with d = ||p2-p1||/2
 */
export function wirePathD(p1: { x: number; y: number }, p2: { x: number; y: number }): string {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const d = Math.hypot(dx, dy) / 2
  return `M ${p1.x} ${p1.y} C ${p1.x + d} ${p1.y} ${p2.x - d} ${p2.y} ${p2.x} ${p2.y}`
}

/** Connection point inside scene coords (matches old setP1/setP2 offsets from terminal top-left). */
export function terminalWirePoint(node: CircuitNode, term: Terminal): { x: number; y: number } {
  const x0 = node.pos.x + term.offset.x
  const y0 = node.pos.y + term.offset.y
  const a = anchorOffset(term.direction)
  return { x: x0 + a.x, y: y0 + a.y }
}

function anchorOffset(dir: Direction): { x: number; y: number } {
  switch (dir) {
    case 'left':
      return { x: 18, y: 13 }
    case 'right':
      return { x: 3, y: 13 }
    case 'top':
      return { x: 10, y: 15 }
    case 'bottom':
      return { x: 10, y: 0 }
  }
}
