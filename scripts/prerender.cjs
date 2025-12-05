/**
 * Script de prerendering pour SEO
 * Génère des pages HTML statiques pour les bots de moteurs de recherche
 *
 * Usage: SUPABASE_SERVICE_ROLE_KEY="xxx" node scripts/prerender.cjs
 *
 * Ce script :
 * 1. Lance un serveur preview Vite
 * 2. Récupère toutes les routes depuis Supabase
 * 3. Utilise Puppeteer pour rendre chaque page
 * 4. Sauvegarde le HTML dans dist/
 */

const puppeteer = require('puppeteer')
const { createClient } = require('@supabase/supabase-js')
const http = require('http')
const fs = require('fs')
const path = require('path')

const SUPABASE_URL = 'https://dwomsbawthlktapmtmqu.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const PREVIEW_PORT = 4173
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`

// Configuration
const CONFIG = {
  // Timeout pour le rendu de chaque page (ms)
  renderTimeout: 10000,
  // Attendre que le réseau soit idle
  waitUntil: 'networkidle0',
  // Nombre de pages à rendre en parallèle
  concurrency: 3,
}

// Pages statiques prioritaires
const staticRoutes = [
  '/',
  '/catalogue',
  '/actualites',
  '/faq',
  '/about',
  '/reconstitution',
  '/contact',
  '/legal/cgv',
  '/legal/privacy',
  '/legal/mentions',
]

let supabase = null

function initSupabase() {
  if (!SUPABASE_SERVICE_KEY) {
    console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY non définie - seules les pages statiques seront pré-rendues')
    return false
  }
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  return true
}

async function fetchProducts() {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('products')
    .select('id')
    .gt('stock', 0)

  if (error) {
    console.error('❌ Erreur fetch products:', error.message)
    return []
  }

  return (data || []).map(p => `/catalogue/${p.id}`)
}

async function fetchNews() {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('news')
    .select('slug')
    .not('published_at', 'is', null)

  if (error) {
    console.error('❌ Erreur fetch news:', error.message)
    return []
  }

  return (data || []).map(n => `/actualites/${n.slug}`)
}

async function getAllRoutes() {
  const [productRoutes, newsRoutes] = await Promise.all([
    fetchProducts(),
    fetchNews(),
  ])

  console.log(`📦 ${productRoutes.length} produits`)
  console.log(`📰 ${newsRoutes.length} actualités`)

  return [...staticRoutes, ...productRoutes, ...newsRoutes]
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

function startPreviewServer() {
  return new Promise((resolve) => {
    console.log('🚀 Démarrage du serveur preview...')

    const distPath = path.join(__dirname, '..', 'dist')

    const server = http.createServer((req, res) => {
      let urlPath = req.url.split('?')[0]
      if (urlPath === '/') urlPath = '/index.html'

      // Toujours servir index.html pour les routes SPA
      let filePath = path.join(distPath, urlPath)
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distPath, 'index.html')
      }

      try {
        const content = fs.readFileSync(filePath)
        res.writeHead(200, { 'Content-Type': getMimeType(filePath) })
        res.end(content)
      } catch (err) {
        res.writeHead(404)
        res.end('Not found')
      }
    })

    server.listen(PREVIEW_PORT, () => {
      console.log('✅ Serveur preview démarré sur le port', PREVIEW_PORT)
      resolve(server)
    })
  })
}

async function renderPage(browser, route) {
  const page = await browser.newPage()

  try {
    // User agent de Googlebot pour tester le rendu
    await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')

    const url = `${PREVIEW_URL}${route}`
    await page.goto(url, {
      waitUntil: CONFIG.waitUntil,
      timeout: CONFIG.renderTimeout,
    })

    // Attendre que Vue ait fini de monter
    await page.waitForSelector('#app', { timeout: 5000 })

    // Petit délai supplémentaire pour les animations/transitions
    await new Promise(r => setTimeout(r, 500))

    // Récupérer le HTML complet
    const html = await page.content()

    // Déterminer le chemin de sortie
    let outputPath
    if (route === '/') {
      outputPath = path.join(__dirname, '..', 'dist', 'index.html')
    } else {
      // Créer le dossier si nécessaire
      const routeDir = path.join(__dirname, '..', 'dist', route)
      fs.mkdirSync(routeDir, { recursive: true })
      outputPath = path.join(routeDir, 'index.html')
    }

    // Sauvegarder le HTML
    fs.writeFileSync(outputPath, html, 'utf8')

    return { route, success: true }
  } catch (error) {
    return { route, success: false, error: error.message }
  } finally {
    await page.close()
  }
}

async function renderInBatches(browser, routes) {
  const results = []

  for (let i = 0; i < routes.length; i += CONFIG.concurrency) {
    const batch = routes.slice(i, i + CONFIG.concurrency)
    const batchResults = await Promise.all(
      batch.map(route => renderPage(browser, route))
    )
    results.push(...batchResults)

    // Progress
    const done = Math.min(i + CONFIG.concurrency, routes.length)
    process.stdout.write(`\r🔄 Rendu: ${done}/${routes.length} pages`)
  }

  console.log() // Nouvelle ligne après la progress bar
  return results
}

async function main() {
  console.log('🎨 Prerendering pour SEO\n')

  // Vérifier que le build existe
  const distPath = path.join(__dirname, '..', 'dist')
  if (!fs.existsSync(distPath)) {
    console.error('❌ Le dossier dist/ n\'existe pas. Lancez d\'abord: npm run build')
    process.exit(1)
  }

  // Initialiser Supabase
  initSupabase()

  // Récupérer toutes les routes
  console.log('📋 Récupération des routes...')
  const routes = await getAllRoutes()
  console.log(`📊 Total: ${routes.length} pages à pré-rendre\n`)

  // Démarrer le serveur preview
  const server = await startPreviewServer()

  let browser
  try {
    // Lancer Puppeteer
    console.log('🌐 Lancement du navigateur...')
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    // Rendre toutes les pages
    console.log('📝 Rendu des pages...\n')
    const results = await renderInBatches(browser, routes)

    // Résumé
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)

    console.log(`\n✅ Succès: ${successful.length} pages`)

    if (failed.length > 0) {
      console.log(`❌ Échecs: ${failed.length} pages`)
      failed.forEach(f => console.log(`   - ${f.route}: ${f.error}`))
    }

  } finally {
    // Cleanup
    if (browser) await browser.close()
    server.close()
    console.log('\n🏁 Prerendering terminé!')
  }
}

main().catch(err => {
  console.error('❌ Erreur fatale:', err)
  process.exit(1)
})
