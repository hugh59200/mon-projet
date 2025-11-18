<template>
  <div
    v-motion="{
      initial: { opacity: 0, y: 20 },
      enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    }"
    class="payment-success"
  >
    <!-- Icône -->
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
      Votre commande a bien été validée.
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
  import ProgressBar from '@/features/shared/ProgressBar.vue'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'

  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { supabase } from '@/supabase/supabaseClient'
  import { onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const cart = useCartStore()
  const auth = useAuthStore()

  const emit = defineEmits(['finished'])

  onMounted(async () => {
    console.log('💚 PaymentSuccess mounted')

    const stripeSessionId = route.query.session_id as string | undefined
    const paypalOrderId = route.query.order_id as string | undefined
    const orderId = route.query.orderId as string | undefined // PayPal second naming

    // -----------------------------------------
    // 1️⃣ STRIPE
    // -----------------------------------------
    if (stripeSessionId) {
      console.log('🔵 Stripe detected')
      await handleStripeSuccess(stripeSessionId)
    }

    // -----------------------------------------
    // 2️⃣ PAYPAL
    // -----------------------------------------
    else if (paypalOrderId || orderId) {
      console.log('🟡 PayPal detected')
      await handlePaypalSuccess(paypalOrderId ?? orderId!)
    }

    // -----------------------------------------
    // 3️⃣ Fallback utilisateur
    // -----------------------------------------
    else {
      console.warn('⚠️ No identifiers → fallback user last order')

      await fallbackLatestOrder()
    }

    // -----------------------------------------
    // 4️⃣ Fin + clear panier
    // -----------------------------------------
    await cart.clearCart()
    emit('finished')

    setTimeout(() => {
      router.push('/profil/commandes')
    }, 2500)
  })

  async function handleStripeSuccess(sessionId: string) {
    const { data } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', sessionId)
      .maybeSingle()

    if (!data) console.error('❌ Stripe order not found')
  }

  async function handlePaypalSuccess(orderId: string) {
    const { error } = await supabase.functions.invoke('capture-paypal-order', {
      body: { orderId },
    })

    if (error) {
      console.error('❌ PayPal capture failed', error)
    }
  }

  async function fallbackLatestOrder() {
    const { data } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', auth.user?.id!)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!data) console.error('❌ No order found even in fallback')
  }
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
