<template>
  <div class="user-orders">
    <BasicText
      size="h4"
      weight="bold"
      class="user-orders__title"
    >
      Mes commandes
    </BasicText>

    <!-- 🚫 Aucun résultat (uniquement après chargement complet) -->
    <div
      v-if="hasLoaded && orders.length === 0"
      class="user-orders__empty"
    >
      <BasicText>Vous n’avez encore passé aucune commande.</BasicText>
      <BasicButton
        label="Découvrir le catalogue"
        type="primary"
        variant="filled"
        size="medium"
        @click="$router.push('/catalogue')"
      />
    </div>

    <!-- ✅ Liste des commandes -->
    <div
      v-else-if="orders.length > 0"
      class="user-orders__list"
    >
      <div
        v-for="order in orders"
        :key="order.id"
        class="user-orders__card"
      >
        <div class="user-orders__header">
          <BasicText weight="bold">Commande du {{ formatDate(order.created_at) }}</BasicText>
          <BasicBadge
            :label="order.status"
            :color="statusColor(order.status)"
          />
        </div>

        <div class="user-orders__info">
          <BasicText>Total : {{ order.total_amount.toFixed(2) }} €</BasicText>
          <BasicText>Méthode : {{ order.payment_method }}</BasicText>
        </div>

        <BasicButton
          label="Voir les détails"
          type="secondary"
          variant="outlined"
          size="small"
          @click="$router.push(`/profil/commandes/${order.id}`)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { supabase } from '@/services/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'

  type Order = {
    id: string
    total_amount: number
    payment_method: string
    status: string
    created_at: string
    items: unknown
    address: string | null
    carrier: string | null
    city: string | null
    country: string | null
    email: string
    full_name: string
    internal_notes: string | null
    zip: string | null
  }

  const auth = useAuthStore()
  const toast = useToastStore()
  const orders = ref<Order[]>([])
  const hasLoaded = ref(false) // ✅ indique la fin du chargement logique

  async function loadUserOrders() {
    try {
      if (!auth.user) {
        orders.value = []
        hasLoaded.value = true
        return
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('email', auth.user.email)
        .order('created_at', { ascending: false })

      if (error) throw error

      orders.value = (data ?? []) as Order[]
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err)
      toast.showToast('Erreur lors du chargement de vos commandes', 'danger')
      orders.value = []
    } finally {
      hasLoaded.value = true // ✅ fin du chargement logique
    }
  }

  // 🕐 sablier global automatique
  onMounted(async () => {
    await loadUserOrders()
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
  .user-orders {
    max-width: 900px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0 20px;

    &__title {
      text-align: center;
    }

    &__empty {
      text-align: center;
      padding: 40px;
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__card {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 2px 6px fade(@neutral-400, 8%);
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__info {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: @neutral-700;
    }

    @media (max-width: 768px) {
      padding: 0 10px;
    }
  }
</style>
