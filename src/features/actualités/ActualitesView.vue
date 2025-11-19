<template>
  <div class="actualites page">
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
    <div
      class="actualites__header"
      v-responsive-animate.slide.once
    >
      <div
        class="actualites__header-title-wrapper"
        v-motion="{
          initial: { opacity: 0, y: -20 },
          enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
        }"
      >
        <BasicText
          size="h3"
          weight="bold"
          class="actualites__header-title"
        >
          Nos
          <span>actualités</span>
        </BasicText>

        <div class="actualites__header-subtitle">
          Derniers articles, recherches & informations importantes 📚
        </div>
      </div>
      <div class="actualites__header-separator"></div>
    </div>

    <BasicText
      size="h1"
      weight="semibold"
      color="neutral-900"
      class="actualites__title"
    >
      {{ activeTopicLabel }}
    </BasicText>
    <div class="actualites__articles">
      <RouterLink
        v-for="article in articles"
        :key="article.slug"
        :to="`/actualites/${article.slug}`"
        class="actualites__article-card"
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
  .actualites {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 20px 0;

    &__header {
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

      &-title-wrapper {
        text-align: center;
      }

      &-title {
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
          filter: drop-shadow(0 1px 4px rgba(var(--primary-400-rgb), 0.18));
        }
      }

      &-subtitle {
        font-size: 15px;
        color: rgba(255, 255, 255, 0.86);
        opacity: 0.92;
        margin-top: 2px;
        text-shadow: 0 0 6px rgba(255, 255, 255, 0.06);
      }

      &-separator {
        width: 100%;
        height: 1px;
        background: rgba(255, 255, 255, 0.18);
        margin: 14px auto 4px;
      }
    }

    &__topic-card {
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

      .actualites__topic-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 20px;
        color: white;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.55) 100%);

        .actualites__topic-title {
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          margin-bottom: 6px;
          text-shadow: 0 3px 6px rgba(0, 0, 0, 0.75);
        }

        .actualites__topic-description {
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

    &__title {
      font-size: clamp(2rem, 3vw, 2.4rem);
      font-weight: 700;
      color: @neutral-900;
    }

    &__articles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 28px;
      padding: 0 12px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .actualites__article-card {
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

        .actualites__article-info {
          padding: 18px 16px 22px;

          .actualites__article-topic {
            margin-bottom: 4px;
            display: block;
            color: var(--primary-600);
          }

          .actualites__article-title {
            margin-bottom: 6px;
            font-size: clamp(1.05rem, 2vw, 1.15rem);
            color: @neutral-900;
          }

          .actualites__article-date {
            display: block;
            margin-bottom: 10px;
            font-size: 0.9rem;
            font-style: italic;
            color: @neutral-500;
          }

          .actualites__article-excerpt {
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
