<template>
  <div class="admin-view">
    <PageHeader />

    <div class="admin-view__content">
      <WrapperForm
        v-model="selectedTab"
        :tabs="tabs"
        class="admin-tabs"
      >
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
      </WrapperForm>
    </div>
  </div>
</template>

<script setup lang="ts">
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import type { RouteName } from '@/router/route-name'
  import { useNavigationTabs } from '@designSystem/components/wrapper/form/useNavigationTabs'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { tabs, goToTab } = useNavigationTabs()

  const selectedTab = computed({
    get: () => route.name as RouteName,
    set: (routeName: RouteName) => goToTab(routeName),
  })
</script>

<style scoped lang="less">
  .admin-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

    &__content {
      flex: 1;
      min-height: 0; /* Important pour le scroll interne si WrapperForm le gère */
      display: flex;
      flex-direction: column;
    }
  }

  .admin-tabs {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    /* Petit ajustement pour que le WrapperForm s'intègre bien avec le Glassmorphism */
    :deep(.wrapper-form__header) {
      margin-bottom: 20px;
    }
  }

  @media (max-width: 768px) {
    .admin-view {
      padding: 10px;
    }
  }
</style>
