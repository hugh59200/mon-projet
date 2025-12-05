<template>
  <footer class="footer">
    <!-- Gradient overlay decoratif -->
    <div class="footer__glow"></div>

    <div class="footer__container">
      <!-- Top Section: Logo + Nav + Newsletter -->
      <div class="footer__top">
        <!-- Brand -->
        <div class="footer__brand">
          <BasicIconNext
            name="fastPeptides"
            :size="32"
            class="footer__logo"
          />
          <p class="footer__tagline">{{ t('footer.description') }}</p>
        </div>

        <!-- Navigation -->
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

          <div class="footer__nav-col">
            <h5 class="footer__nav-title">{{ t('footer.contact') }}</h5>
            <ul class="footer__nav-list footer__nav-list--contact">
              <li>
                <BasicIconNext name="Mail" :size="14" />
                <a href="mailto:contact@fast-peptides.com">contact@fast-peptides.com</a>
              </li>
              <li>
                <BasicIconNext name="Clock" :size="14" />
                <span>{{ t('footer.hours') }}</span>
              </li>
              <li>
                <BasicIconNext name="MapPin" :size="14" />
                <span>{{ t('footer.region') }}</span>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <!-- Disclaimer + Newsletter row -->
      <div class="footer__middle">
        <div class="footer__disclaimer">
          <div class="footer__disclaimer-badge">
            <BasicIconNext name="Shield" :size="16" />
            <span>{{ t('footer.researchOnly') }}</span>
          </div>
          <div class="footer__disclaimer-items">
            <span>
              <strong>{{ t('footer.disclaimer.research') }}</strong>
              — {{ t('footer.disclaimer.researchDesc') }}
            </span>
            <span class="footer__disclaimer-sep">•</span>
            <span>
              <strong>{{ t('footer.disclaimer.noHuman') }}</strong>
              — {{ t('footer.disclaimer.noHumanDesc') }}
            </span>
            <span class="footer__disclaimer-sep">•</span>
            <span>
              <strong>{{ t('footer.disclaimer.responsibility') }}</strong>
              — {{ t('footer.disclaimer.responsibilityDesc') }}
            </span>
          </div>
        </div>

        <NewsletterSignup
          variant="compact"
          source="footer"
          class="footer__newsletter"
        />
      </div>

      <!-- Trust bar -->
      <div class="footer__trust">
        <div class="footer__trust-payments">
          <span class="footer__trust-label">{{ t('footer.securePayments') }}</span>
          <div class="footer__trust-icons">
            <BasicIconNext name="visa" :size="32" class="footer__payment-icon" />
            <BasicIconNext name="mastercard" :size="32" class="footer__payment-icon" />
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
    // TOP SECTION
    // ============================================
    &__top {
      display: grid;
      grid-template-columns: 200px repeat(4, 1fr);
      gap: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    // ============================================
    // MIDDLE SECTION (Disclaimer + Newsletter)
    // ============================================
    &__middle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      margin-top: 24px;
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
      color: rgba(255, 255, 255, 0.45);
      line-height: 1.5;
      margin: 0;
    }

    // ============================================
    // NAVIGATION
    // ============================================
    &__nav {
      display: contents; // Les colonnes vont directement dans le grid parent
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
    // NEWSLETTER
    // ============================================
    &__newsletter {
      flex-shrink: 0;
      width: 220px;
    }

    // ============================================
    // DISCLAIMER - Compact
    // ============================================
    &__disclaimer {
      display: flex;
      align-items: center;
      gap: 20px;
      flex: 1;
      padding: 16px 20px;
      background: rgba(var(--primary-500-rgb), 0.04);
      border: 1px solid rgba(var(--primary-500-rgb), 0.08);
      border-radius: 10px;
    }

    &__disclaimer-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(var(--primary-500-rgb), 0.1);
      border-radius: 6px;
      flex-shrink: 0;

      svg {
        color: var(--primary-400);
      }

      span {
        font-family: @font-display;
        font-size: 11px;
        font-weight: 600;
        color: var(--primary-300);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    &__disclaimer-items {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      font-family: @font-body;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);

      strong {
        color: rgba(255, 255, 255, 0.6);
        font-weight: 500;
      }
    }

    &__disclaimer-sep {
      color: rgba(255, 255, 255, 0.2);
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
      border-top: 1px solid rgba(255, 255, 255, 0.04);
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
      gap: 8px;
    }

    &__payment-icon {
      height: 24px;
      width: auto;
      border-radius: 3px;
      opacity: 0.6;
      transition: opacity 0.2s @ease;

      &:hover {
        opacity: 1;
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
      &__top {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      &__brand {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      &__tagline {
        display: block;
        max-width: 280px;
      }

      &__top {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      &__nav {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
      }

      &__middle {
        flex-direction: column;
        align-items: stretch;
      }

      &__disclaimer {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      &__disclaimer-items {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }

      &__disclaimer-sep {
        display: none;
      }

      &__newsletter {
        width: 100%;
        max-width: 280px;
      }
    });

    // Mobile (≤ 720px)
    .respond-mobile({
      &__container {
        padding: 32px 16px 16px;
      }

      &__nav {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      &__nav-title {
        font-size: 10px;
      }

      &__nav-list a,
      &__nav-list span {
        font-size: 12px;
      }

      &__newsletter {
        max-width: none;
        width: 100%;
      }

      &__trust {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      &__trust-badges {
        flex-wrap: wrap;
        gap: 12px;
      }

      &__bottom {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 12px;
      }

      &__legal-links {
        justify-content: center;
        flex-wrap: wrap;
        gap: 12px;
      }

      &__copyright {
        font-size: 11px;
      }
    });

  }
</style>
