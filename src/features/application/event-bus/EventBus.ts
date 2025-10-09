export type BusEvent<T extends string = string, F = void> =
  T extends '*' ? never : F extends void ? { name: T } : { name: T, arg: F }

export type BusEventName<B extends BusEvent> = B['name']
export type EventBusCallBack<B extends BusEvent, Name extends BusEventName<B> | '*' = BusEventName<B> | '*'> =
  Name extends '*' ?
  (event: B) => void :
  (event: Extract<B, { name: Name }>) => void

export type BusEventOnOption = { once?: boolean }

export type BusEventErrorCallBack<B extends BusEvent> = (err: BusEventError<B>) => void
export class BusEventError<B extends BusEvent> extends Error {
  readonly event: BusEvent<BusEventName<B>>
  readonly #cause: Error
  constructor(event: BusEvent<BusEventName<B>>, error: Error) {
    super("EventBus a interpecté une erreur au dispatch")
    this.#cause = error
    this.event = event
  }
  get cause(): Error {
    return this.#cause
  }
}

export class EventBus<B extends BusEvent> {
  #handlers = new Map<BusEventName<B> | '*', Set<EventBusCallBack<B>>>()
  #handlersOnce = new Map<BusEventName<B> | '*', Set<EventBusCallBack<B>>>()
  #errorHandlers = new Set<BusEventErrorCallBack<B>>()

  on<T extends BusEventName<B> | '*'>(
    eventName: T,
    callback: EventBusCallBack<B, T>,
    option?: BusEventOnOption
  ): () => void {
    if (!this.#handlers.has(eventName)) {
      this.#handlers.set(eventName, new Set<EventBusCallBack<B>>())
    }

    // Register callback
    this.#handlers.get(eventName)!.add(callback)
    if (option?.once === true) {
      if (!this.#handlersOnce.has(eventName)) {
        this.#handlersOnce.set(eventName, new Set<EventBusCallBack<B>>())
      }
      this.#handlersOnce.get(eventName)!.add(callback)
    }

    // Un-Register callback
    return () => {
      this.#handlers.get(eventName)?.delete(callback)
      if (!this.#handlers.get(eventName)?.size) {
        this.#handlers.delete(eventName)
      }

      if (option?.once === true) {
        this.#handlersOnce.get(eventName)?.delete(callback)
        if (!this.#handlersOnce.get(eventName)?.size) {
          this.#handlersOnce.delete(eventName)
        }
      }
    }
  }

  onError(handler: BusEventErrorCallBack<B>): () => void {
    this.#errorHandlers.add(handler)
    return () => {
      this.#errorHandlers.delete(handler)
    }
  }

  #dispatchError(event: B, err: Error): void {
    this.#errorHandlers.forEach(handler => {
      const busError = new BusEventError<B>(event as any, err)
      try {
        handler(busError)
      } catch (err) {
        console.error(`EventBus.#errorHandlers à retourné une erreur sur ${event.name}.`, err)
      }
    })
  }

  dispatch(event: B) {
    const handlers = new Set([...this.#handlers.get(event.name) ?? [], ...this.#handlers.get('*') ?? []])
    handlers.forEach(handler => {
      try {
        handler(event as any)

        // Traite le once
        if (this.#handlersOnce.get(event.name)?.delete(handler)) {
          if (!this.#handlersOnce.get(event.name)?.size) {
            this.#handlersOnce.delete(event.name)
          }
          this.#handlers.get(event.name)?.delete(handler)
        }

      } catch (err) {
        this.#dispatchError(event, err as Error)
      }
    })
  }
}
