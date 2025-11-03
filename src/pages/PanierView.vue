<template>
  <div class="cart">
    <BasicText
      size="h3"
      weight="bold"
      class="cart__title"
    >
      Mon panier
    </BasicText>

    <!-- 🛒 Vide -->
    <div
      v-if="cart.items.length === 0"
      class="cart__empty"
    >
      <BasicText>Aucun produit dans votre panier.</BasicText>
      <BasicButton
        label="Voir le catalogue"
        type="primary"
        variant="filled"
        size="medium"
        @click="$router.push('/catalogue')"
      />
    </div>

    <!-- 💊 Contenu -->
    <div
      v-else
      class="cart__content"
    >
      <div class="cart__items">
        <div
          v-for="item in cart.items"
          :key="item.id"
          class="cart__item"
        >
          <img
            :src="item.image || defaultImage"
            :alt="item.name"
            class="cart__item-img"
          />
          <div class="cart__item-info">
            <BasicText weight="bold">{{ item.name }}</BasicText>
            <BasicText
              size="body-s"
              color="neutral-500"
            >
              {{ item.price.toFixed(2) }} € / unité
            </BasicText>

            <div class="cart__item-controls">
              <label>Quantité :</label>
              <input
                type="number"
                min="1"
                :value="item.quantity"
                @input="cart.updateQuantity(item.id, +($event.target as HTMLInputElement).value)"
              />
              <BasicButton
                label="Supprimer"
                type="danger"
                variant="ghost"
                size="small"
                @click="cart.removeFromCart(item.id)"
              />
            </div>
          </div>

          <BasicText
            size="body-m"
            weight="bold"
            class="cart__item-total"
          >
            {{ (item.price * item.quantity).toFixed(2) }} €
          </BasicText>
        </div>
      </div>

      <!-- 🧾 Résumé -->
      <div class="cart__summary">
        <BasicText
          size="h5"
          weight="bold"
        >
          Résumé
        </BasicText>
        <div class="cart__summary-line">
          <BasicText>Total articles :</BasicText>
          <BasicText>{{ cart.totalItems }}</BasicText>
        </div>
        <div class="cart__summary-line">
          <BasicText>Total :</BasicText>
          <BasicText
            weight="bold"
            color="primary-600"
          >
            {{ cart.totalPrice.toFixed(2) }} €
          </BasicText>
        </div>

        <BasicButton
          label="Procéder au paiement"
          type="primary"
          variant="filled"
          size="large"
          width="full"
          :disabled="cart.items.length === 0"
          @click="$router.push('/checkout')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  const cart = useCartStore()
</script>

<style scoped lang="less">
  .cart {
    max-width: 1000px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 0 20px;

    &__title {
      text-align: center;
    }

    &__empty {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }

    &__content {
      display: flex;
      gap: 40px;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    &__items {
      flex: 2;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid @neutral-200;
      background: white;

      &-img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
      }

      &-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      &-controls {
        display: flex;
        align-items: center;
        gap: 8px;

        input {
          width: 60px;
          text-align: center;
          padding: 4px;
          border: 1px solid @neutral-300;
          border-radius: 6px;
        }
      }

      &-total {
        min-width: 80px;
        text-align: right;
      }
    }

    &__summary {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid @neutral-200;
      background: @neutral-50;

      &-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
</style>
