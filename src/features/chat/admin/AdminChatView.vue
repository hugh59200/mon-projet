<template>
  <div class="chat-admin">
    <!-- Toolbar avec recherche -->
    <BasicToolbar
      v-model:search="searchQuery"
      search-placeholder="Rechercher une conversation..."
    >
      <template #filters>
        <div class="chat-admin__filters">
          <PremiumButton
            v-if="isMobile && selectedUserId"
            variant="ghost"
            size="sm"
            icon-left="ArrowLeft"
            label="Retour"
            @click="goBackToList"
          />
          <span class="chat-admin__count">
            {{ filteredConversations.length }} conversation{{
              filteredConversations.length > 1 ? 's' : ''
            }}
          </span>
        </div>
      </template>
    </BasicToolbar>

    <!-- Layout principal -->
    <div class="chat-admin__layout">
      <!-- Sidebar -->
      <div
        class="chat-admin__sidebar"
        :class="{ 'chat-admin__sidebar--hidden': isMobile && selectedUserId }"
      >
        <ChatSidebar
          :conversations="filteredConversations"
          :selected-id="selectedUserId"
          :is-typing-by-user="typingRecord"
          @select="selectConversation"
        />
      </div>

      <!-- Zone de chat -->
      <div
        class="chat-admin__chat"
        :class="{ 'chat-admin__chat--hidden': isMobile && !selectedUserId }"
      >
        <ChatCore
          v-if="selectedUserId"
          v-model:new-message="newMessage"
          :messages="messages"
          :is-typing="isCurrentTyping"
          :loading="isMessagesLoading"
          current-role="admin"
          :send-message="sendMessage"
          :send-typing="sendTyping"
          :height="isMobile ? undefined : 600"
          :show-ai-button="true"
          :ai-loading="aiSuggestion.isLoading.value"
          :ai-error="aiSuggestion.error.value"
          :ai-suggestion="aiSuggestion.lastSuggestion.value"
          :conversation-id="selectedUserId"
          @request-ai-suggestion="handleAiSuggestion"
          @clear-ai-error="aiSuggestion.reset"
          @accept-ai-suggestion="acceptAiSuggestion"
          @edit-ai-suggestion="editAiSuggestion"
          @close-ai-suggestion="closeAiSuggestion"
        />
        <section
          v-else
          class="chat-admin__placeholder"
        >
          <div class="chat-admin__placeholder-icon">
            <BasicIconNext
              name="MessageSquare"
              :size="32"
              color="currentColor"
            />
          </div>
          <BasicText
            size="body-m"
            weight="semibold"
            color="neutral-700"
          >
            Sélectionnez une conversation
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-500"
          >
            Choisissez une conversation à gauche pour commencer à discuter.
          </BasicText>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import BasicToolbar from '@/features/admin/shared/components/BasicToolbar.vue'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import ChatCore from '@/features/chat/shared/components/ChatCore.vue'
  import { useAiSuggestion } from '@/features/chat/shared/composables/useAiSuggestion'
  import { useChat } from '@/features/chat/shared/composables/useChat'
  import { useChatConversations } from '@/features/chat/shared/composables/useChatConversations'
  import { useChatNotifStore } from '@/features/chat/shared/stores/useChatNotifStore'
  import ChatSidebar from './ChatSidebar.vue'

  const route = useRoute()
  const router = useRouter()
  const { isMobile } = useDeviceBreakpoint()

  const {
    messages,
    selectedUserId,
    newMessage,
    isTypingByUser,
    isMessagesLoading,
    selectConversation,
    sendMessage,
    sendTyping,
  } = useChat('admin')

  // AI Copilot
  const aiSuggestion = useAiSuggestion()

  const handleAiSuggestion = async () => {
    // Récupérer l'email du client depuis la conversation sélectionnée
    const currentConv = conv.conversations.value.find((c) => c.user_id === selectedUserId.value)
    const clientEmail = currentConv?.user_email ?? undefined

    // Générer la suggestion (elle sera affichée automatiquement via aiSuggestion.lastSuggestion)
    await aiSuggestion.generateSuggestion(messages.value, clientEmail)
  }

  const acceptAiSuggestion = () => {
    // Copier la suggestion dans le champ de saisie
    if (aiSuggestion.lastSuggestion.value) {
      newMessage.value = aiSuggestion.lastSuggestion.value
    }
    // Fermer la card
    aiSuggestion.reset()
  }

  const editAiSuggestion = () => {
    // Copier la suggestion dans le champ de saisie pour édition
    if (aiSuggestion.lastSuggestion.value) {
      newMessage.value = aiSuggestion.lastSuggestion.value
    }
    // Fermer la card
    aiSuggestion.reset()
  }

  const closeAiSuggestion = () => {
    // Simplement fermer la card sans copier
    aiSuggestion.reset()
  }

  const goBackToList = () => {
    selectedUserId.value = null
  }

  const conv = useChatConversations()

  const chatNotif = useChatNotifStore()

  const typingRecord = computed(() => {
    return isTypingByUser.value // ✅ directement, réactif
  })

  const isCurrentTyping = computed(() => {
    const uid = selectedUserId.value
    const v = uid ? typingRecord.value[uid] : false
    return !!v
  })

  onMounted(async () => {
    await conv.fetchConversations()
    conv.setupPresence()
    conv.listenRealtimeConversations()
    await chatNotif.fetchUnreadByUser()
  })

  // Recherche avec persistance URL
  const searchQuery = ref((route.query.q as string) || '')
  const filteredConversations = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    let base = conv.conversations.value
    if (q) {
      base = base.filter(
        (c) =>
          c.user_email?.toLowerCase().includes(q) || c.last_message_short.toLowerCase().includes(q),
      )
    }
    return base
  })

  // Synchroniser searchQuery avec l'URL
  watch(searchQuery, (q) => {
    const query = { ...route.query }
    if (q) {
      query.q = q
    } else {
      delete query.q
    }
    router.replace({ query })
  })

  // Synchroniser selectedUserId avec l'URL
  watch(selectedUserId, async (uid) => {
    // Mettre à jour l'URL
    const query = { ...route.query }
    if (uid) {
      query.conversationId = uid
    } else {
      delete query.conversationId
    }
    router.replace({ query })

    // Marquer comme lu
    if (uid) {
      await chatNotif.markAsRead(uid)
      await conv.refreshUnreadCount()
    }
  })

  // Restaurer la conversation depuis l'URL après le chargement
  watch(
    () => conv.conversations.value,
    (conversations) => {
      const urlConversationId = route.query.conversationId as string
      if (urlConversationId && conversations.length > 0 && !selectedUserId.value) {
        // Vérifier que la conversation existe
        const exists = conversations.some((c) => c.user_id === urlConversationId)
        if (exists) {
          selectConversation(urlConversationId)
        }
      }
    },
    { immediate: true },
  )
</script>

<style scoped lang="less">
  .chat-admin {
    display: flex;
    flex-direction: column;
    gap: 16px;

    // ─────────────────────────────────────────
    // Filters / Count
    // ─────────────────────────────────────────
    &__filters {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: 16px;
    }

    &__count {
      font-size: 13px;
      color: var(--admin-text-secondary, @neutral-500);
      font-weight: 500;
      padding: 6px 12px;
      background: var(--admin-bg-card, @neutral-100);
      border-radius: 8px;
      border: 1px solid var(--admin-border-subtle, transparent);
    }

    // ─────────────────────────────────────────
    // Layout Principal
    // ─────────────────────────────────────────
    &__layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      background: var(--admin-bg-card, white);
      border-radius: 16px;
      box-shadow: 0 4px 24px var(--admin-shadow, color-mix(in srgb, @neutral-900 6%, transparent));
      border: 1px solid var(--admin-border, @neutral-200);
      overflow: hidden;
      min-height: 600px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    // ─────────────────────────────────────────
    // Sidebar wrapper
    // ─────────────────────────────────────────
    &__sidebar {
      display: flex;
      flex-direction: column;
      min-height: 0;
      border-right: 1px solid var(--admin-border-subtle, @neutral-200);
      background: var(--admin-bg-header, transparent);
    }

    // ─────────────────────────────────────────
    // Chat wrapper
    // ─────────────────────────────────────────
    &__chat {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    // ─────────────────────────────────────────
    // Placeholder
    // ─────────────────────────────────────────
    &__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      flex: 1;
      min-height: 600px;
      text-align: center;
      padding: 32px;
      background: var(--admin-bg-header, @neutral-50);

      &-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        background: var(--admin-bg-card, white);
        border-radius: 16px;
        color: var(--primary-500);
        margin-bottom: 8px;
        box-shadow: 0 4px 16px var(--admin-shadow, color-mix(in srgb, @neutral-900 8%, transparent));
        border: 1px solid var(--admin-border-subtle, transparent);
      }
    }

    // ─────────────────────────────────────────
    // Mobile Responsive
    // ─────────────────────────────────────────
    .respond-mobile({
      &__filters {
        margin-left: 0;
        flex-wrap: wrap;
      }

      &__layout {
        display: flex;
        flex-direction: column;
        min-height: auto;
        border-radius: 12px;
      }

      &__sidebar {
        border-right: none;
        border-bottom: 1px solid var(--admin-border-subtle, @neutral-200);

        &--hidden {
          display: none;
        }
      }

      &__chat {
        &--hidden {
          display: none;
        }
      }

      &__placeholder {
        min-height: 300px;
        padding: 24px;

        &-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
        }
      }
    });
  }
</style>
