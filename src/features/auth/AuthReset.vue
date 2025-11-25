<template>
  <div class="auth">
    <h1 class="auth__title">Mot de passe oublié ?</h1>
    <p class="auth__subtitle">
      Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de
      passe.
    </p>

    <div class="auth__form">
      <WrapperInput
        v-model.trim="email"
        label="Email"
        placeholder="nom@entreprise.com"
        inputmode="email"
        iconName="Mail"
        required
        :alertLabel="touched.email ? errors.email : ''"
        @input="clear"
        @blur="validateField('email')"
        deletable
      />

      <BasicButton
        label="Envoyer le lien de réinitialisation"
        variant="filled"
        size="large"
        :disabled="loading"
        :loading="loading"
        @click="submit"
        block
      />

      <div class="auth__feedback">
        <transition
          name="fade"
          mode="out-in"
        >
          <BasicText
            v-if="error"
            size="body-s"
            color="danger-500"
            class="auth__error"
          >
            {{ error }}
          </BasicText>
          <BasicText
            v-if="message"
            size="body-s"
            color="success-600"
            class="auth__message"
          >
            {{ message }}
          </BasicText>
        </transition>
      </div>
    </div>

    <div class="auth__links">
      <RouterLink
        to="/auth/login"
        class="link-back"
      >
        <BasicIconNext
          name="ArrowLeft"
          :size="14"
        />
        Retour à la connexion
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { supabase } from '@/supabase/supabaseClient'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
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
    clear()

    const { error: err } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/auth/update-password`, // Redirige vers une page dédiée
    })

    loading.value = false
    if (err) {
      error.value = "Impossible d'envoyer l'e-mail. Vérifiez l'adresse saisie."
    } else {
      message.value = 'Si un compte existe avec cet e-mail, vous recevrez bientôt un lien.'
      email.value = '' // On vide le champ pour éviter le spam
      // touched.email = false
    }
  }
</script>

<style scoped lang="less">
  @import './AuthFormStyles.less';

  /* Style spécifique pour le lien de retour */
  .link-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }
</style>
