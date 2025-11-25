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
        :size="isCompactMode ? 'small' : 'medium'"
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

  // ✅ Correction ici : on déstructure les bonnes variables de ton plugin
  const { isMobile, currentWindowsWidth } = useDeviceBreakpoint()

  const props = defineProps({
    direction: {
      type: String,
      default: 'row',
    },
  })

  defineEmits(['navigate'])

  const showIcon = computed(() => isMobile.value)

  // Détection d'un mode "Compact" pour le menu (Entre Mobile et Grand Écran)
  // On utilise 1200px car c'est souvent là que les headers larges cassent
  const isCompactMode = computed(() => {
    return currentWindowsWidth.value < 1200 && !isMobile.value
  })

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

      /* Ajustement du gap via CSS pour correspondre à la logique JS */
      @media (max-width: 1200px) {
        gap: 6px; /* Gap très réduit pour faire tenir les liens */
      }
    }

    &--vertical {
      flex-direction: column;
      gap: 14px;
    }

    &__item {
      text-decoration: none;
      flex-shrink: 0; /* Empêche l'écrasement du texte */
    }
  }
</style>
