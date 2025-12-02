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
    gap: 10px;
    padding: 16px 20px 20px;
    background: linear-gradient(to top, white 0%, @neutral-50 100%);
    border-top: 1px solid @neutral-100;
    position: relative;

    // Subtle top shadow
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        @neutral-200 30%,
        @neutral-200 70%,
        transparent 100%
      );
    }

    // ─────────────────────────────────────────
    // Conteneur principal Premium
    // ─────────────────────────────────────────
    &__container {
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      border-radius: 28px;
      padding: 8px 8px 8px 20px;
      box-shadow:
        0 2px 8px color-mix(in srgb, @neutral-900 5%, transparent),
        0 4px 16px color-mix(in srgb, @neutral-900 6%, transparent),
        0 0 0 1px color-mix(in srgb, @neutral-200 40%, transparent);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;

      // Inner highlight
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50%;
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.9) 0%,
          transparent 100%
        );
        pointer-events: none;
        border-radius: 28px 28px 0 0;
      }

      &:focus-within {
        box-shadow:
          0 4px 16px color-mix(in srgb, var(--primary-500) 20%, transparent),
          0 8px 32px color-mix(in srgb, var(--primary-600) 12%, transparent),
          0 0 0 2px color-mix(in srgb, var(--primary-400) 35%, transparent);
        transform: translateY(-1px);
      }
    }

    // ─────────────────────────────────────────
    // Wrapper du champ
    // ─────────────────────────────────────────
    &__field-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    &__field {
      width: 100%;
      border: none;
      background: transparent;
      font-size: 15px;
      line-height: 1.5;
      color: @neutral-800;
      outline: none;
      font-weight: 500;
      letter-spacing: -0.01em;

      &::placeholder {
        color: @neutral-400;
        font-weight: 400;
      }
    }

    // ─────────────────────────────────────────
    // Actions (boutons)
    // ─────────────────────────────────────────
    &__actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    // ─────────────────────────────────────────
    // Bouton AI Copilot Premium
    // ─────────────────────────────────────────
    &__ai-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 14px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;
      box-shadow:
        0 2px 8px color-mix(in srgb, #8b5cf6 35%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);

      // Shine sweep effect
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          105deg,
          transparent 20%,
          rgba(255, 255, 255, 0.25) 45%,
          rgba(255, 255, 255, 0.25) 55%,
          transparent 80%
        );
        transform: translateX(-150%);
        transition: transform 0.7s ease;
      }

      // Subtle inner glow
      &::after {
        content: '';
        position: absolute;
        inset: 2px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        pointer-events: none;
      }

      &:hover:not(:disabled) {
        transform: scale(1.08) translateY(-2px);
        box-shadow:
          0 6px 20px color-mix(in srgb, #8b5cf6 50%, transparent),
          0 12px 40px color-mix(in srgb, #6366f1 30%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.25);

        &::before {
          transform: translateX(150%);
        }
      }

      &:active:not(:disabled) {
        transform: scale(0.98);
      }

      &:disabled {
        opacity: 0.85;
        cursor: not-allowed;
      }

      &--loading {
        animation: ai-glow-premium 2s ease-in-out infinite;
      }

      &--pulse:not(:disabled):not(:hover) {
        animation: subtle-pulse-premium 3s ease-in-out infinite;
      }
    }

    &__ai-spinner {
      width: 18px;
      height: 18px;
      border: 2.5px solid rgba(255, 255, 255, 0.25);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    // ─────────────────────────────────────────
    // Bouton Envoyer Premium
    // ─────────────────────────────────────────
    &__send-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 14px;
      background: @neutral-200;
      cursor: not-allowed;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;

      &--active {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        cursor: pointer;
        box-shadow:
          0 2px 8px color-mix(in srgb, var(--primary-600) 35%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);

        // Shine effect
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(255, 255, 255, 0.2) 50%,
            transparent 70%
          );
          transform: translateX(-150%);
          transition: transform 0.5s ease;
        }

        &:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow:
            0 6px 20px color-mix(in srgb, var(--primary-600) 45%, transparent),
            0 12px 40px color-mix(in srgb, var(--primary-700) 25%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);

          &::before {
            transform: translateX(150%);
          }
        }

        &:active {
          transform: scale(0.98);
        }
      }

      &:disabled:not(&--active) {
        opacity: 0.5;
      }
    }

    // ─────────────────────────────────────────
    // Barre d'erreur Premium
    // ─────────────────────────────────────────
    &__error {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: linear-gradient(
        135deg,
        color-mix(in srgb, @danger-500 10%, white) 0%,
        color-mix(in srgb, @danger-400 8%, white) 100%
      );
      border: 1px solid color-mix(in srgb, @danger-400 30%, transparent);
      border-radius: 14px;
      font-size: 13px;
      color: @danger-700;
      box-shadow: 0 2px 8px color-mix(in srgb, @danger-500 15%, transparent);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(180deg, @danger-500 0%, @danger-400 100%);
      }
    }

    &__error-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, @danger-500 0%, @danger-400 100%);
      border-radius: 8px;
      flex-shrink: 0;
      color: white;
      box-shadow: 0 2px 6px color-mix(in srgb, @danger-500 30%, transparent);
    }

    &__error-text {
      flex: 1;
      line-height: 1.4;
      font-weight: 500;
    }

    &__error-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      background: color-mix(in srgb, @danger-500 10%, transparent);
      cursor: pointer;
      color: @danger-600;
      border-radius: 8px;
      transition: all 0.2s ease;
      flex-shrink: 0;

      &:hover {
        background: color-mix(in srgb, @danger-500 20%, transparent);
        transform: scale(1.05);
      }
    }

    // ─────────────────────────────────────────
    // Indicateur hors ligne Premium
    // ─────────────────────────────────────────
    &__offline {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 14px;
      background: linear-gradient(
        135deg,
        color-mix(in srgb, @warning-500 12%, white) 0%,
        color-mix(in srgb, @warning-400 10%, white) 100%
      );
      border-radius: 10px;
      font-size: 12px;
      color: @warning-700;
      font-weight: 600;
      box-shadow: 0 2px 8px color-mix(in srgb, @warning-500 15%, transparent);
    }
  }

  // ─────────────────────────────────────────
  // Animations Premium
  // ─────────────────────────────────────────
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes ai-glow-premium {
    0%,
    100% {
      box-shadow:
        0 2px 8px color-mix(in srgb, #8b5cf6 40%, transparent),
        0 4px 16px color-mix(in srgb, #6366f1 25%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    50% {
      box-shadow:
        0 4px 20px color-mix(in srgb, #8b5cf6 60%, transparent),
        0 8px 32px color-mix(in srgb, #6366f1 40%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
  }

  @keyframes subtle-pulse-premium {
    0%,
    100% {
      box-shadow:
        0 2px 8px color-mix(in srgb, #8b5cf6 30%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    50% {
      box-shadow:
        0 4px 16px color-mix(in srgb, #8b5cf6 45%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.25);
    }
  }

  // ─────────────────────────────────────────
  // Transitions Premium
  // ─────────────────────────────────────────
  .error-slide-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .error-slide-leave-active {
    transition: all 0.25s ease;
  }

  .error-slide-enter-from {
    opacity: 0;
    transform: translateY(-12px) scale(0.92);
  }

  .error-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px) scale(0.95);
  }

  .btn-pop-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .btn-pop-leave-active {
    transition: all 0.2s ease;
  }

  .btn-pop-enter-from,
  .btn-pop-leave-to {
    opacity: 0;
    transform: scale(0.4);
  }

  .icon-swap-enter-active,
  .icon-swap-leave-active {
    transition: all 0.25s ease;
  }

  .icon-swap-enter-from {
    opacity: 0;
    transform: scale(0.4) rotate(-120deg);
  }

  .icon-swap-leave-to {
    opacity: 0;
    transform: scale(0.4) rotate(120deg);
  }

  .offline-fade-enter-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .offline-fade-leave-active {
    transition: all 0.25s ease;
  }

  .offline-fade-enter-from,
  .offline-fade-leave-to {
    opacity: 0;
    transform: translateY(8px) scale(0.95);
  }
</style>
