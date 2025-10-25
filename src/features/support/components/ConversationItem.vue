<template>
  <div
    class="conversation-item"
    :class="{ active }"
    @click="$emit('select', conversation.user_id)"
  >
    <div class="conversation-avatar">
      <BasicIconNext name="User" />
    </div>

    <div class="conversation-content">
      <div class="conversation-header">
        <span class="email">{{ conversation.user_email || 'Utilisateur anonyme' }}</span>
      </div>

      <div class="conversation-footer">
        <small class="preview">{{ conversation.last_message || 'Aucun message' }}</small>

        <div class="right-info">
          <span
            v-if="conversation.last_message_at"
            class="time"
          >
            {{ formattedTime }}
          </span>

          <div
            v-if="conversation.unread_count"
            class="badge"
          >
            {{ conversation.unread_count }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ConversationOverview } from '@/features/support/types/chat'
  import { computed } from 'vue'

  const props = defineProps<{
    conversation: ConversationOverview
    active?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'select', userId: string): void
  }>()

  const formattedTime = computed(() => {
    const date = props.conversation.last_message_at
    if (!date) return ''
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  })
</script>

<style scoped lang="less">
  .conversation-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px 14px; // 🔥 +4px de vertical pour aérer
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s ease;
    border: 1px solid transparent;
    background: transparent;
    position: relative;

    /* 🌫 Séparateur plus espacé et plus léger */
    &::after {
      content: '';
      position: absolute;
      bottom: -3px; // plus d’air entre éléments
      left: 52px;
      right: 10px;
      height: 1px;
      background: fade(@neutral-300, 30%);
      transition: opacity 0.25s ease;
    }

    &:last-child::after {
      display: none;
    }

    &:hover {
      background: fade(@primary-600, 7%);
      border-color: fade(@primary-600, 12%);
      box-shadow: 0 2px 6px fade(@primary-600, 8%);
      transform: translateY(-1px);

      &::after {
        opacity: 0;
      }
    }

    &.active {
      background: fade(@primary-600, 16%);
      border-left: 4px solid @primary-600;
      border-color: fade(@primary-600, 25%);
      box-shadow:
        inset 3px 0 0 fade(@primary-600, 18%),
        0 1px 6px fade(@primary-600, 10%);
      transform: translateY(0);

      &::after {
        opacity: 0;
      }
    }

    .conversation-avatar {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: white;
      border: 1px solid @neutral-200;
      display: flex;
      align-items: center;
      justify-content: center;
      color: @primary-600;
      transition: all 0.2s ease;

      .conversation-item:hover & {
        border-color: fade(@primary-600, 30%);
        color: @primary-700;
      }
    }

    .conversation-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 5px; // un peu plus d’espace entre email et message
      overflow: hidden;

      .conversation-header {
        font-size: 14px;
        font-weight: 600;
        color: @neutral-900;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: color 0.2s ease;

        .conversation-item:hover & {
          color: @primary-700;
        }
      }

      .conversation-footer {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 8px;

        .preview {
          flex: 1;
          font-size: 13px;
          color: @neutral-600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.2s ease;

          .conversation-item:hover & {
            color: @neutral-700;
          }
        }

        .right-info {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;

          .time {
            font-size: 12px;
            color: @neutral-500;
            white-space: nowrap;
          }

          .badge {
            background: @primary-600;
            color: white;
            font-size: 12px;
            font-weight: 600;
            border-radius: 999px;
            min-width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 6px;
            box-shadow: 0 1px 3px fade(@primary-600, 30%);
          }
        }
      }
    }
  }
</style>
