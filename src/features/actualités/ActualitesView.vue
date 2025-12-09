<template>
  <div class="actualites">
    <!-- Header via PageHeader -->
    <PageHeader />

    <PageContent size="xl">
      <!-- Loading State -->
      <ContentBlock v-if="isLoading" variant="card" size="lg" class="actualites__loading">
        <BasicLoader size="medium" />
        <p class="actualites__loading-text">Chargement des articles...</p>
      </ContentBlock>

      <template v-else>
      <!-- Topics Carousel -->
      <section
        v-if="topics.length && featuredArticle"
        class="actualites__topics"
      >
        <div class="actualites__topics-header">
          <div class="actualites__section-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5Z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
            </svg>
          </div>
          <h2 class="actualites__section-title">{{ $t('news.exploreByCategory') }}</h2>
        </div>

        <div class="actualites__topics-carousel">
          <PremiumButton
            type="secondary"
            variant="outline"
            size="sm"
            icon-left="ChevronLeft"
            class="actualites__topics-nav actualites__topics-nav--prev"
            :disabled="!canScrollPrev"
            @click="scrollTopics('prev')"
          />

          <div
            class="actualites__topics-track"
            ref="topicsTrackRef"
          >
            <RouterLink
              v-for="topic in topics"
              :key="topic.id"
              :to="`/actualites?categorie=${topic.id}`"
              class="actualites__topic-card"
              :class="{ 'actualites__topic-card--active': activeCategory === topic.id }"
              :aria-label="$t('news.seeNewsAbout', { topic: topic.label })"
            >
              <div class="actualites__topic-image">
                <img
                  :src="topic.image!"
                  :alt="topic.label"
                  loading="lazy"
                />
                <div class="actualites__topic-overlay"></div>
              </div>
              <div class="actualites__topic-content">
                <span class="actualites__topic-label">{{ topic.label }}</span>
                <div
                  class="actualites__topic-description"
                  v-html="parseAndSanitize(topic.description)"
                />
                <div class="actualites__topic-arrow">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </RouterLink>
          </div>

          <PremiumButton
            type="secondary"
            variant="outline"
            size="sm"
            icon-left="ChevronRight"
            class="actualites__topics-nav actualites__topics-nav--next"
            :disabled="!canScrollNext"
            @click="scrollTopics('next')"
          />
        </div>
      </section>

      <!-- Featured Article -->
      <section
        v-if="featuredArticle"
        class="actualites__featured"
      >
        <div class="actualites__featured-badge">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            />
          </svg>
          <span>{{ $t('news.featuredArticle') }}</span>
        </div>

        <RouterLink
          :to="`/actualites/${featuredArticle.slug}`"
          class="actualites__featured-card"
        >
          <div class="actualites__featured-image">
            <img
              :src="featuredArticle.image!"
              :alt="featuredArticle.title"
            />
            <div class="actualites__featured-image-overlay"></div>
          </div>

          <div class="actualites__featured-content">
            <div class="actualites__featured-meta">
              <span class="actualites__featured-topic">
                {{ featuredArticle.topic?.label || $t('news.defaultTopic') }}
              </span>
              <span class="actualites__featured-date">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect
                    width="18"
                    height="18"
                    x="3"
                    y="4"
                    rx="2"
                    ry="2"
                  />
                  <line
                    x1="16"
                    x2="16"
                    y1="2"
                    y2="6"
                  />
                  <line
                    x1="8"
                    x2="8"
                    y1="2"
                    y2="6"
                  />
                  <line
                    x1="3"
                    x2="21"
                    y1="10"
                    y2="10"
                  />
                </svg>
                {{ formatDate(featuredArticle.published_at) }}
              </span>
            </div>

            <h2 class="actualites__featured-title">{{ featuredArticle.title }}</h2>

            <div
              class="actualites__featured-excerpt"
              v-html="parseAndSanitize(featuredArticle.excerpt)"
            />

            <div class="actualites__featured-cta">
              <span>{{ $t('news.readArticle') }}</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </RouterLink>
      </section>

      <!-- Articles Grid Section -->
      <section class="actualites__grid-section">
        <div class="actualites__grid-header">
          <div class="actualites__grid-title-wrapper">
            <div class="actualites__section-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
                <path d="M15 3v4a2 2 0 0 0 2 2h4" />
              </svg>
            </div>
            <h2 class="actualites__grid-title">{{ activeTopicLabel }}</h2>
          </div>
          <div class="actualites__grid-count">
            <span class="actualites__grid-count-number">{{ nonFeaturedArticles.length }}</span>
            <span class="actualites__grid-count-label">{{ $t('news.articles') }}</span>
          </div>
        </div>

        <!-- Empty State -->
        <ContentBlock
          v-if="!nonFeaturedArticles.length && !isLoading"
          variant="card"
          size="lg"
          class="actualites__empty"
        >
          <div class="actualites__empty-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line
                x1="9"
                x2="15"
                y1="15"
                y2="15"
              />
            </svg>
          </div>
          <h3 class="actualites__empty-title">{{ $t('news.noArticlesFound') }}</h3>
          <p class="actualites__empty-text">
            {{ $t('news.noArticlesText') }}
          </p>
          <PremiumButton
            type="primary"
            variant="solid"
            size="md"
            :label="$t('news.viewAllArticles')"
            icon-left="ArrowLeft"
            @click="$router.push('/actualites')"
          />
        </ContentBlock>

        <!-- Articles Grid -->
        <div
          v-else
          class="actualites__articles"
        >
          <RouterLink
            v-for="(article, index) in nonFeaturedArticles"
            :key="article.slug"
            :to="`/actualites/${article.slug}`"
            class="actualites__article-card"
            :style="{ '--delay': `${index * 0.05}s` }"
          >
            <div class="actualites__article-image">
              <img
                v-if="article.image"
                :src="article.image"
                :alt="article.title"
                loading="lazy"
              />
              <div
                v-else
                class="actualites__article-placeholder"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect
                    width="18"
                    height="18"
                    x="3"
                    y="3"
                    rx="2"
                    ry="2"
                  />
                  <circle
                    cx="9"
                    cy="9"
                    r="2"
                  />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <div class="actualites__article-image-overlay"></div>
            </div>

            <div class="actualites__article-content">
              <div class="actualites__article-meta">
                <span
                  v-if="article.topic"
                  class="actualites__article-topic"
                >
                  {{ article.topic.label }}
                </span>
                <span class="actualites__article-date">
                  {{ formatDate(article.published_at) }}
                </span>
              </div>

              <h3 class="actualites__article-title">{{ article.title }}</h3>

              <div
                class="actualites__article-excerpt"
                v-html="parseAndSanitize(article.excerpt)"
              />

              <div class="actualites__article-read">
                <span>{{ $t('news.readMore') }}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </RouterLink>
        </div>
      </section>

      </template>
    </PageContent>
  </div>
</template>
<script setup lang="ts">
  import { useHead } from '@vueuse/head'
  import PageContent from '@/features/shared/components/PageContent.vue'
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import { formatDate } from '@/utils/index'
  import { parseAndSanitize } from '@/utils/sanitize'
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useNewsStore } from './store/useNewsStore'

  // Configuration SEO pour la page Actualités
  useHead({
    title: 'Actualités & Blog - Atlas Lab Solutions',
    meta: [
      {
        name: 'description',
        content:
          'Découvrez les dernières actualités sur les peptides de recherche, les avancées scientifiques et les guides pratiques. Blog officiel Atlas Lab Solutions.',
      },
      {
        property: 'og:title',
        content: 'Actualités & Blog - Atlas Lab Solutions',
      },
      {
        property: 'og:description',
        content: 'Actualités scientifiques et guides pratiques sur les peptides de recherche.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://fast-peptides.com/actualites',
      },
    ],
  })

  const route = useRoute()

  // --- Store & Data ---
  const newsStore = useNewsStore()
  const { loadTopics, loadArticles } = newsStore
  const { topics, articles } = storeToRefs(newsStore)

  // --- Loading State ---
  const isLoading = ref(false)

  // --- Computed ---
  const activeCategory = computed(() => route.query.categorie as string | undefined)

  const activeTopicLabel = computed(
    () => topics.value.find((t) => t.id === activeCategory.value)?.label || 'Tous nos articles',
  )

  const featuredArticle = computed(() => articles.value[0])
  const nonFeaturedArticles = computed(() => articles.value.slice(1))

  // --- Topics Carousel Logic ---
  const topicsTrackRef = ref<HTMLElement | null>(null)
  const canScrollPrev = ref(false)
  const canScrollNext = ref(true)

  const updateScrollButtons = () => {
    if (!topicsTrackRef.value) return

    const { scrollLeft, scrollWidth, clientWidth } = topicsTrackRef.value
    canScrollPrev.value = scrollLeft > 10
    canScrollNext.value = scrollLeft < scrollWidth - clientWidth - 10
  }

  const scrollTopics = (direction: 'prev' | 'next') => {
    if (!topicsTrackRef.value) return

    const scrollAmount = 360 // card width + gap
    const currentScroll = topicsTrackRef.value.scrollLeft

    topicsTrackRef.value.scrollTo({
      left: direction === 'next' ? currentScroll + scrollAmount : currentScroll - scrollAmount,
      behavior: 'smooth',
    })
  }

  // --- Lifecycle ---
  onMounted(async () => {
    isLoading.value = true

    await loadTopics()
    await loadArticles(activeCategory.value)

    isLoading.value = false

    // Setup carousel scroll listener
    if (topicsTrackRef.value) {
      topicsTrackRef.value.addEventListener('scroll', updateScrollButtons)
      // Initial check
      setTimeout(updateScrollButtons, 100)
    }
  })

  onUnmounted(() => {
    if (topicsTrackRef.value) {
      topicsTrackRef.value.removeEventListener('scroll', updateScrollButtons)
    }
  })

  // --- Watchers ---
  watch(
    () => route.query.categorie,
    async () => {
      isLoading.value = true
      await loadArticles(activeCategory.value, true)
      isLoading.value = false
    },
  )

  // Update scroll buttons when topics change
  watch(topics, () => {
    setTimeout(updateScrollButtons, 100)
  })
</script>
<style scoped lang="less">
  @font-display:
    'Instrument Sans',
    'SF Pro Display',
    -apple-system,
    sans-serif;
  @font-body:
    'Inter',
    'SF Pro Text',
    -apple-system,
    sans-serif;
  @ease: cubic-bezier(0.4, 0, 0.2, 1);
  @bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  .actualites {
    position: relative;
    min-height: 100vh;
    padding-bottom: 80px;

    // ===========================
    // LOADING STATE
    // ===========================
    &__loading {
      // Styles de base gérés par ContentBlock
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    &__loading-text {
      font-family: @font-body;
      font-size: 15px;
      color: var(--text-muted);
      margin: 0;
    }

    // ===========================
    // SECTION HEADERS
    // ===========================
    &__section-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.12) 0%,
        rgba(var(--primary-500-rgb), 0.06) 100%
      );
      border-radius: 12px;
      color: var(--primary-600);
    }

    &__section-title {
      font-family: @font-display;
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    // ===========================
    // TOPICS CAROUSEL
    // ===========================
    &__topics {
      margin-bottom: 56px;
    }

    &__topics-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 24px;
    }

    &__topics-carousel {
      position: relative;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &__topics-nav {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 12px;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s @ease;
      box-shadow: var(--shadow-sm);

      &:hover:not(:disabled) {
        background: var(--bg-surface-secondary);
        border-color: var(--primary-300);
        color: var(--primary-600);
        box-shadow: var(--shadow-md);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    &__topics-track {
      flex: 1;
      display: flex;
      gap: 20px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding: 8px 4px;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__topic-card {
      flex-shrink: 0;
      position: relative;
      width: 320px;
      height: 200px;
      border-radius: 20px;
      overflow: hidden;
      text-decoration: none;
      scroll-snap-align: start;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transition: all 0.3s @ease;

      &:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
        outline: 2px solid var(--primary-400);
        outline-offset: -2px;

        .actualites__topic-arrow {
          opacity: 1;
        }
      }

      &--active {
        box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.3);

        &::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 2px solid var(--primary-500);
          border-radius: 20px;
          pointer-events: none;
        }
      }
    }

    &__topic-image {
      position: absolute;
      inset: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s @ease;
      }
    }

    &__topic-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.85) 0%,
        rgba(0, 0, 0, 0.4) 50%,
        rgba(0, 0, 0, 0.1) 100%
      );
    }

    &__topic-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20px;
      color: white;
    }

    &__topic-label {
      display: block;
      font-family: @font-display;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 6px;
    }

    &__topic-description {
      font-family: @font-body;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.75);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;

      :deep(p) {
        margin: 0;
      }
    }

    &__topic-arrow {
      position: absolute;
      bottom: 20px;
      right: 20px;
      color: white;
      opacity: 0.6;
      transition: all 0.25s @ease;
    }

    // ===========================
    // FEATURED ARTICLE
    // ===========================
    &__featured {
      margin-bottom: 56px;
    }

    &__featured-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: linear-gradient(
        135deg,
        rgba(var(--warning-400-rgb), 0.15) 0%,
        rgba(var(--warning-400-rgb), 0.08) 100%
      );
      border: 1px solid rgba(var(--warning-400-rgb), 0.3);
      border-radius: 50px;
      margin-bottom: 20px;

      svg {
        color: @warning-500;
      }

      span {
        font-family: @font-body;
        font-size: 12px;
        font-weight: 600;
        color: @warning-700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    &__featured-card {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 40px;
      background: var(--bg-surface);
      border-radius: 24px;
      padding: 24px;
      text-decoration: none;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-default);
      transition: all 0.3s @ease;

      &:hover {
        border-color: var(--primary-200);
        box-shadow:
          0 1px 3px rgba(0, 0, 0, 0.04),
          0 8px 32px rgba(0, 0, 0, 0.08);

        .actualites__featured-cta {
          gap: 12px;
          background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
        }
      }
    }

    &__featured-image {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      aspect-ratio: 16 / 10;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s @ease;
      }
    }

    &__featured-image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.1) 0%, transparent 40%);
    }

    &__featured-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 8px 0;
    }

    &__featured-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    &__featured-topic {
      display: inline-block;
      padding: 6px 12px;
      background: rgba(var(--primary-500-rgb), 0.1);
      border-radius: 6px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      color: var(--primary-700);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    &__featured-date {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: @font-body;
      font-size: 13px;
      color: var(--text-muted);

      svg {
        color: var(--text-disabled);
      }
    }

    &__featured-title {
      font-family: @font-display;
      font-size: clamp(24px, 3vw, 32px);
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.25;
      margin: 0 0 16px;
    }

    &__featured-excerpt {
      font-family: @font-body;
      font-size: 15px;
      color: var(--text-secondary);
      line-height: 1.65;
      margin-bottom: 24px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;

      :deep(p) {
        margin: 0;
      }
    }

    &__featured-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 24px;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      border-radius: 12px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: white;
      transition: all 0.25s @ease;
      box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.25);
      align-self: flex-start;
    }
    // ===========================
    // GRID SECTION
    // ===========================
    &__grid-section {
      margin-bottom: 48px;
    }

    &__grid-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-default);
    }

    &__grid-title-wrapper {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    &__grid-title {
      font-family: @font-display;
      font-size: clamp(22px, 3vw, 28px);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    &__grid-count {
      display: flex;
      align-items: baseline;
      gap: 6px;
      padding: 8px 16px;
      background: var(--bg-surface-secondary);
      border-radius: 50px;
    }

    &__grid-count-number {
      font-family: @font-display;
      font-size: 18px;
      font-weight: 700;
      color: var(--primary-600);
    }

    &__grid-count-label {
      font-family: @font-body;
      font-size: 13px;
      color: var(--text-muted);
    }

    // ===========================
    // EMPTY STATE
    // ===========================
    &__empty {
      // Styles de base gérés par ContentBlock
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    &__empty-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 88px;
      height: 88px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.1) 0%,
        rgba(var(--primary-500-rgb), 0.05) 100%
      );
      border-radius: 50%;
      margin-bottom: 24px;
      color: var(--primary-500);
    }

    &__empty-title {
      font-family: @font-display;
      font-size: 22px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 12px;
    }

    &__empty-text {
      font-family: @font-body;
      font-size: 15px;
      color: var(--text-muted);
      line-height: 1.6;
      max-width: 360px;
      margin: 0 0 28px;
    }

    &__empty-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 24px;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      border-radius: 12px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: white;
      text-decoration: none;
      transition: all 0.25s @ease;
      box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.25);

      &:hover {
        box-shadow: 0 6px 20px rgba(var(--primary-500-rgb), 0.3);
      }
    }

    // ===========================
    // ARTICLES GRID
    // ===========================
    &__articles {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
    }

    &__article-card {
      display: flex;
      flex-direction: column;
      background: var(--bg-surface);
      border-radius: 20px;
      overflow: hidden;
      text-decoration: none;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-default);
      transition: all 0.3s @ease;
      animation: card-appear 0.5s @ease backwards;
      animation-delay: var(--delay);

      &:hover {
        border-color: var(--primary-200);
        box-shadow:
          0 1px 3px rgba(0, 0, 0, 0.04),
          0 6px 20px rgba(0, 0, 0, 0.08);

        .actualites__article-read {
          color: var(--primary-600);
          gap: 8px;
        }
      }
    }

    @keyframes card-appear {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    &__article-image {
      position: relative;
      aspect-ratio: 16 / 10;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s @ease;
      }
    }

    &__article-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-surface-tertiary);
      color: var(--text-disabled);
    }

    &__article-image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.05) 0%, transparent 30%);
      pointer-events: none;
    }

    &__article-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 20px;
    }

    &__article-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    &__article-topic {
      padding: 4px 10px;
      background: rgba(var(--primary-500-rgb), 0.08);
      border-radius: 5px;
      font-family: @font-body;
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-700);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    &__article-date {
      font-family: @font-body;
      font-size: 12px;
      color: var(--text-muted);
      font-style: italic;
    }

    &__article-title {
      font-family: @font-display;
      font-size: 17px;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.35;
      margin: 0 0 10px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &__article-excerpt {
      font-family: @font-body;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.55;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 16px;

      :deep(p) {
        margin: 0;
      }

      :deep(a) {
        color: var(--primary-600);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    &__article-read {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      transition: all 0.2s @ease;
      margin-top: auto;
    }

    // ===========================
    // RESPONSIVE - Tablet (≤ 1160px)
    // ===========================
    .respond-tablet({
      &__articles {
        grid-template-columns: repeat(2, 1fr);
      }

      &__featured-card {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      &__featured-image {
        aspect-ratio: 16 / 9;
      }

      &__featured-content {
        padding: 0;
      }

      &__topic-card {
        width: 280px;
        height: 180px;
      }

      &__topics-nav {
        display: none;
      }
    });

    // ===========================
    // RESPONSIVE - Mobile (≤ 720px)
    // ===========================
    .respond-mobile({
      &__header {
        margin-bottom: 36px;
      }

      &__title {
        font-size: 28px;
      }

      &__subtitle {
        font-size: 15px;
      }

      &__topics {
        margin-bottom: 40px;
      }

      &__topic-card {
        width: 260px;
        height: 160px;
      }

      &__featured {
        margin-bottom: 40px;
      }

      &__featured-card {
        padding: 16px;
      }

      &__featured-title {
        font-size: 20px;
      }

      &__featured-cta {
        width: 100%;
        justify-content: center;
      }

      &__grid-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      &__articles {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      &__article-card {
        flex-direction: column;

        .actualites__article-image {
          width: 100%;
          aspect-ratio: 16 / 10;
        }

        .actualites__article-content {
          padding: 16px;
        }

        .actualites__article-excerpt {
          -webkit-line-clamp: 3;
        }
      }


      &__trust {
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }

      &__trust-item {
        font-size: 13px;
      }
    });
  }
</style>
