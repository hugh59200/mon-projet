<template>
  <div class="home">
    <HomeHero />
    <section class="category-section">
      <div class="category-wrapper">
        <CategoryHeroBanner />
      </div>
    </section>
    <HomeStats />
    <HomeProcess />
    <HeroBanner />
    <HomeQuality />
    <HomeFaq />
    <HomeCta />
    <HomeDisclaimer />
  </div>
</template>

<script setup lang="ts">
  import CategoryHeroBanner from './CategoryHeroBanner.vue'
  import HeroBanner from './HeroBanner.vue'
  import HomeCta from './HomeCta.vue'
  import HomeDisclaimer from './HomeDisclaimer.vue'
  import HomeFaq from './HomeFaq.vue'
  import HomeHero from './HomeHero.vue'
  import HomeProcess from './HomeProcess.vue'
  import HomeQuality from './HomeQuality.vue'
  import HomeStats from './HomeStats.vue'
</script>

<style scoped lang="less">
  .home {
    display: flex;
    flex-direction: column;
    gap: 0;
    overflow-x: hidden;
    padding: 50px 0;
  }

  .category-section {
    padding: 60px 0;
    background: transparent;
  }

  .category-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
  }

  @media (max-width: 768px) {
    .category-section {
      padding: 40px 0;
    }
    .category-wrapper {
      padding: 0 20px;
    }
  }
</style>
