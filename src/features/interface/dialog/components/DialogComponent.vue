<template>
  <ModalComponent
    v-if="dialogModel.visible"
    v-model="dialogModelVisible"
    :closable="dialogModel.closable"
  >
    <template #content>
      <div class="flex-column flex-gap-4 flex">
        <img
          v-if="isCancelRetryOrError"
          class="image"
          src="@designSystem/fondation/img/modal-warning.svg?url"
        />
        <img
          v-else
          class="image"
          src="@designSystem/fondation/img/modal-success.svg?url"
        />
        <BasicText
          v-if="dialogModel.title"
          :class="['title', titleClass]"
          size="h3"
          weight="bold"
        >
          {{ dialogModel.title }}
        </BasicText>
      </div>
      <section class="content">
        <div
          v-for="(msg, index) in lignesMessage"
          :key="index"
        >
          <BasicText v-if="msg">
            <template v-if="dialogModel.isHtml">
              <span v-html="msg"></span>
            </template>
            <template v-else>
              {{ msg }}
            </template>
          </BasicText>
        </div>
      </section>
    </template>
    <template #actions>
      <PremiumButton
        v-for="action in actions"
        :key="action"
        type="secondary"
        size="lg"
        :label="wording.actions[action]"
        :variant="variantType(action)"
        @click="store.triggerUserAction(action)"
        width="full"
      />
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import { useDialogStore } from '@/features/interface/dialog/dialogStore'
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'
  import type { DialogResult } from '../types'
  import wording from './DialogComponent.json'

  const dialogModelVisible = defineModel<boolean>({
    get: () => dialogModel.value.visible,
    set: (value) => {
      if (!value) {
        store.triggerUserAction(null)
      }
    },
  })

  const store = useDialogStore()
  const { dialogModel } = storeToRefs(store)

  const variantType = (action: DialogResult) => {
    switch (action) {
      case 'Ok':
      case 'Yes':
      case 'Retry':
        return 'outline'
      case 'Cancel':
      case 'No':
        return 'solid'
    }
  }

  const actions = computed<Array<DialogResult>>(() => {
    switch (dialogModel.value.type) {
      case 'Ok':
        return ['Ok']
      case 'OkCancel':
        return ['Ok', 'Cancel']
      case 'YesNo':
        return ['Yes', 'No']
      case 'CancelRetry':
        return ['Retry', 'Cancel']
      case 'Error':
        return ['Ok']
    }
    return []
  })

  const titleClass = computed(() => {
    return isCancelRetryOrError.value ? 'title--warning' : 'title--success'
  })

  const lignesMessage = computed(() => {
    if (dialogModel.value.visible === false) {
      return null
    } else if (Array.isArray(dialogModel.value.message)) {
      return dialogModel.value.message
    } else {
      return [dialogModel.value.message]
    }
  })

  const isCancelRetryOrError = computed(() =>
    ['Error', 'CancelRetry'].includes(dialogModel.value.type ?? 'Ok'),
  )
</script>

<style scoped>
  @import './DialogComponent.less';
</style>
