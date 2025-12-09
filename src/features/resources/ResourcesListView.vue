<template>
  <div class="resources">
    <!-- Header -->
    <PageHeader />

    <PageContent size="xl">
      <!-- Loading State -->
      <ContentBlock
        v-if="isLoading"
        variant="card"
        size="lg"
        class="resources__loading"
      >
        <BasicLoader size="medium" />
        <p class="resources__loading-text">Chargement des ressources...</p>
      </ContentBlock>

      <template v-else>
        <!-- Featured Tool -->
        <RouterLink
          to="/guide-reconstitution"
          class="resources__featured-tool"
        >
          <div class="resources__featured-tool-icon">
            <BasicIconNext
              name="Calculator"
              :size="28"
            />
          </div>
          <div class="resources__featured-tool-content">
            <div class="resources__featured-tool-badge">
              <BasicIconNext
                name="Sparkles"
                :size="12"
              />
              Outil interactif
            </div>
            <h3 class="resources__featured-tool-title">Calculateur de Dilution</h3>
            <p class="resources__featured-tool-desc">
              Calculez automatiquement les volumes pour vos préparations peptidiques. Visualisation
              seringue et protocole inclus.
            </p>
          </div>
          <div class="resources__featured-tool-action">
            <span>Utiliser l'outil</span>
            <BasicIconNext
              name="ArrowRight"
              :size="16"
            />
          </div>
        </RouterLink>

        <!-- Resources Section -->
        <section class="resources__grid-section">
          <div class="resources__grid-header">
            <div class="resources__grid-title-wrapper">
              <h2 class="resources__grid-title">Guides Techniques</h2>
              <span class="resources__grid-count">{{ resources.length }} articles</span>
            </div>
          </div>

          <!-- Empty State -->
          <ContentBlock
            v-if="!resources.length"
            variant="card"
            size="lg"
            class="resources__empty"
          >
            <div class="resources__empty-icon">
              <BasicIconNext
                name="FileSearch"
                :size="48"
              />
            </div>
            <h3 class="resources__empty-title">Aucune ressource disponible</h3>
            <p class="resources__empty-text">
              Les guides techniques seront bientôt disponibles.
            </p>
          </ContentBlock>

          <!-- Resources Grid -->
          <div
            v-else
            class="resources__articles"
          >
            <RouterLink
              v-for="(resource, index) in resources"
              :key="resource.slug"
              :to="`/ressources/${resource.slug}`"
              class="resources__article-card"
              :style="{ '--delay': `${index * 0.04}s` }"
            >
              <!-- Left: Image -->
              <div class="resources__article-image">
                <img
                  v-if="resource.image"
                  :src="resource.image"
                  :alt="resource.title"
                  loading="lazy"
                />
                <div
                  v-else
                  class="resources__article-placeholder"
                >
                  <BasicIconNext
                    name="FileText"
                    :size="28"
                  />
                </div>
                <!-- Difficulty badge -->
                <div
                  class="resources__difficulty-badge"
                  :data-level="resource.difficulty_level"
                >
                  {{ getDifficultyLabel(resource.difficulty_level) }}
                </div>
              </div>

              <!-- Right: Content -->
              <div class="resources__article-content">
                <div class="resources__article-meta">
                  <span
                    v-if="resource.category"
                    class="resources__article-topic"
                  >
                    <BasicIconNext
                      :name="(resource.category.icon || 'FileText') as IconNameNext"
                      :size="12"
                    />
                    {{ resource.category.label }}
                  </span>
                  <span class="resources__article-reading">
                    <BasicIconNext
                      name="Clock"
                      :size="12"
                    />
                    {{ resource.reading_time_minutes }} min
                  </span>
                </div>

                <h3 class="resources__article-title">{{ resource.title }}</h3>

                <p class="resources__article-excerpt">{{ resource.excerpt }}</p>

                <div class="resources__article-footer">
                  <div class="resources__article-tags">
                    <span
                      v-if="resource.equipment_needed?.length"
                      class="resources__article-tag"
                    >
                      <BasicIconNext
                        name="Wrench"
                        :size="11"
                      />
                      {{ resource.equipment_needed.length }} équipements
                    </span>
                  </div>
                  <span class="resources__article-read">
                    Lire le guide
                    <BasicIconNext
                      name="ArrowRight"
                      :size="14"
                    />
                  </span>
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
  import PageContent from '@/features/shared/components/PageContent.vue'
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import { useHead } from '@vueuse/head'
  import { storeToRefs } from 'pinia'
  import { onMounted } from 'vue'
  import type { IconNameNext } from '../../../designSystem/src/components/basic/icon/BasicIconNext.types'
  import { useResourcesStore } from './store/useResourcesStore'

  // SEO
  useHead({
    title: 'Ressources Techniques - Lab Notes | Atlas Lab Solutions',
    meta: [
      {
        name: 'description',
        content:
          'Documentation technique pour laboratoires : protocoles de manipulation, analyses HPLC, guides de stockage peptides. Ressources scientifiques Atlas Lab Solutions.',
      },
      {
        property: 'og:title',
        content: 'Ressources Techniques - Lab Notes | Atlas Lab Solutions',
      },
      {
        property: 'og:description',
        content: 'Documentation technique et protocoles pour professionnels de laboratoire.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://fast-peptides.com/ressources',
      },
    ],
  })

  // Store
  const resourcesStore = useResourcesStore()
  const { loadResources } = resourcesStore
  const { resources, isLoading } = storeToRefs(resourcesStore)

  // Methods
  function getDifficultyLabel(level: string | null): string {
    const labels: Record<string, string> = {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé',
    }
    return labels[level || 'intermediate'] || 'Intermédiaire'
  }

  // Lifecycle
  onMounted(async () => {
    await loadResources()
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

  .resources {
    position: relative;
    min-height: 100vh;
    padding-bottom: 80px;

    // ===========================
    // LOADING STATE
    // ===========================
    &__loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    &__loading-text {
      font-family: @font-body;
      font-size: 15px;
      color: var(--text-tertiary);
      margin: 0;
    }

    // ===========================
    // FEATURED TOOL
    // ===========================
    &__featured-tool {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 24px 28px;
      margin-bottom: 40px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.08) 0%,
        rgba(var(--primary-500-rgb), 0.02) 100%
      );
      border: 1px solid rgba(var(--primary-500-rgb), 0.2);
      border-radius: 20px;
      text-decoration: none;
      transition: all 0.3s @ease;

      &:hover {
        border-color: var(--primary-400);
        box-shadow: 0 8px 32px rgba(var(--primary-500-rgb), 0.12);

        .resources__featured-tool-icon {
          background: var(--primary-500);
          color: white;
          transform: rotate(-5deg);
        }

        .resources__featured-tool-action {
          gap: 10px;
          color: var(--primary-600);
        }
      }
    }

    &__featured-tool-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 16px;
      color: var(--primary-600);
      flex-shrink: 0;
      transition: all 0.3s @ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    }

    &__featured-tool-content {
      flex: 1;
      min-width: 0;
    }

    &__featured-tool-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: rgba(var(--primary-500-rgb), 0.12);
      border-radius: 50px;
      font-family: @font-body;
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-700);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin-bottom: 10px;
    }

    &__featured-tool-title {
      font-family: @font-display;
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 6px;
    }

    &__featured-tool-desc {
      font-family: @font-body;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
    }

    &__featured-tool-action {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 12px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      flex-shrink: 0;
      transition: all 0.2s @ease;
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
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-subtle);
    }

    &__grid-title-wrapper {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }

    &__grid-title {
      font-family: @font-display;
      font-size: 22px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    &__grid-count {
      font-family: @font-body;
      font-size: 14px;
      color: var(--text-tertiary);
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
      color: var(--text-tertiary);
      line-height: 1.6;
      max-width: 360px;
      margin: 0 0 28px;
    }

    // ===========================
    // RESOURCES LIST (Doc style)
    // ===========================
    &__articles {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__article-card {
      display: flex;
      gap: 24px;
      padding: 20px;
      background: var(--bg-surface);
      border-radius: 16px;
      text-decoration: none;
      border: 1px solid var(--border-default);
      transition: all 0.25s @ease;
      animation: card-appear 0.4s @ease backwards;
      animation-delay: var(--delay);

      &:hover {
        border-color: var(--primary-300);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

        .resources__article-read {
          color: var(--primary-600);
          gap: 8px;
        }

        .resources__article-image img {
          transform: scale(1.02);
        }
      }
    }

    @keyframes card-appear {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    &__article-image {
      position: relative;
      width: 200px;
      height: 140px;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s @ease;
      }
    }

    &__article-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-surface-secondary);
      color: var(--text-tertiary);
    }

    &__difficulty-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      padding: 4px 10px;
      border-radius: 6px;
      font-family: @font-body;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.02em;

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

    &__article-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    &__article-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    &__article-topic {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      background: rgba(var(--primary-500-rgb), 0.08);
      border-radius: 5px;
      font-family: @font-body;
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-700);
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    &__article-reading {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: @font-body;
      font-size: 12px;
      color: var(--text-tertiary);
    }

    &__article-title {
      font-family: @font-display;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.35;
      margin: 0 0 8px;
    }

    &__article-excerpt {
      font-family: @font-body;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.55;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin: 0 0 12px;
    }

    &__article-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
    }

    &__article-tags {
      display: flex;
      gap: 8px;
    }

    &__article-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      background: var(--bg-surface-secondary);
      border-radius: 5px;
      font-family: @font-body;
      font-size: 11px;
      color: var(--text-tertiary);
    }

    &__article-read {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-tertiary);
      transition: all 0.2s @ease;
    }

    // ===========================
    // RESPONSIVE - Tablet
    // ===========================
    .respond-tablet({
    &__featured-tool {
      flex-wrap: wrap;
    }

    &__featured-tool-action {
      width: 100%;
      justify-content: center;
      margin-top: 8px;
    }
  });

    // ===========================
    // RESPONSIVE - Mobile
    // ===========================
    .respond-mobile({
    &__featured-tool {
      flex-direction: column;
      text-align: center;
      padding: 20px;
      gap: 16px;
    }

    &__featured-tool-icon {
      margin: 0 auto;
    }

    &__featured-tool-badge {
      justify-content: center;
    }

    &__article-card {
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    &__article-image {
      width: 100%;
      height: 160px;
    }

    &__grid-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  });
  }
</style>
