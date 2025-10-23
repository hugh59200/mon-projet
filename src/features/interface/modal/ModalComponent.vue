<template>
  <div
    v-if="modalVisible"
    class="modal"
  >
    <div
      class="modal__dialog"
      ref="modal"
    >
      <div
        v-if="$slots.header"
        class="modal__header"
      >
        <BasicText
          size="h4"
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

      <div class="modal__content">
        <BasicIconNext
          v-if="closable && !$slots.header"
          name="X"
          @click="closeModal"
          pointer
        />
        <slot name="content"></slot>
      </div>

      <div
        v-if="$slots.actions"
        class="modal__actions"
      >
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useHandleClickOutside } from '@/features/interface/composables/useHandleClickOutside'
  import { onMounted, onUnmounted, ref } from 'vue'

  interface ModalProps {
    closable?: boolean
  }

  const props = withDefaults(defineProps<ModalProps>(), {
    closable: true,
  })

  const modal = ref()
  const modalVisible = defineModel<boolean>()
  const emit = defineEmits(['close'])

  function closeModal() {
    if (props.closable !== false) {
      modalVisible.value = false
      emit('close')
    }
  }

  useHandleClickOutside(modal, () => closeModal())

  function handleEscapeKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && modalVisible.value && props.closable) {
      closeModal()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleEscapeKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscapeKeydown)
  })
</script>

<style scoped>
  @import './ModalComponent.less';
</style>
