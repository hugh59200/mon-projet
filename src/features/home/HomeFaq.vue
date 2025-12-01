<template>
  <section
    class="faq"
    ref="sectionRef"
  >
    <SectionHeader
      badge="Support"
      title="Questions fréquentes"
      light
    />

    <div class="faq__list">
      <div
        v-for="(item, i) in faqItems"
        :key="i"
        class="faq__item"
        :class="{ 'faq__item--open': openFaq === i }"
        @click="toggleFaq(i)"
      >
        <div class="faq__question">
          <span>{{ item.question }}</span>
          <div class="faq__toggle">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
        </div>
        <div class="faq__answer">
          <p>{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import SectionHeader from './shared/SectionHeader.vue'

  const sectionRef = ref<HTMLElement | null>(null)
  const openFaq = ref<number | null>(null)

  const faqItems = [
    {
      question: 'Vendez-vous aux particuliers ?',
      answer:
        'Nos produits sont destinés aux laboratoires, institutions de recherche et professionnels qualifiés.',
    },
    {
      question: 'Les produits sont-ils à usage humain ?',
      answer:
        'Non. Tous nos peptides sont vendus exclusivement pour la recherche scientifique in vitro (RUO).',
    },
    {
      question: "Fournissez-vous des certificats d'analyse ?",
      answer: 'Oui, chaque lot est accompagné de son COA complet (HPLC, MS).',
    },
    {
      question: "D'où expédiez-vous ?",
      answer: 'Depuis nos entrepôts en Union Européenne (livraison 24-48h).',
    },
    {
      question: 'Quels moyens de paiement acceptez-vous ?',
      answer: 'Virements bancaires, cartes (Visa, Mastercard) et facturation institutions.',
    },
  ]

  const toggleFaq = (i: number) => {
    openFaq.value = openFaq.value === i ? null : i
  }

  onMounted(() => {
    if ('IntersectionObserver' in window && sectionRef.value) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add('is-visible')
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
      )
      obs.observe(sectionRef.value)
    }
  })
</script>

<style scoped lang="less">
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
  @ease: cubic-bezier(0.4, 0, 0.2, 1);

  @light-text-primary: #1a202c;
  @light-text-secondary: #4a5568;
  @light-bg-card: #ffffff;
  @light-border: rgba(0, 0, 0, 0.08);

  .faq {
    padding: 80px 40px;
    max-width: 900px;
    margin: 0 auto;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s @ease;

    &.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__item {
      background: @light-bg-card;
      border: 1px solid @light-border;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s @ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      &:hover {
        border-color: rgba(var(--primary-500-rgb), 0.2);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      }

      &--open {
        border-color: rgba(var(--primary-500-rgb), 0.3);
        background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.03), @light-bg-card);
        box-shadow: 0 8px 24px rgba(var(--primary-500-rgb), 0.1);

        .faq__toggle svg {
          transform: rotate(45deg);
        }

        .faq__answer {
          max-height: 200px;
          padding: 0 24px 24px;
          opacity: 1;
        }
      }
    }

    &__question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      gap: 16px;

      span {
        font-family: @font-display;
        font-size: 17px;
        font-weight: 500;
        color: @light-text-primary;
      }
    }

    &__toggle {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: rgba(var(--primary-500-rgb), 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--primary-600);

      svg {
        width: 16px;
        height: 16px;
        transition: transform 0.3s @ease;
      }
    }

    &__answer {
      max-height: 0;
      padding: 0 24px;
      opacity: 0;
      overflow: hidden;
      transition: all 0.4s @ease;

      p {
        font-family: @font-body;
        font-size: 15px;
        line-height: 1.7;
        color: @light-text-secondary;
        margin: 0;
        border-top: 1px solid @light-border;
        padding-top: 20px;
      }
    }
  }

  @media (max-width: 768px) {
    .faq {
      padding: 60px 20px;
      &__question span {
        font-size: 15px;
      }
    }
  }
</style>
