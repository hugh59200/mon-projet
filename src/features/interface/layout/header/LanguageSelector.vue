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
      :title="currentLocaleInfo?.name"
      @click="toggleDropdown"
    >
      <BasicIconNext
        :name="flagIcons[locale]"
        :size="20"
        class="language-selector__flag"
      />
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="language-selector__dropdown"
        role="listbox"
      >
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
            <BasicIconNext
              :name="flagIcons[localeItem.code]"
              :size="20"
              class="language-selector__option-flag"
            />
            <span class="language-selector__option-name">{{ localeItem.name }}</span>
            <BasicIconNext
              v-if="localeItem.code === locale"
              name="Check"
              :size="16"
              color="primary-400"
              class="language-selector__option-check"
            />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'
import type { SupportedLocale } from '@/i18n'
import { BasicIconNext } from '@designSystem/components/basic/icon'
import type { CustomIconName } from '@designSystem/components/basic/icon/customIcons'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

const { locale, currentLocaleInfo, availableLocales, changeLocale } = useLanguage()

const flagIcons: Record<SupportedLocale, CustomIconName> = {
  fr: 'flagFR',
  en: 'flagEN',
  de: 'flagDE',
}

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
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s @ease;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.12);
      transform: scale(1.05);
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
    width: 16px;
    height: 12px;
    border-radius: 1px;
    overflow: hidden;
  }

  // ==========================================
  // DROPDOWN
  // ==========================================
  &__dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 160px;
    background: linear-gradient(
      135deg,
      rgba(30, 32, 40, 0.98) 0%,
      rgba(24, 26, 32, 0.98) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 6px;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 4px 16px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    z-index: 100;
    overflow: hidden;
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
    padding: 8px 10px;
    background: transparent;
    border: none;
    border-radius: 8px;
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
    width: 20px;
    height: 15px;
    border-radius: 2px;
    flex-shrink: 0;
    overflow: hidden;
  }

  &__option-name {
    flex: 1;
    font-family: @font-body;
    font-size: 13px;
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
    &__trigger {
      width: 32px;
      height: 32px;
    }

    &__flag {
      font-size: 16px;
    }

    &__dropdown {
      right: -8px;
    }
  }
}
</style>
