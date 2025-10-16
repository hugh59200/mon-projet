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
          :src="product.image"
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

        <div class="product__actions">
          <BasicButton
            :label="product.stock ? 'Ajouter au panier' : 'Rupture de stock'"
            :disabled="!product.stock"
            :type="product.stock ? 'primary' : 'secondary'"
            variant="filled"
            size="medium"
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
  import { supabase } from '@/services/supabaseClient'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  interface Product {
    id: string
    name: string
    category: string
    price: number
    purity: number
    stock: boolean
    image: string
    description?: string
  }

  const route = useRoute()
  const product = ref<Product | null>(null)
  const loading = ref(true)

  onMounted(async () => {
    const { id } = route.params
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single()

    if (!error && data) {
      product.value = data
    }
    loading.value = false
  })
</script>

<style scoped lang="less">
  .product {
    display: flex;
    flex-direction: column;
    padding: 40px 60px;
    gap: 20px;

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
