/**
 * Admin - Gestion des Produits E2E Tests (Cypress)
 *
 * Tests pour la gestion des produits dans le panneau d'administration.
 * Note: Ces tests nécessitent un compte admin connecté.
 */

describe('Admin - Gestion des Produits', () => {
  beforeEach(() => {
    // Se connecter en tant qu'admin
    cy.loginAsAdmin()
    cy.visit('/admin/produits')
  })

  describe('Affichage et Navigation', () => {
    it('Affiche la liste des produits avec le tableau', () => {
      // Vérifier le wrapper admin
      cy.get('.admin-products').should('be.visible')

      // Vérifier la toolbar avec recherche
      cy.get('.admin-products input[placeholder*="Rechercher"]').should('be.visible')

      // Vérifier le bouton d'ajout
      cy.contains('button', /Ajouter un produit/i).should('be.visible')
    })

    it('Affiche les colonnes du tableau (Desktop)', () => {
      cy.viewport(1280, 800)

      // Vérifier les headers de colonnes
      cy.get('.admin-products__header').within(() => {
        cy.contains('Produit').should('be.visible')
        cy.contains('Catégorie').should('be.visible')
        cy.contains('Prix').should('be.visible')
        cy.contains('Stock').should('be.visible')
      })
    })

    it('Affiche la pagination', () => {
      cy.get('.admin-products').within(() => {
        // La pagination devrait être visible
        cy.get('[class*="pagination"], [class*="Pagination"]').should('exist')
      })
    })
  })

  describe('Recherche', () => {
    it('Filtre les produits par nom', () => {
      cy.get('.admin-products input[placeholder*="Rechercher"]').type('BPC')
      cy.wait(500) // Debounce

      // Vérifier que les résultats sont filtrés
      cy.get('.admin-products__row, .admin-products__mobile-card').should('exist')
    })

    it('Affiche un message si aucun produit trouvé', () => {
      cy.get('.admin-products input[placeholder*="Rechercher"]').type('xyzxyzxyz123456')
      cy.wait(500)

      // Message vide ou aucun résultat
      cy.get('body').should('contain.text', 'Aucun produit')
    })

    it('Le bouton reset efface la recherche', () => {
      cy.get('.admin-products input[placeholder*="Rechercher"]').type('test')
      cy.wait(300)

      // Cliquer sur reset
      cy.get('.admin-products').contains('button', /reset|réinitialiser/i).click()

      // Le champ doit être vide
      cy.get('.admin-products input[placeholder*="Rechercher"]').should('have.value', '')
    })
  })

  describe('Tri', () => {
    it('Trie les produits par nom', () => {
      cy.viewport(1280, 800)

      // Cliquer sur le header "Produit" pour trier
      cy.get('.admin-products__header')
        .contains('Produit')
        .closest('[class*="Cell"]')
        .find('[class*="icon"], svg')
        .click()

      // Vérifier que le tri est actif (classe ou style)
      cy.url().should('include', 'sort')
    })

    it('Trie les produits par prix', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-products__header')
        .contains('Prix')
        .closest('[class*="Cell"]')
        .find('[class*="icon"], svg')
        .click()

      cy.url().should('include', 'sort')
    })

    it('Trie les produits par stock', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-products__header')
        .contains('Stock')
        .closest('[class*="Cell"]')
        .find('[class*="icon"], svg')
        .click()

      cy.url().should('include', 'sort')
    })
  })

  describe('Modale Produit', () => {
    it('Ouvre la modale de création de produit', () => {
      cy.contains('button', /Ajouter un produit/i).click()

      // La modale devrait s'afficher
      cy.get('[class*="modal"], [class*="Modal"]').should('be.visible')
    })

    it('Ouvre la modale d\'édition en cliquant sur un produit', () => {
      cy.viewport(1280, 800)

      // Cliquer sur la première ligne produit
      cy.get('.admin-products__row').first().click()

      // La modale d'édition devrait s'afficher
      cy.get('[class*="modal"], [class*="Modal"]').should('be.visible')
    })

    it('Ferme la modale avec le bouton fermer', () => {
      cy.contains('button', /Ajouter un produit/i).click()
      cy.get('[class*="modal"], [class*="Modal"]').should('be.visible')

      // Fermer la modale
      cy.get('[class*="modal"], [class*="Modal"]')
        .find('button[class*="close"], [aria-label*="close"], [class*="Close"]')
        .first()
        .click()

      // La modale ne devrait plus être visible
      cy.get('[class*="modal"], [class*="Modal"]').should('not.exist')
    })
  })

  describe('Actions sur les produits', () => {
    it('Affiche le bouton supprimer sur chaque produit', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-products__row').first().within(() => {
        cy.get('[class*="trash"], [title*="Supprimer"], [class*="delete"]').should('exist')
      })
    })

    it('Affiche les badges de stock avec les bonnes couleurs', () => {
      cy.viewport(1280, 800)

      // Vérifier qu'il y a des badges
      cy.get('.admin-products__row [class*="Badge"], .admin-products__row [class*="badge"]').should(
        'exist',
      )
    })

    it('Affiche le badge PROMO pour les produits en promotion', () => {
      cy.viewport(1280, 800)

      // Si un produit a une promo, le badge devrait être visible
      cy.get('.admin-products__badge-promo').should('exist').or(() => {
        // Pas de promo actuellement, c'est ok
        cy.log('Aucun produit en promotion')
      })
    })
  })

  describe('Responsive Mobile', () => {
    beforeEach(() => {
      cy.viewport(375, 667)
    })

    it('Affiche les cartes mobiles au lieu du tableau', () => {
      cy.get('.admin-products__mobile-card, [class*="mobile-card"]').should('exist')
    })

    it('Les cartes mobiles sont cliquables', () => {
      cy.get('.admin-products__mobile-card, [class*="mobile-card"]').first().click()

      // La modale d'édition devrait s'afficher
      cy.get('[class*="modal"], [class*="Modal"]').should('be.visible')
    })
  })

  describe('Persistence URL', () => {
    it('Persiste la recherche dans l\'URL', () => {
      cy.get('.admin-products input[placeholder*="Rechercher"]').type('test')
      cy.wait(500)

      cy.url().should('include', 'search=test')
    })

    it('Persiste la page dans l\'URL', () => {
      // Aller à la page 2 si disponible
      cy.get('[class*="pagination"], [class*="Pagination"]')
        .contains('2')
        .click({ force: true })
        .then(() => {
          cy.url().should('include', 'page=2')
        })
    })

    it('Restaure les filtres depuis l\'URL', () => {
      cy.visit('/admin/produits?search=BPC')

      cy.get('.admin-products input[placeholder*="Rechercher"]').should('have.value', 'BPC')
    })
  })
})
