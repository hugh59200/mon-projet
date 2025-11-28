<template>
  <section
    class="hero"
    ref="heroSection"
    @mouseenter="pauseAutoplay"
    @mouseleave="resumeAutoplay"
  >
    <!-- Backgrounds avec crossfade -->
    <div class="hero__backgrounds">
      <div
        v-for="(slide, index) in slides"
        :key="`bg-${slide.id}`"
        class="hero__bg"
        :class="{ 'hero__bg--active': index === activeIndex }"
        :style="{ backgroundImage: `url(${slide.bgImage})` }"
      >
        <div class="hero__bg-overlay"></div>
      </div>
    </div>

    <!-- Grille décorative -->
    <div class="hero__grid"></div>

    <!-- Particules flottantes -->
    <div class="hero__particles">
      <span
        v-for="n in 12"
        :key="n"
        class="hero__particle"
      ></span>
    </div>

    <!-- Contenu principal -->
    <div class="hero__container">
      <!-- Navigation catégories -->
      <nav class="hero__nav">
        <button
          v-for="(slide, index) in slides"
          :key="`nav-${slide.id}`"
          type="button"
          class="hero__nav-item"
          :class="[
            { 'hero__nav-item--active': index === activeIndex },
            `hero__nav-item--${slide.variant}`,
          ]"
          @click="goToSlide(index)"
        >
          <span class="hero__nav-icon">
            <component :is="slide.icon" />
          </span>
          <span class="hero__nav-label">{{ slide.label }}</span>
          <span class="hero__nav-indicator"></span>
        </button>
      </nav>

      <!-- Zone de contenu avec transition -->
      <div class="hero__content">
        <TransitionGroup
          name="slide-content"
          tag="div"
          class="hero__slides"
        >
          <article
            v-for="(slide, index) in slides"
            v-show="index === activeIndex"
            :key="slide.id"
            class="hero__slide"
            :class="`hero__slide--${slide.variant}`"
          >
            <div class="hero__slide-inner">
              <!-- Colonne texte -->
              <div class="hero__text">
                <span class="hero__eyebrow">
                  <span class="hero__eyebrow-line"></span>
                  {{ slide.eyebrow }}
                </span>

                <h2 class="hero__title">
                  <span class="hero__title-main">{{ slide.titleMain }}</span>
                  <span class="hero__title-accent">{{ slide.titleAccent }}</span>
                </h2>

                <p class="hero__description">{{ slide.description }}</p>

                <div class="hero__stats">
                  <div
                    v-for="stat in slide.stats"
                    :key="stat.label"
                    class="hero__stat"
                  >
                    <span class="hero__stat-value">{{ stat.value }}</span>
                    <span class="hero__stat-label">{{ stat.label }}</span>
                  </div>
                </div>

                <div class="hero__actions">
                  <button
                    class="hero__btn hero__btn--primary"
                    @click="goToCategory(slide)"
                  >
                    <span>Explorer {{ slide.label }}</span>
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
                    @click="goToCatalogue"
                  >
                    <span>Catalogue complet</span>
                  </button>
                </div>

                <p class="hero__disclaimer">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Produits destinés exclusivement à la recherche scientifique
                </p>
              </div>

              <!-- Colonne média -->
              <div class="hero__media">
                <div
                  class="hero__card"
                  @click="openVideo(slide)"
                >
                  <div class="hero__card-glow"></div>
                  <div class="hero__card-border"></div>

                  <div class="hero__card-image">
                    <img
                      :src="`https://img.youtube.com/vi/${slide.youtubeId}/maxresdefault.jpg`"
                      :alt="slide.titleMain"
                      loading="lazy"
                    />
                    <div class="hero__card-shine"></div>
                  </div>

                  <div class="hero__card-content">
                    <span class="hero__card-badge">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
                        />
                      </svg>
                      Vidéo explicative
                    </span>
                    <h3 class="hero__card-title">{{ slide.videoLabel }}</h3>
                    <span class="hero__card-cta">
                      <span class="hero__card-play">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                      Regarder
                    </span>
                  </div>
                </div>

                <!-- Molécule décorative -->
                <div class="hero__molecule">
                  <svg
                    viewBox="0 0 200 200"
                    fill="none"
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r="8"
                      fill="currentColor"
                      opacity="0.6"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="5"
                      fill="currentColor"
                      opacity="0.4"
                    />
                    <circle
                      cx="140"
                      cy="60"
                      r="5"
                      fill="currentColor"
                      opacity="0.4"
                    />
                    <circle
                      cx="60"
                      cy="140"
                      r="5"
                      fill="currentColor"
                      opacity="0.4"
                    />
                    <circle
                      cx="140"
                      cy="140"
                      r="5"
                      fill="currentColor"
                      opacity="0.4"
                    />
                    <line
                      x1="100"
                      y1="100"
                      x2="60"
                      y2="60"
                      stroke="currentColor"
                      stroke-width="1.5"
                      opacity="0.3"
                    />
                    <line
                      x1="100"
                      y1="100"
                      x2="140"
                      y2="60"
                      stroke="currentColor"
                      stroke-width="1.5"
                      opacity="0.3"
                    />
                    <line
                      x1="100"
                      y1="100"
                      x2="60"
                      y2="140"
                      stroke="currentColor"
                      stroke-width="1.5"
                      opacity="0.3"
                    />
                    <line
                      x1="100"
                      y1="100"
                      x2="140"
                      y2="140"
                      stroke="currentColor"
                      stroke-width="1.5"
                      opacity="0.3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </article>
        </TransitionGroup>
      </div>

      <!-- Indicateurs de progression -->
      <div class="hero__progress">
        <button
          v-for="(slide, index) in slides"
          :key="`prog-${slide.id}`"
          class="hero__progress-item"
          :class="[
            { 'hero__progress-item--active': index === activeIndex },
            `hero__progress-item--${slide.variant}`,
          ]"
          @click="goToSlide(index)"
        >
          <span class="hero__progress-bar">
            <span
              class="hero__progress-fill"
              :style="{ animationDuration: index === activeIndex ? '9s' : '0s' }"
            ></span>
          </span>
        </button>
      </div>
    </div>

    <!-- Modal vidéo -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="activeVideo"
          class="hero-modal"
          @click="closeModal"
        >
          <div class="hero-modal__backdrop"></div>
          <Transition name="modal-content">
            <div
              v-if="activeVideo"
              class="hero-modal__content"
              @click.stop
            >
              <iframe
                :src="`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`"
                frameborder="0"
                allow="autoplay; fullscreen"
                allowfullscreen
              ></iframe>
              <button
                class="hero-modal__close"
                @click="closeModal"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
  import { computed, h, onBeforeUnmount, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  // Icons
  const MetabolismIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('path', {
          d: 'M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83',
        }),
      ],
    )

  const WellbeingIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('path', {
          d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
        }),
      ],
    )

  const PerformanceIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [h('path', { d: 'M13 10V3L4 14h7v7l9-11h-7z' })],
    )

  const router = useRouter()

  type CategorySlide = {
    id: string
    label: string
    tag: string
    eyebrow: string
    titleMain: string
    titleAccent: string
    description: string
    youtubeId: string
    videoLabel: string
    variant: 'success' | 'primary' | 'warning'
    bgImage: string
    icon: ReturnType<typeof h>
    stats: { value: string; label: string }[]
  }

  const slides = ref<CategorySlide[]>([
    {
      id: 'metabolism',
      label: 'Métabolisme',
      tag: 'Métabolisme',
      eyebrow: 'Voies métaboliques',
      titleMain: 'Peptides pour la recherche sur',
      titleAccent: 'le métabolisme',
      description:
        "Modulation des voies métaboliques, sensibilité à l'insuline et gestion de l'énergie sur modèles précliniques. Explorez notre gamme complète de peptides de recherche.",
      youtubeId: '5OjqLrbuA8Y',
      videoLabel: 'Bases des peptides & métabolisme',
      variant: 'success',
      bgImage: '/images/metabolism-bg.jpg',
      icon: MetabolismIcon(),
      stats: [
        { value: '24+', label: 'Peptides' },
        { value: '99%', label: 'Pureté' },
        { value: '48h', label: 'Livraison' },
      ],
    },
    {
      id: 'wellbeing',
      label: 'Bien-être',
      tag: 'Bien-être',
      eyebrow: 'Neuro & axes du stress',
      titleMain: 'Peptides pour la recherche sur',
      titleAccent: 'le bien-être',
      description:
        "Étude des voies neurobiologiques, de la réponse au stress et des axes impliqués dans la régulation de l'humeur. Solutions de recherche avancées.",
      youtubeId: 'qKHknxLvsDY',
      videoLabel: 'Peptides & réponses immunitaires',
      variant: 'primary',
      bgImage: '/images/wellbeing-bg.jpg',
      icon: WellbeingIcon(),
      stats: [
        { value: '18+', label: 'Peptides' },
        { value: '99%', label: 'Pureté' },
        { value: '48h', label: 'Livraison' },
      ],
    },
    {
      id: 'performance',
      label: 'Performance',
      tag: 'Performance',
      eyebrow: 'Physiologie de la performance',
      titleMain: 'Peptides pour la recherche sur',
      titleAccent: 'la performance',
      description:
        "Exploration de la récupération, de la capacité d'effort et des adaptations physiologiques sur modèles de recherche. Innovation scientifique.",
      youtubeId: 'e4V55I45uO8',
      videoLabel: 'Panorama des peptides performance',
      variant: 'warning',
      bgImage: '/images/performance-bg.jpg',
      icon: PerformanceIcon(),
      stats: [
        { value: '32+', label: 'Peptides' },
        { value: '99%', label: 'Pureté' },
        { value: '48h', label: 'Livraison' },
      ],
    },
  ])

  const activeIndex = ref(0)
  const activeVideo = ref<{ youtubeId: string } | null>(null)
  const heroSection = ref<HTMLElement | null>(null)
  const isHeroVisible = ref(true)

  let autoplayTimer: number | null = null
  let intersectionObserver: IntersectionObserver | null = null

  const activeSlide = computed(() => slides.value[activeIndex.value])

  function goToSlide(index: number) {
    if (index !== activeIndex.value) {
      activeIndex.value = index
      restartAutoplay()
    }
  }

  function openVideo(slide: CategorySlide) {
    activeVideo.value = { youtubeId: slide.youtubeId }
    document.body.style.overflow = 'hidden'
  }

  function closeModal() {
    activeVideo.value = null
    document.body.style.overflow = ''
  }

  function goToCatalogue() {
    router.push('/catalogue')
  }
  function goToCategory(slide: CategorySlide) {
    router.push({ path: '/catalogue', query: { tag: slide.tag } })
  }

  function startAutoplay() {
    if (autoplayTimer || !isHeroVisible.value) return
    autoplayTimer = window.setInterval(() => {
      activeIndex.value = (activeIndex.value + 1) % slides.value.length
    }, 9000)
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer)
      autoplayTimer = null
    }
  }

  function restartAutoplay() {
    stopAutoplay()
    if (isHeroVisible.value) startAutoplay()
  }
  function pauseAutoplay() {
    stopAutoplay()
  }
  function resumeAutoplay() {
    if (isHeroVisible.value) startAutoplay()
  }

  onMounted(() => {
    if ('IntersectionObserver' in window && heroSection.value) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target !== heroSection.value) return
            isHeroVisible.value = entry.isIntersecting
            if (entry.isIntersecting) startAutoplay()
            else stopAutoplay()
          })
        },
        { threshold: 0.25 },
      )
      intersectionObserver.observe(heroSection.value)
    } else {
      startAutoplay()
    }
  })

  onBeforeUnmount(() => {
    stopAutoplay()
    if (intersectionObserver && heroSection.value) {
      intersectionObserver.unobserve(heroSection.value)
      intersectionObserver.disconnect()
    }
  })
</script>

<style scoped lang="less">
  /* ══════════════════════════════════════════════════════════════
   CATEGORY HERO — Using Theme CSS Variables
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

  .hero {
    --hero-radius: 24px;
    --content-max: 1320px;

    position: relative;
    min-height: 520px;
    border-radius: var(--hero-radius);
    overflow: hidden;
    isolation: isolate;

    background: linear-gradient(
      135deg,
      var(--secondary-950) 0%,
      var(--secondary-900) 50%,
      var(--secondary-950) 100%
    );

    // Premium border
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: var(--hero-radius);
      padding: 1px;
      background: linear-gradient(
        135deg,
        rgba(var(--neutral-300-rgb), 0.12) 0%,
        rgba(var(--neutral-300-rgb), 0.05) 50%,
        rgba(var(--neutral-300-rgb), 0.08) 100%
      );
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      z-index: 10;
    }

    /* BACKGROUNDS */
    &__backgrounds {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    &__bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transform: scale(1.05);
      transition:
        opacity 1.2s @ease-smooth,
        transform 8s @ease-smooth;

      &--active {
        opacity: 1;
        transform: scale(1);
      }
    }

    &__bg-overlay {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(
          ellipse 80% 60% at 75% 50%,
          transparent 0%,
          rgba(var(--secondary-950-rgb), 0.4) 100%
        ),
        linear-gradient(
          90deg,
          rgba(var(--secondary-950-rgb), 0.92) 0%,
          rgba(var(--secondary-950-rgb), 0.7) 45%,
          rgba(var(--secondary-950-rgb), 0.3) 70%,
          transparent 100%
        ),
        linear-gradient(180deg, transparent 60%, rgba(var(--secondary-950-rgb), 0.8) 100%);
    }

    /* DECORATIVE */
    &__grid {
      position: absolute;
      inset: 0;
      z-index: 1;
      background-image:
        linear-gradient(rgba(var(--primary-500-rgb), 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--primary-500-rgb), 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 60% 50% at 30% 50%, black 0%, transparent 70%);
      pointer-events: none;
    }

    &__particles {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      overflow: hidden;
    }

    &__particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(var(--primary-400-rgb), 0.25);
      border-radius: 50%;
      animation: float 20s infinite ease-in-out;

      @keyframes float {
        0%,
        100% {
          transform: translateY(0) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: 0.6;
        }
        90% {
          opacity: 0.6;
        }
        100% {
          transform: translateY(-100vh) translateX(20px);
          opacity: 0;
        }
      }

      &:nth-child(1) {
        left: 10%;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(2) {
        left: 20%;
        animation-delay: 2s;
        animation-duration: 22s;
      }
      &:nth-child(3) {
        left: 30%;
        animation-delay: 4s;
        animation-duration: 19s;
      }
      &:nth-child(4) {
        left: 40%;
        animation-delay: 1s;
        animation-duration: 24s;
      }
      &:nth-child(5) {
        left: 50%;
        animation-delay: 3s;
        animation-duration: 20s;
      }
      &:nth-child(6) {
        left: 60%;
        animation-delay: 5s;
        animation-duration: 21s;
      }
      &:nth-child(7) {
        left: 70%;
        animation-delay: 2.5s;
        animation-duration: 23s;
      }
      &:nth-child(8) {
        left: 80%;
        animation-delay: 0.5s;
        animation-duration: 17s;
      }
      &:nth-child(9) {
        left: 15%;
        animation-delay: 6s;
        animation-duration: 25s;
      }
      &:nth-child(10) {
        left: 45%;
        animation-delay: 7s;
        animation-duration: 19s;
      }
      &:nth-child(11) {
        left: 75%;
        animation-delay: 4.5s;
        animation-duration: 22s;
      }
      &:nth-child(12) {
        left: 90%;
        animation-delay: 1.5s;
        animation-duration: 20s;
      }
    }

    /* CONTAINER */
    &__container {
      position: relative;
      z-index: 5;
      max-width: var(--content-max);
      margin: 0 auto;
      padding: 24px 40px 28px;
      display: flex;
      flex-direction: column;
      min-height: 520px;
    }

    /* NAVIGATION */
    &__nav {
      display: flex;
      gap: 8px;
      margin-bottom: 32px;
    }

    &__nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 20px 10px 14px;
      border-radius: 100px;
      background: rgba(var(--secondary-700-rgb), 0.5);
      border: 1px solid rgba(var(--neutral-300-rgb), 0.08);
      color: @neutral-400;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.01em;
      cursor: pointer;
      transition: all 0.3s @ease-smooth;
      position: relative;
      overflow: hidden;

      &:hover {
        background: rgba(var(--secondary-600-rgb), 0.6);
        color: @neutral-200;
        transform: translateY(-1px);
      }

      // Variants
      &--success {
        --nav-color: @success-500;
      }
      &--primary {
        --nav-color: var(--primary-500);
      }
      &--warning {
        --nav-color: @warning-500;
      }

      &--active {
        background: rgba(var(--nav-color-rgb, var(--primary-500-rgb)), 0.15);
        border-color: rgba(var(--nav-color-rgb, var(--primary-500-rgb)), 0.3);
        color: @neutral-50;
        box-shadow:
          0 0 20px rgba(var(--nav-color-rgb, var(--primary-500-rgb)), 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);

        .hero__nav-icon {
          background: var(--nav-color);
          color: white;
          box-shadow: 0 0 16px rgba(var(--nav-color-rgb, var(--primary-500-rgb)), 0.4);
        }
        .hero__nav-indicator {
          transform: scaleX(1);
        }
      }
    }

    &__nav-icon {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: rgba(var(--secondary-600-rgb), 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s @ease-smooth;
      color: var(--nav-color);

      svg {
        width: 16px;
        height: 16px;
      }
    }

    &__nav-label {
      white-space: nowrap;
    }

    &__nav-indicator {
      position: absolute;
      bottom: 0;
      left: 20%;
      right: 20%;
      height: 2px;
      background: var(--nav-color);
      border-radius: 2px 2px 0 0;
      transform: scaleX(0);
      transition: transform 0.3s @ease-smooth;
    }

    /* CONTENT AREA */
    &__content {
      flex: 1;
      display: flex;
      align-items: center;
      position: relative;
    }
    &__slides {
      width: 100%;
      position: relative;
    }
    &__slide {
      width: 100%;
    }
    &__slide-inner {
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: 60px;
      align-items: center;
    }

    // Slide Variants
    &__slide {
      &--success {
        --slide-color: @success-500;
        --slide-color-rgb: var(--success-500-rgb, 44, 187, 102);
      }
      &--primary {
        --slide-color: var(--primary-500);
        --slide-color-rgb: var(--primary-500-rgb);
      }
      &--warning {
        --slide-color: @warning-500;
        --slide-color-rgb: var(--warning-500-rgb, 249, 115, 22);
      }
    }

    /* TEXT COLUMN */
    &__text {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      font-family: @font-body;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--slide-color);
    }

    &__eyebrow-line {
      width: 32px;
      height: 1px;
      background: linear-gradient(90deg, var(--slide-color), transparent);
    }

    &__title {
      font-family: @font-display;
      font-size: 42px;
      font-weight: 600;
      line-height: 1.15;
      letter-spacing: -0.02em;
      color: @neutral-50;
      margin: 0;

      &-main {
        display: block;
        color: @neutral-100;
      }

      &-accent {
        display: block;
        background: linear-gradient(
          135deg,
          var(--slide-color) 0%,
          rgba(var(--slide-color-rgb), 0.7) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    &__description {
      font-family: @font-body;
      font-size: 15px;
      line-height: 1.7;
      color: @neutral-300;
      max-width: 480px;
      margin: 4px 0 8px;
    }

    &__stats {
      display: flex;
      gap: 32px;
      margin: 8px 0 16px;
      padding: 16px 0;
      border-top: 1px solid rgba(var(--neutral-300-rgb), 0.08);
      border-bottom: 1px solid rgba(var(--neutral-300-rgb), 0.08);
    }

    &__stat {
      display: flex;
      flex-direction: column;
      gap: 2px;

      &-value {
        font-family: @font-display;
        font-size: 24px;
        font-weight: 600;
        color: @neutral-50;
        letter-spacing: -0.02em;
      }
      &-label {
        font-family: @font-body;
        font-size: 11px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: @neutral-400;
      }
    }

    &__actions {
      display: flex;
      gap: 12px;
      margin-top: 4px;
    }

    &__btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 24px;
      border-radius: 12px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s @ease-smooth;

      svg {
        width: 18px;
        height: 18px;
        transition: transform 0.3s @ease-smooth;
      }

      &--primary {
        background: var(--slide-color);
        color: white;
        border: none;
        box-shadow:
          0 4px 16px rgba(var(--slide-color-rgb), 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);

        &:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 24px rgba(var(--slide-color-rgb), 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          svg {
            transform: translateX(4px);
          }
        }
      }

      &--secondary {
        background: rgba(var(--secondary-700-rgb), 0.5);
        color: @neutral-200;
        border: 1px solid rgba(var(--neutral-300-rgb), 0.12);
        backdrop-filter: blur(8px);

        &:hover {
          background: rgba(var(--secondary-600-rgb), 0.6);
          color: @neutral-50;
          transform: translateY(-2px);
        }
      }
    }

    &__disclaimer {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      font-family: @font-body;
      font-size: 11px;
      color: @neutral-500;

      svg {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
      }
    }

    /* MEDIA COLUMN */
    &__media {
      position: relative;
    }

    &__card {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.4s @ease-smooth;

      &:hover {
        transform: translateY(-8px) scale(1.02);
        .hero__card-glow {
          opacity: 1;
        }
        .hero__card-shine {
          transform: translateX(100%);
        }
        .hero__card-play {
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(var(--slide-color-rgb), 0.6);
        }
      }
    }

    &__card-glow {
      position: absolute;
      inset: -2px;
      background: linear-gradient(
        135deg,
        var(--slide-color) 0%,
        transparent 50%,
        var(--slide-color) 100%
      );
      border-radius: 22px;
      opacity: 0;
      transition: opacity 0.4s @ease-smooth;
      z-index: -1;
    }

    &__card-border {
      position: absolute;
      inset: 0;
      border-radius: 20px;
      padding: 1px;
      background: linear-gradient(
        135deg,
        rgba(var(--neutral-300-rgb), 0.2) 0%,
        rgba(var(--neutral-300-rgb), 0.05) 50%,
        rgba(var(--slide-color-rgb), 0.3) 100%
      );
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      z-index: 10;
    }

    &__card-image {
      position: relative;
      aspect-ratio: 16 / 10;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s @ease-smooth;
      }

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          transparent 0%,
          transparent 40%,
          rgba(var(--secondary-950-rgb), 0.95) 100%
        );
      }
    }

    &__card-shine {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.15) 50%,
        transparent 100%
      );
      transform: translateX(-100%);
      transition: transform 0.8s @ease-smooth;
      z-index: 5;
    }

    &__card-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 10;
    }

    &__card-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      align-self: flex-start;
      padding: 4px 10px;
      border-radius: 6px;
      background: rgba(var(--slide-color-rgb), 0.2);
      backdrop-filter: blur(8px);
      font-family: @font-body;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: @neutral-50;

      svg {
        width: 12px;
        height: 12px;
        fill: var(--slide-color);
      }
    }

    &__card-title {
      font-family: @font-display;
      font-size: 16px;
      font-weight: 600;
      color: @neutral-50;
      margin: 0;
      line-height: 1.3;
    }

    &__card-cta {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 500;
      color: @neutral-300;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    &__card-play {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--slide-color);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s @ease-smooth;
      box-shadow: 0 0 20px rgba(var(--slide-color-rgb), 0.4);

      svg {
        width: 14px;
        height: 14px;
        fill: white;
        margin-left: 2px;
      }
    }

    &__molecule {
      position: absolute;
      top: -40px;
      right: -40px;
      width: 160px;
      height: 160px;
      color: var(--slide-color);
      opacity: 0.2;
      animation: rotate 30s linear infinite;
      pointer-events: none;

      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }

    /* PROGRESS */
    &__progress {
      display: flex;
      gap: 8px;
      margin-top: 28px;
      justify-content: center;
    }

    &__progress-item {
      width: 48px;
      height: 3px;
      background: rgba(var(--neutral-300-rgb), 0.1);
      border-radius: 2px;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s @ease-smooth;
      padding: 0;
      border: none;

      &:hover {
        background: rgba(var(--neutral-300-rgb), 0.2);
      }

      &--success {
        --progress-color: @success-500;
      }
      &--primary {
        --progress-color: var(--primary-500);
      }
      &--warning {
        --progress-color: @warning-500;
      }

      &--active {
        width: 72px;
        .hero__progress-fill {
          animation: progress 9s linear forwards;
        }
      }
    }

    &__progress-bar {
      display: block;
      width: 100%;
      height: 100%;
      background: transparent;
      border-radius: 2px;
      overflow: hidden;
    }

    &__progress-fill {
      display: block;
      width: 0;
      height: 100%;
      background: var(--progress-color, @neutral-300);
      border-radius: 2px;

      @keyframes progress {
        from {
          width: 0;
        }
        to {
          width: 100%;
        }
      }
    }
  }

  /* MODAL */
  .hero-modal {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;

    &__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(var(--secondary-1000-rgb), 0.9);
      backdrop-filter: blur(12px);
    }

    &__content {
      position: relative;
      width: 100%;
      max-width: 1100px;
      aspect-ratio: 16 / 9;
      border-radius: 20px;
      overflow: hidden;
      background: var(--secondary-1000);
      box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);

      iframe {
        width: 100%;
        height: 100%;
      }
    }

    &__close {
      position: absolute;
      top: -50px;
      right: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(var(--neutral-100-rgb), 0.1);
      border: 1px solid rgba(var(--neutral-100-rgb), 0.2);
      color: @neutral-50;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;

      svg {
        width: 20px;
        height: 20px;
      }

      &:hover {
        background: rgba(var(--neutral-100-rgb), 0.2);
        transform: rotate(90deg);
      }
    }
  }

  /* TRANSITIONS */
  .slide-content-enter-active {
    transition: all 0.6s @ease-smooth;
  }
  .slide-content-leave-active {
    transition: all 0.4s @ease-smooth;
    position: absolute;
  }
  .slide-content-enter-from {
    opacity: 0;
    transform: translateX(40px);
  }
  .slide-content-leave-to {
    opacity: 0;
    transform: translateX(-40px);
  }

  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.4s ease;
  }
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }

  .modal-content-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .modal-content-leave-active {
    transition: all 0.3s ease;
  }
  .modal-content-enter-from,
  .modal-content-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }

  /* RESPONSIVE */
  @media (max-width: 1100px) {
    .hero {
      &__slide-inner {
        grid-template-columns: 1fr 360px;
        gap: 40px;
      }
      &__title {
        font-size: 36px;
      }
    }
  }

  @media (max-width: 900px) {
    .hero {
      min-height: auto;
      &__container {
        padding: 24px;
        min-height: auto;
      }
      &__nav {
        flex-wrap: wrap;
      }
      &__slide-inner {
        grid-template-columns: 1fr;
        gap: 32px;
      }
      &__media {
        order: -1;
      }
      &__card {
        max-width: 400px;
      }
      &__molecule {
        display: none;
      }
      &__stats {
        gap: 24px;
      }
    }
  }

  @media (max-width: 600px) {
    .hero {
      --hero-radius: 16px;
      &__container {
        padding: 20px 16px;
      }
      &__nav-item {
        padding: 8px 14px 8px 10px;
        font-size: 12px;
      }
      &__nav-icon {
        width: 24px;
        height: 24px;
        svg {
          width: 14px;
          height: 14px;
        }
      }
      &__title {
        font-size: 28px;
      }
      &__description {
        font-size: 14px;
      }
      &__stats {
        gap: 16px;
      }
      &__stat-value {
        font-size: 20px;
      }
      &__actions {
        flex-direction: column;
      }
      &__btn {
        width: 100%;
        justify-content: center;
      }
    }

    .hero-modal {
      padding: 20px;
      &__close {
        top: -44px;
      }
    }
  }
</style>
