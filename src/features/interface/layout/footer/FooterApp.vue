<template>
  <footer class="footer">
    <div class="footer__main">
      <!-- 🔹 Bloc gauche : logo + disclaimer élargi -->
      <div class="footer__brand">
        <img
          src="@/assets/logo-app.png"
          alt="Fast Peptides Logo"
          class="footer__logo"
        />

        <div class="footer__disclaimer">
          <BasicIconNext
            name="Quote"
            :size="22"
            class="footer__quote-icon"
          />
          <div class="footer__disclaimer-text">
            <p>
              <strong>Research Use Only :</strong>
              Tous nos produits sont exclusivement destinés à la recherche scientifique et
              analytique.
              <br />
              Ils ne sont pas destinés à un usage humain, thérapeutique ou médical.
            </p>
            <p>
              <strong>Not Medical Products :</strong>
              Aucune substance listée ici ne doit être utilisée ou présentée comme médicament.
            </p>
            <p>
              <strong>Responsabilité :</strong>
              L’acheteur est responsable du respect de la législation locale. Fast-Peptides décline
              toute responsabilité en cas de mauvaise utilisation.
            </p>
          </div>
        </div>
      </div>

      <!-- 🔹 Bloc liens -->
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
            <li><RouterLink to="/access-denied">Politique de confidentialité</RouterLink></li>
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

    <!-- 🔹 Ligne basse -->
    <div class="footer__bottom">
      <BasicText
        size="body-s"
        color="neutral-300"
      >
        © 2025 Fast-Peptides. Tous droits réservés.
      </BasicText>

      <BasicText
        size="body-s"
        color="neutral-400"
        class="footer__version"
        @click="toggleModal = true"
        pointer
      >
        Version 1.0
      </BasicText>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import 'md-editor-v3/lib/style.css'
  import { ref } from 'vue'

  const toggleModal = ref(false)
</script>

<style scoped lang="less">
  .footer {
    background: @neutral-800;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 70px 8vw 25px;
    gap: 50px;
    font-family: 'Inter', sans-serif;

    /* --- Structure principale --- */
    &__main {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 60px;
    }

    /* --- Bloc logo + disclaimer grand format --- */
    &__brand {
      flex: 2;
      min-width: 420px;
      display: flex;
      justify-content: space-evenly;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 28px;

      .footer__logo {
        width: 220px;
        max-width: 260px;
        object-fit: contain;
        filter: brightness(1.1);
      }

      .footer__disclaimer {
        position: relative;
        background: fade(white, 4%);
        border: 1px solid fade(white, 25%);
        border-radius: 12px;
        padding: 28px 26px;
        font-size: 14px;
        line-height: 1.65;
        box-shadow: 0 4px 12px fade(black, 20%);
        max-width: 100%;
        color: fade(white, 88%);
        overflow: hidden;

        .footer__quote-icon {
          position: absolute;
          top: 16px;
          left: 20px;
          opacity: 0.25;
        }

        p + p {
          margin-top: 10px;
        }

        strong {
          color: @primary-200;
        }

        &:before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, fade(@primary-500, 10%) 0%, fade(black, 5%) 100%);
          pointer-events: none;
        }
      }
    }

    /* --- Liens --- */
    &__columns {
      flex: 2;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 30px;
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

    /* --- Newsletter --- */
    &__newsletter {
      display: flex;
      margin-top: 10px;
      gap: 6px;
      &-input {
        flex: 1;
      }
    }

    /* --- Ligne basse --- */
    &__bottom {
      border-top: 1px solid fade(white, 18%);
      padding-top: 18px;
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

    /* --- Responsive --- */
    @media (max-width: 1024px) {
      padding: 60px 6vw 25px;
      &__main {
        flex-direction: column;
        align-items: center;
        gap: 50px;
      }
      &__brand {
        align-items: center;
        text-align: center;
        .footer__disclaimer {
          text-align: left;
          max-width: 600px;
        }
      }
    }

    @media (max-width: 600px) {
      &__columns {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
