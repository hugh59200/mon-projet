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
        :iconName="item.icon"
        type="reverse"
        variant="ghost"
        size="small"
        :class="['main-nav__btn']"
        :active="$route.path === item.path"
      />
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
  import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'

  const { sidebarItems } = storeToRefs(useSidebarStore())

  const props = defineProps({
    direction: {
      type: String,
      default: 'row',
    },
  })

  defineEmits(['navigate'])

  const directionClass = computed(() =>
    props.direction === 'column' ? 'main-nav--vertical' : 'main-nav--horizontal',
  )
</script>

<style scoped lang="less">
  .main-nav {
    display: flex;
    align-items: center;
    gap: 26px;

    &__item {
      text-decoration: none;
    }

    &__btn {
      gap: 6px;
      padding: 6px 10px;

      &:hover {
        background: fade(white, 10%);
        color: white;
      }

      &.is-active {
        background: fade(@primary-500, 25%);
        color: white;
      }
    }
  }

  .main-nav--horizontal {
    flex-direction: row;
    justify-content: center;
  }

  /* --- VERTICAL (drawer mobile) --- */
  .main-nav--vertical {
    margin-top: 15px;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;

    .main-nav__btn {
      width: 200px;
      display: flex;
      justify-content: flex-start;
      gap: 8px;
      border-radius: 14px;
      padding: 10px 12px;
    }
  }
</style>
