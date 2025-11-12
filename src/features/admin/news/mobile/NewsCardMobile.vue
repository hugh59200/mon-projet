<template>
  <MobileCard hoverable>
    <template #title>
      <div class="news-header">
        <img
          :src="article.image || fallbackImage"
          class="thumb"
          alt=""
        />
        <div class="info">
          <div class="title">{{ article.title }}</div>
          <div class="date">
            Publié le {{ new Date(article.published_at!).toLocaleDateString() }}
          </div>
        </div>
      </div>
    </template>
    <template #info>
      <p class="excerpt">{{ article.excerpt || '—' }}</p>
    </template>
    <template #actions>
      <BasicButton
        label="Voir / Modifier"
        type="secondary"
        size="small"
        variant="outlined"
        block
        @click="$emit('open', article.id)"
      />
      <BasicButton
        v-if="!readonly"
        label="Supprimer"
        type="danger"
        size="small"
        block
        @click="$emit('delete', article)"
      />
    </template>
  </MobileCard>
</template>

<script setup lang="ts">
  import type { News } from '@/supabase/types/supabase.types'
  import MobileCard from '../../mobile/MobileCard.vue'

  defineProps<{
    article: News
    fallbackImage: string
    readonly?: boolean
  }>()

  defineEmits(['open', 'delete'])
</script>

<style scoped lang="less">
  .news-header {
    display: flex;
    gap: 12px;
    align-items: center;

    .thumb {
      width: 56px;
      height: 56px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid @neutral-200;
    }

    .title {
      font-weight: 600;
      color: @primary-950;
    }

    .date {
      font-size: @font-size-body-s;
      color: @neutral-500;
    }
  }

  .excerpt {
    font-size: @font-size-body-m;
    color: @neutral-700;
  }
</style>
