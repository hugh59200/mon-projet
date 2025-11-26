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
        <BasicIconNext
          name="Trash2"
          :size="20"
          color="danger-600"
          pointer
          @click="handleDelete(user)"
          class="action-icon"
        />
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
    background: @white;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid @neutral-200;
    transition:
      background 0.2s ease,
      transform 0.2s ease;
    cursor: pointer;

    &:hover {
      background: @neutral-50;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    &:active {
      transform: scale(0.98);
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
    background: @neutral-300;
  }

  .action-icon {
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
    opacity: 0.7;

    &:hover {
      transform: scale(1.15);
      opacity: 1;
    }
  }
</style>
