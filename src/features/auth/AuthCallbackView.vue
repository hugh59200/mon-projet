<template>
  <div class="callback">
    <BasicText
      size="body-l"
      weight="regular"
    >
      Connexion en cours...
    </BasicText>
    <div class="callback__loader">
      <div
        class="dot"
        v-for="i in 3"
        :key="i"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from './useAuthStore'

  const auth = useAuthStore()
  const router = useRouter()

  onMounted(async () => {
    // Attendre que la session Supabase soit synchronisée
    await auth.initAuth()

    // Si l’utilisateur est connecté → redirige
    if (auth.isAuthenticated) {
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/')
    } else {
      router.push('/login')
    }
  })
</script>

<style scoped lang="less">
  .callback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 120px);
    gap: 20px;
    color: @primary-700;

    &__loader {
      display: flex;
      gap: 6px;

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: @primary-700;
        animation: bounce 1.2s infinite ease-in-out both;
      }

      .dot:nth-child(1) {
        animation-delay: -0.32s;
      }
      .dot:nth-child(2) {
        animation-delay: -0.16s;
      }
    }

    @keyframes bounce {
      0%,
      80%,
      100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }
  }
</style>
