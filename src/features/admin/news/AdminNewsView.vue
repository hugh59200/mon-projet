<template>
  <div class="admin-news">
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher une actualité..."
      show-reset
      show-role
      @reset="reset"
    >
      <template #actions>
        <BasicButton
          v-if="!readonly"
          label="+ Ajouter une actualité"
          type="primary"
          size="small"
          @click="isCreateModalVisible = true"
        />
      </template>
    </BasicToolbar>
    <BasicPagination
      :current-page="page"
      :nb-pages="nbPages"
      :nb-results="total"
      :nb-pages-max="5"
      :auto-fetch="fetchData"
      @change="page = $event"
    />
    <WrapperLoader
      :loading="loading"
      :has-loaded="hasLoaded"
      :is-empty="hasLoaded && enrichedNews.length === 0"
      message="Chargement des actualités..."
      empty-message="Aucune actualité trouvée 😅"
    >
      <template v-if="isDesktop || isTablet">
        <div class="cardLayoutWrapper cardLayoutWrapper--header admin-news__header">
          <BasicCell
            :span="18"
            text="Titre"
            :is-active="sortKey === 'title'"
            :icon-color="getSortColor('title')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('title')"
          />
          <BasicCell
            :span="8"
            text="Thématique"
            :is-active="sortKey === 'topic_label'"
            :icon-color="getSortColor('topic_label')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('topic_label')"
          />
          <BasicCell
            :span="6"
            text="Date de publication"
            :is-active="sortKey === 'published_at'"
            :icon-color="getSortColor('published_at')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('published_at')"
          />
          <BasicCell :span="4" />
        </div>
        <div
          v-for="news in enrichedNews"
          :key="news.id"
          class="gridElemWrapper admin-news__row"
        >
          <div
            class="cardLayoutWrapper admin-news__item"
            @click="openNewsModal(news.id)"
          >
            <BasicCell
              :span="18"
              class="admin-news__info"
            >
              <img
                :src="news.image || fallbackImage"
                alt="Aperçu"
                class="admin-news__thumb"
              />
              <BasicText
                :label="news.title"
                size="body-l"
                weight="semibold"
                color="neutral-900"
                pointer
                class="admin-news__title"
              />
            </BasicCell>
            <BasicCell :span="8">
              <BasicText
                :label="news.topic_label || '—'"
                size="body-m"
                color="neutral-700"
              />
            </BasicCell>
            <BasicCell :span="6">
              <BasicText
                :label="news.published_at ? formatDate(news.published_at) : '—'"
                size="body-s"
                color="neutral-500"
              />
            </BasicCell>
            <BasicCellActionIcon
              v-if="!readonly"
              icon-name="trash"
              tooltip="Supprimer"
              center
              danger
              :span="4"
              @click="handleDelete(news)"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <NewsCardMobile
          v-for="news in enrichedNews"
          :key="news.id"
          :article="news"
          :open-news-modal="openNewsModal"
          :handle-delete="handleDelete"
          :fallback-image="fallbackImage"
          class="gridElemWrapper admin-news__mobile-card"
        />
      </template>
    </WrapperLoader>
    <teleport to="#app">
      <AdminNewsModal
        v-if="!readonly"
        v-model="isCreateModalVisible"
        @saved="fetchData"
      />
      <AdminNewsModal
        v-if="selectedNewsId"
        v-model="isModalVisible"
        :news-id="selectedNewsId"
        :readonly="readonly"
        @saved="fetchData"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
  import { deleteNews } from '@/api/supabase/news'
  import { useAdminTable } from '@/features/admin/shared/composables/useAdminTable'
  import { useSortableTable } from '@/features/admin/shared/composables/useSortableTable'
  import { useDialog } from '@/features/interface/dialog'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { fetchTopics } from '@/api/supabase/topics'
  import type { Tables } from '@/supabase/types/supabase'
  import type { News } from '@/supabase/types/supabase.types'
  import { formatDate, sanitizeHTML } from '@/utils'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicCell from '@designSystem/components/basic/cell/BasicCell.vue'
  import BasicCellActionIcon from '@designSystem/components/basic/cell/BasicCellActionIcon.vue'
  import BasicPagination from '@designSystem/components/basic/pagination/BasicPagination.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import WrapperLoader from '@designSystem/components/wrapper/loader/WrapperLoader.vue'
  import { computed, onMounted, ref } from 'vue'
  import BasicToolbar from '../shared/components/BasicToolbar.vue'
  import NewsCardMobile from './mobile/NewsCardMobile.vue'
  import AdminNewsModal from './modale/AdminNewsModal.vue'

  type NewsWithTopic = News & { topic_label?: string | null }

  const props = defineProps<{ readonly?: boolean }>()
  const toast = useToastStore()
  const { showDialog } = useDialog()

  const {
    filteredData,
    total,
    nbPages,
    page,
    search,
    sortKey,
    sortAsc,
    loading,
    hasLoaded,
    fetchData,
    reset,
  } = useAdminTable<'news', NewsWithTopic>({
    table: 'news',
    orderBy: 'published_at',
    ascending: false,
    searchFn: (n, q) =>
      (n.title?.toLowerCase()?.includes(q) ?? false) ||
      (n.excerpt?.toLowerCase()?.includes(q) ?? false),
  })

  const { isTablet, isDesktop } = useDeviceBreakpoint()

  const { toggleSort, getSortColor } = useSortableTable<Tables<'news'>>(
    sortKey,
    sortAsc,
    filteredData,
  )

  const fallbackImage = '/images/placeholder-news.png'

  const topicsMap = ref<Record<string, string>>({})

  async function loadTopics() {
    const topics = await fetchTopics()
    topicsMap.value = Object.fromEntries(topics.map((t) => [t.id, t.label]))
  }
  onMounted(loadTopics)

  const enrichedNews = computed<NewsWithTopic[]>(() =>
    filteredData.value.map((n) => ({
      ...n,
      topic_label: n.topic_id ? topicsMap.value[n.topic_id] : null,
    })),
  )

  async function handleDelete(article: News) {
    if (props.readonly) return

    const safeTitle = sanitizeHTML(article.title ?? '')
    const result = await showDialog({
      type: 'YesNo',
      title: 'Supprimer cette actualité ?',
      message: [
        `
        <p style="margin:0 0 12px;">Voulez-vous vraiment supprimer cette actualité ?</p>
        <p style="margin:0 0 12px;"><strong>Titre :</strong> ${safeTitle}</p>
        <p style="margin:0;"><strong>Confirmez-vous ?</strong></p>
      `,
      ],
      isHtml: true,
      closable: false,
    })
    if (result !== 'Yes') return

    try {
      await deleteNews(article.id)
      toast.show('Actualité supprimée ✅', 'success')
      fetchData()
    } catch (err: any) {
      toast.show(`Erreur : ${err.message}`, 'danger')
    }
  }

  const isModalVisible = ref(false)
  const selectedNewsId = ref<string | null>(null)
  const isCreateModalVisible = ref(false)

  function openNewsModal(id: string) {
    selectedNewsId.value = id
    isModalVisible.value = true
  }
</script>

<style scoped lang="less">
  .admin-news {
    &__item {
      cursor: pointer;

      &:hover {
        background: var(--primary-0);
      }
    }

    &__mobile-card {
      margin: 4px 0;
    }

    &__info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &__thumb {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid @neutral-200;
    }
  }
</style>
