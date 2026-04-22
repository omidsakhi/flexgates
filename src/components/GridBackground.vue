<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  width: number
  height: number
}>()

/** Same 40px / #ddd idea as the original `drawGrid()` (canvas) — but only the viewport, not world-sized. */
const gridSize = 40

const lines = computed(() => {
  const w = Math.max(props.width, 0)
  const h = Math.max(props.height, 0)
  const vertical: { x1: number; y1: number; x2: number; y2: number }[] = []
  const horizontal: { x1: number; y1: number; x2: number; y2: number }[] = []
  for (let x = 0.5; x < w; x += gridSize) {
    vertical.push({ x1: x, y1: 0, x2: x, y2: h })
  }
  for (let y = 0.5; y < h; y += gridSize) {
    horizontal.push({ x1: 0, y1: y, x2: w, y2: y })
  }
  return { vertical, horizontal }
})
</script>

<template>
  <svg
    id="grid"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
  >
    <g stroke="#ddd" stroke-width="1">
      <line
        v-for="(l, i) in lines.vertical"
        :key="'v' + i"
        :x1="l.x1"
        :y1="l.y1"
        :x2="l.x2"
        :y2="l.y2"
      />
      <line
        v-for="(l, i) in lines.horizontal"
        :key="'h' + i"
        :x1="l.x1"
        :y1="l.y1"
        :x2="l.x2"
        :y2="l.y2"
      />
    </g>
  </svg>
</template>
