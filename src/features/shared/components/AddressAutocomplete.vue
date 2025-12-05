<template>
  <div class="address-autocomplete" ref="containerRef">
    <label v-if="label" class="address-autocomplete__label">
      <BasicIconNext name="MapPin" :size="16" />
      {{ label }}
    </label>
    <div class="address-autocomplete__input-wrapper">
      <input
        :value="modelValue"
        type="text"
        class="address-autocomplete__input"
        :class="{ 'address-autocomplete__input--error': alertType === 'danger' }"
        :placeholder="placeholder"
        :required="required"
        autocomplete="off"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
      <div class="address-autocomplete__suffix">
        <span v-if="isLoading" class="address-autocomplete__loader"></span>
        <BasicIconNext
          v-else-if="selectedAddress"
          name="CheckCircle2"
          :size="18"
          class="address-autocomplete__check"
        />
      </div>
    </div>
    <span v-if="alertLabel" class="address-autocomplete__error">
      {{ alertLabel }}
    </span>

    <!-- Dropdown des suggestions -->
    <Transition name="dropdown">
      <div
        v-if="showSuggestions && suggestions.length > 0"
        class="address-autocomplete__dropdown"
      >
        <button
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.label + index"
          type="button"
          class="address-autocomplete__item"
          :class="{ 'address-autocomplete__item--active': activeIndex === index }"
          @click="selectSuggestion(suggestion)"
          @mouseenter="activeIndex = index"
        >
          <div class="address-autocomplete__item-icon">
            <BasicIconNext :name="getIcon(suggestion.type)" :size="16" />
          </div>
          <div class="address-autocomplete__item-content">
            <span class="address-autocomplete__item-main">
              {{ getMainText(suggestion) }}
            </span>
            <span class="address-autocomplete__item-secondary">
              {{ suggestion.context }}
            </span>
          </div>
          <div class="address-autocomplete__item-postcode">
            {{ suggestion.postcode }}
          </div>
        </button>

        <div class="address-autocomplete__footer">
          <BasicIconNext name="MapPin" :size="12" />
          <span>Propulsé par api-adresse.data.gouv.fr</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAddressAutocomplete, type AddressSuggestion } from '@/composables/useAddressAutocomplete'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  required?: boolean
  alertLabel?: string
  alertType?: 'success' | 'warning' | 'danger'
  /** Si true, remplit automatiquement les champs liés */
  autoFill?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Adresse',
  placeholder: 'Commencez à taper une adresse...',
  required: false,
  autoFill: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', address: AddressSuggestion): void
  (e: 'fill', data: {
    address: string
    city: string
    postcode: string
    street?: string
    housenumber?: string
  }): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const showSuggestions = ref(false)
const activeIndex = ref(-1)
const isFocused = ref(false)

const {
  suggestions,
  isLoading,
  selectedAddress,
  debouncedSearch,
  selectAddress,
} = useAddressAutocomplete({
  limit: 6,
  debounce: 250,
  minLength: 3,
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  emit('update:modelValue', value)
  activeIndex.value = -1

  if (value.length >= 3) {
    debouncedSearch(value)
    showSuggestions.value = true
  } else {
    showSuggestions.value = false
  }
}

function onFocus() {
  isFocused.value = true
  if (props.modelValue.length >= 3 && suggestions.value.length > 0) {
    showSuggestions.value = true
  }
}

function onBlur() {
  isFocused.value = false
  // Délai pour permettre le clic sur une suggestion
  setTimeout(() => {
    if (!isFocused.value) {
      showSuggestions.value = false
    }
  }, 200)
}

function selectSuggestion(suggestion: AddressSuggestion) {
  selectAddress(suggestion)

  // Construire l'adresse sans la ville et le code postal
  const addressParts: string[] = []
  if (suggestion.housenumber) addressParts.push(suggestion.housenumber)
  if (suggestion.street) addressParts.push(suggestion.street)

  const streetAddress = addressParts.length > 0
    ? addressParts.join(' ')
    : suggestion.label.split(',')[0] || suggestion.label

  emit('update:modelValue', streetAddress)
  emit('select', suggestion)

  // Auto-fill des champs liés
  if (props.autoFill) {
    emit('fill', {
      address: streetAddress,
      city: suggestion.city,
      postcode: suggestion.postcode,
      street: suggestion.street,
      housenumber: suggestion.housenumber,
    })
  }

  showSuggestions.value = false
  activeIndex.value = -1
}

type IconName = 'Home' | 'ArrowRight' | 'MapPin' | 'Building2'

function getIcon(type: AddressSuggestion['type']): IconName {
  switch (type) {
    case 'housenumber':
      return 'Home'
    case 'street':
      return 'ArrowRight'
    case 'locality':
      return 'MapPin'
    case 'municipality':
      return 'Building2'
    default:
      return 'MapPin'
  }
}

function getMainText(suggestion: AddressSuggestion): string {
  if (suggestion.housenumber && suggestion.street) {
    return `${suggestion.housenumber} ${suggestion.street}`
  }
  if (suggestion.street) {
    return suggestion.street
  }
  return suggestion.city
}

// Navigation clavier
function handleKeydown(e: KeyboardEvent) {
  if (!showSuggestions.value || suggestions.value.length === 0) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      activeIndex.value = Math.min(activeIndex.value + 1, suggestions.value.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      activeIndex.value = Math.max(activeIndex.value - 1, 0)
      break
    case 'Enter':
      e.preventDefault()
      const selected = suggestions.value[activeIndex.value]
      if (activeIndex.value >= 0 && activeIndex.value < suggestions.value.length && selected) {
        selectSuggestion(selected)
      }
      break
    case 'Escape':
      showSuggestions.value = false
      activeIndex.value = -1
      break
  }
}

// Fermer au clic extérieur
function handleClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    showSuggestions.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
})

// Sync avec suggestions du composable
watch(suggestions, (newSuggestions) => {
  if (newSuggestions.length > 0 && isFocused.value) {
    showSuggestions.value = true
  }
})
</script>

<style scoped lang="less">
.address-autocomplete {
  position: relative;
  width: 100%;

  &__label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: @neutral-600;
    margin-bottom: 6px;

    svg {
      color: @neutral-400;
    }
  }

  &__input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__input {
    width: 100%;
    padding: 12px 16px;
    padding-right: 44px;
    font-size: 15px;
    font-family: inherit;
    border: 1px solid @neutral-200;
    border-radius: 12px;
    background: @white;
    color: @neutral-900;
    transition: all 0.2s ease;

    &::placeholder {
      color: @neutral-400;
    }

    &:focus {
      outline: none;
      border-color: var(--primary-400);
      box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.1);
    }

    &--error {
      border-color: var(--color-danger-400);

      &:focus {
        box-shadow: 0 0 0 3px rgba(var(--color-danger-500-rgb), 0.1);
      }
    }
  }

  &__suffix {
    position: absolute;
    right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  &__loader {
    width: 16px;
    height: 16px;
    border: 2px solid var(--primary-200);
    border-top-color: var(--primary-500);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  &__check {
    color: var(--color-success-500);
  }

  &__error {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: var(--color-danger-500);
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: @white;
    border: 1px solid @neutral-200;
    border-radius: 16px;
    box-shadow:
      0 4px 24px rgba(0, 0, 0, 0.08),
      0 12px 48px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    z-index: 1000;
    max-height: 360px;
    overflow-y: auto;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 14px 16px;
    background: transparent;
    border: none;
    border-bottom: 1px solid @neutral-100;
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;

    &:last-of-type {
      border-bottom: none;
    }

    &:hover,
    &--active {
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.04) 0%,
        rgba(var(--primary-500-rgb), 0.02) 100%
      );
    }

    &--active {
      .address-autocomplete__item-icon {
        background: var(--primary-500);
        color: @white;
      }
    }
  }

  &__item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: @neutral-100;
    border-radius: 10px;
    color: @neutral-500;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  &__item-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__item-main {
    font-size: 14px;
    font-weight: 500;
    color: @neutral-900;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__item-secondary {
    font-size: 12px;
    color: @neutral-500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__item-postcode {
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-600);
    background: rgba(var(--primary-500-rgb), 0.08);
    padding: 4px 10px;
    border-radius: 8px;
    flex-shrink: 0;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px;
    background: @neutral-50;
    border-top: 1px solid @neutral-100;
    font-size: 11px;
    color: @neutral-400;

    svg {
      color: @neutral-300;
    }
  }
}

// Animation dropdown
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// Responsive
.respond-mobile({
  .address-autocomplete {
    &__dropdown {
      max-height: 280px;
    }

    &__item {
      padding: 12px 14px;
      min-height: 44px;
    }

    &__item-icon {
      width: 36px;
      height: 36px;
    }

    &__item-postcode {
      font-size: 12px;
      padding: 3px 8px;
    }
  }
});
</style>
