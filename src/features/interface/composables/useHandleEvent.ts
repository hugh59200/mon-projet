import { onBeforeUnmount, onMounted } from 'vue'

export function useHandleEvent<TEvent extends Event>(target: Node, event: string, handler: (event: TEvent) => void) {
  const handleEvent = (event: TEvent) => {
    handler(event)
  }

  onMounted(() => {
    target.addEventListener(event, handleEvent as EventListenerOrEventListenerObject)
  })

  onBeforeUnmount(() => {
    target.removeEventListener(event, handleEvent as EventListenerOrEventListenerObject)
  })
}
