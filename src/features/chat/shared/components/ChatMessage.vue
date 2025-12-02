<template>
  <div
    class="chat-message"
    :class="{
      'chat-message--mine': isMine,
      'chat-message--grouped': isGrouped,
      'chat-message--with-avatar': !isMine && !isGrouped,
    }"
  >
    <!-- Avatar (seulement pour les messages reçus, non groupés) -->
    <div
      v-if="!isMine"
      class="chat-message__avatar-wrapper"
    >
      <div
        v-if="!isGrouped"
        class="chat-message__avatar"
      >
        <BasicIconNext
          name="Headphones"
          :size="14"
          color="white"
        />
      </div>
    </div>

    <div class="chat-message__content-wrapper">
      <!-- Bulle du message -->
      <div
        class="chat-message__bubble"
        :class="{
          'chat-message__bubble--read': message.is_read && isMine,
        }"
      >
        <p class="chat-message__text">{{ message.content }}</p>

        <!-- Métadonnées -->
        <div class="chat-message__meta">
          <span class="chat-message__time">{{ formattedTime }}</span>

          <transition name="status-pop">
            <span
              v-if="isMine"
              class="chat-message__status"
            >
              <svg
                v-if="message.is_read"
                class="chat-message__check chat-message__check--read"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M2 12l5 5L18 6"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 12l5 5L24 6"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                v-else
                class="chat-message__check"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M5 12l5 5L20 7"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </transition>
        </div>
      </div>

      <!-- Indicateur "Vu" avec heure -->
      <transition name="seen-fade">
        <span
          v-if="isMine && message.is_read && message.read_at && !isGrouped"
          class="chat-message__seen"
        >
          Vu {{ formattedReadTime }}
        </span>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Messages } from '@/supabase/types/supabase.types'
  import { computed } from 'vue'

  const props = defineProps<{
    message: Messages
    isMine: boolean
    isGrouped?: boolean
  }>()

  const formattedTime = computed(() => {
    const date = props.message.created_at
    if (!date) return ''
    try {
      return new Date(date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ''
    }
  })

  const formattedReadTime = computed(() => {
    const date = props.message.read_at
    if (!date) return ''
    try {
      return new Date(date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ''
    }
  })
</script>

<style scoped lang="less">
  .chat-message {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding: 2px 0;
    animation: message-appear 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    &--mine {
      flex-direction: row-reverse;
    }

    &--grouped {
      padding-top: 1px;
    }

    // ─────────────────────────────────────────
    // Avatar
    // ─────────────────────────────────────────
    &__avatar-wrapper {
      width: 28px;
      flex-shrink: 0;
    }

    &__avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px color-mix(in srgb, var(--primary-600) 30%, transparent);
    }

    // ─────────────────────────────────────────
    // Content wrapper
    // ─────────────────────────────────────────
    &__content-wrapper {
      display: flex;
      flex-direction: column;
      max-width: 70%;
      min-width: 80px;
    }

    &--mine &__content-wrapper {
      align-items: flex-end;
    }

    // ─────────────────────────────────────────
    // Bubble
    // ─────────────────────────────────────────
    &__bubble {
      position: relative;
      padding: 10px 14px;
      border-radius: 18px;
      background: white;
      box-shadow:
        0 1px 2px color-mix(in srgb, @neutral-900 6%, transparent),
        0 2px 8px color-mix(in srgb, @neutral-900 4%, transparent);
      border: 1px solid color-mix(in srgb, @neutral-200 60%, transparent);
      transition: all 0.2s ease;

      &:hover {
        box-shadow:
          0 2px 4px color-mix(in srgb, @neutral-900 8%, transparent),
          0 4px 12px color-mix(in srgb, @neutral-900 6%, transparent);
      }
    }

    &--mine &__bubble {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      border: none;
      border-bottom-right-radius: 6px;
      box-shadow:
        0 2px 8px color-mix(in srgb, var(--primary-600) 25%, transparent),
        0 4px 16px color-mix(in srgb, var(--primary-700) 15%, transparent);

      &:hover {
        box-shadow:
          0 4px 12px color-mix(in srgb, var(--primary-600) 35%, transparent),
          0 6px 20px color-mix(in srgb, var(--primary-700) 20%, transparent);
        transform: translateY(-1px);
      }
    }

    &--mine &__bubble--read {
      background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-500) 100%);
    }

    &:not(&--mine) &__bubble {
      border-bottom-left-radius: 6px;
    }

    &--grouped:not(&--mine) &__bubble {
      border-bottom-left-radius: 18px;
      border-top-left-radius: 6px;
    }

    &--grouped&--mine &__bubble {
      border-bottom-right-radius: 18px;
      border-top-right-radius: 6px;
    }

    // ─────────────────────────────────────────
    // Text
    // ─────────────────────────────────────────
    &__text {
      margin: 0;
      font-size: 14px;
      line-height: 1.45;
      color: @neutral-800;
      white-space: pre-wrap;
      word-break: break-word;
    }

    &--mine &__text {
      color: white;
    }

    // ─────────────────────────────────────────
    // Meta (time + status)
    // ─────────────────────────────────────────
    &__meta {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      margin-top: 4px;
    }

    &__time {
      font-size: 11px;
      color: @neutral-400;
      font-weight: 500;
    }

    &--mine &__time {
      color: rgba(255, 255, 255, 0.7);
    }

    // ─────────────────────────────────────────
    // Status checks
    // ─────────────────────────────────────────
    &__status {
      display: flex;
      align-items: center;
    }

    &__check {
      width: 16px;
      height: 16px;
      color: rgba(255, 255, 255, 0.5);
      transition: all 0.3s ease;

      &--read {
        color: #60d394;
        filter: drop-shadow(0 0 4px rgba(96, 211, 148, 0.5));
      }
    }

    // ─────────────────────────────────────────
    // Seen indicator
    // ─────────────────────────────────────────
    &__seen {
      font-size: 10px;
      color: @neutral-400;
      margin-top: 2px;
      padding-right: 4px;
    }
  }

  // ─────────────────────────────────────────
  // Animations
  // ─────────────────────────────────────────
  @keyframes message-appear {
    0% {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .status-pop-enter-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .status-pop-leave-active {
    transition: all 0.2s ease;
  }

  .status-pop-enter-from,
  .status-pop-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }

  .seen-fade-enter-active {
    transition: all 0.3s ease 0.2s;
  }

  .seen-fade-leave-active {
    transition: all 0.2s ease;
  }

  .seen-fade-enter-from,
  .seen-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
</style>
