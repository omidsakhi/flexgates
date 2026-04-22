import { computed, onUnmounted, ref } from 'vue'
import { useCircuitStore } from '@/stores/circuit'

const DRAG_THRESHOLD_PX = 4

function isTerminalTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el?.classList) return false
  return (
    el.classList.contains('terminal-left') ||
    el.classList.contains('terminal-right') ||
    el.classList.contains('terminal-top') ||
    el.classList.contains('terminal-bottom')
  )
}

/**
 * Pointer interaction for circuit nodes: multi-select drag, shift-toggle, unselected → select-only,
 * and when several are selected, a short click (no drag) on one of them → select only that node.
 */
export function useNodeDrag(nodeId: string) {
  const store = useCircuitStore()
  const active = ref(false)
  /** True between pointerdown and pointerup: user may intend “solo” vs group drag */
  const pendingMultiSolo = ref(false)
  let startClientX = 0
  let startClientY = 0
  let lastX = 0
  let lastY = 0

  const selectedCount = computed(
    () => Object.values(store.nodes).filter((n) => n.selected).length,
  )

  function cleanup() {
    active.value = false
    pendingMultiSolo.value = false
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  }

  function onMove(e: PointerEvent) {
    if (!active.value) return
    if (pendingMultiSolo.value) {
      const dist = Math.hypot(e.clientX - startClientX, e.clientY - startClientY)
      if (dist > DRAG_THRESHOLD_PX) {
        pendingMultiSolo.value = false
      } else {
        return
      }
    }
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    lastX = e.clientX
    lastY = e.clientY
    store.moveSelectedNodes(dx, dy)
  }

  function onUp() {
    if (active.value && pendingMultiSolo.value) {
      store.selectOnly(nodeId)
    }
    cleanup()
  }

  function armPointer(e: PointerEvent) {
    active.value = true
    lastX = e.clientX
    lastY = e.clientY
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  function onPointerDown(e: PointerEvent) {
    e.stopPropagation()
    if (e.button !== 0) return
    if (isTerminalTarget(e.target)) return

    if (e.shiftKey) {
      const n = store.nodes[nodeId]
      if (n) store.setSelected(nodeId, !n.selected)
      if (!store.nodes[nodeId]?.selected) return
      pendingMultiSolo.value = false
      armPointer(e)
      return
    }

    if (!store.nodes[nodeId]?.selected) {
      store.selectForDrag(nodeId, false)
      pendingMultiSolo.value = false
      armPointer(e)
      return
    }

    if (selectedCount.value === 1) {
      pendingMultiSolo.value = false
      armPointer(e)
      return
    }

    pendingMultiSolo.value = true
    startClientX = e.clientX
    startClientY = e.clientY
    armPointer(e)
  }

  onUnmounted(() => {
    cleanup()
  })

  return { onPointerDown, active, pendingMultiSolo }
}
