<template>
  <div class="glossaire-detail">
    <!-- Background -->
    <div class="glossaire-detail__bg">
      <div class="glossaire-detail__bg-gradient"></div>
    </div>

    <div class="glossaire-detail__container">
      <!-- Navigation -->
      <nav class="glossaire-detail__nav">
        <RouterLink to="/glossaire" class="glossaire-detail__back">
          <BasicIconNext name="ArrowLeft" :size="18" />
          <span>{{ $t('glossary.backToGlossary') }}</span>
        </RouterLink>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="glossaire-detail__loading">
        <div class="glossaire-detail__loading-spinner">
          <BasicIconNext name="Loader2" :size="40" />
        </div>
        <p class="glossaire-detail__loading-text">Chargement de la définition...</p>
      </div>

      <!-- Empty State -->
      <ContentBlock
        v-else-if="!term"
        variant="card"
        size="lg"
        class="glossaire-detail__empty"
      >
        <div class="glossaire-detail__empty-icon">
          <BasicIconNext name="BookX" :size="48" />
        </div>
        <h2 class="glossaire-detail__empty-title">Terme introuvable</h2>
        <p class="glossaire-detail__empty-text">
          Ce terme n'existe pas ou n'est plus disponible.
        </p>
        <RouterLink to="/glossaire" class="glossaire-detail__empty-btn">
          <BasicIconNext name="ArrowLeft" :size="16" />
          Retour au glossaire
        </RouterLink>
      </ContentBlock>

      <!-- Term Content -->
      <article v-else class="glossaire-detail__article">
        <!-- Header -->
        <header class="glossaire-detail__header">
          <div class="glossaire-detail__breadcrumb">
            <RouterLink to="/" class="glossaire-detail__breadcrumb-link">Accueil</RouterLink>
            <BasicIconNext name="ChevronRight" :size="14" />
            <RouterLink to="/glossaire" class="glossaire-detail__breadcrumb-link">Glossaire</RouterLink>
            <BasicIconNext name="ChevronRight" :size="14" />
            <span class="glossaire-detail__breadcrumb-current">{{ term.term }}</span>
          </div>

          <h1 class="glossaire-detail__title">{{ term.term }}</h1>
        </header>

        <!-- Definition -->
        <ContentBlock variant="card" size="lg" class="glossaire-detail__definition">
          <div class="glossaire-detail__definition-label">
            <BasicIconNext name="BookOpen" :size="18" />
            <span>{{ $t('glossary.definition') }}</span>
          </div>
          <div class="glossaire-detail__definition-content" v-html="parsedDefinition"></div>
        </ContentBlock>

        <!-- Related Products -->
        <section
          v-if="term.relatedProducts && term.relatedProducts.length > 0"
          class="glossaire-detail__related"
        >
          <div class="glossaire-detail__related-header">
            <BasicIconNext name="Package" :size="20" />
            <h2>{{ $t('glossary.relatedProducts') }}</h2>
          </div>
          <div class="glossaire-detail__related-grid">
            <RouterLink
              v-for="product in term.relatedProducts"
              :key="product.id"
              :to="`/catalogue/${product.slug}`"
              class="glossaire-detail__product-card"
            >
              <div class="glossaire-detail__product-image">
                <img
                  :src="product.image || '/placeholder-product.png'"
                  :alt="product.name"
                  loading="lazy"
                />
              </div>
              <div class="glossaire-detail__product-info">
                <h3 class="glossaire-detail__product-name">{{ product.name }}</h3>
                <p v-if="product.dosage" class="glossaire-detail__product-dosage">
                  {{ product.dosage }}
                </p>
                <div class="glossaire-detail__product-price">
                  <span v-if="product.is_on_sale && product.sale_price" class="glossaire-detail__product-price--sale">
                    {{ formatPrice(product.sale_price) }} €
                  </span>
                  <span :class="{ 'glossaire-detail__product-price--original': product.is_on_sale }">
                    {{ formatPrice(product.price) }} €
                  </span>
                </div>
              </div>
              <div class="glossaire-detail__product-cta">
                <span>{{ $t('glossary.seeProduct') }}</span>
                <BasicIconNext name="ArrowRight" :size="16" />
              </div>
            </RouterLink>
          </div>
        </section>

        <!-- Related Resources -->
        <section
          v-if="term.relatedResources && term.relatedResources.length > 0"
          class="glossaire-detail__related"
        >
          <div class="glossaire-detail__related-header">
            <BasicIconNext name="FileText" :size="20" />
            <h2>{{ $t('glossary.relatedResources') }}</h2>
          </div>
          <div class="glossaire-detail__resources">
            <RouterLink
              v-for="resource in term.relatedResources"
              :key="resource.id"
              :to="`/ressources/${resource.slug}`"
              class="glossaire-detail__resource-card"
            >
              <div class="glossaire-detail__resource-content">
                <h3 class="glossaire-detail__resource-title">{{ resource.title }}</h3>
                <p v-if="resource.excerpt" class="glossaire-detail__resource-excerpt">
                  {{ resource.excerpt }}
                </p>
              </div>
              <div class="glossaire-detail__resource-arrow">
                <BasicIconNext name="ChevronRight" :size="18" />
              </div>
            </RouterLink>
          </div>
        </section>

        <!-- Share -->
        <footer class="glossaire-detail__footer">
          <div class="glossaire-detail__share">
            <span class="glossaire-detail__share-label">Partager cette définition</span>
            <div class="glossaire-detail__share-buttons">
              <PremiumButton
                type="secondary"
                variant="outline"
                size="sm"
                icon-left="Twitter"
                @click="shareDefinition('twitter')"
              />
              <PremiumButton
                type="secondary"
                variant="outline"
                size="sm"
                icon-left="Linkedin"
                @click="shareDefinition('linkedin')"
              />
              <PremiumButton
                type="secondary"
                variant="outline"
                size="sm"
                :icon-left="linkCopied ? 'Check' : 'Copy'"
                @click="shareDefinition('copy')"
              />
            </div>
          </div>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { fetchGlossaryTermBySlug, type GlossaryTermWithRelations } from '@/api/supabase/glossary'
import { parseAndSanitize } from '@/utils/sanitize'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCanonicalUrl } from '@/config/seo'

// Route
const route = useRoute()

// State
const term = ref<GlossaryTermWithRelations | null>(null)
const loading = ref(true)
const linkCopied = ref(false)

// SEO Configuration
const pageTitle = computed(() => {
  if (!term.value) return 'Définition - Glossaire Atlas Lab'
  return `${term.value.term} : Définition | Glossaire Atlas Lab`
})

const pageDescription = computed(() => {
  if (!term.value) return 'Définition scientifique - Glossaire Atlas Lab Solutions'
  // Use meta_description if available, otherwise extract from definition
  if (term.value.meta_description) return term.value.meta_description
  const text = (term.value.definition ?? '').replace(/<[^>]*>/g, '').substring(0, 155)
  return text + '...'
})

// Schema.org BreadcrumbList
const breadcrumbSchema = computed(() => {
  if (!term.value) return null
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
        name: 'Glossaire',
        item: 'https://fast-peptides.com/glossaire',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: term.value.term,
        item: `https://fast-peptides.com/glossaire/${route.params.slug}`,
      },
    ],
  }
})

// Schema.org DefinedTerm - optimized for SEO
const definedTermSchema = computed(() => {
  if (!term.value) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.value.term,
    description: term.value.definition?.replace(/<[^>]*>/g, '') || pageDescription.value,
    url: `https://fast-peptides.com/glossaire/${route.params.slug}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Glossaire des peptides Atlas Lab Solutions',
      url: 'https://fast-peptides.com/glossaire',
    },
  }
})

// Keywords
const pageKeywords = computed(() => {
  const baseKeywords = ['définition', 'glossaire', 'peptides', 'recherche scientifique', 'Atlas Lab']
  if (term.value?.term) {
    baseKeywords.unshift(term.value.term.toLowerCase())
  }
  return baseKeywords.join(', ')
})

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { name: 'keywords', content: pageKeywords },
    { name: 'author', content: 'Atlas Lab Solutions' },
    // Open Graph
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: computed(() => `https://fast-peptides.com/glossaire/${route.params.slug}`) },
    // Twitter
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
  ],
  link: [
    {
      rel: 'canonical',
      href: computed(() => getCanonicalUrl(`/glossaire/${route.params.slug}`)),
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => (breadcrumbSchema.value ? JSON.stringify(breadcrumbSchema.value) : '')),
    },
    {
      type: 'application/ld+json',
      innerHTML: computed(() => (definedTermSchema.value ? JSON.stringify(definedTermSchema.value) : '')),
    },
  ],
})

// Computed
const parsedDefinition = computed(() =>
  term.value?.definition ? parseAndSanitize(term.value.definition) : '',
)

// Helpers
const formatPrice = (price: number | null | undefined) => {
  if (price == null) return '0.00'
  return price.toFixed(2)
}

// Share functionality
const shareDefinition = (platform: 'twitter' | 'linkedin' | 'copy') => {
  const url = `https://fast-peptides.com/glossaire/${route.params.slug}`
  const title = term.value?.term || 'Définition'
  const text = `${title} - Glossaire Atlas Lab Solutions`

  switch (platform) {
    case 'twitter':
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        '_blank',
      )
      break
    case 'linkedin':
      window.open(
        `https://www.linkedin.com/share?url=${encodeURIComponent(url)}`,
        '_blank',
      )
      break
    case 'copy':
      navigator.clipboard.writeText(url).then(() => {
        linkCopied.value = true
        setTimeout(() => {
          linkCopied.value = false
        }, 2000)
      })
      break
  }
}

// Load term
const loadTerm = async () => {
  const slug = route.params.slug as string
  if (!slug) return

  loading.value = true
  try {
    term.value = await fetchGlossaryTermBySlug(slug)
  } catch (error) {
    console.error('Error loading glossary term:', error)
    term.value = null
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(loadTerm)

// Watch for route changes
watch(
  () => route.params.slug,
  () => {
    loadTerm()
  },
)
</script>

<style scoped lang="less">
@import '@designSystem/fondation/breakpoints/responsive-mixins.less';

.glossaire-detail {
  position: relative;
  min-height: 100vh;
  padding-bottom: 80px;

  // ===========================
  // BACKGROUND
  // ===========================
  &__bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
  }

  &__bg-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(var(--primary-500-rgb), 0.03) 0%,
      transparent 40%
    );
  }

  // ===========================
  // CONTAINER
  // ===========================
  &__container {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;

    .respond-tablet({
      padding: 20px;
    });

    .respond-mobile({
      padding: 16px;
    });
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
    gap: 8px;
    padding: 10px 16px;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--primary-500);
      color: var(--primary-600);
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
    gap: 20px;
    min-height: 400px;
  }

  &__loading-spinner {
    color: var(--primary-500);
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  &__loading-text {
    font-size: 15px;
    color: var(--text-muted);
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
    gap: 16px;
    text-align: center;
    padding: 48px 24px;
  }

  &__empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: rgba(var(--primary-500-rgb), 0.1);
    border-radius: 20px;
    color: var(--primary-500);
  }

  &__empty-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  &__empty-text {
    font-size: 15px;
    color: var(--text-muted);
    margin: 0;
  }

  &__empty-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--primary-500);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: white;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      background: var(--primary-600);
    }
  }

  // ===========================
  // ARTICLE
  // ===========================
  &__article {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  // ===========================
  // HEADER
  // ===========================
  &__header {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text-muted);
    flex-wrap: wrap;
  }

  &__breadcrumb-link {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.15s ease;

    &:hover {
      color: var(--primary-600);
    }
  }

  &__breadcrumb-current {
    color: var(--text-primary);
    font-weight: 500;
  }

  &__title {
    font-size: 36px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.2;

    .respond-tablet({
      font-size: 30px;
    });

    .respond-mobile({
      font-size: 26px;
    });
  }

  // ===========================
  // DEFINITION
  // ===========================
  &__definition {
    padding: 28px;
  }

  &__definition-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-600);
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__definition-content {
    font-size: 17px;
    line-height: 1.8;
    color: var(--text-primary);

    :deep(p) {
      margin: 0 0 16px 0;

      &:last-child {
        margin-bottom: 0;
      }
    }

    :deep(strong) {
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  // ===========================
  // RELATED SECTIONS
  // ===========================
  &__related {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__related-header {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-primary);

    h2 {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
  }

  &__related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  // Product cards
  &__product-card {
    display: flex;
    flex-direction: column;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: 12px;
    overflow: hidden;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--primary-500);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }
  }

  &__product-image {
    aspect-ratio: 16/10;
    background: var(--bg-subtle);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__product-info {
    padding: 16px;
    flex: 1;
  }

  &__product-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 4px 0;
  }

  &__product-dosage {
    font-size: 13px;
    color: var(--text-muted);
    margin: 0 0 8px 0;
  }

  &__product-price {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);

    &--sale {
      color: var(--success-600);
      margin-right: 8px;
    }

    &--original {
      font-size: 13px;
      font-weight: 400;
      color: var(--text-muted);
      text-decoration: line-through;
    }
  }

  &__product-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    background: var(--bg-subtle);
    font-size: 13px;
    font-weight: 500;
    color: var(--primary-600);
    border-top: 1px solid var(--border-default);
  }

  // Resource cards
  &__resources {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__resource-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--primary-500);
    }
  }

  &__resource-content {
    flex: 1;
    min-width: 0;
  }

  &__resource-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 4px 0;
  }

  &__resource-excerpt {
    font-size: 13px;
    color: var(--text-muted);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__resource-arrow {
    flex-shrink: 0;
    color: var(--text-muted);
    transition: color 0.2s ease;

    .glossaire-detail__resource-card:hover & {
      color: var(--primary-600);
    }
  }

  // ===========================
  // FOOTER (Share)
  // ===========================
  &__footer {
    padding-top: 24px;
    border-top: 1px solid var(--border-default);
  }

  &__share {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__share-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  &__share-buttons {
    display: flex;
    gap: 8px;
  }
}
</style>
