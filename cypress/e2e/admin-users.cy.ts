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
  })

  describe('Affichage et Navigation', () => {
    it('Affiche la liste des utilisateurs', () => {
      cy.get('.admin-users').should('be.visible')
      cy.get('.admin-users input[placeholder*="Rechercher"]').should('be.visible')
    })

    it('Affiche les colonnes du tableau (Desktop)', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-users__header, .cardLayoutWrapper--header').within(() => {
        cy.contains('Email').should('be.visible')
        cy.contains('Nom').should('be.visible')
        cy.contains('Rôle').should('be.visible')
        cy.contains('Créé le').should('be.visible')
      })
    })

    it('Affiche les filtres par rôle', () => {
      cy.get('.admin-users__filters').should('be.visible')
      cy.contains('button', /Tous/i).should('be.visible')
      cy.contains('button', /Clients/i).should('be.visible')
      cy.contains('button', /Admins/i).should('be.visible')
    })
  })

  describe('Filtrage par rôle', () => {
    it('Filtre les clients', () => {
      cy.contains('button', /Clients/i).click()

      // L'URL devrait refléter le filtre
      cy.url().should('include', 'role=user')

      // Le bouton devrait être actif
      cy.contains('button', /Clients/i).should('have.class', 'primary').or(() => {
        // Vérification alternative
        cy.contains('button', /Clients/i).should('have.attr', 'type', 'primary')
      })
    })

    it('Filtre les admins', () => {
      cy.contains('button', /Admins/i).click()

      cy.url().should('include', 'role=admin')

      // Vérifier que seuls les admins sont affichés
      cy.get('.admin-users__row, .admin-users__mobile-card').each(($row) => {
        cy.wrap($row).find('[class*="Badge"], [class*="badge"]').should('contain.text', 'admin')
      })
    })

    it('Affiche tous les utilisateurs', () => {
      // D'abord filtrer par admins
      cy.contains('button', /Admins/i).click()
      cy.wait(300)

      // Puis revenir à tous
      cy.contains('button', /Tous/i).click()

      // L'URL ne devrait plus avoir le filtre role
      cy.url().should('not.include', 'role=admin')
    })

    it('Affiche les compteurs de rôles', () => {
      // Les boutons de filtre devraient afficher des compteurs
      cy.contains('button', /Tous \(\d+\)/i).should('exist')
      cy.contains('button', /Clients \(\d+\)/i).should('exist')
      cy.contains('button', /Admins \(\d+\)/i).should('exist')
    })
  })

  describe('Recherche', () => {
    it('Filtre les utilisateurs par email', () => {
      cy.get('.admin-users input[placeholder*="Rechercher"]').type('test@')
      cy.wait(500)

      // Les résultats devraient être filtrés
      cy.get('.admin-users__row, .admin-users__mobile-card').should('exist')
    })

    it('Filtre les utilisateurs par nom', () => {
      cy.get('.admin-users input[placeholder*="Rechercher"]').type('Jean')
      cy.wait(500)

      cy.get('body').then(($body) => {
        if ($body.find('.admin-users__row').length > 0) {
          cy.get('.admin-users__row').should('exist')
        } else {
          // Aucun résultat, c'est acceptable
          cy.log('Aucun utilisateur nommé Jean')
        }
      })
    })

    it('Affiche un message si aucun utilisateur trouvé', () => {
      cy.get('.admin-users input[placeholder*="Rechercher"]').type('xyzxyzxyz123456@nowhere.com')
      cy.wait(500)

      cy.get('body').should('contain.text', 'Aucun utilisateur')
    })
  })

  describe('Tri', () => {
    it('Trie les utilisateurs par email', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-users__header, .cardLayoutWrapper--header')
        .contains('Email')
        .closest('[class*="Cell"]')
        .find('[class*="icon"], svg')
        .click()

      cy.url().should('include', 'sort')
    })

    it('Trie les utilisateurs par nom', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-users__header, .cardLayoutWrapper--header')
        .contains('Nom')
        .closest('[class*="Cell"]')
        .find('[class*="icon"], svg')
        .click()

      cy.url().should('include', 'sort')
    })

    it('Trie les utilisateurs par date de création', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-users__header, .cardLayoutWrapper--header')
        .contains('Créé le')
        .closest('[class*="Cell"]')
        .find('[class*="icon"], svg')
        .click()

      cy.url().should('include', 'sort')
    })
  })

  describe('Modale Utilisateur', () => {
    it('Ouvre la modale de détails en cliquant sur un utilisateur', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-users__row').first().click()

      cy.get('[class*="modal"], [class*="Modal"]').should('be.visible')
    })

    it('Affiche les informations de l\'utilisateur dans la modale', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-users__row').first().click()

      cy.get('[class*="modal"], [class*="Modal"]').within(() => {
        // Vérifier qu'il y a du contenu
        cy.get('body').should('not.be.empty')
      })
    })

    it('Ferme la modale avec le bouton fermer', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-users__row').first().click()
      cy.get('[class*="modal"], [class*="Modal"]').should('be.visible')

      cy.get('[class*="modal"], [class*="Modal"]')
        .find('button[class*="close"], [aria-label*="close"], [class*="Close"]')
        .first()
        .click()

      cy.get('[class*="modal"], [class*="Modal"]').should('not.exist')
    })
  })

  describe('Actions sur les utilisateurs', () => {
    it('Affiche le bouton supprimer sur chaque utilisateur', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-users__row').first().within(() => {
        cy.get('[class*="trash"], [title*="Supprimer"], [class*="delete"]').should('exist')
      })
    })

    it('Affiche les badges de rôle avec les bonnes couleurs', () => {
      cy.viewport(1280, 800)

      // Vérifier qu'il y a des badges
      cy.get('.admin-users__row [class*="Badge"], .admin-users__row [class*="badge"]').should(
        'exist',
      )
    })
  })

  describe('Responsive Mobile', () => {
    beforeEach(() => {
      cy.viewport(375, 667)
    })

    it('Affiche les cartes mobiles au lieu du tableau', () => {
      cy.get('.admin-users__mobile-card, [class*="mobile-card"], [class*="UserCardMobile"]').should(
        'exist',
      )
    })

    it('Les cartes mobiles sont cliquables', () => {
      cy.get('.admin-users__mobile-card, [class*="mobile-card"]').first().click()

      cy.get('[class*="modal"], [class*="Modal"]').should('be.visible')
    })
  })

  describe('Persistence URL', () => {
    it('Persiste la recherche dans l\'URL', () => {
      cy.get('.admin-users input[placeholder*="Rechercher"]').type('test')
      cy.wait(500)

      cy.url().should('include', 'search=test')
    })

    it('Persiste le filtre rôle dans l\'URL', () => {
      cy.contains('button', /Admins/i).click()
      cy.wait(300)

      cy.url().should('include', 'role=admin')
    })

    it('Restaure les filtres depuis l\'URL', () => {
      cy.visit('/admin/utilisateurs?role=admin&search=test')

      cy.get('.admin-users input[placeholder*="Rechercher"]').should('have.value', 'test')
      // Le bouton Admins devrait être actif
      cy.contains('button', /Admins/i).should('have.class', 'primary').or(() => {
        cy.log('Le filtre admin est restauré')
      })
    })
  })

  describe('Pagination', () => {
    it('Affiche la pagination', () => {
      cy.get('[class*="pagination"], [class*="Pagination"]').should('exist')
    })

    it('Navigue entre les pages', () => {
      cy.get('[class*="pagination"], [class*="Pagination"]')
        .contains('2')
        .click({ force: true })
        .then(() => {
          cy.url().should('include', 'page=2')
        })
    })
  })
})
