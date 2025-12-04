<template>
  <div class="legal">
    <PageHeader variant="premium" theme="dark" />

    <PageContent size="md">
      <article class="legal__content">
        <header class="legal__header">
          <div class="legal__icon">
            <BasicIconNext name="Scale" :size="32" />
          </div>
          <h1 class="legal__title">{{ t('legal.mentions.title') }}</h1>
          <p class="legal__updated">{{ t('legal.lastUpdated') }} : 1er décembre 2024</p>
        </header>

        <section class="legal__section">
          <h2>{{ t('legal.mentions.editor.title') }}</h2>
          <div class="legal__card">
            <div class="legal__info-row">
              <BasicIconNext name="Building2" :size="18" />
              <div>
                <strong>Atlas Lab Solutions</strong>
                <span>Société par Actions Simplifiée (SAS)</span>
              </div>
            </div>
            <div class="legal__info-row">
              <BasicIconNext name="MapPin" :size="18" />
              <div>
                <span>{{ t('legal.mentions.editor.address') }}</span>
              </div>
            </div>
            <div class="legal__info-row">
              <BasicIconNext name="Mail" :size="18" />
              <div>
                <a href="mailto:contact@fast-peptides.com">contact@fast-peptides.com</a>
              </div>
            </div>
            <div class="legal__info-row">
              <BasicIconNext name="FileText" :size="18" />
              <div>
                <span>SIRET : XXX XXX XXX XXXXX</span>
              </div>
            </div>
            <div class="legal__info-row">
              <BasicIconNext name="Hash" :size="18" />
              <div>
                <span>TVA Intracommunautaire : FR XX XXX XXX XXX</span>
              </div>
            </div>
          </div>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.mentions.director.title') }}</h2>
          <p>{{ t('legal.mentions.director.text') }}</p>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.mentions.hosting.title') }}</h2>
          <div class="legal__card">
            <div class="legal__info-row">
              <BasicIconNext name="Server" :size="18" />
              <div>
                <strong>Vercel Inc.</strong>
                <span>440 N Barranca Ave #4133, Covina, CA 91723, USA</span>
              </div>
            </div>
            <div class="legal__info-row">
              <BasicIconNext name="Database" :size="18" />
              <div>
                <strong>Supabase Inc.</strong>
                <span>970 Toa Payoh North #07-04, Singapore 318992</span>
              </div>
            </div>
          </div>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.mentions.ip.title') }}</h2>
          <p>{{ t('legal.mentions.ip.text') }}</p>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.mentions.liability.title') }}</h2>
          <p>{{ t('legal.mentions.liability.text') }}</p>
          <div class="legal__warning">
            <BasicIconNext name="AlertTriangle" :size="20" />
            <p>{{ t('legal.mentions.liability.research') }}</p>
          </div>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.mentions.links.title') }}</h2>
          <p>{{ t('legal.mentions.links.text') }}</p>
        </section>

        <section class="legal__section">
          <h2>{{ t('legal.mentions.law.title') }}</h2>
          <p>{{ t('legal.mentions.law.text') }}</p>
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
  title: 'Mentions Légales - Atlas Lab Solutions',
  meta: [
    {
      name: 'description',
      content: 'Mentions légales du site Atlas Lab Solutions - Fast Peptides. Informations sur l\'éditeur, l\'hébergeur et les conditions d\'utilisation.',
    },
    { name: 'robots', content: 'noindex, follow' },
  ],
})
</script>

<style scoped lang="less">
@import './LegalStyles.less';
</style>
