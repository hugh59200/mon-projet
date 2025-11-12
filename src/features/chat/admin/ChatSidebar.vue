<template>
  <aside class="chat-sidebar">
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
            Support Fast Peptides
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
    <div class="conversation-container">
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
          Aucune conversation
        </BasicText>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { supabase } from '@/supabase/supabaseClient'
  import type { ConversationOverview } from '@/supabase/types/supabase.types'
  import { computed, onMounted, ref } from 'vue'
  import { useChatNotifStore } from '../shared/stores/useChatNotifStore'
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
