<template>
  <div>
    <!-- 🔍 Barre de recherche -->
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

    <!-- 💾 Loader + Liste -->
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
          <!-- 🧱 Bloc gauche : image + texte -->
          <div class="news-info">
            <div class="thumb-container">
              <img
                :src="article.image || fallbackImage"
                alt="Image de l’actualité"
                class="news-thumb"
                loading="lazy"
              />
            </div>

            <div class="news-text">
              <h3>{{ article.title }}</h3>
              <p class="excerpt">{{ article.excerpt || '—' }}</p>
              <p class="date">
                Publié le
                {{ new Date(article.published_at!).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <!-- 🧰 Actions -->
          <div
            v-if="!readonly"
            class="actions"
          >
            <BasicIconNext
              name="Eye"
              tooltip="Voir / Modifier"
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

    <!-- 🪟 Modales -->
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
  import { useAdminTable } from '@/features/admin/shared/composables/useAdminTable'
  import type { News } from '@/supabase/types/supabase.types'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import WrapperLoader from '@designSystem/components/wrapper/loader/WrapperLoader.vue'
  import { ref } from 'vue'
  import BasicToolbar from '../shared/components/BasicToolbar.vue'
  import AdminNewsModal from './modale/AdminNewsModal.vue'

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

  // 🖼️ Image de fallback
  const fallbackImage = '/images/placeholder-news.png'

  async function handleDelete(article: News) {
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
    gap: 14px;
  }

  .news-item {
    background: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 1px 4px fade(@neutral-900, 5%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.2s ease;

    &:hover {
      background: fade(@primary-100, 10%);
    }
  }

  .news-info {
    display: flex;
    align-items: center;
    gap: 16px;

    .thumb-container {
      flex-shrink: 0;
      width: 64px;
      height: 64px;
      border-radius: 8px;
      overflow: hidden;
      background: fade(@neutral-200, 40%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .news-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .news-text {
      display: flex;
      flex-direction: column;

      h3 {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 600;
        color: @neutral-900;
      }

      .excerpt {
        margin: 0;
        color: fade(@neutral-900, 70%);
        font-size: 0.9rem;
      }

      .date {
        font-size: 0.8rem;
        color: fade(@neutral-900, 60%);
      }
    }
  }

  .actions {
    display: flex;
    gap: 12px;

    .action-icon {
      cursor: pointer;
      transition:
        opacity 0.2s,
        transform 0.2s;

      &:hover {
        opacity: 0.8;
        transform: scale(1.1);
      }

      &--delete {
        color: @danger-600;
      }
    }
  }
</style>
