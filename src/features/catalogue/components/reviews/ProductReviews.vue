<template>
  <div class="product-reviews">
    <div class="reviews-header">
      <h2 class="reviews-title">Avis clients</h2>

      <div v-if="summary" class="reviews-summary">
        <div class="rating-overview">
          <span class="average-rating">{{ summary.average_rating }}</span>
          <div class="stars">
            <StarRating :rating="summary.average_rating" />
          </div>
          <span class="review-count">{{ summary.review_count }} avis</span>
        </div>

        <div class="rating-breakdown">
          <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="rating-bar">
            <span class="star-label">{{ star }} ★</span>
            <div class="bar-container">
              <div class="bar-fill" :style="{ width: getPercentage(star) + '%' }"></div>
            </div>
            <span class="bar-count">{{ getCount(star) }}</span>
          </div>
        </div>
      </div>

      <div v-else class="no-reviews-summary">
        <p>Aucun avis pour le moment</p>
        <p class="cta">Soyez le premier à donner votre avis !</p>
      </div>
    </div>

    <div v-if="canReview" class="add-review-section">
      <BasicButton @click="showReviewForm = true" variant="secondary">
        Donner mon avis
      </BasicButton>
    </div>

    <div v-if="reviews.length > 0" class="reviews-list">
      <ReviewCard v-for="review in displayedReviews" :key="review.id" :review="review" />

      <BasicButton
        v-if="reviews.length > displayLimit"
        @click="showAll = !showAll"
        variant="ghost"
        class="show-more-btn"
      >
        {{ showAll ? 'Voir moins' : `Voir tous les avis (${reviews.length})` }}
      </BasicButton>
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
.product-reviews {
  margin-top: var(--spacing-25);
  padding-top: var(--spacing-25);
  border-top: 1px solid var(--color-border);
}

.reviews-header {
  margin-bottom: var(--spacing-20);
}

.reviews-title {
  font-size: var(--font-size-h3);
  font-weight: 600;
  margin-bottom: var(--spacing-15);
}

.reviews-summary {
  display: flex;
  gap: var(--spacing-25);
  align-items: flex-start;
  flex-wrap: wrap;
}

.rating-overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-5);
  min-width: 120px;

  .average-rating {
    font-size: 48px;
    font-weight: 700;
    color: var(--color-text);
    line-height: 1;
  }

  .review-count {
    font-size: var(--font-size-body-s);
    color: var(--color-text-secondary);
  }
}

.rating-breakdown {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-10);
  margin-bottom: var(--spacing-5);

  .star-label {
    width: 40px;
    font-size: var(--font-size-body-s);
    color: var(--color-text-secondary);
  }

  .bar-container {
    flex: 1;
    height: 8px;
    background: var(--color-background-secondary);
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: var(--color-warning);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .bar-count {
    width: 30px;
    text-align: right;
    font-size: var(--font-size-body-s);
    color: var(--color-text-secondary);
  }
}

.no-reviews-summary {
  text-align: center;
  padding: var(--spacing-20);
  background: var(--color-background-secondary);
  border-radius: var(--radius-md);

  p {
    margin: 0;
    color: var(--color-text-secondary);
  }

  .cta {
    margin-top: var(--spacing-10);
    font-weight: 500;
    color: var(--color-primary);
  }
}

.add-review-section {
  margin-bottom: var(--spacing-20);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-15);
}

.show-more-btn {
  align-self: center;
  margin-top: var(--spacing-10);
}
</style>
