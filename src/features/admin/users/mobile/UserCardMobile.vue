<template>
  <div
    class="mobile-card"
    @click="openUserModal(user.id)"
  >
    <div class="row">
      <div class="user-info">
        <BasicText weight="bold">{{ user.full_name || '—' }}</BasicText>
        <BasicText size="body-s">{{ user.email }}</BasicText>
      </div>
      <BasicBadge
        :label="getRoleLabel(role)"
        :type="getRoleBadge(role)"
        size="small"
      />
    </div>

    <div class="row">
      <BasicText size="body-s">Créé le {{ formatDate(user.created_at!) }}</BasicText>
      <div
        class="actions"
        @click.stop
      >
        <BasicIconNext
          name="Trash2"
          :size="18"
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
  import { getRoleBadge, getRoleLabel } from '@/utils'

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
    background: @neutral-100;
    border-radius: 10px;
    padding: 14px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 10px;
    cursor: pointer;
    transition:
      background 0.2s ease,
      transform 0.2s ease;

    &:hover {
      background: @neutral-200;
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

  .actions {
    display: flex;
    align-items: center;
  }

  .action-icon {
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
    opacity: 0.8;

    &:hover {
      transform: scale(1.1);
      opacity: 1;
    }
  }
</style>
