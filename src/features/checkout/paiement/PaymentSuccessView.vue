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
          <button
            class="success__back-top"
            @click="$router.push('/')"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Boutique
          </button>

          <div class="success__status-main">
            <!-- Icon -->
            <div class="success__icon-wrapper">
              <div class="success__icon-ring success__icon-ring--1"></div>
              <div class="success__icon-ring success__icon-ring--2"></div>
              <div
                class="success__icon"
                :class="{ 'success__icon--error': isError }"
              >
                <svg
                  v-if="!isError"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg
                  v-else
                  width="28"
                  height="28"
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

            <!-- Title & Subtitle -->
            <div class="success__status-text">
              <h1 class="success__title">
                {{ isError ? 'Erreur' : 'Paiement confirmé !' }}
              </h1>
              <p
                v-if="isLoading"
                class="success__subtitle"
              >
                <span class="success__loading-dots">
                  Finalisation
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </p>
              <p
                v-else
                class="success__subtitle"
              >
                {{ isError ? 'Vérification nécessaire' : 'Votre commande a bien été enregistrée' }}
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
              <svg
                width="14"
                height="14"
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
            <div class="success__trust">
              <div class="success__trust-item">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Sécurisé</span>
              </div>
              <div class="success__trust-item">
                <svg
                  width="12"
                  height="12"
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
                </svg>
                <span>Rapide</span>
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
                <svg
                  width="20"
                  height="20"
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
                <div>
                  <h3>Créer mon compte</h3>
                  <p>Suivez vos commandes facilement</p>
                </div>
              </div>

              <form
                class="success__form"
                @submit.prevent="handleGuestConversion"
              >
                <!-- Email (readonly) -->
                <div class="success__form-row">
                  <div class="success__form-group success__form-group--readonly">
                    <label class="success__label">Email</label>
                    <div class="success__input-readonly">
                      <span>{{ orderEmail }}</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                  </div>

                  <div class="success__form-group">
                    <label class="success__label">Mot de passe</label>
                    <input
                      v-model="password"
                      type="password"
                      class="success__input"
                      placeholder="Min. 6 caractères"
                      required
                    />
                  </div>
                </div>

                <div class="success__form-actions">
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
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <polyline points="17 11 19 13 23 9" />
                      </svg>
                      Activer
                    </template>
                  </button>

                  <button
                    v-if="trackingToken"
                    type="button"
                    class="success__btn success__btn--outline"
                    @click="goToGuestTracking"
                  >
                    <svg
                      width="16"
                      height="16"
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
                    Suivre
                  </button>
                </div>
              </form>

              <!-- Benefits inline -->
              <div class="success__benefits">
                <div class="success__benefit">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Historique
                </div>
                <div class="success__benefit">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Suivi temps réel
                </div>
                <div class="success__benefit">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Offres exclusives
                </div>
              </div>
            </div>

            <!-- Logged in User -->
            <div
              v-else-if="auth.user && !isError"
              key="logged"
              class="success__logged"
            >
              <div class="success__logged-icon">
                <svg
                  width="28"
                  height="28"
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
              <h3>Commande enregistrée</h3>
              <p>Retrouvez-la dans votre espace</p>
              <button
                class="success__btn success__btn--primary"
                @click="$router.push(`/profil/commandes/${currentOrderId}`)"
              >
                <svg
                  width="16"
                  height="16"
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

            <!-- Error State -->
            <div
              v-else-if="isError"
              key="error"
              class="success__error"
            >
              <p>Un problème est survenu. Notre équipe a été notifiée.</p>
              <div class="success__error-contact">
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
    const { data, error } = await supabase.rpc('get_order_by_stripe_session', {
      p_session_id: sessionId,
    })

    if (data && typeof data === 'object' && 'id' in data) {
      currentOrderId.value = (data as { id: string }).id
      orderEmail.value = (data as { email?: string }).email || ''
      orderNumber.value = (data as { order_number?: string }).order_number || ''
      trackingToken.value = (data as { tracking_token?: string }).tracking_token || ''
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
        background: linear-gradient(160deg, #7f1d1d 0%, #991b1b 100%);
      }
    }

    &__back-top {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      transition: all 0.2s @ease;
      z-index: 1;

      svg {
        color: rgba(255, 255, 255, 0.6);
      }

      &:hover {
        background: rgba(255, 255, 255, 0.18);
        color: white;

        svg {
          color: white;
        }
      }
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
      background: rgba(16, 185, 129, 0.2);
      border-radius: 50%;
      color: #34d399;
      box-shadow:
        0 0 0 4px rgba(16, 185, 129, 0.1),
        0 6px 20px rgba(0, 0, 0, 0.2);
      animation: icon-pop 0.5s @ease;

      &--error {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        box-shadow:
          0 0 0 4px rgba(239, 68, 68, 0.1),
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
        color: #34d399;
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
        color: #10b981;
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
        color: #10b981;
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
        color: #991b1b;
        margin: 0 0 16px;
        line-height: 1.5;
      }
    }

    &__error-contact {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      font-family: @font-body;
      font-size: 13px;
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
        transform: scale(1.4);
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
