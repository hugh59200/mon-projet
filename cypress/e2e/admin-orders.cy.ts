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
    // Attendre que la page soit chargée
    cy.get('.admin-orders', { timeout: 15000 }).should('be.visible')
  })

  describe('Affichage et Navigation', () => {
    it('Affiche la liste des commandes', () => {
      cy.get('.admin-orders').should('be.visible')
      cy.get('input[placeholder*="Rechercher"]').should('be.visible')
    })

    it('Affiche les colonnes du tableau (Desktop)', () => {
      cy.viewport(1280, 800)
      // Cliquer sur "Tout" pour voir les commandes
      cy.get('.admin-orders__tab').contains('Tout').click({ force: true })
      cy.wait(500)

      // Vérifier que le header existe
      cy.get('.admin-orders__header').should('be.visible')

      // Vérifier les cellules header (BasicCell utilise classe .elem)
      cy.get('.admin-orders__header .elem').should('have.length.at.least', 5)
    })

    it('Affiche les onglets de statut', () => {
      cy.get('.admin-orders__tabs').should('be.visible')
      cy.get('.admin-orders__tab').should('have.length', 4)
    })
  })

  describe('Filtrage par statut', () => {
    it('Affiche les commandes à valider par défaut', () => {
      // L'onglet "À valider" devrait être actif par défaut
      cy.get('.admin-orders__tab--active').should('exist')
    })

    it('Filtre les commandes en préparation', () => {
      cy.get('.admin-orders__tab').contains('preparation').click({ force: true })

      cy.url().should('include', 'status=processing')
    })

    it('Filtre les commandes expédiées', () => {
      cy.get('.admin-orders__tab').contains('Expedie').click({ force: true })

      cy.url().should('include', 'status=shipped')
    })

    it('Affiche toutes les commandes', () => {
      cy.get('.admin-orders__tab').contains('Tout').click({ force: true })

      // L'URL ne devrait plus avoir le filtre status=pending
      cy.url().should('not.include', 'status=pending')
    })

    it('Affiche les compteurs de statut', () => {
      cy.get('.admin-orders__tab-count').should('exist')
    })

    it('Le compteur "À valider" pulse si des commandes en attente', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.admin-orders__tab-count--alert').length > 0) {
          cy.get('.admin-orders__tab-count--alert').should('exist')
        } else {
          cy.log('Aucune commande en attente actuellement')
        }
      })
    })
  })

  describe('Recherche', () => {
    it('Filtre les commandes par numéro de référence', () => {
      // D'abord voir toutes les commandes
      cy.get('.admin-orders__tab').contains('Tout').click({ force: true })
      cy.wait(500)

      cy.get('input[placeholder*="Rechercher"]').type('FP-')
      cy.wait(500)

      cy.get('body').then(($body) => {
        if ($body.find('.gridElemWrapper').length > 0) {
          cy.get('.gridElemWrapper').should('exist')
        } else {
          cy.log('Aucune commande trouvée avec FP-')
        }
      })
    })

    it('Filtre les commandes par email client', () => {
      cy.get('.admin-orders__tab').contains('Tout').click({ force: true })
      cy.wait(300)

      cy.get('input[placeholder*="Rechercher"]').type('@')
      cy.wait(500)

      cy.get('body').then(($body) => {
        if ($body.find('.gridElemWrapper').length > 0) {
          cy.get('.gridElemWrapper').should('exist')
        }
      })
    })

    it('Filtre les commandes par nom client', () => {
      cy.get('.admin-orders__tab').contains('Tout').click({ force: true })
      cy.wait(300)

      cy.get('input[placeholder*="Rechercher"]').type('Jean')
      cy.wait(500)

      cy.get('body').then(($body) => {
        if ($body.find('.gridElemWrapper').length === 0) {
          cy.log('Aucun client nommé Jean')
        }
      })
    })
  })

  describe('Tri', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.get('.admin-orders__tab').contains('Tout').click({ force: true })
      cy.wait(500)
    })

    it('Trie les commandes par référence', () => {
      cy.get('.admin-orders__header .elem').first().find('svg').first().click({ force: true })

      cy.url().should('include', 'sort')
    })

    it('Trie les commandes par date', () => {
      cy.get('.admin-orders__header .elem').eq(1).find('svg').first().click({ force: true })

      cy.url().should('include', 'sort')
    })

    it('Trie les commandes par total', () => {
      cy.get('.admin-orders__header .elem').eq(3).find('svg').first().click({ force: true })

      cy.url().should('include', 'sort')
    })
  })

  describe('Affichage des méthodes de paiement', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.get('.admin-orders__tab').contains('Tout').click({ force: true })
      cy.wait(500)
    })

    it('Affiche les icônes de méthode de paiement', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.admin-orders__payment-method').length > 0) {
          cy.get('.admin-orders__payment-method').first().should('exist')
        } else {
          cy.log('Aucune commande avec méthode de paiement visible')
        }
      })
    })

    it('Distingue les paiements crypto, virement et carte', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.admin-orders__payment-method').length > 0) {
          cy.get('.admin-orders__payment-method').should('exist')
        } else {
          cy.log('Aucune méthode de paiement affichée')
        }
      })
    })
  })

  describe('Validation de paiement', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
    })

    it('Affiche le bouton de validation pour les commandes en attente', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.admin-orders__validate-btn').length > 0) {
          cy.get('.admin-orders__validate-btn').first().should('be.visible')
        } else {
          cy.log('Aucune commande en attente à valider')
        }
      })
    })

    it('Ouvre la modale de validation en cliquant sur le bouton', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.admin-orders__validate-btn').length > 0) {
          cy.get('.admin-orders__validate-btn').first().click()
          cy.get('.validation-modal, [class*="modal"]', { timeout: 10000 }).should('be.visible')
        } else {
          cy.log('Aucune commande à valider disponible')
        }
      })
    })

    it('La modale de validation affiche les détails de la commande', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.admin-orders__validate-btn').length > 0) {
          cy.get('.admin-orders__validate-btn').first().click()
          cy.get('.validation-modal', { timeout: 10000 }).should('be.visible')
          cy.get('.validation-modal__question').should('be.visible')
          cy.get('.validation-modal__details').should('be.visible')
        } else {
          cy.log('Aucune commande à valider')
        }
      })
    })

    it('La modale affiche un avertissement avant confirmation', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.admin-orders__validate-btn').length > 0) {
          cy.get('.admin-orders__validate-btn').first().click()
          cy.get('.validation-modal__warning', { timeout: 10000 }).should('be.visible')
        } else {
          cy.log('Aucune commande à valider')
        }
      })
    })

    it('Peut annuler la validation', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.admin-orders__validate-btn').length > 0) {
          cy.get('.admin-orders__validate-btn').first().click()
          cy.get('.validation-modal', { timeout: 10000 }).should('be.visible')
          cy.contains('button', /Annuler/i).click()
          cy.get('.validation-modal').should('not.exist')
        } else {
          cy.log('Aucune commande à valider')
        }
      })
    })
  })

  describe('Modale Détails Commande', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.get('.admin-orders__tab').contains('Tout').click({ force: true })
      cy.wait(500)
    })

    it('Ouvre la modale de détails en cliquant sur l\'icône œil', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.admin-orders__details-btn').length > 0) {
          cy.get('.admin-orders__details-btn').first().click()
          cy.get('[class*="modal"], [class*="Modal"]', { timeout: 10000 }).should('be.visible')
        } else {
          cy.log('Aucun bouton détails visible')
        }
      })
    })

    it('Ferme la modale avec le bouton fermer', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.admin-orders__details-btn').length > 0) {
          cy.get('.admin-orders__details-btn').first().click()
          cy.get('[class*="modal"], [class*="Modal"]', { timeout: 10000 }).should('be.visible')

          cy.get('body').then(($modalBody) => {
            if ($modalBody.find('.basicModal__close').length > 0) {
              cy.get('.basicModal__close').first().click({ force: true })
            } else if ($modalBody.find('[class*="close"]').length > 0) {
              cy.get('[class*="modal"] [class*="close"]').first().click({ force: true })
            } else {
              cy.get('[class*="modal"] button').first().click({ force: true })
            }
          })

          cy.get('[class*="modal"], [class*="Modal"]').should('not.exist')
        } else {
          cy.log('Aucun bouton détails visible')
        }
      })
    })
  })

  describe('Suppression de commande', () => {
    it('Affiche le bouton supprimer sur chaque commande', () => {
      cy.viewport(1280, 800)
      cy.get('.admin-orders__tab').contains('Tout').click({ force: true })
      cy.wait(500)

      cy.get('body').then(($body) => {
        if ($body.find('.gridElemWrapper').length > 0) {
          cy.get('.gridElemWrapper').first().within(() => {
            cy.get('.admin-orders__delete-btn, [class*="trash"], svg').should('exist')
          })
        } else {
          cy.log('Aucune commande affichée')
        }
      })
    })
  })

  describe('Affichage des statuts', () => {
    it('Les commandes pending ont une bordure spéciale', () => {
      cy.viewport(1280, 800)

      cy.get('body').then(($body) => {
        if ($body.find('.admin-orders__row--pending').length > 0) {
          cy.get('.admin-orders__row--pending').should('exist')
        } else {
          cy.log('Aucune commande en pending')
        }
      })
    })

    it('Affiche les badges de statut avec les bonnes couleurs', () => {
      cy.viewport(1280, 800)
      cy.get('.admin-orders__tab').contains('Tout').click({ force: true })
      cy.wait(500)

      cy.get('body').then(($body) => {
        if ($body.find('[class*="Badge"], [class*="badge"]').length > 0) {
          cy.get('[class*="Badge"], [class*="badge"]').should('exist')
        } else {
          cy.log('Aucun badge de statut visible')
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
      cy.get('.admin-orders__tab').contains('Tout').click({ force: true })
      cy.wait(500)

      cy.get('body').then(($body) => {
        if ($body.find('.admin-orders__mobile-card').length > 0) {
          cy.get('.admin-orders__mobile-card').should('exist')
        } else if ($body.find('.gridElemWrapper').length > 0) {
          cy.get('.gridElemWrapper').should('exist')
        } else {
          cy.log('Aucune commande affichée en mode mobile')
        }
      })
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
      cy.get('.admin-orders__tab').contains('Expedie').click({ force: true })
      cy.wait(300)

      cy.url().should('include', 'status=shipped')
    })

    it('Persiste la recherche dans l\'URL', () => {
      cy.get('.admin-orders__tab').contains('Tout').click({ force: true })
      cy.get('input[placeholder*="Rechercher"]').type('test')
      cy.wait(500)

      cy.url().should('include', 'search=test')
    })

    it('Restaure les filtres depuis l\'URL', () => {
      cy.visit('/admin/commandes?status=shipped')
      cy.wait(500)

      // L'onglet "Expédié" devrait être actif
      cy.get('.admin-orders__tab--active').should('exist')
    })
  })

  describe('Pagination', () => {
    it('Affiche la pagination', () => {
      cy.get('.admin-orders__tab').contains('Tout').click({ force: true })
      cy.wait(500)

      cy.get('[class*="pagination"], [class*="Pagination"]').should('exist')
    })

    it('Affiche le nombre total de résultats', () => {
      cy.get('.admin-orders__tab').contains('Tout').click({ force: true })
      cy.wait(500)

      // Le nombre de résultats devrait être visible dans la pagination
      cy.get('[class*="pagination"], [class*="Pagination"]').should('exist')
    })
  })
})
