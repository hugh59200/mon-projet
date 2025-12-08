<template>
  <div class="newsletter-confirm">
    <!-- Loading State -->
    <div
      v-if="state === 'loading'"
      class="newsletter-confirm__loading"
    >
      <div class="newsletter-confirm__spinner">
        <BasicIconNext
          name="Loader2"
          :size="40"
        />
      </div>
      <p>{{ t('common.loading') }}</p>
    </div>

    <!-- Success State -->
    <div
      v-else-if="state === 'success'"
      class="newsletter-confirm__content"
    >
      <div class="newsletter-confirm__icon newsletter-confirm__icon--success">
        <BasicIconNext
          name="CheckCircle"
          :size="64"
          color="success-500"
        />
      </div>

      <h1 class="newsletter-confirm__title">{{ t('newsletter.confirm.successTitle') }}</h1>
      <p class="newsletter-confirm__subtitle">{{ t('newsletter.confirm.successMessage') }}</p>

      <!-- Promo Code Box -->
      <div class="newsletter-confirm__promo">
        <span class="newsletter-confirm__promo-label">{{ t('newsletter.confirm.yourCode') }}</span>
        <div class="newsletter-confirm__promo-code">
          {{ promoCode }}
          <button
            class="newsletter-confirm__copy"
            @click="copyCode"
          >
            <BasicIconNext
              :name="copied ? 'Check' : 'Copy'"
              :size="18"
            />
          </button>
        </div>
        <span class="newsletter-confirm__promo-desc">{{ t('newsletter.confirm.codeDesc') }}</span>
      </div>

      <PremiumButton
        :label="t('newsletter.confirm.ctaShop')"
        type="primary"
        variant="solid"
        size="lg"
        icon-right="ArrowRight"
        @click="$router.push('/catalogue')"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="state === 'error'"
      class="newsletter-confirm__content"
    >
      <div class="newsletter-confirm__icon newsletter-confirm__icon--error">
        <BasicIconNext
          name="AlertTriangle"
          :size="64"
          color="danger-500"
        />
      </div>

      <h1 class="newsletter-confirm__title">{{ t('newsletter.confirm.errorTitle') }}</h1>
      <p class="newsletter-confirm__subtitle newsletter-confirm__subtitle--error">
        {{ errorMessage || t('newsletter.confirm.errorMessage') }}
      </p>

      <PremiumButton
        :label="t('newsletter.confirm.ctaHome')"
        type="secondary"
        variant="outline"
        size="lg"
        icon-left="ArrowLeft"
        @click="$router.push('/')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { confirmNewsletterSubscription } from '@/api/supabase/newsletter'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'

  const { t } = useI18n()
  const route = useRoute()

  const state = ref<'loading' | 'success' | 'error'>('loading')
  const errorMessage = ref('')
  const promoCode = 'WELCOME10'
  const copied = ref(false)

  onMounted(async () => {
    const token = route.query.token as string

    if (!token) {
      state.value = 'error'
      errorMessage.value = t('newsletter.confirm.noToken')
      return
    }

    try {
      const result = await confirmNewsletterSubscription(token)

      if (result.success) {
        state.value = 'success'
      } else {
        state.value = 'error'
        errorMessage.value = result.message === 'invalid_token'
          ? t('newsletter.confirm.invalidToken')
          : t('newsletter.confirm.errorMessage')
      }
    } catch {
      state.value = 'error'
    }
  })

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(promoCode)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch {
      // Fallback silencieux
    }
  }
</script>

<style scoped lang="less">
  .newsletter-confirm {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: @spacing-25;

    &__loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: @spacing-15;
      color: var(--text-secondary);
    }

    &__spinner {
      animation: spin 1s linear infinite;
      color: var(--primary-500);
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    &__content {
      max-width: 480px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: @spacing-20;
    }

    &__icon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      &--success {
        background: rgba(var(--success-500-rgb), 0.1);
      }

      &--error {
        background: rgba(var(--danger-500-rgb), 0.1);
      }
    }

    &__title {
      font-size: @font-size-h2;
      font-weight: @font-weight-bold;
      color: var(--text-primary);
      margin: 0;
    }

    &__subtitle {
      font-size: @font-size-body-l;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.6;

      &--error {
        color: var(--danger-500);
      }
    }

    &__promo {
      background: linear-gradient(135deg, rgba(var(--danger-500-rgb), 0.08), rgba(var(--danger-400-rgb), 0.12));
      border: 2px dashed var(--danger-500);
      border-radius: 16px;
      padding: @spacing-20 @spacing-25;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: @spacing-10;
      width: 100%;
    }

    &__promo-label {
      font-size: @font-size-body-s;
      color: var(--danger-600);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: @font-weight-semibold;
    }

    &__promo-code {
      display: flex;
      align-items: center;
      gap: @spacing-10;
      font-size: 28px;
      font-weight: @font-weight-bold;
      color: var(--danger-500);
      letter-spacing: 2px;
    }

    &__copy {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: @spacing-5;
      border-radius: 6px;
      color: var(--danger-500);
      transition: background 0.2s;

      &:hover {
        background: rgba(var(--danger-500-rgb), 0.15);
      }
    }

    &__promo-desc {
      font-size: @font-size-body-m;
      color: var(--danger-600);
    }
  }
</style>
