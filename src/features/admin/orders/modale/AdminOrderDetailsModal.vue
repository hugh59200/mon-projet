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
        <!-- ✅ Bloc Infos -->
        <div
          v-if="order"
          class="order-block"
        >
          <div class="order-grid">
            <div>
              <BasicText>
                <b>Nom :</b>
                {{ order.full_name }}
              </BasicText>
              <BasicText>
                <b>Email :</b>
                {{ order.email }}
              </BasicText>
              <BasicText>
                <b>Date :</b>
                {{ formatDate(order.created_at) }}
              </BasicText>
            </div>
            <div>
              <BasicText>
                <b>Total :</b>
                {{ formatCurrency(order.total_amount) }}
              </BasicText>
              <div class="status-row">
                <BasicText><b>Statut :</b></BasicText>
                <BasicBadge
                  :label="getStatusLabel(order.status)"
                  :type="getStatusColor(order.status)"
                  size="small"
                />
              </div>
              <BasicText
                size="body-s"
                color="neutral-600"
              >
                <b>ID :</b>
                {{ order.id }}
              </BasicText>
            </div>
          </div>
          <div class="meta-section">
            <BasicText
              size="body-m"
              weight="bold"
            >
              Paiement Stripe
            </BasicText>
            <BasicText
              size="body-s"
              color="neutral-600"
            >
              <b>Session :</b>
              <a
                v-if="order.stripe_session_id"
                :href="stripeLink!"
                target="_blank"
                class="text-link"
              >
                Voir dans Stripe
              </a>
              <span v-else>—</span>
            </BasicText>

            <BasicText
              size="body-s"
              color="neutral-600"
            >
              <b>Payment Intent :</b>
              {{ order.payment_intent_id || '—' }}
            </BasicText>

            <BasicButton
              label="Renvoyer l'email de confirmation"
              type="secondary"
              size="small"
              @click="resendConfirmation"
            />
          </div>

          <!-- ✅ Suivi livraison -->
          <div class="meta-section">
            <BasicText
              size="body-m"
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
              type="primary"
              size="small"
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
                  class="text-link"
                >
                  {{ order.tracking_number }}
                </BasicLink>
                <span v-else>{{ order.tracking_number }}</span>
              </BasicText>
            </div>
          </div>
          <div class="meta-section">
            <BasicText
              size="body-m"
              weight="bold"
            >
              Modifier le statut
            </BasicText>
            <BasicDropdown
              v-model="selectedStatus"
              :items="[...STATUSES]"
              dropdown-type="table"
            />
            <BasicButton
              label="Mettre à jour"
              type="secondary"
              size="small"
              variant="outlined"
              @click="handleUpdateStatus"
            />
          </div>
        </div>
        <div
          v-else
          class="order-loading"
        >
          <BasicLoader />
        </div>
        <!-- ✅ Produits commandés (version style tableau Admin) -->
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

          <!-- ✅ En-tête -->
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

          <!-- ✅ Lignes produits -->
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
                <BasicText>{{ item.price.toFixed(2) }}€</BasicText>
              </BasicCell>

              <BasicCell
                :span="5"
                center
              >
                <BasicText>{{ (item.price * item.quantity).toFixed(2) }}€</BasicText>
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
  import { formatCurrency, formatDate } from '@/utils/index'
  import BasicBadge from '@designSystem/components/basic/badge/BasicBadge.vue'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import type { BadgeType } from '@designSystem/index'
  import { computed, onMounted, ref, watch } from 'vue'

  const visible = defineModel<boolean>()
  const props = defineProps<{ orderId: string }>()
  const toast = useToastStore()

  const order = ref<any>(null)
  const carrier = ref('')
  const trackingNumber = ref('')
  const selectedStatus = ref('')

  const STATUSES = [
    { value: 'pending', label: 'En attente', color: 'warning' },
    { value: 'confirmed', label: 'Confirmée', color: 'success' },
    { value: 'shipped', label: 'Expédiée', color: 'info' },
    { value: 'completed', label: 'Terminée', color: 'neutral' },
    { value: 'canceled', label: 'Annulée', color: 'danger' },
  ]

  const stripeLink = computed(() =>
    order.value?.stripe_session_id
      ? `https://dashboard.stripe.com/payments/${order.value.stripe_session_id}`
      : null,
  )

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

    order.value = data
    order.value.items =
      typeof data.detailed_items === 'string'
        ? JSON.parse(data.detailed_items)
        : data.detailed_items

    selectedStatus.value = order.value.status
  }

  async function handleUpdateStatus() {
    const { error } = await supabase
      .from('orders')
      .update({ status: selectedStatus.value })
      .eq('id', order.value.order_id ?? order.value.id)

    if (error) toast.show('Erreur ⚠️', 'danger')
    else toast.show('Statut mis à jour ✅', 'success')
  }

  async function handleAddTracking() {
    if (!carrier.value || !trackingNumber.value)
      return toast.show('Transporteur et suivi requis', 'warning')

    const { error } = await supabase
      .from('orders')
      .update({
        carrier: carrier.value,
        tracking_number: trackingNumber.value,
        shipped_at: new Date().toISOString(),
        status: 'shipped',
      })
      .eq('id', order.value.id)

    if (error) toast.show('Erreur suivi', 'danger')
    else toast.show('Suivi ajouté ✅', 'success')
  }

  async function resendConfirmation() {
    const { error } = await supabase.functions.invoke('order-confirmation', {
      body: { order_id: order.value.id },
    })

    if (error) toast.show('Erreur email', 'danger')
    else toast.show('Email renvoyé ✅', 'success')
  }

  watch(() => props.orderId, loadOrder)
  onMounted(loadOrder)
</script>

<style scoped lang="less">
  .order-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .order-block {
    background: @neutral-100;
    padding: 18px;
    border-radius: 10px;
  }
  .order-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .status-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .text-link {
    color: @primary-600;
    text-decoration: underline;
    cursor: pointer;
  }
  .meta-section {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid @neutral-200;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .order-products table {
    width: 100%;
    border-collapse: collapse;
  }
  .order-products th,
  .order-products td {
    border-bottom: 1px solid @neutral-200;
    padding: 6px;
  }
</style>
