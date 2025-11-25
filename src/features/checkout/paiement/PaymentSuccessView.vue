<template>
  <div class="payment-success-page">
    <div
      class="bg-image"
      :style="{ backgroundImage: `url(${bgImage})` }"
    ></div>
    <div class="bg-overlay"></div>

    <div
      class="success-card"
      v-motion-pop-visible
    >
      <div class="success-header">
        <div class="icon-circle">
          <BasicIconNext
            :name="isError ? 'AlertTriangle' : 'Check'"
            :color="isError ? 'danger-500' : 'success-500'"
            :size="40"
          />
        </div>

        <BasicText
          size="h2"
          weight="bold"
          color="white"
          class="mb-2"
        >
          {{ isError ? 'Une petite erreur...' : 'Merci !' }}
        </BasicText>

        <BasicText
          v-if="isLoading"
          size="body-m"
          color="neutral-100"
          class="text-center opacity-90"
        >
          Finalisation de votre commande en cours...
        </BasicText>

        <div
          v-else
          class="text-center"
        >
          <BasicText
            size="body-m"
            color="neutral-100"
            class="opacity-90"
          >
            {{
              isError
                ? 'Paiement reçu, mais statut à vérifier.'
                : 'Un email de confirmation a été envoyé à'
            }}
          </BasicText>

          <div class="email-badge-container mt-3">
            <div class="email-badge">
              <BasicIconNext
                name="Mail"
                color="white"
                :size="16"
              />
              <BasicText
                size="body-m"
                weight="bold"
                color="white"
              >
                {{ orderEmail || 'votre adresse' }}
              </BasicText>
            </div>
          </div>
        </div>
      </div>

      <div class="content-area">
        <div
          v-if="isLoading"
          class="loader-box"
        >
          <ProgressBar
            color="primary"
            class="progress-bar"
          />
          <BasicText
            size="body-s"
            color="neutral-500"
            class="redirect-text"
          >
            Sécurisation du paiement...
          </BasicText>
        </div>

        <transition
          name="fade-slide"
          mode="out-in"
        >
          <div
            v-if="!isLoading"
            class="guest-conversion"
          >
            <div
              v-if="!auth.user && currentOrderId && !isError"
              class="conversion-box"
            >
              <div class="conversion-header">
                <div class="conversion-icon">
                  <BasicIconNext
                    name="UserPlus"
                    :size="20"
                    color="primary-600"
                  />
                </div>
                <div class="conversion-titles">
                  <BasicText
                    size="h4"
                    weight="bold"
                    color="neutral-800"
                  >
                    Suivre ma commande
                  </BasicText>
                  <BasicText
                    size="body-s"
                    color="neutral-500"
                  >
                    Créez un mot de passe pour le suivi.
                  </BasicText>
                </div>
              </div>

              <form
                @submit.prevent="handleGuestConversion"
                class="conversion-form"
              >
                <div class="input-group-readonly">
                  <BasicText
                    size="body-s"
                    color="neutral-500"
                    class="mb-1"
                  >
                    Email associé
                  </BasicText>
                  <div class="fake-input-box">
                    <BasicText
                      size="body-m"
                      color="neutral-900"
                      weight="semibold"
                    >
                      {{ orderEmail }}
                    </BasicText>
                  </div>
                </div>

                <BasicInput
                  v-model="password"
                  type="password"
                  label="Mot de passe"
                  placeholder="Min. 6 caractères"
                  required
                  icon-name="Lock"
                />

                <BasicButton
                  label="Activer mon compte"
                  type="primary"
                  variant="filled"
                  width="full"
                  size="large"
                  :loading="isConverting"
                  :disabled="password.length < 6"
                  icon-name="ArrowRight"
                />
              </form>
            </div>

            <div
              v-else
              class="state-box"
            >
              <BasicText
                size="body-m"
                color="neutral-600"
                class="mb-4 block text-center"
              >
                Votre commande est bien enregistrée.
              </BasicText>
            </div>

            <BasicButton
              label="Retour à la boutique"
              type="secondary"
              variant="outlined"
              @click="$router.push('/')"
              class="mt-4"
              width="full"
            />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import bgImage from '@/assets/bg-success.png'
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import ProgressBar from '@/features/shared/ProgressBar.vue'
  import { supabase } from '@/supabase/supabaseClient'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicInput from '@designSystem/components/basic/input/BasicInput.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
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
  }

  const isLoading = ref(true)
  const isError = ref(false)
  const currentOrderId = ref<string | null>(null)
  const orderEmail = ref<string>('')
  const password = ref('')
  const isConverting = ref(false)

  onMounted(async () => {
    await cart.clearCart()

    const stripeSessionId = route.query.session_id as string
    const paypalOrderId = route.query.orderId as string

    // 1. Récupération Initiale
    if (paypalOrderId) await fetchOrderDetails(paypalOrderId)
    else if (stripeSessionId) await fetchOrderByStripe(stripeSessionId)
    else if (auth.user) await fetchLastOrder()

    // 2. Capture du paiement
    try {
      if (paypalOrderId) {
        await handlePayPalCapture(paypalOrderId)
      } else if (stripeSessionId) {
        await handleStripeSuccess(stripeSessionId)
      }
    } catch (error) {
      console.error('Erreur finalisation:', error)
      isError.value = true
      toast.show('Problème lors de la confirmation.', 'danger')
    } finally {
      isLoading.value = false
    }
  })

  async function fetchOrderDetails(id: string) {
    // Utilisation du RPC pour les invités
    const { data } = await supabase.rpc('get_order_summary_public', {
      p_order_id: id,
    })

    if (data) {
      // Typage manuel car RPC renvoie jsonb
      const orderData = data as unknown as OrderSummary
      currentOrderId.value = id
      orderEmail.value = orderData.email
      console.log('Order Details Found:', orderData)
    } else {
      console.warn('Impossible de lire la commande (RLS ou ID invalide)')
    }
  }

  async function handlePayPalCapture(orderId: string) {
    const { error } = await supabase.functions.invoke('capture-paypal-order', {
      body: { orderId },
    })
    if (error) throw error
    await fetchOrderDetails(orderId)
  }

  async function handleStripeSuccess(sessionId: string) {
    // Fallback au cas où le webhook traîne
    if (currentOrderId.value) {
      await supabase.functions.invoke('order-confirmation', {
        body: { order_id: currentOrderId.value },
      })
    }
  }

  async function fetchOrderByStripe(sessionId: string) {
    const { data } = await supabase
      .from('orders')
      .select('id, email')
      .eq('stripe_session_id', sessionId)
      .maybeSingle()
    if (data) {
      currentOrderId.value = data.id
      orderEmail.value = data.email
    }
  }

  async function fetchLastOrder() {
    const { data } = await supabase
      .from('orders')
      .select('id, email')
      .eq('user_id', auth.user!.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (data) {
      currentOrderId.value = data.id
      orderEmail.value = data.email
    }
  }

  async function handleGuestConversion() {
    if (!orderEmail.value || !password.value || !currentOrderId.value) return
    isConverting.value = true
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: orderEmail.value,
        password: password.value,
        options: { data: { full_name: 'Nouveau Membre' } },
      })
      if (authError) throw authError
      if (!authData.user) throw new Error('Erreur création compte')

      await new Promise((r) => setTimeout(r, 1000))

      const { error: rpcError } = await supabase.rpc('claim_order_for_user', {
        p_order_id: currentOrderId.value,
        p_user_id: authData.user.id,
      })
      if (rpcError) throw rpcError

      toast.show('Compte créé et commande liée !', 'success')
      await auth.initAuth()
      router.push('/profil/commandes')
    } catch (err: any) {
      console.error(err)
      toast.show(err.message || 'Erreur lors de la conversion', 'danger')
    } finally {
      isConverting.value = false
    }
  }
</script>

<style scoped lang="less">
  @import '@/assets/Mont/Mont.less';

  .payment-success-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  .bg-image {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: blur(8px);
    opacity: 0.4;
    z-index: 0;
  }

  .bg-overlay {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(@neutral-300 1px, transparent 1px);
    background-size: 30px 30px;
    opacity: 0.5;
    z-index: 0;
    pointer-events: none;
  }

  .success-card {
    position: relative;
    z-index: 1;
    background: white;
    width: 100%;
    max-width: 480px;
    border-radius: 24px;
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .success-header {
    background: linear-gradient(160deg, var(--secondary-900) 0%, var(--secondary-800) 100%);
    padding: 45px 30px;
    text-align: center;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .icon-circle {
    width: 64px;
    height: 64px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    backdrop-filter: blur(4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  /* ✅ BADGE PRO : Style Glassmorphism */
  .email-badge-container {
    display: flex;
    justify-content: center;
  }

  .email-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.15); /* Fond semi-transparent */
    padding: 8px 20px;
    border-radius: 50px; /* Forme pilule moderne */
    border: 1px solid rgba(255, 255, 255, 0.25); /* Bordure subtile */
    backdrop-filter: blur(8px); /* Effet verre */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.25);
    }
  }

  .content-area {
    padding: 32px;
    background: white;
  }

  .guest-conversion {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .conversion-box {
    border: 1px solid @neutral-100;
    border-radius: 12px;
    padding: 20px;
    background: @neutral-50;
  }

  .conversion-header {
    display: flex;
    gap: 16px;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid @neutral-200;
    margin-bottom: 16px;

    .conversion-icon {
      width: 42px;
      height: 42px;
      background: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

      :deep(svg) {
        color: var(--primary-600);
      }
    }

    .conversion-titles {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
  }

  .conversion-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .input-group-readonly {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .fake-input-box {
      background: @neutral-100;
      border: 1px solid @neutral-200;
      padding: 12px 14px;
      border-radius: 10px;
    }
  }

  .state-box {
    text-align: center;
    padding: 10px 0;
  }
  .loader-box {
    text-align: center;
    padding: 20px 0;
  }
  .redirect-text {
    margin-top: 12px;
    animation: pulse 2s infinite;
  }

  .mb-2 {
    margin-bottom: 8px;
  }
  .mb-1 {
    margin-bottom: 4px;
  }
  .mt-2 {
    margin-top: 8px;
  }
  .mt-3 {
    margin-top: 12px;
  }
  .mt-4 {
    margin-top: 16px;
  }
  .opacity-90 {
    opacity: 0.9;
  }

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.4s ease;
  }
  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
</style>
