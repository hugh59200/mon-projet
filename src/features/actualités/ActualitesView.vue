<template>
  <div class="page actualites">
    <!-- 🧩 Titre principal -->
    <BasicText
      size="h1"
      weight="semibold"
      color="neutral-900"
      class="page-title"
    >
      Actualités
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
          <!-- 🧩 Titre de l’article -->
          <BasicText
            size="h4"
            weight="semibold"
            color="neutral-900"
            class="article-title"
          >
            {{ article.title }}
          </BasicText>

          <!-- 📅 Date -->
          <BasicText
            size="body-s"
            fontStyle="italic"
            color="neutral-500"
            class="date"
          >
            {{ formatDate(article.published_at) }}
          </BasicText>

          <!-- 🧾 Extrait -->
          <BasicText
            size="body-m"
            color="neutral-700"
            class="excerpt"
          >
            {{ article.excerpt }}
          </BasicText>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { NewsArticle } from '@/features/actualités/api/news'
  import { fetchNews } from '@/features/actualités/api/news'
  import { formatDate } from '@/utils/index'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { onMounted, ref } from 'vue'

  const articles = ref<NewsArticle[]>([])

  onMounted(async () => {
    articles.value = await fetchNews()
  })
</script>

<style scoped lang="less">
  .page-title {
    display: block;
    margin-bottom: 28px;
  }

  .articles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 28px;
  }

  .article-card {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 3px 10px fade(@neutral-900, 5%);
    text-decoration: none;
    color: inherit;
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px fade(@neutral-900, 10%);
    }

    img {
      width: 100%;
      aspect-ratio: 16 / 9;
      border-bottom: 1px solid fade(@neutral-900, 10%);
      object-fit: cover;
      object-position: center;
      transition: transform 0.4s ease;

      &:hover {
        transform: scale(1.03);
      }
    }

    .info {
      padding: 18px 16px 22px;

      .article-title {
        display: block;
        margin-bottom: 6px;
      }

      .date {
        display: block;
        margin-bottom: 10px;
      }

      .excerpt {
        line-height: 1.45;
        display: block;
      }
    }
  }
</style>
