<script setup lang="ts">
import { computed } from 'vue'
import { useCircuitStore } from '@/stores/circuit'
import { wirePathD } from '@/lib/wirePath'

const store = useCircuitStore()

const wireList = computed(() => Object.values(store.wires))

function pathForWire(w: { outputTerminalId: string; inputTerminalId: string }) {
  const p1 = store.terminalScenePoint(w.outputTerminalId)
  const p2 = store.terminalScenePoint(w.inputTerminalId)
  return wirePathD(p1, p2)
}

const inProgress = computed(() => {
  if (!store.wireInCreation) return null
  const p1 = store.terminalScenePoint(store.wireInCreation.fromOutputTerminalId)
  const p2 = store.wireInCreation.mouse
  return wirePathD(p1, p2)
})
</script>

<template>
  <svg
    class="wire-layer"
    xmlns="http://www.w3.org/2000/svg"
    style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; z-index: 3"
  >
    <path
      v-for="w in wireList"
      :key="w.id"
      :d="pathForWire(w)"
      fill="none"
      stroke="rgb(200,139,63)"
      stroke-width="2"
    />
    <path v-if="inProgress" :d="inProgress" fill="none" stroke="rgb(200,139,63)" stroke-width="2" />
  </svg>
</template>
