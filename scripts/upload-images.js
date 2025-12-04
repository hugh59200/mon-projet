/**
 * Script de migration d'images vers Supabase Storage
 *
 * Fonctionnalités :
 * - Optimise les images (WebP, max 1000px, qualité 80)
 * - Upload vers le bucket Supabase "products"
 * - Génère un rapport avec les URLs publiques
 * - Génère les requêtes SQL de mise à jour
 *
 * SÉCURITÉ : Les fichiers sources ne sont JAMAIS modifiés ni supprimés
 *
 * Usage : node scripts/upload-images.js
 */

import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'

// Configuration ESM pour __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Dossier source (relatif à la racine du projet)
  sourceDir: path.resolve(__dirname, '../source_images'),

  // Bucket Supabase
  bucketName: 'products',

  // Dossier dans le bucket (optionnel, laisser vide pour la racine)
  bucketFolder: '',

  // Options d'optimisation
  image: {
    maxWidth: 1000,
    format: 'webp',
    quality: 80,
  },

  // Extensions supportées
  supportedExtensions: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.tiff', '.bmp'],

  // Fichier de sortie SQL
  sqlOutputFile: path.resolve(__dirname, '../sql_update.txt'),

  // Fichier de rapport JSON
  reportFile: path.resolve(__dirname, '../upload_report.json'),
}

// ============================================
// SUPABASE CLIENT
// ============================================

function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('\n❌ Variables d\'environnement manquantes !')
    console.error('   Assurez-vous que VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies.')
    console.error('\n   Options :')
    console.error('   1. Créez un fichier .env à la racine du projet')
    console.error('   2. Ou lancez avec : VITE_SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/upload-images.js\n')
    process.exit(1)
  }

  return createClient(supabaseUrl, supabaseKey)
}

// ============================================
// UTILITAIRES
// ============================================

/**
 * Convertit un nom de fichier en slug URL-friendly
 * "BPC 157.png" -> "bpc-157"
 */
function slugify(filename) {
  // Enlever l'extension
  const nameWithoutExt = path.parse(filename).name

  return nameWithoutExt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]+/g, '-')     // Remplacer les caractères spéciaux par des tirets
    .replace(/^-+|-+$/g, '')         // Supprimer les tirets en début/fin
    .replace(/-+/g, '-')             // Éviter les tirets multiples
}

/**
 * Formate la taille en bytes vers une chaîne lisible
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Affiche une barre de progression
 */
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

/**
 * Optimise une image avec Sharp
 * @returns {Buffer} Image optimisée en WebP
 */
async function optimizeImage(inputPath) {
  const image = sharp(inputPath)
  const metadata = await image.metadata()

  // Redimensionner seulement si l'image est plus large que maxWidth
  let pipeline = image
  if (metadata.width && metadata.width > CONFIG.image.maxWidth) {
    pipeline = pipeline.resize(CONFIG.image.maxWidth, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
  }

  // Convertir en WebP
  const optimizedBuffer = await pipeline
    .webp({ quality: CONFIG.image.quality })
    .toBuffer()

  return {
    buffer: optimizedBuffer,
    originalSize: (await fs.stat(inputPath)).size,
    optimizedSize: optimizedBuffer.length,
    originalWidth: metadata.width,
    originalHeight: metadata.height,
  }
}

// ============================================
// UPLOAD SUPABASE
// ============================================

/**
 * Upload un buffer vers Supabase Storage
 */
async function uploadToSupabase(supabase, buffer, filename) {
  const filePath = CONFIG.bucketFolder
    ? `${CONFIG.bucketFolder}/${filename}`
    : filename

  const { data, error } = await supabase.storage
    .from(CONFIG.bucketName)
    .upload(filePath, buffer, {
      contentType: 'image/webp',
      upsert: true, // Remplacer si existe déjà
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  // Récupérer l'URL publique
  const { data: urlData } = supabase.storage
    .from(CONFIG.bucketName)
    .getPublicUrl(filePath)

  return {
    path: data.path,
    publicUrl: urlData.publicUrl,
  }
}

// ============================================
// GÉNÉRATION DES FICHIERS DE SORTIE
// ============================================

/**
 * Génère le fichier SQL de mise à jour
 */
async function generateSqlFile(results) {
  const lines = [
    '-- ==============================================',
    '-- Script SQL de mise à jour des images produits',
    `-- Généré le ${new Date().toISOString()}`,
    '-- ==============================================',
    '',
    '-- ATTENTION : Vérifiez les correspondances avant d\'exécuter !',
    '-- Ce script suppose que le nom du fichier correspond au slug du produit.',
    '',
    'BEGIN;',
    '',
  ]

  for (const result of results) {
    if (result.success) {
      // Essayer de matcher avec le nom du produit
      const productSlug = result.slug
      lines.push(`-- Fichier source : ${result.originalFile}`)
      lines.push(`UPDATE products SET image_url = '${result.publicUrl}' WHERE slug = '${productSlug}';`)
      lines.push('')
    }
  }

  lines.push('-- Vérification avant commit')
  lines.push('-- SELECT id, name, slug, image_url FROM products WHERE image_url LIKE \'%supabase%\';')
  lines.push('')
  lines.push('COMMIT;')
  lines.push('')
  lines.push('-- En cas de problème : ROLLBACK;')

  await fs.writeFile(CONFIG.sqlOutputFile, lines.join('\n'), 'utf-8')
}

/**
 * Génère le rapport JSON
 */
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
      originalSize: r.originalSize,
      optimizedSize: r.optimizedSize,
      compressionRatio: r.originalSize
        ? `${((1 - r.optimizedSize / r.originalSize) * 100).toFixed(1)}%`
        : null,
    })),
  }

  await fs.writeFile(CONFIG.reportFile, JSON.stringify(report, null, 2), 'utf-8')
}

// ============================================
// SCRIPT PRINCIPAL
// ============================================

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗')
  console.log('║     🖼️  Migration d\'images vers Supabase Storage          ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  // Vérifier que le dossier source existe
  try {
    await fs.access(CONFIG.sourceDir)
  } catch {
    console.error(`❌ Dossier source introuvable : ${CONFIG.sourceDir}`)
    console.error('\n   Créez le dossier et placez-y vos images :')
    console.error(`   mkdir -p "${CONFIG.sourceDir}"\n`)
    process.exit(1)
  }

  // Lister les fichiers images
  const allFiles = await fs.readdir(CONFIG.sourceDir)
  const imageFiles = allFiles.filter(f =>
    CONFIG.supportedExtensions.includes(path.extname(f).toLowerCase())
  )

  if (imageFiles.length === 0) {
    console.error(`❌ Aucune image trouvée dans ${CONFIG.sourceDir}`)
    console.error(`   Extensions supportées : ${CONFIG.supportedExtensions.join(', ')}\n`)
    process.exit(1)
  }

  console.log(`📁 Dossier source : ${CONFIG.sourceDir}`)
  console.log(`📦 Bucket cible   : ${CONFIG.bucketName}`)
  console.log(`🖼️  Images trouvées : ${imageFiles.length}\n`)

  // Initialiser Supabase
  const supabase = getSupabaseClient()

  // Vérifier que le bucket existe
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
  if (bucketsError) {
    console.error(`❌ Erreur Supabase : ${bucketsError.message}`)
    process.exit(1)
  }

  const bucketExists = buckets.some(b => b.name === CONFIG.bucketName)
  if (!bucketExists) {
    console.error(`❌ Le bucket "${CONFIG.bucketName}" n'existe pas.`)
    console.error('   Créez-le dans le dashboard Supabase > Storage.\n')
    process.exit(1)
  }

  // Traitement des images
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

    process.stdout.write(`\r${progressBar(i + 1, imageFiles.length)} ${file.padEnd(30).slice(0, 30)}`)

    try {
      // 1. Optimiser l'image (en mémoire, pas de modification du fichier source)
      const { buffer, originalSize, optimizedSize, originalWidth, originalHeight } =
        await optimizeImage(inputPath)

      stats.totalOriginalSize += originalSize
      stats.totalOptimizedSize += optimizedSize

      // 2. Upload vers Supabase
      const { publicUrl, path: uploadPath } = await uploadToSupabase(
        supabase,
        buffer,
        outputFilename
      )

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

  // Générer les fichiers de sortie
  await generateSqlFile(results)
  await generateJsonReport(results, stats)

  // Afficher le rapport
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║                    📊 RAPPORT FINAL                       ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  console.log(`✅ Succès     : ${stats.success}/${stats.total}`)
  if (stats.failed > 0) {
    console.log(`❌ Échecs     : ${stats.failed}/${stats.total}`)
  }
  console.log(`📦 Taille originale  : ${formatSize(stats.totalOriginalSize)}`)
  console.log(`📦 Taille optimisée  : ${formatSize(stats.totalOptimizedSize)}`)
  console.log(`🎯 Compression       : ${((1 - stats.totalOptimizedSize / stats.totalOriginalSize) * 100).toFixed(1)}%`)

  console.log('\n📝 URLs publiques générées :\n')
  console.log('─'.repeat(70))

  for (const result of results) {
    if (result.success) {
      console.log(`  ${result.originalFile}`)
      console.log(`  → ${result.publicUrl}`)
      console.log(`    (${formatSize(result.originalSize)} → ${formatSize(result.optimizedSize)})`)
      console.log('')
    } else {
      console.log(`  ❌ ${result.originalFile}`)
      console.log(`     Erreur : ${result.error}`)
      console.log('')
    }
  }

  console.log('─'.repeat(70))
  console.log(`\n📄 Fichier SQL généré : ${CONFIG.sqlOutputFile}`)
  console.log(`📄 Rapport JSON       : ${CONFIG.reportFile}`)

  console.log('\n✨ Migration terminée !')
  console.log('⚠️  N\'oubliez pas de vérifier le fichier SQL avant de l\'exécuter.\n')

  // Code de sortie
  process.exit(stats.failed > 0 ? 1 : 0)
}

// Charger les variables d'environnement depuis .env si présent
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
  } catch {
    // Pas de fichier .env, ce n'est pas grave
  }
}

// Point d'entrée
loadEnv().then(main).catch(error => {
  console.error('\n❌ Erreur fatale :', error.message)
  process.exit(1)
})
