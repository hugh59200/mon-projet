<template>
  <div
    v-motion="{
      initial: { opacity: 0, y: 20 },
      enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    }"
    class="payment-success"
  >
    <div class="payment-success__icon-wrapper">
      <BasicIconNext
        name="CheckCircle2"
        color="success-600"
        :size="72"
        class="payment-success__icon"
      />
    </div>

    <h1 class="payment-success__title">Paiement réussi 🎉</h1>

    <p class="payment-success__subtitle">
      Merci pour votre commande sur
      <strong>Fast Peptides</strong>
      !
      <br />
      Votre paiement est validé et votre commande est en préparation.
    </p>

    <ProgressBar color="success" />

    <BasicButton
      label="Voir mes commandes"
      type="primary"
      color="success"
      size="large"
      class="payment-success__cta"
      @click="$router.push('/profil/commandes')"
    />
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { supabase } from '@/supabase/supabaseClient'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()
  const cart = useCartStore()

  const loading = ref(true)
  const success = ref(false)
  const order = ref<any>(null)

  onMounted(async () => {
    console.log('✅ PaymentSuccess mounted')

    const sessionId = route.query.session_id as string
    if (!sessionId) {
      console.error('❌ Pas de session_id dans l’URL')
      loading.value = false
      return
    }

    console.log('🔎 Recherche commande en base…', sessionId)

    // ✅ On récupère la commande liée à la session Stripe
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .maybeSingle()

    if (error) {
      console.error('❌ Erreur SELECT:', error)
      loading.value = false
      return
    }

    order.value = data

    if (!order.value) {
      console.warn('⚠️ Aucune commande liée à cette session, fallback user + last order')
      const fallback = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', auth.user?.id!)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (fallback.data) {
        order.value = fallback.data
        console.log('✅ Fallback trouvé :', fallback.data)
      }
    }

    if (!order.value) {
      console.error('❌ Toujours aucune commande trouvée')
      loading.value = false
      return
    }

    console.log('✅ Commande récupérée :', order.value)

    // ✅ On ne gère plus l’email ici — c’est Stripe Webhook qui envoie
    await cart.clearCart()
    console.log('🧹 Panier vidé après succès')

    success.value = true
    loading.value = false

    // ✅ Redirection
    setTimeout(() => {
      router.push('/profil/commandes')
    }, 3000)
  })
</script>

<style scoped lang="less">
  .payment-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 40px;

    &__icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      animation:
        popin 0.4s ease-out forwards,
        bounce-end 3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    &__title {
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 12px;
      color: @success-700;
    }

    &__subtitle {
      font-size: 15px;
      color: @neutral-600;
      line-height: 1.6;
      margin-bottom: 28px;

      strong {
        color: @neutral-800;
        font-weight: 600;
      }
    }

    &__cta {
      margin-top: 24px;
    }

    /* --- Animations --- */
    @keyframes popin {
      0% {
        transform: scale(0.3);
        opacity: 0;
      }
      60% {
        transform: scale(1.1);
        opacity: 1;
      }
      100% {
        transform: scale(1);
      }
    }

    @keyframes bounce-end {
      0%,
      90% {
        transform: scale(1);
      }
      95% {
        transform: scale(1.15);
      }
      100% {
        transform: scale(1);
      }
    }
  }
</style>
