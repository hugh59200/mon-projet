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

        <transition name="fade">
          <div
            v-if="loading"
            class="callback__loader"
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
        </transition>
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

  // États locaux
  const loading = ref(true)
  const visible = ref(true)
  const messageTitle = ref('Connexion sécurisée en cours 🔐')
  const messageSubtitle = ref('Fast Peptides vérifie votre compte, un instant…')

  // ⏱️ Délai fluide pour transitions
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

  onMounted(async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error

      const session = data.session
      if (!session?.user) {
        messageTitle.value = 'Lien invalide ou expiré ❌'
        messageSubtitle.value =
          'Le lien de confirmation n’est plus valide. Veuillez recommencer la procédure.'
        loading.value = false
        return
      }

      // Vérifie si le mail est bien confirmé
      if (!session.user.email_confirmed_at) {
        messageTitle.value = 'Adresse e-mail non confirmée ⚠️'
        messageSubtitle.value =
          'Veuillez vérifier votre e-mail et cliquer sur le lien de confirmation avant de vous connecter.'
        await supabase.auth.signOut()
        loading.value = false
        return
      }

      // 🔐 Initialisation de la session valide
      auth.user = session.user
      await auth.initAuth()

      // Redirection après OAuth ou lien magique
      const savedRedirect = sessionStorage.getItem('redirectAfterOAuth')
      sessionStorage.removeItem('redirectAfterOAuth')

      const redirect =
        savedRedirect || (route.query.redirect as string) || (auth.isAdmin ? '/admin' : '/profil')

      messageTitle.value = 'Connexion réussie ✅'
      messageSubtitle.value = 'Redirection vers votre espace...'

      await wait(400)
      visible.value = false
      await wait(400)
      router.replace(redirect)
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
      gap: 16px;
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

  /* --- Transitions --- */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.4s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

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
