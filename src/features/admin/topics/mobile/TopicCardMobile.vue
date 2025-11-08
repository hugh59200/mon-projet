<template>
  <MobileCard hoverable>
    <!-- ✅ Titre -->
    <template #title>
      <div class="topic-header">
        <img
          v-if="topic.image"
          :src="topic.image"
          class="thumb"
          alt="image topic"
        />
        <div class="info">
          <div class="title">{{ topic.label }}</div>
          <div class="slug">#{{ topic.id }}</div>
        </div>
      </div>
    </template>

    <!-- ✅ Actions -->
    <template #actions>
      <BasicButton
        label="Modifier"
        type="secondary"
        size="small"
        variant="outlined"
        block
        @click="$emit('open', topic.id)"
      />

      <BasicButton
        label="Supprimer"
        type="danger"
        size="small"
        block
        @click="$emit('delete', topic)"
      />
    </template>
  </MobileCard>
</template>

<script setup lang="ts">
  import type { NewsTopics } from '@/supabase/types/supabase.types'
  import MobileCard from '../../mobile/MobileCard.vue'

  defineProps<{
    topic: NewsTopics
  }>()

  defineEmits(['open', 'delete'])
</script>

<style scoped lang="less">
  .topic-header {
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

    .slug {
      font-size: @font-size-body-s;
      color: @neutral-500;
    }
  }
</style>
