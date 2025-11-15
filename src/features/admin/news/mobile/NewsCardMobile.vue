<template>
  <div
    class="mobile-card"
    @click="openNewsModal(article.id)"
  >
    <div class="header">
      <img
        :src="article.image || fallbackImage"
        alt="Aperçu"
        class="thumb"
      />

      <div class="content">
        <BasicText
          weight="bold"
          color="neutral-900"
          class="title"
        >
          {{ article.title }}
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
          @click="handleDelete(article)"
          class="action-icon"
        />
      </div>
    </div>

    <div class="footer">
      <BasicText
        size="body-s"
        color="neutral-600"
        class="theme"
      >
        {{ article.topic_label || '—' }}
      </BasicText>

      <BasicText
        size="body-s"
        color="neutral-500"
        class="date"
      >
        {{ article.published_at ? formatDate(article.published_at) : '—' }}
      </BasicText>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { News } from '@/supabase/types/supabase.types'
  import { formatDate } from '@/utils'

  defineProps<{
    article: News & { topic_label?: string | null }
    openNewsModal: (id: string) => void
    handleDelete: (article: News) => void
    fallbackImage: string
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
    gap: 8px;
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

  .header {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    position: relative;
  }

  .thumb {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid @neutral-200;
    background: rgba(var(--neutral-200-rgb), 0.40);
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .title {
    line-height: 1.2;
  }

  .actions {
    position: absolute;
    top: 0;
    right: 0;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2px;
  }

  .theme {
    color: @neutral-600;
  }

  .date {
    text-align: right;
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
