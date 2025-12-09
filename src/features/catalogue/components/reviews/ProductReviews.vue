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
        <PremiumButton
          v-if="canReview"
          type="secondary"
          variant="outline"
          size="sm"
          label="Donner mon avis"
          icon-left="Plus"
          @click="showReviewForm = true"
        />
      </div>

      <ContentBlock v-if="summary" variant="info" size="md" class="reviews-summary">
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
      </ContentBlock>

      <ContentBlock v-else variant="card" size="lg" class="no-reviews-summary">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
        <p class="empty-title">Aucun avis pour le moment</p>
        <p class="cta">Soyez le premier à partager votre expérience !</p>
        <PremiumButton
          v-if="canReview"
          type="primary"
          size="sm"
          label="Donner mon avis"
          @click="showReviewForm = true"
        />
      </ContentBlock>
    </div>

    <div v-if="reviews.length > 0" class="reviews-list">
      <ReviewCard v-for="review in displayedReviews" :key="review.id" :review="review" />

      <PremiumButton
        v-if="reviews.length > displayLimit"
        type="secondary"
        variant="ghost"
        size="sm"
        :label="showAll ? 'Voir moins' : `Voir tous les avis (${reviews.length})`"
        :icon-right="showAll ? 'ChevronUp' : 'ChevronDown'"
        class="show-more-btn"
        @click="showAll = !showAll"
      />
    </div>

    <ReviewFormModal
      v-if="showReviewForm"
      :product-id="productId"
      :product-name="productName"
      :review-token="reviewToken"
      :order-id="orderId"
      :guest-name="guestName"
      @close="showReviewForm = false"
      @submitted="onReviewSubmitted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { fetchReviewsByProductId, fetchReviewSummary, hasUserReviewed } from '@/api'
import type { Review, ReviewSummary } from '@/api/supabase/reviews'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import StarRating from './StarRating.vue'
import ReviewCard from './ReviewCard.vue'
import ReviewFormModal from './ReviewFormModal.vue'

const props = defineProps<{
  productId: string
  productName: string
  // Props pour le mode invité (magic link)
  reviewToken?: string
  orderId?: string
  guestName?: string
}>()

const authStore = useAuthStore()
const reviews = ref<Review[]>([])
const summary = ref<ReviewSummary | null>(null)
const showReviewForm = ref(false)
const showAll = ref(false)
const hasReviewed = ref(false)
const displayLimit = 5

// Mode invité (magic link)
const isGuestMode = computed(() => Boolean(props.reviewToken && props.orderId))

const displayedReviews = computed(() => {
  return showAll.value ? reviews.value : reviews.value.slice(0, displayLimit)
})

const canReview = computed(() => {
  // Mode invité avec magic link
  if (isGuestMode.value) return true
  // Mode authentifié normal
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

// Ouvrir automatiquement le formulaire si on arrive avec un magic link
watch(isGuestMode, (isGuest) => {
  if (isGuest) {
    showReviewForm.value = true
  }
}, { immediate: true })
</script>

<style scoped lang="less">
@import '../../../../../designSystem/src/fondation/breakpoints/responsive-mixins.less';
@import '../../../../../designSystem/src/fondation/colors/colors.less';

.product-reviews {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid @neutral-200;
}

.reviews-header {
  margin-bottom: 24px;

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    gap: 12px;
    flex-wrap: wrap;
  }
}

.reviews-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  margin: 0;

  .reviews-icon {
    color: #f59e0b;
  }
}

.reviews-summary {
  // Styles de base gérés par ContentBlock
  display: flex;
  gap: 32px;
  align-items: stretch;

  .respond-mobile({
    flex-direction: column;
    gap: 16px;
  });
}

.rating-overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-right: 32px;
  border-right: 1px solid @neutral-200;
  min-width: 160px;

  .respond-mobile({
    border-right: none;
    border-bottom: 1px solid @neutral-200;
    padding-right: 0;
    padding-bottom: 16px;
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
    color: @neutral-800;
    line-height: 1;
  }

  .rating-max {
    font-size: 18px;
    font-weight: 500;
    color: @neutral-500;
  }

  .review-count {
    font-size: 12px;
    color: @neutral-500;
  }
}

.rating-breakdown {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  min-width: 200px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 8px;

  .star-label {
    width: 16px;
    font-size: 12px;
    font-weight: 600;
    color: @neutral-800;
    text-align: right;
  }

  svg {
    flex-shrink: 0;
  }

  .bar-container {
    flex: 1;
    height: 10px;
    background: @neutral-100;
    border-radius: 5px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #f59e0b, #ffb700);
    border-radius: 5px;
    transition: width 0.4s ease;
  }

  .bar-count {
    width: 28px;
    text-align: right;
    font-size: 12px;
    font-weight: 500;
    color: @neutral-500;
  }
}

.no-reviews-summary {
  // Styles de base gérés par ContentBlock
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  border: 1px dashed @neutral-200;

  .empty-icon {
    color: @neutral-400;
    margin-bottom: 4px;
  }

  .empty-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: @neutral-800;
  }

  .cta {
    margin: 0;
    font-size: 12px;
    color: @neutral-500;
  }
}

.reviews-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  .respond-tablet({
    grid-template-columns: 1fr;
    gap: 12px;
  });
}

.show-more-btn {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: transparent;
  border: 1px solid @neutral-200;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: @neutral-500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-500);
    color: var(--primary-500);
  }

  svg {
    transition: transform 0.2s ease;

    &.rotated {
      transform: rotate(180deg);
    }
  }
}
</style>
