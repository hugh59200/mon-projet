<template>
  <div class="basic-range">
    <div
      class="basic-range__slider"
      @click="onTrackClick"
    >
      <!-- 2 inputs de range superposés -->
      <input
        type="range"
        class="range range--min"
        :min="model.min"
        :max="model.max"
        :step="model.step"
        v-model.number="local.from"
      />
      <input
        type="range"
        class="range range--max"
        :min="model.min"
        :max="model.max"
        :step="model.step"
        v-model.number="local.to"
      />

      <!-- Barre colorée et base -->
      <div class="range-base"></div>
      <div
        class="range-track"
        :style="trackStyle"
      ></div>
    </div>

    <!-- Inputs numériques -->
    <div class="basic-range__inputs">
      <BasicInputNumber
        v-model="local.from"
        :decimal="2"
        text-align="right"
        :min="model.min"
        :max="local.to"
        icon-left="euro"
      />
      <BasicInputNumber
        v-model="local.to"
        :decimal="2"
        text-align="right"
        :min="local.from"
        :max="model.max"
        icon-left="euro"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, watch } from 'vue'

  // 🔹 Un seul modèle global
  const model = defineModel<{
    min: number
    max: number
    from: number
    to: number
    step?: number
  }>({ required: true })

  const local = reactive({
    from: model.value.from,
    to: model.value.to,
  })

  // Synchronisation descendante
  watch(
    () => model.value,
    (v) => {
      local.from = v.from
      local.to = v.to
    },
    { deep: true, immediate: true },
  )

  // Synchronisation montante + clamp
  watch(
    () => ({ ...local }),
    (v) => {
      const clampedFrom = Math.min(Math.max(v.from, model.value.min), v.to)
      const clampedTo = Math.max(Math.min(v.to, model.value.max), clampedFrom)

      model.value = {
        ...model.value,
        from: clampedFrom,
        to: clampedTo,
      }

      local.from = clampedFrom
      local.to = clampedTo
    },
    { deep: true },
  )

  // Track colorée calculée
  const trackStyle = computed(() => {
    const leftPct = ((local.from - model.value.min) / (model.value.max - model.value.min)) * 100
    const rightPct = ((local.to - model.value.min) / (model.value.max - model.value.min)) * 100
    return {
      left: `${Math.max(0, leftPct)}%`,
      width: `${Math.max(0, rightPct - leftPct)}%`,
    }
  })

  // Clic sur le track pour bouger la poignée la plus proche
  function onTrackClick(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const value = model.value.min + percent * (model.value.max - model.value.min)

    const distFrom = Math.abs(value - local.from)
    const distTo = Math.abs(value - local.to)
    if (distFrom < distTo) local.from = Math.min(value, local.to)
    else local.to = Math.max(value, local.from)
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
      height: 38px; // ✅ plus haut pour ne plus couper les boules
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    /* --- Base grise --- */
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

    /* --- Barre active --- */
    .range-track {
      position: absolute;
      top: 18px;
      height: 4px;
      background: @primary-500;
      border-radius: 2px;
      z-index: 2;
      pointer-events: none;
      transition:
        left 0.1s ease,
        width 0.1s ease;
    }

    /* --- Inputs range --- */
    .range {
      position: absolute;
      width: 100%;
      height: 38px;
      margin: 0;
      -webkit-appearance: none;
      background: none;
      pointer-events: none;
      z-index: 3;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        pointer-events: all;
        height: 18px;
        width: 18px;
        border-radius: 50%;
        background: @primary-600;
        border: 2px solid white;
        box-shadow: 0 0 3px fade(@neutral-900, 25%);
        cursor: pointer;
        transition:
          transform 0.15s ease,
          box-shadow 0.15s ease;
      }

      &::-webkit-slider-thumb:hover {
        transform: scale(1.15);
        box-shadow: 0 0 6px fade(@primary-600, 50%);
      }

      &::-moz-range-thumb {
        pointer-events: all;
        height: 18px;
        width: 18px;
        border-radius: 50%;
        background: @primary-600;
        border: 2px solid white;
        box-shadow: 0 0 3px fade(@neutral-900, 25%);
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
