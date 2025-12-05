<template>
  <div
    class="chat-message"
    :class="{
      'chat-message--mine': isMine,
      'chat-message--grouped': isGrouped,
      'chat-message--with-avatar': !isMine && !isGrouped,
    }"
    :data-message-id="message.id"
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
        <img
          v-if="avatar"
          :src="avatar"
          alt="Avatar"
          class="chat-message__avatar-img"
        />
        <BasicIconNext
          v-else
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
    avatar?: string | null
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
    gap: 10px;
    padding: 3px 0;
    animation: message-appear 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;

    &--mine {
      flex-direction: row-reverse;
    }

    &--grouped {
      padding-top: 1px;
    }

    // ─────────────────────────────────────────
    // Avatar Premium
    // ─────────────────────────────────────────
    &__avatar-wrapper {
      width: 32px;
      flex-shrink: 0;
    }

    &__avatar {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 2px 8px color-mix(in srgb, var(--primary-600) 35%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;

      &-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
      }

      // Status ring
      &::before {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: 12px;
        border: 2px solid color-mix(in srgb, var(--primary-400) 40%, transparent);
        opacity: 0;
        animation: pulse-ring 2s ease-out infinite;
      }
    }

    // ─────────────────────────────────────────
    // Content wrapper
    // ─────────────────────────────────────────
    &__content-wrapper {
      display: flex;
      flex-direction: column;
      max-width: 68%;
      min-width: 90px;
    }

    &--mine &__content-wrapper {
      align-items: flex-end;
    }

    // ─────────────────────────────────────────
    // Bubble Premium avec Glassmorphism
    // ─────────────────────────────────────────
    &__bubble {
      position: relative;
      padding: 12px 16px;
      border-radius: 20px;
      background: white;
      box-shadow:
        0 1px 3px color-mix(in srgb, @neutral-900 5%, transparent),
        0 4px 12px color-mix(in srgb, @neutral-900 6%, transparent),
        0 8px 24px color-mix(in srgb, @neutral-900 4%, transparent);
      border: 1px solid color-mix(in srgb, @neutral-200 50%, transparent);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;

      // Subtle shine effect
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50%;
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.8) 0%,
          transparent 100%
        );
        border-radius: 20px 20px 0 0;
        pointer-events: none;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow:
          0 2px 4px color-mix(in srgb, @neutral-900 6%, transparent),
          0 8px 20px color-mix(in srgb, @neutral-900 8%, transparent),
          0 16px 32px color-mix(in srgb, @neutral-900 6%, transparent);
      }
    }

    &--mine &__bubble {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      border: none;
      border-bottom-right-radius: 8px;
      box-shadow:
        0 2px 8px color-mix(in srgb, var(--primary-600) 30%, transparent),
        0 8px 24px color-mix(in srgb, var(--primary-700) 20%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);

      &::before {
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.15) 0%,
          transparent 100%
        );
      }

      &:hover {
        transform: translateY(-1px);
        box-shadow:
          0 4px 16px color-mix(in srgb, var(--primary-600) 40%, transparent),
          0 12px 32px color-mix(in srgb, var(--primary-700) 25%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }
    }

    &--mine &__bubble--read {
      background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-500) 100%);
    }

    &:not(&--mine) &__bubble {
      border-bottom-left-radius: 8px;
    }

    &--grouped:not(&--mine) &__bubble {
      border-bottom-left-radius: 20px;
      border-top-left-radius: 8px;
    }

    &--grouped&--mine &__bubble {
      border-bottom-right-radius: 20px;
      border-top-right-radius: 8px;
    }

    // ─────────────────────────────────────────
    // Text
    // ─────────────────────────────────────────
    &__text {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      color: @neutral-800;
      white-space: pre-wrap;
      word-break: break-word;
      position: relative;
      z-index: 1;
      letter-spacing: -0.01em;
    }

    &--mine &__text {
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    // ─────────────────────────────────────────
    // Meta (time + status)
    // ─────────────────────────────────────────
    &__meta {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      margin-top: 6px;
      position: relative;
      z-index: 1;
    }

    &__time {
      font-size: 11px;
      color: @neutral-400;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    &--mine &__time {
      color: rgba(255, 255, 255, 0.75);
    }

    // ─────────────────────────────────────────
    // Status checks Premium
    // ─────────────────────────────────────────
    &__status {
      display: flex;
      align-items: center;
    }

    &__check {
      width: 16px;
      height: 16px;
      color: rgba(255, 255, 255, 0.5);
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

      &--read {
        color: #4ade80;
        filter: drop-shadow(0 0 6px rgba(74, 222, 128, 0.6));
        animation: check-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
    }

    // ─────────────────────────────────────────
    // Seen indicator Premium
    // ─────────────────────────────────────────
    &__seen {
      font-size: 10px;
      color: @neutral-400;
      margin-top: 4px;
      padding-right: 4px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;

      &::before {
        content: '';
        width: 4px;
        height: 4px;
        background: @success-400;
        border-radius: 50%;
        animation: pulse-dot 2s ease-in-out infinite;
      }
    }
  }

  // ─────────────────────────────────────────
  // Animations Premium
  // ─────────────────────────────────────────
  @keyframes message-appear {
    0% {
      opacity: 0;
      transform: translateY(16px) scale(0.92);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes pulse-ring {
    0% {
      opacity: 0.6;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(1.1);
    }
  }

  @keyframes check-pop {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    50% {
      transform: scale(1.02);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes pulse-dot {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(0.8);
    }
  }

  .status-pop-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .status-pop-leave-active {
    transition: all 0.2s ease;
  }

  .status-pop-enter-from,
  .status-pop-leave-to {
    opacity: 0;
    transform: scale(0.3);
  }

  .seen-fade-enter-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
  }

  .seen-fade-leave-active {
    transition: all 0.2s ease;
  }

  .seen-fade-enter-from,
  .seen-fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }
</style>
