<template>
  <ModalComponent
    v-if="store.dialogModel.visible"
    v-model="dialogModelVisible"
  >
    <template #header>Création d'un accès rapide</template>
    <template #content>
      <div class="flex flex-gap-4">
        <span
          class="color-chip"
          :class="`color-${store.dialogModel.routeName}`"
        ></span>
        <WrapperInput
          v-model="store.dialogModel.titre"
          label="Veuillez saisir un titre"
          placeholder="Titre de votre accès rapide"
          required
          deletable
        />
      </div>
    </template>
    <template #actions>
      <div class="flex flex-gap-4">
        <BasicButton
          type="secondary"
          size="large"
          label="Annuler"
          @click="store.close"
          class="flex-1"
        />
        <BasicButton
          size="large"
          label="Ajouter"
          @click="store.save"
          :disabled
          class="flex-1"
        />
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { useFavoriDialogStore } from './favoriDialogStore'
  import { useHideOnNavigate } from '../composables'

  const store = useFavoriDialogStore()

  const disabled = computed(() => {
    return store.dialogModel.visible && (!store.dialogModel.titre || store.dialogModel.titre.trim().length === 0)
  })

  const dialogModelVisible = defineModel<boolean>({
    get: () => store.dialogModel.visible,
    set: (value) => {
      if (!value) {
        store.close()
      }
    },
  })

  useHideOnNavigate(dialogModelVisible)
</script>
