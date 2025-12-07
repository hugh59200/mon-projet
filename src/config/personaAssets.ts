// Auto-generated - DO NOT EDIT
// Run: SUPABASE_SERVICE_ROLE_KEY="..." node scripts/seed-supabase-assets.cjs
// Generated: 2025-12-07T20:52:51.303Z

/**
 * URLs des images persona stockées sur Supabase Storage
 * Bucket: site-assets
 */
export const PERSONA_ASSETS = {
  'rd': 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/site-assets/personas/persona-rd.jpg',
  'lab': 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/site-assets/personas/persona-lab.jpg',
  'phd': 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/site-assets/personas/persona-phd.jpg',
  'quality': 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/site-assets/personas/persona-quality.jpg'
} as const

export type PersonaAssetKey = keyof typeof PERSONA_ASSETS

/**
 * Helper pour récupérer l'URL d'une image persona
 */
export function getPersonaImageUrl(key: PersonaAssetKey): string {
  return PERSONA_ASSETS[key]
}
