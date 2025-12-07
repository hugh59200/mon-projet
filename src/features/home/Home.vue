<template>
  <div class="home">
    <ContentBlock
      variant="flat"
      width="100%"
      padding="0"
      min-height="500px"
      border-radius="0"
      :centered="false"
      :no-border="true"
    >
      <HomeHero />
    </ContentBlock>
    <ContentBlock
      size="lg"
      max-width="1200px"
      theme="dark"
    >
      <HomeQuality />
    </ContentBlock>
    <ContentBlock
      variant="card"
      max-width="1200px"
      padding="0"
      theme="dark"
    >
      <CategoryHeroBanner />
    </ContentBlock>
    <ContentBlock
      variant="card"
      max-width="1200px"
      padding="60px 50px"
      theme="dark"
    >
      <NewsletterSection />
    </ContentBlock>
    <ContentBlock
      variant="card"
      max-width="1200px"
      padding="0"
      theme="dark"
    >
      <HomeScience />
    </ContentBlock>
    <ContentBlock
      variant="card"
      size="lg"
      theme="dark"
      max-width="1200px"
    >
      <HomeCta />
    </ContentBlock>
  </div>
</template>

<script setup lang="ts">
  import NewsletterSection from '@/features/newsletter/components/NewsletterSection.vue'
  import ContentBlock from '@designSystem/components/layout/ContentBlock.vue'
  import { useHead } from '@vueuse/head'
  import CategoryHeroBanner from './CategoryHeroBanner.vue'
  import HomeCta from './HomeCta.vue'
  import HomeHero from './HomeHero.vue'
  import HomeQuality from './HomeQuality.vue'
  import HomeScience from './HomeScience.vue'

  // Configuration SEO pour la page d'accueil
  useHead({
    title: 'Atlas Lab Solutions - Peptides de Recherche de Haute Pureté',
    meta: [
      {
        name: 'description',
        content:
          'Découvrez notre gamme complète de peptides et réactifs chimiques pour la recherche scientifique. Qualité laboratoire garantie, expédition rapide depuis la France et les États-Unis.',
      },
      {
        property: 'og:title',
        content: 'Atlas Lab Solutions - Peptides de Recherche',
      },
      {
        property: 'og:description',
        content:
          'Fournisseur de peptides de haute pureté pour la recherche scientifique. Expédition rapide et service client professionnel.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://fast-peptides.com',
      },
    ],
  })
</script>

<style scoped lang="less">
  .home {
    display: flex;
    flex-direction: column;
    gap: 60px;
    overflow-x: hidden;
    padding-bottom: 50px;
  }

  // Responsive - Tablet
  .respond-tablet({
    .home {
      gap: 40px;
      padding-bottom: 40px;
    }
  });

  // Responsive - Mobile
  .respond-mobile({
    .home {
      gap: 32px;
      padding-bottom: 32px;
    }
  });
</style>
