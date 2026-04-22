<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useCircuitStore } from '@/stores/circuit'
import { useNodeDrag } from '@/composables/useNodeDrag'

const props = defineProps<{ nodeId: string }>()

const store = useCircuitStore()
const { onPointerDown: baseNodePointerDown } = useNodeDrag(props.nodeId)
const node = computed(() => store.nodes[props.nodeId]!)

const outId = computed(() => node.value.outputs[0]!)

const intervalInput = ref(String(node.value.state.interval ?? 1000))
const dutyInput = ref(String(node.value.state.dutyCycle ?? 50))

let timeoutId: ReturnType<typeof setTimeout> | null = null

function clearTimer() {
  if (timeoutId != null) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

/** Matches old trigon chain: start low, after offTime go high, after onTime go low, repeat. */
function schedule() {
  clearTimer()
  const inv = Math.max(0, Number(node.value.state.interval) || 0)
  const duty = Math.min(100, Math.max(0, Number(node.value.state.dutyCycle) || 0))
  if (inv === 0) return
  const onTime = (inv * duty) / 100
  const offTime = inv - onTime
  store.setNodeState(props.nodeId, { onTime, offTime })
  const runOff = () => {
    timeoutId = setTimeout(() => {
      if (duty > 0) {
        store.setTerminalValue(outId.value, true)
      }
      runOn()
    }, offTime)
  }
  const runOn = () => {
    timeoutId = setTimeout(() => {
      if (duty < 100) {
        store.setTerminalValue(outId.value, false)
      }
      runOff()
    }, onTime)
  }
  runOff()
}

watch(
  () => [node.value.state.interval, node.value.state.dutyCycle],
  () => {
    schedule()
  },
  { immediate: true },
)

watch(intervalInput, (v) => {
  const n = parseInt(v, 10)
  if (!Number.isNaN(n)) {
    const interval = n < 0 ? 0 : n
    const duty = Math.min(100, Math.max(0, Number(node.value.state.dutyCycle) || 0))
    const onTime = (interval * duty) / 100
    const offTime = interval - onTime
    store.setNodeState(props.nodeId, { interval, onTime, offTime })
  }
})

watch(dutyInput, (v) => {
  const n = parseInt(v, 10)
  if (!Number.isNaN(n)) {
    const duty = n < 0 ? 0 : n > 100 ? 100 : n
    const interval = Math.max(0, Number(node.value.state.interval) || 0)
    const onTime = (interval * duty) / 100
    const offTime = interval - onTime
    store.setNodeState(props.nodeId, { dutyCycle: duty, onTime, offTime })
  }
})

onUnmounted(() => clearTimer())

function onNodePointerDown(e: PointerEvent) {
  const target = e.target as HTMLElement
  if (target.closest('input, .clock-fields, .TextBoxInput')) return
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
      background: 'linear-gradient(145deg, #4a4a4a, #2a2a2a)',
    }"
    @pointerdown="onNodePointerDown"
  >
    <div class="node-title">{{ node.title }}</div>
    <div class="clock-fields" @pointerdown.stop>
      <div class="clock-field">
        <label class="TextBoxLabel">Interval</label>
        <input
          v-model="intervalInput"
          class="TextBoxInput"
          type="number"
        />
      </div>
      <div class="clock-field">
        <label class="TextBoxLabel">Duty cycle</label>
        <input
          v-model="dutyInput"
          class="TextBoxInput"
          type="number"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.clock-fields {
  position: absolute;
  left: 10px;
  right: 10px;
  /* Matches original textBox(31,75) and (10,120): first row 75px from node top, ~45px to second */
  top: 75px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.clock-field {
  display: flex;
  align-items: center;
  gap: 8px;
}
.clock-field .TextBoxLabel {
  flex: 0 0 88px;
  text-align: right;
}
.clock-field .TextBoxInput {
  margin-left: 0;
  flex: 0 0 auto;
  width: 70px;
  max-width: 70px;
}
</style>
