<!--
  Indicateur de force de mot de passe PREMIUM
  Style grands retailers (Apple, Stripe, etc.)

  Features:
  - Barre de progression animée avec dégradé
  - Checklist des critères en temps réel
  - Feedback visuel immédiat
  - Animations fluides
-->
<template>
  <div class="password-strength" :class="{ 'password-strength--visible': modelValue && modelValue.length > 0 }">
    <!-- Barre de progression -->
    <div class="password-strength__bar">
      <div
        class="password-strength__fill"
        :style="{
          width: `${(strength.score / 4) * 100}%`,
          background: strengthGradient
        }"
      />
    </div>

    <!-- Label et score -->
    <div class="password-strength__header">
      <span class="password-strength__label" :style="{ color: strength.color }">
        {{ strengthLabel }}
      </span>
      <div class="password-strength__dots">
        <span
          v-for="i in 4"
          :key="i"
          class="password-strength__dot"
          :class="{ 'password-strength__dot--active': i <= strength.score }"
          :style="{ background: i <= strength.score ? strength.color : undefined }"
        />
      </div>
    </div>

    <!-- Checklist des critères -->
    <Transition name="expand">
      <div v-if="showChecklist && modelValue" class="password-strength__checklist">
        <div
          v-for="criterion in criteria"
          :key="criterion.key"
          class="password-strength__criterion"
          :class="{ 'password-strength__criterion--valid': criterion.valid }"
        >
          <div class="password-strength__criterion-icon">
            <Transition name="scale" mode="out-in">
              <svg v-if="criterion.valid" key="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <svg v-else key="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </Transition>
          </div>
          <span class="password-strength__criterion-text">{{ criterion.label }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<{
  modelValue?: string
  /** Afficher la checklist des critères */
  showChecklist?: boolean
  /** Force minimale requise (0-4) */
  minStrength?: number
}>(), {
  modelValue: '',
  showChecklist: true,
  minStrength: 2,
})

const emit = defineEmits<{
  (e: 'strength-change', payload: { score: number; valid: boolean; label: string }): void
}>()

const { t, te } = useI18n()

// Critères de validation
const criteria = computed(() => {
  const pwd = props.modelValue || ''
  return [
    {
      key: 'length',
      label: te('validation.password.minLength') ? t('validation.password.minLength') : 'Au moins 8 caractères',
      valid: pwd.length >= 8,
    },
    {
      key: 'lowercase',
      label: te('validation.password.lowercase') ? t('validation.password.lowercase') : 'Une lettre minuscule',
      valid: /[a-z]/.test(pwd),
    },
    {
      key: 'uppercase',
      label: te('validation.password.uppercase') ? t('validation.password.uppercase') : 'Une lettre majuscule',
      valid: /[A-Z]/.test(pwd),
    },
    {
      key: 'number',
      label: te('validation.password.number') ? t('validation.password.number') : 'Un chiffre',
      valid: /\d/.test(pwd),
    },
    {
      key: 'special',
      label: te('validation.password.special') ? t('validation.password.special') : 'Un caractère spécial',
      valid: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ]
})

// Calcul de la force
const strength = computed(() => {
  const pwd = props.modelValue || ''

  if (!pwd) {
    return { score: 0, color: 'var(--color-neutral-300)', label: 'veryWeak' }
  }

  let score = 0

  // Critères de base
  if (pwd.length >= 8) score += 1
  if (pwd.length >= 12) score += 0.5
  if (/[a-z]/.test(pwd)) score += 0.5
  if (/[A-Z]/.test(pwd)) score += 0.5
  if (/\d/.test(pwd)) score += 0.5
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score += 1

  // Pénalités
  if (/(.)\1{2,}/.test(pwd)) score -= 0.5 // Répétitions
  if (/(?:012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210)/.test(pwd)) score -= 0.5 // Séquences

  // Mots de passe courants
  const common = ['password', 'azerty', 'qwerty', '123456', 'motdepasse', 'admin']
  if (common.some(p => pwd.toLowerCase().includes(p))) score = 0

  const normalizedScore = Math.max(0, Math.min(4, Math.round(score)))

  const colors: Record<number, string> = {
    0: 'var(--color-danger-500)',
    1: 'var(--color-warning-500)',
    2: 'var(--color-warning-400)',
    3: 'var(--color-success-400)',
    4: 'var(--color-success-500)',
  }

  const labels: Record<number, string> = {
    0: 'veryWeak',
    1: 'weak',
    2: 'fair',
    3: 'strong',
    4: 'veryStrong',
  }

  return {
    score: normalizedScore,
    color: colors[normalizedScore],
    label: labels[normalizedScore],
  }
})

// Dégradé pour la barre
const strengthGradient = computed(() => {
  const score = strength.value.score
  if (score <= 1) return 'linear-gradient(90deg, var(--color-danger-500), var(--color-danger-400))'
  if (score === 2) return 'linear-gradient(90deg, var(--color-warning-500), var(--color-warning-400))'
  if (score === 3) return 'linear-gradient(90deg, var(--color-success-400), var(--color-success-500))'
  return 'linear-gradient(90deg, var(--color-success-500), #059669)'
})

// Labels traduits
const strengthLabel = computed(() => {
  const labels: Record<string, string> = {
    veryWeak: te('validation.password.levels.veryWeak') ? t('validation.password.levels.veryWeak') : 'Très faible',
    weak: te('validation.password.levels.weak') ? t('validation.password.levels.weak') : 'Faible',
    fair: te('validation.password.levels.fair') ? t('validation.password.levels.fair') : 'Moyen',
    strong: te('validation.password.levels.strong') ? t('validation.password.levels.strong') : 'Fort',
    veryStrong: te('validation.password.levels.veryStrong') ? t('validation.password.levels.veryStrong') : 'Très fort',
  }
  const label = strength.value.label
  return label ? (labels[label] ?? '') : ''
})

// Émettre les changements
watch(strength, (newStrength) => {
  emit('strength-change', {
    score: newStrength.score,
    valid: newStrength.score >= props.minStrength,
    label: newStrength.label ?? 'veryWeak',
  })
}, { immediate: true })
</script>

<style scoped lang="less">
.password-strength {
  --transition-duration: 0.3s;
  --transition-easing: cubic-bezier(0.4, 0, 0.2, 1);

  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--color-neutral-50);
  border: 1px solid var(--color-neutral-200);
  border-radius: 12px;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition:
    opacity var(--transition-duration) var(--transition-easing),
    max-height var(--transition-duration) var(--transition-easing),
    padding var(--transition-duration) var(--transition-easing),
    margin var(--transition-duration) var(--transition-easing);
  margin-top: 0;
  padding: 0 16px;

  &--visible {
    opacity: 1;
    max-height: 300px;
    padding: 16px;
    margin-top: 12px;
  }

  // Barre de progression
  &__bar {
    height: 6px;
    background: var(--color-neutral-200);
    border-radius: 3px;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    border-radius: 3px;
    transition:
      width 0.4s var(--transition-easing),
      background 0.3s var(--transition-easing);
  }

  // Header
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__label {
    font-size: 13px;
    font-weight: 600;
    transition: color 0.3s var(--transition-easing);
  }

  &__dots {
    display: flex;
    gap: 4px;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-neutral-300);
    transition:
      background 0.3s var(--transition-easing),
      transform 0.3s var(--transition-easing);

    &--active {
      transform: scale(1.05);
    }
  }

  // Checklist
  &__checklist {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid var(--color-neutral-200);
  }

  &__criterion {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--color-neutral-500);
    transition: color 0.3s var(--transition-easing);

    &--valid {
      color: var(--color-success-600);

      .password-strength__criterion-icon {
        background: var(--color-success-100);
        color: var(--color-success-600);
      }
    }
  }

  &__criterion-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-neutral-200);
    border-radius: 50%;
    color: var(--color-neutral-400);
    transition:
      background 0.3s var(--transition-easing),
      color 0.3s var(--transition-easing);

    svg {
      width: 12px;
      height: 12px;
    }
  }

  &__criterion-text {
    flex: 1;
  }
}

// Transitions
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>
