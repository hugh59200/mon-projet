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
          <!-- Social -->
          <div class="footer__social">
            <a
              href="#"
              class="footer__social-link"
              aria-label="Twitter"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="footer__social-link"
              aria-label="LinkedIn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="footer__social-link"
              aria-label="Instagram"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                />
                <circle
                  cx="18"
                  cy="6"
                  r="1.5"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a
              href="#"
              class="footer__social-link"
              aria-label="YouTube"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                />
              </svg>
            </a>
          </div>
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
              <li><RouterLink to="/track-order">{{ t('tracking.title') }}</RouterLink></li>
              <li><RouterLink to="/cgu">{{ t('footer.terms') }}</RouterLink></li>
              <li><RouterLink to="/guide-reconstitution">{{ t('reconstitution.title') }}</RouterLink></li>
            </ul>
          </div>

          <div class="footer__nav-col">
            <h5 class="footer__nav-title">{{ t('footer.contact') }}</h5>
            <ul class="footer__nav-list footer__nav-list--contact">
              <li>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                <a href="mailto:contact@fast-peptides.com">contact@fast-peptides.com</a>
              </li>
              <li>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                  />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>{{ t('footer.hours') }}</span>
              </li>
              <li>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle
                    cx="12"
                    cy="10"
                    r="3"
                  />
                </svg>
                <span>{{ t('footer.region') }}</span>
              </li>
            </ul>
          </div>
        </nav>

        <!-- Newsletter -->
        <div class="footer__newsletter">
          <div class="footer__newsletter-header">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              />
              <path d="M22 6l-10 7L2 6" />
            </svg>
            <div>
              <h4 class="footer__newsletter-title">{{ t('footer.newsletter.title') }}</h4>
              <p class="footer__newsletter-desc">{{ t('footer.newsletter.subtitle') }}</p>
            </div>
          </div>
          <div class="footer__newsletter-form">
            <input
              type="email"
              :placeholder="t('footer.newsletter.placeholder')"
              class="footer__newsletter-input"
            />
            <button class="footer__newsletter-btn">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Disclaimer compact -->
      <div class="footer__disclaimer">
        <div class="footer__disclaimer-badge">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
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

      <!-- Trust bar -->
      <div class="footer__trust">
        <div class="footer__trust-payments">
          <span class="footer__trust-label">{{ t('footer.securePayments') }}</span>
          <div class="footer__trust-icons">
            <!-- Visa -->
            <svg
              class="footer__payment-icon"
              viewBox="0 0 48 32"
              fill="none"
            >
              <rect
                width="48"
                height="32"
                rx="4"
                fill="#1A1F71"
              />
              <path
                d="M19.5 21H17.3L18.7 11H20.9L19.5 21Z"
                fill="white"
              />
              <path
                d="M28.5 11.2C28 11 27.3 10.8 26.4 10.8C24.2 10.8 22.6 12 22.6 13.7C22.6 15 23.7 15.7 24.6 16.1C25.5 16.5 25.8 16.8 25.8 17.2C25.8 17.8 25.1 18.1 24.4 18.1C23.4 18.1 22.9 18 22.1 17.6L21.8 17.5L21.5 19.4C22.1 19.7 23.1 19.9 24.2 19.9C26.5 19.9 28.1 18.7 28.1 16.9C28.1 15.9 27.5 15.1 26.2 14.5C25.4 14.1 24.9 13.8 24.9 13.4C24.9 13 25.3 12.6 26.2 12.6C26.9 12.6 27.5 12.7 27.9 12.9L28.1 13L28.5 11.2Z"
                fill="white"
              />
              <path
                d="M32.3 11H30.5C30 11 29.5 11.1 29.3 11.7L26 21H28.3L28.8 19.5H31.5L31.8 21H33.9L32.3 11ZM29.4 17.7C29.6 17.1 30.4 14.9 30.4 14.9L30.7 14L30.9 14.9C30.9 14.9 31.4 17.1 31.5 17.7H29.4Z"
                fill="white"
              />
              <path
                d="M16.4 11L14.2 17.8L14 16.7C13.5 15.2 12.1 13.6 10.5 12.8L12.5 21H14.8L18.7 11H16.4Z"
                fill="white"
              />
              <path
                d="M12.5 11H9.1L9 11.2C11.7 11.9 13.5 13.6 14 16.7L13.4 11.7C13.3 11.2 12.9 11 12.5 11Z"
                fill="#F9A51A"
              />
            </svg>
            <!-- Mastercard -->
            <svg
              class="footer__payment-icon"
              viewBox="0 0 48 32"
              fill="none"
            >
              <rect
                width="48"
                height="32"
                rx="4"
                fill="#000"
              />
              <circle
                cx="18"
                cy="16"
                r="8"
                fill="#EB001B"
              />
              <circle
                cx="30"
                cy="16"
                r="8"
                fill="#F79E1B"
              />
              <path
                d="M24 9.8C25.8 11.2 27 13.5 27 16C27 18.5 25.8 20.8 24 22.2C22.2 20.8 21 18.5 21 16C21 13.5 22.2 11.2 24 9.8Z"
                fill="#FF5F00"
              />
            </svg>
            <!-- PayPal -->
            <svg
              class="footer__payment-icon"
              viewBox="0 0 48 32"
              fill="none"
            >
              <rect
                width="48"
                height="32"
                rx="4"
                fill="#003087"
              />
              <path
                d="M20.5 10H15.5C15.2 10 15 10.2 14.9 10.5L13 21.5C13 21.7 13.1 21.9 13.4 21.9H15.8C16.1 21.9 16.3 21.7 16.4 21.4L16.9 18.5C17 18.2 17.2 18 17.5 18H18.8C21.3 18 22.8 16.7 23.2 14.3C23.4 13.2 23.2 12.4 22.7 11.8C22.1 11.1 21 10 20.5 10Z"
                fill="white"
              />
              <path
                d="M30.5 10H25.5C25.2 10 25 10.2 24.9 10.5L23 21.5C23 21.7 23.1 21.9 23.4 21.9H26C26.2 21.9 26.4 21.8 26.4 21.5L26.9 18.5C27 18.2 27.2 18 27.5 18H28.8C31.3 18 32.8 16.7 33.2 14.3C33.4 13.2 33.2 12.4 32.7 11.8C32.1 11.1 31 10 30.5 10Z"
                fill="white"
                fill-opacity="0.7"
              />
            </svg>
            <!-- Stripe -->
            <svg
              class="footer__payment-icon"
              viewBox="0 0 48 32"
              fill="none"
            >
              <rect
                width="48"
                height="32"
                rx="4"
                fill="#635BFF"
              />
              <path
                d="M22.5 13C20.5 13 19 13.8 19 15.4C19 17.5 22 17.9 22 19C22 19.4 21.6 19.7 20.8 19.7C19.6 19.7 18.5 19.2 18.5 19.2L18 21.2C18 21.2 19.1 21.7 20.9 21.7C23.1 21.7 24.6 20.7 24.6 18.9C24.6 16.7 21.6 16.3 21.6 15.3C21.6 14.9 22 14.6 22.7 14.6C23.7 14.6 24.5 14.9 24.5 14.9L25 13C25 13 24.1 13 22.5 13Z"
                fill="white"
              />
            </svg>
          </div>
        </div>

        <div class="footer__trust-badges">
          <div class="footer__trust-badge">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
              />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span>{{ t('footer.sslSecure') }}</span>
          </div>
          <div class="footer__trust-badge">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span>{{ t('product.trustBadges.quality') }}</span>
          </div>
          <div class="footer__trust-badge">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect
                x="1"
                y="3"
                width="15"
                height="13"
                rx="2"
              />
              <path d="M16 8h4a2 2 0 012 2v9a2 2 0 01-2 2H6" />
              <circle
                cx="5.5"
                cy="18.5"
                r="2.5"
              />
              <circle
                cx="18.5"
                cy="18.5"
                r="2.5"
              />
            </svg>
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
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />
              <path
                d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
              />
            </svg>
            <span>{{ currentLocaleInfo?.code.toUpperCase() }}</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { useLanguage } from '@/composables/useLanguage'

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
      grid-template-columns: 200px 1fr 280px;
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
      color: rgba(255, 255, 255, 0.45);
      line-height: 1.5;
      margin: 0;
    }

    &__social {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    &__social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.5);
      transition: all 0.25s @ease;

      &:hover {
        background: var(--primary-500);
        border-color: var(--primary-500);
        color: white;
        transform: translateY(-2px);
      }
    }

    // ============================================
    // NAVIGATION
    // ============================================
    &__nav {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
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
    // NEWSLETTER
    // ============================================
    &__newsletter {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.03) 0%,
        rgba(255, 255, 255, 0.01) 100%
      );
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      height: fit-content;
    }

    &__newsletter-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;

      > svg {
        color: var(--primary-400);
        flex-shrink: 0;
        margin-top: 2px;
      }
    }

    &__newsletter-title {
      font-family: @font-display;
      font-size: 14px;
      font-weight: 600;
      color: white;
      margin: 0;
    }

    &__newsletter-desc {
      font-family: @font-body;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.45);
      margin: 2px 0 0;
    }

    &__newsletter-form {
      display: flex;
      gap: 8px;
    }

    &__newsletter-input {
      flex: 1;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      font-family: @font-body;
      font-size: 13px;
      color: white;
      transition: all 0.2s @ease;

      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }

      &:focus {
        outline: none;
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.1);
      }
    }

    &__newsletter-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      transition: all 0.25s @ease;
      flex-shrink: 0;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.4);
      }
    }

    // ============================================
    // DISCLAIMER - Compact
    // ============================================
    &__disclaimer {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-top: 24px;
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
    // RESPONSIVE
    // ============================================
    @media (max-width: 1100px) {
      &__top {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      &__brand {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 16px;
      }

      &__tagline {
        display: none;
      }

      &__nav {
        grid-template-columns: repeat(4, 1fr);
      }

      &__newsletter {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }

      &__newsletter-form {
        width: 280px;
      }
    }

    @media (max-width: 768px) {
      &__container {
        padding: 40px 24px 20px;
      }

      &__nav {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }

      &__newsletter {
        flex-direction: column;
        align-items: stretch;
      }

      &__newsletter-form {
        width: 100%;
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
    }

    @media (max-width: 480px) {
      &__brand {
        flex-direction: column;
        align-items: flex-start;
      }

      &__nav {
        grid-template-columns: 1fr;
      }

      &__trust-icons {
        flex-wrap: wrap;
      }
    }
  }
</style>
