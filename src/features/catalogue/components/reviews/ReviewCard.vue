<template>
  <article class="review-card" :class="[review.author_type, { featured: review.is_featured }]">
    <header class="review-header">
      <div class="author-info">
        <div class="author-avatar">
          {{ getInitials(review.author_name) }}
        </div>
        <div class="author-details">
          <div class="author-name">
            {{ review.author_name }}
            <span v-if="review.author_type !== 'standard'" class="author-badge" :class="review.author_type">
              <svg v-if="review.author_type === 'premium'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <svg v-else-if="review.author_type === 'pro'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z"/>
              </svg>
              <svg v-else-if="review.author_type === 'verified'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              {{ getBadgeLabel(review.author_type) }}
            </span>
          </div>
          <div v-if="review.author_title || review.author_institution" class="author-title">
            {{ [review.author_title, review.author_institution].filter(Boolean).join(' - ') }}
          </div>
        </div>
      </div>

      <div class="review-meta">
        <StarRating :rating="review.rating" size="sm" />
        <time class="review-date" :datetime="review.created_at">
          {{ formatDate(review.created_at) }}
        </time>
      </div>
    </header>

    <div class="review-content">
      <h4 v-if="review.title" class="review-title">{{ review.title }}</h4>
      <p v-if="review.content" class="review-text">{{ review.content }}</p>
    </div>

    <div v-if="hasDetailedRatings" class="detailed-ratings">
      <div v-if="review.rating_quality" class="rating-item">
        <span class="rating-label">Qualité</span>
        <StarRating :rating="review.rating_quality" size="sm" />
      </div>
      <div v-if="review.rating_purity" class="rating-item">
        <span class="rating-label">Pureté</span>
        <StarRating :rating="review.rating_purity" size="sm" />
      </div>
      <div v-if="review.rating_shipping" class="rating-item">
        <span class="rating-label">Livraison</span>
        <StarRating :rating="review.rating_shipping" size="sm" />
      </div>
      <div v-if="review.rating_value" class="rating-item">
        <span class="rating-label">Rapport qualité/prix</span>
        <StarRating :rating="review.rating_value" size="sm" />
      </div>
    </div>

    <footer v-if="review.is_verified_purchase || review.is_featured" class="review-footer">
      <span v-if="review.is_verified_purchase" class="verified-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
        Achat vérifié
      </span>
      <span v-if="review.is_featured" class="featured-badge">
        Avis mis en avant
      </span>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Review } from '@/api/supabase/reviews'
import StarRating from './StarRating.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

dayjs.locale('fr')

const props = defineProps<{
  review: Review
}>()

const hasDetailedRatings = computed(() => {
  return (
    props.review.rating_quality ||
    props.review.rating_purity ||
    props.review.rating_shipping ||
    props.review.rating_value
  )
})

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
  return dayjs(date).format('D MMMM YYYY')
}
</script>

<style scoped lang="less">
.review-card {
  padding: var(--spacing-15);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;

  &.featured {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  }

  // Style Premium - élégant et luxueux
  &.premium {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.03) 0%, rgba(255, 183, 0, 0.08) 100%);
    border: 1px solid rgba(255, 195, 0, 0.3);
    box-shadow: 0 2px 12px rgba(255, 195, 0, 0.1);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #ffd700, #ffb700, #ffd700);
    }
  }

  // Style Pro - professionnel et moderne
  &.pro {
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.03) 0%, rgba(var(--primary-500-rgb), 0.08) 100%);
    border: 1px solid rgba(var(--primary-500-rgb), 0.25);
    box-shadow: 0 2px 12px rgba(var(--primary-500-rgb), 0.08);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--color-primary), rgba(var(--primary-500-rgb), 0.7), var(--color-primary));
    }
  }

  // Style Verified - confiance
  &.verified {
    background: linear-gradient(135deg, rgba(var(--success-rgb, 34, 197, 94), 0.02) 0%, rgba(var(--success-rgb, 34, 197, 94), 0.06) 100%);
    border: 1px solid rgba(var(--success-rgb, 34, 197, 94), 0.2);
  }
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-15);
  margin-bottom: var(--spacing-10);
  flex-wrap: wrap;
}

.author-info {
  display: flex;
  gap: var(--spacing-10);
  align-items: center;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--font-size-body-s);

  .premium & {
    background: linear-gradient(135deg, #ffd700, #ffb700);
    color: #000;
    box-shadow: 0 2px 8px rgba(255, 195, 0, 0.3);
  }

  .pro & {
    background: var(--color-primary);
    box-shadow: 0 2px 8px rgba(var(--primary-500-rgb), 0.3);
  }
}

.author-details {
  .author-name {
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: var(--spacing-5);
  }

  .author-title {
    font-size: var(--font-size-body-s);
    color: var(--color-text-secondary);
  }
}

.author-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  svg {
    flex-shrink: 0;
  }

  &.premium {
    background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
    color: #000;
    box-shadow: 0 2px 6px rgba(255, 195, 0, 0.25);
  }

  &.pro {
    background: linear-gradient(135deg, var(--color-primary) 0%, rgba(var(--primary-500-rgb), 0.85) 100%);
    color: white;
    box-shadow: 0 2px 6px rgba(var(--primary-500-rgb), 0.25);
  }

  &.verified {
    background: linear-gradient(135deg, var(--color-success), rgba(var(--success-rgb, 34, 197, 94), 0.85));
    color: white;
    box-shadow: 0 2px 6px rgba(var(--success-rgb, 34, 197, 94), 0.25);
  }
}

.review-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-5);
}

.review-date {
  font-size: var(--font-size-body-s);
  color: var(--color-text-secondary);
}

.review-content {
  margin-bottom: var(--spacing-10);

  .review-title {
    font-size: var(--font-size-body);
    font-weight: 600;
    margin: 0 0 var(--spacing-5);
  }

  .review-text {
    margin: 0;
    color: var(--color-text);
    line-height: 1.6;
  }
}

.detailed-ratings {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-15);
  padding-top: var(--spacing-10);
  border-top: 1px solid var(--color-border);
  margin-top: var(--spacing-10);
}

.rating-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-5);

  .rating-label {
    font-size: var(--font-size-body-s);
    color: var(--color-text-secondary);
  }
}

.review-footer {
  display: flex;
  gap: var(--spacing-10);
  margin-top: var(--spacing-10);
  padding-top: var(--spacing-10);
  border-top: 1px solid var(--color-border);
}

.verified-badge,
.featured-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-body-s);
  color: var(--color-success);

  svg {
    flex-shrink: 0;
  }
}

.featured-badge {
  color: var(--color-primary);
}
</style>
