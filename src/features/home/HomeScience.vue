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
      <div class="hero-banner__panel">
        <div class="hero-banner__top-text">
          <BasicText
            size="body-s"
            class="hero-banner__eyebrow"
          >
            {{ t('home.banner.eyebrow') }}
          </BasicText>

          <BasicText
            size="h3"
            weight="bold"
          >
            {{ t('home.banner.title.line1') }} {{ t('home.banner.title.accent') }} {{ t('home.banner.title.line2') }}
          </BasicText>

          <BasicText
            size="body-m"
            class="hero-banner__top-sub"
          >
            {{ t('home.banner.description') }}
          </BasicText>

          <ul class="hero-banner__bullets">
            <li>
              <BasicIconNext
                name="CheckCircle"
                :size="18"
                color="success-600"
              />
              <BasicText>
                {{ t('home.banner.bullets.b1') }}
              </BasicText>
            </li>
            <li>
              <BasicIconNext
                name="BookOpenText"
                :size="18"
                color="primary-600"
              />
              <BasicText>
                {{ t('home.banner.bullets.b2') }}
              </BasicText>
            </li>
            <li>
              <BasicIconNext
                name="ShieldCheck"
                :size="18"
                color="warning-600"
              />
              <BasicText>
                {{ t('home.banner.bullets.b3') }}
              </BasicText>
            </li>
          </ul>

          <div class="hero-banner__cta-row">
            <PremiumButton
              type="primary"
              variant="solid"
              size="md"
              width="full"
              :label="t('home.banner.cta')"
              icon-right="ArrowRight"
              :shine="true"
              @click="$router.push('/actualites')"
            />
            <BasicText
              size="body-s"
              class="hero-banner__disclaimer"
            >
              {{ t('home.banner.carousel.scientific') }}
            </BasicText>
          </div>
        </div>
      </div>

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
            <BasicText class="persona-card__tag">
              {{ persona.tag }}
            </BasicText>
          </div>
          <div class="persona-card__info">
            <BasicText
              size="body-s"
              weight="bold"
            >
              {{ persona.name }}
            </BasicText>
            <BasicText
              size="body-s"
              class="persona-card__role"
            >
              {{ persona.role }}
            </BasicText>
          </div>
        </article>
      </div>
    </div>

    <div
      class="hero-banner__bottom"
      ref="carouselContainer"
    >
      <div class="hero-banner__bottom-inner">
        <div class="hero-banner__bottom-header">
          <BasicText weight="bold">
            {{ t('home.banner.carousel.protocols') }}
          </BasicText>
          <BasicText
            fontStyle="italic"
            size="body-s"
            class="hero-banner__bottom-subtitle"
          >
            {{ t('home.banner.carousel.guides') }}
          </BasicText>
        </div>

        <div
          class="scroll-track"
          ref="scrollTrack"
        >
          <!-- Une seule boucle, pas de duplication -->
          <div
            v-for="p in peptides"
            :key="p.id"
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
            <BasicText size="body-s">
              {{ p.name }}
            </BasicText>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { PERSONA_ASSETS } from '@/config/personaAssets'
  import { useProductsStore } from '@/features/catalogue/composables/useProducts'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { storeToRefs } from 'pinia'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  gsap.registerPlugin(ScrollTrigger)

  const { t } = useI18n()
  const router = useRouter()
  const productsStore = useProductsStore()
  const { products } = storeToRefs(productsStore)
  const { load } = productsStore
  const peptides = products

  const heroSection = ref<HTMLElement>()
  const glowLayer = ref<HTMLElement>()
  const topSection = ref<HTMLElement>()
  const scrollTrack = ref<HTMLElement>()
  const carouselContainer = ref<HTMLElement>()

  let scrollTimeline: gsap.core.Timeline | null = null
  let isPaused = false

  // URLs des images persona depuis Supabase Storage
  const personaImages = PERSONA_ASSETS

  type Persona = {
    id: string
    name: string
    role: string
    tag: string
    image: string
    alt: string
  }

  const personas = computed<Persona[]>(() => [
    {
      id: 'rd',
      name: 'Dr. L. Moreau',
      role: t('home.banner.personas.rd.subtitle'),
      tag: t('home.banner.personas.rd.title'),
      image: personaImages.rd,
      alt: t('home.banner.personas.rd.title'),
    },
    {
      id: 'lab',
      name: 'Pr. K. Almeida',
      role: t('home.banner.personas.lab.subtitle'),
      tag: t('home.banner.personas.lab.title'),
      image: personaImages.lab,
      alt: t('home.banner.personas.lab.title'),
    },
    {
      id: 'phd',
      name: 'Noah',
      role: t('home.banner.personas.phd.subtitle'),
      tag: t('home.banner.personas.phd.title'),
      image: personaImages.phd,
      alt: t('home.banner.personas.phd.title'),
    },
    {
      id: 'quality',
      name: 'Dr. S. Meyer',
      role: t('home.banner.personas.quality.subtitle'),
      tag: t('home.banner.personas.quality.title'),
      image: personaImages.quality,
      alt: t('home.banner.personas.quality.title'),
    },
  ])

  function goToProduct(p: { id: string }) {
    router.push(`/catalogue/${p.id}`)
  }

  /**
   * Crée l'animation ping-pong du carousel
   * - Défile vers la gauche
   * - Pause 3 secondes
   * - Défile vers la droite (retour)
   * - Pause 3 secondes
   * - Répète
   */
  function createPingPongAnimation() {
    const track = scrollTrack.value
    const container = carouselContainer.value

    if (!track || !container) return

    // Kill l'ancienne animation si elle existe
    if (scrollTimeline) {
      scrollTimeline.kill()
      gsap.set(track, { x: 0 })
    }

    // Calcul du déplacement nécessaire
    const trackWidth = track.scrollWidth
    const containerWidth = container.clientWidth
    const maxScroll = trackWidth - containerWidth

    // Si le contenu ne dépasse pas, pas besoin d'animation
    if (maxScroll <= 0) return

    // Durée basée sur la distance (~40px/seconde pour une vitesse confortable)
    const scrollDuration = Math.max(12, maxScroll / 40)

    // Création de la timeline ping-pong
    scrollTimeline = gsap.timeline({ repeat: -1 })

    // 1. Défilement vers la gauche (début -> fin)
    scrollTimeline.to(track, {
      x: -maxScroll,
      duration: scrollDuration,
      ease: 'none',
    })

    // 2. Pause de 3 secondes à la fin
    scrollTimeline.to({}, { duration: 3 })

    // 3. Défilement vers la droite (fin -> début)
    scrollTimeline.to(track, {
      x: 0,
      duration: scrollDuration,
      ease: 'none',
    })

    // 4. Pause de 3 secondes au début
    scrollTimeline.to({}, { duration: 3 })
  }

  // Recréer l'animation quand les produits changent
  // watch(
  //   peptides,
  //   () => {
  //     // Attendre que le DOM soit mis à jour
  //     setTimeout(createPingPongAnimation, 100)
  //   },
  //   { deep: true },
  // )

  onMounted(() => {
    load()

    // Animation d'entrée
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

    // Initialiser l'animation du carousel (sera recréée quand les produits arrivent)
    setTimeout(createPingPongAnimation, 500)

    // Pause/Resume au hover
    const container = carouselContainer.value
    if (container) {
      container.addEventListener('mouseenter', () => {
        if (scrollTimeline && !isPaused) {
          scrollTimeline.pause()
          isPaused = true
        }
      })
      container.addEventListener('mouseleave', () => {
        if (scrollTimeline && isPaused) {
          scrollTimeline.resume()
          isPaused = false
        }
      })
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
    scrollTimeline?.kill()
    ScrollTrigger.getAll().forEach((t) => t.kill())
  })
</script>

<style scoped lang="less">
  /* ══════════════════════════════════════════════════════════════
     HOME SCIENCE — Light/Dark Theme Support
     ══════════════════════════════════════════════════════════════ */

  .hero-banner {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;

    // Géré par ContentBlock parent
    &__glow {
      position: absolute;
      inset: -50%;
      z-index: 0;
      filter: blur(100px);
      opacity: 0.2;
      pointer-events: none;
      background:
        radial-gradient(circle at 30% 30%, rgba(var(--primary-200-rgb), 0.3), transparent 60%),
        radial-gradient(circle at 70% 70%, rgba(var(--secondary-200-rgb), 0.3), transparent 60%);
      background-size: 150% 150%;
    }

    // ═══════════════════════════════════════════════════════════════
    // TOP SECTION
    // ═══════════════════════════════════════════════════════════════
    &__top {
      position: relative;
      z-index: 2;
      display: flex;
      gap: 24px;
      padding: 32px;
    }

    // ═══════════════════════════════════════════════════════════════
    // LEFT PANEL
    // ═══════════════════════════════════════════════════════════════
    &__panel {
      flex: 0 0 360px;
      padding: 28px;
      border-radius: 20px;
      position: relative;
      background: var(--content-block-bg-subtle);
      border: 1px solid var(--content-block-border);
      box-shadow: var(--shadow-md);

      &::before {
        content: '';
        position: absolute;
        top: 20px;
        bottom: 20px;
        left: 0;
        width: 4px;
        border-radius: 0 4px 4px 0;
        background: linear-gradient(to bottom, var(--primary-400), var(--primary-200));
      }
    }

    &__top-text {
      display: flex;
      flex-direction: column;
      gap: 14px;
      color: var(--content-block-text);
    }

    &__eyebrow {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      background: rgba(var(--primary-500-rgb), 0.1);
      color: var(--primary-600);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.7rem;
      width: fit-content;
    }

    &__bullets {
      margin-top: 8px;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: var(--content-block-text-secondary);

      li {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 0.9rem;
        line-height: 1.4;
      }
    }

    &__cta-row {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__disclaimer {
      font-size: 0.75rem;
      text-align: center;
      opacity: 0.7;
      color: var(--content-block-text-muted);
    }

    // ═══════════════════════════════════════════════════════════════
    // PERSONAS GRID - Approche simple avec aspect-ratio
    // ═══════════════════════════════════════════════════════════════
    &__personas {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }

    .persona-card {
      max-width: 320px;
      max-height: 220px;
      background: var(--content-block-bg-subtle);
      border-radius: 14px;
      padding: 10px;
      border: 1px solid var(--content-block-border);
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }

      &__image-wrap {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        background: var(--content-block-bg-subtle);
        aspect-ratio: 4 / 3;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      &__tag {
        position: absolute;
        bottom: 6px;
        left: 6px;
        background: var(--content-block-bg-subtle);
        backdrop-filter: blur(4px);
        padding: 3px 8px;
        border-radius: 8px;
        font-size: 0.55rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.02em;
        color: var(--content-block-text-secondary);
      }

      &__info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        color: var(--content-block-text);
      }

      &__role {
        color: var(--content-block-text-muted);
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // BOTTOM CAROUSEL
    // ═══════════════════════════════════════════════════════════════
    &__bottom {
      position: relative;
      z-index: 2;
      background: var(--content-block-bg-subtle);
      border-top: 1px solid var(--content-block-border);
      padding: 20px 0;
      overflow: hidden;
    }

    &__bottom-inner {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__bottom-header {
      padding: 0 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      color: var(--content-block-text);
    }

    &__bottom-subtitle {
      color: var(--content-block-text-muted);
    }

    &__top-sub {
      color: var(--content-block-text-secondary);
    }

    .scroll-track {
      display: flex;
      gap: 24px;
      width: max-content;
      padding: 0 32px;
      will-change: transform;

      .peptide-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        width: 100px;
        flex-shrink: 0;
        color: var(--content-block-text-secondary);

        &__img-wrapper {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--content-block-bg-subtle);
          border: 3px solid var(--content-block-border);
          box-shadow: var(--shadow-sm);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        &:hover &__img-wrapper {
          border-color: var(--primary-300);
          box-shadow: var(--shadow-md);
        }
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // RESPONSIVE - Breakpoints harmonisés
    // ═══════════════════════════════════════════════════════════════

    // Tablet (≤ 1160px)
    .respond-tablet({
      &__top {
        gap: 20px;
        padding: 28px;
        flex-direction: column;
      }
      &__panel {
        flex: none;
        padding: 24px;
      }
      &__personas {
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
      }
      .persona-card {
        padding: 8px;
        border-radius: 12px;
        &__tag {
          font-size: 0.5rem;
          padding: 2px 6px;
        }
      }
      &__bottom-header,
      .scroll-track {
        padding: 0 24px;
      }
    });

    // Mobile (≤ 720px)
    .respond-mobile({
      border-radius: 16px;
      margin-top: 20px;

      &__top {
        padding: 20px;
        gap: 16px;
      }

      &__panel {
        padding: 20px;
        &::before {
          width: 3px;
        }
      }

      &__personas {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        .persona-card {
          min-width: 100%;
        }
      }

      &__bottom-header {
        padding: 0 20px;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }

      .scroll-track {
        padding: 0 20px;
        gap: 16px;
        .peptide-item {
          width: 80px;
          &__img-wrapper {
            width: 56px;
            height: 56px;
            border-width: 2px;
          }
        }
      }
    });
  }
</style>
