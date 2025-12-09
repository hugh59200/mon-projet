<template>
  <MaintenanceMode v-if="isMaintenanceMode" />

  <template v-else>
    <AppLayout />
    <AgeGate />
    <AppLoaderOverlay />
  </template>
</template>

<script setup lang="ts">
  import AppLoaderOverlay from '@/components/AppLoaderOverlay.vue'
  import MaintenanceMode from '@/components/MaintenanceMode.vue'
  import { SEO_CONFIG, getCanonicalUrl } from '@/config/seo'
  import AgeGate from '@/features/interface/components/AgeGate.vue'
  import AppLayout from '@/features/interface/layout/AppLayout.vue'
  import { useHead } from '@vueuse/head'

  // Kill Switch - Mode maintenance d'urgence
  // Récupéré au build time. Nécessite un redéploiement pour changer (Sécurité max)
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true'

  // ============================================================
  // 🔴 SEO Mode Maintenance : Silence Radio
  // ============================================================
  if (isMaintenanceMode) {
    useHead({
      title: 'Maintenance',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { name: 'robots', content: 'noindex, nofollow' }, // ⚠️ Invisible pour Google
        { name: 'description', content: 'Site en maintenance.' },
      ],
    })
  }

  // ============================================================
  // 🟢 SEO Mode Normal : Bouclier "Laboratoire" Actif
  // ============================================================
  else {
    // Schema JSON-LD Organisation
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SEO_CONFIG.SITE_NAME,
      legalName: 'Atlas Lab Solutions LLC',
      url: SEO_CONFIG.APP_URL,
      logo: `${SEO_CONFIG.APP_URL}/logo.png`,
      description:
        'Fournisseur de peptides et réactifs chimiques de haute pureté pour la recherche scientifique. Research Use Only.',
      // 📍 Adresse Légale (US) - OpSec OK
      address: {
        '@type': 'PostalAddress',
        streetAddress: '5850 Eubank Blvd NE, Suite B13',
        addressLocality: 'Albuquerque',
        addressRegion: 'NM',
        postalCode: '87111',
        addressCountry: 'US',
      },
      // 🎯 Zone de Service (France) - SEO OK
      areaServed: {
        '@type': 'Country',
        name: 'France',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@fast-peptides.com',
        contactType: 'customer service',
        availableLanguage: ['French', 'English'],
      },
    }

    const webSiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SEO_CONFIG.SITE_NAME,
      url: SEO_CONFIG.APP_URL,
      inLanguage: 'fr-FR',
      publisher: { '@type': 'Organization', name: SEO_CONFIG.SITE_NAME },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SEO_CONFIG.APP_URL}/catalogue?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }

    useHead({
      title: 'Atlas Lab Solutions - Peptides de Recherche',
      htmlAttrs: { lang: 'fr' },
      meta: [
        {
          name: 'description',
          content:
            'Fournisseur de peptides et réactifs chimiques de haute pureté pour la recherche scientifique. Qualité laboratoire garantie. Research Use Only.',
        },
        // ✅ Signal positif pour indexation
        {
          name: 'robots',
          content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        },
        { name: 'author', content: SEO_CONFIG.AUTHOR },
        // 🛡️ Mots-clés "Safe" B2B
        {
          name: 'keywords',
          content:
            'peptides synthèse France, research chemicals Europe, fourniture laboratoire peptides, pureté HPLC, réactifs recherche scientifique, RUO peptides',
        },

        // 🌍 Geo Targeting France
        { name: 'geo.region', content: 'FR' },
        { name: 'geo.placename', content: 'France' },

        // 🛡️ Signaux d'Autorité B2B (Anti-YMYL)
        {
          name: 'audience',
          content: 'Researcher, Laboratory Professional, Scientific Institution',
        },
        { name: 'classification', content: 'Laboratory Supplies, Research Chemicals' },
        { name: 'category', content: 'B2B, Research Use Only, Laboratory Reagents' },

        // Open Graph & Twitter (Classique)
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: SEO_CONFIG.SITE_NAME },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:image', content: SEO_CONFIG.DEFAULT_OG_IMAGE },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Atlas Lab Solutions - Peptides de Recherche' },
      ],
      link: [
        { rel: 'canonical', href: getCanonicalUrl('/') },
        { rel: 'alternate', hreflang: 'fr', href: SEO_CONFIG.APP_URL },
      ],
      script: [
        { type: 'application/ld+json', innerHTML: JSON.stringify(organizationSchema) },
        { type: 'application/ld+json', innerHTML: JSON.stringify(webSiteSchema) },
      ],
    })
  }
</script>
