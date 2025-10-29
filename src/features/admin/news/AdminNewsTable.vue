<template>
  <div>
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher une actualité..."
      show-reset
      @reset="reset()"
    >
      <template
        v-if="!readonly"
        #actions
      >
        <BasicButton
          label="+ Ajouter une actualité"
          type="primary"
          size="small"
          @click="isCreateModalVisible = true"
        />
      </template>
    </BasicToolbar>

    <WrapperLoader
      :loading="loading"
      :has-loaded="hasLoaded"
      :is-empty="hasLoaded && filteredData.length === 0"
      message="Chargement des actualités..."
      empty-message="Aucune actualité pour le moment 📰"
    >
      <div class="news-list">
        <div
          v-for="article in filteredData"
          :key="article.id"
          class="news-item"
        >
          <div class="news-info">
            <h3>{{ article.title }}</h3>
            <p class="excerpt">{{ article.excerpt || '—' }}</p>
            <p class="date">
              Publié le
              {{ new Date(article.published_at!).toLocaleDateString() }}
            </p>
          </div>

          <div
            v-if="!readonly"
            class="actions"
          >
            <BasicIconNext
              name="Eye"
              tooltip="Voir"
              class="action-icon"
              @click="openNewsModal(article.id)"
            />
            <BasicIconNext
              name="Trash2"
              tooltip="Supprimer"
              class="action-icon action-icon--delete"
              @click="handleDelete(article)"
            />
          </div>
        </div>
      </div>
    </WrapperLoader>

    <teleport to="#app">
      <!-- ➕ Création -->
      <AdminNewsModal
        v-if="!readonly"
        v-model="isCreateModalVisible"
        @saved="fetchData"
      />

      <!-- 🔍 Lecture / Édition -->
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
  import { deleteNews } from '@/features/actualités/api/news'
  import { useAdminTable } from '@/features/admin/shared/useAdminTable'
  import type { Tables } from '@/supabase/types/supabase'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { ref } from 'vue'
  import BasicToolbar from '../BasicToolbar.vue'
  import AdminNewsModal from './modale/AdminNewsModal.vue'

  type NewsRow = Tables<'news'>

  const props = defineProps<{ readonly?: boolean }>()

  const toast = useToastStore()

  const { filteredData, loading, hasLoaded, fetchData, reset, search } = useAdminTable<'news'>({
    table: 'news',
    orderBy: 'published_at',
    ascending: false,
    searchFn: (n, q) =>
      (n.title?.toLowerCase()?.includes(q) ?? false) ||
      (n.excerpt?.toLowerCase()?.includes(q) ?? false),
  })

  async function handleDelete(article: NewsRow) {
    if (props.readonly) return
    if (!confirm(`Supprimer "${article.title}" ?`)) return
    try {
      await deleteNews(article.id)
      toast.show('Actualité supprimée ✅', 'success')
      fetchData()
    } catch (err: any) {
      toast.show(`Erreur : ${(err as Error).message}`, 'danger')
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
  .news-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .news-item {
    background: white;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 1px 4px fade(@neutral-900, 5%);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .news-info h3 {
    margin: 0;
    font-size: 1.1rem;
  }

  .excerpt {
    color: fade(@neutral-900, 70%);
    font-size: 0.95rem;
  }

  .date {
    font-size: 0.8rem;
    color: fade(@neutral-900, 60%);
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 18px;

    .action-icon {
      cursor: pointer;
      &:hover {
        opacity: 0.7;
        transform: scale(1.1);
      }

      &--delete {
        color: @danger-600;
      }
    }
  }
</style>
