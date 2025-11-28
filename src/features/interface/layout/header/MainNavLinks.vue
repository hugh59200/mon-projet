<template>
  <nav
    class="main-nav"
    :class="directionClass"
  >
    <RouterLink
      v-for="item in sidebarItems"
      :key="item.path"
      :to="item.path"
      class="main-nav__link"
      :class="{ active: $route.path === item.path }"
      @click="$emit('navigate')"
    >
      <span
        v-if="showIcon"
        class="main-nav__icon"
      >
        <BasicIconNext
          :name="item.icon"
          :size="18"
        />
      </span>
      <span class="main-nav__label">{{ item.label }}</span>
      <span class="main-nav__indicator"></span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
  import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { BasicIconNext } from '@designSystem/components/basic/icon'
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'

  const { sidebarItems } = storeToRefs(useSidebarStore())
  const { isMobile, currentWindowsWidth } = useDeviceBreakpoint()

  const props = defineProps({ direction: { type: String, default: 'row' } })
  defineEmits(['navigate'])

  const showIcon = computed(() => isMobile.value)
  const isCompactMode = computed(() => currentWindowsWidth.value < 1200 && !isMobile.value)
  const directionClass = computed(() =>
    props.direction === 'column' ? 'main-nav--vertical' : 'main-nav--horizontal',
  )
</script>

<style scoped lang="less">
  @ease: cubic-bezier(0.16, 1, 0.3, 1);

  .main-nav {
    display: flex;
    align-items: center;

    &--horizontal {
      flex-direction: row;
      justify-content: center;
      gap: 4px;

      @media (max-width: 1200px) {
        gap: 2px;
      }
    }

    &--vertical {
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }

    &__link {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px;
      border-radius: 12px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      color: @neutral-300;
      transition: all 0.25s @ease;
      overflow: hidden;

      @media (max-width: 1200px) {
        padding: 8px 14px;
        font-size: 13px;
      }

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(var(--neutral-100-rgb), 0.04);
        opacity: 0;
        transition: opacity 0.25s;
      }

      &:hover {
        color: @neutral-100;

        &::before {
          opacity: 1;
        }

        .main-nav__icon {
          color: var(--primary-400);
        }
      }

      &.active {
        color: @neutral-50;
        background: rgba(var(--primary-500-rgb), 0.1);

        .main-nav__icon {
          color: var(--primary-400);
        }
        .main-nav__indicator {
          transform: scaleX(1);
        }
      }
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: @neutral-500;
      transition: color 0.25s;
    }

    &__label {
      white-space: nowrap;
    }

    &__indicator {
      position: absolute;
      bottom: 0;
      left: 16px;
      right: 16px;
      height: 2px;
      background: linear-gradient(90deg, var(--primary-400), var(--primary-500));
      border-radius: 2px 2px 0 0;
      transform: scaleX(0);
      transition: transform 0.3s @ease;
    }

    // Vertical mode
    &--vertical &__link {
      width: 100%;
      padding: 14px 18px;
      border-radius: 14px;

      &.active {
        background: rgba(var(--primary-500-rgb), 0.12);
        border: 1px solid rgba(var(--primary-500-rgb), 0.15);
      }
    }

    &--vertical &__indicator {
      display: none;
    }
  }
</style>
