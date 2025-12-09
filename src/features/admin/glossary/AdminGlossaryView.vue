<template>
  <div class="admin-glossary">
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher un terme..."
      show-reset
      show-role
      @reset="reset"
    >
      <template #actions>
        <PremiumButton
          v-if="!readonly"
          label="+ Ajouter un terme"
          type="primary"
          size="sm"
          @click="isCreateModalVisible = true"
        />
      </template>
    </BasicToolbar>
    <BasicPagination
      :current-page="page"
      :nb-pages="nbPages"
      :nb-results="total"
      :nb-pages-max="5"
      :auto-fetch="fetchData"
      @change="page = $event"
    />
    <WrapperLoader
      :loading="loading"
      :has-loaded="hasLoaded"
      :is-empty="hasLoaded && filteredData.length === 0"
      message="Chargement du glossaire..."
      empty-message="Aucun terme trouvé 📚"
    >
      <template v-if="isDesktop || isTablet">
        <div class="cardLayoutWrapper cardLayoutWrapper--header admin-glossary__header">
          <BasicCell
            :span="14"
            text="Terme"
            :is-active="sortKey === 'term'"
            :icon-color="getSortColor('term')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('term')"
          />
          <BasicCell
            :span="8"
            text="Status"
            :is-active="sortKey === 'status'"
            :icon-color="getSortColor('status')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('status')"
          />
          <BasicCell
            :span="8"
            text="Liens produits"
          />
          <BasicCell
            :span="6"
            text="Date création"
            :is-active="sortKey === 'created_at'"
            :icon-color="getSortColor('created_at')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('created_at')"
          />
          <BasicCell :span="4" />
        </div>
        <div
          v-for="term in filteredData"
          :key="term.id"
          class="gridElemWrapper admin-glossary__row"
        >
          <div
            class="cardLayoutWrapper admin-glossary__item"
            @click="openTermModal(term.id)"
          >
            <BasicCell
              :span="14"
              class="admin-glossary__info"
            >
              <div class="admin-glossary__icon">
                <BasicIconNext name="BookOpen" :size="18" />
              </div>
              <BasicText
                :label="term.term"
                size="body-l"
                weight="semibold"
                color="neutral-900"
                pointer
                class="admin-glossary__title"
              />
            </BasicCell>
            <BasicCell :span="8">
              <span
                :class="[
                  'admin-glossary__status',
                  `admin-glossary__status--${term.status}`
                ]"
              >
                {{ term.status === 'published' ? 'Publié' : 'Brouillon' }}
              </span>
            </BasicCell>
            <BasicCell :span="8">
              <BasicText
                :label="(term.related_product_ids?.length || 0) + ' produit(s)'"
                size="body-s"
                color="neutral-600"
              />
            </BasicCell>
            <BasicCell :span="6">
              <BasicText
                :label="formatDate(term.created_at)"
                size="body-s"
                color="neutral-500"
              />
            </BasicCell>
            <BasicCellActionIcon
              v-if="!readonly"
              icon-name="trash"
              tooltip="Supprimer"
              center
              danger
              :span="4"
              @click="handleDelete(term)"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <GlossaryCardMobile
          v-for="term in filteredData"
          :key="term.id"
          :term="term"
          :open-term-modal="openTermModal"
          :handle-delete="handleDelete"
          class="gridElemWrapper admin-glossary__mobile-card"
        />
      </template>
    </WrapperLoader>
    <teleport to="#app">
      <AdminGlossaryModal
        v-if="!readonly"
        v-model="isCreateModalVisible"
        @saved="fetchData"
      />
      <AdminGlossaryModal
        v-if="selectedTermId"
        v-model="isModalVisible"
        :term-id="selectedTermId"
        :readonly="readonly"
        @saved="fetchData"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { deleteGlossaryTerm } from '@/api/supabase/glossary'
import { useAdminTable } from '@/features/admin/shared/composables/useAdminTable'
import { useSortableTable } from '@/features/admin/shared/composables/useSortableTable'
import { useDialog } from '@/features/interface/dialog'
import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
import type { Tables } from '@/supabase/types/supabase'
import type { GlossaryTerms } from '@/supabase/types/supabase.types'
import { formatDate, sanitizeHTML } from '@/utils'
import BasicCell from '@designSystem/components/basic/cell/BasicCell.vue'
import BasicCellActionIcon from '@designSystem/components/basic/cell/BasicCellActionIcon.vue'
import BasicPagination from '@designSystem/components/basic/pagination/BasicPagination.vue'
import BasicText from '@designSystem/components/basic/text/BasicText.vue'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import WrapperLoader from '@designSystem/components/wrapper/loader/WrapperLoader.vue'
import { ref } from 'vue'
import BasicToolbar from '@/features/admin/shared/components/BasicToolbar.vue'
import GlossaryCardMobile from './mobile/GlossaryCardMobile.vue'
import AdminGlossaryModal from './modale/AdminGlossaryModal.vue'

const props = defineProps<{ readonly?: boolean }>()
const toast = useToastStore()
const { showDialog } = useDialog()

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
} = useAdminTable<'glossary_terms', GlossaryTerms>({
  table: 'glossary_terms',
  orderBy: 'term',
  ascending: true,
  searchFn: (t, q) =>
    (t.term?.toLowerCase()?.includes(q) ?? false) ||
    (t.meta_description?.toLowerCase()?.includes(q) ?? false),
  persistInUrl: true,
})

const { isTablet, isDesktop } = useDeviceBreakpoint()

const { toggleSort, getSortColor } = useSortableTable<Tables<'glossary_terms'>>(
  sortKey,
  sortAsc,
  filteredData,
)

async function handleDelete(term: GlossaryTerms) {
  if (props.readonly) return

  const safeTerm = sanitizeHTML(term.term ?? '')
  const result = await showDialog({
    type: 'YesNo',
    title: 'Supprimer ce terme ?',
    message: [
      `
      <p style="margin:0 0 12px;">Voulez-vous vraiment supprimer ce terme du glossaire ?</p>
      <p style="margin:0 0 12px;"><strong>Terme :</strong> ${safeTerm}</p>
      <p style="margin:0;"><strong>Confirmez-vous ?</strong></p>
    `,
    ],
    isHtml: true,
    closable: false,
  })
  if (result !== 'Yes') return

  try {
    await deleteGlossaryTerm(term.id)
    toast.show('Terme supprimé ✅', 'success')
    fetchData()
  } catch (err: any) {
    toast.show(`Erreur : ${err.message}`, 'danger')
  }
}

const isModalVisible = ref(false)
const selectedTermId = ref<string | null>(null)
const isCreateModalVisible = ref(false)

function openTermModal(id: string) {
  selectedTermId.value = id
  isModalVisible.value = true
}
</script>

<style scoped lang="less">
.admin-glossary {
  &__item {
    cursor: pointer;

    &:hover {
      background: var(--admin-bg-card-hover);
    }
  }

  &__mobile-card {
    margin: 4px 0;
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(var(--primary-500-rgb), 0.1);
    border-radius: 8px;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  &__status {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 6px;

    &--published {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
    }

    &--draft {
      background: rgba(245, 158, 11, 0.1);
      color: #d97706;
    }
  }
}
</style>
