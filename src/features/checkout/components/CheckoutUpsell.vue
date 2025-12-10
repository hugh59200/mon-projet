<template>
  <div v-if="showUpsell" class="checkout-upsell">
    <!-- Section livraison gratuite -->
    <ContentBlock
      v-if="showFreeShippingNudge"
      variant="info"
      size="sm"
      class="checkout-upsell__shipping"
    >
      <div class="checkout-upsell__shipping-header">
        <BasicIconNext name="Truck" :size="18" />
        <div class="checkout-upsell__shipping-text">
          <span class="checkout-upsell__shipping-title">
            {{ t('aov.freeShipping.progress', { amount: amountToFreeShipping.toFixed(2) + '€' }) }}
          </span>
          <span class="checkout-upsell__shipping-subtitle">
            {{ t('aov.freeShipping.suggestion') }}
          </span>
        </div>
      </div>

      <!-- Suggestions pour atteindre le seuil -->
      <div v-if="suggestedProducts.length > 0" class="checkout-upsell__suggestions">
        <div
          v-for="product in suggestedProducts"
          :key="product.id"
          class="upsell-mini-card"
        >
          <img
            :src="product.image || defaultImage"
            :alt="getProductName(product)"
            class="upsell-mini-card__image"
          />
          <div class="upsell-mini-card__info">
            <span class="upsell-mini-card__name">{{ getProductName(product) }}</span>
            <span class="upsell-mini-card__price">{{ getPrice(product).toFixed(2) }}€</span>
          </div>
          <PremiumButton
            type="primary"
            variant="solid"
            size="xs"
            :icon-left="addedProducts.has(product.id) ? 'Check' : 'Plus'"
            :disabled="addedProducts.has(product.id)"
            class="upsell-mini-card__add"
            @click="addProduct(product)"
          />
        </div>
      </div>
    </ContentBlock>

    <!-- Section "Ajouter une fiole du même lot" -->
    <ContentBlock
      v-if="cartItemsForUpsell.length > 0"
      variant="card"
      size="md"
      class="checkout-upsell__same-lot"
    >
      <div class="checkout-upsell__header">
        <BasicIconNext name="Package" :size="16" />
        <span>{{ t('aov.checkout.title') }}</span>
      </div>

      <div class="checkout-upsell__items">
        <div
          v-for="(item, index) in cartItemsForUpsell"
          :key="item.product_id ?? `upsell-${index}`"
          class="upsell-item"
        >
          <div class="upsell-item__info">
            <span class="upsell-item__name">{{ item.product_name }}</span>
            <span class="upsell-item__benefit">
              <BasicIconNext name="FlaskConical" :size="12" />
              {{ t('aov.checkout.sameLotBenefit') }}
            </span>
          </div>
          <div class="upsell-item__action">
            <span class="upsell-item__price">+{{ getItemPrice(item).toFixed(2) }}€</span>
            <PremiumButton
              type="primary"
              variant="solid"
              size="sm"
              :label="addedItems.has(item.product_id || '') ? t('aov.checkout.added') : t('aov.checkout.addSameVial')"
              :disabled="addedItems.has(item.product_id || '')"
              class="upsell-item__btn"
              @click="addSameItem(item)"
            />
          </div>
        </div>
      </div>
    </ContentBlock>
  </div>
</template>

<script setup lang="ts">
import { useCartStore, type SimpleCartItem } from '@/features/catalogue/cart/stores/useCartStore'
import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import type { Products } from '@/supabase/types/supabase.types'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const cartStore = useCartStore()

const FREE_SHIPPING_THRESHOLD = 100
const defaultImage = '/images/default-product.png'

const suggestedProducts = ref<Products[]>([])
const addedProducts = ref(new Set<string>())
const addedItems = ref(new Set<string>())

// Montant pour atteindre la livraison gratuite
const amountToFreeShipping = computed(() => {
  const remaining = FREE_SHIPPING_THRESHOLD - cartStore.totalPrice
  return remaining > 0 ? remaining : 0
})

// Afficher la nudge si entre 10€ et 50€ du seuil
const showFreeShippingNudge = computed(() => {
  return amountToFreeShipping.value > 0 && amountToFreeShipping.value <= 50
})

// Articles du panier éligibles à l'upsell "même lot"
const cartItemsForUpsell = computed(() => {
  return cartStore.items.filter((item) => (item.quantity ?? 0) < 5)
})

// Afficher l'upsell si pertinent
const showUpsell = computed(() => {
  return showFreeShippingNudge.value || cartItemsForUpsell.value.length > 0
})

function getProductName(product: Products): string {
  if (product.name_i18n && typeof product.name_i18n === 'object') {
    const i18n = product.name_i18n as Record<string, string>
    return i18n[locale.value] || i18n['fr'] || product.name
  }
  return product.name
}

function getPrice(product: Products): number {
  if (product.is_on_sale && product.sale_price) {
    return product.sale_price
  }
  return product.price
}

function getItemPrice(item: SimpleCartItem): number {
  if (item.is_on_sale && item.product_sale_price) {
    return item.product_sale_price
  }
  return item.product_price ?? 0
}

async function loadSuggestedProducts() {
  // Charger des produits à prix bas pour atteindre le seuil
  const maxPrice = amountToFreeShipping.value + 10
  const cartProductIds = cartStore.items.map((i) => i.product_id).filter(Boolean)

  const { data } = await supabase
    .from('products')
    .select('*')
    .gt('stock', 0)
    .lte('price', maxPrice)
    .not('id', 'in', `(${cartProductIds.join(',')})`)
    .order('price', { ascending: true })
    .limit(3)

  suggestedProducts.value = data || []
}

async function addProduct(product: Products) {
  await cartStore.addToCart(product)
  addedProducts.value.add(product.id)
}

async function addSameItem(item: SimpleCartItem) {
  if (!item.product_id) return
  await cartStore.updateQuantity(item.product_id, (item.quantity ?? 0) + 1)
  addedItems.value.add(item.product_id)
}

onMounted(() => {
  if (showFreeShippingNudge.value) {
    loadSuggestedProducts()
  }
})
</script>

<style scoped lang="less">
@import '@designSystem/fondation/breakpoints/responsive-mixins.less';

@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.checkout-upsell {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;

  &__shipping {
    // Styles de base gérés par ContentBlock
  }

  &__shipping-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;

    svg {
      color: var(--primary-400);
      flex-shrink: 0;
      margin-top: 2px;
    }
  }

  &__shipping-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__shipping-title {
    font-family: @font-body;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  &__shipping-subtitle {
    font-family: @font-body;
    font-size: 12px;
    color: var(--text-muted);
  }

  &__suggestions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__same-lot {
    // Styles de base gérés par ContentBlock
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    font-family: @font-body;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);

    svg {
      color: var(--primary-500);
    }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.upsell-mini-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-default);
  border-radius: 10px;
  transition: all 0.2s @ease;

  &:hover {
    border-color: var(--primary-300);
  }

  &__image {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: 6px;
    background: var(--bg-subtle);
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__name {
    font-family: @font-body;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__price {
    font-family: @font-display;
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-400);
  }

  &__add {
    flex-shrink: 0;
  }
}

.upsell-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-default);
  border-radius: 10px;

  &__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__name {
    font-family: @font-body;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
  }

  &__benefit {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: @font-body;
    font-size: 12px;
    color: var(--text-muted);

    svg {
      color: var(--primary-500);
      flex-shrink: 0;
    }
  }

  &__action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border-default);
  }

  &__price {
    font-family: @font-display;
    font-size: 16px;
    font-weight: 700;
    color: var(--primary-600);
  }

  &__btn {
    white-space: nowrap;
  }
}
</style>
