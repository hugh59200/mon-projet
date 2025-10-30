<template>
  <div class="basic-range">
    <div class="basic-range__slider">
      <input
        type="range"
        class="range range--min"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="localFrom"
      />
      <input
        type="range"
        class="range range--max"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="localTo"
      />
      <div
        class="range-track"
        :style="trackStyle"
      />
    </div>

    <div class="basic-range__inputs">
      <BasicInputNumber
        v-model="localFrom"
        :decimal="2"
        text-align="right"
        :min="min"
        :max="localTo"
        icon-left="euro"
      />
      <BasicInputNumber
        v-model="localTo"
        :decimal="2"
        text-align="right"
        :min="localFrom"
        :max="max"
        icon-left="euro"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'

  const model = defineModel<{ from: number; to: number }>({
    required: true,
  })

  const props = defineProps<{
    min: number
    max: number
    step?: number
  }>()

  const step = computed(() => props.step ?? 0.1)

  // Copies locales synchronisées
  const localFrom = ref(model.value.from ?? props.min)
  const localTo = ref(model.value.to ?? props.max)

  // Synchronisation vers le parent
  watch([localFrom, localTo], ([from, to]) => {
    const clampedFrom = Math.min(Math.max(from, props.min), to)
    const clampedTo = Math.max(Math.min(to, props.max), from)
    model.value = { from: clampedFrom, to: clampedTo }
  })

  // Synchronisation descendante (parent → enfant)
  watch(
    () => model.value,
    (v) => {
      localFrom.value = v.from
      localTo.value = v.to
    },
    { deep: true },
  )

  const trackStyle = computed(() => {
    const left = ((localFrom.value - props.min) / (props.max - props.min)) * 100
    const right = ((localTo.value - props.min) / (props.max - props.min)) * 100
    return { left: `${left}%`, width: `${Math.max(0, right - left)}%` }
  })
</script>

<style scoped lang="less">
  .basic-range {
    display: flex;
    flex-direction: column;
    gap: 10px;
    user-select: none;

    &__slider {
      position: relative;
      height: 30px;
    }

    .range {
      position: absolute;
      left: 0;
      right: 0;
      top: 8px;
      width: 100%;
      -webkit-appearance: none;
      background: none;
      pointer-events: none;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        pointer-events: all;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: @primary-600;
        border: 2px solid white;
        box-shadow: 0 0 0 1px fade(@primary-600, 30%);
        cursor: pointer;
      }

      &::-moz-range-thumb {
        pointer-events: all;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: @primary-600;
        border: 2px solid white;
        box-shadow: 0 0 0 1px fade(@primary-600, 30%);
        cursor: pointer;
      }

      &::-webkit-slider-runnable-track,
      &::-moz-range-track {
        height: 4px;
        background: @neutral-300;
        border-radius: 2px;
      }
    }

    .range-track {
      position: absolute;
      top: 10px;
      height: 4px;
      background: @primary-500;
      border-radius: 2px;
    }

    &__inputs {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
  }
</style>
