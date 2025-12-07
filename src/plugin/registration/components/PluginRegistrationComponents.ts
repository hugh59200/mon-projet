import type { App } from 'vue'

declare module 'vue' {
  export interface GlobalComponents {
    BasicAlert: (typeof import('@designSystem/components/basic/alert/BasicAlert.vue'))['default']
    BasicBadge: (typeof import('@designSystem/components/basic/badge/BasicBadge.vue'))['default']
    PremiumButton: (typeof import('@designSystem/components/basic/button/PremiumButton.vue'))['default']
    BasicCheckbox: (typeof import('@designSystem/components/basic/checkbox/BasicCheckbox.vue'))['default']
    BasicDropdown: (typeof import('@designSystem/components/basic/dropdown/BasicDropdown.vue'))['default']
    BasicDropdownItem: (typeof import('@designSystem/components/basic/dropdownItem/BasicDropdownItem.vue'))['default']
    BasicHint: (typeof import('@designSystem/components/basic/hint/BasicHint.vue'))['default']
    BasicIconNext: (typeof import('@designSystem/components/basic/icon/BasicIconNext.vue'))['default']
    BasicInput: (typeof import('@designSystem/components/basic/input/BasicInput.vue'))['default']
    BasicInputLabel: (typeof import('@designSystem/components/basic/inputLabel/BasicInputLabel.vue'))['default']
    BasicInputNumber: (typeof import('@designSystem/components/basic/inputNumber/BasicInputNumber.vue'))['default']
    BasicLoader: (typeof import('@designSystem/components/basic/loader/BasicLoader.vue'))['default']
    BasicPagination: (typeof import('@designSystem/components/basic/pagination/BasicPagination.vue'))['default']
    BasicTab: (typeof import('@designSystem/components/basic/tab/BasicTab.vue'))['default']
    BasicTabs: (typeof import('@designSystem/components/basic/tabs/BasicTabs.vue'))['default']
    BasicText: (typeof import('@designSystem/components/basic/text/BasicText.vue'))['default']
    BasicTooltip: (typeof import('@designSystem/components/basic/tooltip/BasicTooltip.vue'))['default']
    ClickOutside: (typeof import('@designSystem/components/basic/click-outside/ClickOutside.vue'))['default']
    DropdownContainer: (typeof import('@designSystem/components/wrapper/dropdownContainer/DropdownContainer.vue'))['default']
    EmptyTablePlaceholder: (typeof import('@designSystem/components/basic/emptyTablePlaceholder/EmptyTablePlaceholder.vue'))['default']
    InputContainer: (typeof import('@designSystem/components/wrapper/inputContainer/InputContainer.vue'))['default']
    WrapperCheckbox: (typeof import('@designSystem/components/wrapper/checkbox/WrapperCheckbox.vue'))['default']
    WrapperDropdown: (typeof import('@designSystem/components/wrapper/dropdown/WrapperDropdown.vue'))['default']
    WrapperFormElements: (typeof import('@designSystem/components/wrapper/formElements/WrapperFormElements.vue'))['default']
    WrapperInput: (typeof import('@designSystem/components/wrapper/input/WrapperInput.vue'))['default']
    WrapperLabelHint: (typeof import('@designSystem/components/wrapper/labelHint/WrapperLabelHint.vue'))['default']
    ContentBlock: (typeof import('@designSystem/components/layout/ContentBlock.vue'))['default']
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
