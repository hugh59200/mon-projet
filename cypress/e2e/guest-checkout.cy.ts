/**
 * Fast Peptides - Guest Checkout E2E Test (Cypress)
 *
 * Golden Path : Achat en mode invité avec paiement Crypto
 */

// Adresses crypto pour vérification
const CRYPTO = {
  btc: { prefix: 'bc1q', lastChars: 'l76pc' },
  usdt: { prefix: 'TM', lastChars: 'UwRF' },
}

const GUEST = {
  email: 'h.bogrand@yopmail.com',
  fullName: 'Jean-Pierre Testeur',
  address: '42 Rue de la Science',
  zip: '75008',
  city: 'Paris',
}

describe('Guest Checkout - Golden Path', () => {
  it('Parcours complet : Catalogue → Checkout → Confirmation', () => {
    // ÉTAPE 1 : Catalogue
    cy.visit('/catalogue')
    cy.get('.age-gate').should('not.exist')
    cy.url().should('include', '/catalogue')

    // ÉTAPE 2 : Sélection produit
    cy.get('[class*="product-card"]').first().should('be.visible').click()
    cy.url().should('match', /\/catalogue\/[a-z0-9-]+/)

    // ÉTAPE 3 : Acheter maintenant (redirige vers checkout avec le produit)
    cy.get('.product__actions button').contains(/buy|acheter|maintenant|now/i).click()
    cy.url().should('include', '/checkout', { timeout: 15000 })

    // ÉTAPE 4 : Vérifier que le panier contient le produit
    cy.get('.checkout-item').should('exist')

    // ÉTAPE 5 : Sélectionner livraison domicile
    cy.get('.checkout__delivery-option').contains(/colissimo|home|domicile/i).click()

    // ÉTAPE 6 : Remplir le formulaire
    cy.get('.checkout__form input[type="email"], .checkout__field input[type="email"]')
      .first()
      .clear()
      .type(GUEST.email)

    cy.get('.checkout__form input[type="text"]').first().clear().type(GUEST.fullName)

    cy.get('.checkout__field input[placeholder*="rue"], .checkout__field input[placeholder*="Numéro"]')
      .first()
      .clear()
      .type(GUEST.address)

    cy.get('.checkout__field input[placeholder*="75001"]').first().clear().type(GUEST.zip)

    cy.get('.checkout__field input[placeholder*="Paris"]').first().clear().type(GUEST.city)

    // ÉTAPE 7 : Vérifier paiement Crypto
    cy.get('.payment-card__crypto-badge').contains('BTC').should('be.visible')
    cy.get('.payment-card__crypto-badge').contains('USDT').should('be.visible')

    // ÉTAPE 8 : Vérifier que le bouton est DÉSACTIVÉ sans disclaimer
    cy.get('.checkout__submit-wrapper').scrollIntoView()
    cy.get('.checkout__submit-wrapper button').should('be.disabled')
    cy.get('.checkout__disclaimer-warning').should('exist')

    // ÉTAPE 9 : Cocher le disclaimer
    cy.get('.checkout__disclaimer-input').check({ force: true })
    cy.get('.checkout__submit-wrapper button').should('be.enabled')
    cy.get('.checkout__disclaimer-warning').should('not.exist')

    // ÉTAPE 10 : Soumettre la commande
    cy.get('.checkout__submit-wrapper button').click()
    cy.url().should('include', '/confirmation', { timeout: 30000 })

    // ÉTAPE 11 : Vérifier la page de confirmation
    cy.get('.confirmation__success-icon').should('be.visible')
    cy.get('.confirmation__title').should('be.visible')

    // ÉTAPE 12 : Vérifier les adresses crypto
    cy.get('.confirmation__crypto-details').should('be.visible')

    // Vérifier BTC (onglet par défaut)
    cy.get('.confirmation__detail-value--mono')
      .first()
      .invoke('text')
      .should('include', CRYPTO.btc.prefix)
      .and('include', CRYPTO.btc.lastChars)

    // Cliquer sur USDT
    cy.get('.confirmation__crypto-tab').contains(/usdt|tether/i).click()

    // Vérifier USDT
    cy.get('.confirmation__detail-value--mono')
      .first()
      .invoke('text')
      .should('include', CRYPTO.usdt.prefix)
      .and('include', CRYPTO.usdt.lastChars)

    // Vérifier TRC-20
    cy.contains('TRC-20').should('be.visible')

    // ÉTAPE 13 : Vérifier le récapitulatif
    cy.get('.confirmation__order-id, [class*="order-ref"]').scrollIntoView().should('be.visible')
  })

  it('Age Gate bloque sans consentement', () => {
    // Nettoyer le localStorage pour ce test
    cy.clearLocalStorage()
    cy.visit('/catalogue')

    // L'Age Gate doit être visible
    cy.get('.age-gate').should('be.visible')
  })

  it('Impossible de commander sans disclaimer', () => {
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]').first().click()
    cy.get('.product__actions button').contains(/buy|acheter|maintenant|now/i).click()
    cy.url().should('include', '/checkout', { timeout: 15000 })

    // Remplir le formulaire mais NE PAS cocher le disclaimer
    cy.get('.checkout__delivery-option').contains(/colissimo|home|domicile/i).click()
    cy.get('.checkout__form input[type="email"], .checkout__field input[type="email"]')
      .first()
      .type('test@test.com')
    cy.get('.checkout__form input[type="text"]').first().type('Test User')
    cy.get('.checkout__field input[placeholder*="rue"], .checkout__field input[placeholder*="Numéro"]')
      .first()
      .type('1 Test St')
    cy.get('.checkout__field input[placeholder*="75001"]').first().type('75001')
    cy.get('.checkout__field input[placeholder*="Paris"]').first().type('Paris')

    // Le bouton DOIT être désactivé
    cy.get('.checkout__submit-wrapper button').should('be.disabled')
  })

  it('Vérifie que le virement bancaire est désactivé (Phase 1)', () => {
    // D'abord ajouter un produit au panier pour accéder au checkout
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]').first().click()
    cy.get('.product__actions button').contains(/buy|acheter|maintenant|now/i).click()
    cy.url().should('include', '/checkout', { timeout: 15000 })

    // Attendre que la page soit chargée
    cy.get('.checkout').should('exist')

    // Ouvre l'accordéon "Autres méthodes" si présent
    cy.get('body').then(($body) => {
      if ($body.find('.payment-methods__coming-header').length) {
        cy.get('.payment-methods__coming-header').click()
      }
    })

    // Vérifie que le virement bancaire est désactivé (si présent)
    // Utilise cy.get().then() pour une vérification conditionnelle fiable
    cy.get('body').then(($body) => {
      const bankCard = $body.find('.payment-card--bank')
      if (bankCard.length > 0) {
        // Vérifier que c'est désactivé
        expect(bankCard.hasClass('payment-card--disabled')).to.be.true
      } else {
        // Si le virement bancaire n'est pas encore implémenté, le test passe
        cy.log('Virement bancaire non implémenté - test skipped')
      }
    })
  })
})
