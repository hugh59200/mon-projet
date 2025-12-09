<template>
  <div
    class="conversation-item"
    :class="{
      'conversation-item--active': active,
      'conversation-item--new': isNew,
    }"
    @click="conversation.user_id && $emit('select', conversation.user_id)"
  >
    <div class="conversation-item__avatar">
      <BasicIconNext name="User" />
    </div>

    <div class="conversation-item__content">
      <div class="conversation-item__header">
        <span class="conversation-item__email">
          {{ conversation.user_email || 'Utilisateur anonyme' }}
        </span>
      </div>

      <div class="conversation-item__footer">
        <div class="conversation-item__preview-wrapper">
          <small
            v-show="!isTyping"
            class="conversation-item__preview"
          >
            {{ conversation.last_message || 'Aucun message' }}
          </small>

          <div
            v-show="isTyping"
            class="conversation-item__typing-indicator"
          >
            <span class="conversation-item__dot" />
            <span class="conversation-item__dot" />
            <span class="conversation-item__dot" />
          </div>
        </div>

        <div class="conversation-item__meta">
          <span
            v-if="conversation.last_message_at && !isTyping"
            class="conversation-item__time"
          >
            {{ formattedTime }}
          </span>

          <div
            v-if="unread"
            class="conversation-item__badge"
          >
            {{ unread }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ConversationOverview } from '@/supabase/types/supabase.types'
  import { computed } from 'vue'

  const props = defineProps<{
    conversation: ConversationOverview
    unread?: number
    active?: boolean
    isTypingByUser?: Record<string, boolean>
  }>()
  defineEmits<{ (e: 'select', userId: string): void }>()

  const isTyping = computed(() => {
    const userId = props.conversation.user_id
    return userId ? !!props.isTypingByUser?.[userId] : false
  })

  const isNew = computed(() => {
    return (props.conversation.unread_count_admin ?? 0) > 0
  })

  const formattedTime = computed(() => {
    const date = props.conversation.last_message_at
    return date
      ? new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      : ''
  })
</script>

<style scoped lang="less">
  @keyframes flash {
    0% {
      background: rgba(var(--primary-600-rgb), 0.35);
    }
    50% {
      background: rgba(var(--primary-600-rgb), 0.1);
    }
    100% {
      background: transparent;
    }
  }
  .conversation-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px 14px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s ease;
    border: 1px solid transparent;
    background: transparent;
    position: relative;

    /* 🌫 Séparateur */
    &::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 52px;
      right: 10px;
      height: 1px;
      background: var(--admin-border-subtle);
      opacity: 0.5;
      transition: opacity 0.25s ease;
    }

    &--new {
      animation: flash 0.8s ease-out;
      border-color: var(--primary-600);
      box-shadow: 0 0 6px rgba(var(--primary-600-rgb), 0.4);
    }

    &:last-child::after {
      display: none;
    }

    &:hover {
      background: rgba(var(--primary-600-rgb), 0.07);
      border-color: rgba(var(--primary-600-rgb), 0.12);
      box-shadow: 0 2px 6px rgba(var(--primary-600-rgb), 0.08);
      transform: translateY(-1px);

      &::after {
        opacity: 0;
      }
    }

    &--active {
      background: rgba(var(--primary-600-rgb), 0.16);
      border-left: 4px solid var(--primary-600);
      border-color: rgba(var(--primary-600-rgb), 0.25);
      box-shadow:
        inset 3px 0 0 rgba(var(--primary-600-rgb), 0.18),
        0 1px 6px rgba(var(--primary-600-rgb), 0.1);
      transform: translateY(0);

      &::after {
        opacity: 0;
      }
    }

    &__avatar {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-600);
      transition: all 0.2s ease;

      .conversation-item:hover & {
        border-color: rgba(var(--primary-600-rgb), 0.3);
        color: var(--primary-700);
      }
    }

    &__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 5px;
      overflow: hidden;
    }

    &__header {
      font-size: 14px;
      font-weight: 600;
      color: var(--admin-text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color 0.2s ease;

      .conversation-item:hover & {
        color: var(--primary-700);
      }
    }

    &__footer {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 8px;
    }

    &__preview-wrapper {
      flex: 1;
      position: relative;
      min-height: 18px;
      display: flex;
      align-items: center;
    }

    &__preview,
    &__typing-indicator {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      transition: opacity 0.25s ease;
    }

    &__preview {
      font-size: 13px;
      color: var(--admin-text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__typing-indicator {
      gap: 4px;
      height: 18px;
    }

    &__dot {
      width: 5px;
      height: 5px;
      background: var(--admin-text-muted);
      border-radius: 50%;
      animation: typingDots 1.3s infinite ease-in-out;

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }

    &__meta {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    &__time {
      font-size: 12px;
      color: var(--admin-text-muted);
      white-space: nowrap;
    }

    &__badge {
      background: var(--primary-600);
      color: var(--admin-text-inverse);
      font-size: 12px;
      font-weight: 600;
      border-radius: 999px;
      min-width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
      box-shadow: 0 1px 3px rgba(var(--primary-600-rgb), 0.3);
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
  }
</style>
