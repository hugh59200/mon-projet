// composables/useValidation.ts
export function useValidation() {
  const validateEmail = (email: string) =>
    /\S+@\S+\.\S+/.test(email) ? null : 'Adresse e-mail invalide.'

  function validatePassword(password: string, minStrength: 'weak' | 'medium' | 'strong' = 'weak') {
    if (!password || password.trim() === '') {
      return 'Mot de passe requis'
    }

    // ✅ si faible → aucune contrainte de longueur
    if (minStrength === 'weak') {
      return undefined
    }

    // ✅ si medium/strong → appliquer les règles
    if (password.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères'
    }

    return undefined
  }

  return { validateEmail, validatePassword }
}
