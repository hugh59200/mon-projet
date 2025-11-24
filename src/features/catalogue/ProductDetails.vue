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
              class="product__name"
              style="color: var(--secondary-900)"
            >
              {{ product.name }}
            </BasicText>

            <div class="product__meta-pill">
              <BasicText
                size="body-m"
                color="neutral-700"
              >
                Catégorie :
                <span style="font-weight: 600; color: var(--neutral-900)">
                  {{ product.category }}
                </span>
              </BasicText>
              <span class="product__separator">|</span>
              <BasicText
                size="body-m"
                color="neutral-700"
              >
                Pureté :
                <span style="font-weight: 700; color: var(--success-700)">
                  {{ product.purity }}%
                </span>
              </BasicText>
              <template v-if="product.dosage">
                <span class="product__separator">|</span>
                <BasicText
                  size="body-m"
                  color="neutral-700"
                >
                  Dosage :
                  <span style="font-weight: 700; color: var(--primary-700)">
                    {{ product.dosage }}
                  </span>
                </BasicText>
              </template>
            </div>

            <div class="product__price-block">
              <template v-if="product.is_on_sale && product.sale_price">
                <BasicText class="product__old-price">{{ product.price.toFixed(2) }} €</BasicText>
                <BasicText
                  size="h3"
                  weight="bold"
                  class="product__price product__price--sale"
                >
                  {{ product.sale_price.toFixed(2) }} €
                </BasicText>
              </template>
              <template v-else>
                <BasicText
                  size="h3"
                  weight="bold"
                  class="product__price"
                >
                  {{ product.price.toFixed(2) }} €
                </BasicText>
              </template>
            </div>

            <div class="product__actions">
              <BasicButton
                :label="(product.stock ?? 0) > 0 ? 'Ajouter au panier' : 'Rupture de stock'"
                :disabled="(product.stock ?? 0) <= 0"
                :type="(product.stock ?? 0) > 0 ? 'primary' : 'secondary'"
                variant="filled"
                size="large"
                @click="addToCart(product!)"
                width="full"
              />

              <BasicText
                v-if="(product.stock ?? 0) <= 0"
                size="body-s"
                color="danger-600"
                weight="semibold"
              >
                Réapprovisionnement en cours.
              </BasicText>
              <BasicText
                v-else-if="(product.stock ?? 0) < 10"
                size="body-s"
                color="warning-600"
              >
                Plus que {{ product.stock }} exemplaires !
              </BasicText>

              <BasicText
                size="body-s"
                color="danger-400"
                font-style="italic"
                class="product__disclaimer"
              >
                * Produit destiné exclusivement à la recherche en laboratoire.
              </BasicText>
            </div>
          </div>
        </div>

        <div class="product__bottom-section">
          <div class="product__divider"></div>

          <BasicText
            size="h4"
            weight="bold"
            color="secondary-900"
            style="margin-bottom: 16px"
          >
            Fiche Technique & Description
          </BasicText>

          <div
            class="product__desc-content"
            v-html="sanitizeHTML(product.description || 'Aucune description détaillée disponible.')"
          ></div>
        </div>
      </div>
    </WrapperLoader>
  </div>
</template>

<script setup lang="ts">
  // ... (Garde tes imports et scripts identiques, rien ne change ici) ...
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { supabase } from '@/supabase/supabaseClient'
  import type { Products } from '@/supabase/types/supabase.types'
  import { sanitizeHTML } from '@/utils'
  import { useSmartToast } from '@designSystem/components/basic/toast/useSmartToast'
  import { onMounted, ref } from 'vue'
  import InnerImageZoom from 'vue-inner-image-zoom'
  import { useRoute } from 'vue-router'

  const route = useRoute()
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
        document.title = `${data.name} – Fast Peptides`
      }
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  })

  const addToCart = (p: Products) => {
    if ((p.stock ?? 0) <= 0) return
    cart.addToCart(p)
    showAddToCartToast(p)
  }
</script>

<style scoped lang="less">
  .product {
    display: flex;
    flex-direction: column;
    padding: 40px 60px;
    gap: 20px;
    max-width: 1100px; /* Un peu plus contenu pour la lisibilité */
    margin: 0 auto;

    &__back {
      align-self: flex-start;
      margin-bottom: 10px;
    }

    &__container {
      display: flex;
      flex-direction: column;
      gap: 40px; /* Espace entre le haut et la description */
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
      /* On s'assure que l'image ne devienne pas gigantesque */

      .product__zoom {
        border-radius: 16px;
        background: white;
        padding: 20px;
        border: 1px solid @neutral-200;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
      }
    }

    &__info-panel {
      flex: 1; /* Prend l'espace restant à droite */
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding-top: 10px;
    }

    /* --- SECTION BAS (DESCRIPTION) --- */
    &__bottom-section {
      width: 100%;
      background: color-mix(in srgb, @neutral-100 50%, transparent);
      padding: 30px;
      border-radius: 16px;
      border: 1px solid @neutral-200;
    }

    &__desc-content {
      color: @neutral-700;
      line-height: 1.7; /* Meilleure lisibilité */
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
      }
    }

    /* --- ELEMENTS UI --- */
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
      font-size: clamp(2rem, 3vw, 2.5rem);
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

    &__price {
      color: var(--primary-700);
      font-size: 2rem;
      &--sale {
        color: @red-600;
      }
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
      gap: 10px;
      max-width: 400px; /* Limite la largeur du bouton */
    }

    &__disclaimer {
      line-height: 1.3;
      margin-top: 5px;
    }

    /* --- RESPONSIVE --- */
    @media (max-width: 850px) {
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
      }
    }
  }
</style>
