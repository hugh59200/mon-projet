<template>
  <section
    class="hero-banner"
    ref="heroSection"
  >
    <!-- ✨ fond lumineux -->
    <div
      class="hero-banner__glow"
      ref="glowLayer"
    ></div>

    <!-- 🎥 SECTION HYPE -->
    <div
      class="hero-banner__top"
      ref="topSection"
    >
      <div
        v-for="(card, i) in hypeCards"
        :key="card.id"
        class="hype-card"
        :class="`pos-${i}`"
        @click="openVideo(card)"
      >
        <img
          :src="`https://img.youtube.com/vi/${card.youtubeId}/hqdefault.jpg`"
          :alt="card.title"
        />
        <div class="card-overlay">
          <BasicText
            size="body-s"
            color="white"
          >
            {{ card.title }}
          </BasicText>
        </div>
      </div>
    </div>

    <!-- 💊 SECTION PEPTIDES -->
    <div
      class="hero-banner__bottom"
      ref="carouselContainer"
    >
      <div
        class="scroll-track"
        ref="scrollTrack"
      >
        <div
          v-for="p in peptides"
          :key="p.id"
          class="peptide-item"
        >
          <img
            :src="p.image || '/images/default-peptide.png'"
            :alt="p.name"
          />
          <span>{{ p.name }}</span>
        </div>
        <div
          v-for="p in peptides"
          :key="'dup-' + p.id"
          class="peptide-item"
        >
          <img
            :src="p.image || '/images/default-peptide.png'"
            :alt="p.name"
          />
          <span>{{ p.name }}</span>
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

  gsap.registerPlugin(ScrollTrigger)

  const { products, loadProducts } = useProducts()
  const peptides = products
  onMounted(() => loadProducts())

  const heroSection = ref<HTMLElement>()
  const glowLayer = ref<HTMLElement>()
  const topSection = ref<HTMLElement>()
  const scrollTrack = ref<HTMLElement>()
  const carouselContainer = ref<HTMLElement>()
  let scrollAnim: gsap.core.Tween

  onMounted(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

    if (heroSection.value) {
      tl.from(heroSection.value, { opacity: 0, duration: 0.6 })
    }
    if (topSection.value) {
      const cards = topSection.value.querySelectorAll('.hype-card')
      tl.from(cards, { y: 50, opacity: 0, stagger: 0.2, duration: 0.6 }, '-=0.3')
    }
    tl.from('.hero-banner__bottom', { opacity: 0, y: 30, duration: 0.8 }, '-=0.2')

    const track = scrollTrack.value
    if (track) {
      scrollAnim = gsap.to(track, {
        xPercent: -50,
        duration: 25,
        ease: 'linear',
        repeat: -1,
      })
    }

    const container = carouselContainer.value
    if (container && scrollAnim) {
      container.addEventListener('mouseenter', () => scrollAnim.pause())
      container.addEventListener('mouseleave', () => scrollAnim.resume())
    }

    if (topSection.value) {
      const cards = topSection.value.querySelectorAll('.hype-card')
      cards.forEach((el, i) => {
        gsap.to(el, {
          y: (i % 2 === 0 ? 1 : -1) * 60,
          ease: 'none',
          scrollTrigger: {
            trigger: topSection.value,
            start: 'top bottom',
            scrub: true,
          },
        })
      })
    }

    if (glowLayer.value) {
      gsap.to(glowLayer.value, {
        backgroundPosition: '200% 100%',
        duration: 20,
        ease: 'none',
        repeat: -1,
        yoyo: true,
      })

      gsap.to(glowLayer.value, {
        yPercent: -15,
        scale: 1.1,
        opacity: 0.9,
        scrollTrigger: {
          trigger: heroSection.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }

    if (glowLayer.value && window.innerWidth > 768) {
      const glow = glowLayer.value
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20
        const y = (e.clientY / window.innerHeight - 0.5) * 20
        gsap.to(glow, { x, y, duration: 0.8, ease: 'power2.out' })
      })
    }
  })

  onBeforeUnmount(() => {
    scrollAnim?.kill()
    ScrollTrigger.getAll().forEach((t) => t.kill())
  })

  const activeVideo = ref<{ youtubeId: string } | null>(null)
  function openVideo(card: { youtubeId: string }) {
    activeVideo.value = { youtubeId: card.youtubeId }
  }
  function closeModal() {
    activeVideo.value = null
  }

  const hypeCards = ref([
    {
      id: 1,
      title: 'Introduction aux PEPTIDES en Musculation: Découverte et Bases',
      youtubeId: '5OjqLrbuA8Y',
    },
    {
      id: 2,
      title: 'Les peptides et leur immunité',
      youtubeId: 'qKHknxLvsDY',
    },
    {
      id: 3,
      title: 'Liste des peptides (SANS FILTRE)',
      youtubeId: 'e4V55I45uO8',
    },
  ])
</script>

<style scoped lang="less">
  .hero-banner {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 16px;
    overflow: hidden;

    background-image: url('../../src/assets/banner/pexels-fwstudio-33348-164005.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    &__glow {
      position: absolute;
      inset: 0;
      z-index: 0;
      background:
        radial-gradient(circle at 30% 30%, fade(@neutral-400, 40%) 0%, transparent 40%),
        radial-gradient(circle at 70% 70%, fade(@neutral-400, 50%) 0%, transparent 40%);
      background-size: 200% 200%;
      opacity: 0.6;
      filter: blur(60px);
      pointer-events: none;
    }

    &__top {
      height: 70%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 30px;
      flex-wrap: wrap;
      padding: 40px 20px 0px 20px;

      .hype-card {
        position: relative;
        width: 240px;
        height: 140px;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
        transition: transform 0.3s ease;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 10px;
          background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), transparent);
        }
      }

      /* --- POSITIONNEMENT DES 3 CARTES --- */
      .hype-card.pos-0 {
        transform: translateY(-30px) !important;
      }
      .hype-card.pos-1 {
        transform: translateY(40px) !important;
      }
      .hype-card.pos-2 {
        transform: translateY(-30px) !important;
      }

      /* HOVER premium */
      .hype-card:hover {
        transform: scale(1.08) !important;
        z-index: 10;
      }
    }

    &__bottom {
      height: 30%;
      background: linear-gradient(to right, fade(@neutral-100, 50%), fade(@neutral-100, 50%));
      display: flex;
      align-items: center;
      overflow: hidden;
      padding: 10px 0;

      .scroll-track {
        display: flex;
        width: 200%;
        gap: 60px;
      }

      .peptide-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        width: 140px;
        img {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }
        span {
          font-weight: 600;
          color: @neutral-700;
          text-align: center;
        }
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

  /* Transition */
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
</style>
