<template>
  <div class="page article-detail">
    <RouterLink
      to="/actualites"
      class="back"
    >
      ← Retour aux actualités
    </RouterLink>

    <article v-if="article">
      <!-- 🧩 Titre -->
      <BasicText
        size="h1"
        weight="semibold"
        color="neutral-900"
        class="title"
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

      <!-- 🖼 Image zoomable -->
      <InnerImageZoom
        v-if="article.image"
        :src="article.image"
        :zoomSrc="article.image"
        class="cover-zoom"
        alt="Image de l’article"
        :moveType="'drag'"
        :zoomType="'click'"
      />

      <!-- 📰 Contenu HTML stylé -->
      <BasicText
        size="body-l"
        color="neutral-900"
        class="content"
        v-html="article.content"
      />
    </article>

    <p v-else>Article introuvable.</p>
  </div>
</template>

<script setup lang="ts">
  import type { NewsArticle } from '@/features/actualités/api/news'
  import { fetchNewsBySlug } from '@/features/actualités/api/news'
  import { formatDate } from '@/utils/index'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { onMounted, ref } from 'vue'
  import InnerImageZoom from 'vue-inner-image-zoom'
  import { useRoute } from 'vue-router'

  const article = ref<NewsArticle | null>(null)
  const route = useRoute()

  onMounted(async () => {
    article.value = await fetchNewsBySlug(route.params.slug as string)
  })
</script>

<style scoped lang="less">
  .article-detail {
    max-width: 760px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .back {
    display: inline-block;
    margin-bottom: 20px;
    color: @primary-500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  /* Titre */
  .title {
    display: block;
    margin-bottom: 10px;
  }

  /* Date */
  .date {
    margin-bottom: 20px;
    display: block;
  }

  /* Image zoomable */
  .cover-zoom {
    display: block;
    width: 100%;
    max-width: 560px;
    margin: 0 auto 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px fade(@neutral-900, 10%);
    cursor: zoom-in;

    :deep(img) {
      border-radius: 12px;
    }
  }

  /* Contenu stylé */
  .content {
    line-height: 1.7;

    :deep(p) {
      margin-bottom: 16px;
    }

    :deep(h2),
    :deep(h3) {
      margin-top: 24px;
      margin-bottom: 12px;
      font-weight: 600;
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 20px;
      margin-bottom: 16px;
    }

    :deep(a) {
      color: @primary-600;
      text-decoration: underline;

      &:hover {
        color: @primary-800;
      }
    }
  }
</style>
