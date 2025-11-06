<template>
  <transition
    name="fade-scale"
    appear
  >
    <div class="payment-pending">
      <BasicIconNext
        name="Loader2"
        color="primary-600"
        :size="70"
        class="payment-pending__icon"
      />

      <h1 class="payment-pending__title">Vérification du paiement en cours 💳</h1>

      <p class="payment-pending__subtitle">
        Nous sécurisons la transaction auprès de Stripe.
        <br />
        Merci de patienter quelques secondes…
      </p>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { supabase } from '@/supabase/supabaseClient'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()

  onMounted(async () => {
    const sessionId = route.query.session_id as string | undefined

    if (!sessionId) {
      toast.show('Aucun identifiant de session détecté.', 'danger')
      router.replace('/paiement/cancel')
      return
    }

    try {
      const { data, error } = await supabase.functions.invoke('retrieve-stripe-session', {
        body: { sessionId },
      })

      if (error) throw error

      const status = data?.payment_status

      if (status === 'paid') {
        toast.show('Paiement confirmé ✅', 'success')
        router.replace('/paiement/success')
      } else {
        toast.show('Paiement non confirmé ou annulé.', 'warning')
        router.replace('/paiement/cancel')
      }
    } catch (err: any) {
      console.error('💥 Erreur de vérification du paiement:', err)
      toast.show('Erreur lors de la vérification du paiement.', 'danger')
      router.replace('/paiement/cancel')
    }
  })
</script>

<style scoped lang="less">
  .payment-pending {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 60px;
    animation: fadeIn 0.5s ease forwards;

    &__icon {
      margin-bottom: 18px;
      animation: spin 1.2s linear infinite;
    }

    &__title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 10px;
      color: @neutral-900;
    }

    &__subtitle {
      font-size: 15px;
      color: @neutral-600;
      line-height: 1.5;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes spin {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }

  /* ✨ Transition fluide */
  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .fade-scale-enter-from {
    opacity: 0;
    transform: scale(0.95);
  }
  .fade-scale-leave-to {
    opacity: 0;
    transform: scale(1.05);
  }
</style>
