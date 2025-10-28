<template>
  <ModalComponent
    v-model="visible"
    :closable="true"
  >
    <template #header>Détails de la commande</template>
    <template #content>
      <div class="order-detail order-detail--compact">
        <!-- Bloc 1 : Infos + statut + livraison -->
        <div
          class="order-detail__info"
          v-if="order"
        >
          <div class="order-detail__grid">
            <div>
              <p>
                <b>Nom :</b>
                {{ order.full_name }}
              </p>
              <p>
                <b>Email :</b>
                {{ order.email }}
              </p>
              <p>
                <b>Date :</b>
                {{ formatDate(order.created_at) }}
              </p>
            </div>

            <div>
              <p>
                <b>Total :</b>
                {{ formatCurrency(order.total_amount) }}
              </p>
              <p class="status-line">
                <b>Statut :</b>
                <BasicBadge
                  :label="getStatusLabel(order.status)"
                  :type="getStatusColor(order.status)"
                  size="small"
                />
              </p>
              <p class="order-id">
                <b>ID :</b>
                {{ order.id }}
              </p>
            </div>
          </div>

          <div class="order-status-line">
            <label><b>Modifier le statut :</b></label>
            <select v-model="selectedStatus">
              <option
                v-for="s in STATUSES"
                :key="s.value"
                :value="s.value"
              >
                {{ s.label }}
              </option>
            </select>
            <BasicButton
              label="Mettre à jour"
              type="secondary"
              variant="outlined"
              size="small"
              @click="handleUpdateStatus"
            />
          </div>

          <div class="order-shipment">
            <label><b>Suivi :</b></label>
            <input
              v-model="carrier"
              placeholder="Transporteur"
              type="text"
            />
            <input
              v-model="trackingNumber"
              placeholder="Numéro ou lien"
              type="text"
            />
            <BasicButton
              label="OK"
              type="primary"
              size="small"
              @click="handleAddTracking"
            />
          </div>
        </div>

        <div
          v-else
          class="order-detail__loading"
        >
          <BasicLoader />
        </div>

        <!-- Bloc 2 : Produits -->
        <div
          v-if="order?.items?.length"
          class="order-detail__products"
        >
          <h5>Produits commandés</h5>
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Qté</th>
                <th>Prix</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in order.items"
                :key="item.id"
              >
                <td>{{ item.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.price.toFixed(2) }}</td>
                <td>{{ (item.price * item.quantity).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { supabase } from '@/services/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import type { BadgeType } from '@designSystem/index'
  import { onMounted, ref, watch } from 'vue'

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

  function getStatusLabel(v: string) {
    return STATUSES.find((s) => s.value === v)?.label || v
  }
  function getStatusColor(v: string): BadgeType {
    return (STATUSES.find((s) => s.value === v)?.color || 'neutral') as BadgeType
  }

  async function loadOrder() {
    if (!props.orderId) return
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', props.orderId)
      .single()
    if (error) return toast.show('Erreur de chargement', 'danger')
    order.value = data
    if (typeof order.value.items === 'string') order.value.items = JSON.parse(order.value.items)
    selectedStatus.value = order.value.status
  }

  async function handleUpdateStatus() {
    const { error } = await supabase
      .from('orders')
      .update({ status: selectedStatus.value })
      .eq('id', order.value.id)
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

  watch(() => props.orderId, loadOrder)
  onMounted(loadOrder)

  function formatDate(d: string) {
    return new Date(d).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  function formatCurrency(a: number | null) {
    return a == null ? '-' : a.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
  }
</script>

<style scoped lang="less">
  .order-detail--compact {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* --- Bloc principal (infos + actions) --- */
  .order-detail__info,
  .order-detail__products {
    background-color: @neutral-100;
    border: 1px solid #d0d5dd;
    border-radius: 8px;
    padding: 16px 18px;
    font-size: 14px;
  }

  /* --- Grille infos client : 3 à gauche, 3 à droite --- */
  .order-detail__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
    row-gap: 10px;
  }

  .order-detail__grid > div {
    display: grid;
    grid-template-rows: repeat(3, auto);
    gap: 4px;
  }

  .order-detail__grid p {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    line-height: 1.5;
  }

  .order-detail__grid b {
    white-space: nowrap;
    font-weight: 600;
  }

  .status-line {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .basic-badge {
    display: inline-flex;
    align-items: center;
    padding: 0 6px;
    height: 20px;
    font-size: 12.5px;
    font-weight: 500;
  }

  /* --- ID commande --- */
  .order-id {
    font-size: 12px;
    color: #6b718a;
    word-break: break-all;
  }

  /* --- Ligne de mise à jour du statut --- */
  .order-status-line {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #eaecef;
  }

  .order-status-line label {
    min-width: 120px;
    font-weight: 500;
  }

  .order-status-line select {
    flex: 1;
    min-width: 150px;
    padding: 6px 8px;
    border: 1px solid #c7c7c7;
    border-radius: 6px;
    font-size: 14px;
    background: #fafafa;
  }

  /* --- Bloc de suivi livraison --- */
  .order-shipment {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #eaecef;
  }

  .order-shipment label {
    min-width: 80px;
    font-weight: 500;
  }

  .order-shipment input {
    flex: 1;
    min-width: 150px;
    padding: 6px 8px;
    border: 1px solid #c7c7c7;
    border-radius: 6px;
    font-size: 14px;
    background: #fafafa;
  }

  /* --- Bloc produits --- */
  .order-detail__products h5 {
    margin: 0 0 10px;
    font-size: 15px;
    font-weight: 600;
  }

  .order-detail__products table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }

  .order-detail__products th,
  .order-detail__products td {
    padding: 8px 10px;
    border-bottom: 1px solid #eaecef;
    text-align: left;
  }

  .order-detail__products th {
    color: #444;
    font-weight: 600;
  }

  /* --- Loading --- */
  .order-detail__loading {
    text-align: center;
    padding: 40px;
  }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .order-detail__grid {
      grid-template-columns: 1fr;
    }

    .order-status-line,
    .order-shipment {
      flex-direction: column;
      align-items: stretch;
    }

    .order-status-line label,
    .order-shipment label {
      min-width: unset;
    }

    .order-status-line select,
    .order-shipment input {
      width: 100%;
    }
  }
</style>
