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
        class="nav-pill"
        :class="{ 'nav-pill--active': index === activeIndex }"
        @click="goToSlide(index)"
      >
        {{ slide.label }}
      </button>
    </div>

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
          <div class="slide__overlay"></div>

          <div class="slide__content">
            <div class="slide__text">
              <BasicText
                size="body-s"
                color="primary-500"
                class="slide__eyebrow"
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
                class="slide__desc"
              >
                {{ slide.description }}
              </BasicText>

              <BasicText
                size="body-s"
                color="neutral-500"
                class="slide__disclaimer"
              >
                Produits destinés exclusivement à la recherche scientifique – non destinés à l’usage
                humain.
              </BasicText>

              <div class="slide__actions">
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

            <div class="slide__media">
              <div
                class="video-card"
                @click="openVideo(slide)"
              >
                <img
                  :src="`https://img.youtube.com/vi/${slide.youtubeId}/hqdefault.jpg`"
                  :alt="slide.title"
                  loading="lazy"
                />
                <div class="video-card__overlay">
                  <span class="video-card__badge">Vidéo YouTube</span>
                  <BasicText
                    size="body-s"
                    color="white"
                    class="video-card__title"
                  >
                    {{ slide.videoLabel }}
                  </BasicText>
                  <div class="video-card__cta">▶ Regarder</div>
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
  import { bienEtre, metabolisme, performance } from '@/assets/banner/categories'
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
    stopAutoplay()
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
    startAutoplay()
  }

  onMounted(() => {
    startAutoplay()
  })

  onBeforeUnmount(() => {
    stopAutoplay()
  })
</script>

<style scoped lang="less">
  .category-hero {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 18px fade(@neutral-700, 10%);
    background: @neutral-0;
  }

  /* BG full-bleed */
  .category-hero__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }

  /* léger wash blanc pour la lisibilité globale */
  .category-hero__bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: fade(@neutral-0, 35%);
  }

  /* tout le contenu est au-dessus */
  .category-hero__nav,
  .category-hero__viewport {
    position: relative;
    z-index: 1;
  }

  /* nav */
  .category-hero__nav {
    display: flex;
    gap: 10px;
    padding: 14px 20px 8px;
  }

  .nav-pill {
    border-radius: 999px;
    padding: 4px 14px;
    border: 1px solid fade(@neutral-300, 70%);
    background: fade(@neutral-0, 90%);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .nav-pill--active {
    border-color: fade(@primary-400, 80%);
    background: fade(@primary-50, 90%);
    color: @primary-700;
  }

  /* slider */
  .category-hero__viewport {
    position: relative;
    overflow: hidden;
    padding-inline: 0;
  }

  .category-hero__track {
    display: flex;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* chaque slide = 100% du viewport, donc translateX(-100%, -200%, ...) fonctionne partout */
  .category-hero__slide {
    flex: 0 0 100%;
    width: 100%;
    box-sizing: border-box;

    position: relative;
    padding: 26px 28px 24px;
  }

  /* overlay zone texte */
  .slide__overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      90deg,
      fade(@neutral-0, 100%) 0%,
      fade(@neutral-0, 100%) 26%,
      fade(@neutral-0, 92%) 40%,
      fade(@neutral-0, 78%) 60%,
      transparent 90%
    );
    pointer-events: none;
  }

  /* contenu */
  .slide__content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 30px;
    flex-wrap: wrap;
  }

  .slide__text {
    flex: 1;
    min-width: 260px;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .slide__eyebrow {
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .slide__desc {
    margin-top: 4px;
  }

  .slide__disclaimer {
    margin-top: 4px;
    max-width: 380px;
  }

  .slide__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 14px;
  }

  /* vidéo */
  .slide__media {
    flex: 1.1;
    min-width: 260px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .video-card {
    position: relative;
    width: 320px;
    max-width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }
  .video-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .video-card__overlay {
    position: absolute;
    inset: 0;
    padding: 10px 12px 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), transparent 55%);
    gap: 6px;
  }
  .video-card__badge {
    align-self: flex-start;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    background: rgba(255, 255, 255, 0.16);
    color: @neutral-0;
  }
  .video-card__title {
    font-weight: 600;
  }
  .video-card__cta {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: fade(@neutral-0, 85%);
  }
  .video-card:hover {
    transform: translateY(-6px) scale(1.03);
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
  }

  /* modal vidéo */
  .video-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    backdrop-filter: blur(8px);
  }
  .video-wrapper {
    position: relative;
    width: 80%;
    max-width: 960px;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  }
  .video-wrapper iframe {
    width: 100%;
    height: 100%;
  }
  .video-close {
    position: absolute;
    top: 10px;
    right: 12px;
    background: rgba(0, 0, 0, 0.6);
    border: none;
    color: white;
    font-size: 22px;
    border-radius: 50%;
    width: 38px;
    height: 38px;
    cursor: pointer;
  }

  /* transitions */
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
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .zoom-enter-from {
    transform: scale(0.9);
    opacity: 0;
  }
  .zoom-leave-to {
    transform: scale(0.9);
    opacity: 0;
  }

  /* responsive */
  @media (max-width: 960px) {
    .category-hero__slide {
      padding: 22px 18px 20px;
    }
  }

  @media (max-width: 640px) {
    .slide__content {
      flex-direction: column;
    }

    .slide__overlay {
      background: linear-gradient(
        180deg,
        fade(@neutral-0, 100%) 0%,
        fade(@neutral-0, 94%) 40%,
        transparent 100%
      );
    }

    .slide__media {
      justify-content: flex-start;
    }

    .video-card {
      width: 100%;
    }
  }
</style>
