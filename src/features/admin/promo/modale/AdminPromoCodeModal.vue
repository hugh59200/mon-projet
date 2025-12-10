<template>
  <ModalComponent
    v-model="visible"
    closable
  >
    <template #header>
      {{ isEditMode ? 'Modifier le code promo' : 'Nouveau code promo' }}
    </template>

    <template #content>
      <div class="promo-form">
        <!-- Identité -->
        <div class="form-section">
          <BasicText size="body-s" weight="bold" color="neutral-500" class="section-title">
            Identité du code
          </BasicText>

          <div class="form-row">
            <WrapperInput
              v-model="form.code"
              label="Code"
              placeholder="Ex : WELCOME10"
              required
              :disabled="isEditMode"
              class="flex-grow-1"
              @input="form.code = form.code.toUpperCase()"
            />
            <div class="flex-grow-1">
              <WrapperCheckbox
                v-model="form.active"
                label="Code actif"
              />
            </div>
          </div>

          <WrapperInput
            v-model="form.description"
            label="Description (interne)"
            placeholder="Ex : Code de bienvenue pour les nouveaux clients"
            class="full-width"
          />
        </div>

        <!-- Type de remise -->
        <div class="form-section">
          <BasicText size="body-s" weight="bold" color="neutral-500" class="section-title">
            Type de remise
          </BasicText>

          <div class="discount-type-selector">
            <div
              class="discount-type-option"
              :class="{ 'discount-type-option--active': form.discount_type === 'percentage' }"
              @click="form.discount_type = 'percentage'"
            >
              <BasicIconNext name="Percent" :size="20" />
              <span>Pourcentage</span>
            </div>
            <div
              class="discount-type-option"
              :class="{ 'discount-type-option--active': form.discount_type === 'fixed' }"
              @click="form.discount_type = 'fixed'"
            >
              <BasicIconNext name="Euro" :size="20" />
              <span>Montant fixe</span>
            </div>
          </div>

          <div class="form-row">
            <WrapperInput
              :model-value="form.discount_value?.toString()"
              @update:model-value="(v) => (form.discount_value = parseFloat(v || '0'))"
              :label="form.discount_type === 'percentage' ? 'Réduction (%)' : 'Réduction (€)'"
              :placeholder="form.discount_type === 'percentage' ? 'Ex : 10' : 'Ex : 5.00'"
              type="number"
              min="0"
              :max="form.discount_type === 'percentage' ? 100 : undefined"
              step="0.01"
              required
              class="flex-grow-1"
            />
            <WrapperInput
              v-if="form.discount_type === 'percentage'"
              :model-value="form.max_discount_amount?.toString() || ''"
              @update:model-value="(v) => (form.max_discount_amount = v ? parseFloat(v) : null)"
              label="Plafond max (€)"
              placeholder="Ex : 50 (optionnel)"
              type="number"
              min="0"
              step="0.01"
              class="flex-grow-1"
            />
          </div>
        </div>

        <!-- Conditions -->
        <div class="form-section">
          <BasicText size="body-s" weight="bold" color="neutral-500" class="section-title">
            Conditions d'utilisation
          </BasicText>

          <div class="form-row">
            <WrapperInput
              :model-value="form.min_order_amount?.toString() || ''"
              @update:model-value="(v) => (form.min_order_amount = v ? parseFloat(v) : 0)"
              label="Montant minimum (€)"
              placeholder="0 = pas de minimum"
              type="number"
              min="0"
              step="0.01"
              class="flex-grow-1"
            />
            <WrapperInput
              :model-value="form.max_uses?.toString() || ''"
              @update:model-value="(v) => (form.max_uses = v ? parseInt(v) : null)"
              label="Limite totale d'utilisations"
              placeholder="Vide = illimité"
              type="number"
              min="0"
              step="1"
              class="flex-grow-1"
            />
          </div>

          <WrapperInput
            :model-value="form.max_uses_per_user?.toString() || ''"
            @update:model-value="(v) => (form.max_uses_per_user = v ? parseInt(v) : null)"
            label="Limite par utilisateur"
            placeholder="1 = une seule utilisation par client"
            type="number"
            min="0"
            step="1"
            class="flex-grow-1"
          />
        </div>

        <!-- Validité -->
        <div class="form-section">
          <BasicText size="body-s" weight="bold" color="neutral-500" class="section-title">
            Période de validité
          </BasicText>

          <div class="form-row">
            <WrapperInput
              v-model="form.valid_from"
              label="Date de début"
              type="datetime-local"
              class="flex-grow-1"
            />
            <WrapperInput
              v-model="form.valid_until"
              label="Date de fin"
              type="datetime-local"
              class="flex-grow-1"
            />
          </div>

          <p class="form-hint">
            Laissez vide pour un code sans limite de temps.
          </p>
        </div>

        <!-- Statistiques (mode édition uniquement) -->
        <div
          v-if="isEditMode && originalCode"
          class="form-section form-section--stats"
        >
          <BasicText size="body-s" weight="bold" color="neutral-500" class="section-title">
            Statistiques
          </BasicText>

          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">{{ originalCode.current_uses }}</span>
              <span class="stat-label">Utilisations</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ formatDate(originalCode.created_at) }}</span>
              <span class="stat-label">Créé le</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #actions>
      <PremiumButton
        label="Annuler"
        type="secondary"
        variant="ghost"
        @click="visible = false"
      />
      <PremiumButton
        :label="isEditMode ? 'Enregistrer' : 'Créer le code'"
        type="primary"
        :loading="isSaving"
        :disabled="!isValid"
        @click="handleSubmit"
      />
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch, onMounted } from 'vue'
  import { supabaseUntyped as supabase } from '@/supabase/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import {
    createPromoCode,
    updatePromoCode,
    type PromoCode,
    type PromoCodeDiscountType,
  } from '@/api/supabase/promo'

  const visible = defineModel<boolean>()

  const props = defineProps<{
    codeId?: string
  }>()

  const emit = defineEmits<{
    saved: []
  }>()

  const toast = useToastStore()

  const isEditMode = computed(() => !!props.codeId)
  const isSaving = ref(false)
  const originalCode = ref<PromoCode | null>(null)

  const form = reactive({
    code: '',
    description: '',
    discount_type: 'percentage' as PromoCodeDiscountType,
    discount_value: 10,
    min_order_amount: 0,
    max_discount_amount: null as number | null,
    max_uses: null as number | null,
    max_uses_per_user: 1 as number | null,
    valid_from: '',
    valid_until: '',
    active: true,
  })

  const isValid = computed(() => {
    if (!form.code.trim()) return false
    if (form.discount_value <= 0) return false
    if (form.discount_type === 'percentage' && form.discount_value > 100) return false
    return true
  })

  watch(visible, (val) => {
    if (val) {
      if (props.codeId) {
        loadCode()
      } else {
        resetForm()
      }
    }
  })

  onMounted(() => {
    if (visible.value && props.codeId) {
      loadCode()
    }
  })

  async function loadCode() {
    if (!props.codeId) return

    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('id', props.codeId)
        .single()

      if (error) throw error

      originalCode.value = data as PromoCode

      form.code = data.code
      form.description = data.description || ''
      form.discount_type = data.discount_type as PromoCodeDiscountType
      form.discount_value = data.discount_value
      form.min_order_amount = data.min_order_amount || 0
      form.max_discount_amount = data.max_discount_amount
      form.max_uses = data.max_uses
      form.max_uses_per_user = data.max_uses_per_user ?? 1
      form.valid_from = data.valid_from ? formatDateTimeLocal(data.valid_from) : ''
      form.valid_until = data.valid_until ? formatDateTimeLocal(data.valid_until) : ''
      form.active = data.active
    } catch (err: any) {
      toast.show(`Erreur chargement : ${err.message}`, 'danger')
      visible.value = false
    }
  }

  function resetForm() {
    form.code = ''
    form.description = ''
    form.discount_type = 'percentage'
    form.discount_value = 10
    form.min_order_amount = 0
    form.max_discount_amount = null
    form.max_uses = null
    form.max_uses_per_user = 1
    form.valid_from = ''
    form.valid_until = ''
    form.active = true
    originalCode.value = null
  }

  async function handleSubmit() {
    if (!isValid.value) return

    isSaving.value = true

    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        description: form.description.trim() || null,
        discount_type: form.discount_type,
        discount_value: form.discount_value,
        min_order_amount: form.min_order_amount || 0,
        max_discount_amount: form.discount_type === 'percentage' ? form.max_discount_amount : null,
        max_uses: form.max_uses,
        max_uses_per_user: form.max_uses_per_user,
        valid_from: form.valid_from ? new Date(form.valid_from).toISOString() : null,
        valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : null,
        active: form.active,
      }

      if (isEditMode.value && props.codeId) {
        await updatePromoCode(props.codeId, payload)
        toast.show('Code promo mis à jour', 'success')
      } else {
        await createPromoCode(payload as any)
        toast.show('Code promo créé', 'success')
      }

      emit('saved')
      visible.value = false
    } catch (err: any) {
      toast.show(`Erreur : ${err.message}`, 'danger')
    } finally {
      isSaving.value = false
    }
  }

  function formatDateTimeLocal(isoString: string): string {
    const date = new Date(isoString)
    return date.toISOString().slice(0, 16)
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '—'
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr))
  }
</script>

<style scoped lang="less">
  .promo-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 560px;
  }

  .form-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--content-block-border);

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    &--stats {
      background: var(--content-block-bg-subtle);
      padding: 16px;
      border-radius: 12px;
      border-bottom: none;
    }
  }

  .section-title {
    margin-bottom: 4px;
  }

  .form-row {
    display: flex;
    gap: 16px;

    .respond-mobile({
      flex-direction: column;
    });
  }

  .flex-grow-1 {
    flex: 1;
  }

  .full-width {
    width: 100%;
  }

  .discount-type-selector {
    display: flex;
    gap: 12px;
  }

  .discount-type-option {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 16px;
    background: var(--content-block-bg-subtle);
    border: 2px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 500;
    color: var(--content-block-text-secondary);

    &:hover {
      background: rgba(var(--primary-500-rgb), 0.08);
    }

    &--active {
      background: var(--primary-50);
      border-color: var(--primary-500);
      color: var(--primary-700);

      svg {
        color: var(--primary-500);
      }
    }
  }

  .form-hint {
    font-size: 12px;
    color: var(--content-block-text-muted);
    margin: 0;
    font-style: italic;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-value {
    font-size: 18px;
    font-weight: 600;
    color: var(--content-block-text);
  }

  .stat-label {
    font-size: 12px;
    color: var(--content-block-text-muted);
  }
</style>
