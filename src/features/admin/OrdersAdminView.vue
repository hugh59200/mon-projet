<template>
  <div class="admin-orders">
    <BasicText
      size="h4"
      weight="bold"
      class="admin-orders__title"
    >
      Gestion des commandes
    </BasicText>

    <!-- 🔍 Barre de recherche + filtres -->
    <div class="admin-orders__controls">
      <BasicInput
        v-model="search"
        placeholder="Rechercher par nom ou email..."
        input-type="form"
        size="medium"
        icon-left="search"
        class="admin-orders__search"
      />

      <select
        v-model="sortKey"
        class="admin-orders__sort"
      >
        <option value="created_at_desc">Plus récentes</option>
        <option value="created_at_asc">Plus anciennes</option>
        <option value="amount_desc">Montant décroissant</option>
        <option value="amount_asc">Montant croissant</option>
      </select>

      <select
        v-model="statusFilter"
        class="admin-orders__status-filter"
      >
        <option value="">Tous statuts</option>
        <option
          v-for="s in STATUSES"
          :key="s"
          :value="s"
        >
          {{ s }}
        </option>
      </select>

      <BasicButton
        label="Exporter CSV"
        type="secondary"
        variant="outlined"
        size="small"
        @click="exportCsv"
      />
    </div>

    <!-- 📋 Liste -->
    <div
      v-if="loading"
      class="admin-orders__loading"
    >
      <BasicText>Chargement des commandes...</BasicText>
    </div>

    <div
      v-else-if="filteredOrders.length === 0"
      class="admin-orders__empty"
    >
      <BasicText>Aucune commande trouvée.</BasicText>
    </div>

    <div
      v-else
      class="admin-orders__table"
    >
      <div class="admin-orders__header">
        <span>Nom</span>
        <span>Email</span>
        <span>Total</span>
        <span>Date</span>
        <span>Statut</span>
        <span>Détails</span>
      </div>

      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="admin-orders__row"
      >
        <span>{{ order.full_name }}</span>
        <span>{{ order.email }}</span>
        <span>{{ order.total_amount.toFixed(2) }} €</span>
        <span>{{ formatDate(order.created_at) }}</span>

        <!-- 🔁 Sélecteur de statut -->
        <select
          v-model="order.status"
          class="admin-orders__status"
          @change="updateStatus(order)"
        >
          <option
            v-for="s in STATUSES"
            :key="s"
            :value="s"
          >
            {{ s }}
          </option>
        </select>

        <BasicButton
          label="Voir"
          size="small"
          type="secondary"
          variant="outlined"
          @click="$router.push(`/admin/orders/${order.id}`)"
        />
      </div>
    </div>

    <!-- PAGINATION -->
    <BasicPagination
      v-if="nbPages > 1"
      :nb-pages="nbPages"
      :current-page="page"
      :nb-pages-max="5"
      :nb-results="total"
      @change="page = $event"
    />
  </div>
</template>

<script setup lang="ts">
  import { useToastStore } from '@/features/interface/toast/useToastStore'
  import { supabase } from '@/services/supabaseClient'
  import { computed, ref, watchEffect } from 'vue'

  type Order = {
    id: string
    full_name: string
    email: string
    total_amount: number
    created_at: string
    items: { id: string; name: string; quantity: number; price: number }[]
    status: string
  }

  const STATUSES = ['En attente', 'En préparation', 'Expédiée', 'Terminée', 'Annulée']

  const toast = useToastStore()
  const loading = ref(true)
  const orders = ref<Order[]>([])
  const search = ref('')
  const sortKey = ref<'created_at_desc' | 'created_at_asc' | 'amount_desc' | 'amount_asc'>(
    'created_at_desc',
  )
  const statusFilter = ref('')
  const page = ref(1)
  const perPage = 8
  const total = ref(0)

  async function loadOrders() {
    loading.value = true

    let query = supabase.from('orders').select('*', { count: 'exact' })

    // Filtre par statut
    if (statusFilter.value) query = query.eq('status', statusFilter.value)

    // Pagination
    const from = (page.value - 1) * perPage
    const to = from + perPage - 1
    query = query.range(from, to)

    // Tri
    switch (sortKey.value) {
      case 'created_at_asc':
        query = query.order('created_at', { ascending: true })
        break
      case 'amount_asc':
        query = query.order('total_amount', { ascending: true })
        break
      case 'amount_desc':
        query = query.order('total_amount', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    const { data, count, error } = await query

    if (error) {
      toast.showToast('Erreur lors du chargement des commandes', 'danger')
      console.error(error)
    } else {
      orders.value = (data ?? []) as Order[]
      total.value = count ?? 0
    }

    loading.value = false
  }

  watchEffect(loadOrders)

  function formatDate(date: string) {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const nbPages = computed(() => Math.ceil(total.value / perPage))

  const filteredOrders = computed(() => {
    const term = search.value.toLowerCase()
    return orders.value.filter(
      (o) => o.full_name.toLowerCase().includes(term) || o.email.toLowerCase().includes(term),
    )
  })

  async function updateStatus(order: Order) {
    const { error } = await supabase
      .from('orders')
      .update({ status: order.status })
      .eq('id', order.id)

    if (error) {
      toast.showToast('Erreur de mise à jour du statut', 'danger')
    } else {
      toast.showToast(`Statut mis à jour : ${order.status}`, 'success')
    }
  }

  /** 🧾 Export CSV */
  function exportCsv() {
    if (orders.value.length === 0) {
      toast.showToast('Aucune commande à exporter', 'warning')
      return
    }

    const headers = ['Nom', 'Email', 'Montant total (€)', 'Statut', 'Date', 'Produits']

    const rows = orders.value.map((o) => [
      o.full_name,
      o.email,
      o.total_amount.toFixed(2),
      o.status,
      formatDate(o.created_at),
      o.items.map((i) => `${i.name} x${i.quantity}`).join(' | '),
    ])

    const csvContent = [headers, ...rows].map((r) => r.map((x) => `"${x}"`).join(';')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `commandes_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
</script>

<style scoped lang="less">
  .admin-orders {
    max-width: 1000px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    gap: 24px;

    &__title {
      text-align: center;
    }

    &__controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    &__search {
      flex: 1;
      min-width: 200px;
    }

    &__sort,
    &__status-filter,
    &__status {
      padding: 6px;
      border-radius: 6px;
      border: 1px solid @neutral-300;
      background: white;
    }

    &__table {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &__header,
    &__row {
      display: grid;
      grid-template-columns: 1.2fr 1.4fr 0.8fr 1.2fr 1fr 0.8fr;
      align-items: center;
      padding: 10px 12px;
    }

    &__header {
      background: @neutral-100;
      border-radius: 6px;
      font-weight: bold;
    }

    &__row {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 6px;
      transition: all 0.2s;

      &:hover {
        background: @neutral-50;
      }
    }

    &__details {
      grid-column: 1 / -1;
      background: @neutral-50;
      border-radius: 6px;
      padding: 12px 16px;
      margin-top: 6px;

      table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
          padding: 6px 8px;
          text-align: left;
          border-bottom: 1px solid @neutral-200;
        }

        th {
          font-weight: bold;
        }
      }
    }

    &__loading,
    &__empty {
      text-align: center;
      padding: 40px;
    }
  }

  /* Animation ouverture détails */
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }
</style>
