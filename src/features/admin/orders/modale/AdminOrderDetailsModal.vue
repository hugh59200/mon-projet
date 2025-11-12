<template>
  <ModalComponent
    v-model="visible"
    :closable="true"
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
      <div class="order-detail">
        <div
          v-if="order"
          class="order-info-card"
        >
          <BasicText
            size="h5"
            weight="bold"
          >
            Informations commande
          </BasicText>
          <div class="info-row">
            <BasicText>
              <b>Client :</b>
              {{ safeProfile.full_name }}
            </BasicText>
            <BasicText>
              <b>Email :</b>
              {{ safeProfile.email }}
            </BasicText>
          </div>
          <div class="info-row">
            <BasicText>
              <b>Date :</b>
              {{ formatDate(order.created_at) }}
            </BasicText>
            <BasicText>
              <b>Total :</b>
              {{ formatCurrency(order.total_amount) }}
            </BasicText>
          </div>
          <div class="info-row">
            <BasicText><b>Statut :</b></BasicText>
            <BasicBadge
              :label="getLabel(order.status)"
              :type="getBadge(order.status)"
              size="small"
            />
          </div>
          <div class="info-row">
            <BasicText>
              <b>ID :</b>
              {{ order.order_id }}
            </BasicText>
          </div>
          <BasicButton
            label="Télécharger la facture"
            size="small"
            type="primary"
            icon-name="Download"
            @click="downloadInvoice"
          />
        </div>
        <div
          v-if="order"
          class="order-info-card"
        >
          <BasicText
            size="h5"
            weight="bold"
          >
            Adresse de livraison
          </BasicText>
          <BasicText v-if="shippingAddress">{{ shippingAddress }}</BasicText>
          <BasicText
            v-else
            color="neutral-600"
            size="body-s"
          >
            Aucune adresse renseignée
          </BasicText>
        </div>
        <div
          v-if="order"
          class="order-info-card"
        >
          <BasicText
            size="h5"
            weight="bold"
          >
            Paiement Stripe
          </BasicText>

          <div class="info-row">
            <BasicText><b>Session :</b></BasicText>
            <template v-if="order.stripe_session_id">
              <BasicLink
                :href="stripeLink!"
                target="_blank"
              >
                {{ order.stripe_session_id }}
              </BasicLink>
            </template>
            <span v-else>—</span>
          </div>
          <div class="info-row">
            <BasicText>
              <b>Payment Intent :</b>
              {{ order.payment_intent_id || '—' }}
            </BasicText>
          </div>
          <BasicButton
            label="Renvoyer l'email de confirmation"
            type="secondary"
            size="small"
            @click="resendConfirmation"
          />
        </div>
        <div
          v-if="order"
          class="order-info-card"
        >
          <BasicText
            size="h5"
            weight="bold"
          >
            Suivi livraison
          </BasicText>
          <BasicInput
            v-model="carrier"
            placeholder="Transporteur"
          />
          <BasicInput
            v-model="trackingNumber"
            placeholder="Numéro ou lien"
          />
          <BasicButton
            label="Enregistrer"
            size="small"
            type="primary"
            @click="handleAddTracking"
          />
          <div
            v-if="order.tracking_number"
            class="tracking-line"
          >
            <BasicText size="body-s">
              <b>Suivi :</b>
              <BasicLink
                :href="order.tracking_number"
                target="_blank"
              >
                {{ order.tracking_number }}
              </BasicLink>
            </BasicText>
          </div>
        </div>
        <div
          v-if="order"
          class="order-info-card"
        >
          <BasicText
            size="h5"
            weight="bold"
          >
            Modifier le statut
          </BasicText>

          <BasicDropdown
            v-model="selectedStatus"
            :items="STATUSES"
            dropdown-type="table"
          />

          <BasicButton
            label="Mettre à jour"
            size="small"
            type="secondary"
            variant="outlined"
            @click="handleUpdateStatus"
          />
        </div>
        <div
          v-if="order"
          class="order-products"
        >
          <BasicText
            size="h5"
            weight="bold"
          >
            Produits commandés
          </BasicText>
          <div class="gridElemWrapper">
            <div class="cardLayoutWrapper cardLayoutWrapper--header">
              <BasicCell
                :span="14"
                text="Produit"
              />
              <BasicCell
                :span="6"
                text="Qté"
                center
              />
              <BasicCell
                :span="8"
                text="Prix"
                center
              />
              <BasicCell
                :span="8"
                text="Total"
                center
              />
            </div>
          </div>
          <div
            v-for="item in order.detailed_items"
            :key="item.product_id"
            class="gridElemWrapper"
          >
            <div class="cardLayoutWrapper">
              <BasicCell :span="14">
                <BasicText>{{ item.product_name }}</BasicText>
              </BasicCell>
              <BasicCell
                :span="6"
                center
              >
                <BasicText>{{ item.quantity }}</BasicText>
              </BasicCell>
              <BasicCell
                :span="8"
                center
              >
                <BasicText>{{ Number(item.product_price).toFixed(2) }}€</BasicText>
              </BasicCell>
              <BasicCell
                :span="8"
                center
              >
                <BasicText>{{ (item.product_price * item.quantity).toFixed(2) }}€</BasicText>
              </BasicCell>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { useOrderActions } from '@/supabase/actions/useOrderActions'
  import { supabase } from '@/supabase/supabaseClient'
  import type { EmailSent, OrdersFullView } from '@/supabase/types/supabase.types'
  import { formatCurrency, formatDate } from '@/utils'
  import { getBadge, getLabel, type OrderStatus, STATUSES } from '@/utils/mappingBadge'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, onMounted, ref, watch } from 'vue'

  type ProfileInfoSafe = {
    full_name: string
    email: string
  }

  type OrderItemSafe = {
    product_id: string
    product_name: string
    product_price: number
    quantity: number
  }

  type OrdersFullViewSafe = Omit<OrdersFullView, 'profile_info' | 'detailed_items'> & {
    profile_info: ProfileInfoSafe
    detailed_items: OrderItemSafe[]
  }

  const visible = defineModel<boolean>()
  const props = defineProps<{ orderId: string }>()
  const toast = useToastStore()
  const { changeOrderStatus } = useOrderActions()

  const order = ref<OrdersFullViewSafe | null>(null)
  const emails = ref<EmailSent[]>([])
  const carrier = ref('')
  const trackingNumber = ref('')
  const selectedStatus = ref<OrderStatus>('pending')

  const safeProfile = computed<ProfileInfoSafe>(() => {
    const p = order.value?.profile_info
    return {
      full_name: p?.full_name || 'Inconnu',
      email: p?.email || '-',
    }
  })

  const stripeLink = computed(() =>
    order.value?.stripe_session_id
      ? `https://dashboard.stripe.com/payments/${order.value.stripe_session_id}`
      : null,
  )

  const shippingAddress = computed(() => {
    if (!order.value) return null
    const p = [
      order.value.shipping_address,
      order.value.shipping_zip,
      order.value.shipping_city,
      order.value.shipping_country,
    ].filter(Boolean)
    return p.length ? p.join(', ') : null
  })

  async function loadOrder() {
    const { data, error } = await supabase
      .from('orders_full_view')
      .select('*')
      .eq('order_id', props.orderId)
      .single()

    if (error || !data) return

    order.value = {
      ...data,
      profile_info: toProfileInfo(data.profile_info),
      detailed_items: toDetailedItems(data.detailed_items),
    } as OrdersFullViewSafe
  }

  function toProfileInfo(json: unknown): ProfileInfoSafe {
    if (json && typeof json === 'object') {
      const obj = json as Record<string, unknown>
      return {
        full_name: typeof obj.full_name === 'string' ? obj.full_name : 'Inconnu',
        email: typeof obj.email === 'string' ? obj.email : '-',
      }
    }
    return { full_name: 'Inconnu', email: '-' }
  }

  function toDetailedItems(json: unknown): OrderItemSafe[] {
    if (Array.isArray(json)) {
      return json.map((i) => ({
        product_id: String(i.product_id ?? ''),
        product_name: String(i.product_name ?? ''),
        product_price: Number(i.product_price ?? 0),
        quantity: Number(i.quantity ?? 0),
      }))
    }
    return []
  }

  async function loadEmails() {
    const { data } = await supabase
      .from('emails_sent')
      .select('*')
      .eq('order_id', props.orderId)
      .order('sent_at', { ascending: false })

    emails.value = data ?? []
  }

  const handleUpdateStatus = async () => {
    if (!order.value) return

    await changeOrderStatus({ order_id: order.value.order_id }, selectedStatus.value)

    toast.show('Statut mis à jour ✅', 'success')

    await loadOrder()
    await loadEmails()
  }

  const handleAddTracking = async () => {
    if (!carrier.value || !trackingNumber.value)
      return toast.show('Transporteur et suivi requis', 'warning')

    if (!order.value) return

    const { error } = await supabase
      .from('orders')
      .update({
        carrier: carrier.value,
        tracking_number: trackingNumber.value,
        shipped_at: new Date().toISOString(),
        status: 'shipped',
      })
      .eq('id', order.value.order_id!)

    if (error) {
      toast.show('Erreur suivi ❌', 'danger')
    } else {
      toast.show('Suivi ajouté ✅', 'success')
      await loadOrder()
      await loadEmails()
    }
  }

  const resendConfirmation = async () => {
    if (!order.value) return

    const { error } = await supabase.functions.invoke('order-confirmation', {
      body: { order_id: order.value.order_id },
    })

    if (error) {
      toast.show('Erreur email ❌', 'danger')
    } else {
      toast.show('Email renvoyé ✅', 'success')
      await loadEmails()
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
    link.download = `facture_${order.value.order_id}.pdf`
    link.click()

    toast.show('Facture téléchargée ✅', 'success')

    await loadEmails()
  }

  watch(
    () => props.orderId,
    () => {
      loadOrder()
      loadEmails()
    },
  )

  onMounted(() => {
    loadOrder()
    loadEmails()
  })
</script>

<style scoped lang="less">
  .order-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .order-info-card {
    background: @neutral-100;
    padding: 18px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
  }
  .order-products {
    margin-top: 10px;
  }
</style>
