<template>
  <div
    v-if="label"
    ref="trigger"
    class="hasTooltip"
    @mouseenter="startShow"
    @mouseleave="hide"
  >
    <slot></slot>

    <!-- On téléporte le tooltip hors du flux -->
    <teleport to="body">
      <div
        v-if="show"
        ref="tooltip"
        class="tooltip"
        :class="[`tooltip--${position}`, { 'is-visible': show }]"
        :style="tooltipStyle"
      >
        <BasicText size="body-m">
          {{ truncatedLabel }}
        </BasicText>
      </div>
    </teleport>
  </div>

  <!-- fallback si pas de label -->
  <template v-else>
    <slot></slot>
  </template>
</template>

<script setup lang="ts">
  import { ref, computed, watchEffect, nextTick, type CSSProperties } from 'vue'
  import type { TooltipProps } from './BasicTooltip.types'

  const props = withDefaults(defineProps<TooltipProps>(), {
    label: '',
    position: 'top',
    visible: true,
    maxLength: undefined,
    maxWidth: 200,
  })

  const trigger = ref<HTMLElement | null>(null)
  const tooltip = ref<HTMLElement | null>(null)
  const show = ref(false)
  const coords = ref({ top: 0, left: 0 })
  let timer: ReturnType<typeof setTimeout> | null = null

  // Texte tronqué
  const truncatedLabel = computed(() => {
    if (!props.maxLength || props.label.length <= props.maxLength) {
      return props.label
    }
    const words = props.label.split(' ')
    let truncated = ''
    for (const word of words) {
      if (truncated.length + word.length + 1 > props.maxLength) break
      truncated += (truncated ? ' ' : '') + word
    }
    return truncated + '…'
  })

  // Gestion affichage avec délai
  const startShow = () => {
    timer = setTimeout(() => {
      show.value = true
    }, 600) // délai (ms)
  }

  const hide = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    show.value = false
  }

  // Calcule la position
  watchEffect(async () => {
    if (show.value && trigger.value && tooltip.value) {
      await nextTick()
      const rect = trigger.value.getBoundingClientRect()
      const tRect = tooltip.value.getBoundingClientRect()

      switch (props.position) {
        case 'top':
          coords.value = {
            top: rect.top + window.scrollY - tRect.height - 6,
            left: rect.left + window.scrollX + rect.width / 2 - tRect.width / 2,
          }
          break
        case 'bottom':
          coords.value = {
            top: rect.bottom + window.scrollY + 6,
            left: rect.left + window.scrollX + rect.width / 2 - tRect.width / 2,
          }
          break
        case 'left':
          coords.value = {
            top: rect.top + window.scrollY + rect.height / 2 - tRect.height / 2,
            left: rect.left + window.scrollX - tRect.width - 6,
          }
          break
        case 'right':
          coords.value = {
            top: rect.top + window.scrollY + rect.height / 2 - tRect.height / 2,
            left: rect.right + window.scrollX + 6,
          }
          break
      }
    }
  })

  const tooltipStyle = computed<CSSProperties>(() => ({
    top: coords.value.top + 'px',
    left: coords.value.left + 'px',
    maxWidth: props.maxWidth ? props.maxWidth + 'px' : 'max-content',
    position: 'absolute',
    width: 'max-content',
  }))
</script>

<style lang="less">
  @import './BasicTooltip.less';
</style>
