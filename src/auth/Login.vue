<template>
  <div class="login">
    <h1>Connexion</h1>
    <form @submit.prevent="handleLogin">
      <input
        v-model="username"
        placeholder="Nom d'utilisateur"
      />
      <input
        v-model="password"
        placeholder="Mot de passe"
        type="password"
      />
      <button type="submit">Se connecter</button>
    </form>
    <p
      v-if="error"
      class="error"
    >
      Identifiants incorrects
    </p>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from './auth'

  const router = useRouter()
  const auth = useAuthStore()

  const username = ref('')
  const password = ref('')
  const error = ref(false)

  async function handleLogin() {
    error.value = false
    const success = await auth.login(username.value, password.value)
    if (success) {
      router.push({ name: 'home' })
    } else {
      error.value = true
    }
  }
</script>

<style scoped>
  .login {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: auto;
    gap: 10px;
  }
  .error {
    color: red;
  }
</style>
