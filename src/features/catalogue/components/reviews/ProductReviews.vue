<template>
  <div class="product-reviews">
    <div class="reviews-header">
      <div class="reviews-header__top">
        <h2 class="reviews-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="reviews-icon">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          Avis clients
        </h2>
        <BasicButton v-if="canReview" @click="showReviewForm = true" variant="secondary" size="small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Donner mon avis
        </BasicButton>
      </div>

      <div v-if="summary" class="reviews-summary">
        <div class="rating-overview">
          <div class="rating-score">
            <span class="average-rating">{{ summary.average_rating }}</span>
            <span class="rating-max">/5</span>
          </div>
          <StarRating :rating="summary.average_rating" size="lg" />
          <span class="review-count">Basé sur {{ summary.review_count }} avis</span>
        </div>

        <div class="rating-breakdown">
          <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="rating-bar">
            <span class="star-label">{{ star }}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-warning)">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <div class="bar-container">
              <div class="bar-fill" :style="{ width: getPercentage(star) + '%' }"></div>
            </div>
            <span class="bar-count">{{ getCount(star) }}</span>
          </div>
        </div>
      </div>

      <div v-else class="no-reviews-summary">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
        <p class="empty-title">Aucun avis pour le moment</p>
        <p class="cta">Soyez le premier à partager votre expérience !</p>
        <BasicButton v-if="canReview" @click="showReviewForm = true" variant="primary" size="small">
          Donner mon avis
        </BasicButton>
      </div>
    </div>

    <div v-if="reviews.length > 0" class="reviews-list">
      <ReviewCard v-for="review in displayedReviews" :key="review.id" :review="review" />

      <button
        v-if="reviews.length > displayLimit"
        @click="showAll = !showAll"
        class="show-more-btn"
      >
        {{ showAll ? 'Voir moins' : `Voir tous les avis (${reviews.length})` }}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ rotated: showAll }">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
    </div>

    <ReviewFormModal
      v-if="showReviewForm"
      :product-id="productId"
      :product-name="productName"
      @close="showReviewForm = false"
      @submitted="onReviewSubmitted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchReviewsByProductId, fetchReviewSummary, hasUserReviewed } from '@/api'
import type { Review, ReviewSummary } from '@/api/supabase/reviews'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import StarRating from './StarRating.vue'
import ReviewCard from './ReviewCard.vue'
import ReviewFormModal from './ReviewFormModal.vue'

const props = defineProps<{
  productId: string
  productName: string
}>()

const authStore = useAuthStore()
const reviews = ref<Review[]>([])
const summary = ref<ReviewSummary | null>(null)
const showReviewForm = ref(false)
const showAll = ref(false)
const hasReviewed = ref(false)
const displayLimit = 5

const displayedReviews = computed(() => {
  return showAll.value ? reviews.value : reviews.value.slice(0, displayLimit)
})

const canReview = computed(() => {
  return authStore.isAuthenticated && !hasReviewed.value
})

function getCount(stars: number): number {
  if (!summary.value) return 0
  const countMap: Record<number, number> = {
    5: summary.value.five_star_count,
    4: summary.value.four_star_count,
    3: summary.value.three_star_count,
    2: summary.value.two_star_count,
    1: summary.value.one_star_count,
  }
  return countMap[stars] || 0
}

function getPercentage(stars: number): number {
  if (!summary.value || summary.value.review_count === 0) return 0
  return (getCount(stars) / summary.value.review_count) * 100
}

async function loadReviews() {
  const [reviewsData, summaryData] = await Promise.all([
    fetchReviewsByProductId(props.productId),
    fetchReviewSummary(props.productId),
  ])

  reviews.value = reviewsData
  summary.value = summaryData

  if (authStore.user?.id) {
    hasReviewed.value = await hasUserReviewed(props.productId, authStore.user.id)
  }
}

async function onReviewSubmitted() {
  showReviewForm.value = false
  hasReviewed.value = true
}

onMounted(() => {
  loadReviews()
})
</script>

<style scoped lang="less">
@import '@designSystem/fondation/breakpoints/responsive-mixins.less';

.product-reviews {
  margin-top: var(--spacing-30);
  padding-top: var(--spacing-30);
  border-top: 1px solid var(--color-border);
}

.reviews-header {
  margin-bottom: var(--spacing-25);

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-20);
    gap: var(--spacing-15);
    flex-wrap: wrap;
  }
}

.reviews-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-10);
  font-size: var(--font-size-h3);
  font-weight: 600;
  margin: 0;

  .reviews-icon {
    color: var(--color-warning);
  }
}

.reviews-summary {
  display: flex;
  gap: var(--spacing-30);
  align-items: stretch;
  padding: var(--spacing-20);
  background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.02) 0%, rgba(var(--primary-500-rgb), 0.06) 100%);
  border: 1px solid rgba(var(--primary-500-rgb), 0.1);
  border-radius: var(--radius-lg);

  .respond-mobile({
    flex-direction: column;
    gap: var(--spacing-20);
  });
}

.rating-overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-10);
  padding-right: var(--spacing-30);
  border-right: 1px solid var(--color-border);
  min-width: 160px;

  .respond-mobile({
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    padding-right: 0;
    padding-bottom: var(--spacing-20);
    min-width: auto;
  });

  .rating-score {
    display: flex;
    align-items: baseline;
    gap: 2px;
  }

  .average-rating {
    font-size: 56px;
    font-weight: 700;
    color: var(--color-text);
    line-height: 1;
  }

  .rating-max {
    font-size: var(--font-size-h4);
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .review-count {
    font-size: var(--font-size-body-s);
    color: var(--color-text-secondary);
  }
}

.rating-breakdown {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-10);
  min-width: 200px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-10);

  .star-label {
    width: 16px;
    font-size: var(--font-size-body-s);
    font-weight: 600;
    color: var(--color-text);
    text-align: right;
  }

  svg {
    flex-shrink: 0;
  }

  .bar-container {
    flex: 1;
    height: 10px;
    background: var(--color-background-secondary);
    border-radius: 5px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-warning), #ffb700);
    border-radius: 5px;
    transition: width 0.4s ease;
  }

  .bar-count {
    width: 28px;
    text-align: right;
    font-size: var(--font-size-body-s);
    font-weight: 500;
    color: var(--color-text-secondary);
  }
}

.no-reviews-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-30);
  background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.02) 0%, rgba(var(--primary-500-rgb), 0.06) 100%);
  border: 1px dashed rgba(var(--primary-500-rgb), 0.2);
  border-radius: var(--radius-lg);
  gap: var(--spacing-10);

  .empty-icon {
    color: var(--color-text-tertiary);
    margin-bottom: var(--spacing-5);
  }

  .empty-title {
    margin: 0;
    font-size: var(--font-size-body);
    font-weight: 600;
    color: var(--color-text);
  }

  .cta {
    margin: 0;
    font-size: var(--font-size-body-s);
    color: var(--color-text-secondary);
  }
}

.reviews-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-20);

  .respond-tablet({
    grid-template-columns: 1fr;
    gap: var(--spacing-15);
  });
}

.show-more-btn {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-10);
  padding: var(--spacing-15) var(--spacing-20);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-body-s);
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  svg {
    transition: transform 0.2s ease;

    &.rotated {
      transform: rotate(180deg);
    }
  }
}
</style>
