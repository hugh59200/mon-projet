<template>
  <div class="tabs-wrapper">
    <Transition name="fade">
      <div
        class="tabs"
        :class="[`tabs--${tabsPlacement}`, { 'tabs--mobile': isMobile }]"
        ref="tabsContainer"
      >
        <!-- 🔹 Onglets -->
        <BasicTab
          v-for="tab in tabs"
          :key="tab.routeName"
          v-model="modelValue"
          :tabKey="tab.tabKey"
          :tabState="tab.tabState"
          :routeName="tab.routeName"
          :color="tab.color"
          class="tabs__item"
        >
          <template #tab-text>
            {{ tab.tabKey }}
          </template>
        </BasicTab>

        <!-- ✅ Indicateur animé (desktop uniquement) -->
        <div
          v-if="!isMobile"
          class="tabs__indicator"
          :style="indicatorStyle"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { DEVICE_BREAKPOINT } from '@/plugin/device-breakpoint'
  import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
  import type { TabProps } from '../tab/BasicTab.types'
  import type { TabsModel } from './BasicTabs.types'

  const props = defineProps<{
    tabs?: TabProps[]
    tabsPlacement?: 'center' | 'start'
  }>()

  const modelValue = defineModel<TabsModel>()

  const { isMobile } = inject(DEVICE_BREAKPOINT)!
  const tabsContainer = ref<HTMLElement | null>(null)
  const indicatorLeft = ref(0)
  const indicatorWidth = ref(0)

  /* 🎯 Met à jour la position de l’indicateur */
  const updateIndicator = () => {
    if (!tabsContainer.value) return
    const activeTab = tabsContainer.value.querySelector('.tab--selected') as HTMLElement | null
    if (activeTab) {
      const scrollLeft = tabsContainer.value.scrollLeft
      indicatorLeft.value = activeTab.offsetLeft - scrollLeft
      indicatorWidth.value = activeTab.offsetWidth
    }
  }

  /* 🧭 Watch automatique */
  watch(modelValue, async () => {
    await nextTick()
    updateIndicator()
  })

  /* 🧭 Watch isMobile pour recalcul et recentrage */
  watch(isMobile, (newVal, oldVal) => {
    if (!tabsContainer.value) return

    const el = tabsContainer.value
    if (!newVal && oldVal) {
      // quand on repasse desktop → ajoute la classe de sortie
      el.classList.add('leaving')
      setTimeout(() => el.classList.remove('leaving'), 300)
    }
  })

  onMounted(() => {
    nextTick(updateIndicator)
    window.addEventListener('resize', updateIndicator)
    tabsContainer.value?.addEventListener('scroll', updateIndicator)
  })

  /* 💅 Couleur dynamique */
  const activeColor = computed(() => {
    const active = props.tabs?.find(
      (t) => t.routeName === modelValue.value || t.tabKey === modelValue.value,
    )
    return active?.color || '#0EA5E9'
  })

  const indicatorStyle = computed(() => ({
    transform: `translateX(${indicatorLeft.value}px)`,
    width: `${indicatorWidth.value}px`,
    backgroundColor: activeColor.value,
  }))
</script>

<style lang="less">
  .tabs-wrapper {
    position: relative;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    white-space: nowrap;
    scrollbar-width: thin;
    scrollbar-color: fade(@neutral-700, 30%) transparent;

    &::-webkit-scrollbar {
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: fade(@neutral-700, 30%);
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  .tabs {
    display: inline-flex;
    position: relative;
    gap: 8px;
    padding-bottom: 6px;
    justify-content: center;
    transition: all 0.25s ease;

    &--start {
      justify-content: flex-start;
    }

    .tab {
      flex: none;
      white-space: nowrap;
      min-width: 120px;
    }

    &__indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      border-radius: 3px;
      transition:
        transform 0.3s ease,
        width 0.3s ease,
        background-color 0.3s ease;
    }

    /* ✅ Mode mobile */
    &--mobile {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 0;
      border-radius: 12px;
      box-shadow: 0 2px 6px fade(@neutral-800, 12%);
      margin: 0 auto 12px auto;
      overflow: hidden;
      background: @white;
      height: fit-content;
      min-height: 54px;
      transition: all 0.25s ease;
      animation: fadeSlideInBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; /* 🎯 rebond doux */

      .tab {
        display: none;
      }

      .tab--selected {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-weight: 600;
        font-size: 1.1rem;
        line-height: 1.4;
        color: @primary-700;
        text-align: center;
        padding: 10px 22px;
        border-radius: 12px;
        background: fade(@primary-50, 45%);
        box-shadow: inset 0 1px 3px fade(@primary-500, 12%);
        transition:
          transform 0.18s ease,
          box-shadow 0.18s ease,
          background 0.25s ease,
          color 0.25s ease,
          opacity 0.18s ease;

        &:active {
          transform: scale(0.95);
          opacity: 0.75;
          box-shadow: 0 0 8px fade(@primary-400, 40%);
          background: fade(@primary-100, 60%);
        }
      }

      .tab--selected .tab__icon {
        transform: scale(1.15);
        opacity: 1;
        transition:
          transform 0.25s ease,
          opacity 0.25s ease;
      }

      .tab--selected:active .tab__icon {
        transform: scale(1.05);
        opacity: 0.7;
      }

      .tabs__indicator {
        display: none;
      }

      &.leaving {
        animation: fadeSlideOut 0.3s ease both;
      }
    }

    /* ✨ Apparition avec rebond (easeOutBack) */
    @keyframes fadeSlideInBounce {
      0% {
        opacity: 0;
        transform: translateY(-16px) scale(0.98);
      }
      60% {
        opacity: 1;
        transform: translateY(4px) scale(1.02);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* 💨 Disparition fluide */
    @keyframes fadeSlideOut {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateY(-6px) scale(0.98);
      }
    }
  }

  /* 🌈 Transition entre mobile / desktop */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
