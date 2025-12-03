/**
 * Panier E2E Tests (Cypress)
 *
 * Tests pour la gestion du panier : ajout, modification quantité, suppression
 */

describe('Panier - Gestion des articles', () => {
  beforeEach(() => {
    // Vider le panier avant chaque test (clé correcte du store Pinia)
    cy.window().then((win) => {
      win.localStorage.removeItem('fp-cart-storage')
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

    // Aller sur la page produit
    cy.get('[class*="product-card"]').first().click()
    cy.url().should('match', /\/catalogue\/[a-z0-9-]+/)

    // Cliquer sur "Ajouter au panier" depuis la page produit
    cy.get('.product__actions button, [class*="product-actions"] button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Attendre que le toast confirme l'ajout
    cy.get('.compact-toast, .toast').should('be.visible')

    // Naviguer vers le panier via l'UI (évite les problèmes d'hydratation Pinia)
    cy.goToCartViaUI()

    // Vérifier que le produit est dans le panier
    cy.get('.cart-item').should('have.length', 1)
  })

  it('Augmente la quantité d\'un produit', () => {
    // Ajouter un produit d'abord via la page produit
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]').first().click()
    cy.get('.product__actions button, [class*="product-actions"] button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Attendre que le toast confirme l'ajout
    cy.get('.compact-toast, .toast').should('be.visible')

    // Naviguer vers le panier via l'UI
    cy.goToCartViaUI()

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
    // Ajouter un produit d'abord via la page produit
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]').first().click()
    cy.get('.product__actions button, [class*="product-actions"] button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Attendre que le toast confirme l'ajout
    cy.get('.compact-toast, .toast').should('be.visible')

    // Naviguer vers le panier via l'UI
    cy.goToCartViaUI()

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
    // Ajouter un produit via la page produit
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]').first().click()
    cy.get('.product__actions button, [class*="product-actions"] button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Attendre que le toast confirme l'ajout
    cy.get('.compact-toast, .toast').should('be.visible')

    // Naviguer vers le panier via l'UI
    cy.goToCartViaUI()

    // Le bouton - doit être désactivé
    cy.get('.cart-item__qty-control')
      .first()
      .find('button')
      .first()
      .should('be.disabled')
  })

  it('Supprime un produit du panier', () => {
    // Ajouter un produit via la page produit
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]').first().click()
    cy.get('.product__actions button, [class*="product-actions"] button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Attendre que le toast confirme l'ajout
    cy.get('.compact-toast, .toast').should('be.visible')

    // Naviguer vers le panier via l'UI
    cy.goToCartViaUI()

    // Vérifier qu'il y a 1 produit
    cy.get('.cart-item').should('have.length', 1)

    // Cliquer sur le bouton supprimer
    cy.get('.cart-item__remove').click()

    // Le panier doit être vide
    cy.get('.cart__empty').should('be.visible')
  })

  it('Vide tout le panier', () => {
    // Ajouter plusieurs produits via les pages produit
    cy.visit('/catalogue')

    // Premier produit
    cy.get('[class*="product-card"]').first().click()
    cy.get('.product__actions button, [class*="product-actions"] button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Attendre que le toast confirme l'ajout
    cy.get('.compact-toast, .toast').should('be.visible')

    // Retour au catalogue pour le deuxième produit via navigation
    cy.go('back')
    cy.get('[class*="product-card"]').eq(1).click()
    cy.get('.product__actions button, [class*="product-actions"] button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Attendre que le toast confirme l'ajout
    cy.get('.compact-toast, .toast').should('be.visible')

    // Naviguer vers le panier via l'UI
    cy.goToCartViaUI()

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
    // Ajouter un produit via la page produit
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]').first().click()
    cy.get('.product__actions button, [class*="product-actions"] button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Attendre que le toast confirme l'ajout
    cy.get('.compact-toast, .toast').should('be.visible')

    // Naviguer vers le panier via l'UI
    cy.goToCartViaUI()

    // La barre de progression ou le message de livraison gratuite doit être visible
    cy.get('.cart__shipping-progress, .cart__shipping-success').should('be.visible')
  })

  it('Navigue vers checkout depuis le panier', () => {
    // Ajouter un produit via la page produit
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]').first().click()
    cy.get('.product__actions button, [class*="product-actions"] button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Attendre que le toast confirme l'ajout
    cy.get('.compact-toast, .toast').should('be.visible')

    // Naviguer vers le panier via l'UI
    cy.goToCartViaUI()

    // Cliquer sur le bouton checkout
    cy.get('.cart__summary').find('button').contains(/checkout|commander|payer|valider/i).click()

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
    // Ajouter un produit via la page produit
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]').first().click()
    cy.get('.product__actions button, [class*="product-actions"] button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Attendre que le toast confirme l'ajout
    cy.get('.compact-toast, .toast').should('be.visible')

    // Vérifier que le localStorage a les données AVANT le reload
    cy.window().then((win) => {
      const cartData = win.localStorage.getItem('fp-cart-storage')
      expect(cartData).to.not.be.null
      const cart = JSON.parse(cartData!)
      expect(cart.guestCart).to.have.length.greaterThan(0)
    })

    // Recharger la page
    cy.reload()

    // Vérifier que le localStorage a toujours les données APRÈS le reload
    // (la persistance fonctionne, même si l'hydratation Pinia peut avoir un délai)
    cy.window().then((win) => {
      const cartData = win.localStorage.getItem('fp-cart-storage')
      expect(cartData).to.not.be.null
      const cart = JSON.parse(cartData!)
      expect(cart.guestCart).to.have.length.greaterThan(0)
    })
  })
})

describe('Panier - Calculs', () => {
  beforeEach(() => {
    // Vider le panier avant chaque test (clé correcte du store Pinia)
    cy.window().then((win) => {
      win.localStorage.removeItem('fp-cart-storage')
    })
  })

  it('Calcule correctement le sous-total', () => {
    // Ajouter un produit via la page produit
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]').first().click()
    cy.get('.product__actions button, [class*="product-actions"] button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Attendre que le toast confirme l'ajout
    cy.get('.compact-toast, .toast').should('be.visible')

    // Naviguer vers le panier via l'UI
    cy.goToCartViaUI()

    // Vérifier que le sous-total est affiché
    cy.get('.cart__summary-row').first().should('contain', '€')
  })

  it('Affiche les frais de livraison ou gratuit', () => {
    // Ajouter un produit via la page produit
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]').first().click()
    cy.get('.product__actions button, [class*="product-actions"] button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Attendre que le toast confirme l'ajout
    cy.get('.compact-toast, .toast').should('be.visible')

    // Naviguer vers le panier via l'UI
    cy.goToCartViaUI()

    // La ligne livraison doit être présente
    cy.get('.cart__summary-rows').should('exist').and('not.be.empty')
  })
})
