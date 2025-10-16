<template>
  <div class="catalogue">
    <!-- HEADER -->
    <div class="catalogue__header">
      <BasicText
        size="h3"
        weight="bold"
      >
        Catalogue de peptides
      </BasicText>

      <BasicInput
        v-model="search"
        placeholder="Rechercher un peptide..."
        input-type="form"
        size="medium"
        icon-left="search"
        class="catalogue__search"
      />
    </div>

    <!-- LAYOUT -->
    <div class="catalogue__layout">
      <!-- FILTRES -->
      <aside class="catalogue__filters">
        <BasicText
          size="h5"
          weight="bold"
        >
          Filtres
        </BasicText>
        <select v-model="filters.category">
          <option value="">Toutes les catégories</option>
          <option value="Performance">Performance</option>
          <option value="Récupération">Récupération</option>
          <option value="Recherche">Recherche</option>
        </select>
        <select v-model="filters.stock">
          <option value="">Toutes</option>
          <option value="in">En stock</option>
          <option value="out">Rupture</option>
        </select>
      </aside>

      <!-- PRODUITS -->
      <section class="catalogue__products">
        <div
          v-if="loading"
          class="catalogue__loading"
        >
          <BasicText>Chargement des produits...</BasicText>
        </div>

        <div
          v-else-if="filteredProducts.length === 0"
          class="catalogue__empty"
        >
          <BasicText>Aucun produit trouvé.</BasicText>
        </div>

        <div
          v-else
          class="catalogue__grid"
        >
          <div
            v-for="p in filteredProducts"
            :key="p.id"
            class="catalogue__card"
          >
            <img
              :src="p.image"
              :alt="p.name"
            />
            <BasicText weight="bold">{{ p.name }}</BasicText>
            <BasicText
              size="body-s"
              color="neutral-500"
            >
              {{ p.category }}
            </BasicText>
            <BasicText size="body-s">Pureté : {{ p.purity }}%</BasicText>
            <BasicText
              size="body-l"
              weight="bold"
              class="catalogue__price"
            >
              {{ p.price.toFixed(2) }} €
            </BasicText>

            <BasicButton
              :label="p.stock ? 'Ajouter au panier' : 'Rupture'"
              :disabled="!p.stock"
              :type="p.stock ? 'primary' : 'secondary'"
              size="small"
            />
          </div>
        </div>

        <!-- PAGINATION -->
        <BasicPagination
          v-if="nbPages > 1"
          :nb-pages="nbPages"
          :current-page="page"
          :nb-pages-max="5"
          :nb-results="total"
          @change="page = $event"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { supabase } from '@/services/supabaseClient'
  import { computed, ref, watchEffect } from 'vue'

  type Product = {
    id: string
    name: string
    category: string
    price: number
    purity: number
    stock: boolean
    image: string
  }

  const products = ref<Product[]>([])
  const loading = ref(true)
  const page = ref(1)
  const perPage = 6
  const total = ref(0)
  const search = ref('')
  const filters = ref({ category: '', stock: '' })

  // Chargement Supabase
  async function loadProducts() {
    loading.value = true
    let query = supabase.from('products').select('*', { count: 'exact' })

    // Filtres
    if (filters.value.category) query = query.eq('category', filters.value.category)
    if (filters.value.stock) query = query.eq('stock', filters.value.stock === 'in')

    // Recherche
    if (search.value) query = query.ilike('name', `%${search.value}%`)

    // Pagination
    const from = (page.value - 1) * perPage
    const to = from + perPage - 1

    const { data, count, error } = await query.range(from, to).order('price', { ascending: true })

    if (error) console.error(error)
    else {
      products.value = data || []
      total.value = count || 0
    }
    loading.value = false
  }

  watchEffect(loadProducts)

  const nbPages = computed(() => Math.ceil(total.value / perPage))

  const filteredProducts = computed(() => products.value)
</script>

<style scoped lang="less">
  .catalogue {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 40px 60px;

    &__layout {
      display: flex;
      gap: 32px;
    }

    &__filters {
      flex: 0 0 220px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: @neutral-50;
      border: 1px solid @neutral-200;
      border-radius: 8px;
      padding: 20px;
    }

    &__products {
      flex: 1;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 24px;
    }

    &__card {
      background: white;
      border-radius: 12px;
      border: 1px solid @neutral-200;
      padding: 16px;
      text-align: center;
      transition: all 0.2s;

      img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 10px;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
    }

    &__price {
      color: @primary-700;
    }

    &__loading,
    &__empty {
      text-align: center;
      padding: 40px;
    }

    @media (max-width: 900px) {
      &__layout {
        flex-direction: column;
      }
    }
  }
</style>
