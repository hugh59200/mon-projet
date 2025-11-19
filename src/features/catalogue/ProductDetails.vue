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
        class="product__content"
      >
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
        </div>

        <div class="product__info">
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
                weight="semibold"
                color="neutral-900"
                tag="span"
              >
                {{ product.category }}
              </BasicText>
            </BasicText>
            |
            <BasicText
              size="body-m"
              color="neutral-700"
            >
              Pureté :
              <BasicText
                weight="bold"
                color="success-700"
                tag="span"
              >
                {{ product.purity }}%
              </BasicText>
            </BasicText>
          </div>

          <BasicText
            size="h3"
            weight="bold"
            class="product__price"
          >
            {{ product.price.toFixed(2) }} €
          </BasicText>

          <BasicText
            size="body-m"
            color="neutral-700"
            class="product__desc"
          >
            {{
              product.description ||
              'Aucune description détaillée n’est disponible pour ce produit de recherche.'
            }}
          </BasicText>

          <div class="product__actions">
            <BasicButton
              :label="product.stock ? 'Ajouter au panier' : 'Rupture de stock'"
              :disabled="!product.stock"
              :type="product.stock ? 'primary' : 'secondary'"
              variant="filled"
              size="large"
              @click="addToCart(product)"
              class="product__add-button"
            />

            <BasicText
              v-if="!product.stock"
              size="body-s"
              color="danger-600"
              weight="semibold"
            >
              Le produit est actuellement en réapprovisionnement.
            </BasicText>
          </div>

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
    </WrapperLoader>
  </div>
</template>
<script setup lang="ts">
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { supabase } from '@/supabase/supabaseClient'
  import type { Products } from '@/supabase/types/supabase.types'
  import { useSmartToast } from '@designSystem/components/basic/toast/useSmartToast'
  import { onMounted, ref } from 'vue'
  import InnerImageZoom from 'vue-inner-image-zoom'
  import { useRoute } from 'vue-router'

  // Types de données (assurez-vous qu'ils existent dans vos fichiers de types)
  type ProductRow = Products & { quantity?: number; stock: boolean }
  type CartItem = ProductRow & { quantity: number }

  const route = useRoute()
  const cart = useCartStore()
  const { showAddToCartToast } = useSmartToast() // Utilisation du composable de toast intelligent

  const product = ref<ProductRow | null>(null)
  const loading = ref(true)

  onMounted(async () => {
    const { id } = route.params
    if (typeof id !== 'string') return

    loading.value = true

    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single()

      if (!error && data) {
        product.value = { ...data, stock: !!data.stock }

        // 🧠 Mise à jour dynamique du SEO
        const productName = data.name || 'Produit Inconnu'
        const metaDescription =
          data.description ||
          `Achetez le peptide ${productName} (${data.purity}% pureté) sur Fast Peptides.`

        document.title = `${productName} – Fast Peptides`

        const descriptionTag = document.querySelector('meta[name="description"]')
        if (descriptionTag) {
          descriptionTag.setAttribute('content', metaDescription)
        } else {
          // Créer la balise si elle n'existe pas (pour les Single Page Applications)
          const meta = document.createElement('meta')
          meta.name = 'description'
          meta.content = metaDescription
          document.head.appendChild(meta)
        }
      }
    } catch (e) {
      console.error('Erreur de chargement du produit:', e)
      product.value = null
    } finally {
      loading.value = false
    }
  })

  const addToCart = (p: ProductRow) => {
    if (!p.stock) return

    const itemToAdd: CartItem = {
      ...p,
      image: p.image || '/default-product-image.jpg',
      stock: true, // Assuré par la condition précédente
      quantity: 1, // Ajoute 1 par défaut, la logique du store gère l'incrément
    } as CartItem

    cart.addToCart(itemToAdd)
    showAddToCartToast(itemToAdd) // Utilisation du toast intelligent
  }
</script>

<style scoped lang="less">
  .product {
    display: flex;
    flex-direction: column;
    padding: 40px 60px;
    gap: 30px; /* Augmenté l'espacement */
    max-width: 1200px;
    margin: 0 auto;

    &__back {
      align-self: flex-start;
    }

    /* Conteneur principal */
    &__content {
      display: flex;
      gap: 80px; /* Espacement large */
      align-items: flex-start;
      flex-wrap: wrap;
    }

    /* Colonne Image */
    &__image-wrapper {
      flex: 1;
      min-width: 300px;
      max-width: 450px;
      user-select: none;
      position: relative;

      .product__zoom {
        width: 100%;
        border-radius: 16px;
        background: white;
        padding: 25px;
        border: 1px solid var(--neutral-200);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }
    }

    /* Badge RUO */
    &__ruo-badge {
      position: absolute;
      top: -15px;
      right: 0;
      padding: 6px 12px;
      border-radius: 999px;
      background: var(--error-700); /* Couleur d'alerte forte */
      z-index: 10;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
    }

    /* Colonne Info */
    &__info {
      flex: 1.5;
      min-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 20px; /* Espacement entre blocs d'info */
      padding-top: 10px;

      .product__name {
        font-size: clamp(1.8rem, 3vw, 2.5rem) !important;
        color: var(--secondary-900);
        margin-bottom: 5px;
      }
    }

    /* Pilule Méta */
    &__meta-pill {
      display: flex;
      gap: 15px;
      align-items: center;
      padding: 10px 15px;
      border-radius: 8px;
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);

      // S'assurer que le séparateur | utilise une couleur neutre
      > span {
        color: var(--neutral-300);
      }
    }

    /* Prix et actions */
    &__price {
      color: var(--primary-700);
      font-size: clamp(1.5rem, 2.5vw, 2rem) !important;
      margin-top: 10px;
    }

    &__actions {
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 350px;
    }

    &__disclaimer {
      margin-top: 15px;
      line-height: 1.4;
      max-width: 450px;
      padding-left: 5px;
    }

    /* Médias et responsivité */
    @media (max-width: 900px) {
      padding: 20px;
      gap: 40px;

      &__content {
        flex-direction: column;
        align-items: center;
      }

      &__image-wrapper {
        max-width: 350px;
      }

      &__info {
        min-width: 100%;
      }

      &__actions {
        max-width: 100%;
      }
    }
  }
</style>
