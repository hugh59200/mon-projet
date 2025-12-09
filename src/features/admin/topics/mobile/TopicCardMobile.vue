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
        <button
          type="button"
          class="action-btn"
          @click="handleDelete(topic)"
        >
          <BasicIconNext
            name="Trash2"
            :size="18"
            color="danger-600"
          />
        </button>
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
    background: var(--admin-bg-card);
    border-radius: 10px;
    padding: 14px;
    box-shadow: 0 1px 3px var(--admin-shadow);
    display: flex;
    flex-direction: column;
    gap: 6px;
    cursor: pointer;
    transition:
      background 0.2s ease,
      transform 0.2s ease;

    &:hover {
      background: var(--admin-bg-card);
      border-color: var(--primary-300);
    }
    &:active {
      background: var(--admin-bg-card-hover);
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
    border: 1px solid var(--admin-border-subtle);
    background: var(--admin-bg-subtle);
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
    margin-left: 66px; // aligné visuellement sous le titre après l'image
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  // Zone tactile minimum 44px
  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    background: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease;
    margin: -8px -8px -8px 0;

    &:active {
      background: rgba(239, 68, 68, 0.1);
    }

    svg {
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }

    &:hover svg {
      opacity: 1;
    }
  }
</style>
