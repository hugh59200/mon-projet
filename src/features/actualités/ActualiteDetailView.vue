<template>
  <div class="page article-detail">
    <BasicLink
      :to="'/actualites'"
      type="secondary"
      state="icon-left"
      iconName="ArrowLeft"
      size="medium"
    >
      <BasicText
        color="primary-600"
        weight="light"
      >
        Retour aux
      </BasicText>
      <BasicText
        weight="bold"
        color="primary-600"
      >
        actualités
      </BasicText>
    </BasicLink>
    <article v-if="article">
      <BasicText
        size="h1"
        weight="semibold"
        color="neutral-900"
        class="title"
      >
        {{ article.title }}
      </BasicText>

      <BasicText
        size="body-s"
        fontStyle="italic"
        color="neutral-500"
        class="date"
      >
        {{ formatDate(article.published_at) }}
      </BasicText>

      <InnerImageZoom
        v-if="article.image"
        :src="article.image"
        :zoomSrc="article.image"
        class="cover-zoom"
        alt="Image de l’article"
      />

      <BasicText
        size="body-l"
        color="neutral-900"
        class="content"
        v-html="parsedContent"
      />
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
  </div>
</template>

<script setup lang="ts">
  import type { NewsArticle } from '@/features/actualités/api/news'
  import { fetchNews, fetchNewsBySlug } from '@/features/actualités/api/news'
  import { formatDate } from '@/utils/index'
  import { parseAndSanitize } from '@/utils/sanitize'
  import BasicCarousel from '@designSystem/components/basic/carousel/BasicCarousel.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { computed, onMounted, ref } from 'vue'
  import InnerImageZoom from 'vue-inner-image-zoom'
  import { useRoute } from 'vue-router'

  const article = ref<NewsArticle | null>(null)
  const relatedArticles = ref<NewsArticle[]>([])
  const route = useRoute()

  const parsedContent = computed(() =>
    article.value?.content ? parseAndSanitize(article.value.content) : '',
  )

  onMounted(async () => {
    const slug = route.params.slug as string
    article.value = await fetchNewsBySlug(slug)

    if (article.value?.topic_id) {
      const all = await fetchNews(article.value.topic_id)
      relatedArticles.value = all.filter((a) => a.slug !== slug).slice(0, 5)
    }
  })
</script>

<style scoped lang="less">
  .related-section {
    margin-top: 64px;

    .related-title {
      margin-bottom: 20px;
      text-align: center;
    }

    .related-card {
      position: relative;
      display: block;
      border-radius: 12px;
      overflow: hidden;
      text-decoration: none;

      img {
        width: 100%;
        height: 180px;
        object-fit: cover;
        transition: transform 0.4s ease;
      }

      &:hover img {
        transform: scale(1.05);
      }

      .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to top,
          fade(@neutral-900, 85%) 0%,
          fade(@neutral-900, 40%) 100%
        );
        display: flex;
        align-items: flex-end;
        padding: 12px;
      }
    }
  }
</style>
