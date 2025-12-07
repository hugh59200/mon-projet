<template>
  <aside class="track-sidebar">
    <!-- Order Summary -->
    <div class="track-sidebar__summary">
      <div class="track-sidebar__summary-header">
        <h3 class="track-sidebar__summary-title">
          <BasicIconNext name="ShoppingBag" :size="20" />
          Récapitulatif
        </h3>
        <span class="track-sidebar__summary-count">
          {{ detailedItemsCount }} {{ detailedItemsCount > 1 ? 'articles' : 'article' }}
        </span>
      </div>

      <!-- Items List -->
      <div class="track-sidebar__items">
        <div
          v-for="(item, index) in (order as any).detailed_items || []"
          :key="index"
          class="track-sidebar__item"
        >
          <div class="track-sidebar__item-image">
            <img :src="item.product_image || defaultImage" :alt="item.product_name" />
          </div>
          <div class="track-sidebar__item-info">
            <span class="track-sidebar__item-name">{{ item.product_name }}</span>
            <div class="track-sidebar__item-meta">
              <span class="track-sidebar__item-qty">x{{ item.quantity }}</span>
              <span v-if="item.product_dosage" class="track-sidebar__item-dosage">
                {{ item.product_dosage }}
              </span>
            </div>
          </div>
          <span class="track-sidebar__item-price">
            {{ formatPrice(item.product_price * item.quantity) }}
          </span>
        </div>
      </div>

      <!-- Totals -->
      <div class="track-sidebar__totals">
        <div class="track-sidebar__totals-row">
          <span>Sous-total</span>
          <span>{{ formatPrice(order.subtotal || 0) }}</span>
        </div>
        <div class="track-sidebar__totals-row">
          <span>Livraison</span>
          <span :class="{ 'track-sidebar__totals-free': !order.shipping_cost }">
            {{ order.shipping_cost ? formatPrice(order.shipping_cost) : 'Offerte' }}
          </span>
        </div>
        <div v-if="order.discount_amount && order.discount_amount > 0" class="track-sidebar__totals-row track-sidebar__totals-row--discount">
          <span>
            <BasicIconNext name="Tag" :size="14" />
            Code promo
          </span>
          <span>-{{ formatPrice(order.discount_amount) }}</span>
        </div>
        <div class="track-sidebar__totals-row track-sidebar__totals-row--total">
          <span>Total</span>
          <span>{{ formatPrice(order.total_amount || 0) }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Register (for guest users) -->
    <div v-if="!isLoggedIn && order.shipping_email && !registerSuccess" class="track-sidebar__register">
      <div class="track-sidebar__register-header">
        <div class="track-sidebar__register-icon">
          <BasicIconNext name="UserPlus" :size="24" />
        </div>
        <div>
          <strong>Créer votre compte</strong>
          <span>Suivez vos commandes facilement</span>
        </div>
      </div>

      <div class="track-sidebar__register-form">
        <div class="track-sidebar__register-email">
          <BasicIconNext name="Mail" :size="18" />
          <span>{{ order.shipping_email }}</span>
          <BasicIconNext name="CheckCircle2" :size="16" class="track-sidebar__register-verified" />
        </div>
        <div class="track-sidebar__register-input-wrapper">
          <BasicIconNext name="Lock" :size="18" />
          <input
            v-model="password"
            type="password"
            placeholder="Créer un mot de passe"
            class="track-sidebar__register-input"
            @keyup.enter="$emit('register', password)"
          />
        </div>
      </div>

      <button
        class="track-sidebar__register-btn"
        :disabled="registerLoading || password.length < 6"
        @click="$emit('register', password)"
      >
        <span v-if="registerLoading" class="track-sidebar__register-loader"></span>
        <template v-else>
          <BasicIconNext name="UserPlus" :size="18" />
          Créer mon compte
        </template>
      </button>

      <div class="track-sidebar__register-benefits">
        <div class="track-sidebar__register-benefit">
          <BasicIconNext name="CheckCircle2" :size="16" />
          <span>Suivi de toutes vos commandes</span>
        </div>
        <div class="track-sidebar__register-benefit">
          <BasicIconNext name="CheckCircle2" :size="16" />
          <span>Commandes plus rapides</span>
        </div>
        <div class="track-sidebar__register-benefit">
          <BasicIconNext name="CheckCircle2" :size="16" />
          <span>Offres exclusives</span>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="registerSuccess" class="track-sidebar__success">
      <div class="track-sidebar__success-icon">
        <BasicIconNext name="Check" :size="32" />
      </div>
      <span class="track-sidebar__success-title">Compte créé !</span>
      <p class="track-sidebar__success-text">
        Vérifiez votre email <span>{{ order.shipping_email }}</span> pour activer votre compte.
      </p>
    </div>

    <!-- Trust Badges -->
    <div class="track-sidebar__trust">
      <div class="track-sidebar__trust-item">
        <BasicIconNext name="Shield" :size="18" />
        <span>Paiement sécurisé</span>
      </div>
      <div class="track-sidebar__trust-item">
        <BasicIconNext name="Truck" :size="18" />
        <span>Livraison suivie</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { OrdersFullView } from '@/supabase/types/supabase.types'
import defaultImage from '@/assets/products/default/default-product-image.png'

const props = defineProps<{
  order: OrdersFullView
  isLoggedIn: boolean
  registerLoading: boolean
  registerSuccess: boolean
}>()

defineEmits<{
  (e: 'register', password: string): void
}>()

const password = ref('')

const detailedItemsCount = computed(() => {
  const orderValue = props.order as any
  return orderValue && Array.isArray(orderValue.detailed_items)
    ? orderValue.detailed_items.length
    : 0
})

function formatPrice(value: number | null | undefined) {
  if (value == null || isNaN(Number(value))) return '0,00 €'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(Number(value))
}
</script>

<style scoped lang="less">
@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.track-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 32px;

  // Summary
  &__summary {
    background: white;
    border-radius: 24px;
    padding: 28px;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.04),
      0 12px 48px rgba(0, 0, 0, 0.06);
    border: 1px solid @neutral-100;
  }

  &__summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid @neutral-100;
  }

  &__summary-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: @font-display;
    font-size: 18px;
    font-weight: 600;
    color: @neutral-900;
    margin: 0;

    svg {
      color: var(--primary-500);
    }
  }

  &__summary-count {
    font-family: @font-body;
    font-size: 13px;
    font-weight: 500;
    color: @neutral-500;
    padding: 6px 14px;
    background: @neutral-100;
    border-radius: 20px;
  }

  // Items
  &__items {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 280px;
    overflow-y: auto;
    margin-bottom: 20px;
    padding-right: 8px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: @neutral-100;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: @neutral-300;
      border-radius: 2px;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 16px;
    border-bottom: 1px solid @neutral-100;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  &__item-image {
    width: 56px;
    height: 56px;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
      border: 1px solid @neutral-100;
    }
  }

  &__item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  &__item-name {
    font-family: @font-body;
    font-size: 14px;
    font-weight: 600;
    color: @neutral-900;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__item-meta {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__item-qty {
    font-family: @font-body;
    font-size: 12px;
    color: @neutral-500;
  }

  &__item-dosage {
    font-family: @font-body;
    font-size: 11px;
    font-weight: 500;
    color: var(--primary-700);
    background: rgba(var(--primary-500-rgb), 0.08);
    padding: 3px 8px;
    border-radius: 6px;
  }

  &__item-price {
    font-family: @font-display;
    font-size: 15px;
    font-weight: 700;
    color: @neutral-900;
    flex-shrink: 0;
  }

  // Totals
  &__totals {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid @neutral-100;
  }

  &__totals-row {
    display: flex;
    justify-content: space-between;
    font-family: @font-body;
    font-size: 14px;
    color: @neutral-600;

    &--discount {
      color: @success-500;

      span:first-child {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }

    &--total {
      padding-top: 16px;
      margin-top: 8px;
      border-top: 2px dashed @neutral-200;
      font-size: 16px;
      font-weight: 700;
      color: @neutral-900;

      span:last-child {
        font-family: @font-display;
        font-size: 22px;
        color: var(--primary-700);
      }
    }
  }

  &__totals-free {
    color: @success-500;
    font-weight: 600;
  }

  // Register CTA
  &__register {
    background: linear-gradient(135deg, white 0%, rgba(var(--primary-500-rgb), 0.04) 100%);
    border: 1px solid rgba(var(--primary-500-rgb), 0.2);
    border-radius: 24px;
    padding: 28px;
  }

  &__register-header {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
  }

  &__register-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    background: white;
    border-radius: 16px;
    color: var(--primary-600);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
  }

  &__register-header > div:last-child {
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
      font-family: @font-display;
      font-size: 17px;
      font-weight: 600;
      color: @neutral-900;
    }

    span {
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-500;
    }
  }

  &__register-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
  }

  &__register-email {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid @neutral-200;
    border-radius: 14px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 13px;
    color: @neutral-600;

    span {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    svg:first-child {
      color: @neutral-400;
      flex-shrink: 0;
    }
  }

  &__register-verified {
    color: @success-500;
    flex-shrink: 0;
  }

  &__register-input-wrapper {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: white;
    border: 2px solid @neutral-200;
    border-radius: 14px;
    transition: all 0.25s @ease;

    &:focus-within {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 4px rgba(var(--primary-500-rgb), 0.1);
    }

    svg {
      color: @neutral-400;
      flex-shrink: 0;
    }
  }

  &__register-input {
    flex: 1;
    border: none;
    background: transparent;
    font-family: @font-body;
    font-size: 15px;
    color: @neutral-900;
    outline: none;

    &::placeholder {
      color: @neutral-400;
    }
  }

  &__register-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 16px 24px;
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    border: none;
    border-radius: 14px;
    font-family: @font-body;
    font-size: 15px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.3s @ease;
    box-shadow: 0 4px 20px rgba(var(--primary-500-rgb), 0.35);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(var(--primary-500-rgb), 0.45);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &__register-loader {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  &__register-benefits {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 16px;
    border-top: 1px solid rgba(var(--primary-500-rgb), 0.1);
  }

  &__register-benefit {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-600;

    svg {
      color: @success-500;
      flex-shrink: 0;
    }
  }

  // Success
  &__success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 40px 28px;
    background: linear-gradient(135deg, @success-50 0%, @success-100 100%);
    border: 1px solid @success-200;
    border-radius: 24px;
    text-align: center;
  }

  &__success-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    background: white;
    border-radius: 50%;
    color: @success-500;
    box-shadow: 0 4px 20px rgba(var(--success-500-rgb), 0.2);
  }

  &__success-title {
    font-family: @font-display;
    font-size: 18px;
    font-weight: 600;
    color: @success-800;
  }

  &__success-text {
    font-family: @font-body;
    font-size: 14px;
    color: @success-700;
    margin: 0;
    line-height: 1.6;

    span {
      font-weight: 600;
      color: @success-800;
    }
  }

  // Trust badges
  &__trust {
    display: flex;
    justify-content: center;
    gap: 28px;
    padding: 20px;
    background: white;
    border-radius: 16px;
    border: 1px solid @neutral-100;
  }

  &__trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-500;

    svg {
      color: @success-500;
    }
  }
}

// Responsive
.respond-tablet({
  .track-sidebar {
    position: static;
  }
});

.respond-mobile({
  .track-sidebar {
    &__summary {
      padding: 24px 20px;
    }

    &__register {
      padding: 24px 20px;
    }

    &__trust {
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }
  }
});
</style>
