<template>
  <div class="track-details">
    <!-- Shipping Address -->
    <ContentBlock variant="card" size="md" :interactive="true" class="track-details__card">
      <div class="track-details__header">
        <div class="track-details__icon">
          <BasicIconNext name="MapPin" :size="22" />
        </div>
        <span class="track-details__title">Adresse de livraison</span>
      </div>
      <div class="track-details__body">
        <p class="track-details__name">{{ order.shipping_name }}</p>
        <p v-if="order.relay_name" class="track-details__address">
          <strong>Point Relais :</strong> {{ order.relay_name }}<br />
          {{ order.relay_address }}<br />
          {{ order.relay_zipcode }} {{ order.relay_city }}
        </p>
        <p v-else class="track-details__address">
          {{ order.shipping_address }}<br />
          {{ order.shipping_zip }} {{ order.shipping_city }}, {{ order.shipping_country }}
        </p>
      </div>
    </ContentBlock>

    <!-- Shipping Method -->
    <ContentBlock variant="info" size="md" :interactive="true" class="track-details__card track-details__card--highlight">
      <div class="track-details__header">
        <div class="track-details__icon">
          <BasicIconNext name="Truck" :size="22" />
        </div>
        <span class="track-details__title">Transporteur</span>
      </div>
      <div class="track-details__body">
        <p class="track-details__name">
          {{ order.relay_id ? 'Mondial Relay' : 'Colissimo' }}
        </p>
        <p v-if="order.tracking_number" class="track-details__status track-details__status--success">
          <BasicIconNext name="CheckCircle2" :size="16" />
          Colis expédié
        </p>
        <p v-else class="track-details__pending">
          <BasicIconNext name="Clock" :size="14" />
          En attente d'expédition
        </p>

        <!-- Tracking number -->
        <div v-if="order.tracking_number" class="track-details__tracking">
          <span class="track-details__tracking-label">Numéro de suivi</span>
          <button class="track-details__tracking-btn" @click="$emit('copy-tracking')">
            <span class="track-details__tracking-number">{{ order.tracking_number }}</span>
            <BasicIconNext
              :name="copied ? 'Check' : 'Copy'"
              :size="18"
              class="track-details__tracking-copy"
            />
          </button>
        </div>
      </div>
    </ContentBlock>

    <!-- Payment Method -->
    <ContentBlock variant="card" size="md" :interactive="true" class="track-details__card">
      <div class="track-details__header">
        <div class="track-details__icon">
          <BasicIconNext name="CreditCard" :size="22" />
        </div>
        <span class="track-details__title">Paiement</span>
      </div>
      <div class="track-details__body">
        <p class="track-details__name">
          {{ order.payment_method === 'crypto' ? 'Crypto-monnaie' : 'Virement bancaire' }}
        </p>
        <p class="track-details__status track-details__status--success">
          <BasicIconNext name="CheckCircle2" :size="16" />
          Paiement confirmé
        </p>
      </div>
    </ContentBlock>

    <!-- Contact -->
    <ContentBlock variant="card" size="md" :interactive="true" class="track-details__card">
      <div class="track-details__header">
        <div class="track-details__icon">
          <BasicIconNext name="Mail" :size="22" />
        </div>
        <span class="track-details__title">Contact</span>
      </div>
      <div class="track-details__body">
        <p class="track-details__info">{{ order.shipping_email }}</p>
      </div>
    </ContentBlock>
  </div>
</template>

<script setup lang="ts">
import type { OrdersFullView } from '@/supabase/types/supabase.types'

defineProps<{
  order: OrdersFullView
  copied: boolean
}>()

defineEmits<{
  (e: 'copy-tracking'): void
}>()
</script>

<style scoped lang="less">
@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.track-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  &__card {
    // Styles de base gérés par ContentBlock
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border-default);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(
      135deg,
      rgba(var(--primary-500-rgb), 0.1) 0%,
      rgba(var(--primary-500-rgb), 0.05) 100%
    );
    border-radius: 14px;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  &__title {
    font-family: @font-body;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__name {
    font-family: @font-display;
    font-size: 17px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  &__address {
    font-family: @font-body;
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
  }

  &__info {
    font-family: @font-body;
    font-size: 14px;
    color: var(--text-muted);
    margin: 0;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: @font-body;
    font-size: 14px;
    margin: 0;

    &--success {
      color: var(--success-500);
    }
  }

  &__pending {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: @font-body;
    font-size: 13px;
    color: var(--text-muted);
    margin: 4px 0 0;
    font-style: italic;
  }

  &__tracking {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 4px;
  }

  &__tracking-label {
    font-family: @font-body;
    font-size: 12px;
    color: var(--text-muted);
  }

  &__tracking-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--chrome-bg-secondary);
    border: 1px solid var(--chrome-border);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s @ease;

    &:hover {
      background: var(--chrome-bg-tertiary);
      border-color: var(--primary-300);

      .track-details__tracking-copy {
        color: var(--primary-500);
      }
    }
  }

  &__tracking-number {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    flex: 1;
  }

  &__tracking-copy {
    color: var(--text-muted);
    transition: color 0.25s @ease;
  }
}

// Responsive
.respond-mobile({
  .track-details {
    grid-template-columns: 1fr;

    &__card {
      padding: 20px;
    }
  }
});
</style>
