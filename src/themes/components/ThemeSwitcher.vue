<template>
  <div class="theme-switcher">
    <h3 class="ts-title">Personnalisation</h3>

    <!-- Palette Selector -->
    <div class="ts-section">
      <label class="ts-label">Palette de couleur</label>

      <div class="ts-palette-list">
        <button
          v-for="p in palettes"
          :key="p"
          class="ts-palette-item"
          :class="{ active: palette === p }"
          @click="palette = p as Palette"
        >
          <span class="ts-palette-name">{{ formatName(p) }}</span>

          <div class="ts-palette-preview">
            <span :style="{ background: `var(--primary-300)` }"></span>
            <span :style="{ background: `var(--primary-500)` }"></span>
            <span :style="{ background: `var(--primary-700)` }"></span>
          </div>
        </button>
      </div>
    </div>

    <!-- Light / Dark Toggle -->
    <div class="ts-section">
      <label class="ts-label">Apparence</label>
      <div
        class="ts-toggle"
        @click="toggleScheme"
      >
        <div
          class="ts-toggle-slider"
          :class="scheme"
        ></div>
        <span>{{ scheme === 'light' ? 'Clair' : 'Sombre' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTheme, type Palette } from '@/themes/composables/useTheme'

  const { palette, scheme } = useTheme()

  const palettes = ['lab', 'premium', 'neo']

  function toggleScheme() {
    scheme.value = scheme.value === 'light' ? 'dark' : 'light'
  }

  function formatName(p: string) {
    return p.charAt(0).toUpperCase() + p.slice(1)
  }
</script>

<style scoped lang="less">
  .theme-switcher {
    padding: 20px;
    background: @white;
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 22px;
    transition:
      background 0.3s ease,
      color 0.3s ease;
  }

  .ts-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: @neutral-800;
  }

  .ts-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ts-label {
    font-size: 14px;
    color: @neutral-600;
    font-weight: 600;
  }

  .ts-palette-list {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ts-palette-item {
    background: @neutral-50;
    border: 1px solid rgba(var(--neutral-300-rgb), 0.50);
    padding: 10px 14px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    gap: 12px;
    align-items: center;
    transition: all 0.25s ease;

    &.active {
      border-color: @primary-600;
      background: rgba(var(--primary-200-rgb), 0.30);
      transform: scale(1.02);
    }

    &:hover {
      border-color: @primary-400;
      transform: translateY(-1px);
    }
  }

  .ts-palette-name {
    font-size: 14px;
    font-weight: 600;
    color: @neutral-700;
  }

  .ts-palette-preview {
    display: flex;
    gap: 4px;

    span {
      width: 18px;
      height: 18px;
      border-radius: 6px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  /* Light/Dark Toggle */
  .ts-toggle {
    position: relative;
    width: 80px;
    height: 36px;
    background: @neutral-200;
    border-radius: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 4px;
    box-sizing: border-box;
    transition: background 0.25s ease;
    gap: 8px;
  }

  .ts-toggle-slider {
    width: 28px;
    height: 28px;
    background: @white;
    border-radius: 50%;
    position: absolute;
    left: 4px;
    top: 4px;
    transition:
      left 0.25s ease,
      background 0.25s ease;

    &.dark {
      left: 48px;
    }
  }

  .ts-toggle span {
    margin-left: 50px;
    font-size: 14px;
    color: @neutral-800;
    font-weight: 600;
    transition: color 0.3s ease;
  }
</style>
