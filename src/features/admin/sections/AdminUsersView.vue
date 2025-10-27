<template>
  <section class="dashboard-card center-content">
    <BasicText
      size="h4"
      weight="semibold"
    >
      👤 Gérer les utilisateurs
    </BasicText>
    <p class="info-text">Ici tu peux gérer la liste des utilisateurs et leurs accès.</p>
    <BasicButton
      label="Ouvrir la gestion des utilisateurs"
      type="primary"
      size="large"
      @click="$router.push('/admin/users')"
    />
  </section>
</template>

<script setup lang="ts"></script>
