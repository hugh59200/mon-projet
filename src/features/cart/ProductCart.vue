<template>
  <div
    class="product-cart"
    @click="$emit('view', product.id)"
  >
    <!-- 🧴 Image produit -->
    <div class="product-cart__image">
      <img
        :src="product.image"
        :alt="product.name"
        loading="lazy"
      />
    </div>

    <!-- 🧾 Infos -->
    <div class="product-cart__info">
      <BasicText
        size="body-l"
        weight="bold"
        class="product-cart__name"
      >
        {{ product.name }}
      </BasicText>

      <BasicText
        size="body-s"
        color="neutral-500"
        class="product-cart__meta"
      >
        {{ product.category }} • Pureté : {{ product.purity }}%
      </BasicText>

      <BasicText
        size="body-l"
        weight="bold"
        class="product-cart__price"
      >
        {{ product.price.toFixed(2) }} €
      </BasicText>
    </div>

    <!-- 🛒 Bouton -->
    <BasicButton
      :label="product.stock ? 'Ajouter au panier' : 'Rupture'"
      :disabled="!product.stock"
      :type="product.stock ? 'primary' : 'secondary'"
      size="small"
      class="product-cart__button"
      @click.stop="$emit('add', product)"
    />
  </div>
</template>

<script setup lang="ts">
  defineProps({
    product: {
      type: Object,
      required: true,
    },
  })
</script>

<style scoped lang="less">
  .product-cart {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: white;
    border-radius: 12px;
    border: 1px solid @neutral-200;
    padding: 16px;
    text-align: center;
    transition: all 0.25s ease;
    cursor: pointer;
    height: 100%;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    &__image {
      width: 100%;
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 8px;
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex-grow: 1;
    }

    &__name {
      color: @neutral-900;
    }

    &__meta {
      color: @neutral-500;
    }

    &__price {
      color: @primary-700;
      margin-top: 4px;
    }

    &__button {
      margin-top: 12px;
    }
  }
</style>
