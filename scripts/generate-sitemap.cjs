/**
 * Script de génération du sitemap dynamique
 * Récupère les produits et actualités depuis Supabase pour générer un sitemap complet
 *
 * Usage: SUPABASE_SERVICE_ROLE_KEY="xxx" node scripts/generate-sitemap.cjs
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const SUPABASE_URL = 'https://dwomsbawthlktapmtmqu.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SITE_URL = 'https://fast-peptides.com'

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY non définie')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Pages statiques avec leurs priorités
const staticPages = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/catalogue', changefreq: 'daily', priority: '0.9' },
  { path: '/actualites', changefreq: 'weekly', priority: '0.8' },
  { path: '/faq', changefreq: 'monthly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/reconstitution', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/crypto-guide', changefreq: 'monthly', priority: '0.6' },
  { path: '/legal/cgv', changefreq: 'yearly', priority: '0.3' },
  { path: '/legal/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/legal/mentions', changefreq: 'yearly', priority: '0.3' },
]

async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, created_at')
    .gt('stock', 0)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Erreur fetch products:', error.message)
    return []
  }

  return data || []
}

async function fetchNews() {
  const { data, error } = await supabase
    .from('news')
    .select('slug, published_at')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('❌ Erreur fetch news:', error.message)
    return []
  }

  return data || []
}

function formatDate(date) {
  if (!date) return new Date().toISOString().split('T')[0]
  return new Date(date).toISOString().split('T')[0]
}

function generateUrlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

async function generateSitemap() {
  console.log('🚀 Génération du sitemap dynamique...')

  // Fetch data from Supabase
  const [products, news] = await Promise.all([fetchProducts(), fetchNews()])

  console.log(`📦 ${products.length} produits trouvés`)
  console.log(`📰 ${news.length} actualités trouvées`)

  const today = formatDate(new Date())
  const urls = []

  // Pages statiques
  for (const page of staticPages) {
    urls.push(generateUrlEntry(page.path, today, page.changefreq, page.priority))
  }

  // Pages produits
  for (const product of products) {
    urls.push(
      generateUrlEntry(
        `/catalogue/${product.id}`,
        formatDate(product.created_at),
        'weekly',
        '0.8'
      )
    )
  }

  // Pages actualités
  for (const article of news) {
    urls.push(
      generateUrlEntry(
        `/actualites/${article.slug}`,
        formatDate(article.published_at),
        'monthly',
        '0.6'
      )
    )
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`

  // Écrire dans public/
  const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml')
  fs.writeFileSync(publicPath, sitemap, 'utf8')
  console.log(`✅ Sitemap généré: ${publicPath}`)

  // Stats
  console.log(`📊 Total URLs: ${urls.length}`)
  console.log(`   - Pages statiques: ${staticPages.length}`)
  console.log(`   - Produits: ${products.length}`)
  console.log(`   - Actualités: ${news.length}`)
}

generateSitemap().catch((err) => {
  console.error('❌ Erreur:', err)
  process.exit(1)
})
