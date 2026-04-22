<script setup lang="ts">
import { computed } from 'vue'
import { useCircuitStore } from '@/stores/circuit'
import { getNodeDefinition } from '@/lib/gates'
import ImageGateNode from './ImageGateNode.vue'
import ClockNode from './ClockNode.vue'
import ProbeNode from './ProbeNode.vue'
import PushbuttonNode from './PushbuttonNode.vue'
import ToggleSwitchNode from './ToggleSwitchNode.vue'
import MotionDetectorNode from './MotionDetectorNode.vue'
import SawtoothNode from './SawtoothNode.vue'
import type { NodeComponentName } from '@/lib/types'

const store = useCircuitStore()
const list = computed(() => Object.values(store.nodes))

const components: Record<NodeComponentName, object> = {
  ImageGateNode,
  ClockNode,
  ProbeNode,
  PushbuttonNode,
  ToggleSwitchNode,
  MotionDetectorNode,
  SawtoothNode,
}
</script>

<template>
  <template v-for="n in list" :key="n.id">
    <component :is="components[getNodeDefinition(n.kind).component]" :node-id="n.id" />
  </template>
</template>
