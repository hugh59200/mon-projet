<template>
  <div>
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher un produit..."
      :show-reset="true"
      @reset="reset()"
    />
    <BasicPagination
      :current-page="page"
      :nb-pages="nbPages"
      :nb-results="total"
      :nb-pages-max="5"
      :auto-fetch="fetchData"
      @change="page = $event"
    />

    <WrapperLoader
      :loading="loading"
      :has-loaded="hasLoaded"
      :is-empty="hasLoaded && filteredData.length === 0"
      message="Chargement des produits..."
      empty-message="Aucun produit trouvé 😅"
    >
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
            :span="6"
            text="Stock"
          />
        </div>
        <div
          v-for="product in filteredData"
          :key="product.id"
          class="gridElemWrapper"
        >
          <div
            class="cardLayoutWrapper product-row"
            @click="openProductModal(product.id)"
          >
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
            <BasicCell
              center
              :span="8"
            >
              <BasicText>{{ product.category || '—' }}</BasicText>
            </BasicCell>
            <BasicCell
              center
              :span="4"
            >
              <BasicText>{{ formatCurrency(product.price) }}</BasicText>
            </BasicCell>
            <BasicCell
              center
              :span="4"
            >
              <BasicText>{{ product.purity ? product.purity + '%' : '—' }}</BasicText>
            </BasicCell>
            <BasicCell
              center
              :span="6"
            >
              <BasicBadge
                :label="getLabelBadge(product.stock)"
                :type="getTypeBadge(product.stock)"
                size="small"
              />
            </BasicCell>
            <BasicCellActionIcon
              icon-name="trash"
              tooltip="Supprimer"
              center
              danger
              :span="3"
              @click.stop="deleteProduct(product)"
            />
          </div>
        </div>
      </div>
      <div class="mobile-cards-list">
        <ProductCardMobile
          v-for="product in filteredData"
          :key="product.id"
          :product="product"
          :format-currency="formatCurrency"
          :open-product-modal="openProductModal"
          :handle-delete="deleteProduct"
          class="gridElemWrapper"
        />
      </div>
    </WrapperLoader>
    <teleport to="#app">
      <AdminProductModal
        v-if="selectedProductId"
        v-model="isModalVisible"
        :product-id="selectedProductId"
        @saved="fetchData"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
  import { useAdminTable } from '@/features/admin/shared/composables/useAdminTable'
  import { useProductActions } from '@/supabase/actions/useProductActions'
  import { formatCurrency, getLabelBadge, getTypeBadge } from '@/utils'
  import { ref } from 'vue'
  import BasicToolbar from '../shared/components/BasicToolbar.vue'
  import ProductCardMobile from './mobile/ProductCardMobile.vue'
  import AdminProductModal from './modale/AdminProductModal.vue'

  const { filteredData, total, nbPages, page, search, loading, hasLoaded, fetchData, reset } =
    useAdminTable<'products'>({
      table: 'products',
      orderBy: 'created_at',
      ascending: false,
      searchFn: (p, q) =>
        (p.name?.toLowerCase()?.includes(q) ?? false) ||
        (p.category?.toLowerCase()?.includes(q) ?? false),
    })

  const { deleteProduct } = useProductActions(fetchData)

  const isModalVisible = ref(false)
  const selectedProductId = ref<string | null>(null)

  function openProductModal(id: string) {
    selectedProductId.value = id
    isModalVisible.value = true
  }
</script>

<style scoped lang="less">
  .product-row {
    cursor: pointer;
    transition:
      background 0.15s ease,
      transform 0.1s ease;
    &:hover {
      background: @neutral-100;
    }
    &:active {
      transform: scale(0.995);
    }
  }

  .product-name-cell {
    display: flex;
    align-items: center;
    gap: 10px;

    .product-thumb {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid @neutral-200;
    }
  }

  .products--desktop {
    display: flex;
    flex-direction: column;
  }

  .mobile-cards-list {
    display: none;
  }

  @media (max-width: 1024px) {
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
