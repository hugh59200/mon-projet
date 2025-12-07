<template>
  <div class="crypto-guide">
    <!-- Header via PageHeader -->
    <PageHeader />

    <PageContent size="lg">
      <!-- Info Banner -->
      <div class="crypto-guide__banner">
        <div class="crypto-guide__banner-icon">
          <BasicIconNext name="Lightbulb" :size="24" />
        </div>
        <div class="crypto-guide__banner-content">
          <strong class="crypto-guide__banner-title">{{ t('cryptoGuide.banner.title') }}</strong>
          <p class="crypto-guide__banner-text">
            {{ t('cryptoGuide.banner.description') }}
          </p>
        </div>
      </div>

      <!-- Section: Pourquoi payer en crypto -->
      <section class="crypto-guide__section">
        <div class="crypto-guide__section-header">
          <div class="crypto-guide__section-icon crypto-guide__section-icon--primary">
            <BasicIconNext name="Shield" :size="24" />
          </div>
          <div>
            <h2 class="crypto-guide__section-title">{{ t('cryptoGuide.whyCrypto.title') }}</h2>
            <p class="crypto-guide__section-subtitle">{{ t('cryptoGuide.whyCrypto.subtitle') }}</p>
          </div>
        </div>

        <div class="crypto-guide__benefits">
          <div class="crypto-guide__benefit">
            <div class="crypto-guide__benefit-icon">
              <BasicIconNext name="Lock" :size="20" />
            </div>
            <div class="crypto-guide__benefit-content">
              <h4>{{ t('cryptoGuide.whyCrypto.benefits.privacy.title') }}</h4>
              <p>{{ t('cryptoGuide.whyCrypto.benefits.privacy.description') }}</p>
            </div>
          </div>
          <div class="crypto-guide__benefit">
            <div class="crypto-guide__benefit-icon">
              <BasicIconNext name="Zap" :size="20" />
            </div>
            <div class="crypto-guide__benefit-content">
              <h4>{{ t('cryptoGuide.whyCrypto.benefits.fast.title') }}</h4>
              <p>{{ t('cryptoGuide.whyCrypto.benefits.fast.description') }}</p>
            </div>
          </div>
          <div class="crypto-guide__benefit">
            <div class="crypto-guide__benefit-icon">
              <BasicIconNext name="Globe" :size="20" />
            </div>
            <div class="crypto-guide__benefit-content">
              <h4>{{ t('cryptoGuide.whyCrypto.benefits.global.title') }}</h4>
              <p>{{ t('cryptoGuide.whyCrypto.benefits.global.description') }}</p>
            </div>
          </div>
          <div class="crypto-guide__benefit">
            <div class="crypto-guide__benefit-icon">
              <BasicIconNext name="Percent" :size="20" />
            </div>
            <div class="crypto-guide__benefit-content">
              <h4>{{ t('cryptoGuide.whyCrypto.benefits.fees.title') }}</h4>
              <p>{{ t('cryptoGuide.whyCrypto.benefits.fees.description') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Étapes pour payer -->
      <section class="crypto-guide__section">
        <div class="crypto-guide__section-header">
          <div class="crypto-guide__section-icon crypto-guide__section-icon--steps">
            <BasicIconNext name="ListChecks" :size="24" />
          </div>
          <div>
            <h2 class="crypto-guide__section-title">{{ t('cryptoGuide.steps.title') }}</h2>
            <p class="crypto-guide__section-subtitle">{{ t('cryptoGuide.steps.subtitle') }}</p>
          </div>
        </div>

        <div class="crypto-guide__steps">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="crypto-guide__step"
          >
            <div class="crypto-guide__step-number">{{ index + 1 }}</div>
            <div class="crypto-guide__step-connector" v-if="index < steps.length - 1"></div>
            <div class="crypto-guide__step-content">
              <div class="crypto-guide__step-icon">
                <BasicIconNext :name="step.icon" :size="24" />
              </div>
              <h3 class="crypto-guide__step-title">{{ t(step.titleKey) }}</h3>
              <p class="crypto-guide__step-desc">{{ t(step.descKey) }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Plateformes recommandées -->
      <section class="crypto-guide__section">
        <div class="crypto-guide__section-header">
          <div class="crypto-guide__section-icon crypto-guide__section-icon--platforms">
            <BasicIconNext name="Building2" :size="24" />
          </div>
          <div>
            <h2 class="crypto-guide__section-title">{{ t('cryptoGuide.platforms.title') }}</h2>
            <p class="crypto-guide__section-subtitle">{{ t('cryptoGuide.platforms.subtitle') }}</p>
          </div>
        </div>

        <div class="crypto-guide__platforms">
          <a
            v-for="platform in platforms"
            :key="platform.name"
            :href="platform.url"
            target="_blank"
            rel="noopener noreferrer"
            class="crypto-guide__platform"
          >
            <div class="crypto-guide__platform-logo" :style="{ background: platform.bgColor }">
              <span class="crypto-guide__platform-initial">{{ platform.name.charAt(0) }}</span>
            </div>
            <div class="crypto-guide__platform-info">
              <h4 class="crypto-guide__platform-name">{{ platform.name }}</h4>
              <p class="crypto-guide__platform-desc">{{ t(platform.descKey) }}</p>
              <div class="crypto-guide__platform-tags">
                <span
                  v-for="tag in platform.tags"
                  :key="tag"
                  class="crypto-guide__platform-tag"
                >
                  {{ t(tag) }}
                </span>
              </div>
            </div>
            <div class="crypto-guide__platform-arrow">
              <BasicIconNext name="ExternalLink" :size="18" />
            </div>
          </a>
        </div>
      </section>

      <!-- Section: Cryptos acceptées -->
      <section class="crypto-guide__section">
        <div class="crypto-guide__section-header">
          <div class="crypto-guide__section-icon crypto-guide__section-icon--crypto">
            <BasicIconNext name="Coins" :size="24" />
          </div>
          <div>
            <h2 class="crypto-guide__section-title">{{ t('cryptoGuide.accepted.title') }}</h2>
            <p class="crypto-guide__section-subtitle">{{ t('cryptoGuide.accepted.subtitle') }}</p>
          </div>
        </div>

        <div class="crypto-guide__cryptos">
          <div class="crypto-guide__crypto crypto-guide__crypto--btc">
            <div class="crypto-guide__crypto-icon">
              <span>&#8383;</span>
            </div>
            <div class="crypto-guide__crypto-info">
              <h4>Bitcoin (BTC)</h4>
              <p>{{ t('cryptoGuide.accepted.btc.description') }}</p>
            </div>
            <div class="crypto-guide__crypto-badge crypto-guide__crypto-badge--popular">
              {{ t('cryptoGuide.accepted.popular') }}
            </div>
          </div>

          <div class="crypto-guide__crypto crypto-guide__crypto--usdt">
            <div class="crypto-guide__crypto-icon">
              <span>&#36;</span>
            </div>
            <div class="crypto-guide__crypto-info">
              <h4>Tether (USDT)</h4>
              <p>{{ t('cryptoGuide.accepted.usdt.description') }}</p>
              <span class="crypto-guide__crypto-network">{{ t('cryptoGuide.accepted.usdt.network') }}</span>
            </div>
            <div class="crypto-guide__crypto-badge crypto-guide__crypto-badge--stable">
              {{ t('cryptoGuide.accepted.stable') }}
            </div>
          </div>
        </div>
      </section>

      <!-- Warning Card -->
      <div class="crypto-guide__warning">
        <div class="crypto-guide__warning-icon">
          <BasicIconNext name="AlertTriangle" :size="24" />
        </div>
        <div class="crypto-guide__warning-content">
          <h4>{{ t('cryptoGuide.warning.title') }}</h4>
          <ul>
            <li>{{ t('cryptoGuide.warning.item1') }}</li>
            <li>{{ t('cryptoGuide.warning.item2') }}</li>
            <li>{{ t('cryptoGuide.warning.item3') }}</li>
          </ul>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="crypto-guide__cta">
        <div class="crypto-guide__cta-content">
          <h3>{{ t('cryptoGuide.cta.title') }}</h3>
          <p>{{ t('cryptoGuide.cta.description') }}</p>
        </div>
        <div class="crypto-guide__cta-actions">
          <PremiumButton
            type="primary"
            variant="solid"
            size="lg"
            :label="t('cryptoGuide.cta.button')"
            icon-left="ShoppingCart"
            :shine="true"
            @click="$router.push('/catalogue')"
          />
          <PremiumButton
            type="secondary"
            variant="outline"
            size="lg"
            :label="t('cryptoGuide.cta.support')"
            icon-left="MessageCircle"
            @click="$router.push('/contact')"
          />
        </div>
      </div>

      <!-- Footer Trust -->
      <footer class="crypto-guide__footer">
        <div class="crypto-guide__footer-item">
          <BasicIconNext name="ShieldCheck" :size="18" />
          <span>{{ t('cryptoGuide.footer.secure') }}</span>
        </div>
        <div class="crypto-guide__footer-item">
          <BasicIconNext name="Clock" :size="18" />
          <span>{{ t('cryptoGuide.footer.fast') }}</span>
        </div>
        <div class="crypto-guide__footer-item">
          <BasicIconNext name="HeadphonesIcon" :size="18" />
          <span>{{ t('cryptoGuide.footer.support') }}</span>
        </div>
      </footer>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import PageContent from '@/features/shared/components/PageContent.vue'
import PageHeader from '@/features/shared/components/PageHeader.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Configuration SEO
useHead({
  title: 'Guide Paiement Crypto - Bitcoin & USDT | Atlas Lab Solutions',
  meta: [
    {
      name: 'description',
      content: 'Guide complet pour payer en cryptomonnaie (Bitcoin, USDT). Apprenez comment acheter et envoyer des cryptos facilement et en toute sécurité.',
    },
    {
      property: 'og:title',
      content: 'Guide Paiement Crypto - Bitcoin & USDT',
    },
    {
      property: 'og:description',
      content: 'Guide complet pour payer en cryptomonnaie. Instructions étape par étape pour Bitcoin et USDT.',
    },
  ],
})

// Steps data
const steps = [
  {
    icon: 'Wallet',
    titleKey: 'cryptoGuide.steps.step1.title',
    descKey: 'cryptoGuide.steps.step1.description',
  },
  {
    icon: 'CreditCard',
    titleKey: 'cryptoGuide.steps.step2.title',
    descKey: 'cryptoGuide.steps.step2.description',
  },
  {
    icon: 'Send',
    titleKey: 'cryptoGuide.steps.step3.title',
    descKey: 'cryptoGuide.steps.step3.description',
  },
  {
    icon: 'CheckCircle2',
    titleKey: 'cryptoGuide.steps.step4.title',
    descKey: 'cryptoGuide.steps.step4.description',
  },
] as const

// Platforms data
const platforms = [
  {
    name: 'Binance',
    url: 'https://www.binance.com',
    bgColor: 'linear-gradient(135deg, #F0B90B 0%, #F8D12F 100%)',
    descKey: 'cryptoGuide.platforms.binance.desc',
    tags: ['cryptoGuide.platforms.tags.beginner', 'cryptoGuide.platforms.tags.lowFees'],
  },
  {
    name: 'Coinbase',
    url: 'https://www.coinbase.com',
    bgColor: 'linear-gradient(135deg, #0052FF 0%, #3B7BFF 100%)',
    descKey: 'cryptoGuide.platforms.coinbase.desc',
    tags: ['cryptoGuide.platforms.tags.simple', 'cryptoGuide.platforms.tags.secure'],
  },
  {
    name: 'Kraken',
    url: 'https://www.kraken.com',
    bgColor: 'linear-gradient(135deg, #5741D9 0%, #7B61FF 100%)',
    descKey: 'cryptoGuide.platforms.kraken.desc',
    tags: ['cryptoGuide.platforms.tags.advanced', 'cryptoGuide.platforms.tags.europe'],
  },
  {
    name: 'Bybit',
    url: 'https://www.bybit.com',
    bgColor: 'linear-gradient(135deg, #F7A600 0%, #FFB800 100%)',
    descKey: 'cryptoGuide.platforms.bybit.desc',
    tags: ['cryptoGuide.platforms.tags.fast', 'cryptoGuide.platforms.tags.p2p'],
  },
]
</script>

<style scoped lang="less">
@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);
@bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

.crypto-guide {
  position: relative;
  min-height: 100vh;

  // ============================================
  // BANNER
  // ============================================
  &__banner {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 20px 24px;
    margin-bottom: 32px;
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.08) 0%, rgba(var(--primary-500-rgb), 0.04) 100%);
    border: 1px solid rgba(var(--primary-500-rgb), 0.2);
    border-radius: 16px;
  }

  &__banner-icon {
    width: 48px;
    height: 48px;
    min-width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--primary-500-rgb), 0.15);
    border-radius: 12px;
    color: var(--primary-600);
  }

  &__banner-content {
    flex: 1;
  }

  &__banner-title {
    display: block;
    font-family: @font-body;
    font-size: 15px;
    font-weight: 700;
    color: var(--primary-700);
    margin-bottom: 6px;
  }

  &__banner-text {
    font-family: @font-body;
    font-size: 14px;
    line-height: 1.6;
    color: @neutral-600;
    margin: 0;
  }

  // ============================================
  // SECTIONS
  // ============================================
  &__section {
    background: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 32px rgba(0, 0, 0, 0.04);
    border: 1px solid @neutral-100;
    margin-bottom: 24px;
  }

  &__section-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid @neutral-100;
  }

  &__section-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    color: white;

    &--primary {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    }

    &--steps {
      background: linear-gradient(135deg, @success-500 0%, @success-600 100%);
    }

    &--platforms {
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
    }

    &--crypto {
      background: linear-gradient(135deg, #F7931A 0%, #FFB84D 100%);
    }
  }

  &__section-title {
    font-family: @font-display;
    font-size: 22px;
    font-weight: 700;
    color: @neutral-900;
    margin: 0 0 4px;
  }

  &__section-subtitle {
    font-family: @font-body;
    font-size: 14px;
    color: @neutral-500;
    margin: 0;
  }

  // ============================================
  // BENEFITS
  // ============================================
  &__benefits {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  &__benefit {
    display: flex;
    gap: 16px;
    padding: 20px;
    background: @neutral-50;
    border-radius: 16px;
    border: 1px solid @neutral-100;
    transition: all 0.2s @ease;

    &:hover {
      background: white;
      border-color: var(--primary-200);
      box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.1);
    }
  }

  &__benefit-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
    border-radius: 12px;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  &__benefit-content {
    h4 {
      font-family: @font-display;
      font-size: 15px;
      font-weight: 600;
      color: @neutral-900;
      margin: 0 0 4px;
    }

    p {
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;
      margin: 0;
      line-height: 1.5;
    }
  }

  // ============================================
  // STEPS
  // ============================================
  &__steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  &__step {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__step-number {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, @success-500 0%, @success-600 100%);
    border-radius: 50%;
    font-family: @font-display;
    font-size: 18px;
    font-weight: 700;
    color: white;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(var(--success-500-rgb), 0.3);
    position: relative;
    z-index: 2;
  }

  &__step-connector {
    position: absolute;
    top: 20px;
    left: calc(50% + 28px);
    width: calc(100% - 56px);
    height: 2px;
    background: linear-gradient(90deg, @success-400, @neutral-200);
    z-index: 1;
  }

  &__step-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  &__step-icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @neutral-50;
    border: 1px solid @neutral-200;
    border-radius: 18px;
    color: @success-600;
    transition: all 0.3s @ease;

    .crypto-guide__step:hover & {
      background: white;
      border-color: @success-300;
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(var(--success-500-rgb), 0.15);
    }
  }

  &__step-title {
    font-family: @font-display;
    font-size: 15px;
    font-weight: 600;
    color: @neutral-900;
    margin: 0;
  }

  &__step-desc {
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-500;
    margin: 0;
    line-height: 1.5;
    max-width: 180px;
  }

  // ============================================
  // PLATFORMS
  // ============================================
  &__platforms {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  &__platform {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: @neutral-50;
    border: 1px solid @neutral-200;
    border-radius: 16px;
    text-decoration: none;
    transition: all 0.2s @ease;

    &:hover {
      background: white;
      border-color: var(--primary-300);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);

      .crypto-guide__platform-arrow {
        color: var(--primary-500);
        transform: translate(2px, -2px);
      }
    }
  }

  &__platform-logo {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    flex-shrink: 0;
  }

  &__platform-initial {
    font-family: @font-display;
    font-size: 24px;
    font-weight: 800;
    color: white;
  }

  &__platform-info {
    flex: 1;
    min-width: 0;
  }

  &__platform-name {
    font-family: @font-display;
    font-size: 16px;
    font-weight: 600;
    color: @neutral-900;
    margin: 0 0 4px;
  }

  &__platform-desc {
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-500;
    margin: 0 0 8px;
  }

  &__platform-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__platform-tag {
    padding: 4px 10px;
    background: white;
    border: 1px solid @neutral-200;
    border-radius: 50px;
    font-family: @font-body;
    font-size: 11px;
    font-weight: 500;
    color: @neutral-600;
  }

  &__platform-arrow {
    color: @neutral-400;
    transition: all 0.2s @ease;
  }

  // ============================================
  // CRYPTOS ACCEPTED
  // ============================================
  &__cryptos {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  &__crypto {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 24px;
    border-radius: 18px;
    border: 2px solid;
    transition: all 0.2s @ease;

    &--btc {
      background: linear-gradient(135deg, rgba(247, 147, 26, 0.08) 0%, rgba(247, 147, 26, 0.03) 100%);
      border-color: rgba(247, 147, 26, 0.2);

      .crypto-guide__crypto-icon {
        background: linear-gradient(135deg, #F7931A 0%, #FFB84D 100%);
      }

      &:hover {
        border-color: rgba(247, 147, 26, 0.4);
        box-shadow: 0 8px 24px rgba(247, 147, 26, 0.15);
      }
    }

    &--usdt {
      background: linear-gradient(135deg, rgba(38, 161, 123, 0.08) 0%, rgba(38, 161, 123, 0.03) 100%);
      border-color: rgba(38, 161, 123, 0.2);

      .crypto-guide__crypto-icon {
        background: linear-gradient(135deg, #26A17B 0%, #3CC68A 100%);
      }

      &:hover {
        border-color: rgba(38, 161, 123, 0.4);
        box-shadow: 0 8px 24px rgba(38, 161, 123, 0.15);
      }
    }
  }

  &__crypto-icon {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    flex-shrink: 0;

    span {
      font-size: 24px;
      font-weight: 700;
      color: white;
    }
  }

  &__crypto-info {
    flex: 1;

    h4 {
      font-family: @font-display;
      font-size: 18px;
      font-weight: 600;
      color: @neutral-900;
      margin: 0 0 6px;
    }

    p {
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-600;
      margin: 0;
      line-height: 1.5;
    }
  }

  &__crypto-network {
    display: inline-block;
    margin-top: 8px;
    padding: 4px 10px;
    background: rgba(38, 161, 123, 0.1);
    border-radius: 6px;
    font-family: @font-body;
    font-size: 12px;
    font-weight: 600;
    color: #26A17B;
  }

  &__crypto-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 6px 12px;
    border-radius: 50px;
    font-family: @font-body;
    font-size: 11px;
    font-weight: 600;

    &--popular {
      background: linear-gradient(135deg, #F7931A 0%, #FFB84D 100%);
      color: white;
    }

    &--stable {
      background: linear-gradient(135deg, #26A17B 0%, #3CC68A 100%);
      color: white;
    }
  }

  // ============================================
  // WARNING
  // ============================================
  &__warning {
    display: flex;
    gap: 20px;
    padding: 24px;
    margin-bottom: 24px;
    background: linear-gradient(135deg, @warning-50 0%, rgba(@warning-100, 0.5) 100%);
    border: 2px solid @warning-200;
    border-radius: 18px;
  }

  &__warning-icon {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @warning-100;
    border-radius: 14px;
    color: @warning-600;
    flex-shrink: 0;
  }

  &__warning-content {
    flex: 1;

    h4 {
      font-family: @font-display;
      font-size: 16px;
      font-weight: 600;
      color: @warning-700;
      margin: 0 0 12px;
    }

    ul {
      margin: 0;
      padding-left: 20px;

      li {
        font-family: @font-body;
        font-size: 14px;
        color: @warning-700;
        line-height: 1.6;
        margin-bottom: 6px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  // ============================================
  // CTA
  // ============================================
  &__cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    padding: 32px;
    margin-bottom: 24px;
    background: linear-gradient(135deg, var(--secondary-900) 0%, var(--secondary-800) 100%);
    border-radius: 24px;
    color: white;
  }

  &__cta-content {
    h3 {
      font-family: @font-display;
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 8px;
    }

    p {
      font-family: @font-body;
      font-size: 15px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }
  }

  &__cta-actions {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
  }

  // ============================================
  // FOOTER
  // ============================================
  &__footer {
    display: flex;
    justify-content: center;
    gap: 40px;
    padding: 24px;
    background: white;
    border-radius: 16px;
    border: 1px solid @neutral-100;
  }

  &__footer-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: @font-body;
    font-size: 14px;
    color: @neutral-500;

    svg {
      color: @success-500;
    }
  }

  // ============================================
  // RESPONSIVE
  // ============================================
  .respond-tablet({
    &__benefits {
      grid-template-columns: 1fr;
    }

    &__steps {
      grid-template-columns: repeat(2, 1fr);
      gap: 32px;
    }

    &__step-connector {
      display: none;
    }

    &__platforms {
      grid-template-columns: 1fr;
    }

    &__cryptos {
      grid-template-columns: 1fr;
    }

    &__cta {
      flex-direction: column;
      text-align: center;
    }

    &__cta-actions {
      width: 100%;
      justify-content: center;
    }
  });

  .respond-mobile({
    &__section {
      padding: 24px;
      border-radius: 20px;
    }

    &__section-header {
      flex-direction: column;
      text-align: center;
      gap: 12px;
    }

    &__steps {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    &__step {
      flex-direction: row;
      text-align: left;
      gap: 16px;
      padding: 16px;
      background: @neutral-50;
      border-radius: 16px;
    }

    &__step-number {
      margin-bottom: 0;
      flex-shrink: 0;
    }

    &__step-content {
      align-items: flex-start;
      flex: 1;
    }

    &__step-icon {
      width: 48px;
      height: 48px;
    }

    &__step-desc {
      max-width: none;
    }

    &__platform {
      flex-direction: column;
      align-items: flex-start;
    }

    &__crypto {
      flex-direction: column;
      text-align: center;
      padding: 20px;
    }

    &__crypto-icon {
      margin: 0 auto;
    }

    &__crypto-badge {
      position: static;
      margin-top: 12px;
    }

    &__warning {
      flex-direction: column;
      text-align: center;
    }

    &__warning-icon {
      margin: 0 auto;
    }

    &__cta-actions {
      flex-direction: column;
      width: 100%;
    }

    &__footer {
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
  });
}
</style>
