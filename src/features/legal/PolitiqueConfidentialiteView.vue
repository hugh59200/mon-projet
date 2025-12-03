<template>
  <div class="legal">
    <PageHeader variant="premium" theme="dark" />

    <PageContent size="md">
      <article class="legal__content">
        <header class="legal__header">
          <div class="legal__icon">
            <BasicIconNext name="Shield" :size="32" />
          </div>
          <h1 class="legal__title">{{ t('legal.privacy.title') }}</h1>
          <p class="legal__updated">{{ t('legal.lastUpdated') }} : 1er décembre 2024</p>
        </header>

        <section class="legal__section">
          <h2>{{ t('legal.privacy.intro.title') }}</h2>
          <p>{{ t('legal.privacy.intro.text') }}</p>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.privacy.controller.title') }}</h2>
          <div class="legal__card">
            <div class="legal__info-row">
              <BasicIconNext name="Building2" :size="18" />
              <div>
                <strong>Atlas Lab Solutions</strong>
                <span>Responsable du traitement des données</span>
              </div>
            </div>
            <div class="legal__info-row">
              <BasicIconNext name="Mail" :size="18" />
              <div>
                <span>Contact DPO : </span>
                <a href="mailto:dpo@fast-peptides.com">dpo@fast-peptides.com</a>
              </div>
            </div>
          </div>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.privacy.data.title') }}</h2>
          <p>{{ t('legal.privacy.data.intro') }}</p>
          <ul class="legal__list">
            <li>
              <strong>{{ t('legal.privacy.data.identity') }}</strong>
              {{ t('legal.privacy.data.identityDesc') }}
            </li>
            <li>
              <strong>{{ t('legal.privacy.data.contact') }}</strong>
              {{ t('legal.privacy.data.contactDesc') }}
            </li>
            <li>
              <strong>{{ t('legal.privacy.data.transaction') }}</strong>
              {{ t('legal.privacy.data.transactionDesc') }}
            </li>
            <li>
              <strong>{{ t('legal.privacy.data.technical') }}</strong>
              {{ t('legal.privacy.data.technicalDesc') }}
            </li>
          </ul>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.privacy.purpose.title') }}</h2>
          <div class="legal__grid">
            <div class="legal__purpose-card">
              <BasicIconNext name="ShoppingCart" :size="24" />
              <h3>{{ t('legal.privacy.purpose.orders') }}</h3>
              <p>{{ t('legal.privacy.purpose.ordersDesc') }}</p>
            </div>
            <div class="legal__purpose-card">
              <BasicIconNext name="Mail" :size="24" />
              <h3>{{ t('legal.privacy.purpose.communication') }}</h3>
              <p>{{ t('legal.privacy.purpose.communicationDesc') }}</p>
            </div>
            <div class="legal__purpose-card">
              <BasicIconNext name="BarChart3" :size="24" />
              <h3>{{ t('legal.privacy.purpose.analytics') }}</h3>
              <p>{{ t('legal.privacy.purpose.analyticsDesc') }}</p>
            </div>
            <div class="legal__purpose-card">
              <BasicIconNext name="Shield" :size="24" />
              <h3>{{ t('legal.privacy.purpose.security') }}</h3>
              <p>{{ t('legal.privacy.purpose.securityDesc') }}</p>
            </div>
          </div>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.privacy.basis.title') }}</h2>
          <p>{{ t('legal.privacy.basis.text') }}</p>
          <ul class="legal__list">
            <li><strong>{{ t('legal.privacy.basis.contract') }}</strong></li>
            <li><strong>{{ t('legal.privacy.basis.legal') }}</strong></li>
            <li><strong>{{ t('legal.privacy.basis.consent') }}</strong></li>
            <li><strong>{{ t('legal.privacy.basis.interest') }}</strong></li>
          </ul>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.privacy.retention.title') }}</h2>
          <div class="legal__table">
            <div class="legal__table-row legal__table-header">
              <span>{{ t('legal.privacy.retention.dataType') }}</span>
              <span>{{ t('legal.privacy.retention.duration') }}</span>
            </div>
            <div class="legal__table-row">
              <span>{{ t('legal.privacy.retention.account') }}</span>
              <span>{{ t('legal.privacy.retention.accountDuration') }}</span>
            </div>
            <div class="legal__table-row">
              <span>{{ t('legal.privacy.retention.orders') }}</span>
              <span>{{ t('legal.privacy.retention.ordersDuration') }}</span>
            </div>
            <div class="legal__table-row">
              <span>{{ t('legal.privacy.retention.logs') }}</span>
              <span>{{ t('legal.privacy.retention.logsDuration') }}</span>
            </div>
            <div class="legal__table-row">
              <span>{{ t('legal.privacy.retention.cookies') }}</span>
              <span>{{ t('legal.privacy.retention.cookiesDuration') }}</span>
            </div>
          </div>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.privacy.rights.title') }}</h2>
          <p>{{ t('legal.privacy.rights.intro') }}</p>
          <div class="legal__rights">
            <div class="legal__right">
              <BasicIconNext name="Eye" :size="20" />
              <div>
                <strong>{{ t('legal.privacy.rights.access') }}</strong>
                <span>{{ t('legal.privacy.rights.accessDesc') }}</span>
              </div>
            </div>
            <div class="legal__right">
              <BasicIconNext name="Pencil" :size="20" />
              <div>
                <strong>{{ t('legal.privacy.rights.rectification') }}</strong>
                <span>{{ t('legal.privacy.rights.rectificationDesc') }}</span>
              </div>
            </div>
            <div class="legal__right">
              <BasicIconNext name="Trash2" :size="20" />
              <div>
                <strong>{{ t('legal.privacy.rights.erasure') }}</strong>
                <span>{{ t('legal.privacy.rights.erasureDesc') }}</span>
              </div>
            </div>
            <div class="legal__right">
              <BasicIconNext name="Download" :size="20" />
              <div>
                <strong>{{ t('legal.privacy.rights.portability') }}</strong>
                <span>{{ t('legal.privacy.rights.portabilityDesc') }}</span>
              </div>
            </div>
            <div class="legal__right">
              <BasicIconNext name="Ban" :size="20" />
              <div>
                <strong>{{ t('legal.privacy.rights.opposition') }}</strong>
                <span>{{ t('legal.privacy.rights.oppositionDesc') }}</span>
              </div>
            </div>
          </div>
          <p class="legal__contact-cta">
            {{ t('legal.privacy.rights.contact') }}
            <a href="mailto:dpo@fast-peptides.com">dpo@fast-peptides.com</a>
          </p>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.privacy.security.title') }}</h2>
          <p>{{ t('legal.privacy.security.text') }}</p>
          <ul class="legal__list legal__list--check">
            <li>{{ t('legal.privacy.security.ssl') }}</li>
            <li>{{ t('legal.privacy.security.encryption') }}</li>
            <li>{{ t('legal.privacy.security.access') }}</li>
            <li>{{ t('legal.privacy.security.audit') }}</li>
          </ul>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.privacy.transfer.title') }}</h2>
          <p>{{ t('legal.privacy.transfer.text') }}</p>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.privacy.cnil.title') }}</h2>
          <p>{{ t('legal.privacy.cnil.text') }}</p>
          <div class="legal__card">
            <div class="legal__info-row">
              <BasicIconNext name="ExternalLink" :size="18" />
              <div>
                <a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a>
              </div>
            </div>
          </div>
        </section>
      </article>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import PageContent from '@/features/shared/components/PageContent.vue'
import PageHeader from '@/features/shared/components/PageHeader.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useHead({
  title: 'Politique de Confidentialité - Atlas Lab Solutions',
  meta: [
    {
      name: 'description',
      content: 'Politique de confidentialité et protection des données personnelles d\'Atlas Lab Solutions conformément au RGPD.',
    },
    { name: 'robots', content: 'noindex, follow' },
  ],
})
</script>

<style scoped lang="less">
@import './LegalStyles.less';
</style>
