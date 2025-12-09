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
              <li><RouterLink to="/ressources">{{ t('nav.resources') }}</RouterLink></li>
              <li><RouterLink to="/glossaire">{{ t('nav.glossary') }}</RouterLink></li>
              <li><RouterLink to="/faq">{{ t('nav.faq') }}</RouterLink></li>
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
              <li><RouterLink to="/status">{{ t('footer.status') }}</RouterLink></li>
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
    background: linear-gradient(180deg, var(--footer-bg-start) 0%, var(--footer-bg-end) 100%);
    overflow: hidden;
    transition: background 0.3s ease;
    border-top: 1px solid var(--chrome-border);

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
      padding: 40px 24px;
    }

    // ============================================
    // MAIN GRID (Brand + Nav + Newsletter)
    // ============================================
    &__main {
      display: grid;
      grid-template-columns: 1.4fr 2fr 1fr;
      gap: 48px;
      padding-bottom: 32px;
      border-bottom: 1px solid var(--chrome-border-subtle);
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
      color: var(--chrome-text-muted);
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
      color: var(--chrome-text-subtle);
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
      color: var(--chrome-text-muted);
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
        color: var(--chrome-text-subtle);
        text-decoration: none;
        transition: all 0.2s @ease;
      }

      a:hover {
        color: var(--primary-400);
      }

      svg {
        color: var(--chrome-border);
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
      padding: 20px 0;
      border-top: 1px solid var(--chrome-border-subtle);
      border-bottom: 1px solid var(--chrome-border-subtle);
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
      color: var(--chrome-text-subtle);
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
      color: var(--chrome-text-muted);
      padding: 3px 8px;
      background: var(--chrome-hover);
      border-radius: 4px;
      transition: all 0.2s @ease;

      &:hover {
        background: var(--chrome-active);
        color: var(--chrome-text);
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
      color: var(--chrome-text-subtle);

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
      color: var(--chrome-text-subtle);
      margin: 0;
    }

    &__legal-links {
      display: flex;
      gap: 20px;

      a {
        font-family: @font-body;
        font-size: 12px;
        color: var(--chrome-text-subtle);
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
      color: var(--chrome-border);
      padding: 3px 8px;
      background: var(--chrome-hover);
      border-radius: 4px;
    }

    &__locale {
      display: flex;
      align-items: center;
      gap: 5px;
      font-family: @font-body;
      font-size: 12px;
      color: var(--chrome-text-subtle);
      cursor: pointer;
      transition: color 0.2s @ease;

      &:hover {
        color: var(--chrome-text);
      }
    }

    // ============================================
    // RESPONSIVE - Utilise les mixins harmonisés
    // ============================================

    // Tablet (≤ 1160px)
    .respond-tablet({
      &__main {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        gap: 32px;
        text-align: center;
      }

      // Brand et Newsletter côte à côte, space-around
      &__brand {
        grid-row: 1;
        grid-column: 1;
        flex-direction: column;
        align-items: center;
        justify-self: center;
        gap: 16px;
      }

      &__tagline {
        max-width: 280px;
      }

      &__contact-inline {
        margin-top: 0;
        margin-left: 0;
      }

      &__newsletter-col {
        grid-row: 1;
        grid-column: 2;
        justify-self: center;
        align-self: center;
        max-width: 280px;
      }

      // Nav en dessous, pleine largeur
      &__nav {
        grid-row: 2;
        grid-column: 1 / -1;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        justify-items: center;
        padding-top: 24px;
        border-top: 1px solid var(--chrome-border-subtle);
      }

      &__nav-col {
        align-items: center;
      }
    });

    // Mobile (≤ 720px)
    .respond-mobile({
      &__container {
        padding: 24px 20px 20px;
      }

      &__tagline {
        font-size: 11px;
        line-height: 1.5;
        max-width: 240px;
      }

      &__contact-inline {
        margin-left: 0;
        margin-top: 4px;
      }

      &__contact-link {
        font-size: 11px;
      }

      &__newsletter-col {
        max-width: 240px;

        .footer__nav-title {
          font-size: 9px;
          margin-bottom: 10px;
        }
      }

      // Nav
      &__nav {
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        padding-top: 20px;
        border-top: 1px solid var(--chrome-border-subtle);
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

    // Très petit mobile (≤ 480px) - Brand et Newsletter en colonne
    @media (max-width: 480px) {
      &__main {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        gap: 24px;
      }

      &__brand {
        grid-row: 1;
        grid-column: 1;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--chrome-border-subtle);
      }

      &__newsletter-col {
        grid-row: 2;
        grid-column: 1;
        max-width: 320px;
      }

      &__nav {
        grid-row: 3;
        grid-column: 1;
      }
    }

  }
</style>
