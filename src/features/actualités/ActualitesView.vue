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
    <div
      class="news-header"
      v-responsive-animate.slide.once
    >
      <div
        class="news-header__title-wrapper"
        v-motion="{
          initial: { opacity: 0, y: -20 },
          enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
        }"
      >
        <BasicText
          size="h3"
          weight="bold"
          class="news-header__title"
        >
          Nos
          <span>actualités</span>
        </BasicText>

        <div class="news-header__subtitle">
          Derniers articles, recherches & informations importantes 📚
        </div>
      </div>
      <div class="news-header__separator"></div>
    </div>

    <BasicText
      size="h1"
      weight="semibold"
      color="neutral-900"
      class="page-title"
    >
      {{ activeTopicLabel }}
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
  .page.actualites {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 20px 0;

    /* ===============================
     ░▒▒░  HEADER ACTUALITÉS  ░▒▒░
     =============================== */
    .news-header {
      border-radius: 18px;
      padding: 34px 32px;
      margin-bottom: 10px;
      position: relative;
      overflow: hidden;
      text-align: center;
      background: var(--secondary-200);
      backdrop-filter: blur(26px);
      -webkit-backdrop-filter: blur(26px);

      border: 1px solid rgba(255, 255, 255, 0.1);

      &__title-wrapper {
        text-align: center;
      }

      &__title {
        font-size: 30px;
        font-weight: 800;
        letter-spacing: -0.3px;
        color: @neutral-100;
        margin-bottom: 6px;

        span {
          background: linear-gradient(
            90deg,
            var(--secondary-600),
            var(--primary-500),
            var(--primary-200)
          );
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          /* Glow text sans fade */
          filter: drop-shadow(0 1px 4px rgba(var(--primary-400-rgb), 0.18));
        }
      }

      &__subtitle {
        font-size: 15px;
        color: rgba(255, 255, 255, 0.86);
        opacity: 0.92;
        margin-top: 2px;
        text-shadow: 0 0 6px rgba(255, 255, 255, 0.06);
      }

      &__separator {
        width: 100%;
        height: 1px;
        background: rgba(255, 255, 255, 0.18);
        margin: 14px auto 4px;
      }
    }

    /* ===============================
     ░▒▒░  TOPIC CARDS  ░▒▒░
     =============================== */
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

        background: linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.55) 100%);

        .topic-title {
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          margin-bottom: 6px;
          text-shadow: 0 3px 6px rgba(0, 0, 0, 0.75);
        }

        .topic-description {
          font-size: clamp(0.9rem, 1.5vw, 0.95rem);
          line-height: 1.5;
          opacity: 0.95;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);

          :deep(a),
          :deep(span) {
            color: #6ec9ff !important;
          }
        }
      }
    }

    /* ===============================
     ░▒▒░  ARTICLES GRID  ░▒▒░
     =============================== */
    .articles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 28px;
      padding: 0 12px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .article-card {
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        text-decoration: none;
        color: inherit;
        transition:
          transform 0.25s ease,
          box-shadow 0.25s ease;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }

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

        .info {
          padding: 18px 16px 22px;

          .topic-label {
            margin-bottom: 4px;
            display: block;
            color: var(--primary-600);
          }

          .article-title {
            margin-bottom: 6px;
            font-size: clamp(1.05rem, 2vw, 1.15rem);
            color: @neutral-900;
          }

          .date {
            display: block;
            margin-bottom: 10px;
            font-size: 0.9rem;
            font-style: italic;
            color: @neutral-500;
          }

          .excerpt {
            line-height: 1.45;
            font-size: clamp(0.9rem, 1.5vw, 0.95rem);
            color: @neutral-700;

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
