import { ref } from 'vue'

const isLoading = ref(false)
const message = ref('')

export function useAppLoader() {
  function show(msg = '') {
    message.value = msg
    isLoading.value = true
  }

  function hide() {
    isLoading.value = false
    message.value = ''
  }

  return {
    isLoading,
    message,
    show,
    hide,
  }
}
