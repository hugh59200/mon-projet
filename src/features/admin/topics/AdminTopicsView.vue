<template>
  <div class="admin-topics">
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher un topic..."
      show-reset
      @reset="reset"
    >
      <template #actions>
        <PremiumButton
          label="+ Nouveau topic"
          type="primary"
          size="sm"
          @click="openTopicModal(null)"
        />
      </template>
    </BasicToolbar>

    <WrapperLoader
      :loading="loading"
      :has-loaded="hasLoaded"
      :is-empty="hasLoaded && filteredData.length === 0"
      message="Chargement des topics..."
      empty-message="Aucun topic pour le moment 🧩"
    >
      <template v-if="isDesktop || isTablet">
        <div class="cardLayoutWrapper cardLayoutWrapper--header admin-topics__header">
          <BasicCell
            :span="18"
            text="Label"
            :is-active="sortKey === 'label'"
            :icon-color="getSortColor('label')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('label')"
          />
          <BasicCell
            :span="14"
            text="ID"
            :is-active="sortKey === 'id'"
            :icon-color="getSortColor('id')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('id')"
          />
          <BasicCell :span="4" />
        </div>

        <div
          v-for="topic in filteredData"
          :key="topic.id"
          class="gridElemWrapper admin-topics__row"
        >
          <div
            class="cardLayoutWrapper admin-topics__item"
            @click="openTopicModal(topic.id)"
          >
            <BasicCell
              :span="18"
              class="admin-topics__info"
            >
              <img
                :src="topic.image || fallbackImage"
                alt="Image du topic"
                class="admin-topics__thumb"
              />
              <BasicText
                :label="topic.label"
                size="body-l"
                weight="semibold"
                color="neutral-900"
                pointer
              />
            </BasicCell>
            <BasicCell :span="14">
              <BasicText
                :label="'#' + topic.id"
                size="body-s"
                color="neutral-600"
              />
            </BasicCell>
            <BasicCellActionIcon
              icon-name="trash"
              tooltip="Supprimer"
              center
              danger
              :span="4"
              @click="handleDelete(topic)"
            />
          </div>
        </div>
      </template>

      <template v-else>
        <TopicCardMobile
          v-for="topic in filteredData"
          :key="topic.id"
          :topic="topic"
          :fallback-image="fallbackImage"
          :open-topic-modal="openTopicModal"
          :handle-delete="handleDelete"
          class="gridElemWrapper admin-topics__mobile-card"
        />
      </template>
    </WrapperLoader>

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
  import { useAdminTable } from '@/features/admin/shared/composables/useAdminTable'
  import { useSortableTable } from '@/features/admin/shared/composables/useSortableTable'
  import { useDialog } from '@/features/interface/dialog'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { deleteTopicImage } from '@/api/supabase/storage'
  import { deleteTopic } from '@/api/supabase/topics'
  import type { Tables } from '@/supabase/types/supabase'
  import type { NewsTopics } from '@/supabase/types/supabase.types'
  import { sanitizeHTML } from '@/utils/sanitize'
  import { ref, watch } from 'vue'

  import BasicCell from '@designSystem/components/basic/cell/BasicCell.vue'
  import BasicCellActionIcon from '@designSystem/components/basic/cell/BasicCellActionIcon.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import WrapperLoader from '@designSystem/components/wrapper/loader/WrapperLoader.vue'
  import BasicToolbar from '../shared/components/BasicToolbar.vue'
  import TopicCardMobile from './mobile/TopicCardMobile.vue'
  import AdminTopicModal from './modale/AdminTopicModal.vue'

  const toast = useToastStore()
  const { showDialog } = useDialog()
  const { isTablet, isDesktop } = useDeviceBreakpoint()

  const { filteredData, sortKey, sortAsc, loading, hasLoaded, fetchData, reset, search } =
    useAdminTable<'news_topics'>({
      table: 'news_topics',
      orderBy: 'created_at',
      ascending: false,
      searchFn: (t, q) => t.label?.toLowerCase()?.includes(q) ?? false,
      persistInUrl: true,
    })

  const { toggleSort, getSortColor } = useSortableTable<Tables<'news_topics'>>(
    sortKey,
    sortAsc,
    filteredData,
  )

  const fallbackImage = '/images/placeholder-topic.png'

  async function handleDelete(topic: NewsTopics) {
    const safeLabel = sanitizeHTML(topic.label ?? '')

    const result = await showDialog({
      type: 'YesNo',
      title: 'Supprimer ce topic ?',
      message: [
        `
      <p style="margin:0 0 12px;">Voulez-vous vraiment supprimer ce topic ?</p>
      <p style="margin:0 0 12px;"><strong>Topic :</strong> ${safeLabel}</p>
      <p style="margin:0;"><strong>Confirmez-vous ?</strong></p>
    `,
      ],
      isHtml: true,
      closable: false,
    })

    if (result !== 'Yes') return

    try {
      if (topic.image) {
        try {
          await deleteTopicImage(topic.image)
        } catch {}
      }
      await deleteTopic(topic.id)
      toast.show('Topic supprimé ✅', 'success')
      fetchData()
    } catch (err: any) {
      toast.show(`Erreur : ${err.message}`, 'danger')
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
  .admin-topics {
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
      background: color-mix(in srgb, @neutral-200 40%, transparent);
    }
  }
</style>
