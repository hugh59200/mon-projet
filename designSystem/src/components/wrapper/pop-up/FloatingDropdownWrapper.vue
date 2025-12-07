<template>
  <div
    class="floating-wrapper"
    ref="wrapperRef"
  >
    <!-- 🎯 Déclencheur -->
    <div
      ref="triggerRef"
      class="floating-wrapper__trigger"
      @mouseenter="triggerMode === 'hover' ? onEnter() : null"
      @mouseleave="triggerMode === 'hover' ? onLeave() : null"
      @click.stop="triggerMode === 'click' ? toggleDropdown() : null"
    >
      <slot name="trigger" />
    </div>

    <!-- 🧊 Zone tampon invisible (anti flicker entre trigger et dropdown) -->
    <div
      v-if="model && triggerMode === 'hover'"
      class="floating-wrapper__grace-zone"
      :style="graceZoneStyle"
    />

    <!-- 🎯 Contenu du dropdown -->
    <transition name="fade-slide">
      <div
        v-if="model"
        class="floating-dropdown"
        :style="dropdownStyle"
        v-click-outside="{
          callback: () => (model = false),
          exclude: [triggerRef],
        }"
        @mouseenter="triggerMode === 'hover' ? onEnter() : null"
        @mouseleave="triggerMode === 'hover' ? onLeave() : null"
      >
        <div
          class="floating-dropdown__arrow"
          :style="arrowStyle"
        />
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { vClickOutside } from '@/directives/vClickOutside'
  import { computed, nextTick, onMounted, onUnmounted, ref, watch, type PropType } from 'vue'
  import { useDropdownManager } from './useDropdownManager'

  defineOptions({ directives: { clickOutside: vClickOutside } })

  /* ----------------------------------------------------------
   ⚙️ Props et modèles
---------------------------------------------------------- */
  const model = defineModel<boolean>({ default: false })

  const props = defineProps({
    offset: { type: Number, default: 8 },
    hoverDelay: { type: Number, default: 250 },
    closeDelay: { type: Number, default: 500 },
    autoCloseDelay: { type: Number, default: 0 },
    arrowOffset: { type: Number, default: 18 },
    width: { type: Number, default: 0 },
    align: { type: String as PropType<'left' | 'center' | 'right'>, default: 'right' },
    arrowAlign: {
      type: String as PropType<'auto' | 'center' | 'start' | 'end'>,
      default: 'auto',
    },
    triggerMode: {
      type: String as PropType<'hover' | 'click'>,
      default: 'hover',
    },
  })

  /* ----------------------------------------------------------
   🔗 Dropdown logic
---------------------------------------------------------- */
  const id = Math.random().toString(36).substring(2, 9)
  const { open, close, onChange } = useDropdownManager(id)

  const wrapperRef = ref<HTMLElement | null>(null)
  const triggerRef = ref<HTMLElement | null>(null)
  const dropdownTop = ref<number>(0)
  const dropdownLeft = ref<number | undefined>(undefined)
  const triggerCenter = ref<number>(0)

  let hoverTimer: number | null = null
  let closeTimer: number | null = null
  let autoCloseTimer: number | null = null

  function updatePosition() {
    nextTick(() => {
      const el = triggerRef.value
      if (!el) return
      const rect = el.getBoundingClientRect()
      dropdownTop.value = rect.bottom + props.offset
      triggerCenter.value = rect.left + rect.width / 2

      if (props.align === 'left') dropdownLeft.value = rect.left
      else if (props.align === 'center') dropdownLeft.value = triggerCenter.value - props.width / 2
      else if (props.align === 'right') dropdownLeft.value = rect.right - props.width
    })
  }

  /* ----------------------------------------------------------
   💅 Styles dynamiques
---------------------------------------------------------- */
  const dropdownStyle = computed(() => ({
    top: dropdownTop.value + 'px',
    left: dropdownLeft.value + 'px',
    minWidth: props.width ? props.width + 'px' : undefined,
  }))

  const graceZoneStyle = computed(() => ({
    top: dropdownTop.value - 10 + 'px',
    left: dropdownLeft.value + 'px',
    width: props.width ? props.width + 'px' : 'auto',
  }))

  const arrowStyle = computed(() => {
    const style: Record<string, string | undefined> = { transform: 'rotate(45deg)' }
    if (props.arrowAlign === 'center') {
      style.left = '50%'
      style.transform = 'translateX(-50%) rotate(45deg)'
    } else if (props.arrowAlign === 'start') style.left = props.arrowOffset + 'px'
    else if (props.arrowAlign === 'end') style.right = props.arrowOffset + 'px'
    else {
      const left = triggerCenter.value - (dropdownLeft.value ?? 0)
      style.left = `${left}px`
      style.transform = 'translateX(-50%) rotate(45deg)'
    }
    return style
  })

  /* ----------------------------------------------------------
   🪄 Gestion hover & click
---------------------------------------------------------- */
  function onEnter() {
    if (hoverTimer) clearTimeout(hoverTimer)
    if (closeTimer) clearTimeout(closeTimer)
    hoverTimer = window.setTimeout(() => {
      open()
      model.value = true
    }, props.hoverDelay)
  }

  function onLeave() {
    if (hoverTimer) clearTimeout(hoverTimer)
    if (closeTimer) clearTimeout(closeTimer)
    closeTimer = window.setTimeout(() => {
      model.value = false
      close()
    }, props.closeDelay)
  }

  function toggleDropdown() {
    model.value = !model.value
    if (model.value) open()
    else close()
  }

  /* ----------------------------------------------------------
   ⏱️ Fermeture auto & sync globale
---------------------------------------------------------- */
  watch(model, (val) => {
    if (val) {
      updatePosition()
      if (props.autoCloseDelay > 0) {
        if (autoCloseTimer) clearTimeout(autoCloseTimer)
        autoCloseTimer = window.setTimeout(() => {
          model.value = false
          close()
        }, props.autoCloseDelay)
      }
    }
  })

  onChange((active) => {
    if (!active && model.value) model.value = false
  })

  onMounted(() => {
    setTimeout(updatePosition, 100)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, { passive: true })
  })
  onUnmounted(() => {
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition)
    ;[hoverTimer, closeTimer, autoCloseTimer].forEach((t) => t && clearTimeout(t))
  })
</script>

<style scoped lang="less">
  /* ==========================================================
     🧭 WRAPPER
     ========================================================== */
  .floating-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;

    &__trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    &__grace-zone {
      position: fixed;
      height: 12px;
      pointer-events: none;
      background: transparent;
      z-index: 1500;
    }
  }

  /* ==========================================================
     🧊 FLOATING DROPDOWN — Neural Glass v2
     ========================================================== */
  .floating-dropdown {
    position: fixed;
    z-index: 2000;

    /* 🌫️ Glass effect variant */
    background: rgba(var(--secondary-900-rgb), 0.92);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);

    border-radius: 14px;

    padding: 16px 14px 12px;

    /* 🫥 Subtle border */
    border: 1px solid color-mix(in srgb, @neutral-500 6%, transparent);

    /* 🧠 Neural-shadow */
    box-shadow:
      0 8px 26px rgba(var(--primary-900-rgb), 0.4),
      0 4px 18px fade(#000, 55%);

    animation: fadeScaleIn 0.22s cubic-bezier(0.25, 1, 0.5, 1);

    /* Arrow */
    &__arrow {
      position: absolute;
      top: -7px;
      width: 14px;
      height: 14px;

      background: rgba(var(--secondary-900-rgb), 0.92);
      backdrop-filter: blur(14px);
      border: 1px solid color-mix(in srgb, @neutral-500 6%, transparent);
      border-bottom: none;
      border-right: none;

      transform: rotate(45deg);
      border-radius: 4px 0 0 0;

      /* halo */
      box-shadow:
        -2px -2px 5px fade(#000, 25%),
        0 0 6px rgba(var(--primary-700-rgb), 0.15);
    }
  }

  /* ==========================================================
     ✨ Animations — Neural Smooth
     ========================================================== */
  @keyframes fadeScaleIn {
    0% {
      opacity: 0;
      transform: translateY(6px) scale(0.95);
    }
    60% {
      opacity: 1;
      transform: translateY(2px) scale(1);
    }
    100% {
      transform: translateY(0) scale(1);
    }
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.22s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(8px);
  }
</style>
