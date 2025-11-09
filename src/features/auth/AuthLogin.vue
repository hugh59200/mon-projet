<template>
  <div class="auth">
    <BasicText
      size="h4"
      weight="bold"
      class="auth__title"
    >
      Connexion
    </BasicText>

    <BasicText
      size="body-s"
      color="neutral-500"
      class="auth__subtitle"
    >
      Bienvenue sur Fast Peptides 🔬
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

      <WrapperInputPassword
        v-model="password"
        label="Mot de passe"
        placeholder="••••••••"
        required
        minStrength="weak"
        :alertLabel="errors.password"
        :touched="touched.password"
        @input="clear"
        @blur="validateField('password')"
      />

      <BasicButton
        label="Se connecter"
        variant="filled"
        :disabled="loading"
        :loading="loading"
        @click="submit"
      />

      <div class="auth__divider"><span>ou continuer avec</span></div>

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

      <div class="auth__feedback">
        <BasicText
          v-if="error"
          size="body-m"
          color="danger-400"
          class="auth__error"
          nbMaxLines="2"
        >
          {{ error }}
        </BasicText>
      </div>
    </div>

    <div class="auth__links">
      <RouterLink to="/auth/register">
        Pas encore de compte ?
        <b>S’inscrire</b>
      </RouterLink>
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

  const { email, password, errors, touched, validate, validateField } = useForm(true, 'weak')

  const error = ref('')
  const loading = ref(false)

  function clear() {
    error.value = ''
    auth.error = null
  }

  async function submit() {
    if (!validate('login')) return

    loading.value = true
    const success = await auth.signIn(email.value, password.value)
    loading.value = false

    if (!success) error.value = auth.error ?? 'Identifiants incorrects.'
  }

  async function provider(name: any) {
    loading.value = true
    await auth.signInWithProvider(name)
    loading.value = false
    if (auth.error) error.value = auth.error
  }
</script>

<style scoped lang="less">
  @import './AuthFormStyles.less';
</style>
