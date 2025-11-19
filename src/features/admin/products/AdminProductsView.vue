<template>
  <div class="admin-products">
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher un produit..."
      show-reset
      show-role
      @reset="reset()"
    >
      <template #actions>
        <BasicButton
          label="+ Ajouter un produit"
          type="primary"
          size="small"
          @click="isCreateModalVisible = true"
        />
      </template>
    </BasicToolbar>
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
        <div class="cardLayoutWrapper cardLayoutWrapper--header admin-products__header">
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
          class="gridElemWrapper admin-products__row"
        >
          <div
            class="cardLayoutWrapper admin-products__item"
            @click="openProductModal(product.id)"
          >
            <BasicCell
              :span="12"
              class="admin-products__info"
            >
              <img
                v-if="product.image"
                :src="product.image"
                alt="Image du produit"
                class="admin-products__thumb"
              />
              <div class="flex flex-col">
                <span class="admin-products__name">{{ product.name || '—' }}</span>
                <span
                  v-if="product.is_on_sale"
                  class="text-xs font-bold text-red-600"
                >
                  PROMO
                </span>
              </div>
            </BasicCell>
            <BasicCell :span="8">
              <BasicText>{{ product.category || '—' }}</BasicText>
            </BasicCell>

            <BasicCell :span="6">
              <div class="flex flex-col items-start">
                <template v-if="product.is_on_sale && product.sale_price">
                  <span class="text-xs text-neutral-400 line-through">
                    {{ formatCurrency(product.price) }}
                  </span>
                  <span class="font-bold text-red-600">
                    {{ formatCurrency(product.sale_price) }}
                  </span>
                </template>
                <template v-else>
                  <span>{{ formatCurrency(product.price) }}</span>
                </template>
              </div>
            </BasicCell>

            <BasicCell :span="6">
              <BasicBadge
                :label="getProductStockLabel(product.stock)"
                :type="getProductStockType(product.stock)"
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
          :edit-product="openEditProduct"
          :handle-delete="deleteProduct"
          class="gridElemWrapper admin-products__mobile-card"
        />
      </template>
    </WrapperLoader>

    <teleport to="#app">
      <AdminProductModal
        v-model="isCreateModalVisible"
        @saved="fetchData"
      />

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
  import { formatCurrency } from '@/utils'
  import { ref } from 'vue'

  import type { BadgeType } from '@designSystem/components/basic/badge'
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
  const isCreateModalVisible = ref(false)

  function openProductModal(id: string) {
    selectedProductId.value = id
    isModalVisible.value = true
  }

  function openEditProduct(id: string) {
    selectedProductId.value = id
    isModalVisible.value = true
  }

  // --- Helpers Affichage Stock V2 ---
  function getProductStockLabel(stock: number | null) {
    if (!stock || stock <= 0) return 'Rupture'
    if (stock < 10) return `Faible (${stock})`
    return `En stock (${stock})`
  }

  // ✅ CORRECTION ICI : Retourner un type accepté par BadgeType
  function getProductStockType(stock: number | null): BadgeType {
    if (!stock || stock <= 0) return 'error' // Rouge
    if (stock < 10) return 'pending' // Orange (remplace 'warning')
    return 'success' // Vert
  }
</script>

<style scoped lang="less">
  .admin-products {
    &__item {
      cursor: pointer;

      &:hover {
        background: var(--primary-0);
      }
    }

    &__mobile-card {
      margin: 4px 0;
    }

    &__info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &__thumb {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid @neutral-200;
    }

    &__name {
      font-weight: 500;
    }
  }
</style>
