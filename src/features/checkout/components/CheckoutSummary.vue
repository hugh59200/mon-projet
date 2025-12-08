<template>
  <aside class="checkout-summary">
    <ContentBlock variant="card" size="lg" class="checkout-summary__card">
      <h3 class="checkout-summary__title">{{ t('checkout.summary.title') }}</h3>

      <div class="checkout-summary__rows">
        <div class="checkout-summary__row">
          <span>{{ t('cart.subtotal') }}</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>

        <div class="checkout-summary__row">
          <span>{{ t('cart.shipping') }}</span>
          <span :class="{ 'checkout-summary__free': shippingCost === 0 }">
            {{ shippingCost === 0 ? t('cart.freeShipping') : formatPrice(shippingCost) }}
          </span>
        </div>

        <!-- Info mode livraison -->
        <div v-if="deliveryMode === 'relay'" class="checkout-summary__delivery">
          <BasicIconNext name="MapPin" :size="16" />
          <span v-if="selectedRelayName">{{ selectedRelayName }}</span>
          <span v-else class="checkout-summary__delivery--pending">
            Point relais à sélectionner
          </span>
        </div>

        <!-- Barre de progression livraison gratuite -->
        <ContentBlock
          v-if="deliveryMode === 'home' && subtotal < freeShippingThreshold"
          variant="info"
          size="sm"
          class="checkout-summary__shipping-progress"
        >
          <div class="checkout-summary__shipping-bar">
            <div
              class="checkout-summary__shipping-fill"
              :style="{ width: `${(subtotal / freeShippingThreshold) * 100}%` }"
            />
          </div>
          <p class="checkout-summary__shipping-text">
            Plus que
            <strong>{{ formatPrice(freeShippingThreshold - subtotal) }}</strong>
            pour la livraison offerte
          </p>
        </ContentBlock>

        <!-- Code Promo -->
        <div class="checkout-summary__promo">
          <div v-if="!promoValid" class="checkout-summary__promo-input">
            <input
              :value="promoCode"
              type="text"
              placeholder="Code promo"
              class="checkout-summary__promo-field"
              :disabled="promoValidating"
              @input="$emit('update:promoCode', ($event.target as HTMLInputElement).value)"
              @keyup.enter="$emit('validate-promo')"
            />
            <PremiumButton
              type="primary"
              variant="outline"
              size="sm"
              label="Appliquer"
              :loading="promoValidating"
              :disabled="!promoCode.trim()"
              @click="$emit('validate-promo')"
            />
          </div>
          <div v-if="promoError" class="checkout-summary__promo-error">
            <BasicIconNext name="AlertCircle" :size="14" />
            <span>{{ promoError }}</span>
          </div>
          <div v-if="promoValid" class="checkout-summary__promo-applied">
            <div class="checkout-summary__promo-badge">
              <BasicIconNext name="Tag" :size="14" />
              <span>{{ promoCode.toUpperCase() }}</span>
              <button class="checkout-summary__promo-remove" @click="$emit('remove-promo')">
                <BasicIconNext name="X" :size="12" />
              </button>
            </div>
            <span class="checkout-summary__promo-discount">
              -{{ formatPrice(promoDiscount) }}
            </span>
          </div>
        </div>

        <div class="checkout-summary__divider" />

        <div class="checkout-summary__row checkout-summary__row--total">
          <span>{{ t('cart.total') }}</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
      </div>

      <!-- Disclaimer RUO - Bloc visible et obligatoire -->
      <ContentBlock
        :variant="disclaimerAccepted ? 'success' : 'danger'"
        size="md"
        class="checkout-summary__disclaimer"
        :class="{ 'checkout-summary__disclaimer--accepted': disclaimerAccepted }"
      >
        <div class="checkout-summary__disclaimer-header">
          <div class="checkout-summary__disclaimer-icon">
            <BasicIconNext name="AlertTriangle" :size="20" />
          </div>
          <span class="checkout-summary__disclaimer-title">Déclaration obligatoire</span>
        </div>
        <p class="checkout-summary__disclaimer-content">
          Je certifie être un <strong>professionnel ou chercheur qualifié</strong>, avoir plus de 18 ans,
          et comprendre que ces produits sont <strong>exclusivement destinés à la recherche en laboratoire</strong>.
          <span class="checkout-summary__disclaimer-highlight">
            Interdit pour usage humain ou vétérinaire.
          </span>
        </p>
        <label class="checkout-summary__disclaimer-checkbox">
          <input
            :checked="disclaimerAccepted"
            type="checkbox"
            class="checkout-summary__disclaimer-input"
            @change="$emit('update:disclaimerAccepted', ($event.target as HTMLInputElement).checked)"
          />
          <span class="checkout-summary__disclaimer-checkmark">
            <BasicIconNext name="Check" :size="12" />
          </span>
          <span class="checkout-summary__disclaimer-label">
            Je comprends et j'accepte ces conditions
          </span>
        </label>
        <ContentBlock
          v-if="!disclaimerAccepted"
          variant="warning"
          size="sm"
          class="checkout-summary__disclaimer-warning"
        >
          <BasicIconNext name="AlertCircle" :size="14" />
          <span>{{ t('checkout.disclaimer.required') }}</span>
        </ContentBlock>
      </ContentBlock>

      <div class="checkout-summary__submit">
        <PremiumButton
          type="primary"
          variant="solid"
          size="lg"
          width="full"
          :label="`${t('checkout.placeOrder')} ${formatPrice(total)}`"
          icon-left="Lock"
          :loading="isSubmitting"
          :loading-text="t('checkout.processing')"
          loading-icon="Shield"
          :disabled="!canSubmit"
          :shine="true"
          :glow="canSubmit && !isSubmitting"
          @click="$emit('submit')"
        />
      </div>

      <!-- Trust Badges -->
      <div class="checkout-summary__trust">
        <div class="checkout-summary__trust-item">
          <BasicIconNext name="MapPin" :size="20" />
          <span>{{ t('checkout.trust.stockFrance') }}</span>
        </div>
        <div class="checkout-summary__trust-item">
          <BasicIconNext name="Truck" :size="20" />
          <span>{{ t('checkout.trust.shipping24h') }}</span>
        </div>
        <div class="checkout-summary__trust-item">
          <BasicIconNext name="Lock" :size="20" />
          <span>{{ t('checkout.payment.securePayment') }}</span>
        </div>
        <div class="checkout-summary__trust-item">
          <BasicIconNext name="Shield" :size="20" />
          <span>{{ t('checkout.payment.sslProtected') }}</span>
        </div>
      </div>
    </ContentBlock>
  </aside>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  subtotal: number
  shippingCost: number
  total: number
  deliveryMode: 'relay' | 'home'
  selectedRelayName?: string | null
  freeShippingThreshold: number
  promoCode: string
  promoValid: boolean
  promoValidating: boolean
  promoError: string | null
  promoDiscount: number
  disclaimerAccepted: boolean
  canSubmit: boolean
  isSubmitting: boolean
}>()

defineEmits<{
  (e: 'update:promoCode', value: string): void
  (e: 'update:disclaimerAccepted', value: boolean): void
  (e: 'validate-promo'): void
  (e: 'remove-promo'): void
  (e: 'submit'): void
}>()

const { t } = useI18n()

function formatPrice(value: number | null | undefined) {
  if (value == null || isNaN(Number(value))) return '0,00 €'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value))
}
</script>

<style scoped lang="less">
.checkout-summary {
  position: sticky;
  top: 24px;

  &__card {
    // Styles de base gérés par ContentBlock
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: var(--content-block-text);
    margin: 0 0 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--content-block-border);
  }

  &__rows {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: var(--content-block-text-secondary);

    &--total {
      padding-top: 16px;
      font-size: 18px;
      font-weight: 700;
      color: var(--content-block-text);
    }
  }

  &__free {
    color: var(--color-success-600);
    font-weight: 600;
  }

  &__delivery {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--content-block-bg-subtle);
    border-radius: 10px;
    font-size: 13px;
    color: var(--content-block-text-secondary);

    svg {
      color: var(--primary-500);
      flex-shrink: 0;
    }

    &--pending {
      color: @warning-600;
      font-style: italic;
    }
  }

  &__shipping-progress {
    // Styles de base gérés par ContentBlock
  }

  &__shipping-bar {
    height: 6px;
    background: var(--content-block-border);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  &__shipping-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-500) 0%, var(--primary-400) 100%);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  &__shipping-text {
    font-size: 12px;
    color: var(--content-block-text-secondary);
    margin: 0;
    text-align: center;

    strong {
      color: var(--primary-500);
    }
  }

  &__promo {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__promo-input {
    display: flex;
    gap: 8px;
  }

  &__promo-field {
    flex: 1;
    padding: 10px 14px;
    border: 1px solid var(--content-block-border);
    border-radius: 10px;
    font-size: 14px;
    background: var(--content-block-bg-subtle);
    color: var(--content-block-text);
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-400);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-500) 10%, transparent);
    }

    &::placeholder {
      color: var(--content-block-text-muted);
    }
  }

  &__promo-error {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: @danger-600;
  }

  &__promo-applied {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, @success-500 8%, white) 0%,
      color-mix(in srgb, @success-500 4%, white) 100%
    );
    border-radius: 10px;
    border: 1px solid color-mix(in srgb, @success-500 20%, transparent);
  }

  &__promo-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: @success-700;

    svg {
      color: @success-500;
    }
  }

  &__promo-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: @success-200;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    color: @success-700;
    transition: all 0.2s ease;

    &:hover {
      background: @success-300;
    }
  }

  &__promo-discount {
    font-size: 14px;
    font-weight: 700;
    color: @success-600;
  }

  &__divider {
    height: 1px;
    background: var(--content-block-border);
    margin: 8px 0;
  }

  &__disclaimer {
    margin: 20px 0;
    transition: all 0.3s ease;
    // Styles de base gérés par ContentBlock

    &--accepted {
      .checkout-summary__disclaimer-icon {
        background: @success-100;
        svg { color: @success-600; }
      }
      .checkout-summary__disclaimer-title { color: @success-700; }
      .checkout-summary__disclaimer-highlight { background: @success-100; color: @success-700; }
    }
  }

  &__disclaimer-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__disclaimer-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @danger-100;
    border-radius: 12px;
    flex-shrink: 0;

    svg {
      color: @danger-600;
    }
  }

  &__disclaimer-title {
    font-size: 15px;
    font-weight: 700;
    color: @danger-700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__disclaimer-content {
    font-size: 13px;
    line-height: 1.6;
    color: var(--content-block-text-secondary);
    margin: 0 0 16px;

    strong {
      color: var(--content-block-text);
    }
  }

  &__disclaimer-highlight {
    display: inline;
    padding: 2px 8px;
    background: @danger-100;
    border-radius: 4px;
    color: @danger-700;
    font-weight: 600;
  }

  &__disclaimer-checkbox {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 12px 16px;
    background: var(--content-block-bg-subtle);
    border-radius: 10px;
    border: 1px solid var(--content-block-border);
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--primary-300);
    }
  }

  &__disclaimer-input {
    display: none;

    &:checked + .checkout-summary__disclaimer-checkmark {
      background: @success-500;
      border-color: @success-500;

      svg {
        opacity: 1;
        transform: scale(1);
      }
    }
  }

  &__disclaimer-checkmark {
    width: 24px;
    height: 24px;
    min-width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--content-block-border);
    border-radius: 6px;
    background: var(--content-block-bg-subtle);
    transition: all 0.2s ease;

    svg {
      color: white;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.2s ease;
    }
  }

  &__disclaimer-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--content-block-text-secondary);
  }

  &__disclaimer-warning {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    font-size: 13px;
    font-weight: 500;
    color: @warning-800;
    // Styles de base gérés par ContentBlock

    svg {
      color: @warning-600;
      flex-shrink: 0;
    }
  }

  &__submit {
    margin-bottom: 20px;
  }

  &__trust {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 16px;
    border-top: 1px solid var(--content-block-border);
  }

  &__trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--content-block-text-muted);

    svg {
      color: var(--color-success-500);
    }
  }
}

// Tablet
.respond-tablet({
  .checkout-summary {
    position: relative;
    top: 0;

    &__card {
      padding: 20px;
      border-radius: 20px;
    }
  }
});

// Mobile
.respond-mobile({
  .checkout-summary {
    &__card {
      padding: 16px;
      border-radius: 16px;
    }

    &__title {
      font-size: 16px;
      margin-bottom: 16px;
      padding-bottom: 12px;
    }

    &__rows {
      gap: 12px;
    }

    &__row {
      font-size: 13px;

      &--total {
        font-size: 16px;
      }
    }

    &__promo-field {
      padding: 12px;
      min-height: 44px;
    }

    &__disclaimer {
      padding: 16px;
    }

    &__disclaimer-header {
      gap: 10px;
      margin-bottom: 10px;
    }

    &__disclaimer-icon {
      width: 36px;
      height: 36px;
    }

    &__disclaimer-title {
      font-size: 13px;
    }

    &__disclaimer-content {
      font-size: 12px;
      margin-bottom: 12px;
    }

    &__disclaimer-checkbox {
      padding: 10px 12px;
    }

    &__disclaimer-label {
      font-size: 13px;
    }

    &__trust-item {
      font-size: 12px;
      min-height: 44px;
    }
  }
});
</style>
