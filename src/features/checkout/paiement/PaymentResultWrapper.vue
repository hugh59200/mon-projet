<template>
  <transition
    name="fade-overlay"
    appear
  >
    <div
      v-if="visible"
      class="payment-overlay"
    >
      <div class="payment-overlay__backdrop" />

      <transition
        name="fade-scale"
        mode="out-in"
        appear
      >
        <main
          class="payment-overlay__container"
          key="main"
        >
          <!-- Partie gauche : illustration -->
          <section class="payment-overlay__left">
            <div class="payment-brand">
              <div class="payment-brand__header">
                <img
                  src="@/assets/logo-app.png"
                  alt="Logo Fast Peptides"
                  class="payment-brand__logo"
                />
                <h1 class="payment-brand__title">Fast Peptides</h1>
              </div>

              <p class="payment-brand__subtitle">
                Paiement sécurisé et vérifié par Stripe 🔒
                <br />
                Vos transactions sont 100 % chiffrées.
              </p>

              <div class="payment-brand__illustration">
                <img
                  src="@/assets/lab-illustration.jpg"
                  alt="Paiement sécurisé"
                  class="payment-brand__image"
                />
              </div>
            </div>
          </section>

          <!-- Partie droite : contenu dynamique -->
          <section class="payment-overlay__right">
            <transition
              name="fade-scale"
              mode="out-in"
            >
              <PaymentSuccessView
                v-if="mode === 'success'"
                key="success"
              />
              <PaymentCancelView
                v-else-if="mode === 'cancel'"
                key="cancel"
              />
              <RouterView
                v-else
                key="fallback"
              />
            </transition>
          </section>
        </main>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import PaymentCancelView from './PaymentCancelView.vue'
  import PaymentSuccessView from './PaymentSuccessView.vue'

  const route = useRoute()
  const visible = ref(true)
  const mode = ref<'pending' | 'success' | 'cancel'>('pending')

  onMounted(() => {
    // Détermine le mode selon la route
    switch (route.name) {
      case 'PaymentSuccess':
        mode.value = 'success'
        setTimeout(() => (visible.value = false), 4000)
        break
      case 'PaymentCancel':
        mode.value = 'cancel'
        break
      default:
        mode.value = 'pending'
    }
  })
</script>

<style scoped lang="less">
  .payment-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(
      circle at 50% 40%,
      rgba(255, 255, 255, 0.15),
      rgba(15, 23, 42, 0.45)
    );
    backdrop-filter: blur(14px) saturate(130%);
    animation: fadeIn 0.25s ease forwards;

    &__container {
      display: flex;
      flex-direction: row;
      width: 92%;
      max-width: 960px;
      min-height: 540px;
      background: #fff;
      border-radius: 22px;
      overflow: hidden;
      box-shadow:
        0 6px 24px rgba(0, 0, 0, 0.05),
        0 12px 40px rgba(15, 23, 42, 0.12);
    }

    &__left {
      flex: 1.1;
      background: linear-gradient(135deg, #00bfa6, #009688);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 50px 40px;
    }

    &__right {
      flex: 1;
      background: #fff;
      padding: 48px 52px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: 860px) {
      &__container {
        flex-direction: column;
        width: 95%;
        max-width: 480px;
      }
      &__left {
        display: none;
      }
    }
  }

  .payment-brand {
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    &__header {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    &__logo {
      width: 56px;
      height: 56px;
    }

    &__title {
      font-size: 26px;
      font-weight: 700;
    }

    &__subtitle {
      font-size: 16px;
      opacity: 0.92;
      line-height: 1.5;
      margin: 20px 0 40px;
    }

    &__illustration {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      flex-grow: 1;
    }

    &__image {
      width: 100%;
      max-width: 360px;
      border-radius: 12px;
      background: #f8f9fa;
      padding: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      animation: float 6s ease-in-out infinite;
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }

  /* Animations */
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
