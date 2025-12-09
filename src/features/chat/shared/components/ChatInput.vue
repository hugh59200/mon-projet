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
        <PremiumButton
          type="danger"
          variant="ghost"
          size="xs"
          icon-left="X"
          class="chat-input__error-close"
          @click="clearAiError"
        />
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
        <PremiumButton
          v-if="showAiButton"
          type="primary"
          variant="gradient"
          size="sm"
          icon-left="Sparkles"
          html-type="button"
          class="chat-input__ai-btn"
          :loading="aiLoading"
          :pulse="!aiLoading"
          :glow="aiLoading"
          loading-icon="Sparkles"
          loading-text=""
          :show-loading-progress="false"
          :show-loading-dots="false"
          @click="requestAiSuggestion"
        />

        <!-- Bouton Envoyer -->
        <PremiumButton
          type="primary"
          variant="solid"
          size="sm"
          icon-left="Send"
          html-type="submit"
          class="chat-input__send-btn"
          :disabled="!canSend"
        />
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
    background: linear-gradient(to top, var(--admin-bg-surface, white) 0%, var(--admin-bg-subtle, @neutral-50) 100%);
    border-top: 1px solid var(--admin-border-subtle, @neutral-100);
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
        var(--admin-border-subtle, @neutral-200) 30%,
        var(--admin-border-subtle, @neutral-200) 70%,
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
      background: var(--admin-bg-card, white);
      border-radius: 28px;
      padding: 8px 8px 8px 20px;
      box-shadow:
        0 2px 8px var(--admin-shadow, color-mix(in srgb, @neutral-900 5%, transparent)),
        0 4px 16px var(--admin-shadow, color-mix(in srgb, @neutral-900 6%, transparent)),
        0 0 0 1px var(--admin-border-subtle, color-mix(in srgb, @neutral-200 40%, transparent));
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
      color: var(--admin-text-primary, @neutral-800);
      outline: none;
      font-weight: 500;
      letter-spacing: -0.01em;

      &::placeholder {
        color: var(--admin-text-muted, @neutral-400);
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

    &__ai-btn {
      flex-shrink: 0;
    }

    &__send-btn {
      flex-shrink: 0;
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
        color-mix(in srgb, @danger-500 10%, var(--admin-bg-surface, white)) 0%,
        color-mix(in srgb, @danger-400 8%, var(--admin-bg-surface, white)) 100%
      );
      border: 1px solid color-mix(in srgb, @danger-400 30%, transparent);
      border-radius: 14px;
      font-size: 13px;
      color: var(--danger-700);
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
        color-mix(in srgb, @warning-500 12%, var(--admin-bg-surface, white)) 0%,
        color-mix(in srgb, @warning-400 10%, var(--admin-bg-surface, white)) 100%
      );
      border-radius: 10px;
      font-size: 12px;
      color: var(--warning-700);
      font-weight: 600;
      box-shadow: 0 2px 8px color-mix(in srgb, @warning-500 15%, transparent);
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
