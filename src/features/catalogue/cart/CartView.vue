<template>
  <div class="cart">
    <!-- Background -->
    <div class="cart__bg">
      <div class="cart__bg-gradient"></div>
      <div class="cart__bg-pattern"></div>
    </div>

    <!-- Header - Full width -->
    <header class="cart__header">
      <div class="cart__header-inner">
        <div class="cart__header-left">
          <PremiumButton
            type="secondary"
            variant="ghost"
            size="sm"
            :label="t('cart.continueShopping')"
            icon-left="ArrowLeft"
            @click="$router.push('/catalogue')"
          />
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
          <PremiumButton
            v-if="cart.items.length > 0"
            type="danger"
            variant="ghost"
            size="sm"
            :label="t('cart.clear')"
            icon-left="Trash2"
            class="cart__clear"
            :loading="isClearing"
            :disabled="isClearing"
            @click="confirmClearCart"
          />
        </div>
      </div>
    </header>

    <div class="cart__container">
      <!-- Progress Steps -->
      <CheckoutProgress :current-step="1" />

      <!-- Empty State -->
      <ContentBlock
        v-if="cart.items.length === 0"
        variant="card"
        size="lg"
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

        <PremiumButton
          type="primary"
          variant="solid"
          size="lg"
          :label="t('home.hero.cta.explore')"
          icon-left="ShoppingBag"
          :shine="true"
          @click="$router.push('/catalogue')"
        />

        <!-- Suggestions -->
        <div class="cart__suggestions">
          <p class="cart__suggestions-title">{{ t('cart.popularProducts') }}</p>
          <div class="cart__suggestions-tags">
            <PremiumButton
              type="secondary"
              variant="outline"
              size="xs"
              label="Anti-âge"
              @click="$router.push('/catalogue?categories=Anti-âge')"
            />
            <PremiumButton
              type="secondary"
              variant="outline"
              size="xs"
              label="Performance"
              @click="$router.push('/catalogue?categories=Performance')"
            />
            <PremiumButton
              type="secondary"
              variant="outline"
              size="xs"
              label="Récupération"
              @click="$router.push('/catalogue?categories=Récupération')"
            />
          </div>
        </div>
      </ContentBlock>

      <!-- Cart Content -->
      <div
        v-else
        class="cart__content"
      >
        <!-- Items List -->
        <ContentBlock variant="card" padding="0" class="cart__main">
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
                    -{{ getDiscountInfo(item).productDiscount }}%
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
                  <!-- Badges de promo cumulée -->
                  <div v-if="getDiscountInfo(item).totalDiscount > 0" class="cart-item__discount-badges">
                    <span
                      v-if="getDiscountInfo(item).hasCumulatedDiscounts"
                      class="cart-item__discount-badge cart-item__discount-badge--cumulated"
                    >
                      <BasicIconNext name="Zap" :size="10" />
                      -{{ getDiscountInfo(item).totalDiscount }}% (Promo + Pack)
                    </span>
                    <template v-else>
                      <span
                        v-if="getDiscountInfo(item).productDiscount > 0"
                        class="cart-item__discount-badge cart-item__discount-badge--promo"
                      >
                        <BasicIconNext name="Tag" :size="10" />
                        -{{ getDiscountInfo(item).productDiscount }}%
                      </span>
                      <span
                        v-if="getDiscountInfo(item).packDiscount > 0"
                        class="cart-item__discount-badge cart-item__discount-badge--pack"
                      >
                        <BasicIconNext name="Package" :size="10" />
                        -{{ getDiscountInfo(item).packDiscount }}% pack
                      </span>
                    </template>
                  </div>
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
                  <PremiumButton
                    type="secondary"
                    variant="ghost"
                    size="xs"
                    icon-left="Minus"
                    class="cart-item__qty-btn"
                    :disabled="(item.quantity ?? 1) <= 1 || isItemUpdating(item.product_id)"
                    :loading="isItemUpdating(item.product_id)"
                    @click="updateQuantity(item, -1)"
                  />
                  <input
                    type="number"
                    class="cart-item__qty-input"
                    :value="item.quantity ?? 1"
                    min="1"
                    :disabled="isItemUpdating(item.product_id)"
                    @change="handleQuantityChange(item, $event)"
                  />
                  <PremiumButton
                    type="secondary"
                    variant="ghost"
                    size="xs"
                    icon-left="Plus"
                    class="cart-item__qty-btn"
                    :disabled="isItemUpdating(item.product_id)"
                    :loading="isItemUpdating(item.product_id)"
                    @click="updateQuantity(item, 1)"
                  />
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
                <PremiumButton
                  type="danger"
                  variant="ghost"
                  size="xs"
                  icon-left="Trash2"
                  class="cart-item__remove"
                  :loading="isItemUpdating(item.product_id)"
                  :disabled="isItemUpdating(item.product_id)"
                  @click="removeItem(item)"
                />
              </div>

              <!-- Mobile Layout -->
              <div class="cart-item__mobile-bottom">
                <div class="cart-item__qty-control cart-item__qty-control--mobile">
                  <PremiumButton
                    type="secondary"
                    variant="ghost"
                    size="xs"
                    icon-left="Minus"
                    class="cart-item__qty-btn"
                    :disabled="(item.quantity ?? 1) <= 1 || isItemUpdating(item.product_id)"
                    :loading="isItemUpdating(item.product_id)"
                    @click="updateQuantity(item, -1)"
                  />
                  <span class="cart-item__qty-value">{{ item.quantity ?? 1 }}</span>
                  <PremiumButton
                    type="secondary"
                    variant="ghost"
                    size="xs"
                    icon-left="Plus"
                    class="cart-item__qty-btn"
                    :disabled="isItemUpdating(item.product_id)"
                    :loading="isItemUpdating(item.product_id)"
                    @click="updateQuantity(item, 1)"
                  />
                </div>

                <div class="cart-item__mobile-total">
                  {{ formatPrice(getLineTotal(item)) }}
                </div>
              </div>
            </div>
          </div>
        </ContentBlock>

        <!-- Summary Sidebar -->
        <aside class="cart__sidebar">
          <ContentBlock variant="card" size="lg" class="cart__summary">
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
              <ContentBlock
                v-if="cartSubtotal < FREE_SHIPPING_THRESHOLD"
                variant="info"
                size="sm"
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
              </ContentBlock>

              <ContentBlock
                v-else
                variant="success"
                size="sm"
                class="cart__shipping-success"
              >
                <BasicIconNext name="CheckCircle2" :size="18" />
                <span>{{ t('cart.freeShippingUnlocked') }}</span>
              </ContentBlock>

              <div class="cart__summary-divider"></div>

              <div class="cart__summary-row cart__summary-row--total">
                <span>{{ t('cart.total') }}</span>
                <span>{{ formatPrice(finalTotal) }}</span>
              </div>
            </div>

            <PremiumButton
              type="primary"
              variant="solid"
              size="lg"
              width="full"
              :label="t('cart.checkout')"
              icon-left="Shield"
              :shine="true"
              :glow="true"
              @click="$router.push('/checkout')"
            />

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
                </div>
              </div>
            </div>
          </ContentBlock>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useHead } from '@vueuse/head'
  import { DEFAULT_PRODUCT_IMAGE as defaultImage } from '@/config/productAssets'
  import { useCartStore, type SimpleCartItem } from '@/features/catalogue/cart/stores/useCartStore'
  import { getCartItemDiscountInfo, type CartItemDiscountInfo } from '@/features/catalogue/cart/helpers/cartDiscountHelper'
  import { useProductsStore } from '@/features/catalogue/composables/useProducts'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import CheckoutProgress from '@/features/checkout/components/CheckoutProgress.vue'

  // Configuration SEO pour le panier (noindex car page privée)
  useHead({
    title: 'Mon Panier - Atlas Lab Solutions',
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
      {
        name: 'description',
        content: 'Consultez votre panier et finalisez votre commande de peptides de recherche.',
      },
    ],
  })

  const { t } = useI18n()

  const cart = useCartStore()
  const productsStore = useProductsStore()
  const router = useRouter()
  const toast = useToastStore()

  // Loading states
  const updatingItems = ref<Set<string>>(new Set())
  const isClearing = ref(false)

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

  function getLineTotal(item: SimpleCartItem) {
    // Utilise le helper pour obtenir le prix final après toutes les réductions
    const info = getCartItemDiscountInfo(item)
    return info.finalUnitPrice * (item.quantity ?? 1)
  }

  function getDiscountInfo(item: SimpleCartItem): CartItemDiscountInfo {
    return getCartItemDiscountInfo(item)
  }

  async function updateQuantity(item: SimpleCartItem, delta: number) {
    const newQty = (item.quantity ?? 1) + delta
    if (newQty >= 1 && item.product_id) {
      updatingItems.value.add(item.product_id)
      try {
        await cart.updateQuantity(item.product_id, newQty)
      } finally {
        updatingItems.value.delete(item.product_id)
      }
    }
  }

  async function handleQuantityChange(item: SimpleCartItem, event: Event) {
    const input = event.target as HTMLInputElement
    const newQty = parseInt(input.value)
    if (newQty >= 1 && item.product_id) {
      updatingItems.value.add(item.product_id)
      try {
        await cart.updateQuantity(item.product_id, newQty)
      } finally {
        updatingItems.value.delete(item.product_id)
      }
    } else {
      input.value = String(item.quantity ?? 1)
    }
  }

  async function removeItem(item: SimpleCartItem) {
    if (item.product_id) {
      updatingItems.value.add(item.product_id)
      try {
        await cart.removeFromCart(item.product_id)
        toast.show(`${item.product_name} ${t('cart.remove').toLowerCase()}`, 'info')
      } finally {
        updatingItems.value.delete(item.product_id)
      }
    }
  }

  async function confirmClearCart() {
    if (confirm(t('cart.clear') + ' ?')) {
      isClearing.value = true
      try {
        await cart.clearCart()
        toast.show(t('cart.clear'), 'info')
      } finally {
        isClearing.value = false
      }
    }
  }

  function isItemUpdating(productId: string | null) {
    return productId ? updatingItems.value.has(productId) : false
  }

  function viewProduct(productId: string) {
    if (!productId) return
    // Chercher le slug dans le store des produits
    const product = productsStore.products.find((p) => p.id === productId)
    const slug = product?.slug || productId
    router.push(`/catalogue/${slug}`)
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
    background: var(--bg-page);

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
      position: relative;
      z-index: 1;
      padding: 24px 32px;
      margin-bottom: 0;
      border-bottom: 1px solid var(--border-default);
      background: var(--bg-surface);
    }

    &__header-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1280px;
      margin: 0 auto;
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
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 10px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: var(--bg-surface-secondary);
        border-color: var(--primary-300);
        color: var(--primary-500);
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
      color: var(--text-primary);
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
      border: 1px solid var(--border-default);
      border-radius: 8px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: rgba(var(--danger-500-rgb), 0.1);
        border-color: @danger-300;
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
      background: var(--content-block-bg-subtle);
      border-radius: 50%;
      color: var(--content-block-text-muted);
    }

    &__empty-circles {
      position: absolute;
      inset: -20px;

      span {
        position: absolute;
        border: 2px dashed var(--content-block-border);
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
      color: var(--content-block-text);
      margin: 0 0 12px;
    }

    &__empty-text {
      font-family: @font-body;
      font-size: 16px;
      color: var(--content-block-text-muted);
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
      border-top: 1px solid var(--content-block-border);
    }

    &__suggestions-title {
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: var(--content-block-text-muted);
      margin: 0 0 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    &__suggestions-tags {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
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
      background: var(--content-block-bg-subtle);
      border-bottom: 1px solid var(--content-block-border);
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      color: var(--content-block-text-muted);
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
      // Styles gérés par ContentBlock
    }

    &__summary-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: @font-display;
      font-size: 18px;
      font-weight: 600;
      color: var(--content-block-text);
      margin: 0 0 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--content-block-border);

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
      color: var(--content-block-text-secondary);

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
        color: var(--content-block-text);

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
      background: var(--content-block-border);
      margin: 8px 0;
    }

    &__shipping-progress {
      margin-top: 8px;
      // Styles de base gérés par ContentBlock
    }

    &__shipping-bar {
      height: 6px;
      background: var(--content-block-border);
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
      color: var(--content-block-text-secondary);
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
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: @success-600;
      // Styles de base gérés par ContentBlock

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
      border-top: 1px solid var(--content-block-border);
    }

    &__trust-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: @font-body;
      font-size: 13px;
      color: var(--content-block-text-muted);

      svg {
        color: @success-500;
      }
    }

    &__payment-methods {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--content-block-border);
      text-align: center;

      > span {
        font-family: @font-body;
        font-size: 12px;
        color: var(--content-block-text-muted);
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
    border-bottom: 1px solid var(--content-block-border);
    transition: background 0.2s @ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: var(--content-block-bg-subtle);
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
        background: var(--content-block-bg-subtle);
        border: 1px solid var(--content-block-border);
        transition: transform 0.2s @ease;
      }

      &:hover img {
        // Pas de grossissement
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
      color: var(--content-block-text);
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
      color: var(--content-block-text-muted);
      margin: 0;
    }

    &__discount-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }

    &__discount-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      white-space: nowrap;

      &--promo {
        background: rgba(@danger-500, 0.12);
        color: @danger-600;
      }

      &--pack {
        background: rgba(@success-500, 0.12);
        color: @success-600;
      }

      &--cumulated {
        background: linear-gradient(135deg, rgba(@success-500, 0.12) 0%, rgba(@primary-500, 0.12) 100%);
        color: @success-600;
      }
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
      color: var(--content-block-text-muted);
      text-decoration: line-through;
    }

    &__price-current {
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      color: var(--content-block-text);

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
      background: var(--content-block-bg-subtle);
      border: 1px solid var(--content-block-border);
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
      background: transparent;
      border: none;
      border-radius: 8px;
      color: var(--content-block-text-secondary);
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover:not(:disabled) {
        background: var(--content-block-border);
        color: var(--content-block-text);
      }

      &:disabled {
        color: var(--content-block-text-muted);
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
      color: var(--content-block-text);
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
      color: var(--content-block-text);
    }

    &__total {
      text-align: center;
    }

    &__total-value {
      font-family: @font-display;
      font-size: 16px;
      font-weight: 700;
      color: var(--content-block-text);
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
      color: var(--content-block-text-muted);
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: rgba(var(--danger-500-rgb), 0.1);
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
  // RESPONSIVE - Mixins harmonisés
  // ============================================

  // Tablet (≤ 1160px)
  .respond-tablet({
    .cart {
      &__content {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      &__sidebar {
        position: static;
        order: -1; // Summary en haut sur tablet
      }

      &__summary {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        align-items: start;

        &-title {
          grid-column: 1 / -1;
        }

        &-rows {
          grid-column: 1;
        }

        .PremiumButton {
          grid-column: 2;
          align-self: end;
        }
      }

      &__trust,
      &__payment-methods {
        display: none;
      }
    }
  });

  // Mobile (≤ 720px)
  .respond-mobile({
    .cart {
      &__container {
        padding: 16px 16px 100px;
      }

      &__header {
        padding: 16px;
      }

      &__header-inner {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }

      &__header-left,
      &__header-right {
        flex: none;
        width: 100%;
        justify-content: center;
      }

      &__title {
        font-size: 22px;
        gap: 8px;

        svg {
          width: 24px;
          height: 24px;
        }
      }

      &__title-count {
        min-width: 24px;
        height: 24px;
        font-size: 12px;
      }

      &__table-header {
        display: none;
      }

      &__main {
        border-radius: 16px;
      }

      &__empty {
        padding: 48px 20px;
        border-radius: 16px;
      }

      &__empty-title {
        font-size: 20px;
      }

      &__empty-text {
        font-size: 14px;
      }

      &__suggestions {
        margin-top: 32px;
        padding-top: 24px;
      }

      &__suggestions-tags {
        gap: 8px;
      }

      // Summary mobile
      &__sidebar {
        order: 1;
      }

      &__summary {
        display: block;
        padding: 20px;
        border-radius: 16px;
      }

      &__summary-title {
        font-size: 16px;
        margin-bottom: 16px;
        padding-bottom: 12px;
      }

      &__summary-row--total span:last-child {
        font-size: 20px;
      }

      &__trust {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;
      }

      &__trust-item {
        font-size: 11px;
        gap: 6px;
      }

      &__payment-methods {
        display: block;
      }
    }

    .cart-item {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;

      &__product {
        width: 100%;
      }

      &__image {
        width: 80px;
        height: 80px;

        img {
          border-radius: 10px;
        }
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
        font-size: 15px;
      }

      &__dosage {
        font-size: 12px;
      }

      &__mobile-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding-top: 12px;
        border-top: 1px dashed var(--content-block-border);
      }

      &__qty-control--mobile {
        display: flex;
        background: var(--content-block-bg-subtle);
        border-radius: 8px;
        padding: 2px;
      }

      &__qty-btn {
        width: 36px;
        height: 36px;
      }

      &__mobile-total {
        font-family: @font-display;
        font-size: 18px;
        font-weight: 700;
        color: var(--primary-700);
      }

      &__product {
        position: relative;
      }
    }
  });
</style>
