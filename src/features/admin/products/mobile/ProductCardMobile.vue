<template>
  <div
    class="mobile-card"
    @click="openProductModal(product.id)"
  >
    <div class="row">
      <div class="info">
        <div class="name-wrapper">
          <BasicText weight="bold">{{ product.name }}</BasicText>
          <span
            v-if="product.is_on_sale"
            class="promo-tag"
          >
            PROMO
          </span>
        </div>
        <BasicText
          size="body-s"
          color="neutral-500"
        >
          {{ product.category || '—' }}
        </BasicText>
      </div>

      <div class="price-column">
        <template v-if="product.is_on_sale && product.sale_price">
          <BasicText
            size="body-s"
            color="neutral-400"
            style="text-decoration: line-through"
          >
            {{ formatCurrency(product.price) }}
          </BasicText>
          <BasicText
            weight="bold"
            color="warning-600"
          >
            {{ formatCurrency(product.sale_price) }}
          </BasicText>
        </template>
        <template v-else>
          <BasicText weight="bold">
            {{ formatCurrency(product.price) }}
          </BasicText>
        </template>
      </div>
    </div>

    <div class="row">
      <BasicText
        size="body-s"
        color="neutral-600"
      >
        Pureté : {{ product.purity ? product.purity + '%' : '—' }}
      </BasicText>

      <BasicBadge
        :label="getProductStockLabel(product.stock)"
        :type="getProductStockType(product.stock)"
        size="small"
      />
    </div>

    <div
      class="actions"
      @click.stop
    >
      <BasicIconNext
        name="Trash2"
        :size="18"
        color="danger-600"
        pointer
        @click="handleDelete(product)"
        class="action-icon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Tables } from '@/supabase/types/supabase'
  // On importe BadgeType pour le typage de la fonction locale
  import type { BadgeType } from '@designSystem/components/basic/badge/BasicBadge.types'

  defineProps<{
    product: Tables<'products'>
    formatCurrency: (v: number | null) => string
    openProductModal: (id: string) => void
    handleDelete: (p: any) => void
  }>()

  // --- Helpers Locaux pour l'affichage mobile ---
  function getProductStockLabel(stock: number | null) {
    if (!stock || stock <= 0) return 'Rupture'
    if (stock < 10) return `Faible (${stock})`
    return `Stock: ${stock}`
  }

  function getProductStockType(stock: number | null): BadgeType {
    if (!stock || stock <= 0) return 'error'
    if (stock < 10) return 'pending' // Orange
    return 'success'
  }
</script>

<style scoped lang="less">
  .mobile-card {
    background: @white;
    border: 1px solid @neutral-200;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
    display: flex;
    flex-direction: column;
    gap: 12px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: @neutral-50;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }
    &:active {
      transform: scale(0.98);
    }
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .name-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .promo-tag {
    font-size: 10px;
    font-weight: 800;
    color: @white;
    background: @red-600;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .price-column {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.2;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 8px;
    border-top: 1px dashed @neutral-200;
  }

  .action-icon {
    opacity: 0.7;
    transition: all 0.2s ease;

    &:hover {
      opacity: 1;
      transform: scale(1.15);
    }
  }
</style>
