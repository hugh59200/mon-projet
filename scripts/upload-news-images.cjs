const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuration Supabase
const SUPABASE_URL = 'https://dwomsbawthlktapmtmqu.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY non définie')
  console.log('Exécute: set SUPABASE_SERVICE_ROLE_KEY=ta_clé_service_role')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const DOWNLOADS_DIR = 'C:/Users/hugo.bogrand-ext/Downloads'
const BUCKET = 'news-images'

// Mapping des fichiers (articles 7-15)
const images = [
  { file: '1.png', name: 'tb500-bpc157-synergie.png' },
  { file: '2.png', name: 'collagene-recuperation-sport.png' },
  { file: '3.png', name: 'peptides-medecine-sport.png' },
  { file: '4.png', name: 'ghk-cu-peptide-cuivre.png' },
  { file: '5.png', name: 'collagene-oral-rides.png' },
  { file: '6.png', name: 'fda-bpc157-category2.png' },
  { file: '7.png', name: 'peptides-sport-ama.png' },
  { file: '8.png', name: 'glp1-cerveau-decouverte.png' },
  { file: '9.png', name: 'retatrutide-eli-lilly.png' },
]

async function uploadImages() {
  console.log('🚀 Upload des images news...\n')

  for (const img of images) {
    const sourcePath = path.join(DOWNLOADS_DIR, img.file)
    const destPath = `news/${img.name}`

    try {
      const fileBuffer = fs.readFileSync(sourcePath)

      // Supprimer l'ancienne image si elle existe
      await supabase.storage.from(BUCKET).remove([destPath])

      // Uploader la nouvelle
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(destPath, fileBuffer, {
          contentType: 'image/png',
          upsert: true
        })

      if (error) {
        console.error(`❌ ${img.file} → ${img.name}: ${error.message}`)
      } else {
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(destPath)
        console.log(`✅ ${img.file} → ${img.name}`)
        console.log(`   ${urlData.publicUrl}\n`)
      }
    } catch (err) {
      console.error(`❌ ${img.file}: ${err.message}`)
    }
  }

  console.log('✨ Upload terminé!')
}

uploadImages()
