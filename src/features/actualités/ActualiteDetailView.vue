<template>
  <div class="page article-detail">
    <BasicLink
      :to="'/actualites'"
      type="secondary"
      state="icon-left"
      iconName="ArrowLeft"
      class="back-link"
      label="Retour aux actualités"
    />
    <WrapperLoader
      :loading="loading"
      :has-loaded="!!article"
      :is-empty="!article && !loading"
      message="Chargement de l'article..."
      empty-message="Article non trouvé ou indisponible."
    >
      <article
        v-if="article"
        class="article-content"
      >
        <BasicText
          size="h1"
          weight="bold"
          color="neutral-900"
          class="article__title"
        >
          {{ article.title }}
        </BasicText>
        <div class="article__meta">
          <BasicText
            v-if="article.topic"
            size="body-s"
            color="primary-600"
            class="article__topic"
          >
            {{ article.topic.label }}
          </BasicText>
          <BasicText
            size="body-s"
            fontStyle="italic"
            color="neutral-500"
          >
            Publié le {{ formatDate(article.published_at) }}
          </BasicText>
        </div>

        <InnerImageZoom
          v-if="article.image"
          :src="article.image"
          :zoomSrc="article.image"
          class="article__cover"
          :alt="`Image de couverture pour : ${article.title}`"
        />

        <div
          class="article__body"
          v-html="parsedContent"
        ></div>
      </article>

      <section
        v-if="relatedArticles.length"
        class="related-section"
      >
        <BasicText
          size="h2"
          weight="semibold"
          color="neutral-900"
          class="related-title"
        >
          Articles similaires
        </BasicText>

        <BasicCarousel
          :items="relatedArticles"
          :item-width="300"
          :gap="24"
          :show-arrows="true"
        >
          <template #item="{ item }">
            <RouterLink
              :to="`/actualites/${item.slug}`"
              class="related-card"
            >
              <img
                :src="item.image"
                :alt="item.title"
              />
              <div class="overlay">
                <BasicText
                  size="h5"
                  weight="semibold"
                  color="white"
                >
                  {{ item.title }}
                </BasicText>
              </div>
            </RouterLink>
          </template>
        </BasicCarousel>
      </section>
    </WrapperLoader>
  </div>
</template>

<script setup lang="ts">
  import { fetchNews, fetchNewsBySlug } from '@/features/actualités/api/news'
  import type { News } from '@/supabase/types/supabase.types'
  import { formatDate } from '@/utils/index'
  import { parseAndSanitize } from '@/utils/sanitize'
  import BasicCarousel from '@designSystem/components/basic/carousel/BasicCarousel.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { computed, onMounted, ref } from 'vue'
  import InnerImageZoom from 'vue-inner-image-zoom'
  import { useRoute } from 'vue-router'

  // =========================================================
  // TYPES ADAPTÉS AU TEMPLATE (à définir dans votre fichier de types)
  // =========================================================
  // Ces types sont nécessaires pour que le code ci-dessous fonctionne sans erreur TypeScript
  export interface NewsTopic {
    label: string
  }

  // Le type Article enrichi pour ce composant
  export interface NewsDetail extends News {
    topic: NewsTopic | null
  }
  // =========================================================

  const loading = ref(true)
  const article = ref<NewsDetail | null>(null)
  const relatedArticles = ref<NewsDetail[]>([])
  const route = useRoute()

  const parsedContent = computed(() =>
    article.value?.content ? parseAndSanitize(article.value.content) : '',
  )

  onMounted(async () => {
    loading.value = true
    const slug = route.params.slug as string

    try {
      // NOTE: La fonction fetchNewsBySlug doit joindre le 'topic'
      const fetchedArticle = (await fetchNewsBySlug(slug)) as NewsDetail
      article.value = fetchedArticle

      if (article.value?.topic_id) {
        // fetchNews devrait également être mise à jour pour inclure le topic
        const all = (await fetchNews(article.value.topic_id)) as NewsDetail[]
        relatedArticles.value = all.filter((a) => a.slug !== slug).slice(0, 5)
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'article:", error)
      article.value = null
    } finally {
      loading.value = false
    }
  })
</script>

<style scoped lang="less">
  @page-max-width: 900px;

  .article-detail {
    max-width: @page-max-width;
    margin: 0 auto;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .back-link {
      margin-bottom: 24px;
    }

    .article-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 0 10px;
    }

    &__title {
      font-size: clamp(2.2rem, 4vw, 3rem) !important;
      line-height: 1.2;
    }

    &__meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    &__topic {
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    &__cover {
      width: 100%;
      max-height: 450px;
      overflow: hidden;
      border-radius: 14px;
      margin: 20px 0 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

      // Surcharge les styles de l'image à l'intérieur de vue-inner-image-zoom
      :deep(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    // TYPOGRAPHIE INJECTÉE (v-html)
    &__body {
      line-height: 1.7;
      font-size: 1.1rem;
      color: @neutral-800; // Couleur neutre non affectée par le thème

      :deep(p) {
        margin-bottom: 1.2em;
      }

      :deep(h2) {
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--secondary-900); /* ADAPTÉ AU THÈME */
        border-bottom: 2px solid var(--primary-200); /* ADAPTÉ AU THÈME */
        padding-bottom: 4px;
      }

      :deep(h3) {
        margin-top: 2rem;
        margin-bottom: 0.8rem;
        font-size: 1.4rem;
        font-weight: 600;
        color: var(--primary-700); /* ADAPTÉ AU THÈME */
      }

      :deep(ul),
      :deep(ol) {
        margin: 1.5rem 0;
        padding-left: 1.5rem;
      }

      :deep(li) {
        margin-bottom: 0.5rem;
      }

      :deep(strong) {
        font-weight: 800;
      }
    }

    /* --- SECTION ARTICLES SIMILAIRES --- */

    .related-section {
      margin-top: 64px;
      padding: 0 10px;

      .related-title {
        margin-bottom: 24px;
        text-align: center;
        font-size: 1.8rem;
      }

      .related-card {
        position: relative;
        display: block;
        border-radius: 14px;
        overflow: hidden;
        text-decoration: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
        }

        img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            // Utilisation des variables RGB Secondary pour un overlay thématique
            rgba(var(--secondary-900-rgb), 0.85) 0%,
            rgba(var(--secondary-900-rgb), 0.4) 100%
          );
          display: flex;
          align-items: flex-end;
          padding: 16px;
        }
      }
    }

    @media (max-width: 768px) {
      padding: 24px 16px;

      .related-section {
        padding: 0;
      }
    }
  }
</style>
