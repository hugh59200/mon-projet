<template>
  <div class="product">
    <!-- Retour -->
    <BasicButton
      label="← Retour au catalogue"
      type="secondary"
      variant="ghost"
      class="product__back"
      @click="$router.push('/catalogue')"
    />

    <!-- Chargement -->
    <div
      v-if="loading"
      class="product__loading"
    >
      <BasicText>Chargement du produit...</BasicText>
    </div>

    <!-- Produit trouvé -->
    <div
      v-else-if="product"
      class="product__content"
    >
      <div class="product__image">
        <img
          :src="product.image || '/default-product-image.jpg'"
          :alt="product.name"
        />
      </div>

      <div class="product__info">
        <BasicText
          size="h3"
          weight="bold"
        >
          {{ product.name }}
        </BasicText>

        <BasicText
          size="body-m"
          color="neutral-500"
        >
          Catégorie : {{ product.category }}
        </BasicText>

        <BasicText
          size="body-m"
          color="neutral-500"
        >
          Pureté : {{ product.purity }}%
        </BasicText>

        <BasicText
          size="body-l"
          weight="bold"
          class="product__price"
        >
          {{ product.price.toFixed(2) }} €
        </BasicText>

        <BasicText
          size="body-s"
          color="neutral-500"
          class="product__desc"
        >
          {{ product.description || 'Aucune description disponible pour ce produit.' }}
        </BasicText>

        <!-- 🛒 Bouton ajout panier -->
        <div class="product__actions">
          <BasicButton
            :label="product.stock ? 'Ajouter au panier' : 'Rupture de stock'"
            :disabled="!product.stock"
            :type="product.stock ? 'primary' : 'secondary'"
            variant="filled"
            size="medium"
            @click="addToCart(product)"
          />
        </div>
      </div>
    </div>

    <!-- Non trouvé -->
    <div
      v-else
      class="product__notfound"
    >
      <BasicText
        size="body-l"
        color="red"
      >
        Produit introuvable
      </BasicText>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useCartStore } from '@/features/cart/useCartStore'
  import { supabase } from '@/services/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  interface Product {
    id: string
    name: string
    category: string
    price: number
    purity: number | null
    stock: boolean
    image: string | null
    description?: string | null
  }

  const route = useRoute()
  const cart = useCartStore()
  const toast = useToastStore()

  const product = ref<Product | null>(null)
  const loading = ref(true)

  onMounted(async () => {
    const { id } = route.params
    if (typeof id !== 'string') return
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single()

    if (!error && data) {
      product.value = { ...data, stock: !!data.stock }

      // 🧠 Met à jour dynamiquement le titre et la description
      document.title = `${data.name} – Fast Peptides`

      const descriptionTag = document.querySelector('meta[name="description"]')
      const metaDescription =
        data.description ||
        `Achetez le peptide ${data.name} (${data.purity}% pureté) sur Fast Peptides.`

      if (descriptionTag) {
        descriptionTag.setAttribute('content', metaDescription)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'description'
        meta.content = metaDescription
        document.head.appendChild(meta)
      }
    }

    loading.value = false
  })

  // 🛒 Fonction d'ajout au panier
  function addToCart(p: Product) {
    cart.addToCart({
      ...p,
      image: p.image || '/default-product-image.jpg',
    })
    toast.show(`✅ ${p.name} ajouté au panier`, 'success')
  }
</script>

<style scoped lang="less">
  .product {
    display: flex;
    flex-direction: column;
    padding: 40px 60px;
    gap: 20px;
    user-select: none;

    &__back {
      align-self: flex-start;
    }

    &__content {
      display: flex;
      gap: 60px;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    &__image {
      flex: 1;
      min-width: 300px;
      max-width: 400px;

      img {
        width: 100%;
        border-radius: 12px;
        border: 1px solid @neutral-200;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      }
    }

    &__info {
      flex: 1;
      min-width: 280px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__price {
      color: @primary-700;
    }

    &__actions {
      margin-top: 12px;
    }

    &__loading,
    &__notfound {
      text-align: center;
      padding: 40px;
    }

    @media (max-width: 900px) {
      padding: 20px;

      &__content {
        flex-direction: column;
        align-items: center;
      }
    }
  }
</style>
