import type { NodeComponentName, NodeKind, TermValue } from './types'

export interface TermSpec {
  offset: { x: number; y: number }
  direction: 'left' | 'right' | 'top' | 'bottom'
  default: TermValue
}

export type UpdateFn = (
  inputs: TermValue[],
  state: Record<string, unknown>,
  currentOutputs: TermValue[],
) => { outputs: TermValue[]; state: Record<string, unknown> }

export interface NodeDefinition {
  kind: NodeKind
  title: string
  image?: string
  /** backgroundPosition x,y and backgroundSize w,h in px (matches old setBackgroundImage) */
  bgOffset?: { x: number; y: number; w: number; h: number }
  size: { w: number; h: number }
  inputs: TermSpec[]
  outputs: TermSpec[]
  update?: UpdateFn
  component: NodeComponentName
  initialState?: Record<string, unknown>
}

/* --- pure logic for tests and registry --- */

export function updateNot(inputs: TermValue[], _c: TermValue[]): TermValue[] {
  const v = inputs[0]
  if (v === null || v === undefined) return [undefined]
  if (typeof v === 'boolean') return [!v]
  return [undefined]
}

export function updateBuffer(inputs: TermValue[], _c: TermValue[]): TermValue[] {
  return [inputs[0]]
}

export function updateAnd(inputs: TermValue[], _c: TermValue[]): TermValue[] {
  return [!!(inputs[0] && inputs[1])]
}

export function updateNand(inputs: TermValue[], _c: TermValue[]): TermValue[] {
  const a = inputs[0]
  const b = inputs[1]
  if (a === null || a === undefined || b === null || b === undefined) return [undefined]
  if (typeof a === 'boolean' && typeof b === 'boolean') return [!(a && b)]
  return [undefined]
}

export function updateOr(inputs: TermValue[], _c: TermValue[]): TermValue[] {
  return [!!(inputs[0] || inputs[1])]
}

export function updateNor(inputs: TermValue[], _c: TermValue[]): TermValue[] {
  const a = inputs[0]
  const b = inputs[1]
  if (a === null || a === undefined || b === null || b === undefined) return [undefined]
  if (typeof a === 'boolean' && typeof b === 'boolean') return [!(a || b)]
  return [undefined]
}

export function updateXor(inputs: TermValue[], _c: TermValue[]): TermValue[] {
  const a = inputs[0]
  const b = inputs[1]
  if (a === null || a === undefined || b === null || b === undefined) return [undefined]
  if (typeof a === 'boolean' && typeof b === 'boolean')
    return [!!(a !== b && (a || b))] // (a || b) && !(a && b)
  return [undefined]
}

export function updateXnor(inputs: TermValue[], _c: TermValue[]): TermValue[] {
  const a = inputs[0]
  const b = inputs[1]
  if (a === null || a === undefined || b === null || b === undefined) return [undefined]
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    const x = !!(a || b) && !(a && b)
    return [!x]
  }
  return [undefined]
}

export function updateDFF(
  inputs: TermValue[],
  state: Record<string, unknown>,
  _out: TermValue[],
): { outputs: TermValue[]; state: Record<string, unknown> } {
  const d = inputs[0]
  const c = inputs[1]
  const s = inputs[2]
  const r = inputs[3]
  const oldClock = state.oldClock === true

  if (typeof s === 'boolean' && typeof r === 'boolean') {
    if (s && r) return { outputs: [true, true], state: { oldClock: c === true } }
    if (r && !s) return { outputs: [false, true], state: { oldClock: c === true } }
    if (!r && s) return { outputs: [false, true], state: { oldClock: c === true } }
  }
  if (d === undefined || c === null || c === undefined || d === null) {
    return { outputs: [undefined, undefined], state: { oldClock: c === true } }
  }
  if (oldClock === false && c === true) {
    if (typeof d === 'boolean') {
      return { outputs: [d, !d], state: { oldClock: c === true } }
    }
  }
  return { outputs: [undefined, undefined], state: { oldClock: c === true } }
}

export function updateTFF(
  inputs: TermValue[],
  state: Record<string, unknown>,
  out: TermValue[],
): { outputs: TermValue[]; state: Record<string, unknown> } {
  const t = inputs[0]
  const c = inputs[1]
  const oldClock = state.oldClock === true
  if (t === null || t === undefined || c === null || c === undefined) {
    return { outputs: [false, true], state: { oldClock: c === true } }
  }
  if (t !== true) return { outputs: [out[0] ?? false, out[1] ?? true], state: { oldClock: c === true } }
  if (oldClock === false && c === true) {
    const q = out[0] === true
    return { outputs: [!q, q], state: { oldClock: c === true } }
  }
  return { outputs: [out[0] ?? false, out[1] ?? true], state: { oldClock: c === true } }
}

export function updateJKFF(
  inputs: TermValue[],
  state: Record<string, unknown>,
  out: TermValue[],
): { outputs: TermValue[]; state: Record<string, unknown> } {
  const j = inputs[0]
  const c = inputs[1]
  const k = inputs[2]
  if (j === null || c === null || k === null || j === undefined || c === undefined || k === undefined) {
    return { outputs: [false, false], state: { oldClock: c === true } }
  }
  const oldC = state.oldClock === true
  if (c !== oldC) {
    if (c === true) {
      const q = out[0] === true
      if (j === true && k === true) {
        return { outputs: [!q, q], state: { oldClock: c } }
      }
      if (j === true && k === false) {
        return { outputs: [true, false], state: { oldClock: c } }
      }
      if (j === false && k === true) {
        return { outputs: [false, true], state: { oldClock: c } }
      }
      return { outputs: [out[0] ?? false, out[1] ?? false], state: { oldClock: c } }
    }
    return { outputs: [out[0] ?? false, out[1] ?? false], state: { oldClock: c } }
  }
  return { outputs: [out[0] ?? false, out[1] ?? false], state }
}

export function updateGatedDLatch(
  inputs: TermValue[],
  _s: Record<string, unknown>,
  out: TermValue[],
): { outputs: TermValue[]; state: Record<string, unknown> } {
  const d = inputs[0]
  const e = inputs[1]
  if (d === null || e === null || d === undefined || e === undefined) {
    return { outputs: [false, true], state: {} }
  }
  if (e === true && typeof d === 'boolean') {
    return { outputs: [d, !d], state: {} }
  }
  return { outputs: [out[0] ?? false, out[1] ?? true], state: {} }
}

export function updateFullAdder(inputs: TermValue[], _s: unknown, _o: TermValue[]): { outputs: TermValue[]; state: Record<string, unknown> } {
  const cin = inputs[0] === true
  const a = inputs[1] === true
  const b = inputs[2] === true
  if (inputs[0] === undefined || inputs[1] === undefined || inputs[2] === undefined) {
    return { outputs: [false, false], state: {} }
  }
  const axorb = a !== b
  const s = (axorb && !cin) || (!axorb && cin)
  const cout = (a && b) || (cin && axorb)
  return { outputs: [!!s, !!cout], state: {} }
}

export function updateMux21(inputs: TermValue[], _s: unknown, _o: TermValue[]): { outputs: TermValue[]; state: Record<string, unknown> } {
  const s = inputs[0]
  const i1 = inputs[1]
  const i2 = inputs[2]
  if (s !== undefined && typeof s === 'boolean') {
    if (s === false) return { outputs: [i1 as TermValue], state: {} }
    return { outputs: [i2 as TermValue], state: {} }
  }
  return { outputs: [undefined], state: {} }
}

function wrap2(
  fn: (i: TermValue[], c: TermValue[]) => TermValue[],
): UpdateFn {
  return (inputs, state, out) => ({
    outputs: fn(inputs, out),
    state: { ...state },
  })
}

function wrapDFF(
  fn: typeof updateDFF,
): UpdateFn {
  return (inputs, state, out) => fn(inputs, state, out)
}

const nodeRegistry: NodeDefinition[] = [
  {
    kind: 'not',
    title: 'NOT Gate',
    image: '/images/sidebar/not-icon.png',
    bgOffset: { x: 50, y: 35, w: 100, h: 100 },
    size: { w: 200, h: 125 },
    inputs: [{ offset: { x: -2, y: 75 }, direction: 'left', default: false }],
    outputs: [{ offset: { x: 183, y: 75 }, direction: 'right', default: true }],
    update: wrap2(updateNot),
    component: 'ImageGateNode',
  },
  {
    kind: 'buffer',
    title: 'BUFFER Gate',
    image: '/images/sidebar/buffer-icon.png',
    bgOffset: { x: 50, y: 35, w: 100, h: 100 },
    size: { w: 200, h: 125 },
    inputs: [{ offset: { x: -2, y: 75 }, direction: 'left', default: false }],
    outputs: [{ offset: { x: 183, y: 75 }, direction: 'right', default: false }],
    update: wrap2(updateBuffer),
    component: 'ImageGateNode',
  },
  {
    kind: 'and',
    title: 'AND Gate',
    image: '/images/sidebar/and-icon.png',
    bgOffset: { x: 50, y: 62, w: 100, h: 100 },
    size: { w: 200, h: 175 },
    inputs: [
      { offset: { x: -2, y: 75 }, direction: 'left', default: false },
      { offset: { x: -2, y: 125 }, direction: 'left', default: false },
    ],
    outputs: [{ offset: { x: 183, y: 100 }, direction: 'right', default: false }],
    update: wrap2(updateAnd),
    component: 'ImageGateNode',
  },
  {
    kind: 'nand',
    title: 'NAND Gate',
    image: '/images/sidebar/nand-icon.png',
    bgOffset: { x: 50, y: 62, w: 100, h: 100 },
    size: { w: 200, h: 175 },
    inputs: [
      { offset: { x: -2, y: 75 }, direction: 'left', default: false },
      { offset: { x: -2, y: 125 }, direction: 'left', default: false },
    ],
    outputs: [{ offset: { x: 183, y: 100 }, direction: 'right', default: true }],
    update: wrap2(updateNand),
    component: 'ImageGateNode',
  },
  {
    kind: 'or',
    title: 'OR Gate',
    image: '/images/sidebar/or-icon.png',
    bgOffset: { x: 50, y: 62, w: 100, h: 100 },
    size: { w: 200, h: 175 },
    inputs: [
      { offset: { x: -2, y: 75 }, direction: 'left', default: false },
      { offset: { x: -2, y: 125 }, direction: 'left', default: false },
    ],
    outputs: [{ offset: { x: 183, y: 100 }, direction: 'right', default: true }],
    update: wrap2(updateOr),
    component: 'ImageGateNode',
  },
  {
    kind: 'nor',
    title: 'NOR Gate',
    image: '/images/sidebar/nor-icon.png',
    bgOffset: { x: 50, y: 62, w: 100, h: 100 },
    size: { w: 200, h: 175 },
    inputs: [
      { offset: { x: -2, y: 75 }, direction: 'left', default: false },
      { offset: { x: -2, y: 125 }, direction: 'left', default: false },
    ],
    outputs: [{ offset: { x: 183, y: 100 }, direction: 'right', default: true }],
    update: wrap2(updateNor),
    component: 'ImageGateNode',
  },
  {
    kind: 'xor',
    title: 'XOR Gate',
    image: '/images/sidebar/xor-icon.png',
    bgOffset: { x: 50, y: 62, w: 100, h: 100 },
    size: { w: 200, h: 175 },
    inputs: [
      { offset: { x: -2, y: 75 }, direction: 'left', default: false },
      { offset: { x: -2, y: 125 }, direction: 'left', default: false },
    ],
    outputs: [{ offset: { x: 183, y: 100 }, direction: 'right', default: false }],
    update: wrap2(updateXor),
    component: 'ImageGateNode',
  },
  {
    kind: 'xnor',
    title: 'XNOR Gate',
    image: '/images/sidebar/xnor-icon.png',
    bgOffset: { x: 50, y: 62, w: 100, h: 100 },
    size: { w: 200, h: 175 },
    inputs: [
      { offset: { x: -2, y: 75 }, direction: 'left', default: false },
      { offset: { x: -2, y: 125 }, direction: 'left', default: false },
    ],
    outputs: [{ offset: { x: 183, y: 100 }, direction: 'right', default: true }],
    update: wrap2(updateXnor),
    component: 'ImageGateNode',
  },
  {
    kind: 'd-ff',
    title: 'D-Flip-Flop',
    image: '/images/sidebar/d-flip-flop.png',
    bgOffset: { x: 50, y: 62, w: 100, h: 100 },
    size: { w: 200, h: 175 },
    initialState: { oldClock: false },
    inputs: [
      { offset: { x: -2, y: 75 }, direction: 'left', default: false },
      { offset: { x: -2, y: 125 }, direction: 'left', default: false },
      { offset: { x: 88, y: 50 }, direction: 'top', default: false },
      { offset: { x: 88, y: 150 }, direction: 'bottom', default: false },
    ],
    outputs: [
      { offset: { x: 183, y: 75 }, direction: 'right', default: false },
      { offset: { x: 183, y: 120 }, direction: 'right', default: true },
    ],
    update: (inputs, st, o) => updateDFF(inputs, { ...st }, o),
    component: 'ImageGateNode',
  },
  {
    kind: 't-ff',
    title: 'T-Flip-Flop',
    image: '/images/sidebar/t-flip-flop.png',
    bgOffset: { x: 35, y: 46, w: 130, h: 130 },
    size: { w: 200, h: 175 },
    initialState: { oldClock: false },
    inputs: [
      { offset: { x: -2, y: 75 }, direction: 'left', default: false },
      { offset: { x: -2, y: 125 }, direction: 'left', default: false },
    ],
    outputs: [
      { offset: { x: 183, y: 75 }, direction: 'right', default: false },
      { offset: { x: 183, y: 120 }, direction: 'right', default: true },
    ],
    update: (inputs, st, o) => updateTFF(inputs, { ...st }, o),
    component: 'ImageGateNode',
  },
  {
    kind: 'jk-ff',
    title: 'JK-Flip-Flop',
    image: '/images/sidebar/jk-flip-flop.png',
    bgOffset: { x: 32, y: 43, w: 140, h: 140 },
    size: { w: 200, h: 175 },
    initialState: { oldClock: true },
    inputs: [
      { offset: { x: -2, y: 75 }, direction: 'left', default: false },
      { offset: { x: -2, y: 100 }, direction: 'left', default: false },
      { offset: { x: -2, y: 125 }, direction: 'left', default: false },
    ],
    outputs: [
      { offset: { x: 183, y: 75 }, direction: 'right', default: false },
      { offset: { x: 183, y: 120 }, direction: 'right', default: false },
    ],
    update: (inputs, st, o) => updateJKFF(inputs, { ...st }, o),
    component: 'ImageGateNode',
  },
  {
    kind: 'gated-d-latch',
    title: 'Gated D Latch',
    image: '/images/sidebar/gated-d-latch.png',
    bgOffset: { x: 35, y: 46, w: 130, h: 130 },
    size: { w: 200, h: 175 },
    inputs: [
      { offset: { x: -2, y: 75 }, direction: 'left', default: false },
      { offset: { x: -2, y: 125 }, direction: 'left', default: false },
    ],
    outputs: [
      { offset: { x: 183, y: 75 }, direction: 'right', default: false },
      { offset: { x: 183, y: 120 }, direction: 'right', default: true },
    ],
    update: (inputs, st, o) => {
      return updateGatedDLatch(inputs, st, o)
    },
    component: 'ImageGateNode',
  },
  {
    kind: 'full-adder',
    title: '1-Bit Full Adder',
    image: '/images/sidebar/1-bit-full-adder.png',
    bgOffset: { x: 35, y: 46, w: 130, h: 130 },
    size: { w: 200, h: 175 },
    inputs: [
      { offset: { x: 88, y: 40 }, direction: 'top', default: false },
      { offset: { x: -2, y: 75 }, direction: 'left', default: false },
      { offset: { x: -2, y: 125 }, direction: 'left', default: false },
    ],
    outputs: [
      { offset: { x: 183, y: 98 }, direction: 'right', default: false },
      { offset: { x: 88, y: 157 }, direction: 'bottom', default: false },
    ],
    update: (inputs, st, o) => updateFullAdder(inputs, st, o),
    component: 'ImageGateNode',
  },
  {
    kind: 'mux-2-1',
    title: '2-to-1 Multiplexer',
    image: '/images/sidebar/2-to-1-multiplexer.png',
    bgOffset: { x: 35, y: 46, w: 130, h: 130 },
    size: { w: 200, h: 175 },
    inputs: [
      { offset: { x: 88, y: 157 }, direction: 'bottom', default: false },
      { offset: { x: -2, y: 75 }, direction: 'left', default: false },
      { offset: { x: -2, y: 125 }, direction: 'left', default: false },
    ],
    outputs: [{ offset: { x: 183, y: 98 }, direction: 'right', default: false }],
    update: (inputs, st, o) => updateMux21(inputs, st, o),
    component: 'ImageGateNode',
  },
  {
    kind: 'sawtooth',
    title: 'Sawtooth Generator',
    /** Sidebar palette only; original app had no node background (plain gray 250×125). */
    image: '/images/sidebar/sawtooth-generator.png',
    size: { w: 250, h: 125 },
    initialState: { oldClock: false, output: 0, precision: 0.01 },
    inputs: [{ offset: { x: -2, y: 75 }, direction: 'left', default: false }],
    outputs: [{ offset: { x: 233, y: 75 }, direction: 'right', default: 0 }],
    update: (inputs, st) => {
      const clk = inputs[0] === true
      const old = st.oldClock === true
      const precision = typeof st.precision === 'number' ? st.precision : 0.01
      let out = typeof st.output === 'number' ? st.output : 0
      if (!old && clk) {
        out += precision
        if (out > 1) out = 0
      }
      return { outputs: [out], state: { ...st, oldClock: clk, output: out, precision } }
    },
    component: 'SawtoothNode',
  },
  {
    kind: 'clock',
    title: 'Clock',
    size: { w: 250, h: 175 },
    initialState: { interval: 1000, dutyCycle: 50, onTime: 500, offTime: 500 },
    inputs: [],
    outputs: [{ offset: { x: 233, y: 100 }, direction: 'right', default: true }],
    component: 'ClockNode',
  },
  {
    kind: 'probe',
    title: 'Probe',
    image: '/images/sidebar/probe-icon.png',
    size: { w: 200, h: 125 },
    inputs: [{ offset: { x: -2, y: 75 }, direction: 'left', default: false }],
    outputs: [],
    component: 'ProbeNode',
  },
  {
    kind: 'pushbutton',
    title: 'Pushbutton',
    image: '/images/sidebar/pushbutton-1-normal.png',
    bgOffset: { x: 0, y: 5, w: 152, h: 120 },
    size: { w: 200, h: 125 },
    inputs: [],
    outputs: [{ offset: { x: 183, y: 50 }, direction: 'right', default: false }],
    component: 'PushbuttonNode',
  },
  {
    kind: 'toggle',
    title: 'Toggle',
    image: '/images/sidebar/switch-1-off.png',
    bgOffset: { x: 20, y: 0, w: 130, h: 130 },
    size: { w: 200, h: 125 },
    initialState: { on: false },
    inputs: [],
    outputs: [{ offset: { x: 183, y: 50 }, direction: 'right', default: false }],
    component: 'ToggleSwitchNode',
  },
  {
    kind: 'motion',
    title: 'Motion',
    image: '/images/sidebar/motiondetector-normal.png',
    bgOffset: { x: 20, y: 0, w: 130, h: 130 },
    size: { w: 200, h: 125 },
    inputs: [],
    outputs: [{ offset: { x: 183, y: 50 }, direction: 'right', default: false }],
    component: 'MotionDetectorNode',
  },
]

export const nodeDefinitions: Record<NodeKind, NodeDefinition> = {} as Record<NodeKind, NodeDefinition>
for (const def of nodeRegistry) {
  nodeDefinitions[def.kind] = def
}

export function getNodeDefinition(kind: NodeKind): NodeDefinition {
  return nodeDefinitions[kind]!
}

export const SIDEBAR_SECTIONS: { title: string; kinds: NodeKind[] }[] = [
  {
    title: 'Logic Gates',
    kinds: ['not', 'buffer', 'and', 'nand', 'or', 'nor', 'xor', 'xnor'],
  },
  {
    title: 'Flip-Flops & Latch',
    kinds: ['d-ff', 't-ff', 'jk-ff', 'gated-d-latch'],
  },
  {
    title: 'Digital Circuits',
    kinds: ['full-adder', 'mux-2-1', 'sawtooth'],
  },
  {
    title: 'Input Devices',
    kinds: ['clock', 'pushbutton', 'toggle', 'motion'],
  },
  { title: 'Output Devices', kinds: ['probe'] },
]
