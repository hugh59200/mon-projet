<template>
  <!-- VERSION MOBILE : Design immersif plein écran -->
  <div
    v-if="isMobile && activeSlide"
    class="category-mobile"
    :class="`category-mobile--${activeSlide.variant}`"
  >
    <!-- Image de fond plein écran -->
    <div
      class="category-mobile__bg"
      :style="{ backgroundImage: `url(${activeSlide.bgImage})` }"
    ></div>
    <div class="category-mobile__overlay"></div>

    <!-- Contenu -->
    <div class="category-mobile__content">
      <!-- Header avec titre (en haut) -->
      <div class="category-mobile__header">
        <span class="category-mobile__eyebrow">{{ activeSlide.eyebrow }}</span>
        <h2 class="category-mobile__title">{{ activeSlide.titleAccent }}</h2>
        <p class="category-mobile__desc">{{ activeSlide.description }}</p>
      </div>

      <!-- Partie basse -->
      <div class="category-mobile__bottom">
        <!-- Navigation catégories -->
        <div class="category-mobile__nav-scroll">
          <div class="category-mobile__nav">
            <button
              v-for="(slide, i) in slides"
              :key="slide.id"
              class="category-mobile__nav-item"
              :class="[
                `category-mobile__nav-item--${slide.variant}`,
                { active: i === activeIndex }
              ]"
              @click="goToSlide(i)"
            >
              <span class="category-mobile__nav-icon">
                <component :is="slide.icon" />
              </span>
              <span class="category-mobile__nav-label">{{ slide.label }}</span>
            </button>
          </div>
        </div>

        <!-- Actions (tout en bas) -->
        <div class="category-mobile__actions">
          <PremiumButton
            type="primary"
            variant="solid"
            size="md"
            :label="t('home.categories.common.explore')"
            icon-right="ArrowRight"
            class="category-mobile__cta"
            @click="goToCategory(activeSlide)"
          />
          <PremiumButton
            type="secondary"
            variant="outline"
            size="md"
            icon-left="Play"
            class="category-mobile__video-btn"
            @click="openVideo(activeSlide)"
          />
        </div>

      </div>
    </div>

    <!-- Modal vidéo -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="activeVideo"
          class="video-modal"
          @click="closeModal"
        >
          <div class="video-modal__content" @click.stop>
            <iframe
              :src="`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
            ></iframe>
            <button class="video-modal__close-btn" @click="closeModal">
              <BasicIconNext name="X" :size="20" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>

  <!-- VERSION DESKTOP : Carousel complet -->
  <section
    v-else
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
                  <span>{{ slide.titleMain }}</span>
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
                  <PremiumButton
                    type="primary"
                    variant="solid"
                    size="md"
                    :label="`${t('home.categories.common.explore')} ${slide.label}`"
                    icon-right="ArrowRight"
                    :shine="true"
                    :glow="true"
                    @click="goToCategory(slide)"
                  />
                  <PremiumButton
                    type="white"
                    variant="ghost"
                    size="md"
                    :label="t('home.cta.buttons.catalogue')"
                    @click="goToCatalogue"
                  />
                </div>
                <p class="category-hero__disclaimer">
                  ℹ️ {{ t('home.disclaimer.text') }}
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
                      @error="handleImageError"
                    />
                    <div class="category-hero__card-shine"></div>
                  </div>
                  <div class="category-hero__card-content">
                    <span class="category-hero__card-badge">▶ {{ t('home.banner.carousel.guides') }}</span>
                    <h3>{{ slide.videoLabel }}</h3>
                    <span class="category-hero__card-play">
                      <BasicIconNext name="Play" :size="24" />
                    </span>
                  </div>
                </div>
                <div class="category-hero__molecule">
                  <BasicIconNext name="molecule" />
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
          <span
            :style="{ animationDuration: i === activeIndex ? `${autoplayDuration}ms` : '0s' }"
          ></span>
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
            <PremiumButton
              type="secondary"
              variant="solid"
              size="md"
              icon-left="X"
              class="video-modal__close"
              @click="closeModal"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint/DeviceBreakpoint.types'
  import { computed, h, onBeforeUnmount, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const { isMobile } = useDeviceBreakpoint()

  const { t } = useI18n()

  // ═══════════════════════════════════════════════════════════════
  // ICONS (Composants SVG inline)
  // ═══════════════════════════════════════════════════════════════

  // Perte de poids / Métabolisme
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

  // Bien-être
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

  // Performance
  const PerformanceIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [h('path', { d: 'M13 10V3L4 14h7v7l9-11h-7z' })],
    )

  // Récupération
  const RecoveryIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('path', {
          d: 'M4.5 12.75l6 6 9-13.5',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        }),
      ],
    )

  // Croissance
  const GrowthIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('path', {
          d: 'M2 20h.01M7 20v-4M12 20v-8M17 20v-6M22 20v-10',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        }),
      ],
    )

  // Anti-âge
  const AntiAgingIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('circle', { cx: '12', cy: '12', r: '10' }),
        h('path', { d: 'M12 6v6l4 2', 'stroke-linecap': 'round' }),
      ],
    )

  // Nootropique
  const NootropicIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('path', {
          d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        }),
      ],
    )

  // Cosmétique
  const CosmeticIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('path', {
          d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        }),
      ],
    )

  // Santé / Immunité
  const HealthIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('path', {
          d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        }),
      ],
    )

  // Hormonal
  const HormonalIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [
        h('circle', { cx: '12', cy: '8', r: '5' }),
        h('path', { d: 'M12 13v8M9 18h6', 'stroke-linecap': 'round' }),
      ],
    )

  // ═══════════════════════════════════════════════════════════════
  // CONFIGURATION
  // ═══════════════════════════════════════════════════════════════

  const router = useRouter()
  const autoplayDuration = 9000

  type SlideVariant =
    | 'success'
    | 'primary'
    | 'warning'
    | 'info'
    | 'purple'
    | 'pink'
    | 'teal'
    | 'orange'
    | 'indigo'
    | 'emerald'

  type Slide = {
    id: string
    label: string
    category: string // Nom exact de la catégorie pour le filtre
    eyebrow: string
    titleMain: string
    titleAccent: string
    description: string
    youtubeId: string
    videoLabel: string
    variant: SlideVariant
    bgImage: string
    icon: ReturnType<typeof h>
    stats: { value: string; label: string }[]
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDES DATA - Toutes les catégories de Fast Peptides
  // ═══════════════════════════════════════════════════════════════

  const slides = computed<Slide[]>(() => [
    // 1. Perte de poids (Semaglutide, Tirzepatide, Retatrutide)
    {
      id: 'weight-loss',
      label: t('home.categories.weightLoss.label'),
      category: 'Perte de poids', // Clé française pour le filtrage
      eyebrow: t('home.categories.weightLoss.eyebrow'),
      titleMain: t('home.categories.common.research'),
      titleAccent: t('home.categories.weightLoss.label'),
      description: t('home.categories.weightLoss.description'),
      youtubeId: '5OjqLrbuA8Y',
      videoLabel: t('home.categories.weightLoss.videoLabel'),
      variant: 'success',
      bgImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80',
      icon: MetabolismIcon(),
      stats: [
        { value: t('home.categories.stats.stat1Value'), label: t('home.categories.weightLoss.stat1Label') },
        { value: t('home.categories.stats.stat2Value'), label: t('home.categories.weightLoss.stat2Label') },
      ],
    },

    // 2. Récupération (BPC-157, TB-500)
    {
      id: 'recovery',
      label: t('home.categories.recovery.label'),
      category: 'Récupération', // Clé française pour le filtrage
      eyebrow: t('home.categories.recovery.eyebrow'),
      titleMain: t('home.categories.common.research'),
      titleAccent: t('home.categories.recovery.label'),
      description: t('home.categories.recovery.description'),
      youtubeId: 'qKHknxLvsDY',
      videoLabel: t('home.categories.recovery.videoLabel'),
      variant: 'emerald',
      bgImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&q=80',
      icon: RecoveryIcon(),
      stats: [
        { value: t('home.categories.stats.stat1Value'), label: t('home.categories.recovery.stat1Label') },
        { value: t('home.categories.stats.stat2Value'), label: t('home.categories.recovery.stat2Label') },
      ],
    },

    // 3. Croissance (CJC-1295 DAC, GHRP-6, Hexarelin)
    {
      id: 'growth',
      label: t('home.categories.growth.label'),
      category: 'Croissance', // Clé française pour le filtrage
      eyebrow: t('home.categories.growth.eyebrow'),
      titleMain: t('home.categories.common.research'),
      titleAccent: t('home.categories.growth.label'),
      description: t('home.categories.growth.description'),
      youtubeId: 'e4V55I45uO8',
      videoLabel: t('home.categories.growth.videoLabel'),
      variant: 'info',
      bgImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',
      icon: GrowthIcon(),
      stats: [
        { value: t('home.categories.stats.stat1Value'), label: t('home.categories.growth.stat1Label') },
        { value: t('home.categories.stats.stat2Value'), label: t('home.categories.growth.stat2Label') },
      ],
    },

    // 4. Anti-âge (Sermorelin, NAD+)
    {
      id: 'anti-aging',
      label: t('home.categories.antiAging.label'),
      category: 'Anti-âge', // Clé française pour le filtrage
      eyebrow: t('home.categories.antiAging.eyebrow'),
      titleMain: t('home.categories.common.research'),
      titleAccent: t('home.categories.antiAging.label'),
      description: t('home.categories.antiAging.description'),
      youtubeId: 'QRt7LjqJ45k',
      videoLabel: t('home.categories.antiAging.videoLabel'),
      variant: 'purple',
      bgImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1600&q=80',
      icon: AntiAgingIcon(),
      stats: [
        { value: t('home.categories.stats.stat1Value'), label: t('home.categories.antiAging.stat1Label') },
        { value: t('home.categories.stats.stat2Value'), label: t('home.categories.antiAging.stat2Label') },
      ],
    },

    // 5. Performance (PEG-MGF)
    {
      id: 'performance',
      label: t('home.categories.performance.label'),
      category: 'Performance', // Clé française pour le filtrage
      eyebrow: t('home.categories.performance.eyebrow'),
      titleMain: t('home.categories.common.research'),
      titleAccent: t('home.categories.performance.label'),
      description: t('home.categories.performance.description'),
      youtubeId: 'LNV0CMCAFMs',
      videoLabel: t('home.categories.performance.videoLabel'),
      variant: 'warning',
      bgImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80',
      icon: PerformanceIcon(),
      stats: [
        { value: t('home.categories.stats.stat1Value'), label: t('home.categories.performance.stat1Label') },
        { value: t('home.categories.stats.stat2Value'), label: t('home.categories.performance.stat2Label') },
      ],
    },

    // 6. Bien-être (Melanotan 2, PT-141)
    {
      id: 'wellbeing',
      label: t('home.categories.wellbeing.label'),
      category: 'Bien-être', // Clé française pour le filtrage
      eyebrow: t('home.categories.wellbeing.eyebrow'),
      titleMain: t('home.categories.common.research'),
      titleAccent: t('home.categories.wellbeing.label'),
      description: t('home.categories.wellbeing.description'),
      youtubeId: 'csSW4whR9vc',
      videoLabel: t('home.categories.wellbeing.videoLabel'),
      variant: 'primary',
      bgImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1600&q=80',
      icon: WellbeingIcon(),
      stats: [
        { value: t('home.categories.stats.stat1Value'), label: t('home.categories.wellbeing.stat1Label') },
        { value: t('home.categories.stats.stat2Value'), label: t('home.categories.wellbeing.stat2Label') },
      ],
    },

    // 7. Nootropique (Selank, Semax)
    {
      id: 'nootropic',
      label: t('home.categories.nootropic.label'),
      category: 'Nootropique', // Clé française pour le filtrage
      eyebrow: t('home.categories.nootropic.eyebrow'),
      titleMain: t('home.categories.common.research'),
      titleAccent: t('home.categories.nootropic.label'),
      description: t('home.categories.nootropic.description'),
      youtubeId: 'p3GOtQmPPFo',
      videoLabel: t('home.categories.nootropic.videoLabel'),
      variant: 'teal',
      bgImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600&q=80',
      icon: NootropicIcon(),
      stats: [
        { value: t('home.categories.stats.stat1Value'), label: t('home.categories.nootropic.stat1Label') },
        { value: t('home.categories.stats.stat2Value'), label: t('home.categories.nootropic.stat2Label') },
      ],
    },

    // 8. Cosmétique (GHK-Cu)
    {
      id: 'cosmetic',
      label: t('home.categories.cosmetic.label'),
      category: t('home.categories.cosmetic.label'),
      eyebrow: t('home.categories.cosmetic.eyebrow'),
      titleMain: t('home.categories.common.research'),
      titleAccent: t('home.categories.cosmetic.label'),
      description: t('home.categories.cosmetic.description'),
      youtubeId: '5pAWczByUyg',
      videoLabel: t('home.categories.cosmetic.videoLabel'),
      variant: 'pink',
      bgImage: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1600&q=80',
      icon: CosmeticIcon(),
      stats: [
        { value: t('home.categories.stats.stat1Value'), label: t('home.categories.cosmetic.stat1Label') },
        { value: t('home.categories.stats.stat2Value'), label: t('home.categories.cosmetic.stat2Label') },
      ],
    },

    // 9. Santé / Immunité (Thymosin Alpha-1)
    {
      id: 'health',
      label: t('home.categories.health.label'),
      category: t('home.categories.health.label'),
      eyebrow: t('home.categories.health.eyebrow'),
      titleMain: t('home.categories.common.research'),
      titleAccent: t('home.categories.health.label'),
      description: t('home.categories.health.description'),
      youtubeId: 'xLORsLlcT48',
      videoLabel: t('home.categories.health.videoLabel'),
      variant: 'emerald',
      bgImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80',
      icon: HealthIcon(),
      stats: [
        { value: t('home.categories.stats.stat1Value'), label: t('home.categories.health.stat1Label') },
        { value: t('home.categories.stats.stat2Value'), label: t('home.categories.health.stat2Label') },
      ],
    },

    // 10. Hormonal (Kisspeptine-10)
    {
      id: 'hormonal',
      label: t('home.categories.hormonal.label'),
      category: t('home.categories.hormonal.label'),
      eyebrow: t('home.categories.hormonal.eyebrow'),
      titleMain: t('home.categories.common.research'),
      titleAccent: t('home.categories.hormonal.label'),
      description: t('home.categories.hormonal.description'),
      youtubeId: '_3kmSsmQiRU',
      videoLabel: t('home.categories.hormonal.videoLabel'),
      variant: 'indigo',
      bgImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600&q=80',
      icon: HormonalIcon(),
      stats: [
        { value: t('home.categories.stats.stat1Value'), label: t('home.categories.hormonal.stat1Label') },
        { value: t('home.categories.stats.stat2Value'), label: t('home.categories.hormonal.stat2Label') },
      ],
    },
  ])

  // ═══════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════

  const activeIndex = ref(0)
  const activeVideo = ref<string | null>(null)
  const heroSection = ref<HTMLElement | null>(null)
  const isHeroVisible = ref(true)

  // Computed pour le slide actif (avec vérification undefined)
  const activeSlide = computed(() => slides.value[activeIndex.value])
  let autoplayTimer: number | null = null
  let observer: IntersectionObserver | null = null

  // ═══════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════

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
    // Utilise le nom exact de la catégorie encodé
    router.push({ path: '/catalogue', query: { categories: slide.category } })
  }

  function handleImageError(event: Event) {
    // Fallback si la miniature YouTube n'existe pas
    const img = event.target as HTMLImageElement
    img.src = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80'
  }

  // ═══════════════════════════════════════════════════════════════
  // AUTOPLAY
  // ═══════════════════════════════════════════════════════════════

  function startAutoplay() {
    if (autoplayTimer || !isHeroVisible.value) return
    autoplayTimer = window.setInterval(() => {
      activeIndex.value = (activeIndex.value + 1) % slides.value.length
    }, autoplayDuration)
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

  // ═══════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════

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
    } else {
      startAutoplay()
    }
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
    position: relative;
    min-height: 520px;
    border-radius: inherit;
    overflow: hidden;
    background: linear-gradient(135deg, var(--secondary-600), var(--secondary-600));

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
      transition: opacity 1.2s @ease;
      &.active {
        opacity: 1;
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

    // Nav - Scrollable horizontally
    &__nav {
      display: flex;
      gap: 8px;
      margin-bottom: 32px;
      overflow-x: auto;
      padding-bottom: 8px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }
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
      white-space: nowrap;
      flex-shrink: 0;

      // Variants
      &--success {
        --nav-color: var(--success-500);
        --nav-color-rgb: var(--success-500-rgb);
      }
      &--primary {
        --nav-color: var(--primary-500);
        --nav-color-rgb: var(--primary-500-rgb);
      }
      &--warning {
        --nav-color: var(--warning-500);
        --nav-color-rgb: var(--warning-500-rgb);
      }
      &--info {
        --nav-color: #3b82f6;
        --nav-color-rgb: 59, 130, 246;
      }
      &--purple {
        --nav-color: #8b5cf6;
        --nav-color-rgb: 139, 92, 246;
      }
      &--pink {
        --nav-color: #ec4899;
        --nav-color-rgb: 236, 72, 153;
      }
      &--teal {
        --nav-color: #14b8a6;
        --nav-color-rgb: 20, 184, 166;
      }
      &--orange {
        --nav-color: var(--warning-500);
        --nav-color-rgb: var(--warning-500-rgb);
      }
      &--indigo {
        --nav-color: #6366f1;
        --nav-color-rgb: 99, 102, 241;
      }
      &--emerald {
        --nav-color: #10b981;
        --nav-color-rgb: 16, 185, 129;
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

    // Slide Variants
    &__slide--success {
      --slide-color: var(--success-500);
      --slide-color-rgb: var(--success-500-rgb);
    }
    &__slide--primary {
      --slide-color: var(--primary-500);
      --slide-color-rgb: var(--primary-500-rgb);
    }
    &__slide--warning {
      --slide-color: var(--warning-500);
      --slide-color-rgb: var(--warning-500-rgb);
    }
    &__slide--info {
      --slide-color: #3b82f6;
      --slide-color-rgb: 59, 130, 246;
    }
    &__slide--purple {
      --slide-color: #8b5cf6;
      --slide-color-rgb: 139, 92, 246;
    }
    &__slide--pink {
      --slide-color: #ec4899;
      --slide-color-rgb: 236, 72, 153;
    }
    &__slide--teal {
      --slide-color: #14b8a6;
      --slide-color-rgb: 20, 184, 166;
    }
    &__slide--orange {
      --slide-color: var(--warning-500);
      --slide-color-rgb: var(--warning-500-rgb);
    }
    &__slide--indigo {
      --slide-color: #6366f1;
      --slide-color-rgb: 99, 102, 241;
    }
    &__slide--emerald {
      --slide-color: #10b981;
      --slide-color-rgb: 16, 185, 129;
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
        background-clip: text;
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
        transform: translateY(-8px);
        .category-hero__card-glow {
          opacity: 1;
        }
        .category-hero__card-shine {
          transform: translateX(100%);
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
      flex-wrap: wrap;
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

      // Variants
      &--success {
        --prog-color: var(--success-500);
      }
      &--primary {
        --prog-color: var(--primary-500);
      }
      &--warning {
        --prog-color: var(--warning-500);
      }
      &--info {
        --prog-color: #3b82f6;
      }
      &--purple {
        --prog-color: #8b5cf6;
      }
      &--pink {
        --prog-color: #ec4899;
      }
      &--teal {
        --prog-color: #14b8a6;
      }
      &--orange {
        --prog-color: var(--warning-500);
      }
      &--indigo {
        --prog-color: #6366f1;
      }
      &--emerald {
        --prog-color: #10b981;
      }

      &:hover {
        background: rgba(var(--neutral-100-rgb), 0.2);
      }
      &.active {
        width: 72px;
        span {
          animation: progress linear forwards;
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

  // Responsive - Tablet
  .respond-tablet({
    .category-hero__slide-inner {
      grid-template-columns: 1fr 360px;
      gap: 40px;
    }
    .category-hero__title {
      font-size: 36px;
    }
    .category-hero {
      min-height: auto;
      &__container {
        padding: 24px;
        min-height: auto;
      }
      &__nav {
        flex-wrap: nowrap;
        -webkit-overflow-scrolling: touch;
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
  });

  // Responsive - Mobile (styles pour desktop carousel si jamais affiché)
  .respond-mobile({
    .category-hero {
      &__container {
        padding: 20px 16px;
      }
      &__nav-btn {
        padding: 10px 14px 10px 10px;
        font-size: 12px;
        min-height: 44px;
      }
      &__nav-icon {
        width: 28px;
        height: 28px;
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
        min-height: 44px;
      }
    }
    .video-modal {
      padding: 20px;
      &__close {
        top: -44px;
        width: 44px;
        height: 44px;
      }
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // VERSION MOBILE - Design immersif plein écran
  // ═══════════════════════════════════════════════════════════════

  .category-mobile {
    position: relative;
    min-height: 420px;
    display: flex;
    flex-direction: column;

    // Variants de couleur
    &--success { --accent-color: var(--success-500); --accent-color-rgb: var(--success-500-rgb); }
    &--primary { --accent-color: var(--primary-500); --accent-color-rgb: var(--primary-500-rgb); }
    &--warning { --accent-color: var(--warning-500); --accent-color-rgb: var(--warning-500-rgb); }
    &--info { --accent-color: #3b82f6; --accent-color-rgb: 59, 130, 246; }
    &--purple { --accent-color: #8b5cf6; --accent-color-rgb: 139, 92, 246; }
    &--pink { --accent-color: #ec4899; --accent-color-rgb: 236, 72, 153; }
    &--teal { --accent-color: #14b8a6; --accent-color-rgb: 20, 184, 166; }
    &--orange { --accent-color: var(--warning-500); --accent-color-rgb: var(--warning-500-rgb); }
    &--indigo { --accent-color: #6366f1; --accent-color-rgb: 99, 102, 241; }
    &--emerald { --accent-color: #10b981; --accent-color-rgb: 16, 185, 129; }

    // ─────────────────────────────────────────────────────────────
    // Background image plein écran
    // ─────────────────────────────────────────────────────────────
    &__bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transition: background-image 0.5s @ease;
    }

    &__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(var(--secondary-950-rgb), 0.8) 0%,
        rgba(var(--secondary-950-rgb), 0.4) 40%,
        rgba(var(--secondary-950-rgb), 0.7) 70%,
        rgba(var(--secondary-950-rgb), 0.95) 100%
      );
    }

    // ─────────────────────────────────────────────────────────────
    // Contenu
    // ─────────────────────────────────────────────────────────────
    &__content {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px 20px;
      gap: 20px;
    }

    &__header {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__bottom {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__eyebrow {
      font-family: @font-body;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent-color);
    }

    &__title {
      font-family: @font-display;
      font-size: 32px;
      font-weight: 700;
      line-height: 1.1;
      color: @neutral-50;
      margin: 0;
      background: linear-gradient(135deg, @neutral-50, var(--accent-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    &__desc {
      font-family: @font-body;
      font-size: 14px;
      line-height: 1.6;
      color: @neutral-300;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    // ─────────────────────────────────────────────────────────────
    // Actions (CTA + Video)
    // ─────────────────────────────────────────────────────────────
    &__actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    &__cta {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 20px;
      background: var(--accent-color);
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s @ease;

      span {
        font-family: @font-body;
        font-size: 15px;
        font-weight: 600;
        color: @neutral-50;
      }

      svg {
        color: @neutral-50;
        transition: transform 0.2s @ease;
      }

      &:active {
        transform: scale(0.98);
        svg { transform: translateX(4px); }
      }
    }

    &__video-btn {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(var(--neutral-100-rgb), 0.1);
      border: 1px solid rgba(var(--neutral-100-rgb), 0.2);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s @ease;

      svg {
        color: @neutral-50;
      }

      &:active {
        transform: scale(0.95);
        background: rgba(var(--accent-color-rgb), 0.2);
        border-color: var(--accent-color);
      }
    }

    // ─────────────────────────────────────────────────────────────
    // Navigation catégories (scroll horizontal en bas)
    // ─────────────────────────────────────────────────────────────
    &__nav-scroll {
      margin: 0 -20px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar { display: none; }
    }

    &__nav {
      display: inline-flex;
      gap: 8px;
      padding: 0 20px;
    }

    &__nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 12px 16px;
      background: rgba(var(--secondary-800-rgb), 0.6);
      border: 1px solid rgba(var(--neutral-100-rgb), 0.08);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s @ease;
      min-width: 72px;

      // Variants
      &--success { --item-color: var(--success-500); --item-color-rgb: var(--success-500-rgb); }
      &--primary { --item-color: var(--primary-500); --item-color-rgb: var(--primary-500-rgb); }
      &--warning { --item-color: var(--warning-500); --item-color-rgb: var(--warning-500-rgb); }
      &--info { --item-color: #3b82f6; --item-color-rgb: 59, 130, 246; }
      &--purple { --item-color: #8b5cf6; --item-color-rgb: 139, 92, 246; }
      &--pink { --item-color: #ec4899; --item-color-rgb: 236, 72, 153; }
      &--teal { --item-color: #14b8a6; --item-color-rgb: 20, 184, 166; }
      &--orange { --item-color: var(--warning-500); --item-color-rgb: var(--warning-500-rgb); }
      &--indigo { --item-color: #6366f1; --item-color-rgb: 99, 102, 241; }
      &--emerald { --item-color: #10b981; --item-color-rgb: 16, 185, 129; }

      &.active {
        background: rgba(var(--item-color-rgb), 0.15);
        border-color: rgba(var(--item-color-rgb), 0.4);

        .category-mobile__nav-icon {
          background: var(--item-color);
          svg { color: @neutral-50; }
        }
        .category-mobile__nav-label {
          color: @neutral-50;
        }
      }

      &:active {
        transform: scale(0.96);
      }
    }

    &__nav-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(var(--item-color-rgb), 0.2);
      border-radius: 8px;
      transition: all 0.2s @ease;

      svg {
        width: 18px;
        height: 18px;
        color: var(--item-color);
      }
    }

    &__nav-label {
      font-family: @font-body;
      font-size: 10px;
      font-weight: 500;
      color: @neutral-400;
      white-space: nowrap;
      transition: color 0.2s @ease;
    }

  }

  // Video modal close button for mobile
  .video-modal__close-btn {
    position: absolute;
    top: -44px;
    right: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(var(--neutral-100-rgb), 0.1);
    border: 1px solid rgba(var(--neutral-100-rgb), 0.2);
    color: @neutral-50;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(var(--neutral-100-rgb), 0.2);
    }
  }
</style>
