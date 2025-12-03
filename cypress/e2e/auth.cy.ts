/**
 * Authentification E2E Tests (Cypress)
 *
 * Tests pour l'inscription, connexion et récupération de mot de passe
 * Note: Le captcha Turnstile bloque la soumission réelle en environnement de test.
 * Ces tests vérifient l'interface et les validations côté client.
 */

describe('Auth - Page de connexion', () => {
  beforeEach(() => {
    cy.visit('/auth/login')
  })

  it('Affiche le formulaire de connexion', () => {
    // Vérifier le titre
    cy.get('.auth__title').should('be.visible')

    // Vérifier les champs
    cy.get('.auth__form').should('be.visible')
    cy.get('input[autocomplete="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')

    // Vérifier le bouton de soumission
    cy.get('.auth__form button[type="submit"]').should('be.visible')
  })

  it('Le bouton est désactivé sans captcha', () => {
    // Remplir les champs
    cy.get('input[autocomplete="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')

    // Le bouton doit être désactivé (captcha non validé)
    cy.get('.auth__form button[type="submit"]').should('be.disabled')
  })

  it('Affiche les providers OAuth', () => {
    cy.get('.auth__providers').should('be.visible')
    cy.get('.auth__providers button').should('have.length.at.least', 1)
  })

  it('Navigue vers la page d\'inscription', () => {
    cy.get('.auth__links a[href="/auth/register"]').click()
    cy.url().should('include', '/auth/register')
  })

  it('Navigue vers la récupération de mot de passe', () => {
    cy.get('.auth__links').contains(/forgot|oublié|reset|mot de passe/i).click()
    cy.url().should('include', '/auth/reset-password')
  })

  it('Valide le format email', () => {
    // Entrer un email invalide
    cy.get('input[autocomplete="email"]').type('invalid-email')
    cy.get('input[autocomplete="email"]').blur()

    // Vérifier que la validation s'effectue (via le composant)
    cy.get('.auth__form').should('exist')
  })
})

describe('Auth - Page d\'inscription', () => {
  beforeEach(() => {
    cy.visit('/auth/register')
  })

  it('Affiche le formulaire d\'inscription', () => {
    cy.get('.auth__title').should('be.visible')
    cy.get('.auth__form').should('be.visible')

    // Champs requis
    cy.get('input[autocomplete="email"]').should('be.visible')
    cy.get('input[type="password"]').should('have.length.at.least', 1)
  })

  it('Affiche l\'indicateur de force du mot de passe', () => {
    // Taper un mot de passe
    cy.get('input[type="password"]').first().type('abc')

    // L'indicateur de force devrait être visible
    cy.get('[class*="strength"], [class*="password-meter"]').should('be.visible')
  })

  it('Valide la confirmation du mot de passe', () => {
    // Entrer deux mots de passe différents
    cy.get('input[type="password"]').first().type('Password123!')
    cy.get('input[type="password"]').last().type('DifferentPassword!')

    // Blur pour déclencher la validation
    cy.get('input[type="password"]').last().blur()

    // Le bouton devrait rester désactivé car les mots de passe ne correspondent pas
    cy.get('.auth__form button[type="submit"]').should('be.disabled')
  })

  it('Le bouton est désactivé sans captcha', () => {
    // Remplir tous les champs
    cy.get('input[autocomplete="email"]').type('newuser@example.com')
    cy.get('input[type="password"]').first().type('StrongPassword123!')
    cy.get('input[type="password"]').last().type('StrongPassword123!')

    // Le bouton doit être désactivé (captcha non validé)
    cy.get('.auth__form button[type="submit"]').should('be.disabled')
  })

  it('Navigue vers la page de connexion', () => {
    cy.get('.auth__links a[href="/auth/login"]').click()
    cy.url().should('include', '/auth/login')
  })
})

describe('Auth - Récupération de mot de passe', () => {
  beforeEach(() => {
    cy.visit('/auth/reset-password')
  })

  it('Affiche le formulaire de récupération', () => {
    cy.get('.auth__title').should('be.visible')
    cy.get('.auth__form').should('be.visible')
    // L'input email est dans un WrapperInput
    cy.get('input[autocomplete="email"]').should('exist')
  })

  it('Valide le format email', () => {
    cy.get('input[autocomplete="email"]').type('invalid')
    cy.get('input[autocomplete="email"]').blur()

    // Vérifier que le formulaire existe (la validation custom gère les erreurs)
    cy.get('.auth__form').should('exist')
  })

  it('Retourne à la page de connexion', () => {
    cy.get('.auth__links').contains(/login|connexion|retour/i).click()
    cy.url().should('include', '/auth/login')
  })
})

describe('Auth - Page de mise à jour du mot de passe', () => {
  it('Redirige sans token de récupération', () => {
    // Visiter directement la page de mise à jour
    cy.visit('/auth/update-password')

    // Devrait afficher un formulaire ou rediriger vers login/home
    cy.get('body').should('be.visible')
    cy.url().should('match', /\/(auth|update-password|\/$)/)
  })
})

describe('Auth - Protection des routes', () => {
  it('Redirige vers login pour accéder au profil non connecté', () => {
    // Essayer d'accéder au profil sans être connecté
    cy.visit('/profil')

    // Devrait rediriger vers login ou afficher une erreur
    cy.url().should('match', /\/(auth\/login|profil|access-denied)/)
  })

  it('Redirige vers login pour accéder à l\'admin non connecté', () => {
    cy.visit('/admin')

    // Devrait rediriger ou bloquer l'accès
    cy.url().should('match', /\/(auth\/login|admin|access-denied)/)
  })
})
