// composables/useValidation.ts
export function useValidation() {
  const validateEmail = (email: string) =>
    /\S+@\S+\.\S+/.test(email) ? null : 'Adresse e-mail invalide.'

  function validatePassword(password: string, _minStrength: 'weak' | 'medium' | 'strong' = 'weak') {
    if (!password || password.trim() === '') {
      return 'Mot de passe requis'
    }

    // Longueur minimale : 6 caractères
    if (password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères'
    }

    return undefined
  }

  return { validateEmail, validatePassword }
}
