<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useCircuitStore } from '@/stores/circuit'
import { useNodeDrag } from '@/composables/useNodeDrag'
import { getNodeDefinition } from '@/lib/gates'

const props = defineProps<{ nodeId: string }>()

const store = useCircuitStore()
const { onPointerDown: onNodePointerDown } = useNodeDrag(props.nodeId)
const node = computed(() => store.nodes[props.nodeId]!)
const outId = computed(() => node.value.outputs[0]!)
const def = computed(() => getNodeDefinition('pushbutton'))

const pushed = ref(false)
const normalImg = '/images/sidebar/pushbutton-1-normal.png'
const pushedImg = '/images/sidebar/pushbutton-1-pushed.png'
const currentImg = computed(() => (pushed.value ? pushedImg : def.value.image ?? normalImg))

function setDown() {
  store.selectOnly(props.nodeId)
  pushed.value = true
  store.setTerminalValue(outId.value, true)
  window.addEventListener('pointerup', onWinUp, { capture: true })
}

function onWinUp() {
  pushed.value = false
  store.setTerminalValue(outId.value, false)
  window.removeEventListener('pointerup', onWinUp, { capture: true })
}

onUnmounted(() => {
  window.removeEventListener('pointerup', onWinUp, { capture: true })
})
</script>

<template>
  <div
    class="node node-pushbutton"
    :class="{ 'node-selected': node.selected }"
    :style="{
      left: node.pos.x + 'px',
      top: node.pos.y + 'px',
      width: node.size.w + 'px',
      height: node.size.h + 'px',
    }"
    @pointerdown="onNodePointerDown"
  >
    <!-- Original createPushbutton: NODE() with no title — art fills the face at (0,5), 152×120 -->
    <div
      class="pushbutton-skin"
      :style="{
        backgroundImage: 'url(' + currentImg + ')',
        backgroundSize: '152px 120px',
        backgroundPosition: '0 5px',
        backgroundRepeat: 'no-repeat',
      }"
    />
    <!-- Perimeter: drag/select (events bubble to .node). Center: push. -->
    <div class="device-drag-frame" aria-hidden="true">
      <div class="device-drag-frame__side device-drag-frame__side--top" />
      <div class="device-drag-frame__side device-drag-frame__side--right" />
      <div class="device-drag-frame__side device-drag-frame__side--bottom" />
      <div class="device-drag-frame__side device-drag-frame__side--left" />
    </div>
    <div
      class="pushbutton-hit"
      @pointerdown.prevent.stop="setDown"
    />
  </div>
</template>

<style scoped>
.node-pushbutton {
  /* No .node-title: image uses full height like the original (200×125). */
  padding-top: 0;
}
.pushbutton-skin {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  border-radius: 12px;
  overflow: hidden;
}
</style>
