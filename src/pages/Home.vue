<template>
  <div class="home">
    <!-- 🧬 HERO -->
    <section class="home__hero">
      <div class="home__hero-content">
        <BasicText
          size="h2"
          weight="bold"
        >
          Peptides de Recherche Haut de Gamme
        </BasicText>
        <BasicText
          size="body-l"
          color="neutral-500"
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

    <!-- 💊 CATEGORIES -->
    <section class="home__categories">
      <BasicText
        size="h3"
        weight="bold"
        class="home__section-title"
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
          />
          <BasicText weight="bold">{{ cat.label }}</BasicText>
          <BasicText
            size="body-s"
            color="neutral-500"
          >
            {{ cat.desc }}
          </BasicText>
        </div>
      </div>
    </section>

    <!-- 🧪 QUALITÉ -->
    <section class="home__quality">
      <BasicText
        size="h3"
        weight="bold"
        class="home__section-title"
      >
        Notre engagement qualité
      </BasicText>

      <div class="home__quality-list">
        <div
          v-for="q in quality"
          :key="q.text"
          class="home__quality-item"
        >
          <BasicIconNext
            :name="q.icon"
            :size="28"
            color="primary-600"
          />
          <BasicText>{{ q.text }}</BasicText>
        </div>
      </div>
    </section>

    <!-- 🚀 CTA FINAL -->
    <section class="home__cta">
      <BasicText
        size="h4"
        weight="bold"
      >
        Commencez vos recherches dès aujourd’hui
      </BasicText>
      <BasicButton
        label="Voir le catalogue"
        type="primary"
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

  interface Category {
    icon: IconNameNext
    label: string
    desc: string
  }

  interface QualityItem {
    icon: IconNameNext
    text: string
  }

  const categories = ref<Category[]>([
    {
      icon: 'FlaskRound',
      label: 'Peptides de performance',
      desc: 'GHK-Cu, BPC-157, CJC-1295 et plus',
    },
    {
      icon: 'Dna',
      label: 'Peptides de récupération',
      desc: 'Optimisez votre récupération musculaire et articulaire',
    },
    {
      icon: 'Microscope',
      label: 'Peptides de recherche cellulaire',
      desc: 'Destinés à la recherche scientifique uniquement',
    },
  ])

  const quality = ref<QualityItem[]>([
    { icon: 'CheckCircle', text: 'Pureté testée ≥ 99% (HPLC & MS)' },
    { icon: 'ShieldCheck', text: 'Stock européen – expédition sous 24h' },
    { icon: 'Truck', text: 'Livraison rapide dans toute l’UE' },
    { icon: 'Leaf', text: 'Sans excipient ni conservateur inutile' },
  ])
</script>

<style scoped lang="less">
  .home {
    display: flex;
    flex-direction: column;
    gap: 80px;
    padding: 40px 60px;

    &__hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 60px;
      flex-wrap: wrap;
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
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    &__categories {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
    }

    &__section-title {
      text-align: center;
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
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
        border-color: @primary-200;
      }

      .basic-icon-next {
        color: @primary-600;
        margin-bottom: 6px;

        svg {
          width: 40px;
          height: 40px;
          stroke-width: 1.75;
        }
      }

      .basic-text {
        text-align: center;
        line-height: 1.4;
      }

      // Sous-texte
      .basic-text[color='neutral-500'] {
        font-size: 0.9rem;
      }
    }

    &__quality {
      background: @neutral-50;
      padding: 40px;
      border-radius: 12px;
      text-align: center;

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
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        border: 1px solid @neutral-200;
        transition: all 0.25s ease;

        &:hover {
          border-color: @primary-300;
          background: @primary-200;
        }

        .basic-icon-next {
          color: @primary-600;
          flex-shrink: 0;

          svg {
            width: 22px;
            height: 22px;
            stroke-width: 1.8;
          }
        }

        .basic-text {
          font-size: 0.95rem;
        }
      }
    }
  }
</style>
