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
                placeholder="Ex: FP-2025-XXXXXX"
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
          class="track-card result-card"
          v-motion-fade
        >
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

          <div class="details-grid">
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

            <div
              v-if="order.tracking_number"
              class="detail-box"
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
                  Suivi
                </BasicText>
                <BasicText
                  size="body-m"
                  weight="bold"
                  color="neutral-900"
                >
                  {{ order.carrier || 'Standard' }}
                </BasicText>
                <div class="tracking-pill">
                  <BasicText
                    size="body-s"
                    color="neutral-700"
                    class="mono"
                  >
                    {{ order.tracking_number }}
                  </BasicText>
                  <BasicIconNext
                    name="Copy"
                    :size="12"
                    color="neutral-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="result-actions">
            <BasicButton
              label="Nouvelle recherche"
              @click="resetSearch"
              width="full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { trackGuestOrderByEmail, trackGuestOrderByToken } from '@/supabase/api/ordersApi'
  import { getLabelBadge, getTypeBadge } from '@/utils'
  import BasicBadge from '@designSystem/components/basic/badge/BasicBadge.vue'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicInput from '@designSystem/components/basic/input/BasicInput.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const loading = ref(false)
  const order = ref<any | null>(null)
  const errorMessage = ref('')

  const form = ref({
    orderNumber: '',
    email: '',
  })

  const isShipped = computed(() => ['shipped', 'completed'].includes(order.value?.status))

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
    } catch (err: any) {
      console.error(err)
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
    } catch (err: any) {
      console.error(err)
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

  function formatDate(date: string) {
    if (!date) return ''
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    })
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

  /* Formes d'arrière plan décoratives (floues) */
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

  /* --- Carte Principale (Design Clean) --- */
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
    transition: background 0.2s;

    .box-icon {
      background: white;
      padding: 10px;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    }

    .box-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
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
    transition: border-color 0.2s;
  }

  /* Utilitaire interne */
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
</style>
