/**
 * Types pour le système de validation des formulaires
 * Gestion professionnelle style grands retailers
 */

export type ValidationStatus = 'idle' | 'valid' | 'invalid' | 'validating'

export type ValidatorFn<T = string> = (value: T) => string | null | Promise<string | null>

export interface FieldState<T = string> {
  value: T
  status: ValidationStatus
  error: string | null
  touched: boolean
  dirty: boolean
  validating: boolean
}

export interface ValidationRule<T = string> {
  validator: ValidatorFn<T>
  message?: string
  /** Validation async (ex: vérifier si email existe) */
  async?: boolean
  /** Déclencher uniquement au submit */
  onSubmitOnly?: boolean
}

export interface FieldConfig<T = string> {
  /** Valeur initiale */
  initialValue: T
  /** Règles de validation */
  rules?: ValidationRule<T>[]
  /** Formatter pour auto-formatage (téléphone, CB, etc.) */
  formatter?: (value: string) => string
  /** Debounce en ms pour validation live */
  debounce?: number
  /** Dépendances (autres champs à valider quand celui-ci change) */
  dependsOn?: string[]
  /** Valider à chaque changement (override du mode global) */
  validateOnChange?: boolean
  /** Afficher les erreurs dès la première frappe */
  showErrorsEarly?: boolean
}

export interface FormConfig {
  fields: Record<string, FieldConfig<any>>
  /** Validation live activée */
  liveValidation?: boolean
  /** Debounce global par défaut (ms) */
  debounce?: number
  /** Callback au submit */
  onSubmit?: (values: Record<string, any>) => void | Promise<void>
}

export interface PasswordStrength {
  score: number // 0-4
  label: 'very_weak' | 'weak' | 'fair' | 'strong' | 'very_strong'
  feedback: string[]
  color: string
}

export interface AddressComponents {
  street: string
  city: string
  postalCode: string
  country: string
}

// Types pour les pays supportés
export type SupportedCountry = 'FR' | 'BE' | 'CH' | 'LU' | 'CA' | 'DE' | 'ES' | 'IT' | 'NL' | 'PT'

export interface CountryConfig {
  code: SupportedCountry
  name: string
  phonePrefix: string
  phoneFormat: string
  postalCodeRegex: RegExp
  postalCodeFormat: string
}
