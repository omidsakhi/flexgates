<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCircuitStore } from '@/stores/circuit'
import { useNodeDrag } from '@/composables/useNodeDrag'
const props = defineProps<{ nodeId: string }>()

const store = useCircuitStore()
const { onPointerDown: onNodePointerDown } = useNodeDrag(props.nodeId)
const node = computed(() => store.nodes[props.nodeId]!)
const outId = computed(() => node.value.outputs[0]!)

const tripped = ref(false)
const normalImg = '/images/sidebar/motiondetector-normal.png'
const tripImg = '/images/sidebar/motiondetector-triggered.png'
const currentImg = computed(() => (tripped.value ? tripImg : normalImg))

function onEnter() {
  tripped.value = true
  store.setTerminalValue(outId.value, true)
}
function onLeave() {
  tripped.value = false
  store.setTerminalValue(outId.value, false)
}
</script>

<template>
  <div
    class="node node-motion"
    :class="{ 'node-selected': node.selected }"
    :style="{
      left: node.pos.x + 'px',
      top: node.pos.y + 'px',
      width: node.size.w + 'px',
      height: node.size.h + 'px',
    }"
    @pointerdown="onNodePointerDown"
  >
    <!-- createMotionDetector: NODE() with no title — setBackgroundImage(20,0,130,130) -->
    <div
      class="motion-skin"
      :style="{
        backgroundImage: 'url(' + currentImg + ')',
        backgroundSize: '130px 130px',
        backgroundPosition: '20px 0',
        backgroundRepeat: 'no-repeat',
      }"
    />
    <div class="motion-drag-gutter" aria-hidden="true" />
    <div
      class="motion-hit"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
    />
  </div>
</template>

<style scoped>
.node-motion {
  padding-top: 0;
}
.motion-skin {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  border-radius: 12px;
  overflow: hidden;
}
.motion-drag-gutter {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 10px;
  z-index: 2;
  cursor: move;
}
.motion-hit {
  position: absolute;
  left: 0;
  right: 0;
  top: 10px;
  bottom: 0;
  z-index: 1;
  cursor: crosshair;
}
</style>
