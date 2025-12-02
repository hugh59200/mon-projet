<template>
  <div
    v-motion="{
      initial: { opacity: 0, y: 20 },
      enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    }"
    class="payment-cancel"
  >
    <!-- ❌ Icône d'annulation -->
    <div class="payment-cancel__icon-wrapper">
      <BasicIconNext
        name="XCircle"
        color="danger-600"
        :size="72"
        class="payment-cancel__icon"
      />
    </div>

    <h1 class="payment-cancel__title">{{ t('checkout.cancel.title') }}</h1>
    <p class="payment-cancel__subtitle">
      {{ t('checkout.cancel.subtitle') }}
      <br />
      {{ t('checkout.cancel.retryAnytime') }}
    </p>

    <PremiumButton
      type="danger"
      variant="solid"
      size="lg"
      :label="t('checkout.cancel.backToCart')"
      icon-left="ShoppingCart"
      :shine="true"
      class="payment-cancel__cta"
      @click="$router.push('/panier')"
    />
  </div>
</template>

<script setup lang="ts">
  import { useHead } from '@vueuse/head'
  import { onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  // Configuration SEO - noindex pour page transactionnelle
  useHead({
    title: 'Paiement annulé - Atlas Lab Solutions',
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
    ],
  })

  const { t } = useI18n()

  const emit = defineEmits(['finished'])
  const router = useRouter()

  onMounted(() => {
    setTimeout(() => {
      emit('finished')
      router.push('/panier')
    }, 4000)
  })
</script>

<style scoped lang="less">
  .payment-cancel {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 60px;

    &__icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      animation:
        shake-in 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) forwards,
        pulse-danger 3s ease-in-out infinite 2s;
    }

    &__icon {
      filter: drop-shadow(0 6px 14px rgba(220, 38, 38, 0.25));
    }

    &__title {
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 12px;
      color: @danger-700;
    }

    &__subtitle {
      font-size: 15px;
      color: @neutral-600;
      margin-bottom: 24px;
      line-height: 1.5;
    }

    &__cta {
      margin-top: 4px;
    }

    /* Apparition "secouée" */
    @keyframes shake-in {
      0% {
        transform: scale(0.3) rotate(0deg);
        opacity: 0;
      }
      50% {
        transform: scale(1.05) rotate(-5deg);
        opacity: 1;
      }
      100% {
        transform: scale(1) rotate(0deg);
      }
    }

    /* Petit battement rouge subtil après */
    @keyframes pulse-danger {
      0%,
      100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.02);
      }
    }
  }
</style>
