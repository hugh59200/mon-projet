<template>
  <div class="disclaimer">
    <BasicIconNext name="Info" :size="20" />
    <p>
      <strong>{{ t('home.disclaimer.title') }}</strong>
      — {{ t('home.disclaimer.text') }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
</script>

<style scoped lang="less">
  @font-body:
    'Inter',
    'SF Pro Text',
    -apple-system,
    sans-serif;
  @light-text-secondary: @neutral-600;

  .disclaimer {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    max-width: 800px;
    margin: 0 auto 60px;
    padding: 20px 24px;
    background: rgba(@warning-500, 0.08);
    border: 1px solid rgba(@warning-500, 0.25);
    border-radius: 12px;

    svg {
      width: 20px;
      height: 20px;
      color: @warning-600;
      flex-shrink: 0;
      margin-top: 2px;
    }

    p {
      font-family: @font-body;
      font-size: 13px;
      line-height: 1.6;
      color: @light-text-secondary;
      margin: 0;

      strong {
        color: @warning-600;
      }
    }
  }

  // Responsive - Mobile (≤ 720px)
  .respond-mobile({
    .disclaimer {
      margin: 0 20px 40px;
      flex-direction: column;
      text-align: center;
    }
  });
</style>
