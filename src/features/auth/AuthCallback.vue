<template>
  <div class="callback-wrapper">
    <div
      class="callback-card"
      v-motion="cardMotion"
    >
      <!-- ✅ LOADING -->
      <div
        v-if="state === 'loading'"
        class="state-block"
        v-motion="fadeIn"
      >
        <BasicLoader
          size="large"
          color="primary"
        />

        <BasicText
          size="h4"
          weight="bold"
          color="neutral-900"
        >
          Connexion sécurisée 🔐
        </BasicText>
        <BasicText
          size="body-m"
          color="neutral-600"
        >
          Fast Peptides vérifie votre compte.
          <br />
          Un instant…
        </BasicText>
      </div>

      <!-- ✅ SUCCESS -->
      <div
        v-else-if="state === 'success'"
        class="state-block"
        v-motion="fadeInPop"
      >
        <BasicIconNext
          name="CheckCircle2"
          :size="82"
          color="success-600"
        />
        <BasicText
          size="h4"
          weight="bold"
          color="success-700"
        >
          Compte vérifié ✅
        </BasicText>
        <BasicText
          size="body-m"
          color="neutral-600"
        >
          Bienvenue sur Fast Peptides,
          <br />
          redirection en cours…
        </BasicText>
      </div>

      <!-- ✅ ERROR -->
      <div
        v-else
        class="state-block"
        v-motion="fadeIn"
      >
        <BasicIconNext
          name="AlertTriangle"
          :size="74"
          color="danger-600"
        />
        <BasicText
          size="h4"
          weight="bold"
          color="danger-700"
        >
          Vérification impossible ❌
        </BasicText>
        <BasicText
          size="body-m"
          color="neutral-600"
          class="error-message"
        >
          {{ errorMessage }}
        </BasicText>

        <BasicButton
          label="Se reconnecter"
          variant="filled"
          color="danger"
          size="large"
          @click="$router.push('/auth/login')"
        />

        <BasicButton
          v-if="email"
          label="Renvoyer l’e-mail de confirmation"
          variant="ghost"
          color="primary"
          size="medium"
          @click="resendEmail"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { supabase } from '@/supabase/supabaseClient'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicLoader from '@designSystem/components/basic/loader/BasicLoader.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import type { EmailOtpType } from '@supabase/supabase-js'
  import { nextTick, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from './stores/useAuthStore'

  // ✅ UI state
  const state = ref<'loading' | 'success' | 'error'>('loading')
  const errorMessage = ref('')
  const email = ref<string | null>(null)

  // ✅ Router/Auth
  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()

  /* --- Motions --- */
  const fadeIn = {
    initial: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.28 } },
  }
  const fadeInPop = {
    initial: { opacity: 0, scale: 0.6 },
    enter: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 120 },
    },
  }
  const cardMotion = {
    initial: { opacity: 0, scale: 0.94 },
    enter: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.25 },
    },
  }

  /* --- Helper d’erreurs --- */
  function mapOtpError(error: any): string {
    const msg = (error.message || '').toLowerCase()
    if (msg.includes('expired')) return 'Ce lien a expiré.'
    if (msg.includes('invalid')) return 'Ce lien est invalide.'
    if (msg.includes('mismatch')) return "Ce lien n'est pas associé à cet e-mail."
    return 'Impossible de vérifier votre compte.'
  }

  /* --- Renvoi email de confirmation --- */
  async function resendEmail() {
    if (!email.value) return
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    errorMessage.value = error ? mapOtpError(error) : '✅ Un nouvel e-mail vient d’être envoyé.'
  }

  /* --- Vérification OTP --- */
  onMounted(async () => {
    const token = route.query.token as string | null
    const type = route.query.type as EmailOtpType | null
    const mail = route.query.email as string | null
    email.value = mail

    if (!token || !type || !mail) {
      state.value = 'error'
      errorMessage.value = 'Lien incomplet ou invalide.'
      return
    }

    const { error: otpError } = await supabase.auth.verifyOtp({ token, type, email: mail })
    if (otpError) {
      state.value = 'error'
      errorMessage.value = mapOtpError(otpError)
      return
    }

    const { data: refreshed } = await supabase.auth.getUser()
    if (!refreshed.user) {
      state.value = 'error'
      errorMessage.value = "Impossible d'authentifier votre compte."
      return
    }

    auth.user = refreshed.user
    await auth.fetchProfile()

    state.value = 'success'

    await nextTick()
    setTimeout(() => {
      router.replace(auth.isAdmin ? '/admin' : '/profil')
    }, 1100)
  })
</script>

<style scoped lang="less">
  .callback-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .callback-card {
    width: 440px;
    background: #fff;
    padding: 56px 42px;
    border-radius: 22px;
    box-shadow: 0 8px 26px rgba(15, 23, 42, 0.12);
    text-align: center;
  }

  .state-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
  }

  .error-message {
    max-width: 260px;
    margin: 0 auto;
    line-height: 1.45;
    margin-bottom: 6px;
  }
</style>
