<template>
  <div class="auth">
    <h1 class="auth__title">Configuration MFA</h1>
    <p class="auth__subtitle">
      Sécurisez votre compte administrateur avec l'authentification à double facteur (TOTP).
    </p>

    <div class="mfa-setup">
      <!-- Étape 1 : Génération du QR Code -->
      <div v-if="step === 'generate'" class="mfa-step">
        <div class="mfa-info">
          <BasicIconNext name="Shield" :size="48" class="mfa-info__icon" />
          <p>
            Scannez le QR code ci-dessous avec votre application d'authentification
            (Google Authenticator, Authy, etc.)
          </p>
        </div>

        <div v-if="loading" class="mfa-loading">
          <BasicIconNext name="Loader2" :size="32" class="spin" />
          <span>Génération du QR code...</span>
        </div>

        <div v-else-if="qrCode" class="mfa-qr">
          <img :src="qrCode" alt="QR Code MFA" class="mfa-qr__image" />

          <div class="mfa-secret">
            <p class="mfa-secret__label">Ou entrez ce code manuellement :</p>
            <code class="mfa-secret__code">{{ secret }}</code>
            <PremiumButton
              type="secondary"
              variant="ghost"
              size="sm"
              :label="copied ? 'Copié !' : 'Copier'"
              :icon-left="copied ? 'Check' : 'Copy'"
              @click="copySecret"
            />
          </div>
        </div>

        <div v-if="qrCode" class="mfa-actions">
          <PremiumButton
            type="primary"
            variant="solid"
            size="lg"
            width="full"
            label="J'ai scanné le QR code"
            icon-right="ArrowRight"
            @click="step = 'verify'"
          />
        </div>

        <PremiumButton
          v-if="!qrCode && !loading"
          type="primary"
          variant="solid"
          size="lg"
          width="full"
          label="Générer le QR code"
          icon-left="QrCode"
          @click="enrollMfa"
        />
      </div>

      <!-- Étape 2 : Vérification du code -->
      <div v-if="step === 'verify'" class="mfa-step">
        <div class="mfa-info">
          <BasicIconNext name="KeyRound" :size="48" class="mfa-info__icon" />
          <p>
            Entrez le code à 6 chiffres affiché dans votre application d'authentification
            pour activer le MFA.
          </p>
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
            label="Activer le MFA"
            icon-left="ShieldCheck"
            :disabled="code.length !== 6"
            :loading="verifying"
            loading-text="Vérification..."
            :shine="true"
            :glow="code.length === 6 && !verifying"
          />

          <PremiumButton
            type="secondary"
            variant="ghost"
            size="md"
            label="Retour"
            icon-left="ArrowLeft"
            @click="step = 'generate'"
          />
        </form>
      </div>

      <!-- Étape 3 : Succès -->
      <div v-if="step === 'success'" class="mfa-step mfa-success">
        <div class="mfa-success__icon-wrapper">
          <BasicIconNext name="ShieldCheck" :size="64" class="mfa-success__icon" />
        </div>
        <h2>MFA activé avec succès !</h2>
        <p>
          Votre compte est maintenant protégé par l'authentification à double facteur.
          Vous devrez entrer un code TOTP à chaque connexion à l'espace admin.
        </p>
        <PremiumButton
          type="primary"
          variant="solid"
          size="lg"
          label="Accéder à l'admin"
          icon-right="ArrowRight"
          @click="$router.push('/admin')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/supabase/supabaseClient'
import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
import { computed, ref } from 'vue'

type Step = 'generate' | 'verify' | 'success'

const step = ref<Step>('generate')
const loading = ref(false)
const verifying = ref(false)
const error = ref('')

const qrCode = ref('')
const secret = ref('')
const factorId = ref('')
const copied = ref(false)

const codeDigits = ref<string[]>(['', '', '', '', '', ''])
const codeInputs = ref<HTMLInputElement[]>([])

const code = computed(() => codeDigits.value.join(''))

async function enrollMfa() {
  loading.value = true
  error.value = ''

  try {
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'FP Store Admin TOTP',
    })

    if (enrollError) throw enrollError

    if (data) {
      qrCode.value = data.totp.qr_code
      secret.value = data.totp.secret
      factorId.value = data.id
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Erreur lors de la génération du QR code'
  } finally {
    loading.value = false
  }
}

async function verifyMfa() {
  if (code.value.length !== 6) return

  verifying.value = true
  error.value = ''

  try {
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: factorId.value,
    })

    if (challengeError) throw challengeError

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: factorId.value,
      challengeId: challengeData.id,
      code: code.value,
    })

    if (verifyError) throw verifyError

    step.value = 'success'
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Code invalide. Veuillez réessayer.'
    codeDigits.value = ['', '', '', '', '', '']
    codeInputs.value[0]?.focus()
  } finally {
    verifying.value = false
  }
}

function copySecret() {
  navigator.clipboard.writeText(secret.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
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

.mfa-setup {
  width: 100%;
  max-width: 420px;
}

.mfa-step {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mfa-info {
  text-align: center;

  &__icon {
    color: var(--primary-500);
    margin-bottom: 16px;
  }

  p {
    color: #64748b;
    line-height: 1.6;
  }
}

.mfa-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px;
  color: #64748b;

  .spin {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.mfa-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  &__image {
    width: 200px;
    height: 200px;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    padding: 8px;
    background: white;
  }
}

.mfa-secret {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &__label {
    font-size: 0.85rem;
    color: #94a3b8;
  }

  &__code {
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 0.9rem;
    background: #f1f5f9;
    padding: 8px 16px;
    border-radius: 8px;
    color: #334155;
    letter-spacing: 2px;
    word-break: break-all;
  }
}

.mfa-actions {
  margin-top: 8px;
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
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.mfa-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--color-danger-50);
  border: 1px solid var(--color-danger-400); // Renforcé pour meilleur contraste
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

.mfa-success {
  text-align: center;

  &__icon-wrapper {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-success-100), var(--color-success-50));
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
  }

  &__icon {
    color: var(--color-success-500);
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 12px;
  }

  p {
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 24px;
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
