<template>
  <div
    class="pagination"
    :class="`pagination--${props.size ?? 'medium'}`"
    v-if="nbPages > 1"
  >
    <button
      class="pagination__arrow"
      :class="{ 'pagination__arrow--disabled': currentPage === 1 }"
      :disabled="currentPage === 1"
      @click="prevPage"
    >
      <BasicIconNext name="ChevronLeft" :size="16" />
    </button>

    <div class="pagination__pages">
      <button
        v-for="page in pages"
        :key="page.num"
        :class="[
          'pagination__btn',
          {
            'pagination__btn--active': currentPage === page.num,
            'pagination__btn--ellipsis': page.type === 'ellipse',
          },
        ]"
        :disabled="page.type === 'ellipse'"
        @click="goToPage(page)"
      >
        {{ page.type === 'ellipse' ? '…' : page.num }}
      </button>
    </div>

    <button
      class="pagination__arrow"
      :class="{ 'pagination__arrow--disabled': currentPage === nbPages }"
      :disabled="currentPage === nbPages"
      @click="nextPage"
    >
      <BasicIconNext name="ChevronRight" :size="16" />
    </button>

    <span
      v-if="nbResults && nbResults > 0"
      class="pagination__results"
    >
      {{ nbResults }} résultat{{ nbResults > 1 ? 's' : '' }}
    </span>
  </div>
</template>

<script setup lang="ts">
  import BasicIconNext from '../icon/BasicIconNext.vue'
  import { computed, watch } from 'vue'

  interface Page {
    type: 'num' | 'ellipse'
    num: number
  }

  const props = defineProps<{
    nbPages: number
    currentPage: number
    nbPagesMax: number
    nbResults?: number
    autoFetch?: () => Promise<void>
    size?: 'small' | 'medium' | 'large'
  }>()

  const emit = defineEmits<{
    (e: 'change', page: number): void
  }>()

  const prevPage = () => {
    if (props.currentPage > 1) emit('change', props.currentPage - 1)
  }

  const nextPage = () => {
    if (props.currentPage < props.nbPages) emit('change', props.currentPage + 1)
  }

  const goToPage = (page: Page) => {
    if (page.type === 'ellipse') return
    if (page.num > 0 && page.num <= props.nbPages) emit('change', page.num)
  }

  const pages = computed(() => {
    let result = Array.from(Array(props.nbPages).keys()).map<Page>((index) => ({
      type: 'num',
      num: index + 1,
    }))

    if (props.nbPages <= props.nbPagesMax) return result

    const start = Math.min(
      Math.max(props.currentPage - Math.floor(props.nbPagesMax / 2), 0),
      props.nbPages - props.nbPagesMax,
    )

    result = [...result.splice(start, props.nbPagesMax)]

    if (props.currentPage > props.nbPagesMax / 2) {
      result[0] = { type: 'num', num: 1 }
      result[1] = { type: 'ellipse', num: Number.MIN_VALUE }
    }

    if (props.currentPage < props.nbPages - props.nbPagesMax / 2) {
      result[props.nbPagesMax - 1] = { type: 'num', num: props.nbPages }
      result[props.nbPagesMax - 2] = { type: 'ellipse', num: Number.MAX_VALUE }
    }

    return result
  })

  watch(
    () => props.currentPage,
    async () => {
      if (props.autoFetch) await props.autoFetch()
    },
  )
</script>

<style lang="less" scoped>
  .pagination {
    display: flex;
    align-items: center;
    gap: 4px;

    // ════════════════════════════════════════
    // Sizes
    // ════════════════════════════════════════
    &--small {
      .pagination__arrow,
      .pagination__btn {
        min-width: 28px;
        height: 28px;
        font-size: 12px;
      }
      .pagination__results {
        font-size: 11px;
      }
    }

    &--medium {
      .pagination__arrow,
      .pagination__btn {
        min-width: 34px;
        height: 34px;
        font-size: 13px;
      }
    }

    &--large {
      .pagination__arrow,
      .pagination__btn {
        min-width: 40px;
        height: 40px;
        font-size: 14px;
      }
    }

    // ════════════════════════════════════════
    // Arrow buttons
    // ════════════════════════════════════════
    &__arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      background: @neutral-200;
      color: @neutral-700;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover:not(:disabled) {
        background: @neutral-300;
        color: @neutral-900;
      }

      &--disabled,
      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    // ════════════════════════════════════════
    // Pages container
    // ════════════════════════════════════════
    &__pages {
      display: flex;
      align-items: center;
      gap: 2px;
      background: @neutral-200;
      border-radius: 8px;
      padding: 3px;
    }

    // ════════════════════════════════════════
    // Page buttons
    // ════════════════════════════════════════
    &__btn {
      min-width: 32px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: @neutral-600;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;

      &:hover:not(:disabled):not(&--active) {
        background: @neutral-300;
        color: @neutral-800;
      }

      &--active {
        background: var(--primary-500);
        color: white;
        box-shadow: 0 2px 6px rgba(var(--primary-500-rgb), 0.3);
      }

      &--ellipsis {
        cursor: default;
        color: @neutral-400;
        min-width: 24px;

        &:hover {
          background: transparent;
        }
      }
    }

    // ════════════════════════════════════════
    // Results count
    // ════════════════════════════════════════
    &__results {
      margin-left: 12px;
      font-size: 12px;
      font-weight: 500;
      color: @neutral-500;
      white-space: nowrap;

      @media (max-width: 600px) {
        display: none;
      }
    }
  }
</style>
