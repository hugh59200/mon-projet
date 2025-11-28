<template>
  <div
    class="home"
    ref="homeRef"
  >
    <!-- ══════════════════════════════════════════════════════════════
         HERO SECTION
         ══════════════════════════════════════════════════════════════ -->
    <section class="hero">
      <div class="hero__bg">
        <div class="hero__grid"></div>
        <div class="hero__glow hero__glow--1"></div>
        <div class="hero__glow hero__glow--2"></div>
        <div class="hero__particles">
          <span
            v-for="n in 20"
            :key="n"
            class="hero__particle"
          ></span>
        </div>
      </div>

      <div class="hero__container">
        <div class="hero__content">
          <div class="hero__badge">
            <span class="hero__badge-dot"></span>
            <span>Fournisseur européen certifié</span>
            <span class="hero__badge-separator">•</span>
            <span>Usage recherche exclusif</span>
          </div>

          <h1 class="hero__title">
            <span class="hero__title-line">Peptides de recherche</span>
            <span class="hero__title-gradient">haute pureté</span>
            <span class="hero__title-line">pour laboratoires</span>
          </h1>

          <p class="hero__description">
            Catalogue sélectionné de peptides certifiés ≥99% de pureté. Certificats d'analyse
            disponibles. Expédition 24h depuis l'Union Européenne.
          </p>

          <div class="hero__actions">
            <button
              class="hero__btn hero__btn--primary"
              @click="$router.push('/catalogue')"
            >
              <span>Explorer le catalogue</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button
              class="hero__btn hero__btn--secondary"
              @click="$router.push('/a-propos')"
            >
              <span>En savoir plus</span>
            </button>
          </div>

          <div class="hero__trust">
            <div class="hero__trust-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Pureté ≥99%</span>
            </div>
            <div class="hero__trust-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>COA inclus</span>
            </div>
            <div class="hero__trust-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Livraison 24h</span>
            </div>
          </div>
        </div>

        <div class="hero__visual">
          <div class="hero__visual-container">
            <div class="hero__visual-glow"></div>
            <div class="hero__visual-ring hero__visual-ring--1"></div>
            <div class="hero__visual-ring hero__visual-ring--2"></div>
            <div class="hero__visual-ring hero__visual-ring--3"></div>

            <div class="hero__visual-center">
              <div class="hero__molecule">
                <svg
                  viewBox="0 0 200 200"
                  fill="none"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="12"
                    class="hero__atom-center"
                  />
                  <g class="hero__molecule-orbit hero__molecule-orbit--1">
                    <ellipse
                      cx="100"
                      cy="100"
                      rx="45"
                      ry="20"
                      class="hero__orbit-path"
                      transform="rotate(-30 100 100)"
                    />
                    <circle
                      cx="145"
                      cy="100"
                      r="4"
                      class="hero__orbit-dot hero__orbit-dot--1"
                      transform="rotate(-30 100 100)"
                    />
                  </g>
                  <g class="hero__molecule-orbit hero__molecule-orbit--2">
                    <ellipse
                      cx="100"
                      cy="100"
                      rx="45"
                      ry="20"
                      class="hero__orbit-path"
                      transform="rotate(30 100 100)"
                    />
                    <circle
                      cx="145"
                      cy="100"
                      r="4"
                      class="hero__orbit-dot hero__orbit-dot--2"
                      transform="rotate(30 100 100)"
                    />
                  </g>
                  <g class="hero__molecule-orbit hero__molecule-orbit--3">
                    <ellipse
                      cx="100"
                      cy="100"
                      rx="45"
                      ry="20"
                      class="hero__orbit-path"
                      transform="rotate(90 100 100)"
                    />
                    <circle
                      cx="145"
                      cy="100"
                      r="4"
                      class="hero__orbit-dot hero__orbit-dot--3"
                      transform="rotate(90 100 100)"
                    />
                  </g>
                </svg>
              </div>
            </div>

            <div class="hero__floating-card hero__floating-card--1">
              <span class="hero__floating-card-icon">⚗️</span>
              <span>BPC-157</span>
            </div>
            <div class="hero__floating-card hero__floating-card--2">
              <span class="hero__floating-card-icon">🧬</span>
              <span>TB-500</span>
            </div>
            <div class="hero__floating-card hero__floating-card--3">
              <span class="hero__floating-card-icon">🔬</span>
              <span>Semaglutide</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORY HERO BANNER -->
    <div class="category-section">
      <CategoryHeroBanner />
    </div>

    <!-- STATS SECTION -->
    <section class="stats">
      <div class="stats__container">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="stats__item"
          :class="`stats__item--${stat.variant}`"
          :style="{ '--delay': `${index * 0.1}s` }"
        >
          <div class="stats__icon">
            <component :is="stat.icon" />
          </div>
          <div class="stats__value">{{ stat.value }}</div>
          <div class="stats__label">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="process">
      <div class="process__header">
        <span class="process__eyebrow">Processus simplifié</span>
        <h2 class="process__title">Comment ça marche ?</h2>
        <p class="process__subtitle">Un parcours pensé pour les laboratoires et équipes R&D</p>
      </div>

      <div class="process__timeline">
        <div class="process__line"></div>
        <div
          v-for="(step, index) in steps"
          :key="step.title"
          class="process__step"
          :class="`process__step--${step.variant}`"
        >
          <div class="process__step-marker">
            <span class="process__step-number">{{ index + 1 }}</span>
          </div>
          <div class="process__step-content">
            <div class="process__step-icon">
              <component :is="step.icon" />
            </div>
            <h3 class="process__step-title">{{ step.title }}</h3>
            <p class="process__step-desc">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- QUALITY SECTION -->
    <section class="quality">
      <div class="quality__bg">
        <div class="quality__pattern"></div>
      </div>

      <div class="quality__container">
        <div class="quality__content">
          <span class="quality__eyebrow">Engagement qualité</span>
          <h2 class="quality__title">
            Des standards
            <br />
            <span>pharmaceutiques</span>
          </h2>
          <p class="quality__description">
            Chaque peptide est soumis à un contrôle qualité rigoureux. Analyses HPLC et
            spectrométrie de masse pour garantir une pureté optimale.
          </p>

          <div class="quality__features">
            <div
              v-for="feature in qualityFeatures"
              :key="feature.title"
              class="quality__feature"
              :class="`quality__feature--${feature.variant}`"
            >
              <div class="quality__feature-icon">
                <component :is="feature.icon" />
              </div>
              <div class="quality__feature-text">
                <h4>{{ feature.title }}</h4>
                <p>{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="quality__visual">
          <div class="quality__card">
            <div class="quality__card-header">
              <span class="quality__card-badge">COA</span>
              <span class="quality__card-title">Certificat d'analyse</span>
            </div>
            <div class="quality__card-body">
              <div class="quality__card-row">
                <span>Référence</span>
                <span>BPC-157-5mg</span>
              </div>
              <div class="quality__card-row">
                <span>Lot</span>
                <span>BP2024-0847</span>
              </div>
              <div class="quality__card-row quality__card-row--highlight">
                <span>Pureté HPLC</span>
                <span>99.4%</span>
              </div>
              <div class="quality__card-row">
                <span>Masse moléculaire</span>
                <span>1419.53 Da</span>
              </div>
              <div class="quality__card-row">
                <span>Apparence</span>
                <span>Poudre blanche</span>
              </div>
            </div>
            <div class="quality__card-footer">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Vérifié & Authentique</span>
            </div>
          </div>
          <div class="quality__deco quality__deco--1"></div>
          <div class="quality__deco quality__deco--2"></div>
        </div>
      </div>
    </section>

    <!-- FAQ SECTION -->
    <section class="faq">
      <div class="faq__header">
        <span class="faq__eyebrow">Support</span>
        <h2 class="faq__title">Questions fréquentes</h2>
      </div>

      <div class="faq__grid">
        <div
          v-for="(item, index) in faqItems"
          :key="index"
          class="faq__item"
          :class="{ 'faq__item--open': openFaq === index }"
          @click="toggleFaq(index)"
        >
          <div class="faq__question">
            <span>{{ item.question }}</span>
            <div class="faq__icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          </div>
          <div class="faq__answer">
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="cta">
      <div class="cta__bg">
        <div class="cta__glow cta__glow--1"></div>
        <div class="cta__glow cta__glow--2"></div>
        <div class="cta__grid"></div>
      </div>

      <div class="cta__content">
        <h2 class="cta__title">
          Prêt à démarrer votre
          <br />
          <span>recherche ?</span>
        </h2>
        <p class="cta__description">
          Accédez au catalogue complet et aux stocks disponibles en temps réel. Livraison
          prioritaire pour tous les laboratoires européens.
        </p>
        <div class="cta__actions">
          <button
            class="cta__btn cta__btn--primary"
            @click="$router.push('/catalogue')"
          >
            <span>Voir le catalogue</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button
            class="cta__btn cta__btn--secondary"
            @click="$router.push('/contact')"
          >
            <span>Nous contacter</span>
          </button>
        </div>
      </div>

      <div class="cta__visual">
        <div class="cta__molecule">
          <svg
            viewBox="0 0 120 120"
            fill="none"
          >
            <circle
              cx="60"
              cy="60"
              r="8"
              class="cta__molecule-center"
            />
            <circle
              cx="30"
              cy="40"
              r="5"
              class="cta__molecule-dot cta__molecule-dot--1"
            />
            <circle
              cx="90"
              cy="40"
              r="5"
              class="cta__molecule-dot cta__molecule-dot--2"
            />
            <circle
              cx="30"
              cy="80"
              r="5"
              class="cta__molecule-dot cta__molecule-dot--3"
            />
            <circle
              cx="90"
              cy="80"
              r="5"
              class="cta__molecule-dot cta__molecule-dot--4"
            />
            <line
              x1="60"
              y1="60"
              x2="30"
              y2="40"
              class="cta__molecule-line"
            />
            <line
              x1="60"
              y1="60"
              x2="90"
              y2="40"
              class="cta__molecule-line"
            />
            <line
              x1="60"
              y1="60"
              x2="30"
              y2="80"
              class="cta__molecule-line"
            />
            <line
              x1="60"
              y1="60"
              x2="90"
              y2="80"
              class="cta__molecule-line"
            />
          </svg>
        </div>
      </div>
    </section>

    <!-- DISCLAIMER -->
    <div class="disclaimer">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>
        <strong>Usage recherche uniquement (RUO)</strong>
        — Les produits proposés sont destinés exclusivement à la recherche scientifique in vitro et
        ne sont pas destinés à un usage humain, vétérinaire ou diagnostique.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { h, onMounted, ref } from 'vue'
  import CategoryHeroBanner from './CategoryHeroBanner.vue'

  // Icons
  const SearchIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [h('path', { d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })],
    )
  const DocumentIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('path', {
          d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        }),
      ],
    )
  const TruckIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('path', {
          d: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
        }),
      ],
    )
  const ShieldIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('path', {
          d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        }),
      ],
    )
  const BeakerIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('path', {
          d: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
        }),
      ],
    )
  const CheckIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [h('path', { d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })],
    )
  const GlobeIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('path', {
          d: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        }),
      ],
    )
  const LeafIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('path', {
          d: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
        }),
      ],
    )

  const stats = ref([
    { value: '50+', label: 'Peptides disponibles', variant: 'success', icon: BeakerIcon },
    { value: '99%', label: 'Pureté garantie', variant: 'primary', icon: ShieldIcon },
    { value: '24h', label: 'Expédition rapide', variant: 'warning', icon: TruckIcon },
    { value: '100%', label: 'Stock européen', variant: 'info', icon: GlobeIcon },
  ])

  const steps = ref([
    {
      title: 'Sélectionnez',
      description:
        'Parcourez notre catalogue et filtrez par catégorie, cible ou application de recherche.',
      variant: 'success',
      icon: SearchIcon,
    },
    {
      title: 'Analysez',
      description:
        "Consultez les fiches techniques et certificats d'analyse (COA) de chaque produit.",
      variant: 'primary',
      icon: DocumentIcon,
    },
    {
      title: 'Recevez',
      description: 'Livraison prioritaire sécurisée depuis notre stock européen sous 24-48h.',
      variant: 'warning',
      icon: TruckIcon,
    },
  ])

  const qualityFeatures = ref([
    {
      title: 'Pureté HPLC ≥99%',
      description: 'Analyse chromatographique haute performance pour chaque lot.',
      variant: 'success',
      icon: CheckIcon,
    },
    {
      title: 'Spectrométrie de masse',
      description: "Vérification de la masse moléculaire et de l'identité.",
      variant: 'primary',
      icon: BeakerIcon,
    },
    {
      title: 'Stock européen',
      description: "Expédition depuis l'UE, sans frais de douane.",
      variant: 'warning',
      icon: GlobeIcon,
    },
    {
      title: 'Formulation pure',
      description: 'Sans excipients inutiles ni additifs.',
      variant: 'info',
      icon: LeafIcon,
    },
  ])

  const faqItems = ref([
    {
      question: 'Vendez-vous aux particuliers ?',
      answer:
        "Nos produits sont destinés en priorité aux laboratoires, institutions de recherche et professionnels. Nous vérifions le contexte d'utilisation pour chaque commande.",
    },
    {
      question: 'Les produits sont-ils à usage humain ?',
      answer:
        'Non. Tous nos peptides sont vendus exclusivement pour la recherche scientifique in vitro (Research Use Only - RUO). Ils ne sont pas destinés à un usage humain, vétérinaire ou diagnostique.',
    },
    {
      question: "Fournissez-vous des certificats d'analyse ?",
      answer:
        "Oui, chaque lot est accompagné de son certificat d'analyse (COA) incluant les résultats HPLC et spectrométrie de masse, téléchargeable depuis votre espace client.",
    },
    {
      question: "D'où expédiez-vous ?",
      answer:
        'Depuis nos entrepôts situés en Union Européenne, ce qui permet une livraison rapide (24-48h) sans frais de douane pour les destinations intracommunautaires.',
    },
    {
      question: 'Quels moyens de paiement acceptez-vous ?',
      answer:
        'Nous acceptons les virements bancaires, cartes de crédit (Visa, Mastercard) et paiements via les principaux processeurs sécurisés. Facturation possible pour les institutions.',
    },
  ])

  const openFaq = ref<number | null>(null)
  const toggleFaq = (index: number) => {
    openFaq.value = openFaq.value === index ? null : index
  }

  const homeRef = ref<HTMLElement | null>(null)

  onMounted(() => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible')
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
      )
      document
        .querySelectorAll('.stats, .process, .quality, .faq, .cta')
        .forEach((el) => observer.observe(el))
    }
  })
</script>

<style scoped lang="less">
  /* ══════════════════════════════════════════════════════════════
   HOME PAGE — Using Theme CSS Variables
   ══════════════════════════════════════════════════════════════ */

  @font-display:
    'Instrument Sans',
    'SF Pro Display',
    -apple-system,
    sans-serif;
  @font-body:
    'Inter',
    'SF Pro Text',
    -apple-system,
    sans-serif;
  @ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);

  .home {
    display: flex;
    flex-direction: column;
    background: linear-gradient(
      180deg,
      var(--secondary-950) 0%,
      var(--secondary-900) 50%,
      var(--secondary-950) 100%
    );
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ══════════════════════════════════════════════════════════════
   HERO SECTION
   ══════════════════════════════════════════════════════════════ */
  .hero {
    position: relative;
    display: flex;
    align-items: center;
    padding: 100px 40px 60px;
    overflow: hidden;

    &__bg {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    &__grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(var(--primary-500-rgb), 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--primary-500-rgb), 0.03) 1px, transparent 1px);
      background-size: 80px 80px;
      mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black 0%, transparent 70%);
    }

    &__glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.3;

      &--1 {
        top: 10%;
        left: 20%;
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, var(--primary-600) 0%, transparent 70%);
        animation: float 20s ease-in-out infinite;
      }

      &--2 {
        bottom: 10%;
        right: 10%;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, var(--primary-400) 0%, transparent 70%);
        animation: float 25s ease-in-out infinite reverse;
      }
    }

    &__particles {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    &__particle {
      position: absolute;
      width: 3px;
      height: 3px;
      background: rgba(var(--primary-400-rgb), 0.4);
      border-radius: 50%;
      animation: particleFloat 15s infinite ease-in-out;

      .particle-positions(@i) when (@i > 0) {
        &:nth-child(@{i}) {
          left: (@i * 100% / 20);
          animation-delay: (@i * 0.5s);
          animation-duration: (12 + (@i * 0.5)) * 1s;
        }
        .particle-positions(@i - 1);
      }
      .particle-positions(20);
    }

    @keyframes particleFloat {
      0%,
      100% {
        transform: translateY(100vh) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 0.6;
        transform: scale(1);
      }
      90% {
        opacity: 0.6;
      }
      100% {
        transform: translateY(-10vh) scale(0);
        opacity: 0;
      }
    }

    @keyframes float {
      0%,
      100% {
        transform: translate(0, 0);
      }
      50% {
        transform: translate(30px, -30px);
      }
    }

    &__container {
      position: relative;
      z-index: 1;
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
      align-items: center;
      width: 100%;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &__badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      background: rgba(var(--primary-700-rgb), 0.15);
      border: 1px solid rgba(var(--primary-500-rgb), 0.2);
      border-radius: 100px;
      font-family: @font-body;
      font-size: 13px;
      color: var(--primary-300);
      width: fit-content;
      backdrop-filter: blur(10px);

      &-dot {
        width: 8px;
        height: 8px;
        background: @success-500;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }

      &-separator {
        color: @neutral-500;
      }
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.5;
        transform: scale(1.2);
      }
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(42px, 5vw, 64px);
      font-weight: 600;
      line-height: 1.1;
      letter-spacing: -0.03em;
      color: @neutral-50;
      margin: 0;

      &-line {
        display: block;
      }

      &-gradient {
        display: block;
        background: linear-gradient(
          135deg,
          var(--primary-400) 0%,
          var(--primary-300) 50%,
          var(--primary-500) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    &__description {
      font-family: @font-body;
      font-size: 18px;
      line-height: 1.7;
      color: @neutral-300;
      max-width: 520px;
      margin: 0;
    }

    &__actions {
      display: flex;
      gap: 16px;
      margin-top: 8px;
    }

    &__btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 28px;
      border-radius: 14px;
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s @ease-smooth;

      svg {
        width: 18px;
        height: 18px;
        transition: transform 0.3s @ease-smooth;
      }

      &--primary {
        background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
        color: white;
        border: none;
        box-shadow:
          0 4px 20px rgba(var(--primary-600-rgb), 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.15);

        &:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 30px rgba(var(--primary-600-rgb), 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          svg {
            transform: translateX(4px);
          }
        }
      }

      &--secondary {
        background: rgba(var(--secondary-700-rgb), 0.5);
        color: @neutral-100;
        border: 1px solid rgba(var(--neutral-300-rgb), 0.12);
        backdrop-filter: blur(10px);

        &:hover {
          background: rgba(var(--secondary-600-rgb), 0.6);
          border-color: rgba(var(--neutral-300-rgb), 0.2);
          transform: translateY(-2px);
        }
      }
    }

    &__trust {
      display: flex;
      gap: 32px;
      margin-top: 16px;
      padding-top: 24px;
      border-top: 1px solid rgba(var(--neutral-300-rgb), 0.1);

      &-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: @font-body;
        font-size: 13px;
        color: @neutral-400;

        svg {
          width: 18px;
          height: 18px;
          color: @success-500;
        }
      }
    }

    // Visual
    &__visual {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      &-container {
        position: relative;
        width: 360px;
        height: 360px;
      }

      &-glow {
        position: absolute;
        inset: -20%;
        background: radial-gradient(circle, rgba(var(--primary-500-rgb), 0.15) 0%, transparent 70%);
        filter: blur(40px);
      }

      &-ring {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 1px solid;
        opacity: 0.3;

        &--1 {
          border-color: var(--primary-500);
          animation: ringPulse 4s infinite ease-in-out;
        }
        &--2 {
          inset: 15%;
          border-color: var(--primary-400);
          animation: ringPulse 4s infinite ease-in-out 0.5s;
        }
        &--3 {
          inset: 30%;
          border-color: var(--primary-300);
          animation: ringPulse 4s infinite ease-in-out 1s;
        }
      }

      @keyframes ringPulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 0.3;
        }
        50% {
          transform: scale(1.05);
          opacity: 0.5;
        }
      }

      &-center {
        position: absolute;
        inset: 25%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    &__molecule {
      width: 100%;
      height: 100%;
      svg {
        width: 100%;
        height: 100%;
      }

      &-orbit {
        transform-origin: 100px 100px;
        &--1 {
          animation: orbit 8s linear infinite;
        }
        &--2 {
          animation: orbit 10s linear infinite reverse;
        }
        &--3 {
          animation: orbit 12s linear infinite;
        }
      }

      @keyframes orbit {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }

    &__atom-center {
      fill: var(--primary-500);
    }
    &__orbit-path {
      stroke: rgba(var(--primary-400-rgb), 0.4);
      stroke-width: 1;
      fill: none;
    }
    &__orbit-dot {
      &--1 {
        fill: @success-500;
      }
      &--2 {
        fill: var(--primary-400);
      }
      &--3 {
        fill: @warning-500;
      }
    }

    &__floating-card {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: rgba(var(--secondary-800-rgb), 0.7);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(var(--primary-500-rgb), 0.15);
      border-radius: 12px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: @neutral-100;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

      &-icon {
        font-size: 16px;
      }

      &--1 {
        top: 10%;
        right: 5%;
        animation: floatCard 6s ease-in-out infinite;
      }
      &--2 {
        bottom: 25%;
        left: 5%;
        animation: floatCard 7s ease-in-out infinite 1s;
      }
      &--3 {
        bottom: 10%;
        right: 15%;
        animation: floatCard 8s ease-in-out infinite 2s;
      }

      @keyframes floatCard {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
    }
  }

  /* ══════════════════════════════════════════════════════════════
   CATEGORY SECTION
   ══════════════════════════════════════════════════════════════ */
  .category-section {
    padding: 0 40px;
    margin-top: -20px;
  }

  /* ══════════════════════════════════════════════════════════════
   STATS SECTION
   ══════════════════════════════════════════════════════════════ */
  .stats {
    padding: 50px 40px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(var(--secondary-800-rgb), 0.3) 50%,
      transparent 100%
    );
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s @ease-smooth;

    &.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    &__container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 32px;
    }

    &__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px 24px;
      background: rgba(var(--secondary-800-rgb), 0.4);
      border: 1px solid rgba(var(--neutral-300-rgb), 0.08);
      border-radius: 20px;
      text-align: center;
      transition: all 0.4s @ease-smooth;
      transition-delay: var(--delay);

      &:hover {
        transform: translateY(-8px);
        background: rgba(var(--secondary-700-rgb), 0.5);
        border-color: rgba(var(--neutral-300-rgb), 0.12);
      }

      &--success .stats__icon {
        background: rgba(@success-500, 0.15);
        color: @success-500;
      }
      &--primary .stats__icon {
        background: rgba(var(--primary-500-rgb), 0.15);
        color: var(--primary-400);
      }
      &--warning .stats__icon {
        background: rgba(@warning-500, 0.15);
        color: @warning-500;
      }
      &--info .stats__icon {
        background: rgba(@info-500, 0.15);
        color: @info-500;
      }
    }

    &__icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 28px;
        height: 28px;
      }
    }

    &__value {
      font-family: @font-display;
      font-size: 36px;
      font-weight: 700;
      color: @neutral-50;
      letter-spacing: -0.02em;
    }

    &__label {
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-400;
    }
  }

  /* ══════════════════════════════════════════════════════════════
   PROCESS SECTION
   ══════════════════════════════════════════════════════════════ */
  .process {
    padding: 70px 40px;
    max-width: 1200px;
    margin: 0 auto;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s @ease-smooth;

    &.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    &__header {
      text-align: center;
      margin-bottom: 50px;
    }

    &__eyebrow {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(var(--primary-500-rgb), 0.15);
      border-radius: 100px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--primary-400);
      margin-bottom: 20px;
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(32px, 4vw, 48px);
      font-weight: 600;
      color: @neutral-50;
      margin: 0 0 16px;
      letter-spacing: -0.02em;
    }

    &__subtitle {
      font-family: @font-body;
      font-size: 18px;
      color: @neutral-300;
      margin: 0;
    }

    &__timeline {
      position: relative;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
    }

    &__line {
      position: absolute;
      top: 40px;
      left: 16.66%;
      right: 16.66%;
      height: 2px;
      background: linear-gradient(90deg, @success-500, var(--primary-500), @warning-500);
      opacity: 0.3;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        transform: translateY(-50%);
      }
      &::before {
        left: 0;
        background: @success-500;
      }
      &::after {
        right: 0;
        background: @warning-500;
      }
    }

    &__step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;

      &--success {
        --step-color: @success-500;
      }
      &--primary {
        --step-color: var(--primary-500);
      }
      &--warning {
        --step-color: @warning-500;
      }

      &-marker {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: rgba(var(--secondary-800-rgb), 0.6);
        border: 2px solid var(--step-color);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 32px;
        position: relative;
        z-index: 2;
        transition: all 0.4s @ease-smooth;
      }

      &:hover &-marker {
        transform: scale(1.1);
        background: rgba(var(--secondary-700-rgb), 0.8);
      }

      &-number {
        font-family: @font-display;
        font-size: 28px;
        font-weight: 700;
        color: var(--step-color);
      }
      &-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      &-icon {
        width: 48px;
        height: 48px;
        margin: 0 auto 8px;
        color: var(--step-color);
        svg {
          width: 100%;
          height: 100%;
        }
      }
      &-title {
        font-family: @font-display;
        font-size: 22px;
        font-weight: 600;
        color: @neutral-50;
        margin: 0;
      }
      &-desc {
        font-family: @font-body;
        font-size: 15px;
        line-height: 1.6;
        color: @neutral-300;
        margin: 0;
        max-width: 280px;
      }
    }
  }

  /* ══════════════════════════════════════════════════════════════
   QUALITY SECTION
   ══════════════════════════════════════════════════════════════ */
  .quality {
    position: relative;
    padding: 80px 40px;
    overflow: hidden;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s @ease-smooth;

    &.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    &__bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-700-rgb), 0.08) 0%,
        rgba(var(--primary-500-rgb), 0.05) 100%
      );
    }

    &__pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(var(--primary-400-rgb), 0.05) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    &__container {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    &__eyebrow {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(@success-500, 0.15);
      border-radius: 100px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: @success-500;
      width: fit-content;
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(36px, 4vw, 52px);
      font-weight: 600;
      color: @neutral-50;
      margin: 0;
      line-height: 1.1;
      letter-spacing: -0.02em;

      span {
        background: linear-gradient(135deg, @success-500 0%, var(--primary-400) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    &__description {
      font-family: @font-body;
      font-size: 17px;
      line-height: 1.7;
      color: @neutral-300;
      margin: 0;
    }

    &__features {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 16px;
    }

    &__feature {
      display: flex;
      gap: 16px;
      align-items: flex-start;

      &--success .quality__feature-icon {
        background: rgba(@success-500, 0.15);
        color: @success-500;
      }
      &--primary .quality__feature-icon {
        background: rgba(var(--primary-500-rgb), 0.15);
        color: var(--primary-400);
      }
      &--warning .quality__feature-icon {
        background: rgba(@warning-500, 0.15);
        color: @warning-500;
      }
      &--info .quality__feature-icon {
        background: rgba(@info-500, 0.15);
        color: @info-500;
      }

      &-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        svg {
          width: 22px;
          height: 22px;
        }
      }

      &-text {
        h4 {
          font-family: @font-display;
          font-size: 16px;
          font-weight: 600;
          color: @neutral-50;
          margin: 0 0 4px;
        }
        p {
          font-family: @font-body;
          font-size: 14px;
          color: @neutral-400;
          margin: 0;
          line-height: 1.5;
        }
      }
    }

    &__visual {
      position: relative;
      display: flex;
      justify-content: center;
    }

    &__card {
      width: 340px;
      background: rgba(var(--secondary-800-rgb), 0.6);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(var(--neutral-300-rgb), 0.1);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

      &-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px;
        background: rgba(var(--secondary-700-rgb), 0.4);
        border-bottom: 1px solid rgba(var(--neutral-300-rgb), 0.08);
      }

      &-badge {
        padding: 4px 10px;
        background: rgba(@success-500, 0.2);
        border-radius: 6px;
        font-family: @font-body;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: @success-500;
      }

      &-title {
        font-family: @font-body;
        font-size: 14px;
        font-weight: 500;
        color: @neutral-100;
      }

      &-body {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      &-row {
        display: flex;
        justify-content: space-between;
        font-family: @font-body;
        font-size: 13px;

        span:first-child {
          color: @neutral-400;
        }
        span:last-child {
          color: @neutral-100;
          font-weight: 500;
        }

        &--highlight {
          padding: 12px;
          margin: 4px -12px;
          background: rgba(@success-500, 0.1);
          border-radius: 8px;

          span:last-child {
            color: @success-500;
            font-weight: 700;
            font-size: 15px;
          }
        }
      }

      &-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 16px 20px;
        background: rgba(@success-500, 0.08);
        border-top: 1px solid rgba(var(--neutral-300-rgb), 0.08);
        font-family: @font-body;
        font-size: 13px;
        font-weight: 500;
        color: @success-500;

        svg {
          width: 18px;
          height: 18px;
        }
      }
    }

    &__deco {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);

      &--1 {
        width: 200px;
        height: 200px;
        background: rgba(@success-500, 0.15);
        top: -50px;
        right: -50px;
      }
      &--2 {
        width: 150px;
        height: 150px;
        background: rgba(var(--primary-500-rgb), 0.15);
        bottom: -30px;
        left: 0;
      }
    }
  }

  /* ══════════════════════════════════════════════════════════════
   FAQ SECTION
   ══════════════════════════════════════════════════════════════ */
  .faq {
    padding: 70px 40px;
    max-width: 900px;
    margin: 0 auto;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s @ease-smooth;

    &.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    &__header {
      text-align: center;
      margin-bottom: 40px;
    }

    &__eyebrow {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(var(--primary-500-rgb), 0.15);
      border-radius: 100px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--primary-400);
      margin-bottom: 20px;
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(32px, 4vw, 44px);
      font-weight: 600;
      color: @neutral-50;
      margin: 0;
      letter-spacing: -0.02em;
    }

    &__grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__item {
      background: rgba(var(--secondary-800-rgb), 0.4);
      border: 1px solid rgba(var(--neutral-300-rgb), 0.08);
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s @ease-smooth;

      &:hover {
        border-color: rgba(var(--neutral-300-rgb), 0.12);
        background: rgba(var(--secondary-700-rgb), 0.4);
      }

      &--open {
        border-color: rgba(var(--primary-500-rgb), 0.3);
        background: rgba(var(--primary-700-rgb), 0.1);

        .faq__icon svg {
          transform: rotate(45deg);
        }
        .faq__answer {
          max-height: 200px;
          padding: 0 24px 24px;
          opacity: 1;
        }
      }
    }

    &__question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      gap: 16px;

      span {
        font-family: @font-display;
        font-size: 17px;
        font-weight: 500;
        color: @neutral-50;
      }
    }

    &__icon {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: rgba(var(--secondary-600-rgb), 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: @neutral-400;

      svg {
        width: 16px;
        height: 16px;
        transition: transform 0.3s @ease-smooth;
      }
    }

    &__answer {
      max-height: 0;
      padding: 0 24px;
      opacity: 0;
      overflow: hidden;
      transition: all 0.4s @ease-smooth;

      p {
        font-family: @font-body;
        font-size: 15px;
        line-height: 1.7;
        color: @neutral-300;
        margin: 0;
        border-top: 1px solid rgba(var(--neutral-300-rgb), 0.1);
        padding-top: 20px;
      }
    }
  }

  /* ══════════════════════════════════════════════════════════════
   CTA SECTION
   ══════════════════════════════════════════════════════════════ */
  .cta {
    position: relative;
    margin: 40px 40px;
    padding: 60px 60px;
    border-radius: 32px;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 60px;
    align-items: center;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s @ease-smooth;

    &.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    &__bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        var(--secondary-800) 0%,
        var(--secondary-900) 50%,
        var(--secondary-950) 100%
      );
    }

    &__glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);

      &--1 {
        width: 400px;
        height: 400px;
        background: rgba(var(--primary-600-rgb), 0.25);
        top: -100px;
        left: -100px;
      }
      &--2 {
        width: 300px;
        height: 300px;
        background: rgba(var(--primary-400-rgb), 0.2);
        bottom: -80px;
        right: 20%;
      }
    }

    &__grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(var(--primary-500-rgb), 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--primary-500-rgb), 0.04) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 80% 80% at 30% 50%, black 0%, transparent 70%);
    }

    &__content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(32px, 4vw, 48px);
      font-weight: 600;
      color: @neutral-50;
      margin: 0;
      line-height: 1.15;
      letter-spacing: -0.02em;

      span {
        background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-300) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    &__description {
      font-family: @font-body;
      font-size: 17px;
      line-height: 1.7;
      color: @neutral-300;
      margin: 0;
      max-width: 520px;
    }

    &__actions {
      display: flex;
      gap: 16px;
      margin-top: 8px;
    }

    &__btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 28px;
      border-radius: 14px;
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s @ease-smooth;

      svg {
        width: 18px;
        height: 18px;
        transition: transform 0.3s @ease-smooth;
      }

      &--primary {
        background: @neutral-50;
        color: var(--secondary-900);
        border: none;
        box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(255, 255, 255, 0.25);
          svg {
            transform: translateX(4px);
          }
        }
      }

      &--secondary {
        background: rgba(var(--neutral-100-rgb), 0.1);
        color: @neutral-100;
        border: 1px solid rgba(var(--neutral-100-rgb), 0.2);
        backdrop-filter: blur(10px);

        &:hover {
          background: rgba(var(--neutral-100-rgb), 0.15);
          transform: translateY(-2px);
        }
      }
    }

    &__visual {
      position: relative;
      z-index: 1;
    }

    &__molecule {
      width: 180px;
      height: 180px;
      animation: rotateSlow 20s linear infinite;

      svg {
        width: 100%;
        height: 100%;
      }

      &-center {
        fill: rgba(255, 255, 255, 0.9);
      }
      &-line {
        stroke: rgba(255, 255, 255, 0.3);
        stroke-width: 1.5;
      }
      &-dot {
        &--1 {
          fill: rgba(@success-500, 0.8);
        }
        &--2 {
          fill: rgba(var(--primary-400-rgb), 0.8);
        }
        &--3 {
          fill: rgba(@warning-500, 0.8);
        }
        &--4 {
          fill: rgba(@info-500, 0.8);
        }
      }

      @keyframes rotateSlow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }
  }

  /* ══════════════════════════════════════════════════════════════
   DISCLAIMER
   ══════════════════════════════════════════════════════════════ */
  .disclaimer {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    max-width: 800px;
    margin: 0 auto 60px;
    padding: 20px 24px;
    background: rgba(@warning-500, 0.08);
    border: 1px solid rgba(@warning-500, 0.2);
    border-radius: 12px;

    svg {
      width: 20px;
      height: 20px;
      color: @warning-500;
      flex-shrink: 0;
      margin-top: 2px;
    }

    p {
      font-family: @font-body;
      font-size: 13px;
      line-height: 1.6;
      color: @neutral-300;
      margin: 0;

      strong {
        color: @warning-500;
      }
    }
  }

  /* ══════════════════════════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════════════════════════ */
  @media (max-width: 1100px) {
    .hero {
      &__container {
        grid-template-columns: 1fr;
        gap: 60px;
      }
      &__content {
        text-align: center;
        align-items: center;
      }
      &__description {
        max-width: 600px;
      }
      &__trust {
        justify-content: center;
      }
      &__visual-container {
        width: 320px;
        height: 320px;
      }
    }

    .stats__container {
      grid-template-columns: repeat(2, 1fr);
    }
    .process__timeline {
      grid-template-columns: 1fr;
      gap: 60px;
    }
    .process__line {
      display: none;
    }
    .quality__container {
      grid-template-columns: 1fr;
      gap: 60px;
    }
    .quality__visual {
      order: -1;
    }

    .cta {
      grid-template-columns: 1fr;
      text-align: center;
      &__content {
        align-items: center;
      }
      &__actions {
        justify-content: center;
      }
      &__visual {
        display: none;
      }
    }
  }

  @media (max-width: 768px) {
    .category-section {
      padding: 0 20px;
      margin-top: -10px;
    }

    .hero {
      padding: 100px 20px 60px;
      &__actions {
        flex-direction: column;
        width: 100%;
      }
      &__btn {
        width: 100%;
        justify-content: center;
      }
      &__trust {
        flex-direction: column;
        gap: 12px;
      }
      &__visual {
        display: none;
      }
    }

    .stats {
      padding: 60px 20px;
      &__container {
        grid-template-columns: 1fr;
      }
    }
    .process {
      padding: 60px 20px;
    }
    .quality {
      padding: 60px 20px;
      &__card {
        width: 100%;
      }
    }
    .faq {
      padding: 60px 20px;
      &__question span {
        font-size: 15px;
      }
    }

    .cta {
      margin: 40px 20px;
      padding: 48px 24px;
      &__actions {
        flex-direction: column;
        width: 100%;
      }
      &__btn {
        width: 100%;
        justify-content: center;
      }
    }

    .disclaimer {
      margin: 0 20px 40px;
      flex-direction: column;
      text-align: center;
    }
  }
</style>
