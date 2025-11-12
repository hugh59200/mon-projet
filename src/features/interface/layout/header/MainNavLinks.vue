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
        variant="ghost"
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
    align-items: center;
    gap: 20px;

    &--horizontal {
      flex-direction: row;
      justify-content: center;
    }

    &--vertical {
      flex-direction: column;
      gap: 14px;
    }

    &__item {
      text-decoration: none;
    }
  }
</style>
