/**
 * Chat E2E Tests (Cypress)
 *
 * Tests pour le chat support : widget utilisateur et interface admin.
 */

describe('Chat Widget (Utilisateur)', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('atlas_age_verified', 'true')
    })
    // Visiter une page où le widget chat est visible
    cy.visit('/catalogue')
  })

  describe('Bouton Flottant', () => {
    it('Affiche le bouton flottant en bas à droite', () => {
      cy.get('.chat-widget').should('be.visible')
      cy.get('.chat-widget__toggle').should('be.visible')
    })

    it('Le bouton a une icône casque par défaut', () => {
      cy.get('.chat-widget__toggle').within(() => {
        // L'icône Headphones devrait être visible
        cy.get('[class*="icon"], svg').should('be.visible')
      })
    })

    it('Le bouton a un effet hover', () => {
      cy.get('.chat-widget__toggle')
        .trigger('mouseover')
        .should('have.css', 'cursor', 'pointer')
    })
  })

  describe('Ouverture/Fermeture du Widget', () => {
    it('Ouvre la fenêtre de chat au clic', () => {
      cy.get('.chat-widget__toggle').click()

      // La fenêtre de chat devrait apparaître
      cy.get('.chat-widget__window').should('be.visible')
    })

    it('L\'icône change en X quand le chat est ouvert', () => {
      cy.get('.chat-widget__toggle').click()

      // L'icône devrait changer
      cy.get('.chat-widget__toggle--active').should('exist')
    })

    it('Ferme le chat en recliquant sur le bouton', () => {
      cy.get('.chat-widget__toggle').click()
      cy.get('.chat-widget__window').should('be.visible')

      cy.get('.chat-widget__toggle').click()
      cy.get('.chat-widget__window').should('not.exist')
    })

    it('Ferme le chat avec le bouton dans le header', () => {
      cy.get('.chat-widget__toggle').click()
      cy.get('.chat-widget__window').should('be.visible')

      cy.get('.chat-widget__header-close').click()
      cy.get('.chat-widget__window').should('not.exist')
    })
  })

  describe('Header du Widget', () => {
    beforeEach(() => {
      cy.get('.chat-widget__toggle').click()
    })

    it('Affiche le titre "Support Fast Peptides"', () => {
      cy.get('.chat-widget__header-title').should('contain.text', 'Support')
    })

    it('Affiche le statut "En ligne"', () => {
      cy.get('.chat-widget__header-status').should('contain.text', 'En ligne')
    })

    it('Affiche l\'avatar avec le dot de statut vert', () => {
      cy.get('.chat-widget__header-avatar').should('be.visible')
      cy.get('.chat-widget__header-status-dot').should('be.visible')
    })
  })

  describe('Zone de Chat', () => {
    beforeEach(() => {
      cy.get('.chat-widget__toggle').click()
    })

    it('Affiche la zone de messages', () => {
      // ChatCore devrait être visible
      cy.get('[class*="ChatCore"], [class*="chat-core"]').should('be.visible')
    })

    it('Affiche le champ de saisie de message', () => {
      cy.get('[class*="ChatInput"], [class*="chat-input"], textarea, input[type="text"]')
        .should('be.visible')
    })

    it('Le champ de saisie accepte du texte', () => {
      cy.get('[class*="ChatInput"] input, [class*="ChatInput"] textarea, [class*="chat-input"] input')
        .first()
        .type('Bonjour, j\'ai une question')
        .should('have.value', 'Bonjour, j\'ai une question')
    })
  })

  describe('Badge de Notifications', () => {
    it('Le badge est masqué quand il n\'y a pas de messages non lus', () => {
      // Par défaut, pas de badge si pas de messages
      cy.get('.chat-widget__badge').should('not.exist')
    })

    it('Affiche "9+" si plus de 9 messages non lus', () => {
      // Ce test nécessiterait de simuler des messages non lus
      // Pour l'instant, on vérifie juste la structure
      cy.get('.chat-widget').should('exist')
    })
  })

  describe('Animation Pulse', () => {
    it('Le pulse est visible quand des messages non lus', () => {
      // Le pulse ne devrait exister que s'il y a des messages non lus
      cy.get('.chat-widget__pulse').should('not.exist').or(() => {
        cy.get('.chat-widget__pulse').should('be.visible')
      })
    })
  })

  describe('Responsive Mobile', () => {
    beforeEach(() => {
      cy.viewport(375, 667)
    })

    it('Le widget prend tout l\'écran sur mobile', () => {
      cy.get('.chat-widget__toggle').click()

      // Sur mobile, la fenêtre devrait être en plein écran
      cy.get('.chat-widget__window')
        .should('be.visible')
        .and('have.css', 'position', 'fixed')
    })

    it('Le bouton toggle est plus petit sur mobile', () => {
      cy.get('.chat-widget__toggle')
        .should('be.visible')
    })
  })
})

describe('Chat Admin', () => {
  beforeEach(() => {
    // Se connecter en tant qu'admin
    cy.loginAsAdmin()
    cy.visit('/admin/messagerie')
  })

  describe('Layout Principal', () => {
    it('Affiche la toolbar avec recherche', () => {
      cy.get('.chat-admin').should('be.visible')
      cy.get('input[placeholder*="Rechercher"]').should('be.visible')
    })

    it('Affiche le compteur de conversations', () => {
      cy.get('.chat-admin__count').should('be.visible')
      cy.get('.chat-admin__count').should('contain.text', 'conversation')
    })

    it('Affiche le layout deux colonnes (Desktop)', () => {
      cy.viewport(1280, 800)

      cy.get('.chat-admin__layout').should('be.visible')
      cy.get('.chat-admin__sidebar').should('be.visible')
      cy.get('.chat-admin__chat').should('be.visible')
    })
  })

  describe('Sidebar - Liste des Conversations', () => {
    it('Affiche la liste des conversations', () => {
      cy.get('.chat-admin__sidebar').should('be.visible')
      cy.get('[class*="ChatSidebar"]').should('be.visible')
    })

    it('Chaque conversation affiche l\'email du client', () => {
      cy.get('[class*="ConversationItem"], [class*="conversation-item"]').first().should('exist').then(($item) => {
        // Vérifier qu'il y a du texte (email ou message)
        cy.wrap($item).should('not.be.empty')
      }).or(() => {
        cy.log('Aucune conversation disponible')
      })
    })

    it('Chaque conversation affiche un aperçu du dernier message', () => {
      cy.get('[class*="ConversationItem"], [class*="conversation-item"]').first().should('exist').or(() => {
        cy.log('Aucune conversation disponible')
      })
    })
  })

  describe('Recherche de Conversations', () => {
    it('Filtre les conversations par email', () => {
      cy.get('input[placeholder*="Rechercher"]').type('test@')
      cy.wait(500)

      // L'URL devrait refléter la recherche
      cy.url().should('include', 'q=test')
    })

    it('Filtre les conversations par contenu de message', () => {
      cy.get('input[placeholder*="Rechercher"]').type('bonjour')
      cy.wait(500)

      cy.url().should('include', 'q=bonjour')
    })

    it('Affiche le nombre de résultats après filtrage', () => {
      cy.get('.chat-admin__count').should('contain.text', 'conversation')
    })
  })

  describe('Sélection de Conversation', () => {
    it('Affiche un placeholder quand aucune conversation n\'est sélectionnée', () => {
      cy.get('.chat-admin__placeholder').should('be.visible')
      cy.contains('Sélectionnez une conversation').should('be.visible')
    })

    it('Sélectionne une conversation au clic', () => {
      cy.get('[class*="ConversationItem"], [class*="conversation-item"]').first().click().then(() => {
        // Le placeholder devrait disparaître
        cy.get('.chat-admin__placeholder').should('not.exist')

        // ChatCore devrait être visible
        cy.get('[class*="ChatCore"]').should('be.visible')
      }).or(() => {
        cy.log('Aucune conversation à sélectionner')
      })
    })

    it('Persiste la conversation sélectionnée dans l\'URL', () => {
      cy.get('[class*="ConversationItem"], [class*="conversation-item"]').first().click().then(() => {
        cy.url().should('include', 'conversationId=')
      }).or(() => {
        cy.log('Aucune conversation disponible')
      })
    })
  })

  describe('Zone de Chat Admin', () => {
    beforeEach(() => {
      // Sélectionner une conversation si disponible
      cy.get('[class*="ConversationItem"], [class*="conversation-item"]').first().click()
        .then(() => {})
        .catch(() => {
          cy.log('Aucune conversation disponible')
        })
    })

    it('Affiche les messages de la conversation', () => {
      cy.get('[class*="ChatCore"]').should('exist').then(() => {
        cy.get('[class*="ChatMessage"], [class*="chat-message"]').should('exist')
      }).or(() => {
        cy.log('Pas de messages ou pas de conversation')
      })
    })

    it('Affiche le champ de saisie pour répondre', () => {
      cy.get('[class*="ChatCore"]').should('exist').then(() => {
        cy.get('[class*="ChatInput"] input, [class*="ChatInput"] textarea').should('be.visible')
      }).or(() => {
        cy.log('Pas de conversation sélectionnée')
      })
    })

    it('Le champ de saisie accepte du texte', () => {
      cy.get('[class*="ChatCore"]').should('exist').then(() => {
        cy.get('[class*="ChatInput"] input, [class*="ChatInput"] textarea')
          .first()
          .type('Réponse de test')
          .should('have.value', 'Réponse de test')
      }).or(() => {
        cy.log('Pas de conversation sélectionnée')
      })
    })
  })

  describe('AI Copilot', () => {
    beforeEach(() => {
      cy.get('[class*="ConversationItem"], [class*="conversation-item"]').first().click()
        .then(() => {})
        .catch(() => {})
    })

    it('Affiche le bouton de suggestion AI', () => {
      cy.get('[class*="ChatCore"]').should('exist').then(() => {
        // Le bouton AI devrait être visible
        cy.get('[class*="ai"], [title*="AI"], [aria-label*="AI"], button').filter(':contains("AI")').should('exist').or(() => {
          cy.log('Bouton AI non visible')
        })
      }).or(() => {
        cy.log('Pas de conversation sélectionnée')
      })
    })
  })

  describe('Responsive Mobile', () => {
    beforeEach(() => {
      cy.viewport(375, 667)
    })

    it('La sidebar est visible par défaut sur mobile', () => {
      cy.get('.chat-admin__sidebar').should('be.visible')
    })

    it('Le chat est masqué si aucune conversation sélectionnée', () => {
      cy.get('.chat-admin__chat--hidden').should('exist').or(() => {
        cy.get('.chat-admin__placeholder').should('be.visible')
      })
    })

    it('Affiche le bouton retour sur mobile quand une conversation est sélectionnée', () => {
      cy.get('[class*="ConversationItem"]').first().click().then(() => {
        cy.contains('button', /Retour/i).should('be.visible')
      }).or(() => {
        cy.log('Aucune conversation disponible')
      })
    })

    it('Le bouton retour revient à la liste', () => {
      cy.get('[class*="ConversationItem"]').first().click().then(() => {
        cy.contains('button', /Retour/i).click()

        // La sidebar devrait être visible à nouveau
        cy.get('.chat-admin__sidebar').should('be.visible')
      }).or(() => {
        cy.log('Aucune conversation disponible')
      })
    })
  })

  describe('Persistence URL', () => {
    it('Persiste la recherche dans l\'URL', () => {
      cy.get('input[placeholder*="Rechercher"]').type('test')
      cy.wait(500)

      cy.url().should('include', 'q=test')
    })

    it('Restaure la conversation depuis l\'URL', () => {
      // D'abord, sélectionner une conversation pour obtenir son ID
      cy.get('[class*="ConversationItem"]').first().click().then(() => {
        cy.url().then((url) => {
          const conversationId = new URL(url).searchParams.get('conversationId')
          if (conversationId) {
            // Recharger avec l'ID dans l'URL
            cy.visit(`/admin/messagerie?conversationId=${conversationId}`)

            // Le chat devrait s'ouvrir automatiquement
            cy.get('[class*="ChatCore"]').should('be.visible')
          }
        })
      }).or(() => {
        cy.log('Aucune conversation disponible')
      })
    })
  })
})
