<template>
  <div class="home">
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
          src="../assets/home/présentation-peptides.png"
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
          v-for="(step, index) in steps"
          :key="step.title"
          class="home__how-card"
        >
          <div class="home__how-step">
            <span class="home__how-step-index">{{ index + 1 }}</span>
          </div>

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
  .home {
    display: flex;
    flex-direction: column;
    gap: 72px;
    padding: 36px 56px;
    box-sizing: border-box;

    max-width: 1280px;
    margin: 0 auto;
    overflow-x: hidden;

    /* 🧬 HERO */
    &__hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 56px;
      flex-wrap: wrap;
      background: linear-gradient(120deg, fade(@white, 92%), fade(@neutral-0, 80%));
      border-radius: 16px;
      padding: 36px 44px;
      box-shadow: 0 2px 12px fade(@neutral-500, 10%);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: -40px;
        background:
          radial-gradient(circle at 0% 0%, fade(@primary-200, 40%), transparent 55%),
          radial-gradient(circle at 100% 100%, fade(@secondary-200, 35%), transparent 55%);
        opacity: 0.7;
        pointer-events: none;
      }
    }

    &__hero-content {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 480px;
    }

    &__hero-pill {
      align-self: flex-start;
      padding: 4px 12px;
      border-radius: 999px;
      background: fade(@primary-100, 90%);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    &__hero-sub {
      margin-top: 4px;
    }

    &__hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 16px;
    }

    &__hero-disclaimer {
      margin-top: 8px;
      max-width: 360px;
    }

    &__hero-image {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      justify-content: center;

      img {
        max-width: 440px;
        width: 100%;
        border-radius: 16px;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
      }
    }

    /* TITRES + SOUS-TITRES SECTIONS */
    &__section-title {
      text-align: center;
    }

    &__section-subtitle {
      text-align: center;
      max-width: 640px;
      margin: 0 auto;
    }

    /* 📦 COMMENT ÇA MARCHE */
    &__how {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    &__how-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      width: 100%;
      max-width: 960px;
    }

    &__how-card {
      background: white;
      border-radius: 14px;
      padding: 20px 18px 18px;
      box-shadow: 0 3px 10px fade(@neutral-600, 8%);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &__how-step {
      display: flex;
      justify-content: flex-start;
    }

    &__how-step-index {
      width: 26px;
      height: 26px;
      border-radius: 999px;
      border: 1px solid fade(@primary-500, 40%);
      background: fade(@primary-50, 70%);
      color: @primary-700;
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    &__how-header {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &__how-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: fade(@primary-50, 90%);
    }

    /* 🧪 QUALITÉ */
    &__quality {
      background: rgba(255, 255, 255, 0.9);
      padding: 44px 40px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 2px 10px fade(@neutral-600, 10%);
      backdrop-filter: blur(8px);
    }

    &__quality-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 18px;
      margin-top: 24px;
    }

    &__quality-item {
      display: flex;
      align-items: center;
      gap: 10px;
      background: white;
      padding: 10px 16px;
      border-radius: 10px;
      border: 1px solid @neutral-200;
      border-top-width: 3px;
      transition: all 0.25s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 3px 8px fade(@neutral-700, 12%);
      }
    }

    &__quality-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ❓ FAQ */
    &__faq {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    &__faq-list {
      width: 100%;
      max-width: 780px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__faq-item {
      background: white;
      border-radius: 10px;
      border: 1px solid @neutral-200;
      padding: 10px 14px;
      cursor: pointer;

      summary {
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      summary::-webkit-details-marker {
        display: none;
      }

      &::marker {
        content: '';
      }

      &[open] {
        box-shadow: 0 3px 10px fade(@neutral-700, 10%);
      }
    }

    &__faq-chevron {
      font-size: 14px;
      color: @neutral-500;
      transition: transform 0.2s ease;
    }

    &__faq-item[open] .home__faq-chevron {
      transform: rotate(180deg);
    }

    &__faq-answer {
      margin-top: 8px;
    }

    /* 🚀 CTA FINAL */
    &__cta {
      background: linear-gradient(135deg, @primary-700, @secondary-700);
      color: white;
      padding: 40px 20px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 6px 20px fade(@neutral-800, 20%);

      .basic-button {
        margin-top: 18px;
      }
    }

    &__cta-eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.16em;
      opacity: 0.9;
    }

    &__cta-sub {
      max-width: 520px;
      margin: 8px auto 0;
    }

    /* 📱 RESPONSIVE */
    @media (max-width: 960px) {
      padding: 24px 16px;
      gap: 56px;

      &__hero {
        padding: 26px 20px;
        gap: 32px;
      }

      &__hero-actions {
        justify-content: flex-start;
      }
    }

    @media (max-width: 640px) {
      &__hero {
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;
      }

      &__hero-image img {
        max-width: 320px;
      }

      &__quality {
        padding-inline: 20px;
      }
    }
  }
</style>
