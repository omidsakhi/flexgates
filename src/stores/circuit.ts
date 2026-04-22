import { defineStore } from 'pinia'
import { getNodeDefinition } from '@/lib/gates'
import { terminalWirePoint } from '@/lib/wirePath'
import type { CircuitNode, NodeKind, TermValue, Terminal, Wire, WireInCreation } from '@/lib/types'

let idSeq = 0
function genId(prefix: string): string {
  return `${prefix}_${++idSeq}_${Math.random().toString(36).slice(2, 9)}`
}

export const useCircuitStore = defineStore('circuit', {
  state: () => ({
    nodes: {} as Record<string, CircuitNode>,
    terminals: {} as Record<string, Terminal>,
    wires: {} as Record<string, Wire>,
    wireInCreation: null as WireInCreation | null,
    /** Cumulative world offset: panned view = translate(scenePan) on the canvas layer. */
    scenePan: { x: 0, y: 0 } as { x: number; y: number },
  }),

  actions: {
    applyScenePanDelta(dx: number, dy: number) {
      this.scenePan.x += dx
      this.scenePan.y += dy
    },

    addNode(kind: NodeKind, x: number, y: number): string {
      const def = getNodeDefinition(kind)
      const nodeId = genId('node')
      const inputs: string[] = []
      const outputs: string[] = []
      for (const spec of def.inputs) {
        const id = genId('term')
        this.terminals[id] = {
          id,
          nodeId,
          kind: 'input',
          direction: spec.direction,
          offset: { ...spec.offset },
          value: spec.default,
          wires: [],
        }
        inputs.push(id)
      }
      for (const spec of def.outputs) {
        const id = genId('term')
        this.terminals[id] = {
          id,
          nodeId,
          kind: 'output',
          direction: spec.direction,
          offset: { ...spec.offset },
          value: spec.default,
          wires: [],
        }
        outputs.push(id)
      }
      this.nodes[nodeId] = {
        id: nodeId,
        kind,
        title: def.title,
        pos: { x, y },
        size: { ...def.size },
        selected: false,
        inputs,
        outputs,
        state: { ...(def.initialState ? { ...def.initialState } : {}) },
      }
      return nodeId
    },

    removeNode(id: string) {
      const node = this.nodes[id]
      if (!node) return
      for (const tid of [...node.inputs, ...node.outputs]) {
        const t = this.terminals[tid]!
        for (const wid of [...t.wires]) {
          this.removeWire(wid)
        }
        delete this.terminals[tid]
      }
      delete this.nodes[id]
    },

    moveNode(id: string, dx: number, dy: number) {
      const n = this.nodes[id]
      if (!n) return
      n.pos.x += dx
      n.pos.y += dy
    },

    /** Move every selected node by the same delta (multi-drag). */
    moveSelectedNodes(dx: number, dy: number) {
      for (const n of Object.values(this.nodes)) {
        if (n.selected) this.moveNode(n.id, dx, dy)
      }
    },

    /**
     * On pointer down before drag: Shift toggles this node. Otherwise, if the node is
     * already selected, keep the current selection; if not, select only this node.
     */
    selectForDrag(nodeId: string, shiftKey: boolean) {
      if (shiftKey) {
        const n = this.nodes[nodeId]
        if (n) this.setSelected(nodeId, !n.selected)
        return
      }
      if (this.nodes[nodeId]?.selected) {
        return
      }
      for (const id of Object.keys(this.nodes)) {
        this.setSelected(id, id === nodeId)
      }
    },

    /** Clear other selections; only `nodeId` stays selected (used after multi-select “solo” click). */
    selectOnly(nodeId: string) {
      for (const id of Object.keys(this.nodes)) {
        this.setSelected(id, id === nodeId)
      }
    },

    setSelected(id: string, selected: boolean) {
      const n = this.nodes[id]
      if (n) n.selected = selected
    },

    selectAll(select: boolean) {
      for (const n of Object.values(this.nodes)) {
        n.selected = select
      }
    },

    toggleSelectAll() {
      const all = Object.values(this.nodes)
      if (all.length === 0) return
      const allOn = all.every((n) => n.selected)
      this.selectAll(!allOn)
    },

    deleteSelected() {
      const toRemove = Object.values(this.nodes)
        .filter((n) => n.selected)
        .map((n) => n.id)
      for (const id of toRemove) {
        this.removeNode(id)
      }
    },

    setNodeState(nodeId: string, patch: Record<string, unknown>) {
      const n = this.nodes[nodeId]
      if (!n) return
      n.state = { ...n.state, ...patch }
    },

    setTerminalValue(termId: string, val: TermValue) {
      const t = this.terminals[termId]
      if (t == null) return
      if (t.value === val) return
      t.value = val
      if (t.kind === 'output') {
        for (const wid of t.wires) {
          const w = this.wires[wid]
          if (w) this.setTerminalValue(w.inputTerminalId, val)
        }
      } else {
        const node = this.nodes[t.nodeId]
        if (!node) return
        const def = getNodeDefinition(node.kind)
        if (def.update) {
          const inputs = node.inputs.map((id) => this.terminals[id]!.value)
          const outVals = node.outputs.map((id) => this.terminals[id]!.value)
          const { outputs, state } = def.update(inputs, { ...node.state }, outVals)
          node.state = state
          for (let i = 0; i < node.outputs.length; i++) {
            this.setTerminalValue(node.outputs[i]!, outputs[i]!)
          }
        }
      }
    },

    toggleInputTerminal(termId: string) {
      const t = this.terminals[termId]
      if (t == null || t.kind !== 'input') return
      if (t.wires.length > 0) return
      const v = t.value
      const next: TermValue = v === null ? false : !v
      this.setTerminalValue(termId, next)
    },

    startWireFromOutput(outputTerminalId: string) {
      const p = this.terminalScenePoint(outputTerminalId)
      this.wireInCreation = { fromOutputTerminalId: outputTerminalId, mouse: { x: p.x, y: p.y } }
    },

    startWireRerouteFromInput(inputTerminalId: string) {
      const t = this.terminals[inputTerminalId]
      if (t == null || t.kind !== 'input' || t.wires.length === 0) return
      const wid = t.wires[0]!
      const w = this.wires[wid]
      if (w) {
        this.removeWire(wid)
        const outId = w.outputTerminalId
        const p = this.terminalScenePoint(outId)
        this.wireInCreation = { fromOutputTerminalId: outId, mouse: { x: p.x, y: p.y } }
      }
    },

    updateWireMouse(x: number, y: number) {
      if (this.wireInCreation) {
        this.wireInCreation.mouse = { x, y }
      }
    },

    completeWireToInput(inputTerminalId: string) {
      if (!this.wireInCreation) return
      const outT = this.terminals[this.wireInCreation.fromOutputTerminalId]!
      const inT = this.terminals[inputTerminalId]!
      if (inT.kind !== 'input' || outT.kind !== 'output') {
        this.cancelWire()
        return
      }
      if (inT.wires.length > 0) {
        this.cancelWire()
        return
      }
      if (inT.nodeId === outT.nodeId) {
        this.cancelWire()
        return
      }
      const wid = genId('wire')
      this.wires[wid] = {
        id: wid,
        outputTerminalId: outT.id,
        inputTerminalId: inT.id,
      }
      inT.wires = [wid]
      outT.wires.push(wid)
      this.setTerminalValue(inT.id, outT.value)
      this.wireInCreation = null
    },

    cancelWire() {
      this.wireInCreation = null
    },

    connectOutputToInput(outId: string, inId: string) {
      const outT = this.terminals[outId]
      const inT = this.terminals[inId]
      if (!outT || !inT || outT.kind !== 'output' || inT.kind !== 'input') return
      if (inT.nodeId === outT.nodeId) return
      for (const w of inT.wires) {
        this.removeWire(w)
      }
      const wid = genId('wire')
      this.wires[wid] = {
        id: wid,
        outputTerminalId: outId,
        inputTerminalId: inId,
      }
      inT.wires = [wid]
      outT.wires.push(wid)
      this.setTerminalValue(inId, outT.value)
    },

    removeWire(wireId: string) {
      const w = this.wires[wireId]
      if (!w) return
      const o = this.terminals[w.outputTerminalId]
      const i = this.terminals[w.inputTerminalId]
      if (o) {
        o.wires = o.wires.filter((x) => x !== wireId)
      }
      if (i) {
        i.wires = i.wires.filter((x) => x !== wireId)
      }
      delete this.wires[wireId]
    },

    terminalScenePoint(termId: string): { x: number; y: number } {
      const t = this.terminals[termId]
      if (t == null) return { x: 0, y: 0 }
      const n = this.nodes[t.nodeId]!
      return terminalWirePoint(n, t)
    },
  },
})
