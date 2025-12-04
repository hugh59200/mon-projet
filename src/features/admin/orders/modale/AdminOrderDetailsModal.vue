<template>
  <ModalComponent
    v-model="visible"
    :closable="true"
    :loading="isLoading"
    size="medium"
  >
    <template #header>
      <BasicText
        size="h4"
        weight="bold"
      >
        {{ t('admin.orderDetails.title') }}
      </BasicText>
    </template>
    <template #content>
      <div
        class="order-detail"
        v-if="order"
      >
        <div class="order-info-card">
          <div class="card-header">
            <BasicText
              size="h5"
              weight="bold"
            >
              Informations commande
            </BasicText>
            <div class="header-badges">
              <BasicBadge
                v-if="order.is_guest_order"
                label="Invité"
                type="info"
                size="small"
              />
              <BasicBadge
                :label="getLabelBadge(order.status)"
                :type="getTypeBadge(order.status)"
              />
            </div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="label">{{ t('admin.orderDetails.customer') }}</span>
              <span class="value">{{ profileInfo.full_name }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ t('admin.userDetails.email') }}</span>
              <span class="value">
                {{
                  order.is_guest_order
                    ? (order as any).customer_email || profileInfo.email
                    : profileInfo.email
                }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">{{ t('admin.orderDetails.createdAt') }}</span>
              <span class="value">{{ formatDate(order.created_at!) }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ t('admin.orderDetails.updatedAt') }}</span>
              <span class="value">{{ formatDate(order.updated_at!) }}</span>
            </div>
            <div class="info-item col-span-2">
              <span class="label">{{ t('orders.orderNumber') }}</span>
              <span class="value font-mono text-xs">
                {{ order.order_number || order.order_id }}
              </span>
            </div>
            <div class="info-item col-span-2" v-if="order.tracking_token">
              <span class="label">{{ t('admin.orderDetails.guestToken') }}</span>
              <span class="value font-mono text-xs">
                {{ order.tracking_token }}
              </span>
            </div>
          </div>
        </div>

        <!-- Détails financiers -->
        <div class="order-info-card">
          <BasicText
            size="h5"
            weight="bold"
            class="mb-3"
          >
            {{ t('admin.orderDetails.financialDetails') }}
          </BasicText>

          <div class="financial-breakdown">
            <div class="financial-item">
              <span class="label">{{ t('admin.orderDetails.subtotal') }}</span>
              <span class="value">{{ formatCurrency(order.subtotal ?? 0) }}</span>
            </div>
            <div class="financial-item">
              <span class="label">{{ t('admin.orderDetails.taxes') }}</span>
              <span class="value">{{ formatCurrency(order.tax_amount ?? 0) }}</span>
            </div>
            <div class="financial-item">
              <span class="label">{{ t('admin.orderDetails.shippingFees') }}</span>
              <span class="value">{{ formatCurrency(order.shipping_cost ?? 0) }}</span>
            </div>
            <div class="financial-item" v-if="order.discount_amount && order.discount_amount > 0">
              <span class="label">{{ t('admin.orderDetails.discount') }}</span>
              <span class="value text-success-600">-{{ formatCurrency(order.discount_amount) }}</span>
            </div>
            <div class="financial-item financial-item--total">
              <span class="label">{{ t('admin.orderDetails.totalTTC') }}</span>
              <span class="value">{{ formatCurrency(order.total_amount ?? 0) }}</span>
            </div>
          </div>
        </div>

        <!-- Point Relais Mondial Relay -->
        <div class="order-info-card" v-if="(order as any).relay_id">
          <BasicText
            size="h5"
            weight="bold"
            class="mb-2"
          >
            📦 Point Relais Mondial Relay
          </BasicText>
          <div
            class="relay-block"
          >
            <p class="font-bold">{{ (order as any).relay_name }}</p>
            <p class="text-xs opacity-70">ID: {{ (order as any).relay_id }}</p>
            <p>{{ (order as any).relay_address }}</p>
            <p>{{ (order as any).relay_zipcode }} {{ (order as any).relay_city }}</p>
            <p>{{ (order as any).relay_country || 'FR' }}</p>
          </div>
        </div>

        <!-- Adresse de livraison domicile -->
        <div class="order-info-card" v-else>
          <BasicText
            size="h5"
            weight="bold"
            class="mb-2"
          >
            🏠 Adresse de livraison (domicile)
          </BasicText>
          <div
            v-if="shippingAddress"
            class="address-block"
          >
            <p class="font-bold">{{ order.shipping_name }}</p>
            <p>{{ order.shipping_address }}</p>
            <p>{{ order.shipping_zip }} {{ order.shipping_city }}</p>
            <p>{{ order.shipping_country }}</p>
          </div>
          <BasicText
            v-else
            color="neutral-500"
            size="body-s"
          >
            Aucune adresse renseignée
          </BasicText>

          <div class="card-actions">
            <PremiumButton
              label="Télécharger facture"
              size="sm"
              type="secondary"
              variant="outline"
              icon-left="Download"
              :loading="isDownloadingInvoice"
              @click="downloadInvoice"
            />
            <PremiumButton
              label="Copier lien de suivi"
              size="sm"
              type="secondary"
              variant="outline"
              icon-left="Link"
              @click="copyTrackingLink({ order_id: order.order_id })"
            />
          </div>
        </div>

        <div class="order-info-card">
          <BasicText
            size="h5"
            weight="bold"
            class="mb-2"
          >
            Paiement
          </BasicText>

          <div class="info-grid">
            <div class="info-item">
              <span class="label">Methode</span>
              <span class="value capitalize">{{ order.payment_method || '—' }}</span>
            </div>
          </div>

          <!-- Validation paiement manuel (Virement/Crypto) -->
          <div
            v-if="order.status === 'pending'"
            class="payment-validation"
          >
            <div class="payment-validation__header">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" class="payment-validation__icon">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
              </svg>
              <span>En attente de validation</span>
            </div>
            <p class="payment-validation__text">
              Avez-vous recu le paiement de <strong>{{ formatCurrency(order.total_amount ?? 0) }}</strong> via <strong>{{ order.payment_method }}</strong> ?
            </p>
            <PremiumButton
              label="Valider le paiement"
              type="success"
              size="sm"
              :loading="isValidatingPayment"
              @click="handleValidatePayment"
            />
          </div>
        </div>

        <div class="order-info-card">
          <BasicText
            size="h5"
            weight="bold"
            class="mb-3"
          >
            Suivi Livraison
          </BasicText>
          <div class="tracking-form">
            <BasicInput
              v-model="carrier"
              placeholder="Transporteur (ex: Colissimo)"
              size="small"
              :disabled="isSavingTracking"
            />
            <BasicInput
              v-model="trackingNumber"
              placeholder="N° de suivi"
              size="small"
              :disabled="isSavingTracking"
            />
            <PremiumButton
              label="Enregistrer"
              size="sm"
              type="primary"
              :loading="isSavingTracking"
              @click="handleAddTracking"
            />
          </div>

          <div
            v-if="order.tracking_number"
            class="tracking-display mt-3 rounded border border-green-100 bg-green-50 p-2"
          >
            <BasicText
              size="body-s"
              color="success-700"
            >
              Actuel :
              <strong>{{ order.carrier }}</strong>
              - {{ order.tracking_number }}
            </BasicText>
          </div>
        </div>

        <!-- Notes internes -->
        <div class="order-info-card border-amber-100 bg-amber-50" v-if="(order as any).internal_notes">
          <BasicText
            size="h5"
            weight="bold"
            class="mb-2"
            color="warning-800"
          >
            📝 Notes internes
          </BasicText>
          <div class="notes-block">
            {{ (order as any).internal_notes }}
          </div>
        </div>

        <div class="order-info-card border-blue-100 bg-blue-50">
          <BasicText
            size="h5"
            weight="bold"
            class="mb-3"
            color="primary-800"
          >
            Changer statut
          </BasicText>
          <div class="flex-gap-5 align-items-center flex">
            <BasicDropdown
              v-model="selectedStatus"
              :items="STATUSES"
              size="small"
              :disabled="isUpdatingStatus"
            />
            <PremiumButton
              label="Mettre à jour"
              type="primary"
              size="sm"
              :loading="isUpdatingStatus"
              @click="handleUpdateStatus"
            />
          </div>
        </div>

        <div class="order-products">
          <BasicText
            size="h5"
            weight="bold"
            class="mb-3"
          >
            Produits commandés
          </BasicText>

          <div class="products-table">
            <div class="table-header">
              <div class="col-name">Produit</div>
              <div class="col-qty">Qté</div>
              <div class="col-price">Prix U.</div>
              <div class="col-total">Total</div>
            </div>

            <div
              v-for="item in detailedItems"
              :key="item.product_id"
              class="table-row"
            >
              <div class="col-name">
                <div class="product-name">{{ item.product_name }}</div>
              </div>
              <div class="col-qty">{{ item.quantity }}</div>
              <div class="col-price">{{ formatCurrency(item.product_price) }}</div>
              <div class="col-total font-bold">
                {{ formatCurrency(item.total) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { useOrderActions } from '@/features/order/composables/useOrderActions'
  import { fetchOrderById } from '@/api/supabase/orders'
  import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
  import type { OrderItemDetailed, OrdersFullView } from '@/supabase/types/supabase.types' // ✅ Types V2
  import {
    formatCurrency,
    formatDate,
    getLabelBadge,
    getTypeBadge,
    type OrderStatus,
    STATUSES,
  } from '@/utils'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useLanguage } from '@/composables/useLanguage'

  const { t } = useLanguage()
  const visible = defineModel<boolean>()
  const props = defineProps<{ orderId: string }>()
  const toast = useToastStore()
  // 🆕 Ajout de copyTrackingLink
  const { changeOrderStatus, copyTrackingLink } = useOrderActions()

  // État local typé
  const order = ref<OrdersFullView | null>(null)
  const isLoading = ref(true)
  const isValidatingPayment = ref(false)
  const isUpdatingStatus = ref(false)
  const isSavingTracking = ref(false)
  const isDownloadingInvoice = ref(false)

  // Champs formulaire local
  const carrier = ref('')
  const trackingNumber = ref('')
  const selectedStatus = ref<OrderStatus>('pending')

  // --- COMPUTED HELPERS ---

  // Profile Info sécurisé (gestion du JSON)
  const profileInfo = computed(() => {
    if (!order.value) return { full_name: 'Inconnu', email: '-' }

    // 🛠️ CORRECTION : On casse le typage dès la racine pour éviter l'erreur de récursion
    const rawOrder = order.value as any
    const info = rawOrder.profile_info

    // 🆕 Si Guest, on utilise le nom/email du formulaire de commande
    if (rawOrder.is_guest_order) {
      return {
        full_name: rawOrder.customer_name || 'Invité',
        email: rawOrder.customer_email || '-',
      }
    }

    return {
      full_name: info?.full_name || 'Inconnu',
      email: info?.email || '-',
    }
  })

  // Items sécurisés (gestion du JSON)
  const detailedItems = computed<OrderItemDetailed[]>(() => {
    if (!order.value) return []

    // 🛠️ CORRECTION ULTIME :
    // On caste l'objet PARENT (order.value) en 'any' tout de suite.
    // Cela empêche TypeScript d'essayer de lire la définition complexe de 'order'
    const rawOrder = order.value as any

    return (rawOrder.detailed_items as OrderItemDetailed[]) || []
  })

  const shippingAddress = computed(() => {
    if (!order.value) return null
    const parts = [
      order.value.shipping_address,
      order.value.shipping_zip,
      order.value.shipping_city,
      order.value.shipping_country,
    ].filter(Boolean)
    return parts.length ? parts.join(', ') : null
  })

  // --- ACTIONS ---

  async function loadOrder() {
    if (!props.orderId) return
    isLoading.value = true
    try {
      // ✅ Utilisation de l'API centralisée
      const data = await fetchOrderById(props.orderId)
      if (data) {
        order.value = data
        carrier.value = data.carrier || ''
        trackingNumber.value = data.tracking_number || ''
        selectedStatus.value = (data.status as OrderStatus) || 'pending'
      }
    } catch (err) {
      console.error(err)
      toast.show('Erreur chargement commande', 'danger')
    } finally {
      isLoading.value = false
    }
  }
  const handleUpdateStatus = async () => {
    if (!order.value) return

    isUpdatingStatus.value = true
    try {
      // 1. Mise à jour DB (RPC) + Log historique
      await changeOrderStatus({ order_id: order.value.order_id }, selectedStatus.value)

      // 2. ENVOI EMAIL (Appel explicite à l'Edge Function)
      try {
        await supabase.functions.invoke('send-order-update', {
          body: {
            order_id: order.value.order_id,
            status: selectedStatus.value,
          },
        })
      } catch (e) {
        console.error('Erreur envoi email:', e)
        toast.show("Statut mis a jour, mais echec de l'envoi d'email", 'warning')
      }

      // 3. Rafraichissement UI
      await loadOrder()
    } finally {
      isUpdatingStatus.value = false
    }
  }

  // Validation paiement manuel (Virement/Crypto)
  const handleValidatePayment = async () => {
    if (!order.value) return

    isValidatingPayment.value = true
    try {
      // 1. Mise à jour du statut en DB
      await changeOrderStatus({ order_id: order.value.order_id }, 'processing')

      // 2. Envoi de l'email de confirmation de paiement
      try {
        await supabase.functions.invoke('send-order-update', {
          body: {
            order_id: order.value.order_id,
            status: 'processing',
          },
        })
        toast.show('Paiement validé - Email envoyé au client', 'success')
      } catch (e) {
        console.error('Erreur envoi email:', e)
        toast.show('Paiement validé, mais échec envoi email', 'warning')
      }

      await loadOrder()
    } catch (err: any) {
      console.error(err)
      toast.show(`Erreur validation : ${err.message}`, 'danger')
    } finally {
      isValidatingPayment.value = false
    }
  }

  // Dans src/features/admin/orders/modale/AdminOrderDetailsModal.vue

  const handleAddTracking = async () => {
    if (!carrier.value || !trackingNumber.value)
      return toast.show('Transporteur et suivi requis', 'warning')

    if (!order.value) return

    isSavingTracking.value = true
    try {
      // 1. Update DB
      const { error } = await supabase
        .from('orders')
        .update({
          carrier: carrier.value,
          tracking_number: trackingNumber.value,
          shipped_at: new Date().toISOString(),
          status: 'shipped', // On force le statut shipped
        })
        .eq('id', order.value.order_id!) // Utilise l'ID technique

      if (error) {
        toast.show('Erreur suivi', 'danger')
      } else {
        // 2. ENVOI EMAIL EXPÉDITION
        try {
          await supabase.functions.invoke('send-shipping-email', {
            body: { order_id: order.value.order_id },
          })
          toast.show('Suivi ajouté et email envoyé', 'success')
        } catch (e) {
          console.error('Erreur email tracking:', e)
          toast.show('Suivi enregistré, échec envoi email', 'warning')
        }

        await loadOrder()
      }
    } finally {
      isSavingTracking.value = false
    }
  }

  const downloadInvoice = async () => {
    if (!order.value) return

    isDownloadingInvoice.value = true
    try {
      const { data, error } = await supabase.functions.invoke('order-invoice', {
        body: { order_id: order.value.order_id },
      })

      if (error || !data?.pdf_base64) return toast.show('Erreur facture', 'danger')

      const link = document.createElement('a')
      link.href = `data:application/pdf;base64,${data.pdf_base64}`
      link.download = `facture_${order.value.order_number || 'commande'}.pdf`
      link.click()

      toast.show('Facture téléchargée', 'success')
    } finally {
      isDownloadingInvoice.value = false
    }
  }

  // --- WATCHERS ---

  watch(() => props.orderId, loadOrder)

  onMounted(loadOrder)
</script>

<style scoped lang="less">
  .order-detail {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 16px;
    overflow-x: hidden;
  }

  .order-info-card {
    position: relative;
    background: linear-gradient(135deg, @white 0%, @neutral-50 100%);
    padding: 24px;
    border-radius: 16px;
    border: 1px solid @neutral-200;
    display: flex;
    flex-direction: column;
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.04),
      0 1px 2px rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-300));
      border-radius: 16px 16px 0 0;
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover {
      box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.08),
        0 2px 6px rgba(0, 0, 0, 0.06);
      border-color: var(--primary-300);
      background: @white;

      &::before {
        opacity: 1;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid @neutral-100;

      .header-badges {
        display: flex;
        gap: 8px;
        align-items: center;
      }
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 24px;

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px;
      background: @neutral-50;
      border-radius: 8px;
      transition: all 0.2s;

      &:hover {
        background: rgba(var(--primary-500-rgb), 0.03);
      }

      &.col-span-2 {
        grid-column: span 2;
      }

      .label {
        font-size: 11px;
        color: var(--primary-600);
        text-transform: uppercase;
        letter-spacing: 0.8px;
        font-weight: 700;
      }

      .value {
        font-size: 14px;
        color: @neutral-900;
        font-weight: 500;
      }
    }
  }

  .payment-validation {
    margin-top: 16px;
    padding: 16px;
    background: linear-gradient(135deg, var(--warning-50) 0%, var(--warning-100) 100%);
    border: 2px solid var(--warning-300);
    border-radius: 12px;
    text-align: center;

    &__header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 12px;
      font-weight: 600;
      font-size: 14px;
      color: var(--warning-800);
    }

    &__icon {
      color: var(--warning-600);
      animation: pulse-icon 2s infinite;
    }

    &__text {
      font-size: 14px;
      color: var(--warning-900);
      margin-bottom: 16px;
      line-height: 1.5;

      strong {
        color: var(--warning-800);
      }
    }
  }

  @keyframes pulse-icon {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .address-block {
    padding: 16px;
    background: @neutral-50;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.6;
    color: @neutral-700;
    border-left: 3px solid var(--primary-500);
  }

  .financial-breakdown {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background: linear-gradient(135deg,
      rgba(var(--primary-500-rgb), 0.02) 0%,
      rgba(var(--secondary-500-rgb), 0.02) 100%);
    border-radius: 12px;
    border: 1px solid @neutral-200;

    .financial-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: @white;
      border-radius: 8px;
      transition: all 0.2s;

      &:hover {
        background: rgba(var(--primary-500-rgb), 0.05);
        border-left: 2px solid var(--primary-400);
      }

      .label {
        font-size: 13px;
        color: @neutral-700;
        font-weight: 500;
        letter-spacing: 0.3px;
      }

      .value {
        font-size: 15px;
        color: @neutral-900;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      &--total {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        border: none;
        padding: 14px 16px;
        margin-top: 8px;
        box-shadow:
          0 4px 12px rgba(var(--primary-500-rgb), 0.25),
          0 2px 4px rgba(var(--primary-500-rgb), 0.15);

        .label,
        .value {
          color: @white;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        &:hover {
          box-shadow:
            0 6px 16px rgba(var(--primary-500-rgb), 0.35),
            0 3px 6px rgba(var(--primary-500-rgb), 0.2);
          background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-500) 100%);
        }
      }
    }
  }

  .relay-block {
    padding: 16px;
    background: linear-gradient(135deg,
      rgba(var(--primary-500-rgb), 0.03) 0%,
      rgba(var(--primary-300-rgb), 0.05) 100%);
    border-radius: 12px;
    border: 2px solid var(--primary-200);
    font-size: 14px;
    line-height: 1.7;
    color: @neutral-800;
    box-shadow:
      0 2px 8px rgba(var(--primary-500-rgb), 0.1),
      0 1px 3px rgba(0, 0, 0, 0.05);

    p {
      margin: 4px 0;
      display: flex;
      align-items: center;
      gap: 8px;

      &.font-bold {
        color: var(--primary-700);
        font-size: 15px;
        margin-bottom: 8px;
      }

      &.text-xs {
        font-size: 12px;
        color: @neutral-600;
        font-family: 'Courier New', monospace;
      }
    }
  }

  .notes-block {
    padding: 16px;
    background: @white;
    border-radius: 12px;
    border-left: 4px solid var(--warning-500);
    font-size: 14px;
    line-height: 1.7;
    color: @neutral-800;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-shadow:
      0 2px 6px rgba(var(--warning-500-rgb), 0.08),
      0 1px 2px rgba(0, 0, 0, 0.04);
  }

  .tracking-form {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 12px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .products-table {
    border: 2px solid @neutral-200;
    border-radius: 12px;
    overflow: hidden;
    background: @white;

    .table-header {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr 1fr;
      background: linear-gradient(135deg, var(--secondary-900) 0%, var(--secondary-800) 100%);
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 700;
      color: @white;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .table-row {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr 1fr;
      padding: 14px 16px;
      font-size: 14px;
      align-items: center;
      border-bottom: 1px solid @neutral-100;
      transition: background 0.2s;

      &:hover {
        background: rgba(var(--primary-500-rgb), 0.02);
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .card-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 2px solid @neutral-100;

    button {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &:active {
        opacity: 0.9;
      }
    }
  }

  .order-products {
    animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
    animation-delay: 0.2s;
  }

  // Animation pour les cartes
  .order-info-card {
    animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;

    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.1s; }
    &:nth-child(3) { animation-delay: 0.15s; }
    &:nth-child(4) { animation-delay: 0.2s; }
    &:nth-child(5) { animation-delay: 0.25s; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // Responsive
  @media (max-width: 768px) {
    .order-detail {
      gap: 20px;
      padding: 4px;
    }

    .order-info-card {
      padding: 18px;
    }

    .info-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .products-table {
      .table-header,
      .table-row {
        grid-template-columns: 2fr 1fr 1fr;
        font-size: 12px;
      }

      .col-price {
        display: none;
      }
    }
  }
</style>
