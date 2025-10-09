<template>
  <footer>
    <BasicText
      size="body-m"
      color="neutral-500"
      @click="toggleModal = !toggleModal"
      pointer
      nb-max-lines="2"
    >
      Développement @akto 2025. Version : 1.0
    </BasicText>
    <BasicText
      v-if="!showChip()"
      size="body-m"
      color="neutral-500"
    >
      -
    </BasicText>
    <div
      v-else
      :class="`chip chip--${currentEnv}`"
    ></div>
    <BasicText
      size="body-m"
      color="neutral-500"
      @click="showCGU"
      pointer
      nb-max-lines="2"
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
          <vue-markdown
            :source="AktoVersion"
            class="footer__content scrollbar"
          />
        </template>
      </ModalComponent>
    </teleport>
  </footer>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import VueMarkdown from 'vue-markdown-render'
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { useAfficheCGU } from '../../cgu'
  import { markdown as AktoVersion } from './AktoVersion.md'
  import type { Environnements } from '@/features/application/shared/Environnements.types'

  const toggleModal = ref(false)
  const currentEnv = import.meta.env.VITE_ENV as Environnements

  const showChip = () => {
    return currentEnv === 'blue' || currentEnv === 'green'
  }

  const showCGU = () => {
    const dialog = useAfficheCGU()
    dialog.showDialog({ validationObligatoire: false })
  }
</script>

<style lang="less" scoped>
  @import './FooterApp.less';
</style>
