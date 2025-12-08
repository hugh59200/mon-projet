<template>
  <div class="user-orders">
    <PageHeader />

    <WrapperLoader :loading="!hasLoaded" />

    <ContentBlock
      v-if="hasLoaded && orders.length === 0"
      variant="card"
      size="lg"
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
        Vous n'avez encore passé aucune commande.
      </BasicText>

      <PremiumButton
        label="Découvrir le catalogue"
        type="primary"
        variant="solid"
        size="md"
        @click="$router.push('/catalogue')"
      />
    </ContentBlock>

    <div
      v-else
      class="user-orders__list"
    >
      <div
        class="user-orders__controls"
        v-motion="{
          initial: { opacity: 0, y: 10 },
          enter: { opacity: 1, y: 0, transition: { delay: 0.1, type: 'spring', stiffness: 120 } },
        }"
      >
        <PremiumButton
          type="secondary"
          variant="outline"
          size="sm"
          :label="allOpen ? 'Tout réduire' : 'Tout ouvrir'"
          @click="toggleAllSections"
        />
      </div>

      <ContentBlock
        v-for="(order, index) in orders"
        :key="safeId(order)"
        variant="card"
        size="md"
        class="user-orders__card"
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
        <div class="user-orders__card-header">
          <div class="user-orders__card-header-left">
            <BasicText
              size="body-l"
              weight="bold"
              class="user-orders__card-date"
            >
              Commande du {{ formatDate(order.created_at) }}
            </BasicText>

            <BasicText
              size="body-s"
              color="neutral-600"
              class="user-orders__card-number"
            >
              N° {{ (order.order_number ?? order.order_id)?.slice(0, 15) }}
            </BasicText>
          </div>

          <BasicBadge
            :label="getLabelBadge(order.status)"
            :type="getTypeBadge(order.status)"
            size="small"
          />
        </div>

        <FilterSection
          title="Produits"
          :model-value="openSections[safeId(order)]?.items"
          @update:model-value="(v: boolean | undefined) => setSection(order, 'items', v ?? false)"
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
            class="user-orders__card-items"
          >
            <div
              v-for="(item, i) in getItems(order)"
              :key="i"
              class="user-orders__item"
            >
              <img
                :src="item.product_image || defaultImage"
                alt="Produit"
                class="user-orders__item-img"
              />

              <div class="user-orders__item-details">
                <div class="user-orders__item-name">
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
                </div>

                <div class="user-orders__item-meta">
                  <BasicText
                    size="body-s"
                    color="neutral-500"
                  >
                    Qté : {{ item.quantity }}
                  </BasicText>

                  <BasicText
                    size="body-s"
                    weight="bold"
                    color="neutral-800"
                  >
                    {{ formatPrice(item.total) }}
                  </BasicText>
                </div>
              </div>
            </div>
          </div>
        </FilterSection>

        <FilterSection
          title="Résumé financier"
          :model-value="openSections[safeId(order)]?.summary"
          @update:model-value="(v: boolean | undefined) => setSection(order, 'summary', v ?? false)"
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
            class="user-orders__card-summary"
          >
            <div class="user-orders__summary-line">
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

            <div class="user-orders__summary-line">
              <BasicText
                size="body-s"
                color="neutral-600"
              >
                Livraison ({{ order.carrier ?? 'Standard' }})
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-800"
              >
                <template v-if="(order.shipping_cost ?? 0) > 0">
                  {{ formatPrice(order.shipping_cost) }}
                </template>
                <template v-else>
                  <span style="color: var(--success-600); font-weight: 600">Offerte</span>
                </template>
              </BasicText>
            </div>

            <div
              v-if="(order.tax_amount ?? 0) > 0"
              class="user-orders__summary-line"
            >
              <BasicText
                size="body-s"
                color="neutral-600"
              >
                TVA
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-800"
              >
                {{ formatPrice(order.tax_amount) }}
              </BasicText>
            </div>

            <div
              v-if="(order.discount_amount ?? 0) > 0"
              class="user-orders__summary-line"
            >
              <BasicText
                size="body-s"
                style="color: var(--success-600)"
              >
                Remise
              </BasicText>
              <BasicText
                size="body-s"
                style="color: var(--success-600)"
              >
                -{{ formatPrice(order.discount_amount) }}
              </BasicText>
            </div>

            <div
              class="user-orders__title-divider"
              style="margin: 8px 0; opacity: 0.5"
            ></div>

            <div class="user-orders__summary-line">
              <BasicText
                size="body-m"
                weight="bold"
                color="neutral-900"
              >
                Total payé
              </BasicText>
              <BasicText
                size="body-m"
                weight="bold"
                color="neutral-900"
              >
                {{ formatPrice(order.total_amount) }}
              </BasicText>
            </div>

            <div
              class="user-orders__summary-line"
              style="margin-top: 4px"
            >
              <BasicText
                size="body-s"
                color="neutral-500"
              >
                Moyen de paiement
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-500"
                style="text-transform: capitalize"
              >
                {{ order.payment_method ?? '—' }}
              </BasicText>
            </div>
          </div>
        </FilterSection>

        <FilterSection
          title="Suivi"
          :model-value="openSections[safeId(order)]?.tracking"
          @update:model-value="
            (v: boolean | undefined) => setSection(order, 'tracking', v ?? false)
          "
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
            class="user-orders__timeline"
          >
            <div
              v-for="step in orderSteps"
              :key="step.key"
              :class="[
                'user-orders__timeline-step',
                { 'user-orders__timeline-step--active': step.key === order.status },
              ]"
            >
              <div class="user-orders__timeline-dot"></div>
              <BasicText
                size="body-s"
                color="neutral-600"
                class="user-orders__timeline-label"
              >
                {{ step.label }}
              </BasicText>
            </div>
          </div>
        </FilterSection>

        <div class="user-orders__card-actions">
          <PremiumButton
            label="Voir les détails"
            type="secondary"
            variant="outline"
            size="sm"
            @click="$router.push(`/profil/commandes/${order.order_id ?? ''}`)"
          />

          <PremiumButton
            v-if="order.tracking_number"
            label="Suivre le colis"
            type="primary"
            variant="solid"
            size="sm"
            @click="trackPackage(order.tracking_number)"
          />
        </div>
      </ContentBlock>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { DEFAULT_PRODUCT_IMAGE as defaultImage } from '@/config/productAssets'
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import FilterSection from '@/features/shared/components/FilterSection.vue'
  import { fetchUserOrders } from '@/api/supabase/orders'
  import type { OrderItemDetailed, OrdersFullView } from '@/supabase/types/supabase.types'
  import { formatDate } from '@/utils/index'
  import { getLabelBadge, getTypeBadge } from '@/utils/mappingBadge'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref, type Ref } from 'vue'
  import PageHeader from '@/features/shared/components/PageHeader.vue'

  const orders = ref<OrdersFullView[]>([])
  const openSections = ref({}) as Ref<
    Record<string, { items: boolean; summary: boolean; tracking: boolean }>
  >

  const allOpen = ref(true)

  const auth = useAuthStore()
  const toast = useToastStore()
  const hasLoaded = ref(false)

  // Cast manuel car le type retourné par la vue est Json
  function getItems(order: any): OrderItemDetailed[] {
    return (order.detailed_items as unknown as OrderItemDetailed[]) || []
  }

  function safeId(order: any): string {
    return (order.order_id || `temp_${Math.random().toString(36).slice(2, 8)}`) as string
  }

  function setSection(order: any, key: 'items' | 'summary' | 'tracking', value: boolean) {
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
      const data = await fetchUserOrders(auth.user.id)
      orders.value = data

      orders.value.forEach((o) => {
        openSections.value[safeId(o)] = { items: true, summary: true, tracking: true }
      })
    } catch (e) {
      console.error(e)
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
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
      Number(value),
    )
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

    &__empty {
      // Styles de base gérés par ContentBlock
      text-align: center;
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

    &__controls {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 12px;
    }

    &__card {
      // Styles de base gérés par ContentBlock
      display: flex;
      flex-direction: column;
      gap: 20px;

      &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        padding-bottom: 6px;
        border-bottom: 1px solid color-mix(in srgb, @neutral-200 70%, transparent);

        &-left {
          display: flex;
          gap: 24px;
        }
      }

      &-date {
        color: @neutral-900;
      }

      &-number {
        font-size: 13px;
      }

      &-items {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 6px 0;
      }

      &-summary {
        background: color-mix(in srgb, @neutral-50 80%, transparent);
        border-radius: 10px;
        padding: 16px 18px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      &-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 6px;
      }
    }

    &__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 1px solid color-mix(in srgb, @neutral-200 60%, transparent);
      padding-bottom: 8px;

      &:last-child {
        border-bottom: none;
      }

      &-img {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        object-fit: cover;
        border: 1px solid @neutral-200;
        flex-shrink: 0;
      }

      &-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      &-name {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      &-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 4px;
      }
    }

    &__summary-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 0;

      &:not(:last-child) {
        border-bottom: 1px dashed color-mix(in srgb, @neutral-300 50%, transparent);
        padding-bottom: 6px;
      }
    }

    &__timeline {
      display: flex;
      justify-content: space-between;
      position: relative;
      padding: 8px 0;

      &:before {
        content: '';
        position: absolute;
        top: 6px;
        left: 0;
        right: 0;
        height: 2px;
        background: @neutral-200;
      }

      &-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        color: @neutral-500;

        &--active {
          color: var(--primary-700);

          .user-orders__timeline-dot {
            background: var(--primary-500);
          }
        }
      }

      &-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: @neutral-300;
        margin-bottom: 4px;
      }

      &-label {
        text-align: center;
      }
    }

    // Tablet (≤ 1160px)
    .respond-tablet({
      max-width: 100%;
      padding: 0 24px;
    });

    // Mobile (≤ 720px)
    .respond-mobile({
      padding: 0 16px;

      &__list {
        gap: 20px;
      }

      &__controls {
        margin-bottom: 8px;
      }

      &__card {
        gap: 16px;

        &-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;

          &-left {
            flex-direction: column;
            gap: 4px;
          }
        }

        &-date {
          font-size: 15px;
        }

        &-number {
          font-size: 12px;
        }

        &-summary {
          padding: 12px 14px;
        }

        &-actions {
          flex-direction: column;
          align-items: stretch;

          .PremiumButton {
            width: 100%;
          }
        }
      }

      &__item {
        flex-wrap: wrap;
        gap: 12px;

        &-img {
          width: 56px;
          height: 56px;
          border-radius: 8px;
        }

        &-details {
          min-width: 0;
        }

        &-meta {
          justify-content: flex-start;
          gap: 12px;
          flex-wrap: wrap;
        }
      }

      &__timeline {
        &-step {
          flex: none;
          width: auto;
        }

        &-label {
          font-size: 11px;
        }

        &-dot {
          width: 10px;
          height: 10px;
        }
      }

      :deep(.FilterSection) {
        padding: 12px;
        border-radius: 10px;
      }
    });
  }
</style>
