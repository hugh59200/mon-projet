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
          <BasicIconNext name="ArrowLeft" :size="18" />
          <span>{{ $t('news.backToNews') }}</span>
        </RouterLink>
      </nav>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="article-detail__loading"
      >
        <div class="article-detail__loading-spinner">
          <BasicIconNext name="Loader2" :size="40" />
        </div>
        <p class="article-detail__loading-text">{{ $t('news.loadingArticle') }}</p>
      </div>

      <!-- Empty State -->
      <ContentBlock
        v-else-if="!article"
        variant="card"
        size="lg"
        class="article-detail__empty"
      >
        <div class="article-detail__empty-icon">
          <BasicIconNext name="FileWarning" :size="48" />
        </div>
        <h2 class="article-detail__empty-title">{{ $t('news.articleNotFound') }}</h2>
        <p class="article-detail__empty-text">{{ $t('news.articleNotFoundText') }}</p>
        <RouterLink
          to="/actualites"
          class="article-detail__empty-btn"
        >
          <BasicIconNext name="ArrowLeft" :size="16" />
          {{ $t('news.viewAllArticles') }}
        </RouterLink>
      </ContentBlock>

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
              <BasicIconNext name="Layers" :size="14" />
              {{ article.topic.label }}
            </span>
            <span class="article-detail__date">
              <BasicIconNext name="Calendar" :size="14" />
              {{ $t('news.publishedOn') }} {{ formatDate(article.published_at) }}
            </span>
          </div>

          <h1 class="article-detail__title">{{ article.title }}</h1>

          <!-- Reading time estimate -->
          <div class="article-detail__reading-info">
            <BasicIconNext name="Clock" :size="16" />
            <span>{{ estimatedReadingTime }} {{ $t('news.readingTime') }}</span>
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
              :alt="$t('news.coverImageAlt', { title: article.title })"
            />
            <div class="article-detail__cover-overlay"></div>
          </div>
          <p class="article-detail__cover-hint">
            <BasicIconNext name="ZoomIn" :size="14" />
            {{ $t('news.clickToZoom') }}
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
            <span class="article-detail__share-label">{{ $t('news.shareArticle') }}</span>
            <div class="article-detail__share-buttons">
              <PremiumButton
                type="secondary"
                variant="outline"
                size="sm"
                icon-left="Twitter"
                class="article-detail__share-btn article-detail__share-btn--twitter"
                @click="shareArticle('twitter')"
              />
              <PremiumButton
                type="secondary"
                variant="outline"
                size="sm"
                icon-left="Linkedin"
                class="article-detail__share-btn article-detail__share-btn--linkedin"
                @click="shareArticle('linkedin')"
              />
              <PremiumButton
                type="secondary"
                variant="outline"
                size="sm"
                :icon-left="linkCopied ? 'Check' : 'Copy'"
                class="article-detail__share-btn article-detail__share-btn--copy"
                @click="shareArticle('copy')"
              />
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
              <BasicIconNext name="Layers" :size="14" />
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
            <BasicIconNext name="File" :size="20" />
          </div>
          <h2 class="article-detail__related-title">{{ $t('news.similarArticles') }}</h2>
        </div>

        <div class="article-detail__related-grid">
          <ContentBlock
            v-for="(related, index) in relatedArticles"
            :key="related.slug"
            as="RouterLink"
            :to="`/actualites/${related.slug}`"
            variant="card"
            size="sm"
            :interactive="true"
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
          </ContentBlock>
        </div>
      </section>

      <!-- Footer Trust -->
      <footer
        v-if="article && !loading"
        class="article-detail__trust-footer"
      >
        <div class="article-detail__trust">
          <div class="article-detail__trust-item">
            <BasicIconNext name="ShieldCheck" :size="18" />
            <span>{{ $t('news.verifiedSources') }}</span>
          </div>
          <div class="article-detail__trust-item">
            <BasicIconNext name="BookOpen" :size="18" />
            <span>{{ $t('news.scientificContent') }}</span>
          </div>
          <div class="article-detail__trust-item">
            <BasicIconNext name="Pencil" :size="18" />
            <span>{{ $t('news.writtenByExperts') }}</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useHead } from '@vueuse/head'
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

  // Configuration SEO dynamique pour les articles
  const pageTitle = computed(() => {
    if (!article.value) return 'Article - Atlas Lab Solutions'
    return `${article.value.title} | Blog Atlas Lab`
  })

  const pageDescription = computed(() => {
    if (!article.value) return 'Découvrez nos articles sur les peptides de recherche.'
    // Extraire un extrait du contenu sans HTML
    const textContent = (article.value.content ?? '').replace(/<[^>]*>/g, '').substring(0, 155)
    return textContent + '...'
  })

  // Schema BreadcrumbList pour les rich snippets de navigation
  const breadcrumbSchema = computed(() => {
    if (!article.value) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: 'https://fast-peptides.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Actualités',
          item: 'https://fast-peptides.com/actualites',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.value.title,
          item: `https://fast-peptides.com/actualites/${route.params.slug}`,
        },
      ],
    }
  })

  // Schema BlogPosting pour les rich snippets (meilleur que Article pour les blogs)
  const articleSchema = computed(() => {
    if (!article.value) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.value.title,
      description: pageDescription.value,
      image: {
        '@type': 'ImageObject',
        url: article.value.image || 'https://fast-peptides.com/default-article.jpg',
        width: 1200,
        height: 630,
      },
      datePublished: article.value.published_at || article.value.created_at,
      dateModified: article.value.published_at || article.value.created_at,
      author: {
        '@type': 'Organization',
        name: 'Atlas Lab Solutions',
        url: 'https://fast-peptides.com/about',
        logo: {
          '@type': 'ImageObject',
          url: 'https://fast-peptides.com/logo.png',
        },
      },
      publisher: {
        '@type': 'Organization',
        name: 'Atlas Lab Solutions',
        url: 'https://fast-peptides.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://fast-peptides.com/logo.png',
          width: 200,
          height: 60,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://fast-peptides.com/actualites/${route.params.slug}`,
      },
      articleSection: article.value.topic?.label || 'Recherche',
      wordCount: estimatedReadingTime.value * 200,
      inLanguage: 'fr-FR',
      keywords: article.value.topic?.label
        ? `${article.value.topic.label}, peptides, recherche scientifique, Atlas Lab Solutions`
        : 'peptides, recherche scientifique, Atlas Lab Solutions',
    }
  })

  // Meta keywords dynamiques pour le SEO
  const pageKeywords = computed(() => {
    const baseKeywords = ['peptides', 'recherche scientifique', 'Atlas Lab Solutions', 'laboratoire']
    if (article.value?.topic?.label) {
      baseKeywords.unshift(article.value.topic.label)
    }
    // Extraire quelques mots clés du titre
    if (article.value?.title) {
      const titleWords = article.value.title
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 4 && !['dans', 'pour', 'avec', 'cette', 'cette'].includes(w))
        .slice(0, 3)
      baseKeywords.push(...titleWords)
    }
    return baseKeywords.join(', ')
  })

  useHead({
    title: pageTitle,
    meta: [
      {
        name: 'description',
        content: pageDescription,
      },
      {
        name: 'keywords',
        content: pageKeywords,
      },
      {
        name: 'author',
        content: 'Atlas Lab Solutions',
      },
      {
        property: 'og:title',
        content: pageTitle,
      },
      {
        property: 'og:description',
        content: pageDescription,
      },
      {
        property: 'og:type',
        content: 'article',
      },
      {
        property: 'og:image',
        content: computed(() => article.value?.image || 'https://fast-peptides.com/default-article.jpg'),
      },
      {
        property: 'article:published_time',
        content: computed(() => article.value?.published_at || article.value?.created_at || ''),
      },
      {
        property: 'article:modified_time',
        content: computed(() => article.value?.published_at || article.value?.created_at || ''),
      },
      {
        property: 'article:section',
        content: computed(() => article.value?.topic?.label || 'Recherche'),
      },
      {
        property: 'article:author',
        content: 'Atlas Lab Solutions',
      },
      // Twitter Cards
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: pageTitle,
      },
      {
        name: 'twitter:description',
        content: pageDescription,
      },
      {
        name: 'twitter:image',
        content: computed(() => article.value?.image || 'https://fast-peptides.com/default-article.jpg'),
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: computed(() => `https://fast-peptides.com/actualites/${route.params.slug}`),
      },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: computed(() => (breadcrumbSchema.value ? JSON.stringify(breadcrumbSchema.value) : '')),
      },
      {
        type: 'application/ld+json',
        innerHTML: computed(() => (articleSchema.value ? JSON.stringify(articleSchema.value) : '')),
      },
    ],
  })

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
        transform: translate(0, 0);
      }
      33% {
        transform: translate(20px, -25px);
      }
      66% {
        transform: translate(-15px, 15px);
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
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 12px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.25s @ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      svg {
        transition: transform 0.25s @ease;
      }

      &:hover {
        background: var(--bg-surface-secondary);
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
      color: var(--text-tertiary);
      margin: 0;
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
      border: 2px dashed var(--border-default);
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
      color: var(--text-primary);
      margin: 0 0 12px;
    }

    &__empty-text {
      font-family: @font-body;
      font-size: 15px;
      color: var(--text-tertiary);
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
      color: var(--text-tertiary);
      font-style: italic;

      svg {
        color: var(--text-tertiary);
      }
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(28px, 5vw, 42px);
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
      margin: 0 0 20px;
      letter-spacing: -0.02em;
    }

    &__reading-info {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: var(--bg-surface-secondary);
      border-radius: 10px;
      font-family: @font-body;
      font-size: 13px;
      color: var(--text-secondary);

      svg {
        color: var(--text-tertiary);
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
        // Pas d'effet de grossissement
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
      color: var(--text-tertiary);

      svg {
        color: var(--text-tertiary);
      }
    }

    // ===========================
    // ARTICLE BODY
    // ===========================
    &__body {
      font-family: @font-body;
      font-size: 17px;
      line-height: 1.8;
      color: var(--text-secondary);

      :deep(p) {
        margin-bottom: 1.5em;
      }

      :deep(h2) {
        font-family: @font-display;
        font-size: 28px;
        font-weight: 700;
        color: var(--text-primary);
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
        color: var(--text-secondary);
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
        color: var(--text-primary);
      }

      :deep(em) {
        font-style: italic;
        color: var(--text-secondary);
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
        color: var(--text-secondary);

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
        background: var(--bg-surface-secondary);
        border-radius: 16px;
        overflow-x: auto;

        code {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 14px;
          color: var(--text-primary);
        }
      }

      :deep(code) {
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 0.9em;
        padding: 3px 8px;
        background: var(--bg-surface-secondary);
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
          border-bottom: 1px solid var(--border-subtle);
        }

        th {
          background: var(--bg-surface-secondary);
          font-weight: 600;
          color: var(--text-primary);
        }

        tr:last-child td {
          border-bottom: none;
        }

        tr:hover td {
          background: var(--bg-surface-secondary);
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
      border-top: 1px solid var(--border-subtle);
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
      color: var(--text-secondary);
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
        background: var(--bg-surface-secondary);
        color: var(--text-secondary);

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
      background: var(--bg-surface-secondary);
      border: 1px solid var(--border-default);
      border-radius: 50px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.25s @ease;

      svg {
        color: var(--text-tertiary);
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
      border-top: 1px solid var(--border-subtle);
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
      color: var(--text-primary);
      margin: 0;
    }

    &__related-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    &__related-card {
      // Styles de base gérés par ContentBlock
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      text-decoration: none;
      animation: card-appear 0.5s @ease backwards;
      animation-delay: var(--delay);
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
      color: var(--text-primary);
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
      color: var(--text-tertiary);
      font-style: italic;
    }

    // ===========================
    // TRUST FOOTER
    // ===========================
    &__trust-footer {
      margin-top: 56px;
      padding-top: 32px;
      border-top: 1px solid var(--border-subtle);
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
      color: var(--text-tertiary);

      svg {
        color: @success-500;
      }
    }

    // ===========================
    // RESPONSIVE
    // ===========================
    .respond-mobile({
      &__container {
        padding: 24px 16px;
      }

      &__nav {
        margin-bottom: 24px;
      }

      &__back {
        padding: 10px 16px;
        font-size: 13px;
        min-height: 44px;

        span {
          display: none;
        }
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
        font-size: 22px;
        margin-bottom: 16px;
      }

      &__reading-info {
        padding: 8px 14px;
        font-size: 12px;
      }

      &__cover-wrapper {
        border-radius: 16px;

        :deep(img) {
          max-height: 240px;
        }
      }

      &__cover-hint {
        display: none;
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

      &__share-btn {
        width: 44px;
        height: 44px;
      }

      &__related {
        margin-top: 48px;
        padding-top: 36px;
      }

      &__related-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      &__related-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      &__related-card {
        flex-direction: column;

        .article-detail__related-image {
          width: 100%;
          aspect-ratio: 16 / 10;
        }

        .article-detail__related-content {
          padding: 14px;
          justify-content: center;
        }
      }

      &__trust {
        flex-direction: column;
        align-items: center;
        gap: 14px;
      }

      &__trust-item {
        font-size: 13px;
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
    });
  }
</style>
