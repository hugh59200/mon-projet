<template>
  <aside class="chat-sidebar">
    <!-- 🧭 En-tête : profil + statut -->
    <div class="chat-sidebar__status">
      <div class="status-left">
        <div class="avatar">
          <img
            v-if="profileAvatar"
            :src="profileAvatar"
            alt="Avatar"
          />
          <div
            v-else
            class="avatar-placeholder"
          >
            <BasicIconNext name="User" />
          </div>
        </div>

        <div class="user-info">
          <span class="user-name">{{ profileName }}</span>
          <span class="user-role">
            <span
              class="status-dot"
              :class="{ online: isOnline }"
            />
            {{ isOnline ? 'Connecté' : 'Hors ligne' }}
            <span class="separator">•</span>
            {{ auth.isAdmin ? 'Admin' : 'Utilisateur' }}
          </span>
        </div>
      </div>

      <div
        class="status-right"
        v-if="unreadTotal > 0"
      >
        <span class="badge">{{ unreadTotal }}</span>
        <span class="badge-label">non lus</span>
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

    <!-- 💬 Liste des conversations -->
    <div class="conversation-container">
      <transition-group
        name="fade"
        tag="div"
        class="conversation-list"
      >
        <ConversationItem
          v-for="(conv, i) in filteredConversations"
          :key="conv.user_id || 'conv-' + i"
          :conversation="conv"
          :active="conv.user_id === selectedId"
          @select="$emit('select', conv.user_id)"
        />
      </transition-group>

      <!-- 🚫 Aucun résultat -->
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
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { useChatNotifStore } from '@/features/support/stores/useChatNotifStore'
  import type { ConversationOverview } from '@/features/support/types/chat'
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import ConversationItem from './ConversationItem.vue'

  const props = defineProps<{
    conversations: ConversationOverview[]
    selectedId?: string | null
  }>()

  const emit = defineEmits<{
    (e: 'select', userId: string): void
  }>()

  /* 🔍 Recherche */
  const searchQuery = ref('')
  const filteredConversations = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return props.conversations
    return props.conversations.filter(
      (c) => c.user_email?.toLowerCase().includes(q) || c.last_message?.toLowerCase().includes(q),
    )
  })

  /* 👤 Auth info */
  const auth = useAuthStore()
  const profileName = computed(() => {
    return auth.profile?.full_name || auth.profile?.email || auth.user?.email || 'Admin inconnu'
  })
  const profileAvatar = computed(() => auth.profile?.avatar_url || null)

  /* 🌐 Statut en ligne */
  const isOnline = ref(navigator.onLine)
  const updateOnlineStatus = () => (isOnline.value = navigator.onLine)
  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })
  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })

  /* 🔔 Compteur global non lus */
  const notifStore = useChatNotifStore()
  const unreadTotal = computed(() =>
    Object.values(notifStore.unreadByUser || {}).reduce((a, b) => a + (b || 0), 0),
  )
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
