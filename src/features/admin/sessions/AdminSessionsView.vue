<template>
  <div class="admin-sessions">
    <!-- Stats Cards -->
    <section class="sessions-stats">
      <div
        v-for="stat in statsCards"
        :key="stat.label"
        class="stat-card"
        :class="stat.class"
      >
        <BasicIconNext
          :name="stat.icon"
          :size="24"
          :color="stat.iconColor"
        />
        <div class="stat-card__content">
          <span class="stat-card__value">{{ stat.value }}</span>
          <span class="stat-card__label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- Graphique sessions par jour -->
    <section class="sessions-chart dashboard-card">
      <BasicText
        size="h5"
        weight="bold"
      >
        Sessions des 7 derniers jours
      </BasicText>
      <Bar
        v-if="chartData.labels.length > 0"
        :data="chartData"
        :options="chartOptions"
      />
    </section>

    <!-- Utilisateurs en ligne -->
    <section
      v-if="activeSessions.length > 0"
      class="active-sessions dashboard-card"
    >
      <div class="section-header">
        <BasicText
          size="h5"
          weight="bold"
        >
          <span class="pulse-dot"></span>
          En ligne maintenant ({{ activeSessions.length }})
        </BasicText>
      </div>
      <div class="active-sessions__list">
        <div
          v-for="session in activeSessions"
          :key="session.id"
          class="active-session-item"
        >
          <div class="active-session-item__avatar">
            <img
              v-if="session.profiles?.avatar_url"
              :src="session.profiles.avatar_url"
              alt="avatar"
            />
            <BasicIconNext
              v-else
              :name="session.session_type === 'authenticated' ? 'User' : 'UserX'"
              :size="20"
              color="neutral-500"
            />
          </div>
          <div class="active-session-item__info">
            <span class="name">
              {{ session.profiles?.full_name || session.profiles?.email || 'Visiteur anonyme' }}
            </span>
            <span class="details">
              {{ session.country || 'Inconnu' }} · {{ session.device_type }} · {{ session.browser }}
            </span>
          </div>
          <div class="active-session-item__page">
            <BasicBadge
              :label="formatPage(session.landing_page)"
              type="secondary"
              size="small"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Liste des sessions -->
    <section class="sessions-list dashboard-card">
      <BasicToolbar
        v-model:search="search"
        search-placeholder="Rechercher par email ou nom..."
        :show-reset="true"
        @reset="resetFilters"
      >
        <template #filters>
          <div class="sessions-filters">
            <PremiumButton
              :label="`Toutes (${totalCount})`"
              :type="sessionFilter === 'all' ? 'primary' : 'secondary'"
              size="sm"
              variant="ghost"
              @click="sessionFilter = 'all'"
            />
            <PremiumButton
              :label="`Connectés (${authenticatedCount})`"
              :type="sessionFilter === 'authenticated' ? 'primary' : 'secondary'"
              size="sm"
              variant="ghost"
              @click="sessionFilter = 'authenticated'"
            />
            <PremiumButton
              :label="`Anonymes (${anonymousCount})`"
              :type="sessionFilter === 'anonymous' ? 'primary' : 'secondary'"
              size="sm"
              variant="ghost"
              @click="sessionFilter = 'anonymous'"
            />
          </div>
        </template>
        <template #pagination>
          <BasicPagination
            :current-page="page"
            :nb-pages="nbPages"
            :nb-results="filteredSessions.length"
            :nb-pages-max="5"
            size="small"
            @change="page = $event"
          />
        </template>
      </BasicToolbar>

      <WrapperLoader
        :loading="loading"
        :has-loaded="hasLoaded"
        :is-empty="hasLoaded && filteredSessions.length === 0"
        message="Chargement des sessions..."
        empty-message="Aucune session trouvée"
      >
        <!-- Desktop/Tablet -->
        <template v-if="isDesktop || isTablet">
          <div class="cardLayoutWrapper cardLayoutWrapper--header sessions-header">
            <BasicCell
              :span="6"
              text="Utilisateur"
            />
            <BasicCell
              :span="4"
              text="Type"
            />
            <BasicCell
              :span="4"
              text="Localisation"
            />
            <BasicCell
              :span="4"
              text="Appareil"
            />
            <BasicCell
              :span="5"
              text="Date"
            />
            <BasicCell
              :span="3"
              text="Durée"
            />
            <BasicCell
              :span="4"
              text="Actions"
            />
          </div>

          <div
            v-for="session in paginatedSessions"
            :key="session.id"
            class="gridElemWrapper sessions-row"
          >
            <div class="cardLayoutWrapper sessions-item">
              <!-- Utilisateur -->
              <BasicCell :span="6">
                <div class="user-cell">
                  <img
                    v-if="session.profiles?.avatar_url"
                    :src="session.profiles.avatar_url"
                    alt="avatar"
                    class="avatar"
                  />
                  <BasicIconNext
                    v-else
                    :name="session.session_type === 'authenticated' ? 'User' : 'UserX'"
                    :size="18"
                    color="neutral-400"
                  />
                  <span class="user-name">
                    {{ session.profiles?.full_name || session.profiles?.email || 'Visiteur anonyme' }}
                  </span>
                </div>
              </BasicCell>

              <!-- Type -->
              <BasicCell :span="4">
                <BasicBadge
                  :label="getSessionTypeLabel(session.session_type)"
                  :type="getSessionTypeBadge(session.session_type)"
                  size="small"
                />
              </BasicCell>

              <!-- Localisation -->
              <BasicCell :span="4">
                <span class="location-cell">
                  {{ getCountryFlag(session.country_code) }}
                  {{ session.city || session.country || '—' }}
                </span>
              </BasicCell>

              <!-- Appareil -->
              <BasicCell :span="4">
                <span class="device-cell">
                  <BasicIconNext
                    :name="getDeviceIcon(session.device_type)"
                    :size="16"
                    color="neutral-500"
                  />
                  {{ session.browser || '—' }}
                </span>
              </BasicCell>

              <!-- Date -->
              <BasicCell
                :span="5"
                :text="formatDateTime(session.started_at)"
              />

              <!-- Durée -->
              <BasicCell
                :span="3"
                :text="formatDuration(session.duration_seconds)"
              />

              <!-- Actions -->
              <BasicCell :span="4">
                <div class="actions-cell">
                  <BasicBadge
                    v-if="session.completed_order"
                    label="Commande"
                    type="success"
                    size="small"
                  />
                  <BasicBadge
                    v-else-if="session.started_checkout"
                    label="Checkout"
                    type="warning"
                    size="small"
                  />
                  <BasicBadge
                    v-else-if="session.added_to_cart"
                    label="Panier"
                    type="info"
                    size="small"
                  />
                  <span
                    v-else
                    class="pages-viewed"
                  >
                    {{ session.pages_viewed }} pages
                  </span>
                </div>
              </BasicCell>
            </div>
          </div>
        </template>

        <!-- Mobile -->
        <template v-else>
          <SessionCardMobile
            v-for="session in paginatedSessions"
            :key="session.id"
            :session="session"
            :format-date-time="formatDateTime"
            :format-duration="formatDuration"
            :get-country-flag="getCountryFlag"
            :get-session-type-label="getSessionTypeLabel"
            :get-session-type-badge="getSessionTypeBadge"
          />
        </template>
      </WrapperLoader>
    </section>

    <!-- Top pays -->
    <section class="sessions-countries dashboard-card">
      <BasicText
        size="h5"
        weight="bold"
      >
        Top pays (30 derniers jours)
      </BasicText>
      <div class="countries-grid">
        <div
          v-for="country in topCountries"
          :key="country.country_code"
          class="country-item"
        >
          <span class="country-flag">{{ getCountryFlag(country.country_code) }}</span>
          <span class="country-name">{{ country.country }}</span>
          <span class="country-sessions">{{ country.total_sessions }} sessions</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import {
    fetchSessions,
    fetchActiveSessions,
    fetchSessionsStats,
    fetchSessionsByDay,
    fetchSessionsByCountry,
    type UserSession,
    type SessionsStats,
    type SessionsByDay,
    type SessionsByCountry,
  } from '@/api/supabase/sessions'
  import BasicToolbar from '@/features/admin/shared/components/BasicToolbar.vue'
  import SessionCardMobile from './mobile/SessionCardMobile.vue'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
  } from 'chart.js'
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { Bar } from 'vue-chartjs'

  ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

  const { isDesktop, isTablet } = useDeviceBreakpoint()

  // State
  const sessions = ref<UserSession[]>([])
  const activeSessions = ref<UserSession[]>([])
  const stats = ref<SessionsStats | null>(null)
  const sessionsByDay = ref<SessionsByDay[]>([])
  const topCountries = ref<SessionsByCountry[]>([])

  const loading = ref(false)
  const hasLoaded = ref(false)
  const search = ref('')
  const page = ref(1)
  const pageSize = 20
  const sessionFilter = ref<'all' | 'authenticated' | 'anonymous'>('all')
  const totalCount = ref(0)

  let refreshInterval: ReturnType<typeof setInterval> | null = null

  // Computed
  const authenticatedCount = computed(() =>
    sessions.value.filter((s) => s.session_type === 'authenticated').length,
  )

  const anonymousCount = computed(() =>
    sessions.value.filter((s) => s.session_type === 'anonymous').length,
  )

  const filteredSessions = computed(() => {
    let result = sessions.value

    // Filtre par type
    if (sessionFilter.value !== 'all') {
      result = result.filter((s) => s.session_type === sessionFilter.value)
    }

    // Filtre par recherche
    if (search.value) {
      const q = search.value.toLowerCase()
      result = result.filter(
        (s) =>
          s.profiles?.email?.toLowerCase().includes(q) ||
          s.profiles?.full_name?.toLowerCase().includes(q) ||
          s.country?.toLowerCase().includes(q) ||
          s.city?.toLowerCase().includes(q),
      )
    }

    return result
  })

  const nbPages = computed(() => Math.ceil(filteredSessions.value.length / pageSize))

  const paginatedSessions = computed(() => {
    const start = (page.value - 1) * pageSize
    return filteredSessions.value.slice(start, start + pageSize)
  })

  const statsCards = computed(() => [
    {
      label: 'Sessions 24h',
      value: stats.value?.sessions_24h || 0,
      icon: 'Activity' as const,
      iconColor: 'primary-500' as const,
      class: 'stat-card--primary',
    },
    {
      label: 'Utilisateurs actifs',
      value: stats.value?.users_24h || 0,
      icon: 'Users' as const,
      iconColor: 'success-500' as const,
      class: 'stat-card--success',
    },
    {
      label: 'En ligne',
      value: activeSessions.value.length,
      icon: 'Wifi' as const,
      iconColor: 'info-500' as const,
      class: 'stat-card--info',
    },
    {
      label: 'Conversions 24h',
      value: stats.value?.sessions_with_order || 0,
      icon: 'ShoppingBag' as const,
      iconColor: 'warning-500' as const,
      class: 'stat-card--warning',
    },
  ])

  // Chart
  const chartData = computed(() => {
    const last7Days = sessionsByDay.value.slice(0, 7).reverse()
    return {
      labels: last7Days.map((d) => formatChartDate(d.day)),
      datasets: [
        {
          label: 'Sessions',
          backgroundColor: '#009688',
          data: last7Days.map((d) => d.total_sessions),
          borderRadius: 6,
        },
        {
          label: 'Utilisateurs',
          backgroundColor: '#3B82F6',
          data: last7Days.map((d) => d.authenticated_users),
          borderRadius: 6,
        },
      ],
    }
  })

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: true, position: 'bottom' as const } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  }

  // Methods
  async function loadData() {
    loading.value = true
    try {
      const [sessionsRes, activeRes, statsRes, byDayRes, countriesRes] = await Promise.all([
        fetchSessions({ limit: 200 }),
        fetchActiveSessions(),
        fetchSessionsStats(),
        fetchSessionsByDay(),
        fetchSessionsByCountry(),
      ])

      sessions.value = sessionsRes.data
      totalCount.value = sessionsRes.count
      activeSessions.value = activeRes
      stats.value = statsRes
      sessionsByDay.value = byDayRes
      topCountries.value = countriesRes
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      loading.value = false
      hasLoaded.value = true
    }
  }

  async function refreshActiveSessions() {
    try {
      activeSessions.value = await fetchActiveSessions()
    } catch {
      // Silently fail
    }
  }

  function resetFilters() {
    search.value = ''
    sessionFilter.value = 'all'
    page.value = 1
  }

  // Formatters
  function formatDateTime(date: string): string {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function formatChartDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: '2-digit',
    })
  }

  function formatDuration(seconds: number | null): string {
    if (!seconds || seconds < 0) return '—'
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}min`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}min`
  }

  function formatPage(page: string | null): string {
    if (!page) return '/'
    return page.length > 20 ? page.slice(0, 20) + '...' : page
  }

  function getCountryFlag(code: string | null): string {
    if (!code || code === 'XX') return '🌍'
    const codePoints = code
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  function getSessionTypeLabel(type: string): string {
    switch (type) {
      case 'authenticated':
        return 'Connecté'
      case 'anonymous':
        return 'Anonyme'
      case 'guest_checkout':
        return 'Invité'
      default:
        return type
    }
  }

  function getSessionTypeBadge(type: string): 'success' | 'secondary' | 'warning' {
    switch (type) {
      case 'authenticated':
        return 'success'
      case 'guest_checkout':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  function getDeviceIcon(device: string | null): 'Monitor' | 'Tablet' | 'Smartphone' | 'HelpCircle' {
    switch (device) {
      case 'desktop':
        return 'Monitor'
      case 'tablet':
        return 'Tablet'
      case 'mobile':
        return 'Smartphone'
      default:
        return 'HelpCircle'
    }
  }

  // Lifecycle
  onMounted(() => {
    loadData()
    // Refresh active sessions every 30 seconds
    refreshInterval = setInterval(refreshActiveSessions, 30000)
  })

  onUnmounted(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
  })
</script>

<style scoped lang="less">
  .admin-sessions {
    display: flex;
    flex-direction: column;
    gap: 24px;

    .dashboard-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 10px var(--admin-shadow);
    }
  }

  // Stats Cards
  .sessions-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--admin-bg-surface);
    border: 1px solid var(--admin-border-subtle);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--admin-border);
    }

    &--primary {
      border-left: 4px solid var(--primary-500);
    }
    &--success {
      border-left: 4px solid var(--success-500);
    }
    &--info {
      border-left: 4px solid var(--info-500);
    }
    &--warning {
      border-left: 4px solid var(--warning-500);
    }

    &__content {
      display: flex;
      flex-direction: column;
    }

    &__value {
      font-size: 28px;
      font-weight: 700;
      color: var(--admin-text-primary);
    }

    &__label {
      font-size: 14px;
      color: var(--admin-text-muted);
    }
  }

  // Active Sessions
  .active-sessions {
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .pulse-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      background: var(--success-500);
      border-radius: 50%;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }

  .active-session-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--admin-bg-subtle);
    border-radius: 8px;
    transition: background 0.15s ease;

    &:hover {
      background: var(--admin-bg-card-hover);
    }

    &__avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
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
    }

    &__info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .name {
        font-weight: 600;
        color: var(--admin-text-primary);
      }

      .details {
        font-size: 13px;
        color: var(--admin-text-muted);
      }
    }
  }

  // Sessions List
  .sessions-filters {
    display: flex;
    gap: 8px;
    margin-left: 16px;
  }

  .sessions-header,
  .sessions-item {
    align-items: center;
  }

  .sessions-item {
    cursor: default;
    transition: background 0.15s ease;

    &:hover {
      background: var(--admin-bg-card-hover);
    }
  }

  .user-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-name {
      font-size: 14px;
      color: var(--admin-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .location-cell,
  .device-cell {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--admin-text-secondary);
  }

  .actions-cell {
    display: flex;
    gap: 4px;
  }

  .pages-viewed {
    font-size: 13px;
    color: var(--admin-text-muted);
  }

  // Countries
  .sessions-countries {
    .countries-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
  }

  .country-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: var(--admin-bg-subtle);
    border-radius: 8px;

    .country-flag {
      font-size: 24px;
    }

    .country-name {
      flex: 1;
      font-weight: 500;
      color: var(--admin-text-primary);
    }

    .country-sessions {
      font-size: 13px;
      color: var(--admin-text-muted);
    }
  }

  // Animations
  @keyframes pulse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  // Mobile
  .respond-mobile({
    .sessions-stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .stat-card {
      padding: 14px;
      gap: 10px;

      &__value {
        font-size: 22px;
      }

      &__label {
        font-size: 12px;
      }
    }

    .sessions-filters {
      flex-wrap: wrap;
      margin-left: 0;
      margin-top: 12px;
    }
  });
</style>
