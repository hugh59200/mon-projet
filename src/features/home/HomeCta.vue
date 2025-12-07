<template>
  <div class="cta">
    <div class="cta__content">
      <h2>
        {{ t('home.cta.title.line1') }}
        <br />
        <span>{{ t('home.cta.title.accent') }}</span>
      </h2>
      <p>
        {{ t('home.cta.description') }}
      </p>
      <div class="cta__actions">
        <BaseButton
          variant="white"
          arrow
          @click="$router.push('/catalogue')"
        >
          {{ t('home.cta.buttons.catalogue') }}
        </BaseButton>
        <BaseButton
          variant="outline"
          @click="$router.push('/contact')"
        >
          {{ t('home.cta.buttons.contact') }}
        </BaseButton>
      </div>
    </div>

    <ContentBlock
      variant="card"
      class="cta__disclaimer"
    >
      <div class="cta__disclaimer-badge">
        <BasicIconNext
          name="Shield"
          :size="18"
        />
        <span>{{ t('footer.researchOnly') }}</span>
      </div>
      <div class="cta__disclaimer-content">
        <p class="cta__disclaimer-title">{{ t('home.disclaimer.title') }}</p>
        <p class="cta__disclaimer-text">{{ t('home.disclaimer.text') }}</p>
      </div>
    </ContentBlock>
  </div>
</template>

<script setup lang="ts">
  import ContentBlock from '@designSystem/components/layout/ContentBlock.vue'
  import { useI18n } from 'vue-i18n'
  import BaseButton from './shared/BaseButton.vue'

  const { t } = useI18n()
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

  .cta {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 60px;
    align-items: center;

    &__content {
      display: flex;
      flex-direction: column;
      gap: 20px;

      h2 {
        font-family: @font-display;
        font-size: clamp(32px, 4vw, 48px);
        font-weight: 600;
        color: var(--content-block-text);
        margin: 0;
        line-height: 1.15;
        letter-spacing: -0.02em;

        span {
          background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-300) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }

      p {
        font-family: @font-body;
        font-size: 17px;
        line-height: 1.7;
        color: var(--content-block-text-secondary);
        margin: 0;
        max-width: 520px;
      }
    }

    &__actions {
      display: flex;
      gap: 16px;
      margin-top: 8px;
    }

    &__disclaimer {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 280px;
    }

    &__disclaimer-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: rgba(var(--primary-500-rgb), 0.15);
      border: 1px solid rgba(var(--primary-500-rgb), 0.25);
      border-radius: 8px;
      width: fit-content;

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

    &__disclaimer-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__disclaimer-title {
      font-family: @font-display;
      font-size: 14px;
      font-weight: 600;
      color: var(--content-block-text);
      margin: 0;
    }

    &__disclaimer-text {
      font-family: @font-body;
      font-size: 13px;
      line-height: 1.6;
      color: var(--content-block-text-muted);
      margin: 0;
    }
  }

  // Responsive - Tablet (≤ 1160px)
  .respond-tablet({
    .cta {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 32px;
    }
    .cta__content { align-items: center; }
    .cta__actions { justify-content: center; }
    .cta__disclaimer {
      max-width: 400px;
      margin: 0 auto;
      flex-direction: row;
      align-items: center;
      gap: 20px;
    }
    .cta__disclaimer-badge {
      flex-shrink: 0;
    }
    .cta__disclaimer-content {
      text-align: left;
    }
  });

  // Responsive - Mobile (≤ 720px)
  .respond-mobile({
    .cta {
      gap: 24px;
    }
    .cta__actions { flex-direction: column; width: 100%; }
    .cta__disclaimer {
      flex-direction: column;
      max-width: none;
      gap: 12px;
    }
    .cta__disclaimer-content {
      text-align: center;
    }
    .cta__disclaimer-badge {
      margin: 0 auto;
    }
  });
</style>
