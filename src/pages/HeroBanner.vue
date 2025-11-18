<template>
  <section
    class="hero-banner"
    ref="heroSection"
  >
    <!-- ✨ fond animé -->
    <div
      class="hero-banner__glow"
      ref="glowLayer"
    ></div>

    <!-- 🧑‍🔬 CONTENU PÉDAGOGIQUE + PERSONAS -->
    <div
      class="hero-banner__top"
      ref="topSection"
    >
      <!-- panneau texte à gauche -->
      <div class="hero-banner__panel">
        <div class="hero-banner__top-text">
          <!-- EYEBROW -->
          <BasicText
            size="body-s"
            color="primary-500"
            class="hero-banner__eyebrow"
          >
            Ressources pédagogiques
          </BasicText>

          <!-- TITRE -->
          <BasicText
            size="h3"
            weight="bold"
            color="primary-700"
          >
            Comprendre les peptides avant vos recherches.
          </BasicText>

          <!-- DESCRIPTION -->
          <BasicText
            size="body-m"
            color="neutral-300"
            class="hero-banner__top-sub"
          >
            Guides, fiches synthétiques et contenus sélectionnés pour mieux appréhender le rôle des
            peptides dans vos projets de recherche.
          </BasicText>

          <!-- BULLETS -->
          <ul class="hero-banner__bullets">
            <li>
              <BasicIconNext
                name="CheckCircle"
                :size="16"
                color="primary-500"
              />
              <BasicText color="neutral-100">
                Vulgarisation claire pour équipes R&amp;D et laboratoires.
              </BasicText>
            </li>

            <li>
              <BasicIconNext
                name="BookOpenText"
                :size="16"
                color="primary-500"
              />
              <BasicText color="neutral-50">
                Ressources externes sélectionnées : articles, vidéos, revues.
              </BasicText>
            </li>

            <li>
              <BasicIconNext
                name="ShieldCheck"
                :size="16"
                color="primary-500"
              />
              <BasicText color="neutral-100">
                Rappel constant : recherche exclusivement – aucun usage humain.
              </BasicText>
            </li>
          </ul>

          <!-- CTA -->
          <div class="hero-banner__cta-row">
            <BasicButton
              label="Explorer les ressources pédagogiques"
              type="primary"
              variant="filled"
              size="medium"
              width="full"
              @click="$router.push('/ressources')"
            />
            <BasicText
              size="body-s"
              color="neutral-500"
              class="hero-banner__disclaimer"
            >
              Sélection neutre, sans recommandation médicale.
            </BasicText>
          </div>
        </div>
      </div>

      <!-- 👥 PERSONAS -->
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
            <BasicText
              class="persona-card__tag"
              color="neutral-0"
            >
              {{ persona.tag }}
            </BasicText>
          </div>

          <div class="persona-card__info">
            <BasicText
              size="body-s"
              weight="bold"
              color="neutral-900"
            >
              {{ persona.name }}
            </BasicText>
            <BasicText
              size="body-s"
              color="neutral-600"
            >
              {{ persona.role }}
            </BasicText>
          </div>
        </article>
      </div>
    </div>

    <!-- 💊 SECTION PEPTIDES (TICKER) -->
    <div
      class="hero-banner__bottom"
      ref="carouselContainer"
    >
      <div class="hero-banner__bottom-inner">
        <div class="hero-banner__bottom-header">
          <BasicText
            weight="bold"
            color="neutral-200"
          >
            Quelques peptides de notre catalogue
          </BasicText>

          <BasicText
            fontStyle="italic"
            color="neutral-400"
          >
            Research only – Not for human use
          </BasicText>
        </div>

        <div
          class="scroll-track"
          ref="scrollTrack"
        >
          <!-- boucle principale -->
          <div
            v-for="p in peptides"
            :key="p.id"
            class="peptide-item"
            @click="goToProduct(p)"
            role="button"
            tabindex="0"
            @keyup.enter="goToProduct(p)"
          >
            <img
              :src="p.image || '/images/default-peptide.png'"
              :alt="p.name"
            />
            <BasicText color="white">{{ p.name }}</BasicText>
          </div>

          <!-- duplication pour loop infinie -->
          <div
            v-for="p in peptides"
            :key="'dup-' + p.id"
            class="peptide-item"
            @click="$router.push('/catalogue')"
          >
            <img
              :src="p.image || '/images/default-peptide.png'"
              :alt="p.name"
              loading="lazy"
            />
            <BasicText color="white">
              {{ p.name }}
            </BasicText>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import personaLab from '@/assets/banners/hero/persona-lab.png'
  import personaPhd from '@/assets/banners/hero/persona-phd.png'
  import personaRd from '@/assets/banners/hero/persona-rd.png'
  import { useProducts } from '@/features/catalogue/composables/useProducts'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  gsap.registerPlugin(ScrollTrigger)

  const router = useRouter()
  const { products, loadProducts } = useProducts()
  const peptides = products

  onMounted(() => {
    loadProducts()
  })

  const heroSection = ref<HTMLElement>()
  const glowLayer = ref<HTMLElement>()
  const topSection = ref<HTMLElement>()
  const scrollTrack = ref<HTMLElement>()
  const carouselContainer = ref<HTMLElement>()

  let scrollAnim: gsap.core.Tween | null = null
  let mouseHandler: ((e: MouseEvent) => void) | null = null

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
      alt: 'Chercheuse en laboratoire souriante devant un écran de données',
    },
    {
      id: 'lab',
      name: 'Pr. K. Almeida',
      role: 'Responsable de laboratoire universitaire',
      tag: 'Laboratoire académique',
      image: personaLab,
      alt: 'Responsable de laboratoire discutant avec un collègue dans un environnement lumineux',
    },
    {
      id: 'phd',
      name: 'Noah',
      role: 'Doctorant en sciences du vivant',
      tag: 'Projet de thèse',
      image: personaPhd,
      alt: 'Jeune doctorant prenant des notes avec une ambiance chaleureuse',
    },
    {
      id: 'quality',
      name: 'Dr. S. Meyer',
      role: 'Référent qualité & conformité',
      tag: 'Qualité & conformité',
      image: personaLab,
      alt: 'Scientifiques discutant des résultats dans un laboratoire lumineux',
    },
  ])

  function goToProduct(p: { id: string }) {
    router.push(`/catalogue/${p.id}`)
  }

  onMounted(() => {
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

      // léger mouvement au scroll pour les personas
      cards.forEach((el, i) => {
        const baseShift = i % 2 === 0 ? -6 : 8
        gsap.to(el, {
          y: baseShift,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }

    // Carrousel horizontal infini
    const track = scrollTrack.value
    if (track) {
      scrollAnim = gsap.to(track, {
        xPercent: -50,
        duration: 35,
        ease: 'linear',
        repeat: -1,
      })
    }

    const container = carouselContainer.value
    if (container && scrollAnim) {
      container.addEventListener('mouseenter', () => scrollAnim?.pause())
      container.addEventListener('mouseleave', () => scrollAnim?.resume())
    }

    // Glow animé + parallax souris
    if (glowLayer.value) {
      gsap.to(glowLayer.value, {
        backgroundPosition: '200% 100%',
        duration: 22,
        ease: 'none',
        repeat: -1,
        yoyo: true,
      })

      gsap.to(glowLayer.value, {
        yPercent: -6,
        scale: 1.03,
        opacity: 0.7,
        scrollTrigger: {
          trigger: heroSection.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      if (window.innerWidth > 768) {
        const glow = glowLayer.value
        mouseHandler = (e: MouseEvent) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 24
          const y = (e.clientY / window.innerHeight - 0.5) * 24
          gsap.to(glow, { x, y, duration: 0.8, ease: 'power2.out' })
        }
        window.addEventListener('mousemove', mouseHandler)
      }
    }
  })

  onBeforeUnmount(() => {
    scrollAnim?.kill()
    ScrollTrigger.getAll().forEach((t) => t.kill())

    if (mouseHandler) {
      window.removeEventListener('mousemove', mouseHandler)
      mouseHandler = null
    }
  })
</script>

<style scoped lang="less">
  /* =========================================================
   HERO BANNER — BEM + LESS NESTING + GLASS UI Premium
   ========================================================= */

  .hero-banner {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    overflow: hidden;

    /* 🔮 Glass container */
    background: color-mix(in srgb, var(--secondary-900) 35%, transparent);
    backdrop-filter: blur(24px);
    border: 1px solid color-mix(in srgb, @neutral-300 22%, transparent);
    box-shadow:
      0 30px 80px fade(#000, 40%),
      inset 0 0 0 1px fade(@white, 10%);

    /* =========================================================
     GLOW BACKGROUND
     ========================================================= */
    &__glow {
      position: absolute;
      inset: -120px;
      z-index: 0;
      filter: blur(80px);
      opacity: 0.55;

      /* Glow thématique Neural Blue + Sonic Indigo */
      background:
        radial-gradient(circle at 25% 20%, color-mix(in srgb, var(--primary-400) 55%, transparent), transparent 60%),
        radial-gradient(circle at 75% 80%, color-mix(in srgb, @indigo-400 48%, transparent), transparent 60%);
      background-size: 200% 200%;
      animation: glowShift 22s ease-in-out infinite alternate;
    }

    /* =========================================================
     TOP SECTION
     ========================================================= */
    &__top {
      position: relative;
      z-index: 2;
      display: flex;
      gap: 32px;
      padding: 42px 44px;
      align-items: stretch;
      flex-wrap: nowrap;
    }

    /* ---------------------------------------------------------
     LEFT PANEL (TEXT BLOCK)
     --------------------------------------------------------- */
    &__panel {
      flex: 1;
      max-width: 440px;
      padding: 26px;
      border-radius: 18px;
      position: relative;
      overflow: hidden;

      /* Glass panel */
      background: color-mix(in srgb, var(--secondary-800) 35%, transparent);
      backdrop-filter: blur(26px);
      border: 1px solid color-mix(in srgb, @neutral-300 26%, transparent);
      box-shadow:
        0 20px 50px fade(#000, 25%),
        inset 0 0 0 1px fade(@white, 12%);

      &::before {
        content: '';
        position: absolute;
        top: 18px;
        bottom: 18px;
        left: 0;
        width: 4px;
        border-radius: 999px;
        background: linear-gradient(to bottom, color-mix(in srgb, var(--primary-500) 95%, transparent), color-mix(in srgb, @indigo-400 85%, transparent));
      }

      /* TEXT BLOCK */
      &__text {
        display: flex;
        flex-direction: column;
        gap: 14px;

        .BasicText[size='h3'] {
          color: @neutral-0 !important;
          text-shadow: 0 2px 10px fade(#000, 40%);
        }
      }

      &__eyebrow {
        padding: 4px 12px;
        border-radius: 999px;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.14em;

        background: color-mix(in srgb, var(--primary-200) 25%, transparent);
        border: 1px solid color-mix(in srgb, var(--primary-400) 30%, transparent);
        backdrop-filter: blur(6px);
        color: var(--primary-600) !important;
      }

      &__sub {
        color: @neutral-200 !important;
      }

      &__bullets {
        margin-top: 8px;
        padding: 0;
        list-style: none;

        display: flex;
        flex-direction: column;
        gap: 6px;

        li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: @neutral-100 !important;
        }
      }

      &__cta {
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;

        &-disclaimer {
          font-size: 11px;
          color: color-mix(in srgb, @neutral-200 85%, transparent) !important;
        }
      }
    }

    /* =========================================================
     PERSONAS
     ========================================================= */
    &__personas {
      flex: 1.4;
      display: flex;
      flex-direction: column;
      gap: 14px;

      max-height: 450px;
      overflow-y: auto;
      padding-right: 6px;

      /* Custom scrollbar */
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        background: color-mix(in srgb, var(--primary-50) 45%, transparent);
        border-radius: 999px;
      }
      &::-webkit-scrollbar-thumb {
        background: color-mix(in srgb, var(--primary-400) 70%, transparent);
        border-radius: 999px;
      }

      /* PERSONA CARD */
      .persona-card {
        border-radius: 16px;
        padding: 10px 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;

        /* subtle neural glass */
        background: linear-gradient(130deg, color-mix(in srgb, @neutral-0 95%, transparent), color-mix(in srgb, var(--primary-50) 80%, transparent));
        box-shadow: 0 8px 22px fade(#000, 12%);

        /* Image wrapper */
        &__image-wrap {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          aspect-ratio: 4 / 3;

          background: radial-gradient(
            circle at 10% 0%,
            color-mix(in srgb, var(--primary-100) 70%, transparent),
            color-mix(in srgb, @indigo-100 50%, transparent)
          );

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .persona-card__tag {
            position: absolute;
            bottom: 10px;
            left: 10px;

            padding: 3px 11px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.08em;

            border-radius: 999px;
            background: color-mix(in srgb, var(--secondary-950) 78%, transparent);
            color: @neutral-0;
            backdrop-filter: blur(6px);
          }
        }

        &__info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
      }
    }

    /* =========================================================
     BOTTOM — PEPTIDE TICKER
     ========================================================= */
    &__bottom {
      position: relative;
      z-index: 2;

      background: linear-gradient(135deg, color-mix(in srgb, var(--primary-600) 75%, transparent), color-mix(in srgb, var(--secondary-700) 82%, transparent));
      backdrop-filter: blur(14px);
      border-top: 4px solid color-mix(in srgb, var(--primary-400) 40%, transparent);

      padding: 16px 24px 18px;
      overflow: hidden;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 80px;
        pointer-events: none;
        z-index: 3;
      }

      &::before {
        left: 0;
        background: linear-gradient(to right, color-mix(in srgb, var(--secondary-900) 80%, transparent), transparent);
      }

      &::after {
        right: 0;
        background: linear-gradient(to left, color-mix(in srgb, var(--secondary-900) 80%, transparent), transparent);
      }

      &-inner {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      &-header {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
      }

      /* SCROLL TRACK */
      .scroll-track {
        display: flex;
        align-items: center;
        gap: 40px;
        width: 200%;

        .peptide-item {
          width: 140px;
          flex-shrink: 0;
          cursor: pointer;

          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;

          img {
            width: 80px;
            height: 80px;
            border-radius: 12px;
            object-fit: contain;
            background: @neutral-0;
            box-shadow: 0 3px 10px color-mix(in srgb, @neutral-700 16%, transparent);
          }

          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 14px color-mix(in srgb, @neutral-700 22%, transparent);
          }
        }
      }
    }

    /* =========================================================
     RESPONSIVE
     ========================================================= */

    @media (max-width: 960px) {
      &__top {
        padding: 26px 20px;
        gap: 24px;
      }

      &__panel {
        max-width: none;
      }

      &__bottom {
        padding-inline: 16px;
      }
    }

    @media (max-width: 768px) {
      &__top {
        flex-direction: column;
      }

      &__personas {
        flex-direction: row;
        overflow-x: auto;
        overflow-y: hidden;

        gap: 12px;
        margin: 6px -8px;
        padding-inline: 8px;

        scroll-snap-type: x mandatory;

        .persona-card {
          flex: 0 0 240px;
          scroll-snap-align: start;
        }
      }

      &__bottom-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }

  /* =========================================================
   ANIMATION — GLOW SHIFT
   ========================================================= */

  @keyframes glowShift {
    0% {
      transform: translate(-20px, -16px) scale(1);
      opacity: 0.45;
    }
    100% {
      transform: translate(26px, 26px) scale(1.15);
      opacity: 0.75;
    }
  }
</style>
