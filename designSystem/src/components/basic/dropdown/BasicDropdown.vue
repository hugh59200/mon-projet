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
        @click="() => selectItem(item.id as T)"
      />
    </template>
  </DropdownContainer>
</template>

<script setup lang="ts" generic="T extends string | number | boolean | undefined">
  import type { DropdownItem, DropdownProps } from '@designSystem/components'
  import { useDropdownMenuHandler } from '@designSystem/components/wrapper/dropdownContainer/useDropdownMenuHandler'
  import { useDropdownNavigation } from '@designSystem/components/wrapper/dropdownContainer/useDropdownNavigation'
  import { computed } from 'vue'

  const props = withDefaults(defineProps<DropdownProps<DropdownItem<T>>>(), {
    placeholder: 'Sélectionnez un élément',
    forceValue: false,
    deletable: true,
  })

  const dropdownKey = defineModel<T>()

  const { isOpen, computedItems } = useDropdownMenuHandler<DropdownItem<T>>(
    props.items,
    props.keyId,
    props.keyLabel,
    props.keyIconName,
  )

  const { selectIndex, makeId, handleArrowDownKey, handleArrowUpKey, handleTab, handleSpace } =
    useDropdownNavigation(computedItems, isOpen)

  // ✅ Typage exact
  const selectItem = (dropdownId: T | undefined) => {
    if (dropdownId === undefined) return
    if (props.readonly) return

    dropdownKey.value =
      props.forceValue !== true && dropdownKey.value === dropdownId ? undefined : dropdownId
  }

  // ✅ Label dynamique
  const selectedLabel = computed(() => {
    if (!dropdownKey.value) return ''
    const item = computedItems.value.find((i) => i.id === dropdownKey.value)
    return item?.label ?? ''
  })

  // ✅ Navigation clavier
  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        isOpen.value = !isOpen.value
        break
      case ' ':
        event.preventDefault()
        handleSpace()
        selectItem(computedItems.value[selectIndex.value]?.id as T)
        break
      case 'ArrowDown':
        event.preventDefault()
        handleArrowDownKey()
        selectItem(computedItems.value[selectIndex.value]?.id as T)
        break
      case 'ArrowUp':
        event.preventDefault()
        handleArrowUpKey()
        selectItem(computedItems.value[selectIndex.value]?.id as T)
        break
      case 'Tab':
        handleTab()
        break
    }
  }
</script>
