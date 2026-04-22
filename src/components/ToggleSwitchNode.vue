<script setup lang="ts">
import { computed } from 'vue'
import { useCircuitStore } from '@/stores/circuit'
import { useNodeDrag } from '@/composables/useNodeDrag'
const props = defineProps<{ nodeId: string }>()

const store = useCircuitStore()
const { onPointerDown: onNodePointerDown } = useNodeDrag(props.nodeId)
const node = computed(() => store.nodes[props.nodeId]!)
const outId = computed(() => node.value.outputs[0]!)

const on = computed(() => node.value.state.on === true)
const offImg = '/images/sidebar/switch-1-off.png'
const onImg = '/images/sidebar/switch-1-on.png'
const currentImg = computed(() => (on.value ? onImg : offImg))

function toggle() {
  store.selectOnly(props.nodeId)
  const v = !on.value
  store.setNodeState(props.nodeId, { on: v })
  store.setTerminalValue(outId.value, v)
}
</script>

<template>
  <div
    class="node node-toggle"
    :class="{ 'node-selected': node.selected }"
    :style="{
      left: node.pos.x + 'px',
      top: node.pos.y + 'px',
      width: node.size.w + 'px',
      height: node.size.h + 'px',
    }"
    @pointerdown="onNodePointerDown"
  >
    <!-- createToggleSwitch: NODE() with no title — setBackgroundImage(20,0,130,130) -->
    <div
      class="toggle-skin"
      :style="{
        backgroundImage: 'url(' + currentImg + ')',
        backgroundSize: '130px 130px',
        backgroundPosition: '20px 0',
        backgroundRepeat: 'no-repeat',
      }"
    />
    <div class="device-drag-frame" aria-hidden="true">
      <div class="device-drag-frame__side device-drag-frame__side--top" />
      <div class="device-drag-frame__side device-drag-frame__side--right" />
      <div class="device-drag-frame__side device-drag-frame__side--bottom" />
      <div class="device-drag-frame__side device-drag-frame__side--left" />
    </div>
    <div class="toggle-hit" @pointerdown.stop.prevent="toggle" />
  </div>
</template>

<style scoped>
.node-toggle {
  padding-top: 0;
}
.toggle-skin {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  border-radius: 12px;
  overflow: hidden;
}
</style>
