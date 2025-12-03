<template>
  <div class="legal">
    <PageHeader variant="premium" theme="dark" />

    <PageContent size="md">
      <article class="legal__content">
        <header class="legal__header">
          <div class="legal__icon">
            <BasicIconNext name="Cookie" :size="32" />
          </div>
          <h1 class="legal__title">{{ t('legal.cookies.title') }}</h1>
          <p class="legal__updated">{{ t('legal.lastUpdated') }} : 1er décembre 2024</p>
        </header>

        <section class="legal__section">
          <h2>{{ t('legal.cookies.what.title') }}</h2>
          <p>{{ t('legal.cookies.what.text') }}</p>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.cookies.types.title') }}</h2>

          <div class="legal__cookie-category">
            <div class="legal__cookie-header legal__cookie-header--essential">
              <BasicIconNext name="Lock" :size="20" />
              <h3>{{ t('legal.cookies.types.essential.title') }}</h3>
              <span class="legal__cookie-badge legal__cookie-badge--required">
                {{ t('legal.cookies.required') }}
              </span>
            </div>
            <p>{{ t('legal.cookies.types.essential.text') }}</p>
            <div class="legal__cookie-table">
              <div class="legal__cookie-row legal__cookie-row--header">
                <span>{{ t('legal.cookies.table.name') }}</span>
                <span>{{ t('legal.cookies.table.purpose') }}</span>
                <span>{{ t('legal.cookies.table.duration') }}</span>
              </div>
              <div class="legal__cookie-row">
                <code>sb-*-auth-token</code>
                <span>{{ t('legal.cookies.types.essential.auth') }}</span>
                <span>7 {{ t('legal.cookies.days') }}</span>
              </div>
              <div class="legal__cookie-row">
                <code>atlas_age_verified</code>
                <span>{{ t('legal.cookies.types.essential.age') }}</span>
                <span>30 {{ t('legal.cookies.days') }}</span>
              </div>
              <div class="legal__cookie-row">
                <code>cart</code>
                <span>{{ t('legal.cookies.types.essential.cart') }}</span>
                <span>{{ t('legal.cookies.session') }}</span>
              </div>
            </div>
          </div>

          <div class="legal__cookie-category">
            <div class="legal__cookie-header legal__cookie-header--functional">
              <BasicIconNext name="Settings" :size="20" />
              <h3>{{ t('legal.cookies.types.functional.title') }}</h3>
              <span class="legal__cookie-badge legal__cookie-badge--optional">
                {{ t('legal.cookies.optional') }}
              </span>
            </div>
            <p>{{ t('legal.cookies.types.functional.text') }}</p>
            <div class="legal__cookie-table">
              <div class="legal__cookie-row legal__cookie-row--header">
                <span>{{ t('legal.cookies.table.name') }}</span>
                <span>{{ t('legal.cookies.table.purpose') }}</span>
                <span>{{ t('legal.cookies.table.duration') }}</span>
              </div>
              <div class="legal__cookie-row">
                <code>locale</code>
                <span>{{ t('legal.cookies.types.functional.locale') }}</span>
                <span>1 {{ t('legal.cookies.year') }}</span>
              </div>
              <div class="legal__cookie-row">
                <code>theme</code>
                <span>{{ t('legal.cookies.types.functional.theme') }}</span>
                <span>1 {{ t('legal.cookies.year') }}</span>
              </div>
            </div>
          </div>

          <div class="legal__cookie-category">
            <div class="legal__cookie-header legal__cookie-header--analytics">
              <BasicIconNext name="BarChart3" :size="20" />
              <h3>{{ t('legal.cookies.types.analytics.title') }}</h3>
              <span class="legal__cookie-badge legal__cookie-badge--optional">
                {{ t('legal.cookies.optional') }}
              </span>
            </div>
            <p>{{ t('legal.cookies.types.analytics.text') }}</p>
            <div class="legal__cookie-table">
              <div class="legal__cookie-row legal__cookie-row--header">
                <span>{{ t('legal.cookies.table.name') }}</span>
                <span>{{ t('legal.cookies.table.purpose') }}</span>
                <span>{{ t('legal.cookies.table.duration') }}</span>
              </div>
              <div class="legal__cookie-row">
                <code>_ga</code>
                <span>{{ t('legal.cookies.types.analytics.ga') }}</span>
                <span>2 {{ t('legal.cookies.years') }}</span>
              </div>
              <div class="legal__cookie-row">
                <code>_gid</code>
                <span>{{ t('legal.cookies.types.analytics.gid') }}</span>
                <span>24 {{ t('legal.cookies.hours') }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.cookies.manage.title') }}</h2>
          <p>{{ t('legal.cookies.manage.text') }}</p>

          <div class="legal__browsers">
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" class="legal__browser">
              <BasicIconNext name="Chrome" :size="24" />
              <span>Chrome</span>
            </a>
            <a href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent" target="_blank" rel="noopener" class="legal__browser">
              <BasicIconNext name="Globe" :size="24" />
              <span>Firefox</span>
            </a>
            <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener" class="legal__browser">
              <BasicIconNext name="Compass" :size="24" />
              <span>Safari</span>
            </a>
            <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener" class="legal__browser">
              <BasicIconNext name="Globe" :size="24" />
              <span>Edge</span>
            </a>
          </div>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.cookies.consent.title') }}</h2>
          <p>{{ t('legal.cookies.consent.text') }}</p>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.cookies.contact.title') }}</h2>
          <p>{{ t('legal.cookies.contact.text') }}</p>
          <div class="legal__card">
            <div class="legal__info-row">
              <BasicIconNext name="Mail" :size="18" />
              <div>
                <a href="mailto:dpo@fast-peptides.com">dpo@fast-peptides.com</a>
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
  title: 'Politique des Cookies - Atlas Lab Solutions',
  meta: [
    {
      name: 'description',
      content: 'Politique des cookies d\'Atlas Lab Solutions. Découvrez comment nous utilisons les cookies et comment les gérer.',
    },
    { name: 'robots', content: 'noindex, follow' },
  ],
})
</script>

<style scoped lang="less">
@import './LegalStyles.less';
</style>
