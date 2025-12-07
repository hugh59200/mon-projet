<template>
  <footer class="footer">
    <!-- Gradient overlay decoratif -->
    <div class="footer__glow"></div>

    <div class="footer__container">
      <!-- Main grid: Brand + Nav + Newsletter -->
      <div class="footer__main">
        <!-- Brand column -->
        <div class="footer__brand">
          <BasicIconNext
            name="fastPeptides"
            :size="36"
            class="footer__logo"
          />
          <p class="footer__tagline">{{ t('footer.description') }}</p>
          <div class="footer__contact-inline">
            <a href="mailto:contact@fast-peptides.com" class="footer__contact-link">
              <BasicIconNext name="Mail" :size="14" />
              <span>contact@fast-peptides.com</span>
            </a>
          </div>
        </div>

        <!-- Navigation columns -->
        <nav class="footer__nav">
          <div class="footer__nav-col">
            <h5 class="footer__nav-title">{{ t('footer.quickLinks') }}</h5>
            <ul class="footer__nav-list">
              <li><RouterLink to="/">{{ t('nav.home') }}</RouterLink></li>
              <li><RouterLink to="/catalogue">{{ t('nav.catalogue') }}</RouterLink></li>
              <li><RouterLink to="/actualites">{{ t('nav.news') }}</RouterLink></li>
              <li><RouterLink to="/faq">{{ t('nav.faq') }}</RouterLink></li>
              <li><RouterLink to="/a-propos">{{ t('nav.about') }}</RouterLink></li>
            </ul>
          </div>

          <div class="footer__nav-col">
            <h5 class="footer__nav-title">{{ t('profile.title') }}</h5>
            <ul class="footer__nav-list">
              <li><RouterLink to="/profil">{{ t('nav.profile') }}</RouterLink></li>
              <li><RouterLink to="/profil/commandes">{{ t('nav.orders') }}</RouterLink></li>
              <li><RouterLink to="/auth/login">{{ t('nav.login') }}</RouterLink></li>
              <li><RouterLink to="/auth/register">{{ t('nav.register') }}</RouterLink></li>
            </ul>
          </div>

          <div class="footer__nav-col">
            <h5 class="footer__nav-title">{{ t('footer.legal') }}</h5>
            <ul class="footer__nav-list">
              <li><RouterLink to="/checkout">{{ t('product.trustBadges.secure') }}</RouterLink></li>
              <li><RouterLink to="/suivi-commande">{{ t('tracking.title') }}</RouterLink></li>
              <li><RouterLink to="/cgu">{{ t('footer.terms') }}</RouterLink></li>
              <li><RouterLink to="/guide-reconstitution">{{ t('reconstitution.title') }}</RouterLink></li>
            </ul>
          </div>
        </nav>

        <!-- Newsletter column -->
        <div class="footer__newsletter-col">
          <h5 class="footer__nav-title">{{ t('newsletter.title') }}</h5>
          <NewsletterSignup
            variant="compact"
            source="footer"
            class="footer__newsletter"
          />
        </div>
      </div>

      <!-- Trust bar -->
      <div class="footer__trust">
        <div class="footer__trust-payments">
          <span class="footer__trust-label">{{ t('footer.securePayments') }}</span>
          <div class="footer__trust-icons">
            <BasicIconNext name="Bitcoin" :size="20" class="footer__payment-icon footer__payment-icon--crypto" />
            <span class="footer__crypto-label">BTC</span>
            <span class="footer__crypto-label">USDT</span>
          </div>
        </div>

        <div class="footer__trust-badges">
          <div class="footer__trust-badge">
            <BasicIconNext name="Lock" :size="16" />
            <span>{{ t('footer.sslSecure') }}</span>
          </div>
          <div class="footer__trust-badge">
            <BasicIconNext name="ShieldCheck" :size="16" />
            <span>{{ t('product.trustBadges.quality') }}</span>
          </div>
          <div class="footer__trust-badge">
            <BasicIconNext name="Truck" :size="16" />
            <span>{{ t('product.trustBadges.shipping') }}</span>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="footer__bottom">
        <p class="footer__copyright">{{ t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
        <div class="footer__legal-links">
          <RouterLink to="/mentions-legales">{{ t('footer.legalNotice') }}</RouterLink>
          <RouterLink to="/politique-confidentialite">{{ t('footer.privacy') }}</RouterLink>
          <RouterLink to="/cookies">{{ t('footer.cookies') }}</RouterLink>
        </div>
        <div class="footer__bottom-right">
          <span class="footer__version">v1.0</span>
          <div class="footer__locale">
            <BasicIconNext name="Globe" :size="14" />
            <span>{{ currentLocaleInfo?.code.toUpperCase() }}</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { useLanguage } from '@/composables/useLanguage'
  import NewsletterSignup from '@/features/newsletter/components/NewsletterSignup.vue'

  const { t, currentLocaleInfo } = useLanguage()
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

  .footer {
    position: relative;
    background: linear-gradient(180deg, #0a0a0f 0%, #050508 100%);
    overflow: hidden;

    // ============================================
    // GLOW EFFECT
    // ============================================
    &__glow {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--primary-500), transparent);
      opacity: 0.4;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 10%;
        right: 10%;
        height: 80px;
        background: radial-gradient(
          ellipse at top,
          rgba(var(--primary-500-rgb), 0.1) 0%,
          transparent 70%
        );
        pointer-events: none;
      }
    }

    // ============================================
    // CONTAINER
    // ============================================
    &__container {
      position: relative;
      max-width: 1280px;
      margin: 0 auto;
      padding: 48px 40px 24px;
    }

    // ============================================
    // MAIN GRID (Brand + Nav + Newsletter)
    // ============================================
    &__main {
      display: grid;
      grid-template-columns: 1.4fr 2fr 1fr;
      gap: 48px;
      padding-bottom: 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    // ============================================
    // BRAND
    // ============================================
    &__brand {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__logo {
      color: var(--primary-400);
    }

    &__tagline {
      font-family: @font-body;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.6;
      margin: 0;
      max-width: 260px;
    }

    &__contact-inline {
      margin-top: 4px;
    }

    &__contact-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: @font-body;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.4);
      text-decoration: none;
      transition: color 0.2s @ease;

      svg {
        color: var(--primary-500);
        opacity: 0.7;
      }

      &:hover {
        color: var(--primary-400);

        svg {
          opacity: 1;
        }
      }
    }

    // ============================================
    // NAVIGATION
    // ============================================
    &__nav {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    &__nav-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__nav-title {
      font-family: @font-display;
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin: 0 0 4px;
    }

    &__nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;

      li {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      a,
      span {
        font-family: @font-body;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.45);
        text-decoration: none;
        transition: all 0.2s @ease;
      }

      a:hover {
        color: var(--primary-400);
      }

      svg {
        color: rgba(255, 255, 255, 0.25);
        flex-shrink: 0;
      }

      &--contact {
        gap: 10px;

        a,
        span {
          font-size: 12px;
        }
      }
    }

    // ============================================
    // NEWSLETTER COLUMN
    // ============================================
    &__newsletter-col {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__newsletter {
      width: 100%;
    }

    // ============================================
    // TRUST BAR
    // ============================================
    &__trust {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 32px;
      margin-top: 24px;
      padding: 20px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }

    &__trust-payments {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &__trust-label {
      font-family: @font-body;
      font-size: 11px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.35);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    &__trust-icons {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__payment-icon {
      &--crypto {
        color: #f7931a;
        opacity: 0.7;
      }
    }

    &__crypto-label {
      font-family: @font-body;
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      padding: 3px 8px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 4px;
      transition: all 0.2s @ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.7);
      }
    }

    &__trust-badges {
      display: flex;
      gap: 20px;
    }

    &__trust-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: @font-body;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.45);

      svg {
        color: #10b981;
      }
    }

    // ============================================
    // BOTTOM BAR
    // ============================================
    &__bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      margin-top: 20px;
    }

    &__copyright {
      font-family: @font-body;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.35);
      margin: 0;
    }

    &__legal-links {
      display: flex;
      gap: 20px;

      a {
        font-family: @font-body;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.35);
        text-decoration: none;
        transition: color 0.2s @ease;

        &:hover {
          color: var(--primary-400);
        }
      }
    }

    &__bottom-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &__version {
      font-family: @font-body;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.25);
      padding: 3px 8px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 4px;
    }

    &__locale {
      display: flex;
      align-items: center;
      gap: 5px;
      font-family: @font-body;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transition: color 0.2s @ease;

      &:hover {
        color: white;
      }
    }

    // ============================================
    // RESPONSIVE - Utilise les mixins harmonisés
    // ============================================

    // Tablet (≤ 1160px)
    .respond-tablet({
      &__main {
        grid-template-columns: 1fr 1fr;
        gap: 32px;
      }

      &__brand {
        grid-column: 1 / -1;
        flex-direction: row;
        align-items: center;
        gap: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      }

      &__tagline {
        max-width: 300px;
      }

      &__contact-inline {
        margin-top: 0;
        margin-left: auto;
      }

      &__nav {
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
      }

      &__newsletter-col {
        justify-self: end;
        max-width: 240px;
      }
    });

    // Mobile (≤ 720px)
    .respond-mobile({
      &__container {
        padding: 32px 20px 20px;
      }

      &__main {
        grid-template-columns: 1fr auto;
        grid-template-rows: auto auto;
        gap: 20px;

        // Micro résolution : stack vertical
        @media (max-width: 480px) {
          grid-template-columns: 1fr;
          grid-template-rows: auto auto auto;
          gap: 24px;
        }
      }

      // Brand à gauche, row 1
      &__brand {
        grid-row: 1;
        grid-column: 1;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        padding-bottom: 0;
        border-bottom: none;

        @media (max-width: 480px) {
          align-items: center;
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
      }

      &__tagline {
        font-size: 11px;
        line-height: 1.5;
      }

      &__contact-inline {
        margin-left: 0;
        margin-top: 4px;
      }

      &__contact-link {
        font-size: 11px;
      }

      // Newsletter à droite, row 1
      &__newsletter-col {
        grid-row: 1;
        grid-column: 2;
        justify-self: end;
        align-self: start;
        max-width: 160px;

        .footer__nav-title {
          font-size: 9px;
          margin-bottom: 10px;
        }

        @media (max-width: 480px) {
          grid-row: 2;
          grid-column: 1;
          justify-self: stretch;
          max-width: none;
          text-align: center;

          .footer__nav-title {
            text-align: center;
          }
        }
      }

      // Nav en dessous, row 2, pleine largeur
      &__nav {
        grid-row: 2;
        grid-column: 1 / -1;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        padding-top: 20px;
        margin-top: 4px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);

        @media (max-width: 480px) {
          grid-row: 3;
          grid-template-columns: 1fr 1fr;
          gap: 20px 16px;
        }
      }

      &__nav-col {
        gap: 8px;
      }

      &__nav-title {
        font-size: 9px;
        letter-spacing: 0.6px;
        margin-bottom: 2px;
      }

      &__nav-list {
        gap: 5px;
      }

      &__nav-list a,
      &__nav-list span {
        font-size: 11px;
      }

      // Trust bar compact
      &__trust {
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 16px 0;
      }

      &__trust-payments {
        flex-direction: row;
        gap: 12px;
        align-items: center;
      }

      &__trust-badges {
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px 20px;
      }

      &__trust-badge {
        font-size: 11px;
      }

      // Bottom centré
      &__bottom {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 10px;
      }

      &__legal-links {
        justify-content: center;
        flex-wrap: wrap;
        gap: 6px 14px;

        a {
          font-size: 11px;
        }
      }

      &__copyright {
        font-size: 10px;
        order: 1;
      }

      &__bottom-right {
        order: 0;
        margin-bottom: 2px;
      }
    });

  }
</style>
