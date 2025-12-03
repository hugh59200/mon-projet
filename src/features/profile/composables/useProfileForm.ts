/**
 * Composable de gestion du formulaire profil
 * Utilise le système de validation professionnel
 *
 * Features:
 * - Validation temps réel
 * - Auto-formatage téléphone et code postal
 * - Gestion multi-pays
 * - Validation mot de passe avec force
 */

import { computed, ref, watch } from 'vue'
import {
  useFormValidation,
  required,
  name,
  phone,
  postalCode,
  minLength,
  password,
  calculatePasswordStrength,
  formatPhoneFR,
  formatPostalCode,
  type SupportedCountry,
  type PasswordStrength,
} from '@/composables/validation'

export interface ProfileFormData {
  fullName: string
  phone: string
  address: string
  postalCode: string
  city: string
  country: SupportedCountry
}

export interface PasswordFormData {
  newPassword: string
  confirmPassword: string
}

/**
 * Formulaire informations personnelles
 */
export function useProfileInfoForm(initialData?: Partial<ProfileFormData>) {
  const form = useFormValidation<ProfileFormData>({
    fields: {
      fullName: {
        initialValue: initialData?.fullName ?? '',
        rules: [
          { validator: name('Caractères invalides dans le nom') },
          { validator: minLength(2, 'Au moins 2 caractères') },
        ],
        debounce: 300,
        validateOnChange: true,
      },
      phone: {
        initialValue: initialData?.phone ?? '',
        rules: [{ validator: phone('FR', 'Numéro de téléphone invalide') }],
        formatter: formatPhoneFR,
        debounce: 300,
      },
      address: {
        initialValue: initialData?.address ?? '',
        rules: [{ validator: minLength(5, 'Adresse trop courte') }],
        debounce: 300,
      },
      postalCode: {
        initialValue: initialData?.postalCode ?? '',
        rules: [
          {
            validator: (value: string) => {
              if (!value) return null // Optionnel
              const countryVal = form.fields.country.value.value as SupportedCountry
              return postalCode(countryVal, 'Code postal invalide')(value)
            },
          },
        ],
        formatter: (value) => {
          const countryVal = form.fields.country.value.value as SupportedCountry
          return formatPostalCode(value, countryVal)
        },
        debounce: 300,
      },
      city: {
        initialValue: initialData?.city ?? '',
        rules: [
          { validator: name('Caractères invalides') },
          { validator: minLength(2, 'Ville trop courte') },
        ],
        debounce: 300,
      },
      country: {
        initialValue: initialData?.country ?? 'FR',
        rules: [],
      },
    },
    liveValidation: true,
    debounceMs: 300,
    validationMode: 'onBlur',
  })

  // Revalider le code postal quand le pays change
  watch(
    () => form.fields.country.value.value,
    () => {
      if (form.fields.postalCode.touched.value && form.fields.postalCode.value.value) {
        form.fields.postalCode.validate()
      }
    },
  )

  const canSubmit = computed(() => {
    return form.isDirty.value && !form.isInvalid.value && !form.isValidating.value
  })

  return {
    ...form,
    canSubmit,
  }
}

/**
 * Formulaire changement de mot de passe
 */
export function usePasswordForm() {
  const passwordValue = ref('')

  const passwordStrength = ref<PasswordStrength>({
    score: 0,
    label: 'very_weak',
    feedback: [],
    color: 'var(--color-danger-500)',
  })

  const confirmPasswordValidator = (value: string): string | null => {
    if (!value) return null
    if (value !== passwordValue.value) {
      return 'Les mots de passe ne correspondent pas'
    }
    return null
  }

  const form = useFormValidation<PasswordFormData>({
    fields: {
      newPassword: {
        initialValue: '',
        rules: [
          { validator: required('Le mot de passe est requis') },
          { validator: password(2) },
        ],
        debounce: 300,
        validateOnChange: true,
        showErrorsEarly: true,
      },
      confirmPassword: {
        initialValue: '',
        rules: [
          { validator: required('La confirmation est requise') },
          { validator: confirmPasswordValidator },
        ],
        dependsOn: ['newPassword'],
        validateOnChange: true,
        showErrorsEarly: true,
      },
    },
    liveValidation: true,
    debounceMs: 300,
    validationMode: 'onChange',
  })

  // Mettre à jour la force du mot de passe
  watch(
    () => form.fields.newPassword.value.value,
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
  )

  const canSubmit = computed(() => {
    const pwd = form.fields.newPassword.value.value
    const confirm = form.fields.confirmPassword.value.value

    if (!pwd || !confirm) return false
    if (pwd !== confirm) return false
    if (passwordStrength.value.score < 2) return false
    if (form.isInvalid.value) return false

    return true
  })

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
    ...form,
    passwordStrength,
    canSubmit,
    reset,
  }
}
