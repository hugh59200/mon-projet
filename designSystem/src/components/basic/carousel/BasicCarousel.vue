<template>
  <div class="basic-carousel">
    <!-- ⬅️ Bouton gauche -->
    <BasicButton
      v-if="showArrows"
      type="secondary"
      variant="filled"
      size="small"
      iconName="ArrowLeft"
      :disabled="scrollPosition === 0"
      class="nav-btn prev"
      @click="scrollLeft"
    />

    <!-- 🎠 Conteneur scrollable -->
    <div
      ref="carouselRef"
      class="carousel-container"
      @wheel.prevent="onWheel"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div
        class="carousel-track"
        :style="trackStyle"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="carousel-item"
          :style="itemStyle"
        >
          <slot
            name="item"
            :item="item"
          />
        </div>
      </div>
    </div>

    <!-- ➡️ Bouton droit -->
    <BasicButton
      v-if="showArrows"
      type="secondary"
      variant="filled"
      size="small"
      iconName="ArrowRight"
      :disabled="scrollMaxReached"
      class="nav-btn next"
      @click="scrollRight"
    />
  </div>
</template>

<script setup lang="ts">
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import { computed, nextTick, onMounted, ref } from 'vue'

  interface Props {
    items: any[]
    itemWidth?: number
    gap?: number
    showArrows?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    itemWidth: 280,
    gap: 20,
    showArrows: true,
  })

  const carouselRef = ref<HTMLDivElement | null>(null)
  const scrollPosition = ref(0)
  const isDragging = ref(false)
  const startX = ref(0)
  const scrollStart = ref(0)

  const trackStyle = computed(() => ({
    gap: `${props.gap}px`,
  }))

  const itemStyle = computed(() => ({
    flex: `0 0 ${props.itemWidth}px`,
  }))

  // --- Scroll horizontal via boutons
  const scrollLeft = () => {
    if (!carouselRef.value) return
    carouselRef.value.scrollBy({ left: -props.itemWidth - props.gap, behavior: 'smooth' })
    updateScrollPosition()
  }
  const scrollRight = () => {
    if (!carouselRef.value) return
    carouselRef.value.scrollBy({ left: props.itemWidth + props.gap, behavior: 'smooth' })
    updateScrollPosition()
  }

  const updateScrollPosition = () => {
    if (!carouselRef.value) return
    scrollPosition.value = carouselRef.value.scrollLeft
  }

  const scrollMaxReached = computed(() => {
    if (!carouselRef.value) return false
    const maxScroll = carouselRef.value.scrollWidth - carouselRef.value.clientWidth - 5
    return scrollPosition.value >= maxScroll
  })

  // --- Scroll à la molette
  const onWheel = (e: WheelEvent) => {
    if (!carouselRef.value) return
    carouselRef.value.scrollLeft += e.deltaY
    updateScrollPosition()
  }

  // --- Drag souris
  const onMouseDown = (e: MouseEvent) => {
    isDragging.value = true
    startX.value = e.pageX - (carouselRef.value?.offsetLeft ?? 0)
    scrollStart.value = carouselRef.value?.scrollLeft ?? 0
  }
  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.value || !carouselRef.value) return
    const x = e.pageX - carouselRef.value.offsetLeft
    const walk = x - startX.value
    carouselRef.value.scrollLeft = scrollStart.value - walk
    updateScrollPosition()
  }
  const onMouseUp = () => {
    isDragging.value = false
  }

  // --- Drag tactile
  const onTouchStart = (e: TouchEvent) => {
    isDragging.value = true
    startX.value = e.touches[0]!.pageX
    scrollStart.value = carouselRef.value?.scrollLeft ?? 0
  }
  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging.value || !carouselRef.value) return
    const x = e.touches[0]!.pageX
    const walk = x - startX.value
    carouselRef.value.scrollLeft = scrollStart.value - walk
    updateScrollPosition()
  }
  const onTouchEnd = () => {
    isDragging.value = false
  }

  onMounted(async () => {
    await nextTick()
    updateScrollPosition()
  })
</script>

<style scoped lang="less">
  .basic-carousel {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
  }

  .carousel-container {
    overflow-x: hidden;
    scroll-behavior: smooth;
    flex: 1;
    cursor: grab;
    user-select: none;
    padding: 6px 0;

    &:active {
      cursor: grabbing;
    }
  }

  .carousel-track {
    display: flex;
    transition: all 0.3s ease;
  }

  .carousel-item {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    transition: transform 0.25s ease;
    box-shadow: 0 3px 10px fade(@neutral-900, 5%);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px fade(@neutral-900, 10%);
    }
  }

  /* Position et ajustement des boutons */
  .nav-btn {
    flex-shrink: 0;
    z-index: 10;

    &.prev {
      margin-right: 12px;
    }

    &.next {
      margin-left: 12px;
    }
  }
</style>
