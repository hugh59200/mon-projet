<template>
  <nav
    v-if="isMobile && !isHidden"
    class="bottom-nav"
    :class="{ 'bottom-nav--hidden': isScrollingDown }"
  >
    <RouterLink
      v-for="item in navItems"
      :key="item.route"
      :to="item.route"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': isActive(item.route) }"
    >
      <div class="bottom-nav__icon">
        <BasicIconNext :name="item.icon" :size="22" />
        <span
          v-if="item.badge && item.badge > 0"
          class="bottom-nav__badge"
        >
          {{ item.badge > 99 ? '99+' : item.badge }}
        </span>
      </div>
      <span class="bottom-nav__label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
import { useDeviceBreakpoint } from '@/plugin/device-breakpoint/DeviceBreakpoint.types'
import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

type NavItem = {
  route: string
  icon: IconNameNext
  label: string
  badge?: number
}

const route = useRoute()
const cart = useCartStore()
const { isMobile } = useDeviceBreakpoint()

// Props pour masquer sur certaines pages
const props = defineProps<{
  hidden?: boolean
}>()

const isHidden = computed(() => props.hidden)

// Items de navigation
const navItems = computed<NavItem[]>(() => [
  {
    route: '/',
    icon: 'Home',
    label: 'Accueil',
  },
  {
    route: '/catalogue',
    icon: 'Search',
    label: 'Catalogue',
  },
  {
    route: '/panier',
    icon: 'ShoppingCart',
    label: 'Panier',
    badge: cart.totalItems,
  },
  {
    route: '/profil',
    icon: 'User',
    label: 'Profil',
  },
])

// Vérifier si la route est active
function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// Masquer au scroll vers le bas
const lastScrollY = ref(0)
const isScrollingDown = ref(false)

function handleScroll() {
  const currentScrollY = window.scrollY
  isScrollingDown.value = currentScrollY > lastScrollY.value && currentScrollY > 100
  lastScrollY.value = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="less">
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
  padding: 8px 0;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid @neutral-200;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &--hidden {
    transform: translateY(100%);
  }

  &__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 6px 12px;
    text-decoration: none;
    color: @neutral-500;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;

    &:active {
      transform: scale(0.92);
    }

    &--active {
      color: var(--primary-600);

      .bottom-nav__icon {
        background: rgba(var(--primary-500-rgb), 0.12);
      }

      .bottom-nav__label {
        font-weight: 600;
      }
    }
  }

  &__icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 32px;
    border-radius: 16px;
    transition: all 0.2s ease;
  }

  &__badge {
    position: absolute;
    top: -2px;
    right: 2px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    background: var(--primary-500);
    border-radius: 9px;
    font-family: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
    font-size: 11px;
    font-weight: 700;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(var(--primary-500-rgb), 0.4);
  }

  &__label {
    font-family: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2px;
  }
}

// Masquer sur desktop/tablet
@media (min-width: 721px) {
  .bottom-nav {
    display: none;
  }
}
</style>
