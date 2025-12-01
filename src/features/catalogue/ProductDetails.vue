<template>
  <div class="product-page">
    <!-- Background décoratif -->
    <div class="product-page__bg">
      <div class="product-page__gradient"></div>
      <div class="product-page__pattern"></div>
    </div>

    <div class="product-page__container">
      <!-- Breadcrumb / Retour -->
      <nav class="product-page__nav">
        <button
          class="product-page__back"
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
          <span>Retour au catalogue</span>
        </button>

        <div class="product-page__breadcrumb">
          <span @click="$router.push('/')">Accueil</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span @click="$router.push('/catalogue')">Catalogue</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span class="active">{{ product?.name || '...' }}</span>
        </div>
      </nav>

      <WrapperLoader
        :loading="loading"
        :has-loaded="!!product"
        :is-empty="!product && !loading"
        message="Chargement du produit..."
        empty-message="Produit introuvable ou indisponible."
      >
        <article
          v-if="product"
          class="product"
        >
          <!-- ============ SECTION PRINCIPALE ============ -->
          <div class="product__main">
            <!-- Colonne Image -->
            <div class="product__gallery">
              <div class="product__image-card">
                <!-- Badge Promo -->
                <div
                  v-if="product.is_on_sale"
                  class="product__badge product__badge--promo"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    />
                  </svg>
                  PROMO
                </div>

                <!-- Badge RUO -->
                <div class="product__badge product__badge--ruo">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  RECHERCHE UNIQUEMENT
                </div>

                <!-- Image principale avec zoom -->
                <div class="product__image-wrapper">
                  <InnerImageZoom
                    v-if="product.image"
                    :src="product.image"
                    :zoomSrc="product.image"
                    :alt="`Peptide ${product.name}`"
                    class="product__image"
                    moveType="drag"
                    zoomType="click"
                  />
                  <div class="product__image-hint">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <circle
                        cx="11"
                        cy="11"
                        r="8"
                      />
                      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                    </svg>
                    Cliquez pour zoomer
                  </div>
                </div>

                <!-- Indicateurs de confiance -->
                <div class="product__trust-strip">
                  <div class="product__trust-item">
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
                    <span>Certifié</span>
                  </div>
                  <div class="product__trust-item">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>COA inclus</span>
                  </div>
                  <div class="product__trust-item">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Expédition 24h</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Colonne Infos -->
            <div class="product__info">
              <!-- Header avec nom et catégorie -->
              <header class="product__header">
                <div class="product__category-tag">
                  <span
                    class="product__category-dot"
                    :style="{ background: getCategoryColor(product.category) }"
                  ></span>
                  {{ product.category }}
                </div>

                <h1 class="product__title">{{ product.name }}</h1>

                <p
                  v-if="product.dosage"
                  class="product__subtitle"
                >
                  {{ product.dosage }}
                </p>
              </header>

              <!-- Specs rapides -->
              <div class="product__specs">
                <div class="product__spec">
                  <div class="product__spec-icon product__spec-icon--purity">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  <div class="product__spec-content">
                    <span class="product__spec-label">Pureté</span>
                    <span class="product__spec-value product__spec-value--success">
                      {{ product.purity }}%
                    </span>
                  </div>
                </div>

                <div class="product__spec">
                  <div class="product__spec-icon product__spec-icon--stock">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div class="product__spec-content">
                    <span class="product__spec-label">Stock</span>
                    <span
                      class="product__spec-value"
                      :class="{
                        'product__spec-value--success': (product.stock ?? 0) >= 10,
                        'product__spec-value--warning':
                          (product.stock ?? 0) > 0 && (product.stock ?? 0) < 10,
                        'product__spec-value--danger': (product.stock ?? 0) <= 0,
                      }"
                    >
                      {{ (product.stock ?? 0) > 0 ? `${product.stock} disponibles` : 'Rupture' }}
                    </span>
                  </div>
                </div>

                <div class="product__spec">
                  <div class="product__spec-icon product__spec-icon--origin">
                    <span class="product__spec-flag">🇪🇺</span>
                  </div>
                  <div class="product__spec-content">
                    <span class="product__spec-label">Origine</span>
                    <span class="product__spec-value">Union Européenne</span>
                  </div>
                </div>
              </div>

              <!-- Bloc Prix -->
              <div class="product__pricing">
                <div class="product__price-container">
                  <template v-if="product.is_on_sale && product.sale_price">
                    <div class="product__price-old">
                      <span>{{ product.price.toFixed(2) }} €</span>
                      <span class="product__discount-badge">
                        -{{ Math.round((1 - product.sale_price / product.price) * 100) }}%
                      </span>
                    </div>
                    <div class="product__price-current product__price-current--sale">
                      {{ product.sale_price.toFixed(2) }}
                      <span>€</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="product__price-current">
                      {{ product.price.toFixed(2) }}
                      <span>€</span>
                    </div>
                  </template>
                  <div class="product__price-info">TTC • Livraison calculée au checkout</div>
                </div>

                <!-- Boutons d'action -->
                <div class="product__actions">
                  <button
                    class="product__btn product__btn--primary"
                    :disabled="(product.stock ?? 0) <= 0"
                    @click="addToCart(product!)"
                  >
                    <svg
                      width="20"
                      height="20"
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
                    <span>
                      {{ (product.stock ?? 0) > 0 ? 'Ajouter au panier' : 'Rupture de stock' }}
                    </span>
                  </button>

                  <button
                    v-if="(product.stock ?? 0) > 0"
                    class="product__btn product__btn--secondary"
                    @click="buyNow(product!)"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Acheter maintenant</span>
                  </button>
                </div>

                <!-- Alerte stock -->
                <div
                  v-if="(product.stock ?? 0) > 0 && (product.stock ?? 0) < 10"
                  class="product__stock-alert"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>
                    Plus que
                    <strong>{{ product.stock }}</strong>
                    exemplaires disponibles !
                  </span>
                </div>
              </div>

              <!-- Garanties -->
              <div class="product__guarantees">
                <div class="product__guarantee">
                  <div class="product__guarantee-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <strong>Pureté garantie ≥99%</strong>
                    <span>Certificat d'analyse fourni</span>
                  </div>
                </div>
                <div class="product__guarantee">
                  <div class="product__guarantee-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <rect
                        x="1"
                        y="3"
                        width="15"
                        height="13"
                        rx="2"
                      />
                      <path d="M16 8h4a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-1" />
                    </svg>
                  </div>
                  <div>
                    <strong>Livraison sécurisée</strong>
                    <span>Emballage isotherme inclus</span>
                  </div>
                </div>
                <div class="product__guarantee">
                  <div class="product__guarantee-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <strong>Paiement sécurisé</strong>
                    <span>Stripe & PayPal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ============ SECTION DESCRIPTION ============ -->
          <div class="product__details">
            <div class="product__details-tabs">
              <button
                class="product__tab"
                :class="{ 'product__tab--active': activeTab === 'description' }"
                @click="activeTab = 'description'"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
                Fiche technique
              </button>
              <button
                class="product__tab"
                :class="{ 'product__tab--active': activeTab === 'protocol' }"
                @click="activeTab = 'protocol'"
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
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                Protocoles
              </button>
              <button
                class="product__tab"
                :class="{ 'product__tab--active': activeTab === 'shipping' }"
                @click="activeTab = 'shipping'"
              >
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
                </svg>
                Livraison
              </button>
            </div>

            <div class="product__details-content">
              <!-- Tab Description -->
              <div
                v-show="activeTab === 'description'"
                class="product__tab-panel"
              >
                <div
                  class="product__description prose"
                  v-html="
                    sanitizeHTML(product.description || 'Aucune description détaillée disponible.')
                  "
                ></div>
              </div>

              <!-- Tab Protocoles -->
              <div
                v-show="activeTab === 'protocol'"
                class="product__tab-panel"
              >
                <ProductEssentials />
              </div>

              <!-- Tab Livraison -->
              <div
                v-show="activeTab === 'shipping'"
                class="product__tab-panel"
              >
                <div class="product__shipping-info">
                  <div class="product__shipping-card">
                    <div class="product__shipping-icon">🚚</div>
                    <div>
                      <h4>Livraison Standard</h4>
                      <p>3-5 jours ouvrés • À partir de 9.90€</p>
                    </div>
                  </div>
                  <div class="product__shipping-card">
                    <div class="product__shipping-icon">⚡</div>
                    <div>
                      <h4>Livraison Express</h4>
                      <p>24-48h • À partir de 14.90€</p>
                    </div>
                  </div>
                  <div class="product__shipping-card">
                    <div class="product__shipping-icon">🎁</div>
                    <div>
                      <h4>Livraison Offerte</h4>
                      <p>Dès 150€ d'achat</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Disclaimer -->
          <div class="product__disclaimer">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <p>
              <strong>Usage Recherche Uniquement (RUO)</strong>
              — Ce produit est strictement destiné à la recherche en laboratoire. Non destiné à la
              consommation humaine ou animale.
            </p>
          </div>
        </article>
      </WrapperLoader>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
  import type { Products } from '@/supabase/types/supabase.types'
  import { sanitizeHTML } from '@/utils'
  import { useSmartToast } from '@designSystem/components/basic/toast/useSmartToast'
  import { onMounted, ref } from 'vue'
  import InnerImageZoom from 'vue-inner-image-zoom'
  import { useRoute, useRouter } from 'vue-router'
  import ProductEssentials from '../shared/components/ProductEssentials.vue'

  const route = useRoute()
  const router = useRouter()
  const cart = useCartStore()
  const { showAddToCartToast } = useSmartToast()

  const product = ref<Products | null>(null)
  const loading = ref(true)
  const activeTab = ref<'description' | 'protocol' | 'shipping'>('description')

  // Couleurs par catégorie
  const categoryColors: Record<string, string> = {
    Récupération: '#10B981',
    'Perte de poids': '#F59E0B',
    Croissance: '#3B82F6',
    'Anti-âge': '#8B5CF6',
    Performance: '#EF4444',
    'Bien-être': '#EC4899',
    Hormonal: '#6366F1',
    Nootropique: '#14B8A6',
    Cosmétique: '#F472B6',
    Santé: '#22C55E',
  }

  const getCategoryColor = (category: string | null | undefined): string => {
    if (!category) return 'var(--primary-500)'
    return categoryColors[category] || 'var(--primary-500)'
  }

  onMounted(async () => {
    const { id } = route.params
    if (typeof id !== 'string') return

    loading.value = true

    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single()

      if (!error && data) {
        product.value = data
        const productName = data.name || 'Produit Inconnu'
        const metaTitle = `${productName}${data.dosage ? ' - ' + data.dosage : ''} | Fast Peptides`
        document.title = metaTitle
      }
    } catch (e) {
      console.error('Erreur loading product:', e)
      product.value = null
    } finally {
      loading.value = false
    }
  })

  const addToCart = (p: Products) => {
    if ((p.stock ?? 0) <= 0) return
    cart.addToCart(p)
    showAddToCartToast(p)
  }

  const buyNow = async (p: Products) => {
    if ((p.stock ?? 0) <= 0) return
    await cart.addToCart(p)
    router.push('/checkout')
  }
</script>

<style scoped lang="less">
  // ============================================================
  // VARIABLES
  // ============================================================
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
  @ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  // ============================================================
  // PAGE CONTAINER
  // ============================================================
  .product-page {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(180deg, @neutral-50 0%, @neutral-100 100%);

    &__bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    &__gradient {
      position: absolute;
      top: 0;
      right: 0;
      width: 60%;
      height: 60%;
      background: radial-gradient(
        ellipse at top right,
        rgba(var(--primary-500-rgb), 0.08) 0%,
        transparent 60%
      );
    }

    &__pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(var(--primary-500-rgb), 0.03) 1px, transparent 1px);
      background-size: 32px 32px;
      mask-image: linear-gradient(to bottom, black 0%, transparent 50%);
    }

    &__container {
      position: relative;
      z-index: 1;
      max-width: 1280px;
      margin: 0 auto;
      padding: 24px 32px 80px;
    }

    // Navigation
    &__nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
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
      }

      svg {
        transition: transform 0.2s @ease;
      }

      &:hover svg {
        transform: translateX(-2px);
      }
    }

    &__breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;

      span {
        cursor: pointer;
        transition: color 0.2s;

        &:hover:not(.active) {
          color: var(--primary-600);
        }

        &.active {
          color: @neutral-800;
          font-weight: 500;
          cursor: default;
        }
      }

      svg {
        color: @neutral-300;
        flex-shrink: 0;
      }
    }
  }

  // ============================================================
  // PRODUCT MAIN SECTION
  // ============================================================
  .product {
    animation: fadeInUp 0.5s @ease both;

    &__main {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      margin-bottom: 48px;
    }

    // ============ GALLERY ============
    &__gallery {
      position: sticky;
      top: 24px;
      height: fit-content;
    }

    &__image-card {
      position: relative;
      background: white;
      border-radius: 24px;
      padding: 24px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 32px rgba(0, 0, 0, 0.06);
      border: 1px solid @neutral-100;
    }

    &__badge {
      position: absolute;
      z-index: 10;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 8px;
      font-family: @font-body;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &--promo {
        top: 16px;
        left: 16px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }

      &--ruo {
        top: 16px;
        right: 16px;
        background: linear-gradient(135deg, @neutral-800 0%, @neutral-900 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
    }

    &__image-wrapper {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      background: linear-gradient(135deg, @neutral-50 0%, white 100%);
    }

    &__image {
      width: 100%;
      border-radius: 16px;

      :deep(img) {
        border-radius: 16px;
      }
    }

    &__image-hint {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      border-radius: 20px;
      font-family: @font-body;
      font-size: 11px;
      color: white;
      opacity: 0.8;
      transition: opacity 0.2s;
      pointer-events: none;
    }

    &__trust-strip {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid @neutral-100;
    }

    &__trust-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: @font-body;
      font-size: 12px;
      color: @neutral-600;

      svg {
        color: var(--primary-500);
      }
    }

    // ============ INFO PANEL ============
    &__info {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    &__header {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__category-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: fit-content;
      padding: 6px 14px;
      background: @neutral-100;
      border-radius: 20px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: @neutral-700;
    }

    &__category-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(32px, 4vw, 48px);
      font-weight: 700;
      color: @neutral-900;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin: 0;
    }

    &__subtitle {
      font-family: @font-body;
      font-size: 18px;
      color: @neutral-500;
      margin: 0;
    }

    // ============ SPECS ============
    &__specs {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    &__spec {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      flex: 1;
      min-width: 160px;
    }

    &__spec-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      flex-shrink: 0;

      &--purity {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }

      &--stock {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
      }

      &--origin {
        background: rgba(99, 102, 241, 0.1);
      }
    }

    &__spec-flag {
      font-size: 20px;
    }

    &__spec-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__spec-label {
      font-family: @font-body;
      font-size: 12px;
      color: @neutral-500;
    }

    &__spec-value {
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: @neutral-800;

      &--success {
        color: #10b981;
      }
      &--warning {
        color: #f59e0b;
      }
      &--danger {
        color: #ef4444;
      }
    }

    // ============ PRICING ============
    &__pricing {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 24px;
      background: linear-gradient(135deg, white 0%, @neutral-50 100%);
      border: 1px solid @neutral-200;
      border-radius: 20px;
    }

    &__price-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__price-old {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: @font-body;
      font-size: 18px;
      color: @neutral-400;
      text-decoration: line-through;
    }

    &__discount-badge {
      padding: 4px 8px;
      background: #fee2e2;
      color: #dc2626;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
    }

    &__price-current {
      font-family: @font-display;
      font-size: 42px;
      font-weight: 700;
      color: var(--primary-700);
      line-height: 1;

      span {
        font-size: 24px;
        color: @neutral-500;
      }

      &--sale {
        color: #dc2626;
      }
    }

    &__price-info {
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;
    }

    &__actions {
      display: flex;
      gap: 12px;
    }

    &__btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 16px 24px;
      border-radius: 14px;
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s @ease;
      border: none;

      &--primary {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        color: white;
        box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.3);

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(var(--primary-500-rgb), 0.4);
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }

        &:disabled {
          background: @neutral-300;
          box-shadow: none;
          cursor: not-allowed;
        }
      }

      &--secondary {
        background: white;
        color: @neutral-800;
        border: 2px solid @neutral-200;

        &:hover {
          border-color: var(--primary-400);
          color: var(--primary-700);
          background: rgba(var(--primary-500-rgb), 0.05);
        }
      }
    }

    &__stock-alert {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: #fef3c7;
      border: 1px solid #fcd34d;
      border-radius: 10px;
      font-family: @font-body;
      font-size: 13px;
      color: #92400e;

      svg {
        color: #f59e0b;
        flex-shrink: 0;
      }

      strong {
        font-weight: 700;
      }
    }

    // ============ GUARANTEES ============
    &__guarantees {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__guarantee {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      background: white;
      border: 1px solid @neutral-100;
      border-radius: 12px;
      transition: all 0.2s @ease;

      &:hover {
        border-color: var(--primary-200);
        background: rgba(var(--primary-500-rgb), 0.02);
      }
    }

    &__guarantee-icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.1) 0%,
        rgba(var(--primary-500-rgb), 0.05) 100%
      );
      border-radius: 12px;
      color: var(--primary-600);
      flex-shrink: 0;
    }

    &__guarantee div:last-child {
      display: flex;
      flex-direction: column;
      gap: 2px;

      strong {
        font-family: @font-body;
        font-size: 14px;
        font-weight: 600;
        color: @neutral-800;
      }

      span {
        font-family: @font-body;
        font-size: 13px;
        color: @neutral-500;
      }
    }

    // ============ DETAILS SECTION ============
    &__details {
      background: white;
      border-radius: 24px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 32px rgba(0, 0, 0, 0.06);
      border: 1px solid @neutral-100;
      overflow: hidden;
      margin-bottom: 32px;
    }

    &__details-tabs {
      display: flex;
      gap: 4px;
      padding: 8px;
      background: @neutral-50;
      border-bottom: 1px solid @neutral-100;
    }

    &__tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 20px;
      background: transparent;
      border: none;
      border-radius: 12px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 500;
      color: @neutral-600;
      cursor: pointer;
      transition: all 0.2s @ease;

      svg {
        opacity: 0.6;
      }

      &:hover:not(&--active) {
        background: white;
        color: @neutral-800;
      }

      &--active {
        background: white;
        color: var(--primary-700);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

        svg {
          opacity: 1;
          color: var(--primary-500);
        }
      }
    }

    &__details-content {
      padding: 32px;
    }

    &__tab-panel {
      animation: fadeIn 0.3s @ease;
    }

    &__description {
      font-family: @font-body;
      font-size: 16px;
      line-height: 1.8;
      color: @neutral-700;

      :deep(p) {
        margin-bottom: 16px;
      }

      :deep(strong) {
        font-weight: 700;
        color: @neutral-900;
      }

      :deep(ul) {
        margin: 16px 0;
        padding-left: 24px;
      }

      :deep(li) {
        margin-bottom: 10px;
        position: relative;

        &::marker {
          color: var(--primary-500);
        }
      }

      :deep(h3),
      :deep(h4) {
        font-family: @font-display;
        font-weight: 600;
        color: @neutral-900;
        margin: 24px 0 12px;
      }
    }

    &__shipping-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    &__shipping-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: @neutral-50;
      border-radius: 16px;
      transition: all 0.2s @ease;

      &:hover {
        background: @neutral-100;
      }
    }

    &__shipping-icon {
      font-size: 28px;
    }

    &__shipping-card h4 {
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      color: @neutral-800;
      margin: 0 0 4px;
    }

    &__shipping-card p {
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;
      margin: 0;
    }

    // ============ DISCLAIMER ============
    &__disclaimer {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 20px 24px;
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border: 1px solid #fecaca;
      border-radius: 16px;

      svg {
        color: #dc2626;
        flex-shrink: 0;
        margin-top: 2px;
      }

      p {
        font-family: @font-body;
        font-size: 14px;
        line-height: 1.6;
        color: #991b1b;
        margin: 0;

        strong {
          font-weight: 700;
        }
      }
    }
  }

  // ============================================================
  // ANIMATIONS
  // ============================================================
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  // ============================================================
  // RESPONSIVE
  // ============================================================
  @media (max-width: 1024px) {
    .product {
      &__main {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      &__gallery {
        position: static;
      }
    }
  }

  @media (max-width: 768px) {
    .product-page {
      &__container {
        padding: 16px;
      }

      &__nav {
        flex-direction: column;
        align-items: flex-start;
      }

      &__breadcrumb {
        display: none;
      }
    }

    .product {
      &__specs {
        flex-direction: column;
      }

      &__spec {
        min-width: auto;
      }

      &__actions {
        flex-direction: column;
      }

      &__price-current {
        font-size: 36px;
      }

      &__details-tabs {
        flex-direction: column;
      }

      &__tab {
        justify-content: flex-start;
      }

      &__shipping-info {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
