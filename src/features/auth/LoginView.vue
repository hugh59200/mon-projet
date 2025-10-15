<template>
  <div class="auth-container">
    <h2>Connexion</h2>

    <form @submit.prevent="login">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Mot de passe"
        required
      />

      <button
        type="submit"
        :disabled="auth.loading"
      >
        {{ auth.loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>

    <p
      v-if="auth.error"
      class="error"
    >
      {{ auth.error }}
    </p>

    <router-link to="/register">Créer un compte</router-link>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from './useAuthStore'

  const router = useRouter()
  const auth = useAuthStore()

  const email = ref('')
  const password = ref('')

  async function login() {
    const ok = await auth.signIn(email.value, password.value)
    if (ok) router.push('/')
  }
</script>

<style scoped>
  .auth-container {
    max-width: 400px;
    margin: 5rem auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  input {
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.6rem;
    border-radius: 4px;
    cursor: pointer;
  }
  .error {
    color: red;
    font-size: 0.9rem;
  }
</style>
