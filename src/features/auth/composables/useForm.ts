import { debounce } from '@/utils/debounce'
import { ref, watch } from 'vue'
import { useValidation } from './useValidation'

export function useForm(live = true) {
  const { validateEmail, validatePassword } = useValidation()

  const email = ref('')
  const password = ref('')
  const errors = ref<{ email?: string; password?: string }>({})
  const touched = ref<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  })

  // ✅ Validation globale au submit
  function validate(mode: 'login' | 'register' | 'reset') {
    errors.value = {}

    const emailError = validateEmail(email.value)
    if (emailError) errors.value.email = emailError

    if (mode !== 'reset') {
      const passError = validatePassword(password.value)
      if (passError) errors.value.password = passError
    }

    return Object.keys(errors.value).length === 0
  }

  // ✅ Validation d’un champ (au blur)
  function validateField(field: 'email' | 'password') {
    touched.value[field] = true

    if (field === 'email') {
      const val = email.value.trim()
      errors.value.email = val ? (validateEmail(val) ?? undefined) : undefined
    }

    if (field === 'password') {
      const val = password.value
      errors.value.password = val ? (validatePassword(val) ?? undefined) : undefined
    }
  }

  function reset() {
    email.value = ''
    password.value = ''
    errors.value = {}
    touched.value = { email: false, password: false }
  }

  // ✅ Validation douce pendant la frappe
  if (live) {
    watch(
      email,
      debounce(() => {
        if (touched.value.email && email.value.trim()) validateField('email')
      }, 500),
    )

    watch(
      password,
      debounce(() => {
        if (touched.value.password && password.value.trim()) validateField('password')
      }, 500),
    )
  }

  return { email, password, errors, touched, validate, validateField, reset }
}
