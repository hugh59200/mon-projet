<template>
  <MobileCard hoverable>
    <template #title>
      <div class="user-header">
        <div class="user-info">
          <div class="user-name">{{ user.full_name || '—' }}</div>
          <div class="user-email">{{ user.email }}</div>
        </div>

        <span
          class="role-chip"
          :class="`role-chip--${modelValue}`"
        >
          {{ modelValue }}
        </span>
      </div>
    </template>

    <template #info>
      <div class="line">
        <span class="label">Créé le :</span>
        <span class="value">{{ formatDate(user.created_at) }}</span>
      </div>
    </template>

    <template #actions>
      <BasicDropdown
        v-model="modelValue"
        :items="roles"
        size="small"
        dropdown-type="table"
        force-value
        @update:model-value="(v) => handleRoleChange(user, v as Role)"
      />

      <BasicButton
        label="Voir le profil"
        type="secondary"
        size="small"
        variant="outlined"
        block
        @click="openUserModal(user.id)"
      />
      <BasicButton
        label="Supprimer"
        type="danger"
        size="small"
        variant="outlined"
        block
        @click="handleDelete(user)"
      />
    </template>
  </MobileCard>
</template>

<script setup lang="ts">
  import type { Profiles, Role } from '@/supabase/types/supabase.types' // ✅ on importe Role
  import MobileCard from '../mobile/MobileCard.vue'

  type RoleOption = { id: Role; label: string }

  defineProps<{
    user: Profiles
    roles: RoleOption[]
    formatDate: (d: string | null) => string
    handleRoleChange: (user: Profiles, role: Role) => void
    openUserModal: (id: string) => void
    handleDelete: (user: Profiles) => void
  }>()

  const modelValue = defineModel<Role>('role', { required: true })
</script>
<style scoped lang="less">
  .user-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .user-name {
    font-weight: 600;
    color: @primary-950;
    font-size: @font-size-body-l;
  }

  .user-email {
    font-size: @font-size-body-m;
    color: @neutral-500;
    word-break: break-all;
  }

  .role-chip {
    padding: 3px 8px;
    border-radius: 6px;
    font-size: @font-size-body-s;
    font-weight: 600;
    text-transform: capitalize;
    white-space: nowrap;

    &--user {
      background: fade(@neutral-400, 15%);
      color: @neutral-700;
    }

    &--admin {
      background: fade(@primary-400, 15%);
      color: @primary-700;
    }
  }

  .line {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      color: @neutral-500;
    }

    .value {
      color: @primary-900;
    }
  }
</style>
