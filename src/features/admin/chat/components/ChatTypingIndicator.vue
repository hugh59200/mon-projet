<template>
  <transition name="typing-fade">
    <div
      v-if="isTyping"
      class="typing-bubble-wrapper"
    >
      <div class="typing-bubble">
        <span class="dot" />
        <span class="dot" />
        <span class="dot" />
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
  .typing-bubble-wrapper {
    position: absolute;
    bottom: 10px;
    left: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 12px 8px;
    background: @neutral-50;
    pointer-events: none;
  }

  .typing-bubble {
    display: inline-flex;
    align-items: center;
    justify-content: space-around;
    background: @neutral-200;
    border-radius: 16px;
    padding: 6px 10px;
    width: 48px;

    .dot {
      width: 6px;
      height: 6px;
      background: fade(@neutral-600, 70%);
      border-radius: 50%;
      animation: typingDots 1.3s infinite ease-in-out;
    }
    .dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    .dot:nth-child(3) {
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
