<script setup lang="ts">
import { computed } from 'vue'
import { useCircuitStore } from '@/stores/circuit'
import Terminal from './Terminal.vue'

const store = useCircuitStore()

/** All terminals, inputs before outputs for each node (order matches prior in-node order). */
const rows = computed(() => {
  const out: { id: string; key: string }[] = []
  for (const n of Object.values(store.nodes)) {
    for (const tid of n.inputs) {
      out.push({ id: tid, key: `${n.id}-i-${tid}` })
    }
    for (const tid of n.outputs) {
      out.push({ id: tid, key: `${n.id}-o-${tid}` })
    }
  }
  return out
})

function sceneStyle(tid: string) {
  const t = store.terminals[tid]!
  const n = store.nodes[t.nodeId]!
  return { left: `${n.pos.x + t.offset.x}px`, top: `${n.pos.y + t.offset.y}px` }
}
</script>

<template>
  <div class="scene-terminals" aria-hidden="true">
    <Terminal
      v-for="r in rows"
      :key="r.key"
      :terminal-id="r.id"
      :kind="store.terminals[r.id]!.kind"
      :direction="store.terminals[r.id]!.direction"
      :offset-style="sceneStyle(r.id)"
    />
  </div>
</template>
