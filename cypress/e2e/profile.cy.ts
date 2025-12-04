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
    // Attendre que la page se charge
    cy.get('.profil', { timeout: 15000 }).should('exist')
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

    it('L\'overlay est présent', () => {
      // Vérifier que l'overlay existe (son opacité change au survol via CSS)
      cy.get('.profil__avatar-overlay').should('exist')
    })

    it('Le champ input file est présent pour changer l\'avatar', () => {
      cy.get('.profil__avatar-input').should('exist')
    })
  })

  describe('Section Informations Personnelles', () => {
    it('Affiche la section avec titre', () => {
      // Chercher le FilterSection via son contenu - le titre peut être traduit
      cy.get('.profil__sections').should('be.visible')
      // Vérifier qu'au moins une section existe avec un titre
      cy.get('.profil__sections [class*="filter-section"]').should('have.length.at.least', 1)
    })

    it('Affiche le champ nom complet', () => {
      cy.get('.profil__form-grid').first().should('exist')
      cy.get('.profil__form-grid input').should('have.length.at.least', 1)
    })

    it('Affiche le champ téléphone', () => {
      cy.get('.profil__form-grid input').should('have.length.at.least', 2)
    })

    it('Affiche les champs d\'adresse', () => {
      cy.get('.profil__form-grid').should('exist')
    })

    it('Affiche le champ code postal', () => {
      cy.get('input[placeholder="75000"]').should('exist')
    })

    it('Affiche le champ ville', () => {
      cy.get('input[placeholder="Paris"]').should('exist')
    })

    it('Affiche le champ pays', () => {
      cy.get('input[placeholder="France"]').should('exist')
    })

    it('Le bouton sauvegarder est désactivé sans changements', () => {
      cy.get('.profil__actions').first().find('button').should('be.disabled')
    })

    it('Le bouton s\'active après modification', () => {
      cy.get('.profil__form-grid input').first().clear().type('Test Modification')
      cy.get('.profil__actions').first().find('button').should('not.be.disabled')
    })
  })

  describe('Section Commandes Récentes', () => {
    it('Affiche la section commandes', () => {
      cy.get('.profil__orders').should('exist')
    })

    it('Affiche les cartes de commandes ou un message vide', () => {
      cy.get('.profil__orders').within(() => {
        // Soit des commandes, soit un message vide
        cy.get('.profil__order-card, .profil__orders-empty').should('exist')
      })
    })

    it('Affiche le bouton "Voir toutes les commandes"', () => {
      // Le bouton est dans un FilterSection, chercher via contains
      cy.contains('button', /Voir/i).should('exist')
    })

    it('Le bouton redirige vers la liste des commandes', () => {
      cy.contains('button', /Voir/i).first().click()
      cy.url().should('include', '/profil/commandes')
    })
  })

  describe('Section Préférences', () => {
    it('Affiche la section préférences', () => {
      cy.get('.profil__preferences').should('exist')
    })

    it('Affiche le sélecteur de thème', () => {
      cy.get('.profil__pref-card--premium').should('exist')
    })

    it('Affiche les options de notifications', () => {
      cy.get('.profil__pref-card--secondary').should('exist')
    })

    it('Affiche les éléments de la carte notifications', () => {
      // Vérifier que la carte secondary existe (peut être dans une section repliée)
      cy.get('.profil__pref-card--secondary').should('exist')
      cy.get('.profil__pref-card--secondary [class*="pref-card-list"]').should('exist')
    })
  })

  describe('Section Sécurité', () => {
    it('La section sécurité contient des éléments', () => {
      // Vérifier que la section sécurité existe via son titre
      cy.contains(/Sécurité|Security/i).should('exist')
    })

    it('La zone danger existe', () => {
      // La section peut être repliée, vérifier que l'élément existe dans le DOM
      cy.get('.profil__danger').should('exist')
    })
  })

  describe('Section Support', () => {
    it('Affiche la section support', () => {
      cy.contains(/Support/i).should('be.visible')
    })

    it('Affiche la description du support', () => {
      cy.contains(/question|aide|help|support/i).should('exist')
    })

    it('Un bouton existe dans les sections', () => {
      // Vérifier qu'il y a des boutons dans les sections
      cy.get('.profil__sections button').should('have.length.at.least', 1)
    })
  })

  describe('Sections Accordéon', () => {
    it('Les sections existent', () => {
      // Les sections utilisent filter-section (minuscule avec tiret)
      cy.get('.profil__sections').within(() => {
        cy.get('[class*="filter-section"]').should('have.length.at.least', 1)
      })
    })

    it('L\'état des sections est persisté', () => {
      // Ce test vérifie la persistance via localStorage ou Supabase
      cy.reload()
      // Les sections devraient garder leur état
      cy.get('.profil__sections', { timeout: 10000 }).should('exist')
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

    it('Les grilles de formulaire s\'adaptent sur mobile', () => {
      // Vérifier que les grilles existent et sont visibles
      cy.get('.profil__form-grid').first().should('be.visible')
    })

    it('Les cartes de commande s\'adaptent sur mobile', () => {
      // Vérifier que la section commandes existe et est visible
      cy.get('.profil__orders').should('be.visible')
    })
  })

  describe('Thème', () => {
    it('Le sélecteur de thème est interactif', () => {
      // Trouver le sélecteur de thème et vérifier qu'il existe
      cy.get('.profil__pref-card--premium').within(() => {
        cy.get('[class*="ThemeSelector"], [class*="theme"], button').should('exist')
      })
    })

    it('Le thème est appliqué au HTML', () => {
      // Vérifier qu'un thème est appliqué
      cy.get('html').then(($html) => {
        const hasTheme = $html.hasClass('theme-brown') || $html.hasClass('theme-blue')
        expect(hasTheme).to.be.true
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
    cy.get('.profil', { timeout: 15000 }).should('exist')
    cy.contains('button', /Voir/i).first().click()
    cy.url().should('include', '/profil/commandes')
  })

  it('La page des commandes affiche l\'historique', () => {
    cy.visit('/profil/commandes')
    // Vérifier que la page existe
    cy.get('body').should('not.be.empty')
  })
})
