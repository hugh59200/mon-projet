<template>
  <div class="order-detail">
    <BasicButton
      label="← Retour à mes commandes"
      type="secondary"
      variant="ghost"
      size="small"
      class="order-detail__back"
      @click="$router.push('/profil/commandes')"
    />

    <WrapperLoader
      :loading="!hasLoaded"
      message="Chargement de la commande..."
    />

    <template v-if="hasLoaded && order">
      <div
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
      </div>

      <div
        v-if="order.status"
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
          <div
            v-for="(step, index) in orderSteps"
            :key="step.key"
            :class="[
              'order-detail__timeline-step',
              {
                'order-detail__timeline-step--active':
                  index <= orderSteps.findIndex((s) => s.key === mapStatus(order?.status)),
              },
            ]"
          >
            <div class="order-detail__timeline-dot">
              <BasicIconNext
                v-if="index <= orderSteps.findIndex((s) => s.key === mapStatus(order?.status))"
                name="Check"
                :size="10"
                color="white"
              />
            </div>
            <BasicText
              size="body-s"
              color="neutral-600"
              class="order-detail__timeline-label"
            >
              {{ step.label }}
            </BasicText>
          </div>
        </div>

        <div class="order-detail__tracking-actions">
          <BasicButton
            v-if="order.tracking_number"
            label="Suivre le colis"
            type="primary"
            variant="filled"
            size="small"
            icon-left="Truck"
            @click="trackPackage(order.tracking_number)"
          />
          <BasicButton
            label="Contacter le support"
            type="secondary"
            variant="outlined"
            size="small"
            icon-left="MessageSquare"
            @click="contactSupport"
          />
        </div>
      </div>

      <div class="order-detail__grid">
        <div class="order-detail__section order-detail__section--items">
          <BasicText
            size="h5"
            weight="semibold"
            class="order-detail__section-title"
          >
            Détails des produits
          </BasicText>
          <div class="order-detail__items">
            <div
              v-for="(item, i) in getItems(order)"
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
                  size="body-s"
                  color="neutral-500"
                >
                  Quantité : {{ item.quantity }}
                </BasicText>
              </div>
              <BasicText
                size="body-m"
                weight="bold"
                color="primary-700"
              >
                {{ formatPrice(item.total) }}
              </BasicText>
            </div>
          </div>
        </div>

        <div class="order-detail__col-right">
          <div class="order-detail__section">
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
          </div>

          <div class="order-detail__section order-detail__section--summary">
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
          </div>
        </div>
      </div>
    </template>

    <div
      v-else-if="hasLoaded && !order"
      class="order-detail__empty-state"
    >
      <BasicText
        size="body-m"
        color="neutral-600"
      >
        Cette commande est introuvable ou n’existe plus.
      </BasicText>
      <BasicButton
        label="Retour à mes commandes"
        type="primary"
        variant="filled"
        size="small"
        @click="$router.push('/profil/commandes')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { fetchOrderById } from '@/supabase/api/ordersApi'
  import type { OrderItemDetailed, OrdersFullView } from '@/supabase/types/supabase.types'
  import { getLabelBadge, getTypeBadge } from '@/utils'
  import { formatDate } from '@/utils/index'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const toast = useToastStore()

  // ✅ On utilise le type correct généré par Supabase
  const order = ref<OrdersFullView | null>(null)
  const hasLoaded = ref(false)

  async function loadOrderDetail() {
    try {
      const orderId = String(route.params.id ?? '')
      if (!orderId) return

      // ✅ Appel propre à l'API centralisée
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

  // Helper pour récupérer les items typés depuis le JSON
  function getItems(order: OrdersFullView): OrderItemDetailed[] {
    return (order.detailed_items as unknown as OrderItemDetailed[]) || []
  }

  const orderSteps = [
    { key: 'paid', label: 'Commande Confirmée' },
    { key: 'processing', label: 'En préparation' },
    { key: 'shipped', label: 'Expédiée' },
    { key: 'completed', label: 'Livrée' },
  ]

  function mapStatus(status: string | null | undefined) {
    if (!status) return 'paid'
    if (['pending', 'paid'].includes(status)) return 'paid'
    return status
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
</script>

<style scoped lang="less">
  /* Je n'ai pas touché au CSS pour garder ton design intact */
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
      background: @white;
      border: 1px solid @neutral-100;
      border-radius: 16px;
      padding: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      box-shadow: @shadow-medium;

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
      background: @white;
      border: 1px solid @neutral-100;
      border-radius: 16px;
      padding: 20px;
      box-shadow: @shadow-light;
      display: flex;
      flex-direction: column;
      gap: 16px;

      &-title {
        color: @neutral-900;
        border-bottom: 1px solid @neutral-100;
        padding-bottom: 10px;
        margin-bottom: 4px;
      }

      &--summary {
        background: color-mix(in srgb, var(--primary-50) 80%, @white);
        border-color: var(--primary-100);
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

    /* TIMELINE */
    &__timeline {
      display: flex;
      justify-content: space-between;
      position: relative;
      padding: 15px 0 25px 0;

      &:before {
        content: '';
        position: absolute;
        top: 10px;
        left: 0;
        right: 0;
        height: 4px;
        background: @neutral-200;
        z-index: 1;
      }

      &-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: 10px;
          left: -50%;
          height: 4px;
          width: 100%;
          background: transparent;
          z-index: 2;
          transition: background 0.4s ease;
        }

        &:first-child::before {
          content: none;
        }

        &--active {
          color: var(--primary-700);

          &:not(:first-child)::before {
            background: var(--primary-500);
          }

          .order-detail__timeline-dot {
            background: var(--primary-500);
            border-color: var(--primary-500);
            box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary-500) 20%, transparent);
          }
          .order-detail__timeline-label {
            color: @neutral-900;
            font-weight: 600;
          }
        }
      }

      &-dot {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: @white;
        border: 4px solid @neutral-300;
        margin-bottom: 8px;
        position: relative;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.4s ease;
      }

      &-label {
        text-align: center;
        max-width: 80px;
        color: @neutral-600;
        transition: color 0.4s ease;
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
      text-align: center;
      padding: 60px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    /* MEDIA QUERIES */
    @media (max-width: 900px) {
      &__grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      &__header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        padding: 20px;
      }

      &__section {
        padding: 16px;
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

      &__timeline {
        padding: 10px 0 20px 0;
      }

      &__timeline-step {
        max-width: 70px;
      }
      &__timeline-label {
        font-size: 12px;
      }
    }
  }
</style>
