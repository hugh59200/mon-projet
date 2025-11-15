<template>
  <section class="ppi">
    <header
      class="ppi__header"
      @click="toggle"
    >
      <BasicText
        size="body-m"
        weight="semibold"
        class="ppi__title"
      >
        Informations personnelles
      </BasicText>

      <BasicIconNext
        :name="open ? 'ChevronUp' : 'ChevronDown'"
        :size="18"
        class="ppi__chevron"
        :class="{ 'is-open': open }"
      />
    </header>

    <div
      v-show="open"
      class="ppi__content"
    >
      <BasicInput
        v-model="fullNameModel"
        label="Nom complet"
        placeholder="Votre nom"
        input-type="form"
      />

      <BasicInput
        v-model="phoneModel"
        label="Téléphone"
        placeholder="+33..."
        input-type="form"
      />

      <BasicInput
        v-model="addressModel"
        label="Adresse"
        placeholder="12 rue du Peptide"
        input-type="form"
      />

      <div class="ppi__actions">
        <BasicButton
          label="Enregistrer les modifications"
          type="primary"
          variant="filled"
          :disabled="loading"
          @click="$emit('submit')"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicInput from '@designSystem/components/basic/input/BasicInput.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { computed } from 'vue'

  /* ---- Props ---- */
  const props = withDefaults(
    defineProps<{
      fullName: string
      phone: string
      address: string
      loading?: boolean
      open?: boolean
    }>(),
    {
      loading: false,
      open: true,
    },
  )

  /* ---- Emits / v-model ---- */
  const emit = defineEmits([
    'update:open',
    'update:fullName',
    'update:phone',
    'update:address',
    'submit',
  ])

  /* open */
  const open = computed({
    get: () => props.open,
    set: (v) => emit('update:open', v),
  })

  function toggle() {
    open.value = !open.value
  }

  /* fullName */
  const fullNameModel = computed({
    get: () => props.fullName,
    set: (v) => emit('update:fullName', v),
  })

  /* phone */
  const phoneModel = computed({
    get: () => props.phone,
    set: (v) => emit('update:phone', v),
  })

  /* address */
  const addressModel = computed({
    get: () => props.address,
    set: (v) => emit('update:address', v),
  })
</script>

<style scoped lang="less">
  .ppi {
    background: var(--surface-2);
    border: 1px solid var(--surface-border);
    border-radius: var(--radius-l);
    box-shadow: var(--surface-elevated-shadow);
    transition: var(--transition-medium);
    overflow: hidden;

    &:hover {
      border-color: var(--surface-border-strong);
    }

    /* HEADER */
    &__header {
      padding: 16px 20px;
      background: var(--surface-3);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
      transition: var(--transition-fast);

      &:hover {
        background: var(--surface-hover);
      }

      &:active {
        background: var(--surface-active);
      }
    }

    &__title {
      color: var(--text-title-contrast);
    }

    &__chevron {
      transition:
        transform 0.3s ease,
        opacity 0.2s ease;
      opacity: 0.75;

      &.is-open {
        transform: rotate(180deg);
      }

      &:hover {
        opacity: 1;
      }
    }

    /* CONTENT */
    &__content {
      padding: 20px 22px 26px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      background: var(--surface-1);
      border-top: 1px solid var(--surface-border);
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
    }
  }
</style>
