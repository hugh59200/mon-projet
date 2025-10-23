import type { App } from 'vue'

declare module 'vue' {
  export interface GlobalComponents {
    BasicAlert: (typeof import('@designSystem/components/basic/alert/BasicAlert.vue'))['default']
    BasicAutocomplete: (typeof import('@designSystem/components/basic/autocomplete/BasicAutocomplete.vue'))['default']
    BasicAvatar: (typeof import('@designSystem/components/basic/avatar/BasicAvatar.vue'))['default']
    BasicBadge: (typeof import('@designSystem/components/basic/badge/BasicBadge.vue'))['default']
    BasicButton: (typeof import('@designSystem/components/basic/button/BasicButton.vue'))['default']
    BasicCard: (typeof import('@designSystem/components/basic/card/BasicCard.vue'))['default']
    BasicCheckbox: (typeof import('@designSystem/components/basic/checkbox/BasicCheckbox.vue'))['default']
    BasicDropdown: (typeof import('@designSystem/components/basic/dropdown/BasicDropdown.vue'))['default']
    BasicDropdownButton: (typeof import('@designSystem/components/basic/dropdownButton/BasicDropdownButton.vue'))['default']
    BasicDropdownItem: (typeof import('@designSystem/components/basic/dropdownItem/BasicDropdownItem.vue'))['default']
    BasicDropdownMultiple: (typeof import('@designSystem/components/basic/dropdownMultiple/BasicDropdownMultiple.vue'))['default']
    BasicHint: (typeof import('@designSystem/components/basic/hint/BasicHint.vue'))['default']
    BasicIconNext: (typeof import('@designSystem/components/basic/icon/BasicIconNext.vue'))['default']
    BasicIconTitleCard: (typeof import('@designSystem/components/basic/iconTitle/BasicIconTitleCard.vue'))['default']
    BasicInput: (typeof import('@designSystem/components/basic/input/BasicInput.vue'))['default']
    BasicInputDate: (typeof import('@designSystem/components/basic/inputDate/BasicInputDate.vue'))['default']
    BasicInputDuree: (typeof import('@designSystem/components/basic/inputDuree/BasicInputDuree.vue'))['default']
    BasicInputLabel: (typeof import('@designSystem/components/basic/inputLabel/BasicInputLabel.vue'))['default']
    BasicInputNumber: (typeof import('@designSystem/components/basic/inputNumber/BasicInputNumber.vue'))['default']
    BasicInputTelephone: (typeof import('@designSystem/components/basic/inputTelephone/BasicInputTelephone.vue'))['default']
    BasicLink: (typeof import('@designSystem/components/basic/link/BasicLink.vue'))['default']
    BasicLoader: (typeof import('@designSystem/components/basic/loader/BasicLoader.vue'))['default']
    BasicPagination: (typeof import('@designSystem/components/basic/pagination/BasicPagination.vue'))['default']
    BasicPopup: (typeof import('@designSystem/components/basic/popup/BasicPopup.vue'))['default']
    BasicSort: (typeof import('@designSystem/components/basic/sort/BasicSort.vue'))['default']
    BasicTab: (typeof import('@designSystem/components/basic/tab/BasicTab.vue'))['default']
    BasicTabs: (typeof import('@designSystem/components/basic/tabs/BasicTabs.vue'))['default']
    BasicTag: (typeof import('@designSystem/components/basic/tag/BasicTag.vue'))['default']
    BasicText: (typeof import('@designSystem/components/basic/text/BasicText.vue'))['default']
    BasicToggleSwitch: (typeof import('@designSystem/components/basic/toggleSwitch/BasicToggleSwitch.vue'))['default']
    BasicTooltip: (typeof import('@designSystem/components/basic/tooltip/BasicTooltip.vue'))['default']
    ClickOutside: (typeof import('@designSystem/components/basic/click-outside/ClickOutside.vue'))['default']
    DropdownContainer: (typeof import('@designSystem/components/wrapper/dropdownContainer/DropdownContainer.vue'))['default']
    EmptyTablePlaceholder: (typeof import('@designSystem/components/basic/emptyTablePlaceholder/EmptyTablePlaceholder.vue'))['default']
    InputContainer: (typeof import('@designSystem/components/wrapper/inputContainer/InputContainer.vue'))['default']
    WrapperAutocomplete: (typeof import('@designSystem/components/wrapper/autocomplete/WrapperAutocomplete.vue'))['default']
    WrapperButton: (typeof import('@designSystem/components/wrapper/button/WrapperButton.vue'))['default']
    WrapperCheckbox: (typeof import('@designSystem/components/wrapper/checkbox/WrapperCheckbox.vue'))['default']
    WrapperDropdown: (typeof import('@designSystem/components/wrapper/dropdown/WrapperDropdown.vue'))['default']
    WrapperDropdownMultiple: (typeof import('@designSystem/components/wrapper/dropdownMultiple/WrapperDropdownMultiple.vue'))['default']
    WrapperFormElements: (typeof import('@designSystem/components/wrapper/formElements/WrapperFormElements.vue'))['default']
    WrapperInput: (typeof import('@designSystem/components/wrapper/input/WrapperInput.vue'))['default']
    WrapperInputDate: (typeof import('@designSystem/components/wrapper/inputDate/WrapperInputDate.vue'))['default']
    WrapperInputDuree: (typeof import('@designSystem/components/wrapper/inputDuree/WrapperInputDuree.vue'))['default']
    WrapperInputNumber: (typeof import('@designSystem/components/wrapper/inputNumber/WrapperInputNumber.vue'))['default']
    WrapperLabelHint: (typeof import('@designSystem/components/wrapper/labelHint/WrapperLabelHint.vue'))['default']
    WrapperInputTelephone: (typeof import('@designSystem/components/wrapper/inputTelephone/WrapperInputTelephone.vue'))['default']
    WrapperToggleSwitch: (typeof import('@designSystem/components/wrapper/toggleSwitch/WrapperToggleSwitch.vue'))['default']
  }
}

export default {
  install(app: App) {
    const components = import.meta.glob('@designSystem/components/**/*/*.vue', {
      eager: true,
    })

    for (const path in components) {
      const component: any = components[path]

      // On prend le nom du fichier sans extension
      const match = path.match(/\/([^/]+)\.vue$/)
      if (!match) continue

      const fileName = match[1]

      // Enregistre le composant uniquement s'il exporte `default`
      if (component && component.default) {
        app.component(fileName!, component.default)
      }
    }
  },
}
