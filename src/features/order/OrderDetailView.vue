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
            N° {{ (order.order_id ?? '').slice(0, 8).toUpperCase() }}
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
                  index <= orderSteps.findIndex((s) => s.key === mapStatus(order?.status!)),
              },
            ]"
          >
            <div class="order-detail__timeline-dot">
              <BasicIconNext
                v-if="index <= orderSteps.findIndex((s) => s.key === mapStatus(order?.status!))"
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
              v-for="(item, i) in order.detailed_items ?? []"
              :key="i"
              class="order-detail__item"
            >
              <img
                :src="item.image || defaultImage"
                alt="Produit"
                class="order-detail__item-img"
              />
              <div class="order-detail__item-info">
                <BasicText
                  size="body-m"
                  weight="semibold"
                  color="neutral-900"
                >
                  {{ item.name }}
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
                {{ formatPrice(item.price) }}
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
                {{ order.full_name }}
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-700"
              >
                {{ order.address }} {{ order.city ? `, ${order.city}` : '' }} {{ order.zip }}
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-700"
              >
                {{ order.country }}
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-600"
              >
                Transporteur: **{{ order.carrier ?? '—' }}**
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
                <span>{{ formatPrice(order.total_amount! - order.shipping_cost!) }}</span>
              </div>
              <div class="order-detail__summary-line">
                <span>Frais de port</span>
                <span>{{ formatPrice(order.shipping_cost!) }}</span>
              </div>
              <div class="order-detail__summary-line order-detail__summary-line--total">
                <span>Total TTC</span>
                <strong>{{ formatPrice(order.total_amount!) }}</strong>
              </div>
              <div class="order-detail__summary-line order-detail__summary-line--payment">
                <span>Méthode de paiement</span>
                <BasicBadge
                  :label="order.payment_method ?? 'Non spécifié'"
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
  import { supabase } from '@/supabase/supabaseClient'
  import type { Database } from '@/supabase/types/supabase'
  // Importation des types de la BDD pour une meilleure complétion
  import { getLabelBadge, getTypeBadge } from '@/utils'
  import { formatDate } from '@/utils/index'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  // 💡 Typage de la vue détaillé (basé sur votre export orders_detailed_view)
  type OrderItem = {
    name: string
    quantity: number
    price: number
    image?: string | null
  }

  type OrderDetailedView = Omit<
    Database['public']['Views']['orders_detailed_view']['Row'],
    'detailed_items'
  > & {
    // ✅ Ajout temporaire ou permanent de la colonne manquante pour le typage
    shipping_cost: number | null
    detailed_items: OrderItem[]
  }

  const route = useRoute()
  const toast = useToastStore()

  const order = ref<OrderDetailedView | null>(null)
  const hasLoaded = ref(false)

  // 💡 CONSTANTE À UTILISER EN ATTENDANT LA BDD (par exemple, 5.00 €)
  const DEFAULT_SHIPPING_COST = 5.0

  async function loadOrderDetail() {
    try {
      const orderId = String(route.params.id ?? '')

      // La vue orders_detailed_view n'a pas encore shipping_cost,
      // mais nous allons la charger et l'ajouter manuellement dans l'objet.
      const { data, error } = (await supabase
        .from('orders_detailed_view')
        .select('*')
        .eq('order_id', orderId)
        .single()) as { data: Omit<OrderDetailedView, 'shipping_cost'> | null; error: any }

      if (error) throw error

      if (data) {
        // Hydratation de la propriété shipping_cost.
        // Si elle venait de la BDD un jour, elle serait ici.
        // En attendant, nous l'ajoutons manuellement pour l'affichage.
        order.value = {
          ...data,
          // Si la colonne est ajoutée plus tard, elle sera null ici. On utilise la constante.
          // S'il existe un champ 'shipping_cost' dans la vue, il sera prioritaire.
          shipping_cost: (data as any).shipping_cost ?? DEFAULT_SHIPPING_COST,
        } as OrderDetailedView
      }
    } catch {
      toast.show('Erreur lors du chargement de la commande', 'danger')
    } finally {
      hasLoaded.value = true
    }
  }

  onMounted(loadOrderDetail)

  const orderSteps = [
    { key: 'paid', label: 'Commande Confirmée' },
    { key: 'processing', label: 'En préparation' },
    { key: 'shipped', label: 'Expédiée' },
    { key: 'completed', label: 'Livrée' },
  ]

  function mapStatus(status: string | null) {
    if (!status) return 'paid'
    if (['pending', 'paid'].includes(status)) return 'paid'
    return status
  }

  function formatPrice(value: number | null | undefined) {
    if (value == null || isNaN(Number(value))) return '0,00 €'
    return `${Number(value).toFixed(2).replace('.', ',')} €`
  }

  function trackPackage(tracking: string) {
    window.open(`https://www.laposte.fr/outils/suivre-vos-envois?code=${tracking}`, '_blank')
  }

  function contactSupport() {
    toast.show('Ouverture de la messagerie pour le support...', 'info')
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

    /* -----------------------------
    HEADER
    ----------------------------- */
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

    /* -----------------------------
    GRILLE PRODUITS / RÉCAP
    ----------------------------- */
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

    /* -----------------------------
    SECTIONS (Cartes)
    ----------------------------- */
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

    /* -----------------------------
    PRODUITS
    ----------------------------- */
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

    /* -----------------------------
    RÉCAPITULATIF
    ----------------------------- */
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

    /* -----------------------------
    TIMELINE (Suivi) - Rendu plus moderne
    ----------------------------- */
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

    /* --- Media Queries --- */
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
