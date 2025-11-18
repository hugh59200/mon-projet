<template>
  <footer class="footer">
    <div class="footer__main">
      <!-- 🔹 Bloc logo + disclaimer (horizontal quand desktop) -->
      <div
        v-if="isDesktop"
        class="footer__brand"
      >
        <div class="footer__brand-left">
          <img
            src="@/assets/logo-app.png"
            alt="Fast Peptides Logo"
            class="footer__logo"
          />
        </div>

        <div class="footer__brand-right">
          <div class="footer__disclaimer">
            <BasicIconNext
              name="Quote"
              :size="22"
              class="footer__quote-icon"
            />
            <div class="footer__disclaimer-grid">
              <div class="footer__disclaimer-item">
                <p>
                  <strong>Research Use Only :</strong>
                  Tous nos produits sont exclusivement destinés à la recherche scientifique et
                  analytique. Ils ne sont pas destinés à un usage humain, thérapeutique ou médical.
                </p>
              </div>
              <div class="footer__disclaimer-item">
                <p>
                  <strong>Not Medical Products :</strong>
                  Aucune substance listée ici ne doit être utilisée ou présentée comme médicament.
                </p>
              </div>
              <div class="footer__disclaimer-item">
                <p>
                  <strong>Responsabilité :</strong>
                  L’acheteur est responsable du respect de la législation locale. Fast-Peptides
                  décline toute responsabilité en cas de mauvaise utilisation.
                </p>
              </div>
              <div class="footer__disclaimer-item">
                <p>
                  <strong>Conformité :</strong>
                  L’achat implique la compréhension et l’acceptation des conditions “Research Use
                  Only”.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 🔹 Liens (centrés verticalement par rapport au bloc de gauche) -->
      <div class="footer__columns">
        <div class="footer__col">
          <BasicText
            size="h5"
            weight="bold"
            class="footer__col-title"
          >
            À propos
          </BasicText>
          <ul>
            <li><RouterLink to="/">Accueil</RouterLink></li>
            <li><RouterLink to="/catalogue">Catalogue</RouterLink></li>
            <li><RouterLink to="/actualites">Actualités</RouterLink></li>
            <li><RouterLink to="/faq">FAQ</RouterLink></li>
          </ul>
        </div>

        <div class="footer__col">
          <BasicText
            size="h5"
            weight="bold"
            class="footer__col-title"
          >
            Mon compte
          </BasicText>
          <ul>
            <li><RouterLink to="/profil">Profil</RouterLink></li>
            <li><RouterLink to="/profil/commandes">Commandes</RouterLink></li>
            <li><RouterLink to="/auth/login">Connexion</RouterLink></li>
            <li><RouterLink to="/auth/register">Inscription</RouterLink></li>
          </ul>
        </div>

        <div class="footer__col">
          <BasicText
            size="h5"
            weight="bold"
            class="footer__col-title"
          >
            Informations
          </BasicText>
          <ul>
            <li><RouterLink to="/checkout">Paiement sécurisé</RouterLink></li>
            <li><RouterLink to="/profil/commandes">Suivi de commande</RouterLink></li>
            <li><RouterLink to="/access-denied">Confidentialité</RouterLink></li>
            <!-- <li><RouterLink to="/terms">CGU</RouterLink></li> -->
          </ul>
        </div>

        <div class="footer__col">
          <BasicText
            size="h5"
            weight="bold"
            class="footer__col-title"
          >
            Newsletter
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-400"
          >
            Recevez nos nouveautés et mises à jour scientifiques.
          </BasicText>
          <div class="footer__newsletter">
            <BasicInput
              placeholder="Votre email"
              input-type="form"
              icon-name="Mail"
              size="small"
              class="footer__newsletter-input"
            />
            <BasicButton
              type="primary"
              label="S'inscrire"
              class="footer__newsletter-btn"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 🔹 Bas de page -->
    <div class="footer__bottom">
      <BasicText
        size="body-s"
        color="neutral-300"
      >
        © 2025 Fast-Peptides — Tous droits réservés.
      </BasicText>
      <BasicText
        size="body-s"
        color="neutral-400"
        class="footer__version"
        pointer
      >
        Version 1.0
      </BasicText>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  const { isDesktop } = useDeviceBreakpoint()
</script>

<style scoped lang="less">
  .footer {
    position: relative;
    z-index: 1;
    width: 100%;

    background: linear-gradient(90deg, color-mix(in srgb, black 2%, var(--secondary-900)), color-mix(in srgb, black 6%, var(--secondary-900)));

    padding: 60px 40px 30px;

    display: flex;
    flex-direction: column;
    gap: 60px;

    border-top: 1px solid color-mix(in srgb, var(--primary-500) 10%, transparent);
    box-shadow: 0 -4px 18px fade(#000, 45%);

    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    /* ======================================================
     MAIN CONTENT
  ====================================================== */
    &__main {
      display: flex;
      flex-wrap: wrap;
      gap: 60px;
      justify-content: space-between;
    }

    /* ======================================================
     BRAND BLOCK (Logo + disclaimer)
  ====================================================== */
    &__brand {
      display: flex;
      gap: 40px;
      align-items: flex-start;
      flex: 1.4;
      min-width: 380px;

      .footer__logo {
        width: clamp(140px, 15vw, 220px);
        filter: brightness(1.1);
      }

      .footer__disclaimer {
        flex: 1;
        padding: 26px 28px;

        background: color-mix(in srgb, @neutral-900 65%, transparent);
        border: 1px solid color-mix(in srgb, @neutral-100 10%, transparent);
        border-radius: 14px;

        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);

        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, @neutral-50 15%, transparent),
          0 8px 26px fade(#000, 55%);

        color: color-mix(in srgb, @neutral-200 90%, transparent);
        line-height: 1.55;

        position: relative;

        .footer__quote-icon {
          position: absolute;
          top: 14px;
          left: 16px;
          opacity: 0.18;
        }

        .footer__disclaimer-grid {
          margin-left: 16px;
          margin-top: 10px;
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(2, 1fr);

          strong {
            color: var(--primary-300);
          }
        }
      }
    }

    /* ======================================================
     COLUMNS BLOCK
  ====================================================== */
    &__columns {
      flex: 1.4;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 40px 30px;
    }

    &__col-title {
      margin-bottom: 14px;
      color: @neutral-100;
    }

    a {
      display: block;
      font-size: 14px;
      margin: 6px 0;
      color: color-mix(in srgb, @neutral-200 85%, transparent);
      text-decoration: none;
      transition: 0.2s ease;

      &:hover {
        color: var(--primary-300);
      }
    }

    /* ======================================================
     NEWSLETTER
  ====================================================== */
    &__newsletter {
      margin-top: 12px;
      display: flex;
      gap: 8px;
    }

    /* ======================================================
     BOTTOM BAR
  ====================================================== */
    &__bottom {
      border-top: 1px solid color-mix(in srgb, @neutral-100 10%, transparent);
      padding-top: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      color: color-mix(in srgb, @neutral-300 85%, transparent);

      .footer__version {
        cursor: pointer;
        transition: color 0.25s ease;

        &:hover {
          color: var(--primary-300);
        }
      }
    }

    /* ======================================================
     RESPONSIVE
  ====================================================== */
    @media (max-width: 1500px) {
      .footer__disclaimer-grid {
        grid-template-columns: 1fr !important;
      }
    }

    @media (max-width: 900px) {
      padding: 50px 28px 30px;

      .footer__main {
        flex-direction: column;
      }

      .footer__brand {
        flex-direction: column;
        text-align: center;

        .footer__disclaimer {
          transform: translateY(10px);
        }
      }
    }

    @media (max-width: 700px) {
      padding: 50px 20px 20px;

      &__columns {
        grid-template-columns: 1fr;
      }

      &__bottom {
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }
    }
  }
</style>
