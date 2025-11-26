<template>
  <div class="track-page">
    <div class="track-bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
    </div>

    <div
      class="track-container"
      :class="{ 'is-result': !!order }"
    >
      <div
        class="track-header"
        :class="{ 'compact-header': !!order }"
        v-motion-slide-visible-once-top
      >
        <div class="icon-wrapper">
          <BasicIconNext
            name="PackageSearch"
            :size="order ? 32 : 42"
            color="primary-600"
          />
        </div>
        <div class="header-texts">
          <BasicText
            :size="order ? 'h3' : 'h2'"
            weight="bold"
            color="neutral-900"
            class="track-title"
          >
            Suivi de commande
          </BasicText>
          <BasicText
            v-if="!order"
            size="body-l"
            color="neutral-600"
            class="track-subtitle text-center"
          >
            Consultez l'état d'avancement de votre livraison en un instant.
          </BasicText>
        </div>
      </div>

      <transition name="pop-down">
        <div
          v-if="errorMessage"
          class="error-toast"
        >
          <div class="icon-error">
            <BasicIconNext
              name="AlertCircle"
              color="danger-600"
              :size="20"
            />
          </div>
          <div class="error-text">
            <BasicText
              size="body-s"
              weight="bold"
              color="danger-700"
            >
              Attention
            </BasicText>
            <BasicText
              size="body-s"
              color="danger-600"
            >
              {{ errorMessage }}
            </BasicText>
          </div>
          <button
            class="close-btn"
            @click="errorMessage = ''"
          >
            <BasicIconNext
              name="X"
              :size="16"
              color="neutral-500"
            />
          </button>
        </div>
      </transition>

      <div
        v-if="!order"
        class="search-card"
        v-motion-pop-visible
      >
        <form
          @submit.prevent="handleSearch"
          class="form-content"
        >
          <div class="inputs-wrapper">
            <BasicInput
              v-model="form.orderNumber"
              label="Numéro de commande"
              placeholder="Ex: FP-2025-000123"
              icon-name="Hash"
              required
              :error="!!errorMessage"
              @input="errorMessage = ''"
            />
            <BasicInput
              v-model="form.email"
              label="Adresse Email"
              type="email"
              icon-name="Mail"
              placeholder="exemple@email.com"
              required
              :error="!!errorMessage"
              @input="errorMessage = ''"
            />
          </div>

          <BasicButton
            label="Localiser mon colis"
            type="primary"
            width="full"
            size="large"
            :loading="loading"
            icon-name="ArrowRight"
            variant="filled"
            class="search-btn"
            @click="handleSearch"
          />
        </form>
      </div>

      <div
        v-else
        class="result-grid"
        v-motion-fade
      >
        <div class="left-column">
          <div class="track-widget main-status-widget">
            <div class="widget-header">
              <div>
                <BasicText
                  size="body-s"
                  weight="bold"
                  color="neutral-500"
                  class="mb-1 uppercase"
                >
                  Commande
                </BasicText>
                <BasicText
                  size="h3"
                  weight="bold"
                  color="neutral-900"
                >
                  {{ order.order_number }}
                </BasicText>
              </div>
              <BasicBadge
                :label="getLabelBadge(order.status)"
                :type="getTypeBadge(order.status)"
                class="status-badge-lg"
              />
            </div>

            <div class="timeline-wrapper">
              <template
                v-for="(step, index) in TIMELINE_STEPS"
                :key="step.key"
              >
                <div
                  class="timeline-step"
                  :class="{ active: isStepActive(step.statuses) }"
                >
                  <div class="step-icon">
                    <BasicIconNext
                      v-if="isStepActive(step.statuses)"
                      :name="step.icon as IconNameNext"
                      :size="14"
                      color="white"
                    />
                    <div
                      v-else
                      class="dot"
                    ></div>
                  </div>
                  <BasicText
                    size="body-s"
                    weight="bold"
                    :color="isStepActive(step.statuses) ? 'neutral-900' : 'neutral-400'"
                  >
                    {{ step.label }}
                  </BasicText>
                  <BasicText
                    v-if="step.dateField && (order as Record<string, any>)[step.dateField]"
                    size="body-s"
                    color="neutral-500"
                  >
                    {{ formatDate((order as Record<string, any>)[step.dateField]) }}
                  </BasicText>
                </div>

                <div
                  v-if="index < TIMELINE_STEPS.length - 1"
                  class="step-line"
                  :class="{ active: isLineActive(index) }"
                ></div>
              </template>
            </div>
          </div>

          <div class="details-row">
            <div class="track-widget detail-widget">
              <div class="widget-icon">
                <BasicIconNext
                  name="MapPin"
                  :size="20"
                  color="primary-600"
                />
              </div>
              <div class="widget-content">
                <BasicText
                  size="body-s"
                  weight="bold"
                  color="neutral-500"
                  class="uppercase"
                >
                  Livraison
                </BasicText>
                <BasicText
                  size="body-s"
                  weight="bold"
                  color="neutral-900"
                  class="mt-1"
                >
                  {{ order.shipping_name }}
                </BasicText>
                <BasicText
                  size="body-s"
                  color="neutral-600"
                >
                  {{ order.shipping_address }}
                  <br />
                  {{ order.shipping_zip }} {{ order.shipping_city }}
                </BasicText>
              </div>
            </div>

            <div
              v-if="order.tracking_number"
              class="track-widget detail-widget tracking-widget"
            >
              <div class="widget-icon">
                <BasicIconNext
                  name="Box"
                  :size="20"
                  color="primary-600"
                />
              </div>
              <div class="widget-content">
                <BasicText
                  size="body-s"
                  weight="bold"
                  color="neutral-500"
                  class="uppercase"
                >
                  Transporteur
                </BasicText>
                <BasicText
                  size="body-s"
                  weight="bold"
                  color="neutral-900"
                  class="mt-1"
                >
                  {{ order.carrier || 'Standard' }}
                </BasicText>
                <div
                  class="tracking-pill"
                  @click="copyTracking"
                >
                  <span class="mono">{{ order.tracking_number }}</span>
                  <BasicIconNext
                    :name="copied ? 'Check' : 'Copy'"
                    :size="12"
                    :color="copied ? 'success-600' : 'neutral-500'"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="right-column">
          <div class="track-widget summary-widget">
            <div class="mb-3 flex justify-content-space-between">
              <BasicText
                size="body-m"
                weight="bold"
              >
                Récapitulatif ({{ detailedItemsCount }})
              </BasicText>
              <button
                class="reset-link"
                @click="resetSearch"
              >
                Nouvelle recherche
              </button>
            </div>

            <div class="items-list custom-scrollbar">
              <div
                v-for="item in (order as any)?.detailed_items"
                :key="item.product_id"
                class="mini-item"
              >
                <img
                  :src="item.product_image || defaultImage"
                  class="mini-item__img"
                />
                <div class="mini-item__info">
                  <div class="mini-item__top">
                    <span class="name">{{ item.product_name }}</span>
                    <span class="price">{{ formatPrice(item.total) }}</span>
                  </div>
                  <div class="mini-item__bot">
                    <span class="qty">Qté: {{ item.quantity }}</span>
                    <span
                      v-if="item.product_dosage"
                      class="dosage"
                    >
                      {{ item.product_dosage }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="totals-compact">
              <div class="row">
                <span>Sous-total</span>
                <span>{{ formatPrice(order.subtotal) }}</span>
              </div>
              <div class="row">
                <span>Livraison</span>
                <span>{{ formatPrice(order.shipping_cost) }}</span>
              </div>
              <div
                class="row discount"
                v-if="order.discount_amount"
              >
                <span>Réduction</span>
                <span>-{{ formatPrice(order.discount_amount) }}</span>
              </div>
              <div class="row total">
                <span>Total</span>
                <span>{{ formatPrice(order.total_amount) }}</span>
              </div>
            </div>
          </div>

          <div
            v-if="order.is_guest_order && !auth.user && !registerSuccess"
            class="track-widget cta-widget"
          >
            <div class="cta-header">
              <div class="cta-icon">
                <BasicIconNext
                  name="UserPlus"
                  :size="20"
                  color="primary-600"
                />
              </div>
              <div class="cta-texts">
                <BasicText
                  size="body-s"
                  weight="bold"
                  color="primary-900"
                >
                  Sauvegarder ma commande
                </BasicText>
                <BasicText
                  size="body-s"
                  color="neutral-600"
                >
                  Définissez un mot de passe pour y accéder plus tard.
                </BasicText>
              </div>
            </div>

            <div class="cta-form">
              <div class="read-only-email">
                <BasicIconNext
                  name="Mail"
                  :size="14"
                  color="neutral-500"
                />
                <span>{{ order.shipping_email }}</span>
                <BasicIconNext
                  name="CheckCircle"
                  :size="14"
                  color="success-500"
                />
              </div>

              <BasicInput
                v-model="newPassword"
                type="password"
                placeholder="Choisissez un mot de passe"
                icon-name="Lock"
                size="small"
              />

              <BasicButton
                label="Créer mon compte"
                type="primary"
                size="small"
                width="full"
                :loading="registerLoading"
                @click="handleQuickRegister"
              />
            </div>
          </div>

          <div
            v-else-if="registerSuccess"
            class="track-widget success-widget"
          >
            <BasicIconNext
              name="CheckCircle"
              :size="32"
              color="success-500"
            />
            <BasicText
              size="body-m"
              weight="bold"
              color="success-700"
            >
              Compte créé !
            </BasicText>
            <BasicText
              size="body-s"
              color="success-600"
              class="text-center"
            >
              Un email de confirmation vous a été envoyé.
            </BasicText>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { trackGuestOrderByEmail, trackGuestOrderByToken } from '@/supabase/api/ordersApi'
  import { supabase } from '@/supabase/supabaseClient'
  import type { OrdersFullView } from '@/supabase/types/supabase.types'
  import { getLabelBadge, getTypeBadge } from '@/utils'
  import BasicBadge from '@designSystem/components/basic/badge/BasicBadge.vue'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext, { type IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicInput from '@designSystem/components/basic/input/BasicInput.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()
  const toast = useToastStore()

  const loading = ref(false)
  const order = ref<OrdersFullView | null>(null)
  const errorMessage = ref('')
  const copied = ref(false)

  // Computed property for detailed items count
  import { computed } from 'vue'
  const detailedItemsCount = computed(() => {
    const orderValue = order.value as any
    return orderValue && Array.isArray(orderValue.detailed_items)
      ? orderValue.detailed_items.length
      : 0
  })

  // Inscription rapide
  const newPassword = ref('')
  const registerLoading = ref(false)
  const registerSuccess = ref(false)

  const form = ref({
    orderNumber: '',
    email: '',
  })

  // 🆕 CONFIGURATION DE LA TIMELINE
  // Mapping des statuts techniques vers 4 étapes visuelles
  const TIMELINE_STEPS = [
    {
      key: 'step1',
      label: 'Validée',
      icon: 'Check',
      statuses: ['paid', 'confirmed', 'processing', 'shipped', 'completed'],
      dateField: 'created_at', // La date à afficher sous l'étape
    },
    {
      key: 'step2',
      label: 'Préparation',
      icon: 'Package',
      statuses: ['processing', 'shipped', 'completed'],
      dateField: null,
    },
    {
      key: 'step3',
      label: 'Expédiée',
      icon: 'Truck',
      statuses: ['shipped', 'completed'],
      dateField: 'shipped_at',
    },
    {
      key: 'step4',
      label: 'Livrée',
      icon: 'Home',
      statuses: ['completed'],
      dateField: null,
    },
  ]

  // Helper pour savoir si une étape est active
  function isStepActive(validStatuses: string[]) {
    if (!order.value?.status) return false
    return validStatuses.includes(order.value.status)
  }

  // Helper pour savoir si la ligne entre l'étape i et i+1 doit être colorée
  function isLineActive(index: number) {
    // La ligne est active si l'étape SUIVANTE est active
    const nextStep = TIMELINE_STEPS[index + 1]
    if (!nextStep) return false
    return isStepActive(nextStep.statuses)
  }

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

  async function handleTokenTracking(token: string) {
    loading.value = true
    errorMessage.value = ''
    try {
      const data = await trackGuestOrderByToken(token)
      order.value = data
    } catch (err: any) {
      errorMessage.value = err.message || 'Lien invalide.'
      order.value = null
    } finally {
      loading.value = false
    }
  }

  async function handleSearch() {
    errorMessage.value = ''
    if (!form.value.email || !form.value.orderNumber) {
      errorMessage.value = 'Champs requis.'
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
      errorMessage.value = err.message || 'Introuvable.'
      order.value = null
    } finally {
      loading.value = false
    }
  }

  async function handleQuickRegister() {
    if (!newPassword.value || newPassword.value.length < 6) {
      toast.show('Le mot de passe doit faire au moins 6 caractères', 'warning')
      return
    }
    if (!order.value?.shipping_email) return

    registerLoading.value = true
    try {
      const { error } = await supabase.auth.signUp({
        email: order.value.shipping_email,
        password: newPassword.value,
        options: {
          data: {
            full_name: order.value.shipping_name || '',
          },
        },
      })

      if (error) throw error

      registerSuccess.value = true
      toast.show('Compte créé avec succès ! ✅', 'success')
    } catch (err: any) {
      console.error(err)
      toast.show(err.message || 'Erreur lors de la création', 'danger')
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

  function formatDate(date: string | null | undefined) {
    if (!date) return ''
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  function formatPrice(value: number | null | undefined) {
    if (value == null || isNaN(Number(value))) return '0,00 €'
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
      Number(value),
    )
  }

  async function copyTracking() {
    if (!order.value?.tracking_number) return
    try {
      await navigator.clipboard.writeText(order.value.tracking_number)
      copied.value = true
      toast.show('Copié !', 'success')
      setTimeout(() => (copied.value = false), 2000)
    } catch (err) {
      toast.show('Erreur', 'danger')
    }
  }
</script>

<style scoped lang="less">
  @import '@/assets/Mont/Mont.less';

  /* --- Layout Global --- */
  .track-page {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px;
    display: flex;
    justify-content: center;
    position: relative;
    border-radius: 16px;
    background: radial-gradient(
      circle at top left,
      rgba(var(--primary-200-rgb), 0.5),
      rgba(var(--primary-300-rgb), 0.3)
    );
    min-height: 80vh;
    align-items: center;
  }

  .track-bg-shapes {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;

    .shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
    }
    .shape-1 {
      top: -10%;
      left: -5%;
      width: 400px;
      height: 400px;
      background: var(--primary-200);
    }
    .shape-2 {
      bottom: -10%;
      right: -5%;
      width: 300px;
      height: 300px;
      background: var(--secondary-200);
    }
  }

  /* --- Container Dynamique --- */
  .track-container {
    width: 100%;
    max-width: 500px;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 30px;
    transition: max-width 0.4s ease-in-out;

    &.is-result {
      max-width: 1000px;
      align-self: flex-start;
      margin-top: 20px;
    }
  }

  /* --- Header --- */
  .track-header {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s ease;

    .icon-wrapper {
      width: 70px;
      height: 70px;
      background: white;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      box-shadow: 0 8px 20px -5px rgba(var(--primary-500-rgb), 0.15);
      transition: all 0.3s ease;
    }

    &.compact-header {
      flex-direction: row;
      gap: 16px;
      margin-bottom: 10px;

      .icon-wrapper {
        width: 48px;
        height: 48px;
        margin-bottom: 0;
        border-radius: 12px;
      }
      .header-texts {
        text-align: left;
      }
      .track-title {
        margin: 0;
      }
    }
  }

  /* --- Carte Recherche --- */
  .search-card {
    background: white;
    padding: 32px;
    border-radius: 24px;
    box-shadow:
      0 15px 35px -5px rgba(0, 0, 0, 0.05),
      0 0 0 1px rgba(0, 0, 0, 0.02);
  }

  .form-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    .inputs-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }

  /* --- RESULT GRID LAYOUT --- */
  .result-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 24px;
    align-items: start;

    @media (max-width: 850px) {
      grid-template-columns: 1fr;
    }
  }

  /* --- Widgets Génériques --- */
  .track-widget {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.03),
      0 0 0 1px rgba(0, 0, 0, 0.02);
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  /* --- Colonne Gauche --- */
  .left-column {
    display: flex;
    flex-direction: column;
  }

  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 30px;
  }

  /* Timeline */
  .timeline-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background: @neutral-50;
    border-radius: 16px;
  }

  .timeline-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    z-index: 2;
    min-width: 70px;
    text-align: center;
    flex: 1; /* Distribution équitable */

    .step-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: white;
      border: 1px solid @neutral-200;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: @neutral-300;
      }
    }

    &.active .step-icon {
      background: var(--primary-500);
      border-color: var(--primary-500);
      box-shadow: 0 0 0 4px var(--primary-50);
    }
  }

  .step-line {
    flex: 1;
    height: 3px;
    background: @neutral-200;
    margin: 0 -10px;
    margin-bottom: 38px;
    position: relative;
    border-radius: 2px;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 0%;
      background: var(--primary-500);
      transition: width 0.8s ease-out;
    }
    &.active::after {
      width: 100%;
    }
  }

  /* Details Row */
  .details-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .detail-widget {
    display: flex;
    gap: 16px;
    padding: 20px;
    margin-bottom: 0;
    align-items: flex-start;

    .widget-icon {
      background: @neutral-100;
      padding: 10px;
      border-radius: 12px;
    }
    .widget-content {
      display: flex;
      flex-direction: column;
    }
  }

  .tracking-pill {
    margin-top: 6px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: @neutral-100;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s;
    font-family: monospace;
    width: fit-content;

    &:hover {
      background: @neutral-200;
    }
  }

  /* --- Colonne Droite --- */
  .right-column {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .reset-link {
    background: none;
    border: none;
    color: @neutral-500;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;

    &:hover {
      color: var(--primary-600);
    }
  }

  .items-list {
    max-height: 250px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
    padding-right: 4px;
  }

  .mini-item {
    display: flex;
    gap: 12px;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid @neutral-100;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    &__img {
      width: 42px;
      height: 42px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid @neutral-100;
    }

    &__info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__top,
    &__bot {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }

    .name {
      font-weight: 600;
      color: @neutral-900;
    }
    .price {
      font-weight: 700;
      color: @neutral-900;
    }
    .qty,
    .dosage {
      color: @neutral-500;
      font-size: 12px;
    }
    .dosage {
      color: var(--primary-600);
      background: var(--primary-50);
      padding: 1px 6px;
      border-radius: 4px;
    }
  }

  .divider {
    height: 1px;
    background: @neutral-200;
    margin: 16px 0;
  }

  .totals-compact {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    color: @neutral-600;

    .row {
      display: flex;
      justify-content: space-between;
    }
    .discount {
      color: @success-600;
    }
    .total {
      font-weight: 700;
      color: @neutral-900;
      font-size: 16px;
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px dashed @neutral-300;
    }
  }

  /* CTA WIDGET */
  .cta-widget {
    background: linear-gradient(145deg, #ffffff 0%, var(--primary-50) 100%);
    border: 1px solid var(--primary-200);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .cta-header {
    display: flex;
    gap: 12px;
    align-items: flex-start;

    .cta-icon {
      background: white;
      padding: 8px;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      flex-shrink: 0;
    }

    .cta-texts {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
  }

  .cta-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 4px;
  }

  .read-only-email {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid @neutral-200;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 13px;
    color: @neutral-600;

    span {
      flex: 1;
      font-family: monospace;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .success-widget {
    background: @success-50;
    border: 1px solid @success-200;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
    padding: 30px 20px;
  }

  /* Error Toast */
  .error-toast {
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 400px;
    background: white;
    padding: 12px 16px;
    border-radius: 12px;
    border-left: 4px solid @danger-500;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 10;

    .error-text {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
    }
  }

  /* Utils */
  .uppercase {
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .mb-1 {
    margin-bottom: 4px;
  }
  .mb-2 {
    margin-bottom: 8px;
  }
  .mb-3 {
    margin-bottom: 12px;
  }
  .mt-1 {
    margin-top: 4px;
  }

  /* Custom Scrollbar */
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: @neutral-100;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: @neutral-300;
    border-radius: 4px;
  }
</style>
