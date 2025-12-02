<template>
  <div class="success">
    <!-- Background -->
    <div class="success__bg">
      <div class="success__bg-gradient"></div>
      <div class="success__bg-pattern"></div>
      <div class="success__bg-orb success__bg-orb--1"></div>
      <div class="success__bg-orb success__bg-orb--2"></div>
    </div>

    <div class="success__container">
      <!-- Main Card - Horizontal Layout -->
      <div class="success__card">
        <!-- Top Section: Status -->
        <div
          class="success__status"
          :class="{ 'success__status--error': isError }"
        >
          <!-- Back button top right -->
          <PremiumButton
            class="success__back-top"
            type="white"
            variant="glass"
            size="xs"
            :label="t('checkout.success.shop')"
            icon-left="ArrowLeft"
            @click="$router.push('/')"
          />

          <div class="success__status-main">
            <!-- Icon -->
            <div class="success__icon-wrapper">
              <div class="success__icon-ring success__icon-ring--1"></div>
              <div class="success__icon-ring success__icon-ring--2"></div>
              <div
                class="success__icon"
                :class="{ 'success__icon--error': isError }"
              >
                <BasicIconNext v-if="!isError" name="Check" :size="28" :stroke-width="2.5" />
                <BasicIconNext v-else name="AlertTriangle" :size="28" />
              </div>
            </div>

            <!-- Title & Subtitle -->
            <div class="success__status-text">
              <h1 class="success__title">
                {{ isError ? t('checkout.success.error') : t('checkout.success.title') }}
              </h1>
              <p
                v-if="isLoading"
                class="success__subtitle"
              >
                <span class="success__loading-dots">
                  {{ t('checkout.success.finalizing') }}
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </p>
              <p
                v-else
                class="success__subtitle"
              >
                {{ isError ? t('checkout.success.verificationRequired') : t('checkout.success.orderRegistered') }}
              </p>
            </div>
          </div>

          <!-- Bottom row: Email + Trust -->
          <div
            v-if="!isLoading && !isError"
            class="success__status-meta"
          >
            <div
              v-if="orderEmail"
              class="success__email"
            >
              <BasicIconNext name="Mail" :size="14" />
              <span>{{ orderEmail }}</span>
            </div>
            <div class="success__trust">
              <div class="success__trust-item">
                <BasicIconNext name="Shield" :size="12" />
                <span>{{ t('checkout.success.secure') }}</span>
              </div>
              <div class="success__trust-item">
                <BasicIconNext name="Truck" :size="12" />
                <span>{{ t('checkout.success.fast') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Action -->
        <div class="success__action">
          <transition
            name="fade-slide"
            mode="out-in"
          >
            <!-- Loading State -->
            <!-- Loading State - Skeleton -->
            <div
              v-if="isLoading"
              key="loading"
              class="success__skeleton"
            >
              <div class="success__skeleton-header">
                <div class="success__skeleton-icon"></div>
                <div class="success__skeleton-text">
                  <div class="success__skeleton-line success__skeleton-line--title"></div>
                  <div class="success__skeleton-line success__skeleton-line--subtitle"></div>
                </div>
              </div>
              <div class="success__skeleton-form">
                <div class="success__skeleton-row">
                  <div class="success__skeleton-field">
                    <div class="success__skeleton-label"></div>
                    <div class="success__skeleton-input"></div>
                  </div>
                  <div class="success__skeleton-field">
                    <div class="success__skeleton-label"></div>
                    <div class="success__skeleton-input"></div>
                  </div>
                </div>
                <div class="success__skeleton-actions">
                  <div class="success__skeleton-btn success__skeleton-btn--primary"></div>
                  <div class="success__skeleton-btn success__skeleton-btn--outline"></div>
                </div>
              </div>
              <div class="success__skeleton-benefits">
                <div class="success__skeleton-benefit"></div>
                <div class="success__skeleton-benefit"></div>
                <div class="success__skeleton-benefit"></div>
              </div>
            </div>

            <!-- Guest: Conversion Form -->
            <div
              v-else-if="!auth.user && currentOrderId && !isError"
              key="guest"
              class="success__conversion"
            >
              <div class="success__conversion-header">
                <BasicIconNext name="Eye" :size="20" />
                {{ t('checkout.success.viewOrder') }}
              </div>
            </div>

            <!-- Error State -->
            <div
              v-else-if="isError"
              key="error"
              class="success__error"
            >
              <p>{{ t('checkout.success.problemOccurred') }}</p>
              <div class="success__error-contact">
                <BasicIconNext name="Mail" :size="16" />
                <span>support@fastpeptides.com</span>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useHead } from '@vueuse/head'
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import {
    getOrderSummaryPublic,
    fetchOrderByStripeSession,
    fetchLastUserOrder,
    invokeOrderConfirmation,
    invokeCapturePayPal,
  } from '@/api/supabase/orders'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'

  // Configuration SEO - noindex pour page transactionnelle
  useHead({
    title: 'Paiement réussi - Atlas Lab Solutions',
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
    ],
  })

  const { t } = useI18n()

  const route = useRoute()
  const cart = useCartStore()
  const auth = useAuthStore()
  const toast = useToastStore()

  interface OrderSummary {
    email: string
    status: string
    order_number?: string
    tracking_token?: string
    total_amount?: number
  }

  // State
  const isLoading = ref(true)
  const isError = ref(false)
  const currentOrderId = ref<string | null>(null)
  const orderEmail = ref<string>('')
  const orderNumber = ref<string>('')
  const trackingToken = ref<string>('')

  // Lifecycle
  onMounted(async () => {
    await cart.clearCart()

    const stripeSessionId = route.query.session_id as string
    const paypalOrderId = route.query.orderId as string

    if (paypalOrderId) await fetchOrderDetails(paypalOrderId)
    else if (stripeSessionId) await fetchOrderByStripe(stripeSessionId)
    else if (auth.user) await fetchLastOrder()

    try {
      if (paypalOrderId) {
        await handlePayPalCapture(paypalOrderId)
      } else if (stripeSessionId) {
        await handleStripeSuccess()
      }
    } catch (error) {
      console.error('Erreur finalisation:', error)
      isError.value = true
      toast.show(t('checkout.success.confirmationProblem'), 'danger')
    } finally {
      isLoading.value = false
    }
  })

  // API Functions
  async function fetchOrderDetails(id: string) {
    const data = await getOrderSummaryPublic(id)

    if (data) {
      const orderData = data as unknown as OrderSummary
      currentOrderId.value = id
      orderEmail.value = orderData.email
      orderNumber.value = orderData.order_number || ''
      trackingToken.value = orderData.tracking_token || ''
    }
  }

  async function handlePayPalCapture(orderId: string) {
    const { error } = await invokeCapturePayPal(orderId)
    if (error) throw error
    await fetchOrderDetails(orderId)
  }

  async function handleStripeSuccess() {
    if (currentOrderId.value) {
      await invokeOrderConfirmation(currentOrderId.value)
    }
  }

  async function fetchOrderByStripe(sessionId: string) {
    const data = await fetchOrderByStripeSession(sessionId)

    if (data) {
      currentOrderId.value = data.id
      orderEmail.value = data.email || ''
      orderNumber.value = data.order_number || ''
      trackingToken.value = data.tracking_token || ''
    }
  }

  async function fetchLastOrder() {
    const data = await fetchLastUserOrder(auth.user!.id)
    if (data) {
      currentOrderId.value = data.id
      orderEmail.value = data.email
      orderNumber.value = data.order_number || ''
      trackingToken.value = data.tracking_token || ''
    }
  }
</script>

<style scoped lang="less">
  @font-display:
    'Instrument Sans',
    'SF Pro Display',
    -apple-system,
    sans-serif;
  @font-body:
    'Inter',
    'SF Pro Text',
    -apple-system,
    sans-serif;
  @ease: cubic-bezier(0.4, 0, 0.2, 1);

  .success {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    overflow: hidden;

    // ============================================
    // BACKGROUND
    // ============================================
    &__bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    &__bg-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.03) 0%,
        @neutral-50 50%,
        rgba(var(--primary-400-rgb), 0.05) 100%
      );
    }

    // ============================================
    // SKELETON LOADER
    // ============================================
    &__skeleton {
      display: flex;
      flex-direction: column;
    }

    &__skeleton-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid @neutral-100;
    }

    &__skeleton-icon {
      width: 20px;
      height: 20px;
      background: @neutral-200;
      border-radius: 6px;
      animation: shimmer 1.5s infinite;
    }

    &__skeleton-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__skeleton-line {
      background: @neutral-200;
      border-radius: 4px;
      animation: shimmer 1.5s infinite;

      &--title {
        width: 140px;
        height: 18px;
      }

      &--subtitle {
        width: 200px;
        height: 14px;
      }
    }

    &__skeleton-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__skeleton-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    &__skeleton-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    &__skeleton-label {
      width: 60px;
      height: 12px;
      background: @neutral-200;
      border-radius: 4px;
      animation: shimmer 1.5s infinite;
    }

    &__skeleton-input {
      height: 44px;
      background: @neutral-100;
      border-radius: 10px;
      animation: shimmer 1.5s infinite;
    }

    &__skeleton-actions {
      display: flex;
      gap: 12px;
      margin-top: 4px;
    }

    &__skeleton-btn {
      height: 44px;
      border-radius: 10px;
      animation: shimmer 1.5s infinite;

      &--primary {
        flex: 1;
        background: @neutral-200;
      }

      &--outline {
        width: 100px;
        background: @neutral-100;
        border: 1px solid @neutral-200;
      }
    }

    &__skeleton-benefits {
      display: flex;
      gap: 16px;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid @neutral-100;
    }

    &__skeleton-benefit {
      width: 80px;
      height: 16px;
      background: @neutral-200;
      border-radius: 4px;
      animation: shimmer 1.5s infinite;
    }

    &__bg-pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(var(--primary-500-rgb), 0.04) 1px, transparent 1px);
      background-size: 32px 32px;
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    }

    &__bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      animation: float 20s ease-in-out infinite;

      &--1 {
        top: 20%;
        left: 5%;
        width: 350px;
        height: 350px;
        background: rgba(var(--primary-400-rgb), 0.12);
      }

      &--2 {
        bottom: 10%;
        right: 5%;
        width: 280px;
        height: 280px;
        background: rgba(16, 185, 129, 0.08);
        animation-delay: -10s;
      }
    }

    // ============================================
    // CONTAINER
    // ============================================
    &__container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 820px;
    }

    // ============================================
    // CARD - VERTICAL LAYOUT
    // ============================================
    &__card {
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 24px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 32px rgba(0, 0, 0, 0.06),
        0 24px 64px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.8);
      overflow: hidden;
      max-width: 520px;
      margin: 0 auto;
    }

    // ============================================
    // TOP SECTION - STATUS
    // ============================================
    &__status {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 24px 28px;
      background: linear-gradient(160deg, var(--secondary-900) 0%, var(--secondary-800) 100%);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
          circle at 30% 20%,
          rgba(255, 255, 255, 0.06) 0%,
          transparent 50%
        );
      }

      &--error {
        background: linear-gradient(160deg, @danger-900 0%, @danger-800 100%);
      }
    }

    &__back-top {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 1;
    }

    &__status-main {
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
    }

    &__icon-wrapper {
      position: relative;
      flex-shrink: 0;
    }

    &__icon-ring {
      position: absolute;
      inset: -12px;
      border: 2px solid rgba(255, 255, 255, 0.08);
      border-radius: 50%;

      &--1 {
        animation: pulse-ring 2s ease-out infinite;
      }

      &--2 {
        animation: pulse-ring 2s ease-out infinite 1s;
      }
    }

    &__icon {
      position: relative;
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(var(--success-500-rgb), 0.2);
      border-radius: 50%;
      color: @success-400;
      box-shadow:
        0 0 0 4px rgba(var(--success-500-rgb), 0.1),
        0 6px 20px rgba(0, 0, 0, 0.2);
      animation: icon-pop 0.5s @ease;

      &--error {
        background: rgba(var(--danger-500-rgb), 0.2);
        color: @danger-400;
        box-shadow:
          0 0 0 4px rgba(var(--danger-500-rgb), 0.1),
          0 6px 20px rgba(0, 0, 0, 0.2);
      }
    }

    &__status-text {
      flex: 1;
      min-width: 0;
    }

    &__title {
      font-family: @font-display;
      font-size: 20px;
      font-weight: 700;
      color: white;
      margin: 0 0 2px;
    }

    &__subtitle {
      font-family: @font-body;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }

    &__loading-dots {
      span {
        animation: blink 1.4s infinite both;
        &:nth-child(2) {
          animation-delay: 0.2s;
        }
        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }

    &__status-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
    }

    &__email {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      backdrop-filter: blur(8px);

      svg {
        color: rgba(255, 255, 255, 0.6);
        flex-shrink: 0;
      }

      span {
        font-family: @font-body;
        font-size: 13px;
        font-weight: 500;
        color: white;
      }
    }

    &__trust {
      display: flex;
      gap: 16px;
    }

    &__trust-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: @font-body;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);

      svg {
        color: @success-400;
        flex-shrink: 0;
      }
    }

    // ============================================
    // RIGHT COLUMN - ACTION
    // ============================================
    &__action {
      display: flex;
      flex-direction: column;
      padding: 28px;
    }

    // ============================================
    // LOADER
    // ============================================
    &__loader {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;

      p {
        font-family: @font-body;
        font-size: 14px;
        color: @neutral-500;
        margin: 0;
      }
    }

    &__loader-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid @neutral-100;
      border-top-color: var(--primary-500);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    // ============================================
    // CONVERSION FORM
    // ============================================
    &__conversion {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    &__conversion-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid @neutral-100;

      > svg {
        flex-shrink: 0;
        color: var(--primary-600);
        margin-top: 2px;
      }

      h3 {
        font-family: @font-display;
        font-size: 17px;
        font-weight: 600;
        color: @neutral-900;
        margin: 0 0 2px;
      }

      p {
        font-family: @font-body;
        font-size: 13px;
        color: @neutral-500;
        margin: 0;
      }
    }

    &__form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    &__form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      &--readonly {
        .success__input-readonly {
          background: @neutral-50;
        }
      }
    }

    &__label {
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      color: @neutral-600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    &__input-readonly {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 10px;
      height: 44px;

      span {
        font-family: @font-body;
        font-size: 14px;
        color: @neutral-600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      svg {
        color: @success-500;
        flex-shrink: 0;
      }
    }

    &__input {
      width: auto;
      padding: 12px 14px;
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 10px;
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-900;
      height: 44px;
      transition: all 0.2s @ease;

      &::placeholder {
        color: @neutral-400;
      }

      &:focus {
        outline: none;
        border-color: var(--primary-400);
        box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.1);
      }
    }

    &__form-actions {
      display: flex;
      gap: 12px;
      margin-top: 4px;
    }

    &__benefits {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid @neutral-100;
    }

    &__benefit {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: @font-body;
      font-size: 12px;
      color: @neutral-500;

      svg {
        color: @success-500;
      }
    }

    // ============================================
    // LOGGED IN STATE
    // ============================================
    &__logged {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
    }

    &__logged-icon {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
      border-radius: 16px;
      color: var(--primary-600);
      margin-bottom: 16px;
    }

    &__logged h3 {
      font-family: @font-display;
      font-size: 18px;
      font-weight: 600;
      color: @neutral-900;
      margin: 0 0 6px;
    }

    &__logged p {
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-500;
      margin: 0 0 20px;
    }

    // ============================================
    // ERROR STATE
    // ============================================
    &__error {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;

      p {
        font-family: @font-body;
        font-size: 14px;
        color: @danger-800;
        margin: 0 0 16px;
        line-height: 1.5;
      }
    }

    &__error-contact {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: @danger-50;
      border: 1px solid @danger-200;
      border-radius: 8px;
      font-family: @font-body;
      font-size: 13px;
      color: @danger-600;

      svg {
        color: @danger-500;
      }
    }

    // ============================================
    // BUTTONS
    // ============================================
    &__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 10px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s @ease;
      white-space: nowrap;

      &--primary {
        flex: 1;
        min-width: 0;
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        border: none;
        color: white;
        box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.25);

        &:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(var(--primary-500-rgb), 0.35);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
      }

      &--outline {
        flex-shrink: 0;
        background: white;
        border: 1px solid @neutral-200;
        color: @neutral-700;
        padding: 12px 18px;

        &:hover {
          background: @neutral-50;
          border-color: var(--primary-300);
          color: var(--primary-700);
        }
      }
    }

    &__btn-loader {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    // ============================================
    // ANIMATIONS
    // ============================================
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes float {
      0%,
      100% {
        transform: translateY(0) translateX(0);
      }
      50% {
        transform: translateY(-20px) translateX(10px);
      }
    }

    @keyframes pulse-ring {
      0% {
        transform: scale(1);
        opacity: 0.4;
      }
      100% {
        transform: scale(1.15);
        opacity: 0;
      }
    }

    @keyframes icon-pop {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes blink {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
    }

    .fade-slide-enter-active,
    .fade-slide-leave-active {
      transition: all 0.3s @ease;
    }

    .fade-slide-enter-from {
      opacity: 0;
      transform: translateY(10px);
    }

    .fade-slide-leave-to {
      opacity: 0;
      transform: translateY(-10px);
    }

    // ============================================
    // RESPONSIVE
    // ============================================
    @media (max-width: 600px) {
      padding: 16px;

      &__card {
        border-radius: 20px;
      }

      &__status {
        flex-wrap: wrap;
        padding: 20px;
        gap: 16px;
      }

      &__status-content {
        flex: 1 1 calc(100% - 76px);
      }

      &__title {
        font-size: 18px;
      }

      &__status-right {
        flex: 1 1 100%;
        justify-content: space-between;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      &__action {
        padding: 20px;
      }

      &__form-row {
        grid-template-columns: 1fr;
      }

      &__form-actions {
        flex-direction: column;
      }

      &__btn--outline {
        width: 100%;
      }

      &__benefits {
        flex-wrap: wrap;
        gap: 10px;
      }
    }

    @media (max-width: 400px) {
      &__email span {
        max-width: 120px;
        font-size: 12px;
      }

      &__trust {
        gap: 8px;
      }

      &__benefits {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }
</style>
