<template>
  <transition name="slide-fade">
    <div
      v-if="visible"
      class="toast"
      :class="[`toast--${type}`]"
    >
      <div class="toast__content">
        <BasicAlert
          :alert-type="type"
          :alert-label="message"
          :has-bg="true"
          :has-label="true"
          alert-size="medium"
        />

        <button
          class="toast__close"
          type="button"
          @click="handleClose"
        >
          ✖
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { useToastStore, type ToastType } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'

  const props = defineProps<{
    id: number
    message: string
    type: ToastType
    duration?: number
  }>()

  const visible = ref(false)
  const toastStore = useToastStore()

  function handleClose() {
    visible.value = false
    setTimeout(() => toastStore.removeToast(props.id), 300)
  }

  onMounted(() => {
    visible.value = true
    setTimeout(handleClose, props.duration ?? 4000)
  })
</script>

<style scoped lang="less">
  .toast {
    position: relative;
    width: 360px;
    margin-top: 10px;
    animation: fadeIn 0.5s ease-out;

    &__content {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: @neutral-50;
      border-radius: 8px;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
      overflow: hidden;
    }

    &__close {
      position: absolute;
      top: 6px;
      right: 8px;
      background: transparent;
      border: none;
      color: @neutral-700;
      font-size: 14px;
      cursor: pointer;
      transition: color 0.1s;

      &:hover {
        color: @neutral-900;
      }
    }

    &--danger .alert {
      border-left: 4px solid @danger-600;
    }
    &--warning .alert {
      border-left: 4px solid @warning-600;
    }
    &--success .alert {
      border-left: 4px solid @success-600;
    }
    &--info .alert {
      border-left: 4px solid @info-600;
    }
  }

  /* ✨ Animation slide + fade premium */
  .slide-fade-enter-active {
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .slide-fade-leave-active {
    transition: all 1s ease-in-out;
  }
  .slide-fade-enter-from {
    opacity: 0;
    transform: translateY(-25px);
  }
  .slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-25px);
  }
</style>
