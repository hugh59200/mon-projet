// Cypress E2E Support File

// Bypass Age Gate avant chaque test
beforeEach(() => {
  cy.window().then((win) => {
    win.localStorage.setItem('atlas_age_verified', 'true')
  })
})

// Commande personnalisée pour bypasser l'Age Gate
Cypress.Commands.add('bypassAgeGate', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('atlas_age_verified', 'true')
  })
})

// Ignorer les erreurs de certificat SSL
Cypress.on('uncaught:exception', () => false)

// Déclaration TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      bypassAgeGate(): Chainable<void>
    }
  }
}

export {}
