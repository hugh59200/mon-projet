<template>
  <div class="home">
    <!-- 🧬 HERO PRINCIPAL -->
    <section class="home__hero">
      <div class="home__hero-content">
        <BasicText
          size="body-m"
          color="primary-600"
          class="home__hero-pill"
        >
          <BasicIconNext
            name="Globe"
            :size="14"
            color="primary-600"
            class="home__hero-pill-icon"
          />
          <span>Fournisseur européen • Usage recherche uniquement</span>
        </BasicText>

        <BasicText
          size="h1"
          weight="bold"
          color="primary-600"
        >
          Peptides de recherche certifiés pour laboratoires et R&amp;D
        </BasicText>

        <BasicText
          size="body-l"
          color="neutral-700"
          class="home__hero-sub"
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

        <BasicText
          size="body-m"
          color="neutral-500"
          class="home__hero-disclaimer"
        >
          Produits destinés exclusivement à la recherche scientifique. Non destinés à l’usage
          humain.
        </BasicText>
      </div>

      <div class="home__hero-image">
        <img
          src="../assets/peptides-hero.jpg"
          alt="Flacon de peptide pour usage recherche"
          class="home__image"
        />
      </div>
    </section>

    <!-- 🎥 BANNIÈRE VIDÉOS + CARROUSEL PRODUITS -->
    <CategoryHeroBanner />
    <HeroBanner />

    <!-- 📦 COMMENT ÇA MARCHE -->
    <section class="home__how">
      <BasicText
        size="h2"
        weight="bold"
        class="home__section-title"
        color="primary-600"
      >
        Comment ça marche ?
      </BasicText>
      <BasicText
        size="body-m"
        color="neutral-600"
        class="home__section-subtitle"
      >
        Un parcours pensé pour les laboratoires, équipes R&amp;D et acteurs du secteur scientifique.
      </BasicText>

      <div class="home__how-grid">
        <div
          v-for="step in steps"
          :key="step.title"
          class="home__how-card"
        >
          <div class="home__how-header">
            <div class="home__how-icon">
              <BasicIconNext
                :name="step.icon"
                :size="26"
                color="primary-600"
              />
            </div>
            <BasicText
              weight="bold"
              color="neutral-800"
            >
              {{ step.title }}
            </BasicText>
          </div>

          <BasicText
            size="body-s"
            color="neutral-600"
          >
            {{ step.desc }}
          </BasicText>
        </div>
      </div>
    </section>

    <!-- 🧪 ENGAGEMENT QUALITÉ -->
    <section class="home__quality">
      <BasicText
        size="h2"
        weight="bold"
        class="home__section-title"
        color="primary-600"
      >
        Notre engagement qualité
      </BasicText>
      <BasicText
        size="body-m"
        color="neutral-600"
        class="home__section-subtitle"
      >
        Un contrôle rigoureux de la pureté, une traçabilité complète et une logistique adaptée à la
        recherche.
      </BasicText>

      <div class="home__quality-list">
        <div
          v-for="q in quality"
          :key="q.text"
          class="home__quality-item"
          :style="{ borderColor: q.color + '33' }"
        >
          <div class="home__quality-icon">
            <BasicIconNext
              :name="q.icon"
              :size="24"
              :color="q.color"
            />
          </div>
          <BasicText color="neutral-700">
            {{ q.text }}
          </BasicText>
        </div>
      </div>
    </section>

    <!-- ❓ FAQ COURTE -->
    <section class="home__faq">
      <BasicText
        size="h2"
        weight="bold"
        class="home__section-title"
        color="secondary-600"
      >
        Questions fréquentes
      </BasicText>

      <div class="home__faq-list">
        <details
          v-for="item in faq"
          :key="item.q"
          class="home__faq-item"
        >
          <summary>
            <BasicText
              size="body-m"
              color="neutral-800"
            >
              {{ item.q }}
            </BasicText>
            <span class="home__faq-chevron">▾</span>
          </summary>
          <BasicText
            size="body-s"
            color="neutral-600"
            class="home__faq-answer"
          >
            {{ item.a }}
          </BasicText>
        </details>
      </div>
    </section>

    <!-- 🚀 CTA FINAL -->
    <section class="home__cta">
      <BasicText
        size="body-s"
        color="neutral-100"
        class="home__cta-eyebrow"
      >
        Prêt à démarrer ?
      </BasicText>
      <BasicText
        size="h3"
        weight="bold"
        color="white"
      >
        Commencez vos recherches dès aujourd’hui
      </BasicText>
      <BasicText
        size="body-m"
        color="neutral-100"
        class="home__cta-sub"
      >
        Accédez au catalogue complet, aux certificats d’analyse et aux stocks disponibles en temps
        réel.
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
    { icon: 'ShieldCheck', text: 'Stock européen – expédition sous 24h', color: 'info-600' },
    { icon: 'Truck', text: 'Livraison rapide dans toute l’UE', color: 'warning-600' },
    { icon: 'Leaf', text: 'Sans excipient ni conservateur inutile', color: 'primary-600' },
  ])

  const steps = ref<StepItem[]>([
    {
      icon: 'Search',
      title: 'Choisissez vos peptides',
      desc: 'Filtrez par gamme, cible ou type d’étude pour trouver rapidement les composés adaptés à vos besoins.',
    },
    {
      icon: 'FileText',
      title: 'Accédez à la documentation',
      desc: 'Certificats d’analyse (COA) et informations techniques disponibles pour chaque référence lorsque applicable.',
    },
    {
      icon: 'Truck',
      title: 'Expédition sécurisée 24h',
      desc: 'Préparation rapide depuis un stock européen, conditionnement adapté à la recherche et suivi de livraison.',
    },
  ])

  const faq = ref<FaqItem[]>([
    {
      q: 'Vendez-vous aux particuliers ?',
      a: 'Nos produits sont destinés en priorité aux laboratoires, professionnels du secteur et équipes R&D. Dans tous les cas, ils ne doivent jamais être utilisés pour l’automédication ou la consommation humaine.',
    },
    {
      q: 'Les produits sont-ils adaptés à un usage médical ou humain ?',
      a: 'Non. Tous les peptides sont vendus exclusivement pour la recherche scientifique. Ils ne sont pas approuvés comme médicaments, compléments alimentaires ou produits cosmétiques et ne doivent pas être utilisés sur l’être humain.',
    },
    {
      q: 'Fournissez-vous des certificats d’analyse ?',
      a: 'Lorsque disponible, chaque lot de peptide est accompagné d’un certificat d’analyse (COA) détaillant pureté, méthodes analytiques et informations de lot.',
    },
    {
      q: 'D’où sont expédiés les produits ?',
      a: 'Les stocks sont situés en Europe, ce qui permet une expédition rapide (généralement sous 24h ouvrées) vers les principaux pays de l’UE.',
    },
  ])
</script>

<style scoped lang="less">
  /* ===================================================================
   🏠 HOME — Neural Glass Hybrid v3 (FULL REWORK)
   =================================================================== */

  .home {
    display: flex;
    flex-direction: column;
    gap: 90px;
    padding: 40px 56px;
    max-width: 1280px;
    margin: 0 auto;
    animation: homeFadeIn 0.8s ease forwards;
    opacity: 0;

    @keyframes homeFadeIn {
      to {
        opacity: 1;
      }
    }

    /* ================================================================
     🧬 HERO — Glass + Halo Premium
     ================================================================ */
    &__hero {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 56px;

      padding: 48px;
      border-radius: 22px;

      position: relative;
      overflow: hidden;

      background: fade(@white, 10%);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);

      border: 1px solid fade(@neutral-300, 25%);
      box-shadow:
        0 20px 40px fade(#000, 35%),
        inset 0 0 0 1px fade(@white, 20%);

      /* Halos */
      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 520px;
        height: 520px;
        border-radius: 50%;
        filter: blur(100px);
        opacity: 0.25;
        pointer-events: none;
      }

      &::before {
        top: -160px;
        left: -120px;
        background: @primary-400;
      }

      &::after {
        bottom: -160px;
        right: -120px;
        background: @secondary-400;
      }
    }

    &__hero-content {
      position: relative;
      z-index: 2;
      flex: 1;
      max-width: 500px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .BasicText[size='h1'] {
        color: @neutral-50 !important;
        text-shadow: 0 2px 10px fade(#000, 40%);
      }
    }

    &__hero-pill {
      padding: 5px 14px;
      border-radius: 999px;
      background: fade(@primary-200, 25%);
      border: 1px solid fade(@primary-500, 30%);
      backdrop-filter: blur(10px);
      font-weight: 600;
      letter-spacing: 0.06em;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: @primary-700 !important;
    }

    &__hero-sub {
      color: @neutral-200 !important;
    }

    &__hero-disclaimer {
      color: fade(@neutral-100, 80%) !important;
      font-size: 0.9rem;
    }

    &__hero-image {
      position: relative;
      z-index: 2;
      flex: 1;
      display: flex;
      justify-content: center;

      img {
        width: 100%;
        max-width: 440px;
        border-radius: 20px;
        box-shadow:
          0 16px 32px fade(#000, 40%),
          0 0 14px fade(@primary-300, 25%);
        transition: transform 0.35s ease;

        &:hover {
          transform: scale(1.03);
        }
      }
    }

    /* ================================================================
     📦 COMMENT ÇA MARCHE — Glass Cards
     ================================================================ */
    &__how {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 26px;

      .home__section-title {
        color: @neutral-50 !important;
      }
    }

    &__how-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 28px;
      width: 100%;
      max-width: 960px;
      margin: 0 auto;
    }

    &__how-card {
      padding: 22px 20px;
      border-radius: 16px;

      background: fade(@white, 12%);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);

      border: 1px solid fade(@neutral-300, 26%);
      box-shadow:
        0 12px 26px fade(#000, 32%),
        inset 0 0 0 1px fade(@white, 15%);

      transition: all 0.25s ease;

      &:hover {
        transform: translateY(-4px);
        background: fade(@white, 18%);
        border-color: fade(@primary-400, 30%);
        box-shadow:
          0 18px 34px fade(#000, 40%),
          0 0 16px fade(@primary-400, 25%);
      }

      .BasicText {
        color: @neutral-50 !important;
      }
    }

    &__how-step-index {
      background: fade(@primary-400, 35%);
      border: 1px solid fade(@primary-300, 45%);
      color: @white;
    }

    /* ================================================================
     🧪 QUALITÉ — Glass line-grid
     ================================================================ */
    &__quality {
      text-align: center;
      padding: 40px 28px;
      border-radius: 20px;

      background: fade(@white, 10%);
      backdrop-filter: blur(20px);

      border: 1px solid fade(@neutral-300, 22%);
      box-shadow:
        0 10px 30px fade(#000, 38%),
        inset 0 0 0 1px fade(@white, 15%);
    }

    &__quality-list {
      margin-top: 26px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
    }

    &__quality-item {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: default;

      padding: 12px 18px;
      border-radius: 14px;

      background: fade(@white, 20%);
      backdrop-filter: blur(14px);

      border: 1px solid fade(@neutral-300, 30%);
      box-shadow: inset 0 0 0 1px fade(@white, 20%);

      transition: all 0.28s ease;

      &:hover {
        transform: translateY(-3px);
        background: fade(@white, 28%);
        box-shadow: 0 12px 26px fade(#000, 30%);
      }

      .BasicText {
        color: @neutral-100 !important;
      }
    }

    /* ================================================================
     ❓ FAQ — Interactive Glass Accordions
     ================================================================ */
    &__faq {
      text-align: center;

      .home__section-title {
        color: @neutral-50 !important;
      }
    }

    &__faq-list {
      max-width: 760px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    &__faq-item {
      padding: 18px 20px;
      border-radius: 16px;

      background: fade(@white, 14%);
      backdrop-filter: blur(12px);
      cursor: pointer;

      border: 1px solid fade(@neutral-300, 28%);
      box-shadow:
        0 10px 28px fade(#000, 32%),
        inset 0 0 0 1px fade(@white, 15%);

      summary {
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: @neutral-50 !important;
      }

      &[open] {
        background: fade(@white, 18%);
        transform: translateY(-2px);
        box-shadow: 0 14px 30px fade(#000, 38%);
      }

      .home__faq-answer {
        margin-top: 10px;
        color: @neutral-200 !important;
      }
    }

    &__faq-chevron {
      transition: transform 0.25s ease;
      color: @neutral-200;
    }

    &__faq-item[open] .home__faq-chevron {
      transform: rotate(180deg);
    }

    /* ================================================================
     🚀 CTA FINAL — Premium Gradient
     ================================================================ */
    &__cta {
      padding: 48px 24px;
      border-radius: 20px;

      background: linear-gradient(135deg, fade(@primary-600, 75%), fade(@secondary-700, 82%));
      backdrop-filter: blur(18px);

      box-shadow:
        0 12px 40px fade(#000, 35%),
        inset 0 0 0 1px fade(@white, 10%);

      text-align: center;

      .home__cta-eyebrow,
      .home__cta-sub {
        color: fade(@white, 88%) !important;
      }

      .BasicButton {
        margin-top: 22px;
      }
    }

    /* ================================================================
     📱 RESPONSIVE
     ================================================================ */
    @media (max-width: 960px) {
      padding: 28px 20px;
      gap: 70px;

      &__hero {
        padding: 32px;
        gap: 32px;
      }
    }

    @media (max-width: 640px) {
      &__hero {
        flex-direction: column;
        align-items: flex-start;
      }

      &__hero-image img {
        max-width: 330px;
      }
    }
  }
</style>
