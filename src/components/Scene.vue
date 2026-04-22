<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, computed } from 'vue'
import { useCircuitStore } from '@/stores/circuit'
import type { NodeKind } from '@/lib/types'
import GridBackground from './GridBackground.vue'
import NodeLayer from './NodeLayer.vue'
import WireLayer from './WireLayer.vue'
import TerminalLayer from './TerminalLayer.vue'

const store = useCircuitStore()

const sceneEl = ref<HTMLElement | null>(null)
const gridW = ref(800)
const gridH = ref(600)
let resizeObserver: ResizeObserver | null = null

function resize() {
  const el = sceneEl.value
  if (!el) return
  const r = el.getBoundingClientRect()
  gridW.value = r.width
  gridH.value = r.height
}

const panStyle = computed(() => ({
  transform: `translate3d(${store.scenePan.x}px, ${store.scenePan.y}px, 0)`,
}))

const CLICK_MOVE_THRESHOLD = 4

const onWinMove = (e: PointerEvent) => {
  if (!store.wireInCreation || !sceneEl.value) return
  const r = sceneEl.value.getBoundingClientRect()
  const p = store.scenePan
  store.updateWireMouse(e.clientX - r.left - p.x, e.clientY - r.top - p.y)
}

const onDocUp = () => {
  void nextTick(() => {
    if (store.wireInCreation) store.cancelWire()
  })
}

const onScenePointerDownCapture = () => {
  sceneEl.value?.focus()
}

let backdropPanLastX = 0
let backdropPanLastY = 0
let backdropPanMoved = 0
const backdropPointerId = ref<number | null>(null)
let backdropCaptureEl: HTMLElement | null = null

function onBackdropPointerMove(e: PointerEvent) {
  if (backdropPointerId.value !== e.pointerId) return
  const dx = e.clientX - backdropPanLastX
  const dy = e.clientY - backdropPanLastY
  backdropPanLastX = e.clientX
  backdropPanLastY = e.clientY
  backdropPanMoved += Math.hypot(dx, dy)
  store.applyScenePanDelta(dx, dy)
}

function cleanupBackdropPan(e?: PointerEvent) {
  if (backdropPointerId.value == null) return
  if (e && e.pointerId !== backdropPointerId.value) return
  const id = backdropPointerId.value
  try {
    if (id != null && backdropCaptureEl) backdropCaptureEl.releasePointerCapture(id)
  } catch {
    /* not captured */
  }
  window.removeEventListener('pointermove', onBackdropPointerMove)
  window.removeEventListener('pointerup', onBackdropWindowPointerEnd)
  window.removeEventListener('pointercancel', onBackdropWindowPointerEnd)
  sceneEl.value?.classList.remove('scene--panning')
  if (e != null && backdropPanMoved < CLICK_MOVE_THRESHOLD) {
    store.selectAll(false)
  }
  backdropPointerId.value = null
  backdropCaptureEl = null
}

function onBackdropWindowPointerEnd(e: PointerEvent) {
  cleanupBackdropPan(e)
}

function onBackdropPointerDown(e: PointerEvent) {
  if (e.button !== 0) return
  if (store.wireInCreation) return
  e.preventDefault()
  backdropPanLastX = e.clientX
  backdropPanLastY = e.clientY
  backdropPanMoved = 0
  backdropPointerId.value = e.pointerId
  backdropCaptureEl = e.currentTarget as HTMLElement
  sceneEl.value?.classList.add('scene--panning')
  backdropCaptureEl.setPointerCapture(e.pointerId)
  window.addEventListener('pointermove', onBackdropPointerMove)
  window.addEventListener('pointerup', onBackdropWindowPointerEnd)
  window.addEventListener('pointercancel', onBackdropWindowPointerEnd)
}

onMounted(() => {
  void nextTick(() => {
    resize()
    const el = sceneEl.value
    if (el) {
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(el)
    }
  })
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onWinMove)
  document.addEventListener('pointerup', onDocUp)
})

onUnmounted(() => {
  cleanupBackdropPan()
  resizeObserver?.disconnect()
  resizeObserver = null
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onWinMove)
  document.removeEventListener('pointerup', onDocUp)
})

function onDragOver(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  const k = e.dataTransfer?.getData('application/flexgates-kind') as NodeKind | undefined
  if (!k || !sceneEl.value) return
  const r = sceneEl.value.getBoundingClientRect()
  const p = store.scenePan
  const x = e.clientX - r.left - p.x
  const y = e.clientY - r.top - p.y
  store.addNode(k, x, y)
}

function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement
  if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT') return
  if (e.key === 'a' || e.key === 'A') {
    e.preventDefault()
    store.toggleSelectAll()
  }
  if (e.key === 'x' || e.key === 'X' || e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault()
    store.deleteSelected()
  }
}
</script>

<template>
  <div
    id="scene"
    ref="sceneEl"
    tabindex="0"
    @pointerdown.capture="onScenePointerDownCapture"
    @dragover="onDragOver"
    @drop="onDrop"
    @keydown="onKey"
  >
    <div
      class="scene-backdrop"
      aria-hidden="true"
      @pointerdown="onBackdropPointerDown"
    />
    <!-- Viewport grid stays fixed in #scene, like the original canvas — only parts / wires / terminals pan. -->
    <GridBackground :width="gridW" :height="gridH" />
    <div class="scene-pan" :style="panStyle">
      <NodeLayer />
      <WireLayer />
      <TerminalLayer />
    </div>
  </div>
</template>
