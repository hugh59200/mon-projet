<template>
  <ModalComponent
    :closable="dialogClosable"
    v-model="visible"
  >
    <template #header>Conditions générales d'utilisation</template>
    <template #content>
      <div
        class="scroll-container"
        @scroll="onScroll"
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
      <div
        class="label-container"
        v-if="dialogClosable === false"
      >
        <BasicCheckbox
          v-model="checkedCGU"
          label="J'ai pris connaissance et j'accepte les conditions générales"
          :disabled="isScrollToBottom !== true"
        />
      </div>
    </template>
    <template #actions>
      <div class="justify-content-space-between flex">
        <BasicButton
          label="Télécharger les CGU"
          type="secondary"
          size="small"
          @click="pdfElem.download('cgu.pdf')"
          iconName="document-download"
          iconRight
          class="fixed-footer__imprimer fixed-footer__imprimer--desktop"
          :disabled="!canDownload"
        />
        <BasicButton
          label="Fermer"
          size="small"
          iconRight
          class="fixed-footer__imprimer fixed-footer__imprimer--desktop"
          :disabled="!estValide"
          @click="store.queryClose"
        />
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import { useDebounce } from '@/features/shared/tools'
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import ModalComponent from '../modal/ModalComponent.vue'
  import { useAfficheCGUStore } from './useAfficheCGUStore'

  const CGU_CURRENT_URI = Object.freeze(import.meta.env.VITE_CGU_URI)

  const store = useAfficheCGUStore()
  const { dialogClosable, dialogVisible } = storeToRefs(store)

  const checkedCGU = ref(false)
  const scrollElem = ref<HTMLDivElement>()
  const pdfElem = ref()
  const canDownload = ref(false)

  const isScrollToBottom = ref(false)
  const scrollWidth = ref<number>()
  const debounce = useDebounce(200)

  const estValide = computed(() => checkedCGU.value === true || dialogClosable.value === true)

  const onScroll = () => {
    debounce(() => {
      if (dialogClosable.value !== false) return
      if (isScrollToBottom.value) return

      const container = scrollElem.value!
      const currentY = container.scrollTop
      const maxY = container.scrollHeight - container.clientHeight - 50

      if (currentY >= maxY) {
        isScrollToBottom.value = true
      }
    })
  }

  // Force le calcul des proportions du pdf
  const onResize = () => {
    debounce(() => {
      if (!scrollElem.value) return
      const container = scrollElem.value
      if (!scrollWidth.value) {
        scrollWidth.value = container.clientWidth
        return
      }
      if (scrollWidth.value !== container.clientWidth) {
        scrollWidth.value = container.clientWidth
      }
    })
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
  })

  const visible = computed({
    get: () => dialogVisible.value,
    set: (_value) => store.queryClose(),
  })

  watch(
    () => visible.value,
    (value) => {
      if (!value) {
        isScrollToBottom.value = false
        checkedCGU.value = false
        scrollWidth.value = undefined
        canDownload.value = false
      }
    },
  )
</script>

<style lang="less" scoped>
  .scroll-container {
    overflow-y: auto;
    overflow-x: hidden;
    height: 50vh;
    width: 50vw;
    padding-right: 10px;
    margin-right: -10px;

    .loader-container {
      height: 51vh;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  @media (max-width: 1200px) {
    .scroll-container {
      width: 70vw;
    }
  }

  .label-container {
    padding: 30px 20px;
    align-items: end;
    display: flex;
    justify-content: end;

    :deep(.checkbox) {
      &.checkbox--disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
      .checkbox__label {
        span.text {
          font-weight: @font-weight-bold;
        }
      }
      .checkbox__icon {
        order: 1;
        margin-left: 8px;
      }
    }
  }
</style>
