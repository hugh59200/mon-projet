<template>
  <section
    class="hero-banner"
    ref="heroSection"
  >
    <div
      class="hero-banner__glow"
      ref="glowLayer"
    ></div>

    <div
      class="hero-banner__top"
      ref="topSection"
    >
      <!-- Panel gauche -->
      <div class="hero-banner__panel">
        <div class="hero-banner__top-text">
          <span class="hero-banner__eyebrow">Ressources pédagogiques</span>

          <h3 class="hero-banner__title">Comprendre les peptides avant vos recherches.</h3>

          <p class="hero-banner__subtitle">
            Guides, fiches synthétiques et contenus sélectionnés pour mieux appréhender le rôle des
            peptides dans vos projets de recherche.
          </p>

          <ul class="hero-banner__bullets">
            <li>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="icon icon--success"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Vulgarisation claire pour équipes R&D et laboratoires.</span>
            </li>
            <li>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="icon icon--primary"
              >
                <path
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>Ressources externes sélectionnées : articles, vidéos, revues.</span>
            </li>
            <li>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="icon icon--warning"
              >
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Rappel constant : recherche exclusivement – aucun usage humain.</span>
            </li>
          </ul>

          <div class="hero-banner__cta-row">
            <button
              class="hero-banner__cta"
              @click="$router.push('/actualites')"
            >
              <span>Explorer les ressources pédagogiques</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <span class="hero-banner__disclaimer">
              Sélection neutre, sans recommandation médicale.
            </span>
          </div>
        </div>
      </div>

      <!-- Personas droite -->
      <div class="hero-banner__personas">
        <article
          v-for="persona in personas"
          :key="persona.id"
          class="persona-card"
        >
          <div class="persona-card__image-wrap">
            <img
              :src="persona.image"
              :alt="persona.alt"
              loading="lazy"
            />
            <span class="persona-card__tag">{{ persona.tag }}</span>
          </div>
          <div class="persona-card__info">
            <span class="persona-card__name">{{ persona.name }}</span>
            <span class="persona-card__role">{{ persona.role }}</span>
          </div>
        </article>
      </div>
    </div>

    <!-- Carousel bottom -->
    <div
      class="hero-banner__bottom"
      ref="carouselContainer"
    >
      <div class="hero-banner__bottom-inner">
        <div class="hero-banner__bottom-header">
          <span class="hero-banner__bottom-title">Quelques peptides de notre catalogue</span>
          <span class="hero-banner__bottom-notice">Research only – Not for human use</span>
        </div>

        <div
          class="scroll-track"
          ref="scrollTrack"
        >
          <template
            v-for="i in 2"
            :key="i"
          >
            <div
              v-for="p in peptides"
              :key="p.id + '-' + i"
              class="peptide-item"
              @click="goToProduct(p)"
              role="button"
              tabindex="0"
            >
              <div class="peptide-item__img-wrapper">
                <img
                  :src="p.image || '/images/default-peptide.png'"
                  :alt="p.name"
                />
              </div>
              <span class="peptide-item__name">{{ p.name }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  // Images des personas (à adapter selon votre structure)
  import personaLab from '@/assets/banners/hero/persona-lab.png'
  import personaPhd from '@/assets/banners/hero/persona-phd.png'
  import personaQuality from '@/assets/banners/hero/persona-quality.png'
  import personaRd from '@/assets/banners/hero/persona-rd.png'

  // Store produits (à adapter selon votre structure)
  import { useProductsStore } from '@/features/catalogue/composables/useProducts'
  import { storeToRefs } from 'pinia'

  // GSAP
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'

  gsap.registerPlugin(ScrollTrigger)

  const router = useRouter()
  const productsStore = useProductsStore()
  const { products } = storeToRefs(productsStore)
  const { load } = productsStore
  const peptides = products

  // Refs
  const heroSection = ref<HTMLElement>()
  const glowLayer = ref<HTMLElement>()
  const topSection = ref<HTMLElement>()
  const scrollTrack = ref<HTMLElement>()
  const carouselContainer = ref<HTMLElement>()

  let scrollAnim: gsap.core.Tween | null = null

  type Persona = {
    id: string
    name: string
    role: string
    tag: string
    image: string
    alt: string
  }

  const personas = ref<Persona[]>([
    {
      id: 'rd',
      name: 'Dr. L. Moreau',
      role: 'Chercheuse en peptides – équipe R&D',
      tag: 'Recherche fondamentale',
      image: personaRd,
      alt: 'Chercheuse en laboratoire',
    },
    {
      id: 'lab',
      name: 'Pr. K. Almeida',
      role: 'Responsable de laboratoire',
      tag: 'Laboratoire académique',
      image: personaLab,
      alt: 'Responsable de laboratoire',
    },
    {
      id: 'phd',
      name: 'Noah',
      role: 'Doctorant en sciences du vivant',
      tag: 'Projet de thèse',
      image: personaPhd,
      alt: 'Jeune doctorant',
    },
    {
      id: 'quality',
      name: 'Dr. S. Meyer',
      role: 'Référent qualité & conformité',
      tag: 'Qualité & conformité',
      image: personaQuality,
      alt: 'Scientifiques discutant',
    },
  ])

  function goToProduct(p: { id: string }) {
    router.push(`/catalogue/${p.id}`)
  }

  onMounted(() => {
    load()

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

    if (heroSection.value) {
      tl.from(heroSection.value, { opacity: 0, duration: 0.5 })
    }

    if (topSection.value) {
      const textBlock = topSection.value.querySelector('.hero-banner__top-text')
      const cards = topSection.value.querySelectorAll('.persona-card')

      if (textBlock) {
        tl.from(textBlock, { y: 24, opacity: 0, duration: 0.5 }, '-=0.25')
      }

      if (cards.length) {
        tl.from(cards, { y: 28, opacity: 0, stagger: 0.12, duration: 0.45 }, '-=0.2')
      }
    }

    // Carrousel horizontal infini
    const track = scrollTrack.value
    if (track) {
      scrollAnim = gsap.to(track, {
        xPercent: -50,
        duration: 45,
        ease: 'linear',
        repeat: -1,
      })
    }

    const container = carouselContainer.value
    if (container && scrollAnim) {
      container.addEventListener('mouseenter', () => scrollAnim?.pause())
      container.addEventListener('mouseleave', () => scrollAnim?.resume())
    }

    // Glow animé
    if (glowLayer.value) {
      gsap.to(glowLayer.value, {
        backgroundPosition: '200% 100%',
        duration: 22,
        ease: 'none',
        repeat: -1,
        yoyo: true,
      })
    }
  })

  onBeforeUnmount(() => {
    scrollAnim?.kill()
    ScrollTrigger.getAll().forEach((t) => t.kill())
  })
</script>

<style scoped lang="less">
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

  // Couleurs pour fond clair
  @light-text-primary: #1a202c;
  @light-text-secondary: #4a5568;
  @light-text-muted: #718096;

  .hero-banner {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 24px;
    overflow: hidden;

    // Glassmorphism blanc
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.06),
      inset 0 0 0 1px rgba(255, 255, 255, 0.5);

    &__glow {
      position: absolute;
      inset: -50%;
      z-index: 0;
      filter: blur(100px);
      opacity: 0.25;
      pointer-events: none;
      background:
        radial-gradient(circle at 30% 30%, rgba(var(--primary-300-rgb), 0.4), transparent 60%),
        radial-gradient(circle at 70% 70%, rgba(var(--primary-200-rgb), 0.3), transparent 60%);
      background-size: 150% 150%;
    }

    // ══════════════════════════════════════════
    // TOP SECTION
    // ══════════════════════════════════════════
    &__top {
      position: relative;
      z-index: 2;
      display: flex;
      gap: 40px;
      padding: 48px;
      align-items: stretch;
    }

    // ══════════════════════════════════════════
    // LEFT PANEL
    // ══════════════════════════════════════════
    &__panel {
      flex: 1;
      max-width: 480px;
      padding: 32px;
      border-radius: 20px;
      position: relative;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);

      // Accent gauche
      &::before {
        content: '';
        position: absolute;
        top: 20px;
        bottom: 20px;
        left: 0;
        width: 4px;
        border-radius: 0 4px 4px 0;
        background: linear-gradient(to bottom, var(--primary-500), var(--primary-300));
      }
    }

    &__top-text {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__eyebrow {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 100px;
      background: rgba(var(--primary-500-rgb), 0.1);
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--primary-600);
      width: fit-content;
    }

    &__title {
      font-family: @font-display;
      font-size: 28px;
      font-weight: 700;
      line-height: 1.2;
      color: @light-text-primary;
      margin: 0;
      letter-spacing: -0.02em;
    }

    &__subtitle {
      font-family: @font-body;
      font-size: 15px;
      line-height: 1.6;
      color: @light-text-secondary;
      margin: 0;
    }

    &__bullets {
      margin: 12px 0 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;

      li {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        font-family: @font-body;
        font-size: 14px;
        color: @light-text-secondary;
        line-height: 1.5;
      }

      .icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        margin-top: 1px;

        &--success {
          color: @success-600;
        }
        &--primary {
          color: var(--primary-600);
        }
        &--warning {
          color: @warning-600;
        }
      }
    }

    &__cta-row {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__cta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 14px 24px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
      color: white;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s @ease;
      box-shadow: 0 4px 16px rgba(var(--primary-600-rgb), 0.3);

      svg {
        width: 18px;
        height: 18px;
        transition: transform 0.3s @ease;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(var(--primary-600-rgb), 0.4);
        svg {
          transform: translateX(4px);
        }
      }
    }

    &__disclaimer {
      font-family: @font-body;
      font-size: 12px;
      text-align: center;
      color: @light-text-muted;
    }

    // ══════════════════════════════════════════
    // PERSONAS (DROITE)
    // ══════════════════════════════════════════
    &__personas {
      flex: 1.2;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      align-content: start;
      max-height: 420px;
      overflow-y: auto;
      padding-right: 4px;

      // Scrollbar fine
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }
    }

    .persona-card {
      background: white;
      border-radius: 16px;
      padding: 12px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: all 0.3s @ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
        border-color: rgba(var(--primary-500-rgb), 0.2);
      }

      &__image-wrap {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        aspect-ratio: 4/3;
        background: linear-gradient(135deg, @neutral-100, @neutral-50);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      &__tag {
        position: absolute;
        bottom: 8px;
        left: 8px;
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(8px);
        padding: 4px 10px;
        border-radius: 100px;
        font-family: @font-body;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: @light-text-secondary;
      }

      &__info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 0 4px;
      }

      &__name {
        font-family: @font-display;
        font-size: 14px;
        font-weight: 600;
        color: @light-text-primary;
      }

      &__role {
        font-family: @font-body;
        font-size: 12px;
        color: @light-text-muted;
        line-height: 1.4;
      }
    }

    // ══════════════════════════════════════════
    // BOTTOM CAROUSEL
    // ══════════════════════════════════════════
    &__bottom {
      position: relative;
      z-index: 2;
      background: rgba(255, 255, 255, 0.5);
      border-top: 1px solid rgba(0, 0, 0, 0.04);
      padding: 24px 0;
      overflow: hidden;
    }

    &__bottom-inner {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &__bottom-header {
      padding: 0 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    &__bottom-title {
      font-family: @font-display;
      font-size: 16px;
      font-weight: 600;
      color: @light-text-primary;
    }

    &__bottom-notice {
      font-family: @font-body;
      font-size: 13px;
      font-style: italic;
      color: @light-text-muted;
    }

    .scroll-track {
      display: flex;
      gap: 32px;
      width: max-content;
      padding: 0 48px;

      .peptide-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        width: 100px;
        flex-shrink: 0;

        &__img-wrapper {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          transition: all 0.3s @ease;

          img {
            width: 55%;
            height: 55%;
            object-fit: contain;
          }
        }

        &__name {
          font-family: @font-body;
          font-size: 12px;
          font-weight: 500;
          color: @light-text-secondary;
          text-align: center;
          line-height: 1.3;
        }

        &:hover .peptide-item__img-wrapper {
          transform: scale(1.08);
          border-color: var(--primary-300);
          box-shadow: 0 8px 20px rgba(var(--primary-500-rgb), 0.15);
        }
      }
    }

    // ══════════════════════════════════════════
    // RESPONSIVE
    // ══════════════════════════════════════════
    @media (max-width: 1024px) {
      &__top {
        flex-direction: column;
        padding: 32px;
        gap: 32px;
      }

      &__panel {
        max-width: none;
      }

      &__personas {
        max-height: none;
        grid-template-columns: repeat(4, 1fr);
      }

      &__bottom-header,
      .scroll-track {
        padding: 0 32px;
      }
    }

    @media (max-width: 768px) {
      border-radius: 20px;

      &__top {
        padding: 24px;
      }

      &__panel {
        padding: 24px;
      }

      &__title {
        font-size: 24px;
      }

      &__personas {
        grid-template-columns: repeat(2, 1fr);
      }

      &__bottom-header,
      .scroll-track {
        padding: 0 24px;
      }
    }

    @media (max-width: 480px) {
      border-radius: 16px;

      &__top {
        padding: 20px;
      }

      &__panel {
        padding: 20px;
      }

      &__personas {
        grid-template-columns: 1fr;
        max-height: 300px;
        overflow-y: auto;
      }

      &__bottom-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }
</style>
