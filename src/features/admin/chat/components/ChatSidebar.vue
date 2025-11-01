<template>
  <aside class="chat-sidebar">
    <!-- 🧭 En-tête -->
    <div class="chat-sidebar__status">
      <div class="status-left">
        <div class="avatar">
          <BasicIconNext name="User" />
        </div>
        <div class="user-info">
          <span class="user-name">Support Fast Peptides</span>
          <span class="user-role">Connecté • Admin</span>
        </div>
      </div>
    </div>

    <!-- 🔍 Barre de recherche -->
    <div class="chat-sidebar__search">
      <BasicIconNext
        name="Search"
        :size="16"
        class="search-icon"
      />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher un client..."
        aria-label="Rechercher une conversation"
      />
      <button
        v-if="searchQuery"
        class="clear-btn"
        @click="searchQuery = ''"
        aria-label="Effacer la recherche"
      >
        <BasicIconNext
          name="X"
          :size="14"
        />
      </button>
    </div>

    <!-- 💬 Liste -->
    <div class="conversation-container">
      <ConversationItem
        v-for="conv in filteredConversations"
        :key="conv.user_id"
        :conversation="conv"
        :active="conv.user_id === selectedId"
        :is-typing-by-user="isTypingByUser"
        @select="$emit('select', conv.user_id)"
      />

      <div
        v-if="!filteredConversations.length"
        class="no-conv"
      >
        <BasicIconNext
          name="Inbox"
          :size="16"
        />
        <span>
          {{ searchQuery ? 'Aucun résultat trouvé' : 'Aucune conversation pour le moment' }}
        </span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { useChatNotifStore } from '@/features/admin/chat/stores/useChatNotifStore'
  import type { ConversationOverview } from '@/features/admin/chat/types/chat'
  import { computed, ref } from 'vue'
  import ConversationItem from './ConversationItem.vue'

  const props = defineProps<{
    conversations: ConversationOverview[]
    selectedId?: string | null
    isTypingByUser?: Record<string, boolean>
  }>()

  defineEmits<{ (e: 'select', userId: string): void }>()

  const notifStore = useChatNotifStore()
  const searchQuery = ref('')

  const filteredConversations = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    const base = q
      ? props.conversations.filter(
          (c) =>
            c.user_email?.toLowerCase().includes(q) || c.last_message?.toLowerCase().includes(q),
        )
      : props.conversations

    // 🧠 Injection du compteur live venant du store
    return base.map((conv) => ({
      ...conv,
      unread_count: notifStore.unreadByUser[conv.user_id] || 0,
    }))
  })
</script>

<style scoped lang="less">
  .chat-sidebar {
    background: @neutral-50;
    border-right: 1px solid @neutral-200;
    display: flex;
    flex-direction: column;
    height: 100%; // ✅ pleine hauteur
    overflow: hidden;
    scrollbar-width: thin;

    /* 🧭 Profil + statut */
    &__status {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: white;
      border-bottom: 1px solid @neutral-200;
      gap: 10px;

      .status-left {
        display: flex;
        align-items: center;
        gap: 10px;

        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .avatar-placeholder {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 1px solid @neutral-200;
            background: @neutral-100;
            color: @neutral-500;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;

          .user-name {
            font-weight: 600;
            color: @neutral-900;
            font-size: 14px;
          }

          .user-role {
            font-size: 12px;
            color: @neutral-600;
            display: flex;
            align-items: center;
            gap: 4px;

            .status-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: @neutral-400;

              &.online {
                background: @success-500;
                box-shadow: 0 0 5px fade(@success-500, 60%);
              }
            }

            .separator {
              color: @neutral-400;
            }
          }
        }
      }

      .status-right {
        display: flex;
        align-items: center;
        gap: 4px;

        .badge {
          background: @primary-600;
          color: white;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 6px;
        }

        .badge-label {
          font-size: 12px;
          color: @neutral-500;
        }
      }
    }

    /* 🔍 Barre de recherche */
    &__search {
      position: sticky;
      top: 62px;
      z-index: 9;
      display: flex;
      align-items: center;
      gap: 8px;
      background: @neutral-50;
      padding: 8px 10px;
      border-bottom: 1px solid @neutral-200;

      .search-icon {
        color: @neutral-500;
        flex-shrink: 0;
      }

      input {
        flex: 1;
        border: 1px solid @neutral-200;
        border-radius: 8px;
        padding: 6px 10px;
        font-size: 14px;
        background: white;
        transition: border-color 0.2s ease;

        &:focus {
          outline: none;
          border-color: @primary-500;
        }
      }

      .clear-btn {
        border: none;
        background: none;
        color: @neutral-500;
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s;

        &:hover {
          color: @neutral-700;
        }
      }
    }

    /* 💬 Liste des conversations */
    .conversation-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      scrollbar-width: thin;
      scroll-behavior: smooth;
      background: @neutral-50;
    }

    .conversation-list {
      display: flex;
      flex-direction: column;
      padding: 8px;
      gap: 4px;
    }

    .no-conv {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: @neutral-500;
      font-size: 14px;
      gap: 6px;
      padding: 16px;
      text-align: center;
    }

    @media (max-width: 768px) {
      border-right: none;
      border-bottom: 1px solid @neutral-200;
      height: auto;
      max-height: 50vh; // facultatif : limite la hauteur si beaucoup de conversations
      overflow-y: auto;
    }

    /* ✨ Transitions */
    .fade-enter-active,
    .fade-leave-active {
      transition: all 0.25s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
      transform: translateY(4px);
    }
  }
</style>
