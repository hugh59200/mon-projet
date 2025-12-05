<template>
  <div class="admin-page">
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
  import PageContent from '@/features/shared/components/PageContent.vue'
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import type { RouteName } from '@/router/route-name'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useNavigationTabs } from './shared/composables/useNavigationTabs'

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
    // 🎨 CSS Variables - Contenu clair sur wrapper sombre
    // ═══════════════════════════════════════════════════════════════
    --admin-bg-card: @neutral-100;
    --admin-bg-card-hover: @neutral-200;
    --admin-bg-header: @neutral-50;
    --admin-border: @neutral-300;
    --admin-border-subtle: @neutral-200;
    --admin-text-primary: @neutral-800;
    --admin-text-secondary: @neutral-600;
    --admin-text-muted: @neutral-500;
    --admin-shadow: rgba(0, 0, 0, 0.08);
  }

  .admin-scroll {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .admin-wrapper {
    background: rgba(var(--secondary-900-rgb), 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.06);
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
      background: @neutral-100;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      padding: 6px;
      display: inline-flex;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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
