<template>
  <div class="product">
    <BasicButton
      label="← Retour au catalogue"
      type="secondary"
      variant="ghost"
      class="product__back"
      @click="$router.push('/catalogue')"
    />

    <WrapperLoader
      :loading="loading"
      :has-loaded="!!product"
      :is-empty="!product && !loading"
      message="Chargement du produit..."
      empty-message="Produit introuvable ou indisponible."
    >
      <div
        v-if="product"
        class="product__container"
      >
        <div class="product__top-section">
          <div class="product__image-wrapper">
            <InnerImageZoom
              v-if="product.image"
              :src="product.image"
              :zoomSrc="product.image"
              :alt="`Image de peptide ${product.name}`"
              class="product__zoom"
              :moveType="'drag'"
              :zoomType="'click'"
            />

            <div class="product__ruo-badge">
              <BasicText
                size="body-s"
                weight="semibold"
                color="white"
              >
                USAGE RECHERCHE UNIQUEMENT (RUO)
              </BasicText>
            </div>

            <div
              v-if="product.is_on_sale"
              class="product__promo-badge"
            >
              PROMO
            </div>
          </div>

          <div class="product__info-panel">
            <BasicText
              size="h2"
              weight="bold"
              color="secondary-900"
              class="product__name"
            >
              {{ product.name }}
            </BasicText>

            <div class="product__meta-pill">
              <BasicText
                size="body-m"
                color="neutral-700"
              >
                Catégorie :
                <BasicText
                  size="body-m"
                  weight="semibold"
                  color="neutral-900"
                >
                  {{ product.category }}
                </BasicText>
              </BasicText>

              <span class="product__separator">|</span>

              <BasicText
                size="body-m"
                color="neutral-700"
              >
                Pureté :
                <BasicText
                  size="body-m"
                  weight="bold"
                  color="success-700"
                >
                  {{ product.purity }}%
                </BasicText>
              </BasicText>

              <template v-if="product.dosage">
                <span class="product__separator">|</span>
                <BasicText
                  size="body-m"
                  color="neutral-700"
                >
                  Dosage :
                  <BasicText
                    size="body-m"
                    weight="bold"
                    color="primary-700"
                  >
                    {{ product.dosage }}
                  </BasicText>
                </BasicText>
              </template>
            </div>

            <div class="product__price-block">
              <template v-if="product.is_on_sale && product.sale_price">
                <BasicText class="product__old-price">{{ product.price.toFixed(2) }} €</BasicText>
                <BasicText
                  size="h3"
                  weight="bold"
                  color="danger-600"
                >
                  {{ product.sale_price.toFixed(2) }} €
                </BasicText>
              </template>
              <template v-else>
                <BasicText
                  size="h3"
                  weight="bold"
                  color="primary-700"
                >
                  {{ product.price.toFixed(2) }} €
                </BasicText>
              </template>
            </div>

            <div class="product__actions">
              <!-- 🆕 Conteneur pour les 2 boutons côte à côte -->
              <div class="product__buttons-row">
                <!-- Bouton Ajouter au panier -->
                <BasicButton
                  :label="(product.stock ?? 0) > 0 ? 'Ajouter au panier' : 'Rupture de stock'"
                  :disabled="(product.stock ?? 0) <= 0"
                  :type="(product.stock ?? 0) > 0 ? 'primary' : 'secondary'"
                  variant="filled"
                  size="large"
                  @click="addToCart(product!)"
                  width="full"
                />

                <!-- 🆕 Bouton Acheter maintenant -->
                <BasicButton
                  v-if="(product.stock ?? 0) > 0"
                  label="Acheter maintenant"
                  type="secondary"
                  variant="outlined"
                  size="large"
                  @click="buyNow(product!)"
                  width="full"
                />
              </div>

              <BasicText
                v-if="(product.stock ?? 0) <= 0"
                size="body-s"
                color="danger-600"
                weight="semibold"
              >
                Le produit est actuellement en réapprovisionnement.
              </BasicText>

              <BasicText
                v-else-if="(product.stock ?? 0) < 10"
                size="body-s"
                color="warning-600"
              >
                Plus que {{ product.stock }} exemplaires disponibles !
              </BasicText>

              <BasicText
                size="body-s"
                color="danger-400"
                font-style="italic"
                class="product__disclaimer"
              >
                * Ce produit est strictement destiné à la recherche en laboratoire. Non destiné à la
                consommation ou à l'usage humain.
              </BasicText>
            </div>
          </div>
        </div>

        <div class="product__bottom-section">
          <BasicText
            size="h4"
            weight="bold"
            color="secondary-900"
            class="product__desc-title"
          >
            Fiche Technique & Description
          </BasicText>

          <div
            class="product__desc-content"
            v-html="sanitizeHTML(product.description || 'Aucune description détaillée disponible.')"
          ></div>

          <div class="product__divider"></div>

          <ProductEssentials />
        </div>
      </div>
    </WrapperLoader>
  </div>
</template>

<script setup lang="ts">
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { supabase } from '@/supabase/supabaseClient'
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

  onMounted(async () => {
    const { id } = route.params
    if (typeof id !== 'string') return

    loading.value = true

    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single()

      if (!error && data) {
        product.value = data
        const productName = data.name || 'Produit Inconnu'
        const metaTitle = `${productName} ${data.dosage ? ' - ' + data.dosage : ''} | Fast Peptides`
        document.title = metaTitle
      }
    } catch (e) {
      console.error('Erreur loading product:', e)
      product.value = null
    } finally {
      loading.value = false
    }
  })

  // Ajouter au panier classique
  const addToCart = (p: Products) => {
    if ((p.stock ?? 0) <= 0) return
    cart.addToCart(p)
    showAddToCartToast(p)
  }

  // 🆕 Acheter maintenant : Ajoute au panier + redirige vers checkout
  const buyNow = async (p: Products) => {
    if ((p.stock ?? 0) <= 0) return

    // Ajouter au panier (si pas déjà présent, sinon +1)
    await cart.addToCart(p)

    // Redirection directe vers le checkout
    router.push('/checkout')
  }
</script>

<style scoped lang="less">
  .product {
    display: flex;
    flex-direction: column;
    padding: 40px 60px;
    gap: 20px;
    max-width: 1100px;
    margin: 0 auto;

    &__back {
      align-self: flex-start;
      margin-bottom: 10px;
    }

    &__container {
      display: flex;
      flex-direction: column;
      gap: 50px;
    }

    /* --- SECTION HAUT --- */
    &__top-section {
      display: flex;
      gap: 60px;
      align-items: flex-start;
    }

    &__image-wrapper {
      flex: 1;
      max-width: 450px;
      position: relative;
      user-select: none;

      .product__zoom {
        border-radius: 16px;
        background: white;
        padding: 20px;
        border: 1px solid @neutral-200;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
      }
    }

    &__info-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding-top: 10px;
    }

    /* --- SECTION BAS --- */
    &__bottom-section {
      width: 100%;
      background: color-mix(in srgb, @neutral-100 50%, transparent);
      padding: 40px;
      border-radius: 16px;
      border: 1px solid @neutral-200;
    }

    &__desc-title {
      border-left: 4px solid var(--primary-500);
      padding-left: 16px;
      margin-bottom: 24px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 1.1rem !important;
      display: flex;
      align-items: center;
      height: 24px;
    }

    &__desc-content {
      color: @neutral-700;
      line-height: 1.7;
      font-size: 1.05rem;

      :deep(p) {
        margin-bottom: 16px;
      }
      :deep(strong) {
        font-weight: 700;
        color: var(--secondary-900);
      }
      :deep(ul) {
        padding-left: 20px;
        margin-bottom: 16px;
        list-style-type: disc;
      }
      :deep(li) {
        margin-bottom: 8px;
        padding-left: 5px;
      }
    }

    &__divider {
      width: 100%;
      height: 1px;
      background: @neutral-200;
      margin: 40px 0;
    }

    /* --- ELEMENTS UI DIVERS --- */
    &__ruo-badge {
      position: absolute;
      top: -12px;
      right: -12px;
      padding: 6px 12px;
      border-radius: 999px;
      background: @red-700;
      z-index: 10;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    &__promo-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background: @red-600;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 0.8rem;
      z-index: 10;
    }

    &__name {
      font-size: clamp(2rem, 3vw, 2.5rem) !important;
      line-height: 1.1;
    }

    &__meta-pill {
      display: inline-flex;
      gap: 12px;
      align-items: center;
      padding: 8px 16px;
      border-radius: 8px;
      background: @neutral-50;
      border: 1px solid @neutral-200;
      width: fit-content;
    }

    &__separator {
      color: @neutral-300;
    }

    &__price-block {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-top: 5px;
    }

    &__old-price {
      text-decoration: line-through;
      color: @neutral-500;
      font-size: 1.2rem;
    }

    &__actions {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 500px; // 🆕 Augmenté pour les 2 boutons
    }

    // 🆕 Conteneur pour les 2 boutons côte à côte
    &__buttons-row {
      display: flex;
      gap: 12px;

      // Sur mobile, on empile verticalement
      @media (max-width: 500px) {
        flex-direction: column;
      }
    }

    &__disclaimer {
      line-height: 1.3;
      margin-top: 5px;
    }

    /* --- RESPONSIVE --- */
    @media (max-width: 900px) {
      padding: 20px;

      &__top-section {
        flex-direction: column;
        align-items: center;
        gap: 30px;
      }

      &__image-wrapper,
      &__info-panel,
      &__actions {
        max-width: 100%;
        width: 100%;
      }

      &__info-panel {
        align-items: center;
        text-align: center;
      }

      &__meta-pill {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }

      &__buttons-row {
        width: 100%;
      }
    }
  }
</style>
