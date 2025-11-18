<template>
  <div
    class="pagination"
    :class="`pagination--${props.size ?? 'medium'}`"
    v-if="nbPages > 1"
  >
    <BasicIcon
      name="arrow-left"
      active
      :class="{ 'arrow--disabled': currentPage === 1, arrow: true }"
      @click="prevPage"
      color="white"
    />
    <div
      v-for="page in pages"
      :key="page.num"
      :class="[
        'pagination__button',
        {
          'pagination__button--active': currentPage === page.num,
          pagination__ellipsis: page.type === 'ellipse',
        },
      ]"
      @click="goToPage(page)"
    >
      <BasicText :size="page.type === 'ellipse' ? 'body-s' : 'body-m'">
        {{ page.type === 'ellipse' ? '…' : page.num }}
      </BasicText>
    </div>
    <BasicIcon
      name="arrow-right"
      active
      :class="{ 'arrow--disabled': currentPage === nbPages, arrow: true }"
      @click="nextPage"
    />
    <BasicText
      v-if="nbResults && nbResults > 0"
      class="pagination__span"
      color="white"
    >
      {{ nbResults }} résultat{{ nbResults > 1 ? 's' : '' }}
    </BasicText>
  </div>
</template>

<script setup lang="ts">
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

<style lang="less">
  @import './BasicPagination.less';

  .arrow {
    cursor: pointer;
    &--disabled {
      opacity: 0.4;
      pointer-events: none;
    }
  }

  .pagination__button {
    cursor: pointer;
    user-select: none;
    transition: all 0.2s;
    padding: 4px 10px;
    border-radius: 6px;

    &--active {
      background: var(--primary-100);
      color: var(--primary-800);
      font-weight: 600;
    }

    &.pagination__ellipsis {
      pointer-events: none;
      opacity: 0.5;
    }

    &:hover:not(&--active):not(.pagination__ellipsis) {
      background: @neutral-100;
    }
  }
</style>
