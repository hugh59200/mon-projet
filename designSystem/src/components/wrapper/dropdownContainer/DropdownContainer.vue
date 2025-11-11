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

    <!-- ✅ Normal rendering -->
    <div
      v-if="!finalPortal && isOpen && !disabled"
      class="dropdown__menu"
      ref="menuRef"
      role="listbox"
    >
      <ClickOutside @close="closeFromOutside">
        <slot name="dropdown-items" />
      </ClickOutside>
    </div>

    <!-- ✅ Portal rendering -->
    <teleport
      v-if="finalPortal"
      to="body"
    >
      <transition name="dropdown-fade">
        <div
          v-if="isOpen && !disabled"
          class="dropdown__menu--portal"
          ref="menuRef"
          role="listbox"
          :style="portalStyle"
        >
          <ClickOutside @close="closeFromOutside">
            <slot name="dropdown-items" />
          </ClickOutside>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts" generic="TDropdownItem = DropdownItem">
  import { useDialog } from '@/features/interface/dialog'
  import { useAutoId, type DropdownItem, type DropdownProps } from '@designSystem/components'
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import type { DropdownContainerEvent } from './DropdownContainer.types'
  import { useDropdownMenuHandler } from './useDropdownMenuHandler'

  const id = useAutoId('input-dropdown')
  const dropdownRef = ref<HTMLElement | null>(null)
  const menuRef = ref<HTMLElement | null>(null)

  const emit = defineEmits<DropdownContainerEvent>()
  const isFocused = ref(false)

  /**
   * ✅ NEW:
   *   - usePortalMenu (manual override)
   *   - autoPortalMenu (auto detection)
   */
  const props = withDefaults(
    defineProps<
      DropdownProps<TDropdownItem> & {
        usePortalMenu?: boolean | null // true/false override, null = auto
      }
    >(),
    {
      size: 'medium',
      disabled: false,
      readonly: false,
      dropdownType: 'form',
      selectedLabel: '',
      usePortalMenu: null, // null = auto detect
    },
  )

  const { isOpen, dropdownDirection, computedItems, updateDropdownVisibilityAndDirection } =
    useDropdownMenuHandler(props.items, props.keyId, props.keyLabel, props.keyIconName, dropdownRef)

  const dynamicPlaceholder = computed(() => {
    if (props.readonly) return 'Sélection impossible (Lecture seule)'
    if (computedItems.value.length === 0) return 'Aucun élément disponible'
    if (!props.selectedLabel) return props.placeholder || 'Sélectionner une option'
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

  /* ✅ AUTO-PROTECTION: detect if portal is needed */
  const autoPortal = ref(false)

  const detectPortalNeeded = () => {
    const el = dropdownRef.value
    if (!el) return

    const cs = getComputedStyle(el)
    const parents = [el, ...ancestors(el)]

    const hasGrid = parents.some((p) => getComputedStyle(p).display === 'grid')
    const hasOverflowClip = parents.some((p) => {
      const { overflow, overflowY } = getComputedStyle(p)
      return (
        ['hidden', 'auto', 'scroll', 'clip'].includes(overflow) ||
        ['hidden', 'auto', 'scroll', 'clip'].includes(overflowY)
      )
    })

    autoPortal.value = hasGrid || hasOverflowClip
  }

  // helper: get all ancestors
  function ancestors(el: HTMLElement) {
    const list: HTMLElement[] = []
    let current = el.parentElement
    while (current) {
      list.push(current)
      current = current.parentElement
    }
    return list
  }

  /** ✅ Decide final behavior:
   *  - if prop.usePortalMenu === true → portal ON
   *  - if prop.usePortalMenu === false → portal OFF
   *  - if null (default) → autodetect
   */
  const finalPortal = computed(() => {
    if (props.usePortalMenu === true) return true
    if (props.usePortalMenu === false) return false
    return autoPortal.value
  })

  /** ✅ PORTAL POSITIONING */
  const portalStyle = ref<Record<string, string>>({})
  const OFFSET = 6

  const updatePortalPosition = () => {
    if (!finalPortal.value || !dropdownRef.value || !menuRef.value) return

    const rect = dropdownRef.value.getBoundingClientRect()
    const menuHeight = menuRef.value.offsetHeight
    let top = rect.bottom + OFFSET

    if (dropdownDirection.value === 'up') {
      top = rect.top - menuHeight - OFFSET
    }

    portalStyle.value = {
      position: 'fixed',
      top: `${top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: '99999',
    }
  }

  watch(isOpen, async (open) => {
    if (open && finalPortal.value) {
      await nextTick()
      updateDropdownVisibilityAndDirection()
      updatePortalPosition()
    }
  })

  onMounted(() => {
    detectPortalNeeded()

    if (!finalPortal.value) return
    window.addEventListener('scroll', updatePortalPosition, true)
    window.addEventListener('resize', updatePortalPosition)
  })

  onBeforeUnmount(() => {
    if (!finalPortal.value) return
    window.removeEventListener('scroll', updatePortalPosition, true)
    window.removeEventListener('resize', updatePortalPosition)
  })
</script>

<style lang="less">
  @import 'DropdownContainer.less';

  /* ✅ Transition */
  .dropdown-fade-enter-active,
  .dropdown-fade-leave-active {
    transition:
      opacity 0.15s ease,
      transform 0.15s ease;
  }
  .dropdown-fade-enter-from,
  .dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }

  /* ✅ Portal menu styling */
  .dropdown__menu--portal {
    background: @white;
    border: 1px solid @neutral-200;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    max-height: 240px;
    overflow-y: auto;
    padding: 4px 0;

    /* Scrollbar custom */
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: @neutral-100;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background: @neutral-300;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: @neutral-400;
    }

    scrollbar-width: thin;
    scrollbar-color: @neutral-300 @neutral-100;
  }
</style>
