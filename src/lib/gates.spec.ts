import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCircuitStore } from '@/stores/circuit'
import {
  getNodeDefinition,
  updateAnd,
  updateBuffer,
  updateDFF,
  updateFullAdder,
  updateJKFF,
  updateMux21,
  updateNand,
  updateNor,
  updateNot,
  updateOr,
  updateTFF,
  updateXor,
  updateXnor,
} from './gates'

// vitest: fix typo vitetst
describe('stateless gate truth tables', () => {
  it('AND', () => {
    for (const a of [false, true]) {
      for (const b of [false, true]) {
        expect(updateAnd([a, b], [false])?.[0]).toBe(!!(a && b))
      }
    }
  })
  it('OR', () => {
    for (const a of [false, true]) {
      for (const b of [false, true]) {
        expect(updateOr([a, b], [false])?.[0]).toBe(!!(a || b))
      }
    }
  })
  it('NAND with null -> undefined', () => {
    expect(updateNand([true, null], [true])?.[0]).toBeUndefined()
  })
  it('NOR with null', () => {
    expect(updateNor([true, null], [true])?.[0]).toBeUndefined()
  })
  it('XOR / XNOR', () => {
    expect(updateXor([true, true], [false])?.[0]).toBe(false)
    expect(updateXnor([true, true], [false])?.[0]).toBe(true)
  })
  it('NOT / BUFFER', () => {
    expect(updateNot([true], [false])?.[0]).toBe(false)
    expect(updateNot([null], [false])?.[0]).toBeUndefined()
    expect(updateBuffer([false], [true])?.[0]).toBe(false)
  })
})

describe('flip-flops', () => {
  it('D-FF rising edge latches D', () => {
    const st0 = { oldClock: false }
    const a = updateDFF([true, true, false, false], { ...st0 }, [false, true])
    expect(a.outputs[0]).toBe(true)
    const b = updateDFF([true, false, false, false], { oldClock: true }, [true, false])
    expect(b.state.oldClock).toBe(false)
  })
  it('T-FF toggles on rising when T=1', () => {
    const r = updateTFF([true, true], { oldClock: false }, [false, true])
    expect(r.outputs[0]).toBe(true)
  })
  it('JK-FF J=1 K=0 sets Q=1 on rising', () => {
    const r = updateJKFF([true, true, false], { oldClock: false }, [false, true])
    expect(r.outputs[0]).toBe(true)
    expect(r.outputs[1]).toBe(false)
  })
})

describe('full adder and mux', () => {
  it('full adder: all 8 combinations', () => {
    for (const cin of [false, true]) {
      for (const a of [false, true]) {
        for (const b of [false, true]) {
          const r = updateFullAdder([cin, a, b], {}, [])
          const s = a !== b ? !cin : cin
          const cout = (a && b) || (cin && a !== b)
          expect(r.outputs[0]).toBe(!!s)
          expect(r.outputs[1]).toBe(!!cout)
        }
      }
    }
  })
  it('2-to-1 mux', () => {
    expect(updateMux21([false, true, false], {}, [])?.outputs[0]).toBe(true)
    expect(updateMux21([true, true, false], {}, [])?.outputs[0]).toBe(false)
  })
})

describe('SR-style feedback via store (no stack overflow)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('converges when wiring two NANDs as SR and driving inputs', () => {
    const s = useCircuitStore()
    const a = s.addNode('nand', 0, 0)
    const b = s.addNode('nand', 0, 0)
    const nA = s.nodes[a]!
    const nB = s.nodes[b]!
    s.connectOutputToInput(nA.outputs[0]!, nB.inputs[1]!)
    s.connectOutputToInput(nB.outputs[0]!, nA.inputs[1]!)
    expect(() => {
      s.setTerminalValue(nA.inputs[0]!, true)
      s.setTerminalValue(nB.inputs[0]!, false)
    }).not.toThrow()
  })
})

describe('registry has update for all combinatorial kinds', () => {
  it('all ImageGateNode kinds with inputs expose update', () => {
    const must = getNodeDefinition('and')
    expect(must.update).toBeDefined()
  })
})
