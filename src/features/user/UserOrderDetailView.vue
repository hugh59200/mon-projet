<template>
  <div class="user-order-detail">
    <div class="user-order-detail__header">
      <BasicButton
        label="← Retour à mes commandes"
        type="secondary"
        variant="outlined"
        size="small"
        @click="$router.push('/profil/commandes')"
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
      class="user-order-detail__loading"
    >
      <BasicText>Chargement de la commande...</BasicText>
    </div>

    <!-- 🚫 Introuvable -->
    <div
      v-else-if="!order"
      class="user-order-detail__empty"
    >
      <BasicText>Commande introuvable.</BasicText>
    </div>

    <!-- ✅ Contenu -->
    <div
      v-else
      class="user-order-detail__content"
    >
      <section class="user-order-detail__section">
        <BasicText
          size="h5"
          weight="bold"
        >
          Informations
        </BasicText>
        <BasicText>Identifiant : {{ order.id }}</BasicText>
        <BasicText>Date : {{ formatDate(order.created_at) }}</BasicText>
        <BasicBadge
          :label="order.status"
          :color="statusColor(order.status)"
        />
      </section>

      <section class="user-order-detail__section">
        <BasicText
          size="h5"
          weight="bold"
        >
          Paiement
        </BasicText>
        <BasicText>Méthode : {{ order.payment_method }}</BasicText>
        <BasicText>Total : {{ order.total_amount.toFixed(2) }} €</BasicText>
      </section>

      <section class="user-order-detail__section">
        <BasicText
          size="h5"
          weight="bold"
        >
          Adresse de livraison
        </BasicText>
        <BasicText>{{ order.full_name }}</BasicText>
        <BasicText>{{ order.address }}</BasicText>
        <BasicText>{{ order.zip }} {{ order.city }}</BasicText>
        <BasicText>{{ order.country }}</BasicText>
      </section>

      <section class="user-order-detail__section">
        <BasicText
          size="h5"
          weight="bold"
        >
          Produits
        </BasicText>
        <table class="user-order-detail__table">
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
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { useToastStore } from '@/features/interface/toast/useToastStore'
  import { supabase } from '@/services/supabaseClient'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  type Order = {
    id: string
    full_name: string
    address: string
    zip: string
    city: string
    country: string
    payment_method: string
    total_amount: number
    status: string
    created_at: string
    items: { id: string; name: string; quantity: number; price: number }[]
  }

  const route = useRoute()
  const auth = useAuthStore()
  const toast = useToastStore()

  const loading = ref(true)
  const order = ref<Order | null>(null)

  async function loadOrder() {
    loading.value = true
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', route.params.id)
      .eq('email', auth.user?.email)
      .single()

    if (error) {
      console.error(error)
      toast.showToast('Erreur lors du chargement de la commande', 'danger')
    } else {
      order.value = data as Order
    }
    loading.value = false
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

  function statusColor(status: string) {
    switch (status) {
      case 'En attente':
        return 'warning'
      case 'En préparation':
        return 'info'
      case 'Expédiée':
        return 'primary'
      case 'Terminée':
        return 'success'
      case 'Annulée':
        return 'danger'
      default:
        return 'neutral'
    }
  }

  onMounted(loadOrder)
</script>

<style scoped lang="less">
  .user-order-detail {
    max-width: 900px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0 20px;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__section {
      background: white;
      border-radius: 12px;
      border: 1px solid @neutral-200;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
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
