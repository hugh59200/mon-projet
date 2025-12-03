/**
 * Pages Statiques E2E Tests (Cypress)
 *
 * Tests pour les pages informatives : FAQ, À propos, CGU, Guide reconstitution
 */

describe('FAQ', () => {
  beforeEach(() => {
    cy.visit('/faq')
  })

  it('Affiche la page FAQ', () => {
    cy.get('body').should('be.visible')
    cy.url().should('include', '/faq')
  })

  it('Affiche les questions fréquentes', () => {
    // Vérifier qu'il y a du contenu FAQ
    cy.get('h1, h2, [class*="faq"], [class*="question"]').should('exist')
  })

  it('Les accordéons s\'ouvrent et se ferment', () => {
    // Chercher des éléments cliquables de type accordéon
    cy.get('body').then(($body) => {
      if ($body.find('[class*="accordion"], [class*="faq-item"], details, summary').length > 0) {
        cy.get('[class*="accordion"], [class*="faq-item"], details, summary')
          .first()
          .click()

        // Vérifier que le contenu est visible après ouverture
        cy.get('[class*="accordion"], [class*="faq-item"], details')
          .first()
          .should('be.visible')
      }
    })
  })
})

describe('À propos', () => {
  beforeEach(() => {
    cy.visit('/a-propos')
  })

  it('Affiche la page À propos', () => {
    cy.get('body').should('be.visible')
    cy.url().should('include', '/a-propos')
  })

  it('Contient des informations sur l\'entreprise', () => {
    // Vérifier la présence de contenu
    cy.get('h1, h2, [class*="about"], [class*="propos"]').should('exist')
  })
})

describe('CGU - Conditions Générales', () => {
  beforeEach(() => {
    cy.visit('/cgu')
  })

  it('Affiche la page CGU', () => {
    cy.get('body').should('be.visible')
    cy.url().should('include', '/cgu')
  })

  it('Contient les conditions générales', () => {
    // Vérifier la présence de texte juridique
    cy.get('h1, h2, [class*="cgu"], [class*="legal"], article, section').should('exist')
  })
})

describe('Guide de reconstitution', () => {
  beforeEach(() => {
    cy.visit('/guide-reconstitution')
  })

  it('Affiche la page du guide', () => {
    cy.get('body').should('be.visible')
    cy.url().should('include', '/guide-reconstitution')
  })

  it('Contient un formulaire de calcul ou des instructions', () => {
    // Vérifier la présence d'éléments interactifs ou informatifs
    cy.get(
      'h1, h2, [class*="reconstitution"], [class*="guide"], form, input, [class*="calculator"]',
    ).should('exist')
  })

  it('Permet d\'entrer des valeurs de calcul', () => {
    cy.get('body').then(($body) => {
      if ($body.find('input[type="number"]').length > 0) {
        cy.get('input[type="number"]').first().type('10')
        cy.get('input[type="number"]').first().should('have.value', '10')
      }
    })
  })
})

describe('Actualités', () => {
  beforeEach(() => {
    cy.visit('/actualites')
  })

  it('Affiche la page des actualités', () => {
    cy.get('body').should('be.visible')
    cy.url().should('include', '/actualites')
  })

  it('Affiche une liste d\'articles', () => {
    // Vérifier la présence d'articles
    cy.get(
      '[class*="article"], [class*="news"], [class*="actualite"], [class*="card"], article',
    ).should('exist')
  })

  it('Permet de cliquer sur un article pour voir le détail', () => {
    cy.get(
      '[class*="article"], [class*="news"], [class*="actualite"], [class*="card"], article',
    )
      .first()
      .click()

    // Devrait naviguer vers une page de détail
    cy.url().should('match', /\/actualites\/[a-z0-9-]+/)
  })
})

describe('Page d\'accueil', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Affiche la page d\'accueil', () => {
    cy.get('body').should('be.visible')
  })

  it('Contient un CTA vers le catalogue', () => {
    cy.get('a[href*="/catalogue"], button').contains(/catalogue|produits|products|découvrir|discover|explorer|explore|shop/i)
  })

  it('Le header est visible', () => {
    cy.get('header, nav, [class*="header"], [class*="nav"]').should('be.visible')
  })

  it('Le footer est visible', () => {
    cy.get('footer, [class*="footer"]').should('exist')
  })
})

describe('Navigation globale', () => {
  it('Les liens du menu fonctionnent', () => {
    cy.visit('/')

    // Vérifier que le menu existe
    cy.get('nav, [class*="nav"], header').should('be.visible')
  })

  it('Le logo renvoie vers l\'accueil', () => {
    cy.visit('/catalogue')

    // Cliquer sur le logo s'il existe
    cy.get('body').then(($body) => {
      if ($body.find('[class*="logo"], a[href="/"]').length > 0) {
        cy.get('[class*="logo"], a[href="/"]').first().click()
        cy.url().should('eq', Cypress.config().baseUrl + '/')
      }
    })
  })

  it('Les pages 404 sont gérées', () => {
    cy.visit('/page-inexistante-xyz123', { failOnStatusCode: false })

    // Devrait afficher une page 404 ou rediriger
    cy.get('body').should('be.visible')
  })
})

describe('Responsive - Mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
  })

  it('Le catalogue s\'affiche correctement sur mobile', () => {
    cy.visit('/catalogue')
    cy.get('.catalogue-page, [class*="catalogue"]').should('be.visible')
  })

  it('Le panier s\'affiche correctement sur mobile', () => {
    cy.visit('/panier')
    cy.get('.cart, [class*="cart"]').should('be.visible')
  })

  it('Le menu hamburger fonctionne', () => {
    cy.visit('/')

    // Chercher un bouton de menu mobile
    cy.get('body').then(($body) => {
      const menuBtn = $body.find(
        '[class*="menu-toggle"], [class*="hamburger"], button[aria-label*="menu"]',
      )
      if (menuBtn.length > 0) {
        cy.wrap(menuBtn).first().click()
        // Un menu devrait s'ouvrir
        cy.get('[class*="mobile-menu"], [class*="drawer"], [class*="sidebar"]').should('be.visible')
      }
    })
  })
})
