<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="callback"
    >
      <div class="callback__card">
        <BasicText
          size="h5"
          weight="bold"
        >
          {{ messageTitle }}
        </BasicText>
        <BasicText
          color="neutral-500"
          size="body-s"
        >
          {{ messageSubtitle }}
        </BasicText>

        <div
          class="callback__loader"
          v-if="loading"
        >
          <BasicLoader
            size="large"
            color="primary"
          />
        </div>

        <BasicButton
          v-else
          label="Retour à la connexion"
          type="primary"
          @click="router.push('/auth/login')"
        />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { supabase } from '@/services/supabaseClient'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from './useAuthStore'

  const router = useRouter()
  const route = useRoute()
  const auth = useAuthStore()

  const loading = ref(true)
  const visible = ref(true)
  const messageTitle = ref('Connexion sécurisée en cours 🔐')
  const messageSubtitle = ref('Fast Peptides vérifie votre compte, un instant…')

  onMounted(async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error

      if (data.session) {
        auth.user = data.session.user
        await auth.initAuth()

        // 🧭 Récupère redirection depuis sessionStorage ou query
        const savedRedirect = sessionStorage.getItem('redirectAfterOAuth')
        sessionStorage.removeItem('redirectAfterOAuth') // nettoyage

        const redirect =
          savedRedirect || (route.query.redirect as string) || (auth.isAdmin ? '/admin' : '/profil')

        // ⏳ petite pause + fade out avant redirection
        messageTitle.value = 'Connexion réussie ✅'
        messageSubtitle.value = 'Redirection vers votre espace...'
        await new Promise((resolve) => setTimeout(resolve, 400))
        visible.value = false
        await new Promise((resolve) => setTimeout(resolve, 400))
        router.replace(redirect)
      } else {
        throw new Error('Aucune session trouvée.')
      }
    } catch (err) {
      console.error('Erreur callback:', err)
      messageTitle.value = 'Échec de la connexion ❌'
      messageSubtitle.value =
        'Une erreur est survenue pendant la validation de votre compte. Veuillez réessayer.'
    } finally {
      loading.value = false
    }
  })
</script>

<style scoped lang="less">
  .callback {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
    text-align: center;

    &__card {
      background: @neutral-50;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
      max-width: 340px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px; // 👈 espacement doux entre éléments
      opacity: 0;
      animation: fadeIn 0.5s ease forwards;
    }

    &__loader {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  /* Animation fade transition */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.4s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* Animation apparition carte */
  @keyframes fadeIn {
    from {
      transform: translateY(12px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
