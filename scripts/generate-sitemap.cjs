/**
 * Script de génération des sitemaps dynamiques
 * Génère : sitemap.xml (principal), sitemap-news.xml (Google News), sitemap-index.xml
 *
 * Usage: SUPABASE_SERVICE_ROLE_KEY="xxx" node scripts/generate-sitemap.cjs
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const SUPABASE_URL = 'https://dwomsbawthlktapmtmqu.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SITE_URL = 'https://fast-peptides.com'
const SITE_NAME = 'Atlas Lab Solutions'

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
  // Section "Lab Notes" - Contenu scientifique pour SEO (priorité élevée)
  { path: '/ressources', changefreq: 'weekly', priority: '0.85' },
  { path: '/faq', changefreq: 'monthly', priority: '0.8' },
  { path: '/a-propos', changefreq: 'monthly', priority: '0.7' },
  { path: '/guide-reconstitution', changefreq: 'monthly', priority: '0.75' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/guide-crypto', changefreq: 'monthly', priority: '0.6' },
  { path: '/mentions-legales', changefreq: 'yearly', priority: '0.3' },
  { path: '/politique-confidentialite', changefreq: 'yearly', priority: '0.3' },
  { path: '/cookies', changefreq: 'yearly', priority: '0.3' },
]

async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, created_at, updated_at, image')
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
    .select('slug, title, published_at, image')
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

function formatDateISO(date) {
  if (!date) return new Date().toISOString()
  return new Date(date).toISOString()
}

function generateUrlEntry(loc, lastmod, changefreq, priority, image = null) {
  let entry = `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`

  if (image) {
    entry += `
    <image:image>
      <image:loc>${image}</image:loc>
    </image:image>`
  }

  entry += `
  </url>`
  return entry
}

/**
 * Génère le sitemap-news.xml pour Google News
 * Inclut uniquement les articles publiés dans les 2 derniers jours
 */
function generateNewsSitemap(news) {
  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  const recentNews = news.filter((article) => {
    const publishedDate = new Date(article.published_at)
    return publishedDate >= twoDaysAgo
  })

  if (recentNews.length === 0) {
    console.log('ℹ️  Aucun article récent pour sitemap-news.xml')
    return null
  }

  const urls = recentNews.map((article) => {
    return `  <url>
    <loc>${SITE_URL}/actualites/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${SITE_NAME}</news:name>
        <news:language>fr</news:language>
      </news:publication>
      <news:publication_date>${formatDateISO(article.published_at)}</news:publication_date>
      <news:title><![CDATA[${article.title}]]></news:title>
    </news:news>
  </url>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join('\n')}
</urlset>
`
}

/**
 * Génère le sitemap-index.xml qui référence tous les sitemaps
 */
function generateSitemapIndex(hasNewsSitemap) {
  const today = formatDate(new Date())
  const sitemaps = [
    { loc: `${SITE_URL}/sitemap.xml`, lastmod: today },
  ]

  if (hasNewsSitemap) {
    sitemaps.push({ loc: `${SITE_URL}/sitemap-news.xml`, lastmod: today })
  }

  const entries = sitemaps.map((sm) => {
    return `  <sitemap>
    <loc>${sm.loc}</loc>
    <lastmod>${sm.lastmod}</lastmod>
  </sitemap>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>
`
}

async function generateSitemap() {
  console.log('🚀 Génération des sitemaps dynamiques...')

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

  // Pages produits (avec images)
  for (const product of products) {
    const lastmod = formatDate(product.updated_at || product.created_at)
    urls.push(
      generateUrlEntry(
        `/catalogue/${product.id}`,
        lastmod,
        'weekly',
        '0.8',
        product.image
      )
    )
  }

  // Pages actualités (avec images)
  for (const article of news) {
    urls.push(
      generateUrlEntry(
        `/actualites/${article.slug}`,
        formatDate(article.published_at),
        'monthly',
        '0.6',
        article.image
      )
    )
  }

  // Sitemap principal
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`

  const publicDir = path.join(__dirname, '..', 'public')

  // Écrire sitemap.xml
  const sitemapPath = path.join(publicDir, 'sitemap.xml')
  fs.writeFileSync(sitemapPath, sitemap, 'utf8')
  console.log(`✅ Sitemap principal généré: sitemap.xml`)

  // Générer sitemap-news.xml (si articles récents)
  const newsSitemap = generateNewsSitemap(news)
  let hasNewsSitemap = false
  if (newsSitemap) {
    const newsPath = path.join(publicDir, 'sitemap-news.xml')
    fs.writeFileSync(newsPath, newsSitemap, 'utf8')
    hasNewsSitemap = true
    console.log(`✅ Sitemap news généré: sitemap-news.xml`)
  }

  // Générer sitemap-index.xml
  const sitemapIndex = generateSitemapIndex(hasNewsSitemap)
  const indexPath = path.join(publicDir, 'sitemap-index.xml')
  fs.writeFileSync(indexPath, sitemapIndex, 'utf8')
  console.log(`✅ Sitemap index généré: sitemap-index.xml`)

  // Stats
  console.log(`\n📊 Résumé:`)
  console.log(`   - Total URLs: ${urls.length}`)
  console.log(`   - Pages statiques: ${staticPages.length}`)
  console.log(`   - Produits: ${products.length}`)
  console.log(`   - Actualités: ${news.length}`)
  console.log(`   - Sitemaps générés: ${hasNewsSitemap ? 3 : 2}`)
}

generateSitemap().catch((err) => {
  console.error('❌ Erreur:', err)
  process.exit(1)
})
