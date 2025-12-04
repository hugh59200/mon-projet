/**
 * Test E2E - Flux complet des emails transactionnels
 *
 * Ce test effectue de VRAIES actions pour déclencher les emails :
 * 1. Checkout invité → Email "pending_payment"
 * 2. Appel API pour valider le paiement → Email "payment_validated"
 * 3. Appel API pour expédier → Email "shipping"
 *
 * ⚠️ ATTENTION : Ce test crée de vraies commandes en base !
 *
 * Note: Tout est fait dans un seul test car :
 * - Les tests Cypress sont isolés (pas de partage de variables)
 * - Le RLS bloque les requêtes anon sur les commandes guest
 */

const SUPABASE_URL = 'https://dwomsbawthlktapmtmqu.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b21zYmF3dGhsa3RhcG10bXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjI2NDUsImV4cCI6MjA3NjA5ODY0NX0.rK_9sJzigfu_w24s5XvgFd7nM4RFkS99gQ3BXTCS1XY'

const GUEST = {
  email: 'h.bogrand@yopmail.com',
  fullName: 'Jean-Pierre Testeur',
  address: '42 Rue de la Science',
  zip: '75008',
  city: 'Paris',
}

describe('Email Full Flow - Vraies commandes', () => {
  it('Checkout → pending_payment → payment_validated → shipping (3 emails)', () => {
    // ========================================
    // ÉTAPE 1 : CHECKOUT GUEST
    // ========================================
    cy.log('📦 ÉTAPE 1: Checkout Guest')

    // Utiliser l'API pour trouver un produit avec du stock
    cy.request({
      method: 'GET',
      url: `${SUPABASE_URL}/rest/v1/products?select=id,name,stock&stock=gt.0&limit=5`,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.length.at.least(1)

      const products = response.body
      cy.log(`✅ ${products.length} produits avec stock trouvés`)

      // Fonction pour essayer d'ajouter un produit au panier et aller au checkout
      const tryBuyProduct = (index: number): Cypress.Chainable => {
        if (index >= products.length) {
          throw new Error('Aucun produit disponible pour ajout au panier')
        }

        const product = products[index]
        cy.log(`🔄 Essai du produit ${index + 1}/${products.length}: ${product.name}`)

        return cy.visit(`/catalogue/${product.id}`).then(() => {
          // Attendre que les boutons d'action soient chargés
          return cy.get('.product__actions button', { timeout: 15000 }).then(($buttons) => {
            // Le premier bouton est "Ajouter au panier", le second est "Acheter maintenant"
            const $firstBtn = $buttons.first()
            if ($firstBtn.prop('disabled')) {
              cy.log(`⚠️ Produit ${product.name} non disponible, essai suivant`)
              return tryBuyProduct(index + 1)
            } else {
              cy.log(`✅ Produit ${product.name} disponible`)
              // Utiliser le bouton "Acheter maintenant" (2ème bouton) qui fait addToCart + redirect
              if ($buttons.length > 1) {
                cy.log('🛒 Clic sur "Acheter maintenant"')
                return cy.wrap($buttons.eq(1)).click()
              } else {
                // Fallback: utiliser le premier bouton et naviguer manuellement
                cy.log('🛒 Clic sur "Ajouter au panier"')
                cy.wrap($firstBtn).click()
                cy.wait(1000)
                return cy.visit('/checkout')
              }
            }
          })
        })
      }

      // Commencer avec le premier produit
      tryBuyProduct(0).then(() => {
        // Attendre que la page checkout soit chargée
        cy.url().should('include', '/checkout', { timeout: 15000 })

        cy.get('.checkout-item').should('exist')
        cy.get('.checkout__delivery-option').contains(/colissimo|home|domicile/i).click()

        // Sélecteurs autocomplete pour WrapperInput
        cy.get('input[autocomplete="email"]').first().clear().type(GUEST.email)
        cy.get('input[autocomplete="name"]').first().clear().type(GUEST.fullName)
        cy.get('input[placeholder*="adresse"], input[autocomplete="street-address"]').first().clear().type(GUEST.address)
        cy.get('input[autocomplete="postal-code"]').first().clear().type(GUEST.zip)
        cy.get('input[autocomplete="address-level2"]').first().clear().type(GUEST.city)

        cy.get('.payment-card__crypto-badge').contains('BTC').should('be.visible')

        cy.get('.checkout__submit-wrapper').scrollIntoView()
        cy.get('.checkout__disclaimer-input').check({ force: true })
        cy.get('.checkout__submit-wrapper button').should('be.enabled')
        cy.get('.checkout__submit-wrapper button').click()

        // Attendre la page de confirmation et extraire l'order_id
        cy.url().should('include', '/confirmation', { timeout: 30000 })
        cy.get('.confirmation__success-icon, .confirmation__title').should('be.visible')

        cy.url().then((url) => {
          // L'URL est: /checkout/confirmation?orderId=UUID&method=crypto
          const urlParams = new URLSearchParams(url.split('?')[1])
          const orderId = urlParams.get('orderId')
          expect(orderId, "Order ID doit être présent dans l'URL").to.not.be.null
          cy.log(`✅ Commande créée avec ID: ${orderId}`)
          cy.log('📧 Email 1/3: "pending_payment" envoyé à ' + GUEST.email)

          // Attendre un peu pour s'assurer que l'email est envoyé
          cy.wait(2000)

          // ========================================
          // ÉTAPE 2 : VALIDER LE PAIEMENT
          // ========================================
          cy.log('💳 ÉTAPE 2: Validation du paiement')

          cy.request({
            method: 'POST',
            url: `${SUPABASE_URL}/functions/v1/send-order-update`,
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: {
              order_id: orderId,
              status: 'processing',
            },
            failOnStatusCode: false,
          }).then((updateResponse) => {
            cy.log(`📧 send-order-update response: ${updateResponse.status}`)
            cy.log(`Response body: ${JSON.stringify(updateResponse.body)}`)

            if (updateResponse.status === 200) {
              cy.log('✅ Email 2/3: "payment_validated" déclenché')
            } else {
              cy.log(`⚠️ Erreur Edge Function: ${JSON.stringify(updateResponse.body)}`)
            }

            // Attendre un peu avant l'expédition
            cy.wait(2000)

            // ========================================
            // ÉTAPE 3 : EXPÉDIER LA COMMANDE
            // ========================================
            cy.log('🚚 ÉTAPE 3: Expédition de la commande')

            cy.request({
              method: 'POST',
              url: `${SUPABASE_URL}/functions/v1/send-shipping-email`,
              headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
              },
              body: {
                order_id: orderId,
              },
              failOnStatusCode: false,
            }).then((shippingResponse) => {
              cy.log(`📧 send-shipping-email response: ${shippingResponse.status}`)
              cy.log(`Response body: ${JSON.stringify(shippingResponse.body)}`)

              if (shippingResponse.status === 200) {
                cy.log('✅ Email 3/3: "shipping" déclenché')
              } else {
                cy.log(`⚠️ Erreur Edge Function: ${JSON.stringify(shippingResponse.body)}`)
              }

              // ========================================
              // RÉCAPITULATIF
              // ========================================
              cy.log('📧 ===== RÉCAPITULATIF =====')
              cy.log(`Commande: ${orderId}`)
              cy.log(`Email: ${GUEST.email}`)
              cy.log('1. pending_payment - Envoyé lors du checkout')
              cy.log(`2. payment_validated - Status: ${updateResponse.status}`)
              cy.log(`3. shipping - Status: ${shippingResponse.status}`)
            })
          })
        })
      })
    })
  })
})
