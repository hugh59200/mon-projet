<template>
  <div
    class="pagination"
    v-if="nbPages > 1"
  >
    <BasicIcon
      name="arrow-left"
      active
      :class="{ 'arrow--disabled': currentPage === 1, arrow: true }"
      @click="prevPage"
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
      <BasicText :size="page.num > 3 ? 'body-s' : 'body-m'">
        {{ page.type === 'ellipse' ? '...' : page.num }}
      </BasicText>
    </div>
    <BasicIcon
      name="arrow-right"
      active
      @click="nextPage"
      :class="{ 'arrow--disabled': currentPage === nbPages, arrow: true }"
    />
    <BasicText
      v-if="nbResults && nbResults > 0"
      class="pagination__span"
    >
      {{ nbResults }} résultats
    </BasicText>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    nbPages: number
    currentPage: number
    nbPagesMax: number
    nbResults?: number
  }>()

  const emit = defineEmits<{
    (e: 'change', page: number): void
  }>()

  const prevPage = function () {
    if (props.currentPage > 1) emit('change', props.currentPage - 1)
  }
  const nextPage = function () {
    if (props.currentPage < props.nbPages) emit('change', props.currentPage + 1)
  }

  const goToPage = function (page: Page) {
    if (page.type === 'ellipse') return
    if (page.num > 0 && page.num <= props.nbPages) emit('change', page.num)
  }

  type Page = { type: 'num' | 'ellipse'; num: number }

  const pages = computed(() => {
    let result = Array.from(Array(props.nbPages).keys()).map<Page>((index) => ({
      type: 'num',
      num: index + 1,
      key: index,
    }))
    if (props.nbPages <= props.nbPagesMax) return result

    const start = Math.min(
      Math.max(props.currentPage - props.nbPagesMax / 2, 0),
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
</script>

<style lang="less">
  @import './BasicPagination.less';
</style>
