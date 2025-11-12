<template>
  <div>
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher un produit..."
      show-reset
      @reset="reset"
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
      <template v-if="isDesktop || isTablet">
        <div class="cardLayoutWrapper cardLayoutWrapper--header">
          <BasicCell
            :span="12"
            text="Nom"
            :is-active="sortKey === 'name'"
            :icon-color="getSortColor('name')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('name')"
          />
          <BasicCell
            :span="8"
            text="Catégorie"
            :is-active="sortKey === 'category'"
            :icon-color="getSortColor('category')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('category')"
          />
          <BasicCell
            :span="6"
            text="Prix (€)"
            :is-active="sortKey === 'price'"
            :icon-color="getSortColor('price')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('price')"
          />
          <BasicCell
            :span="6"
            text="Stock"
            :is-active="sortKey === 'stock'"
            :icon-color="getSortColor('stock')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('stock')"
          />
          <BasicCell :span="4" />
        </div>
        <div
          v-for="product in filteredData"
          :key="product.id"
          class="gridElemWrapper"
        >
          <div
            class="cardLayoutWrapper list"
            @click="openProductModal(product.id)"
          >
            <BasicCell
              :span="12"
              class="list__product-info"
            >
              <img
                v-if="product.image"
                :src="product.image"
                alt="Image du produit"
                class="list__product-thumb"
              />
              <span>{{ product.name || '—' }}</span>
            </BasicCell>
            <BasicCell :span="8">
              <BasicText>{{ product.category || '—' }}</BasicText>
            </BasicCell>
            <BasicCell
              :text="formatCurrency(product.price)"
              :span="6"
            />
            <BasicCell :span="6">
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
              :span="4"
              @click.stop="deleteProduct(product)"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <ProductCardMobile
          v-for="product in filteredData"
          :key="product.id"
          :product="product"
          :format-currency="formatCurrency"
          :open-product-modal="openProductModal"
          :handle-delete="deleteProduct"
          class="gridElemWrapper list list--mobile"
        />
      </template>
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
  import { useSortableTable } from '@/features/admin/shared/composables/useSortableTable'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { useProductActions } from '@/supabase/actions/useProductActions'
  import type { Tables } from '@/supabase/types/supabase'
  import { formatCurrency, getLabelBadge, getTypeBadge } from '@/utils'
  import { ref } from 'vue'

  import BasicToolbar from '../shared/components/BasicToolbar.vue'
  import ProductCardMobile from './mobile/ProductCardMobile.vue'
  import AdminProductModal from './modale/AdminProductModal.vue'

  const {
    filteredData,
    total,
    nbPages,
    page,
    search,
    sortKey,
    sortAsc,
    loading,
    hasLoaded,
    fetchData,
    reset,
  } = useAdminTable<'products'>({
    table: 'products',
    orderBy: 'created_at',
    ascending: false,
    searchFn: (p, q) =>
      (p.name?.toLowerCase()?.includes(q) ?? false) ||
      (p.category?.toLowerCase()?.includes(q) ?? false),
  })

  const { isTablet, isDesktop } = useDeviceBreakpoint()
  const { deleteProduct } = useProductActions(fetchData)

  const { toggleSort, getSortColor } = useSortableTable<Tables<'products'>>(
    sortKey,
    sortAsc,
    filteredData,
  )

  const isModalVisible = ref(false)
  const selectedProductId = ref<string | null>(null)

  function openProductModal(id: string) {
    selectedProductId.value = id
    isModalVisible.value = true
  }
</script>

<style scoped lang="less">
  @import '../shared/style/list-base.less';

  .list {
    &__product-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &__product-thumb {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid @neutral-200;
    }
  }
</style>
