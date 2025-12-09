<template>
  <div class="admin-crypto">
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher par numero ou email..."
      :show-reset="true"
      @reset="reset"
    >
      <template #filters>
        <div class="admin-crypto__tabs">
          <button
            class="admin-crypto__tab"
            :class="{ 'admin-crypto__tab--active': filterStatus === 'pending' }"
            @click="setFilterStatus('pending')"
          >
            <IconClock class="admin-crypto__tab-icon" />
            <span>En attente</span>
            <span class="admin-crypto__tab-count" :class="{ 'admin-crypto__tab-count--alert': pendingCount > 0 }">
              {{ pendingCount }}
            </span>
          </button>
          <button
            class="admin-crypto__tab"
            :class="{ 'admin-crypto__tab--active': filterStatus === 'all' }"
            @click="setFilterStatus('all')"
          >
            <IconList class="admin-crypto__tab-icon" />
            <span>Toutes</span>
          </button>
        </div>
      </template>
    </BasicToolbar>

    <WrapperLoader
      :loading="loading"
      :has-loaded="hasLoaded"
      :is-empty="hasLoaded && filteredOrders.length === 0"
      message="Chargement des commandes crypto..."
      empty-message="Aucune commande crypto en attente"
    >
      <div class="admin-crypto__list">
        <div
          v-for="order in filteredOrders"
          :key="order.order_id"
          class="admin-crypto__card"
          :class="{ 'admin-crypto__card--verified': order.crypto_txid }"
        >
          <!-- Header de la commande -->
          <div class="admin-crypto__card-header">
            <div class="admin-crypto__order-info">
              <span class="admin-crypto__order-number">{{ order.order_number }}</span>
              <span class="admin-crypto__order-date">{{ formatDate(order.created_at) }}</span>
            </div>
            <div class="admin-crypto__order-amount">
              <span class="admin-crypto__amount-value">{{ formatCurrency(order.total_amount) }}</span>
              <BasicBadge
                :label="order.status === 'pending' ? 'En attente' : order.status"
                :type="order.status === 'pending' ? 'pending' : 'success'"
                size="small"
              />
            </div>
          </div>

          <!-- Client info -->
          <div class="admin-crypto__client">
            <IconUser class="admin-crypto__client-icon" />
            <div class="admin-crypto__client-info">
              <span class="admin-crypto__client-name">{{ order.customer_name }}</span>
              <span class="admin-crypto__client-email">{{ order.customer_email }}</span>
            </div>
          </div>

          <!-- Section verification -->
          <div class="admin-crypto__verification" v-if="order.status === 'pending'">
            <div class="admin-crypto__verification-header">
              <IconSearch class="admin-crypto__verification-icon" />
              <span class="admin-crypto__verification-title">Verification Blockchain</span>
            </div>

            <!-- Formulaire de verification -->
            <div class="admin-crypto__form">
              <div class="admin-crypto__form-row">
                <WrapperInput
                  :model-value="getVerificationState(order.order_id).txid"
                  label="TXID (Hash de transaction)"
                  placeholder="Collez le hash de transaction ici..."
                  class="admin-crypto__txid-input"
                  @update:model-value="updateTxid(order.order_id, String($event ?? ''))"
                />
                <WrapperSelect
                  :model-value="getVerificationState(order.order_id).cryptoType"
                  label="Type de crypto"
                  :options="cryptoOptions"
                  class="admin-crypto__crypto-select"
                  @update:model-value="updateCryptoType(order.order_id, $event)"
                />
              </div>

              <PremiumButton
                :label="getVerificationState(order.order_id).status === 'verifying' ? 'Verification...' : 'Verifier sur la Blockchain'"
                :icon="IconSearch"
                variant="outline"
                size="sm"
                :loading="getVerificationState(order.order_id).status === 'verifying'"
                :disabled="!getVerificationState(order.order_id).txid"
                @click="verifyTransaction(order.order_id)"
              />
            </div>

            <!-- Resultat de verification -->
            <div
              v-if="getVerificationState(order.order_id).result"
              class="admin-crypto__result"
              :class="{ 'admin-crypto__result--success': getVerificationState(order.order_id).result?.valid }"
            >
              <template v-if="getVerificationState(order.order_id).result?.valid">
                <div class="admin-crypto__result-header">
                  <IconCheck class="admin-crypto__result-icon admin-crypto__result-icon--success" />
                  <span>Transaction verifiee</span>
                </div>
                <div class="admin-crypto__result-details">
                  <div class="admin-crypto__result-row">
                    <span class="admin-crypto__result-label">Montant recu</span>
                    <span class="admin-crypto__result-value">{{ getVerificationState(order.order_id).result?.amount_formatted }}</span>
                  </div>
                  <div class="admin-crypto__result-row">
                    <span class="admin-crypto__result-label">Confirmations</span>
                    <span class="admin-crypto__result-value">{{ getVerificationState(order.order_id).result?.confirmations }}</span>
                  </div>
                  <div class="admin-crypto__result-row">
                    <span class="admin-crypto__result-label">Adresse destination</span>
                    <span class="admin-crypto__result-value admin-crypto__result-value--mono">
                      {{ truncateAddress(getVerificationState(order.order_id).result?.to_address || '') }}
                    </span>
                  </div>
                  <div class="admin-crypto__result-row">
                    <span class="admin-crypto__result-label">Date</span>
                    <span class="admin-crypto__result-value">{{ formatDateTime(getVerificationState(order.order_id).result?.timestamp || '') }}</span>
                  </div>
                </div>
                <div class="admin-crypto__result-actions">
                  <a
                    :href="getVerificationState(order.order_id).result?.block_explorer_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="admin-crypto__explorer-link"
                  >
                    <IconExternalLink class="admin-crypto__explorer-icon" />
                    Voir sur l'explorateur
                  </a>
                  <PremiumButton
                    label="Valider le paiement"
                    :icon="IconCheck"
                    variant="solid"
                    size="sm"
                    @click="saveAndValidatePayment(order.order_id)"
                  />
                </div>
              </template>
              <template v-else>
                <div class="admin-crypto__result-header admin-crypto__result-header--error">
                  <IconX class="admin-crypto__result-icon admin-crypto__result-icon--error" />
                  <span>Transaction non trouvee</span>
                </div>
                <p class="admin-crypto__result-error">{{ getVerificationState(order.order_id).error }}</p>
              </template>
            </div>
          </div>

          <!-- Deja verifie -->
          <div v-else-if="order.crypto_txid" class="admin-crypto__verified">
            <IconCheck class="admin-crypto__verified-icon" />
            <div class="admin-crypto__verified-info">
              <span class="admin-crypto__verified-label">Transaction verifiee</span>
              <span class="admin-crypto__verified-txid">{{ truncateAddress(order.crypto_txid) }}</span>
            </div>
            <a
              :href="getBlockExplorerUrl(order.crypto_txid, order.crypto_type as CryptoType)"
              target="_blank"
              rel="noopener noreferrer"
              class="admin-crypto__verified-link"
            >
              <IconExternalLink />
            </a>
          </div>
        </div>
      </div>
    </WrapperLoader>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h, type FunctionalComponent } from 'vue'
import { useCryptoMatching } from './composables/useCryptoMatching'
import type { CryptoType } from '@/api'

// Icons inline SVG
const IconClock: FunctionalComponent = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '16', height: '16' }, [
    h('path', { d: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z' }),
  ])

const IconList: FunctionalComponent = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '16', height: '16' }, [
    h('path', { d: 'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z' }),
  ])

const IconUser: FunctionalComponent = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '20', height: '20' }, [
    h('path', { d: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' }),
  ])

const IconSearch: FunctionalComponent = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '18', height: '18' }, [
    h('path', { d: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' }),
  ])

const IconCheck: FunctionalComponent = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '16', height: '16' }, [
    h('path', { d: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' }),
  ])

const IconX: FunctionalComponent = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '16', height: '16' }, [
    h('path', { d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' }),
  ])

const IconExternalLink: FunctionalComponent = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '14', height: '14' }, [
    h('path', { d: 'M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z' }),
  ])

// Composables
const {
  orders,
  loading,
  hasLoaded,
  filterStatus,
  pendingCount,
  fetchOrders,
  verifyTransaction,
  saveAndValidatePayment,
  setFilterStatus,
  updateTxid,
  updateCryptoType,
  getVerificationState,
  getBlockExplorerUrl,
} = useCryptoMatching()

// Local state
const search = ref('')

// Crypto options
const cryptoOptions = [
  { value: 'BTC', label: 'Bitcoin (BTC)' },
  { value: 'USDT_TRC20', label: 'USDT (TRC20)' },
  { value: 'ETH', label: 'Ethereum (ETH)' },
  { value: 'USDT_ERC20', label: 'USDT (ERC20)' },
]

// Computed
const filteredOrders = computed(() => {
  if (!search.value) return orders.value

  const q = search.value.toLowerCase()
  return orders.value.filter(
    (o) =>
      o.order_number?.toLowerCase().includes(q) ||
      o.customer_email?.toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q),
  )
})

// Methods
function reset() {
  search.value = ''
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '---'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return '---'
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

function truncateAddress(address: string): string {
  if (!address || address.length < 16) return address
  return `${address.slice(0, 8)}...${address.slice(-8)}`
}

// Lifecycle
onMounted(() => {
  fetchOrders()
})
</script>

<style lang="less" scoped>
@import '@designSystem/fondation/colors/semantic-theme.less';
@import '@designSystem/fondation/breakpoints/responsive-mixins.less';

.admin-crypto {
  &__tabs {
    display: flex;
    gap: 8px;
  }

  &__tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: var(--color-bg-secondary);
    }

    &--active {
      background: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
    }
  }

  &__tab-icon {
    width: 16px;
    height: 16px;
  }

  &__tab-count {
    padding: 2px 6px;
    border-radius: 10px;
    background: var(--color-bg-tertiary);
    font-size: 11px;
    font-weight: 600;

    &--alert {
      background: var(--color-error);
      color: white;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 0;
  }

  &__card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.2s;

    &--verified {
      border-color: var(--color-success);
      background: color-mix(in srgb, var(--color-success) 5%, var(--color-bg-card));
    }
  }

  &__card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--color-border);
  }

  &__order-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__order-number {
    font-weight: 600;
    font-size: 16px;
    color: var(--color-text-primary);
  }

  &__order-date {
    font-size: 13px;
    color: var(--color-text-tertiary);
  }

  &__order-amount {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__amount-value {
    font-weight: 700;
    font-size: 18px;
    color: var(--color-text-primary);
  }

  &__client {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  &__client-icon {
    width: 20px;
    height: 20px;
    color: var(--color-text-tertiary);
  }

  &__client-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__client-name {
    font-weight: 500;
    color: var(--color-text-primary);
  }

  &__client-email {
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  &__verification {
    background: var(--color-bg-secondary);
    border-radius: 8px;
    padding: 16px;
  }

  &__verification-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  &__verification-icon {
    width: 18px;
    height: 18px;
    color: var(--color-primary);
  }

  &__verification-title {
    font-weight: 600;
    color: var(--color-text-primary);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__form-row {
    display: grid;
    grid-template-columns: 1fr 200px;
    gap: 12px;

    .respond-mobile({
      grid-template-columns: 1fr;
    });
  }

  &__result {
    margin-top: 16px;
    padding: 16px;
    border-radius: 8px;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);

    &--success {
      border-color: var(--color-success);
      background: color-mix(in srgb, var(--color-success) 5%, var(--color-bg-card));
    }
  }

  &__result-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-weight: 600;
    color: var(--color-success);

    &--error {
      color: var(--color-error);
    }
  }

  &__result-icon {
    width: 20px;
    height: 20px;

    &--success {
      color: var(--color-success);
    }

    &--error {
      color: var(--color-error);
    }
  }

  &__result-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }

  &__result-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px dashed var(--color-border);

    &:last-child {
      border-bottom: none;
    }
  }

  &__result-label {
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  &__result-value {
    font-weight: 500;
    color: var(--color-text-primary);

    &--mono {
      font-family: monospace;
      font-size: 12px;
    }
  }

  &__result-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid var(--color-border);

    .respond-mobile({
      flex-direction: column;
    });
  }

  &__result-error {
    color: var(--color-error);
    font-size: 13px;
  }

  &__explorer-link {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--color-primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__explorer-icon {
    width: 14px;
    height: 14px;
  }

  &__verified {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: color-mix(in srgb, var(--color-success) 10%, var(--color-bg-secondary));
    border-radius: 8px;
  }

  &__verified-icon {
    width: 24px;
    height: 24px;
    color: var(--color-success);
  }

  &__verified-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__verified-label {
    font-weight: 500;
    color: var(--color-success);
  }

  &__verified-txid {
    font-family: monospace;
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  &__verified-link {
    padding: 8px;
    color: var(--color-text-secondary);

    &:hover {
      color: var(--color-primary);
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
}
</style>
