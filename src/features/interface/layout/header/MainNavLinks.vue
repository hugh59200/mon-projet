<template>
  <nav
    class="main-nav"
    :class="directionClass"
  >
    <RouterLink
      v-for="item in sidebarItems"
      :key="item.path"
      :to="item.path"
      class="main-nav__item"
    >
      <NavButton
        :label="item.label"
        :iconName="showIcon ? item.icon : undefined"
        :active="$route.path === item.path"
        variant="reverse"
        size="medium"
        @click="$emit('navigate')"
      />
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
  import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'

  const { sidebarItems } = storeToRefs(useSidebarStore())
  const { isDesktop, isMobile } = useDeviceBreakpoint()

  const props = defineProps({
    direction: {
      type: String,
      default: 'row',
    },
  })
  defineEmits(['navigate'])

  const showIcon = computed(() => isMobile.value || isDesktop.value)

  const directionClass = computed(() =>
    props.direction === 'column' ? 'main-nav--vertical' : 'main-nav--horizontal',
  )
</script>

<style scoped lang="less">
  .main-nav {
    display: flex;
    gap: var(--spacing-20);

    &--horizontal {
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }

    &--vertical {
      flex-direction: column;
      gap: var(--spacing-15);
      align-items: flex-start;
    }

    &__item {
      text-decoration: none;
    }
  }
</style>
