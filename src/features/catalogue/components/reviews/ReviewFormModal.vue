<template>
  <ModalComponent v-model="isOpen" @close="$emit('close')">
    <template #header>
      Donner mon avis sur {{ productName }}
    </template>

    <template #content>
      <form @submit.prevent="submitReview" class="review-form">
        <!-- Note globale -->
        <div class="review-form__rating">
          <BasicText weight="semibold" color="neutral-700">Note globale *</BasicText>
          <div class="review-form__stars">
            <StarRating v-model="form.rating" :interactive="true" size="lg" />
            <BasicText size="body-s" :color="form.rating > 0 ? 'primary-600' : 'neutral-400'">
              {{ getRatingText(form.rating) }}
            </BasicText>
          </div>
        </div>

        <!-- Titre -->
        <WrapperInput
          v-model="form.title"
          label="Titre de votre avis"
          placeholder="Résumez votre expérience en une phrase"
        />

        <!-- Contenu -->
        <WrapperFormElements label="Votre avis détaillé">
          <textarea
            v-model="form.content"
            class="review-form__textarea"
            rows="3"
            placeholder="Partagez votre expérience avec ce produit..."
          ></textarea>
        </WrapperFormElements>

        <!-- Notes détaillées -->
        <FilterSection v-model="showDetailedRatings" title="Notes détaillées (optionnel)">
          <div class="review-form__rating-grid">
            <div class="review-form__rating-row">
              <span>Qualité</span>
              <StarRating v-model="form.rating_quality" :interactive="true" size="sm" />
            </div>
            <div class="review-form__rating-row">
              <span>Pureté</span>
              <StarRating v-model="form.rating_purity" :interactive="true" size="sm" />
            </div>
            <div class="review-form__rating-row">
              <span>Livraison</span>
              <StarRating v-model="form.rating_shipping" :interactive="true" size="sm" />
            </div>
            <div class="review-form__rating-row">
              <span>Rapport Q/P</span>
              <StarRating v-model="form.rating_value" :interactive="true" size="sm" />
            </div>
          </div>
        </FilterSection>

        <!-- Informations professionnelles -->
        <FilterSection v-model="showProfessionalInfo" title="Informations professionnelles (optionnel)">
          <WrapperInput
            v-model="form.author_title"
            label="Titre / Fonction"
            placeholder="Ex: PhD Researcher"
          />
          <WrapperInput
            v-model="form.author_institution"
            label="Institution"
            placeholder="Ex: Université de Paris"
          />
        </FilterSection>

        <!-- Notice -->
        <div class="review-form__notice">
          <BasicIconNext name="Info" :size="14" />
          <BasicText size="body-s" color="neutral-500">Votre avis sera publié après modération</BasicText>
        </div>
      </form>
    </template>

    <template #actions>
      <PremiumButton
        type="secondary"
        variant="outline"
        label="Annuler"
        @click="$emit('close')"
      />
      <PremiumButton
        type="primary"
        :label="isSubmitting ? 'Envoi...' : 'Publier mon avis'"
        :disabled="!isValid"
        :loading="isSubmitting"
        @click="submitReview"
      />
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { createReview } from '@/api'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
import FilterSection from '@/features/shared/components/FilterSection.vue'
import StarRating from './StarRating.vue'

const props = defineProps<{
  productId: string
  productName: string
}>()

const emit = defineEmits<{
  close: []
  submitted: []
}>()

const authStore = useAuthStore()
const isOpen = ref(true)
const isSubmitting = ref(false)
const showDetailedRatings = ref(false)
const showProfessionalInfo = ref(false)

const form = reactive({
  rating: 0,
  title: '',
  content: '',
  rating_quality: 0,
  rating_purity: 0,
  rating_shipping: 0,
  rating_value: 0,
  author_title: '',
  author_institution: '',
})

// Propager la fermeture vers le parent
watch(isOpen, (value) => {
  if (!value) {
    emit('close')
  }
})

const isValid = computed(() => {
  return form.rating >= 1 && form.rating <= 5
})

function getRatingText(rating: number): string {
  const texts: Record<number, string> = {
    1: 'Très mauvais',
    2: 'Mauvais',
    3: 'Moyen',
    4: 'Bien',
    5: 'Excellent',
  }
  return texts[rating] || 'Sélectionnez une note'
}

async function submitReview() {
  if (!isValid.value || isSubmitting.value) return

  isSubmitting.value = true

  try {
    await createReview({
      product_id: props.productId,
      user_id: authStore.user?.id,
      author_name: authStore.user?.email?.split('@')[0] || 'Anonyme',
      rating: form.rating,
      title: form.title || undefined,
      content: form.content || undefined,
      rating_quality: form.rating_quality || undefined,
      rating_purity: form.rating_purity || undefined,
      rating_shipping: form.rating_shipping || undefined,
      rating_value: form.rating_value || undefined,
      author_title: form.author_title || undefined,
      author_institution: form.author_institution || undefined,
    })

    emit('submitted')
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="less">
@import '@designSystem/fondation/colors/colors.less';

.review-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px;

  &__rating {
    text-align: center;
    padding: 20px;
    background: @neutral-50;
    border-radius: 12px;
    border: 1px solid @neutral-200;
  }

  &__stars {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
  }

  &__textarea {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid @neutral-200;
    border-radius: 10px;
    font-family: inherit;
    font-size: 14px;
    color: @neutral-800;
    background: white;
    resize: vertical;
    min-height: 80px;
    transition: border-color 0.2s ease;
    box-sizing: border-box;

    &::placeholder {
      color: @neutral-400;
    }

    &:focus {
      outline: none;
      border-color: var(--primary-500);
    }
  }

  &__rating-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  &__rating-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: white;
    border-radius: 8px;
    border: 1px solid @neutral-100;

    span {
      font-size: 13px;
      color: @neutral-600;
    }
  }

  &__notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    background: @neutral-50;
    border-radius: 8px;
    margin: 0;

    :deep(svg) {
      color: @neutral-400;
      fill: @neutral-400;
      flex-shrink: 0;
    }
  }
}
</style>
