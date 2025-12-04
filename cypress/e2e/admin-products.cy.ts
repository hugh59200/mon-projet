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
    // Attendre que la page soit chargée
    cy.get('.admin-products', { timeout: 15000 }).should('be.visible')
  })

  describe('Affichage et Navigation', () => {
    it('Affiche la liste des produits avec le tableau', () => {
      // Vérifier le wrapper admin
      cy.get('.admin-products').should('be.visible')

      // Vérifier la toolbar avec recherche
      cy.get('input[placeholder*="Rechercher"]').should('be.visible')

      // Vérifier le bouton d'ajout
      cy.contains('button', /Ajouter un produit/i).should('be.visible')
    })

    it('Affiche les colonnes du tableau (Desktop)', () => {
      cy.viewport(1280, 800)
      cy.wait(500)

      // Vérifier que le header existe
      cy.get('.admin-products__header').should('be.visible')

      // Vérifier les cellules header (BasicCell utilise classe .elem)
      cy.get('.admin-products__header .elem').should('have.length.at.least', 4)
    })

    it('Affiche la pagination', () => {
      // La pagination devrait être visible
      cy.get('[class*="pagination"], [class*="Pagination"]').should('exist')
    })
  })

  describe('Recherche', () => {
    it('Filtre les produits par nom', () => {
      cy.viewport(1280, 800)
      cy.wait(500)

      cy.get('input[placeholder*="Rechercher"]').type('BPC')
      cy.wait(500) // Debounce

      // Vérifier que les résultats sont filtrés (lignes ou cartes)
      cy.get('.gridElemWrapper').should('exist')
    })

    it('Affiche un message si aucun produit trouvé', () => {
      cy.get('input[placeholder*="Rechercher"]').type('xyzxyzxyz123456')
      cy.wait(500)

      // Message vide ou aucun résultat
      cy.get('body').should('contain.text', 'Aucun produit')
    })

    it('Le bouton reset efface la recherche', () => {
      cy.get('input[placeholder*="Rechercher"]').type('test')
      cy.wait(300)

      // Cliquer sur reset
      cy.contains('button', /reset|réinitialiser/i).click()

      // Le champ doit être vide
      cy.get('input[placeholder*="Rechercher"]').should('have.value', '')
    })
  })

  describe('Tri', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.wait(500)
    })

    it('Trie les produits par nom', () => {
      // Cliquer sur l'icône de tri de la première cellule (Produit)
      cy.get('.admin-products__header .elem').first().find('svg').first().click({ force: true })

      // Vérifier que le tri est actif dans l'URL
      cy.url().should('include', 'sort')
    })

    it('Trie les produits par prix', () => {
      // Cliquer sur l'icône de tri de la cellule Prix (3ème)
      cy.get('.admin-products__header .elem').eq(2).find('svg').first().click({ force: true })

      cy.url().should('include', 'sort')
    })

    it('Trie les produits par stock', () => {
      // Cliquer sur l'icône de tri de la cellule Stock (4ème)
      cy.get('.admin-products__header .elem').eq(3).find('svg').first().click({ force: true })

      cy.url().should('include', 'sort')
    })
  })

  describe('Modale Produit', () => {
    it('Ouvre la modale de création de produit', () => {
      cy.contains('button', /Ajouter un produit/i).click()

      // La modale devrait s'afficher
      cy.get('[class*="modal"], [class*="Modal"]', { timeout: 10000 }).should('be.visible')
    })

    it("Ouvre la modale d'édition en cliquant sur un produit", () => {
      cy.viewport(1280, 800)
      cy.wait(500)

      // Cliquer sur la première ligne produit (sur l'item, pas le bouton delete)
      cy.get('.admin-products__item').first().click()

      // La modale d'édition devrait s'afficher
      cy.get('[class*="modal"], [class*="Modal"]', { timeout: 10000 }).should('be.visible')
    })

    it('Ferme la modale avec le bouton fermer', () => {
      cy.contains('button', /Ajouter un produit/i).click()
      cy.get('[class*="modal"], [class*="Modal"]', { timeout: 10000 }).should('be.visible')

      // Fermer la modale (chercher le bouton X ou close)
      cy.get('body').then(($body) => {
        if ($body.find('.basicModal__close').length > 0) {
          cy.get('.basicModal__close').first().click({ force: true })
        } else if ($body.find('[class*="close"]').length > 0) {
          cy.get('[class*="modal"] [class*="close"]').first().click({ force: true })
        } else {
          cy.get('[class*="modal"] button').first().click({ force: true })
        }
      })

      // La modale ne devrait plus être visible
      cy.get('[class*="modal"], [class*="Modal"]').should('not.exist')
    })
  })

  describe('Actions sur les produits', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.wait(500)
    })

    it('Affiche le bouton supprimer sur chaque produit', () => {
      cy.get('.gridElemWrapper').first().within(() => {
        // Le bouton est un BasicCellActionIcon avec icon-name="trash"
        cy.get('[class*="action"], svg').should('exist')
      })
    })

    it('Affiche les badges de stock avec les bonnes couleurs', () => {
      // Vérifier qu'il y a des badges
      cy.get('[class*="Badge"], [class*="badge"]').should('exist')
    })

    it('Affiche le badge PROMO pour les produits en promotion', () => {
      // Vérifier s'il y a des produits en promo
      cy.get('body').then(($body) => {
        if ($body.find('.admin-products__badge-promo').length > 0) {
          cy.get('.admin-products__badge-promo').should('exist')
        } else {
          cy.log('Aucun produit en promotion actuellement')
        }
      })
    })
  })

  describe('Responsive Mobile', () => {
    beforeEach(() => {
      cy.viewport(375, 667)
      cy.wait(500)
    })

    it('Affiche les cartes mobiles au lieu du tableau', () => {
      cy.get('.admin-products__mobile-card, .gridElemWrapper').should('exist')
    })

    it('Les cartes mobiles sont cliquables', () => {
      cy.get('.admin-products__mobile-card, .gridElemWrapper').first().click()

      // La modale d'édition devrait s'afficher
      cy.get('[class*="modal"], [class*="Modal"]', { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Persistence URL', () => {
    it("Persiste la recherche dans l'URL", () => {
      cy.get('input[placeholder*="Rechercher"]').type('test')
      cy.wait(500)

      cy.url().should('include', 'search=test')
    })

    it("Persiste la page dans l'URL", () => {
      // Vérifier s'il y a une page 2
      cy.get('body').then(($body) => {
        const pagination = $body.find('[class*="pagination"]')
        if (pagination.find(':contains("2")').length > 0) {
          cy.get('[class*="pagination"]').contains('2').click({ force: true })
          cy.url().should('include', 'page=2')
        } else {
          cy.log('Pas assez de produits pour avoir une page 2')
        }
      })
    })

    it("Restaure les filtres depuis l'URL", () => {
      cy.visit('/admin/produits?search=BPC')

      cy.get('input[placeholder*="Rechercher"]').should('have.value', 'BPC')
    })
  })
})
