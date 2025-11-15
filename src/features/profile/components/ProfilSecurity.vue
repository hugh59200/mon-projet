<template>
  <FilterSection
    title="Sécurité"
    v-model="open"
  >
    <div class="security">
      <!-- NEW PASSWORD -->
      <BasicInput
        v-model="localNewPassword"
        label="Nouveau mot de passe"
        input-type="form"
        type="password"
        placeholder="••••••••"
      />

      <!-- CONFIRM -->
      <BasicInput
        v-model="localConfirmPassword"
        label="Confirmez le mot de passe"
        input-type="form"
        type="password"
        placeholder="••••••••"
        :validation-state="passwordMismatch ? 'error' : undefined"
        icon-state="iconRight"
        icon-name="AlertTriangle"
        v-if="passwordMismatch"
      />

      <!-- ACTIONS -->
      <div class="security__actions">
        <BasicButton
          label="Mettre à jour le mot de passe"
          type="primary"
          variant="filled"
          width="full"
          :disabled="loading || passwordMismatch || isEmpty"
          @click="submit"
        />
      </div>

      <!-- DANGER ZONE -->
      <div class="security__danger">
        <BasicButton
          label="Supprimer mon compte"
          type="danger"
          variant="outlined"
          width="full"
          @click="emit('delete-account')"
        />
      </div>
    </div>
  </FilterSection>
</template>

<script setup lang="ts">
  import FilterSection from '@/features/shared/components/FilterSection.vue'
  import { computed, ref } from 'vue'

  /* Props */
  const props = defineProps<{
    loading?: boolean
    open?: boolean
  }>()

  /* Emits */
  const emit = defineEmits<{
    (e: 'update-password', payload: { password: string }): void
    (e: 'delete-account'): void
  }>()

  /* Section open */
  const open = defineModel<boolean>('open', { default: true })

  /* Local form state */
  const localNewPassword = ref('')
  const localConfirmPassword = ref('')

  /* Derived states */
  const passwordMismatch = computed(() => {
    return (
      localNewPassword.value.length > 0 &&
      localConfirmPassword.value.length > 0 &&
      localNewPassword.value !== localConfirmPassword.value
    )
  })

  const isEmpty = computed(() => !localNewPassword.value || !localConfirmPassword.value)

  /* On submit */
  function submit() {
    if (passwordMismatch.value || isEmpty.value) return

    emit('update-password', {
      password: localNewPassword.value,
    })

    localNewPassword.value = ''
    localConfirmPassword.value = ''
  }
</script>

<style scoped lang="less">
  .security {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-15);

    &__actions {
      margin-top: var(--spacing-10);
      display: flex;
    }

    &__danger {
      margin-top: var(--spacing-15);
      padding-top: var(--spacing-10);
      border-top: 1px solid var(--surface-divider);
    }
  }
</style>
