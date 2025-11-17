<template>
  <section class="po">
    <header
      class="po__header"
      @click="toggle"
    >
      <BasicText
        size="body-m"
        weight="semibold"
      >
        Mes commandes
      </BasicText>

      <BasicIconNext
        :name="open ? 'ChevronUp' : 'ChevronDown'"
        :size="18"
        class="po__chevron"
        :class="{ 'is-open': open }"
      />
    </header>

    <div
      v-show="open"
      class="po__content"
    >
      <div
        v-if="orders.length"
        class="po__list"
      >
        <div
          v-for="order in orders"
          :key="order.id || Math.random()"
          class="po__card"
          @click="$emit('open-order', order.id)"
        >
          <!-- HEADER -->
          <div class="po__card-header">
            <BasicText
              size="body-l"
              weight="bold"
            >
              Commande #{{ (order.id ?? '').slice(0, 8) }}
            </BasicText>

            <BasicBadge
              :label="badgeLabel(order.status)"
              :type="badgeType(order.status)"
              size="small"
            />
          </div>

          <!-- BODY -->
          <div class="po__card-body">
            <BasicText
              size="body-m"
              color="neutral-700"
            >
              Total :
              <strong>{{ order.total_amount ?? 0 }} €</strong>
            </BasicText>

            <BasicText
              size="body-m"
              color="neutral-500"
            >
              Date : {{ formatDate(order.created_at) }}
            </BasicText>
          </div>
        </div>
      </div>

      <BasicText
        v-else
        size="body-m"
        color="neutral-500"
        align="center"
      >
        Aucune commande récente.
      </BasicText>
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { Orders } from '@/supabase/types/supabase.types'
  import BasicBadge from '@designSystem/components/basic/badge/BasicBadge.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'

  /* Props */
  defineProps<{
    orders: Partial<Orders>[]
  }>()

  /* defineModel → open */
  const open = defineModel<boolean>({ default: true })

  /* declare custom emits */
  const emit = defineEmits<{
    (e: 'open-order', id?: string): void
  }>()

  function toggle() {
    open.value = !open.value
  }

  /* helpers */
  function formatDate(date?: string | null) {
    if (!date) return '—'
    return new Date(date).toLocaleDateString()
  }

  function badgeLabel(status?: string) {
    if (!status) return 'Inconnu'
    switch (status) {
      case 'paid':
        return 'Payée'
      case 'pending':
        return 'En attente'
      case 'canceled':
        return 'Annulée'
      default:
        return status
    }
  }

  function badgeType(status?: string) {
    if (!status) return 'default'
    switch (status) {
      case 'paid':
        return 'success'
      case 'pending':
        return 'pending'
      case 'canceled':
        return 'canceled'
      default:
        return 'default'
    }
  }
</script>

<style scoped lang="less">
  .po {
    background: var(--surface-2);
    border: 1px solid var(--surface-border);
    border-radius: var(--radius-l);
    box-shadow: var(--surface-elevated-shadow);
    transition: var(--transition-medium);
    overflow: hidden;

    &:hover {
      border-color: var(--surface-border-strong);
    }

    &__header {
      padding: 16px 20px;
      background: var(--surface-3);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;

      &:hover {
        background: var(--surface-hover);
      }
    }

    &__chevron {
      transition: transform 0.3s ease;
      &.is-open {
        transform: rotate(180deg);
      }
    }

    &__content {
      padding: 20px;
      background: var(--surface-1);
      border-top: 1px solid var(--surface-border);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__card {
      background: var(--surface-1);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-l);
      padding: 16px 20px;
      cursor: pointer;
      transition: var(--transition-medium);

      &:hover {
        background: var(--surface-2);
        border-color: var(--surface-border-strong);
        transform: translateY(-2px);
      }
    }

    &__card-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    &__card-body {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  }
</style>
