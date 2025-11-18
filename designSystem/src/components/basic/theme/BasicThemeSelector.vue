<template>
  <div class="theme-selector">
    <button
      class="theme-selector__toggle"
      :class="{ 'theme-selector__toggle--active': theme }"
      @click="theme = !theme"
    >
      <span class="theme-selector__pill"></span>
      <BasicText
        size="body-m"
        class="theme-selector__icon theme-selector__icon--blue"
      >
        🌊
      </BasicText>
      <BasicText
        size="body-m"
        class="theme-selector__icon theme-selector__icon--brown"
      >
        🟫
      </BasicText>
    </button>
    <BasicText
      size="body-m"
      color="neutral-700"
      class="theme-selector__label"
    >
      Thème : {{ theme ? 'Marron' : 'Bleu' }}
    </BasicText>
  </div>
</template>

<script setup lang="ts">
  const theme = defineModel<boolean>({ required: true })
</script>

<style lang="less" scoped>
  .theme-selector {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 6px 0;

    &__toggle {
      position: relative;
      width: 78px;
      height: 38px;
      border-radius: 40px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      background: color-mix(in srgb, @neutral-700 30%, transparent);
      border: 1px solid color-mix(in srgb, @neutral-300 40%, transparent);
      cursor: pointer;
      transition:
        background 0.25s ease,
        border-color 0.25s ease;

      /* Icônes */
      .theme-selector__icon {
        width: 50%;
        text-align: center;
        opacity: 0.45;
        user-select: none;
        pointer-events: none;
        transition: opacity 0.25s ease;

        &--blue {
          color: var(--primary-300);
        }

        &--brown {
          color: #c9a97a;
        }
      }

      /* Pastille */
      &__pill {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        transition:
          left 0.35s cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 0.35s ease;

        background: linear-gradient(
          135deg,
          color-mix(in srgb, @neutral-100 60%, transparent),
          color-mix(in srgb, @neutral-200 60%, transparent)
        );

        box-shadow:
          0 6px 14px color-mix(in srgb, black 30%, transparent),
          inset 0 0 0 1px color-mix(in srgb, white 30%, transparent);
      }

      /* ---- État actif ---- */
      &--active {
        background: color-mix(in srgb, @neutral-700 20%, transparent);
        border-color: color-mix(in srgb, @neutral-300 60%, transparent);

        .theme-selector__pill {
          left: calc(100% - 35px);
          box-shadow:
            0 6px 16px color-mix(in srgb, #c9a97a 45%, transparent),
            inset 0 0 0 1px color-mix(in srgb, white 25%, transparent);
        }

        .theme-selector__icon--brown {
          opacity: 1;
        }

        .theme-selector__icon--blue {
          opacity: 0.25;
        }
      }

      /* ---- État inactif ---- */
      &:not(&--active) {
        .theme-selector__icon--blue {
          opacity: 1;
        }
        .theme-selector__icon--brown {
          opacity: 0.25;
        }
      }
    }

    &__label {
      margin-left: 4px;
    }
  }
</style>
