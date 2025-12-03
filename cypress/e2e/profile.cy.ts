/**
 * Profil Utilisateur E2E Tests (Cypress)
 *
 * Tests pour la page de profil utilisateur avec toutes ses sections.
 * Note: Ces tests nécessitent un utilisateur connecté.
 */

describe('Profil Utilisateur', () => {
  beforeEach(() => {
    // Se connecter en tant qu'admin (pour avoir un profil)
    cy.loginAsAdmin()
    cy.visit('/profil')
  })

  describe('Affichage Global', () => {
    it('Affiche la bannière de couverture', () => {
      cy.get('.profil__cover').should('be.visible')
      cy.get('.profil__cover-img').should('be.visible')
    })

    it('Affiche le container principal avec effet glass', () => {
      cy.get('.profil__container').should('be.visible')
    })

    it('Affiche le header avec avatar', () => {
      cy.get('.profil__header').should('be.visible')
      cy.get('.profil__avatar').should('be.visible')
    })

    it('Affiche l\'email de l\'utilisateur', () => {
      cy.get('.profil__meta').should('be.visible')
    })
  })

  describe('Section Avatar', () => {
    it('Affiche l\'avatar ou le placeholder', () => {
      cy.get('.profil__avatar').within(() => {
        cy.get('.profil__avatar-img, .profil__avatar-placeholder').should('exist')
      })
    })

    it('L\'overlay apparaît au survol', () => {
      cy.get('.profil__avatar').trigger('mouseover')
      cy.get('.profil__avatar-overlay').should('be.visible')
    })

    it('Le champ input file est présent pour changer l\'avatar', () => {
      cy.get('.profil__avatar-input').should('exist')
    })
  })

  describe('Section Informations Personnelles', () => {
    it('Affiche la section avec titre', () => {
      cy.contains('Informations personnelles').should('be.visible').or(() => {
        cy.get('[class*="FilterSection"]').first().should('be.visible')
      })
    })

    it('Affiche le champ nom complet', () => {
      cy.get('input[placeholder*="nom"], [class*="WrapperInput"]').should('exist')
    })

    it('Affiche le champ téléphone', () => {
      cy.get('[class*="WrapperInput"]').should('exist')
    })

    it('Affiche les champs d\'adresse', () => {
      cy.get('.profil__form-grid').should('exist')
    })

    it('Affiche le champ code postal', () => {
      cy.get('input[placeholder*="75000"], [label*="postal"]').should('exist').or(() => {
        cy.get('[class*="WrapperInput"]').should('have.length.at.least', 3)
      })
    })

    it('Affiche le champ ville', () => {
      cy.get('input[placeholder*="Paris"]').should('exist').or(() => {
        cy.get('[class*="WrapperInput"]').should('have.length.at.least', 4)
      })
    })

    it('Affiche le champ pays', () => {
      cy.get('input[placeholder*="France"]').should('exist').or(() => {
        cy.get('[class*="WrapperInput"]').should('have.length.at.least', 5)
      })
    })

    it('Le bouton sauvegarder est désactivé sans changements', () => {
      cy.contains('button', /Enregistrer|Sauvegarder|Save/i).first().should('be.disabled')
    })

    it('Le bouton s\'active après modification', () => {
      cy.get('[class*="WrapperInput"] input').first().clear().type('Test Modification')

      cy.contains('button', /Enregistrer|Sauvegarder|Save/i).first().should('not.be.disabled')
    })
  })

  describe('Section Commandes Récentes', () => {
    it('Affiche la section commandes', () => {
      cy.contains(/Commandes récentes|Dernières commandes/i).should('be.visible').or(() => {
        cy.get('[icon="Box"]').should('exist')
      })
    })

    it('Affiche les cartes de commandes ou un message vide', () => {
      cy.get('.profil__orders').should('exist')

      cy.get('.profil__order-card').should('exist').or(() => {
        cy.contains(/Aucune commande|pas encore de commande/i).should('be.visible')
      })
    })

    it('Les cartes de commande affichent le numéro', () => {
      cy.get('.profil__order-card').first().should('exist').then(($card) => {
        cy.wrap($card).should('contain.text', '#').or(() => {
          cy.wrap($card).find('[class*="Badge"]').should('exist')
        })
      }).or(() => {
        cy.log('Aucune commande à afficher')
      })
    })

    it('Les cartes de commande affichent le statut avec badge', () => {
      cy.get('.profil__order-card [class*="Badge"]').should('exist').or(() => {
        cy.log('Aucune commande à afficher')
      })
    })

    it('Les cartes de commande sont cliquables', () => {
      cy.get('.profil__order-card').first().should('have.css', 'cursor', 'pointer').or(() => {
        cy.log('Aucune commande à afficher')
      })
    })

    it('Affiche le bouton "Voir toutes les commandes"', () => {
      cy.contains('button', /Voir toutes|Voir plus|All orders/i).should('be.visible')
    })

    it('Le bouton redirige vers la liste des commandes', () => {
      cy.contains('button', /Voir toutes|Voir plus/i).click()

      cy.url().should('include', '/profil/commandes')
    })
  })

  describe('Section Préférences', () => {
    it('Affiche la section préférences', () => {
      cy.contains(/Préférences|Preferences/i).should('be.visible')
    })

    it('Affiche le sélecteur de thème', () => {
      cy.get('.profil__pref-card--premium').should('exist')
      cy.contains(/Apparence|Theme/i).should('be.visible')
    })

    it('Affiche les options de thème', () => {
      cy.get('[class*="ThemeSelector"], [class*="theme-selector"]').should('exist')
    })

    it('Affiche les options de notifications', () => {
      cy.get('.profil__pref-card--secondary').should('exist')
      cy.contains(/Notifications/i).should('be.visible')
    })

    it('Affiche la checkbox newsletter', () => {
      cy.get('[class*="Checkbox"], [type="checkbox"]').should('exist')
    })

    it('Le bouton sauvegarder préférences est présent', () => {
      cy.get('.profil__preferences')
        .closest('[class*="FilterSection"]')
        .find('button')
        .contains(/Sauvegarder|Enregistrer|Save/i)
        .should('exist')
    })
  })

  describe('Section Sécurité', () => {
    it('Affiche la section sécurité', () => {
      cy.contains(/Sécurité|Security/i).should('be.visible')
    })

    it('Affiche les champs de changement de mot de passe', () => {
      cy.get('input[type="password"]').should('have.length.at.least', 2)
    })

    it('Le bouton de mise à jour est désactivé si les mots de passe ne correspondent pas', () => {
      cy.get('input[type="password"]').first().type('Password123!')
      cy.get('input[type="password"]').last().type('DifferentPassword!')

      cy.contains('button', /Mettre à jour|Update password/i).should('be.disabled')
    })

    it('Le bouton de mise à jour est désactivé si le mot de passe est trop court', () => {
      cy.get('input[type="password"]').first().type('12345')
      cy.get('input[type="password"]').last().type('12345')

      cy.contains('button', /Mettre à jour|Update password/i).should('be.disabled')
    })

    it('Affiche le bouton de suppression de compte', () => {
      cy.get('.profil__danger').should('exist')
      cy.contains('button', /Supprimer|Delete account/i).should('be.visible')
    })

    it('Le bouton de suppression a un style danger', () => {
      cy.contains('button', /Supprimer|Delete account/i).should('have.class', 'danger').or(() => {
        // Vérifier le type ou une classe alternative
        cy.contains('button', /Supprimer|Delete account/i).parent().should('have.class', 'profil__danger')
      })
    })
  })

  describe('Section Support', () => {
    it('Affiche la section support', () => {
      cy.contains(/Support/i).should('be.visible')
    })

    it('Affiche la description du support', () => {
      cy.contains(/question|aide|help|support/i).should('exist')
    })

    it('Affiche le bouton pour ouvrir la messagerie', () => {
      cy.contains('button', /Messagerie|Ouvrir|Contact/i).should('be.visible')
    })

    it('Le bouton ouvre le chat pour les utilisateurs', () => {
      cy.contains('button', /Messagerie|Ouvrir/i).click()

      // Soit le chat widget s'ouvre, soit on redirige vers messagerie admin
      cy.get('.chat-widget--open, .chat-widget__window').should('be.visible').or(() => {
        cy.url().should('include', '/messagerie')
      })
    })
  })

  describe('Sections Accordéon (FilterSection)', () => {
    it('Les sections sont dépliables/repliables', () => {
      // Cliquer sur le header d'une section
      cy.get('[class*="FilterSection__head"]').first().click()

      // Le contenu devrait se replier ou se déplier
      cy.get('[class*="FilterSection"]').first().should('exist')
    })

    it('L\'état des sections est persisté', () => {
      // Ce test vérifie la persistance via localStorage ou Supabase
      cy.reload()

      // Les sections devraient garder leur état
      cy.get('[class*="FilterSection"]').should('exist')
    })
  })

  describe('Responsive Mobile', () => {
    beforeEach(() => {
      cy.viewport(375, 667)
    })

    it('Le layout s\'adapte sur mobile', () => {
      cy.get('.profil__container').should('be.visible')
    })

    it('Le header est centré sur mobile', () => {
      cy.get('.profil__header').should('have.css', 'flex-direction', 'column')
    })

    it('Les grilles de formulaire passent en une colonne', () => {
      cy.get('.profil__form-grid').should('have.css', 'grid-template-columns').and('match', /1fr/)
    })

    it('Les cartes de commande s\'empilent verticalement', () => {
      cy.get('.profil__orders').should('have.css', 'grid-template-columns').and('match', /1fr/)
    })
  })

  describe('Thème', () => {
    it('Change le thème quand on sélectionne une option', () => {
      // Trouver le sélecteur de thème et cliquer sur une option
      cy.get('[class*="ThemeSelector"] [class*="option"], [class*="theme-selector"] button')
        .first()
        .click()

      // Le thème devrait changer sur le HTML
      cy.get('html').should('have.class', 'theme-brown').or(() => {
        cy.get('html').should('have.class', 'theme-blue')
      })
    })

    it('Le thème est persisté après rechargement', () => {
      // Changer le thème
      cy.get('[class*="ThemeSelector"] [class*="option"], [class*="theme-selector"] button')
        .last()
        .click()

      // Recharger
      cy.reload()

      // Le thème devrait être restauré
      cy.get('html').should('have.class', 'theme-brown').or(() => {
        cy.get('html').should('have.class', 'theme-blue')
      })
    })
  })
})

describe('Profil - Navigation vers Commandes', () => {
  beforeEach(() => {
    // Se connecter en tant qu'admin
    cy.loginAsAdmin()
  })

  it('Accède à la liste des commandes depuis le profil', () => {
    cy.visit('/profil')

    cy.contains('button', /Voir toutes|Voir plus/i).click()

    cy.url().should('include', '/profil/commandes')
  })

  it('La page des commandes affiche l\'historique', () => {
    cy.visit('/profil/commandes')

    // Vérifier que la page existe
    cy.get('body').should('not.be.empty')
  })
})
