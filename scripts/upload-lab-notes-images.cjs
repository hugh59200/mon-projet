/**
 * Script d'upload des images Lab Notes vers Supabase Storage
 * Usage: SUPABASE_SERVICE_ROLE_KEY="..." node scripts/upload-lab-notes-images.cjs
 */

const fs = require('fs').promises
const path = require('path')
const sharp = require('sharp')
const { createClient } = require('@supabase/supabase-js')

// Mapping des fichiers source → noms cibles
const IMAGE_MAPPING = [
  { source: 'wmremove-transformed.png', target: 'lab-reconstitution', title: 'Reconstitution des Peptides' },
  { source: 'wmremove-transformed (2).png', target: 'hplc-analysis', title: 'Analyse HPLC' },
  { source: 'wmremove-transformed (3).png', target: 'storage-peptides', title: 'Stockage des Peptides' },
  { source: 'wmremove-transformed (4).png', target: 'molecular-structure', title: 'Structure Moléculaire' },
  { source: 'wmremove-transformed (5).png', target: 'quality-standards', title: 'Standards Qualité' },
]

const CONFIG = {
  sourceDir: 'C:\\Users\\hugo.bogrand-ext\\Downloads',
  bucketName: 'news-images',
  image: {
    maxWidth: 1200,
    quality: 85,
  },
}

async function loadEnv() {
  const envFiles = ['.env', '.env.local']
  for (const envFile of envFiles) {
    try {
      const envPath = path.resolve(__dirname, '..', envFile)
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
}

function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('\n❌ Variables manquantes : VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY\n')
    process.exit(1)
  }

  return createClient(supabaseUrl, supabaseKey)
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

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

  // Convertir en JPG pour les images de type photo/illustration
  const optimizedBuffer = await pipeline
    .jpeg({ quality: CONFIG.image.quality })
    .toBuffer()

  const stats = await fs.stat(inputPath)

  return {
    buffer: optimizedBuffer,
    originalSize: stats.size,
    optimizedSize: optimizedBuffer.length,
  }
}

async function uploadToSupabase(supabase, buffer, filename) {
  const { data, error } = await supabase.storage
    .from(CONFIG.bucketName)
    .upload(filename, buffer, {
      contentType: 'image/jpeg',
      upsert: true,
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from(CONFIG.bucketName)
    .getPublicUrl(filename)

  return urlData.publicUrl
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗')
  console.log('║     🖼️  Upload Images Lab Notes → Supabase                 ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  const supabase = getSupabaseClient()

  let totalOriginal = 0
  let totalOptimized = 0
  const results = []

  for (const mapping of IMAGE_MAPPING) {
    const inputPath = path.join(CONFIG.sourceDir, mapping.source)
    const outputFilename = `${mapping.target}.jpg`

    process.stdout.write(`📤 ${mapping.title.padEnd(30)}`)

    try {
      await fs.access(inputPath)

      const { buffer, originalSize, optimizedSize } = await optimizeImage(inputPath)
      totalOriginal += originalSize
      totalOptimized += optimizedSize

      const publicUrl = await uploadToSupabase(supabase, buffer, outputFilename)

      console.log(`✅ ${formatSize(originalSize)} → ${formatSize(optimizedSize)}`)
      results.push({ title: mapping.title, target: mapping.target, url: publicUrl, success: true })
    } catch (error) {
      console.log(`❌ ${error.message}`)
      results.push({ title: mapping.title, target: mapping.target, success: false, error: error.message })
    }
  }

  console.log('\n' + '─'.repeat(60))
  console.log(`📦 Total: ${formatSize(totalOriginal)} → ${formatSize(totalOptimized)}`)
  console.log(`🎯 Compression: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`)

  console.log('\n📝 URLs générées :\n')
  for (const r of results) {
    if (r.success) {
      console.log(`  ${r.target}.jpg`)
      console.log(`  → ${r.url}\n`)
    }
  }

  console.log('✨ Terminé !\n')
}

loadEnv().then(main).catch(err => {
  console.error('\n❌ Erreur:', err.message)
  process.exit(1)
})
