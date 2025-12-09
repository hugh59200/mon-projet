<template>
  <div class="quantity-selector">
    <!-- Header avec badge "Même lot" -->
    <div class="quantity-selector__header">
      <span class="quantity-selector__label">{{ t('aov.quantity.title') }}</span>
      <div class="quantity-selector__lot-badge">
        <BasicIconNext name="Package" :size="12" />
        <span>{{ t('aov.quantity.sameLot') }}</span>
      </div>
    </div>

    <!-- Options de quantité -->
    <div class="quantity-selector__options">
      <button
        v-for="option in quantityOptions"
        :key="option.qty"
        class="quantity-option"
        :class="{
          'quantity-option--active': modelValue === option.qty,
          'quantity-option--popular': option.popular,
        }"
        @click="selectQuantity(option.qty)"
      >
        <!-- Badge populaire -->
        <span v-if="option.popular" class="quantity-option__popular">
          {{ t('aov.quantity.popular') }}
        </span>

        <!-- Quantité -->
        <div class="quantity-option__qty">
          <span class="quantity-option__number">{{ option.qty }}</span>
          <span class="quantity-option__unit">
            {{ option.qty === 1 ? t('aov.quantity.unit') : t('aov.quantity.units') }}
          </span>
        </div>

        <!-- Prix -->
        <div class="quantity-option__pricing">
          <span class="quantity-option__total">{{ option.total.toFixed(2) }}€</span>
          <span v-if="option.discount > 0" class="quantity-option__discount">
            -{{ option.discount }}%
          </span>
        </div>

        <!-- Prix unitaire -->
        <span class="quantity-option__per-unit">
          {{ option.unitPrice.toFixed(2) }}€ / {{ t('aov.quantity.unit') }}
        </span>

        <!-- Économie -->
        <div v-if="option.savings > 0" class="quantity-option__savings">
          <BasicIconNext name="TrendingDown" :size="12" />
          <span>{{ t('aov.quantity.savings') }} {{ option.savings.toFixed(2) }}€</span>
        </div>

        <!-- Label tarif labo -->
        <span v-if="option.discount > 0" class="quantity-option__lab-rate">
          {{ t('aov.quantity.labRate') }}
        </span>
      </button>
    </div>

    <!-- Info cohérence de lot -->
    <div class="quantity-selector__info">
      <BasicIconNext name="Info" :size="14" />
      <span>{{ t('aov.quantity.sameLotDesc') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Type pour les prix dégressifs (vient de la DB)
export interface BulkPricingItem {
  quantity: number
  discount_percent: number
}

const props = withDefaults(
  defineProps<{
    modelValue: number
    basePrice: number
    bulkPricing?: BulkPricingItem[] | null
  }>(),
  {
    bulkPricing: null,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

interface QuantityOption {
  qty: number
  discount: number
  unitPrice: number
  total: number
  savings: number
  popular: boolean
}

// Configuration par défaut si pas de bulk_pricing en DB
const defaultPackConfigs: BulkPricingItem[] = [
  { quantity: 3, discount_percent: 5 },
  { quantity: 5, discount_percent: 10 },
]

// Utilise les données du produit ou les valeurs par défaut
const packConfigs = computed(() => {
  const configs = props.bulkPricing && props.bulkPricing.length > 0
    ? props.bulkPricing
    : defaultPackConfigs

  // Toujours ajouter l'option "1 unité" sans remise
  const result = [{ quantity: 1, discount_percent: 0 }]

  // Ajouter les autres options triées par quantité
  configs
    .filter((c) => c.quantity > 1)
    .sort((a, b) => a.quantity - b.quantity)
    .forEach((c) => result.push(c))

  return result
})

const quantityOptions = computed<QuantityOption[]>(() => {
  return packConfigs.value.map((pack, index) => {
    const discountMultiplier = 1 - pack.discount_percent / 100
    const unitPrice = props.basePrice * discountMultiplier
    const total = unitPrice * pack.quantity
    const savings = (props.basePrice * pack.quantity) - total

    // Le 2ème élément (index 1) est marqué comme populaire
    const popular = index === 1

    return {
      qty: pack.quantity,
      discount: pack.discount_percent,
      unitPrice,
      total,
      savings,
      popular,
    }
  })
})

function selectQuantity(qty: number) {
  emit('update:modelValue', qty)
}
</script>

<style scoped lang="less">
@import '@designSystem/fondation/breakpoints/responsive-mixins.less';
@import '@designSystem/fondation/selection/selectable-mixins.less';

@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.quantity-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__label {
    font-family: @font-body;
    font-size: 14px;
    font-weight: 600;
    color: var(--content-block-text-secondary);
  }

  &__lot-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    background: rgba(var(--primary-500-rgb), 0.15);
    border: 1px solid rgba(var(--primary-500-rgb), 0.25);
    border-radius: 6px;
    font-family: @font-body;
    font-size: 11px;
    font-weight: 500;
    color: var(--primary-600);
  }

  &__options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;

    .respond-mobile({
      grid-template-columns: 1fr;
    });
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: var(--content-block-bg-subtle);
    border-radius: 8px;
    font-family: @font-body;
    font-size: 12px;
    color: var(--content-block-text-muted);

    svg {
      color: var(--primary-500);
      flex-shrink: 0;
    }
  }
}

.quantity-option {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;

  // Utilise le mixin sélectionnable (thème dark pour mise en avant)
  .selectable-card();

  &--active {
    .selectable-card--active();

    .quantity-option__number {
      color: var(--primary-400);
    }
  }

  &--popular {
    // Bordure verte subtile pour "populaire"
    border-color: rgba(var(--success-500-rgb), 0.4);

    &.quantity-option--active {
      .selectable-card--active();
    }
  }

  &__popular {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    padding: 3px 8px;
    background: linear-gradient(135deg, @success-500 0%, @success-600 100%);
    border-radius: 4px;
    font-family: @font-body;
    font-size: 9px;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  &__qty {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  &__number {
    font-family: @font-display;
    font-size: 28px;
    font-weight: 700;
    color: var(--content-block-text);
    line-height: 1;
    transition: color 0.2s @ease;
  }

  &__unit {
    font-family: @font-body;
    font-size: 12px;
    color: var(--content-block-text-muted);
  }

  &__pricing {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__total {
    font-family: @font-display;
    font-size: 18px;
    font-weight: 700;
    color: var(--content-block-text);
  }

  &__discount {
    padding: 2px 6px;
    background: linear-gradient(135deg, @danger-500 0%, @danger-600 100%);
    border-radius: 4px;
    font-family: @font-body;
    font-size: 10px;
    font-weight: 700;
    color: white;
  }

  &__per-unit {
    font-family: @font-body;
    font-size: 11px;
    color: var(--content-block-text-muted);
  }

  &__savings {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: rgba(var(--success-500-rgb), 0.15);
    border-radius: 6px;
    font-family: @font-body;
    font-size: 11px;
    font-weight: 600;
    color: @success-600;
  }

  &__lab-rate {
    font-family: @font-body;
    font-size: 10px;
    font-weight: 500;
    color: var(--primary-600);
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
}
</style>
