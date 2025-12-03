// Cypress E2E Support File

// Configuration Supabase
const SUPABASE_URL = 'https://dwomsbawthlktapmtmqu.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b21zYmF3dGhsa3RhcG10bXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjI2NDUsImV4cCI6MjA3NjA5ODY0NX0.rK_9sJzigfu_w24s5XvgFd7nM4RFkS99gQ3BXTCS1XY'

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

// Commande pour se connecter en tant qu'admin via l'API Supabase
Cypress.Commands.add('loginAsAdmin', () => {
  cy.fixture('admin').then((admin) => {
    cy.request({
      method: 'POST',
      url: `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: {
        email: admin.email,
        password: admin.password,
      },
    }).then((response) => {
      expect(response.status).to.eq(200)

      const { access_token, refresh_token, user } = response.body

      // Stocker la session dans le localStorage (format Supabase)
      const storageKey = `sb-dwomsbawthlktapmtmqu-auth-token`
      const session = {
        access_token,
        refresh_token,
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user,
      }

      cy.window().then((win) => {
        win.localStorage.setItem(storageKey, JSON.stringify(session))
      })
    })
  })
})

// Commande pour se connecter en tant qu'utilisateur (via fixture user.json)
Cypress.Commands.add('loginAsUser', () => {
  cy.fixture('user').then((user) => {
    cy.request({
      method: 'POST',
      url: `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: {
        email: user.email,
        password: user.password,
      },
    }).then((response) => {
      expect(response.status).to.eq(200)

      const { access_token, refresh_token, user: userData } = response.body

      const storageKey = `sb-dwomsbawthlktapmtmqu-auth-token`
      const session = {
        access_token,
        refresh_token,
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: userData,
      }

      cy.window().then((win) => {
        win.localStorage.setItem(storageKey, JSON.stringify(session))
      })
    })
  })
})

// Commande pour se déconnecter
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('sb-dwomsbawthlktapmtmqu-auth-token')
  })
})

// Commande pour ajouter un produit au panier (via la page produit)
Cypress.Commands.add('addProductToCart', () => {
  cy.visit('/catalogue')
  cy.get('[class*="product-card"]').first().click()
  cy.url().should('match', /\/catalogue\/[a-z0-9-]+/)
  cy.get('.product__actions button, [class*="product-actions"] button')
    .contains(/panier|cart|ajouter/i)
    .click()
  cy.get('.compact-toast, .toast').should('be.visible')
})

// Commande pour ouvrir le chat widget
Cypress.Commands.add('openChatWidget', () => {
  cy.get('.chat-widget__toggle').click()
  cy.get('.chat-widget__window').should('be.visible')
})

// Commande pour fermer le chat widget
Cypress.Commands.add('closeChatWidget', () => {
  cy.get('.chat-widget__toggle').click()
  cy.get('.chat-widget__window').should('not.exist')
})

// Commande pour naviguer vers l'admin (helper)
Cypress.Commands.add('visitAdmin', (section: 'produits' | 'utilisateurs' | 'commandes' | 'messagerie') => {
  cy.visit(`/admin/${section}`)
})

// Commande pour sélectionner un point relais
Cypress.Commands.add('selectRelayPoint', (postcode: string) => {
  cy.get('.relay-selector__trigger').click()
  cy.get('.relay-modal__search-input').type(postcode)
  cy.get('.relay-modal__search-btn').click()
  cy.get('.relay-point', { timeout: 10000 }).first().click()
})

// Commande helper pour les assertions "or" (fallback)
Cypress.Commands.add('shouldOr', { prevSubject: true }, (subject, assertion1, assertion2) => {
  try {
    cy.wrap(subject).should(assertion1)
  } catch {
    cy.wrap(subject).should(assertion2)
  }
})

// Déclaration TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      bypassAgeGate(): Chainable<void>
      addProductToCart(): Chainable<void>
      openChatWidget(): Chainable<void>
      closeChatWidget(): Chainable<void>
      visitAdmin(section: 'produits' | 'utilisateurs' | 'commandes' | 'messagerie'): Chainable<void>
      selectRelayPoint(postcode: string): Chainable<void>
      shouldOr(assertion1: string, assertion2: string): Chainable<void>
      loginAsAdmin(): Chainable<void>
      loginAsUser(): Chainable<void>
      logout(): Chainable<void>
    }
  }
}

export {}
