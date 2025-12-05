<template>
  <div class="home">
    <HomeHero />
    <HomeTrustBar />
    <section class="home__section home__section--left">
      <HomeQuality />
    </section>
    <section class="home__section home__section--full">
      <CategoryHeroBanner />
    </section>
    <section class="home__section home__section--right">
      <NewsletterSection />
    </section>
    <section class="home__section home__section--left">
      <HomeScience />
    </section>
    <section class="home__section home__section--right">
      <HomeCta />
    </section>
  </div>
</template>

<script setup lang="ts">
  import NewsletterSection from '@/features/newsletter/components/NewsletterSection.vue'
  import { useHead } from '@vueuse/head'
  import CategoryHeroBanner from './CategoryHeroBanner.vue'
  import HomeCta from './HomeCta.vue'
  import HomeHero from './HomeHero.vue'
  import HomeQuality from './HomeQuality.vue'
  import HomeScience from './HomeScience.vue'
  import HomeTrustBar from './HomeTrustBar.vue'

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
    gap: 0;
    overflow-x: hidden;
    padding: 50px 0;

    &__section {
      // Full-width (mais contenu limité à 1200px)
      &--full {
        width: 100%;
        margin: 60px 0;
      }

      // Décalé gauche
      &--left {
        max-width: 1200px;
        width: 100%;
        margin: 60px auto;
        padding: 0 80px 0 40px; // Plus de padding à droite = décalé gauche
      }

      // Décalé droite
      &--right {
        max-width: 1200px;
        width: 100%;
        margin: 60px auto;
        padding: 0 40px 0 80px; // Plus de padding à gauche = décalé droite
      }
    }
  }

  // Responsive - Tablet
  .respond-tablet({
    .home__section {
      &--full {
        margin: 40px 0;
      }
      &--left {
        margin: 40px auto;
        padding: 0 60px 0 24px;
      }
      &--right {
        margin: 40px auto;
        padding: 0 24px 0 60px;
      }
    }
  });

  // Responsive - Mobile (tout centré sur mobile)
  .respond-mobile({
    .home__section {
      &--full {
        margin: 32px 0;
      }
      &--left,
      &--right {
        margin: 32px auto;
        padding: 0 16px;
      }
    }
  });
</style>
