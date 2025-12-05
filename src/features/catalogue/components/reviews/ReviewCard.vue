<template>
  <article class="review-card" :class="{ featured: review.is_featured }">
    <header class="review-header">
      <div class="author-info">
        <div class="author-avatar">
          {{ getInitials(review.author_name) }}
        </div>
        <div class="author-details">
          <div class="author-name">
            {{ review.author_name }}
            <span v-if="review.author_type !== 'standard'" class="author-badge" :class="review.author_type">
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

  &.featured {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
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
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  text-transform: uppercase;

  &.premium {
    background: linear-gradient(135deg, #ffd700, #ffb700);
    color: #000;
  }

  &.pro {
    background: var(--color-primary);
    color: white;
  }

  &.verified {
    background: var(--color-success);
    color: white;
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
