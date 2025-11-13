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

    <!-- 🎥 SECTION CONTENU PÉDAGOGIQUE -->
    <div
      class="hero-banner__top"
      ref="topSection"
    >
      <div class="hero-banner__top-text">
        <BasicText
          size="body-s"
          color="primary-500"
          class="hero-banner__eyebrow"
        >
          Ressources pédagogiques
        </BasicText>

        <BasicText
          size="h3"
          weight="bold"
          color="primary-700"
        >
          Comprendre les peptides avant vos recherches.
        </BasicText>

        <BasicText
          size="body-m"
          color="neutral-600"
          class="hero-banner__top-sub"
        >
          Sélection de vidéos externes sur les peptides, leurs mécanismes et leur utilisation dans
          un contexte de recherche scientifique.
        </BasicText>

        <BasicText
          size="body-s"
          color="neutral-500"
          class="hero-banner__top-disclaimer"
        >
          Ces contenus sont fournis à titre informatif uniquement et ne constituent pas un avis
          médical. Nos produits sont destinés exclusivement à la recherche scientifique – non
          destinés à l’usage humain.
        </BasicText>
      </div>

      <div class="hero-banner__top-cards">
        <div
          v-for="(card, i) in hypeCards"
          :key="card.id"
          class="hype-card"
          :class="{ 'hype-card--primary': i === 0 }"
          @click="openVideo(card)"
        >
          <img
            :src="`https://img.youtube.com/vi/${card.youtubeId}/hqdefault.jpg`"
            :alt="card.title"
            loading="lazy"
          />
          <div class="card-overlay">
            <span class="hype-card__badge">Vidéo YouTube</span>
            <BasicText
              size="body-s"
              color="white"
              class="hype-card__title"
            >
              {{ card.title }}
            </BasicText>
            <div class="hype-card__cta">▶ Regarder</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 💊 SECTION PEPTIDES (TICKER) -->
    <div
      class="hero-banner__bottom"
      ref="carouselContainer"
    >
      <div class="hero-banner__bottom-inner">
        <div class="hero-banner__bottom-header">
          <span class="bottom-title">Quelques peptides de notre catalogue</span>
          <span class="bottom-sub">Research only – Not for human use</span>
        </div>

        <div
          class="scroll-track"
          ref="scrollTrack"
        >
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
            <span>{{ p.name }}</span>
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
            <span>{{ p.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 🎬 MODAL VIDEO -->
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

  const activeVideo = ref<{ youtubeId: string } | null>(null)

  function openVideo(card: { youtubeId: string }) {
    activeVideo.value = { youtubeId: card.youtubeId }
  }

  function goToProduct(p: { id: string }) {
    router.push(`/catalogue/${p.id}`)
  }

  function closeModal() {
    activeVideo.value = null
  }

  const hypeCards = ref([
    {
      id: 1,
      title: 'Introduction aux peptides : bases & mécanismes',
      youtubeId: '5OjqLrbuA8Y',
    },
    {
      id: 2,
      title: 'Peptides & réponses immunitaires (vue d’ensemble)',
      youtubeId: 'qKHknxLvsDY',
    },
    {
      id: 3,
      title: 'Panorama des principaux peptides de recherche',
      youtubeId: 'e4V55I45uO8',
    },
  ])

  onMounted(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

    if (heroSection.value) {
      tl.from(heroSection.value, { opacity: 0, duration: 0.6 })
    }

    if (topSection.value) {
      const textBlock = topSection.value.querySelector('.hero-banner__top-text')
      const cards = topSection.value.querySelectorAll('.hype-card')

      if (textBlock) {
        tl.from(textBlock, { y: 30, opacity: 0, duration: 0.6 }, '-=0.3')
      }

      if (cards.length) {
        tl.from(cards, { y: 40, opacity: 0, stagger: 0.15, duration: 0.6 }, '-=0.2')
      }

      // léger mouvement au scroll pour donner de la profondeur
      cards.forEach((el, i) => {
        const baseShift = i === 0 ? -10 : i === 1 ? 18 : -4
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
        duration: 20,
        ease: 'none',
        repeat: -1,
        yoyo: true,
      })

      gsap.to(glowLayer.value, {
        yPercent: -10,
        scale: 1.06,
        opacity: 0.85,
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
          const x = (e.clientX / window.innerWidth - 0.5) * 30
          const y = (e.clientY / window.innerHeight - 0.5) * 30
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
  .hero-banner {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 18px fade(@neutral-700, 10%);

    background:
      radial-gradient(circle at 10% 0%, fade(@primary-100, 70%), transparent 55%),
      radial-gradient(circle at 90% 100%, fade(@secondary-100, 70%), transparent 55%),
      linear-gradient(135deg, @neutral-0, @neutral-50);

    &__glow {
      position: absolute;
      inset: -40px;
      z-index: 0;
      background:
        radial-gradient(circle at 30% 30%, fade(@primary-200, 40%) 0%, transparent 45%),
        radial-gradient(circle at 70% 70%, fade(@secondary-200, 40%) 0%, transparent 45%);
      background-size: 200% 200%;
      opacity: 0.7;
      filter: blur(60px);
      pointer-events: none;
    }

    &__top {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      gap: 32px;
      padding: 32px 32px 20px;
      flex-wrap: wrap;
    }

    &__top-text {
      flex: 1;
      min-width: 260px;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &__eyebrow {
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    &__top-sub {
      margin-top: 4px;
    }

    &__top-disclaimer {
      margin-top: 6px;
      max-width: 380px;
    }

    &__top-cards {
      flex: 1.3;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 18px;
      flex-wrap: wrap;
    }

    .hype-card {
      position: relative;
      width: 230px;
      height: 130px;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.25);
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
      cursor: pointer;
      background: @neutral-900;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .card-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 10px 10px 12px;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), transparent 55%);
        gap: 6px;
      }

      &__badge {
        align-self: flex-start;
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        background: rgba(255, 255, 255, 0.16);
        color: @neutral-0;
        backdrop-filter: blur(4px);
      }

      &__title {
        font-weight: 600;
        line-height: 1.2;
      }

      &__cta {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: fade(@neutral-0, 85%);
      }
    }

    .hype-card--primary {
      width: 280px;
      height: 155px;
    }

    .hype-card:hover {
      transform: translateY(-6px) scale(1.04);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
    }

    /* 💊 BOTTOM TICKER */
    &__bottom {
      position: relative;
      z-index: 1;
      background: fade(@neutral-0, 94%);
      border-top: 1px solid fade(@neutral-300, 40%);
      backdrop-filter: blur(10px);
      padding: 14px 24px 16px;
      overflow: hidden;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 80px;
        pointer-events: none;
        z-index: 2;
      }

      &::before {
        left: 0;
        background: linear-gradient(to right, @neutral-0, transparent);
      }

      &::after {
        right: 0;
        background: linear-gradient(to left, @neutral-0, transparent);
      }
    }

    &__bottom-inner {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &__bottom-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .bottom-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: @neutral-800;
    }

    .bottom-sub {
      font-size: 11px;
      color: @neutral-500;
    }

    .scroll-track {
      display: flex;
      width: 200%;
      gap: 40px;
      align-items: center;
    }

    .peptide-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      width: 130px;
      flex-shrink: 0;
      cursor: pointer;
      transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;

      img {
        width: 70px;
        height: 70px;
        object-fit: contain;
        border-radius: 12px;
        background: @neutral-0;
        box-shadow: 0 3px 10px fade(@neutral-700, 12%);
      }

      span {
        font-weight: 600;
        font-size: 12px;
        color: @neutral-700;
        text-align: center;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px fade(@neutral-700, 18%);
      }
    }

    /* 🎬 MODALE */
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
      cursor: auto;

      iframe {
        width: 100%;
        height: 100%;
        border: none;
        display: block;
      }
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
      transition: 0.25s;
    }
  }

  /* Transitions modale */
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

  /* 📱 RESPONSIVE */
  @media (max-width: 960px) {
    .hero-banner {
      &__top {
        padding: 24px 18px 16px;
        gap: 24px;
      }

      &__top-disclaimer {
        max-width: none;
      }

      &__bottom {
        padding-inline: 16px;
      }
    }
  }

  @media (max-width: 640px) {
    .hero-banner {
      &__top {
        flex-direction: column;
      }

      &__top-cards {
        justify-content: flex-start;
      }

      .hype-card,
      .hype-card--primary {
        width: 100%;
        max-width: 320px;
        height: 170px;
      }

      .bottom-title {
        font-size: 11px;
      }
    }
  }
</style>
