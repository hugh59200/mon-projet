<template>
  <div class="success">
    <!-- Background -->
    <div class="success__bg">
      <div class="success__bg-gradient"></div>
      <div class="success__bg-pattern"></div>
      <div class="success__bg-orb success__bg-orb--1"></div>
      <div class="success__bg-orb success__bg-orb--2"></div>
      <div class="success__bg-orb success__bg-orb--3"></div>
    </div>

    <div class="success__container">
      <!-- Main Card -->
      <div class="success__card">
        <!-- Header -->
        <div
          class="success__header"
          :class="{ 'success__header--error': isError }"
        >
          <!-- Animated Icon -->
          <div class="success__icon-wrapper">
            <div class="success__icon-bg">
              <div class="success__icon-ring success__icon-ring--1"></div>
              <div class="success__icon-ring success__icon-ring--2"></div>
            </div>
            <div
              class="success__icon"
              :class="{ 'success__icon--error': isError }"
            >
              <svg
                v-if="!isError"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <svg
                v-else
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
                <line
                  x1="12"
                  y1="9"
                  x2="12"
                  y2="13"
                />
                <line
                  x1="12"
                  y1="17"
                  x2="12.01"
                  y2="17"
                />
              </svg>
            </div>
          </div>

          <h1 class="success__title">
            {{ isError ? 'Une erreur est survenue' : 'Paiement confirmé !' }}
          </h1>

          <p
            v-if="isLoading"
            class="success__subtitle"
          >
            <span class="success__loading-dots">
              Finalisation en cours
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </p>

          <template v-else>
            <p class="success__subtitle">
              {{
                isError
                  ? 'Le paiement a été reçu mais le statut nécessite une vérification.'
                  : 'Votre commande a bien été enregistrée'
              }}
            </p>

            <!-- Email Badge -->
            <div
              v-if="orderEmail && !isError"
              class="success__email"
            >
              <div class="success__email-badge">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>{{ orderEmail }}</span>
              </div>
              <p class="success__email-hint">Un email de confirmation vous a été envoyé</p>
            </div>
          </template>
        </div>

        <!-- Content -->
        <div class="success__content">
          <transition
            name="fade-slide"
            mode="out-in"
          >
            <div
              v-if="isLoading"
              class="success__loader"
            >
              <div class="success__loader-spinner"></div>
              <p>Traitement de votre commande...</p>
            </div>

            <template v-else>
              <!-- Guest: Conversion Form -->
              <div
                v-if="!auth.user && currentOrderId && !isError"
                class="success__section"
              >
                <div class="success__conversion">
                  <div class="success__conversion-header">
                    <div class="success__conversion-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle
                          cx="8.5"
                          cy="7"
                          r="4"
                        />
                        <line
                          x1="20"
                          y1="8"
                          x2="20"
                          y2="14"
                        />
                        <line
                          x1="23"
                          y1="11"
                          x2="17"
                          y2="11"
                        />
                      </svg>
                    </div>
                    <div class="success__conversion-text">
                      <h3>Créer mon compte</h3>
                      <p>Suivez vos commandes et profitez d'avantages exclusifs</p>
                    </div>
                  </div>

                  <form
                    class="success__form"
                    @submit.prevent="handleGuestConversion"
                  >
                    <!-- Email (readonly) -->
                    <div class="success__form-group">
                      <label class="success__label">Email associé</label>
                      <div class="success__input-readonly">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                          />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <span>{{ orderEmail }}</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          class="success__input-check"
                        >
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                    </div>

                    <!-- Password -->
                    <div class="success__form-group">
                      <label class="success__label">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                          />
                          <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        Mot de passe
                      </label>
                      <div class="success__input-wrapper">
                        <input
                          v-model="password"
                          type="password"
                          class="success__input"
                          placeholder="Minimum 6 caractères"
                          required
                        />
                      </div>
                      <span class="success__input-hint">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                          />
                          <line
                            x1="12"
                            y1="16"
                            x2="12"
                            y2="12"
                          />
                          <line
                            x1="12"
                            y1="8"
                            x2="12.01"
                            y2="8"
                          />
                        </svg>
                        Choisissez un mot de passe sécurisé
                      </span>
                    </div>

                    <button
                      type="submit"
                      class="success__btn success__btn--primary"
                      :disabled="password.length < 6 || isConverting"
                    >
                      <span
                        v-if="isConverting"
                        class="success__btn-loader"
                      ></span>
                      <template v-else>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle
                            cx="8.5"
                            cy="7"
                            r="4"
                          />
                          <polyline points="17 11 19 13 23 9" />
                        </svg>
                        Activer mon compte
                      </template>
                    </button>
                  </form>

                  <!-- Alternative: Guest Tracking -->
                  <div
                    v-if="trackingToken"
                    class="success__alternative"
                  >
                    <div class="success__alternative-divider">
                      <span>ou</span>
                    </div>
                    <button
                      class="success__btn success__btn--outline"
                      @click="goToGuestTracking"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle
                          cx="12"
                          cy="10"
                          r="3"
                        />
                      </svg>
                      Suivre sans créer de compte
                    </button>
                  </div>
                </div>

                <!-- Benefits -->
                <div class="success__benefits">
                  <h4 class="success__benefits-title">Avantages du compte</h4>
                  <div class="success__benefits-list">
                    <div class="success__benefit">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>Historique des commandes</span>
                    </div>
                    <div class="success__benefit">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>Suivi en temps réel</span>
                    </div>
                    <div class="success__benefit">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>Offres exclusives</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Logged in User -->
              <div
                v-else-if="auth.user && !isError"
                class="success__section"
              >
                <div class="success__logged">
                  <div class="success__logged-icon">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M21 8V21H3V8" />
                      <path d="M1 3H23V8H1V3Z" />
                      <path d="M10 12H14" />
                    </svg>
                  </div>
                  <h3 class="success__logged-title">Commande enregistrée</h3>
                  <p class="success__logged-text">
                    Retrouvez tous les détails dans votre espace personnel
                  </p>
                  <button
                    class="success__btn success__btn--primary"
                    @click="$router.push(`/profil/commandes/${currentOrderId}`)"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                    Voir ma commande
                  </button>
                </div>
              </div>

              <!-- Error State -->
              <div
                v-else-if="isError"
                class="success__section"
              >
                <div class="success__error-content">
                  <p class="success__error-text">
                    Un problème est survenu lors du traitement de votre commande. Notre équipe a été
                    notifiée et reviendra vers vous rapidement.
                  </p>
                  <div class="success__error-contact">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>support@fastpeptides.com</span>
                  </div>
                </div>
              </div>

              <!-- Back to Shop -->
              <button
                class="success__btn success__btn--ghost"
                @click="$router.push('/')"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Retour à la boutique
              </button>
            </template>
          </transition>
        </div>
      </div>

      <!-- Trust Footer -->
      <div class="success__footer">
        <div class="success__footer-item">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Paiement sécurisé</span>
        </div>
        <div class="success__footer-item">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect
              x="1"
              y="3"
              width="15"
              height="13"
              rx="2"
            />
            <path d="M16 8h4a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-1" />
            <circle
              cx="5.5"
              cy="18.5"
              r="2.5"
            />
            <circle
              cx="18.5"
              cy="18.5"
              r="2.5"
            />
          </svg>
          <span>Livraison rapide</span>
        </div>
        <div class="success__footer-item">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span>Support 24/7</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { supabase } from '@/supabase/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
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
  const password = ref('')
  const isConverting = ref(false)

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
      toast.show('Problème lors de la confirmation.', 'danger')
    } finally {
      isLoading.value = false
    }
  })

  // API Functions
  async function fetchOrderDetails(id: string) {
    const { data } = await supabase.rpc('get_order_summary_public', {
      p_order_id: id,
    })

    if (data) {
      const orderData = data as unknown as OrderSummary
      currentOrderId.value = id
      orderEmail.value = orderData.email
      orderNumber.value = orderData.order_number || ''
      trackingToken.value = orderData.tracking_token || ''
    }
  }

  async function handlePayPalCapture(orderId: string) {
    const { error } = await supabase.functions.invoke('capture-paypal-order', {
      body: { orderId },
    })
    if (error) throw error
    await fetchOrderDetails(orderId)
  }

  async function handleStripeSuccess() {
    if (currentOrderId.value) {
      await supabase.functions.invoke('order-confirmation', {
        body: { order_id: currentOrderId.value },
      })
    }
  }

  async function fetchOrderByStripe(sessionId: string) {
    const { data } = await supabase
      .from('orders')
      .select('id, email, order_number, tracking_token')
      .eq('stripe_session_id', sessionId)
      .maybeSingle()
    if (data) {
      currentOrderId.value = data.id
      orderEmail.value = data.email
      orderNumber.value = data.order_number || ''
      trackingToken.value = data.tracking_token || ''
    }
  }

  async function fetchLastOrder() {
    const { data } = await supabase
      .from('orders')
      .select('id, email, order_number, tracking_token')
      .eq('user_id', auth.user!.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (data) {
      currentOrderId.value = data.id
      orderEmail.value = data.email
      orderNumber.value = data.order_number || ''
      trackingToken.value = data.tracking_token || ''
    }
  }

  // Guest Conversion
  async function handleGuestConversion() {
    if (!orderEmail.value || !password.value || !currentOrderId.value) return
    isConverting.value = true

    const activationRedirectUrl = `${window.location.origin}/auth/callback`

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: orderEmail.value,
        password: password.value,
        options: {
          data: { full_name: 'Nouveau Membre' },
          emailRedirectTo: activationRedirectUrl,
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Erreur lors de la création du compte')

      const { error: rpcError } = await supabase.rpc('claim_order_for_user', {
        p_order_id: currentOrderId.value,
        p_user_id: authData.user.id,
      })

      if (rpcError) {
        throw new Error('Impossible de lier la commande. Veuillez contacter le support.')
      }

      toast.show('📧 Un email de confirmation vous a été envoyé !', 'success')
      router.push('/auth/email-sent')
    } catch (err: any) {
      console.error('Erreur conversion:', err)
      toast.show(err.message || 'Erreur lors de la conversion', 'danger')
    } finally {
      isConverting.value = false
    }
  }

  // Guest Tracking Navigation
  function goToGuestTracking() {
    if (!trackingToken.value) {
      toast.show('Token de suivi introuvable', 'danger')
      return
    }
    router.push(`/suivi-commande?token=${trackingToken.value}`)
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
    padding: 40px 24px;
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
        top: 10%;
        left: 10%;
        width: 400px;
        height: 400px;
        background: rgba(var(--primary-400-rgb), 0.15);
        animation-delay: 0s;
      }

      &--2 {
        bottom: 20%;
        right: 10%;
        width: 300px;
        height: 300px;
        background: rgba(16, 185, 129, 0.1);
        animation-delay: -7s;
      }

      &--3 {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        height: 500px;
        background: rgba(var(--primary-300-rgb), 0.08);
        animation-delay: -14s;
      }
    }

    // ============================================
    // CONTAINER
    // ============================================
    &__container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 520px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    // ============================================
    // CARD
    // ============================================
    &__card {
      background: white;
      border-radius: 28px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 32px rgba(0, 0, 0, 0.06),
        0 24px 64px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.8);
      overflow: hidden;
    }

    // ============================================
    // HEADER
    // ============================================
    &__header {
      position: relative;
      padding: 48px 32px 40px;
      background: linear-gradient(160deg, var(--secondary-900) 0%, var(--secondary-800) 100%);
      text-align: center;
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
          rgba(255, 255, 255, 0.08) 0%,
          transparent 50%
        );
      }

      &--error {
        background: linear-gradient(160deg, #7f1d1d 0%, #991b1b 100%);
      }
    }

    &__icon-wrapper {
      position: relative;
      display: inline-flex;
      margin-bottom: 24px;
    }

    &__icon-bg {
      position: absolute;
      inset: -20px;
    }

    &__icon-ring {
      position: absolute;
      inset: 0;
      border: 2px solid rgba(255, 255, 255, 0.1);
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
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(16, 185, 129, 0.2);
      border-radius: 50%;
      color: #34d399;
      box-shadow:
        0 0 0 8px rgba(16, 185, 129, 0.1),
        0 8px 32px rgba(0, 0, 0, 0.2);
      animation: icon-pop 0.5s @ease;

      &--error {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        box-shadow:
          0 0 0 8px rgba(239, 68, 68, 0.1),
          0 8px 32px rgba(0, 0, 0, 0.2);
      }
    }

    &__title {
      position: relative;
      font-family: @font-display;
      font-size: 28px;
      font-weight: 700;
      color: white;
      margin: 0 0 12px;
    }

    &__subtitle {
      position: relative;
      font-family: @font-body;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      max-width: 360px;
      margin-left: auto;
      margin-right: auto;
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

    // ============================================
    // EMAIL BADGE
    // ============================================
    &__email {
      position: relative;
      margin-top: 24px;
    }

    &__email-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      backdrop-filter: blur(8px);
      transition: all 0.2s @ease;

      svg {
        color: rgba(255, 255, 255, 0.7);
      }

      span {
        font-family: @font-body;
        font-size: 15px;
        font-weight: 600;
        color: white;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.18);
        transform: translateY(-2px);
      }
    }

    &__email-hint {
      font-family: @font-body;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.6);
      margin: 12px 0 0;
    }

    // ============================================
    // CONTENT
    // ============================================
    &__content {
      padding: 32px;
    }

    &__section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    // ============================================
    // LOADER
    // ============================================
    &__loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding: 40px 0;
    }

    &__loader-spinner {
      width: 48px;
      height: 48px;
      border: 3px solid @neutral-100;
      border-top-color: var(--primary-500);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    // ============================================
    // CONVERSION FORM
    // ============================================
    &__conversion {
      background: @neutral-50;
      border: 1px solid @neutral-100;
      border-radius: 20px;
      padding: 24px;
    }

    &__conversion-header {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid @neutral-200;
    }

    &__conversion-icon {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 14px;
      color: var(--primary-600);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      flex-shrink: 0;
    }

    &__conversion-text {
      h3 {
        font-family: @font-display;
        font-size: 18px;
        font-weight: 600;
        color: @neutral-900;
        margin: 0 0 4px;
      }

      p {
        font-family: @font-body;
        font-size: 14px;
        color: @neutral-500;
        margin: 0;
      }
    }

    &__form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &__form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 600;
      color: @neutral-700;

      svg {
        color: @neutral-400;
      }
    }

    &__input-readonly {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;

      svg:first-child {
        color: @neutral-400;
      }

      span {
        flex: 1;
        font-family: 'SF Mono', 'Fira Code', monospace;
        font-size: 14px;
        color: @neutral-700;
      }
    }

    &__input-check {
      color: #10b981;
    }

    &__input-wrapper {
      position: relative;
    }

    &__input {
      width: 100%;
      padding: 14px 16px;
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      font-family: @font-body;
      font-size: 15px;
      color: @neutral-900;
      transition: all 0.2s @ease;

      &::placeholder {
        color: @neutral-400;
      }

      &:focus {
        outline: none;
        border-color: var(--primary-400);
        box-shadow: 0 0 0 4px rgba(var(--primary-500-rgb), 0.1);
      }
    }

    &__input-hint {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: @font-body;
      font-size: 12px;
      color: @neutral-500;

      svg {
        color: @neutral-400;
      }
    }

    // ============================================
    // ALTERNATIVE TRACKING
    // ============================================
    &__alternative {
      margin-top: 8px;
    }

    &__alternative-divider {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 20px 0;

      &::before,
      &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: @neutral-200;
      }

      span {
        font-family: @font-body;
        font-size: 12px;
        color: @neutral-400;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    // ============================================
    // BENEFITS
    // ============================================
    &__benefits {
      padding: 20px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.04) 0%,
        rgba(var(--primary-500-rgb), 0.02) 100%
      );
      border: 1px solid rgba(var(--primary-500-rgb), 0.1);
      border-radius: 16px;
    }

    &__benefits-title {
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      color: @neutral-500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 16px;
    }

    &__benefits-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__benefit {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-700;

      svg {
        color: #10b981;
        flex-shrink: 0;
      }
    }

    // ============================================
    // LOGGED IN STATE
    // ============================================
    &__logged {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 24px;
      background: @neutral-50;
      border: 1px solid @neutral-100;
      border-radius: 20px;
    }

    &__logged-icon {
      width: 72px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
      border-radius: 20px;
      color: var(--primary-600);
      margin-bottom: 20px;
    }

    &__logged-title {
      font-family: @font-display;
      font-size: 20px;
      font-weight: 600;
      color: @neutral-900;
      margin: 0 0 8px;
    }

    &__logged-text {
      font-family: @font-body;
      font-size: 15px;
      color: @neutral-500;
      margin: 0 0 24px;
    }

    // ============================================
    // ERROR STATE
    // ============================================
    &__error-content {
      padding: 24px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 16px;
      text-align: center;
    }

    &__error-text {
      font-family: @font-body;
      font-size: 15px;
      color: #991b1b;
      margin: 0 0 20px;
      line-height: 1.6;
    }

    &__error-contact {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: white;
      border: 1px solid #fecaca;
      border-radius: 10px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 500;
      color: #dc2626;

      svg {
        color: #ef4444;
      }
    }

    // ============================================
    // BUTTONS
    // ============================================
    &__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 16px 24px;
      border-radius: 14px;
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s @ease;

      &--primary {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        border: none;
        color: white;
        box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.3);

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(var(--primary-500-rgb), 0.4);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
      }

      &--outline {
        background: white;
        border: 1px solid @neutral-200;
        color: @neutral-700;

        &:hover {
          background: @neutral-50;
          border-color: var(--primary-300);
          color: var(--primary-700);
        }
      }

      &--ghost {
        background: transparent;
        border: none;
        color: @neutral-500;
        padding: 14px 24px;

        &:hover {
          color: var(--primary-600);
          background: rgba(var(--primary-500-rgb), 0.05);
        }
      }
    }

    &__btn-loader {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    // ============================================
    // FOOTER
    // ============================================
    &__footer {
      display: flex;
      justify-content: center;
      gap: 32px;
      flex-wrap: wrap;
    }

    &__footer-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;

      svg {
        color: #10b981;
      }
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
      25% {
        transform: translateY(-20px) translateX(10px);
      }
      50% {
        transform: translateY(0) translateX(20px);
      }
      75% {
        transform: translateY(20px) translateX(10px);
      }
    }

    @keyframes pulse-ring {
      0% {
        transform: scale(1);
        opacity: 0.5;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    @keyframes icon-pop {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.1);
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
      transition: all 0.4s @ease;
    }

    .fade-slide-enter-from {
      opacity: 0;
      transform: translateY(16px);
    }

    .fade-slide-leave-to {
      opacity: 0;
      transform: translateY(-16px);
    }

    // ============================================
    // RESPONSIVE
    // ============================================
    @media (max-width: 600px) {
      padding: 24px 16px;

      &__card {
        border-radius: 24px;
      }

      &__header {
        padding: 40px 24px 32px;
      }

      &__icon {
        width: 70px;
        height: 70px;

        svg {
          width: 32px;
          height: 32px;
        }
      }

      &__title {
        font-size: 24px;
      }

      &__subtitle {
        font-size: 15px;
      }

      &__content {
        padding: 24px;
      }

      &__conversion {
        padding: 20px;
      }

      &__conversion-header {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      &__conversion-icon {
        margin: 0 auto;
      }

      &__footer {
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }
    }

    @media (max-width: 400px) {
      &__email-badge {
        padding: 10px 16px;

        span {
          font-size: 13px;
        }
      }

      &__benefits-list {
        gap: 10px;
      }

      &__benefit {
        font-size: 13px;
      }
    }
  }
</style>
