<template>
  <nav
    class="nav"
    :class="navClass"
  >
    <RouterLink
      v-for="item in sidebarItems"
      :key="item.path"
      :to="item.path"
      class="nav__link"
      :class="{ 'nav__link--active': $route.path === item.path }"
      @click="$emit('navigate')"
    >
      <!-- Icon (mobile/vertical only) -->
      <span
        v-if="showIcon"
        class="nav__icon"
      >
        <BasicIconNext
          :name="item.icon"
          :size="18"
        />
      </span>

      <!-- Label -->
      <span class="nav__label">{{ item.label }}</span>

      <!-- Active Indicator -->
      <span class="nav__indicator"></span>

      <!-- Hover Glow -->
      <span class="nav__glow"></span>
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
  const { isMobile } = useDeviceBreakpoint()

  const props = defineProps({
    direction: {
      type: String,
      default: 'row',
      validator: (value: string) => ['row', 'column'].includes(value),
    },
  })

  defineEmits(['navigate'])

  const showIcon = computed(() => isMobile.value || props.direction === 'column')
  const navClass = computed(() =>
    props.direction === 'column' ? 'nav--vertical' : 'nav--horizontal',
  )
</script>
<style scoped lang="less">
  @font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
  @font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
  @ease: cubic-bezier(0.4, 0, 0.2, 1);
  @bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  .nav {
    display: flex;
    align-items: center;

    // ==========================================
    // HORIZONTAL MODE (Desktop Navbar)
    // ==========================================
    &--horizontal {
      flex-direction: row;
      justify-content: center;
      gap: 4px;
      flex-wrap: nowrap;

      .nav__link {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border-radius: 10px;
        text-decoration: none;
        font-family: @font-body;
        font-size: 14px;
        font-weight: 500;
        color: @neutral-400;
        transition: all 0.25s @ease;
        overflow: hidden;
        white-space: nowrap;

        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.06) 0%,
            rgba(255, 255, 255, 0.02) 100%
          );
          opacity: 0;
          transition: opacity 0.25s @ease;
        }

        &:hover {
          color: @neutral-200;

          &::before {
            opacity: 1;
          }

          .nav__icon {
            color: var(--primary-400);
            transform: scale(1.1);
          }

          .nav__glow {
            opacity: 1;
          }
        }

        &--active {
          color: white;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.06);

          .nav__icon {
            color: var(--primary-400);
          }

          .nav__indicator {
            transform: scaleX(1);
            opacity: 1;
          }

          .nav__glow {
            opacity: 0.5;
          }
        }
      }

      .nav__indicator {
        position: absolute;
        bottom: 6px;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 20px;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-400), var(--primary-500));
        border-radius: 3px;
        opacity: 0;
        transform: scaleX(0);
        transform-origin: center;
        transition: all 0.3s @bounce;
      }

      // ========================================
      // RESPONSIVE - XL (> 1300px)
      // ========================================
      @media (min-width: 1301px) {
        gap: 6px;

        .nav__link {
          padding: 10px 18px;
          font-size: 14px;
        }
      }

      // ========================================
      // RESPONSIVE - L (1101-1300px)
      // ========================================
      @media (max-width: 1300px) and (min-width: 1101px) {
        gap: 4px;

        .nav__link {
          padding: 10px 14px;
          font-size: 13px;
        }
      }

      // ========================================
      // RESPONSIVE - M (1001-1100px)
      // ========================================
      @media (max-width: 1100px) and (min-width: 1001px) {
        gap: 2px;

        .nav__link {
          padding: 8px 10px;
          font-size: 12px;
        }
      }

      // ========================================
      // RESPONSIVE - S (751-1000px)
      // ========================================
      @media (max-width: 1000px) and (min-width: 751px) {
        gap: 0;

        .nav__link {
          padding: 8px 8px;
          font-size: 11px;
        }
      }
    }

    // ==========================================
    // VERTICAL MODE (Mobile Drawer / Sidebar)
    // ==========================================
    &--vertical {
      flex-direction: column;
      gap: 8px;
      width: 100%;

      .nav__link {
        position: relative;
        display: flex;
        align-items: center;
        gap: 14px;
        width: 100%;
        padding: 16px 20px;
        border-radius: 14px;
        text-decoration: none;
        font-family: @font-body;
        font-size: 15px;
        font-weight: 500;
        color: @neutral-400;
        background: transparent;
        border: 1px solid transparent;
        transition: all 0.25s @ease;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.04) 0%,
            rgba(255, 255, 255, 0.01) 100%
          );
          opacity: 0;
          transition: opacity 0.25s @ease;
        }

        &:hover {
          color: @neutral-200;
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.06);

          &::before {
            opacity: 1;
          }

          .nav__icon {
            color: var(--primary-400);
            transform: scale(1.1) rotate(-3deg);
          }
        }

        &--active {
          color: white;
          background: linear-gradient(
            135deg,
            rgba(var(--primary-500-rgb), 0.12) 0%,
            rgba(var(--primary-600-rgb), 0.08) 100%
          );
          border-color: rgba(var(--primary-500-rgb), 0.2);
          box-shadow:
            0 4px 16px rgba(var(--primary-500-rgb), 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);

          .nav__icon {
            color: var(--primary-400);
          }

          .nav__indicator {
            transform: translateY(-50%) scaleY(1);
            opacity: 1;
          }
        }
      }

      .nav__indicator {
        position: absolute;
        top: 50%;
        left: 0;
        right: auto;
        bottom: auto;
        margin: 0;
        transform: translateY(-50%) scaleY(0);
        width: 4px;
        height: 24px;
        background: linear-gradient(180deg, var(--primary-400), var(--primary-500));
        border-radius: 0 4px 4px 0;
        opacity: 0;
        transition: all 0.3s @bounce;
      }
    }

    // ==========================================
    // SHARED ELEMENTS
    // ==========================================
    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      color: @neutral-500;
      transition: all 0.25s @bounce;
      flex-shrink: 0;
    }

    &__label {
      white-space: nowrap;
      transition: color 0.25s @ease;
    }

    &__glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      background: radial-gradient(
        circle,
        rgba(var(--primary-500-rgb), 0.15) 0%,
        transparent 70%
      );
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s @ease;
    }
  }

  // ============================================
  // ANIMATIONS
  // ============================================
  @keyframes pulse-indicator {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(var(--primary-500-rgb), 0.4);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(var(--primary-500-rgb), 0);
    }
  }

  .nav__link--active .nav__indicator {
    animation: pulse-indicator 2s ease-in-out infinite;
  }
</style>