<template>
  <div
    class="floating-wrapper"
    ref="triggerRef"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <!-- 🎯 Déclencheur -->
    <slot name="trigger" />

    <!-- 🧊 Zone tampon invisible (anti flicker entre trigger et dropdown) -->
    <div
      v-if="model"
      class="hover-grace-zone"
      :style="graceZoneStyle"
    />

    <!-- 🎯 Contenu du dropdown -->
    <transition name="fade-slide">
      <div
        v-if="model"
        class="floating-dropdown"
        :style="dropdownStyle"
        v-click-outside="{ callback: () => (model = false), exclude: [triggerRef] }"
        @mouseenter="onEnter"
        @mouseleave="onLeave"
      >
        <div
          class="dropdown-arrow"
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

  // 🧠 Modèle réactif
  const model = defineModel<boolean>({ default: false })

  // 🧭 Props configurables
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
  })

  // 🌍 Manager global pour empêcher plusieurs dropdowns ouverts
  const id = Math.random().toString(36).substring(2, 9)
  const { open, close, onChange } = useDropdownManager(id)

  // 🔗 Références
  const triggerRef = ref<HTMLElement | null>(null)
  const dropdownTop = ref<number>(0)
  const dropdownLeft = ref<number | undefined>(undefined)
  const dropdownRight = ref<number | undefined>(undefined)
  const triggerCenter = ref<number>(0)

  // ⏱ Timers
  let hoverTimer: number | null = null
  let closeTimer: number | null = null
  let autoCloseTimer: number | null = null

  /* --- 🧭 Positionnement dynamique --- */
  function updatePosition() {
    nextTick(() => {
      const el = triggerRef.value
      if (!el) return

      const rect = el.getBoundingClientRect()
      dropdownTop.value = rect.bottom + props.offset
      triggerCenter.value = rect.left + rect.width / 2

      if (props.align === 'left') {
        dropdownLeft.value = rect.left
        dropdownRight.value = undefined
      } else if (props.align === 'center') {
        const center = rect.left + rect.width / 2
        dropdownLeft.value = center - props.width / 2
        dropdownRight.value = undefined
      } else if (props.align === 'right') {
        dropdownLeft.value = rect.right - props.width
        dropdownRight.value = undefined
      }
    })
  }

  /* --- 💅 Styles dynamiques --- */
  const dropdownStyle = computed(() => ({
    top: dropdownTop.value + 'px',
    left: dropdownLeft.value !== undefined ? dropdownLeft.value + 'px' : undefined,
    minWidth: props.width ? props.width + 'px' : undefined,
  }))

  /* --- 🧩 Zone de tolérance --- */
  const graceZoneStyle = computed(() => ({
    top: dropdownTop.value - 10 + 'px',
    left: dropdownLeft.value !== undefined ? dropdownLeft.value + 'px' : undefined,
    width: props.width ? props.width + 'px' : 'auto',
  }))

  /* --- 🎯 Flèche dynamique --- */
  const arrowStyle = computed(() => {
    const style: Record<string, string | undefined> = {
      transform: 'rotate(45deg)',
    }

    if (props.arrowAlign === 'center') {
      style.left = '50%'
      style.transform = 'translateX(-50%) rotate(45deg)'
    } else if (props.arrowAlign === 'start') {
      style.left = props.arrowOffset + 'px'
    } else if (props.arrowAlign === 'end') {
      style.right = props.arrowOffset + 'px'
    } else {
      const dropdownLeftValue = dropdownLeft.value ?? 0
      const centerInDropdown = triggerCenter.value - dropdownLeftValue
      style.left = `${centerInDropdown}px`
      style.transform = 'translateX(-50%) rotate(45deg)'
    }

    return style
  })

  /* --- 🪄 Hover automatique --- */
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

  /* --- ⏱️ Fermeture auto optionnelle --- */
  watch(model, (val) => {
    if (val) {
      updatePosition()
      open()
      if (props.autoCloseDelay > 0) {
        if (autoCloseTimer) clearTimeout(autoCloseTimer)
        autoCloseTimer = window.setTimeout(() => {
          model.value = false
          close()
        }, props.autoCloseDelay)
      }
    }
  })

  /* --- 🔒 Ferme quand un autre dropdown s'ouvre --- */
  onChange((active) => {
    if (!active && model.value) model.value = false
  })

  /* --- 📦 Lifecycle --- */
  onMounted(async () => {
    await nextTick()
    setTimeout(updatePosition, 50)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, { passive: true })
  })
  onUnmounted(() => {
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition)
    if (autoCloseTimer) clearTimeout(autoCloseTimer)
    if (hoverTimer) clearTimeout(hoverTimer)
    if (closeTimer) clearTimeout(closeTimer)
  })
</script>

<style scoped lang="less">
  .floating-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }

  /* --- Zone de tolérance invisible --- */
  .hover-grace-zone {
    position: fixed;
    height: 12px;
    pointer-events: none;
    background: transparent;
    z-index: 1500;
  }

  .floating-dropdown {
    position: fixed;
    background: @neutral-800;
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
    color: white;
    z-index: 2000;
    animation: bounceIn 0.35s ease;
    padding: 14px 12px 10px;
  }

  .dropdown-arrow {
    position: absolute;
    top: -6px;
    width: 12px;
    height: 12px;
    background: @neutral-800;
    border-top-left-radius: 3px;
    box-shadow: -2px -2px 4px rgba(0, 0, 0, 0.15);
  }

  /* 💫 Animations */
  @keyframes bounceIn {
    0% {
      transform: scale(0.9);
      opacity: 0;
    }
    60% {
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
</style>
