<template>
  <div class="actualites page">
    <PageHeader />
    <BasicCarousel
      v-if="topics.length"
      :items="topics"
      :item-width="340"
      :gap="32"
      :transparent-items="true"
    >
      <template #item="{ item }">
        <RouterLink
          :to="`/actualites?categorie=${item.id}`"
          class="actualites__topic-card"
          :aria-label="`Voir les actualités sur : ${item.label}`"
        >
          <img
            :src="item.image"
            :alt="item.label"
          />
          <div class="actualites__topic-overlay">
            <BasicText
              size="h3"
              weight="semibold"
              color="white"
              class="actualites__topic-title"
            >
              {{ item.label }}
            </BasicText>
            <div
              class="actualites__topic-description"
              v-html="parseAndSanitize(item.description)"
            />
          </div>
        </RouterLink>
      </template>
    </BasicCarousel>
    <RouterLink
      v-if="featuredArticle"
      :to="`/actualites/${featuredArticle.slug}`"
      class="actualites__featured"
      v-motion-slide-visible-once-bottom
    >
      <div class="actualites__featured-image-wrapper">
        <img
          :src="featuredArticle.image!"
          :alt="featuredArticle.title"
        />
      </div>
      <div class="actualites__featured-content">
        <BasicText
          size="body-s"
          color="primary-500"
          weight="semibold"
          class="actualites__featured-topic"
        >
          {{ featuredArticle.topic?.label || 'Article en vedette' }}
        </BasicText>
        <BasicText
          size="h3"
          weight="bold"
          color="neutral-900"
          class="actualites__featured-title"
        >
          {{ featuredArticle.title }}
        </BasicText>
        <BasicText
          size="body-m"
          color="neutral-700"
          class="actualites__featured-excerpt"
          v-html="parseAndSanitize(featuredArticle.excerpt)"
        />
        <BasicText
          size="body-s"
          fontStyle="italic"
          color="neutral-500"
          class="actualites__featured-date"
        >
          Publié le {{ formatDate(featuredArticle.published_at) }}
        </BasicText>
      </div>
    </RouterLink>

    <BasicText
      size="h2"
      weight="semibold"
      color="neutral-900"
      class="actualites__title"
    >
      {{ activeTopicLabel }}
    </BasicText>

    <div class="actualites__articles">
      <RouterLink
        v-for="article in nonFeaturedArticles"
        :key="article.slug"
        :to="`/actualites/${article.slug}`"
        class="actualites__article-card"
        v-motion-slide-visible-once-bottom
      >
        <img
          v-if="article.image"
          :src="article.image"
          :alt="article.title"
        />

        <div class="actualites__article-info">
          <BasicText
            v-if="article.topic"
            size="body-s"
            color="primary-600"
            class="actualites__article-topic"
          >
            {{ article.topic.label }}
          </BasicText>
          <BasicText
            size="h4"
            weight="semibold"
            color="neutral-900"
            class="actualites__article-title"
          >
            {{ article.title }}
          </BasicText>
          <BasicText
            size="body-s"
            fontStyle="italic"
            color="neutral-500"
            class="actualites__article-date"
          >
            {{ formatDate(article.published_at) }}
          </BasicText>
          <div
            class="actualites__article-excerpt"
            v-html="parseAndSanitize(article.excerpt)"
          />
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import { formatDate } from '@/utils/index'
  import { parseAndSanitize } from '@/utils/sanitize'
  import BasicCarousel from '@designSystem/components/basic/carousel/BasicCarousel.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useNewsStore } from './store/useNewsStore'

  const route = useRoute()

  // --- Logique métier existante ---

  const newsStore = useNewsStore()
  const { loadTopics, loadArticles } = newsStore
  const { topics, articles } = storeToRefs(newsStore)

  const activeCategory = computed(() => route.query.categorie as string | undefined)

  // Ce titre reste piloté par le store car il change selon le filtre cliqué
  const activeTopicLabel = computed(
    () => topics.value.find((t) => t.id === activeCategory.value)?.label || 'Tous nos articles',
  )

  const featuredArticle = computed(() => articles.value[0])
  const nonFeaturedArticles = computed(() => articles.value.slice(1))

  onMounted(async () => {
    await loadTopics()
    await loadArticles(activeCategory.value)
  })

  watch(
    () => route.query.categorie,
    async () => {
      await loadArticles(activeCategory.value, true)
    },
  )
</script>

<style scoped lang="less">
  .actualites {
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 30px 0;

    // Mixin pour les ombres des cartes
    .card-shadow(@shadow) {
      box-shadow: @shadow;
      transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;
    }

    // Mixin pour les ombres au hover
    .card-hover-effect() {
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
      }
    }

    // Styles du carrousel de Topics
    &__topic-card {
      position: relative;
      display: block;
      border-radius: 18px;
      overflow: hidden;
      height: 220px;
      text-decoration: none;
      .card-shadow(0 4px 12px rgba(0, 0, 0, 0.15));

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }

      .actualites__topic-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 20px;
        color: white;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.55) 100%);
      }
    }

    // Styles du titre de la grille
    &__title {
      font-size: clamp(1.8rem, 2.5vw, 2.2rem);
      margin-top: 10px;
    }

    /* --- STYLES: ARTICLE EN VEDETTE (FEATURED) --- */
    &__featured {
      display: flex;
      gap: 40px;
      padding: 30px;
      margin-bottom: 10px;
      border-radius: 20px;
      background: @neutral-50;

      .card-shadow(0 8px 25px rgba(0, 0, 0, 0.08));
      .card-hover-effect();

      &-image-wrapper {
        width: 55%;
        flex-shrink: 0;
      }

      img {
        width: 100%;
        height: 380px;
        object-fit: cover;
        border-radius: 14px;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        transition: transform 0.4s ease;
      }

      &-content {
        width: 45%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 12px;
      }

      &-title {
        font-size: clamp(1.8rem, 3vw, 2.2rem) !important;
        line-height: 1.25;
      }

      &-topic {
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      &-excerpt {
        max-height: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      @media (max-width: 960px) {
        flex-direction: column;
        padding: 24px;
        gap: 20px;

        &-image-wrapper,
        &-content {
          width: 100%;
        }

        img {
          height: 250px;
        }

        &-excerpt {
          max-height: none;
        }
      }
    }

    /* --- STYLES GRILLE D'ARTICLES CLASSIQUES --- */

    &__articles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 36px 30px;
      padding: 0 12px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 28px;
      }

      .actualites__article-card {
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 16px;
        overflow: hidden;
        .card-shadow(0 3px 10px rgba(0, 0, 0, 0.05));
        .card-hover-effect();

        img {
          width: 100%;
          aspect-ratio: 16 / 9;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          object-fit: cover;
          transition: transform 0.4s ease;

          &:hover {
            transform: scale(1.03);
          }
        }

        .actualites__article-info {
          padding: 18px 16px 22px;

          .actualites__article-topic {
            margin-bottom: 4px;
            display: block;
          }

          .actualites__article-title {
            margin-bottom: 6px;
            font-size: clamp(1.05rem, 2vw, 1.15rem);
          }

          .actualites__article-date {
            display: block;
            margin-bottom: 10px;
            font-size: 0.9rem;
            font-style: italic;
          }

          .actualites__article-excerpt {
            line-height: 1.45;
            font-size: clamp(0.9rem, 1.5vw, 0.95rem);

            :deep(a) {
              color: var(--primary-600);

              &:hover {
                color: var(--primary-800);
              }
            }
          }
        }
      }
    }
  }
</style>
