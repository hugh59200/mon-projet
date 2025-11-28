<template>
  <section
    class="category-hero"
    ref="heroSection"
    @mouseenter="pauseAutoplay"
    @mouseleave="resumeAutoplay"
  >
    <!-- Backgrounds -->
    <div class="category-hero__backgrounds">
      <div
        v-for="(slide, i) in slides"
        :key="`bg-${slide.id}`"
        class="category-hero__bg"
        :class="{ active: i === activeIndex }"
        :style="{ backgroundImage: `url(${slide.bgImage})` }"
      >
        <div class="category-hero__bg-overlay"></div>
      </div>
    </div>

    <!-- Decorative -->
    <div class="category-hero__grid"></div>
    <div class="category-hero__particles">
      <span
        v-for="n in 12"
        :key="n"
      ></span>
    </div>

    <!-- Content -->
    <div class="category-hero__container">
      <!-- Nav -->
      <nav class="category-hero__nav">
        <button
          v-for="(slide, i) in slides"
          :key="`nav-${slide.id}`"
          class="category-hero__nav-btn"
          :class="[{ active: i === activeIndex }, `category-hero__nav-btn--${slide.variant}`]"
          @click="goToSlide(i)"
        >
          <span class="category-hero__nav-icon"><component :is="slide.icon" /></span>
          <span>{{ slide.label }}</span>
        </button>
      </nav>

      <!-- Slides -->
      <div class="category-hero__content">
        <TransitionGroup
          name="slide"
          tag="div"
          class="category-hero__slides"
        >
          <article
            v-for="(slide, i) in slides"
            v-show="i === activeIndex"
            :key="slide.id"
            class="category-hero__slide"
            :class="`category-hero__slide--${slide.variant}`"
          >
            <div class="category-hero__slide-inner">
              <!-- Text -->
              <div class="category-hero__text">
                <span class="category-hero__eyebrow">
                  <span></span>
                  {{ slide.eyebrow }}
                </span>
                <h2 class="category-hero__title">
                  <span>{{ slide.titleMain }} {{ slide.titleAccent }}</span>
                  <span class="category-hero__title-accent">{{ slide.titleAccent }}</span>
                </h2>
                <p class="category-hero__desc">{{ slide.description }}</p>
                <div class="category-hero__stats">
                  <div
                    v-for="stat in slide.stats"
                    :key="stat.label"
                    class="category-hero__stat"
                  >
                    <strong>{{ stat.value }}</strong>
                    <span>{{ stat.label }}</span>
                  </div>
                </div>
                <div class="category-hero__actions">
                  <button
                    class="category-hero__btn category-hero__btn--primary"
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
                    class="category-hero__btn category-hero__btn--ghost"
                    @click="goToCatalogue"
                  >
                    Catalogue complet
                  </button>
                </div>
                <p class="category-hero__disclaimer">
                  ℹ️ Produits destinés exclusivement à la recherche scientifique
                </p>
              </div>

              <!-- Video Card -->
              <div class="category-hero__media">
                <div
                  class="category-hero__card"
                  @click="openVideo(slide)"
                >
                  <div class="category-hero__card-glow"></div>
                  <div class="category-hero__card-image">
                    <img
                      :src="`https://img.youtube.com/vi/${slide.youtubeId}/maxresdefault.jpg`"
                      :alt="slide.titleMain"
                      loading="lazy"
                    />
                    <div class="category-hero__card-shine"></div>
                  </div>
                  <div class="category-hero__card-content">
                    <span class="category-hero__card-badge">▶ Vidéo explicative</span>
                    <h3>{{ slide.videoLabel }}</h3>
                    <span class="category-hero__card-play">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div class="category-hero__molecule">
                  <svg
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="6"
                      fill="currentColor"
                      opacity="0.5"
                    />
                    <circle
                      cx="25"
                      cy="25"
                      r="4"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <circle
                      cx="75"
                      cy="25"
                      r="4"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <circle
                      cx="25"
                      cy="75"
                      r="4"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <circle
                      cx="75"
                      cy="75"
                      r="4"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <line
                      x1="50"
                      y1="50"
                      x2="25"
                      y2="25"
                      stroke="currentColor"
                      stroke-width="1"
                      opacity="0.2"
                    />
                    <line
                      x1="50"
                      y1="50"
                      x2="75"
                      y2="25"
                      stroke="currentColor"
                      stroke-width="1"
                      opacity="0.2"
                    />
                    <line
                      x1="50"
                      y1="50"
                      x2="25"
                      y2="75"
                      stroke="currentColor"
                      stroke-width="1"
                      opacity="0.2"
                    />
                    <line
                      x1="50"
                      y1="50"
                      x2="75"
                      y2="75"
                      stroke="currentColor"
                      stroke-width="1"
                      opacity="0.2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </article>
        </TransitionGroup>
      </div>

      <!-- Progress -->
      <div class="category-hero__progress">
        <button
          v-for="(slide, i) in slides"
          :key="`prog-${slide.id}`"
          class="category-hero__progress-btn"
          :class="[{ active: i === activeIndex }, `category-hero__progress-btn--${slide.variant}`]"
          @click="goToSlide(i)"
        >
          <span :style="{ animationDuration: i === activeIndex ? '9s' : '0s' }"></span>
        </button>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="activeVideo"
          class="video-modal"
          @click="closeModal"
        >
          <div
            class="video-modal__content"
            @click.stop
          >
            <iframe
              :src="`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
            ></iframe>
            <button
              class="video-modal__close"
              @click="closeModal"
            >
              ✕
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
  import { h, onBeforeUnmount, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

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

  type Slide = {
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

  const slides = ref<Slide[]>([
    {
      id: 'metabolism',
      label: 'Métabolisme',
      tag: 'Métabolisme',
      eyebrow: 'Voies métaboliques',
      titleMain: 'Peptides pour la recherche sur',
      titleAccent: 'le métabolisme',
      description:
        "Modulation des voies métaboliques, sensibilité à l'insuline et gestion de l'énergie sur modèles précliniques.",
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
      description: 'Étude des voies neurobiologiques et de la réponse au stress.',
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
      description: 'Exploration de la récupération et des adaptations physiologiques.',
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
  const activeVideo = ref<string | null>(null)
  const heroSection = ref<HTMLElement | null>(null)
  const isHeroVisible = ref(true)
  let autoplayTimer: number | null = null
  let observer: IntersectionObserver | null = null

  function goToSlide(i: number) {
    if (i !== activeIndex.value) {
      activeIndex.value = i
      restartAutoplay()
    }
  }
  function openVideo(slide: Slide) {
    activeVideo.value = slide.youtubeId
    document.body.style.overflow = 'hidden'
  }
  function closeModal() {
    activeVideo.value = null
    document.body.style.overflow = ''
  }
  function goToCatalogue() {
    router.push('/catalogue')
  }
  function goToCategory(slide: Slide) {
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
      clearInterval(autoplayTimer)
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
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.target === heroSection.value) {
              isHeroVisible.value = e.isIntersecting
              e.isIntersecting ? startAutoplay() : stopAutoplay()
            }
          })
        },
        { threshold: 0.25 },
      )
      observer.observe(heroSection.value)
    } else startAutoplay()
  })

  onBeforeUnmount(() => {
    stopAutoplay()
    if (observer && heroSection.value) {
      observer.unobserve(heroSection.value)
      observer.disconnect()
    }
  })
</script>

<style scoped lang="less">
  @font-display:
    'Instrument Sans',
    -apple-system,
    sans-serif;
  @font-body:
    'Inter',
    -apple-system,
    sans-serif;
  @ease: cubic-bezier(0.16, 1, 0.3, 1);

  .category-hero {
    --radius: 24px;
    position: relative;
    min-height: 520px;
    border-radius: var(--radius);
    overflow: hidden;
    background: linear-gradient(135deg, var(--secondary-600), var(--secondary-600));

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: var(--radius);
      padding: 1px;
      background: linear-gradient(
        135deg,
        rgba(var(--neutral-100-rgb), 0.1),
        rgba(var(--neutral-100-rgb), 0.05)
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

    // Backgrounds
    &__backgrounds {
      position: absolute;
      inset: 0;
    }
    &__bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transform: scale(1.05);
      transition:
        opacity 1.2s @ease,
        transform 8s @ease;
      &.active {
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
          transparent,
          rgba(var(--secondary-950-rgb), 0.5)
        ),
        linear-gradient(
          90deg,
          rgba(var(--secondary-950-rgb), 0.92),
          rgba(var(--secondary-950-rgb), 0.6) 50%,
          transparent
        ),
        linear-gradient(180deg, transparent 60%, rgba(var(--secondary-950-rgb), 0.8));
    }

    // Decorative
    &__grid {
      position: absolute;
      inset: 0;
      z-index: 1;
      background-image:
        linear-gradient(rgba(var(--primary-500-rgb), 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--primary-500-rgb), 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 60% 50% at 30% 50%, black, transparent 70%);
      pointer-events: none;
    }

    &__particles {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      overflow: hidden;
      span {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(var(--primary-400-rgb), 0.25);
        border-radius: 50%;
        animation: float 20s infinite ease-in-out;
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0;
          }
          10%,
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh);
          }
        }
        &:nth-child(1) {
          left: 10%;
          animation-delay: 0s;
        }
        &:nth-child(2) {
          left: 20%;
          animation-delay: 2s;
        }
        &:nth-child(3) {
          left: 30%;
          animation-delay: 4s;
        }
        &:nth-child(4) {
          left: 40%;
          animation-delay: 1s;
        }
        &:nth-child(5) {
          left: 50%;
          animation-delay: 3s;
        }
        &:nth-child(6) {
          left: 60%;
          animation-delay: 5s;
        }
        &:nth-child(7) {
          left: 70%;
          animation-delay: 2.5s;
        }
        &:nth-child(8) {
          left: 80%;
          animation-delay: 0.5s;
        }
        &:nth-child(9) {
          left: 15%;
          animation-delay: 6s;
        }
        &:nth-child(10) {
          left: 45%;
          animation-delay: 7s;
        }
        &:nth-child(11) {
          left: 75%;
          animation-delay: 4.5s;
        }
        &:nth-child(12) {
          left: 90%;
          animation-delay: 1.5s;
        }
      }
    }

    // Container
    &__container {
      position: relative;
      z-index: 5;
      max-width: 1320px;
      margin: 0 auto;
      padding: 24px 40px 28px;
      display: flex;
      flex-direction: column;
      min-height: 520px;
    }

    // Nav
    &__nav {
      display: flex;
      gap: 8px;
      margin-bottom: 32px;
    }
    &__nav-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 20px 10px 14px;
      border-radius: 100px;
      background: rgba(var(--secondary-700-rgb), 0.5);
      border: 1px solid rgba(var(--neutral-100-rgb), 0.08);
      color: @neutral-400;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s @ease;
      &--success {
        --nav-color: @success-500;
      }
      &--primary {
        --nav-color: var(--primary-500);
      }
      &--warning {
        --nav-color: @warning-500;
      }
      &:hover {
        background: rgba(var(--secondary-600-rgb), 0.6);
        color: @neutral-200;
      }
      &.active {
        background: rgba(var(--nav-color-rgb), 0.15);
        border-color: rgba(var(--nav-color-rgb), 0.3);
        color: @neutral-50;
        .category-hero__nav-icon {
          background: var(--nav-color);
          color: @neutral-50;
          box-shadow: 0 0 16px rgba(var(--nav-color-rgb), 0.4);
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
      color: var(--nav-color);
      transition: all 0.3s @ease;
      svg {
        width: 16px;
        height: 16px;
      }
    }

    // Content
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

    // Variants
    &__slide--success {
      --slide-color: @success-500;
    }
    &__slide--primary {
      --slide-color: var(--primary-500);
    }
    &__slide--warning {
      --slide-color: @warning-500;
    }

    // Text
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
      span {
        width: 32px;
        height: 1px;
        background: linear-gradient(90deg, var(--slide-color), transparent);
      }
    }
    &__title {
      font-family: @font-display;
      font-size: 42px;
      font-weight: 600;
      line-height: 1.15;
      letter-spacing: -0.02em;
      color: @neutral-50;
      margin: 0;
      span {
        display: block;
        &:first-child {
          color: @neutral-100;
        }
      }
      &-accent {
        background: linear-gradient(135deg, var(--slide-color), rgba(var(--slide-color-rgb), 0.7));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    &__desc {
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
      border-top: 1px solid rgba(var(--neutral-100-rgb), 0.08);
      border-bottom: 1px solid rgba(var(--neutral-100-rgb), 0.08);
    }
    &__stat {
      display: flex;
      flex-direction: column;
      gap: 2px;
      strong {
        font-family: @font-display;
        font-size: 24px;
        font-weight: 600;
        color: @neutral-50;
      }
      span {
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
      border: none;
      transition: all 0.3s @ease;
      svg {
        width: 18px;
        height: 18px;
        transition: transform 0.3s @ease;
      }
      &--primary {
        background: var(--slide-color);
        color: @neutral-50;
        box-shadow: 0 4px 16px rgba(var(--slide-color-rgb), 0.3);
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(var(--slide-color-rgb), 0.4);
          svg {
            transform: translateX(4px);
          }
        }
      }
      &--ghost {
        background: rgba(var(--secondary-700-rgb), 0.5);
        color: @neutral-200;
        border: 1px solid rgba(var(--neutral-100-rgb), 0.12);
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
    }

    // Media
    &__media {
      position: relative;
    }
    &__card {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.4s @ease;
      &:hover {
        transform: translateY(-8px) scale(1.02);
        .category-hero__card-glow {
          opacity: 1;
        }
        .category-hero__card-shine {
          transform: translateX(100%);
        }
        .category-hero__card-play {
          transform: scale(1.1);
        }
      }
      &-glow {
        position: absolute;
        inset: -2px;
        background: linear-gradient(
          135deg,
          var(--slide-color),
          transparent 50%,
          var(--slide-color)
        );
        border-radius: 22px;
        opacity: 0;
        transition: opacity 0.4s @ease;
        z-index: -1;
      }
      &-image {
        position: relative;
        aspect-ratio: 16 / 10;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s @ease;
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
      &-shine {
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
        transform: translateX(-100%);
        transition: transform 0.8s @ease;
        z-index: 5;
      }
      &-content {
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
      &-badge {
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
      }
      h3 {
        font-family: @font-display;
        font-size: 16px;
        font-weight: 600;
        color: @neutral-50;
        margin: 0;
        line-height: 1.3;
      }
      &-play {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--slide-color);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s @ease;
        box-shadow: 0 0 20px rgba(var(--slide-color-rgb), 0.4);
        position: absolute;
        right: 20px;
        bottom: 20px;
        svg {
          width: 18px;
          height: 18px;
          fill: @neutral-50;
          margin-left: 2px;
        }
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

    // Progress
    &__progress {
      display: flex;
      gap: 8px;
      margin-top: 28px;
      justify-content: center;
    }
    &__progress-btn {
      width: 48px;
      height: 3px;
      background: rgba(var(--neutral-100-rgb), 0.1);
      border-radius: 2px;
      cursor: pointer;
      overflow: hidden;
      padding: 0;
      border: none;
      transition: all 0.3s @ease;
      &--success {
        --prog-color: @success-500;
      }
      &--primary {
        --prog-color: var(--primary-500);
      }
      &--warning {
        --prog-color: @warning-500;
      }
      &:hover {
        background: rgba(var(--neutral-100-rgb), 0.2);
      }
      &.active {
        width: 72px;
        span {
          animation: progress 9s linear forwards;
        }
      }
      span {
        display: block;
        width: 0;
        height: 100%;
        background: var(--prog-color, @neutral-300);
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
  }

  // Modal
  .video-modal {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(12px);
    &__content {
      position: relative;
      width: 100%;
      max-width: 1100px;
      aspect-ratio: 16 / 9;
      border-radius: 20px;
      overflow: hidden;
      background: #000;
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
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        background: rgba(var(--neutral-100-rgb), 0.2);
        transform: rotate(90deg);
      }
    }
  }

  // Transitions
  .slide-enter-active {
    transition: all 0.6s @ease;
  }
  .slide-leave-active {
    transition: all 0.4s @ease;
    position: absolute;
  }
  .slide-enter-from {
    opacity: 0;
    transform: translateX(40px);
  }
  .slide-leave-to {
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

  // Responsive
  @media (max-width: 1100px) {
    .category-hero__slide-inner {
      grid-template-columns: 1fr 360px;
      gap: 40px;
    }
    .category-hero__title {
      font-size: 36px;
    }
  }

  @media (max-width: 900px) {
    .category-hero {
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
    .category-hero {
      --radius: 16px;
      &__container {
        padding: 20px 16px;
      }
      &__nav-btn {
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
      &__desc {
        font-size: 14px;
      }
      &__stats {
        gap: 16px;
      }
      &__stat strong {
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
    .video-modal {
      padding: 20px;
      &__close {
        top: -44px;
      }
    }
  }
</style>
