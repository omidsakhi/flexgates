<script setup lang="ts">
import { computed } from 'vue'
import { useCircuitStore } from '@/stores/circuit'
import { useNodeDrag } from '@/composables/useNodeDrag'
import { getNodeDefinition } from '@/lib/gates'
const props = defineProps<{ nodeId: string }>()

const store = useCircuitStore()
const { onPointerDown: onNodePointerDown } = useNodeDrag(props.nodeId)
const node = computed(() => store.nodes[props.nodeId]!)

const def = computed(() => getNodeDefinition(node.value.kind))
const isSelected = computed(() => node.value.selected)

/** Title bar height must match .node-title in main.css */
const TITLE_H = 45

const bodyBg = computed((): Record<string, string> => {
  const d = def.value
  if (d.image && d.bgOffset) {
    return {
      backgroundImage: `url(${d.image})`,
      backgroundSize: `${d.bgOffset.w}px ${d.bgOffset.h}px`,
      backgroundPosition: `${d.bgOffset.x}px ${d.bgOffset.y - TITLE_H}px`,
    }
  }
  if (d.image) {
    return {
      backgroundImage: `url(${d.image})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    }
  }
  return {}
})

const styleNode = computed(() => ({
  left: `${node.value.pos.x}px`,
  top: `${node.value.pos.y}px`,
  width: `${node.value.size.w}px`,
  height: `${node.value.size.h}px`,
}))

</script>

<template>
  <div
    class="node"
    :class="{ 'node-selected': isSelected }"
    :style="styleNode"
    @pointerdown="onNodePointerDown"
  >
    <div class="node-title">{{ def.title }}</div>
    <div v-if="Object.keys(bodyBg).length" class="node-body-bg" :style="bodyBg" />
  </div>
</template>
