<template>
  <div class="article-detail">
    <!-- Background premium -->
    <div class="article-detail__bg">
      <div class="article-detail__bg-gradient"></div>
      <div class="article-detail__bg-pattern"></div>
      <div class="article-detail__bg-orb article-detail__bg-orb--1"></div>
      <div class="article-detail__bg-orb article-detail__bg-orb--2"></div>
    </div>

    <div class="article-detail__container">
      <!-- Breadcrumb / Back Link -->
      <nav class="article-detail__nav">
        <RouterLink
          to="/actualites"
          class="article-detail__back"
        >
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
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          <span>Retour aux actualités</span>
        </RouterLink>
      </nav>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="article-detail__loading"
      >
        <div class="article-detail__loading-spinner">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
        <p class="article-detail__loading-text">Chargement de l'article...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!article"
        class="article-detail__empty"
      >
        <div class="article-detail__empty-icon">
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
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <h2 class="article-detail__empty-title">Article non trouvé</h2>
        <p class="article-detail__empty-text">Cet article n'existe pas ou n'est plus disponible.</p>
        <RouterLink
          to="/actualites"
          class="article-detail__empty-btn"
        >
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
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Voir tous les articles
        </RouterLink>
      </div>

      <!-- Article Content -->
      <article
        v-else
        class="article-detail__article"
      >
        <!-- Article Header -->
        <header class="article-detail__header">
          <div class="article-detail__meta">
            <span
              v-if="article.topic"
              class="article-detail__topic"
            >
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
                <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                <path d="m2 17 10 5 10-5" />
                <path d="m2 12 10 5 10-5" />
              </svg>
              {{ article.topic.label }}
            </span>
            <span class="article-detail__date">
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
              Publié le {{ formatDate(article.published_at) }}
            </span>
          </div>

          <h1 class="article-detail__title">{{ article.title }}</h1>

          <!-- Reading time estimate -->
          <div class="article-detail__reading-info">
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
              <circle
                cx="12"
                cy="12"
                r="10"
              />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{{ estimatedReadingTime }} min de lecture</span>
          </div>
        </header>

        <!-- Cover Image -->
        <div
          v-if="article.image"
          class="article-detail__cover"
        >
          <div class="article-detail__cover-wrapper">
            <InnerImageZoom
              :src="article.image"
              :zoomSrc="article.image"
              class="article-detail__cover-image"
              :alt="`Image de couverture : ${article.title}`"
            />
            <div class="article-detail__cover-overlay"></div>
          </div>
          <p class="article-detail__cover-hint">
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
              <circle
                cx="11"
                cy="11"
                r="8"
              />
              <path d="m21 21-4.3-4.3" />
              <path d="M11 8v6" />
              <path d="M8 11h6" />
            </svg>
            Cliquez sur l'image pour zoomer
          </p>
        </div>

        <!-- Article Body -->
        <div
          class="article-detail__body"
          v-html="parsedContent"
        ></div>

        <!-- Article Footer -->
        <footer class="article-detail__footer">
          <div class="article-detail__share">
            <span class="article-detail__share-label">Partager cet article</span>
            <div class="article-detail__share-buttons">
              <button
                @click="shareArticle('twitter')"
                class="article-detail__share-btn article-detail__share-btn--twitter"
                aria-label="Partager sur Twitter"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </svg>
              </button>
              <button
                @click="shareArticle('linkedin')"
                class="article-detail__share-btn article-detail__share-btn--linkedin"
                aria-label="Partager sur LinkedIn"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
              </button>
              <button
                @click="shareArticle('copy')"
                class="article-detail__share-btn article-detail__share-btn--copy"
                aria-label="Copier le lien"
              >
                <svg
                  v-if="!linkCopied"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect
                    width="14"
                    height="14"
                    x="8"
                    y="8"
                    rx="2"
                    ry="2"
                  />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                <svg
                  v-else
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>
          </div>

          <div
            class="article-detail__tags"
            v-if="article.topic"
          >
            <RouterLink
              :to="`/actualites?categorie=${article.topic_id}`"
              class="article-detail__tag"
            >
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
                <path d="M12 2L2 7l10 5 10-5-10-5Z" />
              </svg>
              {{ article.topic.label }}
            </RouterLink>
          </div>
        </footer>
      </article>

      <!-- Related Articles Section -->
      <section
        v-if="relatedArticles.length && !loading"
        class="article-detail__related"
      >
        <div class="article-detail__related-header">
          <div class="article-detail__section-icon">
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
          <h2 class="article-detail__related-title">Articles similaires</h2>
        </div>

        <div class="article-detail__related-grid">
          <RouterLink
            v-for="(related, index) in relatedArticles"
            :key="related.slug"
            :to="`/actualites/${related.slug}`"
            class="article-detail__related-card"
            :style="{ '--delay': `${index * 0.1}s` }"
          >
            <div class="article-detail__related-image">
              <img
                :src="related.image!"
                :alt="related.title"
                loading="lazy"
              />
              <div class="article-detail__related-overlay"></div>
            </div>
            <div class="article-detail__related-content">
              <span
                v-if="related.topic"
                class="article-detail__related-topic"
              >
                {{ related.topic.label }}
              </span>
              <h3 class="article-detail__related-name">{{ related.title }}</h3>
              <span class="article-detail__related-date">
                {{ formatDate(related.published_at) }}
              </span>
            </div>
          </RouterLink>
        </div>
      </section>

      <!-- Footer Trust -->
      <footer
        v-if="article && !loading"
        class="article-detail__trust-footer"
      >
        <div class="article-detail__trust">
          <div class="article-detail__trust-item">
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
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>Sources vérifiées</span>
          </div>
          <div class="article-detail__trust-item">
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
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span>Contenu scientifique</span>
          </div>
          <div class="article-detail__trust-item">
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
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
            <span>Rédigé par des experts</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { fetchNews, fetchNewsBySlug } from '@/api/supabase/news'
  import type { News } from '@/supabase/types/supabase.types'
  import { formatDate } from '@/utils/index'
  import { parseAndSanitize } from '@/utils/sanitize'
  import { computed, onMounted, ref, watch } from 'vue'
  import InnerImageZoom from 'vue-inner-image-zoom'
  import { useRoute } from 'vue-router'

  // ===========================
  // TYPES
  // ===========================
  export interface NewsTopic {
    label: string
  }

  export interface NewsDetail extends News {
    topic: NewsTopic | null
  }

  // ===========================
  // COMPOSABLES
  // ===========================
  const route = useRoute()

  // ===========================
  // STATE
  // ===========================
  const loading = ref(true)
  const article = ref<NewsDetail | null>(null)
  const relatedArticles = ref<NewsDetail[]>([])
  const linkCopied = ref(false)

  // ===========================
  // COMPUTED
  // ===========================
  const parsedContent = computed(() =>
    article.value?.content ? parseAndSanitize(article.value.content) : '',
  )

  // Estimation du temps de lecture (environ 200 mots/minute)
  const estimatedReadingTime = computed(() => {
    if (!article.value?.content) return 1

    // Supprimer les balises HTML pour compter les mots
    const textContent = article.value.content.replace(/<[^>]*>/g, '')
    const wordCount = textContent.split(/\s+/).filter((word) => word.length > 0).length
    const minutes = Math.ceil(wordCount / 200)

    return Math.max(1, minutes)
  })

  // ===========================
  // METHODS
  // ===========================
  const loadArticle = async (slug: string) => {
    loading.value = true

    try {
      const fetchedArticle = (await fetchNewsBySlug(slug)) as NewsDetail
      article.value = fetchedArticle

      if (article.value?.topic_id) {
        const all = (await fetchNews(article.value.topic_id)) as NewsDetail[]
        relatedArticles.value = all.filter((a) => a.slug !== slug).slice(0, 4) // Limité à 4 articles similaires
      } else {
        relatedArticles.value = []
      }

      // Scroll to top on article load
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error("Erreur lors du chargement de l'article:", error)
      article.value = null
      relatedArticles.value = []
    } finally {
      loading.value = false
    }
  }

  const shareArticle = async (platform: 'twitter' | 'linkedin' | 'copy') => {
    if (!article.value) return

    const url = window.location.href
    const title = article.value.title

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          '_blank',
          'width=550,height=420',
        )
        break

      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank',
          'width=550,height=420',
        )
        break

      case 'copy':
        try {
          await navigator.clipboard.writeText(url)
          linkCopied.value = true
          setTimeout(() => {
            linkCopied.value = false
          }, 2000)
        } catch (err) {
          console.error('Erreur lors de la copie du lien:', err)
        }
        break
    }
  }

  // ===========================
  // LIFECYCLE
  // ===========================
  onMounted(async () => {
    const slug = route.params.slug as string
    await loadArticle(slug)
  })

  // Watch for route changes (when navigating between articles)
  watch(
    () => route.params.slug,
    async (newSlug) => {
      if (newSlug && typeof newSlug === 'string') {
        await loadArticle(newSlug)
      }
    },
  )
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

  .article-detail {
    position: relative;
    min-height: 100vh;
    padding-bottom: 80px;

    // ===========================
    // BACKGROUND PREMIUM
    // ===========================
    &__bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    &__bg-gradient {
      position: absolute;
      inset: 0;
    }

    &__bg-pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(var(--primary-500-rgb), 0.03) 1px, transparent 1px);
      background-size: 28px 28px;
      mask-image: linear-gradient(to bottom, black 0%, transparent 50%);
    }

    &__bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.6;

      &--1 {
        top: 10%;
        right: 5%;
        width: 400px;
        height: 400px;
        background: rgba(var(--primary-400-rgb), 0.1);
        animation: float-orb 22s ease-in-out infinite;
      }

      &--2 {
        bottom: 40%;
        left: 0;
        width: 300px;
        height: 300px;
        background: rgba(var(--primary-300-rgb), 0.08);
        animation: float-orb 28s ease-in-out infinite reverse;
      }
    }

    @keyframes float-orb {
      0%,
      100% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(20px, -25px) scale(1.03);
      }
      66% {
        transform: translate(-15px, 15px) scale(0.97);
      }
    }

    // ===========================
    // CONTAINER
    // ===========================
    &__container {
      position: relative;
      z-index: 1;
      max-width: 820px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    // ===========================
    // NAVIGATION
    // ===========================
    &__nav {
      margin-bottom: 32px;
    }

    &__back {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 500;
      color: @neutral-600;
      text-decoration: none;
      transition: all 0.25s @ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      svg {
        transition: transform 0.25s @ease;
      }

      &:hover {
        background: @neutral-50;
        border-color: var(--primary-300);
        color: var(--primary-700);
        transform: translateX(-4px);

        svg {
          transform: translateX(-3px);
        }
      }
    }

    // ===========================
    // LOADING STATE
    // ===========================
    &__loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 120px 24px;
      text-align: center;
    }

    &__loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.1) 0%,
        rgba(var(--primary-500-rgb), 0.05) 100%
      );
      border-radius: 50%;
      margin-bottom: 20px;
      color: var(--primary-500);

      svg {
        animation: spin 1s linear infinite;
      }
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    &__loading-text {
      font-family: @font-body;
      font-size: 15px;
      color: @neutral-500;
      margin: 0;
    }

    // ===========================
    // EMPTY STATE
    // ===========================
    &__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 100px 24px;
      background: white;
      border-radius: 24px;
      border: 2px dashed @neutral-200;
      text-align: center;
    }

    &__empty-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 88px;
      height: 88px;
      background: linear-gradient(135deg, rgba(var(--danger-500-rgb), 0.1) 0%, rgba(var(--danger-500-rgb), 0.05) 100%);
      border-radius: 50%;
      margin-bottom: 24px;
      color: @danger-500;
    }

    &__empty-title {
      font-family: @font-display;
      font-size: 24px;
      font-weight: 700;
      color: @neutral-900;
      margin: 0 0 12px;
    }

    &__empty-text {
      font-family: @font-body;
      font-size: 15px;
      color: @neutral-500;
      line-height: 1.6;
      max-width: 320px;
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
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(var(--primary-500-rgb), 0.35);
      }
    }

    // ===========================
    // ARTICLE HEADER
    // ===========================
    &__article {
      animation: fade-in 0.5s @ease;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    &__header {
      margin-bottom: 32px;
    }

    &__meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 20px;
    }

    &__topic {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.1) 0%,
        rgba(var(--primary-500-rgb), 0.05) 100%
      );
      border: 1px solid rgba(var(--primary-500-rgb), 0.15);
      border-radius: 50px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      color: var(--primary-700);
      text-transform: uppercase;
      letter-spacing: 0.04em;

      svg {
        color: var(--primary-500);
      }
    }

    &__date {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-500;
      font-style: italic;

      svg {
        color: @neutral-400;
      }
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(28px, 5vw, 42px);
      font-weight: 700;
      color: @neutral-900;
      line-height: 1.2;
      margin: 0 0 20px;
      letter-spacing: -0.02em;
    }

    &__reading-info {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: @neutral-50;
      border-radius: 10px;
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-600;

      svg {
        color: @neutral-400;
      }
    }

    // ===========================
    // COVER IMAGE
    // ===========================
    &__cover {
      margin-bottom: 40px;
    }

    &__cover-wrapper {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.08),
        0 12px 48px rgba(0, 0, 0, 0.08);

      :deep(img) {
        width: 100%;
        max-height: 480px;
        object-fit: cover;
        cursor: zoom-in;
        transition: transform 0.4s @ease;
      }

      &:hover :deep(img) {
        transform: scale(1.02);
      }
    }

    &__cover-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.08) 0%, transparent 30%);
      pointer-events: none;
    }

    &__cover-hint {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin: 12px 0 0;
      font-family: @font-body;
      font-size: 12px;
      color: @neutral-400;

      svg {
        color: @neutral-300;
      }
    }

    // ===========================
    // ARTICLE BODY
    // ===========================
    &__body {
      font-family: @font-body;
      font-size: 17px;
      line-height: 1.8;
      color: @neutral-800;

      :deep(p) {
        margin-bottom: 1.5em;
      }

      :deep(h2) {
        font-family: @font-display;
        font-size: 28px;
        font-weight: 700;
        color: @neutral-900;
        margin: 48px 0 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid rgba(var(--primary-500-rgb), 0.15);
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 60px;
          height: 2px;
          background: var(--primary-500);
        }
      }

      :deep(h3) {
        font-family: @font-display;
        font-size: 22px;
        font-weight: 600;
        color: var(--primary-700);
        margin: 36px 0 16px;
      }

      :deep(h4) {
        font-family: @font-display;
        font-size: 18px;
        font-weight: 600;
        color: @neutral-800;
        margin: 28px 0 12px;
      }

      :deep(ul),
      :deep(ol) {
        margin: 24px 0;
        padding-left: 24px;
      }

      :deep(li) {
        margin-bottom: 10px;
        padding-left: 8px;

        &::marker {
          color: var(--primary-500);
        }
      }

      :deep(strong) {
        font-weight: 700;
        color: @neutral-900;
      }

      :deep(em) {
        font-style: italic;
        color: @neutral-700;
      }

      :deep(a) {
        color: var(--primary-600);
        text-decoration: underline;
        text-underline-offset: 3px;
        transition: color 0.2s @ease;

        &:hover {
          color: var(--primary-700);
        }
      }

      :deep(blockquote) {
        margin: 32px 0;
        padding: 24px 28px;
        background: linear-gradient(
          135deg,
          rgba(var(--primary-500-rgb), 0.06) 0%,
          rgba(var(--primary-500-rgb), 0.02) 100%
        );
        border-left: 4px solid var(--primary-500);
        border-radius: 0 16px 16px 0;
        font-style: italic;
        color: @neutral-700;

        p {
          margin: 0;
        }
      }

      :deep(img) {
        max-width: 100%;
        height: auto;
        border-radius: 16px;
        margin: 32px 0;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      :deep(pre) {
        margin: 28px 0;
        padding: 24px;
        background: var(--secondary-900);
        border-radius: 16px;
        overflow-x: auto;

        code {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 14px;
          color: @neutral-100;
        }
      }

      :deep(code) {
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 0.9em;
        padding: 3px 8px;
        background: @neutral-100;
        border-radius: 6px;
        color: var(--primary-700);
      }

      :deep(table) {
        width: 100%;
        margin: 32px 0;
        border-collapse: collapse;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

        th,
        td {
          padding: 14px 18px;
          text-align: left;
          border-bottom: 1px solid @neutral-100;
        }

        th {
          background: @neutral-50;
          font-weight: 600;
          color: @neutral-800;
        }

        tr:last-child td {
          border-bottom: none;
        }

        tr:hover td {
          background: @neutral-50;
        }
      }
    } // ===========================
    // ARTICLE FOOTER
    // ===========================
    &__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 24px;
      margin-top: 48px;
      padding-top: 32px;
      border-top: 1px solid @neutral-100;
    }

    &__share {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &__share-label {
      font-family: @font-body;
      font-size: 14px;
      font-weight: 500;
      color: @neutral-600;
    }

    &__share-buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &__share-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.25s @ease;

      &--twitter {
        background: @info-50;
        color: @info-500;

        &:hover {
          background: @info-500;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(var(--info-500-rgb), 0.35);
        }
      }

      &--linkedin {
        background: @info-50;
        color: @info-700;

        &:hover {
          background: @info-700;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(var(--info-700-rgb), 0.35);
        }
      }

      &--copy {
        background: @neutral-100;
        color: @neutral-600;

        &:hover {
          background: var(--primary-500);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(var(--primary-500-rgb), 0.35);
        }
      }
    }

    &__tags {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &__tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: @neutral-50;
      border: 1px solid @neutral-200;
      border-radius: 50px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: @neutral-600;
      text-decoration: none;
      transition: all 0.25s @ease;

      svg {
        color: @neutral-400;
        transition: color 0.25s @ease;
      }

      &:hover {
        background: rgba(var(--primary-500-rgb), 0.08);
        border-color: rgba(var(--primary-500-rgb), 0.2);
        color: var(--primary-700);

        svg {
          color: var(--primary-500);
        }
      }
    }

    // ===========================
    // RELATED ARTICLES
    // ===========================
    &__related {
      margin-top: 64px;
      padding-top: 48px;
      border-top: 1px solid @neutral-100;
    }

    &__related-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 28px;
    }

    &__section-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.12) 0%,
        rgba(var(--primary-500-rgb), 0.06) 100%
      );
      border-radius: 14px;
      color: var(--primary-600);
    }

    &__related-title {
      font-family: @font-display;
      font-size: 24px;
      font-weight: 700;
      color: @neutral-900;
      margin: 0;
    }

    &__related-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    &__related-card {
      position: relative;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 18px;
      overflow: hidden;
      text-decoration: none;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 4px 16px rgba(0, 0, 0, 0.04);
      border: 1px solid @neutral-100;
      transition: all 0.3s @ease;
      animation: card-appear 0.5s @ease backwards;
      animation-delay: var(--delay);

      &:hover {
        transform: translateY(-6px);
        box-shadow:
          0 1px 3px rgba(0, 0, 0, 0.04),
          0 12px 32px rgba(0, 0, 0, 0.12);

        .article-detail__related-image img {
          transform: scale(1.08);
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

    &__related-image {
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

    &__related-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.06) 0%, transparent 40%);
      pointer-events: none;
    }

    &__related-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 18px;
    }

    &__related-topic {
      display: inline-block;
      align-self: flex-start;
      padding: 5px 10px;
      background: rgba(var(--primary-500-rgb), 0.08);
      border-radius: 6px;
      font-family: @font-body;
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-700);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    &__related-name {
      font-family: @font-display;
      font-size: 16px;
      font-weight: 600;
      color: @neutral-900;
      line-height: 1.35;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &__related-date {
      font-family: @font-body;
      font-size: 12px;
      color: @neutral-400;
      font-style: italic;
    }

    // ===========================
    // TRUST FOOTER
    // ===========================
    &__trust-footer {
      margin-top: 56px;
      padding-top: 32px;
      border-top: 1px solid @neutral-100;
    }

    &__trust {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 36px;
    }

    &__trust-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-500;

      svg {
        color: @success-500;
      }
    }

    // ===========================
    // RESPONSIVE
    // ===========================
    @media (max-width: 768px) {
      &__container {
        padding: 24px 16px;
      }

      &__nav {
        margin-bottom: 24px;
      }

      &__back {
        padding: 10px 16px;
        font-size: 13px;
      }

      &__meta {
        gap: 12px;
      }

      &__topic {
        padding: 6px 12px;
        font-size: 11px;
      }

      &__date {
        font-size: 13px;
      }

      &__title {
        font-size: 26px;
        margin-bottom: 16px;
      }

      &__reading-info {
        padding: 8px 14px;
        font-size: 12px;
      }

      &__cover-wrapper {
        border-radius: 16px;

        :deep(img) {
          max-height: 320px;
        }
      }

      &__body {
        font-size: 16px;
        line-height: 1.75;

        :deep(h2) {
          font-size: 22px;
          margin: 36px 0 16px;
        }

        :deep(h3) {
          font-size: 18px;
          margin: 28px 0 12px;
        }

        :deep(blockquote) {
          padding: 18px 20px;
          margin: 24px 0;
        }
      }

      &__footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
      }

      &__share {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      &__related {
        margin-top: 48px;
        padding-top: 36px;
      }

      &__related-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      &__related-card {
        flex-direction: row;

        .article-detail__related-image {
          width: 120px;
          flex-shrink: 0;
          aspect-ratio: 1;
        }

        .article-detail__related-content {
          padding: 14px;
          justify-content: center;
        }
      }

      &__trust {
        gap: 20px;
      }

      &__trust-item {
        font-size: 13px;
      }
    }

    @media (max-width: 480px) {
      &__back {
        span {
          display: none;
        }

        padding: 10px;
        border-radius: 10px;
      }

      &__title {
        font-size: 22px;
      }

      &__cover-wrapper :deep(img) {
        max-height: 240px;
      }

      &__cover-hint {
        display: none;
      }

      &__share-btn {
        width: 38px;
        height: 38px;
      }

      &__related-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      &__related-card {
        flex-direction: column;

        .article-detail__related-image {
          width: 100%;
          aspect-ratio: 16 / 10;
        }
      }

      &__trust {
        flex-direction: column;
        align-items: center;
        gap: 14px;
      }

      &__empty {
        padding: 60px 20px;
      }

      &__empty-icon {
        width: 72px;
        height: 72px;

        svg {
          width: 36px;
          height: 36px;
        }
      }
    }
  }
</style>
