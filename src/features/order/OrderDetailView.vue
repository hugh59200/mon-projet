<template>
  <div class="order-detail">
    <PremiumButton
      label="← Retour à mes commandes"
      type="secondary"
      variant="ghost"
      size="sm"
      class="order-detail__back"
      @click="$router.push('/profil/commandes')"
    />

    <WrapperLoader
      :loading="!hasLoaded"
      message="Chargement de la commande..."
    />

    <template v-if="hasLoaded && order">
      <ContentBlock
        variant="card"
        size="lg"
        class="order-detail__header"
        v-motion="{
          initial: { opacity: 0, y: -20 },
          enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90 } },
        }"
      >
        <div class="order-detail__header-left">
          <BasicText
            size="h4"
            weight="bold"
            class="order-detail__header-title"
          >
            Commande du {{ formatDate(order.created_at) }}
          </BasicText>
          <BasicText
            size="body-m"
            color="neutral-500"
          >
            N° {{ (order.order_number ?? order.order_id)?.slice(0, 15) }}
          </BasicText>
        </div>
        <div class="order-detail__header-right">
          <BasicBadge
            :label="getLabelBadge(order.status)"
            :type="getTypeBadge(order.status)"
          />
        </div>
      </ContentBlock>

      <ContentBlock
        v-if="order.status"
        variant="card"
        size="md"
        class="order-detail__section order-detail__section--tracking"
      >
        <BasicText
          size="h5"
          weight="semibold"
          class="order-detail__section-title"
        >
          Suivi de la commande
        </BasicText>

        <div class="order-detail__timeline">
          <template
            v-for="(step, index) in TIMELINE_STEPS"
            :key="step.key"
          >
            <div
              class="order-detail__timeline-step"
              :class="{ 'order-detail__timeline-step--active': isStepActive(step.statuses) }"
            >
              <div class="order-detail__timeline-dot">
                <BasicIconNext
                  v-if="isStepActive(step.statuses)"
                  :name="step.icon as IconNameNext"
                  :size="12"
                  color="white"
                />
                <div
                  v-else
                  class="dot-inner"
                ></div>
              </div>
              <BasicText
                size="body-s"
                :color="isStepActive(step.statuses) ? 'neutral-900' : 'neutral-500'"
                :weight="isStepActive(step.statuses) ? 'bold' : 'regular'"
                class="order-detail__timeline-label"
              >
                {{ step.label }}
              </BasicText>
              <BasicText
                v-if="step.dateField && (order as any)[step.dateField]"
                size="body-s"
                color="neutral-400"
                class="mt-1"
              >
                {{ formatDate((order as any)[step.dateField] as string) }}
              </BasicText>
            </div>

            <div
              v-if="index < TIMELINE_STEPS.length - 1"
              class="order-detail__timeline-line"
              :class="{ 'order-detail__timeline-line--active': isLineActive(index) }"
            ></div>
          </template>
        </div>

        <div class="order-detail__tracking-actions">
          <PremiumButton
            v-if="order.tracking_number"
            label="Suivre le colis"
            type="primary"
            variant="solid"
            size="sm"
            icon-left="Truck"
            @click="trackPackage(order.tracking_number)"
          />
          <PremiumButton
            label="Contacter le support"
            type="secondary"
            variant="outline"
            size="sm"
            icon-left="MessageSquare"
            @click="contactSupport"
          />
        </div>
      </ContentBlock>

      <div class="order-detail__grid">
        <ContentBlock variant="card" size="md" class="order-detail__section order-detail__section--items">
          <BasicText
            size="h5"
            weight="semibold"
            class="order-detail__section-title"
          >
            Détails des produits
          </BasicText>
          <div class="order-detail__items">
            <div
              v-for="(item, i) in getItems(order as any)"
              :key="i"
              class="order-detail__item"
            >
              <img
                :src="item.product_image || defaultImage"
                alt="Produit"
                class="order-detail__item-img"
              />
              <div class="order-detail__item-info">
                <BasicText
                  size="body-m"
                  weight="semibold"
                  color="neutral-900"
                >
                  {{ item.product_name }}
                </BasicText>

                <BasicText
                  v-if="item.product_dosage && !item.product_name.includes(item.product_dosage)"
                  size="body-s"
                  color="primary-700"
                  weight="semibold"
                >
                  Dosage : {{ item.product_dosage }}
                </BasicText>

                <BasicText
                  size="body-s"
                  color="neutral-500"
                >
                  Quantité : {{ item.quantity }}
                </BasicText>
              </div>
              <div class="order-detail__item-actions">
                <BasicText
                  size="body-m"
                  weight="bold"
                  color="primary-700"
                >
                  {{ formatPrice(item.total) }}
                </BasicText>
                <PremiumButton
                  label="Recommander"
                  type="secondary"
                  variant="outline"
                  size="xs"
                  icon-left="RefreshCw"
                  class="order-detail__reorder-btn"
                  @click.stop="reorderItem(item)"
                />
              </div>
            </div>
          </div>
        </ContentBlock>

        <div class="order-detail__col-right">
          <ContentBlock variant="card" size="md" class="order-detail__section">
            <BasicText
              size="h5"
              weight="semibold"
              class="order-detail__section-title"
            >
              Informations de livraison
            </BasicText>

            <div class="order-detail__address">
              <BasicText
                size="body-m"
                weight="semibold"
                color="neutral-900"
              >
                {{ order.shipping_name }}
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-700"
              >
                {{ order.shipping_address }}
                <br />
                {{ order.shipping_zip }} {{ order.shipping_city }}
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-700"
              >
                {{ order.shipping_country }}
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-600"
                style="margin-top: 8px"
              >
                Transporteur:
                <strong>{{ order.carrier ?? 'Standard' }}</strong>
              </BasicText>
            </div>
          </ContentBlock>

          <ContentBlock variant="info" size="md" class="order-detail__section order-detail__section--summary">
            <BasicText
              size="h5"
              weight="semibold"
              class="order-detail__section-title"
            >
              Paiement & Total
            </BasicText>
            <div class="order-detail__summary">
              <div class="order-detail__summary-line">
                <span>Sous-total</span>
                <span>{{ formatPrice(order.subtotal) }}</span>
              </div>

              <div class="order-detail__summary-line">
                <span>Frais de port</span>
                <span>
                  {{
                    (order.shipping_cost ?? 0) > 0 ? formatPrice(order.shipping_cost) : 'Offerts'
                  }}
                </span>
              </div>

              <div
                v-if="(order.tax_amount ?? 0) > 0"
                class="order-detail__summary-line"
              >
                <span>TVA</span>
                <span>{{ formatPrice(order.tax_amount) }}</span>
              </div>

              <div
                v-if="(order.discount_amount ?? 0) > 0"
                class="order-detail__summary-line"
              >
                <span style="color: var(--success-600)">Remise</span>
                <span style="color: var(--success-600)">
                  -{{ formatPrice(order.discount_amount) }}
                </span>
              </div>

              <div class="order-detail__summary-line order-detail__summary-line--total">
                <span>Total TTC</span>
                <strong>{{ formatPrice(order.total_amount) }}</strong>
              </div>

              <div class="order-detail__summary-line order-detail__summary-line--payment">
                <span>Méthode de paiement</span>
                <BasicBadge
                  :label="order.payment_method ?? 'CB'"
                  type="info"
                  size="small"
                />
              </div>
            </div>
          </ContentBlock>
        </div>
      </div>
    </template>

    <ContentBlock
      v-else-if="hasLoaded && !order"
      variant="card"
      size="lg"
      class="order-detail__empty-state"
    >
      <BasicText
        size="body-m"
        color="neutral-600"
      >
        Cette commande est introuvable ou n'existe plus.
      </BasicText>
      <PremiumButton
        label="Retour à mes commandes"
        type="primary"
        variant="solid"
        size="sm"
        @click="$router.push('/profil/commandes')"
      />
    </ContentBlock>
  </div>
</template>

<script setup lang="ts">
  import { DEFAULT_PRODUCT_IMAGE as defaultImage } from '@/config/productAssets'
  import { fetchOrderById } from '@/api/supabase/orders'
  import type { OrderItemDetailed, OrdersFullView } from '@/supabase/types/supabase.types'
  import { getLabelBadge, getTypeBadge } from '@/utils'
  import { formatDate } from '@/utils/index'
  import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const toast = useToastStore()
  const cart = useCartStore()

  const order = ref<OrdersFullView | null>(null)
  const hasLoaded = ref(false)

  // ✅ Définition du type pour un Step de timeline
  // Cela permet à TypeScript de comprendre que dateField est une clé valide de OrdersFullView
  type TimelineStep = {
    key: string
    label: string
    icon: string
    statuses: string[]
    dateField: keyof OrdersFullView | null
  }

  // 🆕 CONFIGURATION DE LA TIMELINE (Typée)
  const TIMELINE_STEPS: TimelineStep[] = [
    {
      key: 'step1',
      label: 'Validée',
      icon: 'Check',
      statuses: ['paid', 'confirmed', 'processing', 'shipped', 'completed'],
      dateField: 'created_at',
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

  // Helper pour savoir si la ligne suivante doit être colorée
  function isLineActive(index: number) {
    const nextStep = TIMELINE_STEPS[index + 1]
    if (!nextStep) return false
    return isStepActive(nextStep.statuses)
  }

  async function loadOrderDetail() {
    try {
      const orderId = String(route.params.id ?? '')
      if (!orderId) return

      const data = await fetchOrderById(orderId)

      if (data) {
        order.value = data
      }
    } catch (e) {
      console.error(e)
      toast.show('Erreur lors du chargement de la commande', 'danger')
    } finally {
      hasLoaded.value = true
    }
  }

  onMounted(loadOrderDetail)

  function getItems(order: OrdersFullView): OrderItemDetailed[] {
    return (order.detailed_items as unknown as OrderItemDetailed[]) || []
  }

  function formatPrice(value: number | null | undefined) {
    if (value == null || isNaN(Number(value))) return '0,00 €'
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
      Number(value),
    )
  }

  function trackPackage(tracking: string) {
    window.open(`https://www.laposte.fr/outils/suivre-vos-envois?code=${tracking}`, '_blank')
  }

  function contactSupport() {
    toast.show('Ouverture de la messagerie pour le support...', 'info')
  }

  async function reorderItem(item: OrderItemDetailed) {
    const { fetchProductById } = await import('@/api/supabase/products')
    const product = await fetchProductById(item.product_id)
    if (product) {
      cart.addToCart(product)
      toast.show('Produit ajouté au panier', 'success')
    } else {
      toast.show('Produit non disponible', 'danger')
    }
  }
</script>

<style scoped lang="less">
  .order-detail {
    max-width: 1000px;
    margin: 60px auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 25px;

    @shadow-light: 0 4px 12px rgba(0, 0, 0, 0.05);
    @shadow-medium: 0 8px 20px rgba(0, 0, 0, 0.1);

    &__back {
      align-self: flex-start;
      margin-bottom: 8px;
    }

    /* HEADER */
    &__header {
      // Styles de base gérés par ContentBlock
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;

      &-left {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      &-title {
        color: @neutral-900;
      }
    }

    /* GRID */
    &__grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 25px;
    }

    &__col-right {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    /* SECTIONS */
    &__section {
      // Styles de base gérés par ContentBlock
      display: flex;
      flex-direction: column;
      gap: 16px;

      &-title {
        color: @neutral-900;
        border-bottom: 1px solid @neutral-100;
        padding-bottom: 10px;
        margin-bottom: 4px;
      }
    }

    /* ITEMS */
    &__items {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid @neutral-100;

      &:last-child {
        border-bottom: none;
      }

      &-img {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        object-fit: cover;
        border: 1px solid @neutral-200;
        flex-shrink: 0;
      }

      &-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
      }

      &-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
      }
    }

    &__reorder-btn {
      white-space: nowrap;
    }

    /* SUMMARY */
    &__summary {
      display: flex;
      flex-direction: column;
      gap: 10px;

      &-line {
        display: flex;
        justify-content: space-between;
        font-size: 15px;
        color: @neutral-700;

        &--total {
          padding-top: 10px;
          margin-top: 10px;
          border-top: 2px dashed var(--primary-200);
          font-size: 18px;
          color: @neutral-900;

          strong {
            color: var(--primary-700);
            font-weight: 700;
          }
        }
        &--payment {
          span {
            color: @neutral-600;
            font-size: 14px;
          }
        }
      }
    }

    /* 🆕 TIMELINE STYLE - Horizontal Only */
    &__timeline {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      padding: 10px 0 20px 0;
      margin-top: 10px;
    }

    &__timeline-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 2;
      min-width: 80px;
      text-align: center;
      flex: 1; /* Distribue l'espace équitablement */
    }

    &__timeline-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: @white;
      border: 4px solid @neutral-200;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
      transition: all 0.3s ease;

      .dot-inner {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: @neutral-300;
      }
    }

    /* État Actif */
    &__timeline-step--active {
      .order-detail__timeline-dot {
        background: var(--primary-500);
        border-color: var(--primary-500);
        box-shadow: 0 0 0 4px var(--primary-50);
      }
    }

    /* Correction Ligne : */
    &__timeline-line {
      /* Pour simplifier : On utilise une ligne flex entre les items */
      flex-grow: 1;
      height: 4px;
      background: @neutral-200;
      margin-top: 10px; /* Aligné avec le centre des dots */
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 0%;
        background: var(--primary-500);
        transition: width 0.5s ease;
      }

      &--active::after {
        width: 100%;
      }
    }

    &__tracking-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      padding-top: 10px;
      border-top: 1px solid @neutral-100;
    }

    &__address {
      line-height: 1.5;
      color: @neutral-700;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__empty-state {
      // Styles de base gérés par ContentBlock
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    /* RESPONSIVE - Tablet (≤ 1160px) */
    .respond-tablet({
      &__grid {
        grid-template-columns: 1fr;
      }
    });

    /* RESPONSIVE - Mobile (≤ 720px) */
    .respond-mobile({
      &__header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      &__item {
        flex-wrap: wrap;

        &-img {
          width: 56px;
          height: 56px;
        }

        &-info {
          min-width: 150px;
        }
      }

      /* Timeline mobile adaptation */
      &__timeline-label {
        font-size: 11px;
      }
    });
  }
</style>
