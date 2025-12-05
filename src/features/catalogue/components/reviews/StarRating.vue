<template>
  <div class="star-rating" :class="{ interactive: interactive }">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      class="star"
      :class="{ filled: star <= displayRating, half: isHalfStar(star) }"
      :disabled="!interactive"
      @click="interactive && $emit('update:modelValue', star)"
      @mouseenter="interactive && (hoverRating = star)"
      @mouseleave="interactive && (hoverRating = 0)"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    rating?: number
    modelValue?: number
    interactive?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    rating: 0,
    modelValue: 0,
    interactive: false,
    size: 'md',
  }
)

defineEmits<{
  'update:modelValue': [value: number]
}>()

const hoverRating = ref(0)

const displayRating = computed(() => {
  if (props.interactive && hoverRating.value > 0) {
    return hoverRating.value
  }
  return props.interactive ? props.modelValue : props.rating
})

function isHalfStar(star: number): boolean {
  if (props.interactive) return false
  const decimal = props.rating - Math.floor(props.rating)
  return star === Math.ceil(props.rating) && decimal >= 0.25 && decimal < 0.75
}
</script>

<style scoped lang="less">
.star-rating {
  display: inline-flex;
  gap: 2px;

  &.interactive {
    .star {
      cursor: pointer;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

.star {
  background: none;
  border: none;
  padding: 0;
  color: var(--color-border);
  transition: all 0.15s ease;

  svg {
    width: 20px;
    height: 20px;
    display: block;
  }

  &.filled {
    color: var(--color-warning);
  }

  &.half {
    position: relative;
    color: var(--color-border);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      overflow: hidden;
      color: var(--color-warning);
    }
  }

  &:disabled {
    cursor: default;
  }
}
</style>
