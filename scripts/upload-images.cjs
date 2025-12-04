/**
 * Script de migration d'images vers Supabase Storage
 *
 * Usage : node scripts/upload-images.cjs
 */

const fs = require('fs').promises
const path = require('path')
const sharp = require('sharp')
const { createClient } = require('@supabase/supabase-js')

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  sourceDir: path.resolve(__dirname, '../source_images'),
  bucketName: 'products',
  bucketFolder: '',
  image: {
    maxWidth: 1000,
    format: 'webp',
    quality: 80,
  },
  supportedExtensions: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.tiff', '.bmp'],
  sqlOutputFile: path.resolve(__dirname, '../sql_update.txt'),
  reportFile: path.resolve(__dirname, '../upload_report.json'),
}

// ============================================
// LOAD ENV
// ============================================

async function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env')
    const envContent = await fs.readFile(envPath, 'utf-8')
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        const value = valueParts.join('=').replace(/^["']|["']$/g, '')
        if (key && value && !process.env[key]) {
          process.env[key] = value
        }
      }
    }
  } catch {}
}

// ============================================
// SUPABASE CLIENT
// ============================================

function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('\n❌ Variables d\'environnement manquantes !')
    console.error('   SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.\n')
    process.exit(1)
  }

  return createClient(supabaseUrl, supabaseKey)
}

// ============================================
// UTILITAIRES
// ============================================

function slugify(filename) {
  const nameWithoutExt = path.parse(filename).name
  return nameWithoutExt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function progressBar(current, total, width = 30) {
  const percent = current / total
  const filled = Math.round(width * percent)
  const empty = width - filled
  const bar = '█'.repeat(filled) + '░'.repeat(empty)
  return `[${bar}] ${current}/${total}`
}

// ============================================
// TRAITEMENT D'IMAGE
// ============================================

async function optimizeImage(inputPath) {
  const image = sharp(inputPath)
  const metadata = await image.metadata()

  let pipeline = image
  if (metadata.width && metadata.width > CONFIG.image.maxWidth) {
    pipeline = pipeline.resize(CONFIG.image.maxWidth, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
  }

  const optimizedBuffer = await pipeline
    .webp({ quality: CONFIG.image.quality })
    .toBuffer()

  const stats = await fs.stat(inputPath)

  return {
    buffer: optimizedBuffer,
    originalSize: stats.size,
    optimizedSize: optimizedBuffer.length,
    originalWidth: metadata.width,
    originalHeight: metadata.height,
  }
}

// ============================================
// UPLOAD SUPABASE
// ============================================

async function uploadToSupabase(supabase, buffer, filename) {
  const filePath = CONFIG.bucketFolder
    ? `${CONFIG.bucketFolder}/${filename}`
    : filename

  const { data, error } = await supabase.storage
    .from(CONFIG.bucketName)
    .upload(filePath, buffer, {
      contentType: 'image/webp',
      upsert: true,
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from(CONFIG.bucketName)
    .getPublicUrl(filePath)

  return {
    path: data.path,
    publicUrl: urlData.publicUrl,
  }
}

// ============================================
// GÉNÉRATION FICHIERS
// ============================================

async function generateSqlFile(results) {
  const lines = [
    '-- Script SQL de mise à jour des images produits',
    `-- Généré le ${new Date().toISOString()}`,
    '',
    'BEGIN;',
    '',
  ]

  for (const result of results) {
    if (result.success) {
      lines.push(`-- Fichier source : ${result.originalFile}`)
      lines.push(`UPDATE products SET image_url = '${result.publicUrl}' WHERE slug ILIKE '%${result.slug}%';`)
      lines.push('')
    }
  }

  lines.push('COMMIT;')
  await fs.writeFile(CONFIG.sqlOutputFile, lines.join('\n'), 'utf-8')
}

async function generateJsonReport(results, stats) {
  const report = {
    generatedAt: new Date().toISOString(),
    stats,
    results: results.map(r => ({
      originalFile: r.originalFile,
      slug: r.slug,
      publicUrl: r.publicUrl || null,
      success: r.success,
      error: r.error || null,
      compression: r.originalSize
        ? `${((1 - r.optimizedSize / r.originalSize) * 100).toFixed(1)}%`
        : null,
    })),
  }
  await fs.writeFile(CONFIG.reportFile, JSON.stringify(report, null, 2), 'utf-8')
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗')
  console.log('║     🖼️  Migration d\'images vers Supabase Storage          ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  try {
    await fs.access(CONFIG.sourceDir)
  } catch {
    console.error(`❌ Dossier source introuvable : ${CONFIG.sourceDir}\n`)
    process.exit(1)
  }

  const allFiles = await fs.readdir(CONFIG.sourceDir)
  const imageFiles = allFiles.filter(f =>
    CONFIG.supportedExtensions.includes(path.extname(f).toLowerCase())
  )

  if (imageFiles.length === 0) {
    console.error(`❌ Aucune image trouvée dans ${CONFIG.sourceDir}\n`)
    process.exit(1)
  }

  console.log(`📁 Dossier source : ${CONFIG.sourceDir}`)
  console.log(`📦 Bucket cible   : ${CONFIG.bucketName}`)
  console.log(`🖼️  Images trouvées : ${imageFiles.length}\n`)

  const supabase = getSupabaseClient()

  // Vérifier bucket
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
  if (bucketsError) {
    console.error(`❌ Erreur Supabase : ${bucketsError.message}`)
    process.exit(1)
  }

  const bucketExists = buckets.some(b => b.name === CONFIG.bucketName)
  if (!bucketExists) {
    console.log(`⚠️  Bucket "${CONFIG.bucketName}" non trouvé, création...`)
    const { error: createError } = await supabase.storage.createBucket(CONFIG.bucketName, {
      public: true,
    })
    if (createError) {
      console.error(`❌ Impossible de créer le bucket : ${createError.message}`)
      process.exit(1)
    }
    console.log(`✅ Bucket "${CONFIG.bucketName}" créé\n`)
  }

  console.log('🚀 Début du traitement...\n')

  const results = []
  const stats = {
    total: imageFiles.length,
    success: 0,
    failed: 0,
    totalOriginalSize: 0,
    totalOptimizedSize: 0,
  }

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i]
    const inputPath = path.join(CONFIG.sourceDir, file)
    const slug = slugify(file)
    const outputFilename = `${slug}.webp`

    process.stdout.write(`\r${progressBar(i + 1, imageFiles.length)} ${file.substring(0, 25).padEnd(25)}`)

    try {
      const { buffer, originalSize, optimizedSize, originalWidth, originalHeight } =
        await optimizeImage(inputPath)

      stats.totalOriginalSize += originalSize
      stats.totalOptimizedSize += optimizedSize

      const { publicUrl } = await uploadToSupabase(supabase, buffer, outputFilename)

      results.push({
        originalFile: file,
        slug,
        outputFilename,
        publicUrl,
        originalSize,
        optimizedSize,
        dimensions: `${originalWidth}x${originalHeight}`,
        success: true,
      })

      stats.success++
    } catch (error) {
      results.push({
        originalFile: file,
        slug,
        outputFilename,
        success: false,
        error: error.message,
        originalSize: 0,
        optimizedSize: 0,
      })
      stats.failed++
    }
  }

  console.log('\n\n')

  await generateSqlFile(results)
  await generateJsonReport(results, stats)

  // Rapport
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║                    📊 RAPPORT FINAL                       ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  console.log(`✅ Succès     : ${stats.success}/${stats.total}`)
  if (stats.failed > 0) console.log(`❌ Échecs     : ${stats.failed}/${stats.total}`)
  console.log(`📦 Original   : ${formatSize(stats.totalOriginalSize)}`)
  console.log(`📦 Optimisé   : ${formatSize(stats.totalOptimizedSize)}`)
  console.log(`🎯 Compression: ${((1 - stats.totalOptimizedSize / stats.totalOriginalSize) * 100).toFixed(1)}%`)

  console.log('\n📝 URLs générées :\n')
  console.log('─'.repeat(70))

  for (const result of results) {
    if (result.success) {
      console.log(`  ${result.originalFile}`)
      console.log(`  → ${result.publicUrl}`)
      console.log(`    (${formatSize(result.originalSize)} → ${formatSize(result.optimizedSize)})`)
      console.log('')
    } else {
      console.log(`  ❌ ${result.originalFile} : ${result.error}\n`)
    }
  }

  console.log('─'.repeat(70))
  console.log(`\n📄 SQL : ${CONFIG.sqlOutputFile}`)
  console.log(`📄 JSON: ${CONFIG.reportFile}`)
  console.log('\n✨ Migration terminée !\n')

  process.exit(stats.failed > 0 ? 1 : 0)
}

loadEnv().then(main).catch(err => {
  console.error('\n❌ Erreur :', err.message)
  process.exit(1)
})
