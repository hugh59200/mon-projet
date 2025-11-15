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
          :class="{ solid: !transparentItems }"
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
    transparentItems?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    itemWidth: 320,
    gap: 28,
    showArrows: true,
    transparentItems: true,
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

  // --- Défilement via boutons
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

  // --- Scroll molette + drag souris/tactile
  const onWheel = (e: WheelEvent) => {
    if (!carouselRef.value) return
    carouselRef.value.scrollLeft += e.deltaY
    updateScrollPosition()
  }

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
    overflow: hidden;
  }

  .carousel-container {
    overflow-x: hidden;
    scroll-behavior: smooth;
    flex: 1;
    cursor: grab;
    user-select: none;
    padding: 8px 0;

    &:active {
      cursor: grabbing;
    }
  }

  .carousel-track {
    display: flex;
    transition: transform 0.3s ease;
  }

  .carousel-item {
    border-radius: 18px;
    overflow: hidden;
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease;
    box-shadow: 0 4px 16px rgba(var(--neutral-900-rgb), 0.08);
    background: transparent;

    &:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 8px 20px rgba(var(--neutral-900-rgb), 0.12);
    }

    &.solid {
      background: white;
    }
  }

  /* Navigation */
  .nav-btn {
    flex-shrink: 0;
    z-index: 10;
    transition: transform 0.2s ease;

    &.prev {
      margin-right: 16px;
    }

    &.next {
      margin-left: 16px;
    }

    &:hover {
      transform: scale(1.05);
    }
  }
</style>
