<template>
  <footer>
    <BasicText
      size="body-l"
      @click="toggleModal = !toggleModal"
      pointer
      nbMaxLines="2"
    >
      Développement @Fast-Peptides 2025. Version : 1.0
    </BasicText>

    <BasicText size="body-m">-</BasicText>

    <BasicText
      size="body-l"
      @click="showCGU"
      pointer
      nbMaxLines="2"
    >
      Voir les conditions générales d'utilisation
    </BasicText>

    <teleport to="#app">
      <ModalComponent
        v-model="toggleModal"
        :overflow="false"
      >
        <template #header>VERSIONS STABLES DE L'OUTIL AKTO VERIF</template>

        <template #content>
          <MdPreview
            :model-value="FastPeptidesVersion"
            previewTheme="github"
            class="footer__content scrollbar"
          />
        </template>
      </ModalComponent>
    </teleport>
  </footer>
</template>

<script setup lang="ts">
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { MdPreview } from 'md-editor-v3'
  import 'md-editor-v3/lib/style.css'
  import { ref } from 'vue'
  import { useAfficheCGU } from '../../cgu'
  import FastPeptidesVersion from './FastPeptidesVersion.md?raw'

  const toggleModal = ref(false)

  const showCGU = () => {
    const dialog = useAfficheCGU()
    dialog.showDialog({ validationObligatoire: false })
  }
</script>

<style lang="less" scoped>
  @import './FooterApp.less';

  .footer__content {
    max-height: 60vh;
    overflow-y: auto;
    padding: 1rem;

    :deep(h1, h2, h3, h4) {
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }

    :deep(p) {
      margin-bottom: 0.75rem;
      line-height: 1.6;
    }
  }
</style>
