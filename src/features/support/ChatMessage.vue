<template>
  <transition
    name="slide-fade"
    appear
  >
    <div
      class="chat-message"
      :class="{ mine: isMine }"
    >
      <div class="chat-message__bubble">
        <p class="chat-message__content">{{ message.content }}</p>
      </div>

      <div
        v-if="isMine"
        class="chat-message__status"
      >
        <transition name="fade-scale">
          <span
            v-if="message.is_read"
            key="read"
            class="checkmarks read"
            :title="`Lu à ${formatDate(message.read_at)}`"
          >
            ✔✔
          </span>
          <span
            v-else
            key="pending"
            class="checkmarks pending"
          >
            ✔
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
    margin-bottom: 12px;
    padding: 0 8px;

    &.mine {
      align-items: flex-end;

      .chat-message__bubble {
        background: @primary-600;
        color: white;
        border-top-right-radius: 4px;
        margin-left: 36px;
      }
    }

    &:not(.mine) .chat-message__bubble {
      background: @neutral-100;
      border: 1px solid @neutral-200;
      color: @neutral-900;
      border-top-left-radius: 4px;
      margin-right: 36px;
    }

    .chat-message__bubble {
      padding: 0px 9px; /* 🔹 hauteur réduite (avant 6–10px) */
      border-radius: 8px; /* 🔹 coins un peu plus plats */
      max-width: 60%;
      word-break: break-word;
      font-size: 0.88rem; /* 🔹 texte légèrement plus petit */
      line-height: 1.2; /* 🔹 lignes plus serrées */
      box-shadow: 0 1px 1px fade(@neutral-800, 5%);
    }

    .chat-message__status {
      font-size: 0.7rem;
      color: fade(@neutral-600, 65%);
      margin-top: 1px;
      margin-right: 3px;
      text-align: right;
    }
  }

  /* ✨ Transitions */
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }

  /* ✅ Coches */
  .checkmarks {
    display: inline-block;
    font-weight: bold;
    &.pending {
      color: fade(@neutral-600, 50%);
    }
    &.read {
      color: @primary-500;
    }
  }
</style>
