<template>
  <div class="basic-range">
    <div
      class="basic-range__slider"
      @click="onTrackClick"
    >
      <input
        type="range"
        class="range range--min"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="from"
      />
      <input
        type="range"
        class="range range--max"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="to"
      />
      <div class="range-base"></div>
      <div
        class="range-track"
        :style="trackStyle"
      ></div>
    </div>
    <div class="basic-range__inputs">
      <BasicInputNumber
        v-model="from"
        :decimal="2"
        :min="min"
        :max="to"
        icon-name="Euro"
        icon-state="iconLeft"
        iconColor="neutral-700"
        text-align="right"
        size="small"
      />
      <BasicInputNumber
        v-model="to"
        :decimal="2"
        text-align="right"
        :min="from"
        icon-name="Euro"
        icon-state="iconLeft"
        iconColor="neutral-700"
        :max="max"
        size="small"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRange } from '@/features/catalogue/composables/useRange'
  import { computed, watch } from 'vue'

  const model = defineModel<{
    min: number
    max: number
    from: number
    to: number
    step?: number
  }>({ required: true })

  const { range, trackStyle } = useRange(model.value.min, model.value.max, model.value.step ?? 0.1)

  watch(
    () => model.value,
    (v) => {
      range.min = v.min
      range.max = v.max
      range.from = v.from
      range.to = v.to
      range.step = v.step ?? 0.1
    },
    { deep: true, immediate: true },
  )

  watch(
    () => ({ ...range }),
    (v) => {
      model.value = { ...model.value, ...v }
    },
    { deep: true },
  )

  const min = computed(() => range.min)
  const max = computed(() => range.max)
  const step = computed(() => range.step)
  const from = computed({
    get: () => range.from,
    set: (v) => (range.from = v),
  })
  const to = computed({
    get: () => range.to,
    set: (v) => (range.to = v),
  })

  function onTrackClick(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const value = range.min + percent * (range.max - range.min)
    const distFrom = Math.abs(value - range.from)
    const distTo = Math.abs(value - range.to)
    if (distFrom < distTo) range.from = Math.min(value, range.to)
    else range.to = Math.max(value, range.from)
  }
</script>

<style scoped lang="less">
  .basic-range {
    display: flex;
    flex-direction: column;
    gap: 10px;
    user-select: none;

    &__slider {
      position: relative;
      height: 38px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .range-base {
      position: absolute;
      top: 18px;
      left: 0;
      right: 0;
      height: 4px;
      background: @neutral-300;
      border-radius: 2px;
      z-index: 1;
    }

    .range-track {
      position: absolute;
      top: 18px;
      height: 4px;
      background: var(--primary-500);
      border-radius: 2px;
      z-index: 2;
      pointer-events: none;
      transition:
        left 0.1s ease,
        width 0.1s ease;
    }

    .range {
      position: absolute;
      width: 100%;
      height: 38px;
      margin: 0;
      -webkit-appearance: none;
      appearance: none;
      background: none;
      pointer-events: none;
      z-index: 3;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        pointer-events: all;
        height: 18px;
        width: 18px;
        border-radius: 50%;
        background: var(--primary-600);
        border: 2px solid white;
        box-shadow: 0 0 3px color-mix(in srgb, @neutral-900 25%, transparent);
        cursor: pointer;
        transition:
          transform 0.15s ease,
          box-shadow 0.15s ease;
      }

      &::-webkit-slider-thumb:hover {
        transform: scale(1.15);
        box-shadow: 0 0 6px rgba(var(--primary-600-rgb), 0.5);
      }

      &::-moz-range-thumb {
        pointer-events: all;
        height: 18px;
        width: 18px;
        border-radius: 50%;
        background: var(--primary-600);
        border: 2px solid white;
        box-shadow: 0 0 3px color-mix(in srgb, @neutral-900 25%, transparent);
        cursor: pointer;
      }

      &::-webkit-slider-runnable-track,
      &::-moz-range-track {
        height: 4px;
        background: transparent;
      }
    }

    &__inputs {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
  }
</style>
