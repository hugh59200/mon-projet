<template>
  <form
    class="chat-input"
    @submit.prevent="send"
    aria-label="Zone de saisie du message"
  >
    <!-- Barre d'erreur AI -->
    <Transition name="error-slide">
      <div
        v-if="aiError"
        class="chat-input__error"
      >
        <div class="chat-input__error-icon">
          <BasicIconNext
            name="AlertCircle"
            :size="14"
            color="currentColor"
          />
        </div>
        <span class="chat-input__error-text">{{ aiError }}</span>
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

    <!-- Zone de saisie principale -->
    <div class="chat-input__container">
      <div class="chat-input__field-wrapper">
        <input
          ref="inputRef"
          v-model="message"
          type="text"
          placeholder="Écrire un message..."
          required
          aria-label="Champ de texte du message"
          class="chat-input__field"
          @input="typing"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
      </div>

      <div class="chat-input__actions">
        <!-- Bouton AI Copilot -->
        <Transition name="btn-pop">
          <button
            v-if="showAiButton"
            type="button"
            class="chat-input__ai-btn"
            :class="{
              'chat-input__ai-btn--loading': aiLoading,
              'chat-input__ai-btn--pulse': !aiLoading
            }"
            :disabled="aiLoading"
            :title="aiLoading ? 'Génération en cours...' : 'Suggérer une réponse avec l\'IA'"
            @click="requestAiSuggestion"
          >
            <Transition
              name="icon-swap"
              mode="out-in"
            >
              <BasicIconNext
                v-if="!aiLoading"
                key="sparkles"
                name="Sparkles"
                :size="16"
                color="white"
              />
              <span
                v-else
                key="spinner"
                class="chat-input__ai-spinner"
              />
            </Transition>
          </button>
        </Transition>

        <!-- Bouton Envoyer -->
        <button
          type="submit"
          class="chat-input__send-btn"
          :class="{ 'chat-input__send-btn--active': canSend }"
          :disabled="!canSend"
          title="Envoyer le message"
        >
          <BasicIconNext
            name="Send"
            :size="18"
            color="white"
          />
        </button>
      </div>
    </div>

    <!-- Indicateur hors ligne -->
    <Transition name="offline-fade">
      <div
        v-if="!isOnline"
        class="chat-input__offline"
      >
        <BasicIconNext
          name="WifiOff"
          :size="12"
        />
        <span>Connexion perdue</span>
      </div>
    </Transition>
  </form>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, ref } from 'vue'

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

  const inputRef = ref<HTMLInputElement | null>(null)
  const isFocused = ref(false)

  const canSend = computed(() => message.value.trim() && props.isOnline)

  const send = () => emit('send')
  const typing = () => emit('typing')
  const requestAiSuggestion = () => emit('request-ai-suggestion')
  const clearAiError = () => emit('clear-ai-error')

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
    gap: 8px;
    padding: 12px 16px;
    background: linear-gradient(to top, white 0%, @neutral-50 100%);
    border-top: 1px solid @neutral-100;

    // ─────────────────────────────────────────
    // Conteneur principal
    // ─────────────────────────────────────────
    &__container {
      display: flex;
      align-items: center;
      gap: 10px;
      background: white;
      border-radius: 24px;
      padding: 6px 6px 6px 16px;
      box-shadow:
        0 2px 8px color-mix(in srgb, @neutral-900 6%, transparent),
        0 0 0 1px color-mix(in srgb, @neutral-200 50%, transparent);
      transition: all 0.2s ease;

      &:focus-within {
        box-shadow:
          0 4px 12px color-mix(in srgb, var(--primary-500) 15%, transparent),
          0 0 0 2px color-mix(in srgb, var(--primary-400) 30%, transparent);
      }
    }

    // ─────────────────────────────────────────
    // Wrapper du champ
    // ─────────────────────────────────────────
    &__field-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
    }

    &__field {
      width: 100%;
      border: none;
      background: transparent;
      font-size: 14px;
      line-height: 1.5;
      color: @neutral-800;
      outline: none;

      &::placeholder {
        color: @neutral-400;
      }
    }

    // ─────────────────────────────────────────
    // Actions (boutons)
    // ─────────────────────────────────────────
    &__actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    // ─────────────────────────────────────────
    // Bouton AI Copilot
    // ─────────────────────────────────────────
    &__ai-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          45deg,
          transparent 30%,
          rgba(255, 255, 255, 0.2) 50%,
          transparent 70%
        );
        transform: translateX(-100%);
        transition: transform 0.6s ease;
      }

      &:hover:not(:disabled) {
        transform: scale(1.1);
        box-shadow: 0 4px 16px color-mix(in srgb, #8b5cf6 50%, transparent);

        &::before {
          transform: translateX(100%);
        }
      }

      &:active:not(:disabled) {
        transform: scale(0.95);
      }

      &:disabled {
        opacity: 0.8;
        cursor: not-allowed;
      }

      &--loading {
        animation: ai-glow 1.5s ease-in-out infinite;
      }

      &--pulse:not(:disabled):not(:hover) {
        animation: subtle-pulse 3s ease-in-out infinite;
      }
    }

    &__ai-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    // ─────────────────────────────────────────
    // Bouton Envoyer
    // ─────────────────────────────────────────
    &__send-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background: @neutral-300;
      cursor: not-allowed;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

      &--active {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        cursor: pointer;
        box-shadow: 0 2px 8px color-mix(in srgb, var(--primary-600) 30%, transparent);

        &:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 16px color-mix(in srgb, var(--primary-600) 45%, transparent);
        }

        &:active {
          transform: scale(0.95);
        }
      }

      &:disabled:not(&--active) {
        opacity: 0.6;
      }
    }

    // ─────────────────────────────────────────
    // Barre d'erreur
    // ─────────────────────────────────────────
    &__error {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: linear-gradient(
        135deg,
        color-mix(in srgb, @danger-500 8%, transparent) 0%,
        color-mix(in srgb, @danger-400 6%, transparent) 100%
      );
      border: 1px solid color-mix(in srgb, @danger-400 25%, transparent);
      border-radius: 12px;
      font-size: 12px;
      color: @danger-700;
    }

    &__error-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      background: color-mix(in srgb, @danger-500 15%, transparent);
      border-radius: 50%;
      flex-shrink: 0;
    }

    &__error-text {
      flex: 1;
      line-height: 1.4;
    }

    &__error-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      color: @danger-600;
      border-radius: 50%;
      transition: all 0.15s ease;
      flex-shrink: 0;

      &:hover {
        background: color-mix(in srgb, @danger-500 15%, transparent);
      }
    }

    // ─────────────────────────────────────────
    // Indicateur hors ligne
    // ─────────────────────────────────────────
    &__offline {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 6px 12px;
      background: color-mix(in srgb, @warning-500 10%, transparent);
      border-radius: 8px;
      font-size: 11px;
      color: @warning-700;
      font-weight: 500;
    }
  }

  // ─────────────────────────────────────────
  // Animations
  // ─────────────────────────────────────────
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes ai-glow {
    0%,
    100% {
      box-shadow:
        0 0 4px color-mix(in srgb, #8b5cf6 40%, transparent),
        0 0 8px color-mix(in srgb, #6366f1 20%, transparent);
    }
    50% {
      box-shadow:
        0 0 12px color-mix(in srgb, #8b5cf6 60%, transparent),
        0 0 24px color-mix(in srgb, #6366f1 40%, transparent);
    }
  }

  @keyframes subtle-pulse {
    0%,
    100% {
      box-shadow: 0 2px 8px color-mix(in srgb, #8b5cf6 25%, transparent);
    }
    50% {
      box-shadow: 0 2px 12px color-mix(in srgb, #8b5cf6 40%, transparent);
    }
  }

  // ─────────────────────────────────────────
  // Transitions
  // ─────────────────────────────────────────
  .error-slide-enter-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .error-slide-leave-active {
    transition: all 0.2s ease;
  }

  .error-slide-enter-from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }

  .error-slide-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }

  .btn-pop-enter-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .btn-pop-leave-active {
    transition: all 0.15s ease;
  }

  .btn-pop-enter-from,
  .btn-pop-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }

  .icon-swap-enter-active,
  .icon-swap-leave-active {
    transition: all 0.2s ease;
  }

  .icon-swap-enter-from {
    opacity: 0;
    transform: scale(0.5) rotate(-90deg);
  }

  .icon-swap-leave-to {
    opacity: 0;
    transform: scale(0.5) rotate(90deg);
  }

  .offline-fade-enter-active {
    transition: all 0.3s ease;
  }

  .offline-fade-leave-active {
    transition: all 0.2s ease;
  }

  .offline-fade-enter-from,
  .offline-fade-leave-to {
    opacity: 0;
    transform: translateY(4px);
  }
</style>
