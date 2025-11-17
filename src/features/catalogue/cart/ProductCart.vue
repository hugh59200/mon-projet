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
  /* ============================================================
   🧴 PRODUCT CARD — Neural Glass v3
   ============================================================ */

  .product-cart {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 12px;

    background: fade(@white, 18%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    border-radius: 16px;
    padding: 18px;

    border: 1px solid fade(@neutral-300, 32%);
    box-shadow:
      0 12px 26px fade(#000, 20%),
      inset 0 0 0 1px fade(@white, 25%);

    transition: all 0.28s ease;
    cursor: pointer;
    user-select: none;
    min-height: 340px;

    &:hover {
      transform: translateY(-4px);
      background: fade(@white, 26%);
      box-shadow:
        0 18px 38px fade(#000, 28%),
        0 0 14px fade(@primary-400, 25%),
        inset 0 0 0 1px fade(@white, 30%);
      border-color: fade(@primary-400, 30%);
    }

    /* ============================================================
     IMAGE
     ============================================================ */
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

    /* ============================================================
     INFOS TEXTES
     ============================================================ */
    &__info {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__name {
      font-weight: 700;
      color: @neutral-900;
      font-size: 1rem;
    }

    &__meta {
      color: @neutral-600;
      font-size: 0.85rem;
      opacity: 0.9;
    }

    &__price {
      color: @primary-700;
      font-size: 1.05rem;
      margin-top: 2px;
    }

    /* ============================================================
     FOOTER
     ============================================================ */
    &__footer {
      margin-top: auto;
      padding-top: 10px;

      display: flex;
      justify-content: center;
    }

    &__button {
      width: 100%;
    }
  }

  /* ============================================================
   ✨ ANIMATION FADE-UP
   ============================================================ */
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
