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
          <BasicText
            size="body-s"
            color="primary-600"
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
            color="neutral-700"
            class="hero-banner__top-sub"
          >
            Guides, fiches synthétiques et contenus sélectionnés pour mieux appréhender le rôle des
            peptides dans vos projets de recherche.
          </BasicText>

          <ul class="hero-banner__bullets">
            <li>
              <BasicIconNext
                name="CheckCircle"
                :size="16"
                color="primary-600"
              />
              <span>Vulgarisation claire pour équipes R&amp;D et laboratoires.</span>
            </li>
            <li>
              <BasicIconNext
                name="BookOpenText"
                :size="16"
                color="primary-600"
              />
              <span>Ressources externes sélectionnées : articles, vidéos, revues.</span>
            </li>
            <li>
              <BasicIconNext
                name="ShieldCheck"
                :size="16"
                color="primary-600"
              />
              <span>Rappel constant : recherche exclusivement – aucun usage humain.</span>
            </li>
          </ul>

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
            <span class="persona-card__tag">
              {{ persona.tag }}
            </span>
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
          <span class="bottom-title">Quelques peptides de notre catalogue</span>
          <div class="bottom-actions">
            <span class="bottom-sub">Research only – Not for human use</span>
            <button
              type="button"
              class="bottom-link"
              @click="$router.push('/catalogue')"
            >
              Voir tout le catalogue
            </button>
          </div>
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
  </section>
</template>

<script setup lang="ts">
  import personaLab from '@/assets/home/banners/hero/persona-lab.png'
  import personaPhd from '@/assets/home/banners/hero/persona-phd.png'
  import personaRd from '@/assets/home/banners/hero/persona-rd.png'
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
  .hero-banner {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 3px 14px fade(@neutral-700, 12%);
    background:
      radial-gradient(circle at 0% 0%, fade(@primary-100, 75%), transparent 55%),
      radial-gradient(circle at 100% 100%, fade(@secondary-100, 70%), transparent 55%),
      linear-gradient(135deg, @neutral-0, @primary-0);
  }

  .hero-banner__glow {
    position: absolute;
    inset: -40px;
    z-index: 0;
    background:
      radial-gradient(circle at 30% 30%, fade(@primary-200, 40%) 0%, transparent 45%),
      radial-gradient(circle at 70% 70%, fade(@secondary-200, 40%) 0%, transparent 45%);
    background-size: 200% 200%;
    opacity: 0.45;
    filter: blur(50px);
    pointer-events: none;
  }

  .hero-banner__top {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 32px;
    padding: 26px 28px 18px;
    flex-wrap: nowrap;
  }

  /* panneau texte à gauche */
  .hero-banner__panel {
    position: relative;
    flex: 1;
    min-width: 260px;
    max-width: 430px;
    background: @white;
    border-radius: 18px;
    padding: 20px 22px 18px;
    box-shadow: 0 10px 28px fade(@neutral-800, 10%);
    border: 1px solid fade(@primary-100, 70%);
    overflow: hidden;
  }

  .hero-banner__panel::before {
    content: '';
    position: absolute;
    left: 0;
    top: 14px;
    bottom: 14px;
    width: 3px;
    border-radius: 999px;
    background: linear-gradient(to bottom, @primary-500, @secondary-400);
  }

  .hero-banner__top-text {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .hero-banner__eyebrow {
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .hero-banner__top-sub {
    margin-top: 2px;
  }

  .hero-banner__bullets {
    list-style: none;
    padding: 0;
    margin: 8px 0 0;
    display: flex;
    flex-direction: column;
    gap: 6px;

    li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: @neutral-700;
    }
  }

  .hero-banner__cta-row {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .hero-banner__disclaimer {
    font-size: 11px;
  }

  .hero-banner__personas {
    flex: 1.4;
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-height: 450px;
    padding-right: 6px;
    overflow-y: auto;
  }

  .hero-banner__personas::-webkit-scrollbar {
    width: 4px;
  }
  .hero-banner__personas::-webkit-scrollbar-track {
    background: fade(@primary-50, 60%);
    border-radius: 999px;
  }
  .hero-banner__personas::-webkit-scrollbar-thumb {
    background: fade(@primary-400, 70%);
    border-radius: 999px;
  }

  /* cartes personas */
  .persona-card {
    position: relative;
    border-radius: 16px;
    padding: 10px 10px 12px;
    background: linear-gradient(135deg, fade(@neutral-0, 96%), fade(@primary-50, 85%));
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .persona-card__image-wrap {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    background: radial-gradient(
      circle at 10% 0%,
      fade(@primary-100, 80%),
      fade(@secondary-100, 60%)
    );

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .persona-card__tag {
    position: absolute;
    left: 10px;
    bottom: 10px;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    background: fade(@neutral-900, 75%);
    color: @neutral-0;
    backdrop-filter: blur(6px);
  }

  .persona-card__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 4px;
  }

  /* 💊 BOTTOM TICKER (inchangé) */
  .hero-banner__bottom {
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

  .hero-banner__bottom-inner {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .hero-banner__bottom-header {
    display: flex;
    align-items: center;
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

  .bottom-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .bottom-sub {
    font-size: 11px;
    color: @neutral-500;
  }

  .bottom-link {
    border: none;
    background: transparent;
    font-size: 12px;
    font-weight: 500;
    color: @primary-600;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
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
    width: 140px;
    flex-shrink: 0;
    cursor: pointer;
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease;

    img {
      width: 80px;
      height: 80px;
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

  /* === BREAKPOINTS === */

  /* 🖥 Très grand écran : 4 cartes en carré (2×2), pas de scroll vertical */
  @media (min-width: 1200px) {
    .hero-banner__personas {
      display: grid;
      grid-template-columns: repeat(2, minmax(210px, 1fr));
      grid-auto-rows: 1fr;
      gap: 18px;
      max-height: none;
      padding-right: 0;
      overflow: visible;
    }
  }

  /* 📱 / TABLETTE : layout plus compact */
  @media (max-width: 960px) {
    .hero-banner__top {
      padding: 22px 18px 14px;
      gap: 22px;
    }

    .hero-banner__panel {
      max-width: none;
    }

    .hero-banner__bottom {
      padding-inline: 16px;
    }
  }

  /* 📱 Mobile : personas sous le texte, carrousel horizontal scrollable */
  @media (max-width: 768px) {
    .hero-banner__top {
      flex-direction: column;
      align-items: stretch;
    }

    .hero-banner__personas {
      flex: none;
      max-height: none;
      padding-right: 0;
      margin: 6px -8px 0;
      padding-inline: 8px;
      display: flex;
      flex-direction: row;
      overflow-x: auto;
      overflow-y: hidden;
      gap: 12px;
      scroll-snap-type: x mandatory;
    }

    .hero-banner__personas::-webkit-scrollbar {
      height: 4px;
      width: auto;
    }

    .persona-card {
      flex: 0 0 240px;
      scroll-snap-align: start;
    }

    .hero-banner__bottom-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
