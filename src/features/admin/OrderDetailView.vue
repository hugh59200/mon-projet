<template>
  <div class="order-detail">
    <BasicText
      size="h4"
      weight="bold"
      class="order-detail__title"
    >
      Détails de la commande
    </BasicText>

    <!-- 🧾 Informations principales -->
    <div
      v-if="order"
      class="order-detail__info"
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
            <b>Montant total :</b>
            {{ order.total_amount.toFixed(2) }} €
          </p>
          <p>
            <b>Statut :</b>
            <BasicBadge
              :label="getStatusLabel(order.status)"
              :type="getStatusColor(order.status)"
            />
          </p>
          <p>
            <b>ID commande :</b>
            {{ order.id }}
          </p>
        </div>
      </div>

      <!-- 🔄 Changer le statut -->
      <div class="order-status-update">
        <label><b>Modifier le statut :</b></label>
        <select
          v-model="selectedStatus"
          class="order-status-update__select"
        >
          <option
            v-for="s in STATUSES"
            :key="s.value"
            :value="s.value"
          >
            {{ s.label }}
          </option>
        </select>
        <BasicButton
          label="Mettre à jour le statut"
          type="secondary"
          variant="outlined"
          size="small"
          @click="handleUpdateStatus"
        />
      </div>
    </div>

    <!-- 📦 Produits -->
    <div
      v-if="order?.items?.length"
      class="order-detail__products"
    >
      <BasicText
        size="h5"
        weight="bold"
      >
        Produits commandés
      </BasicText>
      <table class="order-detail__table">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix unitaire (€)</th>
            <th>Total (€)</th>
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

    <!-- 🚚 Bloc expédition -->
    <div class="order-shipment">
      <BasicText
        size="h5"
        weight="bold"
      >
        Ajouter un suivi de livraison
      </BasicText>
      <div class="order-shipment__form">
        <BasicInput
          v-model="carrier"
          placeholder="Transporteur (ex: Colissimo, UPS, DHL...)"
          input-type="form"
          size="medium"
        />
        <BasicInput
          v-model="trackingNumber"
          placeholder="Numéro ou lien de suivi"
          input-type="form"
          size="medium"
        />
        <BasicButton
          label="Enregistrer et envoyer le mail"
          type="primary"
          variant="filled"
          size="medium"
          @click="handleAddTracking"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useToastStore } from '@/features/interface/toast/useToastStore'
  import { supabase } from '@/services/supabaseClient'
  import type { BadgeType } from '@designSystem/index'
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
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

  function getStatusLabel(value: string) {
    return STATUSES.find((s) => s.value === value)?.label || value
  }
  function getStatusColor(value: string): BadgeType {
    return (STATUSES.find((s) => s.value === value)?.color || 'neutral') as BadgeType
  }

  async function loadOrder() {
    const id = route.params.id
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).single()

    if (error) {
      toast.showToast('Erreur lors du chargement de la commande', 'danger')
      console.error(error)
      return
    }

    try {
      order.value = data
      if (typeof order.value.items === 'string') {
        order.value.items = JSON.parse(order.value.items)
      }
      selectedStatus.value = order.value.status
    } catch {
      order.value.items = []
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 🚀 Changer le statut
  async function handleUpdateStatus() {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: selectedStatus.value })
        .eq('id', order.value.id)

      if (error) throw error

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-status-update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            order_id: order.value.id,
            status: selectedStatus.value,
            email: order.value.email,
            full_name: order.value.full_name,
          }),
        },
      )

      const data = await res.json()

      if (data.success) {
        toast.showToast('Statut mis à jour et email envoyé ✅', 'success')
        await loadOrder()
      } else {
        toast.showToast('Statut mis à jour, mais email non envoyé ⚠️', 'warning')
      }
    } catch (err) {
      console.error(err)
      toast.showToast('Erreur lors du changement de statut ⚠️', 'danger')
    }
  }

  // 🚚 Ajout du suivi expédition
  async function handleAddTracking() {
    if (!carrier.value || !trackingNumber.value) {
      toast.showToast('Veuillez renseigner le transporteur et le numéro de suivi', 'warning')
      return
    }

    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          carrier: carrier.value,
          tracking_number: trackingNumber.value,
          shipped_at: new Date().toISOString(),
          status: 'shipped',
        })
        .eq('id', order.value.id)

      if (updateError) throw updateError

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-status-update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            order_id: order.value.id,
            status: 'shipped',
            email: order.value.email,
            full_name: order.value.full_name,
            carrier: carrier.value,
            tracking_number: trackingNumber.value,
          }),
        },
      )

      const data = await res.json()

      if (data.success) {
        toast.showToast('Numéro de suivi ajouté et mail envoyé ✅', 'success')
        await loadOrder()
        carrier.value = ''
        trackingNumber.value = ''
      } else {
        toast.showToast('Suivi ajouté, mais mail non envoyé ⚠️', 'warning')
      }
    } catch (err) {
      console.error(err)
      toast.showToast('Erreur lors de l’ajout du suivi ⚠️', 'danger')
    }
  }

  loadOrder()
</script>

<style scoped lang="less">
  .order-detail {
    max-width: 900px;
    margin: 40px auto;
    display: flex;
    flex-direction: column;
    gap: 32px;

    &__title {
      text-align: center;
    }

    &__info {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 10px;
      padding: 20px;
    }

    &__grid {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
    }

    &__products {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 10px;
      padding: 20px;
    }

    &__table {
      width: 100%;
      margin-top: 10px;
      border-collapse: collapse;

      th,
      td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid @neutral-200;
      }

      th {
        background: @neutral-50;
        font-weight: bold;
      }
    }

    &__loading {
      text-align: center;
      padding: 40px;
    }
  }

  .order-status-update {
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 12px;

    &__select {
      padding: 6px;
      border-radius: 6px;
      border: 1px solid @neutral-300;
    }
  }

  .order-shipment {
    background: @neutral-50;
    border: 1px solid @neutral-200;
    border-radius: 10px;
    padding: 20px;

    &__form {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-top: 12px;
      flex-wrap: wrap;

      input {
        flex: 1;
        min-width: 200px;
      }
    }
  }
</style>
