/**
 * Composable de validation de formulaires professionnel
 * Inspiré des standards grands retailers (Amazon, Zalando, etc.)
 *
 * Features:
 * - Validation temps réel avec debounce
 * - Auto-formatage des champs
 * - États visuels (idle, valid, invalid, validating)
 * - Support async (vérification email unique, etc.)
 * - Messages d'erreur localisés
 * - Tracking touched/dirty
 */

import { reactive, computed, watch, type Ref, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FieldState, FieldConfig, ValidationStatus, ValidationRule } from './types'
import { debounce } from '@/utils/debounce'

export interface UseFormValidationOptions<T extends Record<string, any>> {
  /** Configuration des champs */
  fields: {
    [K in keyof T]: {
      initialValue?: T[K]
      rules?: ValidationRule<T[K]>[]
      formatter?: (value: string) => string
      debounce?: number
      dependsOn?: (keyof T)[]
      /** Valider dès la première frappe (sans attendre blur) */
      validateOnChange?: boolean
      /** Afficher les erreurs dès la première frappe */
      showErrorsEarly?: boolean
    }
  }
  /** Validation live activée (défaut: true) */
  liveValidation?: boolean
  /** Debounce global par défaut (ms, défaut: 300) */
  debounceMs?: number
  /** Valider uniquement les champs touchés */
  validateOnlyTouched?: boolean
  /** Mode de validation: 'onBlur' | 'onChange' | 'aggressive' (défaut: 'onBlur') */
  validationMode?: 'onBlur' | 'onChange' | 'aggressive'
}

export interface FieldHelpers<T> {
  /** Valeur du champ */
  value: Ref<T>
  /** État de validation */
  status: Ref<ValidationStatus>
  /** Message d'erreur */
  error: Ref<string | null>
  /** Champ touché (blur) */
  touched: Ref<boolean>
  /** Champ modifié */
  dirty: Ref<boolean>
  /** Validation en cours */
  validating: Ref<boolean>
  /** Valeur valide */
  isValid: ComputedRef<boolean>
  /** Valeur invalide */
  isInvalid: ComputedRef<boolean>
  /** Handler pour @input avec formatage */
  onInput: (event: Event) => void
  /** Handler pour @blur */
  onBlur: () => void
  /** Handler pour @focus */
  onFocus: () => void
  /** Valider manuellement */
  validate: () => Promise<boolean>
  /** Reset le champ */
  reset: () => void
  /** Props pour le wrapper (alertLabel, alertType, etc.) */
  wrapperProps: ComputedRef<{
    alertLabel: string
    alertType: 'danger' | 'success' | 'warning' | undefined
    isValid: boolean
    showError: boolean
  }>
}

export interface FormHelpers<T extends Record<string, any>> {
  /** Champs avec leurs helpers */
  fields: { [K in keyof T]: FieldHelpers<T[K]> }
  /** Valeurs du formulaire */
  values: ComputedRef<T>
  /** Formulaire valide */
  isValid: ComputedRef<boolean>
  /** Formulaire invalide */
  isInvalid: ComputedRef<boolean>
  /** Au moins un champ en cours de validation */
  isValidating: ComputedRef<boolean>
  /** Au moins un champ modifié */
  isDirty: ComputedRef<boolean>
  /** Erreurs par champ */
  errors: ComputedRef<Partial<Record<keyof T, string>>>
  /** Valider tout le formulaire */
  validate: () => Promise<boolean>
  /** Valider des champs spécifiques */
  validateFields: (...fieldNames: (keyof T)[]) => Promise<boolean>
  /** Reset tout le formulaire */
  reset: () => void
  /** Reset des champs spécifiques */
  resetFields: (...fieldNames: (keyof T)[]) => void
  /** Définir des valeurs */
  setValues: (values: Partial<T>) => void
  /** Définir des erreurs manuellement */
  setErrors: (errors: Partial<Record<keyof T, string>>) => void
  /** Handler de submit */
  handleSubmit: (onSuccess: (values: T) => void | Promise<void>) => (e?: Event) => Promise<void>
}

export function useFormValidation<T extends Record<string, any>>(
  options: UseFormValidationOptions<T>
): FormHelpers<T> {
  const { t, te } = useI18n()

  const {
    fields: fieldsConfig,
    liveValidation = true,
    debounceMs = 300,
    validateOnlyTouched = false,
    validationMode = 'onBlur',
  } = options

  // Créer les états pour chaque champ
  const fieldStates = reactive<Record<string, FieldState<any>>>({})
  const fieldHelpers: Record<string, FieldHelpers<any>> = {}

  // Fonction pour traduire les messages d'erreur
  function translateError(error: string | null): string {
    if (!error) return ''

    // Gérer les paramètres dans le message (ex: "validation.minLength:8")
    const parts = error.split(':')
    const key = parts[0] ?? error
    const paramValue = parts[1] ?? ''

    if (key && te(key)) {
      return t(key, paramValue ? { n: paramValue, value: paramValue } : {})
    }

    return error
  }

  // Créer un helper pour chaque champ
  for (const [fieldName, config] of Object.entries(fieldsConfig)) {
    const cfg = config as FieldConfig<any>

    // État initial
    fieldStates[fieldName] = {
      value: cfg.initialValue ?? '',
      status: 'idle',
      error: null,
      touched: false,
      dirty: false,
      validating: false,
    }

    const state = fieldStates[fieldName]

    // Refs réactives
    const valueRef = computed({
      get: () => state.value,
      set: (val) => {
        state.value = val
        state.dirty = true
      },
    })

    const statusRef = computed(() => state.status)
    const errorRef = computed(() => state.error)
    const touchedRef = computed(() => state.touched)
    const dirtyRef = computed(() => state.dirty)
    const validatingRef = computed(() => state.validating)

    const isValid = computed(() => state.status === 'valid')
    const isInvalid = computed(() => state.status === 'invalid')

    // Fonction de validation du champ
    async function validateField(): Promise<boolean> {
      const rules = cfg.rules ?? []

      if (rules.length === 0) {
        state.status = 'valid'
        state.error = null
        return true
      }

      state.validating = true
      state.status = 'validating'

      try {
        for (const rule of rules) {
          // Ignorer les règles onSubmitOnly en validation live
          if (rule.onSubmitOnly && liveValidation) continue

          const result = await rule.validator(state.value)

          if (result) {
            state.error = translateError(rule.message ?? result)
            state.status = 'invalid'
            state.validating = false
            return false
          }
        }

        state.error = null
        state.status = 'valid'
        state.validating = false
        return true
      } catch (err) {
        state.error = translateError('validation.error')
        state.status = 'invalid'
        state.validating = false
        return false
      }
    }

    // Debounced validation
    const debouncedValidate = debounce(validateField, cfg.debounce ?? debounceMs)

    // Handler @input
    function onInput(event: Event) {
      const input = event.target as HTMLInputElement
      let value = input.value

      // Appliquer le formatter si défini
      if (cfg.formatter) {
        value = cfg.formatter(value)
        input.value = value
      }

      state.value = value
      state.dirty = true

      // Déterminer si on doit valider
      const shouldValidateOnChange = cfg.validateOnChange ?? (validationMode === 'onChange' || validationMode === 'aggressive')
      const shouldValidateTouched = liveValidation && state.touched

      // Validation live
      if (shouldValidateOnChange || shouldValidateTouched) {
        debouncedValidate()
      }

      // Mode aggressive: marquer comme touché dès la première frappe
      if (validationMode === 'aggressive' && value.length > 0) {
        state.touched = true
      }
    }

    // Handler @blur
    function onBlur() {
      state.touched = true

      // Valider au blur
      if (state.dirty || state.value) {
        validateField()
      }
    }

    // Handler @focus
    function onFocus() {
      // Reset status quand on refocus
      if (state.status === 'invalid') {
        // On garde l'erreur visible mais on permet la correction
      }
    }

    // Reset du champ
    function reset() {
      state.value = cfg.initialValue ?? ''
      state.status = 'idle'
      state.error = null
      state.touched = false
      state.dirty = false
      state.validating = false
    }

    // Props pour le wrapper
    const wrapperProps = computed(() => {
      // Déterminer si on affiche les erreurs tôt
      const showErrorsEarly = cfg.showErrorsEarly ?? (validationMode === 'aggressive' || validationMode === 'onChange')
      const canShowError = showErrorsEarly ? (state.dirty && state.value) : state.touched
      const showError = canShowError && state.status === 'invalid'
      const showSuccess = state.touched && state.status === 'valid' && state.dirty

      return {
        alertLabel: showError ? (state.error ?? '') : '',
        alertType: showError ? 'danger' as const : showSuccess ? 'success' as const : undefined,
        isValid: state.status === 'valid',
        showError,
      }
    })

    // Ajouter le helper
    fieldHelpers[fieldName] = {
      value: valueRef as unknown as Ref<any>,
      status: statusRef as unknown as Ref<ValidationStatus>,
      error: errorRef as unknown as Ref<string | null>,
      touched: touchedRef as unknown as Ref<boolean>,
      dirty: dirtyRef as unknown as Ref<boolean>,
      validating: validatingRef as unknown as Ref<boolean>,
      isValid,
      isInvalid,
      onInput,
      onBlur,
      onFocus,
      validate: validateField,
      reset,
      wrapperProps,
    }

    // Watch pour les dépendances
    if (cfg.dependsOn && cfg.dependsOn.length > 0) {
      watch(
        () => cfg.dependsOn!.map(dep => fieldStates[dep as string]?.value),
        () => {
          if (state.touched) {
            validateField()
          }
        }
      )
    }
  }

  // Computed globaux
  const values = computed(() => {
    const result: Record<string, any> = {}
    for (const key of Object.keys(fieldStates)) {
      const state = fieldStates[key]
      if (state) {
        result[key] = state.value
      }
    }
    return result as T
  })

  const isValid = computed(() => {
    return Object.values(fieldStates).every(
      state => state.status === 'valid' || (!validateOnlyTouched && state.status === 'idle')
    )
  })

  const isInvalid = computed(() => {
    return Object.values(fieldStates).some(state => state.status === 'invalid')
  })

  const isValidating = computed(() => {
    return Object.values(fieldStates).some(state => state.validating)
  })

  const isDirty = computed(() => {
    return Object.values(fieldStates).some(state => state.dirty)
  })

  const errors = computed(() => {
    const result: Record<string, string> = {}
    for (const [key, state] of Object.entries(fieldStates)) {
      if (state.error) {
        result[key] = state.error
      }
    }
    return result as Partial<Record<keyof T, string>>
  })

  // Valider tout le formulaire
  async function validate(): Promise<boolean> {
    const results = await Promise.all(
      Object.values(fieldHelpers).map(helper => helper.validate())
    )
    return results.every(Boolean)
  }

  // Valider des champs spécifiques
  async function validateFields(...fieldNames: (keyof T)[]): Promise<boolean> {
    const results = await Promise.all(
      fieldNames.map(name => fieldHelpers[name as string]?.validate() ?? Promise.resolve(true))
    )
    return results.every(Boolean)
  }

  // Reset tout
  function reset() {
    Object.values(fieldHelpers).forEach(helper => helper.reset())
  }

  // Reset des champs spécifiques
  function resetFields(...fieldNames: (keyof T)[]) {
    fieldNames.forEach(name => fieldHelpers[name as string]?.reset())
  }

  // Définir des valeurs
  function setValues(newValues: Partial<T>) {
    for (const [key, value] of Object.entries(newValues)) {
      if (fieldStates[key]) {
        fieldStates[key].value = value
        fieldStates[key].dirty = true
      }
    }
  }

  // Définir des erreurs manuellement (ex: erreurs serveur)
  function setErrors(newErrors: Partial<Record<keyof T, string>>) {
    for (const [key, error] of Object.entries(newErrors)) {
      if (fieldStates[key]) {
        fieldStates[key].error = error as string
        fieldStates[key].status = 'invalid'
        fieldStates[key].touched = true
      }
    }
  }

  // Handler de submit
  function handleSubmit(onSuccess: (values: T) => void | Promise<void>) {
    return async (e?: Event) => {
      e?.preventDefault()

      // Marquer tous les champs comme touchés
      Object.values(fieldStates).forEach(state => {
        state.touched = true
      })

      const isFormValid = await validate()

      if (isFormValid) {
        await onSuccess(values.value)
      }
    }
  }

  return {
    fields: fieldHelpers as { [K in keyof T]: FieldHelpers<T[K]> },
    values,
    isValid,
    isInvalid,
    isValidating,
    isDirty,
    errors,
    validate,
    validateFields,
    reset,
    resetFields,
    setValues,
    setErrors,
    handleSubmit,
  }
}

// ============================================
// EXPORT HELPERS
// ============================================

export * from './validators'
export * from './formatters'
export * from './types'
