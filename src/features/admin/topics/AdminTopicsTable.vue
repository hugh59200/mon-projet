<template>
  <div>
    <!-- 🔍 Barre de recherche + bouton -->
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher un topic..."
      show-reset
      @reset="reset()"
    >
      <template #actions>
        <BasicButton
          label="+ Nouveau topic"
          type="primary"
          size="small"
          @click="openTopicModal(null)"
        />
      </template>
    </BasicToolbar>

    <!-- 💾 Loader + Liste -->
    <WrapperLoader
      :loading="loading"
      :has-loaded="hasLoaded"
      :is-empty="hasLoaded && filteredData.length === 0"
      message="Chargement des topics..."
      empty-message="Aucun topic pour le moment 🧩"
    >
      <div class="topic-list">
        <div
          v-for="topic in filteredData"
          :key="topic.id"
          class="topic-item"
        >
          <!-- 🧱 Bloc gauche : image + infos -->
          <div class="topic-info">
            <img
              v-if="topic.image"
              :src="topic.image"
              alt="Image du topic"
              class="topic-thumb"
            />
            <div class="topic-text">
              <h3>{{ topic.label }}</h3>
              <p class="slug">#{{ topic.id }}</p>
            </div>
          </div>

          <!-- 🧰 Actions -->
          <div class="actions">
            <BasicIconNext
              name="Edit"
              tooltip="Modifier"
              class="action-icon"
              @click="openTopicModal(topic.id)"
            />
            <BasicIconNext
              name="Trash2"
              tooltip="Supprimer"
              class="action-icon action-icon--delete"
              @click="handleDelete(topic)"
            />
          </div>
        </div>
      </div>
    </WrapperLoader>

    <!-- 🪟 Modal -->
    <teleport to="#app">
      <AdminTopicModal
        v-if="isModalVisible"
        v-model="isModalVisible"
        :topic-id="selectedTopicId"
        @saved="fetchData"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
  import { deleteTopic } from '@/features/admin/api/topics'
  import BasicToolbar from '@/features/admin/shared/components/BasicToolbar.vue'
  import { useAdminTable } from '@/features/admin/shared/composables/useAdminTable'
  import type { NewsTopics } from '@/supabase/types/supabase.types'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import WrapperLoader from '@designSystem/components/wrapper/loader/WrapperLoader.vue'
  import { ref, watch } from 'vue'
  import { deleteTopicImage } from '../api/topicImages'
  import AdminTopicModal from './modale/AdminTopicModal.vue'

  const toast = useToastStore()

  const { filteredData, loading, hasLoaded, fetchData, reset, search } =
    useAdminTable<'news_topics'>({
      table: 'news_topics',
      orderBy: 'created_at',
      ascending: false,
      searchFn: (t, q) => t.label?.toLowerCase()?.includes(q) ?? false,
    })

  async function handleDelete(topic: NewsTopics) {
    if (!confirm(`Supprimer le topic "${topic.label}" ?`)) return
    try {
      if (topic.image) {
        try {
          await deleteTopicImage(topic.image)
          console.log(`🗑️ Image supprimée : ${topic.image}`)
        } catch (imgErr: any) {
          console.warn('Erreur suppression image (non bloquante) :', imgErr)
        }
      }
      await deleteTopic(topic.id)
      toast.show('Topic supprimé ✅', 'success')
      fetchData()
    } catch (err: any) {
      toast.show(`Erreur : ${(err as Error).message}`, 'danger')
    }
  }

  const isModalVisible = ref(false)
  const selectedTopicId = ref<string | null>(null)

  function openTopicModal(id: string | null) {
    selectedTopicId.value = id
    isModalVisible.value = true
  }

  watch(isModalVisible, (val) => {
    if (!val) fetchData()
  })
</script>

<style scoped lang="less">
  .topic-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .topic-item {
    background: white;
    padding: 16px;
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

  .topic-info {
    display: flex;
    align-items: center;
    gap: 14px;

    .topic-thumb {
      width: 52px;
      height: 52px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid @neutral-200;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .topic-text {
      display: flex;
      flex-direction: column;

      h3 {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 600;
        color: @neutral-900;
      }

      .slug {
        margin: 0;
        color: fade(@neutral-900, 55%);
        font-size: 0.88rem;
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
        opacity: 0.7;
        transform: scale(1.1);
      }

      &--delete {
        color: @danger-600;
      }
    }
  }
</style>
