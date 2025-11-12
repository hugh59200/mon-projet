<template>
  <div class="home">
    <section class="home__hero">
      <div class="home__hero-content">
        <BasicText
          size="h2"
          weight="bold"
          color="primary-600"
        >
          Peptides de Recherche Haut de Gamme
        </BasicText>
        <BasicText
          size="body-l"
          color="neutral-700"
          class="home__hero-sub"
        >
          Pureté certifiée • Livraison rapide en Europe • Laboratoires agréés
        </BasicText>
        <div class="home__hero-actions">
          <BasicButton
            label="Découvrir nos produits"
            type="primary"
            variant="filled"
            size="large"
            @click="$router.push('/catalogue')"
          />
          <BasicButton
            label="En savoir plus"
            type="secondary"
            variant="outlined"
            size="large"
            @click="$router.push('/a-propos')"
          />
        </div>
      </div>
      <div class="home__hero-image">
        <img
          src="../assets/peptides-hero.jpg"
          alt="flacons de peptides"
          class="home__image"
        />
      </div>
    </section>
    <HeroBanner />
    <section class="home__categories">
      <BasicText
        size="h3"
        weight="bold"
        class="home__section-title"
        color="secondary-600"
      >
        Nos gammes principales
      </BasicText>
      <div class="home__grid">
        <div
          v-for="cat in categories"
          :key="cat.label"
          class="home__card"
        >
          <BasicIconNext
            :name="cat.icon"
            :size="40"
            :color="cat.color"
          />
          <BasicText
            weight="bold"
            color="neutral-700"
          >
            {{ cat.label }}
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-500"
          >
            {{ cat.desc }}
          </BasicText>
        </div>
      </div>
    </section>
    <section class="home__quality">
      <BasicText
        size="h3"
        weight="bold"
        class="home__section-title"
        color="primary-600"
      >
        Notre engagement qualité
      </BasicText>
      <div class="home__quality-list">
        <div
          v-for="q in quality"
          :key="q.text"
          class="home__quality-item"
          :style="{ borderColor: q.color + '33' }"
        >
          <BasicIconNext
            :name="q.icon"
            :size="28"
            :color="q.color"
          />
          <BasicText color="neutral-700">{{ q.text }}</BasicText>
        </div>
      </div>
    </section>
    <section class="home__cta">
      <BasicText
        size="h4"
        weight="bold"
        color="white"
      >
        Commencez vos recherches dès aujourd’hui
      </BasicText>
      <BasicButton
        label="Voir le catalogue"
        type="secondary"
        variant="filled"
        size="large"
        @click="$router.push('/catalogue')"
      />
    </section>
  </div>
</template>
<script setup lang="ts">
  import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { ref } from 'vue'
  import HeroBanner from './HeroBanner.vue'

  interface Category {
    icon: IconNameNext
    label: string
    desc: string
    color: string
  }

  interface QualityItem {
    icon: IconNameNext
    text: string
    color: string
  }

  const categories = ref<Category[]>([
    {
      icon: 'FlaskRound',
      label: 'Peptides de performance',
      desc: 'GHK-Cu, BPC-157, CJC-1295 et plus',
      color: 'primary-600',
    },
    {
      icon: 'Dna',
      label: 'Peptides de récupération',
      desc: 'Optimisez votre récupération musculaire et articulaire',
      color: 'success-600',
    },
    {
      icon: 'Microscope',
      label: 'Peptides de recherche cellulaire',
      desc: 'Destinés à la recherche scientifique uniquement',
      color: 'info-600',
    },
  ])

  const quality = ref<QualityItem[]>([
    { icon: 'CheckCircle', text: 'Pureté testée ≥ 99% (HPLC & MS)', color: 'success-600' },
    { icon: 'ShieldCheck', text: 'Stock européen – expédition sous 24h', color: 'info-600' },
    { icon: 'Truck', text: 'Livraison rapide dans toute l’UE', color: 'warning-600' },
    { icon: 'Leaf', text: 'Sans excipient ni conservateur inutile', color: 'primary-600' },
  ])
</script>

<style scoped lang="less">
  .home {
    display: flex;
    flex-direction: column;
    gap: 80px;
    padding: 40px 60px;

    /* 🧬 HERO */
    &__hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 60px;
      flex-wrap: wrap;
      background: linear-gradient(90deg, fade(@white, 80%), fade(@neutral-0, 80%));
      border-radius: 16px;
      padding: 40px 50px;
      box-shadow: 0 2px 14px fade(@neutral-500, 10%);
    }

    &__hero-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 500px;
    }

    &__hero-actions {
      display: flex;
      gap: 16px;
      margin-top: 16px;
    }

    &__hero-image {
      flex: 1;
      display: flex;
      justify-content: center;

      img {
        max-width: 480px;
        width: 100%;
        border-radius: 16px;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
      }
    }

    /* 💊 CATEGORIES */
    &__categories {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
      width: 100%;
      max-width: 900px;
    }

    &__card {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      padding: 32px 20px;
      text-align: center;
      transition: all 0.25s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      box-sizing: border-box;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 14px fade(@neutral-600, 15%);
        border-color: @primary-300;
      }

      .basic-icon-next {
        margin-bottom: 6px;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    /* 🧪 QUALITÉ */
    &__quality {
      background: linear-gradient(90deg, fade(@white, 80%), fade(@neutral-0, 80%));
      padding: 50px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 2px 12px fade(@neutral-600, 10%);

      &-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
        margin-top: 24px;
      }

      &-item {
        display: flex;
        align-items: center;
        gap: 10px;
        background: white;
        padding: 12px 18px;
        border-radius: 8px;
        border: 1px solid @neutral-200;
        transition: all 0.25s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 8px fade(@neutral-700, 12%);
        }
      }
    }

    /* 🚀 CTA FINAL */
    &__cta {
      background: linear-gradient(135deg, @primary-700, @secondary-700);
      color: white;
      padding: 50px 20px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 6px 20px fade(@neutral-800, 20%);

      .basic-button {
        margin-top: 16px;
      }
    }
  }
</style>
