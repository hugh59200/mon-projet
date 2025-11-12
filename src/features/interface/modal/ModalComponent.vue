<template>
  <div
    v-if="modalVisible"
    class="modal"
  >
    <div
      class="modal__dialog"
      ref="modal"
      v-motion="containerMotion"
    >
      <div
        v-if="hasHeader"
        class="modal__header"
        v-motion="fadeInHeader"
      >
        <BasicText
          weight="bold"
          color="white"
          nbMaxLines="2"
        >
          <slot name="header"></slot>
        </BasicText>
        <BasicIconNext
          v-if="closable"
          name="X"
          @click="closeModal"
          pointer
        />
      </div>
      <div
        class="modal__content"
        v-motion="fadeInContent"
      >
        <BasicIconNext
          v-if="closable && !hasHeader"
          name="X"
          @click="closeModal"
          pointer
          class="modal__close-icon"
        />
        <SmartModalSkeleton
          v-if="loading"
          :show-header="false"
          :show-actions="hasActions"
          :blocks="autoBlocks"
        />
        <slot
          v-else
          name="content"
        ></slot>
      </div>
      <div
        v-if="hasActions"
        class="modal__actions"
        v-motion="fadeInActions"
      >
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useHandleClickOutside } from '@/features/interface/composables/useHandleClickOutside'
  import { SmartModalSkeleton } from '@designSystem/index'
  import { computed, onMounted, onUnmounted, ref, useSlots } from 'vue'

  interface ModalProps {
    closable?: boolean
    loading?: boolean
    skeletonBlocks?: number
  }

  const props = withDefaults(defineProps<ModalProps>(), {
    closable: true,
    loading: false,
    skeletonBlocks: undefined,
  })

  const modalVisible = defineModel<boolean>()
  const modal = ref()
  const emit = defineEmits(['close'])
  const slots = useSlots()

  const hasHeader = computed(() => !!slots.header)
  const hasActions = computed(() => !!slots.actions)

  const autoBlocks = computed(() => {
    let base = 3
    if (hasActions.value) base += 1
    return props.skeletonBlocks ?? base
  })

  function closeModal() {
    if (props.closable) {
      modalVisible.value = false
      emit('close')
    }
  }

  useHandleClickOutside(modal, closeModal)

  function handleEscapeKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && modalVisible.value && props.closable) closeModal()
  }

  onMounted(() => window.addEventListener('keydown', handleEscapeKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleEscapeKeydown))

  const containerMotion = {
    initial: { opacity: 0, scale: 0.96, y: 10 },
    enter: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25 } },
    leave: { opacity: 0, scale: 0.96, y: -10, transition: { duration: 0.2 } },
  }

  const fadeInHeader = {
    initial: { opacity: 0, y: -6 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  }

  const fadeInContent = {
    initial: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const fadeInActions = {
    initial: { opacity: 0, y: 6 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  }
</script>

<style scoped lang="less">
  @import './ModalComponent.less';

  .modal__dialog {
    transform-origin: center center;
    will-change: opacity, transform;
  }

  .modal__content {
    position: relative;
    min-height: 120px;
  }

  .modal__close-icon {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .modal__actions {
    display: flex;
    justify-content: space-evenly;
    gap: 8px;
  }
</style>
