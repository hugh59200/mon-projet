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

    <div class="cta__disclaimer">
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
    </div>
  </div>
</template>

<script setup lang="ts">
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
    grid-template-columns: 60% 40%;
    gap: 32px;
    align-items: center;
    width: 100%;
    max-width: 100%;
    overflow: hidden;

    &__content {
      display: flex;
      flex-direction: column;
      gap: 20px;

      h2 {
        font-family: @font-display;
        font-size: clamp(32px, 4vw, 48px);
        font-weight: 600;
        color: @neutral-50;
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
        color: @neutral-300;
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
      padding: 20px;
      background: rgba(@warning-500, 0.08);
      border: 1px solid rgba(@warning-500, 0.2);
      border-radius: 16px;
      align-self: center;
    }

    &__disclaimer-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: rgba(@warning-500, 0.15);
      border-radius: 8px;
      width: fit-content;

      svg {
        color: @warning-400;
      }

      span {
        font-family: @font-display;
        font-size: 11px;
        font-weight: 600;
        color: @warning-400;
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
      color: @neutral-50;
      margin: 0;
    }

    &__disclaimer-text {
      font-family: @font-body;
      font-size: 13px;
      line-height: 1.6;
      color: @neutral-500;
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
      max-width: 480px;
      margin: 0 auto;
      text-align: left;
    }
  });

  // Responsive - Mobile (≤ 720px)
  .respond-mobile({
    .cta {
      gap: 20px;
    }
    .cta__content {
      gap: 12px;

      p {
        display: none;
      }
    }
    .cta__actions {
      button:nth-child(2) {
        display: none;
      }
    }
    .cta__disclaimer {
      display: none;
    }
  });
</style>
