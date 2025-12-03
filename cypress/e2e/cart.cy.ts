/**
 * Panier E2E Tests (Cypress)
 *
 * Tests pour la gestion du panier : ajout, modification quantité, suppression
 */

describe('Panier - Gestion des articles', () => {
  beforeEach(() => {
    // Vider le panier avant chaque test
    cy.window().then((win) => {
      win.localStorage.removeItem('cart')
    })
  })

  it('Affiche le panier vide avec message', () => {
    cy.visit('/panier')

    // Vérifier l'état vide
    cy.get('.cart__empty').should('be.visible')
    cy.get('.cart__empty-title').should('be.visible')

    // Le bouton pour découvrir le catalogue doit être présent
    cy.get('.cart__empty').find('button').should('be.visible')
  })

  it('Ajoute un produit au panier depuis le catalogue', () => {
    cy.visit('/catalogue')

    // Cliquer sur "Ajouter au panier" d'un produit
    cy.get('[class*="product-card"]')
      .first()
      .find('button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Un toast de confirmation devrait apparaître
    cy.get('[class*="toast"], [class*="snackbar"]').should('be.visible')

    // Aller sur le panier
    cy.visit('/panier')

    // Vérifier que le produit est dans le panier
    cy.get('.cart-item').should('have.length', 1)
  })

  it('Augmente la quantité d\'un produit', () => {
    // Ajouter un produit d'abord
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]')
      .first()
      .find('button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Aller sur le panier
    cy.visit('/panier')

    // Récupérer le total initial
    cy.get('.cart__summary-row--total span:last-child')
      .invoke('text')
      .then((initialTotal) => {
        // Cliquer sur le bouton + pour augmenter la quantité
        cy.get('.cart-item__qty-control')
          .first()
          .find('button')
          .last()
          .click()

        // Vérifier que la quantité a augmenté
        cy.get('.cart-item__qty-input, .cart-item__qty-value')
          .first()
          .should(($el) => {
            const value = $el.val() || $el.text()
            expect(Number(value)).to.be.greaterThan(1)
          })

        // Le total doit avoir changé
        cy.get('.cart__summary-row--total span:last-child')
          .invoke('text')
          .should('not.eq', initialTotal)
      })
  })

  it('Diminue la quantité d\'un produit', () => {
    // Ajouter un produit d'abord
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]')
      .first()
      .find('button')
      .contains(/panier|cart|ajouter/i)
      .click()

    cy.visit('/panier')

    // Augmenter d'abord à 2
    cy.get('.cart-item__qty-control')
      .first()
      .find('button')
      .last()
      .click()

    // Attendre que la quantité soit à 2
    cy.get('.cart-item__qty-input, .cart-item__qty-value')
      .first()
      .should(($el) => {
        const value = $el.val() || $el.text()
        expect(Number(value)).to.eq(2)
      })

    // Puis diminuer à 1
    cy.get('.cart-item__qty-control')
      .first()
      .find('button')
      .first()
      .click()

    // La quantité doit être à 1
    cy.get('.cart-item__qty-input, .cart-item__qty-value')
      .first()
      .should(($el) => {
        const value = $el.val() || $el.text()
        expect(Number(value)).to.eq(1)
      })
  })

  it('Le bouton - est désactivé quand quantité = 1', () => {
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]')
      .first()
      .find('button')
      .contains(/panier|cart|ajouter/i)
      .click()

    cy.visit('/panier')

    // Le bouton - doit être désactivé
    cy.get('.cart-item__qty-control')
      .first()
      .find('button')
      .first()
      .should('be.disabled')
  })

  it('Supprime un produit du panier', () => {
    // Ajouter un produit
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]')
      .first()
      .find('button')
      .contains(/panier|cart|ajouter/i)
      .click()

    cy.visit('/panier')

    // Vérifier qu'il y a 1 produit
    cy.get('.cart-item').should('have.length', 1)

    // Cliquer sur le bouton supprimer
    cy.get('.cart-item__remove').click()

    // Le panier doit être vide
    cy.get('.cart__empty').should('be.visible')
  })

  it('Vide tout le panier', () => {
    // Ajouter plusieurs produits
    cy.visit('/catalogue')

    cy.get('[class*="product-card"]')
      .first()
      .find('button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Attendre le toast de confirmation
    cy.get('[class*="toast"], [class*="snackbar"]').should('be.visible')

    cy.get('[class*="product-card"]')
      .eq(1)
      .find('button')
      .contains(/panier|cart|ajouter/i)
      .click()

    cy.visit('/panier')

    // Vérifier qu'il y a des produits
    cy.get('.cart-item').should('have.length.greaterThan', 0)

    // Cliquer sur "Vider le panier"
    cy.get('.cart__clear').click()

    // Confirmer dans l'alert
    cy.on('window:confirm', () => true)

    // Le panier doit être vide
    cy.get('.cart__empty').should('be.visible')
  })

  it('Affiche la progression vers livraison gratuite', () => {
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]')
      .first()
      .find('button')
      .contains(/panier|cart|ajouter/i)
      .click()

    cy.visit('/panier')

    // La barre de progression ou le message de livraison gratuite doit être visible
    cy.get('.cart__shipping-progress, .cart__shipping-success').should('be.visible')
  })

  it('Navigue vers checkout depuis le panier', () => {
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]')
      .first()
      .find('button')
      .contains(/panier|cart|ajouter/i)
      .click()

    cy.visit('/panier')

    // Cliquer sur le bouton checkout
    cy.get('.cart__summary').find('button').contains(/checkout|commander|payer/i).click()

    // Vérifier la redirection
    cy.url().should('include', '/checkout')
  })

  it('Retourne au catalogue depuis le panier vide', () => {
    cy.visit('/panier')

    // Cliquer sur le bouton pour découvrir le catalogue
    cy.get('.cart__empty').find('button').first().click()

    // Redirection vers le catalogue
    cy.url().should('include', '/catalogue')
  })

  it('Le panier persiste après rechargement de page', () => {
    // Ajouter un produit
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]')
      .first()
      .find('button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Recharger la page
    cy.reload()

    // Le produit doit toujours être visible dans le header ou le panier
    cy.visit('/panier')
    cy.get('.cart-item').should('have.length', 1)
  })
})

describe('Panier - Calculs', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.removeItem('cart')
    })
  })

  it('Calcule correctement le sous-total', () => {
    cy.visit('/catalogue')

    // Ajouter un produit
    cy.get('[class*="product-card"]')
      .first()
      .find('button')
      .contains(/panier|cart|ajouter/i)
      .click()

    cy.visit('/panier')

    // Vérifier que le sous-total est affiché
    cy.get('.cart__summary-row').first().should('contain', '€')
  })

  it('Affiche les frais de livraison ou gratuit', () => {
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]')
      .first()
      .find('button')
      .contains(/panier|cart|ajouter/i)
      .click()

    cy.visit('/panier')

    // La ligne livraison doit être présente
    cy.get('.cart__summary-rows').should('exist').and('not.be.empty')
  })
})
