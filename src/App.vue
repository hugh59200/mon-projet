<template>
  <AppLayout />
  <AgeGate />
</template>

<script setup lang="ts">
  import { useHead } from '@vueuse/head'
  import AppLayout from './features/interface/layout/AppLayout.vue'
  import AgeGate from './features/interface/components/AgeGate.vue'
  import { SEO_CONFIG, getCanonicalUrl } from './config/seo'

  // Configuration SEO par défaut
  useHead({
    title: 'Atlas Lab Solutions - Peptides de Recherche',
    meta: [
      {
        name: 'description',
        content:
          'Fournisseur de réactifs chimiques de haute pureté pour la recherche scientifique. Commandez des peptides et composés de qualité laboratoire.',
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
      {
        name: 'author',
        content: SEO_CONFIG.AUTHOR,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: SEO_CONFIG.SITE_NAME,
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: getCanonicalUrl('/'),
      },
    ],
  })
</script>
