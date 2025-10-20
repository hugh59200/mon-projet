<template>
  <div class="catalogue">
    <!-- 🧬 HEADER -->
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

    <!-- ⚙️ LAYOUT PRINCIPAL -->
    <div class="catalogue__layout">
      <!-- 🎚️ FILTRES LATERAUX -->
      <aside class="catalogue__filters">
        <BasicText
          size="h5"
          weight="bold"
        >
          Filtres
        </BasicText>

        <div class="catalogue__filter-group">
          <BasicText
            size="body-s"
            weight="bold"
          >
            Catégorie
          </BasicText>
          <select v-model="filters.category">
            <option value="">Toutes les catégories</option>
            <option value="Performance">Performance</option>
            <option value="Récupération">Récupération</option>
            <option value="Recherche">Recherche</option>
            <option value="Bien-être">Bien-être</option>
            <option value="Métabolisme">Métabolisme</option>
          </select>
        </div>

        <div class="catalogue__filter-group">
          <BasicText
            size="body-s"
            weight="bold"
          >
            Disponibilité
          </BasicText>
          <select v-model="filters.stock">
            <option value="">Toutes</option>
            <option value="in">En stock</option>
            <option value="out">Rupture</option>
          </select>
        </div>
      </aside>

      <!-- 💊 PRODUITS -->
      <section class="catalogue__products">
        <!-- 🔝 Pagination en haut -->
        <BasicPagination
          v-if="nbPages > 1"
          :nb-pages="nbPages"
          :current-page="page"
          :nb-pages-max="5"
          :nb-results="total"
          class="catalogue__pagination-top"
          @change="page = $event"
        />

        <!-- ⚙️ États -->
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

        <!-- 💊 Liste des produits avec animation -->
        <TransitionGroup
          name="fade-up"
          tag="div"
          class="catalogue__grid"
          v-else
        >
          <ProductCart
            v-for="p in filteredProducts"
            :key="p.id"
            :product="p"
            @add="addProduct"
            @view="(id: any) => $router.push(`/catalogue/${id}`)"
          />
        </TransitionGroup>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ProductCart from '@/features/cart/ProductCart.vue'
  import { useCartStore } from '@/features/cart/useCartStore'
  import { supabase } from '@/services/supabaseClient'
  import { computed, ref, watchEffect } from 'vue'

  const cart = useCartStore()

  function addProduct(p: any) {
    cart.addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      stock: p.stock,
    })
  }

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

  // ⚡ Chargement dynamique depuis Supabase
  async function loadProducts() {
    loading.value = true
    let query = supabase.from('products').select('*', { count: 'exact' })

    // 🎚️ Filtres
    if (filters.value.category) query = query.eq('category', filters.value.category)
    if (filters.value.stock) query = query.eq('stock', filters.value.stock === 'in')

    // 🔍 Recherche
    if (search.value) query = query.ilike('name', `%${search.value}%`)

    // 📄 Pagination
    const from = (page.value - 1) * perPage
    const to = from + perPage - 1

    const { data, count, error } = await query.order('price', { ascending: true }).range(from, to)

    if (error) {
      console.error('Erreur Supabase :', error)
    } else {
      products.value = data || []
      total.value = count || 0
    }

    loading.value = false
  }

  // ⚙️ Recharger à chaque changement de filtre, page ou recherche
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

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    &__search {
      width: 280px;
    }

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

    &__filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      select {
        padding: 8px;
        border-radius: 6px;
        border: 1px solid @neutral-300;
        background: white;
        cursor: pointer;
      }
    }

    &__products {
      flex: 1;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      column-gap: 28px;
      row-gap: 50px;
      align-items: start;
    }

    &__pagination-top {
      margin-bottom: 16px;
      display: flex;
      justify-content: center;
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

  /* ✨ Animation d’apparition fluide */
  .fade-up-enter-active,
  .fade-up-leave-active {
    transition: all 0.4s ease;
  }
  .fade-up-enter-from,
  .fade-up-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
</style>
