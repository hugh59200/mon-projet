// composables/useValidation.ts
export function useValidation() {
  const validateEmail = (email: string) =>
    /\S+@\S+\.\S+/.test(email) ? null : "Adresse e-mail invalide."

  const validatePassword = (password: string) =>
    password.length >= 8 ? null : "Le mot de passe doit contenir au moins 8 caractères."

  return { validateEmail, validatePassword }
}
