<template>
  <div class="auth">
    <h1 class="auth__title">Bon retour</h1>
    <p class="auth__subtitle">
      Connectez-vous pour accéder à votre espace et poursuivre vos recherches.
    </p>

    <div class="auth__form">
      <WrapperInput
        v-model.trim="email"
        label="Email professionnel"
        placeholder="nom@entreprise.com"
        inputmode="email"
        iconName="Mail"
        required
        :alertLabel="touched.email ? errors.email : ''"
        @input="clear"
        @blur="validateField('email')"
        deletable
      />

      <WrapperInputPassword
        v-model="password"
        label="Mot de passe"
        placeholder="••••••••"
        required
        :alertLabel="errors.password"
        :touched="touched.password"
        @input="clear"
        @blur="validateField('password')"
      />

      <BasicButton
        label="Se connecter"
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
        </transition>
      </div>

      <div class="auth__divider"><span>ou</span></div>

      <div class="auth__providers">
        <BasicSocialButton
          provider="google"
          @click="provider('google')"
        />
        <BasicSocialButton
          provider="github"
          @click="provider('github')"
        />
        <BasicSocialButton
          provider="facebook"
          @click="provider('facebook')"
        />
      </div>
    </div>

    <div class="auth__links">
      <span>
        Pas encore de compte ?
        <RouterLink to="/auth/register">Créer un compte</RouterLink>
      </span>
      <RouterLink to="/auth/reset-password">Mot de passe oublié ?</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import BasicSocialButton from './BasicSocialButton.vue'
  import { useForm } from './composables/useForm'
  import { useAuthStore } from './stores/useAuthStore'

  const auth = useAuthStore()
  // On n'a pas besoin de la validation "strong" pour le login, "weak" suffit (juste check si rempli)
  const { email, password, errors, touched, validate, validateField } = useForm(true, 'weak')

  const error = ref('')
  const loading = ref(false)

  function clear() {
    error.value = ''
    auth.error = null
  }

  async function submit() {
    // On valide juste que les champs ne sont pas vides
    if (!validate('login')) return

    loading.value = true
    const success = await auth.signIn(email.value, password.value)
    loading.value = false

    if (!success) error.value = auth.error ?? 'Email ou mot de passe incorrect.'
  }

  async function provider(name: any) {
    loading.value = true
    await auth.signInWithProvider(name)
    loading.value = false
    if (auth.error) error.value = auth.error
  }
</script>

<style scoped lang="less">
  /* On importe le nouveau fichier de style pro */
  @import './AuthFormStyles.less';
</style>
