<template>
  <div class="auth-container">
    <h2>Mot de passe oublié</h2>

    <form @submit.prevent="reset">
      <input
        v-model="email"
        type="email"
        placeholder="Votre email"
        required
      />
      <button
        type="submit"
        :disabled="loading"
      >
        {{ loading ? 'Envoi...' : 'Envoyer un lien de réinitialisation' }}
      </button>
    </form>

    <p
      v-if="error"
      class="error"
    >
      {{ error }}
    </p>
    <p
      v-if="message"
      class="success"
    >
      {{ message }}
    </p>

    <router-link :to="{ name: 'login' }">Retour à la connexion</router-link>
  </div>
</template>

<script setup lang="ts">
  import { supabase } from '@/services/supabaseClient'
  import { ref } from 'vue'

  const email = ref('')
  const loading = ref(false)
  const message = ref('')
  const error = ref<string | null>(null)

  async function reset() {
    loading.value = true
    error.value = null
    message.value = ''
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: window.location.origin + '/login',
    })
    loading.value = false

    if (err) error.value = err.message
    else message.value = 'Lien de réinitialisation envoyé par email ✅'
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
