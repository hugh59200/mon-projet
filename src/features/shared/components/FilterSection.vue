<template>
  <section class="filter-section">
    <header
      class="filter-section__header"
      @click="toggle"
    >
      <BasicText weight="semibold">{{ title }}</BasicText>
      <BasicIconNext
        :name="open ? 'ChevronUp' : 'ChevronDown'"
        :size="16"
        :class="{ 'icon--rotated': open }"
      />
    </header>
    <div
      v-motion="motion"
      v-show="open"
      class="filter-section__content"
    >
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const open = defineModel<boolean>({ default: true })

  defineProps<{ title: string }>()

  const motion = computed(() => ({
    initial: { opacity: 0, y: -8, scaleY: 0.96 },
    enter: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      transition: { type: 'spring', stiffness: 180, damping: 20 },
    },
    leave: {
      opacity: 0,
      y: -6,
      scaleY: 0.96,
      transition: { duration: 0.2 },
    },
  }))

  function toggle() {
    open.value = !open.value
  }
</script>

<style scoped lang="less">
  /* ==========================================================
   🧊 FILTER SECTION — Neural Glass v3
   ========================================================== */

  .filter-section {
    position: relative;

    background: fade(@neutral-200, 82%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    border-radius: 14px;

    border: 1px solid fade(@neutral-300, 40%);
    box-shadow:
      0 4px 14px fade(@neutral-900, 6%),
      inset 0 0 0 1px fade(@neutral-50, 45%);

    overflow: hidden;
    transition: all 0.25s ease;

    &:hover {
      background: fade(@white, 88%);
      border-color: fade(@primary-500, 35%);
    }

    /* ----------------------------------------------------------
     HEADER
  ---------------------------------------------------------- */
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      padding: 14px 18px;

      cursor: pointer;
      user-select: none;

      color: @neutral-800;
      font-weight: 600;

      transition: all 0.25s ease;

      /* Hover effect */
      &:hover {
        background: fade(@neutral-900, 4%);
        backdrop-filter: blur(14px);
      }

      /* Chevron */
      svg {
        transition:
          transform 0.28s cubic-bezier(0.25, 1, 0.5, 1),
          opacity 0.25s ease;
        opacity: 0.8;
      }

      .icon--rotated {
        transform: rotate(180deg);
        opacity: 1;
      }
    }

    /* ----------------------------------------------------------
     CONTENU
  ---------------------------------------------------------- */
    &__content {
      padding: 16px 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      border-top: 1px solid fade(@neutral-200, 40%);
      backdrop-filter: blur(10px);

      animation: fadeInGlass 0.25s ease;
    }
  }

  /* ----------------------------------------------------------
   ANIMATIONS
---------------------------------------------------------- */
  @keyframes fadeInGlass {
    0% {
      opacity: 0;
      transform: translateY(-6px) scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
