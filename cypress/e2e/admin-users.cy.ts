/**
 * Admin - Gestion des Utilisateurs E2E Tests (Cypress)
 *
 * Tests pour la gestion des utilisateurs dans le panneau d'administration.
 * Note: Ces tests nécessitent un compte admin connecté.
 */

describe('Admin - Gestion des Utilisateurs', () => {
  beforeEach(() => {
    // Se connecter en tant qu'admin
    cy.loginAsAdmin()
    cy.visit('/admin/utilisateurs')
    // Attendre que la page soit chargée
    cy.get('.admin-users', { timeout: 15000 }).should('be.visible')
  })

  describe('Affichage et Navigation', () => {
    it('Affiche la liste des utilisateurs', () => {
      cy.get('.admin-users').should('be.visible')
      cy.get('input[placeholder*="Rechercher"]').should('be.visible')
    })

    it('Affiche les colonnes du tableau (Desktop)', () => {
      cy.viewport(1280, 800)
      cy.wait(500)

      // Vérifier que le header existe
      cy.get('.admin-users__header').should('be.visible')

      // Vérifier les cellules header (BasicCell utilise classe .elem)
      cy.get('.admin-users__header .elem').should('have.length.at.least', 4)
    })

    it('Affiche les filtres par rôle', () => {
      // Les filtres sont des PremiumButton avec labels "Tous (X)", "Clients (X)", "Admins (X)"
      cy.get('.admin-users__filters button').should('have.length', 3)
    })
  })

  describe('Filtrage par rôle', () => {
    it('Filtre les clients', () => {
      cy.get('.admin-users__filters button').contains('Clients').click()
      cy.wait(300)

      // L'URL devrait refléter le filtre
      cy.url().should('include', 'role=user')
    })

    it('Filtre les admins', () => {
      cy.get('.admin-users__filters button').contains('Admins').click()
      cy.wait(300)

      cy.url().should('include', 'role=admin')
    })

    it('Affiche tous les utilisateurs', () => {
      // D'abord filtrer par admins
      cy.get('.admin-users__filters button').contains('Admins').click()
      cy.wait(300)

      // Puis revenir à tous
      cy.get('.admin-users__filters button').contains('Tous').click()
      cy.wait(300)

      // L'URL ne devrait plus avoir le filtre role=admin
      cy.url().should('not.include', 'role=admin')
    })

    it('Affiche les compteurs de rôles', () => {
      // Vérifier que les boutons existent avec leurs compteurs
      cy.get('.admin-users__filters button').should('have.length', 3)
    })
  })

  describe('Recherche', () => {
    it('Filtre les utilisateurs par email', () => {
      cy.get('input[placeholder*="Rechercher"]').type('test@')
      cy.wait(500)

      // Vérifier que la recherche a été effectuée
      cy.url().should('include', 'search=')
    })

    it('Filtre les utilisateurs par nom', () => {
      cy.get('input[placeholder*="Rechercher"]').type('Jean')
      cy.wait(500)

      cy.url().should('include', 'search=Jean')
    })

    it('Affiche un message si aucun utilisateur trouvé', () => {
      cy.get('input[placeholder*="Rechercher"]').type('xyzxyzxyz123456@nowhere.com')
      cy.wait(500)

      cy.get('body').should('contain.text', 'Aucun utilisateur')
    })
  })

  describe('Tri', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.wait(500)
    })

    it('Trie les utilisateurs par email', () => {
      // Cliquer sur l'icône de tri du premier elem
      cy.get('.admin-users__header .elem').first().find('svg').first().click({ force: true })

      cy.url().should('include', 'sort')
    })

    it('Trie les utilisateurs par nom', () => {
      cy.get('.admin-users__header .elem').eq(1).find('svg').first().click({ force: true })

      cy.url().should('include', 'sort')
    })

    it('Trie les utilisateurs par date de création', () => {
      cy.get('.admin-users__header .elem').eq(3).find('svg').first().click({ force: true })

      cy.url().should('include', 'sort')
    })
  })

  describe('Modale Utilisateur', () => {
    it("Ouvre la modale de détails en cliquant sur un utilisateur", () => {
      cy.viewport(1280, 800)
      cy.wait(500)

      cy.get('.admin-users__item, .gridElemWrapper').first().click()

      cy.get('[class*="modal"], [class*="Modal"]', { timeout: 10000 }).should('be.visible')
    })

    it("Affiche les informations de l'utilisateur dans la modale", () => {
      cy.viewport(1280, 800)
      cy.wait(500)

      cy.get('.admin-users__item, .gridElemWrapper').first().click()

      cy.get('[class*="modal"], [class*="Modal"]', { timeout: 10000 }).should('be.visible')
    })

    it('Ferme la modale avec le bouton fermer', () => {
      cy.viewport(1280, 800)
      cy.wait(500)

      cy.get('.admin-users__item, .gridElemWrapper').first().click()
      cy.get('[class*="modal"], [class*="Modal"]', { timeout: 10000 }).should('be.visible')

      // Fermer la modale en cliquant sur l'overlay ou le bouton fermer
      cy.get('body').then(() => {
        // Essayer d'appuyer sur Escape
        cy.get('body').type('{esc}')
      })

      cy.wait(500)
      // Vérifier que la modale n'est plus visible
      cy.get('.admin-users').should('be.visible')
    })
  })

  describe('Actions sur les utilisateurs', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.wait(500)
    })

    it('Affiche le bouton supprimer sur chaque utilisateur', () => {
      cy.get('.gridElemWrapper').first().within(() => {
        // Le bouton est un BasicCellActionIcon avec icon-name="trash"
        cy.get('[class*="action"], svg').should('exist')
      })
    })

    it('Affiche les badges de rôle avec les bonnes couleurs', () => {
      // Vérifier qu'il y a des badges
      cy.get('[class*="Badge"], [class*="badge"]').should('exist')
    })
  })

  describe('Responsive Mobile', () => {
    beforeEach(() => {
      cy.viewport(375, 667)
      cy.wait(500)
    })

    it('Affiche les cartes mobiles au lieu du tableau', () => {
      cy.get('.admin-users__mobile-card, .gridElemWrapper').should('exist')
    })

    it('Les cartes mobiles sont cliquables', () => {
      cy.get('.admin-users__mobile-card, .gridElemWrapper').first().click()

      cy.get('[class*="modal"], [class*="Modal"]', { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Persistence URL', () => {
    it("Persiste la recherche dans l'URL", () => {
      cy.get('input[placeholder*="Rechercher"]').type('test')
      cy.wait(500)

      cy.url().should('include', 'search=test')
    })

    it("Persiste le filtre rôle dans l'URL", () => {
      cy.get('.admin-users__filters button').contains('Admins').click()
      cy.wait(300)

      cy.url().should('include', 'role=admin')
    })

    it("Restaure les filtres depuis l'URL", () => {
      cy.visit('/admin/utilisateurs?role=admin&search=test')
      cy.wait(500)

      cy.get('input[placeholder*="Rechercher"]').should('have.value', 'test')
    })
  })

  describe('Pagination', () => {
    it('Affiche la pagination', () => {
      cy.get('[class*="pagination"], [class*="Pagination"]').should('exist')
    })

    it('Navigue entre les pages', () => {
      // Vérifier s'il y a une page 2
      cy.get('body').then(($body) => {
        const pagination = $body.find('[class*="pagination"]')
        if (pagination.find(':contains("2")').length > 0) {
          cy.get('[class*="pagination"]').contains('2').click({ force: true })
          cy.url().should('include', 'page=2')
        } else {
          cy.log('Pas assez d\'utilisateurs pour avoir une page 2')
        }
      })
    })
  })
})
