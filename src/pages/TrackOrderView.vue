<template>
  <div class="track-page">
    <div class="track-container">
      <div class="track-header">
        <BasicIconNext
          name="PackageSearch"
          :size="48"
          color="primary-600"
        />
        <h1 class="track-title">Suivi de commande</h1>
        <p class="track-subtitle">
          Entrez votre numéro de commande et l'email utilisé lors de l'achat pour consulter le
          statut.
        </p>
      </div>

      <div
        v-if="!order"
        class="track-form-card"
        v-motion-slide-visible-once-bottom
      >
        <form
          @submit.prevent="handleSearch"
          class="form-content"
        >
          <BasicInput
            v-model="form.orderNumber"
            label="Numéro de commande"
            placeholder="ex: FP-2024-001234"
            required
          />
          <BasicInput
            v-model="form.email"
            label="Adresse Email"
            type="email"
            placeholder="exemple@email.com"
            required
          />

          <BasicButton
            label="Rechercher ma commande"
            type="primary"
            width="full"
            :loading="loading"
            icon-name="Search"
          />
        </form>
      </div>

      <div
        v-else
        class="order-result"
        v-motion-fade
      >
        <div class="result-header">
          <div class="result-meta">
            <h2>Commande {{ order.order_number }}</h2>
            <BasicBadge
              :label="getLabelBadge(order.status)"
              :type="getTypeBadge(order.status)"
            />
          </div>
          <BasicButton
            label="Nouvelle recherche"
            type="secondary"
            variant="ghost"
            size="small"
            @click="order = null"
          />
        </div>

        <div class="status-timeline">
          <div class="timeline-item active">
            <div class="dot"></div>
            <span>Commande validée</span>
            <small>{{ formatDate(order.created_at) }}</small>
          </div>
          <div
            class="timeline-line"
            :class="{ active: isShipped }"
          ></div>
          <div
            class="timeline-item"
            :class="{ active: isShipped }"
          >
            <div class="dot"></div>
            <span>Expédiée</span>
            <small v-if="order.shipped_at">{{ formatDate(order.shipped_at) }}</small>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-box">
            <h4>Adresse de livraison</h4>
            <p>{{ order.shipping_name }}</p>
            <p>{{ order.shipping_address }}</p>
            <p>{{ order.shipping_zip }} {{ order.shipping_city }}, {{ order.shipping_country }}</p>
          </div>
          <div
            class="info-box"
            v-if="order.tracking_number"
          >
            <h4>Suivi Transporteur</h4>
            <p>
              Transporteur :
              <strong>{{ order.carrier || 'Standard' }}</strong>
            </p>
            <p>
              N° :
              <span class="tracking-code">{{ order.tracking_number }}</span>
            </p>
          </div>
        </div>

        <div class="items-list">
          <h4>Articles ({{ order.detailed_items?.length || 0 }})</h4>
          <div
            v-for="item in order.detailed_items"
            :key="item.product_id"
            class="item-row"
          >
            <span>{{ item.quantity }}x {{ item.product_name }}</span>
            <span>{{ formatPrice(item.total) }}</span>
          </div>
          <div class="total-row">
            <strong>Total payé</strong>
            <strong class="text-primary">{{ formatPrice(order.total_amount) }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { trackGuestOrder } from '@/supabase/api/ordersApi'
  import { getLabelBadge, getTypeBadge } from '@/utils' // Tes utilitaires existants
  import BasicBadge from '@designSystem/components/basic/badge/BasicBadge.vue'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicInput from '@designSystem/components/basic/input/BasicInput.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, ref } from 'vue'

  const toast = useToastStore()
  const loading = ref(false)
  const order = ref<any | null>(null)

  const form = ref({
    orderNumber: '',
    email: '',
  })

  const isShipped = computed(() => ['shipped', 'completed'].includes(order.value?.status))

  async function handleSearch() {
    loading.value = true
    try {
      const data = await trackGuestOrder(form.value.email, form.value.orderNumber)
      order.value = data
    } catch (err: any) {
      toast.show(err.message || 'Impossible de trouver cette commande', 'danger')
    } finally {
      loading.value = false
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
  }

  function formatPrice(val: number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)
  }
</script>

<style scoped lang="less">
  .track-page {
    min-height: 80vh;
    padding: 40px 20px;
    background: #f8fafc;
    display: flex;
    justify-content: center;
  }

  .track-container {
    width: 100%;
    max-width: 600px;
  }

  .track-header {
    text-align: center;
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    .track-title {
      font-size: 2rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .track-subtitle {
      color: #64748b;
      max-width: 400px;
      line-height: 1.5;
    }
  }

  /* Formulaire */
  .track-form-card {
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;

    .form-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }

  /* Résultat */
  .order-result {
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
  }

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f1f5f9;

    h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
      color: #334155;
    }
    .result-meta {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  /* Timeline */
  .status-timeline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    padding: 0 10px;
  }
  .timeline-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    color: #94a3b8;
    position: relative;
    z-index: 2;

    .dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #cbd5e1;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #cbd5e1;
    }
    &.active {
      color: #0f172a;
      font-weight: 600;
      .dot {
        background: var(--primary-500);
        box-shadow: 0 0 0 2px var(--primary-200);
      }
    }
  }
  .timeline-line {
    flex: 1;
    height: 2px;
    background: #e2e8f0;
    margin: 0 -10px;
    margin-bottom: 20px; /* Align with dots */
    &.active {
      background: var(--primary-500);
    }
  }

  /* Info Grids */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }
  .info-box {
    background: #f8fafc;
    padding: 16px;
    border-radius: 12px;
    h4 {
      margin: 0 0 8px 0;
      font-size: 0.9rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 700;
    }
    p {
      margin: 4px 0;
      font-size: 0.95rem;
      color: #334155;
    }
    .tracking-code {
      font-family: monospace;
      background: #e2e8f0;
      padding: 2px 6px;
      border-radius: 4px;
    }
  }

  /* Items */
  .items-list {
    border-top: 1px dashed #cbd5e1;
    padding-top: 20px;
    h4 {
      margin: 0 0 12px 0;
      color: #334155;
    }
    .item-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 0.95rem;
      color: #475569;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
      font-size: 1.1rem;
    }
    .text-primary {
      color: var(--primary-600);
    }
  }
</style>
