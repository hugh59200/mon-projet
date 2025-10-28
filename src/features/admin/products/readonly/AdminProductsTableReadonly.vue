<template>
  <!-- 🔍 Toolbar -->
  <BasicToolbar
    v-model:search="search"
    search-placeholder="Rechercher un produit..."
    :show-reset="true"
    @reset="reset()"
  />

  <!-- 📄 Pagination -->
  <BasicPagination
    :current-page="page"
    :nb-pages="nbPages"
    :nb-results="total"
    :nb-pages-max="5"
    :auto-fetch="fetchData"
    @change="page = $event"
  />

  <!-- 💾 Tableau principal -->
  <WrapperLoader
    :loading="loading"
    :has-loaded="hasLoaded"
    :is-empty="hasLoaded && filteredData.length === 0"
    message="Chargement des produits..."
    empty-message="Aucun produit trouvé 😅"
  >
    <!-- 💻 TABLEAU DESKTOP -->
    <div class="products--desktop">
      <div class="cardLayoutWrapper cardLayoutWrapper--header">
        <BasicCell
          :span="10"
          text="Nom"
        />
        <BasicCell
          center
          :span="8"
          text="Catégorie"
        />
        <BasicCell
          center
          :span="4"
          text="Prix (€)"
        />
        <BasicCell
          center
          :span="4"
          text="Pureté (%)"
        />
        <BasicCell
          center
          :span="4"
          text="Stock"
        />
      </div>

      <div
        v-for="product in filteredData"
        :key="product.id"
        class="gridElemWrapper"
      >
        <div class="cardLayoutWrapper">
          <!-- 🧱 Nom + Image -->
          <BasicCell :span="10">
            <div class="product-name-cell">
              <img
                v-if="product.image"
                :src="product.image"
                alt="Image"
                class="product-thumb"
              />
              <span>{{ product.name || '—' }}</span>
            </div>
          </BasicCell>

          <!-- 🏷️ Catégorie -->
          <BasicCell
            center
            :span="8"
          >
            {{ product.category || '—' }}
          </BasicCell>

          <!-- 💰 Prix -->
          <BasicCell
            center
            :span="4"
          >
            {{ formatCurrency(product.price) }}
          </BasicCell>

          <!-- ⚗️ Pureté -->
          <BasicCell
            center
            :span="4"
          >
            {{ product.purity ? product.purity + '%' : '—' }}
          </BasicCell>

          <!-- 📦 Stock -->
          <BasicCell
            center
            :span="4"
          >
            <div
              class="stock-status"
              :class="product.stock ? 'stock-status--in' : 'stock-status--out'"
            >
              <BasicIconNext
                :name="product.stock ? 'CheckCircle' : 'XCircle'"
                :color="product.stock ? 'success-600' : 'danger-600'"
              />
              <span>{{ product.stock ? 'En stock' : 'Rupture' }}</span>
            </div>
          </BasicCell>
        </div>
      </div>
    </div>

    <!-- 📱 VERSION MOBILE -->
    <div class="mobile-cards-list">
      <ProductCardMobileReadonly
        v-for="product in filteredData"
        :key="product.id"
        :product="product"
        :format-currency="formatCurrency"
        :open-product-modal="openProductModal"
      />
    </div>
  </WrapperLoader>

  <!-- 🪟 MODALE -->
  <teleport to="#app">
    <AdminProductModal
      v-if="selectedProductId"
      v-model="isModalVisible"
      :product-id="selectedProductId"
      :readonly="true"
    />
  </teleport>
</template>

<script setup lang="ts">
  import { useAdminTable } from '@/features/admin/composables/useAdminTable'
  import { formatCurrency } from '@/utils/index'
  import { ref } from 'vue'
  import BasicToolbar from '../../BasicToolbar.vue'
  import AdminProductModal from '../modale/AdminProductModal.vue'
  import ProductCardMobileReadonly from './ProductCardMobileReadonly.vue'

  const { filteredData, total, nbPages, page, search, loading, hasLoaded, fetchData, reset } =
    useAdminTable<'products'>({
      table: 'products',
      orderBy: 'created_at',
      ascending: false,
      searchFn: (p, q) =>
        (p.name?.toLowerCase()?.includes(q) ?? false) ||
        (p.category?.toLowerCase()?.includes(q) ?? false),
    })

  /* 🪟 Modal lecture seule */
  const isModalVisible = ref(false)
  const selectedProductId = ref<string | null>(null)

  function openProductModal(id: string) {
    selectedProductId.value = id
    isModalVisible.value = true
  }
</script>

<style scoped lang="less">
  .product-name-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    .product-thumb {
      width: 32px;
      height: 32px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid @neutral-200;
    }
  }

  .stock-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;

    &--in {
      color: @success-600;
    }

    &--out {
      color: @danger-600;
    }
  }

  .mobile-cards-list {
    display: none;
  }

  @media (max-width: 1000px) {
    .products--desktop {
      display: none;
    }

    .mobile-cards-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
</style>
