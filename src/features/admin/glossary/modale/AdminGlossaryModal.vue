<template>
  <ModalComponent v-model="visible" closable>
    <template #header>
      {{ headerTitle }}
    </template>
    <template #content>
      <div class="glossary-form">
        <WrapperInput
          v-model="form.term as InputModel"
          label="Terme"
          placeholder="Ex : Lyophilisation"
          :readonly="readonly"
          required
        />
        <WrapperInput
          v-model="form.slug"
          label="Slug (URL)"
          placeholder="ex: lyophilisation"
          :readonly="readonly"
          hint="Sera généré automatiquement si laissé vide"
        />
        <WrapperFormElements label="Définition (~100 mots)">
          <textarea
            v-model="form.definition"
            rows="5"
            class="custom-textarea"
            placeholder="Définition claire et concise du terme..."
            :readonly="readonly"
          />
        </WrapperFormElements>
        <WrapperInput
          v-model="form.meta_description"
          label="Meta description (SEO)"
          placeholder="Description courte pour les moteurs de recherche..."
          :readonly="readonly"
          hint="Max 320 caractères pour un affichage optimal dans Google"
        />

        <WrapperDropdown
          v-model="form.status"
          :items="statusOptions"
          placeholder="Choisir un statut"
          label="Statut"
          key-id="id"
          key-label="label"
          :disabled="readonly"
        />

        <!-- Liens croisés -->
        <div class="related-section">
          <BasicText size="body-l" weight="bold" color="neutral-800" class="section-title">
            🔗 Liens croisés (SEO)
          </BasicText>

          <WrapperFormElements label="Produits liés">
            <div class="multi-select-wrapper">
              <div
                v-for="product in selectedProducts"
                :key="product.id"
                class="selected-item"
              >
                <span>{{ product.name }} ({{ product.dosage }})</span>
                <button
                  v-if="!readonly"
                  type="button"
                  class="remove-btn"
                  @click="removeProduct(product.id)"
                >
                  ×
                </button>
              </div>
              <WrapperDropdown
                v-if="!readonly"
                v-model="productToAdd"
                :items="availableProducts"
                placeholder="Ajouter un produit..."
                key-id="id"
                key-label="label"
                @update:model-value="addProduct"
              />
            </div>
          </WrapperFormElements>

          <WrapperFormElements label="Ressources liées">
            <div class="multi-select-wrapper">
              <div
                v-for="resource in selectedResources"
                :key="resource.id"
                class="selected-item"
              >
                <span>{{ resource.title }}</span>
                <button
                  v-if="!readonly"
                  type="button"
                  class="remove-btn"
                  @click="removeResource(resource.id)"
                >
                  ×
                </button>
              </div>
              <WrapperDropdown
                v-if="!readonly"
                v-model="resourceToAdd"
                :items="availableResources"
                placeholder="Ajouter une ressource..."
                key-id="id"
                key-label="label"
                @update:model-value="addResource"
              />
            </div>
          </WrapperFormElements>
        </div>

        <!-- Section Traductions (i18n) -->
        <div class="translations-section" v-if="!readonly">
          <div
            class="translations-header"
            @click="showTranslations = !showTranslations"
          >
            <BasicText size="body-l" weight="bold" color="primary-700">
              🌐 Traductions (Multilingue)
            </BasicText>
            <BasicText size="body-s" color="neutral-500">
              {{ showTranslations ? '▼' : '▶' }} Cliquez pour {{ showTranslations ? 'masquer' : 'afficher' }}
            </BasicText>
          </div>

          <div v-if="showTranslations" class="translations-content">
            <div class="language-group">
              <BasicText size="body-m" weight="bold" color="primary-600" class="language-title">
                🇬🇧 English
              </BasicText>
              <WrapperInput
                v-model="termEn"
                label="Term (EN)"
                placeholder="Ex: Lyophilization"
              />
              <WrapperFormElements label="Definition (EN)">
                <textarea
                  v-model="definitionEn"
                  rows="4"
                  class="custom-textarea"
                  placeholder="Definition in English..."
                />
              </WrapperFormElements>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #actions>
      <PremiumButton
        v-if="!readonly"
        :label="isEditMode ? 'Mettre à jour' : 'Créer le terme'"
        type="primary"
        :loading="loading"
        @click="handleSubmit"
      />
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
import {
  createGlossaryTerm,
  fetchGlossaryTermById,
  updateGlossaryTerm,
} from '@/api/supabase/glossary'
import { fetchProducts } from '@/api/supabase/products'
import { fetchAllResourcesAdmin } from '@/api/supabase/resources'
import type { Products, Resources } from '@/supabase/types/supabase.types'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import type { InputModel } from '@designSystem/index'
import { computed, onMounted, ref, watch } from 'vue'

interface GlossaryForm {
  term: string
  slug: string
  definition: string
  meta_description: string
  status: string
  related_product_ids: string[]
  related_resource_ids: string[]
  term_i18n: Record<string, string>
  definition_i18n: Record<string, string>
}

const visible = defineModel<boolean>()
const props = defineProps<{ termId?: string | null; readonly?: boolean }>()
const emit = defineEmits(['saved'])
const toast = useToastStore()

const loading = ref(false)

const statusOptions = [
  { id: 'draft', label: 'Brouillon' },
  { id: 'published', label: 'Publié' },
]

const form = ref<GlossaryForm>({
  term: '',
  slug: '',
  definition: '',
  meta_description: '',
  status: 'draft',
  related_product_ids: [],
  related_resource_ids: [],
  term_i18n: {},
  definition_i18n: {},
})

// Traductions
const showTranslations = ref(false)
const termEn = ref('')
const definitionEn = ref('')

// Produits et ressources
const allProducts = ref<Products[]>([])
const allResources = ref<Resources[]>([])
const productToAdd = ref('')
const resourceToAdd = ref('')

const isEditMode = computed(() => !!props.termId)
const readonly = computed(() => !!props.readonly)
const headerTitle = computed(() =>
  readonly.value
    ? 'Détails du terme'
    : isEditMode.value
      ? 'Modifier un terme'
      : 'Ajouter un terme',
)

// Produits sélectionnés
const selectedProducts = computed(() =>
  allProducts.value.filter((p) => form.value.related_product_ids.includes(p.id)),
)

const availableProducts = computed(() =>
  allProducts.value
    .filter((p) => !form.value.related_product_ids.includes(p.id))
    .map((p) => ({ id: p.id, label: `${p.name} (${p.dosage})` })),
)

// Ressources sélectionnées
const selectedResources = computed(() =>
  allResources.value.filter((r) => form.value.related_resource_ids.includes(r.id)),
)

const availableResources = computed(() =>
  allResources.value
    .filter((r) => !form.value.related_resource_ids.includes(r.id))
    .map((r) => ({ id: r.id, label: r.title })),
)

function addProduct(value: unknown) {
  const productId = typeof value === 'string' ? value : null
  if (productId && !form.value.related_product_ids.includes(productId)) {
    form.value.related_product_ids.push(productId)
  }
  productToAdd.value = ''
}

function removeProduct(productId: string) {
  form.value.related_product_ids = form.value.related_product_ids.filter((id) => id !== productId)
}

function addResource(value: unknown) {
  const resourceId = typeof value === 'string' ? value : null
  if (resourceId && !form.value.related_resource_ids.includes(resourceId)) {
    form.value.related_resource_ids.push(resourceId)
  }
  resourceToAdd.value = ''
}

function removeResource(resourceId: string) {
  form.value.related_resource_ids = form.value.related_resource_ids.filter((id) => id !== resourceId)
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function loadData() {
  // Charger produits et ressources
  const [products, resources] = await Promise.all([
    fetchProducts(),
    fetchAllResourcesAdmin(),
  ])
  allProducts.value = products
  allResources.value = resources
}

async function loadTerm() {
  if (!props.termId) return
  try {
    const data = await fetchGlossaryTermById(props.termId)
    if (!data) return toast.show('Terme introuvable', 'warning')

    form.value = {
      term: data.term,
      slug: data.slug,
      definition: data.definition,
      meta_description: data.meta_description || '',
      status: data.status || 'draft',
      related_product_ids: data.related_product_ids || [],
      related_resource_ids: data.related_resource_ids || [],
      term_i18n: (data.term_i18n as Record<string, string>) || {},
      definition_i18n: (data.definition_i18n as Record<string, string>) || {},
    }

    // Extraire traductions
    termEn.value = form.value.term_i18n?.en || ''
    definitionEn.value = form.value.definition_i18n?.en || ''
  } catch (err) {
    toast.show('Erreur chargement terme', 'danger')
  }
}

async function handleSubmit() {
  if (!form.value.term.trim()) {
    return toast.show('Le terme est obligatoire', 'warning')
  }
  if (!form.value.definition.trim()) {
    return toast.show('La définition est obligatoire', 'warning')
  }

  loading.value = true

  try {
    // Générer le slug si vide
    const slug = form.value.slug.trim() || generateSlug(form.value.term)

    // Construire les objets i18n
    const term_i18n: Record<string, string> = {}
    const definition_i18n: Record<string, string> = {}

    if (termEn.value.trim()) term_i18n.en = termEn.value.trim()
    if (definitionEn.value.trim()) definition_i18n.en = definitionEn.value.trim()

    const payload = {
      term: form.value.term.trim(),
      slug,
      definition: form.value.definition.trim(),
      meta_description: form.value.meta_description.trim() || null,
      status: form.value.status,
      related_product_ids: form.value.related_product_ids,
      related_resource_ids: form.value.related_resource_ids,
      term_i18n,
      definition_i18n,
    }

    if (isEditMode.value && props.termId) {
      await updateGlossaryTerm(props.termId, payload)
      toast.show('Terme mis à jour ✅', 'success')
    } else {
      await createGlossaryTerm(payload)
      toast.show('Terme créé ✅', 'success')
    }

    emit('saved')
    visible.value = false
  } catch (err: any) {
    toast.show(`Erreur : ${err.message}`, 'danger')
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.value = {
    term: '',
    slug: '',
    definition: '',
    meta_description: '',
    status: 'draft',
    related_product_ids: [],
    related_resource_ids: [],
    term_i18n: {},
    definition_i18n: {},
  }
  termEn.value = ''
  definitionEn.value = ''
  showTranslations.value = false
}

onMounted(async () => {
  await loadData()
  if (props.termId) {
    await loadTerm()
  }
})

watch(visible, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

watch(
  () => props.termId,
  async (newId) => {
    if (newId) {
      await loadTerm()
    } else {
      resetForm()
    }
  },
)
</script>

<style scoped lang="less">
.glossary-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.custom-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-default);
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  background: var(--bg-surface);
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.1);
  }

  &:read-only {
    background: var(--bg-subtle);
    cursor: not-allowed;
  }
}

.related-section {
  margin-top: 8px;
  padding: 16px;
  background: var(--bg-subtle);
  border-radius: 10px;
}

.section-title {
  margin-bottom: 16px;
}

.multi-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-primary);
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: var(--danger-100);
  color: var(--danger-600);
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background: var(--danger-200);
  }
}

.translations-section {
  margin-top: 8px;
  padding: 16px;
  background: var(--bg-subtle);
  border-radius: 10px;
}

.translations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
}

.translations-content {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.language-group {
  padding: 16px;
  background: var(--bg-surface);
  border-radius: 8px;
  border: 1px solid var(--border-default);
}

.language-title {
  margin-bottom: 12px;
}
</style>
