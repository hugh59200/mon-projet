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

    <!-- ✅ Contenu principal -->
    <div
      v-if="order"
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

    <!-- 🚫 Erreur affichée uniquement après chargement -->
    <div
      v-else-if="hasLoaded"
      class="user-order-detail__empty"
    >
      <BasicText>Commande introuvable.</BasicText>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { supabase } from '@/services/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
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
  const order = ref<Order | null>(null)
  const hasLoaded = ref(false) // ✅ indique la fin du chargement logique

  async function loadOrder() {
    try {
      const orderId = route.params.id
      if (typeof orderId !== 'string') {
        throw new Error('Invalid order ID')
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          full_name,
          address,
          zip,
          city,
          country,
          payment_method,
          total_amount,
          status,
          created_at,
          items
        `)
        .eq('id', orderId)
        .eq('email', auth.user?.email)
        .single()

      if (error) {
        // Cas spécifique : commande inexistante
        if (error.code === 'PGRST116') {
          order.value = null
          return
        }
        throw error
      }

      order.value = data as Order
    } catch (err) {
      console.error('Erreur lors du chargement de la commande:', err)
      toast.showToast('Erreur lors du chargement de la commande', 'danger')
      order.value = null
    } finally {
      hasLoaded.value = true // ✅ fin du chargement logique
    }
  }

  onMounted(async () => {
    await loadOrder()
  })

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
</script>

<style scoped lang="less">
  .user-order-detail {
    max-width: 900px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 0 20px 100px;
    overflow-y: auto;
    min-height: calc(100vh - 120px);

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    &__section {
      background: white;
      border-radius: 12px;
      border: 1px solid fade(@neutral-200, 60%);
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 2px 6px fade(@neutral-400, 8%);
    }

    &__table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;

      th,
      td {
        padding: 10px 8px;
        text-align: left;
        border-bottom: 1px solid @neutral-200;
      }

      th {
        background: @neutral-50;
        font-weight: 600;
      }

      tr:last-child td {
        border-bottom: none;
      }
    }

    &__empty {
      text-align: center;
      padding: 80px 20px;
      color: @neutral-500;
    }

    @media (max-width: 768px) {
      padding: 0 10px 60px;
      &__section {
        padding: 16px;
      }
    }
  }
</style>
