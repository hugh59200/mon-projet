<template>
  <Transition name="fade-up">
    <div
      class="product-cart"
      @click="$emit('view', product.id)"
    >
      <div
        v-if="product.is_on_sale"
        class="product-cart__badge-promo"
      >
        PROMO
      </div>

      <div class="product-cart__image">
        <img
          :src="product.image || ''"
          :alt="product.name"
          loading="lazy"
        />
      </div>

      <div class="product-cart__info">
        <BasicText
          size="body-l"
          weight="bold"
          color="neutral-800"
          class="truncate-text"
        >
          {{ product.name }}
        </BasicText>

        <BasicText
          size="body-m"
          color="neutral-600"
        >
          {{ product.category }} • Pureté : {{ product.purity }}%
        </BasicText>

        <div class="product-cart__price-wrapper">
          <template v-if="product.is_on_sale && product.sale_price">
            <BasicText
              size="body-m"
              class="product-cart__old-price"
            >
              {{ product.price.toFixed(2) }} €
            </BasicText>
            <BasicText
              size="body-l"
              weight="bold"
              color="warning-600"
            >
              {{ product.sale_price.toFixed(2) }} €
            </BasicText>
          </template>

          <template v-else>
            <BasicText
              size="body-l"
              weight="bold"
              color="primary-800"
            >
              {{ product.price.toFixed(2) }} €
            </BasicText>
          </template>
        </div>
      </div>

      <div class="product-cart__footer">
        <!-- Bouton Ajouter au panier -->
        <BasicButton
          :label="(product.stock ?? 0) > 0 ? 'Ajouter au panier' : 'Rupture'"
          :disabled="(product.stock ?? 0) <= 0"
          :type="(product.stock ?? 0) > 0 ? 'primary' : 'secondary'"
          width="full"
          @click.stop="$emit('add', product)"
        />

        <!-- 🆕 Bouton Acheter (accès direct checkout) -->
        <BasicButton
          v-if="(product.stock ?? 0) > 0"
          label="Acheter"
          type="secondary"
          variant="outlined"
          width="full"
          @click.stop="$emit('buy', product)"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import type { Products } from '@/supabase/types/supabase.types'

  defineProps<{
    product: Products
  }>()

  defineEmits(['view', 'add', 'buy'])
</script>

<style scoped lang="less">
  .product-cart {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 12px;
    position: relative;

    background: color-mix(in srgb, @neutral-200 82%, transparent);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid color-mix(in srgb, @neutral-300 40%, transparent);
    box-shadow:
      0 4px 14px color-mix(in srgb, @neutral-900 6%, transparent),
      inset 0 0 0 1px color-mix(in srgb, @neutral-50 45%, transparent);

    border-radius: 16px;
    padding: 18px;

    transition: all 0.28s ease;
    cursor: pointer;
    user-select: none;
    min-height: 380px; // 🆕 Augmenté pour accueillir le 2ème bouton

    &:hover {
      transform: translateY(-4px);
      box-shadow:
        0 18px 38px fade(#000, 28%),
        0 0 14px rgba(var(--primary-400-rgb), 0.25),
        inset 0 0 0 1px fade(@white, 30%);
      border-color: rgba(var(--primary-400-rgb), 0.3);
    }

    &__badge-promo {
      position: absolute;
      top: 12px;
      left: 12px;
      background: @red-600;
      color: white;
      font-size: 10px;
      font-weight: 800;
      padding: 4px 8px;
      border-radius: 6px;
      z-index: 2;
      box-shadow: 0 2px 8px fade(@red-600, 0.4);
      letter-spacing: 0.5px;
    }

    &__image {
      aspect-ratio: 1/1;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      overflow: hidden;
      border-radius: 12px;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        transition: transform 0.35s ease;
      }

      &:hover img {
        transform: scale(1.06);
      }
    }

    &__info {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .truncate-text {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &__price-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 2px;
      min-height: 28px;
    }

    &__old-price {
      text-decoration: line-through;
      color: @neutral-500;
      font-size: 0.9rem;
    }

    &__footer {
      margin-top: auto;
      padding-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px; // 🆕 Espacement entre les 2 boutons
    }
  }

  .fade-up-enter-active {
    transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .fade-up-leave-active {
    transition: all 0.3s ease;
  }
  .fade-up-enter-from,
  .fade-up-leave-to {
    opacity: 0;
    transform: translateY(12px);
  }
</style>
