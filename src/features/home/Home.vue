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
      padding="40px 0"
      theme="dark"
      :no-border="true"
      :bg-image="bgPodiumImage"
      bg-opacity-var="var(--bg-image-opacity-podium)"
      class="home__block--limited"
    >
      <HomeBestSellers />
    </ContentBlock>

    <!-- 3. Catégories - Navigation pour explorer -->
    <ContentBlock
      variant="flat"
      bg="transparent"
      padding="0"
      :no-border="true"
      theme="dark"
      class="home__block--category"
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
      bg-opacity-var="var(--bg-image-opacity-quality)"
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
      bg-opacity-var="var(--bg-image-opacity-newsletter)"
    >
      <NewsletterSection />
    </ContentBlock>

    <!-- 6. CTA Final - Dernier push -->
    <ContentBlock
      variant="card"
      theme="dark"
      size="lg"
      :no-border="true"
      :bg-image="bgCtaImage"
      bg-opacity-var="var(--bg-image-opacity-cta)"
      class="home__cta"
    >
      <HomeCta />
    </ContentBlock>

    <!-- Disclaimer mobile -->
    <div v-if="isMobile" class="home__disclaimer">
      <div class="home__disclaimer-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 9v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <p class="home__disclaimer-text">{{ $t('home.disclaimer.text') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    bgCtaImage,
    bgNewsletterImage,
    bgPodiumImage,
    bgQualityImage,
  } from '@/config/backgrounds'
  import { getCanonicalUrl, SEO_CONFIG } from '@/config/seo'
  import NewsletterSection from '@/features/newsletter/components/NewsletterSection.vue'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint/DeviceBreakpoint.types'
  import ContentBlock from '@designSystem/components/layout/ContentBlock.vue'
  import { useHead } from '@vueuse/head'
  import CategoryHeroBanner from './CategoryHeroBanner.vue'
  import HomeBestSellers from './HomeBestSellers.vue'
  import HomeCta from './HomeCta.vue'
  import HomeHero from './HomeHero.vue'
  import HomeQuality from './HomeQuality.vue'

  const { isMobile } = useDeviceBreakpoint()

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
    padding-bottom: 60px;

    &__block--limited {
      max-width: 1200px;
      width: calc(100% - 32px);
      align-self: center;
    }

    &__cta {
      max-width: 1000px;
      width: calc(100% - 32px);
      align-self: center;
    }

    &__block--category {
      max-width: 1200px;
      width: calc(100% - 32px);
      align-self: center;
      border-radius: 24px;
      overflow: hidden;
    }

    &__disclaimer {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin: 0 16px;
      padding: 16px;
      background: rgba(var(--warning-500-rgb), 0.08);
      border: 1px solid rgba(var(--warning-500-rgb), 0.2);
      border-radius: 12px;

      &-icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        color: var(--warning-500);

        svg {
          width: 100%;
          height: 100%;
        }
      }

      &-text {
        font-size: 12px;
        color: var(--warning-700);
        margin: 0;
        line-height: 1.6;
      }
    }
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
      gap: 24px;
      padding-bottom: 24px;

      &__block--limited,
      &__cta {
        width: 100%;
        max-width: 100%;
        border-radius: 0;
      }

      &__block--category {
        width: 100%;
        max-width: 100%;
        border-radius: 0;
      }
    }
  });
</style>
