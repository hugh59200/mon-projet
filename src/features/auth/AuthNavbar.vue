<template>
  <nav class="auth-navbar">
    <div class="auth-navbar__left">
      <BasicText
        size="body-l"
        weight="bold"
      >
        mon site
      </BasicText>
    </div>

    <div class="auth-navbar__right">
      <!-- Utilisateur connecté -->
      <template v-if="auth.user">
        <BasicText
          size="body-m"
          class="auth-navbar__email"
        >
          {{ auth.user.email }}
        </BasicText>
        <BasicButton
          label="Mon profil"
          type="secondary"
          @click="$router.push('/profil')"
        />
        <BasicButton
          label="Se déconnecter"
          type="secondary"
          variant="outlined"
          size="small"
          @click="handleLogout"
        />
      </template>

      <!-- Non connecté -->
      <template v-else>
        <BasicButton
          label="Connexion"
          type="primary"
          variant="filled"
          size="small"
          @click="router.push('/login')"
        />
        <BasicButton
          label="Inscription"
          type="reverse"
          variant="outlined"
          size="small"
          @click="router.push('/register')"
        />
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useAuthStore } from './useAuthStore'

  const router = useRouter()
  const auth = useAuthStore()

  async function handleLogout() {
    await auth.signOut()
    router.push('/login')
  }
</script>

<style scoped lang="less">
  .auth-navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    background-color: @secondary-800;
    color: white;

    &__left {
      display: flex;
      align-items: center;
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    &__email {
      margin-right: 12px;
      color: @neutral-100;
    }
  }
</style>
