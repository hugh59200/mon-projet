<template>
  <div
    class="chat-message"
    :class="{ mine: isMine }"
  >
    <div class="chat-message__bubble">
      <p class="chat-message__content">{{ message.content }}</p>
    </div>

    <!-- ✅ Statut de lecture (visible uniquement côté admin) -->
    <div
      v-if="isMine && message.is_read"
      class="chat-message__status"
    >
      <span class="checkmarks">✔✔</span>
      <span class="time">{{ formatDate(message.read_at) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface ChatMessageProps {
    message: {
      id: number
      content: string
      created_at?: string | null
      is_read?: boolean | null
      read_at?: string | null
    }
    isMine: boolean
  }

  defineProps<ChatMessageProps>()

  function formatDate(date: string | null | undefined) {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
</script>

<style scoped lang="less">
  .chat-message {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 8px;

    &.mine {
      align-items: flex-end;

      .chat-message__bubble {
        background: @primary-600;
        color: white;
      }
    }

    &__bubble {
      background: @neutral-200;
      padding: 10px 14px;
      border-radius: 10px;
      max-width: 75%;
      word-break: break-word;
      font-size: 0.95rem;
    }

    &__status {
      font-size: 0.75rem;
      color: fade(@neutral-600, 80%);
      margin-top: 4px;
      text-align: right;
    }
  }

  .checkmarks {
    color: @primary-600;
    font-weight: bold;
    margin-right: 4px;
  }
</style>
