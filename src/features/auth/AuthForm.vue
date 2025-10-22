<template>
  <div class="auth">
    <!-- 🧱 TITRE -->
    <BasicText
      size="h4"
      weight="bold"
      class="auth__title"
    >
      {{ titre }}
    </BasicText>

    <BasicText
      v-if="sousTitre"
      size="body-s"
      color="neutral-500"
      class="auth__subtitle"
    >
      {{ sousTitre }}
    </BasicText>

    <!-- 🧩 FORMULAIRE -->
    <div class="auth__form">
      <BasicInput
        v-model="email"
        placeholder="Email"
        input-type="form"
        size="medium"
        autocomplete="off"
        @input="error = ''"
      />

      <!-- Champ mot de passe seulement si besoin -->
      <BasicInput
        v-if="mode !== 'reset' && !modeMagicLink"
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Mot de passe"
        input-type="form"
        size="medium"
        autocomplete="off"
        :suffix-icon="showPassword ? 'eye-off' : 'eye'"
        @suffix-click="showPassword = !showPassword"
        @input="error = ''"
      />

      <!-- Bouton principal -->
      <BasicButton
        :label="labelBouton"
        type="primary"
        variant="filled"
        width="full"
        size="medium"
        :disabled="loading"
        :loading="loading"
        @click="handleSubmit"
      />

      <!-- 🔁 Basculer entre Magic Link et mot de passe -->
      <BasicButton
        v-if="mode === 'login'"
        :label="modeMagicLink ? 'Connexion avec mot de passe 🔑' : 'Connexion par lien magique ✉️'"
        width="full"
        size="small"
        @click="modeMagicLink = !modeMagicLink"
      />

      <!-- 🌍 Login via Provider -->
      <div
        v-if="mode === 'login'"
        class="auth__providers"
      >
        <BasicButton
          label="Continuer avec Google"
          variant="outlined"
          width="full"
          size="medium"
          icon="google"
          @click="auth.signInWithProvider('google')"
        />
        <BasicButton
          label="Continuer avec GitHub"
          variant="outlined"
          width="full"
          size="medium"
          icon="github"
          @click="auth.signInWithProvider('github')"
        />
      </div>

      <!-- 💬 Messages -->
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
    </div>

    <!-- 🔗 Liens contextuels -->
    <div class="auth__links">
      <RouterLink
        v-if="mode === 'login'"
        to="/auth/register"
      >
        Pas encore de compte ?
        <b>S’inscrire</b>
      </RouterLink>
      <RouterLink
        v-if="mode === 'register'"
        to="/auth/login"
      >
        Déjà inscrit ?
        <b>Se connecter</b>
      </RouterLink>
      <RouterLink
        v-if="mode === 'login'"
        to="/auth/reset-password"
      >
        Mot de passe oublié ?
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { supabase } from '@/services/supabaseClient'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from './useAuthStore'

  const props = defineProps<{
    mode: 'login' | 'register' | 'reset'
  }>()

  const auth = useAuthStore()
  const router = useRouter()

  // Champs
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const message = ref('')
  const loading = ref(false)
  const showPassword = ref(false)
  const modeMagicLink = ref(false) // 👈 toggle Magic Link

  // Libellés dynamiques
  const titre = computed(() => {
    switch (props.mode) {
      case 'login':
        return 'Connexion'
      case 'register':
        return 'Inscription'
      case 'reset':
        return 'Réinitialiser le mot de passe'
    }
  })

  const sousTitre = computed(() => {
    if (props.mode === 'login') return 'Bienvenue sur Fast Peptides 🔬'
    if (props.mode === 'register') return 'Créez un compte pour commencer'
    if (props.mode === 'reset') return 'Entrez votre e-mail pour recevoir un lien'
    return ''
  })

  const labelBouton = computed(() => {
    if (props.mode === 'login')
      return modeMagicLink.value ? 'Recevoir un lien magique' : 'Se connecter'
    if (props.mode === 'register') return 'S’inscrire'
    return 'Envoyer le lien'
  })

  // 🧠 Action principale selon le mode
  async function handleSubmit() {
    error.value = ''
    message.value = ''
    loading.value = true

    if (!email.value.includes('@')) {
      error.value = 'Adresse e-mail invalide.'
      loading.value = false
      return
    }

    try {
      if (props.mode === 'login') {
        if (modeMagicLink.value) {
          // 🔮 Connexion par lien magique
          const success = await auth.signInWithMagicLink(email.value)
          if (success) message.value = 'Vérifiez votre boîte e-mail pour le lien magique ✨'
          else error.value = auth.error ?? 'Impossible d’envoyer le lien.'
        } else {
          // 🔑 Connexion classique
          const success = await auth.signIn(email.value, password.value)
          if (success) {
            const redirect = router.currentRoute.value.query.redirect as string
            router.push(redirect || '/')
          } else error.value = auth.error ?? 'Email ou mot de passe incorrect.'
        }
      }

      if (props.mode === 'register') {
        const success = await auth.signUp(email.value, password.value)
        if (success) message.value = 'Vérifiez vos e-mails pour confirmer votre compte 📧'
        else error.value = auth.error ?? 'Inscription échouée.'
      }

      if (props.mode === 'reset') {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email.value, {
          redirectTo: `${window.location.origin}/auth/login`, // ✅ corrigé
        })
        if (err) error.value = err.message
        else message.value = 'Lien de réinitialisation envoyé ✅'
      }
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped lang="less">
  .auth {
    max-width: 380px;
    margin: 80px auto;
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

    &__providers {
      margin-top: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__error {
      color: @danger-600;
      margin-top: 10px;
    }

    &__message {
      margin-top: 10px;
    }

    &__links {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 14px;

      a {
        color: @primary-700;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  /* Animations */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>   