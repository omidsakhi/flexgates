export type TermValue = boolean | number | null | undefined

export type Direction = 'left' | 'right' | 'top' | 'bottom'
export type TermKind = 'input' | 'output'

export type NodeKind =
  | 'not'
  | 'buffer'
  | 'and'
  | 'nand'
  | 'or'
  | 'nor'
  | 'xor'
  | 'xnor'
  | 'd-ff'
  | 't-ff'
  | 'jk-ff'
  | 'gated-d-latch'
  | 'full-adder'
  | 'mux-2-1'
  | 'clock'
  | 'probe'
  | 'pushbutton'
  | 'toggle'
  | 'motion'
  | 'sawtooth'

export type NodeComponentName =
  | 'ImageGateNode'
  | 'ClockNode'
  | 'ProbeNode'
  | 'PushbuttonNode'
  | 'ToggleSwitchNode'
  | 'MotionDetectorNode'
  | 'SawtoothNode'

export interface Terminal {
  id: string
  nodeId: string
  kind: TermKind
  direction: Direction
  offset: { x: number; y: number }
  value: TermValue
  /** Wire ids this terminal is part of */
  wires: string[]
}

export interface CircuitNode {
  id: string
  kind: NodeKind
  title: string
  pos: { x: number; y: number }
  size: { w: number; h: number }
  selected: boolean
  inputs: string[]
  outputs: string[]
  state: Record<string, unknown>
}

export interface Wire {
  id: string
  outputTerminalId: string
  inputTerminalId: string
}

export interface WireInCreation {
  fromOutputTerminalId: string
  mouse: { x: number; y: number }
}
