<template>
  <ContentBlock variant="card" size="lg" class="track-status">
    <div class="track-status__header">
      <div class="track-status__info">
        <div
          class="track-status__badge"
          :class="`track-status__badge--${order.status}`"
        >
          <span class="track-status__dot"></span>
          <span>{{ getLabelBadge(order.status || '') }}</span>
        </div>
        <p class="track-status__message">{{ getStatusMessage(order.status || '') }}</p>
      </div>
      <div class="track-status__date">
        <BasicIconNext name="Calendar" :size="18" />
        <span>Commandée le {{ formatDate(order.created_at) }}</span>
      </div>
    </div>

    <!-- Timeline -->
    <div class="track-status__timeline">
      <div class="track-status__timeline-progress">
        <div
          class="track-status__timeline-progress-bar"
          :style="{ width: getProgressWidth() }"
        ></div>
      </div>

      <div class="track-status__timeline-steps">
        <div
          v-for="(step, index) in TIMELINE_STEPS"
          :key="step.key"
          class="track-status__timeline-step"
          :class="{
            'track-status__timeline-step--active': isStepActive(step.statuses),
            'track-status__timeline-step--current': isCurrentStep(step.statuses, index),
          }"
        >
          <div class="track-status__timeline-icon">
            <BasicIconNext v-if="isStepActive(step.statuses)" name="Check" :size="20" />
            <span v-else class="track-status__timeline-number">{{ index + 1 }}</span>
          </div>
          <div class="track-status__timeline-content">
            <span class="track-status__timeline-label">{{ step.label }}</span>
            <span v-if="step.dateField && (order as any)[step.dateField]" class="track-status__timeline-date">
              {{ formatDate((order as any)[step.dateField]) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </ContentBlock>
</template>

<script setup lang="ts">
import type { OrdersFullView } from '@/supabase/types/supabase.types'
import { getLabelBadge } from '@/utils'

const props = defineProps<{
  order: OrdersFullView
}>()

const TIMELINE_STEPS = [
  {
    key: 'confirmed',
    label: 'Confirmée',
    statuses: ['paid', 'confirmed', 'processing', 'shipped', 'completed'],
    dateField: 'created_at',
  },
  {
    key: 'processing',
    label: 'En préparation',
    statuses: ['processing', 'shipped', 'completed'],
    dateField: null,
  },
  {
    key: 'shipped',
    label: 'Expédiée',
    statuses: ['shipped', 'completed'],
    dateField: 'shipped_at',
  },
  {
    key: 'completed',
    label: 'Livrée',
    statuses: ['completed'],
    dateField: null,
  },
]

function isStepActive(validStatuses: string[]) {
  if (!props.order.status) return false
  return validStatuses.includes(props.order.status)
}

function isCurrentStep(validStatuses: string[], index: number) {
  if (!props.order.status) return false
  const isActive = validStatuses.includes(props.order.status)
  const nextStep = TIMELINE_STEPS[index + 1]
  const nextIsActive = nextStep ? nextStep.statuses.includes(props.order.status) : false
  return isActive && !nextIsActive
}

function getProgressWidth() {
  if (!props.order.status) return '0%'

  const statusOrder = ['paid', 'confirmed', 'processing', 'shipped', 'completed']
  const currentIndex = statusOrder.indexOf(props.order.status)

  if (currentIndex === -1) return '0%'
  if (props.order.status === 'canceled') return '0%'

  const percentages: Record<string, string> = {
    'paid': '12%',
    'confirmed': '12%',
    'processing': '37%',
    'shipped': '62%',
    'completed': '100%',
  }

  return percentages[props.order.status] || '0%'
}

function getStatusMessage(status: string) {
  const messages: Record<string, string> = {
    'paid': 'Votre commande a été confirmée et sera bientôt préparée.',
    'confirmed': 'Votre commande a été confirmée et sera bientôt préparée.',
    'processing': 'Votre commande est en cours de préparation dans nos entrepôts.',
    'shipped': 'Votre colis est en route vers l\'adresse de livraison.',
    'completed': 'Votre commande a été livrée avec succès. Merci pour votre confiance !',
    'cancelled': 'Cette commande a été annulée.',
  }
  return messages[status] || 'Statut de commande en cours de mise à jour.'
}

function formatDate(date: string | null | undefined) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<style scoped lang="less">
@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.track-status {
  // Styles de base gérés par ContentBlock

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 36px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    border-radius: 50px;
    font-family: @font-body;
    font-size: 14px;
    font-weight: 600;
    width: fit-content;

    &--paid,
    &--confirmed {
      background: linear-gradient(135deg, rgba(var(--success-500-rgb), 0.12) 0%, rgba(var(--success-500-rgb), 0.06) 100%);
      color: @success-600;
      .track-status__dot { background: @success-500; }
    }

    &--processing {
      background: linear-gradient(135deg, rgba(var(--info-500-rgb), 0.12) 0%, rgba(var(--info-500-rgb), 0.06) 100%);
      color: @info-600;
      .track-status__dot { background: @info-500; }
    }

    &--shipped {
      background: linear-gradient(135deg, rgba(var(--secondary-500-rgb), 0.12) 0%, rgba(var(--secondary-500-rgb), 0.06) 100%);
      color: var(--secondary-600);
      .track-status__dot { background: var(--secondary-500); }
    }

    &--completed {
      background: linear-gradient(135deg, rgba(var(--success-500-rgb), 0.15) 0%, rgba(var(--success-500-rgb), 0.08) 100%);
      color: @success-700;
      .track-status__dot { background: @success-500; }
    }

    &--cancelled {
      background: linear-gradient(135deg, rgba(var(--danger-500-rgb), 0.12) 0%, rgba(var(--danger-500-rgb), 0.06) 100%);
      color: @danger-600;
      .track-status__dot { background: @danger-500; }
    }
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.85); }
  }

  &__message {
    font-family: @font-body;
    font-size: 15px;
    color: var(--text-secondary);
    margin: 0;
    max-width: 400px;
    line-height: 1.5;
  }

  &__date {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: @font-body;
    font-size: 14px;
    color: var(--chrome-fg-muted);
    padding: 10px 16px;
    background: var(--chrome-bg-secondary);
    border-radius: 10px;

    svg {
      color: var(--chrome-fg-muted);
    }
  }

  // Timeline
  &__timeline {
    position: relative;
    padding: 32px;
    background: var(--chrome-bg-secondary);
    border-radius: 20px;
  }

  &__timeline-progress {
    position: absolute;
    top: 58px;
    left: 80px;
    right: 80px;
    height: 4px;
    background: var(--chrome-border);
    border-radius: 2px;
    overflow: hidden;
  }

  &__timeline-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-500), var(--primary-400));
    border-radius: 2px;
    transition: width 0.8s @ease;
  }

  &__timeline-steps {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  &__timeline-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    flex: 1;
    text-align: center;

    &--active {
      .track-status__timeline-icon {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        border-color: var(--primary-500);
        color: white;
        box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.35);
      }

      .track-status__timeline-label {
        color: var(--chrome-fg);
        font-weight: 600;
      }
    }

    &--current {
      .track-status__timeline-icon {
        animation: pulse-icon 2s ease-in-out infinite;
      }
    }
  }

  @keyframes pulse-icon {
    0%, 100% { box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.35); }
    50% { box-shadow: 0 4px 24px rgba(var(--primary-500-rgb), 0.5); }
  }

  &__timeline-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    background: var(--chrome-bg);
    border: 2px solid var(--chrome-border);
    border-radius: 50%;
    color: var(--chrome-fg-muted);
    transition: all 0.4s @ease;
    font-family: @font-display;
    font-size: 16px;
    font-weight: 700;
  }

  &__timeline-number {
    color: inherit;
  }

  &__timeline-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__timeline-label {
    font-family: @font-body;
    font-size: 14px;
    font-weight: 500;
    color: var(--chrome-fg-muted);
    transition: all 0.3s @ease;
  }

  &__timeline-date {
    font-family: @font-body;
    font-size: 12px;
    color: var(--chrome-fg-muted);
  }
}

// Responsive
.respond-mobile({
  .track-status {
    &__header {
      flex-direction: column;
      gap: 20px;
    }

    &__timeline {
      padding: 24px 16px;
      overflow-x: auto;
    }

    &__timeline-progress {
      display: none;
    }

    &__timeline-steps {
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
    }

    &__timeline-step {
      width: 45%;
      min-width: 80px;
    }

    &__timeline-icon {
      width: 44px;
      height: 44px;
    }

    &__timeline-label {
      font-size: 12px;
    }
  }
});
</style>
