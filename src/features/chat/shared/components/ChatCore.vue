<template>
  <div
    class="chat-core"
    :style="computedStyle"
    role="region"
    aria-label="Zone de conversation"
  >
    <!-- Bannière hors ligne -->
    <Transition name="banner-slide">
      <div
        v-if="!isOnline"
        class="chat-core__offline-banner"
      >
        <div class="chat-core__offline-icon">
          <BasicIconNext
            name="WifiOff"
            :size="14"
            color="currentColor"
          />
        </div>
        <span>Vous êtes hors ligne — vos messages seront envoyés dès que possible.</span>
      </div>
    </Transition>

    <!-- Contenu principal -->
    <Transition
      name="content-fade"
      mode="out-in"
    >
      <!-- Loader -->
      <div
        v-if="loading"
        key="loader"
        class="chat-core__loader"
        role="status"
        aria-live="polite"
      >
        <div class="chat-core__loader-animation">
          <span class="chat-core__loader-dot" />
          <span class="chat-core__loader-dot" />
          <span class="chat-core__loader-dot" />
        </div>
        <span class="chat-core__loader-text">Chargement des messages...</span>
      </div>

      <!-- Messages -->
      <div
        v-else
        key="content"
        class="chat-core__content"
      >
        <!-- Zone des messages -->
        <div
          ref="scrollRef"
          class="chat-core__messages"
          aria-live="polite"
        >
          <!-- Message vide -->
          <Transition name="empty-fade">
            <div
              v-if="!orderedMessages.length"
              class="chat-core__empty"
            >
              <div class="chat-core__empty-icon">
                <BasicIconNext
                  name="MessageCircle"
                  :size="32"
                  color="currentColor"
                />
              </div>
              <p class="chat-core__empty-title">Aucun message</p>
              <p class="chat-core__empty-text">Envoyez un message pour démarrer la conversation</p>
            </div>
          </Transition>

          <!-- Liste des messages -->
          <ChatMessage
            v-for="(msg, i) in orderedMessages"
            :key="msg.id || 'msg-' + i"
            :message="msg"
            :isMine="msg.sender_role === currentRole"
            :isGrouped="isGroupedMessage(i)"
          />
        </div>

        <!-- Indicateur de frappe -->
        <ChatTypingIndicator :isTyping="localIsTyping" />
      </div>
    </Transition>

    <!-- Bouton nouveaux messages -->
    <Transition name="btn-bounce">
      <button
        v-if="showNewMessagesIndicator"
        class="chat-core__new-messages-btn"
        @click="hideNewMessagesIndicator"
      >
        <BasicIconNext
          name="ChevronDown"
          :size="14"
          color="white"
        />
        <span>Nouveaux messages</span>
      </button>
    </Transition>

    <!-- Input -->
    <ChatInput
      v-model="newMessage"
      :isOnline="isOnline"
      :showAiButton="showAiButton"
      :aiLoading="aiLoading"
      :aiError="aiError"
      @send="sendMessage"
      @typing="sendTyping"
      @request-ai-suggestion="$emit('request-ai-suggestion')"
      @clear-ai-error="$emit('clear-ai-error')"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Messages } from '@/supabase/types/supabase.types'
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import type { ChatRole } from '../types/chat'
  import { useScrollMessages } from '../composables/useScrollMessages'
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
    showAiButton?: boolean
    aiLoading?: boolean
    aiError?: string | null
    /** ID de la conversation pour la persistance du scroll */
    conversationId?: string | null
  }>()

  defineEmits<{
    (e: 'request-ai-suggestion'): void
    (e: 'clear-ai-error'): void
  }>()

  const newMessage = defineModel<string>('newMessage', { default: '' })

  // ─────────────────────────────────────────
  // Scroll management (composable)
  // ─────────────────────────────────────────
  const {
    scrollRef,
    showNewMessagesIndicator,
    initScrollObserver,
    hideNewMessagesIndicator,
    cleanup: cleanupScroll,
    saveScrollPosition,
    restoreScrollPosition,
    scrollToEnd,
  } = useScrollMessages({ threshold: 100 })

  // Référence pour tracker la conversation précédente
  let previousConversationId: string | null = null

  // Watcher pour sauvegarder/restaurer la position de scroll lors du changement de conversation
  watch(
    () => props.conversationId,
    async (newId, oldId) => {
      // Sauvegarder la position de l'ancienne conversation
      if (oldId) {
        saveScrollPosition(oldId)
      }

      // Attendre que les nouveaux messages soient rendus
      if (newId && !props.loading) {
        // Petite attente pour que le DOM soit mis à jour
        await new Promise((resolve) => setTimeout(resolve, 50))

        // Essayer de restaurer la position sauvegardée
        const restored = await restoreScrollPosition(newId)

        // Si pas de position sauvegardée, scroller vers le bas
        if (!restored) {
          await scrollToEnd(true)
        }
      }

      previousConversationId = newId ?? null
    },
  )

  // Sauvegarder aussi quand le loading passe à true (changement de conversation)
  watch(
    () => props.loading,
    (loading) => {
      if (loading && previousConversationId) {
        saveScrollPosition(previousConversationId)
      }
    },
  )

  // ─────────────────────────────────────────
  // Messages ordonnés
  // ─────────────────────────────────────────
  const orderedMessages = computed(() =>
    [...props.messages].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
      return dateA - dateB
    }),
  )

  // ─────────────────────────────────────────
  // Typing indicator avec debounce
  // ─────────────────────────────────────────
  const localIsTyping = ref(false)
  let typingTimeout: ReturnType<typeof setTimeout> | null = null

  watch(
    () => props.isTyping,
    (val) => {
      if (val) {
        localIsTyping.value = true
        if (typingTimeout) clearTimeout(typingTimeout)
      } else {
        typingTimeout = setTimeout(() => {
          localIsTyping.value = false
        }, 600)
      }
    },
    { immediate: true },
  )

  // ─────────────────────────────────────────
  // Online status
  // ─────────────────────────────────────────
  const isOnline = ref(true)
  const handleOnlineChange = () => (isOnline.value = navigator.onLine)

  // ─────────────────────────────────────────
  // Computed style
  // ─────────────────────────────────────────
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

  // ─────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────
  onMounted(() => {
    isOnline.value = navigator.onLine
    window.addEventListener('online', handleOnlineChange)
    window.addEventListener('offline', handleOnlineChange)

    // Initialiser les observers de scroll après le montage
    // Le ResizeObserver gère automatiquement le scroll sur nouveaux messages
    initScrollObserver()
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnlineChange)
    window.removeEventListener('offline', handleOnlineChange)
    if (typingTimeout) clearTimeout(typingTimeout)
    cleanupScroll()
  })

  // ─────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────
  function isGroupedMessage(index: number) {
    const msg = orderedMessages.value[index]
    const prev = orderedMessages.value[index - 1]
    return prev && prev.sender_role === msg?.sender_role
  }
</script>
<style scoped lang="less">
  .chat-core {
    background: linear-gradient(180deg, @neutral-50 0%, white 100%);
    display: flex;
    flex-direction: column;
    border-radius: 0 0 12px 12px;

    // ─────────────────────────────────────────
    // Bannière hors ligne
    // ─────────────────────────────────────────
    &__offline-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: linear-gradient(
        135deg,
        color-mix(in srgb, @warning-500 12%, transparent) 0%,
        color-mix(in srgb, @warning-400 8%, transparent) 100%
      );
      color: @warning-800;
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 500;
      border-bottom: 1px solid color-mix(in srgb, @warning-500 20%, transparent);
    }

    &__offline-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: color-mix(in srgb, @warning-500 20%, transparent);
      border-radius: 50%;
      flex-shrink: 0;
    }

    // ─────────────────────────────────────────
    // Loader
    // ─────────────────────────────────────────
    &__loader {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      min-height: 400px;
    }

    &__loader-animation {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    &__loader-dot {
      width: 10px;
      height: 10px;
      background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-600) 100%);
      border-radius: 50%;
      animation: loader-bounce 1.4s ease-in-out infinite;

      &:nth-child(1) {
        animation-delay: 0s;
      }

      &:nth-child(2) {
        animation-delay: 0.16s;
      }

      &:nth-child(3) {
        animation-delay: 0.32s;
      }
    }

    &__loader-text {
      font-size: 14px;
      color: @neutral-500;
      font-weight: 500;
    }

    // ─────────────────────────────────────────
    // Contenu
    // ─────────────────────────────────────────
    &__content {
      display: flex;
      flex-direction: column;
      flex: 1;
      position: relative;
      min-height: 0;
    }

    // ─────────────────────────────────────────
    // Zone des messages
    // ─────────────────────────────────────────
    &__messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 16px;
      background: linear-gradient(180deg, @neutral-100 0%, @neutral-50 50%, white 100%);
      scroll-behavior: auto;
      min-height: 0;
      gap: 4px;
      padding-bottom: 24px;
    }

    &__messages::-webkit-scrollbar {
      width: 6px;
    }

    &__messages::-webkit-scrollbar-track {
      background: transparent;
    }

    &__messages::-webkit-scrollbar-thumb {
      background: color-mix(in srgb, @neutral-400 50%, transparent);
      border-radius: 6px;
      transition: background 0.2s ease;
    }

    &__messages::-webkit-scrollbar-thumb:hover {
      background: color-mix(in srgb, @neutral-500 70%, transparent);
    }

    // ─────────────────────────────────────────
    // État vide
    // ─────────────────────────────────────────
    &__empty {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 40px 20px;
      text-align: center;
    }

    &__empty-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--primary-500) 10%, transparent) 0%,
        color-mix(in srgb, var(--primary-400) 6%, transparent) 100%
      );
      border-radius: 50%;
      color: var(--primary-400);
      margin-bottom: 8px;
    }

    &__empty-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: @neutral-700;
    }

    &__empty-text {
      margin: 0;
      font-size: 13px;
      color: @neutral-400;
    }

    // ─────────────────────────────────────────
    // Bouton nouveaux messages
    // ─────────────────────────────────────────
    &__new-messages-btn {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      color: white;
      border: none;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      box-shadow:
        0 4px 12px color-mix(in srgb, var(--primary-600) 35%, transparent),
        0 2px 4px color-mix(in srgb, @neutral-900 10%, transparent);
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 10;

      &:hover {
        transform: translateX(-50%) translateY(-2px);
        box-shadow:
          0 6px 16px color-mix(in srgb, var(--primary-600) 45%, transparent),
          0 4px 8px color-mix(in srgb, @neutral-900 12%, transparent);
      }

      &:active {
        transform: translateX(-50%) translateY(0);
      }
    }

    @media (max-width: 768px) {
      height: auto;
      min-height: 50vh;
      border-radius: 0;
    }
  }

  // ─────────────────────────────────────────
  // Animations
  // ─────────────────────────────────────────
  @keyframes loader-bounce {
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

  // ─────────────────────────────────────────
  // Transitions
  // ─────────────────────────────────────────
  .banner-slide-enter-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .banner-slide-leave-active {
    transition: all 0.2s ease;
  }

  .banner-slide-enter-from {
    opacity: 0;
    transform: translateY(-100%);
  }

  .banner-slide-leave-to {
    opacity: 0;
    transform: translateY(-50%);
  }

  .content-fade-enter-active,
  .content-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .content-fade-enter-from,
  .content-fade-leave-to {
    opacity: 0;
  }

  .btn-bounce-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .btn-bounce-leave-active {
    transition: all 0.2s ease;
  }

  .btn-bounce-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px) scale(0.8);
  }

  .btn-bounce-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(10px) scale(0.9);
  }

  .empty-fade-enter-active {
    transition: all 0.4s ease 0.1s;
  }

  .empty-fade-leave-active {
    transition: all 0.2s ease;
  }

  .empty-fade-enter-from,
  .empty-fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
</style>
