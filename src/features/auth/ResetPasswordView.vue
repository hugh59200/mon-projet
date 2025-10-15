<template>
  <div class="auth">
    <BasicText
      size="h5"
      weight="bold"
      class="auth__title"
    >
      Réinitialiser le mot de passe
    </BasicText>

    <form
      class="auth__form"
      @submit.prevent="reset"
    >
      <BasicInput
        v-model="email"
        placeholder="Votre email"
        input-type="form"
        size="medium"
        autocomplete="off"
      />

      <BasicButton
        label="Envoyer le lien"
        type="primary"
        variant="filled"
        width="full"
        size="medium"
        :disabled="loading"
      />

      <BasicText
        v-if="message"
        size="body-s"
        color="primary-600"
      >
        {{ message }}
      </BasicText>
      <BasicText
        v-if="error"
        size="body-s"
        color="red"
      >
        {{ error }}
      </BasicText>
    </form>
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
      redirectTo: `${window.location.origin}/login`,
    })

    loading.value = false
    if (err) error.value = err.message
    else message.value = 'Lien envoyé par e-mail ✅'
  }
</script>
