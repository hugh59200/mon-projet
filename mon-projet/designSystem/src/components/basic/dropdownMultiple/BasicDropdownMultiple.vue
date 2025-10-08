<template>
  <DropdownContainer
    :size
    :items="computedItems"
    :dropdownType
    :readonly
    :alertLabel
    :selectedLabel
    :placeholder
    :deletable
    :disabled="!computedItems?.length || disabled"
    :alertType
    @on-key-down="onKeyDown"
    @deleting="dropdownKey = props.forceValue ? dropdownKey : undefined"
  >
    <template #dropdown-items>
      <BasicDropdownItem
        v-for="(item, index) in computedItems"
        :id="makeId(index)"
        :key="index"
        :label="item.label"
        :iconName="item.iconName"
        :size
        :active="dropdownKey?.some((id) => id === item.id)"
        :highlighted="selectIndex === index"
        @click="(selectItem(item.id), (isOpen = false))"
      />
    </template>
  </DropdownContainer>
</template>

<script setup lang="ts" generic="TDropdownItem = DropdownItem, TDropdownKey extends DropdownId = DropdownId">
  import { computed } from 'vue'
  import type { DropdownProps, DropdownItem, DropdownId } from '@designSystem/components'
  import { useDropdownMenuHandler } from '@designSystem/components/wrapper/dropdownContainer/useDropdownMenuHandler'
  import { useDropdownNavigation } from '@designSystem/components/wrapper/dropdownContainer/useDropdownNavigation'

  const props = withDefaults(defineProps<DropdownProps<TDropdownItem>>(), {
    placeholder: 'Sélectionnez un ou plusieurs éléments',
    deletable: true,
  })

  const dropdownKey = defineModel<TDropdownKey[]>()

  const { isOpen, computedItems } = useDropdownMenuHandler<TDropdownItem>(
    props.items,
    props.keyId,
    props.keyLabel,
    props.keyIconName,
  )

  const { selectIndex, makeId, handleArrowDownKey, handleArrowUpKey, handleTab, handleSpace } = useDropdownNavigation(
    computedItems,
    isOpen,
  )

  const selectItem = (dropdownId: DropdownId) => {
    if (props.readonly) return

    const newModel = [...(dropdownKey.value ?? [])]
    const selectedIndex = newModel.findIndex((id) => id === dropdownId)

    if (selectedIndex >= 0) {
      newModel.splice(selectedIndex, 1)
    } else {
      newModel.push(dropdownId as TDropdownKey)
    }
    dropdownKey.value = newModel
  }

  const selectedLabel = computed(() => {
    if (!dropdownKey.value || dropdownKey.value.length === 0) return ''
    return dropdownKey.value
      .map((id) => computedItems.value.find((item) => item.id === id))
      .filter((item) => item)
      .map((item) => item!.label)
      .join(', ')
  })

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleSpace()
        selectItem(computedItems.value[selectIndex.value].id)
        break
      case 'ArrowDown':
        event.preventDefault()
        handleArrowDownKey()
        break
      case 'ArrowUp':
        event.preventDefault()
        handleArrowUpKey()
        break
      case 'Tab':
        handleTab()
        break
      default:
        break
    }
  }
</script>
