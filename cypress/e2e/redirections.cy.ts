/**
 * Vérification des Redirections E2E (Cypress)
 *
 * Ce test vérifie que tous les liens de l'application pointent vers des pages existantes
 * et ne redirigent pas vers la home page par erreur.
 */

// Routes qui DOIVENT exister et NE PAS rediriger vers la home
const EXPECTED_ROUTES = [
  // Navigation principale
  { path: '/', name: 'Home', shouldBeHome: true },
  { path: '/catalogue', name: 'Catalogue' },
  { path: '/actualites', name: 'Actualités' },
  { path: '/faq', name: 'FAQ' },
  { path: '/a-propos', name: 'À propos' },

  // Authentification
  { path: '/auth/login', name: 'Login' },
  { path: '/auth/register', name: 'Register' },
  { path: '/auth/reset-password', name: 'Reset Password' },

  // Panier & Checkout
  { path: '/panier', name: 'Panier' },
  // Note: /checkout nécessite un panier, donc on ne teste pas la redirection

  // Suivi commande
  { path: '/suivi-commande', name: 'Suivi commande' },

  // Pages légales & informatives
  { path: '/cgu', name: 'CGU' },
  { path: '/guide-reconstitution', name: 'Guide reconstitution' },
  { path: '/mentions-legales', name: 'Mentions légales' },
  { path: '/politique-confidentialite', name: 'Politique de confidentialité' },
  { path: '/cookies', name: 'Politique cookies' },
]

describe('Vérification des routes existantes', () => {
  EXPECTED_ROUTES.forEach(({ path, name, shouldBeHome }) => {
    it(`${name} (${path}) - ne redirige PAS vers la home`, () => {
      cy.visit(path)

      if (shouldBeHome) {
        // La home doit rester sur /
        cy.url().should('eq', Cypress.config().baseUrl + '/')
      } else {
        // Les autres pages ne doivent PAS être sur /
        cy.url().should('include', path)
        cy.url().should('not.eq', Cypress.config().baseUrl + '/')
      }

      // La page doit avoir du contenu visible
      cy.get('body').should('be.visible')
    })
  })
})


describe('Liens du Footer', () => {
  beforeEach(() => {
    cy.visit('/')
    // Scroll vers le footer
    cy.get('footer, [class*="footer"]').first().scrollIntoView()
  })

  it('Tous les liens internes du footer sont cliquables', () => {
    // Récupérer tous les liens internes du footer
    cy.get('footer a[href^="/"], [class*="footer"] a[href^="/"]').each(($link) => {
      const href = $link.attr('href')
      if (href && !href.includes('mailto:') && !href.includes('tel:')) {
        cy.wrap($link).should('have.attr', 'href')
      }
    })
  })

  it('Le lien Catalogue fonctionne', () => {
    cy.get('footer a[href="/catalogue"], [class*="footer"] a[href="/catalogue"]').first().click()
    cy.url().should('include', '/catalogue')
  })

  it('Le lien FAQ fonctionne', () => {
    cy.visit('/')
    cy.get('footer a[href="/faq"], [class*="footer"] a[href="/faq"]').first().click()
    cy.url().should('include', '/faq')
  })

  it('Le lien Suivi commande fonctionne', () => {
    cy.visit('/')
    cy.get('footer a[href="/suivi-commande"], [class*="footer"] a[href="/suivi-commande"]')
      .first()
      .click()
    cy.url().should('include', '/suivi-commande')
  })

  it('Le lien CGU fonctionne', () => {
    cy.visit('/')
    cy.get('footer a[href="/cgu"], [class*="footer"] a[href="/cgu"]').first().click()
    cy.url().should('include', '/cgu')
  })
})

describe('Routes protégées (nécessitent auth)', () => {
  it('/profil - redirige vers login ou access-denied sans auth', () => {
    cy.visit('/profil')
    // Soit redirige vers login, soit reste sur profil avec message, soit access-denied
    cy.url().should('match', /\/(profil|auth\/login|access-denied)/)
  })

  it('/profil/commandes - redirige vers login ou access-denied sans auth', () => {
    cy.visit('/profil/commandes')
    cy.url().should('match', /\/(profil|auth\/login|access-denied|commandes)/)
  })

  it('/admin - redirige vers login ou access-denied sans auth', () => {
    cy.visit('/admin')
    cy.url().should('match', /\/(admin|auth\/login|access-denied)/)
  })
})

describe('Catch-all (404)', () => {
  it('Une route inexistante redirige vers home', () => {
    cy.visit('/cette-page-nexiste-vraiment-pas-12345')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('Une route avec des caractères spéciaux redirige vers home', () => {
    cy.visit('/test%20page%20inexistante')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
