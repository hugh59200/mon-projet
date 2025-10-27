<template>
  <div class="payment-result">
    <div v-if="loading">
      <Transition name="fade">
        <div
          key="loading"
          class="loading"
        >
          <BasicLoader
            size="large"
            color="primary"
          />
          <h2>⏳ Vérification du paiement...</h2>
          <p>Merci de patienter quelques secondes.</p>
        </div>
      </Transition>
    </div>
    <div v-else-if="errorMessage">
      <Transition name="slide-up">
        <div
          key="error"
          class="error"
        >
          <h2>❌ Erreur</h2>
          <p>{{ errorMessage }}</p>
          <RouterLink
            to="/"
            class="btn"
          >
            Retour à l’accueil
          </RouterLink>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { supabase } from '@/services/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'
  import { RouterLink, useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()

  const loading = ref(true)
  const errorMessage = ref('')

  onMounted(async () => {
    const sessionId = route.query.session_id as string
    console.log('💳 session_id détecté :', sessionId)

    if (!sessionId) {
      errorMessage.value = 'Aucune session de paiement trouvée.'
      loading.value = false
      return
    }

    try {
      const { data: stripeData, error } = await supabase.functions.invoke(
        'retrieve-stripe-session',
        {
          body: { sessionId },
        },
      )

      if (error) throw error
      if (!stripeData) throw new Error('Données Stripe introuvables.')

      const paymentStatus = stripeData.payment_status
      console.log('💰 Statut Stripe :', paymentStatus)

      await new Promise((r) => setTimeout(r, 1200)) // petite pause pour l’effet fluide

      if (paymentStatus === 'paid') {
        toast.show('Paiement validé ✅', 'success')
        router.replace({ name: 'payment-success', query: { session_id: sessionId } })
      } else {
        toast.show('Paiement non confirmé ❌', 'danger')
        router.replace({ name: 'payment-cancel', query: { session_id: sessionId } })
      }
    } catch (err: any) {
      console.error('💥 Erreur vérification paiement :', err)
      errorMessage.value = err.message || 'Erreur inconnue lors de la vérification du paiement.'
    } finally {
      loading.value = false
    }
  })
</script>

<style scoped>
  .payment-result {
    max-width: 600px;
    margin: 100px auto;
    text-align: center;
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .loading h2 {
    margin-top: 20px;
    color: #00796b;
  }

  .error h2 {
    color: #dc2626;
    margin-bottom: 8px;
  }

  .btn {
    display: inline-block;
    margin-top: 20px;
    background-color: #00796b;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
  }
  .btn:hover {
    background-color: #056d5f;
  }

  /* ✅ Transitions douces */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.4s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: all 0.4s ease;
  }
  .slide-up-enter-from {
    transform: translateY(20px);
    opacity: 0;
  }
  .slide-up-leave-to {
    transform: translateY(-20px);
    opacity: 0;
  }
</style>
