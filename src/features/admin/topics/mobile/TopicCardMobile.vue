<template>
  <div
    class="mobile-card"
    @click="openTopicModal(topic.id)"
  >
    <div class="top-row">
      <img
        :src="topic.image || fallbackImage"
        alt="Image du topic"
        class="thumb"
      />

      <div class="content">
        <BasicText
          weight="bold"
          color="neutral-900"
          class="title"
        >
          {{ topic.label }}
        </BasicText>

        <BasicText
          size="body-s"
          color="neutral-500"
        >
          #{{ topic.id }}
        </BasicText>
      </div>

      <div
        class="actions"
        @click.stop
      >
        <BasicIconNext
          name="Trash2"
          :size="18"
          color="danger-600"
          pointer
          @click="handleDelete(topic)"
          class="action-icon"
        />
      </div>
    </div>

    <BasicText
      size="body-s"
      color="neutral-600"
      class="theme"
    >
      {{ topic.description || '—' }}
    </BasicText>
  </div>
</template>

<script setup lang="ts">
  import type { NewsTopics } from '@/supabase/types/supabase.types'

  defineProps<{
    topic: NewsTopics
    fallbackImage: string
    openTopicModal: (id: string) => void
    handleDelete: (t: NewsTopics) => void
  }>()
</script>

<style scoped lang="less">
  .mobile-card {
    background: @neutral-100;
    border-radius: 10px;
    padding: 14px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 6px;
    cursor: pointer;
    transition:
      background 0.2s ease,
      transform 0.2s ease;

    &:hover {
      background: @neutral-200;
    }
    &:active {
      transform: scale(0.98);
    }
  }

  .top-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .thumb {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid @neutral-200;
    background: fade(@neutral-200, 40%);
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;

    .title {
      line-height: 1.2;
    }
  }

  .theme {
    margin-left: 66px; // aligné visuellement sous le titre après l’image
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .action-icon {
    opacity: 0.8;
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }
</style>
