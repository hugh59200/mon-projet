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
  footer {
    background-color: @secondary-700;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 0 16px;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);

    &__content {
      max-height: 660px;
      overflow: scroll;
    }

    .chip {
      height: 12px;
      width: 12px;
      border-radius: 50%;
      &--green {
        background-color: @persian-600;
      }
      &--blue {
        background-color: @blue-600;
      }
    }
  }

  @media screen and (max-width: 720px) {
    footer :deep(.text) {
      font-size: 10px;
    }
  }

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
