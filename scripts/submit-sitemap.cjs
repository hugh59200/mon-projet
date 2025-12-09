/**
 * Script de soumission des sitemaps aux moteurs de recherche
 * Soumet le sitemap à Google et Bing pour indexation plus rapide
 *
 * Usage: node scripts/submit-sitemap.cjs
 */

const https = require('https')

const SITE_URL = 'https://fast-peptides.com'
const SITEMAPS = [
  `${SITE_URL}/sitemap.xml`,
  `${SITE_URL}/sitemap-index.xml`,
]

/**
 * Soumet un sitemap via HTTP GET (ping)
 */
function submitSitemap(url, searchEngine) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 200) {
          resolve({ success: true, searchEngine, statusCode: res.statusCode })
        } else {
          resolve({ success: false, searchEngine, statusCode: res.statusCode })
        }
      })
      .on('error', (err) => {
        reject({ success: false, searchEngine, error: err.message })
      })
  })
}

async function main() {
  console.log('🚀 Soumission des sitemaps aux moteurs de recherche...\n')

  const results = []

  for (const sitemap of SITEMAPS) {
    console.log(`📄 Sitemap: ${sitemap}`)

    // Google
    const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`
    try {
      const googleResult = await submitSitemap(googleUrl, 'Google')
      results.push(googleResult)
      console.log(
        `   ${googleResult.success ? '✅' : '❌'} Google: ${googleResult.statusCode}`,
      )
    } catch (err) {
      console.log(`   ❌ Google: ${err.error}`)
      results.push(err)
    }

    // Bing (IndexNow est plus moderne, mais le ping classique fonctionne aussi)
    const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemap)}`
    try {
      const bingResult = await submitSitemap(bingUrl, 'Bing')
      results.push(bingResult)
      console.log(
        `   ${bingResult.success ? '✅' : '❌'} Bing: ${bingResult.statusCode}`,
      )
    } catch (err) {
      console.log(`   ❌ Bing: ${err.error}`)
      results.push(err)
    }

    console.log('')
  }

  // Résumé
  const successful = results.filter((r) => r.success).length
  const failed = results.length - successful

  console.log('📊 Résumé:')
  console.log(`   ✅ Succès: ${successful}`)
  console.log(`   ❌ Échecs: ${failed}`)

  if (failed > 0) {
    console.log('\n⚠️  Certaines soumissions ont échoué.')
    console.log('    Les sitemaps seront découverts naturellement par les crawlers.')
  }

  console.log('\n💡 Conseils:')
  console.log('   - Vérifiez Google Search Console: https://search.google.com/search-console')
  console.log('   - Vérifiez Bing Webmaster Tools: https://www.bing.com/webmasters')
  console.log('   - Les résultats peuvent prendre quelques jours à apparaître')
}

main().catch((err) => {
  console.error('❌ Erreur:', err)
  process.exit(1)
})
