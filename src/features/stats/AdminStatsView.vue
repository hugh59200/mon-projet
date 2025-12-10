<template>
  <div class="admin-stats">
    <!-- KPI Cards -->
    <section class="stats-kpi">
      <div
        v-for="kpi in kpiCards"
        :key="kpi.label"
        class="kpi-card"
        :class="`kpi-card--${kpi.variant}`"
      >
        <div class="kpi-card__icon">
          <BasicIconNext
            :name="kpi.icon"
            :size="22"
            :color="`${kpi.variant}-500`"
          />
        </div>
        <div class="kpi-card__content">
          <span class="kpi-card__value">{{ kpi.value }}</span>
          <span class="kpi-card__label">{{ kpi.label }}</span>
        </div>
        <div
          v-if="kpi.trend"
          class="kpi-card__trend"
          :class="kpi.trend > 0 ? 'kpi-card__trend--up' : 'kpi-card__trend--down'"
        >
          <BasicIconNext
            :name="kpi.trend > 0 ? 'TrendingUp' : 'TrendingDown'"
            :size="14"
          />
          {{ Math.abs(kpi.trend) }}%
        </div>
      </div>
    </section>

    <!-- Graphiques en grille -->
    <div class="stats-charts">
      <!-- Revenus -->
      <section class="chart-card">
        <div class="chart-card__header">
          <div class="chart-card__title">
            <BasicIconNext
              name="DollarSign"
              :size="18"
              color="success-500"
            />
            <BasicText
              size="h5"
              weight="bold"
            >
              Revenus
            </BasicText>
          </div>
          <span class="chart-card__period">7 derniers jours</span>
        </div>
        <div class="chart-card__body">
          <Bar
            v-if="chartDataRevenue.labels.length > 0"
            :data="chartDataRevenue"
            :options="chartOptionsRevenue"
          />
          <div
            v-else
            class="chart-card__empty"
          >
            Chargement...
          </div>
        </div>
      </section>

      <!-- Commandes -->
      <section class="chart-card">
        <div class="chart-card__header">
          <div class="chart-card__title">
            <BasicIconNext
              name="ShoppingBag"
              :size="18"
              color="warning-500"
            />
            <BasicText
              size="h5"
              weight="bold"
            >
              Commandes
            </BasicText>
          </div>
          <span class="chart-card__period">7 derniers jours</span>
        </div>
        <div class="chart-card__body">
          <Bar
            v-if="chartDataOrders.labels.length > 0"
            :data="chartDataOrders"
            :options="chartOptionsOrders"
          />
          <div
            v-else
            class="chart-card__empty"
          >
            Chargement...
          </div>
        </div>
      </section>

      <!-- Trafic / Sessions -->
      <section class="chart-card chart-card--wide">
        <div class="chart-card__header">
          <div class="chart-card__title">
            <BasicIconNext
              name="Activity"
              :size="18"
              color="info-500"
            />
            <BasicText
              size="h5"
              weight="bold"
            >
              Trafic
            </BasicText>
          </div>
          <div class="chart-card__legend">
            <span class="legend-item legend-item--sessions">
              <span class="legend-dot"></span>
              Sessions
            </span>
            <span class="legend-item legend-item--users">
              <span class="legend-dot"></span>
              Utilisateurs
            </span>
          </div>
        </div>
        <div class="chart-card__body chart-card__body--large">
          <Bar
            v-if="chartDataSessions.labels.length > 0"
            :data="chartDataSessions"
            :options="chartOptionsSessions"
          />
          <div
            v-else
            class="chart-card__empty"
          >
            Chargement...
          </div>
        </div>
      </section>
    </div>

    <!-- Statistiques en ligne -->
    <section class="stats-row">
      <div class="stat-block stat-block--online">
        <div class="stat-block__header">
          <span class="pulse-dot"></span>
          <BasicText
            size="body-l"
            weight="semibold"
          >
            En ligne maintenant
          </BasicText>
        </div>
        <div class="stat-block__value">
          {{ sessionsStats?.sessions_24h || 0 }}
          <span class="stat-block__unit">visiteurs actifs</span>
        </div>
      </div>

      <div class="stat-block">
        <BasicIconNext
          name="Globe"
          :size="20"
          color="primary-500"
        />
        <div class="stat-block__info">
          <span class="stat-block__value">{{ sessionsStats?.sessions_30d || 0 }}</span>
          <span class="stat-block__label">Sessions ce mois</span>
        </div>
      </div>

      <div class="stat-block">
        <BasicIconNext
          name="ShoppingCart"
          :size="20"
          color="success-500"
        />
        <div class="stat-block__info">
          <span class="stat-block__value">{{ sessionsStats?.sessions_with_order || 0 }}</span>
          <span class="stat-block__label">Conversions</span>
        </div>
      </div>

      <div class="stat-block">
        <BasicIconNext
          name="Clock"
          :size="20"
          color="warning-500"
        />
        <div class="stat-block__info">
          <span class="stat-block__value">{{ formatDuration(sessionsStats?.avg_duration_seconds) }}</span>
          <span class="stat-block__label">Durée moyenne</span>
        </div>
      </div>
    </section>

    <!-- Top Clients -->
    <section class="top-clients-card">
      <div class="top-clients-card__header">
        <BasicIconNext
          name="Trophy"
          :size="20"
          color="warning-500"
        />
        <BasicText
          size="h5"
          weight="bold"
        >
          Top 5 clients
        </BasicText>
      </div>

      <div class="top-clients-list">
        <div
          v-for="(client, index) in topClients"
          :key="client.id"
          class="client-row"
        >
          <div class="client-row__rank">
            <span :class="`rank rank--${index + 1}`">{{ index + 1 }}</span>
          </div>
          <div class="client-row__avatar">
            <img
              v-if="client.avatar_url"
              :src="client.avatar_url"
              :alt="client.name"
            />
            <BasicIconNext
              v-else
              name="User"
              :size="18"
              color="neutral-400"
            />
          </div>
          <div class="client-row__info">
            <span class="client-row__name">{{ client.name }}</span>
            <span class="client-row__email">{{ client.email || '—' }}</span>
          </div>
          <div class="client-row__stats">
            <span class="client-row__orders">{{ client.orders }} commandes</span>
            <span class="client-row__total">{{ formatPrice(client.total) }}</span>
          </div>
          <div class="client-row__date">
            {{ formatDate(client.last_order) }}
          </div>
          <a
            v-if="client.email"
            class="client-row__action"
            :href="`mailto:${client.email}`"
            title="Contacter"
          >
            <BasicIconNext
              name="Mail"
              :size="16"
              color="primary-500"
            />
          </a>
        </div>

        <div
          v-if="topClients.length === 0"
          class="top-clients-empty"
        >
          Aucune donnée client disponible
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  fetchSessionsByDay,
  fetchSessionsStats,
  type SessionsByDay,
  type SessionsStats,
} from '@/api/supabase/sessions'
import { fetchOrdersStats, fetchWeeklyOrdersData, fetchTopClients } from '@/api/supabase/stats'
import { formatDate } from '@/utils/index'
import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.types'
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

// Types
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

interface KpiCard {
  label: string
  value: string | number
  icon: IconNameNext
  variant: 'primary' | 'success' | 'warning' | 'info'
  trend?: number
}

// State
const stats = ref({
  total_orders: 0,
  total_revenue: 0,
  shipped_orders: 0,
  pending_orders: 0,
})

const sessionsStats = ref<SessionsStats | null>(null)
const sessionsByDay = ref<SessionsByDay[]>([])
const topClients = ref<TopClient[]>([])

// Chart colors
const CHART_COLORS = {
  primary: '#009688',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  purple: '#8B5CF6',
}

// Chart data
const chartDataRevenue = ref<ChartData>({
  labels: [],
  datasets: [],
})

const chartDataOrders = ref<ChartData>({
  labels: [],
  datasets: [],
})

const chartDataSessions = ref<ChartData>({
  labels: [],
  datasets: [],
})

// Chart options
const chartOptionsRevenue = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: 'var(--admin-text-muted)' },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'var(--admin-border-subtle)' },
      ticks: {
        color: 'var(--admin-text-muted)',
        callback: (v: number | string) => `${v}€`,
      },
    },
  },
}

const chartOptionsOrders = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: 'var(--admin-text-muted)' },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'var(--admin-border-subtle)' },
      ticks: { color: 'var(--admin-text-muted)' },
    },
  },
}

const chartOptionsSessions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: 'var(--admin-text-muted)' },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'var(--admin-border-subtle)' },
      ticks: { color: 'var(--admin-text-muted)' },
    },
  },
}

// Computed
const kpiCards = computed<KpiCard[]>(() => [
  {
    label: 'Revenus totaux',
    value: formatPrice(stats.value.total_revenue),
    icon: 'DollarSign',
    variant: 'success',
  },
  {
    label: 'Commandes',
    value: stats.value.total_orders,
    icon: 'ShoppingBag',
    variant: 'primary',
  },
  {
    label: 'Expédiées',
    value: stats.value.shipped_orders,
    icon: 'Truck',
    variant: 'info',
  },
  {
    label: 'En attente',
    value: stats.value.pending_orders,
    icon: 'Clock',
    variant: 'warning',
  },
])

// Methods
function formatPrice(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return '—'
  if (seconds < 60) return `${Math.round(seconds)}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}min`
}

function formatChartDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
  })
}

async function loadStats() {
  const result = await fetchOrdersStats()
  stats.value = result
}

async function loadSessionsStats() {
  const [statsResult, byDayResult] = await Promise.all([
    fetchSessionsStats(),
    fetchSessionsByDay(),
  ])

  sessionsStats.value = statsResult
  sessionsByDay.value = byDayResult

  // Build sessions chart data
  const last7Days = byDayResult.slice(0, 7).reverse()

  chartDataSessions.value = {
    labels: last7Days.map((d) => formatChartDate(d.day)),
    datasets: [
      {
        label: 'Sessions',
        backgroundColor: CHART_COLORS.primary,
        data: last7Days.map((d) => d.total_sessions),
        borderRadius: 6,
      },
      {
        label: 'Utilisateurs',
        backgroundColor: CHART_COLORS.info,
        data: last7Days.map((d) => d.authenticated_users),
        borderRadius: 6,
      },
    ],
  }
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
        backgroundColor: CHART_COLORS.success,
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
        backgroundColor: CHART_COLORS.warning,
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

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadStats(),
    loadWeeklyData(),
    loadTopClients(),
    loadSessionsStats(),
  ])
})
</script>

<style scoped lang="less">
.admin-stats {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// ═══════════════════════════════════════════════════════════════
// KPI Cards
// ═══════════════════════════════════════════════════════════════
.stats-kpi {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  .respond-tablet({
    grid-template-columns: repeat(2, 1fr);
  });

  .respond-mobile({
    grid-template-columns: 1fr;
  });
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-subtle);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
  }

  &--primary::before { background: var(--primary-500); }
  &--success::before { background: var(--success-500); }
  &--warning::before { background: var(--warning-500); }
  &--info::before { background: var(--info-500); }

  &:hover {
    border-color: var(--admin-border);
    box-shadow: 0 4px 12px var(--admin-shadow);
  }

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &--primary &__icon { background: rgba(var(--primary-500-rgb), 0.1); }
  &--success &__icon { background: rgba(var(--success-500-rgb), 0.1); }
  &--warning &__icon { background: rgba(var(--warning-500-rgb), 0.1); }
  &--info &__icon { background: rgba(var(--info-500-rgb), 0.1); }

  &__content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  &__value {
    font-size: 24px;
    font-weight: 700;
    color: var(--admin-text-primary);
    line-height: 1.2;
  }

  &__label {
    font-size: 13px;
    color: var(--admin-text-muted);
    margin-top: 2px;
  }

  &__trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 6px;

    &--up {
      background: rgba(var(--success-500-rgb), 0.1);
      color: var(--success-600);
    }

    &--down {
      background: rgba(var(--danger-500-rgb), 0.1);
      color: var(--danger-600);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// Charts Grid
// ═══════════════════════════════════════════════════════════════
.stats-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  .respond-tablet({
    grid-template-columns: 1fr;
  });
}

.chart-card {
  background: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-subtle);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;

  &--wide {
    grid-column: span 2;

    .respond-tablet({
      grid-column: span 1;
    });
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__period {
    font-size: 12px;
    color: var(--admin-text-muted);
    background: var(--admin-bg-subtle);
    padding: 4px 10px;
    border-radius: 6px;
  }

  &__legend {
    display: flex;
    gap: 16px;
  }

  &__body {
    flex: 1;
    min-height: 200px;
    position: relative;

    &--large {
      min-height: 280px;
    }
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--admin-text-muted);
    font-size: 14px;
  }
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--admin-text-secondary);

  .legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
  }

  &--sessions .legend-dot {
    background: #009688;
  }

  &--users .legend-dot {
    background: #3B82F6;
  }
}

// ═══════════════════════════════════════════════════════════════
// Stats Row
// ═══════════════════════════════════════════════════════════════
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  .respond-tablet({
    grid-template-columns: repeat(2, 1fr);
  });

  .respond-mobile({
    grid-template-columns: 1fr;
  });
}

.stat-block {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-subtle);
  border-radius: 12px;
  padding: 16px;

  &--online {
    background: linear-gradient(135deg, rgba(var(--success-500-rgb), 0.1), rgba(var(--success-500-rgb), 0.05));
    border-color: rgba(var(--success-500-rgb), 0.2);
    flex-direction: column;
    align-items: flex-start;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__value {
    font-size: 20px;
    font-weight: 700;
    color: var(--admin-text-primary);
  }

  &__label {
    font-size: 12px;
    color: var(--admin-text-muted);
  }

  &__unit {
    font-size: 12px;
    font-weight: 400;
    color: var(--admin-text-muted);
    margin-left: 4px;
  }
}

.pulse-dot {
  width: 10px;
  height: 10px;
  background: var(--success-500);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

// ═══════════════════════════════════════════════════════════════
// Top Clients
// ═══════════════════════════════════════════════════════════════
.top-clients-card {
  background: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-subtle);
  border-radius: 12px;
  padding: 20px;

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--admin-border-subtle);
  }
}

.top-clients-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.client-row {
  display: grid;
  grid-template-columns: 40px 44px 1fr 140px 100px 40px;
  gap: 12px;
  align-items: center;
  padding: 12px;
  background: var(--admin-bg-subtle);
  border-radius: 10px;
  transition: background 0.15s ease;

  &:hover {
    background: var(--admin-bg-card-hover);
  }

  .respond-tablet({
    grid-template-columns: 40px 44px 1fr auto;
  });

  .respond-mobile({
    grid-template-columns: 32px 40px 1fr auto;
    padding: 10px;
    gap: 8px;
  });

  &__rank {
    display: flex;
    justify-content: center;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--admin-border-subtle);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .respond-mobile({
      width: 36px;
      height: 36px;
    });
  }

  &__info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__name {
    font-weight: 600;
    color: var(--admin-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__email {
    font-size: 12px;
    color: var(--admin-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__stats {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .respond-tablet({
      display: none;
    });
  }

  &__orders {
    font-size: 12px;
    color: var(--admin-text-muted);
  }

  &__total {
    font-weight: 700;
    color: var(--success-600);
  }

  &__date {
    font-size: 12px;
    color: var(--admin-text-muted);
    text-align: right;

    .respond-tablet({
      display: none;
    });
  }

  &__action {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--primary-500-rgb), 0.1);
    transition: all 0.15s ease;

    &:hover {
      background: rgba(var(--primary-500-rgb), 0.2);
    }
  }
}

.rank {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;

  &--1 {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #7c4d00;
  }

  &--2 {
    background: linear-gradient(135deg, #E8E8E8, #C0C0C0);
    color: #555;
  }

  &--3 {
    background: linear-gradient(135deg, #CD7F32, #B87333);
    color: #fff;
  }

  &--4, &--5 {
    background: var(--admin-border-subtle);
    color: var(--admin-text-muted);
  }
}

.top-clients-empty {
  text-align: center;
  padding: 40px;
  color: var(--admin-text-muted);
  font-size: 14px;
}
</style>
