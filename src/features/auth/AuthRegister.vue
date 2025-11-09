<template>
  <div class="auth">
    <BasicText
      size="h4"
      weight="bold"
      class="auth__title"
    >
      Inscription 🎉
    </BasicText>

    <BasicText
      size="body-s"
      color="neutral-500"
      class="auth__subtitle"
    >
      Créez votre compte pour rejoindre la communauté 🔗
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
        label="Créer mon compte"
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
      <RouterLink to="/auth/login">
        Déjà inscrit ?
        <b>Se connecter</b>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useForm } from './composables/useForm'
  import { useAuthStore } from './stores/useAuthStore'

  const auth = useAuthStore()

  const { email, password, errors, touched, validate, validateField } = useForm(true, 'weak')

  const loading = ref(false)
  const error = ref('')
  const message = ref('')

  function clear() {
    error.value = ''
    message.value = ''
    auth.error = null
  }

  async function submit() {
    if (!validate('register')) return

    loading.value = true
    const success = await auth.signUp(email.value, password.value)
    loading.value = false

    if (!success) {
      // ✅ reste sur la page
      error.value = auth.error ?? 'Inscription échouée.'
      return
    }

    message.value = 'Vérifiez vos e-mails pour confirmer votre compte 📧'
  }
</script>

<style scoped lang="less">
  @import './AuthFormStyles.less';
</style>
