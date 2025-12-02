<template>
  <div class="admin-dashboard">
    <!-- 📊 Statistiques globales -->
    <section class="dashboard-card">
      <BasicText
        size="h4"
        weight="bold"
      >
        📈 Vue d’ensemble
      </BasicText>
      <div class="stats-grid">
        <div
          class="stat-card"
          v-for="stat in statCards"
          :key="stat.label"
        >
          <p class="label">{{ stat.label }}</p>
          <p class="value">{{ stat.value }}</p>
        </div>
      </div>
    </section>

    <!-- 💶 Revenus -->
    <section class="dashboard-card">
      <BasicText
        size="h5"
        weight="bold"
      >
        💰 Revenus des 7 derniers jours
      </BasicText>
      <Bar
        :data="chartDataRevenue"
        :options="chartOptions"
      />
    </section>

    <!-- 📦 Commandes -->
    <section class="dashboard-card">
      <BasicText
        size="h5"
        weight="bold"
      >
        📦 Commandes des 7 derniers jours
      </BasicText>
      <Bar
        :data="chartDataOrders"
        :options="chartOptionsOrders"
      />
    </section>

    <!-- 🏆 Top clients -->
    <section class="dashboard-card top-clients">
      <BasicText
        size="h5"
        weight="bold"
      >
        🏆 Top 5 clients
      </BasicText>
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Commandes</th>
            <th>Total (€)</th>
            <th>Dernière commande</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="client in topClients"
            :key="client.id"
          >
            <td class="client-cell">
              <img
                v-if="client.avatar_url"
                :src="client.avatar_url"
                alt="avatar"
                class="avatar"
              />
              <span>{{ client.name }}</span>
            </td>
            <td>{{ client.orders }}</td>
            <td>{{ client.total.toFixed(2) }}</td>
            <td>{{ formatDate(client.last_order) }}</td>
            <td>
              <a
                v-if="client.email"
                class="contact-link"
                :href="`mailto:${client.email}`"
              >
                📧 Contacter
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { fetchOrdersStats, fetchWeeklyOrdersData, fetchTopClients } from '@/api/supabase/stats'
  import { formatDate } from '@/utils/index'
  import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
  } from 'chart.js'
  import { computed, onMounted, ref } from 'vue'
  import { Bar } from 'vue-chartjs'

  ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

  interface ChartDataset {
    label: string
    backgroundColor: string
    data: number[]
    borderRadius: number
  }
  interface ChartData {
    labels: string[]
    datasets: ChartDataset[]
  }
  interface TopClient {
    id: string
    name: string
    email: string | null
    orders: number
    total: number
    avatar_url?: string | null
    last_order: string | null
  }

  const stats = ref({
    total_orders: 0,
    total_revenue: 0,
    shipped_orders: 0,
    pending_orders: 0,
  })

  // Couleurs pour les graphiques (utilise les couleurs du thème)
  const CHART_COLOR_PRIMARY = '#009688' // primary-500 (teal)
  const CHART_COLOR_WARNING = '#f59e0b' // warning-500 (orange/amber)

  const chartDataRevenue = ref<ChartData>({
    labels: [],
    datasets: [{ label: 'Revenus (€)', backgroundColor: CHART_COLOR_PRIMARY, data: [], borderRadius: 6 }],
  })

  const chartDataOrders = ref<ChartData>({
    labels: [],
    datasets: [{ label: 'Commandes', backgroundColor: CHART_COLOR_WARNING, data: [], borderRadius: 6 }],
  })

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { color: '#555', callback: (v: any) => `${v} €` } },
    },
  }

  const chartOptionsOrders = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { color: '#555', callback: (v: any) => `${v} commandes` } },
    },
  }

  const topClients = ref<TopClient[]>([])

  const statCards = computed(() => [
    { label: 'Commandes totales', value: stats.value.total_orders },
    { label: 'Revenus totaux', value: `${stats.value.total_revenue.toFixed(2)}€` },
    { label: 'Commandes expédiées', value: stats.value.shipped_orders },
    { label: 'Commandes en attente', value: stats.value.pending_orders },
  ])

  async function loadStats() {
    const result = await fetchOrdersStats()
    stats.value = result
  }

  async function loadWeeklyData() {
    const data = await fetchWeeklyOrdersData()

    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return {
        key: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' }),
        total: 0,
        count: 0,
      }
    })

    data.forEach((order) => {
      const dateKey = order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : ''
      const day = days.find((d) => d.key === dateKey)
      if (day) {
        day.total += order.total_amount ?? 0
        day.count += 1
      }
    })

    chartDataRevenue.value = {
      labels: days.map((d) => d.label),
      datasets: [
        {
          label: 'Revenus (€)',
          backgroundColor: CHART_COLOR_PRIMARY,
          data: days.map((d) => d.total),
          borderRadius: 6,
        },
      ],
    }

    chartDataOrders.value = {
      labels: days.map((d) => d.label),
      datasets: [
        {
          label: 'Commandes',
          backgroundColor: CHART_COLOR_WARNING,
          data: days.map((d) => d.count),
          borderRadius: 6,
        },
      ],
    }
  }

  async function loadTopClients() {
    const data = await fetchTopClients()
    if (!data) return

    const clients: Record<
      string,
      {
        name: string
        email: string | null
        orders: number
        total: number
        avatar_url?: string
        last_order: string | null
      }
    > = {}

    data.forEach((order: any) => {
      const id = order.user_id
      const profile = order.profiles
      const name = profile?.full_name || profile?.email || 'Client inconnu'
      const email = profile?.email || null
      const avatar = profile?.avatar_url || null

      if (!clients[id]) {
        clients[id] = { name, email, orders: 0, total: 0, avatar_url: avatar, last_order: null }
      }

      clients[id].orders += 1
      clients[id].total += order.total_amount || 0

      const orderDate = new Date(order.created_at)
      if (!clients[id].last_order || orderDate > new Date(clients[id].last_order)) {
        clients[id].last_order = order.created_at
      }
    })

    topClients.value = Object.entries(clients)
      .map(([id, c]) => ({ id, ...c }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  }

  onMounted(async () => {
    await Promise.all([loadStats(), loadWeeklyData(), loadTopClients()])
  })
</script>
<style scoped lang="less">
  .admin-dashboard {
    max-width: 1100px;
    margin: 40px auto;
    padding: 0 20px 100px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    .tabs-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      background: @neutral-50;
      border-radius: 12px;
      padding: 10px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

      .tab-btn {
        flex: 1;
        min-width: 200px;
        padding: 10px 16px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.25s ease;
        background-color: var(--primary-50);
        color: var(--primary-800);

        &.active {
          background-color: var(--primary-600);
          color: white;
        }

        &:hover {
          background-color: var(--primary-500);
          color: white;
        }
      }
    }

    .tab-content {
      display: flex;
      flex-direction: column;
      gap: 32px;
      margin-top: 24px;
    }

    .dashboard-card {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    }

    /* --- Grille des stats --- */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-top: 12px;
    }

    .stat-card {
      background: @neutral-100;
      border-radius: 10px;
      padding: 16px 12px;
      text-align: center;
      transition: all 0.2s ease;

      &:hover {
        background: @neutral-200;
        transform: translateY(-2px);
      }

      .label {
        color: @neutral-500;
        font-size: 14px;
      }

      .value {
        color: @neutral-900;
        font-weight: bold;
        font-size: 20px;
        margin-top: 4px;
      }
    }

    .top-clients table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;

      th,
      td {
        padding: 10px;
        border-bottom: 1px solid @neutral-200;
      }

      th {
        text-align: left;
        color: @neutral-500;
        font-weight: 500;
        font-size: 14px;
      }

      td {
        color: @neutral-900;
        font-size: 14px;
      }
    }

    .client-cell {
      display: flex;
      align-items: center;
      gap: 8px;

      .avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .contact-link {
      color: var(--primary-600);
      font-weight: 500;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
