<template>
  <div class="order-detail">
    <!-- 🧭 Retour -->
    <BasicButton
      label="← Retour à mes commandes"
      type="secondary"
      variant="ghost"
      size="small"
      class="order-detail__back"
      @click="$router.push('/profil/commandes')"
    />

    <!-- 🧾 Loader -->
    <WrapperLoader
      :loading="!hasLoaded"
      message="Chargement de la commande..."
    />

    <!-- ✅ Contenu principal -->
    <template v-if="hasLoaded && order">
      <!-- 🧾 En-tête commande -->
      <div
        class="order-header"
        v-motion="{
          initial: { opacity: 0, y: -20 },
          enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90 } },
        }"
      >
        <div class="order-header__left">
          <BasicText
            size="h4"
            weight="bold"
            class="order-header__title"
          >
            Commande du {{ formatDate(order.created_at) }}
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-600"
          >
            N° {{ (order.order_id ?? '').slice(0, 8).toUpperCase() }}
          </BasicText>
        </div>
        <div class="order-header__right">
          <BasicBadge
            :label="getLabelBadge(order.status)"
            :type="getTypeBadge(order.status)"
          />
        </div>
      </div>

      <!-- 🧩 Produits -->
      <div class="order-section">
        <BasicText
          size="h5"
          weight="semibold"
          class="order-section__title"
        >
          Produits
        </BasicText>
        <div class="order-items">
          <div
            v-for="(item, i) in order.detailed_items ?? []"
            :key="i"
            class="order-item"
          >
            <img
              :src="item.image || defaultImage"
              alt="Produit"
              class="order-item__img"
            />
            <div class="order-item__info">
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

      <!-- 💰 Récapitulatif -->
      <div class="order-section">
        <BasicText
          size="h5"
          weight="semibold"
          class="order-section__title"
        >
          Récapitulatif
        </BasicText>
        <div class="order-summary">
          <div class="summary-line">
            <span>Total</span>
            <strong>{{ formatPrice(order.total_amount) }}</strong>
          </div>
          <div class="summary-line">
            <span>Méthode de paiement</span>
            <span>{{ order.payment_method ?? '—' }}</span>
          </div>
          <div class="summary-line">
            <span>Transporteur</span>
            <span>{{ order.carrier ?? '—' }}</span>
          </div>
        </div>
      </div>
      <!-- 📦 Livraison -->
      <div class="order-section">
        <BasicText
          size="h5"
          weight="semibold"
          class="order-section__title"
        >
          Informations de livraison
        </BasicText>
        <div class="order-address">
          <BasicText
            size="body-s"
            color="neutral-800"
          >
            {{ order.full_name }}
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-700"
          >
            {{ order.address }} {{ order.city ? `, ${order.city}` : '' }}
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-700"
          >
            {{ order.country }}
          </BasicText>
          <BasicText
            v-if="order.tracking_number"
            size="body-s"
            color="neutral-600"
          >
            Numéro de suivi : {{ order.tracking_number }}
          </BasicText>
        </div>
      </div>

      <!-- 🚚 Suivi -->
      <div
        v-if="order.status"
        class="order-section"
      >
        <BasicText
          size="h5"
          weight="semibold"
          class="order-section__title"
        >
          Suivi de la commande
        </BasicText>
        <div class="order-timeline">
          <div
            v-for="step in orderSteps"
            :key="step.key"
            class="timeline-step"
            :class="{ active: step.key === mapStatus(order.status) }"
          >
            <div class="dot"></div>
            <BasicText
              size="body-s"
              color="neutral-600"
              class="label"
            >
              {{ step.label }}
            </BasicText>
          </div>
        </div>

        <div class="tracking-actions">
          <BasicButton
            v-if="order.tracking_number"
            label="Suivre le colis"
            type="primary"
            variant="filled"
            size="small"
            @click="trackPackage(order.tracking_number)"
          />
          <!-- 👇 Support client (future évolution) -->
          <BasicButton
            v-if="false"
            label="Contacter le support"
            type="secondary"
            variant="outlined"
            size="small"
            icon="MessageSquare"
            @click="contactSupport"
          />
        </div>
      </div>
    </template>

    <!-- 🚫 Si commande introuvable -->
    <div
      v-else-if="hasLoaded && !order"
      class="empty-state"
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
  import type { OrderDetailedView } from '@/supabase/types/supabase.types'
  import { getLabelBadge, getTypeBadge } from '@/utils'
  import { formatDate } from '@/utils/index'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const toast = useToastStore()

  const order = ref<OrderDetailedView | null>(null)
  const hasLoaded = ref(false)

  async function loadOrderDetail() {
    try {
      const orderId = String(route.params.id ?? '')
      const { data, error } = await supabase
        .from('orders_detailed_view')
        .select('*')
        .eq('order_id', orderId)
        .single<OrderDetailedView>() // ✅ typage strict ici

      if (error) throw error
      order.value = data
    } catch {
      toast.show('Erreur lors du chargement de la commande', 'danger')
    } finally {
      hasLoaded.value = true
    }
  }

  onMounted(loadOrderDetail)

  const orderSteps = [
    { key: 'paid', label: 'Payée' },
    { key: 'shipped', label: 'Expédiée' },
    { key: 'completed', label: 'Livrée' },
  ]

  function mapStatus(status: string | null) {
    if (!status) return 'pending'
    if (['pending', 'paid'].includes(status)) return 'paid'
    return status
  }

  function formatPrice(value: number | null | undefined) {
    if (value == null || isNaN(Number(value))) return '—'
    return `${Number(value).toFixed(2)} €`
  }

  function trackPackage(tracking: string) {
    window.open(`https://www.laposte.fr/outils/suivre-vos-envois?code=${tracking}`, '_blank')
  }

  function contactSupport() {
    toast.show('Le support client sera disponible prochainement', 'info')
  }
</script>

<style scoped lang="less">
  .order-detail {
    max-width: 850px;
    margin: 60px auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 32px;

    &__back {
      align-self: flex-start;
      margin-bottom: 8px;
    }

    .order-header {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 14px;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      box-shadow: 0 2px 6px fade(@neutral-400, 8%);

      &__title {
        margin-bottom: 2px;
        color: @neutral-900;
      }

      &__right {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }
    }

    .order-section {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 5px fade(@neutral-400, 6%);
      display: flex;
      flex-direction: column;
      gap: 14px;

      &__title {
        color: @neutral-900;
      }
    }

    .order-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .order-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      border-bottom: 1px solid fade(@neutral-200, 60%);
      padding-bottom: 8px;

      &:last-child {
        border-bottom: none;
      }

      &__img {
        width: 56px;
        height: 56px;
        border-radius: 10px;
        object-fit: cover;
        border: 1px solid @neutral-200;
        flex-shrink: 0;
      }

      &__info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }

    .order-summary {
      background: fade(@neutral-50, 80%);
      border-radius: 10px;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .summary-line {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: @neutral-700;

        strong {
          color: @primary-700;
        }
      }
    }

    .order-timeline {
      display: flex;
      justify-content: space-between;
      position: relative;
      padding: 8px 0;

      .timeline-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        color: @neutral-500;

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: @neutral-300;
          margin-bottom: 4px;
        }

        &.active {
          color: @primary-700;
          .dot {
            background: @primary-500;
          }
        }
      }

      &:before {
        content: '';
        position: absolute;
        top: 6px;
        left: 0;
        right: 0;
        height: 2px;
        background: @neutral-200;
      }
    }

    .tracking-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 10px;
    }

    .order-address {
      line-height: 1.5;
      color: @neutral-700;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    @media (max-width: 768px) {
      .order-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .order-section {
        padding: 16px;
      }

      .order-item {
        flex-wrap: wrap;

        &__img {
          width: 48px;
          height: 48px;
        }
      }
    }
  }
</style>
