<template>
  <div class="auth">
    <BasicText
      size="h4"
      weight="bold"
      class="auth__title"
    >
      Réinitialiser le mot de passe
    </BasicText>

    <BasicText
      size="body-s"
      color="neutral-500"
      class="auth__subtitle"
    >
      Entrez votre e-mail pour recevoir un lien
    </BasicText>

    <div class="auth__form">
      <WrapperInput
        v-model.trim="email"
        label="Email"
        placeholder="exemple@domaine.com"
        inputmode="email"
        iconName="Mail"
        required
        :alertLabel="touched.email ? errors.email : ''"
        @input="clear"
        @blur="validateField('email')"
        deletable
      />

      <BasicButton
        label="Envoyer le lien"
        variant="filled"
        :disabled="loading"
        :loading="loading"
        @click="submit"
      />

      <div class="auth__feedback">
        <BasicText
          v-if="error"
          size="body-m"
          color="danger-400"
          class="auth__error"
        >
          {{ error }}
        </BasicText>

        <BasicText
          v-if="message"
          size="body-m"
          color="primary-600"
          class="auth__message"
        >
          {{ message }}
        </BasicText>
      </div>
    </div>

    <div class="auth__links">
      <RouterLink to="/auth/login">Retour à la connexion</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { supabase } from '@/supabase/supabaseClient'
  import { ref } from 'vue'
  import { useForm } from './composables/useForm'

  const { email, errors, touched, validate, validateField } = useForm(true, 'weak')

  const loading = ref(false)
  const error = ref('')
  const message = ref('')

  function clear() {
    error.value = ''
    message.value = ''
  }

  async function submit() {
    if (!validate('reset')) return
    loading.value = true

    const { error: err } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/auth/login`,
    })

    loading.value = false
    if (err) error.value = err.message
    else message.value = 'Lien envoyé ✅'
  }
</script>

<style scoped lang="less">
  @import './AuthFormStyles.less';
</style>
