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
          <!-- Partie gauche -->
          <section class="payment-overlay__left">
            <div class="payment-overlay__brand">
              <div class="payment-overlay__brand-header">
                <img
                  src="@/assets/logo-app.png"
                  alt="Logo Fast Peptides"
                  class="payment-overlay__brand-logo"
                />
                <h1 class="payment-overlay__brand-title">Fast Peptides</h1>
              </div>

              <p class="payment-overlay__brand-subtitle">
                {{ t('checkout.wrapper.securePayment') }}
              </p>

              <div class="payment-overlay__brand-illustration">
                <img
                  src="@/assets/lab-illustration.jpg"
                  alt="Paiement sécurisé"
                  class="payment-overlay__brand-image"
                />
              </div>
            </div>
          </section>

          <section class="payment-overlay__right">
            <router-view v-slot="{ Component }">
              <transition
                name="fade-scale"
                mode="out-in"
              >
                <component
                  :is="Component"
                  @finished="handleFinish"
                />
              </transition>
            </router-view>
          </section>
        </main>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const visible = ref(true)

  function handleFinish() {
    setTimeout(() => (visible.value = false), 1600)
  }
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
    overflow: hidden;

    &__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(9, 12, 22, 0.35);
      backdrop-filter: blur(6px);
      pointer-events: none;
      z-index: 0;
    }

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
      position: relative;
      z-index: 1;
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

    &__brand {
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;

      &-header {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      &-logo {
        width: 56px;
        height: 56px;
      }

      &-title {
        font-size: 26px;
        font-weight: 700;
      }

      &-subtitle {
        font-size: 16px;
        opacity: 0.92;
        line-height: 1.5;
        margin: 20px 0 40px;
      }

      &-illustration {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        flex-grow: 1;
      }

      &-image {
        width: 100%;
        max-width: 360px;
        border-radius: 12px;
        background: #f8f9fa;
        padding: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        animation: float 6s ease-in-out infinite;
      }
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
