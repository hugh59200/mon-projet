export function useDebounce(delay: number) {
  let timeoutId: NodeJS.Timeout
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return function(callback: Function) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      callback()
    }, delay)
  }
}
