<template>
  <transition name="typing-slide">
    <div
      v-if="isTyping"
      class="typing-indicator"
    >
      <div class="typing-indicator__avatar">
        <BasicIconNext
          name="Headphones"
          :size="12"
          color="white"
        />
      </div>

      <div class="typing-indicator__bubble">
        <div class="typing-indicator__dots">
          <span class="typing-indicator__dot" />
          <span class="typing-indicator__dot" />
          <span class="typing-indicator__dot" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  defineProps<{
    isTyping: boolean
  }>()
</script>

<style scoped lang="less">
  .typing-indicator {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding: 4px 0;

    // ─────────────────────────────────────────
    // Avatar
    // ─────────────────────────────────────────
    &__avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px color-mix(in srgb, var(--primary-600) 30%, transparent);
      animation: avatar-pulse 2s ease-in-out infinite;
    }

    // ─────────────────────────────────────────
    // Bubble
    // ─────────────────────────────────────────
    &__bubble {
      background: var(--admin-bg-card, white);
      border-radius: 18px;
      border-bottom-left-radius: 6px;
      padding: 12px 16px;
      box-shadow:
        0 1px 2px var(--admin-shadow, color-mix(in srgb, @neutral-900 6%, transparent)),
        0 2px 8px var(--admin-shadow, color-mix(in srgb, @neutral-900 4%, transparent));
      border: 1px solid var(--admin-border-subtle, color-mix(in srgb, @neutral-200 60%, transparent));
    }

    // ─────────────────────────────────────────
    // Dots
    // ─────────────────────────────────────────
    &__dots {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 16px;
    }

    &__dot {
      width: 8px;
      height: 8px;
      background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-600) 100%);
      border-radius: 50%;
      animation: dot-bounce 1.4s ease-in-out infinite;

      &:nth-child(1) {
        animation-delay: 0s;
      }

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }

  // ─────────────────────────────────────────
  // Animations
  // ─────────────────────────────────────────
  @keyframes dot-bounce {
    0%,
    60%,
    100% {
      transform: translateY(0);
      opacity: 0.4;
    }
    30% {
      transform: translateY(-6px);
      opacity: 1;
    }
  }

  @keyframes avatar-pulse {
    0%,
    100% {
      box-shadow: 0 2px 8px color-mix(in srgb, var(--primary-600) 30%, transparent);
    }
    50% {
      box-shadow:
        0 2px 8px color-mix(in srgb, var(--primary-600) 30%, transparent),
        0 0 0 4px color-mix(in srgb, var(--primary-400) 20%, transparent);
    }
  }

  // ─────────────────────────────────────────
  // Transition
  // ─────────────────────────────────────────
  .typing-slide-enter-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .typing-slide-leave-active {
    transition: all 0.2s ease;
  }

  .typing-slide-enter-from {
    opacity: 0;
    transform: translateX(-20px) scale(0.9);
  }

  .typing-slide-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.9);
  }
</style>
