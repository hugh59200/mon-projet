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
        <!-- ✅ Infos commande -->
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
              {{ order.profile_info?.full_name }}
            </BasicText>
            <BasicText>
              <b>Email :</b>
              {{ order.profile_info?.email }}
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

        <!-- ✅ Adresse de livraison -->
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
                v-if="isURL(order.tracking_number)"
                :href="order.tracking_number"
                target="_blank"
              >
                {{ order.tracking_number }}
              </BasicLink>
              <span v-else>{{ order.tracking_number }}</span>
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
          v-if="emails.length"
          class="order-info-card"
        >
          <BasicText
            size="h5"
            weight="bold"
          >
            Historique des e-mails
          </BasicText>
          <div class="gridElemWrapper">
            <div class="cardLayoutWrapper cardLayoutWrapper--header">
              <BasicCell
                :span="12"
                text="Type"
              />
              <BasicCell
                :span="12"
                text="Date"
                center
              />
              <BasicCell
                :span="12"
                text="Statut"
                center
              />
            </div>
          </div>
          <div
            v-for="mail in emails"
            :key="mail.id"
            class="gridElemWrapper"
          >
            <div class="cardLayoutWrapper">
              <BasicCell :span="12">
                <BasicText>{{ getLabel(mail.type) }}</BasicText>
              </BasicCell>
              <BasicCell
                :span="12"
                center
              >
                <BasicText>{{ formatDate(mail.sent_at) }}</BasicText>
              </BasicCell>
              <BasicCell
                :span="12"
                center
              >
                <BasicBadge
                  :label="getLabel(mail.status)"
                  :type="getBadge(mail.status)"
                  size="small"
                />
              </BasicCell>
            </div>
          </div>
        </div>
        <div
          v-if="order?.detailed_items"
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
                center
                text="Qté"
              />
              <BasicCell
                :span="8"
                center
                text="Prix"
              />
              <BasicCell
                :span="8"
                center
                text="Total"
              />
            </div>
          </div>
          <div
            v-for="item in detailedItems"
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
                <BasicText>{{ Number(item.product_price || 0).toFixed(2) }}€</BasicText>
              </BasicCell>
              <BasicCell
                :span="8"
                center
              >
                <BasicText>
                  {{ (Number(item.product_price || 0) * Number(item.quantity || 0)).toFixed(2) }}€
                </BasicText>
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
  import { supabase } from '@/supabase/supabaseClient'
  import type { Tables } from '@/supabase/types/supabase'
  import { type DetailedItem, type EmailSent } from '@/supabase/types/supabase.types'
  import { formatCurrency, formatDate } from '@/utils'
  import { getBadge, getLabel, STATUSES, type OrderStatus } from '@/utils/status'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, onMounted, ref, watch, type Ref } from 'vue'

  export type OrderFull = Tables<'orders_full_view'> & {
    profile_info: {
      full_name: string
      email: string
    } | null

    detailed_items: DetailedItem[]
  }

  const visible = defineModel<boolean>()
  const props = defineProps<{ orderId: string }>()
  const toast = useToastStore()

  const order = ref(null) as Ref<OrderFull | null>
  const emails = ref<EmailSent[]>([])
  const carrier = ref('')
  const trackingNumber = ref('')
  const selectedStatus = ref<OrderStatus>('pending')

  const detailedItems = computed<DetailedItem[]>(() => order.value?.detailed_items ?? [])

  const stripeLink = computed(() =>
    order.value?.stripe_session_id
      ? `https://dashboard.stripe.com/payments/${order.value.stripe_session_id}`
      : null,
  )

  const shippingAddress = computed(() => {
    const o = order.value
    if (!o) return null
    const parts = [o.shipping_address, o.shipping_zip, o.shipping_city, o.shipping_country].filter(
      Boolean,
    )
    return parts.length ? parts.join(', ') : null
  })

  function isURL(v: string) {
    try {
      new URL(v)
      return true
    } catch {
      return false
    }
  }

  async function loadOrder() {
    const { data, error } = await supabase
      .from('orders_full_view')
      .select('*')
      .eq('order_id', props.orderId)
      .single()

    if (error || !data) {
      toast.show('Erreur de chargement', 'danger')
      return
    }

    order.value = {
      ...data,
      profile_info:
        typeof data.profile_info === 'object' && data.profile_info !== null
          ? (data.profile_info as { full_name: string; email: string })
          : { full_name: 'Inconnu', email: '-' },

      detailed_items: Array.isArray(data.detailed_items)
        ? (data.detailed_items as DetailedItem[])
        : [],
    }

    selectedStatus.value = (order.value.status ?? 'pending') as OrderStatus
  }

  async function loadEmails() {
    const { data } = await supabase
      .from('emails_sent')
      .select('*')
      .eq('order_id', props.orderId)
      .order('sent_at', { ascending: false })

    emails.value = (data || []) as EmailSent[]
  }

  async function handleUpdateStatus() {
    if (!order.value) return

    const { error } = await supabase
      .from('orders')
      .update({ status: selectedStatus.value })
      .eq('id', order.value.order_id!)

    error ? toast.show('Erreur ⚠️', 'danger') : toast.show('Statut mis à jour ✅', 'success')
  }

  async function handleAddTracking() {
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

    error ? toast.show('Erreur suivi', 'danger') : toast.show('Suivi ajouté ✅', 'success')
  }

  async function resendConfirmation() {
    if (!order.value) return

    const { error } = await supabase.functions.invoke('order-confirmation', {
      body: { order_id: order.value.order_id },
    })

    error ? toast.show('Erreur email', 'danger') : toast.show('Email renvoyé ✅', 'success')
  }

  async function downloadInvoice() {
    if (!order.value) return

    const { data, error } = await supabase.functions.invoke('order-invoice', {
      body: { order_id: order.value.order_id },
    })

    if (error || !data?.pdf_base64) return toast.show('Erreur facture', 'danger')

    const link = document.createElement('a')
    link.href = `data:application/pdf;base64,${data.pdf_base64}`
    link.download = `facture_${order.value.order_id}.pdf`
    link.click()

    toast.show('Facture téléchargée ✅', 'success')
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
