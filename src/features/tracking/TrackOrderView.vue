<template>
  <div class="track">
    <PageHeader
      :title="order ? `Commande #${order.order_number}` : t('tracking.title')"
      :breadcrumbs="[
        { label: t('nav.home'), to: '/' },
        { label: t('nav.tracking'), to: '/suivi-commande' }
      ]"
    >
      <template #description>
        <span>{{ t('tracking.description') }}</span>
      </template>
    </PageHeader>

    <PageContent background="neutral">
      <!-- Error Message -->
      <Transition name="slide-down">
        <div v-if="errorMessage" class="track__error">
          <div class="track__error-icon">
            <BasicIconNext name="AlertCircle" :size="24" />
          </div>
          <div class="track__error-content">
            <strong>Commande introuvable</strong>
            <span>{{ errorMessage }}</span>
          </div>
          <button class="track__error-close" @click="errorMessage = ''">
            <BasicIconNext name="X" :size="20" />
          </button>
        </div>
      </Transition>

      <!-- Search Form -->
      <TrackSearchForm
        v-if="!order && !loading"
        v-model:order-number="form.orderNumber"
        v-model:email="form.email"
        :loading="loading"
        :error="errorMessage"
        @search="handleSearch"
        @clear-error="errorMessage = ''"
      />

      <!-- Loading Skeleton -->
      <TrackSkeleton v-if="loading" />

      <!-- Order Results -->
      <div v-if="order && !loading" class="track__results">
        <!-- Navigation -->
        <nav class="track__nav">
          <button class="track__nav-back" @click="resetSearch">
            <BasicIconNext name="ArrowLeft" :size="18" />
            Nouvelle recherche
          </button>
          <div class="track__nav-order">
            <span class="track__nav-label">Commande</span>
            <span class="track__nav-number">#{{ order.order_number }}</span>
          </div>
        </nav>

        <!-- Main Grid -->
        <div class="track__grid">
          <div class="track__main">
            <!-- Status Card -->
            <TrackStatusCard :order="order" />

            <!-- Details Grid -->
            <TrackOrderDetails
              :order="order"
              :copied="copied"
              @copy-tracking="copyTracking"
            />
          </div>

          <!-- Sidebar -->
          <TrackOrderSidebar
            :order="order"
            :is-logged-in="!!auth.user"
            :register-loading="registerLoading"
            :register-success="registerSuccess"
            @register="handleQuickRegister"
          />
        </div>
      </div>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import PageContent from '@/features/shared/components/PageContent.vue'
import PageHeader from '@/features/shared/components/PageHeader.vue'
import { signUpWithMetadata, trackGuestOrderByEmail, trackGuestOrderByToken } from '@/api'
import type { OrdersFullView } from '@/supabase/types/supabase.types'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

// Sub-components
import TrackSearchForm from './components/TrackSearchForm.vue'
import TrackSkeleton from './components/TrackSkeleton.vue'
import TrackStatusCard from './components/TrackStatusCard.vue'
import TrackOrderDetails from './components/TrackOrderDetails.vue'
import TrackOrderSidebar from './components/TrackOrderSidebar.vue'

const { t } = useI18n()

// SEO
useHead({
  title: 'Suivre ma commande - Atlas Lab Solutions',
  meta: [
    {
      name: 'description',
      content: 'Suivez votre commande en temps réel. Consultez le statut de livraison et les détails de votre commande de peptides.',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://fast-peptides.com/suivi-commande',
    },
  ],
})

// Composables
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

// State
const loading = ref(false)
const order = ref<OrdersFullView | null>(null)
const errorMessage = ref('')
const copied = ref(false)
const newPassword = ref('')
const registerLoading = ref(false)
const registerSuccess = ref(false)

const form = ref({
  orderNumber: '',
  email: '',
})

// Actions
async function handleTokenTracking(token: string) {
  loading.value = true
  errorMessage.value = ''

  try {
    const data = await trackGuestOrderByToken(token)
    order.value = data
  } catch (err: any) {
    errorMessage.value = err.message || 'Lien invalide ou expiré.'
    order.value = null
  } finally {
    loading.value = false
  }
}

async function handleSearch() {
  errorMessage.value = ''

  if (!form.value.email || !form.value.orderNumber) {
    errorMessage.value = 'Veuillez remplir tous les champs.'
    return
  }

  loading.value = true

  try {
    const data = await trackGuestOrderByEmail(form.value.email, form.value.orderNumber)
    order.value = data

    await router.replace({
      query: {
        ...route.query,
        email: form.value.email,
        ref: form.value.orderNumber,
        token: undefined,
      },
    })
  } catch (err: any) {
    errorMessage.value = err.message || 'Commande introuvable. Vérifiez vos informations.'
    order.value = null
  } finally {
    loading.value = false
  }
}

async function handleQuickRegister(password: string) {
  if (!password || password.length < 6) {
    toast.show('Le mot de passe doit contenir au moins 6 caractères', 'warning')
    return
  }
  if (!order.value?.shipping_email) return

  registerLoading.value = true

  try {
    const { error } = await signUpWithMetadata({
      email: order.value.shipping_email,
      password: password,
      fullName: order.value.shipping_name || '',
    })

    if (error) throw error

    registerSuccess.value = true
    toast.show('Compte créé avec succès !', 'success')
  } catch (err: any) {
    console.error(err)
    toast.show(err.message || 'Erreur lors de la création du compte', 'danger')
  } finally {
    registerLoading.value = false
  }
}

function resetSearch() {
  order.value = null
  errorMessage.value = ''
  form.value.orderNumber = ''
  form.value.email = ''
  newPassword.value = ''
  registerSuccess.value = false
  router.replace({ query: {} })
}

async function copyTracking() {
  if (!order.value?.tracking_number) return

  try {
    await navigator.clipboard.writeText(order.value.tracking_number)
    copied.value = true
    toast.show('Numéro de suivi copié !', 'success')
    setTimeout(() => (copied.value = false), 2000)
  } catch (err) {
    toast.show('Erreur lors de la copie', 'danger')
  }
}

// Lifecycle
onMounted(async () => {
  const token = route.query.token as string

  if (token) {
    await handleTokenTracking(token)
    return
  }

  if (route.query.email && route.query.ref) {
    form.value.email = route.query.email as string
    form.value.orderNumber = route.query.ref as string
    await handleSearch()
  }
})
</script>

<style scoped lang="less">
@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.track {
  position: relative;
  min-height: 100vh;
  padding-bottom: 80px;

  // Error toast
  &__error {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 24px;
    background: white;
    border-radius: 16px;
    border-left: 4px solid @danger-500;
    box-shadow: 0 4px 24px rgba(var(--danger-500-rgb), 0.15), 0 12px 48px rgba(var(--black-rgb), 0.08);
    margin-bottom: 32px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    animation: shake 0.5s @ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  &__error-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, @danger-50 0%, @danger-100 100%);
    border-radius: 12px;
    color: @danger-500;
    flex-shrink: 0;
  }

  &__error-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      color: @danger-700;
    }

    span {
      font-family: @font-body;
      font-size: 14px;
      color: @danger-600;
    }
  }

  &__error-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: transparent;
    border: none;
    border-radius: 10px;
    color: @neutral-400;
    cursor: pointer;
    transition: all 0.2s @ease;

    &:hover {
      background: @danger-50;
      color: @danger-500;
    }
  }

  // Results
  &__results {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid @neutral-100;
  }

  &__nav-back {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    background: white;
    border: 1px solid @neutral-200;
    border-radius: 12px;
    font-family: @font-body;
    font-size: 14px;
    font-weight: 500;
    color: @neutral-600;
    cursor: pointer;
    transition: all 0.25s @ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    svg {
      transition: transform 0.25s @ease;
    }

    &:hover {
      background: @neutral-50;
      border-color: var(--primary-300);
      color: var(--primary-700);
      transform: translateX(-4px);

      svg {
        transform: translateX(-3px);
      }
    }
  }

  &__nav-order {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__nav-label {
    font-family: @font-body;
    font-size: 13px;
    font-weight: 500;
    color: @neutral-500;
  }

  &__nav-number {
    font-family: @font-display;
    font-size: 18px;
    font-weight: 700;
    color: @neutral-900;
    padding: 8px 16px;
    background: @neutral-50;
    border-radius: 10px;
  }

  // Grid
  &__grid {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 32px;
    align-items: start;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  // Transitions
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: all 0.35s @ease;
  }

  .slide-down-enter-from,
  .slide-down-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

// Responsive
.respond-tablet({
  .track {
    &__grid {
      grid-template-columns: 1fr 360px;
      gap: 28px;
    }
  }
});

.respond-mobile({
  .track {
    &__grid {
      grid-template-columns: 1fr;
    }

    &__nav {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }

    &__nav-back {
      justify-content: center;
    }

    &__nav-order {
      justify-content: center;
    }
  }
});
</style>
