<template>
  <AppLayout />
  <AgeGate />
</template>

<script setup lang="ts">
  import { useHead } from '@vueuse/head'
  import AppLayout from '@/features/interface/layout/AppLayout.vue'
  import AgeGate from '@/features/interface/components/AgeGate.vue'
  import { SEO_CONFIG, getCanonicalUrl } from '@/config/seo'

  // Schema JSON-LD pour Organization et WebSite (SEO + GEO)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.SITE_NAME,
    legalName: 'Atlas Lab Solutions LLC',
    url: SEO_CONFIG.APP_URL,
    logo: `${SEO_CONFIG.APP_URL}/logo.png`,
    description:
      'Fournisseur de peptides et réactifs chimiques de haute pureté pour la recherche scientifique. Research Use Only.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '5850 Eubank Blvd NE, Suite B13',
      addressLocality: 'Albuquerque',
      addressRegion: 'NM',
      postalCode: '87111',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@fast-peptides.com',
      contactType: 'customer service',
      availableLanguage: ['French', 'English'],
    },
    sameAs: [],
  }

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.SITE_NAME,
    url: SEO_CONFIG.APP_URL,
    description:
      'Peptides de recherche et réactifs chimiques de haute pureté pour laboratoires.',
    inLanguage: 'fr-FR',
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.SITE_NAME,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.APP_URL}/catalogue?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // Configuration SEO globale
  useHead({
    title: 'Atlas Lab Solutions - Peptides de Recherche',
    htmlAttrs: {
      lang: 'fr',
    },
    meta: [
      // Primary Meta
      {
        name: 'description',
        content:
          'Fournisseur de peptides et réactifs chimiques de haute pureté pour la recherche scientifique. Qualité laboratoire garantie. Research Use Only.',
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
      {
        name: 'author',
        content: SEO_CONFIG.AUTHOR,
      },
      // Open Graph
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: SEO_CONFIG.SITE_NAME,
      },
      {
        property: 'og:locale',
        content: 'fr_FR',
      },
      {
        property: 'og:image',
        content: SEO_CONFIG.DEFAULT_OG_IMAGE,
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      // Twitter Cards
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:site',
        content: '@AtlasLabSol',
      },
      {
        name: 'twitter:title',
        content: 'Atlas Lab Solutions - Peptides de Recherche',
      },
      {
        name: 'twitter:description',
        content:
          'Peptides et réactifs chimiques de haute pureté pour la recherche scientifique.',
      },
      {
        name: 'twitter:image',
        content: SEO_CONFIG.DEFAULT_OG_IMAGE,
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: getCanonicalUrl('/'),
      },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(organizationSchema),
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(webSiteSchema),
      },
    ],
  })
</script>
