<template>
  <div class="home">
    <!-- 1. Hero - Accroche principale -->
    <ContentBlock
      variant="flat"
      padding="0"
      min-height="500px"
      border-radius="0"
      :centered="false"
      :no-border="true"
    >
      <HomeHero />
    </ContentBlock>

    <!-- 2. Best-Sellers - Produits populaires (conversion rapide) -->
    <ContentBlock
      variant="flat"
      max-width="1200px"
      padding="50px 0"
      theme="dark"
      :no-border="true"
    >
      <HomeBestSellers />
    </ContentBlock>

    <!-- 3. Catégories - Navigation pour explorer -->
    <ContentBlock
      variant="flat"
      bg="transparent"
      max-width="1200px"
      padding="0 0 50px"
      :no-border="true"
      theme="dark"
    >
      <CategoryHeroBanner />
    </ContentBlock>

    <!-- 4. Qualité - Réassurance (COA, pureté) -->
    <ContentBlock
      variant="flat"
      width="100%"
      padding="50px 0"
      border-radius="0"
      :no-border="true"
      theme="dark"
      :bg-image="bgQualityImage"
      :bg-opacity="0.35"
    >
      <HomeQuality />
    </ContentBlock>

    <!-- 5. Newsletter - Capture email + promo -10% -->
    <ContentBlock
      variant="flat"
      width="100%"
      padding="50px 0"
      border-radius="0"
      :no-border="true"
      theme="dark"
      :bg-image="bgNewsletterImage"
    >
      <NewsletterSection />
    </ContentBlock>

    <!-- 6. CTA Final - Dernier push -->
    <ContentBlock
      variant="card"
      theme="dark"
      max-width="1200px"
      size="lg"
      :no-border="true"
      :bg-image="bgCtaImage"
    >
      <HomeCta />
    </ContentBlock>
  </div>
</template>

<script setup lang="ts">
  import bgCtaImage from '@/assets/bg-cta.png'
  import bgNewsletterImage from '@/assets/bg-newsletter.png'
  import bgQualityImage from '@/assets/bg-quality.png'
  import { getCanonicalUrl, SEO_CONFIG } from '@/config/seo'
  import NewsletterSection from '@/features/newsletter/components/NewsletterSection.vue'
  import ContentBlock from '@designSystem/components/layout/ContentBlock.vue'
  import { useHead } from '@vueuse/head'
  import CategoryHeroBanner from './CategoryHeroBanner.vue'
  import HomeBestSellers from './HomeBestSellers.vue'
  import HomeCta from './HomeCta.vue'
  import HomeHero from './HomeHero.vue'
  import HomeQuality from './HomeQuality.vue'

  // Configuration SEO pour la page d'accueil
  useHead({
    title: `${SEO_CONFIG.SITE_NAME} - Peptides de Recherche de Haute Pureté`,
    meta: [
      {
        name: 'description',
        content:
          'Découvrez notre gamme complète de peptides et réactifs chimiques pour la recherche scientifique. Qualité laboratoire garantie, expédition rapide depuis la France et les États-Unis.',
      },
      { name: 'author', content: SEO_CONFIG.AUTHOR },
      { property: 'og:site_name', content: SEO_CONFIG.SITE_NAME },
      {
        property: 'og:title',
        content: `${SEO_CONFIG.SITE_NAME} - Peptides de Recherche`,
      },
      {
        property: 'og:description',
        content:
          'Fournisseur de peptides de haute pureté pour la recherche scientifique. Expédition rapide et service client professionnel.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: getCanonicalUrl('/') },
      { property: 'og:image', content: SEO_CONFIG.DEFAULT_OG_IMAGE },
    ],
    link: [{ rel: 'canonical', href: getCanonicalUrl('/') }],
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
