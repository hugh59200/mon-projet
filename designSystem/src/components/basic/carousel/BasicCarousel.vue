<template>
  <div class="basic-carousel">
    <BasicButton
      v-if="showArrows"
      type="secondary"
      variant="filled"
      size="small"
      iconName="ArrowLeft"
      :disabled="scrollPosition <= 1"
      class="nav-btn prev"
      @click="scrollLeft"
      aria-label="Défiler à gauche"
    />

    <div
      ref="carouselRef"
      class="carousel-container"
      @wheel.prevent="onWheel"
      @mousedown="handleDragStart"
      @mousemove="handleDragMove"
      @mouseup="handleDragEnd"
      @mouseleave="handleDragEnd"
      @touchstart="handleDragStart"
      @touchmove="handleDragMove"
      @touchend="handleDragEnd"
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

    <BasicButton
      v-if="showArrows"
      type="secondary"
      variant="filled"
      size="small"
      iconName="ArrowRight"
      :disabled="scrollMaxReached"
      class="nav-btn next"
      @click="scrollRight"
      aria-label="Défiler à droite"
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

  const SCROLL_TOLERANCE = 2 // Petite tolérance pour les erreurs d'arrondi des navigateurs

  const trackStyle = computed(() => ({
    gap: `${props.gap}px`,
  }))

  const itemStyle = computed(() => ({
    flex: `0 0 ${props.itemWidth}px`,
  }))

  // --- Mise à jour de la position de défilement

  const updateScrollPosition = () => {
    if (!carouselRef.value) return
    // Utiliser Math.round pour gérer la position en pixels de manière cohérente
    scrollPosition.value = Math.round(carouselRef.value.scrollLeft)
  }

  // --- Défilement via boutons
  const scrollByAmount = computed(() => props.itemWidth + props.gap)

  const scrollLeft = () => {
    if (!carouselRef.value) return
    carouselRef.value.scrollBy({ left: -scrollByAmount.value, behavior: 'smooth' })
    // La position sera mise à jour par l'écouteur de scroll (meilleure pratique)
  }

  const scrollRight = () => {
    if (!carouselRef.value) return
    carouselRef.value.scrollBy({ left: scrollByAmount.value, behavior: 'smooth' })
    // La position sera mise à jour par l'écouteur de scroll (meilleure pratique)
  }

  const scrollMaxReached = computed(() => {
    if (!carouselRef.value) return false

    // Calcul de la distance maximale que l'on peut scroller
    const maxScroll = carouselRef.value.scrollWidth - carouselRef.value.clientWidth

    // Vérifie si la position actuelle est très proche ou égale à la fin
    return scrollPosition.value >= maxScroll - SCROLL_TOLERANCE
  })

  // --- Logique unifiée Drag/Touch
  type DragEvent = MouseEvent | TouchEvent

  const getClientX = (e: DragEvent): number => {
    return e instanceof TouchEvent ? (e.touches[0]?.pageX ?? 0) : e.pageX
  }

  const handleDragStart = (e: DragEvent) => {
    e.preventDefault()
    if (!carouselRef.value) return

    isDragging.value = true

    // Pour les événements souris, il faut prendre en compte le décalage initial
    if (e instanceof MouseEvent) {
      startX.value = getClientX(e) - (carouselRef.value?.offsetLeft ?? 0)
    } else {
      startX.value = getClientX(e)
    }
    scrollStart.value = carouselRef.value?.scrollLeft ?? 0
  }

  const handleDragMove = (e: DragEvent) => {
    if (!isDragging.value || !carouselRef.value) return

    const clientX = getClientX(e)
    let walk: number

    // Ajustement de la marche en fonction du type d'événement
    if (e instanceof MouseEvent) {
      const x = clientX - carouselRef.value.offsetLeft
      walk = x - startX.value
    } else {
      walk = clientX - startX.value
    }

    carouselRef.value.scrollLeft = scrollStart.value - walk
    updateScrollPosition()
  }

  const handleDragEnd = () => {
    isDragging.value = false
  }

  // --- Scroll molette
  const onWheel = (e: WheelEvent) => {
    if (!carouselRef.value) return
    carouselRef.value.scrollLeft += e.deltaY * 0.7 // Ralentir légèrement la molette pour le contrôle
    updateScrollPosition()
  }

  onMounted(async () => {
    await nextTick()
    updateScrollPosition()

    // Écouter l'événement 'scroll' natif pour une mise à jour précise et continue
    carouselRef.value?.addEventListener('scroll', updateScrollPosition)
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
    box-shadow: 0 4px 16px color-mix(in srgb, @neutral-900 8%, transparent);
    background: transparent;

    &:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 8px 20px color-mix(in srgb, @neutral-900 12%, transparent);
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
