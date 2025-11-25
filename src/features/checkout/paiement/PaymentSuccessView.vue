<template>
  <div class="payment-page">
    <div
      class="payment-container"
      v-motion-fade-visible
    >
      <div class="icon-wrapper">
        <BasicIconNext
          name="CheckCircle2"
          color="success-600"
          :size="80"
        />
      </div>

      <h1 class="page-title">Paiement réussi 🎉</h1>

      <p class="page-subtitle">
        Merci pour votre commande sur
        <strong>Fast Peptides</strong>
        !
        <br />
        Un email de confirmation a été envoyé à
        <span
          v-if="orderEmail"
          class="email-highlight"
        >
          {{ orderEmail }}
        </span>
        .
      </p>

      <transition
        name="fade-slide"
        mode="out-in"
      >
        <div
          v-if="auth.user || isRedirecting"
          class="action-box text-center"
        >
          <ProgressBar
            color="success"
            class="mb-3"
          />
          <p class="text-muted small">Redirection vers vos commandes...</p>
        </div>

        <div
          v-else-if="currentOrderId && orderEmail"
          class="guest-card"
        >
          <div class="guest-header">
            <BasicIconNext
              name="UserPlus"
              :size="24"
              color="primary-600"
            />
            <h3>Suivre ma commande</h3>
          </div>

          <p class="guest-text">
            Créez un mot de passe pour transformer votre commande invité en compte membre et suivre
            votre colis.
          </p>

          <form
            @submit.prevent="handleGuestConversion"
            class="guest-form"
          >
            <BasicInput
              :model-value="orderEmail"
              label="Votre Email"
              readonly
              disabled
            />
            <BasicInput
              v-model="password"
              type="password"
              label="Créer un mot de passe"
              placeholder="Min. 6 caractères"
              required
            />

            <BasicButton
              label="Créer mon compte"
              type="primary"
              width="full"
              :loading="isConverting"
              :disabled="password.length < 6"
            />
          </form>
        </div>

        <div
          v-else
          class="action-box"
        >
          <BasicButton
            label="Retour à l'accueil"
            type="secondary"
            @click="$router.push('/')"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import ProgressBar from '@/features/shared/ProgressBar.vue'
  import { supabase } from '@/supabase/supabaseClient'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicInput from '@designSystem/components/basic/input/BasicInput.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const cart = useCartStore()
  const auth = useAuthStore()
  const toast = useToastStore()

  const currentOrderId = ref<string | null>(null)
  const orderEmail = ref<string | null>(null)
  const password = ref('')
  const isRedirecting = ref(false)
  const isConverting = ref(false)

  onMounted(async () => {
    await cart.clearCart() // Vide le panier immédiatement

    // Récupération ID (Stripe/Paypal)
    const stripeId = route.query.session_id as string
    const paypalId = route.query.order_id as string

    if (stripeId) await fetchOrder('stripe_session_id', stripeId)
    else if (paypalId) await fetchOrder('paypal_order_id', paypalId)
    else if (auth.user) await fetchLastOrder()

    // Timer si déjà connecté
    if (auth.user) startRedirect()
  })

  async function fetchOrder(col: string, val: string) {
    const { data } = await supabase.from('orders').select('id, email').eq(col, val).maybeSingle()
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

  function startRedirect() {
    isRedirecting.value = true
    setTimeout(() => router.push('/profil/commandes'), 3500)
  }

  async function handleGuestConversion() {
    if (!orderEmail.value || !password.value || !currentOrderId.value) return
    isConverting.value = true
    try {
      // 1. SignUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: orderEmail.value,
        password: password.value,
        options: { data: { full_name: 'Nouveau Membre' } },
      })
      if (authError) throw authError
      if (!authData.user) throw new Error('Erreur création compte')

      // 2. Pause technique (Trigger DB)
      await new Promise((r) => setTimeout(r, 1000))

      // 3. Claim Order
      const { data: rpcData, error: rpcError } = await supabase.rpc('claim_order_for_user', {
        p_order_id: currentOrderId.value,
        p_user_id: authData.user.id,
      })
      if (rpcError) throw rpcError

      // 4. Succès
      toast.show('Compte créé et commande liée !', 'success')
      await auth.initAuth()
      startRedirect()
    } catch (err: any) {
      console.error(err)
      toast.show(err.message || 'Erreur lors de la conversion', 'danger')
    } finally {
      isConverting.value = false
    }
  }
</script>

<style scoped lang="less">
  .payment-page {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc; /* Fond léger */
    padding: 20px;
  }

  .payment-container {
    background: white;
    width: 100%;
    max-width: 500px;
    border-radius: 24px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.08);
  }

  .icon-wrapper {
    margin-bottom: 20px;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 12px;
  }

  .page-subtitle {
    color: #64748b;
    font-size: 1.05rem;
    line-height: 1.6;
    margin-bottom: 32px;
  }

  .email-highlight {
    color: #0f172a;
    font-weight: 600;
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
  }

  /* Carte Invité */
  .guest-card {
    text-align: left;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
  }

  .guest-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;

    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #334155;
    }
  }

  .guest-text {
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 20px;
  }

  .guest-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .text-muted {
    color: #94a3b8;
  }
  .mb-3 {
    margin-bottom: 12px;
  }
</style>
