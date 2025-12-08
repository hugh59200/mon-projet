<template>
  <div class="custom-theme-selector">
    <!-- Theme Cards -->
    <div class="custom-theme-selector__cards">
      <!-- Default Theme (Blue) -->
      <button
        class="custom-theme-selector__card"
        :class="{ 'custom-theme-selector__card--active': config.mode === 'preset' }"
        @click="selectDefault"
      >
        <div
          class="custom-theme-selector__card-gradient"
          :style="{ background: defaultTheme.gradient }"
        />
        <div class="custom-theme-selector__card-content">
          <span class="custom-theme-selector__label">
            {{ defaultTheme.label }}
          </span>
          <span class="custom-theme-selector__desc">
            Thème par défaut
          </span>
        </div>
        <div
          v-if="config.mode === 'preset'"
          class="custom-theme-selector__check"
        >
          <BasicIconNext
            name="Check"
            :size="12"
          />
        </div>
      </button>

      <!-- Custom Theme -->
      <button
        class="custom-theme-selector__card custom-theme-selector__card--custom"
        :class="{ 'custom-theme-selector__card--active': config.mode === 'custom' }"
        @click="activateCustomTheme"
      >
        <div
          class="custom-theme-selector__card-gradient"
          :style="{ background: customGradient }"
        />
        <div class="custom-theme-selector__card-content">
          <span class="custom-theme-selector__label">
            Personnalisé
          </span>

          <!-- Color Picker inline -->
          <div
            class="custom-theme-selector__picker-row"
            @click.stop
          >
            <label class="custom-theme-selector__color-input-wrapper">
              <input
                type="color"
                v-model="customColorInput"
                class="custom-theme-selector__color-native"
                @input="onColorChange"
              />
              <div
                class="custom-theme-selector__color-preview"
                :style="{ backgroundColor: customColorInput }"
              />
            </label>
            <input
              type="text"
              v-model="customColorInput"
              class="custom-theme-selector__hex-input"
              placeholder="#667eea"
              maxlength="7"
              @input="onHexInput"
              @blur="validateAndApply"
              @keyup.enter="validateAndApply"
            />
          </div>
        </div>
        <div
          v-if="config.mode === 'custom'"
          class="custom-theme-selector__check"
        >
          <BasicIconNext
            name="Check"
            :size="12"
          />
        </div>
      </button>
    </div>

    <!-- Quick Colors -->
    <div class="custom-theme-selector__quick">
      <div class="custom-theme-selector__quick-colors">
        <button
          v-for="color in quickColors"
          :key="color.hex"
          class="custom-theme-selector__quick-color"
          :class="{
            'custom-theme-selector__quick-color--active':
              config.mode === 'custom' && config.customColor === color.hex,
          }"
          :style="{ backgroundColor: color.hex }"
          :title="color.name"
          @click="selectQuickColor(color.hex)"
        />
      </div>
    </div>

    <!-- Palette Preview -->
    <div
      v-if="config.mode === 'custom'"
      class="custom-theme-selector__palette-preview"
    >
      <div class="custom-theme-selector__palette">
        <div
          v-for="shade in previewShades"
          :key="shade.shade"
          class="custom-theme-selector__palette-shade"
          :style="{ backgroundColor: shade.hex }"
          :title="`${shade.shade}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useCustomTheme } from '@/composables/useCustomTheme'

  interface QuickColor {
    hex: string
    name: string
  }

  const { config, loadConfig, setPreset, setCustomColor, generatePalette } = useCustomTheme()

  const customColorInput = ref('#667eea')

  const defaultTheme = {
    label: 'Océan',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }

  const quickColors: QuickColor[] = [
    { hex: '#e74c3c', name: 'Rouge' },
    { hex: '#e91e63', name: 'Rose' },
    { hex: '#9c27b0', name: 'Violet' },
    { hex: '#3f51b5', name: 'Indigo' },
    { hex: '#2196f3', name: 'Bleu' },
    { hex: '#00bcd4', name: 'Cyan' },
    { hex: '#009688', name: 'Sarcelle' },
    { hex: '#4caf50', name: 'Vert' },
    { hex: '#ff9800', name: 'Orange' },
    { hex: '#795548', name: 'Marron' },
  ]

  const customGradient = computed(() => {
    const color = customColorInput.value
    return `linear-gradient(135deg, ${color} 0%, ${adjustBrightness(color, -20)} 100%)`
  })

  const previewShades = computed(() => {
    if (config.value.mode === 'custom' && config.value.customColor) {
      return generatePalette(config.value.customColor).filter((s) =>
        [900, 700, 500, 300, 100].includes(s.shade),
      )
    }
    return []
  })

  function adjustBrightness(hex: string, percent: number): string {
    hex = hex.replace(/^#/, '')
    const num = parseInt(hex, 16)
    const r = Math.min(255, Math.max(0, (num >> 16) + percent))
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent))
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }

  function selectDefault() {
    setPreset('blue')
  }

  function activateCustomTheme() {
    // Réactiver le thème custom avec la couleur actuelle
    setCustomColor(customColorInput.value)
  }

  function selectQuickColor(hex: string) {
    customColorInput.value = hex
    setCustomColor(hex)
  }

  function onColorChange(event: Event) {
    const input = event.target as HTMLInputElement
    customColorInput.value = input.value
    setCustomColor(input.value)
  }

  function onHexInput(event: Event) {
    const input = event.target as HTMLInputElement
    let value = input.value

    if (value && !value.startsWith('#')) {
      value = '#' + value
    }

    customColorInput.value = value
  }

  function validateAndApply() {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/
    if (hexPattern.test(customColorInput.value)) {
      setCustomColor(customColorInput.value)
    } else {
      // Reset to current or default
      if (config.value.mode === 'custom' && config.value.customColor) {
        customColorInput.value = config.value.customColor
      } else {
        customColorInput.value = '#667eea'
      }
    }
  }

  // Sync customColorInput with config
  watch(
    () => config.value,
    (newConfig) => {
      if (newConfig.mode === 'custom' && newConfig.customColor) {
        customColorInput.value = newConfig.customColor
      }
    },
    { immediate: true },
  )

  onMounted(async () => {
    await loadConfig()
    if (config.value.mode === 'custom' && config.value.customColor) {
      customColorInput.value = config.value.customColor
    }
  })
</script>

<style lang="less" scoped>
  .custom-theme-selector {
    display: flex;
    flex-direction: column;
    gap: 16px;

    // Cards row
    &__cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    &__card {
      position: relative;
      background: var(--bg-subtle);
      border: 2px solid var(--border-subtle);
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s ease;
      text-align: left;

      &:hover:not(&--active) {
        border-color: var(--border-default);
        background: var(--bg-surface);
      }

      &--active {
        border-color: var(--primary-400);
        background: rgba(var(--primary-500-rgb), 0.1);
      }
    }

    &__card-gradient {
      position: absolute;
      inset: 0;
      opacity: 0.15;
      transition: opacity 0.3s ease;

      .custom-theme-selector__card:hover &,
      .custom-theme-selector__card--active & {
        opacity: 0.25;
      }
    }

    &__card-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    &__desc {
      font-size: 11px;
      color: var(--text-secondary);
    }

    &__check {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
      background: var(--primary-500);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      z-index: 3;
    }

    // Picker row inside custom card
    &__picker-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }

    &__color-input-wrapper {
      position: relative;
      width: 32px;
      height: 32px;
      cursor: pointer;
      flex-shrink: 0;
    }

    &__color-native {
      position: absolute;
      inset: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    &__color-preview {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      border: 2px solid var(--border-default);
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

      .custom-theme-selector__color-input-wrapper:hover & {
        border-color: var(--primary-400);
      }
    }

    &__hex-input {
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: 6px;
      padding: 6px 8px;
      font-family: monospace;
      font-size: 12px;
      color: var(--input-text);
      width: 80px;
      text-transform: uppercase;

      &:focus {
        outline: none;
        border-color: var(--primary-400);
      }
    }

    // Quick colors
    &__quick {
      padding: 0 4px;
    }

    &__quick-colors {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    &__quick-color {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      }

      &--active {
        border-color: var(--primary-500);
        box-shadow:
          0 0 0 2px var(--primary-400),
          0 4px 10px rgba(0, 0, 0, 0.2);
      }
    }

    // Palette preview
    &__palette-preview {
      padding: 8px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
    }

    &__palette {
      display: flex;
      gap: 3px;
      height: 24px;
      border-radius: 6px;
      overflow: hidden;
    }

    &__palette-shade {
      flex: 1;
      transition: transform 0.2s ease;

      &:first-child {
        border-radius: 4px 0 0 4px;
      }

      &:last-child {
        border-radius: 0 4px 4px 0;
      }

      &:hover {
        transform: scaleY(1.2);
      }
    }

    // Mobile
    @media (max-width: 480px) {
      &__cards {
        grid-template-columns: 1fr;
      }

      &__quick-colors {
        justify-content: center;
      }
    }
  }
</style>
