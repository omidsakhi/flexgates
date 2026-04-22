<script setup lang="ts">
import { computed } from 'vue'
import { useCircuitStore } from '@/stores/circuit'
import { useNodeDrag } from '@/composables/useNodeDrag'

const props = defineProps<{ nodeId: string }>()

const store = useCircuitStore()
const { onPointerDown: onNodePointerDown } = useNodeDrag(props.nodeId)
const node = computed(() => store.nodes[props.nodeId]!)

const inId = computed(() => node.value.inputs[0]!)

const display = computed(() => String(store.terminals[inId.value]?.value ?? ''))
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
    <!-- Original createProbe: NODE("Probe") + textBox only — no setBackgroundImage (sidebar uses probe icon) -->
    <div class="node-title">{{ node.title }}</div>
    <div class="TextBox" style="left: 41px; top: 70px">
      <label class="TextBoxLabel">Value</label>
      <input class="TextBoxInput" type="text" :value="display" readonly aria-readonly="true" @pointerdown.stop />
    </div>
  </div>
</template>
