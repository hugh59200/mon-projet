<template>
  <div class="page actualites">
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
          class="topic-card"
        >
          <img
            :src="item.image"
            :alt="item.label"
          />
          <div class="overlay">
            <BasicText
              size="h3"
              weight="semibold"
              color="white"
              class="topic-title"
            >
              {{ item.label }}
            </BasicText>
            <div
              class="topic-description"
              v-html="parseAndSanitize(item.description)"
            />
          </div>
        </RouterLink>
      </template>
    </BasicCarousel>
    <BasicText
      size="h1"
      weight="semibold"
      color="neutral-900"
      class="page-title"
    >
      {{ activeTopicLabel || 'Actualités' }}
    </BasicText>
    <div class="articles">
      <RouterLink
        v-for="article in articles"
        :key="article.slug"
        :to="`/actualites/${article.slug}`"
        class="article-card"
      >
        <img
          v-if="article.image"
          :src="article.image"
          :alt="article.title"
        />

        <div class="info">
          <BasicText
            v-if="article.topic"
            size="body-s"
            color="primary-600"
            class="topic-label"
          >
            {{ article.topic.label }}
          </BasicText>
          <BasicText
            size="h4"
            weight="semibold"
            color="neutral-900"
            class="article-title"
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
          <div
            class="excerpt"
            v-html="parseAndSanitize(article.excerpt)"
          />
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { formatDate } from '@/utils/index'
  import { parseAndSanitize } from '@/utils/sanitize'
  import BasicCarousel from '@designSystem/components/basic/carousel/BasicCarousel.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useNewsStore } from './store/useNewsStore'

  const route = useRoute()

  const newsStore = useNewsStore()

  const { loadTopics, loadArticles } = newsStore

  const { topics, articles } = storeToRefs(newsStore)

  const activeCategory = computed(() => route.query.categorie as string | undefined)
  const activeTopicLabel = computed(
    () => topics.value.find((t) => t.id === activeCategory.value)?.label || null,
  )

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
  .page-title {
    display: block;
    margin: 28px 0 24px;
    text-align: center;
    font-size: clamp(1.8rem, 4vw, 2.4rem);
  }

  .topic-card {
    position: relative;
    display: block;
    border-radius: 18px;
    overflow: hidden;
    height: 220px;
    text-decoration: none;
    transition: transform 0.3s ease;
    background: @neutral-200;

    &:hover {
      transform: translateY(-4px);
      img {
        transform: scale(1.08);
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 20px;
      color: white;
      background: linear-gradient(
        to top,
        color-mix(in srgb, @neutral-900 88%, transparent) 0%,
        color-mix(in srgb, @neutral-900 55%, transparent) 100%
      );
      transition: background 0.3s ease;

      .topic-title {
        font-size: clamp(1.1rem, 2vw, 1.3rem);
        margin-bottom: 6px;
        text-shadow: 0 3px 6px fade(black, 75%);
      }

      .topic-description {
        font-size: clamp(0.9rem, 1.5vw, 0.95rem);
        line-height: 1.5;
        opacity: 0.95;
        text-shadow: 0 2px 4px fade(black, 80%);
        :deep([style*='color:#0070f3']),
        :deep(a),
        :deep(span) {
          color: #6ec9ff !important;
        }
      }
    }
  }

  .articles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 28px;
    padding: 0 12px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  .article-card {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 3px 10px color-mix(in srgb, @neutral-900 5%, transparent);
    text-decoration: none;
    color: inherit;
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px color-mix(in srgb, @neutral-900 10%, transparent);
    }

    img {
      width: 100%;
      aspect-ratio: 16 / 9;
      border-bottom: 1px solid color-mix(in srgb, @neutral-900 10%, transparent);
      object-fit: cover;
      object-position: center;
      transition: transform 0.4s ease;

      &:hover {
        transform: scale(1.03);
      }
    }

    .info {
      padding: 18px 16px 22px;

      .topic-label {
        margin-bottom: 4px;
        display: block;
      }

      .article-title {
        margin-bottom: 6px;
        font-size: clamp(1.05rem, 2vw, 1.15rem);
      }

      .date {
        display: block;
        margin-bottom: 10px;
        font-size: 0.9rem;
      }

      .excerpt {
        line-height: 1.45;
        font-size: clamp(0.9rem, 1.5vw, 0.95rem);
        color: @neutral-700;

        :deep(p) {
          margin-bottom: 10px;
        }

        :deep(strong) {
          font-weight: 600;
          color: @neutral-900;
        }

        :deep(em) {
          font-style: italic;
          opacity: 0.85;
        }

        :deep(a) {
          color: var(--primary-600);
          text-decoration: underline;

          &:hover {
            color: var(--primary-800);
          }
        }

        :deep(ul) {
          padding-left: 20px;
          margin-top: 6px;

          li {
            list-style-type: disc;
          }
        }
      }
    }
  }
</style>
