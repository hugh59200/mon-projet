<template>
  <div
    class="home"
    ref="homeRef"
  >
    <!-- HERO SECTION -->
    <section class="layout-section layout-section--hero">
      <div class="layout-section__bg">
        <div class="layout-section__grid"></div>
        <div class="layout-section__glow layout-section__glow--1"></div>
        <div class="layout-section__glow layout-section__glow--2"></div>
        <div class="layout-section__particles">
          <span
            v-for="n in 20"
            :key="n"
          ></span>
        </div>
      </div>
      <div class="layout-section__inner layout-section__inner--two-cols">
        <div class="hero__content">
          <div class="hero__badge">
            <span class="hero__badge-dot"></span>
            <span>Fournisseur européen certifié</span>
            <span class="hero__badge-sep">•</span>
            <span>Usage recherche exclusif</span>
          </div>
          <h1 class="hero__title">
            <span>Peptides de recherche</span>
            <span class="hero__title-accent">haute pureté</span>
            <span>pour laboratoires</span>
          </h1>
          <p class="hero__desc">
            Catalogue sélectionné de peptides certifiés ≥99% de pureté. Certificats d'analyse
            disponibles. Expédition 24h depuis l'Union Européenne.
          </p>
          <div class="hero__actions">
            <button
              class="btn btn--primary"
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
              class="btn btn--ghost"
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
          <div class="molecule-visual">
            <div class="molecule-visual__glow"></div>
            <div class="molecule-visual__ring molecule-visual__ring--1"></div>
            <div class="molecule-visual__ring molecule-visual__ring--2"></div>
            <div class="molecule-visual__ring molecule-visual__ring--3"></div>
            <div class="molecule-visual__center">
              <svg
                viewBox="0 0 200 200"
                fill="none"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="12"
                  class="molecule-visual__atom"
                />
                <g class="molecule-visual__orbit molecule-visual__orbit--1">
                  <ellipse
                    cx="100"
                    cy="100"
                    rx="45"
                    ry="20"
                    class="molecule-visual__path"
                    transform="rotate(-30 100 100)"
                  />
                  <circle
                    cx="145"
                    cy="100"
                    r="4"
                    class="molecule-visual__dot molecule-visual__dot--1"
                    transform="rotate(-30 100 100)"
                  />
                </g>
                <g class="molecule-visual__orbit molecule-visual__orbit--2">
                  <ellipse
                    cx="100"
                    cy="100"
                    rx="45"
                    ry="20"
                    class="molecule-visual__path"
                    transform="rotate(30 100 100)"
                  />
                  <circle
                    cx="145"
                    cy="100"
                    r="4"
                    class="molecule-visual__dot molecule-visual__dot--2"
                    transform="rotate(30 100 100)"
                  />
                </g>
                <g class="molecule-visual__orbit molecule-visual__orbit--3">
                  <ellipse
                    cx="100"
                    cy="100"
                    rx="45"
                    ry="20"
                    class="molecule-visual__path"
                    transform="rotate(90 100 100)"
                  />
                  <circle
                    cx="145"
                    cy="100"
                    r="4"
                    class="molecule-visual__dot molecule-visual__dot--3"
                    transform="rotate(90 100 100)"
                  />
                </g>
              </svg>
            </div>
            <div class="molecule-visual__card molecule-visual__card--1">
              <span>⚗️</span>
              <span>BPC-157</span>
            </div>
            <div class="molecule-visual__card molecule-visual__card--2">
              <span>🧬</span>
              <span>TB-500</span>
            </div>
            <div class="molecule-visual__card molecule-visual__card--3">
              <span>🔬</span>
              <span>Semaglutide</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ✅ CATEGORY BANNER - Séparé avec espacement -->
    <section class="category-section">
      <div class="category-wrapper">
        <CategoryHeroBanner />
      </div>
    </section>

    <!-- STATS -->
    <section class="stats">
      <div class="stats__grid">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="stats__item"
          :class="`stats__item--${stat.variant}`"
        >
          <div class="stats__icon"><component :is="stat.icon" /></div>
          <div class="stats__value">{{ stat.value }}</div>
          <div class="stats__label">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- PROCESS -->
    <section class="process">
      <header class="section-header section-header--light">
        <span class="section-header__badge">Processus simplifié</span>
        <h2 class="section-header__title">Comment ça marche ?</h2>
        <p class="section-header__desc">Un parcours pensé pour les laboratoires et équipes R&D</p>
      </header>
      <div class="process__timeline">
        <div class="process__line"></div>
        <div
          v-for="(step, i) in steps"
          :key="step.title"
          class="process__step"
          :class="`process__step--${step.variant}`"
        >
          <div class="process__marker">
            <span>{{ i + 1 }}</span>
          </div>
          <div class="process__card">
            <div class="process__card-icon"><component :is="step.icon" /></div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- QUALITY -->
    <section class="layout-section layout-section--quality">
      <div class="layout-section__bg">
        <div class="layout-section__pattern"></div>
        <div class="layout-section__glow layout-section__glow--quality-1"></div>
        <div class="layout-section__glow layout-section__glow--quality-2"></div>
      </div>
      <div class="layout-section__inner layout-section__inner--two-cols">
        <div class="quality__content">
          <span class="quality__badge">Engagement qualité</span>
          <h2 class="quality__title">
            Des standards
            <br />
            <span>pharmaceutiques</span>
          </h2>
          <p class="quality__desc">
            Chaque peptide est soumis à un contrôle qualité rigoureux. Analyses HPLC et
            spectrométrie de masse pour garantir une pureté optimale.
          </p>
          <div class="quality__features">
            <div
              v-for="f in qualityFeatures"
              :key="f.title"
              class="quality__feature"
              :class="`quality__feature--${f.variant}`"
            >
              <div class="quality__feature-icon"><component :is="f.icon" /></div>
              <div class="quality__feature-text">
                <h4>{{ f.title }}</h4>
                <p>{{ f.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="quality__visual">
          <div class="coa-card">
            <div class="coa-card__header">
              <span class="coa-card__badge">COA</span>
              <span class="coa-card__title">Certificat d'analyse</span>
            </div>
            <div class="coa-card__body">
              <div class="coa-card__row">
                <span>Référence</span>
                <span>BPC-157-5mg</span>
              </div>
              <div class="coa-card__row">
                <span>Lot</span>
                <span>BP2024-0847</span>
              </div>
              <div class="coa-card__row coa-card__row--highlight">
                <span>Pureté HPLC</span>
                <span>99.4%</span>
              </div>
              <div class="coa-card__row">
                <span>Masse moléculaire</span>
                <span>1419.53 Da</span>
              </div>
              <div class="coa-card__row">
                <span>Apparence</span>
                <span>Poudre blanche</span>
              </div>
            </div>
            <div class="coa-card__footer">
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
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq">
      <header class="section-header section-header--light">
        <span class="section-header__badge">Support</span>
        <h2 class="section-header__title">Questions fréquentes</h2>
      </header>
      <div class="faq__list">
        <div
          v-for="(item, i) in faqItems"
          :key="i"
          class="faq__item"
          :class="{ 'faq__item--open': openFaq === i }"
          @click="toggleFaq(i)"
        >
          <div class="faq__question">
            <span>{{ item.question }}</span>
            <div class="faq__toggle">
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

    <!-- ✅ CTA - Largeur limitée -->
    <section class="cta-section">
      <div class="cta">
        <div class="cta__bg">
          <div class="cta__glow cta__glow--1"></div>
          <div class="cta__glow cta__glow--2"></div>
          <div class="cta__grid"></div>
        </div>
        <div class="cta__inner">
          <div class="cta__content">
            <h2>
              Prêt à démarrer votre
              <br />
              <span>recherche ?</span>
            </h2>
            <p>
              Accédez au catalogue complet et aux stocks disponibles en temps réel. Livraison
              prioritaire pour tous les laboratoires européens.
            </p>
            <div class="cta__actions">
              <button
                class="btn btn--white"
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
                class="btn btn--outline"
                @click="$router.push('/contact')"
              >
                Nous contacter
              </button>
            </div>
          </div>
          <div class="cta__visual">
            <svg
              viewBox="0 0 120 120"
              fill="none"
              class="cta__molecule"
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
        — Les produits proposés sont destinés exclusivement à la recherche scientifique in vitro.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { h, onMounted, ref } from 'vue'
  import CategoryHeroBanner from './CategoryHeroBanner.vue'

  const icon = (d: string) => () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [h('path', { d })],
    )
  const SearchIcon = icon('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z')
  const DocumentIcon = icon(
    'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  )
  const TruckIcon = icon(
    'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
  )
  const ShieldIcon = icon(
    'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  )
  const BeakerIcon = icon(
    'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  )
  const CheckIcon = icon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z')
  const GlobeIcon = icon(
    'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  )
  const LeafIcon = icon(
    'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
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
      description: 'Parcourez notre catalogue et filtrez par catégorie, cible ou application.',
      variant: 'success',
      icon: SearchIcon,
    },
    {
      title: 'Analysez',
      description: "Consultez les fiches techniques et certificats d'analyse (COA).",
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
      description: 'Analyse chromatographique haute performance.',
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
        'Nos produits sont destinés aux laboratoires, institutions de recherche et professionnels qualifiés.',
    },
    {
      question: 'Les produits sont-ils à usage humain ?',
      answer:
        'Non. Tous nos peptides sont vendus exclusivement pour la recherche scientifique in vitro (RUO).',
    },
    {
      question: "Fournissez-vous des certificats d'analyse ?",
      answer: 'Oui, chaque lot est accompagné de son COA complet (HPLC, MS).',
    },
    {
      question: "D'où expédiez-vous ?",
      answer: 'Depuis nos entrepôts en Union Européenne (livraison 24-48h).',
    },
    {
      question: 'Quels moyens de paiement acceptez-vous ?',
      answer: 'Virements bancaires, cartes (Visa, Mastercard) et facturation institutions.',
    },
  ])
  const openFaq = ref<number | null>(null)
  const toggleFaq = (i: number) => {
    openFaq.value = openFaq.value === i ? null : i
  }
  const homeRef = ref<HTMLElement | null>(null)

  onMounted(() => {
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add('is-visible')
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
      )
      document
        .querySelectorAll('.stats, .process, .layout-section--quality, .faq, .cta')
        .forEach((el) => obs.observe(el))
    }
  })
</script>
<style scoped lang="less">
  // ═══════════════════════════════════════════════════════════════
  // DESIGN TOKENS
  // ═══════════════════════════════════════════════════════════════
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
  @ease: cubic-bezier(0.4, 0, 0.2, 1);

  // Couleurs pour sections sur FOND CLAIR
  @light-text-primary: #1a202c;
  @light-text-secondary: #4a5568;
  @light-text-muted: #718096;
  @light-bg-card: #ffffff;
  @light-border: rgba(0, 0, 0, 0.08);

  // ═══════════════════════════════════════════════════════════════
  // BASE
  // ═══════════════════════════════════════════════════════════════
  .home {
    display: flex;
    flex-direction: column;
    gap: 0;
    overflow-x: hidden;
  }

  // ═══════════════════════════════════════════════════════════════
  // LAYOUT SECTION (Hero, Quality - fond sombre)
  // ═══════════════════════════════════════════════════════════════
  .layout-section {
    position: relative;
    width: 100%;
    padding: 80px 32px;
    background: linear-gradient(
      180deg,
      var(--secondary-950) 0%,
      var(--secondary-900) 50%,
      var(--secondary-950) 100%
    );

    &__bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
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
    &__pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(var(--primary-400-rgb), 0.05) 1px, transparent 1px);
      background-size: 40px 40px;
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
      &--quality-1 {
        width: 200px;
        height: 200px;
        background: rgba(@success-500, 0.15);
        top: -50px;
        right: -50px;
        filter: blur(60px);
      }
      &--quality-2 {
        width: 150px;
        height: 150px;
        background: rgba(var(--primary-500-rgb), 0.15);
        bottom: -30px;
        left: 0;
        filter: blur(60px);
      }
    }
    &__particles {
      position: absolute;
      inset: 0;
      overflow: hidden;
      span {
        position: absolute;
        width: 3px;
        height: 3px;
        background: rgba(var(--primary-400-rgb), 0.4);
        border-radius: 50%;
        animation: particleFloat 15s infinite ease-in-out;
        @positions: 5%, 10%, 15%, 20%, 25%, 30%, 35%, 40%, 45%, 50%, 55%, 60%, 65%, 70%, 75%, 80%,
          85%, 90%, 95%, 100%;
        each(@positions, { &:nth-child(@{index}) { left: @value; animation-delay: (@index * 0.5s); } });
      }
    }
    &__inner {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      &--two-cols {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 50px;
        align-items: center;
      }
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

  // ═══════════════════════════════════════════════════════════════
  // BUTTONS
  // ═══════════════════════════════════════════════════════════════
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 28px;
    border-radius: 14px;
    font-family: @font-body;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s @ease;
    border: none;
    svg {
      width: 18px;
      height: 18px;
      transition: transform 0.3s @ease;
    }

    &--primary {
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      color: white;
      box-shadow:
        0 4px 20px rgba(var(--primary-600-rgb), 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(var(--primary-600-rgb), 0.45);
        svg {
          transform: translateX(4px);
        }
      }
    }
    &--ghost {
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
    &--white {
      background: @neutral-50;
      color: var(--secondary-900);
      box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(255, 255, 255, 0.25);
        svg {
          transform: translateX(4px);
        }
      }
    }
    &--outline {
      background: rgba(var(--neutral-100-rgb), 0.1);
      color: @neutral-100;
      border: 1px solid rgba(var(--neutral-100-rgb), 0.2);
      &:hover {
        background: rgba(var(--neutral-100-rgb), 0.15);
        transform: translateY(-2px);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // HERO
  // ═══════════════════════════════════════════════════════════════
  .hero {
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
      &-sep {
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
      span {
        display: block;
      }
      &-accent {
        background: linear-gradient(
          135deg,
          var(--primary-400) 0%,
          var(--primary-300) 50%,
          var(--primary-500) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    &__desc {
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
    &__visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // MOLECULE VISUAL
  // ═══════════════════════════════════════════════════════════════
  .molecule-visual {
    position: relative;
    width: 360px;
    height: 360px;
    &__glow {
      position: absolute;
      inset: -20%;
      background: radial-gradient(circle, rgba(var(--primary-500-rgb), 0.15) 0%, transparent 70%);
      filter: blur(40px);
    }
    &__ring {
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
    &__center {
      position: absolute;
      inset: 25%;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 100%;
        height: 100%;
      }
    }
    &__orbit {
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
    &__atom {
      fill: var(--primary-500);
    }
    &__path {
      stroke: rgba(var(--primary-400-rgb), 0.4);
      stroke-width: 1;
      fill: none;
    }
    &__dot {
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
    &__card {
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
      span:first-child {
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

  // ═══════════════════════════════════════════════════════════════
  // ✅ CATEGORY SECTION - Séparé avec espacement
  // ═══════════════════════════════════════════════════════════════
  .category-section {
    padding: 60px 0;
    background: transparent;
  }
  .category-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION HEADER
  // ═══════════════════════════════════════════════════════════════
  .section-header {
    text-align: center;
    margin-bottom: 50px;
    &__badge {
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
    &__desc {
      font-family: @font-body;
      font-size: 18px;
      color: @neutral-300;
      margin: 0;
    }

    &--light {
      .section-header__badge {
        background: rgba(var(--primary-500-rgb), 0.1);
        color: var(--primary-600);
      }
      .section-header__title {
        color: @light-text-primary;
      }
      .section-header__desc {
        color: @light-text-secondary;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // STATS
  // ═══════════════════════════════════════════════════════════════
  .stats {
    padding: 60px 40px;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s @ease;
    &.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
    &__grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
    &__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px 24px;
      background: var(--secondary-900);
      border: 1px solid rgba(var(--neutral-300-rgb), 0.08);
      border-radius: 20px;
      text-align: center;
      transition: all 0.4s @ease;
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
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
  // ═══════════════════════════════════════════════════════════════
  // PROCESS (fond clair)
  // ═══════════════════════════════════════════════════════════════
  .process {
    padding: 80px 40px;
    max-width: 1200px;
    margin: 0 auto;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s @ease;
    &.is-visible {
      opacity: 1;
      transform: translateY(0);
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
      height: 3px;
      background: linear-gradient(90deg, @success-500, var(--primary-500), @warning-500);
      opacity: 0.5;
      border-radius: 2px;
    }
    &__step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      &--success {
        --step-color: @success-500;
      }
      &--primary {
        --step-color: var(--primary-600);
      }
      &--warning {
        --step-color: @warning-500;
      }
    }
    &__marker {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: @light-bg-card;
      border: 3px solid var(--step-color);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32px;
      position: relative;
      z-index: 2;
      transition: all 0.4s @ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      span {
        font-family: @font-display;
        font-size: 28px;
        font-weight: 700;
        color: var(--step-color);
      }
    }
    &__step:hover &__marker {
      transform: scale(1.1);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }
    &__card {
      display: flex;
      flex-direction: column;
      gap: 12px;
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
      h3 {
        font-family: @font-display;
        font-size: 22px;
        font-weight: 600;
        color: @light-text-primary;
        margin: 0;
      }
      p {
        font-family: @font-body;
        font-size: 15px;
        line-height: 1.6;
        color: @light-text-secondary;
        margin: 0;
        max-width: 280px;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // QUALITY (fond sombre)
  // ═══════════════════════════════════════════════════════════════
  .layout-section--quality {
    margin-top: 40px;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s @ease;
    &.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .quality {
    &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    &__badge {
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
      }
    }
    &__desc {
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
      display: flex;
      justify-content: center;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // COA CARD
  // ═══════════════════════════════════════════════════════════════
  .coa-card {
    width: 340px;
    background: rgba(var(--secondary-800-rgb), 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(var(--neutral-300-rgb), 0.1);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    &__header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: rgba(var(--secondary-700-rgb), 0.4);
      border-bottom: 1px solid rgba(var(--neutral-300-rgb), 0.08);
    }
    &__badge {
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
    &__title {
      font-family: @font-body;
      font-size: 14px;
      font-weight: 500;
      color: @neutral-100;
    }
    &__body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    &__row {
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
    &__footer {
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

  // ═══════════════════════════════════════════════════════════════
  // FAQ (fond clair)
  // ═══════════════════════════════════════════════════════════════
  .faq {
    padding: 80px 40px;
    max-width: 900px;
    margin: 0 auto;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s @ease;
    &.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
    &__list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    &__item {
      background: @light-bg-card;
      border: 1px solid @light-border;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s @ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      &:hover {
        border-color: rgba(var(--primary-500-rgb), 0.2);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      }
      &--open {
        border-color: rgba(var(--primary-500-rgb), 0.3);
        background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.03), @light-bg-card);
        box-shadow: 0 8px 24px rgba(var(--primary-500-rgb), 0.1);
        .faq__toggle svg {
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
        color: @light-text-primary;
      }
    }
    &__toggle {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: rgba(var(--primary-500-rgb), 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--primary-600);
      svg {
        width: 16px;
        height: 16px;
        transition: transform 0.3s @ease;
      }
    }
    &__answer {
      max-height: 0;
      padding: 0 24px;
      opacity: 0;
      overflow: hidden;
      transition: all 0.4s @ease;
      p {
        font-family: @font-body;
        font-size: 15px;
        line-height: 1.7;
        color: @light-text-secondary;
        margin: 0;
        border-top: 1px solid @light-border;
        padding-top: 20px;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ CTA - Largeur limitée avec wrapper
  // ═══════════════════════════════════════════════════════════════
  .cta-section {
    padding: 60px 40px;
    display: flex;
    justify-content: center;
  }

  .cta {
    position: relative;
    width: 100%;
    max-width: 1200px; // ✅ Largeur limitée
    border-radius: 32px;
    overflow: hidden;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s @ease;
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
    &__inner {
      position: relative;
      z-index: 1;
      padding: 60px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 60px;
      align-items: center;
    }
    &__content {
      display: flex;
      flex-direction: column;
      gap: 20px;
      h2 {
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
        }
      }
      p {
        font-family: @font-body;
        font-size: 17px;
        line-height: 1.7;
        color: @neutral-300;
        margin: 0;
        max-width: 520px;
      }
    }
    &__actions {
      display: flex;
      gap: 16px;
      margin-top: 8px;
    }
    &__visual {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &__molecule {
      width: 180px;
      height: 180px;
      animation: rotateSlow 20s linear infinite;
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

  // ═══════════════════════════════════════════════════════════════
  // DISCLAIMER (fond clair)
  // ═══════════════════════════════════════════════════════════════
  .disclaimer {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    max-width: 800px;
    margin: 0 auto 60px;
    padding: 20px 24px;
    background: rgba(@warning-500, 0.08);
    border: 1px solid rgba(@warning-500, 0.25);
    border-radius: 12px;
    svg {
      width: 20px;
      height: 20px;
      color: @warning-600;
      flex-shrink: 0;
      margin-top: 2px;
    }
    p {
      font-family: @font-body;
      font-size: 13px;
      line-height: 1.6;
      color: @light-text-secondary;
      margin: 0;
      strong {
        color: @warning-600;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // RESPONSIVE
  // ═══════════════════════════════════════════════════════════════
  @media (max-width: 1100px) {
    .layout-section__inner--two-cols {
      grid-template-columns: 1fr;
      gap: 60px;
    }
    .hero__content,
    .quality__content {
      text-align: center;
      align-items: center;
    }
    .hero__desc {
      max-width: 600px;
    }
    .hero__trust {
      justify-content: center;
    }
    .hero__visual {
      order: 1;
    }
    .quality__visual {
      order: -1;
    }
    .molecule-visual {
      width: 320px;
      height: 320px;
    }
    .stats__grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .process__timeline {
      grid-template-columns: 1fr;
      gap: 60px;
    }
    .process__line {
      display: none;
    }
    .cta__inner {
      grid-template-columns: 1fr;
      text-align: center;
    }
    .cta__content {
      align-items: center;
    }
    .cta__actions {
      justify-content: center;
    }
    .cta__visual {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .category-section {
      padding: 40px 0;
    }
    .category-wrapper {
      padding: 0 20px;
    }
    .layout-section {
      padding: 60px 20px;
    }
    .hero {
      &__actions {
        flex-direction: column;
        width: 100%;
      }
      .btn {
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
      &__grid {
        grid-template-columns: 1fr;
      }
    }
    .process {
      padding: 60px 20px;
    }
    .faq {
      padding: 60px 20px;
      &__question span {
        font-size: 15px;
      }
    }
    .quality__visual {
      display: none;
    }
    .coa-card {
      width: 100%;
    }
    .cta-section {
      padding: 40px 20px;
    }
    .cta__inner {
      padding: 48px 24px;
    }
    .cta__actions {
      flex-direction: column;
      width: 100%;
    }
    .cta .btn {
      width: 100%;
      justify-content: center;
    }
    .disclaimer {
      margin: 0 20px 40px;
      flex-direction: column;
      text-align: center;
    }
  }
</style>
