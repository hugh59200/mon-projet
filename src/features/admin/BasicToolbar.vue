<template>
  <div class="basic-toolbar">
    <!-- 🔍 Recherche -->
    <div class="toolbar__item toolbar__search">
      <BasicInput
        v-model="search"
        :placeholder="searchPlaceholder"
        icon-name="Search"
        clearable
        size="small"
      />
    </div>

    <!-- 🔄 Reset -->
    <div
      v-if="showReset"
      class="toolbar__item toolbar__reset"
    >
      <BasicButton
        label="Réinitialiser"
        variant="outlined"
        @click="emit('reset')"
      />
    </div>

    <!-- ➕ Actions -->
    <div class="toolbar__item toolbar__actions">
      <slot name="actions" />
    </div>

    <!-- 🧠 Rôle utilisateur -->
    <div
      v-if="showRole && role"
      class="toolbar__item toolbar__role"
    >
      <BasicBadge
        :type="role === 'admin' ? 'info' : 'default'"
        size="small"
      >
        <div class="badge-content">
          <BasicIconNext
            :name="role === 'admin' ? 'ShieldCheck' : 'User'"
            :size="14"
            class="role-icon"
          />
          <span>{{ roleLabel }}</span>
        </div>
      </BasicBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/useAuthStore'
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

  /* 🧠 Rôle utilisateur dynamique */
  const auth = useAuthStore()
  const role = computed(() => auth.profile?.role || 'user')
  const roleLabel = computed(() => (role.value === 'admin' ? 'Administrateur' : 'Utilisateur'))
</script>

<style scoped lang="less">
  .basic-toolbar {
    display: grid;
    grid-template-columns: repeat(36, 1fr);
    align-items: center;
    gap: 12px;
    border: 1px solid @neutral-200;
    border-radius: 8px;
    background-color: @neutral-50;
    margin-bottom: 16px;
    padding: 12px 16px;
    width: 100%;
    box-sizing: border-box;
  }

  /* Chaque item occupe sa largeur */
  .toolbar__item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    grid-column: span 8;
    width: 100%; /* 💪 force la prise complète dans la colonne */
    box-sizing: border-box;

    &.toolbar__actions {
      justify-content: flex-start;
    }

    &.toolbar__role {
      justify-content: center;
    }
  }

  /* Les enfants internes doivent s’étirer */
  .toolbar__item > * {
    flex: 1 1 auto;
    min-width: 0;
  }

  /* 🎖️ Badge contenu */
  .badge-content {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
  }

  .role-icon {
    opacity: 0.85;
  }

  /* 📱 Responsive : 2 par ligne */
  @media screen and (max-width: 1200px) {
    .toolbar__item {
      grid-column: span 18; /* deux par ligne */
    }
  }

  /* 📱 Mobile : un seul par ligne */
  @media screen and (max-width: 800px) {
    .toolbar__item {
      grid-column: span 36;
    }

    .toolbar__role {
      justify-content: flex-start;
    }
  }
</style>
