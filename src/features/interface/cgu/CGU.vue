<template>
  <div class="cgu-page">
    <PageHeader
      :description="$t('cgu.page.description')"
      show-separator
    />

    <div class="cgu-layout">
      <aside
        class="cgu-sidebar"
        v-motion="{
          initial: { opacity: 0, x: -20 },
          enter: { opacity: 1, x: 0, transition: { delay: 0.2, type: 'spring' } },
        }"
      >
        <div class="cgu-sidebar__card">
          <BasicText
            size="h5"
            weight="bold"
            color="neutral-900"
            class="mb-4"
          >
            {{ $t('cgu.page.summary') }}
          </BasicText>
          <nav class="cgu-nav">
            <a
              v-for="(article, index) in articles"
              :key="index"
              :href="`#article-${index}`"
              class="cgu-nav__link"
              @click.prevent="scrollTo(index)"
            >
              <span class="cgu-nav__number">{{ index + 1 }}.</span>
              <span class="cgu-nav__text">{{ article.shortTitle }}</span>
            </a>
          </nav>

          <div class="cgu-sidebar__divider"></div>

          <PremiumButton
            :label="$t('cgu.page.print')"
            type="secondary"
            variant="ghost"
            size="sm"
            icon-left="Printer"
            width="full"
            @click="printPage"
          />
        </div>
      </aside>

      <main
        class="cgu-content"
        v-motion="{
          initial: { opacity: 0, y: 20 },
          enter: { opacity: 1, y: 0, transition: { delay: 0.1, type: 'spring' } },
        }"
      >
        <div class="cgu-paper">
          <div class="cgu-paper__header">
            <div class="cgu-paper__meta">
              <div class="cgu-badge">{{ $t('cgu.page.version') }}</div>
              <BasicText
                size="body-s"
                color="neutral-500"
              >
                {{ $t('cgu.page.updated') }}
              </BasicText>
            </div>

            <BasicText
              size="h2"
              weight="bold"
              class="cgu-paper__title"
            >
              {{ $t('cgu.page.title') }}
            </BasicText>

            <BasicText
              size="body-m"
              color="neutral-600"
              class="cgu-paper__intro"
            >
              {{ $t('cgu.page.intro') }}
            </BasicText>
          </div>

          <div class="cgu-paper__divider"></div>

          <div class="cgu-paper__body">
            <section
              v-for="(article, index) in articles"
              :key="index"
              :id="`article-${index}`"
              class="cgu-article"
            >
              <div class="cgu-article__header">
                <span class="cgu-article__number">0{{ index + 1 }}</span>
                <BasicText
                  size="h4"
                  weight="bold"
                  color="neutral-900"
                >
                  {{ article.title }}
                </BasicText>
              </div>

              <div class="cgu-article__content">
                <p
                  v-for="(paragraph, pIndex) in article.content"
                  :key="pIndex"
                  v-html="paragraph"
                ></p>
              </div>
            </section>
          </div>

          <div class="cgu-paper__footer">
            <img
              src="@/assets/logo-app.png"
              alt="Logo"
              class="cgu-footer-logo"
            />
            <BasicText
              size="body-s"
              color="neutral-400"
            >
              {{ $t('cgu.page.footer') }}
            </BasicText>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useHead } from '@vueuse/head'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'

  // Configuration SEO pour les CGU
  useHead({
    title: "Conditions Générales d'Utilisation - Atlas Lab Solutions",
    meta: [
      {
        name: 'description',
        content:
          "Consultez les conditions générales d'utilisation d'Atlas Lab Solutions. Informations légales sur l'utilisation de notre site et l'achat de peptides de recherche.",
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://fast-peptides.com/cgu',
      },
    ],
  })

  const { t } = useI18n()

  function printPage() {
    window.print()
  }

  function scrollTo(index: number) {
    const el = document.getElementById(`article-${index}`)
    if (el) {
      // Scroll avec un décalage pour le header sticky éventuel
      const y = el.getBoundingClientRect().top + window.pageYOffset - 100
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const articles = computed(() => [
    {
      shortTitle: t('cgu.articles.article1.shortTitle'),
      title: t('cgu.articles.article1.title'),
      content: [
        t('cgu.articles.article1.paragraph1'),
        t('cgu.articles.article1.paragraph2'),
        t('cgu.articles.article1.paragraph3'),
      ],
    },
    {
      shortTitle: t('cgu.articles.article2.shortTitle'),
      title: t('cgu.articles.article2.title'),
      content: [
        t('cgu.articles.article2.paragraph1'),
        t('cgu.articles.article2.paragraph2'),
        t('cgu.articles.article2.paragraph3'),
        t('cgu.articles.article2.paragraph4'),
        t('cgu.articles.article2.paragraph5'),
      ],
    },
    {
      shortTitle: t('cgu.articles.article3.shortTitle'),
      title: t('cgu.articles.article3.title'),
      content: [
        t('cgu.articles.article3.paragraph1'),
        t('cgu.articles.article3.paragraph2'),
        t('cgu.articles.article3.paragraph3'),
      ],
    },
    {
      shortTitle: t('cgu.articles.article4.shortTitle'),
      title: t('cgu.articles.article4.title'),
      content: [
        t('cgu.articles.article4.paragraph1'),
        t('cgu.articles.article4.paragraph2'),
        t('cgu.articles.article4.paragraph3'),
      ],
    },
    {
      shortTitle: t('cgu.articles.article5.shortTitle'),
      title: t('cgu.articles.article5.title'),
      content: [
        t('cgu.articles.article5.paragraph1'),
        t('cgu.articles.article5.paragraph2'),
        t('cgu.articles.article5.paragraph3'),
        t('cgu.articles.article5.paragraph4'),
      ],
    },
    {
      shortTitle: t('cgu.articles.article6.shortTitle'),
      title: t('cgu.articles.article6.title'),
      content: [
        t('cgu.articles.article6.paragraph1'),
        t('cgu.articles.article6.paragraph2'),
        t('cgu.articles.article6.paragraph3'),
      ],
    },
    {
      shortTitle: t('cgu.articles.article7.shortTitle'),
      title: t('cgu.articles.article7.title'),
      content: [
        t('cgu.articles.article7.paragraph1'),
        t('cgu.articles.article7.paragraph2'),
      ],
    },
    {
      shortTitle: t('cgu.articles.article8.shortTitle'),
      title: t('cgu.articles.article8.title'),
      content: [
        t('cgu.articles.article8.paragraph1'),
        t('cgu.articles.article8.paragraph2'),
        t('cgu.articles.article8.paragraph3'),
      ],
    },
    {
      shortTitle: t('cgu.articles.article9.shortTitle'),
      title: t('cgu.articles.article9.title'),
      content: [
        t('cgu.articles.article9.paragraph1'),
        t('cgu.articles.article9.paragraph2'),
        t('cgu.articles.article9.paragraph3'),
      ],
    },
  ])
</script>

<style scoped lang="less">
  .cgu-page {
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 30px 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  // --- LAYOUT GRID ---
  .cgu-layout {
    display: grid;
    grid-template-columns: 260px 1fr; // Sidebar fixe + Contenu fluide
    gap: 40px;
    align-items: start;

    @media (max-width: 900px) {
      grid-template-columns: 1fr; // Une seule colonne sur mobile/tablette
    }
  }

  // --- SIDEBAR (NAVIGATION) ---
  .cgu-sidebar {
    position: sticky;
    top: 100px; // Sticky sous le header du site

    &__card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    }

    &__divider {
      height: 1px;
      background: @neutral-200; // Var Less
      margin: 16px 0;
    }
  }

  .cgu-nav {
    display: flex;
    flex-direction: column;
    gap: 2px;

    &__link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(var(--primary-50-rgb), 0.5);

        .cgu-nav__number {
          color: var(--primary-600);
        }
        .cgu-nav__text {
          color: var(--primary-700);
          transform: translateX(2px);
        }
      }
    }

    &__number {
      font-family: monospace;
      font-size: 12px;
      color: @neutral-400; // Var Less
      width: 20px;
    }

    &__text {
      font-size: 14px;
      font-weight: 500;
      color: @neutral-600; // Var Less
      transition: transform 0.2s ease;
    }
  }

  // --- PAPIER CENTRAL ---
  .cgu-paper {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid @neutral-100; // Var Less
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
    padding: 60px;
    position: relative;
    overflow: hidden;

    // Petit accent décoratif en haut
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: linear-gradient(90deg, var(--primary-400), var(--secondary-400));
    }

    &__header {
      margin-bottom: 40px;
    }

    &__meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    &__title {
      // Dégradé sur le titre aussi
      background: linear-gradient(90deg, @neutral-900, @neutral-700);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }

    &__intro {
      max-width: 600px;
    }

    &__divider {
      height: 1px;
      background: @neutral-100;
      margin-bottom: 40px;
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: 50px; // Espace généreux entre les articles
    }

    &__footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 1px solid @neutral-100;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      opacity: 0.6;

      .cgu-footer-logo {
        width: 40px;
        filter: grayscale(100%);
      }
    }
  }

  .cgu-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    background: var(--primary-50);
    color: var(--primary-700);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  // --- STYLE DES ARTICLES ---
  .cgu-article {
    scroll-margin-top: 120px; // Pour que le scroll s'arrête proprement sous le header

    &__header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    &__number {
      font-size: 32px;
      font-weight: 900;
      color: @neutral-100; // Numéro très clair en fond
      line-height: 1;
    }

    &__content {
      padding-left: 0;

      p {
        font-size: 15px;
        line-height: 1.7;
        color: @neutral-700;
        margin-bottom: 12px;
        text-align: justify;

        &:last-child {
          margin-bottom: 0;
        }

        :deep(.link) {
          color: var(--primary-600);
          text-decoration: none;
          font-weight: 500;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  // --- RESPONSIVE ---
  @media (max-width: 900px) {
    .cgu-sidebar {
      display: none; // On cache le sommaire sticky sur mobile pour simplifier
    }
  }

  @media (max-width: 600px) {
    .cgu-page {
      padding: 20px 10px;
    }
    .cgu-paper {
      padding: 30px 20px;
    }

    .cgu-article__header {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .cgu-article__number {
      font-size: 24px;
      color: var(--primary-200); // Plus visible sur mobile
    }

    .cgu-article__content p {
      text-align: left;
    }
  }

  // --- PRINT ---
  @media print {
    .cgu-sidebar,
    .page-header,
    .cgu-header-actions {
      display: none;
    }
    .cgu-paper {
      box-shadow: none;
      border: none;
      padding: 0;
    }
    .cgu-page {
      padding: 0;
    }
  }
</style>
