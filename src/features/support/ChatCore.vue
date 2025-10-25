<template>
  <div
    class="chat-core"
    :style="computedStyle"
  >
    <!-- 🔄 Loader -->
    <transition
      name="fade-scale"
      mode="out-in"
    >
      <div
        v-if="loading"
        key="loader"
        class="chat-loader"
      >
        <BasicLoader />
        <span>Chargement des messages...</span>
      </div>

      <!-- 💬 Zone des messages -->
      <div
        v-else
        key="messages"
        ref="msgList"
        class="chat-messages"
        @scroll="onScroll"
        @click="hideNewMessagesBtn"
      >
        <!-- ✍️ Indicateur "en train d’écrire" -->
        <transition name="typing-fade">
          <div
            v-if="isTyping"
            class="typing-bubble-wrapper"
          >
            <div class="typing-bubble">
              <span class="dot" />
              <span class="dot" />
              <span class="dot" />
            </div>
          </div>
        </transition>

        <ChatMessage
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
          :isMine="msg.sender_role === currentRole"
        />
      </div>
    </transition>

    <!-- 🔔 Bouton "nouveaux messages" -->
    <transition name="slide-fade">
      <button
        v-if="showNewMessagesBtn"
        class="new-messages-btn"
        @click="scrollToBottom"
      >
        Nouveaux messages
      </button>
    </transition>

    <!-- 🧩 Zone d’envoi -->
    <form
      v-if="showInput"
      class="chat-input"
      @submit.prevent="sendMessage"
    >
      <input
        v-model="newMessage"
        type="text"
        placeholder="Écrire un message..."
        @input="sendTyping"
        required
      />
      <BasicButton
        label="Envoyer"
        type="primary"
        size="small"
        :disabled="!newMessage.trim()"
        @click="sendMessage"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
  import ChatMessage from './ChatMessage.vue'
  import type { ChatRole, Message } from './types/chat'

  /* 🧩 Props avec showInput par défaut à true */
  const props = withDefaults(
    defineProps<{
      messages: Message[]
      isTyping: boolean
      loading?: boolean
      currentRole: ChatRole
      sendMessage: () => void
      sendTyping: () => void
      showInput?: boolean
      height?: string | number
      maxHeight?: string | number
      minHeight?: string | number
    }>(),
    {
      showInput: true, // ✅ par défaut visible
    },
  )

  /* 💬 v-model pour le champ d’entrée */
  const newMessage = defineModel<string>('newMessage', { default: '' })

  /* 🎨 Style calculé dynamiquement */
  const computedStyle = computed(() => {
    const style: Record<string, string> = {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'white',
    }

    if (props.height)
      style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    else style.flex = '1' // ✅ par défaut on garde flex:1

    if (props.maxHeight)
      style.maxHeight =
        typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
    if (props.minHeight)
      style.minHeight =
        typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight

    return style
  })

  /* ⚙️ Scroll automatique et bouton "nouveaux messages" */
  const msgList = ref<HTMLElement | null>(null)
  const showNewMessagesBtn = ref(false)
  const isNearBottom = ref(true)
  let autoHideTimer: ReturnType<typeof setTimeout> | null = null

  const scrollToBottom = () => {
    const el = msgList.value
    if (!el) return
    el.scrollTop = el.scrollHeight
    showNewMessagesBtn.value = false
    isNearBottom.value = true
    clearTimeout(autoHideTimer!)
  }

  const onScroll = () => {
    const el = msgList.value
    if (!el) return
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 20
    isNearBottom.value = near
    if (near) {
      setTimeout(() => {
        if (isNearBottom.value) showNewMessagesBtn.value = false
      }, 300)
    }
  }

  const hideNewMessagesBtn = () => {
    if (showNewMessagesBtn.value) {
      showNewMessagesBtn.value = false
      clearTimeout(autoHideTimer!)
    }
  }

  watch(
    () => props.messages.length,
    async (newLen, oldLen) => {
      if (newLen <= oldLen) return
      await nextTick()
      const el = msgList.value
      if (!el) return
      const near = el.scrollHeight - el.scrollTop - el.clientHeight < 20
      const lastMsg = props.messages[0]
      const isMine = lastMsg?.sender_role === props.currentRole
      if (isMine || near) scrollToBottom()
      else {
        showNewMessagesBtn.value = true
        clearTimeout(autoHideTimer!)
        autoHideTimer = setTimeout(() => {
          if (showNewMessagesBtn.value) showNewMessagesBtn.value = false
        }, 2000)
      }
    },
  )

  onUnmounted(() => {
    clearTimeout(autoHideTimer!)
  })
</script>

<style scoped lang="less">
  .chat-core {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-top: 1px solid @neutral-200;
    background: white;
    position: relative; // ✅ pour bouton flottant

    .chat-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 24px;
      color: @neutral-600;
    }

    /* 💬 Messages */
    .chat-messages {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column-reverse;
      overflow-y: auto;
      padding: 12px;
      background: @neutral-50;
      scroll-behavior: smooth;
      min-height: 0;
    }

    /* 🧩 Zone d’entrée */
    .chat-input {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      border-top: 1px solid @neutral-200;
      padding: 10px 12px;
      background: white;

      input {
        flex: 1;
        border: 1px solid @neutral-200;
        border-radius: 8px;
        padding: 8px 12px;
        background: @neutral-50;
        &:focus {
          border-color: @primary-500;
          background: white;
        }
      }
    }

    .new-messages-btn {
      position: absolute;
      bottom: 70px;
      left: 50%;
      transform: translateX(-50%);
      background: @primary-600;
      color: white;
      border: none;
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 2px 8px fade(black, 15%);
      &:hover {
        background: @primary-700;
      }
    }

    .typing-bubble-wrapper {
      display: flex;
      align-items: center;
      padding: 0 12px 8px;
    }

    .typing-bubble {
      display: inline-flex;
      align-items: center;
      justify-content: space-around;
      background: @neutral-200;
      border-radius: 16px;
      padding: 6px 10px;
      width: 48px;

      .dot {
        width: 6px;
        height: 6px;
        background: fade(@neutral-600, 70%);
        border-radius: 50%;
        animation: typingDots 1.3s infinite ease-in-out;
      }

      .dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .dot:nth-child(3) {
        animation-delay: 0.4s;
      }
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

    .fade-scale-enter-active,
    .fade-scale-leave-active {
      transition: all 0.35s ease;
    }
    .fade-scale-enter-from {
      opacity: 0;
      transform: scale(0.97) translateY(8px);
    }
    .fade-scale-leave-to {
      opacity: 0;
      transform: scale(0.98) translateY(-8px);
    }

    .slide-fade-enter-active,
    .slide-fade-leave-active {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .slide-fade-enter-from {
      opacity: 0;
      transform: translateY(12px) scale(0.98);
    }
    .slide-fade-leave-to {
      opacity: 0;
      transform: translateY(8px) scale(0.98);
    }
  }
</style>
