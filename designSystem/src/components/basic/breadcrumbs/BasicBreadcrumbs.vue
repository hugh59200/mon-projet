<template>
  <transition name="breadcrumb-fade-slide">
    <nav
      v-show="shouldDisplay && visible"
      ref="container"
      class="breadcrumb sticky-top"
      :class="{
        'breadcrumb--compact': isMobile && !expanded,
        'breadcrumb--scrollable': true,
      }"
    >
      <!-- MODE COMPACT (MOBILE) -->
      <button
        v-if="isMobile && !expanded"
        class="breadcrumb__back"
        @click="goBack"
      >
        <BasicIconNext
          name="ArrowLeft"
          :size="18"
        />
        <span>Retour</span>
      </button>

      <!-- MODE ÉTENDU -->
      <div
        v-else
        ref="scrollArea"
        class="breadcrumb__full"
        @click="toggleExpandMobile"
      >
        <!-- HOME -->
        <BasicLink
          to="/"
          label="Accueil"
          iconName="Home"
          state="icon-left"
          type="secondary"
          size="small"
        />

        <template
          v-for="(crumb, i) in crumbs"
          :key="i"
        >
          <BasicIconNext
            name="ChevronRight"
            :size="14"
            class="breadcrumb__separator"
            color="neutral-500"
          />

          <BasicLink
            v-if="crumb.to"
            :to="crumb.to"
            :label="crumb.label"
            :iconName="crumb.icon as IconName"
            type="secondary"
            size="small"
            state="icon-left"
            class="breadcrumb__link"
          />

          <span
            v-else
            class="breadcrumb__current"
          >
            <BasicIconNext
              v-if="crumb.icon"
              :name="crumb.icon"
              :size="14"
              color="neutral-700"
            />
            {{ crumb.label }}
          </span>
        </template>
      </div>

      <!-- FADE -->
      <div
        class="breadcrumb__fade breadcrumb__fade--left"
        v-if="showFadeLeft"
      ></div>
      <div
        class="breadcrumb__fade breadcrumb__fade--right"
        v-if="showFadeRight"
      ></div>
    </nav>
  </transition>
</template>

<script setup lang="ts">
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicLink from '@designSystem/components/basic/link/BasicLink.vue'
  import type { IconName } from '@designSystem/fondation/icons/iconsList'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useBreadcrumb } from './useBreadcrumb'

  const route = useRoute()
  const router = useRouter()
  const { crumbs } = useBreadcrumb()
  const { isMobile } = useDeviceBreakpoint()

  /* ⭐ Hide on HOME */
  const shouldDisplay = computed(() => route.path !== '/')

  /* MOBILE expanded mode */
  const expanded = ref(false)
  const toggleExpandMobile = () => {
    if (isMobile.value) expanded.value = !expanded.value
  }

  /* BACK button */
  const goBack = () => {
    if (window.history.length > 1) router.back()
    else router.push('/')
  }

  /* AUTO-HIDE ON SCROLL */
  const visible = ref(true)
  let lastScroll = 0

  const handleScroll = () => {
    const y = window.scrollY
    visible.value = y < lastScroll || y < 20
    lastScroll = y
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  /* Horizontal fade logic */
  const scrollArea = ref<HTMLElement | null>(null)
  const showFadeLeft = ref(false)
  const showFadeRight = ref(false)

  const updateFades = () => {
    if (!scrollArea.value) return
    const el = scrollArea.value
    showFadeLeft.value = el.scrollLeft > 10
    showFadeRight.value = el.scrollWidth - el.clientWidth - el.scrollLeft > 10
  }

  onMounted(() => {
    scrollArea.value?.addEventListener('scroll', updateFades)
    setTimeout(updateFades, 150)
  })

  watch(
    () => crumbs.value,
    () => {
      expanded.value = false
      setTimeout(updateFades, 150)
    },
  )
</script>

<style scoped lang="less">
  .breadcrumb {
    display: flex;
    align-items: center;
    padding: 8px 6px;
    background: @white;
    position: sticky;
    top: 0;
    z-index: 30;
    border-bottom: 1px solid @neutral-200;
    box-shadow: 0 2px 4px fade(@black, 5%);
    overflow: hidden;
    animation: fadeIn 0.3s ease forwards;
  }

  /* FULL MODE */
  .breadcrumb__full {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  /* COMPACT MODE */
  .breadcrumb--compact {
    padding-left: 4px;
  }

  .breadcrumb__back {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    color: @neutral-800;
    font-size: 0.9rem;
    font-weight: 500;

    &:hover {
      opacity: 0.8;
    }
  }

  /* CURRENT */
  .breadcrumb__current {
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* SEPARATOR */
  .breadcrumb__separator {
    opacity: 0.6;
  }

  /* FADE SHADOWS */
  .breadcrumb__fade {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 28px;
    pointer-events: none;

    &--left {
      left: 0;
      background: linear-gradient(to right, @white, transparent);
    }
    &--right {
      right: 0;
      background: linear-gradient(to left, @white, transparent);
    }
  }

  /* TRANSITIONS */
  .breadcrumb-fade-slide-enter-active,
  .breadcrumb-fade-slide-leave-active {
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
  }
  .breadcrumb-fade-slide-enter-from,
  .breadcrumb-fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
