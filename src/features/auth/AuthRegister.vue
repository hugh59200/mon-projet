<template>
  <div class="auth">
    <h1 class="auth__title">Créer un compte</h1>
    <p class="auth__subtitle">
      Rejoignez Fast Peptides pour accéder à notre catalogue complet et à nos outils.
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
        minStrength="strong"
        :alertLabel="errors.password"
        :touched="touched.password"
        deletable
        @input="clear"
        @blur="validateField('password')"
      />

      <BasicButton
        label="S'inscrire"
        variant="filled"
        size="large"
        :disabled="loading"
        :loading="loading"
        @click="submit"
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
    </div>

    <div class="auth__links">
      <span>
        Vous avez déjà un compte ?
        <RouterLink to="/auth/login">Se connecter</RouterLink>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useForm } from './composables/useForm'
  import { useAuthStore } from './stores/useAuthStore'

  const auth = useAuthStore()
  const router = useRouter()

  // Validation 'strong' pour le mot de passe à l'inscription
  const { email, password, errors, touched, validate, validateField } = useForm(true, 'strong')

  const loading = ref(false)
  const error = ref('')

  function clear() {
    error.value = ''
    auth.clearError()
  }

  async function submit() {
    if (!validate('register')) return
    
    loading.value = true
    const success = await auth.signUp(email.value, password.value)
    loading.value = false

    if (!success) {
      // Message d'erreur plus générique et pro
      error.value = auth.error ?? "Une erreur est survenue lors de l'inscription."
      return
    }

    router.push('/auth/email-sent')
  }
</script>

<style scoped lang="less">
  @import './AuthFormStyles.less';
</style>
