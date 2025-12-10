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
        <!-- Wrapper avec ContentBlock -->
        <ContentBlock
          variant="card"
          size="lg"
          class="admin-wrapper"
        >
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
        </ContentBlock>
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
  @import '@designSystem/fondation/breakpoints/responsive-mixins.less';

  .admin-page {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .admin-scroll {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .admin-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .respond-mobile({
      gap: 16px;
    });

    &__nav {
      background: var(--bg-subtle);
      border: 1px solid var(--border-default);
      border-radius: 12px;
      padding: 6px;
      display: flex;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      max-width: 100%;

      // Masquer la scrollbar horizontale (scroll tactile reste fonctionnel)
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
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
