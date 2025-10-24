<template>
  <div class="admin-dashboard">
    <!-- 💬 Chat en aperçu -->
    <section class="dashboard-card chat-preview">
      <header class="card-header">
        <BasicText
          size="h4"
          weight="bold"
        >
          💬 Messages clients
        </BasicText>
        <BasicButton
          label="Ouvrir le chat complet"
          type="secondary"
          size="small"
          @click="$router.push('/admin/chat')"
        />
      </header>

      <ChatAdminView :is-preview="true" />
    </section>

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

    <!-- 🧭 Navigation -->
    <section class="dashboard-card nav-actions">
      <BasicButton
        label="👤 Gérer les utilisateurs"
        type="primary"
        size="large"
        @click="$router.push('/admin/users')"
      />
      <BasicButton
        label="📦 Gérer les commandes"
        type="secondary"
        size="large"
        @click="$router.push('/admin/orders')"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
  import { supabase } from '@/services/supabaseClient'
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
  import ChatAdminView from '../support/ChatAdminView.vue'

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

  /* -------------------------------------------------------------------------- */
  /*                                   STATE                                   */
  /* -------------------------------------------------------------------------- */
  const stats = ref({
    total_orders: 0,
    total_revenue: 0,
    shipped_orders: 0,
    pending_orders: 0,
  })

  const chartDataRevenue = ref<ChartData>({
    labels: [],
    datasets: [{ label: 'Revenus (€)', backgroundColor: '#00796b', data: [], borderRadius: 6 }],
  })

  const chartDataOrders = ref<ChartData>({
    labels: [],
    datasets: [{ label: 'Commandes', backgroundColor: '#ffa726', data: [], borderRadius: 6 }],
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

  /* -------------------------------------------------------------------------- */
  /*                              COMPUTED STATS                               */
  /* -------------------------------------------------------------------------- */
  const statCards = computed(() => [
    { label: 'Commandes totales', value: stats.value.total_orders },
    { label: 'Revenus totaux', value: `${stats.value.total_revenue.toFixed(2)}€` },
    { label: 'Commandes expédiées', value: stats.value.shipped_orders },
    { label: 'Commandes en attente', value: stats.value.pending_orders },
  ])

  /* -------------------------------------------------------------------------- */
  /*                                 FUNCTIONS                                 */
  /* -------------------------------------------------------------------------- */
  async function loadStats() {
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })

    const { data: revenueData } = await supabase.from('orders').select('total_amount')
    const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0

    const { count: shipped } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'shipped')

    const { count: pending } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')

    stats.value = {
      total_orders: totalOrders || 0,
      total_revenue: totalRevenue,
      shipped_orders: shipped || 0,
      pending_orders: pending || 0,
    }
  }

  async function loadWeeklyData() {
    const since = new Date()
    since.setDate(since.getDate() - 6)

    const { data, error } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .gte('created_at', since.toISOString())

    if (error) throw error

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

    data?.forEach((order) => {
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
          backgroundColor: '#00796b',
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
          backgroundColor: '#ffa726',
          data: days.map((d) => d.count),
          borderRadius: 6,
        },
      ],
    }
  }

  async function loadTopClients() {
    const { data, error } = await supabase.from('orders').select(`
    user_id,
    total_amount,
    created_at,
    profiles!inner (
      full_name,
      email,
      avatar_url
    )
  `)

    if (error) {
      console.error('Erreur Supabase :', error)
      return
    }

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

  function formatDate(date: string | null) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
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
    font-family: 'Inter', sans-serif;

    /* --- CARTE GÉNÉRALE --- */
    .dashboard-card {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
      transition: all 0.2s ease;

      &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 12px;

        h4 {
          margin: 0;
        }
      }
    }

    /* --- STATISTIQUES --- */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-top: 12px;
    }

    .stat-card {
      background: @neutral-50;
      border-radius: 10px;
      padding: 16px 12px;
      text-align: center;
      transition: all 0.2s ease;

      &:hover {
        background: @neutral-100;
        transform: translateY(-2px);
      }

      .label {
        color: @neutral-600;
        font-size: 14px;
      }

      .value {
        color: @neutral-900;
        font-weight: bold;
        font-size: 20px;
        margin-top: 4px;
      }
    }

    /* --- CHAT PREVIEW --- */
    .chat-preview {
      .card-header {
        margin-bottom: 16px;
      }

      .ChatAdminView {
        border-radius: 8px;
        overflow: hidden;
        max-height: 420px;
        border: 1px solid @neutral-200;
      }
    }

    /* --- TOP CLIENTS --- */
    .top-clients {
      table {
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
          color: @neutral-600;
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
        color: @primary-600;
        font-weight: 500;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }

    /* --- NAVIGATION --- */
    .nav-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;

      button {
        flex: 1;
        min-width: 200px;
      }
    }

    /* ============================= */
    /* 📱 RESPONSIVE MOBILE & TABLET */
    /* ============================= */

    @media (max-width: 900px) {
      padding: 0 12px 60px;

      .dashboard-card {
        padding: 16px;
      }

      .chat-preview {
        .ChatAdminView {
          max-height: 300px;
        }
      }

      .stats-grid {
        grid-template-columns: 1fr 1fr;
        gap: 12px;

        .stat-card {
          padding: 12px 8px;

          .label {
            font-size: 12px;
          }
          .value {
            font-size: 16px;
          }
        }
      }

      .top-clients {
        table {
          font-size: 12px;

          th,
          td {
            padding: 6px 4px;
          }

          th:nth-child(3),
          td:nth-child(3),
          th:nth-child(5),
          td:nth-child(5) {
            display: none; /* cache colonnes secondaires sur petit écran */
          }
        }

        .avatar {
          width: 22px;
          height: 22px;
        }
      }

      .nav-actions {
        flex-direction: column;
        gap: 10px;

        button {
          width: 100%;
          min-width: unset;
        }
      }
    }

    @media (max-width: 600px) {
      gap: 24px;

      .chat-preview {
        .ChatAdminView {
          max-height: 260px;
        }
      }

      .dashboard-card {
        border-radius: 8px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
