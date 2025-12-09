<template>
  <div
    class="mobile-card"
    @click="openTermModal(term.id)"
  >
    <div class="header">
      <div class="icon">
        <BasicIconNext name="BookOpen" :size="20" />
      </div>

      <div class="content">
        <BasicText
          weight="bold"
          color="neutral-900"
          class="title"
        >
          {{ term.term }}
        </BasicText>
        <span
          :class="[
            'status',
            `status--${term.status}`
          ]"
        >
          {{ term.status === 'published' ? 'Publié' : 'Brouillon' }}
        </span>
      </div>

      <div
        class="actions"
        @click.stop
      >
        <button
          type="button"
          class="action-btn"
          @click="handleDelete(term)"
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
        class="products"
      >
        {{ (term.related_product_ids?.length || 0) }} produit(s) lié(s)
      </BasicText>

      <BasicText
        size="body-s"
        color="neutral-500"
        class="date"
      >
        {{ formatDate(term.created_at) }}
      </BasicText>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GlossaryTerms } from '@/supabase/types/supabase.types'
import { formatDate } from '@/utils'

defineProps<{
  term: GlossaryTerms
  openTermModal: (id: string) => void
  handleDelete: (term: GlossaryTerms) => void
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
  gap: 8px;
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

.header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  position: relative;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(var(--primary-500-rgb), 0.1);
  border-radius: 8px;
  color: var(--primary-600);
  flex-shrink: 0;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  line-height: 1.2;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  width: fit-content;

  &--published {
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
  }

  &--draft {
    background: rgba(245, 158, 11, 0.1);
    color: #d97706;
  }
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

.products {
  color: var(--admin-text-secondary);
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
