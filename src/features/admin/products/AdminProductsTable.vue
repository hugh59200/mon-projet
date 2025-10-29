<template>
  <div>
    <!-- 🔍 Toolbar -->
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher un produit..."
      show-reset
      show-role
      @reset="reset()"
    >
      <template
        v-if="!readonly"
        #actions
      >
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
        <!-- 🧱 HEADER -->
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
          <BasicCell
            v-if="!readonly"
            center
            :span="6"
            text="Actions"
          />
        </div>

        <!-- 🧩 LIGNES -->
        <div
          v-for="product in filteredData"
          :key="product.id"
          class="gridElemWrapper"
        >
          <div class="cardLayoutWrapper product-row">
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
              </div>
            </BasicCell>

            <!-- 🧰 Actions -->
            <BasicCell
              v-if="!readonly"
              center
              :span="6"
            >
              <div class="actions">
                <BasicIconNext
                  name="Eye"
                  tooltip="Voir le produit"
                  class="action-icon"
                  @click="openProductModal(product.id)"
                />
                <BasicIconNext
                  name="Trash2"
                  tooltip="Supprimer"
                  class="action-icon action-icon--delete"
                  @click="handleDelete(product)"
                />
              </div>
            </BasicCell>
          </div>
        </div>
      </div>

      <!-- 📱 VERSION MOBILE -->
      <div class="mobile-cards-list">
        <component
          :is="readonly ? ProductCardMobileReadonly : ProductCardMobile"
          v-for="product in filteredData"
          :key="product.id"
          :product="product"
          :format-currency="formatCurrency"
          :open-product-modal="openProductModal"
          v-bind="!readonly ? { editProduct: openEditProduct, handleDelete } : {}"
        />
      </div>
    </WrapperLoader>

    <!-- 🪟 MODALES -->
    <teleport to="#app">
      <!-- ➕ Création -->
      <AdminProductModal
        v-if="!readonly"
        v-model="isCreateModalVisible"
        @saved="fetchData"
      />

      <!-- 🔍 Lecture / Édition -->
      <AdminProductModal
        v-if="selectedProductId"
        v-model="isModalVisible"
        :product-id="selectedProductId"
        :readonly="readonly"
        @saved="fetchData"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
  import { useAdminTable } from '@/features/admin/shared/useAdminTable'
  import { deleteProduct } from '@/supabase/api/products'
  import type { Tables } from '@/supabase/types/supabase'
  import { formatCurrency } from '@/utils/index'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { ref } from 'vue'
  import BasicToolbar from '../BasicToolbar.vue'
  import ProductCardMobile from './mobile/ProductCardMobile.vue'
  import AdminProductModal from './modale/AdminProductModal.vue'
  import ProductCardMobileReadonly from './readonly/ProductCardMobileReadonly.vue'

  type ProductRow = Tables<'products'>

  const props = defineProps<{ readonly?: boolean }>()

  const toast = useToastStore()

  const { filteredData, total, nbPages, page, search, loading, hasLoaded, fetchData, reset } =
    useAdminTable<'products'>({
      table: 'products',
      orderBy: 'created_at',
      ascending: false,
      searchFn: (p, q) =>
        (p.name?.toLowerCase()?.includes(q) ?? false) ||
        (p.category?.toLowerCase()?.includes(q) ?? false),
    })

  async function handleDelete(product: ProductRow) {
    if (props.readonly) return
    if (!confirm(`Supprimer ${product.name} ?`)) return
    try {
      await deleteProduct(product.id)
      toast.show('Produit supprimé ✅', 'success')
      fetchData()
    } catch (err: any) {
      toast.show(`Erreur : ${(err as Error).message}`, 'danger')
    }
  }

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
</script>

<style scoped lang="less">
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
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
  }

  .product-row {
    align-items: center;
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

  .actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px; /* ⬆️ augmenté de 8px → 16px pour plus d’espace */
    padding: 2px 0; /* un léger padding vertical pour équilibrer */

    .action-icon {
      cursor: pointer;
      font-size: 16px;
      width: 20x;
      height: 20px;
      transition:
        opacity 0.2s,
        transform 0.15s;
      &:hover {
        opacity: 0.7;
        transform: scale(1.1);
      }

      &--delete {
        color: @danger-600;
      }
    }
  }

  /* 🌍 Desktop par défaut */
  .products--desktop {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  /* 📱 Mobile caché par défaut */
  .mobile-cards-list {
    display: none;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  /* ✅ Activation mobile */
  @media screen and (max-width: 1024px) {
    .products--desktop {
      display: none !important;
    }
    .mobile-cards-list {
      display: flex !important;
    }
  }
</style>
