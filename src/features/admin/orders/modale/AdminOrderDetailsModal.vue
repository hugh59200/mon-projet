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
        Détails de la commande
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
              <span class="label">Client</span>
              <span class="value">{{ profileInfo.full_name }}</span>
            </div>
            <div class="info-item">
              <span class="label">Email</span>
              <span class="value">
                {{
                  order.is_guest_order
                    ? (order as any).customer_email || profileInfo.email
                    : profileInfo.email
                }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">Date</span>
              <span class="value">{{ formatDate(order.created_at!) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Total</span>
              <span class="value text-primary-700 font-bold">
                {{ formatCurrency(order.total_amount ?? 0) }}
              </span>
            </div>
            <div class="info-item col-span-2">
              <span class="label">ID Commande</span>
              <span class="value font-mono text-xs">
                {{ order.order_number || order.order_id }}
              </span>
            </div>
          </div>

          <div class="card-actions">
            <BasicButton
              label="Télécharger facture"
              size="small"
              type="secondary"
              variant="outlined"
              icon-name="Download"
              @click="downloadInvoice"
            />
            <BasicButton
              label="Copier lien de suivi"
              size="small"
              type="secondary"
              variant="outlined"
              icon-name="Link"
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
            Adresse de livraison
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
              <span class="label">Méthode</span>
              <span class="value capitalize">{{ order.payment_method || '—' }}</span>
            </div>
            <div
              class="info-item"
              v-if="order.stripe_session_id"
            >
              <span class="label">Session Stripe</span>
              <BasicLink
                :href="stripeLink!"
                target="_blank"
                class="text-xs"
              >
                {{ order.stripe_session_id.slice(0, 12) }}...
              </BasicLink>
            </div>
            <div
              class="info-item"
              v-if="order.paypal_order_id"
            >
              <span class="label">ID PayPal</span>
              <span class="value text-xs">{{ order.paypal_order_id }}</span>
            </div>
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
            />
            <BasicInput
              v-model="trackingNumber"
              placeholder="N° de suivi"
              size="small"
            />
            <BasicButton
              label="Enregistrer"
              size="small"
              type="primary"
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
            />
            <BasicButton
              label="Mettre à jour"
              type="primary"
              size="small"
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

  const visible = defineModel<boolean>()
  const props = defineProps<{ orderId: string }>()
  const toast = useToastStore()
  // 🆕 Ajout de copyTrackingLink
  const { changeOrderStatus, copyTrackingLink } = useOrderActions()

  // État local typé
  const order = ref<OrdersFullView | null>(null)
  const isLoading = ref(true)

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

  const stripeLink = computed(() =>
    order.value?.stripe_session_id
      ? `https://dashboard.stripe.com/payments/${order.value.stripe_session_id}`
      : null,
  )

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

    // 1. Mise à jour DB (RPC) + Log historique
    await changeOrderStatus({ order_id: order.value.order_id }, selectedStatus.value)

    // 2. ✅ ENVOI EMAIL (Appel explicite à l'Edge Function)
    try {
      await supabase.functions.invoke('send-order-update', {
        body: {
          order_id: order.value.order_id,
          status: selectedStatus.value,
        },
      })
      // Note: Le toast de succès est déjà affiché par changeOrderStatus
    } catch (e) {
      console.error('Erreur envoi email:', e)
      toast.show("Statut mis à jour, mais échec de l'envoi d'email", 'warning')
    }

    // 3. Rafraîchissement UI
    await loadOrder()
    // await loadEmails() // Si tu as cette fonction pour lister les mails envoyés
  }

  // Dans src/features/admin/orders/modale/AdminOrderDetailsModal.vue

  const handleAddTracking = async () => {
    if (!carrier.value || !trackingNumber.value)
      return toast.show('Transporteur et suivi requis', 'warning')

    if (!order.value) return

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
      toast.show('Erreur suivi ❌', 'danger')
    } else {
      // 2. ✅ ENVOI EMAIL EXPÉDITION (Nouveau)
      try {
        // On utilise l'Edge Function dédiée (ou send-order-update si tu préfères)
        await supabase.functions.invoke('send-shipping-email', {
          body: { order_id: order.value.order_id },
        })
        toast.show('Suivi ajouté et email envoyé ✅', 'success')
      } catch (e) {
        console.error('Erreur email tracking:', e)
        toast.show('Suivi enregistré, échec envoi email', 'warning')
      }

      await loadOrder()
    }
  }

  const downloadInvoice = async () => {
    if (!order.value) return

    const { data, error } = await supabase.functions.invoke('order-invoice', {
      body: { order_id: order.value.order_id },
    })

    if (error || !data?.pdf_base64) return toast.show('Erreur facture ❌', 'danger')

    const link = document.createElement('a')
    link.href = `data:application/pdf;base64,${data.pdf_base64}`
    link.download = `facture_${order.value.order_number || 'commande'}.pdf`
    link.click()

    toast.show('Facture téléchargée ✅', 'success')
  }

  // --- WATCHERS ---

  watch(() => props.orderId, loadOrder)

  onMounted(loadOrder)
</script>

<style scoped lang="less">
  .order-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .order-info-card {
    background: @white;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid @neutral-200;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid @neutral-100;

      .header-badges {
        display: flex;
        gap: 8px; /* Espace entre le badge Invité et le badge Statut */
        align-items: center;
      }
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 24px;

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 2px;

      &.col-span-2 {
        grid-column: span 2;
      }

      .label {
        font-size: 12px;
        color: @neutral-500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .value {
        font-size: 14px;
        color: @neutral-900;
      }
    }
  }

  .address-block {
    font-size: 14px;
    line-height: 1.5;
    color: @neutral-700;
  }

  .tracking-form {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 10px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .products-table {
    border: 1px solid @neutral-200;
    border-radius: 8px;
    overflow: hidden;

    .table-header {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr 1fr;
      background: @neutral-50;
      padding: 10px 12px;
      font-size: 12px;
      font-weight: bold;
      color: @neutral-600;
      border-bottom: 1px solid @neutral-200;
    }

    .table-row {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr 1fr;
      padding: 12px;
      font-size: 14px;
      align-items: center;
      border-bottom: 1px solid @neutral-100;

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .card-actions {
    display: flex;
    gap: 10px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid @neutral-100;
  }
</style>
