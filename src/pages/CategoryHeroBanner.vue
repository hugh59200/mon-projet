<template>
  <section
    class="category-hero"
    ref="heroSection"
  >
    <!-- BG qui couvre TOUT le conteneur (tags compris) -->
    <div
      class="category-hero__bg"
      :style="bgStyle"
    ></div>

    <!-- Petites pastilles catégorie -->
    <div class="category-hero__nav">
      <button
        v-for="(slide, index) in slides"
        :key="slide.id"
        type="button"
        class="category-hero__nav-pill"
        :class="{ 'category-hero__nav-pill--active': index === activeIndex }"
        @click="goToSlide(index)"
      >
        {{ slide.label }}
      </button>
    </div>

    <!-- Fade subtil entre les tags et le contenu -->
    <div class="category-hero__top-fade"></div>

    <!-- Viewport horizontal -->
    <div
      class="category-hero__viewport"
      @mouseenter="pauseAutoplay"
      @mouseleave="resumeAutoplay"
    >
      <div
        class="category-hero__track"
        :style="trackStyle"
      >
        <article
          v-for="slide in slides"
          :key="slide.id"
          class="category-hero__slide"
          :style="{ '--accent': slide.accent }"
        >
          <div class="category-hero__slide-overlay"></div>

          <div class="category-hero__slide-content">
            <div class="category-hero__slide-text">
              <BasicText
                size="body-s"
                color="primary-500"
                class="category-hero__slide-eyebrow"
              >
                {{ slide.eyebrow }}
              </BasicText>

              <BasicText
                size="h3"
                weight="bold"
                color="primary-700"
              >
                {{ slide.title }}
              </BasicText>

              <BasicText
                size="body-m"
                color="neutral-700"
                class="category-hero__slide-desc"
              >
                {{ slide.description }}
              </BasicText>

              <BasicText
                size="body-s"
                color="neutral-500"
                class="category-hero__slide-disclaimer"
              >
                Produits destinés exclusivement à la recherche scientifique – non destinés à l’usage
                humain.
              </BasicText>

              <div class="category-hero__slide-actions">
                <BasicButton
                  :label="`Explorer les peptides ${slide.label}`"
                  type="primary"
                  variant="filled"
                  size="medium"
                  @click="goToCategory(slide)"
                />
                <BasicButton
                  label="Voir le catalogue complet"
                  type="secondary"
                  variant="ghost"
                  size="medium"
                  @click="goToCatalogue"
                />
              </div>
            </div>

            <div class="category-hero__slide-media">
              <div
                class="category-hero__video-card"
                @click="openVideo(slide)"
              >
                <img
                  :src="`https://img.youtube.com/vi/${slide.youtubeId}/hqdefault.jpg`"
                  :alt="slide.title"
                  loading="lazy"
                />
                <div class="category-hero__video-card-overlay">
                  <span class="category-hero__video-card-badge">Vidéo YouTube</span>
                  <BasicText
                    size="body-s"
                    color="white"
                    class="category-hero__video-card-title"
                  >
                    {{ slide.videoLabel }}
                  </BasicText>
                  <div class="category-hero__video-card-cta">▶ Regarder</div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Modal vidéo -->
    <transition name="modal-fade">
      <div
        v-if="activeVideo"
        class="video-modal"
        @click="closeModal"
      >
        <transition name="zoom">
          <div
            v-if="activeVideo"
            class="video-wrapper"
            @click.stop
          >
            <iframe
              :src="`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
            ></iframe>
            <button
              class="video-close"
              @click="closeModal"
            >
              ✕
            </button>
          </div>
        </transition>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
  import { bienEtre, metabolisme, performance } from '@/assets/banners/categories'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  type CategorySlide = {
    id: string
    label: string
    tag: string
    eyebrow: string
    title: string
    description: string
    youtubeId: string
    videoLabel: string
    accent: string
    bgImage?: string
  }

  const slides = ref<CategorySlide[]>([
    {
      id: 'metabolism',
      label: 'Métabolisme',
      tag: 'Métabolisme',
      eyebrow: 'Voies métaboliques',
      title: 'Peptides pour la recherche sur le métabolisme.',
      description:
        'Modulation des voies métaboliques, sensibilité à l’insuline et gestion de l’énergie sur modèles précliniques.',
      youtubeId: '5OjqLrbuA8Y',
      videoLabel: 'Bases des peptides & métabolisme (vue vulgarisée)',
      accent: '#22c55e',
      bgImage: metabolisme,
    },
    {
      id: 'wellbeing',
      label: 'Bien-être',
      tag: 'Bien-être',
      eyebrow: 'Neuro & axes du stress',
      title: 'Peptides pour la recherche sur le bien-être.',
      description:
        'Étude des voies neurobiologiques, de la réponse au stress et des axes impliqués dans la régulation de l’humeur.',
      youtubeId: 'qKHknxLvsDY',
      videoLabel: 'Peptides & réponses immunitaires (approche globale)',
      accent: '#6366f1',
      bgImage: bienEtre,
    },
    {
      id: 'performance',
      label: 'Performance',
      tag: 'Performance',
      eyebrow: 'Physiologie de la performance',
      title: 'Peptides pour la recherche sur la performance.',
      description:
        'Exploration de la récupération, de la capacité d’effort et des adaptations physiologiques sur modèles de recherche.',
      youtubeId: 'e4V55I45uO8',
      videoLabel: 'Panorama de peptides utilisés en performance (contenu externe)',
      accent: '#f97316',
      bgImage: performance,
    },
  ])

  const activeIndex = ref(0)
  const activeVideo = ref<{ youtubeId: string } | null>(null)
  let autoplayTimer: number | null = null

  // visibilité du hero (IO)
  const heroSection = ref<HTMLElement | null>(null)
  const isHeroVisible = ref(true)
  let intersectionObserver: IntersectionObserver | null = null

  // slide active
  const activeSlide = computed(() => slides.value[activeIndex.value])

  // BG global → image sous nav + contenu
  const bgStyle = computed(() => ({
    backgroundImage: activeSlide.value?.bgImage ? `url(${activeSlide.value.bgImage})` : 'none',
  }))

  // Translation du track en POURCENTAGE ⇒ indépendant de la largeur px du parent
  const trackStyle = computed(() => ({
    transform: `translate3d(-${activeIndex.value * 100}%, 0, 0)`,
  }))

  function goToSlide(index: number) {
    activeIndex.value = index
  }

  function openVideo(slide: CategorySlide) {
    activeVideo.value = { youtubeId: slide.youtubeId }
  }

  function closeModal() {
    activeVideo.value = null
  }

  function goToCatalogue() {
    router.push('/catalogue')
  }

  function goToCategory(slide: CategorySlide) {
    router.push({
      path: '/catalogue',
      query: { tag: slide.tag },
    })
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

  function pauseAutoplay() {
    stopAutoplay()
  }

  function resumeAutoplay() {
    if (isHeroVisible.value) {
      startAutoplay()
    }
  }

  onMounted(() => {
    if ('IntersectionObserver' in window && heroSection.value) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target !== heroSection.value) return

            isHeroVisible.value = entry.isIntersecting

            if (entry.isIntersecting) {
              startAutoplay()
            } else {
              stopAutoplay()
            }
          })
        },
        {
          threshold: 0.35,
        },
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
  /* ============================================================
   CATEGORY HERO — Neural Blue Glass UI
   Architecture BEM + Nesting LESS premium
   ============================================================ */

  .category-hero {
    position: relative;
    border-radius: 20px;
    overflow: hidden;

    background: rgba(var(--secondary-900-rgb), 0.45);
    backdrop-filter: blur(22px);

    border: 1px solid color-mix(in srgb, @neutral-300 22%, transparent);
    box-shadow:
      0 28px 70px fade(#000, 45%),
      inset 0 0 0 1px fade(@white, 10%);

    /* ============================================================
     BACKGROUND (full bleed)
     ============================================================ */
    &__bg {
      position: absolute;
      inset: 0;
      z-index: 0;

      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          rgba(var(--secondary-900-rgb), 0.45) 0%,
          rgba(var(--secondary-950-rgb), 0.55) 40%,
          rgba(var(--secondary-900-rgb), 0.35) 75%,
          rgba(var(--secondary-900-rgb), 0.5) 100%
        );
        backdrop-filter: blur(8px);
      }
    }

    /* ============================================================
     NAV PILLS
     ============================================================ */
    &__nav {
      position: relative;
      z-index: 2;

      display: flex;
      gap: 10px;
      padding: 18px 24px 8px;
    }

    &__nav-pill {
      padding: 5px 16px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 999px;
      color: @neutral-200 !important;

      background: color-mix(in srgb, @neutral-0 40%, transparent);
      backdrop-filter: blur(10px);

      border: 1px solid color-mix(in srgb, @neutral-300 35%, transparent);
      color: @neutral-900;

      box-shadow:
        0 4px 14px fade(#000, 12%),
        inset 0 0 0 1px fade(@white, 12%);

      transition: all 0.25s ease;

      &:hover {
        background: color-mix(in srgb, @neutral-0 65%, transparent);
        box-shadow: 0 4px 18px fade(#000, 18%);
      }

      &--active {
        background: rgba(var(--primary-200-rgb), 0.45);
        border-color: rgba(var(--primary-400-rgb), 0.6);
        color: var(--primary-700) !important;
        box-shadow:
          0 0 0 1px rgba(var(--primary-300-rgb), 0.55),
          0 6px 16px rgba(var(--primary-400-rgb), 0.35);
      }
    }

    /* Petite séparation glossy */
    &__top-fade {
      position: relative;
      z-index: 2;

      margin: 4px 20px 0;
      height: 12px;
      border-radius: 999px;

      background: linear-gradient(to bottom, color-mix(in srgb, @neutral-50 80%, transparent) 0%, color-mix(in srgb, @neutral-0 0%, transparent) 100%);
      pointer-events: none;
    }

    /* ============================================================
     VIEWPORT + SLIDER
     ============================================================ */
    &__viewport {
      position: relative;
      z-index: 2;
      overflow: hidden;
    }

    &__track {
      display: flex;
      transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* ============================================================
     SLIDE
     ============================================================ */
    &__slide {
      flex: 0 0 100%;
      padding: 28px 32px 28px;
      position: relative;
      /* overlay lisibilité */
      &-overlay {
        position: absolute;
        inset: 0;
        z-index: 1;

        background: linear-gradient(
          90deg,
          rgba(var(--secondary-900-rgb), 0.9) 0%,
          rgba(var(--secondary-900-rgb), 0.7) 28%,
          rgba(var(--secondary-800-rgb), 0.45) 58%,
          transparent 100%
        );
        backdrop-filter: blur(12px);
        pointer-events: none;
      }

      /* contenu slide */
      &-content {
        position: relative;
        z-index: 2;

        display: flex;
        justify-content: space-between;
        align-items: stretch;
        gap: 32px;
        flex-wrap: nowrap;
      }

      /* -------------------------
       TEXT BLOCK
       ------------------------- */
      &-text {
        flex: 1;
        max-width: 460px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      &-eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-weight: 600;
      }

      &-desc {
        color: @neutral-300 !important;
        margin-top: 4px;
      }

      &-disclaimer {
        margin-top: 6px;
        font-size: 12px;
        color: color-mix(in srgb, @neutral-400 80%, transparent) !important;
        max-width: 380px;
      }

      &-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 14px;
      }

      /* -------------------------
       VIDEO BLOCK
       ------------------------- */
      &-media {
        flex: 1.1;
        min-width: 260px;

        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    &__video-card {
      position: relative;
      width: 340px;
      max-width: 100%;
      aspect-ratio: 16/9;
      border-radius: 18px;
      overflow: hidden;

      background: rgba(var(--secondary-950-rgb), 0.45);
      box-shadow:
        0 10px 28px fade(#000, 45%),
        inset 0 0 0 1px fade(@white, 8%);

      transition:
        transform 0.28s ease,
        box-shadow 0.28s ease;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.86;
      }

      &-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 6px;

        padding: 14px;

        background: linear-gradient(0deg, rgba(var(--secondary-900-rgb), 0.85) 0%, transparent 60%);
      }

      &-badge {
        align-self: start;
        padding: 2px 10px;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.12em;

        border-radius: 999px;
        color: @neutral-0;
        background: rgba(var(--primary-400-rgb), 0.35);
        backdrop-filter: blur(6px);
      }

      &-title {
        color: @neutral-0 !important;
        font-weight: 600;
      }

      &-cta {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: color-mix(in srgb, @neutral-0 85%, transparent);
      }

      &:hover {
        transform: translateY(-6px) scale(1.03);
        box-shadow: 0 14px 36px fade(#000, 55%);
      }
    }

    /* ============================================================
     VIDEO MODAL
     ============================================================ */
    .video-modal {
      position: fixed;
      inset: 0;
      z-index: 999;

      display: flex;
      align-items: center;
      justify-content: center;

      background: fade(#000, 80%);
      backdrop-filter: blur(10px);

      .video-wrapper {
        position: relative;
        width: 80%;
        max-width: 960px;
        aspect-ratio: 16/9;
        border-radius: 16px;
        overflow: hidden;

        background: var(--secondary-950);
        box-shadow: 0 12px 40px fade(#000, 50%);

        iframe {
          width: 100%;
          height: 100%;
        }

        .video-close {
          position: absolute;
          top: 12px;
          right: 14px;

          width: 40px;
          height: 40px;
          border-radius: 50%;

          background: color-mix(in srgb, @neutral-0 10%, transparent);
          backdrop-filter: blur(8px);
          border: 1px solid color-mix(in srgb, @neutral-300 30%, transparent);

          font-size: 22px;
          color: @neutral-0;
          cursor: pointer;

          transition: background 0.25s ease;

          &:hover {
            background: color-mix(in srgb, @neutral-0 20%, transparent);
          }
        }
      }
    }

    /* ============================================================
     TRANSITIONS
     ============================================================ */
    .modal-fade-enter-active,
    .modal-fade-leave-active {
      transition: opacity 0.35s ease;
    }
    .modal-fade-enter-from,
    .modal-fade-leave-to {
      opacity: 0;
    }

    .zoom-enter-active,
    .zoom-leave-active {
      transition:
        transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
        opacity 0.35s ease;
    }
    .zoom-enter-from,
    .zoom-leave-to {
      transform: scale(0.9);
      opacity: 0;
    }

    /* ============================================================
     RESPONSIVE
     ============================================================ */
    @media (max-width: 960px) {
      &__slide {
        padding: 22px 18px;
      }
    }

    @media (max-width: 760px) {
      &__slide-content {
        flex-direction: column;
      }

      &__slide-overlay {
        background: linear-gradient(
          180deg,
          rgba(var(--secondary-900-rgb), 0.9) 0%,
          rgba(var(--secondary-900-rgb), 0.7) 35%,
          transparent 100%
        );
      }

      &__slide-media {
        justify-content: flex-start;
      }

      &__video-card {
        width: 100%;
      }
    }
  }
</style>
