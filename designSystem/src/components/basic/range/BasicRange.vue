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
        v-model.number="local.from"
      />
      <input
        type="range"
        class="range range--max"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="local.to"
      />
      <div
        class="range-track"
        :style="trackStyle"
      />
    </div>

    <div class="basic-range__inputs">
      <BasicInputNumber
        v-model="local.from"
        :decimal="2"
        text-align="right"
        :min="min"
        :max="local.to"
        icon-left="euro"
      />
      <BasicInputNumber
        v-model="local.to"
        :decimal="2"
        text-align="right"
        :min="local.from"
        :max="max"
        icon-left="euro"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, watch } from 'vue'

  const model = defineModel<{ from: number; to: number }>({ required: true })

  const props = defineProps<{
    min: number
    max: number
    step?: number
  }>()

  const step = computed(() => props.step ?? 0.1)

  // --- état local réactif lié au v-model parent
  const local = reactive({
    from: model.value.from ?? props.min,
    to: model.value.to ?? props.max,
  })

  // --- synchronisation descendante
  watch(
    () => model.value,
    (v) => {
      if (!v) return
      local.from = v.from
      local.to = v.to
    },
    { deep: true, immediate: true },
  )

  // --- synchronisation montante
  watch(
    () => ({ ...local }),
    (v) => {
      const from = Math.min(Math.max(v.from, props.min), v.to)
      const to = Math.max(Math.min(v.to, props.max), from)
      model.value = { from, to }
    },
    { deep: true },
  )

  // --- clic sur la barre pour bouger la poignée la plus proche
  function onTrackClick(e: MouseEvent) {
    const slider = (e.currentTarget as HTMLElement).querySelector('.range') as HTMLInputElement
    if (!slider) return

    const rect = slider.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = clickX / rect.width
    const value = props.min + percent * (props.max - props.min)

    const distFrom = Math.abs(value - local.from)
    const distTo = Math.abs(value - local.to)

    if (distFrom < distTo) local.from = Math.min(value, local.to)
    else local.to = Math.max(value, local.from)
  }

  // --- track colorée
  const thumbOffset = 8
  const trackStyle = computed(() => {
    const leftPct = ((local.from - props.min) / (props.max - props.min)) * 100
    const rightPct = ((local.to - props.min) / (props.max - props.min)) * 100
    return {
      left: `calc(${leftPct}% + ${thumbOffset}px)`,
      width: `calc(${Math.max(0, rightPct - leftPct)}% - ${thumbOffset * 2}px)`,
    }
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
      height: 28px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .range {
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      background: none;
      pointer-events: none;
      z-index: 2;

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
        z-index: 3;
        position: relative;
        transition: transform 0.1s ease;
      }

      &::-webkit-slider-thumb:hover {
        transform: scale(1.1);
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
        transition: transform 0.1s ease;
      }

      &::-moz-range-thumb:hover {
        transform: scale(1.1);
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
      height: 4px;
      background: @primary-500;
      border-radius: 2px;
      z-index: 1;
      pointer-events: none;
    }

    &__inputs {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
  }
</style>
