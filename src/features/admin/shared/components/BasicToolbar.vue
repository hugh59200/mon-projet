<template>
  <div class="basic-toolbar">
    <BasicInput
      v-model="search"
      :placeholder="searchPlaceholder"
      icon-name="Search"
      clearable
      size="small"
    />
    <BasicButton
      v-if="showReset"
      label="Réinitialiser"
      variant="outlined"
      size="small"
      @click="emit('reset')"
    />
    <slot name="actions" />
    <BasicBadge
      v-if="role"
      :type="role === 'admin' ? 'info' : 'default'"
    >
      <BasicIconNext
        :name="role === 'admin' ? 'ShieldCheck' : 'User'"
        :size="14"
        class="role-icon"
      />
      <BasicText>{{ roleLabel }}</BasicText>
    </BasicBadge>
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import BasicBadge from '@designSystem/components/basic/badge/BasicBadge.vue'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicInput from '@designSystem/components/basic/input/BasicInput.vue'
  import { computed } from 'vue'

  defineProps<{
    searchPlaceholder?: string
    showReset?: boolean
    showRole?: boolean
  }>()

  const search = defineModel<string>('search')
  const emit = defineEmits<{ (e: 'reset'): void }>()

  const auth = useAuthStore()
  const role = computed(() => auth.profile?.role || 'user')
  const roleLabel = computed(() => (role.value === 'admin' ? 'Administrateur' : 'Utilisateur'))
</script>

<style scoped lang="less">
  .basic-toolbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    border: 1px solid @neutral-200;
    border-radius: 8px;
    background-color: @white;
    margin-bottom: 16px;
    padding: 12px 16px;

    > * {
      flex: 1;
    }
  }
</style>
