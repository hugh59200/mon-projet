<template>
  <div class="callback-page">
    <div
      v-if="state === 'loading'"
      class="status-block"
      v-motion-fade
    >
      <BasicLoader
        size="large"
        color="primary"
      />
      <h2 class="status-title">Connexion sécurisée 🔐</h2>
      <p class="status-text">Fast Peptides vérifie vos accès...</p>
    </div>
    <div
      v-else-if="state === 'success'"
      class="status-block"
      v-motion-pop
    >
      <BasicIconNext
        name="CheckCircle2"
        :size="64"
        color="success-600"
      />
      <h2 class="status-title text-success">Connexion réussie !</h2>
      <p class="status-text">{{ message }}</p>
    </div>
    <div
      v-else
      class="status-block"
      v-motion-fade
    >
      <BasicIconNext
        name="AlertTriangle"
        :size="64"
        color="danger-600"
      />
      <h2 class="status-title text-danger">Lien invalide</h2>
      <p class="status-text error-msg">{{ errorMessage }}</p>
      <BasicButton
        label="Retour à la connexion"
        color="primary"
        class="mt-4"
        @click="$router.push('/auth/login')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { supabase } from '@/supabase/supabaseClient'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicLoader from '@designSystem/components/basic/loader/BasicLoader.vue'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from './stores/useAuthStore'

  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()

  const state = ref<'loading' | 'success' | 'error'>('loading')
  const message = ref('')
  const errorMessage = ref('')

  onMounted(async () => {
    // 1️⃣ Cas OAuth (Google, etc.) : code dans l'URL
    const code = route.query.code as string | undefined
    if (code) {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) return handleSuccess(data.session.user)
    }

    // 2️⃣ Cas Email Links (Signup / Reset Password) : token_hash + type
    // Lit la valeur du jeton à partir de 'token_hash' (nouveau format) ou 'token' (ancien)
    const token = (route.query.token_hash as string) || (route.query.token as string)
    const type = route.query.type as any

    if (token && type) {
      console.log(`Tentative de vérification OTP: ${token}, ${type}`)
      // Utilisation de verifyOtp (méthode Supabase attendue pour la vérification)
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type,
      })
      console.log(error)
      if (error) {
        // Si le jeton est mauvais maintenant, c'est qu'il est expiré.
        fail(type === 'recovery' ? 'Ce lien a expiré.' : 'Lien de validation invalide.')
        return
      }
      // Session active après verifyOtp
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) return handleSuccess(data.session.user)
    }

    // 3️⃣ Cas Fallback : Déjà connecté ?
    const { data } = await supabase.auth.getSession()
    if (data.session?.user) return handleSuccess(data.session.user)

    // ❌ Échec
    fail('Aucune session trouvée. Veuillez vous reconnecter.')
  })

  function handleSuccess(user: any) {
    auth.user = user
    auth.fetchProfile().then(() => {
      state.value = 'success'
      message.value = `Bienvenue ${user.email}`

      // Redirection intelligente
      const redirectUrl =
        sessionStorage.getItem('redirectAfterOAuth') || (auth.isAdmin ? '/admin' : '/profil')
      sessionStorage.removeItem('redirectAfterOAuth')

      setTimeout(() => router.replace(redirectUrl), 1500)
    })
  }

  function fail(msg: string) {
    state.value = 'error'
    errorMessage.value = msg
  }
</script>

<style scoped>
  .callback-page {
    text-align: center;
    width: 100%;
  }
  .status-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .status-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  .status-text {
    color: #64748b;
    font-size: 1rem;
  }
  .error-msg {
    color: #ef4444;
    max-width: 300px;
  }
  .text-success {
    color: #059669;
  }
  .text-danger {
    color: #dc2626;
  }
  .mt-4 {
    margin-top: 24px;
  }
</style>
