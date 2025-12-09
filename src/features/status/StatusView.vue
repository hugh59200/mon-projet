<template>
  <div class="status-page">
    <PageHeader />

    <PageContent size="md">
      <!-- Status Card -->
      <ContentBlock variant="card" size="lg" class="status-card">
        <!-- Global Status -->
        <div class="status-card__header">
          <div class="status-card__global" :class="`status-card__global--${globalStatus}`">
            <div class="status-card__global-icon">
              <BasicIconNext :name="globalStatusIcon" :size="24" />
            </div>
            <div class="status-card__global-info">
              <h2 class="status-card__global-title">{{ t(`status.global.${globalStatus}`) }}</h2>
              <p class="status-card__global-subtitle">
                {{ t('status.lastChecked', { time: formattedLastCheck }) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Indicators List -->
        <div class="status-card__indicators">
          <div
            v-for="indicator in indicators"
            :key="indicator.id"
            class="status-indicator"
            :class="`status-indicator--${indicator.status}`"
          >
            <div class="status-indicator__dot"></div>
            <div class="status-indicator__info">
              <span class="status-indicator__label">
                {{ t(`status.indicators.${indicator.id}.label`) }}
              </span>
              <span class="status-indicator__detail">{{ indicator.detail }}</span>
            </div>
            <span class="status-indicator__status">
              {{ t(`status.statusLabels.${indicator.status}`) }}
            </span>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="status-card__footer">
          <BasicIconNext name="Info" :size="16" />
          <span>{{ t('status.footer') }}</span>
        </div>
      </ContentBlock>

      <!-- Contact Card -->
      <ContentBlock variant="card" size="md" class="status-contact">
        <div class="status-contact__icon">
          <BasicIconNext name="MessageSquare" :size="24" />
        </div>
        <div class="status-contact__content">
          <h3>{{ t('status.contact.title') }}</h3>
          <p>{{ t('status.contact.description') }}</p>
        </div>
        <RouterLink to="/profil" class="status-contact__btn">
          <BasicIconNext name="Mail" :size="16" />
          {{ t('status.contact.cta') }}
        </RouterLink>
      </ContentBlock>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import PageContent from '@/features/shared/components/PageContent.vue'
import PageHeader from '@/features/shared/components/PageHeader.vue'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchSystemStatus,
  type SystemStatus,
  type SystemStatusIndicator,
  type SystemStatusLevel,
} from '@/api/supabase/status'
import { getCanonicalUrl, SEO_CONFIG } from '@/config/seo'

const { t } = useI18n()

// SEO
useHead({
  title: computed(() => t('routes.status.title')),
  meta: [
    { name: 'description', content: computed(() => t('routes.status.description')) },
    { property: 'og:title', content: computed(() => t('routes.status.title')) },
    { property: 'og:description', content: computed(() => t('routes.status.description')) },
    { property: 'og:site_name', content: SEO_CONFIG.SITE_NAME },
  ],
  link: [{ rel: 'canonical', href: getCanonicalUrl('/status') }],
})

// State
const status = ref<SystemStatus | null>(null)
const loading = ref(true)

// Computed
const indicators = computed<SystemStatusIndicator[]>(() => {
  if (!status.value) return []
  return [status.value.orders, status.value.shipping, status.value.support]
})

const globalStatus = computed<SystemStatusLevel>(() => {
  if (!status.value) return 'operational'
  const statuses = indicators.value.map((i) => i.status)
  if (statuses.includes('down')) return 'down'
  if (statuses.includes('degraded')) return 'degraded'
  return 'operational'
})

const globalStatusIcon = computed(() => {
  switch (globalStatus.value) {
    case 'operational':
      return 'CheckCircle2'
    case 'degraded':
      return 'AlertTriangle'
    case 'down':
      return 'XCircle'
    default:
      return 'CheckCircle2'
  }
})

const formattedLastCheck = computed(() => {
  if (!status.value?.lastChecked) return ''
  const date = new Date(status.value.lastChecked)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
})

// Lifecycle
onMounted(async () => {
  try {
    status.value = await fetchSystemStatus()
  } catch (e) {
    console.error('[status] Error loading status:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="less">
@import '@designSystem/fondation/breakpoints/responsive-mixins.less';

.status-page {
  min-height: 100vh;
}

// ============================================
// STATUS CARD
// ============================================
.status-card {
  &__header {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--content-block-border);
  }

  &__global {
    display: flex;
    align-items: center;
    gap: 16px;

    &--operational {
      .status-card__global-icon {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }
    }

    &--degraded {
      .status-card__global-icon {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
      }
    }

    &--down {
      .status-card__global-icon {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }
    }
  }

  &__global-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    flex-shrink: 0;
  }

  &__global-info {
    flex: 1;
  }

  &__global-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--content-block-text);
    margin: 0 0 4px;
  }

  &__global-subtitle {
    font-size: 14px;
    color: var(--content-block-text-muted);
    margin: 0;
  }

  &__indicators {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 32px;
    padding-top: 20px;
    border-top: 1px solid var(--content-block-border);
    font-size: 13px;
    color: var(--content-block-text-muted);

    svg {
      flex-shrink: 0;
      opacity: 0.6;
    }
  }
}

// ============================================
// STATUS INDICATOR
// ============================================
.status-indicator {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--content-block-bg-subtle);
  border-radius: 12px;
  transition: background 0.2s ease;

  &__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &--operational {
    .status-indicator__dot {
      background: #10b981;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
    }
    .status-indicator__status {
      color: #10b981;
    }
  }

  &--degraded {
    .status-indicator__dot {
      background: #f59e0b;
      box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
    }
    .status-indicator__status {
      color: #f59e0b;
    }
  }

  &--down {
    .status-indicator__dot {
      background: #ef4444;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
    }
    .status-indicator__status {
      color: #ef4444;
    }
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__label {
    font-size: 15px;
    font-weight: 600;
    color: var(--content-block-text);
  }

  &__detail {
    font-size: 13px;
    color: var(--content-block-text-secondary);
  }

  &__status {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

// ============================================
// STATUS CONTACT
// ============================================
.status-contact {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 24px;

  &__icon {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--primary-500-rgb), 0.1);
    border-radius: 14px;
    color: var(--primary-500);
    flex-shrink: 0;
  }

  &__content {
    flex: 1;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--content-block-text);
      margin: 0 0 4px;
    }

    p {
      font-size: 14px;
      color: var(--content-block-text-muted);
      margin: 0;
    }
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--primary-500);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    color: white;
    text-decoration: none;
    transition: background 0.2s ease, transform 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background: var(--primary-600);
      transform: translateY(-1px);
    }
  }
}

// ============================================
// RESPONSIVE
// ============================================
.respond-mobile({
  .status-card {
    &__global {
      flex-direction: column;
      text-align: center;
    }
  }

  .status-indicator {
    flex-wrap: wrap;

    &__status {
      width: 100%;
      text-align: right;
      margin-top: 8px;
    }
  }

  .status-contact {
    flex-direction: column;
    text-align: center;

    &__btn {
      width: 100%;
      justify-content: center;
    }
  }
});
</style>
