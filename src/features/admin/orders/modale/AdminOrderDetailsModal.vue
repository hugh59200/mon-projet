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
              {{ order.profile_info.full_name }}
            </BasicText>
            <BasicText>
              <b>Email :</b>
              {{ order.profile_info.email }}
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
              :label="getStatusLabel(order.status!)"
              :type="getStatusColor(order.status!)"
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

          <BasicText v-if="shippingAddress">
            {{ shippingAddress }}
          </BasicText>

          <BasicText
            v-else
            color="neutral-600"
            size="body-s"
          >
            Aucune adresse renseignée
          </BasicText>
        </div>

        <!-- ✅ Paiement Stripe -->
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

        <!-- ✅ Suivi Livraison -->
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

        <!-- ✅ Modifier statut -->
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

        <!-- ✅ Historique des e-mails -->
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
                :span="10"
                text="Type"
              />
              <BasicCell
                :span="6"
                text="Date"
                center
              />
              <BasicCell
                :span="4"
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
              <BasicCell :span="10">
                <BasicText>{{ mail.type }}</BasicText>
              </BasicCell>

              <BasicCell
                :span="6"
                center
              >
                <BasicText>{{ formatDate(mail.sent_at) }}</BasicText>
              </BasicCell>

              <BasicCell
                :span="4"
                center
              >
                <BasicBadge
                  :type="mail.status === 'sent' ? 'success' : ('danger' as BadgeType)"
                  size="small"
                  :label="mail.status!"
                />
              </BasicCell>
            </div>
          </div>
        </div>

        <!-- ✅ Produits commandés -->
        <div
          v-if="order?.items?.length"
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
                :span="10"
                text="Produit"
              />
              <BasicCell
                :span="4"
                center
                text="Qté"
              />
              <BasicCell
                :span="5"
                center
                text="Prix"
              />
              <BasicCell
                :span="5"
                center
                text="Total"
              />
            </div>
          </div>

          <div
            v-for="item in order.items"
            :key="item.id"
            class="gridElemWrapper"
          >
            <div class="cardLayoutWrapper">
              <BasicCell :span="10">
                <BasicText>{{ item.name }}</BasicText>
              </BasicCell>

              <BasicCell
                :span="4"
                center
              >
                <BasicText>{{ item.quantity }}</BasicText>
              </BasicCell>

              <BasicCell
                :span="5"
                center
              >
                <BasicText>{{ Number(item.price || 0).toFixed(2) }}€</BasicText>
              </BasicCell>

              <BasicCell
                :span="5"
                center
              >
                <BasicText>
                  {{ (Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2) }}€
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
  import { type EmailSent, type OrderFull } from '@/supabase/types/supabase.types'
  import { formatCurrency, formatDate } from '@/utils'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import type { BadgeType } from '@designSystem/index'
  import { computed, onMounted, ref, watch, type Ref } from 'vue'

  const visible = defineModel<boolean>()
  const props = defineProps<{ orderId: string }>()

  const toast = useToastStore()
  const order = ref(null) as Ref<OrderFull | null>
  const emails = ref<EmailSent[]>([])
  const carrier = ref('')
  const trackingNumber = ref('')
  const selectedStatus = ref('')

  // ✅ Liste statuts
  const STATUSES = [
    { value: 'pending', label: 'En attente', color: 'warning' },
    { value: 'confirmed', label: 'Confirmée', color: 'success' },
    { value: 'shipped', label: 'Expédiée', color: 'info' },
    { value: 'completed', label: 'Terminée', color: 'neutral' },
    { value: 'canceled', label: 'Annulée', color: 'danger' },
  ]

  // ✅ Stripe link
  const stripeLink = computed(() =>
    order.value?.stripe_session_id
      ? `https://dashboard.stripe.com/payments/${order.value.stripe_session_id}`
      : null,
  )

  // ✅ Adresse formatée (correcte pour orders_full_view)
  const shippingAddress = computed(() => {
    const o = order.value
    if (!o) return null
    const parts = [o.shipping_address, o.shipping_zip, o.shipping_city, o.shipping_country].filter(
      Boolean,
    )
    return parts.length ? parts.join(', ') : null
  })

  // ✅ Helpers
  function getStatusLabel(v: string) {
    return STATUSES.find((s) => s.value === v)?.label || v
  }
  function getStatusColor(v: string): BadgeType {
    return (STATUSES.find((s) => s.value === v)?.color || 'neutral') as BadgeType
  }

  function isURL(v: string) {
    try {
      new URL(v)
      return true
    } catch {
      return false
    }
  }

  // ✅ Load Order (TYPE SAFE)
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

    order.value = data as OrderFull

    // ✅ items est nullable => on le sécurise
    order.value.items = (Array.isArray(order.value.items) ? order.value.items : []) as {
      id?: string
      name: string
      quantity: number
      price: number
    }[]

    selectedStatus.value = order.value.status || 'pending'
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

  // ✅ Download invoice
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

  // ✅ refresh on prop change
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

  .text-link {
    color: @primary-600;
    text-decoration: underline;
  }

  .order-products {
    margin-top: 10px;
  }
</style>
