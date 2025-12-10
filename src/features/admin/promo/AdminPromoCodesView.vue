<template>
  <div class="admin-promo">
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher un code promo..."
      show-reset
      @reset="reset()"
    >
      <template #actions>
        <PremiumButton
          label="+ Nouveau code"
          type="primary"
          size="sm"
          @click="isCreateModalVisible = true"
        />
      </template>
      <template #pagination>
        <BasicPagination
          :current-page="page"
          :nb-pages="nbPages"
          :nb-results="total"
          :nb-pages-max="5"
          :auto-fetch="fetchData"
          size="small"
          @change="page = $event"
        />
      </template>
    </BasicToolbar>

    <WrapperLoader
      :loading="loading"
      :has-loaded="hasLoaded"
      :is-empty="hasLoaded && filteredData.length === 0"
      message="Chargement des codes promo..."
      empty-message="Aucun code promo trouvé"
    >
      <template v-if="isDesktop || isTablet">
        <!-- Header -->
        <div class="cardLayoutWrapper cardLayoutWrapper--header admin-promo__header">
          <BasicCell
            :span="6"
            text="Code"
            :is-active="sortKey === 'code'"
            :icon-color="getSortColor('code')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('code')"
          />
          <BasicCell
            :span="6"
            text="Type"
            :is-active="sortKey === 'discount_type'"
            :icon-color="getSortColor('discount_type')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('discount_type')"
          />
          <BasicCell
            :span="5"
            text="Valeur"
            :is-active="sortKey === 'discount_value'"
            :icon-color="getSortColor('discount_value')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('discount_value')"
          />
          <BasicCell
            :span="5"
            text="Utilisations"
            :is-active="sortKey === 'current_uses'"
            :icon-color="getSortColor('current_uses')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('current_uses')"
          />
          <BasicCell
            :span="5"
            text="Validité"
          />
          <BasicCell
            :span="4"
            text="Statut"
          />
          <BasicCell :span="5" />
        </div>

        <!-- Rows -->
        <div
          v-for="code in filteredData"
          :key="code.id"
          class="gridElemWrapper admin-promo__row"
        >
          <div
            class="cardLayoutWrapper admin-promo__item"
            @click="openCodeModal(code.id)"
          >
            <!-- Code -->
            <BasicCell :span="6" class="admin-promo__code-cell">
              <div class="admin-promo__code-info">
                <span class="admin-promo__code">{{ code.code }}</span>
                <span
                  v-if="code.description"
                  class="admin-promo__description"
                >
                  {{ code.description }}
                </span>
              </div>
            </BasicCell>

            <!-- Type -->
            <BasicCell :span="6">
              <BasicBadge
                :label="code.discount_type === 'percentage' ? 'Pourcentage' : 'Fixe'"
                :type="code.discount_type === 'percentage' ? 'info' : 'default'"
                size="small"
              />
            </BasicCell>

            <!-- Valeur -->
            <BasicCell :span="5">
              <span class="admin-promo__value">
                {{ code.discount_type === 'percentage'
                  ? `-${code.discount_value}%`
                  : `-${formatCurrency(code.discount_value)}`
                }}
              </span>
              <span
                v-if="code.min_order_amount && code.min_order_amount > 0"
                class="admin-promo__min"
              >
                min. {{ formatCurrency(code.min_order_amount) }}
              </span>
            </BasicCell>

            <!-- Utilisations -->
            <BasicCell :span="5">
              <div class="admin-promo__usage">
                <span>{{ code.current_uses }}</span>
                <span v-if="code.max_uses" class="admin-promo__usage-max">
                  / {{ code.max_uses }}
                </span>
                <span v-else class="admin-promo__usage-unlimited">
                  illimité
                </span>
              </div>
            </BasicCell>

            <!-- Validité -->
            <BasicCell :span="5">
              <div class="admin-promo__validity">
                <template v-if="isExpired(code)">
                  <BasicBadge label="Expiré" type="error" size="small" />
                </template>
                <template v-else-if="code.valid_until">
                  <span class="admin-promo__date">
                    {{ formatDate(code.valid_until) }}
                  </span>
                </template>
                <template v-else>
                  <span class="admin-promo__permanent">Permanent</span>
                </template>
              </div>
            </BasicCell>

            <!-- Statut -->
            <BasicCell :span="4">
              <BasicBadge
                :label="code.active ? 'Actif' : 'Inactif'"
                :type="code.active ? 'success' : 'default'"
                size="small"
              />
            </BasicCell>

            <!-- Actions -->
            <BasicCell :span="5" class="admin-promo__actions">
              <BasicCellActionIcon
                :icon-name="code.active ? 'eye-slash' : 'eye'"
                :tooltip="code.active ? 'Désactiver' : 'Activer'"
                @click.stop="toggleActive(code)"
              />
              <BasicCellActionIcon
                icon-name="trash"
                tooltip="Supprimer"
                danger
                @click.stop="deleteCode(code)"
              />
            </BasicCell>
          </div>
        </div>
      </template>

      <!-- Mobile -->
      <template v-else>
        <div
          v-for="code in filteredData"
          :key="code.id"
          class="admin-promo__mobile-card"
          @click="openCodeModal(code.id)"
        >
          <div class="admin-promo__mobile-header">
            <span class="admin-promo__mobile-code">{{ code.code }}</span>
            <BasicBadge
              :label="code.active ? 'Actif' : 'Inactif'"
              :type="code.active ? 'success' : 'default'"
              size="small"
            />
          </div>
          <div class="admin-promo__mobile-body">
            <div class="admin-promo__mobile-row">
              <span class="admin-promo__mobile-label">Remise</span>
              <span class="admin-promo__mobile-value admin-promo__value">
                {{ code.discount_type === 'percentage'
                  ? `-${code.discount_value}%`
                  : `-${formatCurrency(code.discount_value)}`
                }}
              </span>
            </div>
            <div class="admin-promo__mobile-row">
              <span class="admin-promo__mobile-label">Utilisations</span>
              <span class="admin-promo__mobile-value">
                {{ code.current_uses }}{{ code.max_uses ? ` / ${code.max_uses}` : '' }}
              </span>
            </div>
          </div>
          <div class="admin-promo__mobile-actions">
            <PremiumButton
              :label="code.active ? 'Désactiver' : 'Activer'"
              :type="code.active ? 'secondary' : 'primary'"
              size="xs"
              variant="outline"
              @click.stop="toggleActive(code)"
            />
            <PremiumButton
              label="Supprimer"
              type="danger"
              size="xs"
              variant="ghost"
              @click.stop="deleteCode(code)"
            />
          </div>
        </div>
      </template>
    </WrapperLoader>

    <!-- Modal Création -->
    <teleport to="#app">
      <AdminPromoCodeModal
        v-model="isCreateModalVisible"
        @saved="handleSaved"
      />
    </teleport>

    <!-- Modal Edition -->
    <teleport to="#app">
      <AdminPromoCodeModal
        v-if="selectedCodeId"
        v-model="isEditModalVisible"
        :code-id="selectedCodeId"
        @saved="handleSaved"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useAdminTable } from '@/features/admin/shared/composables/useAdminTable'
  import { useSortableTable } from '@/features/admin/shared/composables/useSortableTable'
  import { usePromoCodeActions } from './composables/usePromoCodeActions'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint/DeviceBreakpoint.types'
  import AdminPromoCodeModal from './modale/AdminPromoCodeModal.vue'
  import type { PromoCode } from '@/api/supabase/promo'

  // Table hook
  const {
    filteredData,
    total,
    nbPages,
    page,
    search,
    sortKey,
    sortAsc,
    loading,
    hasLoaded,
    fetchData,
    reset,
  // @ts-ignore - 'promo_codes' non reconnu, régénérer les types après déploiement SQL
  } = useAdminTable({
    table: 'promo_codes' as any,
    orderBy: 'created_at',
    ascending: false,
    searchFn: (code: any, q: string) =>
      code.code?.toLowerCase().includes(q) ||
      code.description?.toLowerCase().includes(q) ||
      false,
    persistInUrl: true,
  })

  // Sort hook
  // @ts-ignore - Type générique pour promo_codes
  const { toggleSort, getSortColor } = useSortableTable(sortKey, sortAsc, filteredData as any)

  // Actions hook
  const { deleteCode, toggleActive } = usePromoCodeActions(fetchData)

  // Responsive
  const { isTablet, isDesktop } = useDeviceBreakpoint()

  // Modals
  const isCreateModalVisible = ref(false)
  const isEditModalVisible = ref(false)
  const selectedCodeId = ref<string | null>(null)

  function openCodeModal(id: string) {
    selectedCodeId.value = id
    isEditModalVisible.value = true
  }

  function handleSaved() {
    isCreateModalVisible.value = false
    isEditModalVisible.value = false
    selectedCodeId.value = null
    fetchData()
  }

  // Helpers
  function formatCurrency(value: number | null | undefined) {
    if (value == null) return '—'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value)
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '—'
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  function isExpired(code: PromoCode) {
    if (!code.valid_until) return false
    return new Date(code.valid_until) < new Date()
  }
</script>

<style scoped lang="less">
  .admin-promo {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .admin-promo__header {
    background: var(--content-block-bg-subtle);
    border-radius: 8px;
    padding: 12px 16px;
  }

  .admin-promo__row {
    cursor: pointer;
    transition: transform 0.15s ease;

    &:hover {
      transform: translateX(4px);
    }
  }

  .admin-promo__item {
    background: transparent;
    border: 1px solid var(--content-block-border);
    border-radius: 10px;
    padding: 16px;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--primary-200);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  .admin-promo__code-cell {
    display: flex;
    align-items: flex-start;
  }

  .admin-promo__code-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .admin-promo__code {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-700);
    background: var(--primary-50);
    padding: 4px 8px;
    border-radius: 4px;
  }

  .admin-promo__description {
    font-size: 12px;
    color: var(--content-block-text-muted);
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .admin-promo__value {
    font-weight: 600;
    color: var(--success-600);
    font-size: 14px;
  }

  .admin-promo__min {
    display: block;
    font-size: 11px;
    color: var(--content-block-text-muted);
    margin-top: 2px;
  }

  .admin-promo__usage {
    display: flex;
    align-items: baseline;
    gap: 4px;
    font-size: 14px;
    color: var(--content-block-text);
  }

  .admin-promo__usage-max {
    color: var(--content-block-text-muted);
    font-size: 12px;
  }

  .admin-promo__usage-unlimited {
    color: var(--content-block-text-muted);
    font-size: 11px;
    font-style: italic;
  }

  .admin-promo__validity {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .admin-promo__date {
    font-size: 13px;
    color: var(--content-block-text-secondary);
  }

  .admin-promo__permanent {
    font-size: 12px;
    color: var(--content-block-text-muted);
    font-style: italic;
  }

  .admin-promo__actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  // Mobile styles
  .admin-promo__mobile-card {
    background: transparent;
    border: 1px solid var(--content-block-border);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    cursor: pointer;

    &:active {
      background: rgba(var(--primary-500-rgb), 0.08);
    }
  }

  .admin-promo__mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .admin-promo__mobile-code {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-700);
  }

  .admin-promo__mobile-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }

  .admin-promo__mobile-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .admin-promo__mobile-label {
    font-size: 13px;
    color: var(--content-block-text-muted);
  }

  .admin-promo__mobile-value {
    font-size: 14px;
    font-weight: 500;
    color: var(--content-block-text);
  }

  .admin-promo__mobile-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding-top: 12px;
    border-top: 1px solid var(--content-block-border);
  }
</style>
