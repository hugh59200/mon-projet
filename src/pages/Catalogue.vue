<template>
  <div class="catalogue">
    <!-- 🔹 Header catalogue -->
    <div class="catalogue__header">
      <BasicText
        size="h2"
        weight="bold"
      >
        Catalogue de peptides
      </BasicText>

      <div class="catalogue__search">
        <BasicInput
          v-model="searchTerm"
          placeholder="Rechercher un peptide..."
          icon-left="search"
        />
      </div>
    </div>

    <!-- 🔹 Corps : filtres + liste -->
    <div class="catalogue__body">
      <!-- 🧭 Filtres -->
      <aside class="catalogue__filters">
        <BasicText
          size="body-l"
          weight="bold"
        >
          Filtres
        </BasicText>

        <div class="catalogue__filter">
          <BasicText size="body-s">Catégorie</BasicText>
          <select v-model="selectedCategory">
            <option value="">Toutes les catégories</option>
            <option
              v-for="cat in categories"
              :key="cat"
              :value="cat"
            >
              {{ cat }}
            </option>
          </select>
        </div>

        <div class="catalogue__filter">
          <BasicText size="body-s">Disponibilité</BasicText>
          <select v-model="stockFilter">
            <option value="">Toutes</option>
            <option value="available">En stock</option>
            <option value="unavailable">Rupture</option>
          </select>
        </div>
      </aside>

      <!-- 🛒 Liste scrollable -->
      <section class="catalogue__list">
        <!-- 🚫 Aucun produit trouvé -->
        <div
          v-if="hasLoaded && filteredProducts.length === 0"
          class="catalogue__empty"
        >
          <BasicText>Aucun produit trouvé.</BasicText>
        </div>

        <!-- ✅ Liste -->
        <div
          v-else-if="filteredProducts.length > 0"
          class="catalogue__grid"
        >
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @view="viewProduct"
            @add="addToCart"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ProductCard from '@/features/cart/ProductCart.vue'
  import { useCartStore } from '@/features/cart/useCartStore'
  import { useToastStore } from '@/features/interface/toast/useToastStore'
  import { supabase } from '@/services/supabaseClient'
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  interface Product {
    id: string
    name: string
    category: string
    price: number
    purity: number
    stock: boolean
    image: string
  }

  const cart = useCartStore()
  const toast = useToastStore()
  const router = useRouter()

  const products = ref<Product[]>([])
  const categories = ref<string[]>([])
  const searchTerm = ref('')
  const selectedCategory = ref('')
  const stockFilter = ref('')
  const hasLoaded = ref(false) // ✅ fin du chargement logique

  async function loadProducts() {
    try {
      const { data, error } = await supabase.from('products').select('*')
      if (error) throw error
      if (data) {
        products.value = data
        categories.value = [...new Set(data.map((p: Product) => p.category))]
      }
    } catch (err) {
      console.error('Erreur chargement catalogue:', err)
      toast.showToast('Erreur lors du chargement du catalogue', 'danger')
      products.value = []
    } finally {
      hasLoaded.value = true
    }
  }

  onMounted(async () => {
    await loadProducts()
  })

  const filteredProducts = computed(() => {
    return products.value.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      const matchCategory = !selectedCategory.value || p.category === selectedCategory.value
      const matchStock =
        !stockFilter.value || (stockFilter.value === 'available' ? p.stock : !p.stock)
      return matchSearch && matchCategory && matchStock
    })
  })

  function viewProduct(id: string) {
    router.push(`/catalogue/${id}`)
  }

  function addToCart(product: Product) {
    cart.addToCart(product)
    toast.showToast(`✅ ${product.name} ajouté au panier`, 'success')
  }
</script>

<style scoped lang="less">
  .catalogue {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 60px);
    overflow: hidden;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 32px;
      background: white;
      border-bottom: 1px solid @neutral-200;
      flex-shrink: 0;
    }

    &__body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    &__filters {
      width: 260px;
      background: fade(@secondary-800, 8%);
      border-right: 1px solid fade(@neutral-100, 20%);
      padding: 20px;
      flex-shrink: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;

      select {
        width: 100%;
        padding: 6px 8px;
        border-radius: 6px;
        border: 1px solid @neutral-300;
        background: white;
      }
    }

    &__list {
      flex: 1;
      overflow-y: auto;
      padding: 24px 32px;
      background: @neutral-50;
      display: flex;
      flex-direction: column;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 24px;
    }

    &__empty {
      text-align: center;
      padding: 40px;
    }

    @media (max-width: 900px) {
      &__body {
        flex-direction: column;
      }
      &__filters {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid @neutral-200;
        flex-direction: row;
        flex-wrap: wrap;
      }
      &__list {
        padding: 16px;
      }
    }
  }
</style>
