<template>
  <div class="home">
    <section class="home__hero">
      <div class="home__hero-content">
        <div class="home__hero-pill">
          <BasicIconNext
            name="Globe"
            :size="20"
            color="primary-600"
          />
          <BasicText
            size="body-s"
            weight="semibold"
            color="primary-700"
          >
            Fournisseur européen • Usage recherche
          </BasicText>
        </div>

        <BasicText
          size="h1"
          weight="bold"
          class="home__hero-title"
        >
          Peptides de recherche certifiés pour
          <span>laboratoires et R&D</span>
        </BasicText>

        <BasicText
          size="body-l"
          color="neutral-600"
          class="home__hero-desc"
        >
          Catalogue sélectionné • Certificats d’analyse disponibles • Expédition 24h depuis l’UE
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

        <div class="home__hero-disclaimer">
          <BasicIconNext
            name="Info"
            :size="14"
            color="neutral-400"
          />
          <BasicText
            size="body-s"
            color="neutral-500"
          >
            Produits destinés exclusivement à la recherche scientifique (RUO).
          </BasicText>
        </div>
      </div>

      <div class="home__hero-image">
        <img
          src="../assets/peptides-hero.png"
          alt="Flacon de peptide pour usage recherche"
          class="home__image"
        />
      </div>
    </section>

    <CategoryHeroBanner />
    <HeroBanner />

    <section class="home__how">
      <BasicText
        size="h2"
        weight="bold"
        color="primary-600"
      >
        Comment ça marche ?
      </BasicText>
      <BasicText
        size="body-m"
        color="neutral-600"
      >
        Un parcours pensé pour les laboratoires et équipes R&D.
      </BasicText>

      <div class="home__how-grid">
        <div
          v-for="step in steps"
          :key="step.title"
          class="home__how-card"
        >
          <div class="home__how-icon">
            <BasicIconNext
              :name="step.icon"
              :size="40"
              color="primary-600"
            />
          </div>
          <BasicText
            weight="bold"
            size="h4"
            color="neutral-800"
          >
            {{ step.title }}
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-600"
          >
            {{ step.desc }}
          </BasicText>
        </div>
      </div>
    </section>

    <section class="home__quality">
      <BasicText
        size="h2"
        weight="bold"
        color="neutral-900"
      >
        Notre engagement qualité
      </BasicText>
      <BasicText
        size="body-m"
        color="neutral-600"
      >
        Un contrôle rigoureux de la pureté et une traçabilité complète.
      </BasicText>

      <div class="home__quality-list">
        <div
          v-for="q in quality"
          :key="q.text"
          class="home__quality-item"
          :style="{ borderLeft: `4px solid var(--${q.color})` }"
        >
          <BasicIconNext
            :name="q.icon"
            :size="24"
            :color="q.color"
          />
          <BasicText
            weight="semibold"
            color="neutral-700"
          >
            {{ q.text }}
          </BasicText>
        </div>
      </div>
    </section>

    <section class="home__faq">
      <BasicText
        size="h2"
        weight="bold"
        color="neutral-900"
      >
        Questions fréquentes
      </BasicText>
      <div class="home__faq-list">
        <FilterSection
          v-for="item in faq"
          :key="item.q"
          :title="item.q"
        >
          <BasicText
            size="body-m"
            color="neutral-600"
          >
            {{ item.a }}
          </BasicText>
        </FilterSection>
      </div>
    </section>

    <section class="home__cta">
      <BasicText
        size="h2"
        weight="bold"
        color="white"
      >
        Prêt à démarrer ?
      </BasicText>
      <BasicText
        size="body-l"
        color="neutral-100"
        style="max-width: 600px"
      >
        Accédez au catalogue complet et aux stocks disponibles en temps réel.
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
  import FilterSection from '@/features/shared/components/FilterSection.vue'
  import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { ref } from 'vue'
  import CategoryHeroBanner from './CategoryHeroBanner.vue'
  import HeroBanner from './HeroBanner.vue'

  interface QualityItem {
    icon: IconNameNext
    text: string
    color: string
  }

  interface StepItem {
    icon: IconNameNext
    title: string
    desc: string
  }

  interface FaqItem {
    q: string
    a: string
  }

  const quality = ref<QualityItem[]>([
    { icon: 'CheckCircle', text: 'Pureté testée ≥ 99% (HPLC & MS)', color: 'success-600' },
    { icon: 'ShieldCheck', text: 'Stock européen – expédition 24h', color: 'info-600' },
    { icon: 'Truck', text: 'Livraison rapide UE', color: 'warning-600' },
    { icon: 'Leaf', text: 'Sans excipient inutile', color: 'primary-600' },
  ])

  const steps = ref<StepItem[]>([
    {
      icon: 'Search',
      title: '1. Choisissez',
      desc: 'Filtrez par gamme ou cible pour trouver les composés adaptés.',
    },
    {
      icon: 'FileText',
      title: '2. Analysez',
      desc: 'Consultez les certificats d’analyse (COA) et données techniques.',
    },
    {
      icon: 'Truck',
      title: '3. Recevez',
      desc: 'Expédition prioritaire sécurisée depuis notre stock européen.',
    },
  ])

  const faq = ref<FaqItem[]>([
    {
      q: 'Vendez-vous aux particuliers ?',
      a: 'Nos produits sont destinés en priorité aux laboratoires et professionnels.',
    },
    {
      q: 'Les produits sont-ils à usage humain ?',
      a: 'Non. Tous les peptides sont vendus exclusivement pour la recherche scientifique (RUO).',
    },
    {
      q: 'Fournissez-vous des certificats d’analyse ?',
      a: 'Oui, chaque lot est accompagné de son COA (HPLC/MS).',
    },
    {
      q: 'D’où expédiez-vous ?',
      a: 'Depuis nos entrepôts en Europe pour une livraison rapide sans douane intracommunautaire.',
    },
  ])
</script>

<style scoped lang="less">
  .home {
    display: flex;
    flex-direction: column;
    gap: 80px;
    padding: 30px 20px;
    max-width: 1280px;
    margin: 0 auto;
    animation: fadeIn 0.8s ease forwards;

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    // --- HERO SECTION (Style Glassmorphism Blanc) ---
    &__hero {
      display: flex;
      align-items: center;
      gap: 60px;
      padding: 48px;
      border-radius: 24px;
      position: relative;
      overflow: hidden;

      // ✅ Le même fond que PageHeader.vue
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);

      // Glow background subtil
      &::before {
        content: '';
        position: absolute;
        top: -20%;
        right: -10%;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(var(--primary-500-rgb), 0.15), transparent 70%);
        pointer-events: none;
      }

      &-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 24px;
        z-index: 2;
      }

      &-pill {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 6px 14px;
        background: rgba(var(--primary-100-rgb), 0.5);
        border: 1px solid rgba(var(--primary-200-rgb), 0.5);
        border-radius: 30px;
        width: fit-content;
      }

      &-title {
        font-size: 42px;
        line-height: 1.1;
        color: @neutral-900;

        // ✅ Le dégradé sur le texte
        span {
          background: linear-gradient(90deg, var(--primary-600), var(--primary-400));
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: block; // Force le retour à la ligne pour l'effet visuel
        }
      }

      &-desc {
        font-size: 18px;
        line-height: 1.6;
        max-width: 550px;
      }

      &-actions {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      &-disclaimer {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
        padding-top: 16px;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
      }

      &-image {
        flex: 1;
        display: flex;
        justify-content: center;
        position: relative;
        z-index: 2;

        img {
          max-width: 100%;
          height: auto;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          transform: rotate(2deg);
          transition: transform 0.4s ease;

          &:hover {
            transform: rotate(0deg) scale(1.02);
          }
        }
      }
    }

    // --- HOW IT WORKS ---
    &__how {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 32px;

      &-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 30px;
      }

      &-card {
        padding: 20px;
        background: white;
        border-radius: 20px;
        border: 1px solid @neutral-100;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
        }
      }

      &-icon {
        width: 64px;
        height: 64px;
        background: var(--primary-50);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    // --- QUALITY ---
    &__quality {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 32px;

      &-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
      }

      &-item {
        background: white;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        border: 1px solid @neutral-200;
      }
    }

    // --- FAQ ---
    &__faq {
      display: flex;
      flex-direction: column;
      gap: 32px;
      align-items: center;

      &-list {
        width: 100%;
        max-width: 800px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    }

    // --- CTA ---
    &__cta {
      background: linear-gradient(135deg, var(--primary-800), var(--secondary-900));
      border-radius: 24px;
      padding: 60px 30px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      position: relative;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }

    // --- RESPONSIVE ---
    @media (max-width: 960px) {
      &__hero {
        flex-direction: column;
        text-align: center;
        padding: 32px;

        &-pill {
          margin: 0 auto;
        }
        &-actions {
          justify-content: center;
        }
        &-disclaimer {
          justify-content: center;
        }
        &-image {
          width: 100%;
          max-width: 400px;
        }
      }
    }
  }
</style>
