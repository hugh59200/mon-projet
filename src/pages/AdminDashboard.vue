<template>
  <header>
    <span>Bonjour {{ auth.user?.email }}</span>

    <nav>
      <RouterLink to="/">Accueil</RouterLink>
      <RouterLink
        v-if="auth.isAdmin"
        to="/admin"
      >
        Admin
      </RouterLink>
      <button @click="auth.signOut">Déconnexion</button>
    </nav>
  </header>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/useAuthStore'
  const auth = useAuthStore()
</script>
<style scoped>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }

  nav a {
    margin-right: 1rem;
    text-decoration: none;
    color: #333;
  }

  nav a:hover {
    text-decoration: underline;
  }

  button {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    padding: 0;
    font: inherit;
  }

  button:hover {
    text-decoration: underline;
  }
</style>
