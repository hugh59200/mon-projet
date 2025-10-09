import { describe, expect, it } from 'vitest'
import { EventBus, type BusEvent } from '../EventBus'
import { noop } from '@/features/shared/tools'

describe("EventBus", () => {
  type BusEventA = BusEvent<'A'>
  type BusEventB = BusEvent<'B', { unNombre: number }>

  it("utilise des évenements typés", () => {
    const eventBus = new EventBus<BusEventA | BusEventB>()
    eventBus.on("A", (event) => noop(event.name))
    eventBus.on("B", (event) => noop(event.arg.unNombre))
    eventBus.on("*", (event) => {
      if (event.name === "B") {
        noop(event.arg.unNombre)
      }
    })

    eventBus.dispatch({ name: "A" })
    eventBus.dispatch({ name: "B", arg: { unNombre: 1 } })
  })

  it("notifie les évenements", () => {
    const eventBus = new EventBus<BusEventA | BusEventB>()
    let compteur = 0

    eventBus.on("A", () => compteur++)
    eventBus.on("A", () => compteur++)

    eventBus.dispatch({ name: "A" })
    eventBus.dispatch({ name: "A" })

    expect(compteur).to.equal(4)
  })

  it("intercepte tous évenements avec *", () => {
    const eventBus = new EventBus<BusEventA | BusEventB>()
    let compteurA = 0
    let compteurEtoile = 0

    eventBus.on("*", event => {
      switch (event.name) {
        case "A":
          compteurA++;
          break;
        case "B":
          compteurEtoile += event.arg.unNombre;
          break;
      }
    })
    eventBus.on("A", () => compteurA++)

    eventBus.dispatch({ name: "A" })
    eventBus.dispatch({ name: "B", arg: { unNombre: 5 } })

    expect(compteurA).to.equal(2)
    expect(compteurEtoile).to.equal(5)
  })

  it("notifie tous les évenements malgrés les erreurs", () => {
    const eventBus = new EventBus<BusEventA | BusEventB>()
    let compteur = 0

    eventBus.on("A", () => compteur++)
    eventBus.on("A", () => { throw 'erreur' })
    eventBus.on("A", () => compteur++)
    eventBus.on("A", () => { throw 'erreur' })
    eventBus.on("A", () => compteur++)

    eventBus.dispatch({ name: "A" })

    expect(compteur).to.equal(3)
  })

  it("intercepte toutes les erreurs", () => {
    const eventBus = new EventBus<BusEventA | BusEventB>()
    let compteurErreurs = 0
    let compteurOnError = 0
    eventBus.on("A", noop)
    eventBus.on("A", () => {
      compteurErreurs++
      throw 'erreur'
    })
    eventBus.on("A", noop)
    eventBus.on("A", () => {
      compteurErreurs++
      throw 'erreur'
    })
    eventBus.on("A", noop)
    eventBus.onError(errEvent => {
      expect(errEvent.event.name).to.equal("A")
      expect(errEvent.cause).to.equal("erreur")
      compteurOnError++
    })

    eventBus.dispatch({ name: "A" })

    expect(compteurErreurs).to.equal(2)
    expect(compteurOnError).to.equal(2)
  })

  it("permet de désincrire un événement", () => {
    const eventBus = new EventBus<BusEventA | BusEventB>()
    let compteur1 = 0
    let compteur2 = 0

    const unRegister1 = eventBus.on("A", () => { compteur1++ })
    const unRegister2 = eventBus.on("A", () => { compteur2++ })

    // Emission de 3 dispatch
    eventBus.dispatch({ name: "A" })
    unRegister2()
    eventBus.dispatch({ name: "A" })
    unRegister1()
    eventBus.dispatch({ name: "A" })

    expect(compteur1).to.equal(2)
    expect(compteur2).to.equal(1)
  })

  it("n'execute un handler qu'une fois s'il dispose de l'option once", () => {
    const eventBus = new EventBus<BusEventA | BusEventB>()
    let compteur = 0

    eventBus.on("A", () => { compteur++ }, { once: true })
    eventBus.on("A", () => { compteur++ })

    // Emission de 2 dispatch
    eventBus.dispatch({ name: "A" })
    eventBus.dispatch({ name: "A" })

    expect(compteur).to.equal(1 + 2)
  })

})
