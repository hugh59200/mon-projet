<template>
  <div class="cart">
    <!-- Background -->
    <div class="cart__bg">
      <div class="cart__bg-gradient"></div>
      <div class="cart__bg-pattern"></div>
    </div>

    <div class="cart__container">
      <!-- Header -->
      <header class="cart__header">
        <div class="cart__header-left">
          <button
            class="cart__back"
            @click="$router.push('/catalogue')"
          >
            <BasicIconNext name="ArrowLeft" :size="20" />
            <span>{{ t('cart.continueShopping') }}</span>
          </button>
        </div>

        <h1 class="cart__title">
          <BasicIconNext name="ShoppingCart" :size="28" />
          {{ t('cart.title') }}
          <span
            v-if="cart.items.length > 0"
            class="cart__title-count"
          >
            {{ cart.items.length }}
          </span>
        </h1>

        <div class="cart__header-right">
          <button
            v-if="cart.items.length > 0"
            class="cart__clear"
            @click="confirmClearCart"
          >
            <BasicIconNext name="Trash2" :size="18" />
            <span>{{ t('cart.clear') }}</span>
          </button>
        </div>
      </header>

      <!-- Empty State -->
      <div
        v-if="cart.items.length === 0"
        class="cart__empty"
      >
        <div class="cart__empty-visual">
          <div class="cart__empty-icon">
            <BasicIconNext name="ShoppingCart" :size="64" />
          </div>
          <div class="cart__empty-circles">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <h2 class="cart__empty-title">{{ t('cart.empty') }}</h2>
        <p class="cart__empty-text">
          {{ t('cart.emptyText') }}
        </p>

        <button
          class="cart__empty-btn"
          @click="$router.push('/catalogue')"
        >
          <BasicIconNext name="ShoppingBag" :size="20" />
          {{ t('home.hero.cta.explore') }}
        </button>

        <!-- Suggestions -->
        <div class="cart__suggestions">
          <p class="cart__suggestions-title">{{ t('cart.popularProducts') }}</p>
          <div class="cart__suggestions-tags">
            <button @click="$router.push('/catalogue?categories=Anti-âge')">Anti-âge</button>
            <button @click="$router.push('/catalogue?categories=Performance')">Performance</button>
            <button @click="$router.push('/catalogue?categories=Récupération')">
              Récupération
            </button>
          </div>
        </div>
      </div>

      <!-- Cart Content -->
      <div
        v-else
        class="cart__content"
      >
        <!-- Items List -->
        <div class="cart__main">
          <!-- Table Header -->
          <div class="cart__table-header">
            <span class="cart__col cart__col--product">{{ t('cart.item') }}</span>
            <span class="cart__col cart__col--price">{{ t('cart.price') }}</span>
            <span class="cart__col cart__col--quantity">{{ t('cart.quantity') }}</span>
            <span class="cart__col cart__col--total">{{ t('cart.total') }}</span>
            <span class="cart__col cart__col--actions"></span>
          </div>

          <!-- Items -->
          <div class="cart__items">
            <div
              v-for="item in cart.items"
              class="cart-item"
            >
              <!-- Product Info -->
              <div class="cart-item__product">
                <div
                  class="cart-item__image"
                  @click="viewProduct(item.product_id!)"
                >
                  <img
                    :src="item.product_image || defaultImage"
                    :alt="item.product_name!"
                  />
                  <span
                    v-if="item.is_on_sale"
                    class="cart-item__badge"
                  >
                    -{{ getDiscountPercent(item) }}%
                  </span>
                </div>

                <div class="cart-item__info">
                  <h3
                    class="cart-item__name"
                    @click="viewProduct(item.product_id!)"
                  >
                    {{ item.product_name }}
                  </h3>
                  <p
                    v-if="item.product_dosage"
                    class="cart-item__dosage"
                  >
                    {{ item.product_dosage }}
                  </p>
                  <div class="cart-item__meta">
                    <span class="cart-item__stock cart-item__stock--in">
                      <BasicIconNext name="CheckCircle2" :size="12" />
                      {{ t('catalogue.product.inStock') }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Price -->
              <div class="cart-item__price">
                <span
                  v-if="item.is_on_sale"
                  class="cart-item__price-old"
                >
                  {{ formatPrice(item.product_price) }}
                </span>
                <span
                  class="cart-item__price-current"
                  :class="{ 'cart-item__price-current--sale': item.is_on_sale }"
                >
                  {{ formatPrice(item.is_on_sale ? item.product_sale_price : item.product_price) }}
                </span>
              </div>

              <!-- Quantity -->
              <div class="cart-item__quantity">
                <div class="cart-item__qty-control">
                  <button
                    class="cart-item__qty-btn"
                    @click="updateQuantity(item, -1)"
                    :disabled="(item.quantity ?? 1) <= 1"
                  >
                    <BasicIconNext name="Minus" :size="16" />
                  </button>
                  <input
                    type="number"
                    class="cart-item__qty-input"
                    :value="item.quantity ?? 1"
                    min="1"
                    @change="handleQuantityChange(item, $event)"
                  />
                  <button
                    class="cart-item__qty-btn"
                    @click="updateQuantity(item, 1)"
                  >
                    <BasicIconNext name="Plus" :size="16" />
                  </button>
                </div>
              </div>

              <!-- Total -->
              <div class="cart-item__total">
                <span class="cart-item__total-value">
                  {{ formatPrice(getLineTotal(item)) }}
                </span>
              </div>

              <!-- Actions -->
              <div class="cart-item__actions">
                <button
                  class="cart-item__remove"
                  @click="removeItem(item)"
                  :title="t('common.delete')"
                >
                  <BasicIconNext name="Trash2" :size="18" />
                </button>
              </div>

              <!-- Mobile Layout -->
              <div class="cart-item__mobile-bottom">
                <div class="cart-item__qty-control cart-item__qty-control--mobile">
                  <button
                    class="cart-item__qty-btn"
                    @click="updateQuantity(item, -1)"
                    :disabled="(item.quantity ?? 1) <= 1"
                  >
                    <BasicIconNext name="Minus" :size="16" />
                  </button>
                  <span class="cart-item__qty-value">{{ item.quantity ?? 1 }}</span>
                  <button
                    class="cart-item__qty-btn"
                    @click="updateQuantity(item, 1)"
                  >
                    <BasicIconNext name="Plus" :size="16" />
                  </button>
                </div>

                <div class="cart-item__mobile-total">
                  {{ formatPrice(getLineTotal(item)) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Sidebar -->
        <aside class="cart__sidebar">
          <div class="cart__summary">
            <h3 class="cart__summary-title">
              <BasicIconNext name="ClipboardList" :size="20" />
              {{ t('checkout.summary.title') }}
            </h3>

            <div class="cart__summary-rows">
              <div class="cart__summary-row">
                <span>{{ t('cart.subtotal') }} ({{ cart.totalItems }} {{ t('cart.items').toLowerCase() }})</span>
                <span>{{ formatPrice(cartSubtotal) }}</span>
              </div>

              <div
                v-if="totalDiscount > 0"
                class="cart__summary-row cart__summary-row--discount"
              >
                <span>
                  <BasicIconNext name="Tag" :size="14" />
                  {{ t('cart.discount') }}
                </span>
                <span>-{{ formatPrice(totalDiscount) }}</span>
              </div>

              <div class="cart__summary-row">
                <span>{{ t('cart.shipping') }}</span>
                <span :class="{ 'cart__summary-free': shippingCost === 0 }">
                  {{ shippingCost === 0 ? t('cart.freeShipping') : formatPrice(shippingCost) }}
                </span>
              </div>

              <!-- Shipping Progress -->
              <div
                v-if="cartSubtotal < FREE_SHIPPING_THRESHOLD"
                class="cart__shipping-progress"
              >
                <div class="cart__shipping-bar">
                  <div
                    class="cart__shipping-fill"
                    :style="{ width: `${(cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100}%` }"
                  ></div>
                </div>
                <p class="cart__shipping-text">
                  <BasicIconNext name="Truck" :size="14" />
                  {{ t('cart.freeShippingProgress', { amount: formatPrice(FREE_SHIPPING_THRESHOLD - cartSubtotal) }) }}
                </p>
              </div>

              <div
                v-else
                class="cart__shipping-success"
              >
                <BasicIconNext name="CheckCircle2" :size="18" />
                <span>{{ t('cart.freeShippingUnlocked') }}</span>
              </div>

              <div class="cart__summary-divider"></div>

              <div class="cart__summary-row cart__summary-row--total">
                <span>{{ t('cart.total') }}</span>
                <span>{{ formatPrice(finalTotal) }}</span>
              </div>
            </div>

            <button
              class="cart__checkout-btn"
              @click="$router.push('/checkout')"
            >
              <BasicIconNext name="Shield" :size="20" />
              {{ t('cart.checkout') }}
            </button>

            <!-- Trust Badges -->
            <div class="cart__trust">
              <div class="cart__trust-item">
                <BasicIconNext name="Lock" :size="18" />
                <span>{{ t('product.trustBadges.secure') }}</span>
              </div>
              <div class="cart__trust-item">
                <BasicIconNext name="Truck" :size="18" />
                <span>{{ t('product.trustBadges.shipping') }}</span>
              </div>
              <div class="cart__trust-item">
                <BasicIconNext name="ShieldCheck" :size="18" />
                <span>{{ t('product.trustBadges.quality') }}</span>
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="cart__payment-methods">
              <span>{{ t('cart.weAccept') }}</span>
              <div class="cart__payment-icons">
                <div class="cart__payment-icon" title="Visa">
                  <BasicIconNext name="visa" :size="32" />
                </div>
                <div class="cart__payment-icon" title="Mastercard">
                  <BasicIconNext name="mastercard" :size="32" />
                </div>
                <div class="cart__payment-icon" title="PayPal">
                  <BasicIconNext name="paypal" :size="32" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import type { CartView } from '@/supabase/types/supabase.types'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const { t } = useI18n()

  const cart = useCartStore()
  const router = useRouter()
  const toast = useToastStore()

  // Constants
  const FREE_SHIPPING_THRESHOLD = 100
  const FLAT_SHIPPING_RATE = 9.9

  // Computed
  const cartSubtotal = computed(() => cart.totalPrice)

  const totalDiscount = computed(() => {
    return cart.items.reduce((total, item) => {
      if (item.is_on_sale && item.product_price && item.product_sale_price) {
        const discount = (item.product_price - item.product_sale_price) * (item.quantity ?? 1)
        return total + discount
      }
      return total
    }, 0)
  })

  const shippingCost = computed(() =>
    cartSubtotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE,
  )

  const finalTotal = computed(() => cartSubtotal.value + shippingCost.value)

  // Methods
  function formatPrice(value: number | null | undefined) {
    if (value == null || isNaN(Number(value))) return '0,00 €'
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
      Number(value),
    )
  }

  function getLineTotal(item: CartView) {
    const qty = item.quantity ?? 1
    const price = item.is_on_sale
      ? (item.product_sale_price ?? item.product_price ?? 0)
      : (item.product_price ?? 0)
    return price * qty
  }

  function getDiscountPercent(item: CartView) {
    if (item.is_on_sale && item.product_price && item.product_sale_price) {
      return Math.round((1 - item.product_sale_price / item.product_price) * 100)
    }
    return 0
  }

  function updateQuantity(item: CartView, delta: number) {
    const newQty = (item.quantity ?? 1) + delta
    if (newQty >= 1 && item.product_id) {
      cart.updateQuantity(item.product_id, newQty)
    }
  }

  function handleQuantityChange(item: CartView, event: Event) {
    const input = event.target as HTMLInputElement
    const newQty = parseInt(input.value)
    if (newQty >= 1 && item.product_id) {
      cart.updateQuantity(item.product_id, newQty)
    } else {
      input.value = String(item.quantity ?? 1)
    }
  }

  function removeItem(item: CartView) {
    if (item.product_id) {
      cart.removeFromCart(item.product_id)
      toast.show(`${item.product_name} ${t('cart.remove').toLowerCase()}`, 'info')
    }
  }

  function confirmClearCart() {
    if (confirm(t('cart.clear') + ' ?')) {
      cart.clearCart()
      toast.show(t('cart.clear'), 'info')
    }
  }

  function viewProduct(id: string) {
    if (id) router.push(`/catalogue/${id}`)
  }
</script>

<style scoped lang="less">
  @font-display:
    'Instrument Sans',
    'SF Pro Display',
    -apple-system,
    sans-serif;
  @font-body:
    'Inter',
    'SF Pro Text',
    -apple-system,
    sans-serif;
  @ease: cubic-bezier(0.4, 0, 0.2, 1);

  .cart {
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
      left: 0;
      width: 60%;
      height: 60%;
      background: radial-gradient(
        ellipse at top left,
        rgba(var(--primary-500-rgb), 0.06) 0%,
        transparent 60%
      );
    }

    &__bg-pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(var(--primary-500-rgb), 0.03) 1px, transparent 1px);
      background-size: 32px 32px;
      mask-image: linear-gradient(to bottom, black 0%, transparent 50%);
    }

    // ============================================
    // CONTAINER
    // ============================================
    &__container {
      position: relative;
      z-index: 1;
      max-width: 1280px;
      margin: 0 auto;
      padding: 24px 32px 80px;
    }

    // ============================================
    // HEADER
    // ============================================
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 1px solid @neutral-200;
    }

    &__header-left,
    &__header-right {
      flex: 1;
    }

    &__header-right {
      display: flex;
      justify-content: flex-end;
    }

    &__back {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 10px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 500;
      color: @neutral-700;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: @neutral-50;
        border-color: var(--primary-300);
        color: var(--primary-700);
        transform: translateX(-4px);

        svg {
          transform: translateX(-2px);
        }
      }

      svg {
        transition: transform 0.2s @ease;
      }
    }

    &__title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-family: @font-display;
      font-size: 28px;
      font-weight: 700;
      color: @neutral-900;
      margin: 0;

      svg {
        color: var(--primary-500);
      }
    }

    &__title-count {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 28px;
      height: 28px;
      padding: 0 8px;
      background: var(--primary-500);
      border-radius: 14px;
      font-size: 14px;
      font-weight: 600;
      color: white;
    }

    &__clear {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: transparent;
      border: 1px solid @neutral-200;
      border-radius: 8px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: @neutral-500;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: @danger-50;
        border-color: @danger-200;
        color: @danger-500;
      }
    }

    // ============================================
    // EMPTY STATE
    // ============================================
    &__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px 32px;
      background: white;
      border-radius: 24px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 32px rgba(0, 0, 0, 0.04);
      border: 1px solid @neutral-100;
      text-align: center;
    }

    &__empty-visual {
      position: relative;
      margin-bottom: 32px;
    }

    &__empty-icon {
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, @neutral-100 0%, @neutral-50 100%);
      border-radius: 50%;
      color: @neutral-400;
    }

    &__empty-circles {
      position: absolute;
      inset: -20px;

      span {
        position: absolute;
        border: 2px dashed @neutral-200;
        border-radius: 50%;

        &:nth-child(1) {
          inset: 0;
          animation: pulse-ring 2s ease-out infinite;
        }

        &:nth-child(2) {
          inset: -15px;
          animation: pulse-ring 2s ease-out infinite 0.5s;
        }

        &:nth-child(3) {
          inset: -30px;
          animation: pulse-ring 2s ease-out infinite 1s;
        }
      }
    }

    &__empty-title {
      font-family: @font-display;
      font-size: 24px;
      font-weight: 600;
      color: @neutral-900;
      margin: 0 0 12px;
    }

    &__empty-text {
      font-family: @font-body;
      font-size: 16px;
      color: @neutral-500;
      margin: 0 0 32px;
      max-width: 400px;
    }

    &__empty-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 32px;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      border: none;
      border-radius: 14px;
      font-family: @font-body;
      font-size: 16px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: all 0.25s @ease;
      box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(var(--primary-500-rgb), 0.4);
      }
    }

    &__suggestions {
      margin-top: 48px;
      padding-top: 32px;
      border-top: 1px solid @neutral-100;
    }

    &__suggestions-title {
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: @neutral-500;
      margin: 0 0 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    &__suggestions-tags {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;

      button {
        padding: 10px 20px;
        background: @neutral-50;
        border: 1px solid @neutral-200;
        border-radius: 20px;
        font-family: @font-body;
        font-size: 14px;
        font-weight: 500;
        color: @neutral-700;
        cursor: pointer;
        transition: all 0.2s @ease;

        &:hover {
          background: white;
          border-color: var(--primary-300);
          color: var(--primary-700);
        }
      }
    }

    // ============================================
    // CONTENT LAYOUT
    // ============================================
    &__content {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 32px;
      align-items: start;
    }

    &__main {
      background: white;
      border-radius: 20px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 32px rgba(0, 0, 0, 0.04);
      border: 1px solid @neutral-100;
      overflow: hidden;
    }

    // ============================================
    // TABLE HEADER
    // ============================================
    &__table-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 60px;
      gap: 16px;
      padding: 16px 24px;
      background: @neutral-50;
      border-bottom: 1px solid @neutral-100;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      color: @neutral-500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    &__col {
      &--price,
      &--quantity,
      &--total {
        text-align: center;
      }

      &--actions {
        text-align: right;
      }
    }

    // ============================================
    // ITEMS
    // ============================================
    &__items {
      display: flex;
      flex-direction: column;
    }

    // ============================================
    // SIDEBAR
    // ============================================
    &__sidebar {
      position: sticky;
      top: 24px;
    }

    &__summary {
      background: white;
      border-radius: 20px;
      padding: 28px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 32px rgba(0, 0, 0, 0.04);
      border: 1px solid @neutral-100;
    }

    &__summary-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: @font-display;
      font-size: 18px;
      font-weight: 600;
      color: @neutral-900;
      margin: 0 0 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid @neutral-100;

      svg {
        color: var(--primary-500);
      }
    }

    &__summary-rows {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    &__summary-row {
      display: flex;
      justify-content: space-between;
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-600;

      &--discount {
        color: @success-500;

        span:first-child {
          display: flex;
          align-items: center;
          gap: 6px;
        }
      }

      &--total {
        padding-top: 16px;
        font-size: 18px;
        font-weight: 700;
        color: @neutral-900;

        span:last-child {
          color: var(--primary-700);
          font-size: 24px;
        }
      }
    }

    &__summary-free {
      color: @success-500;
      font-weight: 600;
    }

    &__summary-divider {
      height: 1px;
      background: @neutral-100;
      margin: 8px 0;
    }

    &__shipping-progress {
      padding: 16px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.05) 0%,
        rgba(var(--primary-500-rgb), 0.02) 100%
      );
      border-radius: 12px;
      margin-top: 8px;
    }

    &__shipping-bar {
      height: 6px;
      background: @neutral-200;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 10px;
    }

    &__shipping-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-400));
      border-radius: 3px;
      transition: width 0.3s @ease;
    }

    &__shipping-text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: @font-body;
      font-size: 12px;
      color: @neutral-600;
      margin: 0;

      svg {
        color: var(--primary-500);
      }

      strong {
        color: var(--primary-700);
        font-weight: 600;
      }
    }

    &__shipping-success {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      background: linear-gradient(
        135deg,
        rgba(var(--success-500-rgb), 0.1) 0%,
        rgba(var(--success-500-rgb), 0.05) 100%
      );
      border-radius: 10px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: @success-600;

      svg {
        color: @success-500;
      }
    }

    &__checkout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 18px 24px;
      margin-top: 24px;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      border: none;
      border-radius: 14px;
      font-family: @font-body;
      font-size: 16px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: all 0.25s @ease;
      box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(var(--primary-500-rgb), 0.4);
      }
    }

    &__trust {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 24px;
      padding-top: 24px;
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

    &__payment-methods {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid @neutral-100;
      text-align: center;

      > span {
        font-family: @font-body;
        font-size: 12px;
        color: @neutral-400;
      }
    }

    &__payment-icons {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 12px;
    }

    &__payment-icon {
      width: 44px;
      height: 30px;
      border-radius: 6px;
      overflow: hidden;

      svg {
        width: 100%;
        height: 100%;
      }
    }
  }

  // ============================================
  // CART ITEM
  // ============================================
  .cart-item {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 60px;
    gap: 16px;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid @neutral-100;
    transition: background 0.2s @ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: @neutral-50;
    }

    &__product {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    &__image {
      position: relative;
      width: 80px;
      height: 80px;
      flex-shrink: 0;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px;
        background: @neutral-50;
        border: 1px solid @neutral-100;
        transition: transform 0.2s @ease;
      }

      &:hover img {
        transform: scale(1.05);
      }
    }

    &__badge {
      position: absolute;
      top: -6px;
      left: -6px;
      padding: 4px 8px;
      background: linear-gradient(135deg, @danger-500 0%, @danger-600 100%);
      border-radius: 6px;
      font-family: @font-body;
      font-size: 10px;
      font-weight: 700;
      color: @white;
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    &__name {
      font-family: @font-display;
      font-size: 15px;
      font-weight: 600;
      color: @neutral-900;
      margin: 0;
      cursor: pointer;
      transition: color 0.2s @ease;

      &:hover {
        color: var(--primary-600);
      }
    }

    &__dosage {
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;
      margin: 0;
    }

    &__meta {
      display: flex;
      gap: 12px;
      margin-top: 4px;
    }

    &__stock {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: @font-body;
      font-size: 12px;

      &--in {
        color: @success-500;
      }
    }

    &__price {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    &__price-old {
      font-family: @font-body;
      font-size: 12px;
      color: @neutral-400;
      text-decoration: line-through;
    }

    &__price-current {
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      color: @neutral-900;

      &--sale {
        color: @danger-500;
      }
    }

    &__quantity {
      display: flex;
      justify-content: center;
    }

    &__qty-control {
      display: flex;
      align-items: center;
      gap: 4px;
      background: @neutral-50;
      border: 1px solid @neutral-200;
      border-radius: 10px;
      padding: 4px;

      &--mobile {
        display: none;
      }
    }

    &__qty-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: none;
      border-radius: 8px;
      color: @neutral-600;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover:not(:disabled) {
        background: @neutral-100;
        color: @neutral-900;
      }

      &:disabled {
        color: @neutral-300;
        cursor: not-allowed;
        background: transparent;
      }
    }

    &__qty-input {
      width: 40px;
      text-align: center;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: @neutral-900;
      border: none;
      background: transparent;
      -moz-appearance: textfield;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &:focus {
        outline: none;
      }
    }

    &__qty-value {
      min-width: 32px;
      text-align: center;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: @neutral-900;
    }

    &__total {
      text-align: center;
    }

    &__total-value {
      font-family: @font-display;
      font-size: 16px;
      font-weight: 700;
      color: @neutral-900;
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
    }

    &__remove {
      padding: 8px;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: @neutral-400;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: @danger-50;
        color: @danger-500;
      }
    }

    &__mobile-bottom {
      display: none;
    }
  }

  // ============================================
  // ANIMATIONS
  // ============================================
  @keyframes pulse-ring {
    0% {
      opacity: 0.3;
      transform: scale(0.95);
    }
    50% {
      opacity: 0.1;
      transform: scale(1);
    }
    100% {
      opacity: 0.3;
      transform: scale(0.95);
    }
  }

  // ============================================
  // RESPONSIVE
  // ============================================
  @media (max-width: 1024px) {
    .cart {
      &__content {
        grid-template-columns: 1fr;
      }

      &__sidebar {
        position: static;
      }
    }
  }

  @media (max-width: 768px) {
    .cart {
      &__container {
        padding: 16px;
      }

      &__header {
        flex-direction: column;
        gap: 16px;
        text-align: center;

        &-left,
        &-right {
          flex: none;
          width: 100%;
          justify-content: center;
        }
      }

      &__back {
        width: 100%;
        justify-content: center;
      }

      &__table-header {
        display: none;
      }
    }

    .cart-item {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;

      &__product {
        width: 100%;
      }

      &__image {
        width: 100px;
        height: 100px;
      }

      &__price,
      &__quantity,
      &__total,
      &__actions {
        display: none;
      }

      &__info {
        flex: 1;
      }

      &__name {
        font-size: 16px;
      }

      &__mobile-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding-top: 16px;
        border-top: 1px dashed @neutral-200;
      }

      &__qty-control--mobile {
        display: flex;
      }

      &__mobile-total {
        font-family: @font-display;
        font-size: 18px;
        font-weight: 700;
        color: var(--primary-700);
      }

      // Show mobile remove button
      &__info::after {
        content: none;
      }

      &__product {
        position: relative;
      }
    }
  }
</style>
