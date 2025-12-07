<template>
  <aside class="chat-sidebar">
    <div class="chat-sidebar__status">
      <div class="chat-sidebar__status-left">
        <div class="chat-sidebar__avatar">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt="Avatar"
          />
          <div
            v-else
            class="chat-sidebar__avatar-placeholder"
          >
            <BasicIconNext
              name="User"
              :size="18"
            />
          </div>
        </div>

        <div class="chat-sidebar__user-info">
          <BasicText
            size="body-m"
            weight="semibold"
            color="neutral-900"
          >
            Support Fast Peptides
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-700"
          >
            <span class="chat-sidebar__status-dot" />
            Connecté • Admin
          </BasicText>
        </div>
      </div>
    </div>
    <div class="chat-sidebar__conversation-list">
      <ConversationItem
        v-for="conv in enrichedConversations"
        :conversation="conv"
        :unread="conv.unread_count"
        :active="conv.user_id === selectedId"
        :is-typing-by-user="isTypingByUser"
        @select="$emit('select', conv.user_id!)"
      />
      <div
        v-if="!enrichedConversations.length"
        class="chat-sidebar__empty-state"
      >
        <BasicIconNext
          name="Inbox"
          :size="16"
        />
        <BasicText
          size="body-s"
          color="neutral-500"
        >
          Aucune conversation
        </BasicText>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { getAvatarPublicUrl, getProfile } from '@/api'
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import type { ConversationOverview } from '@/supabase/types/supabase.types'
  import { computed, onMounted, ref } from 'vue'
  import { useChatNotifStore } from '@/features/chat/shared/stores/useChatNotifStore'
  import ConversationItem from './ConversationItem.vue'

  const props = defineProps<{
    conversations: ConversationOverview[]
    selectedId?: string | null
    isTypingByUser?: Record<string, boolean>
  }>()

  defineEmits<{ (e: 'select', userId: string): void }>()

  const auth = useAuthStore()
  const notifStore = useChatNotifStore()
  const avatarUrl = ref<string | null>(null)

  const enrichedConversations = computed(() => {
    // on lit explicitement notifStore.unreadByUser pour rendre la dépendance réactive
    const unread = notifStore.unreadByUser

    return props.conversations
      .map((c) => ({
        ...c,
        unread_count: unread[c.user_id!] ?? 0,
      }))
      .sort((a, b) => {
        if (a.unread_count && !b.unread_count) return -1
        if (!a.unread_count && b.unread_count) return 1
        return (
          new Date(b.last_message_at ?? 0).getTime() - new Date(a.last_message_at ?? 0).getTime()
        )
      })
  })

  onMounted(async () => {
    if (!auth.user?.id) return
    const profile = await getProfile(auth.user.id)

    if (profile?.avatar_url) {
      avatarUrl.value = getAvatarPublicUrl(profile.avatar_url)
    }
  })
</script>

<style scoped lang="less">
  .chat-sidebar {
    background: @neutral-0;
    border-right: 1px solid @neutral-200;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    scrollbar-width: thin;
    border-top-left-radius: 16px;

    &__status {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid @neutral-200;
      gap: 10px;
    }

    &__status-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    &__avatar {
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
    }

    &__avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: @neutral-500;
    }

    &__user-info {
      display: flex;
      flex-direction: column;
      line-height: 1.3;
    }

    &__status-dot {
      position: relative;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: @success-500;
      display: inline-block;
      margin-right: 4px;
      box-shadow: 0 0 5px color-mix(in srgb, @success-500 40%, transparent);

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: color-mix(in srgb, @success-500 35%, transparent);
        animation: pulse-status 2s infinite ease-in-out;
      }
    }

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
          border-color: var(--primary-500);
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

    &__conversation-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      scrollbar-width: thin;
      scroll-behavior: smooth;
      background: rgba(var(--primary-200-rgb), 0.75);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
      border: 1px solid color-mix(in srgb, @neutral-300 25%, transparent);
    }

    &__empty-state {
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

  @keyframes pulse-status {
    0% {
      opacity: 0.8;
    }
    50% {
      opacity: 0.2;
    }
    100% {
      opacity: 0;
    }
  }

  /* ------------------------- Mobile responsive ------------------------- */
  .respond-mobile({
    .chat-sidebar {
      width: 100%;
      border-right: none;
      border-radius: 12px;
      min-height: 400px;

      &__status {
        padding: 14px 16px;
      }

      &__avatar {
        width: 44px;
        height: 44px;
      }

      &__conversation-list {
        border-radius: 0 0 12px 12px;
      }
    }
  });
</style>
