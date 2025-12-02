<template>
  <Transition
    name="card-slide"
    @after-leave="$emit('after-leave')"
  >
    <div
      v-if="show && suggestion"
      class="ai-suggestion-card"
    >
      <!-- Header avec icône IA -->
      <div class="ai-suggestion-card__header">
        <div class="ai-suggestion-card__icon">
          <BasicIconNext
            name="Sparkles"
            :size="18"
            color="white"
          />
        </div>
        <div class="ai-suggestion-card__title">
          <span class="ai-suggestion-card__title-text">Suggestion IA</span>
          <span class="ai-suggestion-card__subtitle">Réponse générée automatiquement</span>
        </div>
        <button
          class="ai-suggestion-card__close"
          type="button"
          title="Fermer"
          @click="$emit('close')"
        >
          <BasicIconNext
            name="X"
            :size="16"
            color="currentColor"
          />
        </button>
      </div>

      <!-- Contenu de la suggestion -->
      <div class="ai-suggestion-card__content">
        <p class="ai-suggestion-card__text">{{ suggestion }}</p>
      </div>

      <!-- Actions -->
      <div class="ai-suggestion-card__actions">
        <PremiumButton
          type="primary"
          variant="solid"
          size="sm"
          label="Utiliser cette réponse"
          icon-left="Check"
          class="ai-suggestion-card__action-btn ai-suggestion-card__action-btn--primary"
          @click="$emit('accept')"
        />
        <PremiumButton
          type="secondary"
          variant="outline"
          size="sm"
          label="Modifier"
          icon-left="Edit"
          class="ai-suggestion-card__action-btn"
          @click="$emit('edit')"
        />
        <PremiumButton
          type="secondary"
          variant="ghost"
          size="sm"
          label="Ignorer"
          class="ai-suggestion-card__action-btn"
          @click="$emit('close')"
        />
      </div>

      <!-- Badge "Powered by AI" -->
      <div class="ai-suggestion-card__badge">
        <div class="ai-suggestion-card__badge-icon">
          <BasicIconNext
            name="Zap"
            :size="10"
            color="currentColor"
          />
        </div>
        <span>Powered by AI</span>
      </div>

      <!-- Effet de shimmer -->
      <div class="ai-suggestion-card__shimmer" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
  defineProps<{
    show: boolean
    suggestion: string | null
  }>()

  defineEmits<{
    (e: 'accept'): void
    (e: 'edit'): void
    (e: 'close'): void
    (e: 'after-leave'): void
  }>()
</script>

<style scoped lang="less">
  .ai-suggestion-card {
    position: absolute;
    bottom: 76px;
    left: 20px;
    right: 20px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(255, 255, 255, 0.95) 100%
    );
    border-radius: 20px;
    box-shadow:
      0 8px 32px color-mix(in srgb, #8b5cf6 25%, transparent),
      0 16px 64px color-mix(in srgb, #6366f1 20%, transparent),
      0 0 0 1px color-mix(in srgb, #8b5cf6 15%, transparent),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: 20;
    overflow: hidden;
    max-width: 680px;
    margin: 0 auto;
    animation: float-subtle 4s ease-in-out infinite;

    // Gradient border effect
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 20px;
      padding: 2px;
      background: linear-gradient(
        135deg,
        #8b5cf6 0%,
        #6366f1 50%,
        #4f46e5 100%
      );
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0.3;
      pointer-events: none;
    }

    // ─────────────────────────────────────────
    // Header
    // ─────────────────────────────────────────
    &__header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid color-mix(in srgb, #8b5cf6 10%, transparent);
      background: linear-gradient(
        135deg,
        color-mix(in srgb, #8b5cf6 8%, white) 0%,
        color-mix(in srgb, #6366f1 5%, white) 100%
      );
      position: relative;
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%);
      border-radius: 12px;
      flex-shrink: 0;
      box-shadow:
        0 4px 12px color-mix(in srgb, #8b5cf6 40%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      animation: icon-pulse 2s ease-in-out infinite;
    }

    &__title {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__title-text {
      font-size: 15px;
      font-weight: 700;
      color: @neutral-800;
      letter-spacing: -0.02em;
    }

    &__subtitle {
      font-size: 12px;
      font-weight: 500;
      color: @neutral-500;
      letter-spacing: -0.01em;
    }

    &__close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: color-mix(in srgb, @neutral-900 5%, transparent);
      color: @neutral-600;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      flex-shrink: 0;

      &:hover {
        background: color-mix(in srgb, @neutral-900 10%, transparent);
        color: @neutral-800;
      }

      &:active {
        transform: scale(0.95);
      }
    }

    // ─────────────────────────────────────────
    // Content
    // ─────────────────────────────────────────
    &__content {
      padding: 20px 24px;
      max-height: 300px;
      overflow-y: auto;
      position: relative;

      // Custom scrollbar
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
        margin: 8px 0;
      }

      &::-webkit-scrollbar-thumb {
        background: linear-gradient(
          180deg,
          color-mix(in srgb, #8b5cf6 40%, transparent) 0%,
          color-mix(in srgb, #6366f1 40%, transparent) 100%
        );
        border-radius: 6px;
        transition: all 0.2s ease;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #8b5cf6 0%, #6366f1 100%);
      }
    }

    &__text {
      margin: 0;
      font-size: 14px;
      line-height: 1.7;
      color: @neutral-700;
      font-weight: 500;
      white-space: pre-wrap;
      word-break: break-word;
      letter-spacing: -0.01em;
    }

    // ─────────────────────────────────────────
    // Actions
    // ─────────────────────────────────────────
    &__actions {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      border-top: 1px solid color-mix(in srgb, #8b5cf6 10%, transparent);
      background: linear-gradient(
        to top,
        color-mix(in srgb, #8b5cf6 3%, white) 0%,
        transparent 100%
      );
    }

    &__action-btn {
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

      &--primary {
        background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%);
        box-shadow:
          0 4px 12px color-mix(in srgb, #8b5cf6 35%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);

        &:hover {
          transform: translateY(-2px);
          box-shadow:
            0 6px 20px color-mix(in srgb, #8b5cf6 50%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }
      }

      &:hover {
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    // ─────────────────────────────────────────
    // Badge
    // ─────────────────────────────────────────
    &__badge {
      position: absolute;
      top: 12px;
      right: 56px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      border-radius: 8px;
      font-size: 10px;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow:
        0 2px 8px color-mix(in srgb, #8b5cf6 40%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      z-index: 1;
    }

    &__badge-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      animation: zap-pulse 1.5s ease-in-out infinite;
    }

    // ─────────────────────────────────────────
    // Shimmer effect
    // ─────────────────────────────────────────
    &__shimmer {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        105deg,
        transparent 20%,
        rgba(255, 255, 255, 0.4) 45%,
        rgba(255, 255, 255, 0.4) 55%,
        transparent 80%
      );
      transform: rotate(30deg);
      animation: shimmer-sweep 8s ease-in-out infinite;
      pointer-events: none;
    }

    // ─────────────────────────────────────────
    // Mobile
    // ─────────────────────────────────────────
    @media (max-width: 768px) {
      left: 12px;
      right: 12px;
      bottom: 68px;
      border-radius: 16px;

      &__header {
        padding: 14px 16px;
      }

      &__icon {
        width: 36px;
        height: 36px;
        border-radius: 10px;
      }

      &__content {
        padding: 16px 18px;
        max-height: 200px;
      }

      &__text {
        font-size: 13px;
        line-height: 1.6;
      }

      &__actions {
        padding: 12px 16px;
        flex-wrap: wrap;
        gap: 8px;
      }

      &__action-btn {
        flex: 1;
        min-width: calc(50% - 4px);

        &:last-child {
          flex-basis: 100%;
        }
      }

      &__badge {
        top: 10px;
        right: 48px;
        padding: 3px 8px;
        font-size: 9px;
      }
    }
  }

  // ─────────────────────────────────────────
  // Animations
  // ─────────────────────────────────────────
  @keyframes float-subtle {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }

  @keyframes icon-pulse {
    0%,
    100% {
      box-shadow:
        0 4px 12px color-mix(in srgb, #8b5cf6 40%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    50% {
      box-shadow:
        0 6px 20px color-mix(in srgb, #8b5cf6 60%, transparent),
        0 12px 32px color-mix(in srgb, #6366f1 40%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.25);
    }
  }

  @keyframes zap-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  @keyframes shimmer-sweep {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(30deg);
    }
    100% {
      transform: translateX(100%) translateY(100%) rotate(30deg);
    }
  }

  // ─────────────────────────────────────────
  // Transition
  // ─────────────────────────────────────────
  .card-slide-enter-active {
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .card-slide-leave-active {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.6, 1);
  }

  .card-slide-enter-from {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
    filter: blur(10px);
  }

  .card-slide-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    filter: blur(5px);
  }
</style>
