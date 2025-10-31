<template>
  <template v-if="label">
    <span
      ref="trigger"
      class="hasTooltip"
      @mouseenter="startShow"
      @mouseleave="hide"
    >
      <slot />
    </span>

    <teleport :to="teleportTarget">
      <div
        v-if="show"
        ref="tooltip"
        class="tooltip"
        :class="[`tooltip--${effectivePosition}`, { 'is-visible': show }]"
        :style="tooltipStyle"
      >
        <BasicText size="body-m">{{ truncatedLabel }}</BasicText>
      </div>
    </teleport>
  </template>
  <template v-else>
    <slot />
  </template>
</template>

<script setup lang="ts">
  import { useWebComponentNode } from '@/features/interface/composables/useWebComponentNode'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { computed, nextTick, ref, watch, watchEffect, type CSSProperties } from 'vue'
  import type { TooltipPosition, TooltipProps } from './BasicTooltip.types'

  /* 🧩 Props */
  const props = withDefaults(defineProps<TooltipProps>(), {
    label: '',
    position: 'top',
    visible: true,
    maxLength: undefined,
    maxWidth: 200,
  })

  /* 🧩 Refs & état */
  const trigger = ref<HTMLElement | null>(null)
  const tooltip = ref<HTMLElement | null>(null)
  const show = ref(false)
  const coords = ref({ top: 0, left: 0 })
  const effectivePosition = ref<TooltipPosition>(props.position)
  const offsetCorrection = ref({ x: 0, y: 0 })
  let timer: ReturnType<typeof setTimeout> | null = null

  /* 🔄 Gestion visibilité externe */
  watch(
    () => props.visible,
    (val) => {
      if (!val) hide() // 🔒 ferme le tooltip si on passe visible = false
    },
  )

  /* ✂️ Tronquage du texte */
  const truncatedLabel = computed(() => {
    if (!props.maxLength || props.label.length <= props.maxLength) return props.label
    const words = props.label.split(' ')
    let truncated = ''
    for (const word of words) {
      if (truncated.length + word.length + 1 > props.maxLength) break
      truncated += (truncated ? ' ' : '') + word
    }
    return truncated + '…'
  })

  /* 🧠 Gestion affichage */
  const startShow = (e: MouseEvent) => {
    if (!props.visible) return // ✅ bloque l'affichage si visible = false
    trigger.value = e.currentTarget as HTMLElement
    timer = setTimeout(() => (show.value = true), 600)
  }

  const hide = () => {
    if (timer) clearTimeout(timer)
    show.value = false
    setTimeout(() => {
      offsetCorrection.value = { x: 0, y: 0 }
      effectivePosition.value = props.position
    }, 200)
  }

  /* 🔥 expose hideTooltip() au parent */
  defineExpose({ hideTooltip: hide })

  /* 🌐 Gestion téléportation (shadow-root compatible) */
  const { shadowRoot } = useWebComponentNode()
  const teleportTarget = computed(() => shadowRoot ?? 'body')

  /* 🧮 Positionnement intelligent */
  const getRootContainer = (el: HTMLElement): Document | ShadowRoot => {
    const root = el.getRootNode?.()
    return root instanceof ShadowRoot ? root : document
  }

  watchEffect(async () => {
    if (show.value && trigger.value && tooltip.value) {
      await nextTick()

      const rect = trigger.value.getBoundingClientRect()
      const tRect = tooltip.value.getBoundingClientRect()
      const offset = 6
      const root = getRootContainer(trigger.value)

      const scrollX =
        root instanceof ShadowRoot ? ((root.host as HTMLElement).scrollLeft ?? 0) : window.scrollX
      const scrollY =
        root instanceof ShadowRoot ? ((root.host as HTMLElement).scrollTop ?? 0) : window.scrollY
      const rootWidth =
        root instanceof ShadowRoot ? (root.host as HTMLElement).clientWidth : window.innerWidth
      const rootHeight =
        root instanceof ShadowRoot ? (root.host as HTMLElement).clientHeight : window.innerHeight

      let pos: TooltipPosition = props.position

      const calcPosition = (p: TooltipPosition) => {
        switch (p) {
          case 'top':
            return {
              top: rect.top + scrollY - tRect.height - offset,
              left: rect.left + scrollX + rect.width / 2 - tRect.width / 2,
            }
          case 'bottom':
            return {
              top: rect.bottom + scrollY + offset,
              left: rect.left + scrollX + rect.width / 2 - tRect.width / 2,
            }
          case 'left':
            return {
              top: rect.top + scrollY + rect.height / 2 - tRect.height / 2,
              left: rect.left + scrollX - tRect.width - offset,
            }
          case 'right':
            return {
              top: rect.top + scrollY + rect.height / 2 - tRect.height / 2,
              left: rect.right + scrollX + offset,
            }
        }
      }

      // Calcul initial
      let temp = calcPosition(pos)
      tooltip.value.style.top = `${temp.top}px`
      tooltip.value.style.left = `${temp.left}px`
      await nextTick()

      const newRect = tooltip.value.getBoundingClientRect()
      let deltaX = 0
      let deltaY = 0

      if (newRect.left < 0) deltaX = -newRect.left + 4
      else if (newRect.right > rootWidth) deltaX = rootWidth - newRect.right - 4

      if (newRect.top < 0) deltaY = -newRect.top + 4
      else if (newRect.bottom > rootHeight) deltaY = rootHeight - newRect.bottom - 4

      const exceedsX = Math.abs(deltaX) > tRect.width * 0.4
      const exceedsY = Math.abs(deltaY) > tRect.height * 0.4

      if (pos === 'right' && newRect.right > rootWidth && exceedsX) pos = 'left'
      else if (pos === 'left' && newRect.left < 0 && exceedsX) pos = 'right'
      else if (pos === 'top' && newRect.top < 0 && exceedsY) pos = 'bottom'
      else if (pos === 'bottom' && newRect.bottom > rootHeight && exceedsY) pos = 'top'
      else offsetCorrection.value = { x: deltaX, y: deltaY }

      temp = calcPosition(pos)
      effectivePosition.value = pos
      coords.value = { top: temp.top, left: temp.left }
    }
  })

  /* 🎨 Style dynamique */
  const tooltipStyle = computed<CSSProperties>(() => ({
    top: coords.value.top + 'px',
    left: coords.value.left + 'px',
    transform: `translate(${offsetCorrection.value.x}px, ${offsetCorrection.value.y}px)`,
    '--arrow-shift-x': `${offsetCorrection.value.x}px`,
    '--arrow-shift-y': `${offsetCorrection.value.y}px`,
    transition: 'transform 0.2s ease',
    maxWidth: props.maxWidth ? props.maxWidth + 'px' : 'max-content',
    position: 'absolute',
    width: 'max-content',
  }))
</script>

<style lang="less">
  @import './BasicTooltip.less';

  .tooltip {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
    &.is-visible {
      opacity: 1;
    }
  }
</style>
