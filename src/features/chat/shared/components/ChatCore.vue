<template>
  <div
    class="chat-core"
    :style="computedStyle"
    role="region"
    aria-label="Zone de conversation"
  >
    <transition name="fade-scale">
      <div
        v-if="!isOnline"
        class="chat-offline-banner"
      >
        Vous êtes hors ligne — vos messages seront envoyés dès que possible.
      </div>
    </transition>

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
            v-for="(msg, i) in orderedMessages"
            :key="msg.id || 'msg-' + i"
            :message="msg"
            :isMine="msg.sender_role === currentRole"
            :isGrouped="isGroupedMessage(i)"
          />
        </div>

        <ChatTypingIndicator :isTyping="localIsTyping" />
      </div>
    </transition>

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
  import type { Messages } from '@/supabase/types/supabase.types'
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import type { ChatRole } from '../types/chat'
  import ChatInput from './ChatInput.vue'
  import ChatMessage from './ChatMessage.vue'
  import ChatTypingIndicator from './ChatTypingIndicator.vue'

  const props = defineProps<{
    messages: Messages[]
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

  const orderedMessages = computed(() =>
    [...props.messages].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
      return dateA - dateB
    }),
  )

  const localIsTyping = ref(false)
  let typingTimeout: ReturnType<typeof setTimeout> | null = null

  watch(
    () => props.isTyping,
    (val) => {
      console.log('[typing] ChatCore props.isTyping =>', val)
      if (val) {
        localIsTyping.value = true
        clearTimeout(typingTimeout!)
      } else {
        typingTimeout = setTimeout(() => {
          localIsTyping.value = false
          console.log('[typing] ChatCore localIsTyping=false (timeout)')
        }, 600)
      }
    },
    { immediate: true },
  )

  const isOnline = ref(true)
  const handleOnlineChange = () => (isOnline.value = navigator.onLine)

  onMounted(() => {
    isOnline.value = navigator.onLine
    window.addEventListener('online', handleOnlineChange)
    window.addEventListener('offline', handleOnlineChange)
    console.log('[typing] ChatCore mounted; role=', props.currentRole)
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnlineChange)
    window.removeEventListener('offline', handleOnlineChange)
  })

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

  const msgList = ref<HTMLElement | null>(null)
  const showNewMessagesBtn = ref(false)
  const isNearBottom = ref(true)
  let autoHideTimer: ReturnType<typeof setTimeout> | null = null

  function scrollToBottom(behavior: ScrollBehavior = 'auto') {
    const el = msgList.value
    if (!el) return
    el.scrollTop = el.scrollHeight
    if (behavior === 'smooth') {
      el.scrollTo({ top: el.scrollHeight, behavior })
    }
    showNewMessagesBtn.value = false
    isNearBottom.value = true
    clearTimeout(autoHideTimer!)
  }

  function scrollToBottomSmooth() {
    scrollToBottom('smooth')
  }

  function hideNewMessagesBtn() {
    if (showNewMessagesBtn.value) {
      showNewMessagesBtn.value = false
      clearTimeout(autoHideTimer!)
    }
  }

  function onScroll() {
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

  function scrollHardToBottom() {
    const el = msgList.value
    if (!el) return

    const force = () => {
      el.scrollTop = el.scrollHeight
    }

    for (let i = 0; i < 8; i++) {
      requestAnimationFrame(force)
      setTimeout(force, i * 30)
    }
  }

  onMounted(async () => {
    await nextTick()
    scrollHardToBottom()
  })

  watch(
    () => props.messages.map((m) => m.id),
    async () => {
      await nextTick()
      scrollHardToBottom()
    },
    { immediate: true },
  )

  onUnmounted(() => {
    clearTimeout(autoHideTimer!)
    clearTimeout(typingTimeout!)
  })

  function isGroupedMessage(index: number) {
    const msg = orderedMessages.value[index]
    const prev = orderedMessages.value[index - 1]
    return prev && prev.sender_role === msg?.sender_role
  }
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

    .chat-messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px;
      background: @neutral-50;
      scroll-behavior: auto; /* aucun smooth visible */
      min-height: 0;
      gap: 6px;
      padding-bottom: 20px;
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
  }
</style>
