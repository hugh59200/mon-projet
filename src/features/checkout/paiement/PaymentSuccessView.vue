<template>
  <div
    v-motion="{
      initial: { opacity: 0, y: 20 },
      enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    }"
    class="payment-success"
  >
    <!-- ✅ Icône animée -->
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
      Votre paiement a bien été validé et votre commande est en préparation.
    </p>

    <!-- Barre de progression -->
    <ProgressBar color="success" />

    <!-- CTA -->
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
  import { useAuthSound } from '@/features/auth/composables/useAuthSound'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import ProgressBar from '@/features/shared/ProgressBar.vue'
  import { supabase } from '@/supabase/supabaseClient'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const emit = defineEmits(['finished'])

  const { success } = useAuthSound()
  const route = useRoute()
  const router = useRouter()
  const cart = useCartStore()

  onMounted(async () => {
    success()

    const sessionId = route.query.session_id as string
    if (!sessionId) return setTimeout(() => emit('finished'), 4000)

    try {
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .maybeSingle()

      if (order) {
        const mail = fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-confirmation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(order),
        })

        await Promise.allSettled([mail, cart.clearCart()])
      }
    } finally {
      setTimeout(() => {
        emit('finished')
        router.push('/profil/commandes')
      }, 4000)
    }
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
