<template>
  <div class="auth">
    <h1 class="auth__title">Vérification MFA</h1>
    <p class="auth__subtitle">
      Entrez le code de votre application d'authentification pour accéder à l'espace admin.
    </p>

    <div class="mfa-challenge">
      <div class="mfa-info">
        <BasicIconNext name="ShieldCheck" :size="48" class="mfa-info__icon" />
      </div>

      <form class="mfa-form" @submit.prevent="verifyMfa">
        <div class="mfa-code-input">
          <input
            v-for="(_, index) in 6"
            :key="index"
            ref="codeInputs"
            v-model="codeDigits[index]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="mfa-code-input__digit"
            :class="{ 'mfa-code-input__digit--error': error }"
            @input="onDigitInput(index, $event)"
            @keydown="onDigitKeydown(index, $event)"
            @paste="onPaste"
          />
        </div>

        <Transition name="slide-fade" mode="out-in">
          <div v-if="error" class="mfa-error">
            <BasicIconNext name="AlertCircle" :size="16" />
            <span>{{ error }}</span>
          </div>
        </Transition>

        <PremiumButton
          html-type="submit"
          type="primary"
          variant="solid"
          size="lg"
          width="full"
          label="Vérifier"
          icon-left="ShieldCheck"
          :disabled="code.length !== 6"
          :loading="verifying"
          loading-text="Vérification..."
          :shine="true"
          :glow="code.length === 6 && !verifying"
        />
      </form>

      <div class="mfa-links">
        <p>
          Vous n'avez pas accès à votre application ?
          <RouterLink to="/auth/login">Se déconnecter</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/supabase/supabaseClient'
import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const verifying = ref(false)
const error = ref('')

const codeDigits = ref<string[]>(['', '', '', '', '', ''])
const codeInputs = ref<HTMLInputElement[]>([])

const code = computed(() => codeDigits.value.join(''))

const factorId = ref('')

onMounted(async () => {
  // Récupérer le factorId TOTP de l'utilisateur
  const { data, error: factorError } = await supabase.auth.mfa.listFactors()

  if (factorError) {
    error.value = 'Erreur lors de la récupération des facteurs MFA'
    return
  }

  const totpFactor = data?.totp?.find((f) => f.status === 'verified')

  if (!totpFactor) {
    // Pas de MFA configuré, rediriger vers la config
    router.push('/auth/mfa-setup')
    return
  }

  factorId.value = totpFactor.id

  // Focus sur le premier input
  codeInputs.value[0]?.focus()
})

async function verifyMfa() {
  if (code.value.length !== 6 || !factorId.value) return

  verifying.value = true
  error.value = ''

  try {
    // Créer un challenge
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: factorId.value,
    })

    if (challengeError) throw challengeError

    // Vérifier le code
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: factorId.value,
      challengeId: challengeData.id,
      code: code.value,
    })

    if (verifyError) throw verifyError

    // Succès ! Rediriger vers la destination originale ou /admin
    const redirect = (route.query.redirect as string) || '/admin'
    router.push(redirect)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Code invalide. Veuillez réessayer.'
    codeDigits.value = ['', '', '', '', '', '']
    codeInputs.value[0]?.focus()
  } finally {
    verifying.value = false
  }
}

function onDigitInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '')

  codeDigits.value[index] = value.slice(-1)

  if (value && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }
}

function onDigitKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !codeDigits.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus()
  }
}

function onPaste(event: ClipboardEvent) {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) || ''

  for (let i = 0; i < 6; i++) {
    codeDigits.value[i] = pasted[i] || ''
  }

  const focusIndex = Math.min(pasted.length, 5)
  codeInputs.value[focusIndex]?.focus()
}
</script>

<style scoped lang="less">
@import './AuthFormStyles.less';

.mfa-challenge {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mfa-info {
  text-align: center;

  &__icon {
    color: var(--primary-500);
  }
}

.mfa-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.mfa-code-input {
  display: flex;
  gap: 8px;
  justify-content: center;

  &__digit {
    width: 48px;
    height: 56px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    background: white;
    color: #1e293b;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.15);
    }

    &--error {
      border-color: var(--color-danger-500);
      animation: shake 0.3s ease;
    }
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

.mfa-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--color-danger-50);
  border: 1px solid var(--color-danger-200);
  border-radius: 10px;
  color: var(--color-danger-700);
  font-size: 14px;
  font-weight: 500;
  width: 100%;

  svg {
    flex-shrink: 0;
    color: var(--color-danger-500);
  }
}

.mfa-links {
  text-align: center;
  font-size: 0.9rem;
  color: #64748b;

  a {
    color: var(--primary-600);
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
