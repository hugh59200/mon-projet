<template>
  <aside class="chat-sidebar">
    <!-- 🧭 En-tête profil -->
    <div class="chat-sidebar__status">
      <div class="status-left">
        <div class="avatar">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt="Avatar"
          />
          <div
            v-else
            class="avatar-placeholder"
          >
            <BasicIconNext
              name="User"
              :size="18"
            />
          </div>
        </div>

        <div class="user-info">
          <BasicText
            size="body-m"
            weight="semibold"
            color="neutral-900"
          >
            {{ displayName }}
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-700"
          >
            <span class="status-dot online" />
            Connecté • Admin
          </BasicText>
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

    <!-- 💬 Liste des conversations -->
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
        <BasicText
          size="body-s"
          color="neutral-500"
        >
          {{ searchQuery ? 'Aucun résultat trouvé' : 'Aucune conversation pour le moment' }}
        </BasicText>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { useChatNotifStore } from '@/features/admin/chat/shared/stores/useChatNotifStore'
  import type { ConversationOverview } from '@/features/admin/chat/shared/types/chat'
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { supabase } from '@/supabase/supabaseClient'
  import { computed, onMounted, ref } from 'vue'
  import ConversationItem from './ConversationItem.vue'

  const props = defineProps<{
    conversations: ConversationOverview[]
    selectedId?: string | null
    isTypingByUser?: Record<string, boolean>
  }>()

  defineEmits<{ (e: 'select', userId: string): void }>()

  const notifStore = useChatNotifStore()
  const auth = useAuthStore()

  const searchQuery = ref('')
  const avatarUrl = ref<string | null>(null)

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

  const displayName = computed(() => auth.user?.fullName || 'Support Fast Peptides')

  // 🧩 Charge l’avatar depuis Supabase si présent
  onMounted(async () => {
    if (!auth.user?.id) return
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', auth.user.id)
      .maybeSingle()
    if (data?.avatar_url) {
      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(data.avatar_url)
      avatarUrl.value = pub.publicUrl
    }
  })
</script>

<style scoped lang="less">
  .chat-sidebar {
    background: @neutral-50;
    border-right: 1px solid @neutral-200;
    display: flex;
    flex-direction: column;
    height: 100%;
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
      padding: 12px 16px;
      background: white;
      border-bottom: 1px solid @neutral-200;
      gap: 10px;

      .status-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid @neutral-200;
          background: @neutral-100;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .avatar-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: @neutral-500;
          }
        }

        .user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.3;

          /* ✅ Dot animé “en ligne” */
          .status-dot {
            position: relative;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: @success-500;
            display: inline-block;
            margin-right: 4px;
            box-shadow: 0 0 5px fade(@success-500, 40%);

            &::after {
              content: '';
              position: absolute;
              inset: 0;
              border-radius: 50%;
              background: fade(@success-500, 35%);
              animation: pulse-status 2s infinite ease-in-out;
            }
          }
        }
      }
    }

    /* 🔍 Barre de recherche */
    &__search {
      position: sticky;
      top: 70px;
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

    .no-conv {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 16px;
      text-align: center;
    }
  }

  /* 💫 Animation halo de statut */
  @keyframes pulse-status {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.8);
      opacity: 0.1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
</style>
