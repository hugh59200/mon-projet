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
      shortTitle: 'Préambule',
      title: 'Article 1 : Préambule et Identité',
      content: [
        'Les présentes Conditions Générales de Vente (CGV) régissent exclusivement les relations contractuelles entre la société <strong>Atlas Lab Solutions LLC</strong>, immatriculée au Nouveau-Mexique (USA), dont le siège social est situé au 1209 Mountain Road PL NE, Albuquerque, NM 87110 (ci-après le "Vendeur") et toute personne visitant ou effectuant un achat sur le site.',
        "En validant sa commande, l'Acheteur déclare avoir la capacité juridique de contracter et accepte sans réserve les présentes conditions.",
        'Ce site est exclusivement destiné aux professionnels, chercheurs, laboratoires et institutions académiques.',
      ],
    },
    {
      shortTitle: 'Usage Recherche',
      title: 'Article 2 : Avertissement "Research Use Only" (RUO)',
      content: [
        '<strong>ATTENTION :</strong> Tous les produits vendus sur ce site sont des composés chimiques destinés <strong>exclusivement à la recherche en laboratoire et aux analyses in vitro</strong>.',
        'Ils ne sont <strong>PAS</strong> des médicaments, des produits alimentaires, des cosmétiques ou des dispositifs médicaux.',
        'Ils sont strictement interdits pour toute utilisation humaine (injection, ingestion, application topique) ou vétérinaire.',
        "L'Acheteur reconnaît être un chercheur qualifié ou un professionnel disposant des compétences et équipements nécessaires pour manipuler ces produits en toute sécurité.",
        "Le Vendeur se réserve le droit d'annuler toute commande s'il a des raisons de croire que les produits seront utilisés à des fins non conformes (usage personnel, dopage, automédication).",
      ],
    },
    {
      shortTitle: 'Produits',
      title: 'Article 3 : Caractéristiques des Produits',
      content: [
        'Les produits sont décrits avec la plus grande exactitude possible (fiche technique, pureté, séquence). Toutefois, les photos ne sont pas contractuelles.',
        "La pureté indiquée (ex: ≥98%) est certifiée par analyse HPLC. Des certificats d'analyse (COA) sont disponibles pour chaque lot.",
        'Les peptides sont livrés sous forme lyophilisée (poudre) et doivent être stockés selon les recommandations techniques (congélation) dès réception.',
      ],
    },
    {
      shortTitle: 'Prix & Paiement',
      title: 'Article 4 : Prix et Modalités de Paiement',
      content: [
        "Les prix sont affichés en Euros (€) toutes taxes comprises (TTC) pour l'Union Européenne.",
        'Le Vendeur se réserve le droit de modifier ses prix à tout moment, mais le produit sera facturé sur la base du tarif en vigueur au moment de la validation de la commande.',
        'Le paiement est exigible immédiatement à la commande via les moyens proposés (Virement Bancaire, Crypto-monnaies). Aucune expédition ne sera effectuée avant réception complète des fonds.',
      ],
    },
    {
      shortTitle: 'Livraison',
      title: 'Article 5 : Livraison et Risques',
      content: [
        "Les produits sont expédiés depuis notre plateforme logistique partenaire en France vers l'Union Européenne.",
        'Les délais de livraison (24h-72h) sont donnés à titre indicatif et ne sont pas garantis.',
        "Le transfert des risques s'opère au moment de la remise des produits au transporteur. Toutefois, en cas de perte confirmée par le transporteur, le Vendeur s'engage à réexpédier la commande à ses frais.",
        "L'Acheteur est responsable de la vérification de la légalité des produits importés dans son pays de résidence.",
      ],
    },
    {
      shortTitle: 'Rétractation',
      title: 'Article 6 : Absence de Droit de Rétractation',
      content: [
        'Compte tenu de la nature périssable et sensible des produits chimiques (nécessitant des conditions de stockage spécifiques), et conformément à la législation en vigueur sur la vente à distance de produits susceptibles de se détériorer rapidement :',
        "<strong>Le droit de rétractation ne s'applique pas.</strong>",
        "Aucun retour de produit ne sera accepté, sauf en cas d'erreur de préparation avérée de notre part ou de défaut de qualité prouvé par analyse indépendante.",
      ],
    },
    {
      shortTitle: 'Responsabilité',
      title: 'Article 7 : Limitation de Responsabilité',
      content: [
        "Atlas Lab Solutions LLC ne saurait être tenue pour responsable des dommages de toute nature, tant matériels qu'immatériels ou corporels, qui pourraient résulter d'une mauvaise utilisation des produits commercialisés.",
        'La responsabilité du Vendeur sera, en tout état de cause, limitée au montant de la commande et ne saurait être mise en cause pour de simples erreurs ou omissions qui auraient pu subsister malgré toutes les précautions prises dans la présentation des produits.',
      ],
    },
    {
      shortTitle: 'Données',
      title: 'Article 8 : Confidentialité des Données',
      content: [
        'Nous accordons une importance capitale à la confidentialité de vos données. Vos informations personnelles ne sont utilisées que pour le traitement de votre commande.',
        'Conformément à notre politique de confidentialité ("OpSec"), nous minimisons la conservation des données. Les informations sensibles liées aux commandes sont purgées régulièrement de nos serveurs connectés.',
        "Aucune donnée n'est revendue à des tiers.",
      ],
    },
    {
      shortTitle: 'Litiges',
      title: 'Article 9 : Droit Applicable et Juridiction',
      content: [
        "Les présentes conditions sont soumises au droit de l'État du Nouveau-Mexique (USA), siège social de l'entreprise.",
        "Toutefois, pour les consommateurs résidant dans l'Union Européenne, les règles impératives de protection du consommateur de leur pays de résidence peuvent s'appliquer.",
        'En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.',
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
