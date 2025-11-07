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
      <WrapperInput
        v-model.trim="email"
        placeholder="Email"
        inputmode="email"
        label="Email"
        required
        :hint="hintEmail"
        iconName="Mail"
        :alertLabel="touched.email ? errors.email : ''"
        @input="clearMessages"
        @blur="validateField('email')"
        deletable
      />

      <WrapperInputPassword
        v-if="mode !== 'reset' && !modeMagicLink"
        v-model="password"
        label="Mot de passe"
        placeholder="••••••••"
        required
        :hint="hintPassword"
        :minStrength="mode === 'register' ? 'medium' : 'weak'"
        :alertLabel="errors.password"
        :touched="touched.password"
        @input="clearMessages"
        @blur="validateField('password')"
      />

      <!-- ✅ Bouton principal -->
      <BasicButton
        :label="labelBouton"
        variant="filled"
        width="full"
        size="medium"
        :disabled="loading"
        :loading="loading"
        @click="handleSubmit"
      />

      <!-- 🔁 Lien magique -->
      <button
        v-if="mode === 'login'"
        class="auth__magic"
        type="button"
        @click="toggleMagicLink"
      >
        {{ modeMagicLink ? 'Connexion avec mot de passe 🔑' : 'Connexion par lien magique ✉️' }}
      </button>

      <!-- 🌍 Providers -->
      <template v-if="mode === 'login'">
        <div class="auth__divider"><span>ou continuer avec</span></div>

        <div class="auth__providers">
          <!-- ✅ Bouton Google -->
          <div class="provider-wrapper">
            <GoogleSignInButton
              :one-tap="false"
              type="standard"
              theme="filled_blue"
              size="large"
              text="signin_with"
              shape="pill"
              logo-alignment="center"
              locale="fr"
              @success="handleGoogle"
              @error="handleGoogleError"
            />
          </div>

          <!-- ✅ Bouton GitHub Pro -->
          <button
            class="github-btn"
            :disabled="loading"
            @click="handleProviderLogin('github')"
          >
            <svg
              viewBox="0 0 24 24"
              class="github-icon"
            >
              <path
                fill="currentColor"
                d="M12 .297a12 12 0 0 0-3.797 23.406c.6.111.82-.258.82-.577v-2.17c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.304 3.492.997.108-.775.417-1.305.76-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.53 11.53 0 0 1 6.003 0c2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.236 1.911 1.236 3.221 0 4.61-2.806 5.624-5.479 5.921.43.372.813 1.103.813 2.224v3.293c0 .323.218.694.825.576A12 12 0 0 0 12 .297z"
              />
            </svg>

            <span v-if="!loading">Se connecter avec GitHub</span>
            <span v-else>Chargement...</span>
          </button>
        </div>
      </template>

      <!-- 💬 Messages globaux -->
      <transition name="fade">
        <BasicText
          v-if="error"
          class="auth__error"
          size="body-s"
          color="danger-400"
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
        🎉
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
  import { supabase } from '@/supabase/supabaseClient'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { GoogleSignInButton } from 'vue3-google-signin'
  import { useForm } from './composables/useForm'
  import { useAuthStore, type Providers } from './stores/useAuthStore'

  type Mode = 'login' | 'register' | 'reset'
  const props = defineProps<{ mode: Mode }>()

  const auth = useAuthStore()
  const router = useRouter()
  const { email, password, errors, validate, validateField, touched } = useForm()

  const hintEmail = 'exemple@domaine.com'
  const hintPassword = '8 caractères minimum'

  const error = ref('')
  const message = ref('')
  const loading = ref(false)
  const modeMagicLink = ref(false)

  const providers = [{ name: 'github', label: 'GitHub', icon: 'github' }]

  // 🧠 Textes
  const titre = computed(() => {
    switch (props.mode) {
      case 'login':
        return 'Connexion'
      case 'register':
        return 'Inscription 🎉'
      case 'reset':
        return 'Réinitialiser le mot de passe'
    }
  })

  const sousTitre = computed(() => {
    switch (props.mode) {
      case 'login':
        return 'Bienvenue sur Fast Peptides 🔬'
      case 'register':
        return 'Créez votre compte pour rejoindre la communauté 🔗'
      case 'reset':
        return 'Entrez votre e-mail pour recevoir un lien'
      default:
        return ''
    }
  })

  const labelBouton = computed(() =>
    props.mode === 'login'
      ? modeMagicLink.value
        ? 'Recevoir un lien magique'
        : 'Se connecter'
      : props.mode === 'register'
        ? 'Créer mon compte'
        : 'Envoyer le lien',
  )

  function clearMessages() {
    error.value = ''
    message.value = ''
    auth.error = null
  }

  function toggleMagicLink() {
    modeMagicLink.value = !modeMagicLink.value
    clearMessages()
  }

  // ✅ Google
  async function handleGoogle(response: any) {
    const success = await auth.signInWithGoogleIdToken(response.credential)
    if (!success) error.value = auth.error ?? 'Connexion Google échouée'
  }
  function handleGoogleError() {
    error.value = 'Erreur Google, réessayez.'
  }

  // ✅ Provider GitHub
  async function handleProviderLogin(provider: Providers) {
    clearMessages()
    loading.value = true
    try {
      await auth.signInWithProvider(provider)
      if (!auth.error) {
        await router.replace({ path: '/auth/login', query: { success: Date.now().toString() } })
      } else {
        error.value = auth.error ?? 'Connexion échouée.'
      }
    } finally {
      loading.value = false
    }
  }

  // ✅ Soumission classique
  async function handleSubmit() {
    clearMessages()
    const isValid = validate(props.mode)
    if (!isValid) {
      touched.value.email = true
      touched.value.password = true
      return
    }

    loading.value = true
    try {
      if (props.mode === 'login') {
        if (modeMagicLink.value) {
          const success = await auth.signInWithMagicLink(email.value)
          message.value = success
            ? 'Vérifiez votre boîte e-mail pour le lien magique ✨'
            : (auth.error ?? 'Impossible d’envoyer le lien.')
        } else {
          const success = await auth.signIn(email.value, password.value)
          if (success) {
            await router.replace({ path: '/auth/login', query: { success: Date.now().toString() } })
          } else {
            error.value = auth.error ?? 'Email ou mot de passe incorrect.'
          }
        }
      }

      if (props.mode === 'register') {
        const success = await auth.signUp(email.value, password.value)
        message.value = success
          ? 'Vérifiez vos e-mails pour confirmer votre compte 📧'
          : (auth.error ?? 'Inscription échouée.')
      }

      if (props.mode === 'reset') {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email.value, {
          redirectTo: `${window.location.origin}/auth/login`,
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
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    animation: fadeIn 0.5s ease;

    &__title {
      margin-bottom: 8px;
      font-weight: 700;
    }

    &__subtitle {
      margin-bottom: 32px;
      color: @neutral-500;
    }

    &__form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 24px;
      animation: fadeInUp 0.4s ease forwards;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    &__magic {
      background: none;
      border: none;
      color: @primary-700;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      margin-top: -2px;
      transition: color 0.2s ease;
      &:hover {
        color: darken(@primary-700, 5%);
        text-decoration: underline;
      }
    }

    &__divider {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px 0 14px;
      color: @neutral-400;
      font-size: 13px;
      &::before,
      &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: @neutral-200;
        margin: 0 10px;
      }
    }

    &__providers {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    &__links {
      margin-top: 28px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 14px;
      color: @neutral-600;

      a {
        color: @primary-700;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
          color: darken(@primary-700, 5%);
        }
      }
    }

    &__error,
    &__message {
      margin-top: 10px;
    }
  }

  /* ✅ Google wrapper */
  .provider-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  /* ✅ Bouton GitHub PRO */
  .github-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    width: 100%;
    padding: 12px 20px;

    background: #24292f;
    color: #fff;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;

    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    transition:
      background 0.2s,
      box-shadow 0.2s;

    &:hover:not(:disabled) {
      background: #1c1f24;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.14);
    }

    &:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    &:focus-visible {
      outline: 2px solid #0969da;
      outline-offset: 2px;
    }

    .github-icon {
      width: 20px;
      height: 20px;
    }
  }
</style>
