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
        <button
          type="button"
          class="action-btn"
          @click="handleDelete(article)"
        >
          <BasicIconNext
            name="Trash2"
            :size="18"
            color="danger-600"
          />
        </button>
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
    background: var(--content-block-bg-subtle);
    border-radius: 10px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    cursor: pointer;
    transition:
      background 0.2s ease,
      transform 0.2s ease;

    &:hover {
      border-color: var(--primary-300);
    }
    &:active {
      background: rgba(var(--primary-500-rgb), 0.08);
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
    border: 1px solid var(--content-block-border);
    background: var(--content-block-bg-subtle);
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
    color: var(--content-block-text-secondary);
  }

  .date {
    text-align: right;
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
