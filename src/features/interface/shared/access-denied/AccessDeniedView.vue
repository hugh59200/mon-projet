<template>
  <div class="access-denied">
    <div class="content">
      <div class="section">
        <img
          class="image"
          src="@designSystem/fondation/img/modal-warning.svg?url"
        />
        <BasicText size="h3">Accès refusé</BasicText>
        <BasicText size="h5">
          Vous n'avez pas les droits nécessaires pour accéder à cette page.
        </BasicText>
        <BasicText>
          Veuillez contacter votre administrateur du référentiel d'entreprise pour obtenir les
          permissions correspondantes.
        </BasicText>
        <BasicLink
          label="Retour à la page d'accueil"
          @link-click="routeAccueil"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import router from '@/router'

  const routeAccueil = () => {
    router.replace('/')
  }
</script>
<style lang="less" scoped>
  .access-denied {
    display: grid;
    align-items: center;
    justify-items: center;
    grid-template-columns: 1fr;
    grid-template-rows: 80vh;
    .content {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 30vw;
      padding: 28px;
      background-color: white;
      border-radius: 24px;
      .image {
        max-width: 15vw;
        padding: 0 12px 24px 12px;
      }
    }
  }
</style>
