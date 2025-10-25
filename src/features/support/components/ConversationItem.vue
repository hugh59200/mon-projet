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
        <span
          v-if="conversation.last_message_at"
          class="time"
        >
          {{ formattedTime }}
        </span>
      </div>

      <div class="conversation-footer">
        <small class="preview">{{ conversation.last_message || 'Aucun message' }}</small>

        <div
          v-if="conversation.unread_count"
          class="badge"
        >
          {{ conversation.unread_count }}
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
    padding: 10px 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.25s ease;
    border: 1px solid transparent;

    &:hover {
      background: fade(@primary-600, 8%);
      border-color: fade(@primary-600, 15%);
    }

    &.active {
      background: fade(@primary-600, 15%);
      border-left: 4px solid @primary-600;
      border-color: fade(@primary-600, 25%);
      box-shadow: inset 3px 0 0 fade(@primary-600, 20%);
    }

    .conversation-avatar {
      flex-shrink: 0;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: white;
      border: 1px solid @neutral-200;
      display: flex;
      align-items: center;
      justify-content: center;
      color: @primary-600;
    }

    .conversation-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .conversation-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        font-weight: 600;
        color: @neutral-900;

        .time {
          font-size: 12px;
          color: @neutral-500;
        }

        .email {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .conversation-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .preview {
          flex: 1;
          font-size: 13px;
          color: @neutral-600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 8px;
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
        }
      }
    }
  }
</style>
