<template>
  <FilterSection
    title="Préférences"
    v-model="open"
  >
    <div class="prefs">
      <!-- SWITCHES -->
      <div class="prefs__switches">
        <BasicCheckbox
          v-model="newsletter"
          label="Recevoir les newsletters"
        />
        <BasicCheckbox
          v-model="smsAlerts"
          label="Recevoir les alertes SMS"
        />
      </div>

      <!-- THEME -->
      <ThemeAppearance />

      <!-- ACTION -->
      <div class="prefs__action">
        <BasicButton
          label="Sauvegarder mes préférences"
          type="secondary"
          variant="filled"
          width="full"
          @click="$emit('save')"
        />
      </div>
    </div>
  </FilterSection>
</template>

<script setup lang="ts">
  import FilterSection from '@/features/shared/components/FilterSection.vue'
  import ThemeAppearance from '@/themes/components/ThemeAppearance.vue'

  // Props
  const props = defineProps<{
    newsletter: boolean
    smsAlerts: boolean
  }>()

  // v-model
  const open = defineModel<boolean>('open', { default: true })
  const newsletter = defineModel<boolean>('newsletter')
  const smsAlerts = defineModel<boolean>('smsAlerts')

  // Emit
  defineEmits(['save'])
</script>

<style scoped lang="less">
  .prefs {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-20);

    /* Switch wrapper */
    &__switches {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-10);
    }

    /* Save button */
    &__action {
      margin-top: var(--spacing-10);
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
