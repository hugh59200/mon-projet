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
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Continuer mes achats</span>
          </button>
        </div>

        <h1 class="cart__title">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle
              cx="9"
              cy="21"
              r="1"
            />
            <circle
              cx="20"
              cy="21"
              r="1"
            />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          Mon panier
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
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
              />
            </svg>
            <span>Vider le panier</span>
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
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <circle
                cx="9"
                cy="21"
                r="1"
              />
              <circle
                cx="20"
                cy="21"
                r="1"
              />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
          </div>
          <div class="cart__empty-circles">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <h2 class="cart__empty-title">Votre panier est vide</h2>
        <p class="cart__empty-text">
          Découvrez notre sélection de peptides de recherche haute pureté
        </p>

        <button
          class="cart__empty-btn"
          @click="$router.push('/catalogue')"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
          </svg>
          Explorer le catalogue
        </button>

        <!-- Suggestions -->
        <div class="cart__suggestions">
          <p class="cart__suggestions-title">Produits populaires</p>
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
            <span class="cart__col cart__col--product">Produit</span>
            <span class="cart__col cart__col--price">Prix unitaire</span>
            <span class="cart__col cart__col--quantity">Quantité</span>
            <span class="cart__col cart__col--total">Total</span>
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
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <path d="M22 4L12 14.01l-3-3" />
                      </svg>
                      En stock
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
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M5 12h14" />
                    </svg>
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
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
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
                  title="Supprimer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
                    />
                  </svg>
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
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                  <span class="cart-item__qty-value">{{ item.quantity ?? 1 }}</span>
                  <button
                    class="cart-item__qty-btn"
                    @click="updateQuantity(item, 1)"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Récapitulatif
            </h3>

            <div class="cart__summary-rows">
              <div class="cart__summary-row">
                <span>Sous-total ({{ cart.totalItems }} articles)</span>
                <span>{{ formatPrice(cartSubtotal) }}</span>
              </div>

              <div
                v-if="totalDiscount > 0"
                class="cart__summary-row cart__summary-row--discount"
              >
                <span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
                    />
                    <line
                      x1="7"
                      y1="7"
                      x2="7.01"
                      y2="7"
                    />
                  </svg>
                  Économies
                </span>
                <span>-{{ formatPrice(totalDiscount) }}</span>
              </div>

              <div class="cart__summary-row">
                <span>Livraison</span>
                <span :class="{ 'cart__summary-free': shippingCost === 0 }">
                  {{ shippingCost === 0 ? 'Offerte' : formatPrice(shippingCost) }}
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
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect
                      x="1"
                      y="3"
                      width="15"
                      height="13"
                      rx="2"
                    />
                    <path d="M16 8h4a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-1" />
                    <circle
                      cx="5.5"
                      cy="18.5"
                      r="2.5"
                    />
                    <circle
                      cx="18.5"
                      cy="18.5"
                      r="2.5"
                    />
                  </svg>
                  Plus que
                  <strong>{{ formatPrice(FREE_SHIPPING_THRESHOLD - cartSubtotal) }}</strong>
                  pour la livraison offerte
                </p>
              </div>

              <div
                v-else
                class="cart__shipping-success"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
                <span>Livraison offerte !</span>
              </div>

              <div class="cart__summary-divider"></div>

              <div class="cart__summary-row cart__summary-row--total">
                <span>Total</span>
                <span>{{ formatPrice(finalTotal) }}</span>
              </div>
            </div>

            <button
              class="cart__checkout-btn"
              @click="$router.push('/checkout')"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Procéder au paiement
            </button>

            <!-- Trust Badges -->
            <div class="cart__trust">
              <div class="cart__trust-item">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                  />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span>Paiement sécurisé</span>
              </div>
              <div class="cart__trust-item">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect
                    x="1"
                    y="3"
                    width="15"
                    height="13"
                    rx="2"
                  />
                  <path d="M16 8h4a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-1" />
                  <circle
                    cx="5.5"
                    cy="18.5"
                    r="2.5"
                  />
                  <circle
                    cx="18.5"
                    cy="18.5"
                    r="2.5"
                  />
                </svg>
                <span>Expédition 24h</span>
              </div>
              <div class="cart__trust-item">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>Pureté garantie</span>
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="cart__payment-methods">
              <span>Nous acceptons</span>
              <div class="cart__payment-icons">
                <div
                  class="cart__payment-icon"
                  title="Visa"
                >
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <rect
                      width="48"
                      height="48"
                      rx="6"
                      fill="#1A1F71"
                    />
                    <path
                      d="M19.5 30H16.5L18.5 18H21.5L19.5 30Z"
                      fill="white"
                    />
                    <path
                      d="M30 18L27.5 26L27 24L26 19C26 19 25.8 18 24.5 18H20L20 18.2C20 18.2 21.5 18.5 23.2 19.5L26 30H29L33 18H30Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div
                  class="cart__payment-icon"
                  title="Mastercard"
                >
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <rect
                      width="48"
                      height="48"
                      rx="6"
                      fill="#F5F5F5"
                    />
                    <circle
                      cx="19"
                      cy="24"
                      r="10"
                      fill="#EB001B"
                    />
                    <circle
                      cx="29"
                      cy="24"
                      r="10"
                      fill="#F79E1B"
                    />
                    <path
                      d="M24 17C26 19 27 21 27 24C27 27 26 29 24 31C22 29 21 27 21 24C21 21 22 19 24 17Z"
                      fill="#FF5F00"
                    />
                  </svg>
                </div>
                <div
                  class="cart__payment-icon"
                  title="PayPal"
                >
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <rect
                      width="48"
                      height="48"
                      rx="6"
                      fill="#003087"
                    />
                    <path
                      d="M32.33 18.1C31.27 23.59 27.9 25.33 23.61 25.33H21.42L19.25 33.34L18.93 35.35C18.88 35.69 19.14 36 19.48 36H23.36L24.32 35.02L25.1 30.12C25.17 29.67 25.56 29.33 26.02 29.33H26.61C30.37 29.33 33.31 27.81 34.17 23.39C34.53 21.54 34.34 20 33.39 18.92C33.11 18.59 32.75 18.32 32.33 18.1Z"
                      fill="white"
                      fill-opacity="0.6"
                    />
                    <path
                      d="M21.65 18.12L20.4 26L19.25 33.34H14.64L17.12 12.9C17.2 12.38 17.64 12 18.17 12H25.63C28.2 12 30.21 12.54 31.32 13.81C32.33 14.96 32.62 16.23 32.33 18.1C32.08 17.97 31.81 17.85 31.52 17.76L31.3 17.69C31.15 17.64 31 17.6 30.84 17.57C30.68 17.53 30.51 17.5 30.34 17.48C29.75 17.38 29.11 17.33 28.41 17.33H22.57C22.42 17.33 22.29 17.37 22.16 17.43C21.89 17.56 21.69 17.81 21.65 18.12Z"
                      fill="white"
                    />
                  </svg>
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
  import { useRouter } from 'vue-router'

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
      toast.show(`${item.product_name} retiré du panier`, 'info')
    }
  }

  function confirmClearCart() {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      cart.clearCart()
      toast.show('Panier vidé', 'info')
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
        background: #fee2e2;
        border-color: #fecaca;
        color: #ef4444;
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
        color: #10b981;

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
      color: #10b981;
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
        rgba(16, 185, 129, 0.1) 0%,
        rgba(16, 185, 129, 0.05) 100%
      );
      border-radius: 10px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: #059669;

      svg {
        color: #10b981;
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
        color: #10b981;
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
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      border-radius: 6px;
      font-family: @font-body;
      font-size: 10px;
      font-weight: 700;
      color: white;
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
        color: #10b981;
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
        color: #ef4444;
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
        background: #fee2e2;
        color: #ef4444;
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
