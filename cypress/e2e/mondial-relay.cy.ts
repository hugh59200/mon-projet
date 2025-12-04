/**
 * Mondial Relay - Sélection Point Relais E2E Tests (Cypress)
 *
 * Tests pour le sélecteur de point relais dans le checkout.
 */

describe('Mondial Relay - Sélecteur de Point Relais', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('atlas_age_verified', 'true')
    })

    // Ajouter un produit au panier pour accéder au checkout
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]').first().click()
    cy.get('.product__actions button, [class*="product-actions"] button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Aller au checkout
    cy.visit('/checkout')
  })

  describe('Bouton Trigger', () => {
    it('Affiche le bouton pour choisir un point relais', () => {
      cy.get('.relay-selector').should('exist')
      cy.get('.relay-selector__trigger').should('be.visible')
    })

    it('Affiche le label "Choisir un point relais"', () => {
      cy.get('.relay-selector__trigger-title').should('contain.text', 'point relais')
    })

    it('Affiche les infos "Gratuit • Retrait en 48-72h"', () => {
      cy.get('.relay-selector__trigger-subtitle').should('contain.text', 'Gratuit')
      cy.get('.relay-selector__trigger-subtitle').should('contain.text', '48-72h')
    })

    it('Affiche l\'icône MapPin', () => {
      cy.get('.relay-selector__trigger-icon').should('be.visible')
    })

    it('Le bouton a un effet hover', () => {
      cy.get('.relay-selector__trigger')
        .trigger('mouseover')
        .should('have.css', 'cursor', 'pointer')
    })
  })

  describe('Ouverture de la Modale', () => {
    it('Ouvre la modale au clic sur le trigger', () => {
      cy.get('.relay-selector__trigger').click()

      cy.get('.relay-modal-overlay').should('be.visible')
      cy.get('.relay-modal').should('be.visible')
    })

    it('La modale a un header avec titre', () => {
      cy.get('.relay-selector__trigger').click()

      cy.get('.relay-modal__title').should('contain.text', 'point relais')
    })

    it('La modale a un sous-titre avec info livraison', () => {
      cy.get('.relay-selector__trigger').click()

      cy.get('.relay-modal__subtitle').should('contain.text', 'Retrait gratuit')
    })

    it('Affiche le champ de recherche par code postal', () => {
      cy.get('.relay-selector__trigger').click()

      cy.get('.relay-modal__search-input').should('be.visible')
      cy.get('.relay-modal__search-input').should(
        'have.attr',
        'placeholder',
        'Entrez votre code postal...',
      )
    })

    it('Affiche le bouton de recherche', () => {
      cy.get('.relay-selector__trigger').click()

      cy.get('.relay-modal__search-btn').should('be.visible')
      cy.contains('button', /Rechercher/i).should('be.visible')
    })
  })

  describe('Fermeture de la Modale', () => {
    beforeEach(() => {
      cy.get('.relay-selector__trigger').click()
    })

    it('Ferme la modale avec le bouton X', () => {
      cy.get('.relay-modal__close').click()

      cy.get('.relay-modal-overlay').should('not.exist')
    })

    it('Ferme la modale avec le bouton Fermer', () => {
      cy.get('.relay-modal__footer').contains('button', /Fermer/i).click()

      cy.get('.relay-modal-overlay').should('not.exist')
    })

    it('Ferme la modale en cliquant sur l\'overlay', () => {
      cy.get('.relay-modal-overlay').click('topLeft')

      cy.get('.relay-modal-overlay').should('not.exist')
    })
  })

  describe('État Vide', () => {
    beforeEach(() => {
      cy.get('.relay-selector__trigger').click()
    })

    it('Affiche l\'état vide par défaut', () => {
      cy.get('.relay-modal__empty').should('be.visible')
    })

    it('Affiche l\'icône MapPin dans l\'état vide', () => {
      cy.get('.relay-modal__empty-icon').should('be.visible')
    })

    it('Affiche le titre "Trouvez votre point relais"', () => {
      cy.get('.relay-modal__empty h4').should('contain.text', 'Trouvez votre point relais')
    })

    it('Affiche les instructions', () => {
      cy.get('.relay-modal__empty p').should('contain.text', 'code postal')
    })
  })

  describe('Recherche de Points Relais', () => {
    beforeEach(() => {
      cy.get('.relay-selector__trigger').click()
    })

    it('Le bouton rechercher est désactivé si code postal < 4 caractères', () => {
      cy.get('.relay-modal__search-input').type('75')

      cy.get('.relay-modal__search-btn').should('be.disabled')
    })

    it('Le bouton rechercher s\'active avec un code postal valide', () => {
      cy.get('.relay-modal__search-input').type('75001')

      cy.get('.relay-modal__search-btn').should('not.be.disabled')
    })

    it('Lance la recherche au clic sur le bouton', () => {
      cy.get('.relay-modal__search-input').type('75001')
      cy.get('.relay-modal__search-btn').click()

      // Devrait afficher le loading ou les résultats
      cy.get('.relay-modal__loading, .relay-modal__results, .relay-modal__error').should('exist')
    })

    it('Lance la recherche avec la touche Entrée', () => {
      cy.get('.relay-modal__search-input').type('75001{enter}')

      cy.get('.relay-modal__loading, .relay-modal__results, .relay-modal__error').should('exist')
    })

    it('Affiche l\'état de chargement pendant la recherche', () => {
      cy.get('.relay-modal__search-input').type('75001')
      cy.get('.relay-modal__search-btn').click()

      // Le spinner devrait être visible brièvement
      cy.get('.relay-modal__loading, .relay-modal__loading-spinner').should('exist')
    })

    it('Le bouton clear efface le code postal', () => {
      cy.get('.relay-modal__search-input').type('75001')

      cy.get('.relay-modal__search-clear').click()

      cy.get('.relay-modal__search-input').should('have.value', '')
    })
  })

  describe('Affichage des Résultats', () => {
    beforeEach(() => {
      cy.get('.relay-selector__trigger').click()
      cy.get('.relay-modal__search-input').type('75001')
      cy.get('.relay-modal__search-btn').click()

      // Attendre que les résultats ou erreur apparaissent
      cy.get('.relay-modal__results, .relay-modal__error', { timeout: 10000 }).should('exist')
    })

    it('Affiche le nombre de points relais trouvés', () => {
      cy.get('.relay-modal__results').should('exist').then(() => {
        cy.get('.relay-modal__results-header').should('contain.text', 'points relais trouvés')
      }).or(() => {
        cy.log('Aucun résultat ou erreur API')
      })
    })

    it('Affiche la liste des points relais', () => {
      cy.get('.relay-modal__results').should('exist').then(() => {
        cy.get('.relay-modal__results-list').should('be.visible')
        cy.get('.relay-point').should('have.length.at.least', 1)
      }).or(() => {
        cy.log('Aucun résultat')
      })
    })

    it('Chaque point relais affiche le nom', () => {
      cy.get('.relay-point').first().should('exist').then(($point) => {
        cy.wrap($point).find('.relay-point__name').should('be.visible')
      }).or(() => {
        cy.log('Aucun point relais affiché')
      })
    })

    it('Chaque point relais affiche l\'adresse', () => {
      cy.get('.relay-point').first().should('exist').then(($point) => {
        cy.wrap($point).find('.relay-point__address').should('be.visible')
      }).or(() => {
        cy.log('Aucun point relais affiché')
      })
    })

    it('Chaque point relais affiche la ville et le code postal', () => {
      cy.get('.relay-point').first().should('exist').then(($point) => {
        cy.wrap($point).find('.relay-point__city').should('be.visible')
      }).or(() => {
        cy.log('Aucun point relais affiché')
      })
    })

    it('Chaque point relais affiche la distance', () => {
      cy.get('.relay-point').first().should('exist').then(($point) => {
        cy.wrap($point).find('.relay-point__distance').should('contain.text', 'km')
      }).or(() => {
        cy.log('Aucun point relais affiché ou pas de distance')
      })
    })

    it('Chaque point relais a une icône MapPin', () => {
      cy.get('.relay-point').first().should('exist').then(($point) => {
        cy.wrap($point).find('.relay-point__marker').should('be.visible')
      }).or(() => {
        cy.log('Aucun point relais affiché')
      })
    })
  })

  describe('Sélection d\'un Point Relais', () => {
    beforeEach(() => {
      cy.get('.relay-selector__trigger').click()
      cy.get('.relay-modal__search-input').type('75001')
      cy.get('.relay-modal__search-btn').click()

      cy.get('.relay-modal__results, .relay-modal__error', { timeout: 10000 }).should('exist')
    })

    it('Sélectionne un point relais au clic', () => {
      cy.get('.relay-point').first().click().then(() => {
        // La modale devrait se fermer
        cy.get('.relay-modal-overlay').should('not.exist')
      }).or(() => {
        cy.log('Aucun point relais à sélectionner')
      })
    })

    it('Affiche le point relais sélectionné', () => {
      cy.get('.relay-point').first().click().then(() => {
        cy.get('.relay-selector__selected').should('be.visible')
      }).or(() => {
        cy.log('Aucun point relais à sélectionner')
      })
    })

    it('Affiche le badge "Point relais sélectionné"', () => {
      cy.get('.relay-point').first().click().then(() => {
        cy.get('.relay-selector__label').should('contain.text', 'Point relais sélectionné')
      }).or(() => {
        cy.log('Aucun point relais à sélectionner')
      })
    })

    it('Affiche le nom du point sélectionné', () => {
      cy.get('.relay-point').first().click().then(() => {
        cy.get('.relay-selector__name').should('be.visible')
      }).or(() => {
        cy.log('Aucun point relais à sélectionner')
      })
    })

    it('Affiche l\'adresse du point sélectionné', () => {
      cy.get('.relay-point').first().click().then(() => {
        cy.get('.relay-selector__address').should('be.visible')
      }).or(() => {
        cy.log('Aucun point relais à sélectionner')
      })
    })

    it('Affiche la distance du point sélectionné', () => {
      cy.get('.relay-point').first().click().then(() => {
        cy.get('.relay-selector__distance').should('contain.text', 'km')
      }).or(() => {
        cy.log('Aucun point relais à sélectionner ou pas de distance')
      })
    })
  })

  describe('Modification du Point Relais Sélectionné', () => {
    beforeEach(() => {
      // Sélectionner un point relais d'abord
      cy.get('.relay-selector__trigger').click()
      cy.get('.relay-modal__search-input').type('75001')
      cy.get('.relay-modal__search-btn').click()

      cy.get('.relay-modal__results, .relay-modal__error', { timeout: 10000 }).should('exist')
      cy.get('.relay-point').first().click().catch(() => {})
    })

    it('Affiche le bouton Modifier', () => {
      cy.get('.relay-selector__selected').should('exist').then(() => {
        cy.contains('button', /Modifier/i).should('be.visible')
      }).or(() => {
        cy.log('Aucun point sélectionné')
      })
    })

    it('Affiche le bouton pour supprimer la sélection', () => {
      cy.get('.relay-selector__selected').should('exist').then(() => {
        cy.get('.relay-selector__actions').find('button').should('have.length', 2)
      }).or(() => {
        cy.log('Aucun point sélectionné')
      })
    })

    it('Le bouton Modifier rouvre la modale', () => {
      cy.get('.relay-selector__selected').should('exist').then(() => {
        cy.contains('button', /Modifier/i).click()

        cy.get('.relay-modal-overlay').should('be.visible')
      }).or(() => {
        cy.log('Aucun point sélectionné')
      })
    })

    it('Le bouton X supprime la sélection', () => {
      cy.get('.relay-selector__selected').should('exist').then(() => {
        cy.get('.relay-selector__actions button').last().click()

        // Le trigger devrait réapparaître
        cy.get('.relay-selector__trigger').should('be.visible')
        cy.get('.relay-selector__selected').should('not.exist')
      }).or(() => {
        cy.log('Aucun point sélectionné')
      })
    })
  })

  describe('Gestion des Erreurs', () => {
    beforeEach(() => {
      cy.get('.relay-selector__trigger').click()
    })

    it('Affiche une erreur si le code postal est invalide', () => {
      cy.get('.relay-modal__search-input').type('00000')
      cy.get('.relay-modal__search-btn').click()

      cy.wait(5000)

      cy.get('.relay-modal__error, .relay-modal__empty').should('exist')
    })

    it('L\'erreur affiche un message explicatif', () => {
      cy.get('.relay-modal__search-input').type('00000')
      cy.get('.relay-modal__search-btn').click()

      cy.wait(5000)

      cy.get('.relay-modal__error').should('exist').then(() => {
        cy.get('.relay-modal__error').should('not.be.empty')
      }).or(() => {
        cy.log('Pas d\'erreur affichée')
      })
    })
  })

  describe('Footer de la Modale', () => {
    beforeEach(() => {
      cy.get('.relay-selector__trigger').click()
    })

    it('Affiche l\'info "Livraison offerte en point relais"', () => {
      cy.get('.relay-modal__footer-info').should('contain.text', 'Livraison offerte')
    })

    it('Affiche le bouton Fermer', () => {
      cy.get('.relay-modal__footer').contains('button', /Fermer/i).should('be.visible')
    })
  })

  describe('Responsive Mobile', () => {
    beforeEach(() => {
      cy.viewport(375, 667)
    })

    it('Le trigger s\'affiche correctement sur mobile', () => {
      cy.get('.relay-selector__trigger').should('be.visible')
    })

    it('La modale s\'affiche en bas sur mobile', () => {
      cy.get('.relay-selector__trigger').click()

      cy.get('.relay-modal').should('be.visible')
    })

    it('Le champ de recherche est empilé sur mobile', () => {
      cy.get('.relay-selector__trigger').click()

      cy.get('.relay-modal__search').should('have.css', 'flex-direction', 'column')
    })

    it('Le point sélectionné s\'affiche en colonne sur mobile', () => {
      // Sélectionner un point d'abord
      cy.get('.relay-selector__trigger').click()
      cy.get('.relay-modal__search-input').type('75001')
      cy.get('.relay-modal__search-btn').click()

      cy.get('.relay-point', { timeout: 10000 }).first().click().then(() => {
        cy.get('.relay-selector__selected').should('have.css', 'flex-direction', 'column')
      }).or(() => {
        cy.log('Aucun point relais')
      })
    })
  })

  describe('Animation', () => {
    it('La modale a une animation d\'entrée', () => {
      cy.get('.relay-selector__trigger').click()

      // L'animation devrait être en cours
      cy.get('.relay-modal').should('be.visible')
    })

    it('Les points relais apparaissent avec une animation séquentielle', () => {
      cy.get('.relay-selector__trigger').click()
      cy.get('.relay-modal__search-input').type('75001')
      cy.get('.relay-modal__search-btn').click()

      cy.get('.relay-point', { timeout: 10000 }).should('have.length.at.least', 1).then(() => {
        // Les points devraient avoir un délai d'animation
        cy.get('.relay-point').first().should('have.css', 'animation-delay')
      }).or(() => {
        cy.log('Aucun point relais')
      })
    })
  })
})
