/**
 * Script pour convertir les SVG en PNG et les uploader sur Supabase Storage
 * Usage: node scripts/upload-email-assets.cjs
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { createClient } = require('@supabase/supabase-js')

// Configuration
const SUPABASE_URL = 'https://dwomsbawthlktapmtmqu.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET_NAME = 'email-assets'
const ASSETS_DIR = path.join(__dirname, 'email-assets')
const OUTPUT_DIR = path.join(__dirname, 'email-assets', 'png')

// Taille des images en pixels
const IMAGE_SIZE = 120

async function main() {
  if (!SUPABASE_SERVICE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY manquant')
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // Créer le dossier de sortie
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Créer le bucket si nécessaire
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME)

  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 1024 * 1024, // 1MB
    })
    if (error) {
      console.error('Erreur création bucket:', error.message)
    } else {
      console.log(`Bucket "${BUCKET_NAME}" créé`)
    }
  }

  // Lister les SVG
  const svgFiles = fs.readdirSync(ASSETS_DIR).filter(f => f.endsWith('.svg'))
  console.log(`\n${svgFiles.length} fichiers SVG trouvés\n`)

  const results = []

  for (const svgFile of svgFiles) {
    const baseName = path.basename(svgFile, '.svg')
    const svgPath = path.join(ASSETS_DIR, svgFile)
    const pngPath = path.join(OUTPUT_DIR, `${baseName}.png`)

    try {
      // Convertir SVG → PNG
      await sharp(svgPath)
        .resize(IMAGE_SIZE, IMAGE_SIZE)
        .png()
        .toFile(pngPath)

      // Lire le fichier PNG
      const pngBuffer = fs.readFileSync(pngPath)

      // Uploader sur Supabase
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(`${baseName}.png`, pngBuffer, {
          contentType: 'image/png',
          upsert: true,
        })

      if (error) {
        console.error(`✗ ${baseName}: ${error.message}`)
        results.push({ name: baseName, success: false, error: error.message })
      } else {
        const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${baseName}.png`
        console.log(`✓ ${baseName} → ${url}`)
        results.push({ name: baseName, success: true, url })
      }
    } catch (err) {
      console.error(`✗ ${baseName}: ${err.message}`)
      results.push({ name: baseName, success: false, error: err.message })
    }
  }

  // Générer le fichier de config TypeScript
  const successResults = results.filter(r => r.success)
  const configContent = `// Auto-generated - DO NOT EDIT
// Run: node scripts/upload-email-assets.cjs

export const EMAIL_ASSETS = {
${successResults.map(r => `  '${r.name}': '${r.url}'`).join(',\n')}
} as const

export type EmailAssetKey = keyof typeof EMAIL_ASSETS
`

  fs.writeFileSync(
    path.join(__dirname, '..', 'supabase', 'utils', 'emailAssets.ts'),
    configContent
  )

  console.log('\n---')
  console.log(`Succès: ${successResults.length}/${results.length}`)
  console.log('Config générée: supabase/utils/emailAssets.ts')
}

main().catch(console.error)
