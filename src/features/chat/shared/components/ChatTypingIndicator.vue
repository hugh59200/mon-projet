<template>
  <transition name="typing-fade">
    <div
      v-if="isTyping"
      class="chat-typing-indicator"
    >
      <span class="chat-typing-indicator__dot" />
      <span class="chat-typing-indicator__dot" />
      <span class="chat-typing-indicator__dot" />
    </div>
  </transition>
</template>

<script setup lang="ts">
  defineProps<{
    isTyping: boolean
  }>()
</script>

<style scoped lang="less">
  .chat-typing-indicator {
    position: absolute;
    bottom: 10px;
    left: 50px;
    display: flex;
    align-items: center;
    background: @neutral-500;
    pointer-events: none;
    border-radius: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: space-around;
    background: @neutral-200;
    border-radius: 16px;
    padding: 6px 10px;
    width: 48px;

    &__dot {
      width: 6px;
      height: 6px;
      background: color-mix(in srgb, @neutral-600 70%, transparent);
      border-radius: 50%;
      animation: typingDots 1.3s infinite ease-in-out;
    }
    &__dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    &__dot:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes typingDots {
    0%,
    80%,
    100% {
      transform: scale(0.6);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
