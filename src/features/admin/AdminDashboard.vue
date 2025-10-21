<template>
  <div class="admin-dashboard">
    <BasicText
      size="h4"
      weight="bold"
    >
      Tableau de bord administrateur
    </BasicText>

    <div class="admin-dashboard__cards">
      <BasicButton
        label="👤 Gérer les utilisateurs"
        type="primary"
        size="large"
        @click="$router.push('/admin/users')"
      />
      <BasicButton
        label="📦 Gérer les commandes"
        type="secondary"
        size="large"
        @click="$router.push('/admin/orders')"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
  .admin-dashboard {
    max-width: 600px;
    margin: 60px auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 20px;

    &__cards {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
</style>
