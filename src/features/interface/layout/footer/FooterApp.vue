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
            <li><RouterLink to="/terms">CGU</RouterLink></li>
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
  import { ref } from 'vue'
  const { isDesktop } = useDeviceBreakpoint()
  const toggleModal = ref(false)
</script>

<style scoped lang="less">
  .footer {
    position: relative;
    z-index: 1;
    background: @neutral-800;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 70px 8vw 25px;
    gap: 60px;
    font-family: 'Inter', sans-serif;

    /* === Zone principale === */
    &__main {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-start; /* ✅ évite la contraction verticale */
      gap: 60px;
    }

    /* === Bloc logo + disclaimer côte à côte === */
    &__brand {
      flex: 2;
      display: flex;
      align-items: flex-start; /* ✅ empêche le disclaimer d'être centré verticalement */
      justify-content: flex-start;
      gap: 40px;
      min-width: 420px;

      .footer__brand-left {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .footer__logo {
        width: clamp(140px, 18vw, 220px);
        object-fit: contain;
        filter: brightness(1.1);
      }

      .footer__divider {
        width: 1px;
        height: 80%;
        background: fade(white, 15%);
        backdrop-filter: blur(2px);
      }

      .footer__brand-right {
        flex: 1;
        display: flex;
        align-items: flex-start; /* ✅ alignement haut */
        justify-content: flex-start;
        min-width: 400px;
        margin-right: 40px; /* 💡 espace avec les colonnes à droite */
      }

      /* === Bloc disclaimer === */
      .footer__disclaimer {
        position: relative;
        z-index: 0;
        flex: 1;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: linear-gradient(145deg, fade(white, 7%), fade(black, 5%));
        border: 1px solid fade(white, 18%);
        border-radius: 12px;
        padding: 28px 30px;
        box-shadow: 0 4px 14px fade(black, 25%);
        color: fade(white, 88%);
        overflow: hidden;
        width: 100%;
        transition: all 0.3s ease;

        &:hover {
          background: linear-gradient(145deg, fade(white, 10%), fade(black, 7%));
        }

        .footer__quote-icon {
          position: absolute;
          top: 16px;
          left: 20px;
          opacity: 0.25;
        }

        .footer__disclaimer-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px 24px;
          margin-left: 18px;

          .footer__disclaimer-item {
            display: flex;
            align-items: flex-start;
            p {
              font-size: 14px;
              line-height: 1.6;
              margin: 0;
              text-align: justify;
              strong {
                color: @primary-200;
              }
            }
          }
        }
      }
    }

    /* === Colonnes === */
    &__columns {
      flex: 2;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 40px 30px;
      align-items: flex-start;
    }

    a {
      color: fade(white, 85%);
      text-decoration: none;
      font-size: 14px;
      transition: color 0.2s ease;
      &:hover {
        color: @primary-300;
      }
    }

    /* === Newsletter === */
    &__newsletter {
      display: flex;
      margin-top: 10px;
      gap: 6px;
      &-input {
        flex: 1;
      }
    }

    /* === Ligne basse === */
    &__bottom {
      border-top: 1px solid fade(white, 18%);
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;

      .footer__version {
        cursor: pointer;
        transition: color 0.2s ease;
        &:hover {
          color: @primary-300;
        }
      }
    }

    /* === Responsive === */
    @media (max-width: 1250px) {
      &__brand {
        gap: 28px;

        .footer__disclaimer {
          padding: 22px 24px;
          .footer__disclaimer-grid {
            grid-template-columns: 1fr;
          }
        }
      }
    }

    @media (max-width: 950px) {
      &__brand {
        flex-direction: column;
        align-items: center;
        text-align: center;

        .footer__divider {
          display: none;
        }

        .footer__disclaimer {
          max-width: 600px;
        }
      }
    }

    @media (max-width: 700px) {
      padding: 50px 6vw 20px;
      gap: 40px;
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

  @media (max-width: 1500px) {
    .footer__brand-right {
      display: none !important;
    }

    .footer__brand {
      justify-content: center;
      align-self: center;
      flex: 1;
    }
  }
</style>
