<template>
  <DropdownContainer
    :size
    :items
    :selectedLabel
    :mode
    :variant
    @on-key-down="onKeyDown"
  >
    <template #dropdown-items>
      <BasicDropdownItem
        v-for="item in items"
        :label="item.label"
        :iconName="item.iconName"
        :active="isActive(item.id)"
        :mode
        @click="selectItem(item.id)"
      />
    </template>
  </DropdownContainer>
</template>

<script
  setup
  lang="ts"
  generic="
    TDropdownItem extends DropdownItem = DropdownItem,
    TDropdownKey extends DropdownId = DropdownId
  "
>
  import type { DropdownId, DropdownItem, DropdownProps } from '@designSystem/components'
  import { toRef } from 'vue'
  import { useDropdownSelection } from './useDropdownSelection'

  const props = withDefaults(defineProps<DropdownProps<TDropdownItem>>(), {
    placeholder: 'Sélectionnez un élément',
    mode: 'single',
    deletable: true,
  })

  type DropdownModelType = TDropdownKey | TDropdownKey[]

  const dropdownKey = defineModel<DropdownModelType>()

  const { isActive, selectItem, selectedLabel } = useDropdownSelection({
    mode: props.mode,
    readonly: props.readonly,
    items: toRef(props, 'items'),
    model: dropdownKey,
  })

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault()
  }
</script>
