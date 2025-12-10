<template>
  <Teleport to="body">
    <Transition name="bottom-sheet">
      <div
        v-if="modelValue"
        class="bottom-sheet-overlay"
        @click.self="handleBackdropClick"
      >
        <div
          ref="sheetRef"
          class="bottom-sheet"
          :style="sheetStyle"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <!-- Drag Handle -->
          <div class="bottom-sheet__handle">
            <div class="bottom-sheet__handle-bar"></div>
          </div>

          <!-- Header -->
          <div
            v-if="title || $slots.header"
            class="bottom-sheet__header"
          >
            <slot name="header">
              <h3 class="bottom-sheet__title">{{ title }}</h3>
            </slot>
            <button
              class="bottom-sheet__close"
              @click="close"
            >
              <BasicIconNext
                name="X"
                :size="20"
              />
            </button>
          </div>

          <!-- Content -->
          <div class="bottom-sheet__content">
            <slot />
          </div>

          <!-- Actions -->
          <div
            v-if="$slots.actions"
            class="bottom-sheet__actions"
          >
            <slot name="actions" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    height?: 'auto' | 'half' | 'full'
    closable?: boolean
  }>(),
  {
    height: 'auto',
    closable: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sheetRef = ref<HTMLElement | null>(null)
const dragStartY = ref(0)
const currentTranslateY = ref(0)
const isDragging = ref(false)

const sheetStyle = computed(() => {
  if (isDragging.value && currentTranslateY.value > 0) {
    return {
      transform: `translateY(${currentTranslateY.value}px)`,
      transition: 'none',
    }
  }
  return {}
})

const close = () => {
  emit('update:modelValue', false)
}

const handleBackdropClick = () => {
  if (props.closable) {
    close()
  }
}

// Touch gestures
const onTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  if (!touch) return
  dragStartY.value = touch.clientY
  isDragging.value = true
}

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return

  const touch = e.touches[0]
  if (!touch) return
  const deltaY = touch.clientY - dragStartY.value
  // Only allow dragging down
  if (deltaY > 0) {
    currentTranslateY.value = deltaY
  }
}

const onTouchEnd = () => {
  isDragging.value = false

  // If dragged more than 100px, close
  if (currentTranslateY.value > 100) {
    close()
  }

  currentTranslateY.value = 0
}

// Lock body scroll when open
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)
</script>

<style scoped lang="less">
@import '@designSystem/fondation/colors/colors.less';

.bottom-sheet-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bottom-sheet {
  position: relative;
  width: 100%;
  max-height: 85vh;
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-bottom: none;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  // Safe area for iOS
  padding-bottom: env(safe-area-inset-bottom, 0);

  &__handle {
    display: flex;
    justify-content: center;
    padding: 12px 0 8px;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  &__handle-bar {
    width: 36px;
    height: 4px;
    background: var(--border-default);
    border-radius: 2px;
    transition: background 0.2s ease;

    &:hover {
      background: var(--text-muted);
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px 16px;
    border-bottom: 1px solid var(--border-default);
  }

  &__title {
    font-family: 'Instrument Sans', -apple-system, sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--bg-subtle);
    border: none;
    border-radius: 8px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--bg-elevated);
      color: var(--text-primary);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    overscroll-behavior: contain;

    // Custom scrollbar
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--border-default);
      border-radius: 3px;
    }
  }

  &__actions {
    padding: 16px 20px;
    border-top: 1px solid var(--border-default);
    background: var(--bg-surface);
  }
}

// Animations
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
  transition: opacity 0.3s ease;

  .bottom-sheet {
    transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  }
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  opacity: 0;

  .bottom-sheet {
    transform: translateY(100%);
  }
}

.bottom-sheet-enter-to,
.bottom-sheet-leave-from {
  opacity: 1;

  .bottom-sheet {
    transform: translateY(0);
  }
}
</style>
