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
      active-class="active"
      @click="$emit('navigate')"
    >
      <BasicButton
        :label="item.label"
        :iconName="showIcon ? item.icon : undefined"
        type="reverse"
        variant="ghost"
        size="small"
        :class="['main-nav__btn', { active: $route.path === item.path }]"
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

    &__item {
      text-decoration: none;
    }

    &__btn {
      padding: 6px 10px;
      gap: 6px;
      transition: all 0.25s ease;

      &:hover {
        background: fade(white, 10%);
        transform: translateY(-1px);
      }

      &.active {
        background: fade(@primary-500, 25%);
        color: white;
        transform: translateY(-1px);
      }
    }
  }

  .main-nav--horizontal {
    flex-direction: row;
    justify-content: center;
  }

  .main-nav--vertical {
    flex-direction: column;
    gap: 14px;
  }
</style>
