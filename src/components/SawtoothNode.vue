<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCircuitStore } from '@/stores/circuit'
import { useNodeDrag } from '@/composables/useNodeDrag'
const props = defineProps<{ nodeId: string }>()

const store = useCircuitStore()
const { onPointerDown: baseNodePointerDown } = useNodeDrag(props.nodeId)
const node = computed(() => store.nodes[props.nodeId]!)

const inId = computed(() => node.value.inputs[0]!)
const outId = computed(() => node.value.outputs[0]!)
const precision = ref(String(node.value.state.precision ?? 0.01))

function onPrecisionInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  precision.value = v
  const f = parseFloat(v)
  if (!Number.isNaN(f)) {
    const p = f < 0 ? 0 : f > 1 ? 1 : f
    store.setNodeState(props.nodeId, { precision: p })
  }
}

function onNodePointerDown(e: PointerEvent) {
  if ((e.target as HTMLElement).closest('input, .TextBox')) return
  baseNodePointerDown(e)
}
</script>

<template>
  <div
    class="node"
    :class="{ 'node-selected': node.selected }"
    :style="{
      left: node.pos.x + 'px',
      top: node.pos.y + 'px',
      width: node.size.w + 'px',
      height: node.size.h + 'px',
    }"
    @pointerdown="onNodePointerDown"
  >
    <div class="node-title">{{ node.title }}</div>
    <div class="TextBox" style="left: 41px; top: 70px" @pointerdown.stop>
      <label class="TextBoxLabel">Precision</label>
      <input
        :value="precision"
        class="TextBoxInput"
        type="number"
        step="0.01"
        @input="onPrecisionInput"
      />
    </div>
  </div>
</template>
