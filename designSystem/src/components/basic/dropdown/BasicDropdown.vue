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
    :force-value
    @on-key-down="onKeyDown"
    @deleting="dropdownKey = props.forceValue ? dropdownKey : undefined"
  >
    <template #dropdown-items>
      <BasicDropdownItem
        v-for="(item, index) in computedItems"
        :key="index"
        :id="makeId(index)"
        :label="item.label"
        :iconName="item.iconName"
        :size
        :active="dropdownKey === item.id"
        @click="selectItem(item.id)"
      />
    </template>
  </DropdownContainer>
</template>

<script
  setup
  lang="ts"
  generic="TDropdownItem = DropdownItem, TDropdownKey extends DropdownId = DropdownId"
>
  import type { DropdownId, DropdownItem, DropdownProps } from '@designSystem/components'
  import { useDropdownMenuHandler } from '@designSystem/components/wrapper/dropdownContainer/useDropdownMenuHandler'
  import { useDropdownNavigation } from '@designSystem/components/wrapper/dropdownContainer/useDropdownNavigation'
  import { computed, unref } from 'vue'

  const props = withDefaults(defineProps<DropdownProps<TDropdownItem>>(), {
    placeholder: 'Sélectionnez un élément',
    forceValue: false,
    deletable: true,
  })

  const dropdownKey = defineModel<TDropdownKey>()

  const resolvedItems = computed(() => unref(props.items) ?? [])

  const { isOpen, computedItems } = useDropdownMenuHandler<TDropdownItem>(
    resolvedItems,
    props.keyId,
    props.keyLabel,
    props.keyIconName,
  )
  const { selectIndex, makeId, handleArrowDownKey, handleArrowUpKey, handleTab, handleSpace } =
    useDropdownNavigation(computedItems, isOpen)

  const selectItem = (dropdownId: DropdownId) => {
    if (props.readonly) return
    if (props.forceValue !== true && dropdownKey.value === dropdownId) {
      dropdownKey.value = undefined
    } else {
      dropdownKey.value = dropdownId as TDropdownKey
    }
  }

  const selectedLabel = computed(() => {
    if (dropdownKey.value === null || dropdownKey.value === undefined) return ''
    const item = computedItems.value.find((item) => item.id === dropdownKey.value)
    return item ? item.label : ''
  })

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        isOpen.value = !isOpen.value
        break
      case ' ':
        event.preventDefault()
        handleSpace()
        selectItem(computedItems.value[selectIndex.value]!.id)
        break
      case 'ArrowDown':
        event.preventDefault()
        handleArrowDownKey()
        selectItem(computedItems.value[selectIndex.value]!.id)
        break
      case 'ArrowUp':
        event.preventDefault()
        handleArrowUpKey()
        selectItem(computedItems.value[selectIndex.value]!.id)
        break
      case 'Tab':
        handleTab()
        break
      default:
        break
    }
  }
</script>
