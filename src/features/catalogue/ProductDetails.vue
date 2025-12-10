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
              <ContentBlock variant="card" size="lg" class="product__image-card">
                <!-- Badge Promo avec pourcentage -->
                <div
                  v-if="product.is_on_sale && product.sale_price && !showCoa"
                  class="product__badge product__badge--promo"
                >
                  <BasicIconNext name="Tag" :size="14" />
                  -{{ Math.round((1 - product.sale_price / product.price) * 100) }}%
                </div>

                <!-- Badge RUO -->
                <div
                  v-if="!showCoa"
                  class="product__badge product__badge--ruo"
                >
                  <BasicIconNext name="Lightbulb" :size="12" />
                  {{ t('product.researchOnly') }}
                </div>

                <!-- Badge Déjà acquis -->
                <div
                  v-if="hasBeenOrdered && !showCoa"
                  class="product__badge product__badge--ordered"
                >
                  <BasicIconNext name="CheckCircle2" :size="12" />
                  {{ t('aov.alreadyOrdered.badge') }}
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
                      :src="(showCoa ? product.image : product.coa_url) as string | undefined"
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

                <!-- Bloc Analyse Indépendante -->
                <ContentBlock v-if="product.coa_url" variant="success" size="md" class="product__lab-verification">
                  <div class="product__lab-header">
                    <BasicIconNext name="ShieldCheck" :size="20" />
                    <span class="product__lab-title">Analyse indépendante</span>
                  </div>
                  <p class="product__lab-description">
                    Test réalisé par <strong>Freedom Diagnostics Testing</strong> (USA),
                    laboratoire tiers spécialisé dans les peptides RUO.
                  </p>
                  <div class="product__lab-details">
                    <div v-if="(product as any).batch_number" class="product__lab-detail">
                      <span class="product__lab-detail-label">Lot actuel</span>
                      <span class="product__lab-detail-value">{{ (product as any).batch_number }}</span>
                    </div>
                    <div class="product__lab-detail">
                      <span class="product__lab-detail-label">Pureté</span>
                      <span class="product__lab-detail-value product__lab-detail-value--success">
                        {{ product.purity ? `${product.purity.toFixed(3)} %` : '≥99 %' }} (HPLC/MS)
                      </span>
                    </div>
                  </div>
                  <div class="product__lab-actions">
                    <a
                      href="https://freedomdiagnosticstesting.com/search-for-your-coa-based-on-the-unique-accession-number/"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="product__lab-link"
                    >
                      <BasicIconNext name="ExternalLink" :size="14" />
                      <span>Vérifier sur FreedomDiagnosticsTesting.com</span>
                    </a>
                    <button
                      type="button"
                      class="product__lab-download"
                      @click="downloadCoa"
                    >
                      <BasicIconNext name="Download" :size="14" />
                      <span>{{ t('product.downloadCoa') }}</span>
                    </button>
                  </div>
                </ContentBlock>
              </ContentBlock>
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
              <ContentBlock variant="card" size="lg" class="product__pricing">
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

                <!-- Sélecteur de quantité avec prix dégressifs -->
                <QuantitySelector
                  v-if="(product.stock ?? 0) > 0"
                  v-model="selectedQuantity"
                  :base-price="product.is_on_sale && product.sale_price ? product.sale_price : product.price"
                  :bulk-pricing="bulkPricing"
                  class="product__quantity-selector"
                />

                <!-- Récapitulatif du pack sélectionné -->
                <Transition name="pack-summary">
                  <ContentBlock
                    v-if="packInfo && (product.stock ?? 0) > 0"
                    variant="info"
                    size="md"
                    class="product__pack-summary"
                  >
                    <div class="product__pack-header">
                      <div class="product__pack-badge">
                        <BasicIconNext name="Package" :size="16" />
                        <span>{{ t('aov.quantity.packSummary', { qty: packInfo.qty }) }}</span>
                      </div>
                      <!-- Affichage du % total de réduction -->
                      <div v-if="packInfo.totalDiscountPercent > 0" class="product__pack-discount">
                        -{{ packInfo.totalDiscountPercent }}%
                      </div>
                    </div>

                    <!-- Détail des promos cumulées -->
                    <div v-if="packInfo.hasCumulatedDiscounts" class="product__pack-promos">
                      <div class="product__pack-promo-item">
                        <BasicIconNext name="Tag" :size="12" />
                        <span>{{ t('aov.quantity.productPromo') }}</span>
                        <strong>-{{ packInfo.productDiscount }}%</strong>
                      </div>
                      <span class="product__pack-promo-plus">+</span>
                      <div class="product__pack-promo-item">
                        <BasicIconNext name="Package" :size="12" />
                        <span>{{ t('aov.quantity.packPromo') }}</span>
                        <strong>-{{ packInfo.packDiscount }}%</strong>
                      </div>
                    </div>

                    <div class="product__pack-details">
                      <div class="product__pack-row">
                        <span class="product__pack-label">{{ t('aov.quantity.totalPack') }}</span>
                        <span class="product__pack-price">{{ packInfo.totalPrice.toFixed(2) }}€</span>
                      </div>
                      <div v-if="packInfo.savings > 0" class="product__pack-row product__pack-row--savings">
                        <span class="product__pack-label">
                          <BasicIconNext name="TrendingDown" :size="14" />
                          {{ t('aov.quantity.youSave') }}
                        </span>
                        <span class="product__pack-savings">{{ packInfo.savings.toFixed(2) }}€</span>
                      </div>
                    </div>

                    <PremiumButton
                      type="primary"
                      variant="solid"
                      size="lg"
                      :icon-left="isPackAdded ? 'Check' : 'ShoppingCart'"
                      :label="isPackAdded ? t('aov.quantity.packAdded') : t('aov.quantity.addPack')"
                      :shine="!isPackAdded"
                      :glow="!isPackAdded"
                      class="product__pack-btn"
                      :class="{ 'product__pack-btn--success': isPackAdded }"
                      @click="addPackToCart(product as any)"
                    />
                  </ContentBlock>
                </Transition>

                <!-- Boutons d'action (affichés seulement si quantité = 1) -->
                <div v-if="selectedQuantity === 1" class="product__actions">
                  <PremiumButton
                    type="primary"
                    variant="solid"
                    size="lg"
                    :label="(product.stock ?? 0) > 0 ? t('catalogue.product.addToCart') : t('catalogue.product.outOfStock')"
                    icon-left="ShoppingCart"
                    :disabled="(product.stock ?? 0) <= 0"
                    :shine="true"
                    :glow="(product.stock ?? 0) > 0"
                    @click="addToCart(product as any)"
                  />

                  <PremiumButton
                    v-if="(product.stock ?? 0) > 0"
                    type="secondary"
                    variant="outline"
                    size="lg"
                    :label="t('product.buyNow')"
                    icon-left="Zap"
                    :shine="true"
                    @click="buyNow(product as any)"
                  />

                  <WishlistButton
                    :product-id="product.id"
                    :size="24"
                    class="product__wishlist-btn"
                  />
                </div>

                <!-- Alerte stock -->
                <ContentBlock
                  v-if="(product.stock ?? 0) > 0 && (product.stock ?? 0) < 10"
                  variant="warning"
                  size="sm"
                  class="product__stock-alert"
                >
                  <BasicIconNext name="AlertTriangle" :size="16" />
                  <span>
                    {{ t('product.lowStockWarning', { count: product.stock }) }}
                  </span>
                </ContentBlock>

                <!-- Message urgence expédition -->
                <ContentBlock
                  v-if="(product.stock ?? 0) > 0 && canShipToday"
                  variant="success"
                  size="sm"
                  class="product__urgency"
                >
                  <BasicIconNext name="Clock" :size="16" />
                  <span>{{ t('product.urgency.shipToday') }}</span>
                </ContentBlock>
              </ContentBlock>

              <!-- Garanties -->
              <div class="product__guarantees">
                <ContentBlock variant="card" size="sm" :interactive="true" class="product__guarantee">
                  <div class="product__guarantee-icon">
                    <BasicIconNext name="ShieldCheck" :size="24" />
                  </div>
                  <div>
                    <strong>{{ t('product.guarantees.purity') }}</strong>
                    <span>{{ t('product.guarantees.purityDesc') }}</span>
                  </div>
                </ContentBlock>
                <ContentBlock variant="card" size="sm" :interactive="true" class="product__guarantee">
                  <div class="product__guarantee-icon">
                    <BasicIconNext name="Truck" :size="24" />
                  </div>
                  <div>
                    <strong>{{ t('product.guarantees.secureShipping') }}</strong>
                    <span>{{ t('product.guarantees.secureShippingDesc') }}</span>
                  </div>
                </ContentBlock>
                <ContentBlock variant="card" size="sm" :interactive="true" class="product__guarantee">
                  <div class="product__guarantee-icon">
                    <BasicIconNext name="Shield" :size="24" />
                  </div>
                  <div>
                    <strong>{{ t('product.guarantees.securePayment') }}</strong>
                    <span>{{ t('product.guarantees.securePaymentDesc') }}</span>
                  </div>
                </ContentBlock>
              </div>
            </div>
          </div>

          <!-- ============ SECTION DESCRIPTION ============ -->
          <ContentBlock variant="card" size="lg" :no-padding="true" class="product__details">
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
          </ContentBlock>

          <!-- Disclaimer RUO renforcé -->
          <ContentBlock variant="danger" size="md" class="product__disclaimer">
            <div class="product__disclaimer-icon">
              <BasicIconNext name="AlertTriangle" :size="24" />
            </div>
            <div class="product__disclaimer-content">
              <strong class="product__disclaimer-title">Usage Recherche Uniquement (RUO)</strong>
              <p class="product__disclaimer-text">
                Ce réactif chimique est <strong>strictement réservé à la recherche en laboratoire</strong>.
                <span class="product__disclaimer-warning">
                  Interdit pour usage humain ou vétérinaire.
                </span>
                Manipulation par personnel qualifié uniquement.
              </p>
            </div>
          </ContentBlock>

          <!-- Section Avis Clients -->
          <ProductReviews
            v-if="product"
            :product-id="product.id"
            :product-name="productName || product.name"
            :review-token="reviewToken ?? undefined"
            :order-id="reviewOrderId ?? undefined"
            :guest-name="reviewMode?.full_name ?? undefined"
          />

          <!-- Section Produits Complémentaires (AOV) -->
          <RelatedProducts
            v-if="product"
            :current-product-id="product.id"
            :category="product.category"
          />
        </article>
      </WrapperLoader>
    </div>

    <!-- Sticky CTA Mobile -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div
          v-if="product && (product.stock ?? 0) > 0 && isMobile"
          class="product-sticky-cta"
        >
          <div class="product-sticky-cta__price">
            <span v-if="product.is_on_sale && product.sale_price" class="product-sticky-cta__price-old">
              {{ product.price.toFixed(2) }}€
            </span>
            <span class="product-sticky-cta__price-current" :class="{ 'product-sticky-cta__price-current--sale': product.is_on_sale }">
              {{ (product.is_on_sale && product.sale_price ? product.sale_price : product.price).toFixed(2) }}€
            </span>
          </div>
          <PremiumButton
            type="primary"
            variant="solid"
            size="md"
            :label="t('catalogue.product.addToCart')"
            icon-left="ShoppingCart"
            :shine="true"
            class="product-sticky-cta__btn"
            @click="addToCart(product as any)"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useTranslatedProduct } from '@/composables/useTranslated'
  import { fetchProductBySlug, fetchProductById } from '@/api/supabase/products'
  import { fetchReviewSummary, validateReviewToken } from '@/api/supabase/reviews'
  import type { ReviewSummary, ValidateReviewTokenResult } from '@/api/supabase/reviews'
  import ProductReviews from './components/reviews/ProductReviews.vue'
  import RelatedProducts from './components/RelatedProducts.vue'
  import QuantitySelector from './components/QuantitySelector.vue'
  import type { BulkPricingItem } from './components/QuantitySelector.vue'
  import type { Products } from '@/supabase/types/supabase.types'
  import { sanitizeHTML } from '@/utils'
  import { useSmartToast } from '@designSystem/components/basic/toast/useSmartToast'
  import { computed, onMounted, ref, type Ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import InnerImageZoom from 'vue-inner-image-zoom'
  import { useRoute, useRouter } from 'vue-router'
  import ProductEssentials from '@/features/shared/components/ProductEssentials.vue'
  import ProductSchema from './components/ProductSchema.vue'
  import WishlistButton from './components/WishlistButton.vue'
  import { useHead } from '@vueuse/head'
  import { getCanonicalUrl } from '@/config/seo'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint/DeviceBreakpoint.types'
  import { useOrderHistoryStore } from '@/features/order/stores/useOrderHistoryStore'
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'

  const { t } = useI18n()
  const { isMobile } = useDeviceBreakpoint()
  const route = useRoute()
  const router = useRouter()
  const cart = useCartStore()
  const auth = useAuthStore()
  const orderHistory = useOrderHistoryStore()
  const { showAddToCartToast } = useSmartToast()

  const product = ref<Products | null>(null)
  const loading = ref(true)
  const activeTab = ref<'description' | 'protocol' | 'shipping'>('description')
  const reviewSummary = ref<ReviewSummary | null>(null)
  const showCoa = ref(false)

  // Mode avis invité (magic link)
  const reviewMode = ref<ValidateReviewTokenResult | null>(null)
  const reviewToken = ref<string | null>(null)
  const reviewOrderId = ref<string | null>(null)

  // AOV - Quantité sélectionnée
  const selectedQuantity = ref(1)
  const isPackAdded = ref(false)

  // Prix dégressifs du produit (vient de la DB)
  const bulkPricing = computed<BulkPricingItem[] | null>(() => {
    if (!product.value) return null
    // Le champ bulk_pricing est un JSONB en DB (cast any pour éviter récursion types)
    const pricing = (product.value as any).bulk_pricing as BulkPricingItem[] | null | undefined
    return pricing || null
  })

  // Configuration par défaut si pas de bulk_pricing en DB
  const defaultPackConfigs: BulkPricingItem[] = [
    { quantity: 3, discount_percent: 5 },
    { quantity: 5, discount_percent: 10 },
  ]

  // Calcul du pack sélectionné (avec cumul des promos)
  const packInfo = computed(() => {
    if (!product.value || selectedQuantity.value <= 1) return null

    const originalPrice = product.value.price
    const isOnSale = product.value.is_on_sale && product.value.sale_price
    const salePrice = isOnSale ? product.value.sale_price! : originalPrice
    const productDiscount = isOnSale
      ? Math.round((1 - salePrice / originalPrice) * 100)
      : 0

    const configs = bulkPricing.value && bulkPricing.value.length > 0
      ? bulkPricing.value
      : defaultPackConfigs

    const packConfig = configs.find(c => c.quantity === selectedQuantity.value)
    const packDiscount = packConfig?.discount_percent || 0
    const discountMultiplier = 1 - packDiscount / 100
    const unitPrice = salePrice * discountMultiplier
    const totalPrice = unitPrice * selectedQuantity.value

    // Économies par rapport au prix ORIGINAL (sans aucune promo)
    const totalWithoutAnyDiscount = originalPrice * selectedQuantity.value
    const totalSavings = totalWithoutAnyDiscount - totalPrice

    // Calcul du pourcentage de réduction total
    const totalDiscountPercent = Math.round((1 - unitPrice / originalPrice) * 100)

    return {
      qty: selectedQuantity.value,
      // Remise produit (promo de base)
      productDiscount,
      // Remise pack (quantité)
      packDiscount,
      // Remise totale cumulée
      totalDiscountPercent,
      unitPrice,
      totalPrice,
      // Économie totale par rapport au prix original
      savings: totalSavings,
      // Flag pour savoir si on cumule 2 promos
      hasCumulatedDiscounts: productDiscount > 0 && packDiscount > 0,
    }
  })

  // Vérifie si on peut expédier aujourd'hui (avant 14h, jours ouvrés)
  const canShipToday = computed(() => {
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay() // 0 = dimanche, 6 = samedi
    // Avant 14h et jours ouvrés (lundi-vendredi)
    return hour < 14 && day >= 1 && day <= 5
  })

  // Nom de fichier formaté pour téléchargement COA
  const coaFilename = computed(() => {
    if (!product.value) return 'COA.pdf'
    const name = (productName.value || product.value.name || 'Peptide')
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/-+/g, '-')
    const batchNumber = (product.value as any).batch_number
    // Déterminer l'extension depuis l'URL
    const url = product.value.coa_url || ''
    const ext = url.match(/\.(pdf|png|jpg|jpeg|webp)$/i)?.[1]?.toLowerCase() || 'pdf'
    if (batchNumber) {
      return `${name}_FreedomDiagnostics_Lot-${batchNumber}.${ext}`
    }
    return `${name}_FreedomDiagnostics_COA.${ext}`
  })

  // Télécharger le COA (contourne la restriction cross-origin)
  async function downloadCoa() {
    if (!product.value?.coa_url) return
    try {
      const response = await fetch(product.value.coa_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = coaFilename.value
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur téléchargement COA:', error)
      // Fallback: ouvrir dans un nouvel onglet
      window.open(product.value.coa_url, '_blank')
    }
  }

  // Traductions automatiques du produit
  const {
    name: productName,
    category: productCategory,
    description: productDescription,
  } = useTranslatedProduct(product as Ref<Products | null>)

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
      productUrl: getCanonicalUrl(`/catalogue/${p.slug || p.id}`),
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
          item: `https://fast-peptides.com/catalogue/${product.value.slug || route.params.slug}`,
        },
      ],
    }
  })

  // Meta keywords dynamiques pour le SEO produit - Positionnement "fourniture laboratoire"
  const pageKeywords = computed(() => {
    if (!product.value) return 'peptides synthèse, fourniture laboratoire, research chemicals'
    const keywords = [
      // Nom produit avec terme scientifique
      `${productName.value || product.value.name} peptide synthèse`,
      // Termes "safe" orientés recherche
      'pureté HPLC',
      'peptide synthétique',
      'fourniture laboratoire',
      'research chemicals Europe',
      'réactif recherche scientifique',
      'RUO peptide',
      'Atlas Lab Solutions',
    ]
    // Ajouter le numéro CAS (très recherché par les chercheurs)
    if (product.value.cas_number) {
      keywords.push(`CAS ${product.value.cas_number}`)
    }
    // Ajouter le dosage avec terme scientifique
    if (product.value.dosage) {
      keywords.push(`${product.value.dosage} lyophilisé`)
    }
    // Catégorie orientée recherche (évite les termes "fitness")
    if (productCategory.value) {
      keywords.push(`${productCategory.value} recherche`)
    }
    return keywords.filter(Boolean).join(', ')
  })

  useHead({
    title: pageTitle,
    meta: [
      {
        name: 'description',
        content: pageDescription,
      },
      {
        name: 'keywords',
        content: pageKeywords,
      },
      {
        name: 'author',
        content: 'Atlas Lab Solutions',
      },
      // Signal B2B / Audience scientifique
      {
        name: 'audience',
        content: 'Researcher, Laboratory Professional',
      },
      {
        name: 'classification',
        content: 'Laboratory Supply, Research Chemical, Synthetic Peptide',
      },
      // Product-specific meta
      {
        property: 'product:price:amount',
        content: computed(() =>
          product.value
            ? (product.value.is_on_sale && product.value.sale_price
                ? product.value.sale_price
                : product.value.price
              ).toFixed(2)
            : '',
        ),
      },
      {
        property: 'product:price:currency',
        content: 'EUR',
      },
      {
        property: 'product:availability',
        content: computed(() =>
          product.value && (product.value.stock ?? 0) > 0 ? 'in stock' : 'out of stock',
        ),
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
      {
        name: 'twitter:label1',
        content: 'Prix',
      },
      {
        name: 'twitter:data1',
        content: computed(() =>
          product.value
            ? `${(product.value.is_on_sale && product.value.sale_price ? product.value.sale_price : product.value.price).toFixed(2)} €`
            : '',
        ),
      },
      {
        name: 'twitter:label2',
        content: 'Disponibilité',
      },
      {
        name: 'twitter:data2',
        content: computed(() =>
          product.value && (product.value.stock ?? 0) > 0 ? 'En stock' : 'Rupture de stock',
        ),
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: computed(() => `https://fast-peptides.com/catalogue/${product.value?.slug || route.params.slug}`),
      },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: computed(() => (breadcrumbSchema.value ? JSON.stringify(breadcrumbSchema.value) : '')),
      },
    ],
  })

  // Couleurs par catégorie utilisant les variables du design system
  const categoryColors: Record<string, string> = {
    Récupération: 'var(--success-500)',
    'Perte de poids': 'var(--warning-500)',
    Croissance: 'var(--blue-500)',
    'Anti-âge': 'var(--purple-500)',
    Performance: 'var(--danger-500)',
    'Bien-être': 'var(--pink-500)',
    Hormonal: 'var(--purple-600)',
    Nootropique: 'var(--persian-500)',
    Cosmétique: 'var(--pink-400)',
    Santé: 'var(--success-500)',
  }

  const getCategoryColor = (category: string | null | undefined): string => {
    if (!category) return 'var(--primary-500)'
    return categoryColors[category] || 'var(--primary-500)'
  }

  // Vérifier si le produit a déjà été commandé par l'utilisateur
  const hasBeenOrdered = computed(() => {
    if (!auth.user || !product.value) return false
    return orderHistory.hasOrderedProduct(product.value.id)
  })

  // Regex pour détecter un UUID
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  onMounted(async () => {
    const { slug } = route.params
    if (typeof slug !== 'string') return

    loading.value = true

    try {
      // Charger l'historique des commandes si l'utilisateur est connecté
      if (auth.user) {
        orderHistory.loadOrders()
      }

      // Récupérer le produit : essaie le slug d'abord, puis UUID si c'est un format UUID
      let productData = await fetchProductBySlug(slug)

      // Si pas trouvé par slug et que ça ressemble à un UUID, essayer par ID
      // (rétrocompatibilité pour les liens panier et anciens liens)
      if (!productData && UUID_REGEX.test(slug)) {
        productData = await fetchProductById(slug)
      }

      // Récupérer les avis par l'ID du produit (après avoir le produit)
      const reviewData = productData ? await fetchReviewSummary(productData.id) : null

      if (productData) {
        product.value = productData
      }
      reviewSummary.value = reviewData

      // Détecter le magic link pour avis invité
      const queryReviewToken = route.query.review_token as string | undefined
      const queryOrderId = route.query.order as string | undefined

      if (queryReviewToken && queryOrderId && productData) {
        // Valider le token
        const validation = await validateReviewToken(queryOrderId, productData.id)
        if (validation.valid) {
          reviewToken.value = queryReviewToken
          reviewOrderId.value = queryOrderId
          reviewMode.value = validation
        } else {
          console.warn('Invalid review token:', validation.error)
        }
      }
    } catch (e) {
      console.error('Erreur loading product:', e)
      product.value = null
    } finally {
      loading.value = false
    }
  })

  const addToCart = async (p: Products) => {
    if ((p.stock ?? 0) <= 0) return
    // Calculer la réduction pack applicable
    const discountPercent = packInfo.value?.packDiscount ?? 0
    // Sauvegarder packInfo avant reset
    const currentPackInfo = packInfo.value
    // Ajouter la quantité sélectionnée en une seule fois avec la réduction
    await cart.addToCart(p, selectedQuantity.value, discountPercent)
    showAddToCartToast(p, currentPackInfo)
    // Reset la quantité après ajout
    selectedQuantity.value = 1
  }

  const addPackToCart = async (p: Products) => {
    if ((p.stock ?? 0) <= 0 || selectedQuantity.value <= 1) return
    if (isPackAdded.value) return

    // Calculer la réduction pack applicable
    const discountPercent = packInfo.value?.packDiscount ?? 0
    // Sauvegarder packInfo avant reset
    const currentPackInfo = packInfo.value
    // Ajouter la quantité sélectionnée en une seule fois avec la réduction
    await cart.addToCart(p, selectedQuantity.value, discountPercent)
    showAddToCartToast(p, currentPackInfo)

    // Feedback visuel
    isPackAdded.value = true
    setTimeout(() => {
      isPackAdded.value = false
      // Reset la quantité après ajout
      selectedQuantity.value = 1
    }, 2000)
  }

  const buyNow = async (p: Products) => {
    if ((p.stock ?? 0) <= 0) return
    // Calculer la réduction pack applicable
    const discountPercent = packInfo.value?.packDiscount ?? 0
    // Ajouter la quantité sélectionnée en une seule fois avec la réduction
    await cart.addToCart(p, selectedQuantity.value, discountPercent)
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
    background: var(--bg-page);

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
      color: var(--text-muted);

      span {
        cursor: pointer;
        transition: color 0.2s;

        &:hover:not(.active) {
          color: var(--primary-600);
        }

        &.active {
          color: var(--text-primary);
          font-weight: 500;
          cursor: default;
        }
      }

      svg {
        color: var(--text-muted);
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
      // Styles de base gérés par ContentBlock
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
        background: linear-gradient(135deg, var(--secondary-800) 0%, var(--secondary-900) 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      &--ordered {
        top: 52px;
        right: 16px;
        background: linear-gradient(135deg, rgba(var(--success-500-rgb), 0.95) 0%, rgba(var(--success-600-rgb), 0.95) 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(var(--success-500-rgb), 0.3);
      }
    }

    &__image-wrapper {
      position: relative;
      border-radius: 16px;
      background: var(--bg-subtle);
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
      background: var(--bg-surface);
    }

    &__trust-strip {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--border-default);
    }

    &__trust-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: @font-body;
      font-size: 12px;
      color: var(--text-secondary);

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
      border: 1px solid var(--border-default);
      background: var(--bg-surface);

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
        background: var(--secondary-700);
      }
    }

    &__coa-label {
      font-family: @font-body;
      font-size: 13px;
      color: var(--text-secondary);
    }

    // ============ LAB VERIFICATION (Analyse indépendante) ============
    &__lab-verification {
      margin-top: 16px;
      // Styles de base gérés par ContentBlock
    }

    &__lab-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;

      svg {
        color: @success-500;
      }
    }

    &__lab-title {
      font-family: @font-display;
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
    }

    &__lab-description {
      font-family: @font-body;
      font-size: 13px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin: 0 0 16px;

      strong {
        color: var(--text-primary);
        font-weight: 600;
      }
    }

    &__lab-details {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
      padding: 12px 16px;
      background: var(--bg-subtle);
      border-radius: 8px;
      border: 1px solid var(--border-default);
    }

    &__lab-detail {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      min-width: 140px;
    }

    &__lab-detail-label {
      font-family: @font-body;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
    }

    &__lab-detail-value {
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);

      &--success {
        color: @success-600;
      }
    }

    &__lab-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &__lab-link,
    &__lab-download {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 8px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s @ease;
    }

    &__lab-link {
      background: var(--bg-surface);
      color: var(--primary-700);
      border: 1px solid var(--primary-200);

      &:hover {
        background: rgba(var(--primary-500-rgb), 0.05);
        border-color: var(--primary-400);
        transform: translateY(-1px);
      }
    }

    &__lab-download {
      background: linear-gradient(135deg, @success-500 0%, @success-600 100%);
      color: white;
      border: none;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);

      &:hover {
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
        transform: translateY(-1px);
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
      background: var(--bg-surface-secondary);
      border-radius: 20px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
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
      color: var(--text-primary);
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin: 0;
    }

    &__subtitle {
      font-family: @font-body;
      font-size: 18px;
      color: var(--text-muted);
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
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
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
      color: var(--text-muted);
    }

    &__spec-value {
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);

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
      // Styles de base gérés par ContentBlock
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
      color: var(--text-muted);
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
        color: var(--text-muted);
      }

      &--sale {
        color: @danger-600;
      }
    }

    &__price-info {
      font-family: @font-body;
      font-size: 13px;
      color: var(--text-muted);
    }

    // ─────────────────────────────────────────
    // Pack Summary (utilise ContentBlock variant="info")
    // ─────────────────────────────────────────
    &__pack-summary {
      display: flex;
      flex-direction: column;
      gap: 16px;
      // Background et border gérés par ContentBlock
    }

    &__pack-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    &__pack-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: @font-display;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);

      svg {
        color: var(--primary-500);
      }
    }

    &__pack-discount {
      padding: 4px 10px;
      background: linear-gradient(135deg, @danger-500 0%, @danger-600 100%);
      border-radius: 6px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 700;
      color: white;
    }

    // Affichage des promos cumulées
    &__pack-promos {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 14px;
      background: rgba(var(--success-500-rgb), 0.1);
      border: 1px solid rgba(var(--success-500-rgb), 0.2);
      border-radius: 8px;
    }

    &__pack-promo-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: @font-body;
      font-size: 12px;
      color: var(--text-secondary);

      svg {
        color: @success-500;
      }

      strong {
        color: @success-600;
        font-weight: 700;
      }
    }

    &__pack-promo-plus {
      font-family: @font-display;
      font-size: 14px;
      font-weight: 700;
      color: var(--text-muted);
    }

    &__pack-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 16px;
      background: var(--bg-subtle, rgba(var(--primary-500-rgb), 0.05));
      border: 1px solid var(--border-default, rgba(var(--primary-500-rgb), 0.1));
      border-radius: 10px;
    }

    &__pack-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      &--savings {
        padding-top: 8px;
        border-top: 1px solid var(--border-default, rgba(var(--primary-500-rgb), 0.15));
      }
    }

    &__pack-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: @font-body;
      font-size: 14px;
      color: var(--text-secondary);

      svg {
        color: @success-500;
      }
    }

    &__pack-price {
      font-family: @font-display;
      font-size: 22px;
      font-weight: 700;
      color: var(--text-primary);
    }

    &__pack-savings {
      font-family: @font-display;
      font-size: 16px;
      font-weight: 700;
      color: @success-600;
    }

    &__pack-btn {
      width: 100%;
      transition: all 0.3s ease;

      &--success {
        background: @success-500 !important;
        border-color: @success-500 !important;
      }
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
          background: var(--secondary-300);
          box-shadow: none;
          cursor: not-allowed;
        }
      }

      &--secondary {
        background: var(--bg-surface);
        color: var(--text-primary);
        border: 2px solid var(--border-default);

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
      font-family: @font-body;
      font-size: 13px;
      color: @warning-800;
      // Styles de base gérés par ContentBlock

      svg {
        color: @warning-500;
        flex-shrink: 0;
      }

      strong {
        font-weight: 700;
      }
    }

    &__urgency {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: @success-700;
      // Styles de base gérés par ContentBlock

      svg {
        color: @success-500;
        flex-shrink: 0;
        animation: pulse 2s ease-in-out infinite;
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
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
      // Styles de base gérés par ContentBlock
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
        color: var(--text-primary);
      }

      span {
        font-family: @font-body;
        font-size: 13px;
        color: var(--text-muted);
      }
    }

    // ============ DETAILS SECTION ============
    &__details {
      overflow: hidden;
      margin-bottom: 32px;
      // Styles de base gérés par ContentBlock
    }

    &__details-tabs {
      display: flex;
      gap: 4px;
      padding: 8px;
      background: var(--bg-surface-secondary);
      border-bottom: 1px solid var(--border-subtle);
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
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s @ease;

      svg {
        opacity: 0.6;
      }

      &:hover:not(&--active) {
        background: var(--bg-subtle);
        color: var(--text-primary);
      }

      &--active {
        background: var(--bg-subtle);
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
      color: var(--text-secondary);

      :deep(p) {
        margin-bottom: 16px;
      }

      :deep(strong) {
        font-weight: 700;
        color: var(--text-primary);
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
        color: var(--text-primary);
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
      background: var(--bg-subtle);
      border-radius: 16px;
      transition: all 0.2s @ease;

      &:hover {
        background: var(--border-default);
      }
    }

    &__shipping-icon {
      font-size: 28px;
    }

    &__shipping-card h4 {
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 4px;
    }

    &__shipping-card p {
      font-family: @font-body;
      font-size: 13px;
      color: var(--text-muted);
      margin: 0;
    }

    // ============ DISCLAIMER RUO ============
    &__disclaimer {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 40px;
      // Styles de base gérés par ContentBlock
    }

    &__disclaimer-icon {
      width: 48px;
      height: 48px;
      min-width: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: @danger-100;
      border-radius: 12px;

      svg {
        color: @danger-600;
      }
    }

    &__disclaimer-content {
      flex: 1;
    }

    &__disclaimer-title {
      display: block;
      font-family: @font-body;
      font-size: 15px;
      font-weight: 700;
      color: @danger-700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    &__disclaimer-text {
      font-family: @font-body;
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin: 0;

      strong {
        color: var(--text-primary);
      }
    }

    &__disclaimer-warning {
      display: inline;
      padding: 2px 10px;
      margin: 0 4px;
      background: @danger-100;
      border-radius: 4px;
      color: @danger-700;
      font-weight: 700;
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

  // ─────────────────────────────────────────
  // Pack Summary Transition
  // ─────────────────────────────────────────
  .pack-summary-enter-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .pack-summary-leave-active {
    transition: all 0.2s ease;
  }

  .pack-summary-enter-from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }

  .pack-summary-leave-to {
    opacity: 0;
    transform: translateY(-5px) scale(0.98);
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

      &__lab-verification {
        padding: 16px;
      }

      &__lab-details {
        flex-direction: column;
        gap: 12px;
        padding: 12px;
      }

      &__lab-detail {
        min-width: auto;
      }

      &__lab-actions {
        gap: 8px;
      }

      &__lab-link,
      &__lab-download {
        padding: 12px 14px;
        font-size: 12px;
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

// Sticky CTA Mobile (global car téléporté)
:global(.product-sticky-cta) {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(180deg, rgba(15, 15, 25, 0.98) 0%, rgba(10, 10, 20, 1) 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);

  &__price {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__price-old {
    font-size: 12px;
    color: var(--text-muted);
    text-decoration: line-through;
  }

  &__price-current {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);

    &--sale {
      color: @danger-500;
    }
  }

  &__btn {
    flex: 1;
    max-width: 200px;
  }
}

// Animation slide-up
:global(.slide-up-enter-active),
:global(.slide-up-leave-active) {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

:global(.slide-up-enter-from),
:global(.slide-up-leave-to) {
  transform: translateY(100%);
  opacity: 0;
}
</style>
