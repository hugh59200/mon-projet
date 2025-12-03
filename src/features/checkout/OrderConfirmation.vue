<template>
  <div class="confirmation">
    <!-- Background -->
    <div class="confirmation__bg">
      <div class="confirmation__bg-gradient"></div>
      <div class="confirmation__bg-pattern"></div>
    </div>

    <div class="confirmation__container">
      <!-- Header avec succès -->
      <header class="confirmation__header">
        <div class="confirmation__header-content">
          <div class="confirmation__success-icon">
            <div class="confirmation__success-ring"></div>
            <BasicIconNext name="Check" :size="32" />
          </div>
          <div class="confirmation__header-text">
            <h1 class="confirmation__title">{{ t('checkout.confirmation.title') }}</h1>
            <p class="confirmation__subtitle">{{ t('checkout.confirmation.subtitle') }}</p>
          </div>
        </div>
      </header>

      <!-- Main Grid (style checkout) -->
      <div class="confirmation__grid">
        <!-- Colonne principale -->
        <div class="confirmation__main">
          <!-- Card Instructions de paiement -->
          <section class="confirmation__section">
            <div class="confirmation__section-header">
              <div class="confirmation__section-icon" :class="`confirmation__section-icon--${paymentMethod}`">
                <BasicIconNext :name="paymentMethod === 'bank_transfer' ? 'Landmark' : 'Bitcoin'" :size="20" />
              </div>
              <div>
                <h2 class="confirmation__section-title">
                  {{ paymentMethod === 'bank_transfer' ? t('checkout.confirmation.bankTitle') : t('checkout.confirmation.cryptoTitle') }}
                </h2>
                <p class="confirmation__section-subtitle">{{ t('checkout.confirmation.instructionsSubtitle') }}</p>
              </div>
            </div>

            <!-- Instructions Virement -->
            <div v-if="paymentMethod === 'bank_transfer'" class="confirmation__bank-details">
              <div class="confirmation__detail-card">
                <div class="confirmation__detail-row">
                  <span class="confirmation__detail-label">{{ t('checkout.confirmation.bankName') }}</span>
                  <div class="confirmation__detail-value-wrapper">
                    <span class="confirmation__detail-value">Fast Peptides SAS</span>
                  </div>
                </div>
                <div class="confirmation__detail-row">
                  <span class="confirmation__detail-label">IBAN</span>
                  <div class="confirmation__detail-value-wrapper">
                    <span class="confirmation__detail-value confirmation__detail-value--mono">{{ bankDetails.iban }}</span>
                    <PremiumButton
                      type="secondary"
                      variant="ghost"
                      size="xs"
                      icon-left="Copy"
                      class="confirmation__copy-btn"
                      @click="copyToClipboard(bankDetails.iban)"
                    />
                  </div>
                </div>
                <div class="confirmation__detail-row">
                  <span class="confirmation__detail-label">BIC / SWIFT</span>
                  <div class="confirmation__detail-value-wrapper">
                    <span class="confirmation__detail-value confirmation__detail-value--mono">{{ bankDetails.bic }}</span>
                    <PremiumButton
                      type="secondary"
                      variant="ghost"
                      size="xs"
                      icon-left="Copy"
                      class="confirmation__copy-btn"
                      @click="copyToClipboard(bankDetails.bic)"
                    />
                  </div>
                </div>
                <div class="confirmation__detail-row confirmation__detail-row--highlight">
                  <span class="confirmation__detail-label">{{ t('checkout.confirmation.reference') }}</span>
                  <div class="confirmation__detail-value-wrapper">
                    <span class="confirmation__detail-value confirmation__detail-value--mono confirmation__detail-value--important">{{ orderId }}</span>
                    <PremiumButton
                      type="secondary"
                      variant="ghost"
                      size="xs"
                      icon-left="Copy"
                      class="confirmation__copy-btn"
                      @click="copyToClipboard(orderId)"
                    />
                  </div>
                </div>
              </div>
              <div class="confirmation__warning">
                <BasicIconNext name="AlertTriangle" :size="18" />
                <span>{{ t('checkout.confirmation.referenceWarning') }}</span>
              </div>
            </div>

            <!-- Instructions Crypto -->
            <div v-else class="confirmation__crypto-details">
              <div class="confirmation__crypto-tabs">
                <button
                  class="confirmation__crypto-tab"
                  :class="{ 'confirmation__crypto-tab--active': selectedCrypto === 'btc' }"
                  @click="selectedCrypto = 'btc'"
                >
                  <span class="confirmation__crypto-tab-icon">&#8383;</span>
                  Bitcoin (BTC)
                </button>
                <button
                  class="confirmation__crypto-tab"
                  :class="{ 'confirmation__crypto-tab--active': selectedCrypto === 'usdt' }"
                  @click="selectedCrypto = 'usdt'"
                >
                  <span class="confirmation__crypto-tab-icon">&#36;</span>
                  Tether (USDT)
                </button>
              </div>

              <div class="confirmation__crypto-content">
                <div class="confirmation__crypto-layout">
                  <!-- QR Code -->
                  <div class="confirmation__qr-wrapper">
                    <div class="confirmation__qr-placeholder">
                      <BasicIconNext name="QrCode" :size="64" />
                      <span>{{ t('checkout.confirmation.scanQR') }}</span>
                    </div>
                  </div>

                  <!-- Adresse -->
                  <div class="confirmation__detail-card confirmation__detail-card--flex">
                    <div class="confirmation__detail-row">
                      <span class="confirmation__detail-label">
                        {{ selectedCrypto === 'btc' ? t('checkout.confirmation.btcAddress') : t('checkout.confirmation.usdtAddress') }}
                      </span>
                      <div class="confirmation__detail-value-wrapper">
                        <span class="confirmation__detail-value confirmation__detail-value--mono confirmation__detail-value--small">
                          {{ selectedCrypto === 'btc' ? cryptoDetails.btcAddress : cryptoDetails.usdtAddress }}
                        </span>
                        <PremiumButton
                          type="secondary"
                          variant="ghost"
                          size="xs"
                          icon-left="Copy"
                          class="confirmation__copy-btn"
                          @click="copyToClipboard(selectedCrypto === 'btc' ? cryptoDetails.btcAddress : cryptoDetails.usdtAddress)"
                        />
                      </div>
                    </div>
                    <div v-if="selectedCrypto === 'usdt'" class="confirmation__detail-row">
                      <span class="confirmation__detail-label">{{ t('checkout.confirmation.network') }}</span>
                      <div class="confirmation__detail-value-wrapper">
                        <span class="confirmation__detail-value">TRC-20 (Tron)</span>
                      </div>
                    </div>
                    <div class="confirmation__detail-row confirmation__detail-row--highlight">
                      <span class="confirmation__detail-label">{{ t('checkout.confirmation.reference') }}</span>
                      <div class="confirmation__detail-value-wrapper">
                        <span class="confirmation__detail-value confirmation__detail-value--mono confirmation__detail-value--important">{{ orderId }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="confirmation__warning">
                  <BasicIconNext name="AlertTriangle" :size="18" />
                  <span>{{ t('checkout.confirmation.cryptoWarning') }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Card Étapes suivantes -->
          <section class="confirmation__section">
            <div class="confirmation__section-header">
              <div class="confirmation__section-icon confirmation__section-icon--steps">
                <BasicIconNext name="ListChecks" :size="20" />
              </div>
              <div>
                <h2 class="confirmation__section-title">{{ t('checkout.confirmation.nextSteps') }}</h2>
                <p class="confirmation__section-subtitle">Votre commande sera traitée dès réception du paiement</p>
              </div>
            </div>

            <div class="confirmation__steps-grid">
              <div class="confirmation__step-card">
                <div class="confirmation__step-number">1</div>
                <div class="confirmation__step-content">
                  <span class="confirmation__step-title">{{ t('checkout.confirmation.step1Title') }}</span>
                  <span class="confirmation__step-desc">{{ t('checkout.confirmation.step1Desc') }}</span>
                </div>
              </div>
              <div class="confirmation__step-card">
                <div class="confirmation__step-number">2</div>
                <div class="confirmation__step-content">
                  <span class="confirmation__step-title">{{ t('checkout.confirmation.step2Title') }}</span>
                  <span class="confirmation__step-desc">{{ t('checkout.confirmation.step2Desc') }}</span>
                </div>
              </div>
              <div class="confirmation__step-card">
                <div class="confirmation__step-number">3</div>
                <div class="confirmation__step-content">
                  <span class="confirmation__step-title">{{ t('checkout.confirmation.step3Title') }}</span>
                  <span class="confirmation__step-desc">{{ t('checkout.confirmation.step3Desc') }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Sidebar -->
        <aside class="confirmation__sidebar">
          <!-- Card Récapitulatif -->
          <div class="confirmation__summary">
            <h3 class="confirmation__summary-title">Récapitulatif</h3>

            <!-- Référence commande -->
            <div class="confirmation__order-ref">
              <span class="confirmation__order-label">{{ t('checkout.confirmation.orderRef') }}</span>
              <div class="confirmation__order-id-wrapper">
                <span class="confirmation__order-id">{{ orderId }}</span>
                <PremiumButton
                  type="secondary"
                  variant="ghost"
                  size="xs"
                  :icon-left="copied ? 'Check' : 'Copy'"
                  class="confirmation__copy-btn confirmation__copy-btn--small"
                  @click="copyOrderId"
                />
              </div>
            </div>

            <div class="confirmation__summary-divider"></div>

            <!-- Montant -->
            <div class="confirmation__amount">
              <span class="confirmation__amount-label">{{ t('checkout.confirmation.amountToPay') }}</span>
              <span class="confirmation__amount-value">{{ formatPrice(orderTotal) }}</span>
            </div>

            <!-- Mode de paiement -->
            <div class="confirmation__payment-method">
              <div class="confirmation__payment-icon" :class="`confirmation__payment-icon--${paymentMethod}`">
                <BasicIconNext :name="paymentMethod === 'bank_transfer' ? 'Landmark' : 'Bitcoin'" :size="18" />
              </div>
              <span>{{ paymentMethod === 'bank_transfer' ? t('checkout.payment.bankTransfer') : t('checkout.payment.crypto') }}</span>
            </div>

            <div class="confirmation__summary-divider"></div>

            <!-- Actions -->
            <div class="confirmation__actions">
              <PremiumButton
                type="primary"
                variant="solid"
                size="lg"
                width="full"
                :label="t('checkout.confirmation.paymentDone')"
                icon-left="CheckCircle2"
                :shine="true"
                :glow="true"
                @click="handlePaymentDone"
              />
              <PremiumButton
                type="secondary"
                variant="outline"
                size="lg"
                width="full"
                :label="t('checkout.confirmation.continueShopping')"
                icon-left="ShoppingBag"
                @click="$router.push('/catalogue')"
              />
            </div>

            <!-- Trust badges -->
            <div class="confirmation__trust">
              <div class="confirmation__trust-item">
                <BasicIconNext name="Shield" :size="18" />
                <span>Paiement sécurisé</span>
              </div>
              <div class="confirmation__trust-item">
                <BasicIconNext name="Clock" :size="18" />
                <span>Traitement sous 24-48h</span>
              </div>
            </div>
          </div>

          <!-- Card Support -->
          <div class="confirmation__support-card">
            <div class="confirmation__support-header">
              <BasicIconNext name="MessageCircle" :size="20" />
              <span>{{ t('checkout.confirmation.needHelp') }}</span>
            </div>
            <a href="mailto:support@fastpeptides.fr" class="confirmation__support-link">
              <BasicIconNext name="Mail" :size="16" />
              support@fastpeptides.fr
            </a>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToastStore()

// State
const copied = ref(false)
const selectedCrypto = ref<'btc' | 'usdt'>('btc')

// Données de la commande depuis l'URL ou localStorage
const orderId = computed(() => {
  return (route.query.orderId as string) || localStorage.getItem('fp-last-order-id') || 'N/A'
})

const paymentMethod = computed(() => {
  return (route.query.method as string) || localStorage.getItem('fp-last-payment-method') || 'bank_transfer'
})

const orderTotal = computed(() => {
  const stored = localStorage.getItem('fp-last-order-total')
  return stored ? parseFloat(stored) : 0
})

// Données bancaires (placeholder)
const bankDetails = {
  iban: 'FR76 1234 5678 9012 3456 7890 123',
  bic: 'BNPAFRPP',
}

// Adresses crypto depuis les variables d'environnement
const cryptoDetails = {
  btcAddress: import.meta.env.VITE_CRYPTO_BTC_ADDRESS || '',
  usdtAddress: import.meta.env.VITE_CRYPTO_USDT_ADDRESS || '',
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  toast.show(t('checkout.confirmation.copied'), 'success')
}

function copyOrderId() {
  navigator.clipboard.writeText(orderId.value)
  copied.value = true
  toast.show(t('checkout.confirmation.copied'), 'success')
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function handlePaymentDone() {
  toast.show(t('checkout.confirmation.paymentConfirmed'), 'success')
  router.push('/')
}

onMounted(() => {
  // Nettoyer les données après 1h
  setTimeout(() => {
    localStorage.removeItem('fp-last-order-total')
    localStorage.removeItem('fp-last-payment-method')
  }, 3600000)
})
</script>

<style scoped lang="less">
@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);
@bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

.confirmation {
  position: relative;
  min-height: 100vh;
  background: @neutral-50;

  // ============================================
  // BACKGROUND
  // ============================================
  &__bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  &__bg-gradient {
    position: absolute;
    top: 0;
    right: 0;
    width: 60%;
    height: 60%;
    background: radial-gradient(
      ellipse at top right,
      rgba(var(--success-500-rgb), 0.06) 0%,
      transparent 60%
    );
  }

  &__bg-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(var(--success-500-rgb), 0.03) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: linear-gradient(to bottom, black 0%, transparent 50%);
  }

  // ============================================
  // CONTAINER
  // ============================================
  &__container {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 32px 80px;
  }

  // ============================================
  // HEADER
  // ============================================
  &__header {
    margin-bottom: 32px;
    padding: 24px 28px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 32px rgba(0, 0, 0, 0.04);
    border: 1px solid @neutral-100;
  }

  &__header-content {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  &__success-icon {
    position: relative;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, @success-500 0%, @success-600 100%);
    border-radius: 50%;
    color: white;
    box-shadow: 0 8px 24px rgba(var(--success-500-rgb), 0.3);
    flex-shrink: 0;
    animation: scaleIn 0.5s @bounce;
  }

  &__success-ring {
    position: absolute;
    inset: -6px;
    border: 2px solid rgba(var(--success-500-rgb), 0.2);
    border-radius: 50%;
    animation: pulse 2s @ease infinite;
  }

  &__header-text {
    flex: 1;
  }

  &__title {
    font-family: @font-display;
    font-size: 26px;
    font-weight: 700;
    color: @neutral-900;
    margin: 0 0 4px;
  }

  &__subtitle {
    font-family: @font-body;
    font-size: 15px;
    color: @neutral-500;
    margin: 0;
  }

  // ============================================
  // GRID LAYOUT (comme checkout)
  // ============================================
  &__grid {
    display: grid;
    grid-template-columns: 1fr minmax(320px, 380px);
    gap: 32px;
    align-items: start;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  // ============================================
  // SECTIONS
  // ============================================
  &__section {
    background: white;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 32px rgba(0, 0, 0, 0.04);
    border: 1px solid @neutral-100;
  }

  &__section-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid @neutral-100;
  }

  &__section-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    color: white;

    &--bank_transfer {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    }

    &--crypto {
      background: linear-gradient(135deg, #f7931a 0%, #ffb84d 100%);
    }

    &--steps {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    }
  }

  &__section-title {
    font-family: @font-display;
    font-size: 20px;
    font-weight: 600;
    color: @neutral-900;
    margin: 0;
  }

  &__section-subtitle {
    font-family: @font-body;
    font-size: 14px;
    color: @neutral-500;
    margin: 4px 0 0;
  }

  // ============================================
  // DETAIL CARD
  // ============================================
  &__detail-card {
    background: @neutral-50;
    border: 1px solid @neutral-200;
    border-radius: 14px;
    overflow: hidden;

    &--flex {
      flex: 1;
    }
  }

  &__detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid @neutral-200;

    &:last-child {
      border-bottom: none;
    }

    &--highlight {
      background: linear-gradient(135deg, rgba(var(--warning-500-rgb), 0.08) 0%, rgba(var(--warning-500-rgb), 0.04) 100%);
    }
  }

  &__detail-label {
    font-family: @font-body;
    font-size: 13px;
    font-weight: 500;
    color: @neutral-500;
  }

  &__detail-value-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__detail-value {
    font-family: @font-body;
    font-size: 14px;
    font-weight: 600;
    color: @neutral-900;

    &--mono {
      font-family: 'SF Mono', 'Fira Code', monospace;
      letter-spacing: 0.5px;
    }

    &--small {
      font-size: 12px;
      word-break: break-all;
    }

    &--important {
      color: @warning-700;
      font-weight: 700;
    }
  }

  &__copy-btn {
    padding: 6px;
    background: white;
    border: 1px solid @neutral-200;
    border-radius: 6px;
    color: @neutral-500;
    cursor: pointer;
    transition: all 0.2s @ease;

    &:hover {
      background: var(--primary-50);
      border-color: var(--primary-300);
      color: var(--primary-600);
    }

    &--small {
      padding: 4px;
    }
  }

  // ============================================
  // WARNING
  // ============================================
  &__warning {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-top: 16px;
    padding: 14px 18px;
    background: linear-gradient(135deg, @warning-50 0%, rgba(@warning-100, 0.5) 100%);
    border: 1px solid @warning-200;
    border-radius: 12px;

    svg {
      color: @warning-500;
      flex-shrink: 0;
      margin-top: 2px;
    }

    span {
      font-family: @font-body;
      font-size: 13px;
      line-height: 1.5;
      color: @warning-700;
    }
  }

  // ============================================
  // CRYPTO
  // ============================================
  &__crypto-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }

  &__crypto-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    background: @neutral-100;
    border: 2px solid transparent;
    border-radius: 10px;
    font-family: @font-body;
    font-size: 13px;
    font-weight: 600;
    color: @neutral-600;
    cursor: pointer;
    transition: all 0.2s @ease;

    &:hover {
      background: @neutral-50;
      border-color: @neutral-300;
    }

    &--active {
      background: white;
      border-color: var(--primary-500);
      color: var(--primary-700);
    }
  }

  &__crypto-tab-icon {
    font-size: 16px;
    font-weight: 700;
  }

  &__crypto-layout {
    display: flex;
    gap: 20px;
    margin-bottom: 16px;
  }

  &__qr-wrapper {
    flex-shrink: 0;
  }

  &__qr-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px 32px;
    background: white;
    border: 2px dashed @neutral-300;
    border-radius: 14px;
    color: @neutral-400;

    span {
      font-family: @font-body;
      font-size: 11px;
      color: @neutral-500;
    }
  }

  // ============================================
  // STEPS GRID
  // ============================================
  &__steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  &__step-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px 16px;
    background: @neutral-50;
    border: 1px solid @neutral-200;
    border-radius: 14px;
    transition: all 0.2s @ease;

    &:hover {
      background: white;
      border-color: var(--primary-200);
    }
  }

  &__step-number {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    border-radius: 50%;
    font-family: @font-display;
    font-size: 15px;
    font-weight: 700;
    color: white;
    margin-bottom: 12px;
  }

  &__step-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__step-title {
    font-family: @font-display;
    font-size: 14px;
    font-weight: 600;
    color: @neutral-900;
  }

  &__step-desc {
    font-family: @font-body;
    font-size: 12px;
    color: @neutral-500;
    line-height: 1.4;
  }

  // ============================================
  // SIDEBAR
  // ============================================
  &__sidebar {
    position: sticky;
    top: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__summary {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 32px rgba(0, 0, 0, 0.04);
    border: 1px solid @neutral-100;
  }

  &__summary-title {
    font-family: @font-display;
    font-size: 18px;
    font-weight: 600;
    color: @neutral-900;
    margin: 0 0 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid @neutral-100;
  }

  &__order-ref {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  &__order-label {
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-500;
  }

  &__order-id-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__order-id {
    font-family: @font-display;
    font-size: 15px;
    font-weight: 700;
    color: var(--primary-700);
    letter-spacing: 0.5px;
  }

  &__summary-divider {
    height: 1px;
    background: @neutral-100;
    margin: 16px 0;
  }

  &__amount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.05) 0%, rgba(var(--primary-500-rgb), 0.02) 100%);
    border: 1px solid rgba(var(--primary-500-rgb), 0.15);
    border-radius: 12px;
    margin-bottom: 16px;
  }

  &__amount-label {
    font-family: @font-body;
    font-size: 14px;
    font-weight: 500;
    color: @neutral-600;
  }

  &__amount-value {
    font-family: @font-display;
    font-size: 24px;
    font-weight: 700;
    color: var(--primary-700);
  }

  &__payment-method {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: @neutral-50;
    border-radius: 10px;
    font-family: @font-body;
    font-size: 14px;
    font-weight: 500;
    color: @neutral-700;
  }

  &__payment-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: white;

    &--bank_transfer {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    }

    &--crypto {
      background: linear-gradient(135deg, #f7931a 0%, #ffb84d 100%);
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__trust {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid @neutral-100;
  }

  &__trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-500;

    svg {
      color: @success-500;
    }
  }

  // ============================================
  // SUPPORT CARD
  // ============================================
  &__support-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    border: 1px solid @neutral-100;
  }

  &__support-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    font-family: @font-body;
    font-size: 14px;
    font-weight: 500;
    color: @neutral-700;

    svg {
      color: @neutral-400;
    }
  }

  &__support-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: @neutral-50;
    border-radius: 10px;
    font-family: @font-body;
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-600);
    text-decoration: none;
    transition: all 0.2s @ease;

    svg {
      color: var(--primary-500);
    }

    &:hover {
      background: var(--primary-50);
    }
  }
}

// ============================================
// ANIMATIONS
// ============================================
@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0;
  }
}

// ============================================
// RESPONSIVE
// ============================================
@media (max-width: 1100px) {
  .confirmation {
    &__grid {
      grid-template-columns: 1fr;
    }

    &__sidebar {
      position: static;
      order: -1;
    }
  }
}

@media (max-width: 768px) {
  .confirmation {
    &__container {
      padding: 16px;
    }

    &__header {
      padding: 20px;
    }

    &__header-content {
      flex-direction: column;
      text-align: center;
    }

    &__title {
      font-size: 22px;
    }

    &__section {
      padding: 20px;
    }

    &__steps-grid {
      grid-template-columns: 1fr;
    }

    &__crypto-layout {
      flex-direction: column;
    }

    &__qr-wrapper {
      display: flex;
      justify-content: center;
    }

    &__detail-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    &__crypto-tabs {
      flex-direction: column;
    }
  }
}
</style>
