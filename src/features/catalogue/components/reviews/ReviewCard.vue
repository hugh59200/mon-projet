<template>
  <article class="review-item" :class="[review.author_type, { expanded: isExpanded }]">
    <!-- Header compact - toujours visible -->
    <header class="review-item__header" @click="toggle">
      <!-- Avatar -->
      <div class="review-item__avatar" :class="review.author_type">
        {{ getInitials(review.author_name) }}
      </div>

      <!-- Infos principales -->
      <div class="review-item__main">
        <div class="review-item__top">
          <span class="review-item__name">{{ review.author_name }}</span>
          <span v-if="review.author_type !== 'standard'" class="review-item__badge" :class="review.author_type">
            {{ getBadgeLabel(review.author_type) }}
          </span>
        </div>
        <div class="review-item__meta">
          <StarRating :rating="review.rating" size="sm" />
          <span class="review-item__date">{{ formatDate(review.created_at) }}</span>
        </div>
      </div>

      <!-- Chevron -->
      <BasicIconNext
        :name="isExpanded ? 'ChevronUp' : 'ChevronDown'"
        :size="16"
        class="review-item__chevron"
      />
    </header>

    <!-- Contenu déplié -->
    <div v-show="isExpanded" v-motion="contentMotion" class="review-item__content">
      <!-- Titre et texte -->
      <div v-if="review.title || review.content" class="review-item__body">
        <p v-if="review.title" class="review-item__title">{{ review.title }}</p>
        <p v-if="review.content" class="review-item__text">{{ review.content }}</p>
      </div>

      <!-- Infos pro -->
      <div v-if="review.author_title || review.author_institution" class="review-item__pro">
        <BasicIconNext name="Briefcase" :size="14" />
        <span>{{ [review.author_title, review.author_institution].filter(Boolean).join(' - ') }}</span>
      </div>

      <!-- Notes détaillées -->
      <div v-if="hasDetailedRatings" class="review-item__details">
        <div v-if="review.rating_quality" class="review-item__detail">
          <span>Qualité</span>
          <StarRating :rating="review.rating_quality" size="sm" />
        </div>
        <div v-if="review.rating_purity" class="review-item__detail">
          <span>Pureté</span>
          <StarRating :rating="review.rating_purity" size="sm" />
        </div>
        <div v-if="review.rating_shipping" class="review-item__detail">
          <span>Livraison</span>
          <StarRating :rating="review.rating_shipping" size="sm" />
        </div>
        <div v-if="review.rating_value" class="review-item__detail">
          <span>Rapport Q/P</span>
          <StarRating :rating="review.rating_value" size="sm" />
        </div>
      </div>

      <!-- Badges -->
      <div v-if="review.is_verified_purchase || review.is_featured" class="review-item__tags">
        <span v-if="review.is_verified_purchase" class="review-item__tag review-item__tag--verified">
          <BasicIconNext name="CheckCircle" :size="12" />
          Achat vérifié
        </span>
        <span v-if="review.is_featured" class="review-item__tag review-item__tag--featured">
          <BasicIconNext name="Award" :size="12" />
          Mis en avant
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Review } from '@/api/supabase/reviews'
import StarRating from './StarRating.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

dayjs.locale('fr')

const props = defineProps<{
  review: Review
}>()

const isExpanded = ref(false)

const hasDetailedRatings = computed(() => {
  return (
    props.review.rating_quality ||
    props.review.rating_purity ||
    props.review.rating_shipping ||
    props.review.rating_value
  )
})

const contentMotion = computed(() => ({
  initial: { opacity: 0, y: -8, scaleY: 0.96 },
  enter: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { type: 'spring', stiffness: 180, damping: 20 },
  },
  leave: {
    opacity: 0,
    y: -6,
    scaleY: 0.96,
    transition: { duration: 0.2 },
  },
}))

function toggle() {
  isExpanded.value = !isExpanded.value
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getBadgeLabel(type: string): string {
  const labels: Record<string, string> = {
    premium: 'Premium',
    pro: 'Pro',
    verified: 'Vérifié',
  }
  return labels[type] || ''
}

function formatDate(date: string): string {
  return dayjs(date).format('D MMM YYYY')
}
</script>

<style scoped lang="less">
@import '@designSystem/fondation/colors/colors.less';

.review-item {
  position: relative;
  border-radius: 12px;
  background: color-mix(in srgb, @neutral-100 60%, transparent);
  border: 1px solid color-mix(in srgb, @neutral-200 50%, transparent);
  overflow: hidden;
  transition: all 0.2s ease;

  &.expanded {
    background: white;
    border-color: @neutral-200;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  // Types spéciaux
  &.premium {
    border-left: 3px solid #ffd700;
  }

  &.pro {
    border-left: 3px solid var(--primary-500);
  }

  &.verified {
    border-left: 3px solid @success-500;
  }

  // Header
  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    cursor: pointer;
    user-select: none;
    transition: background 0.15s ease;

    &:hover {
      background: color-mix(in srgb, @neutral-200 30%, transparent);
    }
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--primary-500);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 12px;
    flex-shrink: 0;

    &.premium {
      background: linear-gradient(135deg, #ffd700, #ffb700);
      color: #1a1a1a;
    }

    &.pro {
      background: var(--primary-500);
    }

    &.verified {
      background: @success-500;
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__top {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__name {
    font-size: 14px;
    font-weight: 600;
    color: @neutral-800;
  }

  &__badge {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    padding: 2px 6px;
    border-radius: 4px;

    &.premium {
      background: linear-gradient(135deg, #ffd700, #ffb700);
      color: #1a1a1a;
    }

    &.pro {
      background: var(--primary-500);
      color: white;
    }

    &.verified {
      background: @success-500;
      color: white;
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
  }

  &__date {
    font-size: 12px;
    color: @neutral-400;
  }

  &__chevron {
    flex-shrink: 0;
    color: @neutral-400;
    transition: transform 0.2s ease;

    .expanded & {
      transform: rotate(180deg);
    }
  }

  // Contenu
  &__content {
    padding: 0 14px 14px;
    border-top: 1px solid @neutral-100;
    margin-top: 0;
    transform-origin: top;
  }

  &__body {
    padding-top: 12px;
  }

  &__title {
    margin: 0 0 6px;
    font-size: 14px;
    font-weight: 600;
    color: @neutral-800;
  }

  &__text {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: @neutral-600;
  }

  &__pro {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    padding: 8px 10px;
    background: @neutral-50;
    border-radius: 6px;
    font-size: 12px;
    color: @neutral-500;

    :deep(svg) {
      color: @neutral-400;
      fill: @neutral-400;
    }
  }

  &__details {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }

  &__detail {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    background: @neutral-50;
    border-radius: 6px;

    span {
      font-size: 11px;
      color: @neutral-500;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;

    :deep(svg) {
      flex-shrink: 0;
    }

    &--verified {
      background: color-mix(in srgb, @success-500 12%, transparent);
      color: @success-600;

      :deep(svg) {
        fill: @success-600;
      }
    }

    &--featured {
      background: color-mix(in srgb, var(--primary-500) 12%, transparent);
      color: var(--primary-600);

      :deep(svg) {
        fill: var(--primary-600);
      }
    }
  }
}
</style>
