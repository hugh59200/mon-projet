<template>
  <div class="track-page">
    <div class="track-bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
    </div>

    <div class="track-container">
      <div
        class="track-header"
        v-motion-slide-visible-once-top
      >
        <div class="icon-wrapper">
          <BasicIconNext
            name="PackageSearch"
            :size="42"
            color="primary-600"
          />
        </div>
        <BasicText
          size="h2"
          weight="bold"
          color="neutral-900"
          class="track-title"
        >
          Suivi de commande
        </BasicText>
        <BasicText
          size="body-l"
          color="neutral-600"
          class="track-subtitle text-center"
        >
          Consultez l'état d'avancement de votre livraison en un instant.
        </BasicText>
      </div>

      <div class="card-wrapper">
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

        <!-- 🔍 FORMULAIRE DE RECHERCHE -->
        <div
          v-if="!order"
          class="track-card"
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

        <!-- ✅ RÉSULTAT : COMMANDE TROUVÉE -->
        <div
          v-else
          class="track-card result-card"
          v-motion-fade
        >
          <!-- Header avec statut -->
          <div class="result-header">
            <div class="header-left">
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

          <!-- Timeline moderne -->
          <div class="timeline-wrapper">
            <div class="timeline-step active">
              <div class="step-icon">
                <BasicIconNext
                  name="Check"
                  :size="14"
                  color="white"
                />
              </div>
              <BasicText
                size="body-s"
                weight="semibold"
                color="neutral-900"
              >
                Validée
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-500"
              >
                {{ formatDate(order.created_at) }}
              </BasicText>
            </div>
            <div
              class="step-line"
              :class="{ active: isShipped }"
            ></div>
            <div
              class="timeline-step"
              :class="{ active: isShipped }"
            >
              <div class="step-icon">
                <BasicIconNext
                  v-if="isShipped"
                  name="Truck"
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
                weight="semibold"
                :color="isShipped ? 'neutral-900' : 'neutral-500'"
              >
                Expédiée
              </BasicText>
              <BasicText
                v-if="order.shipped_at"
                size="body-s"
                color="neutral-500"
              >
                {{ formatDate(order.shipped_at) }}
              </BasicText>
            </div>
          </div>

          <!-- Grille de détails -->
          <div class="details-grid">
            <!-- Adresse de livraison -->
            <div class="detail-box">
              <div class="box-icon">
                <BasicIconNext
                  name="MapPin"
                  :size="18"
                  color="primary-600"
                />
              </div>
              <div class="box-content">
                <BasicText
                  size="body-s"
                  weight="bold"
                  color="neutral-500"
                  class="mb-1 uppercase"
                >
                  Livraison
                </BasicText>
                <BasicText
                  size="body-m"
                  weight="bold"
                  color="neutral-900"
                >
                  {{ order.shipping_name }}
                </BasicText>
                <BasicText
                  size="body-m"
                  color="neutral-600"
                >
                  {{ order.shipping_address }}
                </BasicText>
                <BasicText
                  size="body-m"
                  color="neutral-600"
                >
                  {{ order.shipping_zip }} {{ order.shipping_city }}
                </BasicText>
              </div>
            </div>

            <!-- Tracking (si disponible) -->
            <div
              v-if="order.tracking_number"
              class="detail-box tracking-box"
            >
              <div class="box-icon">
                <BasicIconNext
                  name="Box"
                  :size="18"
                  color="primary-600"
                />
              </div>
              <div class="box-content">
                <BasicText
                  size="body-s"
                  weight="bold"
                  color="neutral-500"
                  class="mb-1 uppercase"
                >
                  Suivi colis
                </BasicText>
                <BasicText
                  size="body-m"
                  weight="bold"
                  color="neutral-900"
                >
                  {{ order.carrier || 'Standard' }}
                </BasicText>
                <div
                  class="tracking-pill"
                  @click="copyTracking"
                >
                  <BasicText
                    size="body-s"
                    color="neutral-700"
                    class="mono"
                  >
                    {{ order.tracking_number }}
                  </BasicText>
                  <BasicIconNext
                    :name="copied ? 'Check' : 'Copy'"
                    :size="12"
                    :color="copied ? 'success-600' : 'neutral-500'"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Articles commandés -->
          <div class="items-section">
            <BasicText
              size="body-m"
              weight="bold"
              class="mb-3"
            >
              Articles ({{ order.detailed_items?.length || 0 }})
            </BasicText>
            <div class="order-items">
              <div
                v-for="item in order.detailed_items"
                :key="item.product_id"
                class="order-item"
              >
                <img
                  :src="item.product_image || defaultImage"
                  :alt="item.product_name"
                  class="order-item__img"
                />
                <div class="order-item__info">
                  <BasicText
                    size="body-m"
                    weight="bold"
                  >
                    {{ item.product_name }}
                  </BasicText>
                  <BasicText
                    v-if="item.product_dosage"
                    size="body-s"
                    color="primary-700"
                    weight="semibold"
                  >
                    {{ item.product_dosage }}
                  </BasicText>
                  <BasicText
                    size="body-s"
                    color="neutral-500"
                  >
                    Quantité : {{ item.quantity }} × {{ formatPrice(item.product_price) }}
                  </BasicText>
                </div>
                <BasicText
                  size="body-m"
                  weight="bold"
                  color="neutral-800"
                >
                  {{ formatPrice(item.total) }}
                </BasicText>
              </div>
            </div>
          </div>

          <!-- Totaux -->
          <div class="totals-section">
            <div class="total-row">
              <BasicText
                size="body-s"
                color="neutral-600"
              >
                Sous-total
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-800"
              >
                {{ formatPrice(order.subtotal) }}
              </BasicText>
            </div>
            <div class="total-row">
              <BasicText
                size="body-s"
                color="neutral-600"
              >
                Livraison
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-800"
              >
                {{ formatPrice(order.shipping_cost) }}
              </BasicText>
            </div>
            <div
              v-if="order.discount_amount && order.discount_amount > 0"
              class="total-row discount"
            >
              <BasicText
                size="body-s"
                color="success-600"
              >
                Réduction
              </BasicText>
              <BasicText
                size="body-s"
                color="success-600"
              >
                -{{ formatPrice(order.discount_amount) }}
              </BasicText>
            </div>
            <div class="total-divider"></div>
            <div class="total-row total">
              <BasicText
                size="body-m"
                weight="bold"
              >
                Total
              </BasicText>
              <BasicText
                size="h5"
                weight="bold"
                color="primary-700"
              >
                {{ formatPrice(order.total_amount) }}
              </BasicText>
            </div>
          </div>

          <!-- 🆕 CTA Création de compte (si guest) -->
          <div
            v-if="order.is_guest_order && !auth.user"
            class="conversion-cta"
          >
            <div class="cta-icon">
              <BasicIconNext
                name="UserPlus"
                :size="20"
                color="primary-600"
              />
            </div>
            <div class="cta-content">
              <BasicText
                size="body-m"
                weight="bold"
                color="neutral-900"
                class="mb-1"
              >
                Suivez toutes vos commandes
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-600"
              >
                Créez un compte pour accéder à votre historique complet
              </BasicText>
            </div>
            <BasicButton
              label="Créer mon compte"
              type="primary"
              variant="filled"
              size="small"
              icon-name="ArrowRight"
              @click="router.push('/auth/register')"
            />
          </div>

          <!-- Actions -->
          <div class="result-actions">
            <BasicButton
              label="Nouvelle recherche"
              type="secondary"
              variant="outlined"
              width="full"
              @click="resetSearch"
            />
            <BasicButton
              label="Retour à la boutique"
              type="reverse"
              variant="ghost"
              width="full"
              @click="router.push('/')"
            />
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
  import type { OrdersFullView } from '@/supabase/types/supabase.types'
  import { getLabelBadge, getTypeBadge } from '@/utils'
  import BasicBadge from '@designSystem/components/basic/badge/BasicBadge.vue'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicInput from '@designSystem/components/basic/input/BasicInput.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()
  const toast = useToastStore()

  const loading = ref(false)
  const order = ref<OrdersFullView | null>(null)
  const errorMessage = ref('')
  const copied = ref(false)

  const form = ref({
    orderNumber: '',
    email: '',
  })

  const isShipped = computed(() => ['shipped', 'completed'].includes(order.value?.status || ''))

  onMounted(async () => {
    // 🆕 PRIORITÉ 1 : Tracking par token (URL de l'email)
    const token = route.query.token as string
    if (token) {
      await handleTokenTracking(token)
      return
    }

    // 🔙 FALLBACK : Tracking par email + ref (ancienne méthode)
    if (route.query.email && route.query.ref) {
      form.value.email = route.query.email as string
      form.value.orderNumber = route.query.ref as string
      await handleSearch()
    }
  })

  // 🆕 Nouvelle méthode : tracking sécurisé par token
  async function handleTokenTracking(token: string) {
    loading.value = true
    errorMessage.value = ''

    try {
      const data = await trackGuestOrderByToken(token)
      order.value = data
      console.log('✅ Commande trouvée via token')
    } catch (err: any) {
      console.error('❌ Erreur tracking token:', err)
      errorMessage.value = err.message || 'Lien de suivi invalide ou expiré.'
      order.value = null
    } finally {
      loading.value = false
    }
  }

  // 🔙 Ancienne méthode : fallback email + order_number
  async function handleSearch() {
    errorMessage.value = ''

    if (!form.value.email || !form.value.orderNumber) {
      errorMessage.value = 'Merci de remplir tous les champs.'
      return
    }

    loading.value = true
    try {
      const data = await trackGuestOrderByEmail(form.value.email, form.value.orderNumber)
      order.value = data
      console.log('✅ Commande trouvée via email/ref')
    } catch (err: any) {
      console.error('❌ Erreur tracking email:', err)
      errorMessage.value = err.message || 'Commande introuvable. Vérifiez vos informations.'
      order.value = null
    } finally {
      loading.value = false
    }
  }

  function resetSearch() {
    order.value = null
    errorMessage.value = ''
    form.value.orderNumber = ''
    form.value.email = ''
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
      toast.show('Numéro de suivi copié !', 'success')
      setTimeout(() => (copied.value = false), 2000)
    } catch (err) {
      console.error('Erreur copie:', err)
      toast.show('Impossible de copier', 'danger')
    }
  }
</script>

<style scoped lang="less">
  @import '@/assets/Mont/Mont.less';

  /* --- Layout Global --- */
  .track-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 30px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    background: radial-gradient(circle at top left, var(--primary-200), var(--primary-300));
  }

  /* Formes d'arrière-plan décoratives */
  .track-bg-shapes {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;

    .shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.5;
    }
    .shape-1 {
      top: -10%;
      left: -10%;
      width: 600px;
      height: 600px;
      background: rgba(var(--primary-200-rgb), 0.3);
    }
    .shape-2 {
      bottom: -10%;
      right: -10%;
      width: 500px;
      height: 500px;
      background: rgba(var(--secondary-200-rgb), 0.3);
    }
  }

  .track-container {
    width: 100%;
    max-width: 520px;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .card-wrapper {
    position: relative;
  }

  /* --- Header --- */
  .track-header {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    .icon-wrapper {
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      box-shadow:
        0 10px 25px -5px rgba(var(--primary-500-rgb), 0.15),
        0 4px 10px -2px rgba(0, 0, 0, 0.02);
      transform: rotate(-5deg);
      transition: transform 0.3s ease;

      &:hover {
        transform: rotate(0deg) scale(1.05);
      }
    }

    .track-title {
      margin-bottom: 12px;
    }
    .track-subtitle {
      max-width: 380px;
      line-height: 1.6;
    }
  }

  /* --- Error Toast (FLOTTANT) --- */
  .error-toast {
    position: absolute;
    top: -85px;
    left: 0;
    right: 0;
    z-index: 10;

    background: white;
    border-left: 4px solid @danger-500;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    box-shadow: 0 12px 30px -10px rgba(220, 38, 38, 0.2);

    .icon-error {
      margin-top: 2px;
    }
    .error-text {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 2px;
    }
    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      opacity: 0.5;
      transition: opacity 0.2s;
      &:hover {
        opacity: 1;
      }
    }
  }

  /* --- Carte Principale --- */
  .track-card {
    background: white;
    padding: 40px;
    border-radius: 32px;
    box-shadow:
      0 20px 40px -10px rgba(0, 0, 0, 0.06),
      0 0 0 1px rgba(0, 0, 0, 0.01);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
    }
  }

  .form-content {
    display: flex;
    flex-direction: column;
    gap: 32px;

    .inputs-wrapper {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }

  .search-btn {
    height: 54px;
    box-shadow: 0 8px 20px -4px rgba(var(--primary-500-rgb), 0.3);
    transition: all 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px -6px rgba(var(--primary-500-rgb), 0.4);
    }
  }

  /* --- Result Card Specifics --- */
  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
    padding-bottom: 20px;
    border-bottom: 1px solid @neutral-100;

    .header-left {
      display: flex;
      flex-direction: column;
    }
  }

  /* Timeline Moderne */
  .timeline-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
    position: relative;
    padding: 20px;
    border-radius: 16px;
    background-color: @neutral-200;
  }

  .timeline-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 2;
    min-width: 80px;

    .step-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: @neutral-100;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: @neutral-400;
      }
    }

    &.active {
      .step-icon {
        background: var(--primary-500);
        box-shadow: 0 0 0 6px var(--primary-50);
        transform: scale(1.1);
      }
    }
  }

  .step-line {
    flex: 1;
    height: 3px;
    background: @neutral-100;
    margin: 0 -20px;
    margin-bottom: 46px;
    position: relative;
    z-index: 1;
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

  /* Details Grid */
  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 32px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .detail-box {
    background: @neutral-200;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    transition: all 0.2s;

    &:hover {
      background: @neutral-100;
      transform: translateY(-2px);
    }

    .box-icon {
      background: white;
      padding: 10px;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    }

    .box-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }
  }

  .tracking-box {
    background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
    border: 1px solid var(--primary-200);
  }

  .tracking-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: white;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid @neutral-200;
    margin-top: 6px;
    cursor: pointer;
    transition: all 0.2s;
    max-width: fit-content;

    &:hover {
      border-color: var(--primary-300);
      background: var(--primary-50);
      transform: translateY(-1px);
    }
  }

  /* Articles */
  .items-section {
    padding: 20px;
    background: @neutral-50;
    border-radius: 16px;
    margin-bottom: 20px;
  }

  .order-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .order-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    background: white;
    border-radius: 10px;
    border: 1px solid @neutral-200;
    transition: all 0.2s;

    &:hover {
      border-color: var(--primary-200);
      transform: translateX(4px);
    }

    &__img {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
      border: 1px solid @neutral-100;
    }

    &__info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  }

  /* Totaux */
  .totals-section {
    background: @neutral-100;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;

    &.discount {
      background: @success-50;
      padding: 8px 12px;
      border-radius: 8px;
      margin: 4px 0;
    }

    &.total {
      margin-top: 8px;
      padding-top: 16px;
      border-top: 2px solid @neutral-300;
    }
  }

  .total-divider {
    height: 1px;
    background: @neutral-300;
    margin: 8px 0;
  }

  /* CTA Conversion Guest */
  .conversion-cta {
    margin-top: 24px;
    padding: 20px;
    background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
    border-radius: 16px;
    border: 1px solid var(--primary-200);
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px -4px rgba(var(--primary-500-rgb), 0.2);
    }

    .cta-icon {
      width: 40px;
      height: 40px;
      background: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .cta-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }

  /* Actions */
  .result-actions {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Utilitaires */
  .uppercase {
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .text-center {
    text-align: center;
  }
  .mb-1 {
    margin-bottom: 4px;
  }
  .mb-3 {
    margin-bottom: 12px;
  }
  .mono {
    font-family: 'Courier New', monospace;
  }

  /* Transitions */
  .pop-down-enter-active,
  .pop-down-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .pop-down-enter-from,
  .pop-down-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }

  /* Responsive */
  @media (max-width: 600px) {
    .track-page {
      padding: 20px 16px;
    }

    .track-container {
      gap: 30px;
    }

    .track-header {
      .icon-wrapper {
        width: 64px;
        height: 64px;
      }
    }

    .track-card {
      padding: 24px;
    }

    .order-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      &__img {
        width: 60px;
        height: 60px;
      }
    }

    .conversion-cta {
      flex-direction: column;
      text-align: center;

      .cta-content {
        align-items: center;
      }
    }
  }
</style>
