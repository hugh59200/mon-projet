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
      :disabled="disabled"
      :readonly="readonly"
      role="combobox"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @keydown="emit('onKeyDown', $event)"
    />

    <!-- Alerte dans tableau -->
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

    <!-- ✅ Le menu est téléporté dans le body -->
    <Teleport to="body">
      <div
        v-if="isOpen && !disabled"
        ref="menuRef"
        class="dropdown__menu"
        :style="menuStyle"
        role="listbox"
      >
        <ClickOutside @close="closeFromOutside">
          <slot name="dropdown-items" />
        </ClickOutside>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import { useDialog } from '@/features/interface/dialog'
  import { useAutoId, type DropdownProps } from '@designSystem/components'
  import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
  import type { DropdownContainerEvent } from './DropdownContainer.types'
  import { useDropdownMenuHandler } from './useDropdownMenuHandler'

  const id = useAutoId('input-dropdown')
  const dropdownRef = ref<HTMLElement | null>(null)
  const menuRef = ref<HTMLElement | null>(null)

  const emit = defineEmits<DropdownContainerEvent>()

  const isFocused = ref(false)

  const props = withDefaults(defineProps<DropdownProps>(), {
    size: 'medium',
    disabled: false,
    readonly: false,
    dropdownType: 'form',
    selectedLabel: '',
  })

  const { isOpen, dropdownDirection, computedItems, updateDropdownVisibilityAndDirection } =
    useDropdownMenuHandler(props.items, props.keyId, props.keyLabel, props.keyIconName, dropdownRef)

  /* ✅ Placeholder */
  const dynamicPlaceholder = computed(() => {
    if (props.readonly) return 'Sélection impossible (Lecture seule)'
    if (!computedItems.value.length) return 'Aucun élément disponible'
    return props.placeholder || 'Sélectionner une option'
  })

  /* ✅ Peut-on afficher l’icône Clear ? */
  const canClear = computed(
    () =>
      !!props.selectedLabel &&
      !props.readonly &&
      !props.disabled &&
      !props.forceValue &&
      (isFocused.value || isOpen.value) &&
      computedItems.value.length > 0,
  )

  /* ✅ Position du menu téléporté */
  const menuStyle = ref<Record<string, string>>({})

  function updateMenuPosition() {
    const root = dropdownRef.value
    const menu = menuRef.value
    if (!root || !menu) return

    const rect = root.getBoundingClientRect()

    menuStyle.value = {
      position: 'absolute',
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: '9999',
    }
  }

  /* ✅ Repositionner quand il s’ouvre */
  watch(isOpen, async (open) => {
    if (open) {
      await nextTick()
      updateMenuPosition()
    }
  })

  /* ✅ Repositionner quand la fenêtre bouge / scroll / resize */
  window.addEventListener('scroll', updateMenuPosition, true)
  window.addEventListener('resize', updateMenuPosition)

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateMenuPosition, true)
    window.removeEventListener('resize', updateMenuPosition)
  })

  /* ✅ Fermer si clic extérieur */
  const closeFromOutside = (e: MouseEvent) => {
    if (!isOpen.value) return
    if (dropdownRef.value?.contains(e.target as Node)) return
    isOpen.value = false
  }

  /* ✅ Toggle */
  const toggleDropdown = async () => {
    if (props.disabled || props.readonly) return
    isOpen.value = !isOpen.value
    if (isOpen.value) updateDropdownVisibilityAndDirection()
  }

  /* ✅ Alerte table */
  const showAlert = (message: string) => {
    const dialog = useDialog()
    dialog.showDialog({ message, type: 'Error', closable: true })
  }
</script>

<style lang="less">
  @import 'DropdownContainer.less';
  /* ✅ important pour le menu téléporté */
  .dropdown__menu {
    position: absolute;
  }
</style>
