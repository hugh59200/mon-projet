/**
 * Système de validation de formulaires professionnel
 *
 * @example
 * ```ts
 * import {
 *   useFormValidation,
 *   required,
 *   email,
 *   password,
 *   phone,
 *   postalCode,
 *   formatPhoneFR,
 *   formatPostalCode,
 * } from '@/composables/validation'
 *
 * const form = useFormValidation({
 *   fields: {
 *     email: {
 *       initialValue: '',
 *       rules: [
 *         { validator: required() },
 *         { validator: email() },
 *       ],
 *     },
 *     phone: {
 *       initialValue: '',
 *       rules: [{ validator: phone('FR') }],
 *       formatter: formatPhoneFR,
 *     },
 *   },
 * })
 * ```
 */

export { useFormValidation } from './useFormValidation'
export type {
  UseFormValidationOptions,
  FieldHelpers,
  FormHelpers,
} from './useFormValidation'

// Types
export type {
  ValidationStatus,
  ValidatorFn,
  FieldState,
  ValidationRule,
  FieldConfig,
  FormConfig,
  PasswordStrength,
  AddressComponents,
  SupportedCountry,
  CountryConfig,
} from './types'

// Validateurs
export {
  // Base
  required,
  minLength,
  maxLength,
  // Email
  email,
  emailUnique,
  // Password
  password,
  passwordConfirm,
  calculatePasswordStrength,
  // Téléphone
  phone,
  phoneInternational,
  // Code postal
  postalCode,
  // Numériques
  min,
  max,
  integer,
  price,
  // Texte
  name,
  url,
  slug,
  // Combinateurs
  compose,
  when,
  // Config pays
  COUNTRY_CONFIGS,
} from './validators'

// Formatters
export {
  // Téléphone
  formatPhoneFR,
  formatPhoneInternational,
  // Code postal
  formatPostalCode,
  // Carte bancaire
  formatCreditCard,
  formatExpiryDate,
  formatCVV,
  // Prix & nombres
  formatPrice,
  formatNumber,
  // Texte
  formatName,
  formatSlug,
  // IBAN
  formatIBAN,
  // Factory
  createInputFormatter,
} from './formatters'

// i18n messages
export {
  validationMessagesFR,
  validationMessagesEN,
  getValidationMessage,
} from './i18n'
