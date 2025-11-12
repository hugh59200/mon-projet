<template>
  <div
    ref="dropdownRef"
    :class="[
      'dropdown',
      `dropdown--${size}`,
      `dropdown--${dropdownType}`,
      `dropdown--${dropdownDirection}`,
      { 'dropdown--disabled': disabled, 'dropdown--readonly': readonly },
    ]"
    @click="toggleDropdown"
    @focusin="isFocused = true"
    @focusout="isFocused = false"
  >
    <input
      type="text"
      :id
      :value="selectedLabel"
      :placeholder="dynamicPlaceholder"
      :disabled
      :readonly
      role="combobox"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @keydown="emit('onKeyDown', $event)"
    />

    <BasicAlert
      v-if="dropdownType === 'table' && alertLabel"
      :class="[`dropdown--${dropdownType}--alert`]"
      @click="showAlert(alertLabel)"
      :alertLabel
      :alertType
      :alertMaxlength="50"
      wrap
      :has-label="false"
      :hasBg="false"
    />

    <BasicIcon
      v-if="canClear"
      name="close"
      pointer
      @click.stop="$emit('deleting', null)"
    />
    <BasicIcon
      :name="isOpen ? 'arrow-up' : 'arrow-down'"
      pointer
    />

    <div
      v-if="isOpen && !disabled"
      class="dropdown__menu"
      ref="menuRef"
      role="listbox"
    >
      <ClickOutside @close="closeFromOutside">
        <slot name="dropdown-items" />
      </ClickOutside>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TDropdownItem = DropdownItem">
  import { useDialog } from '@/features/interface/dialog'
  import { useAutoId, type DropdownItem, type DropdownProps } from '@designSystem/components'
  import { computed, ref } from 'vue'
  import type { DropdownContainerEvent } from './DropdownContainer.types'
  import { useDropdownMenuHandler } from './useDropdownMenuHandler'

  const id = useAutoId('input-dropdown')
  const dropdownRef = ref<HTMLElement | null>(null)
  const menuRef = ref<HTMLElement | null>(null)

  const emit = defineEmits<DropdownContainerEvent>()

  const isFocused = ref(false)

  const props = withDefaults(defineProps<DropdownProps<TDropdownItem>>(), {
    size: 'medium',
    disabled: false,
    readonly: false,
    dropdownType: 'form',
    selectedLabel: '',
  })

  const { isOpen, dropdownDirection, computedItems, updateDropdownVisibilityAndDirection } =
    useDropdownMenuHandler(props.items, props.keyId, props.keyLabel, props.keyIconName, dropdownRef)

  const dynamicPlaceholder = computed(() => {
    if (props.readonly) {
      return 'Sélection impossible (Lecture seule)'
    }

    if (computedItems.value.length === 0) {
      return 'Aucun élément disponible'
    }

    if (!props.selectedLabel) {
      return props.placeholder || 'Sélectionner une option'
    }

    return props.placeholder
  })

  const canClear = computed(
    () =>
      !!props.selectedLabel &&
      !props.readonly &&
      !props.disabled &&
      !props.forceValue &&
      (isFocused.value || isOpen.value) &&
      computedItems.value.length > 0,
  )

  const showAlert = (message: string) => {
    const dialog = useDialog()
    dialog.showDialog({ message, type: 'Error', closable: true })
  }

  const closeFromOutside = (e: MouseEvent) => {
    if (!isOpen.value) return
    if (dropdownRef.value?.contains(e.target as Node)) return
    isOpen.value = false
  }

  const toggleDropdown = async () => {
    if (props.disabled || props.readonly) return
    isOpen.value = !isOpen.value
    if (isOpen.value) updateDropdownVisibilityAndDirection()
  }
</script>

<style lang="less">
  @import 'DropdownContainer.less';
</style>
