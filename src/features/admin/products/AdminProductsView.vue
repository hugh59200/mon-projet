<template>
  <div class="admin-products">
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher un produit..."
      show-reset
      @reset="reset()"
    >
      <template #actions>
        <PremiumButton
          label="+ Ajouter un produit"
          type="primary"
          size="sm"
          @click="isCreateModalVisible = true"
        />
      </template>
      <template #pagination>
        <BasicPagination
          :current-page="page"
          :nb-pages="nbPages"
          :nb-results="total"
          :nb-pages-max="5"
          :auto-fetch="fetchData"
          size="small"
          @change="page = $event"
        />
      </template>
    </BasicToolbar>

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
            text="Produit"
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
                alt="Miniature"
                class="admin-products__thumb"
              />

              <div class="admin-products__details">
                <div class="admin-products__name-row">
                  <span class="admin-products__name">{{ product.name }}</span>
                  <span
                    v-if="product.dosage"
                    class="admin-products__dosage"
                  >
                    ({{ product.dosage }})
                  </span>
                </div>

                <span
                  v-if="product.is_on_sale"
                  class="admin-products__badge-promo"
                >
                  PROMO
                </span>
              </div>
            </BasicCell>

            <BasicCell :span="8">
              <BasicText size="body-s">{{ product.category || '—' }}</BasicText>
            </BasicCell>

            <BasicCell :span="6">
              <div class="admin-products__price-col">
                <template v-if="product.is_on_sale && product.sale_price">
                  <span class="price-old">
                    {{ formatCurrency(product.price) }}
                  </span>
                  <span class="price-sale">
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
              @click="deleteProduct(product)"
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
  import { useProductActions } from './composables/useProductActions'
  import type { Tables } from '@/supabase/types/supabase'
  import { formatCurrency } from '@/utils'
  import { ref } from 'vue'

  import type { BadgeType } from '@designSystem/components/basic/badge/BasicBadge.types'
  import BasicToolbar from '@/features/admin/shared/components/BasicToolbar.vue'
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
      (p.category?.toLowerCase()?.includes(q) ?? false) ||
      (p.dosage?.toLowerCase()?.includes(q) ?? false),
    persistInUrl: true,
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

  function getProductStockLabel(stock: number | null) {
    if (!stock || stock <= 0) return 'Rupture'
    if (stock < 10) return `Faible (${stock})`
    return `${stock}`
  }

  function getProductStockType(stock: number | null): BadgeType {
    if (!stock || stock <= 0) return 'error'
    if (stock < 10) return 'pending'
    return 'success'
  }
</script>

<style scoped lang="less">
  .admin-products {
    &__item {
      cursor: pointer;
      transition: background 0.15s;
      padding-top: 8px;
      padding-bottom: 8px;

      &:hover {
        background: var(--admin-bg-card-hover, var(--neutral-50));
      }
    }

    &__mobile-card {
      margin: 8px 0;
    }

    &__info {
      display: flex;
      align-items: center;
    }

    &__thumb {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid var(--admin-border-subtle, @neutral-200);
      background: var(--admin-bg-card, @white);
      flex-shrink: 0;
    }

    &__details {
      margin-left: 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__name-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__name {
      font-size: 15px;
      font-weight: 600;
      color: var(--admin-text-primary, @neutral-900);
    }

    &__dosage {
      font-size: 13px;
      font-weight: 400;
      color: var(--admin-text-secondary, @neutral-500);
    }

    &__badge-promo {
      margin-top: 8px;
      width: fit-content;
      background-color: @red-600;
      color: @white;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
    }

    &__price-col {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      height: 100%;

      .price-old {
        font-size: 12px;
        color: var(--admin-text-muted, @neutral-400);
        text-decoration: line-through;
      }

      .price-sale {
        font-weight: 700;
        color: @red-600;
      }
    }
  }
</style>
