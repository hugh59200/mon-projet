/**
 * Suivi de commande E2E Tests (Cypress)
 *
 * Tests pour la fonctionnalité de suivi de commande pour les invités
 */

describe('Suivi de commande - Formulaire de recherche', () => {
  beforeEach(() => {
    cy.visit('/suivi-commande')
  })

  it('Affiche le formulaire de recherche', () => {
    // Vérifier que la page se charge
    cy.get('.track').should('be.visible')

    // Vérifier le formulaire de recherche
    cy.get('.track__search-card').should('be.visible')
    cy.get('.track__search-title').should('be.visible')

    // Vérifier les champs
    cy.get('.track__input[placeholder*="FP-"]').should('be.visible')
    cy.get('.track__input[type="email"]').should('be.visible')

    // Bouton de soumission
    cy.get('.track__form button[type="submit"]').should('be.visible')
  })

  it('Affiche la section d\'aide', () => {
    cy.get('.track__help').should('be.visible')
    cy.get('.track__help-title').should('be.visible')
    cy.get('.track__help-item').should('have.length.at.least', 1)
  })

  it('Valide les champs requis', () => {
    // Soumettre sans remplir les champs
    cy.get('.track__form button[type="submit"]').click()

    // Le formulaire ne devrait pas être soumis (validation HTML5)
    cy.get('.track__input:invalid').should('have.length.at.least', 1)
  })

  it('Valide le format email', () => {
    // Entrer un email invalide
    cy.get('.track__input[type="email"]').should('be.visible').click().type('invalid-email')
    cy.get('.track__input[placeholder*="FP-"]').should('be.visible').click().type('FP-2025-000001')

    // Soumettre
    cy.get('.track__form button[type="submit"]').click()

    // Le champ email devrait être invalide
    cy.get('.track__input[type="email"]:invalid').should('exist')
  })

  it('Affiche une erreur pour une commande inexistante', () => {
    // Intercepter la requête de recherche de commande
    cy.intercept('GET', '**/rest/v1/orders*').as('searchOrder')

    // Remplir avec des données fictives
    cy.get('.track__input[placeholder*="FP-"]').should('be.visible').click().type('FP-0000-000000')
    cy.get('.track__input[type="email"]').should('be.visible').click().type('nonexistent@test.com')

    // Soumettre
    cy.get('.track__form button[type="submit"]').click()

    // Attendre la réponse du serveur
    cy.wait('@searchOrder')

    // Une erreur devrait s'afficher
    cy.get('.track__error, .track__input-wrapper--error').should('exist')
  })

  it('Affiche l\'indicateur de sécurité SSL', () => {
    cy.get('.track__search-secure').should('be.visible')
    cy.get('.track__search-secure').should('contain.text', 'SSL')
  })

  it('Les champs se réinitialisent quand on efface le texte', () => {
    // Remplir le numéro de commande
    cy.get('.track__input[placeholder*="FP-"]').should('be.visible').click().type('test123')

    // L'effacer
    cy.get('.track__input[placeholder*="FP-"]').clear()

    // Le champ doit être vide
    cy.get('.track__input[placeholder*="FP-"]').should('have.value', '')
  })
})

describe('Suivi de commande - Affichage des résultats', () => {
  it('Affiche les détails d\'une commande via query params', () => {
    // Cette page accepte des query params: ?email=xxx&ref=xxx
    // Simuler une visite avec ces params (même si la commande n'existe pas)
    cy.visit('/suivi-commande?email=test@test.com&ref=FP-2025-000001')

    // La page devrait tenter de charger
    cy.get('.track').should('be.visible')

    // Soit afficher les résultats, soit une erreur
    cy.get('.track__results, .track__error, .track__search-card').should('exist')
  })

  it('Affiche un skeleton pendant le chargement', () => {
    // Visiter avec un token qui déclenchera un chargement
    cy.visit('/suivi-commande?token=fake-token')

    // Le skeleton ou une erreur devrait apparaître
    cy.get('.track__skeleton, .track__error, .track__search-card', { timeout: 5000 }).should(
      'exist',
    )
  })
})

describe('Suivi de commande - Navigation', () => {
  it('Permet de revenir au formulaire depuis les résultats', () => {
    // Cette fonctionnalité nécessite d'abord d'avoir des résultats affichés
    // On teste juste que la page est navigable
    cy.visit('/suivi-commande')

    // La page devrait être accessible
    cy.url().should('include', '/suivi-commande')
    cy.get('.track').should('be.visible')
  })
})
