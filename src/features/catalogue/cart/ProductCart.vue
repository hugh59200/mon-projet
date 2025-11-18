<template>
  <Transition name="fade-up">
    <div
      class="product-cart"
      @click="$emit('view', product.id)"
    >
      <div class="product-cart__image">
        <img
          :src="product.image"
          :alt="product.name"
          loading="lazy"
        />
      </div>
      <div class="product-cart__info">
        <BasicText
          size="body-l"
          weight="bold"
          color="neutral-800"
        >
          {{ product.name }}
        </BasicText>

        <BasicText
          size="body-m"
          color="neutral-600"
        >
          {{ product.category }} • Pureté : {{ product.purity }}%
        </BasicText>
        <BasicText
          size="body-l"
          weight="bold"
          color="primary-800"
        >
          {{ product.price.toFixed(2) }} €
        </BasicText>
      </div>
      <div class="product-cart__footer">
        <BasicButton
          :label="product.stock ? 'Ajouter au panier' : 'Rupture'"
          :disabled="!product.stock"
          :type="product.stock ? 'primary' : 'secondary'"
          width="full"
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
  .product-cart {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 12px;

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
    min-height: 340px;

    &:hover {
      transform: translateY(-4px);
      box-shadow:
        0 18px 38px fade(#000, 28%),
        0 0 14px color-mix(in srgb, var(--primary-400) 25%, transparent),
        inset 0 0 0 1px fade(@white, 30%);
      border-color: color-mix(in srgb, var(--primary-400) 30%, transparent);
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

    &__price {
      color: var(--primary-700);
      font-size: 1.05rem;
      margin-top: 2px;
    }

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
