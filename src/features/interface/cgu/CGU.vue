<template>
  <ModalComponent
    v-model="visible"
    :closable="true"
  >
    <template #header>Conditions générales d'utilisation</template>
    <template #content>
      <div
        class="scroll-container"
        ref="scrollElem"
      >
        <div
          v-if="!canDownload"
          class="loader-container"
        >
          <BasicLoader />
        </div>
        <VuePdfEmbed
          class="pdf"
          :source="CGU_CURRENT_URI"
          :width="scrollWidth"
          @rendered="canDownload = true"
          ref="pdfElem"
        />
      </div>
    </template>

    <template #actions>
      <div class="justify-content-space-around flex">
        <BasicButton
          label="Télécharger les CGU"
          type="secondary"
          size="small"
          @click="pdfElem.download('cgu.pdf')"
          iconName="add"
          iconRight
          :disabled="!canDownload"
        />
        <BasicButton
          label="Fermer"
          size="small"
          @click="store.queryClose"
        />
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import cguPdf from '@/assets/legal/cgu.pdf'
  import { useDebounce } from '@/features/shared/tools'
  import { storeToRefs } from 'pinia'
  import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
  import ModalComponent from '../modal/ModalComponent.vue'
  import { useAfficheCGUStore } from './useAfficheCGUStore'

  const VuePdfEmbed = defineAsyncComponent(() => import('vue-pdf-embed'))
  const CGU_CURRENT_URI = cguPdf
  const store = useAfficheCGUStore()
  const { dialogVisible } = storeToRefs(store)

  const pdfElem = ref()
  const scrollElem = ref<HTMLDivElement>()
  const scrollWidth = ref<number>()
  const canDownload = ref(false)
  const debounce = useDebounce(200)

  const onResize = () => {
    debounce(() => {
      if (!scrollElem.value) return
      const width = scrollElem.value.clientWidth
      if (scrollWidth.value !== width) scrollWidth.value = width
    })
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  const visible = computed({
    get: () => dialogVisible.value,
    set: () => store.queryClose(),
  })
</script>

<style scoped lang="less">
  .scroll-container {
    overflow-y: auto;
    .loader-container {
      height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
