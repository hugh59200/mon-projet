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
          <BasicButton
            v-for="provider in providers"
            :key="provider.name"
            :label="provider.label"
            variant="ghost"
            width="full"
            size="medium"
            :icon="provider.icon"
            @click="auth.signInWithProvider(provider.name as Providers)"
          />
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

      <!-- 🔍 Debug temporaire -->
      <!-- <pre>{{ errors }}</pre> -->
      <!-- <pre>{{ touched }}</pre> -->
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
  import { useForm } from './composables/useForm'
  import { useAuthStore, type Providers } from './stores/useAuthStore'

  type Mode = 'login' | 'register' | 'reset'
  const props = defineProps<{ mode: Mode }>()

  const auth = useAuthStore()
  const router = useRouter()
  const { email, password, errors, validate, validateField, touched, reset } = useForm()

  const hintEmail = 'exemple@domaine.com'
  const hintPassword = '8 caractères minimum'

  const error = ref('')
  const message = ref('')
  const loading = ref(false)
  const modeMagicLink = ref(false)

  const providers = [
    { name: 'google', label: 'Google', icon: 'google' },
    { name: 'github', label: 'GitHub', icon: 'github' },
  ]

  // 🧠 Textes dynamiques
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

  const labelBouton = computed(() => {
    if (props.mode === 'login')
      return modeMagicLink.value ? 'Recevoir un lien magique' : 'Se connecter'
    if (props.mode === 'register') return 'Créer mon compte'
    return 'Envoyer le lien'
  })

  // 🔧 Helpers
  function clearMessages() {
    error.value = ''
    message.value = ''
    auth.error = null
  }

  function toggleMagicLink() {
    modeMagicLink.value = !modeMagicLink.value
    clearMessages()
  }

  // 🧩 Soumission
  async function handleSubmit() {
    clearMessages()

    const isValid = validate(props.mode)
    if (!isValid) {
      // Force l'affichage des erreurs
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
            const redirect = router.currentRoute.value.query.redirect as string
            router.push(redirect || '/')
          } else error.value = auth.error ?? 'Email ou mot de passe incorrect.'
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
      background: #fff;
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
      gap: 14px;

      button {
        flex: 1;
        border: 1px solid @neutral-200;
        border-radius: 8px;
        height: 40px;
        background: #fafafa;
        color: @neutral-700;
        font-weight: 500;
        transition: all 0.2s ease;
        &:hover {
          background: #f0f0f0;
          border-color: @neutral-300;
          color: @neutral-600;
        }
      }
    }

    &__error,
    &__message {
      margin-top: 10px;
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
  }
</style>
