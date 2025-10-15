<template>
  <div class="auth">
    <BasicText
      size="h5"
      weight="bold"
      class="auth__title"
    >
      Connexion
    </BasicText>
    <form class="auth__form">
      <BasicInput
        v-model="email"
        placeholder="Email"
        input-type="form"
        size="medium"
        autocomplete="off"
      />
      <BasicInput
        v-model="password"
        placeholder="Mot de passe"
        input-type="form"
        size="medium"
        autocomplete="off"
      />
      <BasicButton
        label="Se connecter"
        type="primary"
        variant="filled"
        width="full"
        size="medium"
        :disabled="loading"
        @click="handleLogin"
      />
      <BasicText
        v-if="error"
        class="auth__error"
        size="body-s"
        color="red"
      >
        {{ error }}
      </BasicText>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from './useAuthStore'

  const auth = useAuthStore()
  const router = useRouter()

  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const error = ref('')

  async function handleLogin() {
    loading.value = true
    const success = await auth.signIn(email.value, password.value)
    loading.value = false
    if (success) {
      router.push('/')
    } else {
      error.value = auth.error ?? 'Échec de la connexion'
    }
  }
</script>

<style scoped lang="less">
  .auth {
    max-width: 360px;
    margin: 80px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    &__title {
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
  }
</style>
