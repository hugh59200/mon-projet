<template>
  <Transition name="fade-up">
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
      <div class="product-cart__footer">
        <BasicButton
          :label="product.stock ? 'Ajouter au panier' : 'Rupture'"
          :disabled="!product.stock"
          :type="product.stock ? 'primary' : 'secondary'"
          size="small"
          class="product-cart__button"
          @click.stop="$emit('add', product)"
        />
      </div>
    </div>
  </Transition>
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
  /* 🧩 Carte Produit */
  .product-cart {
    padding: 12px;
    border-radius: 10px;
    border: 1px solid fade(@neutral-200, 70%);
    transition: all 0.25s ease;
    background: #fff;
    cursor: pointer;
    height: 100%;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    &__image {
      height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      img {
        max-height: 100%;
        object-fit: contain;
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    &__name {
      font-weight: 600;
      font-size: 1rem;
      color: @neutral-900;
    }

    &__meta {
      color: @neutral-500;
      font-size: 0.85rem;
    }

    &__price {
      color: @primary-700;
      margin-top: 2px;
    }

    &__footer {
      margin-top: 6px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding-top: 2px;
    }

    &__button {
      width: 100%;
    }
  }

  /* ✨ Animation d'apparition fluide */
  .fade-up-enter-active {
    transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .fade-up-leave-active {
    transition: all 0.25s ease;
  }
  .fade-up-enter-from,
  .fade-up-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
</style>
