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
          size="h5"
          weight="bold"
        >
          Filtres
        </BasicText>

        <!-- ✅ Catégorie : multiselect -->
        <div class="catalogue__filter">
          <BasicText>Catégorie</BasicText>
          <BasicDropdownMultiple
            v-model="selectedCategory"
            :items="categoryItems"
            placeholder="Toutes les catégories"
            searchable
            deletable
            size="medium"
          />
        </div>

        <!-- ✅ Disponibilité : dropdown simple -->
        <div class="catalogue__filter">
          <BasicText>Disponibilité</BasicText>
          <BasicDropdown
            v-model="stockFilter"
            :items="stockItems"
            placeholder="Toutes les disponibilités"
            size="medium"
            deletable
          />
        </div>
      </aside>

      <!-- 🛒 Liste scrollable -->
      <section class="catalogue__list">
        <div
          v-if="hasLoaded && filteredProducts.length === 0"
          class="catalogue__empty"
        >
          <BasicText>Aucun produit trouvé.</BasicText>
        </div>

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
  import { supabase } from '@/supabase/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  interface Product {
    id: string
    name: string
    category: string
    price: number
    purity: number | null
    stock: boolean | null
    image: string | null
  }

  const cart = useCartStore()
  const toast = useToastStore()
  const router = useRouter()

  const products = ref<Product[]>([])
  const categories = ref<string[]>([])
  const searchTerm = ref('')
  const selectedCategory = ref<string[]>([]) // 🔹 multiple
  const stockFilter = ref<string | undefined>(undefined) // 🔹 simple
  const hasLoaded = ref(false)

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
      toast.show('Erreur lors du chargement du catalogue', 'danger')
      products.value = []
    } finally {
      hasLoaded.value = true
    }
  }

  onMounted(async () => {
    await loadProducts()
  })

  /* 🔹 Dropdown items */
  const categoryItems = computed(() =>
    categories.value.map((cat) => ({
      id: cat,
      label: cat,
    })),
  )

  const stockItems = [
    { id: 'available', label: 'En stock' },
    { id: 'unavailable', label: 'Rupture' },
  ]

  /* 🔹 Filtrage des produits */
  const filteredProducts = computed(() => {
    return products.value.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.value.toLowerCase())

      const matchCategory =
        selectedCategory.value.length === 0 || selectedCategory.value.includes(p.category)

      const matchStock =
        !stockFilter.value || (stockFilter.value === 'available' ? p.stock : !p.stock)

      return matchSearch && matchCategory && matchStock
    })
  })

  function viewProduct(id: string) {
    router.push(`/catalogue/${id}`)
  }

  function addToCart(product: Product) {
    cart.addToCart({
      ...product,
      stock: product.stock ?? false,
      image: product.image ?? '',
    })
    toast.show(`✅ ${product.name} ajouté au panier`, 'success')
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
      padding: 20px 40px;
      background: white;
      border-bottom: 1px solid fade(@neutral-200, 70%);
      flex-shrink: 0;
      box-shadow: 0 2px 8px fade(@neutral-900, 6%);
    }

    &__body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    &__filters {
      width: 260px;
      background: fade(@secondary-800, 6%);
      border-right: 1px solid fade(@neutral-100, 25%);
      padding: 24px 20px;
      flex-shrink: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    &__list {
      flex: 1;
      overflow-y: auto;
      padding: 40px 60px;
      background: linear-gradient(to bottom, @neutral-50, @neutral-100);
      display: flex;
      flex-direction: column;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 56px 44px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 1px;
        background: fade(@neutral-300, 25%);
        pointer-events: none;
        transform: translateX(-50%);
      }
    }

    &__empty {
      text-align: center;
      padding: 60px;
      color: fade(@neutral-700, 80%);
    }

    @media (max-width: 1200px) {
      &__grid {
        gap: 48px 32px;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        &::before {
          display: none;
        }
      }
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
        background: white;
        padding: 16px;
        gap: 12px;
      }

      &__list {
        padding: 20px;
      }

      &__grid {
        gap: 32px 20px;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }
    }
  }
</style>
