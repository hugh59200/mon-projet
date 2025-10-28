<template>
  <!-- 🔍 Toolbar avec recherche + reset + ajout -->
  <BasicToolbar
    v-model:search="search"
    :search-placeholder="'Rechercher un produit...'"
    :show-reset="true"
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
          :span="12"
          text="Nom"
          icon-name="ArrowUpDown"
          :is-active="sortKey === 'name'"
          :icon-color="getSortColor('name')"
          :on-icon-click="() => toggleSort('name')"
        />
        <BasicCell
          center
          :span="8"
          text="Catégorie"
          icon-name="ArrowUpDown"
          :is-active="sortKey === 'category'"
          :icon-color="getSortColor('category')"
          :on-icon-click="() => toggleSort('category')"
        />
        <BasicCell
          center
          :span="4"
          text="Prix (€)"
          icon-name="ArrowUpDown"
          :is-active="sortKey === 'price'"
          :icon-color="getSortColor('price')"
          :on-icon-click="() => toggleSort('price')"
        />
        <BasicCell
          center
          :span="4"
          text="Stock"
          icon-name="ArrowUpDown"
          :is-active="sortKey === 'stock'"
          :icon-color="getSortColor('stock')"
          :on-icon-click="() => toggleSort('stock')"
        />
        <BasicCell
          center
          :span="8"
          text="Actions"
        />
      </div>

      <div
        v-for="product in filteredData"
        :key="product.id"
        class="gridElemWrapper"
      >
        <div class="cardLayoutWrapper">
          <BasicCell :span="12">{{ product.name }}</BasicCell>
          <BasicCell
            center
            :span="8"
          >
            {{ product.category }}
          </BasicCell>
          <BasicCell
            center
            :span="4"
          >
            {{ formatCurrency(product.price) }}
          </BasicCell>
          <BasicCell
            center
            :span="4"
          >
            <span :class="product.stock ? 'in-stock' : 'out-stock'">
              {{ product.stock ? 'En stock' : 'Rupture' }}
            </span>
          </BasicCell>

          <BasicCellActionIcon
            icon-name="eye"
            tooltip="Voir le produit"
            center
            :span="4"
            @click="openProductModal(product.id)"
          />
          <BasicCellActionIcon
            icon-name="trash"
            tooltip="Supprimer"
            center
            :span="4"
            @click="handleDelete(product)"
          />
        </div>
      </div>
    </div>
  </WrapperLoader>

  <!-- 🪟 MODALS -->
  <teleport to="#app">
    <!-- ➕ Création -->
    <AdminProductModal
      v-model="isCreateModalVisible"
      @saved="fetchData"
    />

    <AdminProductModal
      v-model="isModalVisible"
      :product-id="selectedProductId"
      :readonly="false"
    />
  </teleport>
</template>

<script setup lang="ts">
  import { useAdminTable } from '@/features/admin/composables/useAdminTable'
  import { useSortableTable } from '@/features/admin/composables/useSortableTable'
  import { deleteProduct } from '@/supabase/api/products'
  import type { Tables } from '@/supabase/types/supabase'
  import { formatCurrency } from '@/utils/index'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { ref } from 'vue'
  import BasicToolbar from '../BasicToolbar.vue'
  import AdminProductModal from './AdminProductModal.vue'

  type ProductRow = Tables<'products'>
  const toast = useToastStore()

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

  const { toggleSort, getSortColor } = useSortableTable(sortKey, sortAsc)

  // 🗑 Suppression produit
  async function handleDelete(product: ProductRow) {
    if (!confirm(`Supprimer ${product.name} ?`)) return
    try {
      await deleteProduct(product.id)
      toast.show('Produit supprimé ✅', 'success')
      fetchData()
    } catch (err: any) {
      toast.show(`Erreur : ${(err as Error).message}`, 'danger')
    }
  }

  // 🪟 Modals
  const isModalVisible = ref(false)
  const selectedProductId = ref<string | null>(null)
  const isCreateModalVisible = ref(false)

  function openProductModal(id: string) {
    selectedProductId.value = id
    isModalVisible.value = true
  }
</script>

<style scoped lang="less">
  .in-stock {
    color: @success-600;
    font-weight: 600;
  }
  .out-stock {
    color: @danger-600;
    font-weight: 600;
  }
</style>
