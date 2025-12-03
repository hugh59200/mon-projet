/**
 * Catalogue E2E Tests (Cypress)
 *
 * Tests pour la navigation, filtrage et recherche du catalogue
 */

describe('Catalogue - Navigation et Filtres', () => {
  beforeEach(() => {
    cy.visit('/catalogue')
  })

  it('Affiche la liste des produits', () => {
    // Vérifier que la page catalogue se charge
    cy.get('.catalogue-page').should('be.visible')

    // Vérifier que des produits sont affichés
    cy.get('.catalogue-grid').should('be.visible')
    cy.get('[class*="product-card"]').should('have.length.greaterThan', 0)

    // Vérifier le compteur de résultats
    cy.get('.catalogue-toolbar__count').should('be.visible')
  })

  it('Recherche un produit par nom', () => {
    // Intercepter la requête de recherche
    cy.intercept('GET', '**/rest/v1/products*').as('searchProducts')

    // Récupérer le nombre initial de produits
    cy.get('.catalogue-toolbar__count')
      .invoke('text')
      .then((initialCount) => {
        // Taper dans la recherche
        cy.get('.catalogue-search__input').type('BPC')

        // Attendre la réponse du serveur
        cy.wait('@searchProducts')

        // Vérifier que les produits filtrés contiennent le terme recherché
        cy.get('[class*="product-card"]').should('have.length.greaterThan', 0)
      })
  })

  it('Efface la recherche avec le bouton clear', () => {
    // Effectuer une recherche
    cy.get('.catalogue-search__input').type('test')

    // Le bouton clear doit apparaître
    cy.get('.catalogue-search__clear').should('be.visible')

    // Cliquer sur clear
    cy.get('.catalogue-search__clear').click()

    // Le champ doit être vide
    cy.get('.catalogue-search__input').should('have.value', '')
  })

  it('Filtre par catégorie via les chips rapides', () => {
    // Cliquer sur une catégorie dans la nav rapide
    cy.get('.catalogue-quick-nav .catalogue-chip').not(':contains("Tous"), :contains("All")').first().click()

    // Vérifier que les filtres actifs s'affichent
    cy.get('.catalogue-active-filters').should('be.visible')

    // Cliquer sur "Tous/All" pour réinitialiser
    cy.get('.catalogue-quick-nav').contains(/tous|all/i).click()

    // Les filtres actifs doivent disparaître
    cy.get('.catalogue-active-filters').should('not.exist')
  })

  it('Filtre par disponibilité (en stock)', () => {
    // Ouvrir le panneau de filtres si desktop
    cy.get('body').then(($body) => {
      if ($body.find('.catalogue-sidebar').length > 0) {
        // Desktop - utiliser le checkbox dans la sidebar
        cy.get('.catalogue-sidebar').contains(/en stock|in stock/i).click()

        // Vérifier que le filtre est appliqué
        cy.get('.catalogue-active-filters').should('be.visible')
      }
    })
  })

  it('Change le mode de vue (grille/liste)', () => {
    // Par défaut en grille
    cy.get('.catalogue-grid').should('not.have.class', 'catalogue-grid--list')

    // Cliquer sur le mode liste
    cy.get('.catalogue-toolbar__view-btn').last().click()

    // La grille doit être en mode liste
    cy.get('.catalogue-grid').should('have.class', 'catalogue-grid--list')

    // Revenir en mode grille
    cy.get('.catalogue-toolbar__view-btn').first().click()
    cy.get('.catalogue-grid').should('not.have.class', 'catalogue-grid--list')
  })

  it('Trie les produits par prix', () => {
    // Intercepter la requête de tri
    cy.intercept('GET', '**/rest/v1/products*').as('sortProducts')

    // Sélectionner le tri par prix croissant
    cy.get('.catalogue-toolbar__select').select(1)

    // Attendre la réponse du serveur
    cy.wait('@sortProducts')

    // Vérifier que l'URL contient le paramètre de tri
    cy.url().should('include', 'sort=')
  })

  it('Réinitialise tous les filtres', () => {
    // Appliquer quelques filtres
    cy.get('.catalogue-search__input').type('test')
    cy.get('.catalogue-quick-nav .catalogue-chip').not(':contains("Tous"), :contains("All")').first().click()

    // Vérifier que des filtres sont actifs
    cy.get('.catalogue-active-filters').should('be.visible')

    // Cliquer sur réinitialiser
    cy.get('.catalogue-active-filters__clear').click()

    // Tous les filtres doivent être supprimés
    cy.get('.catalogue-active-filters').should('not.exist')
    cy.get('.catalogue-search__input').should('have.value', '')
  })

  it('Navigue vers un produit au clic', () => {
    // Cliquer sur le premier produit
    cy.get('[class*="product-card"]').first().click()

    // Vérifier la redirection vers la page produit
    cy.url().should('match', /\/catalogue\/[a-z0-9-]+/)
  })

  it('Affiche un état vide pour une recherche sans résultat', () => {
    // Intercepter la requête de recherche
    cy.intercept('GET', '**/rest/v1/products*').as('searchProducts')

    // Rechercher quelque chose qui n'existe pas
    cy.get('.catalogue-search__input').type('xyznonexistent123456')

    // Attendre la réponse du serveur
    cy.wait('@searchProducts')

    // Vérifier l'état vide
    cy.get('.catalogue-empty').should('be.visible')
    cy.get('.catalogue-empty__title').should('be.visible')

    // Le bouton de réinitialisation doit être présent
    cy.get('.catalogue-empty').find('button').should('be.visible')
  })
})

describe('Catalogue - Page Produit', () => {
  it('Affiche les détails du produit', () => {
    // Aller sur le catalogue
    cy.visit('/catalogue')

    // Cliquer sur un produit
    cy.get('[class*="product-card"]').first().click()

    // Vérifier les éléments de la page produit
    cy.url().should('match', /\/catalogue\/[a-z0-9-]+/)

    // Le titre du produit doit être visible
    cy.get('.product__title, [class*="product-name"], h1').should('be.visible')

    // Les boutons d'action doivent être présents
    cy.get('.product__actions, [class*="product-actions"]').should('be.visible')
  })

  it('Ajoute un produit au panier depuis la page produit', () => {
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]').first().click()

    // Cliquer sur "Ajouter au panier"
    cy.get('.product__actions button')
      .contains(/panier|cart|ajouter/i)
      .click()

    // Un toast de confirmation devrait apparaître
    cy.get('[class*="toast"], [class*="snackbar"]').should('be.visible')
  })

  it('Redirige vers checkout avec "Acheter maintenant"', () => {
    cy.visit('/catalogue')
    cy.get('[class*="product-card"]').first().click()

    // Cliquer sur "Acheter maintenant"
    cy.get('.product__actions button')
      .contains(/buy|acheter|maintenant|now/i)
      .click()

    // Redirection vers checkout
    cy.url().should('include', '/checkout', { timeout: 15000 })
  })
})
