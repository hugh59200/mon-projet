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
        <PremiumButton
          type="secondary"
          variant="ghost"
          size="sm"
          :label="`${t('common.back')} ${t('nav.catalogue').toLowerCase()}`"
          icon-left="ArrowLeft"
          class="product-page__back"
          @click="$router.push('/catalogue')"
        />

        <div class="product-page__breadcrumb">
          <span @click="$router.push('/')">{{ t('nav.home') }}</span>
          <BasicIconNext name="ChevronRight" :size="16" />
          <span @click="$router.push('/catalogue')">{{ t('nav.catalogue') }}</span>
          <BasicIconNext name="ChevronRight" :size="16" />
          <span class="active">{{ productName || '...' }}</span>
        </div>
      </nav>

      <WrapperLoader
        :loading="loading"
        :has-loaded="!!product"
        :is-empty="!product && !loading"
        :message="t('common.loading')"
        :empty-message="t('product.notFound')"
      >
        <!-- Schema JSON-LD pour SEO/GEO -->
        <ProductSchema
          v-if="schemaProps"
          v-bind="schemaProps"
        />

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
                  v-if="product.is_on_sale && !showCoa"
                  class="product__badge product__badge--promo"
                >
                  <BasicIconNext name="Star" :size="14" />
                  {{ t('product.promo') }}
                </div>

                <!-- Badge RUO -->
                <div
                  v-if="!showCoa"
                  class="product__badge product__badge--ruo"
                >
                  <BasicIconNext name="Lightbulb" :size="12" />
                  {{ t('product.researchOnly') }}
                </div>

                <!-- Image principale avec zoom -->
                <div class="product__image-wrapper">
                  <!-- Image produit -->
                  <InnerImageZoom
                    v-if="product.image && !showCoa"
                    :src="product.image"
                    :zoomSrc="product.image"
                    :alt="`Peptide ${productName}`"
                    class="product__image"
                    :zoomScale="1.5"
                    :fullscreenOnMobile="true"
                    hideHint
                  />
                  <!-- COA en grand -->
                  <InnerImageZoom
                    v-else-if="product.coa_url && showCoa"
                    :src="product.coa_url"
                    :zoomSrc="product.coa_url"
                    :alt="`COA ${productName}`"
                    class="product__image product__image--coa"
                    :zoomScale="2"
                    :fullscreenOnMobile="true"
                    hideHint
                  />
                  <div class="product__image-hint">
                    <BasicIconNext name="ZoomIn" :size="16" />
                    {{ t('product.clickToZoom') }}
                  </div>
                  <!-- Badge COA affiché -->
                  <div v-if="showCoa" class="product__coa-displayed">
                    <BasicIconNext name="FileCheck" :size="14" />
                    <span>Certificate of Analysis</span>
                  </div>
                </div>

                <!-- Indicateurs de confiance -->
                <div class="product__trust-strip">
                  <div class="product__trust-item">
                    <BasicIconNext name="ShieldCheck" :size="18" />
                    <span>{{ t('product.certified') }}</span>
                  </div>
                  <div class="product__trust-item">
                    <BasicIconNext name="FileText" :size="18" />
                    <span>{{ t('product.coaIncluded') }}</span>
                  </div>
                  <div class="product__trust-item">
                    <BasicIconNext name="Zap" :size="18" />
                    <span>{{ t('product.shipping24h') }}</span>
                  </div>
                </div>

                <!-- Miniature cliquable pour basculer entre produit et COA -->
                <button
                  v-if="product.coa_url"
                  type="button"
                  class="product__coa"
                  :class="{ 'product__coa--active': showCoa }"
                  @click="showCoa = !showCoa"
                >
                  <div class="product__coa-preview">
                    <!-- Affiche le produit quand COA est ouvert, et vice-versa -->
                    <img
                      :src="showCoa ? product.image : product.coa_url"
                      :alt="showCoa ? `${productName}` : `COA ${productName}`"
                      loading="lazy"
                    />
                  </div>
                  <div class="product__coa-info">
                    <div class="product__coa-badge" :class="{ 'product__coa-badge--product': showCoa }">
                      <BasicIconNext :name="showCoa ? 'Package' : 'FileCheck'" :size="14" />
                      <span>{{ showCoa ? t('product.productLabel') : 'COA' }}</span>
                    </div>
                    <span class="product__coa-label">
                      {{ showCoa ? t('product.showProduct') : t('product.viewCoa') }}
                    </span>
                  </div>
                </button>
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
                  {{ productCategory }}
                </div>

                <h1 class="product__title">{{ productName }}</h1>

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
                    <BasicIconNext name="FlaskConical" :size="20" />
                  </div>
                  <div class="product__spec-content">
                    <span class="product__spec-label">{{ t('catalogue.product.purity') }}</span>
                    <span class="product__spec-value product__spec-value--success">
                      ≥99%
                    </span>
                  </div>
                </div>

                <div class="product__spec">
                  <div class="product__spec-icon product__spec-icon--stock">
                    <BasicIconNext name="Package" :size="20" />
                  </div>
                  <div class="product__spec-content">
                    <span class="product__spec-label">{{ t('product.stock') }}</span>
                    <span
                      class="product__spec-value"
                      :class="{
                        'product__spec-value--success': (product.stock ?? 0) >= 10,
                        'product__spec-value--warning':
                          (product.stock ?? 0) > 0 && (product.stock ?? 0) < 10,
                        'product__spec-value--danger': (product.stock ?? 0) <= 0,
                      }"
                    >
                      {{ (product.stock ?? 0) > 0 ? `${product.stock} ${t('product.available')}` : t('catalogue.product.outOfStock') }}
                    </span>
                  </div>
                </div>

                <div class="product__spec">
                  <div class="product__spec-icon product__spec-icon--origin">
                    <span class="product__spec-flag">🇪🇺</span>
                  </div>
                  <div class="product__spec-content">
                    <span class="product__spec-label">{{ t('product.origin') }}</span>
                    <span class="product__spec-value">{{ t('product.europeanUnion') }}</span>
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
                  <div class="product__price-info">{{ t('product.priceInfo') }}</div>
                </div>

                <!-- Boutons d'action -->
                <div class="product__actions">
                  <PremiumButton
                    type="primary"
                    variant="solid"
                    size="lg"
                    :label="(product.stock ?? 0) > 0 ? t('catalogue.product.addToCart') : t('catalogue.product.outOfStock')"
                    icon-left="ShoppingCart"
                    :disabled="(product.stock ?? 0) <= 0"
                    :shine="true"
                    :glow="(product.stock ?? 0) > 0"
                    @click="addToCart(product!)"
                  />

                  <PremiumButton
                    v-if="(product.stock ?? 0) > 0"
                    type="secondary"
                    variant="outline"
                    size="lg"
                    :label="t('product.buyNow')"
                    icon-left="Zap"
                    :shine="true"
                    @click="buyNow(product!)"
                  />

                  <WishlistButton
                    :product-id="product.id"
                    :size="24"
                    class="product__wishlist-btn"
                  />
                </div>

                <!-- Alerte stock -->
                <div
                  v-if="(product.stock ?? 0) > 0 && (product.stock ?? 0) < 10"
                  class="product__stock-alert"
                >
                  <BasicIconNext name="AlertTriangle" :size="16" />
                  <span>
                    {{ t('product.lowStockWarning', { count: product.stock }) }}
                  </span>
                </div>
              </div>

              <!-- Garanties -->
              <div class="product__guarantees">
                <div class="product__guarantee">
                  <div class="product__guarantee-icon">
                    <BasicIconNext name="ShieldCheck" :size="24" />
                  </div>
                  <div>
                    <strong>{{ t('product.guarantees.purity') }}</strong>
                    <span>{{ t('product.guarantees.purityDesc') }}</span>
                  </div>
                </div>
                <div class="product__guarantee">
                  <div class="product__guarantee-icon">
                    <BasicIconNext name="Truck" :size="24" />
                  </div>
                  <div>
                    <strong>{{ t('product.guarantees.secureShipping') }}</strong>
                    <span>{{ t('product.guarantees.secureShippingDesc') }}</span>
                  </div>
                </div>
                <div class="product__guarantee">
                  <div class="product__guarantee-icon">
                    <BasicIconNext name="Shield" :size="24" />
                  </div>
                  <div>
                    <strong>{{ t('product.guarantees.securePayment') }}</strong>
                    <span>{{ t('product.guarantees.securePaymentDesc') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ============ SECTION DESCRIPTION ============ -->
          <div class="product__details">
            <div class="product__details-tabs">
              <PremiumButton
                :type="activeTab === 'description' ? 'primary' : 'secondary'"
                :variant="activeTab === 'description' ? 'solid' : 'ghost'"
                size="md"
                :label="t('product.tabs.specs')"
                icon-left="FileText"
                class="product__tab"
                @click="activeTab = 'description'"
              />
              <PremiumButton
                :type="activeTab === 'protocol' ? 'primary' : 'secondary'"
                :variant="activeTab === 'protocol' ? 'solid' : 'ghost'"
                size="md"
                :label="t('product.tabs.protocols')"
                icon-left="FlaskConical"
                class="product__tab"
                @click="activeTab = 'protocol'"
              />
              <PremiumButton
                :type="activeTab === 'shipping' ? 'primary' : 'secondary'"
                :variant="activeTab === 'shipping' ? 'solid' : 'ghost'"
                size="md"
                :label="t('product.tabs.shipping')"
                icon-left="Truck"
                class="product__tab"
                @click="activeTab = 'shipping'"
              />
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
                    sanitizeHTML(productDescription || t('product.noDescription'))
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
                      <h4>{{ t('product.shippingOptions.standard') }}</h4>
                      <p>{{ t('product.shippingOptions.standardTime') }}</p>
                    </div>
                  </div>
                  <div class="product__shipping-card">
                    <div class="product__shipping-icon">⚡</div>
                    <div>
                      <h4>{{ t('product.shippingOptions.express') }}</h4>
                      <p>{{ t('product.shippingOptions.expressTime') }}</p>
                    </div>
                  </div>
                  <div class="product__shipping-card">
                    <div class="product__shipping-icon">🎁</div>
                    <div>
                      <h4>{{ t('product.shippingOptions.free') }}</h4>
                      <p>{{ t('product.shippingOptions.freeThreshold') }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Disclaimer -->
          <div class="product__disclaimer">
            <BasicIconNext name="Info" :size="20" />
            <p>
              <strong>Usage Recherche Uniquement (RUO)</strong>
              — Ce produit est strictement destiné à la recherche en laboratoire. Non destiné à la
              consommation humaine ou animale.
            </p>
          </div>

          <!-- Section Avis Clients -->
          <ProductReviews
            v-if="product"
            :product-id="product.id"
            :product-name="productName || product.name"
          />
        </article>
      </WrapperLoader>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useTranslatedProduct } from '@/composables/useTranslated'
  import { fetchProductById } from '@/api/supabase/products'
  import { fetchReviewSummary } from '@/api/supabase/reviews'
  import type { ReviewSummary } from '@/api/supabase/reviews'
  import ProductReviews from './components/reviews/ProductReviews.vue'
  import type { Products } from '@/supabase/types/supabase.types'
  import { sanitizeHTML } from '@/utils'
  import { useSmartToast } from '@designSystem/components/basic/toast/useSmartToast'
  import { computed, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import InnerImageZoom from 'vue-inner-image-zoom'
  import { useRoute, useRouter } from 'vue-router'
  import ProductEssentials from '@/features/shared/components/ProductEssentials.vue'
  import ProductSchema from './components/ProductSchema.vue'
  import WishlistButton from './components/WishlistButton.vue'
  import { useHead } from '@vueuse/head'
  import { getCanonicalUrl } from '@/config/seo'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const cart = useCartStore()
  const { showAddToCartToast } = useSmartToast()

  const product = ref<Products | null>(null)
  const loading = ref(true)
  const activeTab = ref<'description' | 'protocol' | 'shipping'>('description')
  const reviewSummary = ref<ReviewSummary | null>(null)
  const showCoa = ref(false)

  // Traductions automatiques du produit
  const {
    name: productName,
    category: productCategory,
    description: productDescription,
  } = useTranslatedProduct(product)

  // ============================================
  // DONNÉES POUR LE SCHEMA JSON-LD (GEO/SEO)
  // ============================================
  const schemaProps = computed(() => {
    if (!product.value) return null

    const p = product.value
    const effectivePrice = p.is_on_sale && p.sale_price ? p.sale_price : p.price

    return {
      name: productName.value || p.name,
      description: productDescription.value || p.description || '',
      price: effectivePrice,
      currency: 'EUR',
      sku: p.id,
      image: p.image || '',
      inStock: (p.stock ?? 0) > 0,
      purity: '≥99%',
      productUrl: getCanonicalUrl(`/catalogue/${p.id}`),
      category: productCategory.value || p.category,
      casNumber: p.cas_number ?? undefined,
      sequence: p.sequence ?? undefined,
      // Avis clients pour le schema SEO
      averageRating: reviewSummary.value?.average_rating,
      reviewCount: reviewSummary.value?.review_count,
    }
  })

  // Configuration SEO dynamique pour les produits
  const pageTitle = computed(() => {
    if (!product.value) return 'Produit - Atlas Lab Solutions'
    const name = productName.value || product.value.name || 'Produit'
    const dosage = product.value.dosage ? ` - ${product.value.dosage}` : ''
    return `${name}${dosage} | Atlas Lab Solutions`
  })

  const pageDescription = computed(() => {
    if (!product.value) return 'Découvrez nos peptides de recherche de haute pureté.'
    const name = productName.value || product.value.name
    const category = productCategory.value || product.value.category || 'Recherche'
    return `${name} - Peptide de recherche ${category}. Pureté ≥99%. Expédition rapide et certificat d'analyse inclus.`
  })

  // Schema BreadcrumbList pour les rich snippets de navigation
  const breadcrumbSchema = computed(() => {
    if (!product.value) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: 'https://fast-peptides.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Catalogue',
          item: 'https://fast-peptides.com/catalogue',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: productName.value || product.value.name,
          item: `https://fast-peptides.com/catalogue/${route.params.id}`,
        },
      ],
    }
  })

  useHead({
    title: pageTitle,
    meta: [
      {
        name: 'description',
        content: pageDescription,
      },
      {
        property: 'og:title',
        content: pageTitle,
      },
      {
        property: 'og:description',
        content: pageDescription,
      },
      {
        property: 'og:type',
        content: 'product',
      },
      {
        property: 'og:image',
        content: computed(() => product.value?.image || 'https://fast-peptides.com/default-product.jpg'),
      },
      // Twitter Cards pour les produits
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: pageTitle,
      },
      {
        name: 'twitter:description',
        content: pageDescription,
      },
      {
        name: 'twitter:image',
        content: computed(() => product.value?.image || 'https://fast-peptides.com/default-product.jpg'),
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: computed(() => `https://fast-peptides.com/catalogue/${route.params.id}`),
      },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: computed(() => (breadcrumbSchema.value ? JSON.stringify(breadcrumbSchema.value) : '')),
      },
    ],
  })

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
      const [productData, reviewData] = await Promise.all([
        fetchProductById(id),
        fetchReviewSummary(id),
      ])

      if (productData) {
        product.value = productData
      }
      reviewSummary.value = reviewData
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
        background: linear-gradient(135deg, @danger-500 0%, @danger-600 100%);
        color: @white;
        box-shadow: 0 4px 12px rgba(var(--danger-500-rgb), 0.3);
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
      background: linear-gradient(135deg, @neutral-50 0%, white 100%);
      height: 450px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: zoom-in;

      // Permet au zoom de déborder
      &:has(.iiz__zooming) {
        overflow: visible;
        z-index: 100;
      }
    }

    &__image {
      width: 100%;
      max-height: 100%;
      border-radius: 16px;

      :deep(figure) {
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      :deep(img) {
        border-radius: 16px;
        max-height: 450px;
        width: auto;
        max-width: 100%;
        object-fit: contain;
        margin: 0 auto;
      }

      :deep(.iiz__zoom-img) {
        border-radius: 0;
        max-height: none;
        max-width: none;
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

    &__coa-displayed {
      position: absolute;
      top: 12px;
      left: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: var(--primary-500);
      border-radius: 8px;
      font-family: @font-display;
      font-size: 12px;
      font-weight: 600;
      color: white;
      box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.3);

      svg {
        color: white;
      }
    }

    &__image--coa {
      background: white;
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

    // ============ COA PREVIEW ============
    &__coa {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 16px;
      padding: 12px 16px;
      background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.04) 0%, rgba(var(--primary-500-rgb), 0.08) 100%);
      border: 1px solid rgba(var(--primary-500-rgb), 0.15);
      border-radius: 12px;
      text-decoration: none;
      cursor: pointer;
    }

    &__coa-preview {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      border: 1px solid @neutral-200;
      background: white;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__coa-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__coa-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: var(--primary-500);
      border-radius: 6px;
      width: fit-content;
      transition: background 0.2s @ease;

      svg {
        color: white;
      }

      span {
        font-family: @font-display;
        font-size: 11px;
        font-weight: 700;
        color: white;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      &--product {
        background: @neutral-700;
      }
    }

    &__coa-label {
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-600;
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
        background: rgba(var(--success-500-rgb), 0.1);
        color: @success-500;
      }

      &--stock {
        background: rgba(var(--info-500-rgb), 0.1);
        color: @info-500;
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
        color: @success-500;
      }
      &--warning {
        color: @warning-500;
      }
      &--danger {
        color: @danger-500;
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
      background: @danger-50;
      color: @danger-600;
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
        color: @danger-600;
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
      align-items: center;
    }

    &__wishlist-btn {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
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
      background: @warning-100;
      border: 1px solid @warning-300;
      border-radius: 10px;
      font-family: @font-body;
      font-size: 13px;
      color: @warning-800;

      svg {
        color: @warning-500;
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
      margin-bottom: 40px;
      background: linear-gradient(135deg, @danger-50 0%, @danger-100 100%);
      border: 1px solid @danger-200;
      border-radius: 16px;

      svg {
        color: @danger-600;
        flex-shrink: 0;
        margin-top: 2px;
      }

      p {
        font-family: @font-body;
        font-size: 14px;
        line-height: 1.6;
        color: @danger-800;
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
  // RESPONSIVE - Utilise les mixins harmonisés
  // ============================================================

  // Tablet (≤ 1160px)
  .respond-tablet({
    .product {
      &__main {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      &__gallery {
        position: static;
        max-width: 600px;
        margin: 0 auto;
      }

      &__trust-strip {
        flex-wrap: wrap;
        gap: 16px;
      }
    }
  });

  // Mobile (≤ 720px)
  .respond-mobile({
    .product-page {
      &__container {
        padding: 16px 16px 60px;
      }

      &__nav {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 24px;
      }

      &__breadcrumb {
        display: none;
      }

      &__back {
        padding: 12px 16px;
      }
    }

    .product {
      &__main {
        gap: 24px;
      }

      &__image-card {
        padding: 16px;
        border-radius: 16px;
      }

      &__image-wrapper {
        height: 320px;
      }

      &__image {
        :deep(img) {
          max-height: 320px;
        }
      }

      &__badge {
        padding: 5px 10px;
        font-size: 10px;

        &--promo {
          top: 12px;
          left: 12px;
        }

        &--ruo {
          top: 12px;
          right: 12px;
        }
      }

      &__trust-strip {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      &__title {
        font-size: 28px;
      }

      &__subtitle {
        font-size: 16px;
      }

      &__specs {
        flex-direction: column;
        gap: 8px;
      }

      &__spec {
        min-width: auto;
        padding: 10px 14px;
      }

      &__pricing {
        padding: 20px;
        border-radius: 16px;
      }

      &__price-current {
        font-size: 32px;

        span {
          font-size: 20px;
        }
      }

      &__actions {
        flex-direction: column;
        gap: 10px;
      }

      &__wishlist-btn {
        width: 100%;
        height: 48px;
      }

      &__guarantees {
        gap: 8px;
      }

      &__guarantee {
        padding: 12px 14px;
      }

      &__guarantee-icon {
        width: 38px;
        height: 38px;
      }

      &__details {
        border-radius: 16px;
      }

      &__details-tabs {
        flex-direction: column;
        gap: 2px;
        padding: 6px;
      }

      &__tab {
        justify-content: flex-start;
        padding: 12px 16px;
        border-radius: 10px;
      }

      &__details-content {
        padding: 20px 16px;
      }

      &__description {
        font-size: 15px;
      }

      &__shipping-info {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      &__shipping-card {
        padding: 16px;
      }

      &__disclaimer {
        padding: 16px;
        border-radius: 12px;
        font-size: 13px;

        svg {
          width: 18px;
          height: 18px;
        }
      }
    }
  });
</style>
