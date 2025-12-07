/**
 * Script de seed pour les assets Supabase Storage
 *
 * Usage: SUPABASE_SERVICE_ROLE_KEY="..." node scripts/seed-supabase-assets.cjs
 *
 * Ce script gère tous les assets statiques du site :
 * - Images persona (HomeScience)
 * - Autres assets à venir
 *
 * Il peut être utilisé pour :
 * - Initialiser un nouveau projet
 * - Restaurer les assets après une migration
 * - Vérifier l'intégrité des assets
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { createClient } = require('@supabase/supabase-js')

// ============================================
// CONFIGURATION
// ============================================

const SUPABASE_URL = 'https://dwomsbawthlktapmtmqu.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Définition des buckets et leurs assets
const BUCKETS_CONFIG = {
  'site-assets': {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    assets: {
      personas: {
        sourcePath: 'src/assets/banners/hero',
        storagePath: 'personas',
        files: [
          'persona-rd.png',
          'persona-lab.png',
          'persona-phd.png',
          'persona-quality.png',
        ],
        transform: {
          maxWidth: 800,
          format: 'jpeg',
          quality: 85,
        },
        configOutput: 'src/config/personaAssets.ts',
        configTemplate: (assets) => `// Auto-generated - DO NOT EDIT
// Run: SUPABASE_SERVICE_ROLE_KEY="..." node scripts/seed-supabase-assets.cjs
// Generated: ${new Date().toISOString()}

/**
 * URLs des images persona stockées sur Supabase Storage
 * Bucket: site-assets
 */
export const PERSONA_ASSETS = {
${assets.map(a => `  '${a.key}': '${a.url}'`).join(',\n')}
} as const

export type PersonaAssetKey = keyof typeof PERSONA_ASSETS

/**
 * Helper pour récupérer l'URL d'une image persona
 */
export function getPersonaImageUrl(key: PersonaAssetKey): string {
  return PERSONA_ASSETS[key]
}
`,
      },
    },
  },
}

// ============================================
// UTILITAIRES
// ============================================

function log(message, type = 'info') {
  const prefix = {
    info: '  ',
    success: '  [OK]',
    error: '  [ERREUR]',
    skip: '  [SKIP]',
    warn: '  [WARN]',
  }
  console.log(`${prefix[type] || '  '} ${message}`)
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`
}

async function transformImage(inputPath, config) {
  const { maxWidth, format, quality } = config

  let pipeline = sharp(inputPath)
    .resize(maxWidth, null, { withoutEnlargement: true })

  if (format === 'jpeg' || format === 'jpg') {
    pipeline = pipeline.jpeg({ quality, progressive: true })
  } else if (format === 'webp') {
    pipeline = pipeline.webp({ quality })
  } else if (format === 'png') {
    pipeline = pipeline.png({ quality })
  }

  return pipeline.toBuffer()
}

// ============================================
// GESTION DES BUCKETS
// ============================================

async function ensureBucket(supabase, bucketName, config) {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === bucketName)

  if (!exists) {
    log(`Création du bucket "${bucketName}"...`)
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: config.public,
      fileSizeLimit: config.fileSizeLimit,
    })
    if (error) throw new Error(`Création bucket: ${error.message}`)
    log(`Bucket "${bucketName}" créé`, 'success')
  } else {
    log(`Bucket "${bucketName}" existe déjà`, 'info')
  }
}

// ============================================
// UPLOAD DES ASSETS
// ============================================

async function uploadAssetGroup(supabase, bucketName, groupName, groupConfig) {
  const { sourcePath, storagePath, files, transform, configOutput, configTemplate } = groupConfig
  const baseDir = path.join(__dirname, '..')
  const sourceDir = path.join(baseDir, sourcePath)

  console.log(`\n  📁 ${groupName} (${files.length} fichiers)`)

  // Vérifier si les fichiers source existent
  const existingFiles = files.filter(f => fs.existsSync(path.join(sourceDir, f)))

  if (existingFiles.length === 0) {
    log(`Aucun fichier source trouvé dans ${sourcePath}`, 'warn')
    log(`Vérification des assets existants sur Supabase...`, 'info')

    // Vérifier si les assets existent déjà sur Supabase
    const { data: existing } = await supabase.storage
      .from(bucketName)
      .list(storagePath)

    if (existing && existing.length > 0) {
      log(`${existing.length} fichiers trouvés sur Supabase`, 'success')

      // Générer le fichier de config depuis les assets existants
      const assets = existing.map(f => {
        const key = f.name.replace(/\.(jpg|jpeg|png|webp)$/, '').replace('persona-', '')
        const url = `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${storagePath}/${f.name}`
        return { key, url, name: f.name }
      })

      if (configOutput && configTemplate) {
        const configPath = path.join(baseDir, configOutput)
        fs.writeFileSync(configPath, configTemplate(assets))
        log(`Config régénérée: ${configOutput}`, 'success')
      }

      return { uploaded: 0, skipped: files.length, errors: 0, fromRemote: true }
    }

    return { uploaded: 0, skipped: files.length, errors: 0, fromRemote: false }
  }

  const results = []
  let uploaded = 0, skipped = 0, errors = 0

  for (const fileName of files) {
    const filePath = path.join(sourceDir, fileName)

    if (!fs.existsSync(filePath)) {
      log(`${fileName} - fichier introuvable`, 'skip')
      skipped++
      continue
    }

    try {
      // Transformer l'image
      const buffer = await transformImage(filePath, transform)
      const originalSize = fs.statSync(filePath).size
      const optimizedSize = buffer.length
      const reduction = Math.round((1 - optimizedSize / originalSize) * 100)

      // Déterminer le nom de fichier final
      const ext = transform.format === 'jpeg' ? 'jpg' : transform.format
      const outputName = fileName.replace(/\.[^.]+$/, `.${ext}`)
      const fullPath = `${storagePath}/${outputName}`

      // Uploader
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(fullPath, buffer, {
          contentType: `image/${transform.format}`,
          upsert: true,
          cacheControl: '31536000',
        })

      if (error) {
        log(`${fileName}: ${error.message}`, 'error')
        errors++
        continue
      }

      const url = `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${fullPath}`
      const key = fileName.replace(/\.[^.]+$/, '').replace('persona-', '')

      log(`${fileName} → ${outputName} (${formatSize(originalSize)} → ${formatSize(optimizedSize)}, -${reduction}%)`, 'success')

      results.push({ key, url, name: outputName })
      uploaded++

    } catch (err) {
      log(`${fileName}: ${err.message}`, 'error')
      errors++
    }
  }

  // Générer le fichier de config
  if (configOutput && configTemplate && results.length > 0) {
    const configPath = path.join(baseDir, configOutput)
    fs.writeFileSync(configPath, configTemplate(results))
    log(`Config générée: ${configOutput}`, 'success')
  }

  return { uploaded, skipped, errors, fromRemote: false }
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('═'.repeat(60))
  console.log('  SEED SUPABASE ASSETS')
  console.log('═'.repeat(60))

  if (!SUPABASE_SERVICE_KEY) {
    console.error('\n[ERREUR] SUPABASE_SERVICE_ROLE_KEY manquant')
    console.error('Usage: SUPABASE_SERVICE_ROLE_KEY="..." node scripts/seed-supabase-assets.cjs')
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  const totalStats = { uploaded: 0, skipped: 0, errors: 0 }

  for (const [bucketName, bucketConfig] of Object.entries(BUCKETS_CONFIG)) {
    console.log(`\n📦 Bucket: ${bucketName}`)
    console.log('─'.repeat(40))

    // Créer le bucket si nécessaire
    await ensureBucket(supabase, bucketName, bucketConfig)

    // Traiter chaque groupe d'assets
    for (const [groupName, groupConfig] of Object.entries(bucketConfig.assets)) {
      const stats = await uploadAssetGroup(supabase, bucketName, groupName, groupConfig)
      totalStats.uploaded += stats.uploaded
      totalStats.skipped += stats.skipped
      totalStats.errors += stats.errors
    }
  }

  // Résumé
  console.log('\n' + '═'.repeat(60))
  console.log('  RÉSUMÉ')
  console.log('═'.repeat(60))
  console.log(`  Uploadés : ${totalStats.uploaded}`)
  console.log(`  Ignorés  : ${totalStats.skipped}`)
  console.log(`  Erreurs  : ${totalStats.errors}`)
  console.log('')

  if (totalStats.errors > 0) {
    console.log('[DONE] Seed terminé avec des erreurs')
    process.exit(1)
  } else {
    console.log('[DONE] Seed terminé avec succès!')
  }
}

main().catch(err => {
  console.error('\n[FATAL]', err.message)
  process.exit(1)
})
