<template>
  <button
    class="btn"
    :class="variantClass"
    @click="$emit('click')"
  >
    <span v-if="$slots.default"><slot /></span>
    <BasicIconNext name="ArrowRight" :size="2" />
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    variant?: 'primary' | 'ghost' | 'white' | 'outline'
    arrow?: boolean
  }>()

  defineEmits<{
    click: []
  }>()

  const variantClass = computed(() => `btn--${props.variant || 'primary'}`)
</script>

<style scoped lang="less">
  @font-body:
    'Inter',
    'SF Pro Text',
    -apple-system,
    sans-serif;
  @ease: cubic-bezier(0.4, 0, 0.2, 1);

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 28px;
    border-radius: 14px;
    font-family: @font-body;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s @ease;
    border: none;

    svg {
      width: 18px;
      height: 18px;
      transition: transform 0.3s @ease;
    }

    &--primary {
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      color: white;
      box-shadow:
        0 4px 20px rgba(var(--primary-600-rgb), 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(var(--primary-600-rgb), 0.45);
        svg {
          transform: translateX(4px);
        }
      }
    }

    &--ghost {
      background: rgba(var(--secondary-700-rgb), 0.5);
      color: @neutral-100;
      border: 1px solid rgba(var(--neutral-300-rgb), 0.12);
      backdrop-filter: blur(10px);

      &:hover {
        background: rgba(var(--secondary-600-rgb), 0.6);
        border-color: rgba(var(--neutral-300-rgb), 0.2);
        transform: translateY(-2px);
      }
    }

    &--white {
      background: @neutral-50;
      color: var(--secondary-900);
      box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(255, 255, 255, 0.25);
        svg {
          transform: translateX(4px);
        }
      }
    }

    &--outline {
      background: rgba(var(--neutral-100-rgb), 0.1);
      color: @neutral-100;
      border: 1px solid rgba(var(--neutral-100-rgb), 0.2);

      &:hover {
        background: rgba(var(--neutral-100-rgb), 0.15);
        transform: translateY(-2px);
      }
    }
  }
</style>
