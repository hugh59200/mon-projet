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
            color="primary-600"
            class="hero-banner__eyebrow"
          >
            Ressources pédagogiques
          </BasicText>

          <BasicText
            size="h3"
            weight="bold"
            color="neutral-900"
          >
            Comprendre les peptides avant vos recherches.
          </BasicText>

          <BasicText
            size="body-m"
            color="neutral-600"
            class="hero-banner__top-sub"
          >
            Guides, fiches synthétiques et contenus sélectionnés pour mieux appréhender le rôle des
            peptides dans vos projets de recherche.
          </BasicText>

          <ul class="hero-banner__bullets">
            <li>
              <BasicIconNext
                name="CheckCircle"
                :size="18"
                color="success-600"
              />
              <BasicText color="neutral-700">
                Vulgarisation claire pour équipes R&D et laboratoires.
              </BasicText>
            </li>
            <li>
              <BasicIconNext
                name="BookOpenText"
                :size="18"
                color="primary-600"
              />
              <BasicText color="neutral-700">
                Ressources externes sélectionnées : articles, vidéos, revues.
              </BasicText>
            </li>
            <li>
              <BasicIconNext
                name="ShieldCheck"
                :size="18"
                color="warning-600"
              />
              <BasicText color="neutral-700">
                Rappel constant : recherche exclusivement – aucun usage humain.
              </BasicText>
            </li>
          </ul>

          <div class="hero-banner__cta-row">
            <BasicButton
              label="Explorer les ressources pédagogiques"
              type="primary"
              variant="filled"
              size="medium"
              width="full"
              @click="$router.push('/actualites')"
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
              color="neutral-700"
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
              color="neutral-500"
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
          <BasicText
            weight="bold"
            color="neutral-800"
          >
            Quelques peptides de notre catalogue
          </BasicText>
          <BasicText
            fontStyle="italic"
            color="neutral-500"
            size="body-s"
          >
            Research only – Not for human use
          </BasicText>
        </div>

        <div
          class="scroll-track"
          ref="scrollTrack"
        >
          <template
            v-for="i in 2"
            :key="i"
          >
            <div
              v-for="p in peptides"
              :key="p.id + '-' + i"
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
              <BasicText
                size="body-s"
                color="neutral-700"
              >
                {{ p.name }}
              </BasicText>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import personaLab from '@/assets/banners/hero/persona-lab.png'
  import personaPhd from '@/assets/banners/hero/persona-phd.png'
  import personaRd from '@/assets/banners/hero/persona-rd.png'
  import personaQuality from '@/assets/banners/hero/persona-quality.png'
  import { useProductsStore } from '@/features/catalogue/composables/useProducts'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { storeToRefs } from 'pinia'
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  gsap.registerPlugin(ScrollTrigger)

  const router = useRouter()
  const productsStore = useProductsStore()
  const { products } = storeToRefs(productsStore)
  const { load } = productsStore
  const peptides = products

  onMounted(() => {
    load()
  })

  const heroSection = ref<HTMLElement>()
  const glowLayer = ref<HTMLElement>()
  const topSection = ref<HTMLElement>()
  const scrollTrack = ref<HTMLElement>()
  const carouselContainer = ref<HTMLElement>()

  let scrollAnim: gsap.core.Tween | null = null

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
      alt: 'Chercheuse en laboratoire',
    },
    {
      id: 'lab',
      name: 'Pr. K. Almeida',
      role: 'Responsable de laboratoire',
      tag: 'Laboratoire académique',
      image: personaLab,
      alt: 'Responsable de laboratoire',
    },
    {
      id: 'phd',
      name: 'Noah',
      role: 'Doctorant en sciences du vivant',
      tag: 'Projet de thèse',
      image: personaPhd,
      alt: 'Jeune doctorant',
    },
    {
      id: 'quality',
      name: 'Dr. S. Meyer',
      role: 'Référent qualité & conformité',
      tag: 'Qualité & conformité',
      image: personaQuality, 
      alt: 'Scientifiques discutant',
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
    }

    // Carrousel horizontal infini
    const track = scrollTrack.value
    if (track) {
      scrollAnim = gsap.to(track, {
        xPercent: -50,
        duration: 45, // Plus lent pour être lisible
        ease: 'linear',
        repeat: -1,
      })
    }

    const container = carouselContainer.value
    if (container && scrollAnim) {
      container.addEventListener('mouseenter', () => scrollAnim?.pause())
      container.addEventListener('mouseleave', () => scrollAnim?.resume())
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
    scrollAnim?.kill()
    ScrollTrigger.getAll().forEach((t) => t.kill())
  })
</script>

<style scoped lang="less">
  .hero-banner {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 24px;
    overflow: hidden;
    margin-top: 40px; // Espace avec le composant précédent

    /* ✅ Style Glassmorphism Blanc */
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.04),
      inset 0 0 0 1px rgba(255, 255, 255, 0.5);

    &__glow {
      position: absolute;
      inset: -50%;
      z-index: 0;
      filter: blur(100px);
      opacity: 0.3;
      pointer-events: none;

      /* Glow plus doux (bleu ciel / blanc) */
      background:
        radial-gradient(circle at 30% 30%, rgba(var(--primary-200-rgb), 0.4), transparent 60%),
        radial-gradient(circle at 70% 70%, rgba(var(--secondary-200-rgb), 0.4), transparent 60%);
      background-size: 150% 150%;
    }

    /* --- TOP SECTION --- */
    &__top {
      position: relative;
      z-index: 2;
      display: flex;
      gap: 40px;
      padding: 48px;
      align-items: stretch;
    }

    /* --- LEFT PANEL --- */
    &__panel {
      flex: 1;
      max-width: 480px;
      padding: 32px;
      border-radius: 20px;
      position: relative;
      overflow: hidden;

      /* Carte Blanche Propre */
      background: rgba(255, 255, 255, 0.5);
      border: 1px solid @neutral-100;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);

      /* Accent sur la gauche */
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

    &__text {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__eyebrow {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      background: var(--primary-50);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.75rem;
      width: fit-content;
      margin-bottom: 8px;
    }

    &__bullets {
      margin-top: 12px;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;

      li {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        font-size: 0.95rem;
      }
    }

    &__cta-row {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &__disclaimer {
      font-size: 0.8rem;
      text-align: center;
      opacity: 0.8;
    }

    /* --- PERSONAS (DROITE) --- */
    &__personas {
      flex: 1.2;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      align-content: start;

      max-height: 500px;
      overflow-y: auto;
      padding-right: 4px; // Pour la scrollbar

      /* Scrollbar fine */
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: @neutral-200;
        border-radius: 4px;
      }
    }

    .persona-card {
      background: white;
      border-radius: 16px;
      padding: 12px;
      border: 1px solid @neutral-100;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
      }

      &__image-wrap {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        aspect-ratio: 4/3;
        background: @neutral-50;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      &__tag {
        position: absolute;
        bottom: 8px;
        left: 8px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(4px);
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      &__info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
    }

    /* --- BOTTOM CAROUSEL --- */
    &__bottom {
      position: relative;
      z-index: 2;
      background: rgba(255, 255, 255, 0.4);
      border-top: 1px solid rgba(255, 255, 255, 0.8);
      padding: 20px 0;
      overflow: hidden;
    }

    &__bottom-inner {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__bottom-header {
      padding: 0 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .scroll-track {
      display: flex;
      gap: 30px;
      width: max-content; // Important pour que le scroll fonctionne
      padding: 0 48px;

      .peptide-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        width: 120px;
        flex-shrink: 0;

        &__img-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: white;
          border: 1px solid @neutral-100;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease;

          img {
            width: 60%;
            height: 60%;
            object-fit: contain;
          }
        }

        &:hover &__img-wrapper {
          transform: scale(1.05);
          border-color: var(--primary-200);
        }
      }
    }

    /* --- RESPONSIVE --- */
    @media (max-width: 960px) {
      &__top {
        flex-direction: column;
        padding: 32px;
      }

      &__panel {
        max-width: none;
      }

      &__bottom-header,
      .scroll-track {
        padding: 0 24px;
      }
    }

    @media (max-width: 600px) {
      border-radius: 0; // Full width sur mobile
      margin-top: 20px;

      &__top {
        padding: 24px 16px;
      }

      &__personas {
        display: flex;
        flex-direction: row;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding-bottom: 10px; // Espace pour scrollbar

        .persona-card {
          min-width: 240px;
          scroll-snap-align: start;
        }
      }
    }
  }
</style>
