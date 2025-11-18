<template>
  <transition name="compact-toast-fade">
    <div
      v-if="visible"
      class="compact-toast"
    >
      <img
        v-if="image"
        :src="image"
        alt="Produit"
        class="toast-img"
      />

      <div class="toast-info">
        <BasicText
          size="body-s"
          weight="semibold"
          color="white"
        >
          {{ title || 'Ajouté 🎉' }}
        </BasicText>
        <BasicText
          size="body-s"
          color="neutral-300"
        >
          {{ message || 'Ajouté au panier' }}
        </BasicText>
      </div>

      <button
        class="toast-close"
        @click="closeToast"
      >
        ✕
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'

  const props = defineProps<{
    id: number
    title?: string
    message?: string
    image?: string
    duration?: number
  }>()

  const visible = ref(false)
  const toastStore = useToastStore()

  function closeToast() {
    visible.value = false
    setTimeout(() => toastStore.removeToast(props.id), 250)
  }

  onMounted(() => {
    visible.value = true
    setTimeout(closeToast, props.duration ?? 2500)
  })
</script>

<style scoped lang="less">
  .compact-toast {
    display: flex;
    align-items: center;
    background: color-mix(in srgb, @neutral-900 95%, transparent);
    color: white;
    border-radius: 8px;
    padding: 8px 10px;
    width: 220px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;

    .toast-img {
      width: 34px;
      height: 34px;
      border-radius: 6px;
      object-fit: cover;
      margin-right: 8px;
    }

    .toast-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .toast-close {
      background: transparent;
      border: none;
      color: fade(white, 70%);
      cursor: pointer;
      font-size: 12px;
      transition: color 0.2s;
      &:hover {
        color: white;
      }
    }
  }

  /* 💫 Animation plus douce */
  .compact-toast-fade-enter-active,
  .compact-toast-fade-leave-active {
    transition: all 0.35s ease;
  }
  .compact-toast-fade-enter-from,
  .compact-toast-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
</style>
