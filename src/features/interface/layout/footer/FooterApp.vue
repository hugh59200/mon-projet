<template>
  <footer>
    <BasicText
      size="body-m"
      @click="toggleModal = !toggleModal"
      pointer
      nbMaxLines="2"
    >
      Développement @akto 2025. Version : 1.0
    </BasicText>
    <BasicText size="body-m">-</BasicText>
    <BasicText
      size="body-m"
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
        <template #content>CGU contenu</template>
      </ModalComponent>
    </teleport>
  </footer>
</template>

<script setup lang="ts">
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { ref } from 'vue'
  import { useAfficheCGU } from '../../cgu'

  const toggleModal = ref(false)

  const showCGU = () => {
    const dialog = useAfficheCGU()
    dialog.showDialog({ validationObligatoire: false })
  }
</script>

<style lang="less" scoped>
  @import './FooterApp.less';
</style>
