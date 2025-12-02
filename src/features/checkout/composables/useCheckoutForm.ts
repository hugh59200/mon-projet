/**
 * Composable de gestion du formulaire checkout
 * Exemple d'utilisation du système de validation professionnel
 *
 * Features:
 * - Validation temps réel avec feedback visuel
 * - Auto-formatage téléphone et code postal
 * - Gestion multi-pays
 * - Persistence sessionStorage (donnees sensibles effacees a la fermeture)
 */

import { computed, watch } from 'vue'
import {
  useFormValidation,
  required,
  email,
  name,
  phone,
  postalCode,
  minLength,
  formatPhoneFR,
  formatPostalCode,
  type SupportedCountry,
} from '@/composables/validation'

export interface CheckoutFormData {
  email: string
  fullName: string
  phone: string
  address: string
  postalCode: string
  city: string
  country: SupportedCountry
}

const STORAGE_KEY = 'fp-checkout-form'

export function useCheckoutForm(options?: {
  /** Pré-remplir avec les données du profil */
  profileData?: Partial<CheckoutFormData>
  /** Activer la persistence sessionStorage (OpSec: donnees sensibles) */
  persist?: boolean
}) {
  const { profileData, persist = true } = options ?? {}

  // Charger les donnees depuis sessionStorage si disponibles
  const savedData = persist ? loadFromStorage() : null

  const form = useFormValidation<CheckoutFormData>({
    fields: {
      email: {
        initialValue: savedData?.email ?? profileData?.email ?? '',
        rules: [
          { validator: required('L\'email est requis') },
          { validator: email() },
        ],
        debounce: 500,
      },
      fullName: {
        initialValue: savedData?.fullName ?? profileData?.fullName ?? '',
        rules: [
          { validator: required('Le nom complet est requis') },
          { validator: name() },
          { validator: minLength(3, 'Au moins 3 caractères') },
        ],
      },
      phone: {
        initialValue: savedData?.phone ?? profileData?.phone ?? '',
        rules: [
          { validator: phone('FR') },
        ],
        formatter: formatPhoneFR,
      },
      address: {
        initialValue: savedData?.address ?? profileData?.address ?? '',
        rules: [
          { validator: required('L\'adresse est requise') },
          { validator: minLength(5, 'Adresse trop courte') },
        ],
      },
      postalCode: {
        initialValue: savedData?.postalCode ?? profileData?.postalCode ?? '',
        rules: [
          { validator: required('Le code postal est requis') },
          // Validation dynamique selon le pays sélectionné
          {
            validator: (value: string) => {
              const country = form.fields.country.value.value as SupportedCountry
              return postalCode(country)(value)
            },
          },
        ],
        formatter: (value) => {
          const country = form.fields.country.value.value as SupportedCountry
          return formatPostalCode(value, country)
        },
      },
      city: {
        initialValue: savedData?.city ?? profileData?.city ?? '',
        rules: [
          { validator: required('La ville est requise') },
          { validator: name('Caractères invalides') },
        ],
      },
      country: {
        initialValue: savedData?.country ?? profileData?.country ?? 'FR',
        rules: [
          { validator: required() },
        ],
        // Re-valider code postal quand le pays change
        dependsOn: ['postalCode'],
      },
    },
    liveValidation: true,
    debounceMs: 300,
  })

  // Persistence sessionStorage (OpSec: donnees sensibles)
  if (persist) {
    watch(
      form.values,
      (values) => {
        saveToStorage(values)
      },
      { deep: true }
    )
  }

  // Revalider le code postal quand le pays change
  watch(
    () => form.fields.country.value.value,
    () => {
      if (form.fields.postalCode.touched.value) {
        form.fields.postalCode.validate()
      }
    }
  )

  /**
   * Pays disponibles pour la livraison
   */
  const availableCountries = [
    { value: 'FR', label: 'France' },
    { value: 'BE', label: 'Belgique' },
    { value: 'CH', label: 'Suisse' },
    { value: 'LU', label: 'Luxembourg' },
    { value: 'CA', label: 'Canada' },
  ] as const

  /**
   * Formulaire valide et prêt pour soumission
   */
  const canSubmit = computed(() => {
    return form.isValid.value && !form.isValidating.value
  })

  /**
   * Reset et vider le sessionStorage
   */
  function resetForm() {
    form.reset()
    if (persist) {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }

  /**
   * Pré-remplir avec des données externes (profil utilisateur)
   */
  function prefillFromProfile(data: Partial<CheckoutFormData>) {
    form.setValues(data)
  }

  return {
    // Form helpers
    ...form,

    // Computed
    canSubmit,
    availableCountries,

    // Methods
    resetForm,
    prefillFromProfile,
  }
}

// ============================================
// HELPERS STORAGE (sessionStorage pour OpSec)
// ============================================

function loadFromStorage(): CheckoutFormData | null {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    // Ignorer les erreurs de parsing
  }
  return null
}

function saveToStorage(data: CheckoutFormData) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignorer les erreurs (quota depasse, etc.)
  }
}
