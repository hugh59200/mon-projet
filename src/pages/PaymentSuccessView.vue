<template>
  <div class="payment-success">
    <h1>✅ Paiement réussi</h1>
    <p>Merci pour votre commande 🎉</p>

    <!-- 🌀 État de chargement -->
    <div
      v-if="loading"
      class="loading"
    >
      Chargement des détails de votre commande...
    </div>

    <!-- ✅ Détails du paiement -->
    <div
      v-else-if="order"
      class="summary"
    >
      <h2>Détails de votre paiement</h2>

      <ul>
        <li>
          <strong>Email :</strong>
          {{ order.customer_email }}
        </li>
        <li>
          <strong>Montant :</strong>
          {{ (order.amount_total / 100).toFixed(2) }} €
        </li>
        <li>
          <strong>Statut :</strong>
          <span class="status success">
            {{ order.payment_status === 'paid' ? 'Payé' : order.payment_status }}
          </span>
        </li>
        <li>
          <strong>ID Session :</strong>
          {{ sessionId }}
        </li>
        <li>
          <strong>ID PaymentIntent :</strong>
          {{ order.payment_intent }}
        </li>
      </ul>

      <RouterLink
        to="/profil/commandes"
        class="btn"
      >
        Voir mes commandes
      </RouterLink>
    </div>

    <!-- ❌ Erreur -->
    <div
      v-else
      class="error"
    >
      <p>❌ Impossible de récupérer les détails de votre paiement.</p>
      <p
        v-if="errorMessage"
        class="error-detail"
      >
        {{ errorMessage }}
      </p>

      <RouterLink
        to="/"
        class="btn btn-secondary"
      >
        Retour à l’accueil
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useCartStore } from '@/features/cart/useCartStore'
  import { supabase } from '@/services/supabaseClient'
  import { onMounted, ref } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'

  // 🧭 Récupère route + store
  const route = useRoute()
  const cart = useCartStore()

  // 🧠 États réactifs
  const loading = ref(true)
  const order = ref<any>(null)
  const errorMessage = ref('')
  const sessionId = route.query.session_id as string

  // 🧹 Vide le panier une fois le paiement validé
  cart.clearCart()

  onMounted(async () => {
    console.group('[PaymentSuccess]')
    console.log('Session ID trouvée dans URL →', sessionId)

    if (!sessionId) {
      errorMessage.value = 'Aucun identifiant de session trouvé.'
      loading.value = false
      console.warn('⚠️ Aucun session_id dans l’URL.')
      return
    }

    try {
      // 🔐 Récupération de la session Supabase
      const { data, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      const accessToken = data.session?.access_token
      if (!accessToken) throw new Error('Aucun token utilisateur trouvé.')

      // 🚀 Appel de la fonction Edge Supabase
      console.log('📤 Envoi requête retrieve-stripe-session...')
      const { data: stripeData, error } = await supabase.functions.invoke(
        'retrieve-stripe-session',
        {
          body: { sessionId }, // ✅ NE PAS ajouter de headers custom ici
        },
      )

      console.log('📡 Réponse retrieve-stripe-session:', { stripeData, error })

      if (error) throw error
      if (!stripeData) throw new Error('Réponse vide de retrieve-stripe-session')

      // ✅ Succès
      order.value = stripeData
      console.log('✅ Données Stripe récupérées avec succès')
    } catch (err: any) {
      console.error('💥 Erreur récupération session Stripe:', err)
      errorMessage.value = err.message || 'Erreur inconnue lors de la récupération du paiement.'
    } finally {
      loading.value = false
      console.groupEnd()
    }
  })
</script>

<style scoped>
  .payment-success {
    max-width: 700px;
    margin: 80px auto;
    text-align: center;
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  }

  h1 {
    color: #16a34a;
    font-size: 2rem;
    margin-bottom: 12px;
  }

  h2 {
    margin-top: 24px;
    font-size: 1.4rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 16px 0 24px;
  }

  li {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    text-align: left;
  }

  .status.success {
    color: #16a34a;
    font-weight: 600;
  }

  .btn {
    display: inline-block;
    background: #16a34a;
    color: white;
    padding: 10px 22px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.2s ease;
  }

  .btn:hover {
    background: #15803d;
  }

  .loading {
    color: #888;
    margin-top: 20px;
  }

  .error {
    color: #b91c1c;
    margin-top: 20px;
  }

  .error-detail {
    color: #991b1b;
    font-size: 0.9rem;
    margin-top: 8px;
  }

  .btn-secondary {
    background: #ccc;
    color: #222;
  }
</style>
