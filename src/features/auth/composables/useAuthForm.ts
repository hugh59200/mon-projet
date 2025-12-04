/**
 * Composable de gestion des formulaires d'authentification
 * Version PREMIUM avec validation professionnelle
 *
 * Features:
 * - Validation temps réel
 * - Force de mot de passe
 * - Confirmation mot de passe
 * - Messages d'erreur localisés
 * - États visuels premium
 */

import { computed, ref, watch } from 'vue'
import {
  useFormValidation,
  required,
  email,
  password,
  minLength,
  calculatePasswordStrength,
  type PasswordStrength,
  type ValidationRule,
} from '@/composables/validation'

export type AuthFormMode = 'login' | 'register' | 'reset'

export interface UseAuthFormOptions {
  mode: AuthFormMode
  /** Force minimale du mot de passe (défaut: 2 pour register, 0 pour login) */
  minPasswordStrength?: number
}

export function useAuthForm(options: UseAuthFormOptions) {
  const { mode, minPasswordStrength } = options

  // Déterminer la force minimale selon le mode
  const requiredStrength = minPasswordStrength ?? (mode === 'register' ? 2 : 0)

  // Force du mot de passe (pour affichage)
  const passwordStrength = ref<PasswordStrength>({
    score: 0,
    label: 'very_weak',
    feedback: [],
    color: 'var(--color-danger-500)',
  })

  // Ref pour stocker la valeur du password (pour la validation de confirmation)
  const passwordValue = ref('')

  // Validateur de confirmation qui utilise la ref
  const confirmPasswordValidator = (value: string): string | null => {
    if (!value) return null
    if (value !== passwordValue.value) {
      return 'auth.errors.passwordMismatch'
    }
    return null
  }

  // Créer le formulaire selon le mode
  const createForm = () => {
    const emailRules: ValidationRule<string>[] = [
      { validator: required('auth.errors.emailRequired') },
      { validator: email('auth.errors.invalidEmail') },
    ]

    const passwordRules: ValidationRule<string>[] = [
      { validator: required('auth.errors.passwordRequired') },
      ...(mode === 'register'
        ? [{ validator: password(requiredStrength as 0 | 1 | 2 | 3 | 4) }]
        : [{ validator: minLength(6, 'auth.errors.passwordTooShort') }]),
    ]

    const confirmPasswordRules: ValidationRule<string>[] = [
      { validator: required('auth.errors.passwordRequired') },
      { validator: confirmPasswordValidator },
    ]

    if (mode === 'reset') {
      return useFormValidation<{ email: string }>({
        fields: {
          email: {
            initialValue: '',
            rules: emailRules,
            debounce: 400,
            validateOnChange: true,
            showErrorsEarly: true,
          },
        },
        liveValidation: true,
        debounceMs: 300,
        validationMode: 'onChange',
      })
    }

    if (mode === 'login') {
      return useFormValidation<{ email: string; password: string }>({
        fields: {
          email: {
            initialValue: '',
            rules: emailRules,
            debounce: 400,
            validateOnChange: true,
            showErrorsEarly: true,
          },
          password: {
            initialValue: '',
            rules: passwordRules,
            debounce: 300,
            validateOnChange: true,
            showErrorsEarly: true,
          },
        },
        liveValidation: true,
        debounceMs: 300,
        validationMode: 'onChange',
      })
    }

    // Register mode
    return useFormValidation<{ email: string; password: string; confirmPassword: string }>({
      fields: {
        email: {
          initialValue: '',
          rules: emailRules,
          debounce: 400,
          validateOnChange: true,
          showErrorsEarly: true,
        },
        password: {
          initialValue: '',
          rules: passwordRules,
          debounce: 300,
          validateOnChange: true,
          showErrorsEarly: true,
        },
        confirmPassword: {
          initialValue: '',
          rules: confirmPasswordRules,
          dependsOn: ['password'],
          validateOnChange: true,
          showErrorsEarly: true,
        },
      },
      liveValidation: true,
      debounceMs: 300,
      validationMode: 'onChange',
    })
  }

  const form = createForm()

  // Mettre à jour la force du mot de passe et la ref
  if (mode !== 'reset') {
    const passwordField = (form.fields as Record<string, any>).password
    if (passwordField) {
      watch(
        () => passwordField.value.value,
        (pwd: string) => {
          passwordValue.value = pwd
          if (pwd) {
            passwordStrength.value = calculatePasswordStrength(pwd)
          } else {
            passwordStrength.value = {
              score: 0,
              label: 'very_weak',
              feedback: [],
              color: 'var(--color-danger-500)',
            }
          }
        },
        { immediate: true }
      )
    }
  }

  // Computed pour la soumission
  const canSubmit = computed(() => {
    if (form.isValidating.value) return false

    const fields = form.fields as Record<string, any>

    // Vérifier que tous les champs requis sont remplis
    const emailFilled = !!fields.email?.value.value
    if (mode === 'reset') return emailFilled && !form.isInvalid.value

    const passwordFilled = !!fields.password?.value.value
    if (mode === 'login') return emailFilled && passwordFilled && !form.isInvalid.value

    // Register: vérifier aussi la confirmation
    const confirmFilled = !!fields.confirmPassword?.value.value
    const passwordStrong = passwordStrength.value.score >= requiredStrength

    return emailFilled && passwordFilled && confirmFilled && passwordStrong && !form.isInvalid.value
  })

  // Valider avant soumission
  async function validateAndSubmit(): Promise<boolean> {
    // Marquer tous les champs comme touchés
    Object.values(form.fields as Record<string, any>).forEach((field: any) => {
      if (field?.touched) {
        field.touched.value = true
      }
    })

    return form.validate()
  }

  // Reset le formulaire
  function reset() {
    form.reset()
    passwordValue.value = ''
    passwordStrength.value = {
      score: 0,
      label: 'very_weak',
      feedback: [],
      color: 'var(--color-danger-500)',
    }
  }

  return {
    // Form helpers
    fields: form.fields,
    values: form.values,
    errors: form.errors,
    isValid: form.isValid,
    isInvalid: form.isInvalid,
    isValidating: form.isValidating,
    isDirty: form.isDirty,

    // Password specific
    passwordStrength,

    // Actions
    canSubmit,
    validate: validateAndSubmit,
    reset,
    setErrors: form.setErrors,

    // Mode
    mode,
  }
}
