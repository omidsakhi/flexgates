<script setup lang="ts">
import { computed } from 'vue'
import { useCircuitStore } from '@/stores/circuit'
import type { Direction, TermKind, TermValue } from '@/lib/types'

const props = defineProps<{
  terminalId: string
  kind: TermKind
  direction: Direction
  offsetStyle: { left: string; top: string }
}>()

const store = useCircuitStore()

const t = computed(() => store.terminals[props.terminalId]!)
const value = computed(() => t.value.value)

const dirClass = computed(() => {
  switch (props.direction) {
    case 'left':
      return 'terminal-left'
    case 'right':
      return 'terminal-right'
    case 'top':
      return 'terminal-top'
    case 'bottom':
      return 'terminal-bottom'
  }
  return 'terminal-left'
})

const valueStyle = computed(() => {
  const v: TermValue = value.value
  if (v === true) {
    return { background: 'radial-gradient(circle,rgb(250,110,67),rgb(237,22,8))' }
  }
  if (v === false) {
    return { background: 'radial-gradient(circle,rgb(199,250,68),rgb(113,237,8))' }
  }
  return { background: 'radial-gradient(circle,rgb(250,214,67),rgb(237,143,8))' }
})

function onDown(e: MouseEvent) {
  e.stopPropagation()
  e.preventDefault()
  if (props.kind === 'output') {
    store.startWireFromOutput(props.terminalId)
  } else {
    if (t.value.wires.length > 0) {
      store.startWireRerouteFromInput(props.terminalId)
    } else if (!store.wireInCreation) {
      store.toggleInputTerminal(props.terminalId)
    }
  }
}

function onUp(e: MouseEvent) {
  e.stopPropagation()
  e.preventDefault()
  if (props.kind === 'input' && store.wireInCreation) {
    if (t.value.wires.length === 0) {
      store.completeWireToInput(props.terminalId)
    } else {
      store.cancelWire()
    }
  }
  if (props.kind === 'output' && store.wireInCreation) {
    store.cancelWire()
  }
}
</script>

<template>
  <div
    :class="[dirClass, 'scene-terminal']"
    :style="[offsetStyle, valueStyle]"
    @pointerdown="onDown"
    @pointerup="onUp"
  />
</template>
