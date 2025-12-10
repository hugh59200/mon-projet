<template>
  <div
    class="mobile-card"
    @click="openUserModal(user.id)"
  >
    <div class="row">
      <div class="user-info">
        <div class="user-name-row">
          <BasicText weight="bold">{{ user.full_name || '—' }}</BasicText>
        </div>
        <BasicText
          size="body-s"
          color="neutral-500"
        >
          {{ user.email }}
        </BasicText>
      </div>
      <BasicBadge
        :label="getLabelBadge(role)"
        :type="getTypeBadge(role)"
        size="small"
      />
    </div>

    <div class="row">
      <BasicText
        size="body-s"
        color="neutral-600"
      >
        Créé le {{ formatDate(user.created_at!) }}
      </BasicText>

      <div
        class="actions"
        @click.stop
      >
        <div class="separator"></div>
        <button
          type="button"
          class="action-btn"
          @click="handleDelete(user)"
        >
          <BasicIconNext
            name="Trash2"
            :size="20"
            color="danger-600"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Profiles, Role } from '@/supabase/types/supabase.types'
  import { getLabelBadge, getTypeBadge } from '@/utils'

  defineProps<{
    user: Profiles
    role: Role
    formatDate: (v: string) => string
    openUserModal: (id: string) => void
    handleDelete: (u: Profiles) => void
  }>()
</script>

<style scoped lang="less">
  .mobile-card {
    padding: 16px;
    border-radius: 12px;
    background: var(--bg-subtle);
    display: flex;
    flex-direction: column;
    gap: 12px;
    border: 1px solid var(--border-default);
    transition:
      background 0.2s ease,
      transform 0.2s ease;
    cursor: pointer;

    &:hover {
      background: rgba(var(--primary-500-rgb), 0.08);
      border-color: var(--primary-300);
    }

    &:active {
      background: var(--bg-subtle);
    }
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .user-name-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .separator {
    width: 1px;
    height: 16px;
    background: var(--border-default);
  }

  // Zone tactile minimum 44px
  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    background: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease;
    margin: -12px -8px -12px 0;

    &:active {
      background: rgba(239, 68, 68, 0.1);
    }

    svg {
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    &:hover svg {
      opacity: 1;
    }
  }
</style>
