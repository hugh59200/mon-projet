<template>
  <MobileCard hoverable>
    <!-- 🏷️ Titre -->
    <template #title>
      <div class="product-header">
        <div class="product-info">
          <div class="product-name">{{ product.name || 'Produit sans nom' }}</div>
          <div class="product-category">{{ product.category || '—' }}</div>
        </div>
        <div class="product-price">
          {{ formatCurrency(product.price) }}
        </div>
      </div>
    </template>

    <!-- 🖼️ Image -->
    <template #badge>
      <div
        v-if="product.image"
        class="image-thumb"
      >
        <img
          :src="product.image"
          alt="Produit"
        />
      </div>
    </template>

    <!-- ℹ️ Infos supplémentaires -->
    <template #info>
      <div class="line">
        <span class="label">Pureté :</span>
        <span class="value">{{ product.purity ? product.purity + '%' : '—' }}</span>
      </div>
      <div class="line">
        <span class="label">Stock :</span>
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
      </div>
    </template>

    <!-- ⚙️ Actions -->
    <template #actions>
      <BasicButton
        label="Voir"
        type="secondary"
        size="small"
        variant="outlined"
        block
        @click="openProductModal(product.id)"
      />
      <BasicButton
        label="Éditer"
        type="primary"
        size="small"
        variant="outlined"
        block
        @click="editProduct(product.id)"
      />
      <BasicButton
        label="Supprimer"
        type="danger"
        size="small"
        variant="outlined"
        block
        @click="handleDelete(product)"
      />
    </template>
  </MobileCard>
</template>

<script setup lang="ts">
  import type { Tables } from '@/supabase/types/supabase'
  import MobileCard from '../../mobile/MobileCard.vue'

  type ProductRow = Tables<'products'>

  defineProps<{
    product: ProductRow
    formatCurrency: (a: number | null) => string
    openProductModal: (id: string) => void
    editProduct: (id: string) => void
    handleDelete: (p: ProductRow) => void
  }>()
</script>

<style scoped lang="less">
  .product-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  .product-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .product-name {
    font-weight: 600;
    color: @primary-950;
    font-size: @font-size-body-l;
  }

  .product-category {
    font-size: @font-size-body-m;
    color: @neutral-500;
  }

  .product-price {
    font-weight: 600;
    color: @primary-700;
    white-space: nowrap;
  }

  .image-thumb {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid @neutral-200;
    background: @neutral-100;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 0;

    .label {
      color: @neutral-500;
    }
    .value {
      color: @primary-900;
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
</style>
