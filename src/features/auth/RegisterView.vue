<template>
  <div class="auth-container">
    <h2>Créer un compte</h2>

    <form @submit.prevent="register">
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
        {{ auth.loading ? 'Création...' : 'S’inscrire' }}
      </button>
    </form>

    <p
      v-if="auth.error"
      class="error"
    >
      {{ auth.error }}
    </p>

    <router-link to="/login">Déjà un compte ? Se connecter</router-link>
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

  async function register() {
    const ok = await auth.signUp(email.value, password.value)
    if (ok) router.push('/login')
  }
</script>

<style scoped>
  .auth-container {
    max-width: 400px;
    margin: 6rem auto;
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
    border: none;
    color: white;
    padding: 0.7rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .error {
    color: red;
    font-size: 0.9rem;
  }

  .success {
    color: green;
    font-size: 0.9rem;
  }
</style>
