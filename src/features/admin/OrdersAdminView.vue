<template>
  <div class="admin-orders">
    <BasicText
      size="h4"
      weight="bold"
      class="admin-orders__title"
    >
      Gestion des commandes
    </BasicText>

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
          :key="s.value"
          :value="s.value"
        >
          {{ s.label }}
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

    <div
      v-if="filteredOrders.length === 0"
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

        <div class="admin-orders__status-cell">
          <BasicBadge
            :label="getStatusMeta(order.status).label"
            :type="getStatusMeta(order.status).color as BadgeType"
            size="small"
          />
          <select
            v-model="order.status"
            class="admin-orders__status"
            @change="updateStatus(order)"
          >
            <option
              v-for="s in STATUSES"
              :key="s.value"
              :value="s.value"
            >
              {{ s.label }}
            </option>
          </select>
        </div>

        <BasicButton
          label="Voir"
          size="small"
          type="secondary"
          variant="outlined"
          @click="$router.push(`/admin/orders/${order.id}`)"
        />
      </div>
    </div>

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
  import { supabase } from '@/services/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import type { BadgeType } from '@designSystem/index'
  import { computed, onMounted, ref, watch } from 'vue'

  type Order = {
    id: string
    full_name: string
    email: string
    total_amount: number
    created_at: string
    items: { id: string; name: string; quantity: number; price: number }[]
    status: string
  }

  const STATUSES = [
    { value: 'pending', label: 'En attente', color: 'warning' },
    { value: 'confirmed', label: 'Confirmée', color: 'success' },
    { value: 'shipped', label: 'Expédiée', color: 'info' },
    { value: 'completed', label: 'Terminée', color: 'neutral' },
    { value: 'canceled', label: 'Annulée', color: 'danger' },
  ]

  function getStatusMeta(value: string) {
    return STATUSES.find((s) => s.value === value) || { label: value, color: 'neutral' }
  }

  const toast = useToastStore()
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
    let query = supabase.from('orders').select('*', { count: 'exact' })

    if (statusFilter.value) query = query.eq('status', statusFilter.value)

    const from = (page.value - 1) * perPage
    const to = from + perPage - 1
    query = query.range(from, to)

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
  }

  watch([page, sortKey, statusFilter], async () => {
    await loadOrders()
  })

  onMounted(async () => {
    await loadOrders()
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
      return
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-status-update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            order_id: order.id,
            status: order.status,
            email: order.email,
            full_name: order.full_name,
          }),
        },
      )

      const result = await res.json()
      if (result.success) {
        toast.showToast(`Statut mis à jour et email envoyé 📧`, 'success')
      } else {
        toast.showToast('Statut mis à jour, mais email non envoyé ⚠️', 'warning')
      }
    } catch (err) {
      console.error('Erreur envoi email :', err)
      toast.showToast('Statut mis à jour, mais erreur envoi mail ⚠️', 'warning')
    }
  }

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
      getStatusMeta(o.status).label,
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
      grid-template-columns: 1.2fr 1.4fr 0.8fr 1.2fr 1.4fr 0.8fr;
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

    &__status-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__empty {
      text-align: center;
      padding: 40px;
    }
  }
</style>
