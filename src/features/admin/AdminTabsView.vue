<template>
  <div
    class="admin-page"
    :class="`admin-page--${theme}`"
  >
    <PageHeader />

    <div
      ref="contentRef"
      class="admin-scroll scrollbar"
    >
      <PageContent
        size="xl"
        padding="lg"
      >
        <!-- Wrapper sombre -->
        <div class="admin-wrapper">
          <!-- Onglets -->
          <div class="admin-wrapper__nav">
            <BasicTabs
              v-model="selectedTab"
              :tabs="tabs"
            />
          </div>

          <!-- Contenu -->
          <router-view v-slot="{ Component }">
            <transition
              name="fade-slide"
              mode="out-in"
              appear
            >
              <keep-alive include="Actualites">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </PageContent>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTheme } from '@/composables/useTheme'
  import PageContent from '@/features/shared/components/PageContent.vue'
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import type { RouteName } from '@/router/route-name'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useNavigationTabs } from './shared/composables/useNavigationTabs'

  const { theme } = useTheme()
  const route = useRoute()
  const { tabs, goToTab } = useNavigationTabs()
  const contentRef = ref<HTMLElement | null>(null)

  const selectedTab = computed({
    get: () => route.name as RouteName,
    set: (routeName: RouteName) => goToTab(routeName),
  })

  // Scroll to top on tab change
  watch(selectedTab, () => {
    requestAnimationFrame(() => contentRef.value?.scrollTo({ top: 0, behavior: 'smooth' }))
  })
</script>

<style scoped lang="less">
  .admin-page {
    display: flex;
    flex-direction: column;
    flex: 1;

    // ═══════════════════════════════════════════════════════════════
    // 🎨 CSS Variables Admin - Light Theme
    // ═══════════════════════════════════════════════════════════════
    &--light {
      // Wrapper (reste sombre en light)
      --admin-wrapper-bg: rgba(var(--secondary-900-rgb), 0.95);
      --admin-wrapper-border: rgba(255, 255, 255, 0.06);

      // Surfaces
      --admin-bg-card: @neutral-100;
      --admin-bg-card-hover: @neutral-50;
      --admin-bg-header: @neutral-50;
      --admin-bg-surface: @white;
      --admin-bg-subtle: @neutral-50;
      --admin-bg-input: @white;

      // Texte
      --admin-text-primary: @neutral-800;
      --admin-text-secondary: @neutral-600;
      --admin-text-muted: @neutral-500;
      --admin-text-inverse: @white;

      // Bordures
      --admin-border: @neutral-300;
      --admin-border-subtle: @neutral-200;

      // Ombres
      --admin-shadow: rgba(0, 0, 0, 0.08);
      --admin-shadow-hover: rgba(0, 0, 0, 0.12);

      // Nav tabs
      --admin-nav-bg: @neutral-100;
      --admin-nav-border: @neutral-200;
    }

    // ═══════════════════════════════════════════════════════════════
    // 🌙 CSS Variables Admin - Dark Theme
    // ═══════════════════════════════════════════════════════════════
    &--dark {
      // Wrapper (encore plus sombre en dark)
      --admin-wrapper-bg: rgba(0, 0, 0, 0.6);
      --admin-wrapper-border: rgba(255, 255, 255, 0.08);

      // Surfaces
      --admin-bg-card: var(--secondary-800);
      --admin-bg-card-hover: var(--secondary-700);
      --admin-bg-header: var(--secondary-900);
      --admin-bg-surface: var(--secondary-800);
      --admin-bg-subtle: var(--secondary-900);
      --admin-bg-input: var(--secondary-900);

      // Texte
      --admin-text-primary: @neutral-100;
      --admin-text-secondary: @neutral-300;
      --admin-text-muted: @neutral-400;
      --admin-text-inverse: @neutral-900;

      // Bordures
      --admin-border: rgba(255, 255, 255, 0.12);
      --admin-border-subtle: rgba(255, 255, 255, 0.08);

      // Ombres
      --admin-shadow: rgba(0, 0, 0, 0.3);
      --admin-shadow-hover: rgba(0, 0, 0, 0.4);

      // Nav tabs
      --admin-nav-bg: var(--secondary-800);
      --admin-nav-border: rgba(255, 255, 255, 0.1);
    }
  }

  .admin-scroll {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .admin-wrapper {
    background: var(--admin-wrapper-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--admin-wrapper-border);
    border-radius: 20px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    // Mobile (≤ 720px)
    .respond-mobile({
      padding: 12px;
      border-radius: 14px;
      gap: 16px;
    });

    &__nav {
      background: var(--admin-nav-bg);
      border: 1px solid var(--admin-nav-border);
      border-radius: 12px;
      padding: 6px;
      display: inline-flex;
      box-shadow: 0 2px 8px var(--admin-shadow);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;

      // Mobile : scroll horizontal pour les tabs
      .respond-mobile({
        width: 100%;
        scrollbar-width: none;
        &::-webkit-scrollbar {
          display: none;
        }
      });
    }
  }

  // Transitions
  .fade-slide-enter-active {
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fade-slide-leave-active {
    transition: all 0.2s ease;
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(12px);
  }

  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }
</style>
