<template>
  <ContentBlock variant="card" class="checkout-shipping">
    <div class="checkout-shipping__header">
      <div class="checkout-shipping__icon">
        <BasicIconNext name="Truck" :size="20" />
      </div>
      <div>
        <h2 class="checkout-shipping__title">{{ t('checkout.steps.shipping') }}</h2>
        <p class="checkout-shipping__subtitle">{{ t('checkout.shipping.whereToDeliver') }}</p>
      </div>
    </div>

    <!-- Mode de livraison -->
    <div class="checkout-shipping__mode">
      <button
        class="checkout-shipping__option"
        :class="{ 'checkout-shipping__option--active': deliveryMode === 'relay' }"
        type="button"
        @click="emit('update:deliveryMode', 'relay')"
      >
        <div class="checkout-shipping__radio">
          <div class="checkout-shipping__radio-inner" />
        </div>
        <div class="checkout-shipping__option-icon checkout-shipping__option-icon--relay">
          <BasicIconNext name="MapPin" :size="24" />
        </div>
        <div class="checkout-shipping__option-content">
          <span class="checkout-shipping__option-title">{{ t('checkout.shipping.relay') }}</span>
          <span class="checkout-shipping__option-desc">Mondial Relay • 48-72h</span>
        </div>
        <div class="checkout-shipping__option-price checkout-shipping__option-price--free">
          {{ t('cart.freeShipping') }}
        </div>
      </button>

      <button
        class="checkout-shipping__option"
        :class="{ 'checkout-shipping__option--active': deliveryMode === 'home' }"
        type="button"
        @click="emit('update:deliveryMode', 'home')"
      >
        <div class="checkout-shipping__radio">
          <div class="checkout-shipping__radio-inner" />
        </div>
        <div class="checkout-shipping__option-icon checkout-shipping__option-icon--home">
          <BasicIconNext name="Home" :size="24" />
        </div>
        <div class="checkout-shipping__option-content">
          <span class="checkout-shipping__option-title">{{ t('checkout.shipping.home') }}</span>
          <span class="checkout-shipping__option-desc">Colissimo • 48-72h</span>
        </div>
        <div class="checkout-shipping__option-price">
          {{ subtotal >= freeShippingThreshold ? t('cart.freeShipping') : formatPrice(shippingRate) }}
        </div>
      </button>
    </div>

    <!-- Sélecteur Point Relais Mondial Relay -->
    <div v-if="deliveryMode === 'relay'" class="checkout-shipping__relay">
      <RelaySelector
        :model-value="selectedRelay"
        :brand-id="brandId"
        :default-postcode="zip"
        default-country="FR"
        :nb-results="10"
        :allow-geolocate="true"
        button-label="📍 Choisir mon point relais"
        @update:model-value="emit('update:selectedRelay', $event)"
        @select="emit('relay-select', $event)"
        @order-data="emit('relay-order-data', $event)"
        @error="emit('relay-error', $event)"
      />
    </div>

    <!-- Formulaire adresse -->
    <div class="checkout-shipping__form">
      <!-- Toggle adresse profil -->
      <div v-if="isLoggedIn && deliveryMode === 'home'" class="checkout-shipping__toggle">
        <PremiumButton
          :type="useProfileAddress ? 'primary' : 'secondary'"
          :variant="useProfileAddress ? 'solid' : 'outline'"
          size="md"
          label="Mon adresse"
          icon-left="User"
          class="checkout-shipping__toggle-btn"
          @click="emit('update:useProfileAddress', true)"
        />
        <PremiumButton
          :type="!useProfileAddress ? 'primary' : 'secondary'"
          :variant="!useProfileAddress ? 'solid' : 'outline'"
          size="md"
          label="Autre adresse"
          icon-left="MapPin"
          class="checkout-shipping__toggle-btn"
          @click="emit('update:useProfileAddress', false)"
        />
      </div>

      <!-- Champs email et nom -->
      <div class="checkout-shipping__row">
        <div class="checkout-shipping__field">
          <WrapperInput
            :model-value="email"
            label="Email"
            required
            placeholder="votre@email.com"
            icon-name="Mail"
            icon-state="iconLeft"
            autocomplete="email"
            :readonly="isLoggedIn"
            :alert-label="errors.email || undefined"
            :alert-type="errors.email ? 'danger' : undefined"
            @update:model-value="emit('update:email', $event)"
            @blur="emit('field-blur', 'email')"
          />
        </div>
        <div class="checkout-shipping__field">
          <WrapperInput
            :model-value="fullName"
            label="Nom complet"
            required
            placeholder="Prénom Nom"
            icon-name="User"
            icon-state="iconLeft"
            autocomplete="name"
            :alert-label="errors.fullName || undefined"
            :alert-type="errors.fullName ? 'danger' : undefined"
            @update:model-value="emit('update:fullName', $event)"
            @blur="emit('field-blur', 'fullName')"
          />
        </div>
      </div>

      <!-- Champs adresse (masqués si mode relay) -->
      <template v-if="deliveryMode === 'home'">
        <!-- Autocomplétion pour la France -->
        <div v-if="country === 'France'" class="checkout-shipping__field">
          <AddressAutocomplete
            :model-value="address"
            label="Adresse *"
            placeholder="Commencez à taper votre adresse..."
            :required="true"
            :alert-label="errors.address || undefined"
            :alert-type="errors.address ? 'danger' : undefined"
            @update:model-value="emit('update:address', $event)"
            @fill="emit('address-fill', $event)"
            @blur="emit('field-blur', 'address')"
          />
        </div>
        <!-- Champ classique pour les autres pays -->
        <div v-else class="checkout-shipping__field">
          <WrapperInput
            :model-value="address"
            label="Adresse"
            required
            placeholder="Numéro et nom de rue"
            icon-name="MapPin"
            icon-state="iconLeft"
            autocomplete="street-address"
            :alert-label="errors.address || undefined"
            :alert-type="errors.address ? 'danger' : undefined"
            @update:model-value="emit('update:address', $event)"
            @blur="emit('field-blur', 'address')"
          />
        </div>

        <div class="checkout-shipping__row checkout-shipping__row--3">
          <div class="checkout-shipping__field">
            <WrapperInput
              :model-value="zip"
              :label="t('checkout.shipping.postalCode')"
              required
              placeholder="75001"
              :maxlength="10"
              autocomplete="postal-code"
              :alert-label="errors.zip || undefined"
              :alert-type="errors.zip ? 'danger' : undefined"
              @update:model-value="emit('update:zip', $event)"
              @blur="emit('field-blur', 'zip')"
            />
          </div>
          <div class="checkout-shipping__field checkout-shipping__field--grow">
            <WrapperInput
              :model-value="city"
              :label="t('checkout.shipping.city')"
              required
              placeholder="Paris"
              autocomplete="address-level2"
              :alert-label="errors.city || undefined"
              :alert-type="errors.city ? 'danger' : undefined"
              @update:model-value="emit('update:city', $event)"
              @blur="emit('field-blur', 'city')"
            />
          </div>
          <div class="checkout-shipping__field">
            <WrapperDropdown
              :model-value="country"
              :items="countryItems"
              :label="t('checkout.shipping.country')"
              placeholder="Sélectionner un pays"
              size="medium"
              force-value
              @update:model-value="emit('update:country', $event)"
            />
          </div>
        </div>
      </template>

      <!-- Code postal pour recherche relay -->
      <div v-if="deliveryMode === 'relay' && !selectedRelay" class="checkout-shipping__field">
        <WrapperInput
          :model-value="zip"
          label="Code postal (pour la recherche)"
          placeholder="Entrez votre code postal pour trouver les points relais"
          icon-name="Search"
          icon-state="iconLeft"
          autocomplete="postal-code"
          @update:model-value="emit('update:zip', $event)"
        />
      </div>
    </div>
  </ContentBlock>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RelaySelector from '@/features/livraison/mondial-relay/RelaySelector.vue'
import AddressAutocomplete from '@/features/shared/components/AddressAutocomplete.vue'
import type { RelayPoint } from '@/features/livraison/mondial-relay/relay'

interface CountryItem {
  id: string
  label: string
}

interface FormErrors {
  email: string
  fullName: string
  address: string
  zip: string
  city: string
}

defineProps<{
  deliveryMode: 'relay' | 'home'
  selectedRelay: RelayPoint | null
  brandId: string
  isLoggedIn: boolean
  useProfileAddress: boolean
  email: string
  fullName: string
  address: string
  zip: string
  city: string
  country: string
  countryItems: CountryItem[]
  errors: FormErrors
  subtotal: number
  freeShippingThreshold: number
  shippingRate: number
}>()

const emit = defineEmits([
  'update:deliveryMode',
  'update:selectedRelay',
  'update:useProfileAddress',
  'update:email',
  'update:fullName',
  'update:address',
  'update:zip',
  'update:city',
  'update:country',
  'relay-select',
  'relay-order-data',
  'relay-error',
  'address-fill',
  'field-blur',
])

const { t } = useI18n()

function formatPrice(value: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
}
</script>

<style scoped lang="less">
@import '@designSystem/fondation/selection/selectable-mixins.less';

.checkout-shipping {
  // Styles de base gérés par ContentBlock

  &__header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  &__icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.15) 0%, rgba(var(--primary-500-rgb), 0.08) 100%);
    border-radius: 14px;
    color: var(--primary-500);
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: var(--content-block-text);
    margin: 0 0 4px;
  }

  &__subtitle {
    font-size: 14px;
    color: var(--content-block-text-muted);
    margin: 0;
  }

  &__mode {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 18px 20px;
    min-height: 60px;

    .selectable-card();
    border-radius: 16px;

    &--active {
      .selectable-card--active();

      .checkout-shipping__radio-inner {
        transform: scale(1);
        opacity: 1;
      }
    }
  }

  &__radio {
    width: 22px;
    height: 22px;
    border: 2px solid var(--content-block-border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;

    .checkout-shipping__option--active & {
      border-color: var(--primary-500);
    }
  }

  &__radio-inner {
    width: 12px;
    height: 12px;
    background: var(--primary-500);
    border-radius: 50%;
    transform: scale(0);
    opacity: 0;
    transition: all 0.2s ease;
  }

  &__option-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    flex-shrink: 0;

    &--relay {
      background: linear-gradient(135deg, @blue-100 0%, @blue-50 100%);
      color: @blue-600;
    }

    &--home {
      background: linear-gradient(135deg, @purple-100 0%, @purple-50 100%);
      color: @purple-600;
    }
  }

  &__option-content {
    flex: 1;
    text-align: left;
    min-width: 0;
  }

  &__option-title {
    display: block;
    font-size: 15px;
    font-weight: 600;
    color: var(--content-block-text);
    margin-bottom: 2px;
  }

  &__option-desc {
    display: block;
    font-size: 13px;
    color: var(--content-block-text-muted);
  }

  &__option-price {
    font-size: 14px;
    font-weight: 600;
    color: var(--content-block-text-secondary);
    flex-shrink: 0;

    &--free {
      color: @success-500;
    }
  }

  &__relay {
    margin-bottom: 24px;
    padding: 20px;
    background: var(--content-block-bg-subtle);
    border-radius: 16px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__toggle {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
  }

  &__toggle-btn {
    flex: 1;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    &--3 {
      grid-template-columns: 140px 1fr 180px;
    }
  }

  &__field {
    &--grow {
      flex: 1;
    }
  }
}

// Tablet
.respond-tablet({
  .checkout-shipping {
    padding: 20px;
    border-radius: 20px;

    &__row--3 {
      grid-template-columns: 1fr 1fr;

      .checkout-shipping__field:last-child {
        grid-column: span 2;
      }
    }
  }
});

// Mobile
.respond-mobile({
  .checkout-shipping {
    padding: 16px;
    border-radius: 16px;

    &__header {
      gap: 12px;
      margin-bottom: 16px;
    }

    &__icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    &__title {
      font-size: 16px;
    }

    &__subtitle {
      font-size: 13px;
    }

    &__mode {
      gap: 10px;
      margin-bottom: 16px;
    }

    &__option {
      padding: 14px;
      gap: 12px;
      border-radius: 12px;
      flex-wrap: wrap;
      min-height: 56px;
    }

    &__option-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    &__option-title {
      font-size: 14px;
    }

    &__option-desc {
      font-size: 12px;
    }

    &__option-price {
      font-size: 13px;
      width: 100%;
      text-align: right;
      padding-top: 8px;
      margin-top: 4px;
      border-top: 1px dashed @neutral-200;
    }

    &__relay {
      padding: 14px;
      border-radius: 12px;
      margin-bottom: 16px;
    }

    &__toggle {
      flex-direction: column;
      gap: 8px;
    }

    &__row {
      grid-template-columns: 1fr;
      gap: 12px;

      &--3 {
        grid-template-columns: 1fr;

        .checkout-shipping__field:last-child {
          grid-column: auto;
        }
      }
    }
  }
});
</style>
