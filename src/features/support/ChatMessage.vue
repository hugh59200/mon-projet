<template>
  <transition
    name="bubble-pop"
    appear
  >
    <div
      class="chat-message"
      :class="{ mine: isMine }"
    >
      <!-- 💬 Bulle -->
      <div class="chat-message__bubble">
        <p class="chat-message__content">{{ message.content }}</p>
      </div>

      <!-- 🕒 Heure + coches -->
      <div class="chat-message__meta">
        <span class="chat-message__time">{{ formatDate(message.created_at) }}</span>

        <transition name="fade-scale">
          <span
            v-if="isMine"
            :key="message.is_read ? 'read' : 'pending'"
            class="checkmarks"
            :class="message.is_read ? 'read' : 'pending'"
            :title="message.is_read ? `Lu à ${formatDate(message.read_at)}` : 'Non lu'"
          >
            {{ message.is_read ? '✔✔' : '✔' }}
          </span>
        </transition>
      </div>
    </div>
  </transition>
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

  function formatDate(date?: string | null) {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }
</script>

<style scoped lang="less">
  .chat-message {
    display: flex;
    flex-direction: column;
    margin: 8px 0;
    padding: 0 8px;
    font-family: 'Inter', sans-serif;

    &:not(.mine) {
      align-items: flex-start;

      .chat-message__bubble {
        background: #fff;
        color: @neutral-900;
        border: 1px solid @neutral-200;
        border-radius: 14px 14px 14px 4px;
        margin-right: 40px;
      }
    }

    &.mine {
      align-items: flex-end;

      .chat-message__bubble {
        background: @primary-600;
        color: #fff;
        border-radius: 14px 14px 4px 14px;
        margin-left: 40px;
      }

      .chat-message__meta {
        justify-content: flex-end;
      }
    }

    .chat-message__bubble {
      padding: 8px 12px;
      max-width: 70%;
      font-size: 0.9rem;
      line-height: 1.3;
      word-break: break-word;
      box-shadow: 0 1px 2px fade(@neutral-900, 6%);
      transition:
        transform 0.2s ease,
        background 0.25s ease;

      &:hover {
        transform: translateY(-1px);
      }
    }

    .chat-message__meta {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 2px;
      padding: 0 4px;
      font-size: 0.75rem;
      color: fade(@neutral-600, 70%);
    }

    .checkmarks {
      font-weight: bold;
      &.pending {
        color: fade(@neutral-600, 60%);
      }
      &.read {
        color: lighten(@primary-600, 10%);
      }
    }

    /* ✨ Animation rebond + fade */
    .bubble-pop-enter-active {
      animation: bubblePopIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .bubble-pop-leave-active {
      animation: bubblePopOut 0.25s ease forwards;
    }

    @keyframes bubblePopIn {
      0% {
        opacity: 0;
        transform: scale(0.6) translateY(10px);
      }
      60% {
        opacity: 1;
        transform: scale(1.05) translateY(-2px);
      }
      100% {
        transform: scale(1) translateY(0);
      }
    }

    @keyframes bubblePopOut {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(0.8) translateY(8px);
      }
    }

    /* ✅ Animation coche lecture */
    .fade-scale-enter-active,
    .fade-scale-leave-active {
      transition: all 0.2s ease;
    }
    .fade-scale-enter-from,
    .fade-scale-leave-to {
      opacity: 0;
      transform: scale(0.8);
    }

    /* 📱 Responsive */
    @media (max-width: 600px) {
      .chat-message__bubble {
        max-width: 85%;
        font-size: 0.85rem;
        padding: 6px 10px;
      }
      .chat-message__meta {
        font-size: 0.7rem;
      }
    }
  }
</style>
