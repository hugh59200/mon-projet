<template>
  <section class="dashboard-card center-content">
    <BasicText
      size="h4"
      weight="semibold"
    >
      📦 Gérer les commandes
    </BasicText>
    <p class="info-text">Accède à la liste complète des commandes clients.</p>
    <BasicButton
      label="Ouvrir la gestion des commandes"
      type="secondary"
      size="large"
      @click="$router.push('/admin/orders')"
    />
  </section>
</template>
