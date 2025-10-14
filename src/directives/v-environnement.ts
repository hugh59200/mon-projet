import type { Environnements } from '@/features/application/shared/Environnements.types'
import type { Directive } from 'vue'

type EnvDirectiveValue =
  | {
      autorise: Environnements[]
      refuse?: undefined
    }
  | {
      autorise?: undefined
      refuse: Environnements[]
    }

export const vEnvironnement: Directive<HTMLElement, EnvDirectiveValue> = {
  mounted(element, binding) {
    const { autorise = [], refuse = [] } = binding.value
    const currentEnv = import.meta.env.VITE_ENV as Environnements

    if (autorise.length > 0 && !autorise?.includes(currentEnv)) {
      element.style.display = 'none'
      return
    }

    if (refuse.length > 0 && refuse.includes(currentEnv)) {
      element.style.display = 'none'
    }
  },
}
