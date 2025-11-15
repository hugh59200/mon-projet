<template>
  <header class="profil-header">
    <ProfilAvatar
      v-model="avatar"
      @change="onAvatarChange"
    />

    <div class="profil-header__info">
      <BasicText
        size="h3"
        weight="bold"
        class="profil-header__name"
      >
        {{ name || 'Mon profil' }}
      </BasicText>

      <div class="profil-header__meta">
        <BasicText
          size="body-m"
          color="neutral-700"
        >
          {{ email }}
        </BasicText>

        <BasicText
          v-if="role"
          size="body-s"
          color="neutral-500"
          class="profil-header__role"
        >
          • {{ role }}
        </BasicText>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import ProfilAvatar from './ProfilAvatar.vue'

  defineProps<{
    name: string
    email: string
    role?: string
  }>()

  // avatar (URL base64 ou publique)
  const avatar = defineModel<string | null>('avatar')

  const emit = defineEmits(['change-avatar'])
  function onAvatarChange(file: File) {
    emit('change-avatar', file)
  }
</script>

<style scoped lang="less">
  .profil-header {
    display: flex;
    gap: var(--spacing-20);
    align-items: center;

    padding-bottom: var(--spacing-20);
    margin-bottom: var(--spacing-25);
    border-bottom: 1px solid var(--surface-divider);

    /* responsive */
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-5);
    }

    &__name {
      color: var(--text-title-contrast);
    }

    &__meta {
      display: flex;
      gap: var(--spacing-10);
      flex-wrap: wrap;
      color: var(--neutral-600);
    }
  }
</style>
