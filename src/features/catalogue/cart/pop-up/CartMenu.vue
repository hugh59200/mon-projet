<template>
  <div class="cart">
    <FloatingDropdownWrapper
      v-model="isOpen"
      :width="350"
      align="right"
      arrow-align="auto"
      :close-delay="800"
      :trigger-mode="!isMobile ? 'hover' : 'click'"
    >
      <template #trigger>
        <div class="cart__icon">
          <BasicIconNext
            class="cart__icon-svg"
            name="ShoppingCart"
            :size="26"
          />
          <div
            v-if="cart.totalItems > 0"
            class="cart__badge"
            v-motion-pop
          >
            <BasicText
              size="body-s"
              weight="bold"
              style="line-height: 1"
            >
              {{ cart.totalItems }}
            </BasicText>
          </div>
        </div>
      </template>

      <div class="cart__content">
        <div
          v-if="cart.items.length === 0"
          class="cart__empty"
        >
          <div class="cart__empty-icon-wrapper">
            <BasicIconNext
              name="ShoppingBag"
              :size="32"
              color="neutral-400"
            />
          </div>

          <BasicText
            size="body-m"
            weight="semibold"
            color="neutral-200"
            class="cart__empty-title"
          >
            Votre panier est vide
          </BasicText>

          <BasicText
            size="body-s"
            color="neutral-400"
            class="cart__empty-sub"
          >
            Découvrez nos peptides d'exception et profitez de nos offres.
          </BasicText>

          <BasicButton
            label="Parcourir le catalogue"
            type="primary"
            size="small"
            class="cart__empty-btn"
            @click="goToProducts"
          />
        </div>

        <div
          v-else
          class="cart__filled"
        >
          <div class="cart__header">
            <BasicText
              size="body-s"
              weight="bold"
              color="neutral-400"
            >
              Mon Panier ({{ cart.totalItems }})
            </BasicText>
          </div>

          <div class="cart__list custom-scrollbar">
            <div
              v-for="item in cart.items"
              class="cart__item"
            >
              <div class="cart__item-img-wrapper">
                <img
                  :src="item.product_image || defaultImage"
                  alt="Produit"
                  class="cart__item-img"
                />
              </div>

              <div class="cart__item-info">
                <div class="cart__item-top">
                  <BasicText
                    size="body-s"
                    weight="semibold"
                    color="neutral-200"
                    class="cart__item-name"
                  >
                    {{ item.product_name }}
                  </BasicText>

                  <button
                    class="cart__item-remove"
                    @click.stop="cart.removeFromCart(item.product_id!)"
                    title="Retirer du panier"
                  >
                    <BasicIconNext
                      name="X"
                      :size="14"
                    />
                  </button>
                </div>

                <div class="cart__item-bottom">
                  <BasicText
                    size="body-s"
                    color="neutral-400"
                    class="cart__item-qty"
                  >
                    Qté: {{ item.quantity }}
                  </BasicText>

                  <div class="cart__item-prices">
                    <template v-if="item.is_on_sale">
                      <span class="price-old">
                        {{ formatPrice(item.product_price) }}
                      </span>
                      <span class="price-new">
                        {{ formatPrice(item.product_sale_price) }}
                      </span>
                    </template>
                    <template v-else>
                      <span class="price-standard">
                        {{ formatPrice(item.product_price) }}
                      </span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="cart__footer">
            <div class="cart__total-row">
              <BasicText
                size="body-s"
                color="neutral-400"
              >
                Total estimé
              </BasicText>
              <div class="cart__total-price">
                <BasicText
                  size="body-l"
                  color="primary-400"
                  weight="bold"
                >
                  {{ formatPrice(cart.totalPrice) }}
                </BasicText>
              </div>
            </div>

            <div class="cart__btns">
              <BasicButton
                label="Voir le panier"
                type="secondary"
                variant="outlined"
                size="small"
                @click="goToCart"
              />
              <BasicButton
                label="Paiement"
                type="primary"
                size="small"
                block
                @click="goToCheckout"
              />
            </div>
          </div>
        </div>
      </div>
    </FloatingDropdownWrapper>
  </div>
</template>

<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { BasicButton } from '@designSystem/components/basic/button'
  import { BasicIconNext } from '@designSystem/components/basic/icon'
  import { BasicText } from '@designSystem/components/basic/text'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const cart = useCartStore()
  const { isMobile } = useDeviceBreakpoint()

  const isOpen = ref(false)

  function formatPrice(value: number | null | undefined) {
    if (value == null || isNaN(Number(value))) return '0,00 €'
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
      Number(value),
    )
  }

  function goToCart() {
    isOpen.value = false
    router.push('/panier')
  }

  function goToCheckout() {
    isOpen.value = false
    router.push('/checkout')
  }

  function goToProducts() {
    isOpen.value = false
    router.push('/catalogue')
  }
</script>

<style scoped lang="less">
  .cart {
    display: inline-flex;
    position: relative;

    /* ======================
       ICON TRIGGER
    ====================== */
    &__icon {
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: @neutral-100;
      transition: color 0.2s ease;

      &-svg {
        transition: filter 0.25s ease;
      }

      &:hover {
        color: white;
        .cart__icon-svg {
          filter: drop-shadow(0 0 8px rgba(var(--primary-500-rgb), 0.6));
        }
      }
    }

    &__badge {
      position: absolute;
      top: -6px;
      right: -6px;
      background: var(--primary-600);
      color: white;
      border-radius: 50%;
      height: 18px;
      width: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 0 2px rgba(var(--secondary-900-rgb), 1);
    }

    /* ======================
       DROPDOWN CONTENT
       ✅ MODIFIÉ : Plus de background/border ici !
    ====================== */
    &__content {
      display: flex;
      flex-direction: column;
      /* Le wrapper gère déjà le padding, background, border, shadow */
    }

    /* ======================
       EMPTY STATE
    ====================== */
    &__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 24px 12px; /* Padding réduit car le wrapper en a déjà */
      gap: 8px;

      &-icon-wrapper {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 50%;
        padding: 16px;
        margin-bottom: 8px;
      }

      &-title {
        margin-top: 4px;
      }

      &-sub {
        font-size: 0.85rem;
        line-height: 1.4;
        max-width: 200px;
      }

      &-btn {
        margin-top: 16px;
        width: 100%;
      }
    }

    /* ======================
       FILLED STATE
    ====================== */
    &__filled {
      display: flex;
      flex-direction: column;
      max-height: 500px;
    }

    &__header {
      /* Padding ajusté pour s'aligner avec le wrapper */
      padding: 0 4px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    /* LISTE SCROLLABLE */
    &__list {
      flex: 1;
      overflow-y: auto;
      padding: 0 4px;
      margin: 8px 0;
      display: flex;
      flex-direction: column;
      gap: 4px;

      /* Scrollbar styling */
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 4px;
      }
    }

    &__item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 8px;
      border-radius: 8px;
      transition: background 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.03);

        .cart__item-remove {
          opacity: 1;
        }
      }

      &-img-wrapper {
        width: 48px;
        height: 48px;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: #000;
        flex-shrink: 0;
      }

      &-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }

      &-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 8px;
      }

      &-name {
        font-size: 0.9rem;
        line-height: 1.2;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      &-remove {
        background: none;
        border: none;
        color: @neutral-500;
        cursor: pointer;
        padding: 2px;
        opacity: 0; /* Visible au hover */
        transition: all 0.2s;

        &:hover {
          color: @red-400;
        }
      }

      &-bottom {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 2px;
      }

      &-prices {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;

        .price-standard {
          color: @neutral-100;
          font-weight: 600;
        }

        .price-old {
          color: @neutral-500;
          text-decoration: line-through;
          font-size: 0.8rem;
        }

        .price-new {
          color: var(--primary-400);
          font-weight: 700;
        }
      }
    }

    /* ======================
       FOOTER
    ====================== */
    &__footer {
      padding: 16px 4px 4px; /* Ajusté */
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__btns {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 10px;
    }
  }
</style>
