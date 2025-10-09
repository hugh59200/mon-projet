import { useEventBus } from "@/features/application/app-events/AppEvents";
import { watch, type Ref } from "vue";

export function useHideOnNavigate(visible: Ref<boolean | undefined>, hideCallback?: () => void) {
  const eventBus = useEventBus()

  let unregister: (() => void) | undefined

  function hide() {
    if (visible.value) {
      if (hideCallback) {
        hideCallback.call(null)
      } else {
        visible.value = false
      }
    }
  }

  watch(visible, (newValue, oldValue) => {
    if (newValue === oldValue) return
    if (newValue) {
      unregister = eventBus?.on('BeforeRouteLeave', hide)
    } else {
      unregister?.call(null)
      unregister = undefined
    }
  })
}

