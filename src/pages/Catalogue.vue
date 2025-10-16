<template>
  <div class="catalogue">
    <!-- 🔍 HEADER + BARRE DE RECHERCHE -->
    <div class="catalogue__header">
      <BasicText
        size="h3"
        weight="bold"
      >
        Catalogue de peptides
      </BasicText>

      <div class="catalogue__search">
        <BasicInput
          v-model="search"
          placeholder="Rechercher un peptide..."
          input-type="form"
          size="medium"
          icon-left="search"
        />
      </div>
    </div>

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
            <option value="">Toutes</option>
            <option value="performance">Performance</option>
            <option value="récupération">Récupération</option>
            <option value="recherche">Recherche</option>
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

        <div class="catalogue__filter-group">
          <BasicText
            size="body-s"
            weight="bold"
          >
            Trier par
          </BasicText>
          <select v-model="sort">
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>
        </div>
      </aside>

      <!-- 💊 GRILLE PRODUITS -->
      <section class="catalogue__products">
        <div
          v-if="filteredProducts.length === 0"
          class="catalogue__empty"
        >
          <BasicText>Aucun produit ne correspond à la recherche.</BasicText>
        </div>

        <div class="catalogue__grid">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="catalogue__card"
          >
            <div class="catalogue__card-image">
              <img
                :src="product.image"
                :alt="product.name"
                loading="lazy"
              />
            </div>

            <div class="catalogue__card-content">
              <BasicText weight="bold">{{ product.name }}</BasicText>
              <BasicText
                size="body-s"
                color="neutral-500"
              >
                {{ product.category }}
              </BasicText>

              <BasicText
                size="body-s"
                color="neutral-500"
              >
                Pureté : {{ product.purity }}%
              </BasicText>

              <BasicText
                size="body-l"
                weight="bold"
                class="catalogue__price"
              >
                {{ product.price.toFixed(2) }} €
              </BasicText>

              <BasicButton
                :label="product.stock ? 'Ajouter au panier' : 'Rupture'"
                :type="product.stock ? 'primary' : 'secondary'"
                :variant="product.stock ? 'filled' : 'outlined'"
                size="small"
                :disabled="!product.stock"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'

  type Product = {
    id: string
    name: string
    category: string
    price: number
    purity: number
    stock: boolean
    image: string
  }

  const search = ref('')
  const filters = ref({
    category: '',
    stock: '',
  })
  const sort = ref<'asc' | 'desc'>('asc')

  const products = ref<Product[]>([
    {
      id: '1',
      name: 'GHK-Cu Peptide',
      category: 'Performance',
      price: 39.9,
      purity: 99,
      stock: true,
      image: '/images/products/ghkcu.jpg',
    },
    {
      id: '2',
      name: 'BPC-157 Peptide',
      category: 'Récupération',
      price: 34.9,
      purity: 99,
      stock: true,
      image: '/images/products/bpc157.jpg',
    },
    {
      id: '3',
      name: 'CJC-1295 DAC',
      category: 'Performance',
      price: 44.9,
      purity: 98,
      stock: false,
      image: '/images/products/cjc1295.jpg',
    },
    {
      id: '4',
      name: 'Thymosin Beta-4',
      category: 'Récupération',
      price: 32.9,
      purity: 99,
      stock: true,
      image: '/images/products/tb4.jpg',
    },
    {
      id: '5',
      name: 'Epitalon',
      category: 'Recherche',
      price: 36.5,
      purity: 99,
      stock: true,
      image: '/images/products/epitalon.jpg',
    },
  ])

  const filteredProducts = computed(() => {
    let list = products.value

    // 🔍 Filtre recherche
    if (search.value)
      list = list.filter((p) => p.name.toLowerCase().includes(search.value.toLowerCase()))

    // 🎚️ Filtres
    if (filters.value.category)
      list = list.filter((p) => p.category.toLowerCase() === filters.value.category.toLowerCase())
    if (filters.value.stock)
      list = list.filter((p) => (filters.value.stock === 'in' ? p.stock : !p.stock))

    // ↕️ Tri prix
    list = list.sort((a, b) => (sort.value === 'asc' ? a.price - b.price : b.price - a.price))

    return list
  })
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
      gap: 24px;
      background: @neutral-50;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid @neutral-200;
    }

    &__filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

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
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 24px;
    }

    &__card {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      transition: all 0.2s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transform: translateY(-4px);
      }

      &-image {
        width: 100%;
        height: 140px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        overflow: hidden;
        background: @neutral-100;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    &__price {
      color: @primary-700;
      margin-top: 4px;
    }

    &__empty {
      text-align: center;
      padding: 40px;
    }

    @media (max-width: 900px) {
      &__layout {
        flex-direction: column;
      }

      &__filters {
        flex: none;
        width: 100%;
        flex-direction: row;
        justify-content: space-around;
      }
    }
  }
</style>
