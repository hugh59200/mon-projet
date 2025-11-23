<template>
  <div class="cgu-page">
    <PageHeader
      description="Consultez nos règles d’utilisation et mentions légales en toute transparence."
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
            Sommaire
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

          <BasicButton
            label="Imprimer"
            type="secondary"
            variant="ghost"
            size="small"
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
              <div class="cgu-badge">Version 1.0</div>
              <BasicText
                size="body-s"
                color="neutral-500"
              >
                Mis à jour en Janvier 2025
              </BasicText>
            </div>

            <BasicText
              size="h2"
              weight="bold"
              class="cgu-paper__title"
            >
              Conditions Générales d’Utilisation
            </BasicText>

            <BasicText
              size="body-m"
              color="neutral-600"
              class="cgu-paper__intro"
            >
              Bienvenue sur Fast Peptides. Veuillez lire attentivement ces conditions avant
              d'utiliser nos services.
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
              Document officiel généré par Fast Peptides SA.
            </BasicText>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import { BasicButton } from '@designSystem/components/basic/button'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'

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

  const articles = [
    {
      shortTitle: 'Objet',
      title: 'Objet & Périmètre',
      content: [
        'Les présentes Conditions Générales d’Utilisation (CGU) définissent les règles d’accès et d’utilisation du site Fast Peptides.',
        'Ce site a pour vocation de partager des informations à visée scientifique et éducative sur les peptides et la recherche en biologie.',
        'En naviguant sur le site, l’utilisateur reconnaît avoir pris connaissance et accepté les présentes conditions sans réserve.',
      ],
    },
    {
      shortTitle: 'Accès au site',
      title: 'Accès & Disponibilité',
      content: [
        'L’accès au site est libre et gratuit pour tout utilisateur disposant d’un accès à Internet.',
        'Le site peut être suspendu ou interrompu à tout moment pour maintenance, mise à jour ou modification de contenu.',
        'L’utilisateur s’engage à ne pas utiliser le site d’une manière susceptible d’en perturber le fonctionnement ou d’en altérer la sécurité.',
      ],
    },
    {
      shortTitle: 'Contenu & Resp.',
      title: 'Contenu et responsabilité',
      content: [
        'Les informations publiées sur le site Fast Peptides sont fournies à titre informatif.',
        'Elles ne constituent ni un conseil médical, ni une offre commerciale, ni une incitation à l’achat ou à l’utilisation de substances.',
        'Le propriétaire du site ne garantit pas l’exactitude ou la mise à jour des informations et décline toute responsabilité en cas d’erreur, d’omission ou d’interprétation incorrecte.',
        'L’utilisateur reste seul responsable de l’usage qu’il fait des informations consultées.',
      ],
    },
    {
      shortTitle: 'Avertissement Produits',
      title: 'Produits et avertissement',
      content: [
        'Les produits éventuellement mentionnés sur ce site sont destinés exclusivement à la recherche scientifique.',
        '<strong>Ils ne sont pas destinés à un usage humain ou vétérinaire</strong>, ni à la consommation, l’automédication ou l’application cosmétique.',
        'Toute utilisation contraire à ces règles est strictement interdite. L’utilisateur reconnaît être informé des précautions réglementaires applicables et agit sous sa seule responsabilité.',
      ],
    },
    {
      shortTitle: 'Comptes',
      title: 'Comptes utilisateurs',
      content: [
        'Si le site propose un espace utilisateur, la création d’un compte nécessite la fourniture d’informations exactes et à jour.',
        'L’utilisateur est responsable de la confidentialité de ses identifiants et de l’usage de son compte.',
        'Tout comportement frauduleux ou contraire aux présentes CGU pourra entraîner la suspension du compte.',
      ],
    },
    {
      shortTitle: 'Propriété Intellectuelle',
      title: 'Propriété intellectuelle',
      content: [
        'L’ensemble des éléments du site (textes, images, logo, structure, code source) est protégé par le droit d’auteur.',
        'Toute reproduction, copie ou diffusion sans autorisation préalable est interdite.',
      ],
    },
    {
      shortTitle: 'Données Perso',
      title: 'Données personnelles',
      content: [
        'Le site Fast Peptides peut collecter des données personnelles (adresse email, cookies, préférences utilisateur) afin d’améliorer la navigation et l’expérience utilisateur.',
        'Ces données ne sont jamais vendues ni transmises à des tiers sans consentement.',
        'Conformément au Règlement Général sur la Protection des Données (RGPD), tout utilisateur peut demander la suppression de ses données via l’adresse : <a href="mailto:privacy@fastpeptides.com" class="link">privacy@fastpeptides.com</a>.',
      ],
    },
    {
      shortTitle: 'Liens externes',
      title: 'Liens externes',
      content: [
        'Le site peut contenir des liens vers des sites externes à titre informatif.',
        'Le propriétaire du site n’exerce aucun contrôle sur ces contenus et ne saurait être tenu responsable des informations ou services proposés sur ces sites tiers.',
      ],
    },
    {
      shortTitle: 'Modification',
      title: 'Modification du contenu',
      content: [
        'Le propriétaire du site se réserve le droit de modifier à tout moment le contenu, la structure ou les présentes conditions d’utilisation.',
        'Les utilisateurs sont invités à les consulter régulièrement.',
      ],
    },
    {
      shortTitle: 'Droit applicable',
      title: 'Droit applicable',
      content: [
        'Les présentes conditions sont régies par le droit français.',
        'Tout litige relatif à leur interprétation ou leur exécution sera soumis aux tribunaux compétents du ressort du lieu de résidence du responsable du site.',
      ],
    },
    {
      shortTitle: 'Acceptation',
      title: 'Acceptation finale',
      content: [
        'En accédant au site Fast Peptides, l’utilisateur reconnaît avoir lu, compris et accepté l’ensemble des présentes conditions générales d’utilisation.',
      ],
    },
  ]
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
