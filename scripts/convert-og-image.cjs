/**
 * Convertit og-image.svg en og-image.jpg
 * Utilise sharp (déjà installé)
 *
 * Usage: node scripts/convert-og-image.cjs
 */

const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const inputPath = path.join(__dirname, '..', 'public', 'og-image.svg')
const outputPath = path.join(__dirname, '..', 'public', 'og-image.jpg')

async function convert() {
  console.log('🎨 Conversion og-image.svg → og-image.jpg...')

  if (!fs.existsSync(inputPath)) {
    console.error('❌ Fichier source non trouvé:', inputPath)
    process.exit(1)
  }

  try {
    await sharp(inputPath)
      .resize(1200, 630)
      .jpeg({ quality: 90 })
      .toFile(outputPath)

    const stats = fs.statSync(outputPath)
    const sizeKb = Math.round(stats.size / 1024)

    console.log('✅ Image créée:', outputPath)
    console.log(`📦 Taille: ${sizeKb} Ko`)

    if (sizeKb > 300) {
      console.warn('⚠️  Image > 300 Ko, optimisation recommandée')
    }
  } catch (err) {
    console.error('❌ Erreur conversion:', err.message)
    process.exit(1)
  }
}

convert()
