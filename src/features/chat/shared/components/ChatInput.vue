<template>
  <form
    class="chat-input"
    @submit.prevent="send"
    aria-label="Zone de saisie du message"
  >
    <div class="chat-input__row">
      <input
        ref="inputRef"
        v-model="message"
        type="text"
        placeholder="Écrire un message..."
        required
        aria-label="Champ de texte du message"
        class="chat-input__field"
        @input="typing"
      />

      <button
        v-if="showAiButton"
        type="button"
        class="chat-input__ai-btn"
        :class="{ 'chat-input__ai-btn--loading': aiLoading }"
        :disabled="aiLoading"
        :title="aiLoading ? 'Génération en cours...' : 'Suggérer une réponse avec l\'IA'"
        @click="requestAiSuggestion"
      >
        <BasicIconNext
          v-if="!aiLoading"
          name="Sparkles"
          :size="18"
          color="white"
        />
        <span
          v-else
          class="chat-input__ai-spinner"
        />
      </button>

      <BasicButton
        label="Envoyer"
        type="primary"
        size="small"
        :disabled="!message.trim() || !isOnline"
        @click="send"
      />
    </div>

    <Transition name="fade-slide">
      <div
        v-if="aiError"
        class="chat-input__error"
      >
        <BasicIconNext
          name="AlertCircle"
          :size="14"
        />
        <span>{{ aiError }}</span>
        <button
          type="button"
          class="chat-input__error-close"
          @click="clearAiError"
        >
          <BasicIconNext
            name="X"
            :size="12"
          />
        </button>
      </div>
    </Transition>
  </form>
</template>

<script setup lang="ts">
  import { nextTick, onMounted, ref } from 'vue'

  const props = defineProps<{
    isOnline: boolean
    showAiButton?: boolean
    aiLoading?: boolean
    aiError?: string | null
  }>()

  const message = defineModel<string>({ default: '' })

  const emit = defineEmits<{
    (e: 'send'): void
    (e: 'typing'): void
    (e: 'request-ai-suggestion'): void
    (e: 'clear-ai-error'): void
  }>()

  const send = () => emit('send')
  const typing = () => emit('typing')
  const requestAiSuggestion = () => emit('request-ai-suggestion')
  const clearAiError = () => emit('clear-ai-error')

  const inputRef = ref<HTMLInputElement | null>(null)

  onMounted(() => nextTick(() => inputRef.value?.focus()))

  defineExpose({
    focus: () => inputRef.value?.focus(),
  })
</script>

<style scoped lang="less">
  .chat-input {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-top: 1px solid @neutral-200;
    padding: 10px 12px;
    background: white;

    &__row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__field {
      flex: 1;
      border: 1px solid @neutral-200;
      border-radius: 8px;
      padding: 8px 12px;
      background: @neutral-50;
      font-size: 14px;

      &:focus {
        border-color: var(--primary-500);
        background: white;
      }
    }

    &__ai-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;

      &:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 2px 8px color-mix(in srgb, #8b5cf6 40%, transparent);
      }

      &:active:not(:disabled) {
        transform: scale(0.98);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      &--loading {
        animation: pulse-glow 1.5s ease-in-out infinite;
      }
    }

    &__ai-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    &__error {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      background: color-mix(in srgb, @danger-500 10%, transparent);
      border: 1px solid color-mix(in srgb, @danger-500 20%, transparent);
      border-radius: 6px;
      font-size: 12px;
      color: @danger-700;

      span {
        flex: 1;
      }
    }

    &__error-close {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
      border: none;
      background: none;
      cursor: pointer;
      color: @danger-600;
      border-radius: 4px;
      transition: background 0.15s ease;

      &:hover {
        background: color-mix(in srgb, @danger-500 15%, transparent);
      }
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse-glow {
    0%,
    100% {
      box-shadow: 0 0 4px color-mix(in srgb, #8b5cf6 30%, transparent);
    }
    50% {
      box-shadow: 0 0 12px color-mix(in srgb, #8b5cf6 60%, transparent);
    }
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.2s ease;
  }

  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
</style>
