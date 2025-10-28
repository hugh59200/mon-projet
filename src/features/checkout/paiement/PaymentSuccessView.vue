<template>
  <div class="payment-success">
    <h1>✅ Paiement réussi</h1>
    <p>Merci pour votre commande 🎉</p>

    <!-- ✅ Détails du paiement -->
    <div
      v-if="order"
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

    <!-- ❌ Erreur (affichée uniquement si on a fini le chargement ET rien trouvé) -->
    <div
      v-else-if="hasLoaded"
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
  import { supabase } from '@/supabase/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'

  const route = useRoute()
  const cart = useCartStore()
  const toast = useToastStore()

  const sessionId = route.query.session_id as string
  const order = ref<any>(null)
  const errorMessage = ref('')
  const hasLoaded = ref(false) // 👈 flag de fin de chargement logique

  cart.clearCart() // 🧹 Vide le panier après paiement

  async function loadPaymentDetails() {
    console.group('[PaymentSuccess]')
    console.log('Session ID trouvée dans URL →', sessionId)

    if (!sessionId) {
      errorMessage.value = 'Aucun identifiant de session trouvé.'
      console.warn('⚠️ Aucun session_id dans l’URL.')
      hasLoaded.value = true
      return
    }

    try {
      const { data, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      const accessToken = data.session?.access_token
      if (!accessToken) throw new Error('Aucun token utilisateur trouvé.')

      const { data: stripeData, error } = await supabase.functions.invoke(
        'retrieve-stripe-session',
        { body: { sessionId } },
      )

      if (error) throw error
      if (!stripeData) throw new Error('Réponse vide de retrieve-stripe-session')

      order.value = stripeData
    } catch (err: any) {
      console.error('💥 Erreur récupération session Stripe:', err)
      errorMessage.value = err.message || 'Erreur inconnue lors de la récupération du paiement.'
      toast.show('Erreur lors du chargement du paiement', 'danger')
    } finally {
      hasLoaded.value = true // ✅ marquer la fin du chargement
      console.groupEnd()
    }
  }

  onMounted(async () => {
    await loadPaymentDetails()
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
