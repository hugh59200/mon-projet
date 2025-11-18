import { fetchNews, fetchNewsTopics } from '@/features/actualités/api/news'
import type { News, NewsTopics } from '@/supabase/types/supabase.types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface NewsWithTopic extends News {
  topic: NewsTopics | null
}

export const useNewsStore = defineStore(
  'news',
  () => {
    const topics = ref<NewsTopics[]>([])
    const articles = ref<NewsWithTopic[]>([])
    const lastFetch = ref(0)

    const loading = ref(false)
    const TTL = 1000 * 60 * 5

    async function loadTopics(force = false) {
      if (!force && topics.value.length > 0 && Date.now() - lastFetch.value < TTL) return
      loading.value = true
      topics.value = await fetchNewsTopics()
      lastFetch.value = Date.now()
      loading.value = false
    }

    async function loadArticles(category?: string, force = false) {
      if (!force && articles.value.length > 0 && Date.now() - lastFetch.value < TTL) return

      loading.value = true
      const data = await fetchNews(category)

      articles.value = data.map((a) => ({
        ...a,
        topic: topics.value.find((t) => t.id === a.topic_id) || null,
      }))

      lastFetch.value = Date.now()
      loading.value = false
    }

    return {
      topics,
      articles,
      loading,
      lastFetch,
      loadTopics,
      loadArticles,
    }
  },
  {
    persist: {
      key: 'news-cache-v1',
      storage: localStorage,
      pick: ['topics', 'articles', 'lastFetch'],
    },
  },
)
