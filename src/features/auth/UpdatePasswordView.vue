<template>
  <section class="auth-page">
    <div class="auth">
      <BasicText
        size="h4"
        weight="bold"
        class="auth__title"
      >
        Nouveau mot de passe 🔐
      </BasicText>

      <BasicText
        size="body-s"
        color="neutral-500"
        class="auth__subtitle"
      >
        Choisissez un nouveau mot de passe pour accéder à votre compte.
      </BasicText>

      <form class="auth__form">
        <BasicInput
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Nouveau mot de passe"
          input-type="form"
          size="medium"
          autocomplete="off"
          :suffix-icon="showPassword ? 'eye-off' : 'eye'"
          @suffix-click="showPassword = !showPassword"
          @input="error = ''"
        />

        <BasicInput
          v-model="confirmPassword"
          :type="showConfirm ? 'text' : 'password'"
          placeholder="Confirmer le mot de passe"
          input-type="form"
          size="medium"
          autocomplete="off"
          :suffix-icon="showConfirm ? 'eye-off' : 'eye'"
          @suffix-click="showConfirm = !showConfirm"
          @input="error = ''"
        />

        <BasicButton
          label="Mettre à jour le mot de passe"
          type="primary"
          variant="filled"
          width="full"
          size="medium"
          :disabled="loading"
          :loading="loading"
          @click="updatePassword"
        />

        <transition name="fade">
          <BasicText
            v-if="error"
            class="auth__error"
            size="body-s"
            color="red"
          >
            {{ error }}
          </BasicText>
        </transition>

        <transition name="fade">
          <BasicText
            v-if="message"
            class="auth__message"
            size="body-s"
            color="primary-600"
          >
            {{ message }}
          </BasicText>
        </transition>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { supabase } from '@/services/supabaseClient'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const password = ref('')
  const confirmPassword = ref('')
  const showPassword = ref(false)
  const showConfirm = ref(false)
  const loading = ref(false)
  const error = ref('')
  const message = ref('')

  const router = useRouter()

  async function updatePassword() {
    error.value = ''
    message.value = ''

    if (password.value.length < 6) {
      error.value = 'Le mot de passe doit contenir au moins 6 caractères.'
      return
    }

    if (password.value !== confirmPassword.value) {
      error.value = 'Les mots de passe ne correspondent pas.'
      return
    }

    loading.value = true

    const { error: err } = await supabase.auth.updateUser({ password: password.value })
    loading.value = false

    if (err) {
      error.value = err.message
      return
    }

    message.value = 'Mot de passe mis à jour ✅'
    setTimeout(() => router.push('/login'), 1500)
  }
</script>

<style scoped lang="less">
  .auth-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 120px);
    background-color: @neutral-50;
  }

  .auth {
    max-width: 380px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    &__title {
      margin-bottom: 8px;
    }

    &__subtitle {
      margin-bottom: 24px;
    }

    &__form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
    }

    &__error {
      color: @danger-600;
      margin-top: 10px;
    }

    &__message {
      margin-top: 10px;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
