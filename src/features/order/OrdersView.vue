<template>
  <div class="user-orders">
    <!-- 🧾 Titre -->
    <div
      class="user-orders__title-wrapper"
      v-motion="{
        initial: { opacity: 0, y: -20 },
        enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
      }"
    >
      <BasicText
        size="h3"
        weight="bold"
        class="user-orders__title"
      >
        Mes
        <span>commandes</span>
      </BasicText>
      <div class="user-orders__subtitle">
        Retrouvez ici l’historique de toutes vos commandes passées 🧾
      </div>
    </div>

    <!-- 🔄 Loader -->
    <WrapperLoader
      :loading="!hasLoaded"
      message="Chargement de vos commandes..."
    />

    <!-- 🚫 Aucune commande -->
    <div
      v-if="hasLoaded && orders.length === 0"
      class="user-orders__empty"
      v-motion="{
        initial: { opacity: 0, scale: 0.95 },
        enter: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 12 } },
      }"
    >
      <BasicText
        size="body-l"
        color="neutral-700"
      >
        Vous n’avez encore passé aucune commande.
      </BasicText>
      <BasicButton
        label="Découvrir le catalogue"
        type="primary"
        variant="filled"
        size="medium"
        @click="$router.push('/catalogue')"
      />
    </div>

    <!-- ✅ Liste des commandes -->
    <div
      v-else
      class="user-orders__list"
    >
      <!-- 🧭 Contrôles globaux -->
      <div
        class="orders-controls"
        v-motion="{
          initial: { opacity: 0, y: 10 },
          enter: { opacity: 1, y: 0, transition: { delay: 0.1, type: 'spring', stiffness: 120 } },
        }"
      >
        <BasicButton
          type="secondary"
          variant="outlined"
          size="small"
          :label="allOpen ? 'Tout réduire' : 'Tout ouvrir'"
          @click="toggleAllSections"
        />
      </div>

      <!-- 🧾 Cartes commandes -->
      <div
        v-for="(order, index) in orders"
        :key="index"
        class="order-card"
        v-motion="{
          initial: { opacity: 0, y: 40, scale: 0.97 },
          enter: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { delay: index * 0.1, type: 'spring', stiffness: 90 },
          },
        }"
      >
        <!-- 🏷️ En-tête -->
        <div class="order-card__header">
          <div class="order-card__header-left">
            <BasicText
              size="body-l"
              weight="bold"
              class="order-card__date"
            >
              Commande du {{ formatDate(order.created_at) }}
            </BasicText>
            <BasicText
              size="body-s"
              color="neutral-600"
              class="order-card__number"
            >
              N° {{ (order.order_id ?? '').slice(0, 8).toUpperCase() }}
            </BasicText>
          </div>
          <!-- <BasicBadge
            :label="getStatusLabel(order.status)"
            :type="getStatusBadge(order.status)"
            size="small"
          /> -->
        </div>

        <!-- 🔽 Produits -->
        <FilterSection
          title="Produits"
          :model-value="openSections[safeId(order)]?.items"
          @update:model-value="(v: boolean) => setSection(order, 'items', v)"
        >
          <div
            v-motion="{
              initial: { opacity: 0, y: 10, height: 0 },
              enter: {
                opacity: 1,
                y: 0,
                height: 'auto',
                transition: { type: 'spring', stiffness: 80 },
              },
              leave: { opacity: 0, y: -10, height: 0, transition: { duration: 0.25 } },
            }"
            class="order-card__items"
          >
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
              <div class="order-item__details">
                <div class="order-item__name">
                  <BasicText
                    size="body-m"
                    weight="semibold"
                    color="neutral-900"
                  >
                    {{ item.name }}
                  </BasicText>
                </div>
                <div class="order-item__meta">
                  <BasicText
                    size="body-s"
                    color="neutral-500"
                  >
                    Quantité : {{ item.quantity }}
                  </BasicText>
                  <BasicText
                    size="body-s"
                    weight="bold"
                    color="primary-700"
                  >
                    {{ formatPrice(item.price) }}
                  </BasicText>
                </div>
              </div>
            </div>
          </div>
        </FilterSection>

        <!-- 🔽 Résumé -->
        <FilterSection
          title="Résumé"
          :model-value="openSections[safeId(order)]?.summary"
          @update:model-value="(v: boolean) => setSection(order, 'summary', v)"
        >
          <div
            v-motion="{
              initial: { opacity: 0, y: 10, height: 0 },
              enter: {
                opacity: 1,
                y: 0,
                height: 'auto',
                transition: { type: 'spring', stiffness: 100 },
              },
              leave: { opacity: 0, y: -10, height: 0, transition: { duration: 0.25 } },
            }"
            class="order-card__summary"
          >
            <div class="summary-line">
              <BasicText
                size="body-s"
                color="neutral-700"
              >
                Total
              </BasicText>
              <BasicText
                size="body-m"
                weight="bold"
                color="primary-800"
              >
                {{ formatPrice(order.total_amount) }}
              </BasicText>
            </div>
            <div class="summary-line">
              <BasicText
                size="body-s"
                color="neutral-700"
              >
                Méthode
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-700"
              >
                {{ order.payment_method ?? '—' }}
              </BasicText>
            </div>
            <div class="summary-line">
              <BasicText
                size="body-s"
                color="neutral-700"
              >
                Livraison
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-700"
              >
                {{ order.carrier ?? '—' }}
              </BasicText>
            </div>
          </div>
        </FilterSection>

        <!-- 🔽 Suivi -->
        <FilterSection
          title="Suivi"
          :model-value="openSections[safeId(order)]?.tracking"
          @update:model-value="(v: boolean) => setSection(order, 'tracking', v)"
        >
          <div
            v-motion="{
              initial: { opacity: 0, y: 15, height: 0 },
              enter: {
                opacity: 1,
                y: 0,
                height: 'auto',
                transition: { type: 'spring', stiffness: 90 },
              },
              leave: { opacity: 0, y: -15, height: 0, transition: { duration: 0.25 } },
            }"
            class="order-timeline"
          >
            <div
              v-for="step in orderSteps"
              :key="step.key"
              class="timeline-step"
              :class="{ active: step.key === order.status }"
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
        </FilterSection>
        <div class="order-card__actions">
          <BasicButton
            label="Voir les détails"
            type="secondary"
            variant="outlined"
            size="small"
            @click="$router.push(`/profil/commandes/${order.order_id ?? ''}`)"
          />
          <BasicButton
            v-if="order.tracking_number"
            label="Suivre le colis"
            type="primary"
            variant="filled"
            size="small"
            @click="trackPackage(order.tracking_number)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import FilterSection from '@/features/shared/components/FilterSection.vue'
  import { supabase } from '@/supabase/supabaseClient'
  import { formatDate } from '@/utils/index'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'

  type OrderItemDetailed = {
    product_id: string
    name: string
    category: string
    price: number
    purity: number | null
    stock: boolean
    image: string | null
    quantity: number
    subtotal: number
  }

  type OrderDetailed = {
    order_id: string | null
    user_id: string | null
    email: string | null
    full_name: string | null
    address: string | null
    city: string | null
    country: string | null
    status: string | null
    created_at: string | null
    total_amount: number | null
    payment_method: string | null
    tracking_number: string | null
    carrier: string | null
    detailed_items: OrderItemDetailed[] | null
  }

  const orders = ref<OrderDetailed[]>([])
  const openSections = ref<Record<string, { items: boolean; summary: boolean; tracking: boolean }>>(
    {},
  )
  const allOpen = ref(true)
  const auth = useAuthStore()
  const toast = useToastStore()
  const hasLoaded = ref(false)

  function safeId(order: OrderDetailed) {
    return order.order_id ?? `temp_${Math.random().toString(36).slice(2, 8)}`
  }

  function setSection(order: OrderDetailed, key: 'items' | 'summary' | 'tracking', value: boolean) {
    const id = safeId(order)
    if (!openSections.value[id]) {
      openSections.value[id] = { items: true, summary: true, tracking: true }
    }
    openSections.value[id][key] = value
  }

  function toggleAllSections() {
    allOpen.value = !allOpen.value
    Object.keys(openSections.value).forEach((id) => {
      openSections.value[id] = {
        items: allOpen.value,
        summary: allOpen.value,
        tracking: allOpen.value,
      }
    })
  }

  async function loadUserOrders() {
    try {
      if (!auth.user) return
      const { data, error } = await supabase
        .from('orders_detailed_view')
        .select('*')
        .eq('email', auth.user.email!)
        .order('created_at', { ascending: false })
      if (error) throw error
      orders.value = (data ?? []) as OrderDetailed[]
      orders.value.forEach((o) => {
        openSections.value[safeId(o)] = { items: true, summary: true, tracking: true }
      })
    } catch {
      toast.show('Erreur lors du chargement de vos commandes', 'danger')
    } finally {
      hasLoaded.value = true
    }
  }

  onMounted(loadUserOrders)

  const orderSteps = [
    { key: 'paid', label: 'Payée' },
    { key: 'shipped', label: 'Expédiée' },
    { key: 'completed', label: 'Livrée' },
  ]

  function formatPrice(value: number | null | undefined) {
    if (value == null || isNaN(Number(value))) return '—'
    return `${Number(value).toFixed(2)} €`
  }

  function trackPackage(tracking: string) {
    window.open(`https://www.laposte.fr/outils/suivre-vos-envois?code=${tracking}`, '_blank')
  }
</script>

<style scoped lang="less">
  .user-orders {
    margin: 0 auto;
    max-width: 950px;
    padding: 0 20px;
    display: flex;
    flex-direction: column;

    &__title-wrapper {
      text-align: center;
    }

    &__title {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: @neutral-900;
      margin-bottom: 6px;

      span {
        background: linear-gradient(90deg, @primary-600, @primary-400);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    &__subtitle {
      font-size: 15px;
      color: @neutral-600;
    }

    &__empty {
      text-align: center;
      padding: 70px 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: 26px;
    }

    .orders-controls {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 12px;
    }

    .order-card {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 16px;
      padding: 26px;
      box-shadow: 0 3px 8px rgba(var(--neutral-400-rgb), 0.08);
      display: flex;
      flex-direction: column;
      gap: 20px;
      transition: all 0.25s ease;

      &:hover {
        box-shadow: 0 6px 14px rgba(var(--neutral-400-rgb), 0.15);
        transform: translateY(-2px);
      }

      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        padding-bottom: 6px;
        border-bottom: 1px solid rgba(var(--neutral-200-rgb), 0.70);
      }

      &__date {
        color: @neutral-900;
      }

      &__number {
        font-size: 13px;
      }

      &__items {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 6px 0;
      }

      .order-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        border-bottom: 1px solid rgba(var(--neutral-200-rgb), 0.60);
        padding-bottom: 8px;

        &:last-child {
          border-bottom: none;
        }

        &__img {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid @neutral-200;
          flex-shrink: 0;
        }

        &__details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        &__meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
      }

      &__summary {
        background: rgba(var(--neutral-50-rgb), 0.80);
        border-radius: 10px;
        padding: 16px 18px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .summary-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2px 0;

          &:not(:last-child) {
            border-bottom: 1px dashed rgba(var(--neutral-300-rgb), 0.50);
            padding-bottom: 6px;
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

      &__actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 6px;
      }
    }

    @media (max-width: 768px) {
      .order-card {
        padding: 18px;

        &__header {
          flex-direction: column;
          align-items: flex-start;
        }

        .order-item {
          flex-wrap: wrap;

          &__img {
            width: 48px;
            height: 48px;
          }

          &__meta {
            justify-content: flex-start;
            gap: 16px;
          }
        }

        &__actions {
          flex-direction: column;
          align-items: stretch;

          button {
            width: 100%;
          }
        }
      }
    }
  }
</style>
