<template>
  <div class="order-detail">
    <div class="order-detail__header">
      <BasicButton
        label="← Retour"
        type="secondary"
        variant="outlined"
        size="small"
        @click="$router.push('/admin/orders')"
      />
      <BasicText
        size="h4"
        weight="bold"
      >
        Détail de la commande
      </BasicText>
    </div>

    <!-- 🕐 Chargement -->
    <div
      v-if="loading"
      class="order-detail__loading"
    >
      <BasicText>Chargement de la commande...</BasicText>
    </div>

    <!-- 🚫 Non trouvée -->
    <div
      v-else-if="!order"
      class="order-detail__empty"
    >
      <BasicText>Commande introuvable.</BasicText>
    </div>

    <!-- 🧾 Contenu -->
    <div
      v-else
      class="order-detail__content"
    >
      <!-- 🧍 Informations client -->
      <section class="order-detail__section">
        <BasicText
          size="h5"
          weight="bold"
        >
          Informations client
        </BasicText>
        <BasicText>{{ order.full_name }}</BasicText>
        <BasicText>{{ order.email }}</BasicText>
        <BasicText>{{ order.address }}</BasicText>
        <BasicText>{{ order.zip }} {{ order.city }}</BasicText>
        <BasicText>{{ order.country }}</BasicText>
      </section>

      <!-- 💳 Paiement -->
      <section class="order-detail__section">
        <BasicText
          size="h5"
          weight="bold"
        >
          Paiement
        </BasicText>
        <BasicText>Méthode : {{ order.payment_method }}</BasicText>
        <BasicText>Total : {{ order.total_amount.toFixed(2) }} €</BasicText>
        <BasicText>Date : {{ formatDate(order.created_at) }}</BasicText>
      </section>

      <!-- 📦 Statut -->
      <section class="order-detail__section">
        <BasicText
          size="h5"
          weight="bold"
        >
          Statut de la commande
        </BasicText>
        <select
          v-model="order.status"
          class="order-detail__status"
          @change="updateStatus"
        >
          <option
            v-for="s in STATUSES"
            :key="s"
            :value="s"
          >
            {{ s }}
          </option>
        </select>
      </section>

      <!-- 📝 Notes internes -->
      <section class="order-detail__section">
        <BasicText
          size="h5"
          weight="bold"
        >
          Notes internes (non visibles client)
        </BasicText>
        <textarea
          v-model="notes"
          class="order-detail__textarea"
          placeholder="Ajouter des remarques internes (ex : suivi logistique, infos client, etc.)"
        />
        <div class="order-detail__actions">
          <BasicButton
            label="Enregistrer les notes"
            type="primary"
            variant="filled"
            size="small"
            :disabled="savingNotes"
            @click="saveNotes"
          />
          <BasicText
            v-if="savedAt"
            size="body-s"
            color="neutral-500"
          >
            Dernière sauvegarde : {{ savedAt }}
          </BasicText>
        </div>
      </section>

      <!-- 💊 Produits -->
      <section class="order-detail__section">
        <BasicText
          size="h5"
          weight="bold"
        >
          Produits
        </BasicText>
        <table class="order-detail__table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
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
              <td>{{ item.price.toFixed(2) }} €</td>
              <td>{{ (item.price * item.quantity).toFixed(2) }} €</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useToastStore } from '@/features/interface/toast/useToastStore'
  import { supabase } from '@/services/supabaseClient'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const STATUSES = ['En attente', 'En préparation', 'Expédiée', 'Terminée', 'Annulée']

  type Order = {
    id: string
    full_name: string
    email: string
    address: string
    city: string
    zip: string
    country: string
    payment_method: string
    total_amount: number
    status: string
    created_at: string
    internal_notes?: string
    items: { id: string; name: string; quantity: number; price: number }[]
  }

  const route = useRoute()
  const toast = useToastStore()
  const loading = ref(true)
  const savingNotes = ref(false)
  const savedAt = ref<string | null>(null)
  const order = ref<Order | null>(null)
  const notes = ref('')

  async function loadOrder() {
    loading.value = true
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) {
      console.error(error)
      toast.showToast('Erreur lors du chargement de la commande', 'danger')
    } else {
      order.value = data as Order
      notes.value = order.value.internal_notes || ''
    }
    loading.value = false
  }

  async function updateStatus() {
    if (!order.value) return

    const { error } = await supabase
      .from('orders')
      .update({ status: order.value.status })
      .eq('id', order.value.id)

    if (error) toast.showToast('Erreur de mise à jour du statut', 'danger')
    else toast.showToast(`Statut mis à jour : ${order.value.status}`, 'success')
  }

  async function saveNotes() {
    if (!order.value) return
    savingNotes.value = true

    const { error } = await supabase
      .from('orders')
      .update({ internal_notes: notes.value })
      .eq('id', order.value.id)

    savingNotes.value = false
    if (error) {
      toast.showToast('Erreur lors de la sauvegarde des notes', 'danger')
    } else {
      toast.showToast('Notes enregistrées ✅', 'success')
      savedAt.value = new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
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

  onMounted(loadOrder)
</script>

<style scoped lang="less">
  .order-detail {
    max-width: 900px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0 20px;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    &__section {
      background: white;
      border-radius: 12px;
      border: 1px solid @neutral-200;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    &__status {
      width: 200px;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid @neutral-300;
      background: white;
    }

    &__textarea {
      width: 100%;
      min-height: 100px;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid @neutral-300;
      resize: vertical;
      font-family: inherit;
    }

    &__actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 8px;
    }

    &__table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;

      th,
      td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid @neutral-200;
      }

      th {
        background: @neutral-50;
      }
    }

    &__loading,
    &__empty {
      text-align: center;
      padding: 40px;
    }
  }
</style>
