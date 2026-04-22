<script setup lang="ts">
import { ref } from 'vue'
import { SIDEBAR_SECTIONS, getNodeDefinition } from '@/lib/gates'
import type { NodeKind } from '@/lib/types'

const sectionOpen = ref(
  SIDEBAR_SECTIONS.map((sec) => sec.title === 'Logic Gates'),
)

function toggleSection(i: number) {
  sectionOpen.value[i] = !sectionOpen.value[i]
}

function onDragStart(e: DragEvent, kind: NodeKind) {
  e.dataTransfer?.setData('application/flexgates-kind', kind)
  e.dataTransfer!.effectAllowed = 'copy'
}
</script>

<template>
  <aside id="sidebar">
    <div id="sidebar-header">FlexGates</div>
    <div class="sidebar-body">
      <div
        v-for="(sec, i) in SIDEBAR_SECTIONS"
        :key="i"
        class="sidebar-accordion-section"
      >
        <button
          type="button"
          class="sidebar-accordion-header"
          :aria-expanded="sectionOpen[i]"
          :aria-controls="`sidebar-panel-${i}`"
          :id="`sidebar-heading-${i}`"
          @click="toggleSection(i)"
        >
          <span>{{ sec.title }}</span>
          <svg
            class="sidebar-accordion-chevron"
            :class="{ 'is-open': sectionOpen[i] }"
            width="14"
            height="14"
            viewBox="0 0 12 12"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="currentColor"
              d="M2.2 3.5L6 7.3l3.8-3.8 1.1 1-4.4 4.4a.8.8 0 01-1.1 0L1.1 4.5l1.1-1z"
            />
          </svg>
        </button>
        <div
          :id="`sidebar-panel-${i}`"
          class="sidebar-accordion-panel"
          :class="{ 'is-open': sectionOpen[i] }"
          role="region"
          :aria-labelledby="`sidebar-heading-${i}`"
          :aria-hidden="!sectionOpen[i]"
        >
          <div class="sidebar-accordion-panel-inner">
            <div class="sidebar-accordion-items">
              <div
                v-for="kind in sec.kinds"
                :key="kind"
                class="sidebar-item"
              >
                <img
                  draggable="true"
                  class="sidebar-item"
                  :src="getNodeDefinition(kind).image ?? '/images/sidebar/clock-icon.png'"
                  :alt="getNodeDefinition(kind).title"
                  :title="getNodeDefinition(kind).title"
                  @dragstart="(e) => onDragStart(e, kind)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
