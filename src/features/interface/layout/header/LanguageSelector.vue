<template>
  <div
    ref="containerRef"
    class="language-selector"
    :class="{ 'language-selector--open': isOpen }"
  >
    <button
      class="language-selector__trigger"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggleDropdown"
    >
      <span class="language-selector__flag">{{ currentLocaleInfo?.flag }}</span>
      <span class="language-selector__code">{{ currentLocaleInfo?.code.toUpperCase() }}</span>
      <svg
        class="language-selector__chevron"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="language-selector__dropdown"
        role="listbox"
      >
        <div class="language-selector__header">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />
            <line
              x1="2"
              y1="12"
              x2="22"
              y2="12"
            />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>{{ t('language.select') }}</span>
        </div>

        <div class="language-selector__list">
          <button
            v-for="localeItem in availableLocales"
            :key="localeItem.code"
            class="language-selector__option"
            :class="{ 'language-selector__option--active': localeItem.code === locale }"
            role="option"
            :aria-selected="localeItem.code === locale"
            @click="selectLocale(localeItem.code)"
          >
            <span class="language-selector__option-flag">{{ localeItem.flag }}</span>
            <span class="language-selector__option-name">{{ localeItem.name }}</span>
            <svg
              v-if="localeItem.code === locale"
              class="language-selector__option-check"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'
import type { SupportedLocale } from '@/i18n'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

const { t, locale, currentLocaleInfo, availableLocales, changeLocale } = useLanguage()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

onClickOutside(containerRef, () => {
  isOpen.value = false
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectLocale(newLocale: SupportedLocale) {
  changeLocale(newLocale)
  isOpen.value = false
}
</script>

<style scoped lang="less">
@font-body:
  'Inter',
  'SF Pro Text',
  -apple-system,
  sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);
@bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

.language-selector {
  position: relative;

  // ==========================================
  // TRIGGER
  // ==========================================
  &__trigger {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s @ease;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.12);
    }

    &:active {
      transform: scale(0.98);
    }
  }

  &--open &__trigger {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(var(--primary-500-rgb), 0.3);
  }

  &__flag {
    font-size: 16px;
    line-height: 1;
  }

  &__code {
    font-family: @font-body;
    font-size: 12px;
    font-weight: 600;
    color: @neutral-200;
    letter-spacing: 0.5px;
  }

  &__chevron {
    color: @neutral-400;
    transition: transform 0.2s @ease;
  }

  &--open &__chevron {
    transform: rotate(180deg);
    color: var(--primary-400);
  }

  // ==========================================
  // DROPDOWN
  // ==========================================
  &__dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 180px;
    background: linear-gradient(
      135deg,
      rgba(30, 32, 40, 0.98) 0%,
      rgba(24, 26, 32, 0.98) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: 8px;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 4px 16px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    z-index: 100;
    overflow: hidden;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    margin-bottom: 4px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

    svg {
      color: var(--primary-400);
    }

    span {
      font-family: @font-body;
      font-size: 11px;
      font-weight: 600;
      color: @neutral-400;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  // ==========================================
  // OPTIONS
  // ==========================================
  &__option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: transparent;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s @ease;
    width: 100%;
    text-align: left;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    &--active {
      background: rgba(var(--primary-500-rgb), 0.1);

      &:hover {
        background: rgba(var(--primary-500-rgb), 0.15);
      }
    }
  }

  &__option-flag {
    font-size: 18px;
    line-height: 1;
  }

  &__option-name {
    flex: 1;
    font-family: @font-body;
    font-size: 14px;
    font-weight: 500;
    color: @neutral-200;
  }

  &__option--active &__option-name {
    color: var(--primary-300);
    font-weight: 600;
  }

  &__option-check {
    color: var(--primary-400);
    flex-shrink: 0;
  }

  // ==========================================
  // ANIMATIONS
  // ==========================================
  .dropdown-enter-active {
    animation: dropdownIn 0.25s @bounce;
  }

  .dropdown-leave-active {
    animation: dropdownOut 0.15s @ease forwards;
  }

  @keyframes dropdownIn {
    0% {
      opacity: 0;
      transform: translateY(-8px) scale(0.96);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes dropdownOut {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(-4px) scale(0.98);
    }
  }

  // ==========================================
  // RESPONSIVE
  // ==========================================
  @media (max-width: 750px) {
    &__code {
      display: none;
    }

    &__trigger {
      padding: 8px 10px;
    }

    &__dropdown {
      right: -8px;
    }
  }
}
</style>
