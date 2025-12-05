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
            :avatar="msg.sender_role !== currentRole ? otherRoleAvatar : undefined"
          />
        </div>

        <!-- Indicateur de frappe -->
        <ChatTypingIndicator :isTyping="localIsTyping" />
      </div>
    </Transition>

    <!-- Bouton nouveaux messages -->
    <Transition name="btn-bounce">
      <PremiumButton
        v-if="showNewMessagesIndicator"
        type="primary"
        variant="solid"
        size="sm"
        label="Nouveaux messages"
        icon-left="ChevronDown"
        class="chat-core__new-messages-btn"
        @click="hideNewMessagesIndicator"
      />
    </Transition>

    <!-- AI Suggestion Card -->
    <AiSuggestionCard
      :show="!!aiSuggestion"
      :suggestion="aiSuggestion ?? null"
      @accept="$emit('accept-ai-suggestion')"
      @edit="$emit('edit-ai-suggestion')"
      @close="$emit('close-ai-suggestion')"
    />

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
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import type { ChatRole } from '../types/chat'
  import { useScrollMessages } from '../composables/useScrollMessages'
  import { useChatScrollStore } from '../stores/useChatScrollStore'
  import ChatInput from './ChatInput.vue'
  import ChatMessage from './ChatMessage.vue'
  import ChatTypingIndicator from './ChatTypingIndicator.vue'
  import AiSuggestionCard from './AiSuggestionCard.vue'

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
    aiSuggestion?: string | null
    /** ID de la conversation pour la persistance du scroll */
    conversationId?: string | null
    /** Avatar URL pour les messages de l'autre rôle (admin pour user, user pour admin) */
    otherRoleAvatar?: string | null
  }>()

  defineEmits<{
    (e: 'request-ai-suggestion'): void
    (e: 'clear-ai-error'): void
    (e: 'accept-ai-suggestion'): void
    (e: 'edit-ai-suggestion'): void
    (e: 'close-ai-suggestion'): void
  }>()

  const newMessage = defineModel<string>('newMessage', { default: '' })

  // ─────────────────────────────────────────
  // Scroll management (composable + store)
  // ─────────────────────────────────────────
  const scrollStore = useChatScrollStore()
  const {
    scrollRef,
    showNewMessagesIndicator,
    hideNewMessagesIndicator,
    scrollToEnd,
    scrollToMessage,
    getFirstVisibleMessageId,
    checkNearBottom,
  } = useScrollMessages({ threshold: 100 })

  // Variable pour tracker la conversation précédente
  const previousConversationId = ref<string | null>(null)

  // Sauvegarder le scroll avant de changer de conversation
  const saveCurrentScrollState = () => {
    const convId = previousConversationId.value
    if (!convId) return

    const firstVisibleId = getFirstVisibleMessageId()
    const nearBottom = checkNearBottom()

    console.log('[ChatCore] Saving scroll state for:', convId, { firstVisibleId, nearBottom })
    scrollStore.saveScrollState(convId, firstVisibleId, nearBottom)
  }

  // Restaurer le scroll pour la conversation actuelle
  const restoreScrollState = async () => {
    const convId = props.conversationId
    if (!convId) return

    const state = scrollStore.getScrollState(convId)
    console.log('[ChatCore] Restoring scroll state for:', convId, state)

    if (!state) {
      // Pas d'état sauvegardé, aller en bas
      await scrollToEnd(true)
      return
    }

    if (state.wasNearBottom) {
      // L'utilisateur était en bas, y retourner
      await scrollToEnd(true)
    } else if (state.firstVisibleMessageId) {
      // Scroller vers le message sauvegardé
      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))
      const success = scrollToMessage(state.firstVisibleMessageId)
      console.log('[ChatCore] Scroll to message result:', success)
    }
  }

  // Watcher sur conversationId pour sauvegarder/restaurer
  watch(
    () => props.conversationId,
    async (newConvId, oldConvId) => {
      console.log('[ChatCore] Conversation changed:', oldConvId, '->', newConvId)

      // Sauvegarder l'état de l'ancienne conversation
      if (oldConvId) {
        saveCurrentScrollState()
      }

      // Mettre à jour la référence
      previousConversationId.value = newConvId ?? null
    },
  )

  // Watcher sur loading : restaurer scroll après le chargement
  watch(
    () => props.loading,
    async (isLoading, wasLoading) => {
      // Quand le loading se termine (passe de true à false)
      if (wasLoading && !isLoading) {
        // Attendre que le DOM soit rendu avec les messages
        await nextTick()
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Restaurer le scroll
        await restoreScrollState()
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
  onMounted(async () => {
    isOnline.value = navigator.onLine
    window.addEventListener('online', handleOnlineChange)
    window.addEventListener('offline', handleOnlineChange)

    // Initialiser la conversation actuelle
    if (props.conversationId) {
      previousConversationId.value = props.conversationId
    }

    // Si pas en loading, scroll vers le bas directement
    if (!props.loading) {
      await nextTick()
      await scrollToEnd(true)
    }
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnlineChange)
    window.removeEventListener('offline', handleOnlineChange)
    if (typingTimeout) clearTimeout(typingTimeout)

    // Sauvegarder le scroll avant de démonter
    saveCurrentScrollState()
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
    background: white;
    display: flex;
    flex-direction: column;
    border-radius: 0 0 16px 16px;
    position: relative;
    overflow: hidden;

    // Subtle gradient overlay
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--primary-50) 30%, transparent) 0%,
        transparent 30%
      );
      pointer-events: none;
      z-index: 0;
    }

    // ─────────────────────────────────────────
    // Bannière hors ligne
    // ─────────────────────────────────────────
    &__offline-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: linear-gradient(
        135deg,
        color-mix(in srgb, @warning-500 15%, white) 0%,
        color-mix(in srgb, @warning-400 10%, white) 100%
      );
      color: @warning-800;
      padding: 12px 20px;
      font-size: 13px;
      font-weight: 600;
      border-bottom: 1px solid color-mix(in srgb, @warning-400 25%, transparent);
      position: relative;
      z-index: 2;
      backdrop-filter: blur(8px);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(180deg, @warning-500 0%, @warning-400 100%);
      }
    }

    &__offline-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, @warning-500 0%, @warning-400 100%);
      border-radius: 8px;
      flex-shrink: 0;
      color: white;
      box-shadow: 0 2px 8px color-mix(in srgb, @warning-500 30%, transparent);
    }

    // ─────────────────────────────────────────
    // Loader Premium
    // ─────────────────────────────────────────
    &__loader {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
      min-height: 400px;
      background: linear-gradient(180deg, @neutral-50 0%, white 100%);
      position: relative;
      z-index: 1;
    }

    &__loader-animation {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 24px;
      background: white;
      border-radius: 16px;
      box-shadow:
        0 2px 8px color-mix(in srgb, @neutral-900 6%, transparent),
        0 8px 24px color-mix(in srgb, @neutral-900 8%, transparent);
    }

    &__loader-dot {
      width: 12px;
      height: 12px;
      background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-600) 100%);
      border-radius: 50%;
      animation: loader-bounce 1.4s ease-in-out infinite;
      box-shadow: 0 2px 8px color-mix(in srgb, var(--primary-500) 40%, transparent);

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
      font-weight: 600;
      letter-spacing: -0.01em;
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
      z-index: 1;
    }

    // ─────────────────────────────────────────
    // Zone des messages Premium
    // ─────────────────────────────────────────
    &__messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 20px 24px;
      background:
        linear-gradient(180deg, @neutral-100 0%, @neutral-50 30%, white 100%);
      scroll-behavior: smooth;
      min-height: 0;
      gap: 6px;
      padding-bottom: 28px;
      position: relative;

      // Pattern subtil
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: radial-gradient(
          circle at 2px 2px,
          color-mix(in srgb, @neutral-300 8%, transparent) 1px,
          transparent 0
        );
        background-size: 20px 20px;
        pointer-events: none;
        opacity: 0.5;
      }
    }

    &__messages::-webkit-scrollbar {
      width: 8px;
    }

    &__messages::-webkit-scrollbar-track {
      background: transparent;
      margin: 8px 0;
    }

    &__messages::-webkit-scrollbar-thumb {
      background: linear-gradient(
        180deg,
        color-mix(in srgb, @neutral-400 60%, transparent) 0%,
        color-mix(in srgb, @neutral-500 60%, transparent) 100%
      );
      border-radius: 8px;
      border: 2px solid transparent;
      background-clip: padding-box;
      transition: all 0.2s ease;
    }

    &__messages::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(
        180deg,
        @neutral-400 0%,
        @neutral-500 100%
      );
      background-clip: padding-box;
    }

    // ─────────────────────────────────────────
    // État vide Premium
    // ─────────────────────────────────────────
    &__empty {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 48px 24px;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    &__empty-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--primary-500) 12%, white) 0%,
        color-mix(in srgb, var(--primary-400) 8%, white) 100%
      );
      border-radius: 24px;
      color: var(--primary-500);
      margin-bottom: 8px;
      box-shadow:
        0 4px 16px color-mix(in srgb, var(--primary-500) 15%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
      position: relative;

      // Ring effect
      &::before {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 28px;
        border: 2px dashed color-mix(in srgb, var(--primary-400) 25%, transparent);
        animation: rotate-ring 20s linear infinite;
      }
    }

    &__empty-title {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: @neutral-800;
      letter-spacing: -0.02em;
    }

    &__empty-text {
      margin: 0;
      font-size: 14px;
      color: @neutral-500;
      max-width: 260px;
      line-height: 1.5;
    }

    // ─────────────────────────────────────────
    // Bouton nouveaux messages Premium
    // ─────────────────────────────────────────
    &__new-messages-btn {
      position: absolute;
      bottom: 88px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      color: white;
      border: none;
      border-radius: 24px;
      padding: 10px 20px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      box-shadow:
        0 4px 16px color-mix(in srgb, var(--primary-600) 40%, transparent),
        0 2px 4px color-mix(in srgb, @neutral-900 15%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 10;
      letter-spacing: -0.01em;
      backdrop-filter: blur(8px);

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 24px;
        background: linear-gradient(
          135deg,
          transparent 0%,
          rgba(255, 255, 255, 0.15) 50%,
          transparent 100%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateX(-50%) translateY(-3px);
        box-shadow:
          0 8px 24px color-mix(in srgb, var(--primary-600) 50%, transparent),
          0 4px 8px color-mix(in srgb, @neutral-900 15%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.25);

        &::before {
          opacity: 1;
        }
      }

      &:active {
        transform: translateX(-50%) translateY(-1px);
      }
    }

    .respond-mobile({
      height: auto;
      min-height: 50dvh;
      border-radius: 0;

      &__messages {
        padding: 16px;
        padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
      }

      &__empty-icon {
        width: 64px;
        height: 64px;
        border-radius: 18px;
      }

      &__new-messages-btn {
        bottom: calc(80px + env(safe-area-inset-bottom, 0px));
      }
    });
  }

  // ─────────────────────────────────────────
  // Animations
  // ─────────────────────────────────────────
  @keyframes loader-bounce {
    0%,
    80%,
    100% {
      transform: scale(0.6);
      opacity: 0.4;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes rotate-ring {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  // ─────────────────────────────────────────
  // Transitions
  // ─────────────────────────────────────────
  .banner-slide-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .banner-slide-leave-active {
    transition: all 0.25s ease;
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
    transition: opacity 0.35s ease;
  }

  .content-fade-enter-from,
  .content-fade-leave-to {
    opacity: 0;
  }

  .btn-bounce-enter-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .btn-bounce-leave-active {
    transition: all 0.25s ease;
  }

  .btn-bounce-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(24px) scale(0.7);
  }

  .btn-bounce-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(12px) scale(0.85);
  }

  .empty-fade-enter-active {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
  }

  .empty-fade-leave-active {
    transition: all 0.25s ease;
  }

  .empty-fade-enter-from,
  .empty-fade-leave-to {
    opacity: 0;
    transform: translateY(16px) scale(0.95);
  }
</style>
