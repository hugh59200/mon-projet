<template>
  <div class="resource-detail">
    <!-- Background -->
    <div class="resource-detail__bg">
      <div class="resource-detail__bg-pattern"></div>
    </div>

    <!-- Navigation -->
    <nav class="resource-detail__nav">
      <div class="resource-detail__nav-inner">
        <RouterLink to="/ressources" class="resource-detail__back">
          <BasicIconNext name="ArrowLeft" :size="18" />
          <span>Retour aux ressources</span>
        </RouterLink>

        <div v-if="resource" class="resource-detail__breadcrumb">
          <span class="resource-detail__breadcrumb-sep">/</span>
          <span v-if="resource.category" class="resource-detail__breadcrumb-cat">
            {{ resource.category.label }}
          </span>
          <span class="resource-detail__breadcrumb-sep">/</span>
          <span class="resource-detail__breadcrumb-current">{{ resource.title }}</span>
        </div>
      </div>
    </nav>

    <div class="resource-detail__container">
      <!-- Loading State -->
      <div v-if="loading" class="resource-detail__loading">
        <div class="resource-detail__loading-spinner">
          <BasicIconNext name="Loader2" :size="40" />
        </div>
        <p class="resource-detail__loading-text">Chargement de la ressource...</p>
      </div>

      <!-- Empty State -->
      <ContentBlock v-else-if="!resource" variant="card" size="lg" class="resource-detail__empty">
        <div class="resource-detail__empty-icon">
          <BasicIconNext name="FileWarning" :size="48" />
        </div>
        <h2 class="resource-detail__empty-title">Ressource introuvable</h2>
        <p class="resource-detail__empty-text">
          Cette ressource n'existe pas ou n'est plus disponible.
        </p>
        <PremiumButton
          type="primary"
          variant="solid"
          size="md"
          label="Voir toutes les ressources"
          icon-left="ArrowLeft"
          @click="$router.push('/ressources')"
        />
      </ContentBlock>

      <!-- Main Layout with Sidebar -->
      <div v-else class="resource-detail__layout">
        <!-- Table of Contents Sidebar -->
        <aside class="resource-detail__sidebar">
          <div class="resource-detail__toc">
            <div class="resource-detail__toc-header">
              <BasicIconNext name="List" :size="16" />
              <span>Table des matières</span>
            </div>
            <nav class="resource-detail__toc-nav">
              <a
                v-for="heading in tableOfContents"
                :key="heading.id"
                :href="`#${heading.id}`"
                class="resource-detail__toc-link"
                :class="{
                  'resource-detail__toc-link--active': activeHeading === heading.id,
                  'resource-detail__toc-link--h3': heading.level === 3
                }"
                @click.prevent="scrollToHeading(heading.id)"
              >
                {{ heading.text }}
              </a>
            </nav>

            <!-- Document Info Card -->
            <div class="resource-detail__doc-info">
              <div class="resource-detail__doc-info-row">
                <BasicIconNext name="Clock" :size="14" />
                <span>{{ resource.reading_time_minutes }} min</span>
              </div>
              <div class="resource-detail__doc-info-row">
                <BasicIconNext name="BarChart3" :size="14" />
                <span>{{ getDifficultyLabel(resource.difficulty_level) }}</span>
              </div>
              <div v-if="resource.published_at" class="resource-detail__doc-info-row">
                <BasicIconNext name="RefreshCw" :size="14" />
                <span>{{ formatDate(resource.published_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Tools Section -->
          <div class="resource-detail__tools">
            <div class="resource-detail__tools-header">
              <BasicIconNext name="Wrench" :size="16" />
              <span>Outils</span>
            </div>
            <RouterLink to="/guide-reconstitution" class="resource-detail__tool-card">
              <div class="resource-detail__tool-icon">
                <BasicIconNext name="Calculator" :size="20" />
              </div>
              <div class="resource-detail__tool-info">
                <span class="resource-detail__tool-name">Calculateur de Dilution</span>
                <span class="resource-detail__tool-desc">Calcul automatique des volumes</span>
              </div>
              <BasicIconNext name="ArrowUpRight" :size="14" class="resource-detail__tool-arrow" />
            </RouterLink>
          </div>
        </aside>

        <!-- Article Content -->
        <article class="resource-detail__article">
          <!-- Header -->
          <header class="resource-detail__header">
            <!-- Meta badges -->
            <div class="resource-detail__meta">
              <span v-if="resource.category" class="resource-detail__topic">
                <BasicIconNext :name="(resource.category.icon || 'FileText') as IconNameNext" :size="14" />
                {{ resource.category.label }}
              </span>
              <span class="resource-detail__difficulty" :data-level="resource.difficulty_level">
                <BasicIconNext :name="getDifficultyIcon(resource.difficulty_level) as IconNameNext" :size="12" />
                {{ getDifficultyLabel(resource.difficulty_level) }}
              </span>
            </div>

            <h1 class="resource-detail__title">{{ resource.title }}</h1>

            <p v-if="resource.excerpt" class="resource-detail__excerpt">
              {{ resource.excerpt }}
            </p>

            <!-- Document Meta Bar -->
            <div class="resource-detail__meta-bar">
              <div class="resource-detail__meta-item">
                <BasicIconNext name="Clock" :size="16" />
                <span>{{ resource.reading_time_minutes }} min de lecture</span>
              </div>
              <div v-if="resource.published_at" class="resource-detail__meta-item">
                <BasicIconNext name="Calendar" :size="16" />
                <span>Publié le {{ formatDate(resource.published_at) }}</span>
              </div>
              <div class="resource-detail__meta-item">
                <BasicIconNext name="User" :size="16" />
                <span>Atlas Lab Solutions</span>
              </div>
            </div>

            <!-- Equipment Section -->
            <div v-if="resource.equipment_needed?.length" class="resource-detail__equipment">
              <div class="resource-detail__equipment-header">
                <BasicIconNext name="Wrench" :size="18" />
                <span>Matériel requis</span>
              </div>
              <div class="resource-detail__equipment-list">
                <span
                  v-for="(eq, idx) in resource.equipment_needed"
                  :key="idx"
                  class="resource-detail__equipment-item"
                >
                  <BasicIconNext name="Check" :size="12" />
                  {{ eq }}
                </span>
              </div>
            </div>
          </header>

          <!-- Cover Image -->
          <figure v-if="resource.image" class="resource-detail__cover">
            <img :src="resource.image" :alt="resource.title" class="resource-detail__cover-image" />
          </figure>

          <!-- Body -->
          <div ref="contentRef" class="resource-detail__body" v-html="parsedContent"></div>

          <!-- Footer -->
          <footer class="resource-detail__footer">
            <!-- Share -->
            <div class="resource-detail__share">
              <span class="resource-detail__share-label">Partager ce guide</span>
              <div class="resource-detail__share-buttons">
                <button class="resource-detail__share-btn" @click="shareResource('twitter')">
                  <BasicIconNext name="Twitter" :size="18" />
                </button>
                <button class="resource-detail__share-btn" @click="shareResource('linkedin')">
                  <BasicIconNext name="Linkedin" :size="18" />
                </button>
                <button
                  class="resource-detail__share-btn"
                  :class="{ 'resource-detail__share-btn--copied': linkCopied }"
                  @click="shareResource('copy')"
                >
                  <BasicIconNext :name="linkCopied ? 'Check' : 'Link'" :size="18" />
                </button>
              </div>
            </div>

            <!-- Category Tag -->
            <div v-if="resource.category" class="resource-detail__tags">
              <RouterLink
                :to="`/ressources?categorie=${resource.category.slug}`"
                class="resource-detail__tag"
              >
                <BasicIconNext :name="(resource.category.icon || 'Layers') as IconNameNext" :size="14" />
                Plus de guides {{ resource.category.label }}
              </RouterLink>
            </div>
          </footer>
        </article>
      </div>

      <!-- Related Resources -->
      <section v-if="relatedResources.length && !loading" class="resource-detail__related">
        <div class="resource-detail__related-header">
          <div class="resource-detail__section-icon">
            <BasicIconNext name="BookOpen" :size="20" />
          </div>
          <h2 class="resource-detail__related-title">Guides connexes</h2>
        </div>

        <div class="resource-detail__related-grid">
          <RouterLink
            v-for="(related, index) in relatedResources"
            :key="related.slug"
            :to="`/ressources/${related.slug}`"
            class="resource-detail__related-card"
            :style="{ '--delay': `${index * 0.1}s` }"
          >
            <div class="resource-detail__related-image">
              <img v-if="related.image" :src="related.image" :alt="related.title" loading="lazy" />
              <div v-else class="resource-detail__related-placeholder">
                <BasicIconNext name="FileText" :size="24" />
              </div>
              <span class="resource-detail__related-difficulty" :data-level="related.difficulty_level">
                {{ getDifficultyLabel(related.difficulty_level) }}
              </span>
            </div>
            <div class="resource-detail__related-content">
              <span v-if="related.category" class="resource-detail__related-topic">
                {{ related.category.label }}
              </span>
              <h3 class="resource-detail__related-name">{{ related.title }}</h3>
              <div class="resource-detail__related-meta">
                <span class="resource-detail__related-reading">
                  <BasicIconNext name="Clock" :size="12" />
                  {{ related.reading_time_minutes }} min
                </span>
                <span class="resource-detail__related-arrow">
                  Lire
                  <BasicIconNext name="ArrowRight" :size="12" />
                </span>
              </div>
            </div>
          </RouterLink>
        </div>
      </section>

      <!-- Trust Footer -->
      <footer v-if="resource && !loading" class="resource-detail__trust-footer">
        <div class="resource-detail__trust">
          <div class="resource-detail__trust-item">
            <BasicIconNext name="ShieldCheck" :size="18" />
            <span>Contenu vérifié</span>
          </div>
          <div class="resource-detail__trust-item">
            <BasicIconNext name="FlaskConical" :size="18" />
            <span>Documentation technique</span>
          </div>
          <div class="resource-detail__trust-item">
            <BasicIconNext name="GraduationCap" :size="18" />
            <span>Pour professionnels</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { fetchResourceBySlug, fetchRelatedResources, type ResourceWithCategory } from '@/api/supabase/resources'
import { parseAndSanitize } from '@/utils/sanitize'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.types'

const route = useRoute()

// Types
interface TocHeading {
  id: string
  text: string
  level: number
}

// State
const loading = ref(true)
const resource = ref<ResourceWithCategory | null>(null)
const relatedResources = ref<ResourceWithCategory[]>([])
const linkCopied = ref(false)
const contentRef = ref<HTMLElement | null>(null)
const tableOfContents = ref<TocHeading[]>([])
const activeHeading = ref<string>('')

// Computed
const parsedContent = computed(() =>
  resource.value?.content ? parseAndSanitize(resource.value.content) : '',
)

const pageTitle = computed(() => {
  if (!resource.value) return 'Ressource - Atlas Lab Solutions'
  return `${resource.value.title} | Lab Notes`
})

const pageDescription = computed(() => {
  if (!resource.value) return 'Documentation technique Atlas Lab Solutions.'
  return resource.value.excerpt || resource.value.meta_description || ''
})

// SEO Schema
const techArticleSchema = computed(() => {
  if (!resource.value) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: resource.value.title,
    description: pageDescription.value,
    image: resource.value.image || 'https://fast-peptides.com/default-resource.jpg',
    datePublished: resource.value.published_at,
    dateModified: resource.value.published_at,
    author: {
      '@type': 'Organization',
      name: 'Atlas Lab Solutions',
      url: 'https://fast-peptides.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Atlas Lab Solutions',
      logo: {
        '@type': 'ImageObject',
        url: 'https://fast-peptides.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://fast-peptides.com/ressources/${route.params.slug}`,
    },
    proficiencyLevel: resource.value.difficulty_level || 'Intermediate',
    articleSection: resource.value.category?.label || 'Documentation',
    inLanguage: 'fr-FR',
    audience: {
      '@type': 'Audience',
      audienceType: 'Researchers',
    },
  }
})

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'article' },
    {
      property: 'og:image',
      content: computed(() => resource.value?.image || 'https://fast-peptides.com/default-resource.jpg'),
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
  ],
  link: [
    {
      rel: 'canonical',
      href: computed(() => `https://fast-peptides.com/ressources/${route.params.slug}`),
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => (techArticleSchema.value ? JSON.stringify(techArticleSchema.value) : '')),
    },
  ],
})

// Methods
function getDifficultyLabel(level: string | null): string {
  const labels: Record<string, string> = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
  }
  return labels[level || 'intermediate'] || 'Intermédiaire'
}

function getDifficultyIcon(level: string | null): string {
  const icons: Record<string, string> = {
    beginner: 'CircleDot',
    intermediate: 'Circle',
    advanced: 'Flame',
  }
  return icons[level || 'intermediate'] || 'Circle'
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function generateTableOfContents() {
  if (!contentRef.value) return

  const headings = contentRef.value.querySelectorAll('h2, h3')
  const toc: TocHeading[] = []

  headings.forEach((heading, index) => {
    const id = heading.id || `heading-${index}`
    if (!heading.id) {
      heading.id = id
    }
    const levelChar = heading.tagName[1]
    toc.push({
      id,
      text: heading.textContent || '',
      level: levelChar ? parseInt(levelChar, 10) : 2,
    })
  })

  tableOfContents.value = toc

  const firstHeading = toc[0]
  if (firstHeading) {
    activeHeading.value = firstHeading.id
  }
}

function scrollToHeading(id: string) {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
    activeHeading.value = id
  }
}

function handleScroll() {
  if (!tableOfContents.value.length) return

  const scrollPosition = window.scrollY + 150

  for (let i = tableOfContents.value.length - 1; i >= 0; i--) {
    const heading = tableOfContents.value[i]
    if (!heading) continue
    const element = document.getElementById(heading.id)
    if (element && element.offsetTop <= scrollPosition) {
      activeHeading.value = heading.id
      break
    }
  }
}

async function loadResource(slug: string) {
  loading.value = true

  try {
    const fetchedResource = await fetchResourceBySlug(slug)
    resource.value = fetchedResource

    if (fetchedResource?.category_id) {
      relatedResources.value = await fetchRelatedResources(slug, fetchedResource.category_id, 3)
    } else {
      relatedResources.value = []
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Generate TOC after content is rendered
    await nextTick()
    generateTableOfContents()
  } catch (error) {
    console.error('Erreur chargement ressource:', error)
    resource.value = null
    relatedResources.value = []
  } finally {
    loading.value = false
  }
}

async function shareResource(platform: 'twitter' | 'linkedin' | 'copy') {
  if (!resource.value) return

  const url = window.location.href
  const title = resource.value.title

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
        console.error('Erreur copie lien:', err)
      }
      break
  }
}

// Lifecycle
onMounted(async () => {
  const slug = route.params.slug as string
  await loadResource(slug)
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(
  () => route.params.slug,
  async (newSlug) => {
    if (newSlug && typeof newSlug === 'string') {
      await loadResource(newSlug)
    }
  },
)
</script>

<style scoped lang="less">
@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.resource-detail {
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
    z-index: 0;
  }

  &__bg-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(var(--primary-500-rgb), 0.02) 1px, transparent 1px);
    background-size: 24px 24px;
    mask-image: linear-gradient(to bottom, black 0%, transparent 40%);
  }

  // ===========================
  // NAVIGATION
  // ===========================
  &__nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(var(--bg-base-rgb), 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-subtle);
  }

  &__nav-inner {
    display: flex;
    align-items: center;
    gap: 16px;
    max-width: 1400px;
    margin: 0 auto;
    padding: 12px 32px;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: 8px;
    font-family: @font-body;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.2s @ease;

    &:hover {
      background: var(--bg-surface-secondary);
      border-color: var(--primary-300);
      color: var(--primary-700);
    }
  }

  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: @font-body;
    font-size: 13px;
    color: var(--text-tertiary);
    overflow: hidden;
  }

  &__breadcrumb-sep {
    color: var(--border-default);
  }

  &__breadcrumb-cat {
    color: var(--text-secondary);
  }

  &__breadcrumb-current {
    color: var(--text-primary);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }

  // ===========================
  // CONTAINER
  // ===========================
  &__container {
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 32px;
  }

  // ===========================
  // LAYOUT (Sidebar + Content)
  // ===========================
  &__layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 48px;
    align-items: flex-start;
  }

  // ===========================
  // SIDEBAR / TOC
  // ===========================
  &__sidebar {
    position: sticky;
    top: 80px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    padding-right: 12px;

    // Custom scrollbar
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--border-default);
      border-radius: 4px;
    }
  }

  &__toc {
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: 16px;
    overflow: hidden;
  }

  &__toc-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 20px;
    background: var(--bg-surface-secondary);
    border-bottom: 1px solid var(--border-subtle);
    font-family: @font-body;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__toc-nav {
    display: flex;
    flex-direction: column;
    padding: 12px 0;
  }

  &__toc-link {
    display: block;
    padding: 10px 20px;
    font-family: @font-body;
    font-size: 13px;
    color: var(--text-secondary);
    text-decoration: none;
    border-left: 2px solid transparent;
    transition: all 0.2s @ease;

    &:hover {
      color: var(--primary-600);
      background: rgba(var(--primary-500-rgb), 0.04);
    }

    &--active {
      color: var(--primary-700);
      border-left-color: var(--primary-500);
      background: rgba(var(--primary-500-rgb), 0.06);
      font-weight: 500;
    }

    &--h3 {
      padding-left: 32px;
      font-size: 12px;
      color: var(--text-tertiary);
    }
  }

  &__doc-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid var(--border-subtle);
    background: var(--bg-surface-secondary);
  }

  &__doc-info-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: @font-body;
    font-size: 12px;
    color: var(--text-tertiary);

    svg {
      color: var(--text-muted);
      flex-shrink: 0;
    }
  }

  // ===========================
  // TOOLS SECTION
  // ===========================
  &__tools {
    margin-top: 20px;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: 16px;
    overflow: hidden;
  }

  &__tools-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    background: var(--bg-surface-secondary);
    border-bottom: 1px solid var(--border-subtle);
    font-family: @font-body;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__tool-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    text-decoration: none;
    transition: all 0.2s @ease;

    &:hover {
      background: rgba(var(--primary-500-rgb), 0.04);

      .resource-detail__tool-arrow {
        color: var(--primary-500);
        transform: translate(2px, -2px);
      }

      .resource-detail__tool-icon {
        background: var(--primary-500);
        color: white;
      }
    }
  }

  &__tool-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(var(--primary-500-rgb), 0.1);
    border-radius: 10px;
    color: var(--primary-600);
    flex-shrink: 0;
    transition: all 0.2s @ease;
  }

  &__tool-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }

  &__tool-name {
    font-family: @font-body;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }

  &__tool-desc {
    font-family: @font-body;
    font-size: 11px;
    color: var(--text-tertiary);
  }

  &__tool-arrow {
    color: var(--text-muted);
    flex-shrink: 0;
    transition: all 0.2s @ease;
  }

  // ===========================
  // LOADING
  // ===========================
  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120px 24px;
  }

  &__loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.1) 0%, rgba(var(--primary-500-rgb), 0.05) 100%);
    border-radius: 50%;
    margin-bottom: 20px;
    color: var(--primary-500);

    svg {
      animation: spin 1s linear infinite;
    }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
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

  // ===========================
  // ARTICLE
  // ===========================
  &__article {
    max-width: 780px;
    animation: fade-in 0.5s @ease;
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  // ===========================
  // HEADER
  // ===========================
  &__header {
    margin-bottom: 40px;
  }

  &__meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
  }

  &__topic {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(var(--primary-500-rgb), 0.08);
    border-radius: 6px;
    font-family: @font-body;
    font-size: 11px;
    font-weight: 600;
    color: var(--primary-700);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  &__difficulty {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 6px;
    font-family: @font-body;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;

    &[data-level='beginner'] {
      background: rgba(var(--success-500-rgb), 0.1);
      color: var(--success-700);
    }

    &[data-level='intermediate'] {
      background: rgba(var(--warning-500-rgb), 0.1);
      color: var(--warning-700);
    }

    &[data-level='advanced'] {
      background: rgba(var(--danger-500-rgb), 0.1);
      color: var(--danger-700);
    }
  }

  &__title {
    font-family: @font-display;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.2;
    margin: 0 0 16px;
    letter-spacing: -0.02em;
  }

  &__excerpt {
    font-family: @font-body;
    font-size: 18px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0 0 24px;
  }

  &__meta-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 20px;
    padding: 16px 0;
    border-top: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
    margin-bottom: 24px;
  }

  &__meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: @font-body;
    font-size: 13px;
    color: var(--text-tertiary);

    svg {
      color: var(--text-muted);
    }
  }

  // ===========================
  // EQUIPMENT
  // ===========================
  &__equipment {
    padding: 20px 24px;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: 12px;
    margin-bottom: 32px;
  }

  &__equipment-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    font-family: @font-body;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  &__equipment-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__equipment-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: var(--bg-surface-secondary);
    border-radius: 8px;
    font-family: @font-body;
    font-size: 13px;
    color: var(--text-secondary);

    svg {
      color: var(--success-500);
    }
  }

  // ===========================
  // COVER
  // ===========================
  &__cover {
    margin: 0 0 40px;
  }

  &__cover-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  &__cover-caption {
    margin-top: 12px;
    font-family: @font-body;
    font-size: 13px;
    color: var(--text-tertiary);
    text-align: center;
    font-style: italic;
  }

  // ===========================
  // BODY - Documentation Style
  // ===========================
  &__body {
    font-family: @font-body;
    font-size: 16px;
    line-height: 1.75;
    color: var(--text-secondary);

    :deep(p) {
      margin-bottom: 1.5em;
    }

    // Headings with anchor styling
    :deep(h2) {
      font-family: @font-display;
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 48px 0 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--border-subtle);
      scroll-margin-top: 100px;
    }

    :deep(h3) {
      font-family: @font-display;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 36px 0 16px;
      scroll-margin-top: 100px;
    }

    :deep(h4) {
      font-family: @font-display;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-secondary);
      margin: 28px 0 12px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    :deep(ul), :deep(ol) {
      margin: 20px 0;
      padding-left: 24px;
    }

    :deep(li) {
      margin-bottom: 8px;
      &::marker {
        color: var(--primary-500);
      }
    }

    :deep(strong) {
      font-weight: 600;
      color: var(--text-primary);
    }

    // Inline code
    :deep(code) {
      font-family: @font-mono;
      font-size: 0.875em;
      padding: 2px 8px;
      background: var(--bg-surface-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      color: var(--primary-700);
    }

    // Code blocks
    :deep(pre) {
      margin: 24px 0;
      padding: 20px 24px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 12px;
      overflow-x: auto;

      code {
        padding: 0;
        background: transparent;
        border: none;
        font-size: 13px;
        line-height: 1.6;
        color: var(--text-secondary);
      }
    }

    // Blockquotes - Info style
    :deep(blockquote) {
      margin: 28px 0;
      padding: 20px 24px;
      background: rgba(var(--info-500-rgb), 0.06);
      border-left: 4px solid var(--info-500);
      border-radius: 0 12px 12px 0;
      font-style: normal;
      color: var(--text-secondary);

      p:last-child {
        margin-bottom: 0;
      }
    }

    // Custom callouts (using specific classes in content)
    :deep(.callout-warning) {
      margin: 28px 0;
      padding: 20px 24px;
      background: rgba(var(--warning-500-rgb), 0.08);
      border-left: 4px solid var(--warning-500);
      border-radius: 0 12px 12px 0;
    }

    :deep(.callout-danger) {
      margin: 28px 0;
      padding: 20px 24px;
      background: rgba(var(--danger-500-rgb), 0.08);
      border-left: 4px solid var(--danger-500);
      border-radius: 0 12px 12px 0;
    }

    :deep(.callout-success) {
      margin: 28px 0;
      padding: 20px 24px;
      background: rgba(var(--success-500-rgb), 0.08);
      border-left: 4px solid var(--success-500);
      border-radius: 0 12px 12px 0;
    }

    // Tables - Technical style
    :deep(table) {
      width: 100%;
      margin: 28px 0;
      border-collapse: collapse;
      border: 1px solid var(--border-default);
      border-radius: 12px;
      overflow: hidden;
      font-size: 14px;

      th, td {
        padding: 12px 16px;
        text-align: left;
        border-bottom: 1px solid var(--border-subtle);
      }

      th {
        background: var(--bg-surface-secondary);
        font-weight: 600;
        color: var(--text-primary);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }

      tr:last-child td {
        border-bottom: none;
      }

      tr:hover td {
        background: rgba(var(--primary-500-rgb), 0.02);
      }
    }

    // Images
    :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 12px;
      margin: 24px 0;
    }

    // Links
    :deep(a) {
      color: var(--primary-600);
      text-decoration: underline;
      text-underline-offset: 2px;

      &:hover {
        color: var(--primary-700);
      }
    }

    // Horizontal rule
    :deep(hr) {
      margin: 40px 0;
      border: none;
      border-top: 1px solid var(--border-subtle);
    }
  }

  // ===========================
  // FOOTER
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
    gap: 14px;
  }

  &__share-label {
    font-family: @font-body;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-tertiary);
  }

  &__share-buttons {
    display: flex;
    gap: 8px;
  }

  &__share-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: 10px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s @ease;

    &:hover {
      background: var(--bg-surface-secondary);
      border-color: var(--primary-300);
      color: var(--primary-600);
    }

    &--copied {
      background: rgba(var(--success-500-rgb), 0.1);
      border-color: var(--success-500);
      color: var(--success-600);
    }
  }

  &__tags {
    display: flex;
    gap: 10px;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: 10px;
    font-family: @font-body;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.2s @ease;

    &:hover {
      background: rgba(var(--primary-500-rgb), 0.06);
      border-color: var(--primary-300);
      color: var(--primary-700);
    }
  }

  // ===========================
  // RELATED RESOURCES
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
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.12) 0%, rgba(var(--primary-500-rgb), 0.06) 100%);
    border-radius: 14px;
    color: var(--primary-600);
  }

  &__related-title {
    font-family: @font-display;
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  &__related-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  &__related-card {
    display: flex;
    flex-direction: column;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    transition: all 0.25s @ease;

    &:hover {
      border-color: var(--primary-300);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);

      .resource-detail__related-arrow {
        color: var(--primary-600);
        gap: 6px;
      }
    }
  }

  &__related-image {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: var(--bg-surface-secondary);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__related-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-tertiary);
  }

  &__related-difficulty {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 4px 10px;
    border-radius: 6px;
    font-family: @font-body;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;

    &[data-level='beginner'] {
      background: rgba(var(--success-500-rgb), 0.9);
      color: white;
    }
    &[data-level='intermediate'] {
      background: rgba(var(--warning-500-rgb), 0.9);
      color: white;
    }
    &[data-level='advanced'] {
      background: rgba(var(--danger-500-rgb), 0.9);
      color: white;
    }
  }

  &__related-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 18px;
    flex: 1;
  }

  &__related-topic {
    display: inline-block;
    align-self: flex-start;
    padding: 4px 10px;
    background: rgba(var(--primary-500-rgb), 0.08);
    border-radius: 5px;
    font-family: @font-body;
    font-size: 10px;
    font-weight: 600;
    color: var(--primary-700);
    text-transform: uppercase;
  }

  &__related-name {
    font-family: @font-display;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.35;
    margin: 0;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__related-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
  }

  &__related-reading {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: @font-body;
    font-size: 12px;
    color: var(--text-tertiary);
  }

  &__related-arrow {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: @font-body;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-tertiary);
    transition: all 0.2s @ease;
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
    font-size: 13px;
    color: var(--text-tertiary);

    svg {
      color: @success-500;
    }
  }

  // ===========================
  // RESPONSIVE - Tablet
  // ===========================
  .respond-tablet({
    &__layout {
      grid-template-columns: 1fr;
    }

    &__sidebar {
      display: none;
    }

    &__related-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    &__nav-inner {
      padding: 12px 24px;
    }

    &__breadcrumb {
      display: none;
    }
  });

  // ===========================
  // RESPONSIVE - Mobile
  // ===========================
  .respond-mobile({
    &__container {
      padding: 24px 16px;
    }

    &__nav-inner {
      padding: 10px 16px;
    }

    &__back span {
      display: none;
    }

    &__meta {
      gap: 8px;
    }

    &__meta-bar {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    &__footer {
      flex-direction: column;
      align-items: flex-start;
    }

    &__related-grid {
      grid-template-columns: 1fr;
    }

    &__trust {
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }
  });
}
</style>
