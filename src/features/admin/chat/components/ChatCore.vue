<template>
  <div
    class="chat-core"
    :style="computedStyle"
    role="region"
    aria-label="Zone de conversation"
  >
    <!-- 🔌 Offline banner -->
    <transition name="fade-scale">
      <div
        v-if="!isOnline"
        class="chat-offline-banner"
      >
        Vous êtes hors ligne — vos messages seront envoyés dès que possible.
      </div>
    </transition>

    <!-- 🔄 Loader -->
    <transition
      name="fade-scale"
      mode="out-in"
    >
      <div
        v-if="loading"
        key="loader"
        class="chat-loader"
        role="status"
        aria-live="polite"
      >
        <BasicLoader />
        <span>Chargement des messages...</span>
      </div>

      <!-- 💬 Zone des messages -->
      <div
        v-else
        class="chat-content"
      >
        <div
          ref="msgList"
          class="chat-messages"
          aria-live="polite"
          @scroll="onScroll"
          @click="hideNewMessagesBtn"
        >
          <ChatMessage
            v-for="(msg, i) in messages"
            :key="msg.id || 'msg-' + i"
            :message="msg"
            :isMine="msg.sender_role === currentRole"
            :isGrouped="isGroupedMessage(i)"
          />
        </div>
        <ChatTypingIndicator :isTyping="localIsTyping" />
      </div>
    </transition>

    <!-- 🔔 Bouton "nouveaux messages" -->
    <transition name="slide-fade">
      <button
        v-if="showNewMessagesBtn"
        class="new-messages-btn"
        @click="scrollToBottomSmooth"
      >
        Nouveaux messages
      </button>
    </transition>

    <ChatInput
      v-model="newMessage"
      :isOnline="isOnline"
      @send="sendMessage"
      @typing="sendTyping"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import type { ChatRole, Message } from '../types/chat'
  import ChatInput from './ChatInput.vue'
  import ChatMessage from './ChatMessage.vue'
  import ChatTypingIndicator from './ChatTypingIndicator.vue'

  /* ---------------------- Props ---------------------- */
  const props = defineProps<{
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
  }>()

  const newMessage = defineModel<string>('newMessage', { default: '' })

  /* ---------------------- Typing ---------------------- */
  const localIsTyping = ref(false)
  let typingTimeout: ReturnType<typeof setTimeout> | null = null
  watch(
    () => props.isTyping,
    (val) => {
      if (val) {
        localIsTyping.value = true
        clearTimeout(typingTimeout!)
      } else {
        typingTimeout = setTimeout(() => (localIsTyping.value = false), 600)
      }
    },
  )

  /* ---------------------- Online / Offline ---------------------- */
  const isOnline = ref(true)
  const handleOnlineChange = () => (isOnline.value = navigator.onLine)
  onMounted(() => {
    isOnline.value = navigator.onLine
    window.addEventListener('online', handleOnlineChange)
    window.addEventListener('offline', handleOnlineChange)
  })
  onUnmounted(() => {
    window.removeEventListener('online', handleOnlineChange)
    window.removeEventListener('offline', handleOnlineChange)
  })

  /* ---------------------- Style dynamique ---------------------- */
  const computedStyle = computed(() => {
    const style: Record<string, string> = {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'white',
      position: 'relative',
    }

    if (props.height)
      style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    else style.flex = '1'

    if (props.maxHeight)
      style.maxHeight =
        typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
    if (props.minHeight)
      style.minHeight =
        typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight

    return style
  })

  /* ---------------------- Scroll & "nouveaux messages" ---------------------- */
  const msgList = ref<HTMLElement | null>(null)
  const showNewMessagesBtn = ref(false)
  const isNearBottom = ref(true)
  let autoHideTimer: ReturnType<typeof setTimeout> | null = null

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    const el = msgList.value
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
    showNewMessagesBtn.value = false
    isNearBottom.value = true
    clearTimeout(autoHideTimer!)
  }

  /* ✅ Version sans paramètre pour éviter l’erreur TS */
  const scrollToBottomSmooth = () => scrollToBottom('smooth')

  const hideNewMessagesBtn = () => {
    if (showNewMessagesBtn.value) {
      showNewMessagesBtn.value = false
      clearTimeout(autoHideTimer!)
    }
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

  /* ---------------------- Auto scroll sur nouveaux messages ---------------------- */
  watch(
    () => props.messages.length,
    async (newLen, oldLen) => {
      if (newLen <= oldLen) return
      await nextTick()

      const el = msgList.value
      if (!el) return

      const near = el.scrollHeight - el.scrollTop - el.clientHeight < 20
      const lastMsg = props.messages.at(-1)
      const isMine = lastMsg?.sender_role === props.currentRole

      if (isMine || near) {
        scrollToBottom('smooth')
      } else {
        showNewMessagesBtn.value = true
        clearTimeout(autoHideTimer!)
        autoHideTimer = setTimeout(() => {
          if (showNewMessagesBtn.value) showNewMessagesBtn.value = false
        }, 2500)
      }
    },
  )

  /* ---------------------- Groupement ---------------------- */
  const isGroupedMessage = (index: number) => {
    const msg = props.messages[index]
    const prev = props.messages[index - 1]
    return prev && prev.sender_role === msg?.sender_role
  }

  /* ---------------------- Lifecycle ---------------------- */
  onMounted(() => {
    nextTick(() => scrollToBottom('auto'))
  })
  onUnmounted(() => {
    clearTimeout(autoHideTimer!)
    clearTimeout(typingTimeout!)
  })
</script>

<style scoped lang="less">
  .chat-core {
    border-top: 1px solid @neutral-200;
    background: white;
    display: flex;
    flex-direction: column;

    .chat-offline-banner {
      background: fade(@danger-600, 10%);
      color: @danger-700;
      text-align: center;
      padding: 6px;
      font-size: 13px;
      border-bottom: 1px solid fade(@danger-600, 15%);
    }

    .chat-loader {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: @neutral-600;
      font-size: 15px;
      min-height: 600px;
    }

    .chat-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      position: relative;
      min-height: 0;
    }

    /* zone scrollable */
    .chat-messages {
      flex: 1;
      display: flex;
      flex-direction: column; /* ✅ ordre naturel */
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px;
      background: @neutral-50;
      scroll-behavior: smooth;
      min-height: 0;
      gap: 6px;
      padding-bottom: 20px; /* espace pour typing */
    }

    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }
    .chat-messages::-webkit-scrollbar-thumb {
      background: fade(@neutral-500, 40%);
      border-radius: 4px;
    }
    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: fade(@neutral-600, 60%);
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
      transition: background 0.2s ease;
      &:hover {
        background: @primary-700;
      }
    }

    @media (max-width: 768px) {
      height: auto;
      min-height: 50vh;
    }

    /* Animations */
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
