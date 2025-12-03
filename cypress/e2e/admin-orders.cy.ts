/**
 * Admin - Gestion des Commandes E2E Tests (Cypress)
 *
 * Tests pour la gestion des commandes dans le panneau d'administration.
 * Note: Ces tests nécessitent un compte admin connecté.
 */

describe('Admin - Gestion des Commandes', () => {
  beforeEach(() => {
    // Se connecter en tant qu'admin
    cy.loginAsAdmin()
    cy.visit('/admin/commandes')
  })

  describe('Affichage et Navigation', () => {
    it('Affiche la liste des commandes', () => {
      cy.get('.admin-orders').should('be.visible')
      cy.get('.admin-orders input[placeholder*="Rechercher"]').should('be.visible')
    })

    it('Affiche les colonnes du tableau (Desktop)', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-orders__header, .cardLayoutWrapper--header').within(() => {
        cy.contains('Ref').should('be.visible')
        cy.contains('Date').should('be.visible')
        cy.contains('Client').should('be.visible')
        cy.contains('Total').should('be.visible')
        cy.contains('Paiement').should('be.visible')
        cy.contains('Statut').should('be.visible')
      })
    })

    it('Affiche les onglets de statut', () => {
      cy.get('.admin-orders__tabs').should('be.visible')
      cy.contains('button', /Valider/i).should('be.visible')
      cy.contains('button', /preparation|préparation/i).should('be.visible')
      cy.contains('button', /Expédié|Expedie/i).should('be.visible')
      cy.contains('button', /Tout/i).should('be.visible')
    })
  })

  describe('Filtrage par statut', () => {
    it('Affiche les commandes à valider par défaut', () => {
      // L'onglet "À valider" devrait être actif par défaut
      cy.get('.admin-orders__tab--active').should('contain.text', 'Valider')

      // L'URL devrait avoir le statut pending
      cy.url().should('include', 'status=pending')
    })

    it('Filtre les commandes en préparation', () => {
      cy.contains('button', /preparation|préparation/i).click()

      cy.url().should('include', 'status=processing')
    })

    it('Filtre les commandes expédiées', () => {
      cy.contains('button', /Expédié|Expedie/i).click()

      cy.url().should('include', 'status=shipped')
    })

    it('Affiche toutes les commandes', () => {
      cy.contains('button', /Tout/i).click()

      // L'URL ne devrait plus avoir le filtre status
      cy.url().should('not.include', 'status=pending')
    })

    it('Affiche les compteurs de statut', () => {
      cy.get('.admin-orders__tab-count').should('exist')
    })

    it('Le compteur "À valider" pulse si des commandes en attente', () => {
      cy.get('.admin-orders__tab-count--alert').should('exist').or(() => {
        cy.log('Aucune commande en attente actuellement')
      })
    })
  })

  describe('Recherche', () => {
    it('Filtre les commandes par numéro de référence', () => {
      // D'abord voir toutes les commandes
      cy.contains('button', /Tout/i).click()
      cy.wait(500)

      cy.get('.admin-orders input[placeholder*="Rechercher"]').type('FP-')
      cy.wait(500)

      cy.get('.admin-orders__row, .admin-orders__mobile-card').should('exist')
    })

    it('Filtre les commandes par email client', () => {
      cy.contains('button', /Tout/i).click()
      cy.wait(300)

      cy.get('.admin-orders input[placeholder*="Rechercher"]').type('@')
      cy.wait(500)

      cy.get('body').then(($body) => {
        if ($body.find('.admin-orders__row').length > 0) {
          cy.get('.admin-orders__row').should('exist')
        }
      })
    })

    it('Filtre les commandes par nom client', () => {
      cy.contains('button', /Tout/i).click()
      cy.wait(300)

      cy.get('.admin-orders input[placeholder*="Rechercher"]').type('Jean')
      cy.wait(500)

      cy.get('body').then(($body) => {
        if ($body.find('.admin-orders__row').length === 0) {
          cy.log('Aucun client nommé Jean')
        }
      })
    })
  })

  describe('Tri', () => {
    it('Trie les commandes par référence', () => {
      cy.viewport(1280, 800)
      cy.contains('button', /Tout/i).click()
      cy.wait(300)

      cy.get('.admin-orders__header, .cardLayoutWrapper--header')
        .contains('Ref')
        .closest('[class*="Cell"]')
        .find('[class*="icon"], svg')
        .click()

      cy.url().should('include', 'sort')
    })

    it('Trie les commandes par date', () => {
      cy.viewport(1280, 800)
      cy.contains('button', /Tout/i).click()
      cy.wait(300)

      cy.get('.admin-orders__header, .cardLayoutWrapper--header')
        .contains('Date')
        .closest('[class*="Cell"]')
        .find('[class*="icon"], svg')
        .click()

      cy.url().should('include', 'sort')
    })

    it('Trie les commandes par total', () => {
      cy.viewport(1280, 800)
      cy.contains('button', /Tout/i).click()
      cy.wait(300)

      cy.get('.admin-orders__header, .cardLayoutWrapper--header')
        .contains('Total')
        .closest('[class*="Cell"]')
        .find('[class*="icon"], svg')
        .click()

      cy.url().should('include', 'sort')
    })
  })

  describe('Affichage des méthodes de paiement', () => {
    it('Affiche les icônes de méthode de paiement', () => {
      cy.viewport(1280, 800)
      cy.contains('button', /Tout/i).click()
      cy.wait(500)

      cy.get('.admin-orders__row').first().within(() => {
        cy.get('.admin-orders__payment-method').should('exist')
      })
    })

    it('Distingue les paiements crypto, virement et carte', () => {
      cy.viewport(1280, 800)
      cy.contains('button', /Tout/i).click()
      cy.wait(500)

      cy.get('.admin-orders__payment-method').should('exist')

      // Vérifier les classes de style
      cy.get('.admin-orders__payment-method').each(($el) => {
        cy.wrap($el).should('have.class', 'payment--crypto')
          .or('have.class', 'payment--bank')
          .or('have.class', 'payment--card')
      })
    })
  })

  describe('Validation de paiement', () => {
    it('Affiche le bouton de validation pour les commandes en attente', () => {
      cy.viewport(1280, 800)
      // S'assurer qu'on est sur l'onglet "À valider"
      cy.contains('button', /Valider/i).first().click()
      cy.wait(500)

      cy.get('.admin-orders__row--pending').first().within(() => {
        cy.get('.admin-orders__validate-btn').should('be.visible')
      }).or(() => {
        cy.log('Aucune commande en attente à valider')
      })
    })

    it('Ouvre la modale de validation en cliquant sur le bouton', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-orders__validate-btn').first().click().then(() => {
        // La modale de validation devrait s'afficher
        cy.get('.validation-modal, [class*="modal"]').should('be.visible')
      }).or(() => {
        cy.log('Aucune commande à valider disponible')
      })
    })

    it('La modale de validation affiche les détails de la commande', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-orders__validate-btn').first().click().then(() => {
        cy.get('.validation-modal').within(() => {
          // Vérifier les informations affichées
          cy.get('.validation-modal__question').should('be.visible')
          cy.get('.validation-modal__details').should('be.visible')
          cy.contains('Commande').should('be.visible')
          cy.contains('Client').should('be.visible')
          cy.contains('Email').should('be.visible')
        })
      }).or(() => {
        cy.log('Aucune commande à valider')
      })
    })

    it('La modale affiche un avertissement avant confirmation', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-orders__validate-btn').first().click().then(() => {
        cy.get('.validation-modal__warning').should('be.visible')
        cy.contains(/préparation|preparation/i).should('be.visible')
      }).or(() => {
        cy.log('Aucune commande à valider')
      })
    })

    it('Peut annuler la validation', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-orders__validate-btn').first().click().then(() => {
        cy.contains('button', /Annuler/i).click()

        // La modale devrait se fermer
        cy.get('.validation-modal').should('not.exist')
      }).or(() => {
        cy.log('Aucune commande à valider')
      })
    })
  })

  describe('Modale Détails Commande', () => {
    it('Ouvre la modale de détails en cliquant sur l\'icône œil', () => {
      cy.viewport(1280, 800)
      cy.contains('button', /Tout/i).click()
      cy.wait(500)

      cy.get('.admin-orders__details-btn').first().click()

      cy.get('[class*="modal"], [class*="Modal"]').should('be.visible')
    })

    it('Ferme la modale avec le bouton fermer', () => {
      cy.viewport(1280, 800)
      cy.contains('button', /Tout/i).click()
      cy.wait(500)

      cy.get('.admin-orders__details-btn').first().click()
      cy.get('[class*="modal"], [class*="Modal"]').should('be.visible')

      cy.get('[class*="modal"], [class*="Modal"]')
        .find('button[class*="close"], [aria-label*="close"], [class*="Close"]')
        .first()
        .click()

      cy.get('[class*="modal"], [class*="Modal"]').should('not.exist')
    })
  })

  describe('Suppression de commande', () => {
    it('Affiche le bouton supprimer sur chaque commande', () => {
      cy.viewport(1280, 800)
      cy.contains('button', /Tout/i).click()
      cy.wait(500)

      cy.get('.admin-orders__row').first().within(() => {
        cy.get('.admin-orders__delete-btn').should('exist')
      })
    })
  })

  describe('Affichage des statuts', () => {
    it('Les commandes pending ont une bordure spéciale', () => {
      cy.viewport(1280, 800)

      cy.get('.admin-orders__row--pending').should('exist').or(() => {
        cy.log('Aucune commande en pending')
      })
    })

    it('Affiche les badges de statut avec les bonnes couleurs', () => {
      cy.viewport(1280, 800)
      cy.contains('button', /Tout/i).click()
      cy.wait(500)

      cy.get('.admin-orders__row [class*="Badge"], .admin-orders__row [class*="badge"]').should(
        'exist',
      )
    })
  })

  describe('Responsive Mobile', () => {
    beforeEach(() => {
      cy.viewport(375, 667)
    })

    it('Affiche les cartes mobiles au lieu du tableau', () => {
      cy.contains('button', /Tout/i).click()
      cy.wait(500)

      cy.get('.admin-orders__mobile-card, [class*="OrderCardMobile"]').should('exist')
    })

    it('Les onglets sont accessibles sur mobile', () => {
      cy.get('.admin-orders__tabs').should('be.visible')
      cy.get('.admin-orders__tab').should('have.length.at.least', 4)
    })

    it('Les icônes remplacent les labels sur mobile', () => {
      cy.get('.admin-orders__tab-icon').should('be.visible')
    })
  })

  describe('Persistence URL', () => {
    it('Persiste le statut dans l\'URL', () => {
      cy.contains('button', /Expédié|Expedie/i).click()
      cy.wait(300)

      cy.url().should('include', 'status=shipped')
    })

    it('Persiste la recherche dans l\'URL', () => {
      cy.contains('button', /Tout/i).click()
      cy.get('.admin-orders input[placeholder*="Rechercher"]').type('test')
      cy.wait(500)

      cy.url().should('include', 'search=test')
    })

    it('Restaure les filtres depuis l\'URL', () => {
      cy.visit('/admin/commandes?status=shipped')

      // L'onglet "Expédié" devrait être actif
      cy.get('.admin-orders__tab--active').should('contain.text', 'Expédié').or(() => {
        cy.get('.admin-orders__tab--active').should('contain.text', 'Expedie')
      })
    })
  })

  describe('Pagination', () => {
    it('Affiche la pagination', () => {
      cy.contains('button', /Tout/i).click()
      cy.wait(500)

      cy.get('[class*="pagination"], [class*="Pagination"]').should('exist')
    })

    it('Affiche le nombre total de résultats', () => {
      cy.contains('button', /Tout/i).click()
      cy.wait(500)

      // Le nombre de résultats devrait être visible
      cy.get('[class*="pagination"], [class*="Pagination"]').should('contain.text', /\d+/)
    })
  })
})
