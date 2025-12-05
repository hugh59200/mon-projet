<template>
  <div class="review-modal-overlay" @click.self="$emit('close')">
    <div class="review-modal">
      <header class="modal-header">
        <h3>Donner mon avis</h3>
        <p class="product-name">{{ productName }}</p>
        <button type="button" class="close-btn" @click="$emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      <form @submit.prevent="submitReview" class="review-form">
        <!-- Note globale -->
        <div class="form-group rating-group">
          <label class="form-label required">Note globale</label>
          <div class="rating-input">
            <StarRating v-model="form.rating" :interactive="true" />
            <span class="rating-text">{{ getRatingText(form.rating) }}</span>
          </div>
        </div>

        <!-- Titre -->
        <div class="form-group">
          <label class="form-label">Titre de votre avis</label>
          <BasicInput v-model="form.title" placeholder="Résumez votre expérience en une phrase" />
        </div>

        <!-- Contenu -->
        <div class="form-group">
          <label class="form-label">Votre avis détaillé</label>
          <textarea
            v-model="form.content"
            class="form-textarea"
            rows="4"
            placeholder="Partagez votre expérience avec ce produit..."
          ></textarea>
        </div>

        <!-- Notes détaillées (optionnel) -->
        <div class="detailed-ratings-section">
          <button type="button" class="toggle-detailed" @click="showDetailedRatings = !showDetailedRatings">
            {{ showDetailedRatings ? 'Masquer' : 'Ajouter' }} les notes détaillées
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              :class="{ rotated: showDetailedRatings }"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div v-if="showDetailedRatings" class="detailed-ratings-grid">
            <div class="rating-row">
              <label>Qualité</label>
              <StarRating v-model="form.rating_quality" :interactive="true" />
            </div>
            <div class="rating-row">
              <label>Pureté</label>
              <StarRating v-model="form.rating_purity" :interactive="true" />
            </div>
            <div class="rating-row">
              <label>Livraison</label>
              <StarRating v-model="form.rating_shipping" :interactive="true" />
            </div>
            <div class="rating-row">
              <label>Rapport qualité/prix</label>
              <StarRating v-model="form.rating_value" :interactive="true" />
            </div>
          </div>
        </div>

        <!-- Informations professionnelles (optionnel) -->
        <div class="professional-section">
          <button type="button" class="toggle-detailed" @click="showProfessionalInfo = !showProfessionalInfo">
            {{ showProfessionalInfo ? 'Masquer' : 'Ajouter' }} mes informations professionnelles
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              :class="{ rotated: showProfessionalInfo }"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div v-if="showProfessionalInfo" class="professional-grid">
            <div class="form-group">
              <label class="form-label">Titre / Fonction</label>
              <BasicInput v-model="form.author_title" placeholder="Ex: PhD Researcher, Lab Technician" />
            </div>
            <div class="form-group">
              <label class="form-label">Institution</label>
              <BasicInput v-model="form.author_institution" placeholder="Ex: Université de Paris" />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <footer class="form-footer">
          <p class="moderation-notice">
            Votre avis sera publié après modération.
          </p>
          <div class="form-actions">
            <BasicButton type="button" variant="ghost" @click="$emit('close')">Annuler</BasicButton>
            <BasicButton type="submit" :disabled="!isValid || isSubmitting">
              {{ isSubmitting ? 'Envoi...' : 'Publier mon avis' }}
            </BasicButton>
          </div>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { createReview } from '@/api'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import StarRating from './StarRating.vue'

// ============================================
// PROPS & EMITS
// ============================================

const props = defineProps<{
  productId: string
  productName: string
}>()

const emit = defineEmits<{
  close: []
  submitted: []
}>()

// ============================================
// STATE
// ============================================

const authStore = useAuthStore()
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

// ============================================
// COMPUTED
// ============================================

const isValid = computed(() => {
  return form.rating >= 1 && form.rating <= 5
})

// ============================================
// METHODS
// ============================================

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
.review-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-15);
}

.review-modal {
  background: var(--color-background);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  position: relative;
  padding: var(--spacing-20);
  border-bottom: 1px solid var(--color-border);

  h3 {
    margin: 0;
    font-size: var(--font-size-h4);
  }

  .product-name {
    margin: var(--spacing-5) 0 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-body-s);
  }

  .close-btn {
    position: absolute;
    top: var(--spacing-15);
    right: var(--spacing-15);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: var(--spacing-5);

    &:hover {
      color: var(--color-text);
    }
  }
}

.review-form {
  padding: var(--spacing-20);
}

.form-group {
  margin-bottom: var(--spacing-15);

  .form-label {
    display: block;
    margin-bottom: var(--spacing-5);
    font-weight: 500;
    font-size: var(--font-size-body-s);

    &.required::after {
      content: ' *';
      color: var(--color-error);
    }
  }
}

.rating-group {
  .rating-input {
    display: flex;
    align-items: center;
    gap: var(--spacing-10);
  }

  .rating-text {
    font-size: var(--font-size-body-s);
    color: var(--color-text-secondary);
  }
}

.form-textarea {
  width: 100%;
  padding: var(--spacing-10);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: var(--font-size-body);
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

.toggle-detailed {
  display: flex;
  align-items: center;
  gap: var(--spacing-5);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-primary);
  font-size: var(--font-size-body-s);
  padding: 0;
  margin-bottom: var(--spacing-10);

  svg {
    transition: transform 0.2s ease;

    &.rotated {
      transform: rotate(180deg);
    }
  }
}

.detailed-ratings-section,
.professional-section {
  margin-bottom: var(--spacing-15);
  padding-top: var(--spacing-10);
  border-top: 1px solid var(--color-border);
}

.detailed-ratings-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-10);
}

.rating-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  label {
    font-size: var(--font-size-body-s);
    color: var(--color-text-secondary);
  }
}

.professional-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-10);
}

.form-footer {
  margin-top: var(--spacing-20);
  padding-top: var(--spacing-15);
  border-top: 1px solid var(--color-border);

  .moderation-notice {
    font-size: var(--font-size-body-s);
    color: var(--color-text-secondary);
    margin: 0 0 var(--spacing-15);
    text-align: center;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-10);
  }
}
</style>
