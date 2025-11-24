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
      color="white"
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
  .pagination {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .arrow {
    cursor: pointer;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;

    &--disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    &:hover:not(.arrow--disabled) {
      opacity: 0.8;
    }
  }

  .pagination__button {
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;

    /* Design Carré/Rond propre */
    min-width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;

    /* Style par défaut (Inactif) */
    color: @neutral-300;
    border: 1px solid transparent;

    &--active {
      /* Style Actif (Primaire) */
      background: var(--primary-600);
      color: white;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      border-color: var(--primary-500);
    }

    &.pagination__ellipsis {
      pointer-events: none;
      opacity: 0.5;
      color: @neutral-500;
    }

    /* Hover sur inactif */
    &:hover:not(&--active):not(.pagination__ellipsis) {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }

  .pagination__span {
    margin-left: 12px;
    font-size: 0.9rem;
    opacity: 0.7;

    @media (max-width: 600px) {
      display: none;
    }
  }
</style>
