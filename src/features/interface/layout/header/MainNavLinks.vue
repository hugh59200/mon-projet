<template>
  <nav
    class="main-nav"
    :class="directionClass"
  >
    <RouterLink
      v-for="item in sidebarItems"
      :key="item.path"
      :to="item.path"
      class="main-nav__link"
      active-class="active"
      @click="$emit('navigate')"
    >
      <BasicIconNext
        :name="item.icon"
        :size="18"
      />
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
  import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'

  const props = defineProps({
    direction: {
      type: String,
      default: 'row', // 'row' (desktop) ou 'column' (mobile drawer)
    },
  })

  defineEmits(['navigate'])

  const { sidebarItems } = storeToRefs(useSidebarStore())

  const directionClass = computed(() =>
    props.direction === 'column' ? 'main-nav--vertical' : 'main-nav--horizontal',
  )
</script>

<style scoped lang="less">
  .main-nav {
    display: flex;
    align-items: center;
    gap: 26px;

    &__link {
      display: flex;
      align-items: center;
      gap: 6px;
      color: fade(white, 80%);
      font-weight: 500;
      text-decoration: none;
      transition: all 0.25s ease;
      padding: 6px 8px;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        color: white;
        background: fade(white, 10%);
      }

      &.active {
        color: white;
        background: fade(@primary-500, 25%);
        box-shadow: 0 0 0 1px fade(@primary-500, 25%);
      }

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }

  /* --- MODE HORIZONTAL (desktop) --- */
  .main-nav--horizontal {
    flex-direction: row;
    justify-content: center;
  }

  /* --- MODE VERTICAL (drawer mobile) --- */
  .main-nav--vertical {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .main-nav__link {
      width: 100%;
      padding: 10px 12px;
      font-size: 16px;

      &:hover {
        background: fade(white, 8%);
      }

      &.active {
        background: fade(@primary-500, 25%);
        box-shadow: none;
      }
    }
  }
</style>
