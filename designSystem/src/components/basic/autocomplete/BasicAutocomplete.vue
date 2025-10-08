<template>
  <div
    ref="dropdown"
    :class="[
      'dropdown',
      `dropdown--${size}`,
      `dropdown--${direction}`,
      { 'dropdown--disabled': disabled },
      { 'dropdown--readonly': readonly },
    ]"
  >
    <input
      type="text"
      :id
      v-model="saisie"
      :placeholder
      :disabled
      :readonly
      class="dropdown__input"
      @blur="() => (isFocused = false)"
      @focus="onFocus"
      @keydown="onKeyDown"
      autocomplete="off"
    />
    <BasicIcon :name="isLoading ? 'spinner' : 'search'" />
    <ClickOutside
      v-if="isOpen"
      @close="isOpen = false"
      :class="['dropdown__menu', { 'dropdown__menu--no-data': isError || items.length === 0 }]"
    >
      <BasicDropdownItem
        v-for="(item, index) in items"
        :id="makeId(index)"
        :key="index"
        :label="calcItemLabel(item as any)"
        :size
        @select="selectItem(item as any)"
        :active="selectIndex === index"
      >
        <slot v-bind="item"></slot>
      </BasicDropdownItem>
      <BasicAlert
        v-if="isError"
        alertLabel="Une erreur réseau est survenue"
      />
      <BasicAlert
        v-else-if="items.length === 0"
        alertType="warning"
        :alertLabel="emptyResultLabel"
      />
    </ClickOutside>
  </div>
</template>

<script setup lang="ts" generic="TAutocompleteItem extends object = AutocompleteItem">
  import { computed, ref, shallowRef, watch } from 'vue'
  import { useAutoId } from '@designSystem/components'
  import { useScrollIntoView } from '@/features/interface/composables/useScrollIntoView'
  import { useDebounce } from '@/features/shared/tools/debounce'
  import {
    isNullOrUndefined,
    objectGetValueWithNestedKey,
    objectSetValueWithNestedKey,
  } from '@/features/shared/tools/object'
  import ClickOutside from '../click-outside/ClickOutside.vue'
  import type { AutocompleteEmits, AutocompleteItem, AutocompleteProps } from './BasicAutocomplete.types'

  const id = useAutoId('input-autocomplete')

  const modelValue = defineModel<TAutocompleteItem>()
  const emits = defineEmits<AutocompleteEmits>()

  const props = withDefaults(defineProps<AutocompleteProps<TAutocompleteItem>>(), {
    placeholder: 'Sélectionnez un element',
    disabled: false,
    readonly: false,
    size: 'medium',
    strict: false,
    emptyResultLabel: 'Aucun résultat',
    debounce: 500,
    direction: 'down',
  })

  const debounce = useDebounce(props.debounce)
  const items = shallowRef<TAutocompleteItem[]>([])
  const { makeId, makeVisible } = useScrollIntoView()

  const keyId = computed(() => props.keyId ?? 'id')
  const keyLabel = computed(() => props.keyLabel ?? 'label')

  const calcInputText = function (item?: TAutocompleteItem | null) {
    // Pas d'item
    if (!item) return ''
    // Pas d'id
    const id = objectGetValueWithNestedKey(item as any, keyId.value)
    const label = objectGetValueWithNestedKey(item as any, keyLabel.value) as string
    if (!id) return label

    //Applique le formatge
    if (props.getInputText) {
      return props.getInputText(item) ?? ''
    } else {
      return label
    }
  }

  const calcItemLabel = function (item?: TAutocompleteItem | null) {
    if (!item) return ''
    if (props.getItemLabel) {
      return props.getItemLabel(item) ?? ''
    } else {
      return (objectGetValueWithNestedKey(item as any, keyLabel.value) as string) ?? ''
    }
  }
  const selectIndex = ref(-1)

  const text = ref(calcInputText(modelValue.value))

  const saisie = computed<string>({
    get() {
      return text.value
    },
    set(value) {
      text.value = value

      items.value = []
      isOpen.value = false
      selectIndex.value = -1

      const newModel: any = {}
      objectSetValueWithNestedKey(newModel, keyId.value, null)
      objectSetValueWithNestedKey(newModel, keyLabel.value, value)
      modelValue.value = newModel
      if (value.length < (props.searchMinLength ?? 0)) {
        emits('update:lastSearchResultCount', 'no-search')
        return
      }
      openMenu(value)
    },
  })

  const isOpen = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const isFocused = ref<boolean>(false)
  const isError = ref<boolean>(false)

  watch(modelValue, () => {
    if (!modelValue.value) {
      text.value = ''
    } else {
      text.value = calcInputText(modelValue.value)
    }
  })

  watch([isFocused, isOpen], () => {
    if (!props.strict) return
    if (isFocused.value || isOpen.value) return
    if (!modelValue.value) return
    if (!isNullOrUndefined(objectGetValueWithNestedKey(modelValue.value as any, keyId.value))) return
    modelValue.value = null as any
  })

  let controller: AbortController | null = null
  async function openMenu(search: string) {
    controller?.abort()
    controller = new AbortController()
    const signal = controller.signal
    emits('update:lastSearchResultCount', 'searching')
    debounce(async () => {
      try {
        isLoading.value = true
        isError.value = false

        if (signal.aborted) return
        const searchQuery = props.searchFormater?.call(null, search) ?? search
        const searchResult = await props.search(searchQuery, signal)
        if (signal.aborted) return // Si le search n'utilise pas le signal

        items.value = searchResult
        isOpen.value = true
        selectIndex.value = searchResult.length > 0 ? 0 : -1
        emits('update:lastSearchResultCount', items.value.length)
      } catch (error) {
        // Vérifier si l'erreur est due à l'annulation de la requête
        if (error instanceof DOMException && error.name === 'AbortError') {
          // Requête annulée - ne pas traiter comme une erreur
          return
        }

        isError.value = true
        isOpen.value = true
        selectIndex.value = -1
        emits('update:lastSearchResultCount', 'error')
      } finally {
        isLoading.value = false
      }
    })
  }

  const selectItem = (item: TAutocompleteItem) => {
    isOpen.value = false
    modelValue.value = item
    selectIndex.value = -1
  }

  const onKeyDown = function (event: KeyboardEvent) {
    if (isOpen.value === false) return
    if (items.value.length === 0) return
    if (event.key === 'ArrowDown') {
      if (selectIndex.value < items.value.length - 1) selectIndex.value++
      else selectIndex.value = 0
      makeVisible(selectIndex.value)
    } else if (event.key === 'ArrowUp') {
      if (selectIndex.value > 0) selectIndex.value--
      else selectIndex.value = items.value.length - 1
      makeVisible(selectIndex.value)
    } else if (event.key === 'Enter') {
      selectItem(items.value[selectIndex.value])
    }
  }

  const onFocus = function () {
    isFocused.value = true
    if (props.searchMinLength === 0 && !text.value) {
      saisie.value = ''
    }
  }
</script>

<style lang="less">
  @import '../../wrapper/dropdownContainer/DropdownContainer.less';

  input {
    cursor: text !important;
  }

  :deep(.dropdown-item) {
    > * {
      margin-left: 10px;
    }
  }
</style>
