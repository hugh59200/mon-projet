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

    <h1 class="payment-cancel__title">Paiement annulé ❌</h1>
    <p class="payment-cancel__subtitle">
      Le paiement n’a pas pu être finalisé ou a été interrompu.
      <br />
      Vous pouvez réessayer à tout moment.
    </p>

    <BasicButton
      label="Retourner au panier"
      variant="filled"
      color="danger"
      size="large"
      class="payment-cancel__cta"
      @click="$router.push('/panier')"
    />
  </div>
</template>

<script setup lang="ts">
  import { useAuthSound } from '@/features/auth/composables/useAuthSound'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { onMounted } from 'vue'

  const { error } = useAuthSound()

  onMounted(() => {
    // 🔊 petit son d’erreur (optionnel, cohérent avec AuthError)
    error()
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
        transform: scale(1.1) rotate(-5deg);
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
        transform: scale(1.08);
      }
    }
  }
</style>
