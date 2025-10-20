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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    background: white;
    border-radius: 12px;
    border: 1px solid @neutral-200;
    padding: 16px;
    text-align: center;
    transition: all 0.25s ease;
    cursor: pointer;
    height: 100%;
    user-select: none;

    /* ✨ Hover global */
    &:hover {
      transform: translateY(-6px);
      border-color: @primary-300;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
    }

    &__image {
      width: 100%;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      overflow: hidden;

      img {
        max-height: 100%;
        width: auto;
        object-fit: contain;
        border-radius: 8px;
        display: block;
        transition: transform 0.35s ease;
      }

      /* 🪶 Zoom fluide au survol */
      .product-cart:hover & img {
        transform: scale(1.06);
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      flex-grow: 1;
      gap: 4px;
      min-height: 75px;
    }

    &__name {
      color: @neutral-900;
      line-height: 1.3;
      min-height: 22px;
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
