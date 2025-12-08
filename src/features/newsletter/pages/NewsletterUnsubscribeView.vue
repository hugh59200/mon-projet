<template>
  <div class="newsletter-unsubscribe">
    <!-- Loading State -->
    <div
      v-if="state === 'loading'"
      class="newsletter-unsubscribe__loading"
    >
      <div class="newsletter-unsubscribe__spinner">
        <BasicIconNext
          name="Loader2"
          :size="40"
        />
      </div>
      <p>{{ t('common.loading') }}</p>
    </div>

    <!-- Confirm State -->
    <div
      v-else-if="state === 'confirm'"
      class="newsletter-unsubscribe__content"
    >
      <div class="newsletter-unsubscribe__icon">
        <BasicIconNext
          name="MailX"
          :size="64"
          color="text-200"
        />
      </div>

      <h1 class="newsletter-unsubscribe__title">{{ t('newsletter.unsubscribe.confirmTitle') }}</h1>
      <p class="newsletter-unsubscribe__subtitle">{{ t('newsletter.unsubscribe.confirmMessage') }}</p>

      <div class="newsletter-unsubscribe__email">
        <BasicIconNext
          name="Mail"
          :size="18"
        />
        {{ email }}
      </div>

      <!-- Reason input -->
      <div class="newsletter-unsubscribe__reason">
        <label for="reason">{{ t('newsletter.unsubscribe.reasonLabel') }}</label>
        <textarea
          id="reason"
          v-model="reason"
          :placeholder="t('newsletter.unsubscribe.reasonPlaceholder')"
          rows="3"
        />
      </div>

      <div class="newsletter-unsubscribe__actions">
        <PremiumButton
          :label="t('newsletter.unsubscribe.ctaCancel')"
          type="secondary"
          variant="outline"
          size="lg"
          @click="$router.push('/')"
        />
        <PremiumButton
          :label="t('newsletter.unsubscribe.ctaConfirm')"
          type="danger"
          variant="solid"
          size="lg"
          :loading="isSubmitting"
          @click="handleUnsubscribe"
        />
      </div>
    </div>

    <!-- Success State -->
    <div
      v-else-if="state === 'success'"
      class="newsletter-unsubscribe__content"
    >
      <div class="newsletter-unsubscribe__icon newsletter-unsubscribe__icon--success">
        <BasicIconNext
          name="CheckCircle"
          :size="64"
          color="success-500"
        />
      </div>

      <h1 class="newsletter-unsubscribe__title">{{ t('newsletter.unsubscribe.successTitle') }}</h1>
      <p class="newsletter-unsubscribe__subtitle">{{ t('newsletter.unsubscribe.successMessage') }}</p>

      <div class="newsletter-unsubscribe__resubscribe">
        <p>{{ t('newsletter.unsubscribe.resubscribePrompt') }}</p>
        <PremiumButton
          :label="t('newsletter.unsubscribe.ctaResubscribe')"
          type="primary"
          variant="outline"
          size="md"
          @click="$router.push('/')"
        />
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="state === 'error'"
      class="newsletter-unsubscribe__content"
    >
      <div class="newsletter-unsubscribe__icon newsletter-unsubscribe__icon--error">
        <BasicIconNext
          name="AlertTriangle"
          :size="64"
          color="danger-500"
        />
      </div>

      <h1 class="newsletter-unsubscribe__title">{{ t('newsletter.unsubscribe.errorTitle') }}</h1>
      <p class="newsletter-unsubscribe__subtitle newsletter-unsubscribe__subtitle--error">
        {{ errorMessage }}
      </p>

      <PremiumButton
        :label="t('newsletter.unsubscribe.ctaHome')"
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
  import { unsubscribeFromNewsletter } from '@/api/supabase/newsletter'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'

  const { t } = useI18n()
  const route = useRoute()

  const state = ref<'loading' | 'confirm' | 'success' | 'error'>('loading')
  const email = ref('')
  const reason = ref('')
  const errorMessage = ref('')
  const isSubmitting = ref(false)

  onMounted(() => {
    const emailParam = route.query.email as string

    if (!emailParam) {
      state.value = 'error'
      errorMessage.value = t('newsletter.unsubscribe.noEmail')
      return
    }

    email.value = decodeURIComponent(emailParam)
    state.value = 'confirm'
  })

  async function handleUnsubscribe() {
    if (isSubmitting.value) return

    isSubmitting.value = true

    try {
      const result = await unsubscribeFromNewsletter(email.value, reason.value || undefined)

      if (result.success) {
        state.value = 'success'
      } else {
        state.value = 'error'
        errorMessage.value = t('newsletter.unsubscribe.errorGeneric')
      }
    } catch {
      state.value = 'error'
      errorMessage.value = t('newsletter.unsubscribe.errorGeneric')
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<style scoped lang="less">
  .newsletter-unsubscribe {
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
      background: var(--bg-surface-tertiary);

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

    &__email {
      display: flex;
      align-items: center;
      gap: @spacing-10;
      padding: @spacing-15 @spacing-20;
      background: var(--bg-surface-secondary);
      border-radius: 12px;
      font-size: @font-size-body-m;
      color: var(--text-primary);
      font-weight: @font-weight-semibold;
    }

    &__reason {
      width: 100%;
      text-align: left;

      label {
        display: block;
        font-size: @font-size-body-s;
        color: var(--text-secondary);
        margin-bottom: @spacing-10;
      }

      textarea {
        width: 100%;
        padding: @spacing-15;
        border: 1px solid var(--border-default);
        border-radius: 12px;
        font-size: @font-size-body-m;
        font-family: inherit;
        resize: vertical;
        background: var(--bg-surface);
        color: var(--text-primary);
        transition: border-color 0.2s;

        &:focus {
          outline: none;
          border-color: var(--primary-500);
        }

        &::placeholder {
          color: var(--text-muted);
        }
      }
    }

    &__actions {
      display: flex;
      gap: @spacing-15;
      width: 100%;

      > * {
        flex: 1;
      }
    }

    &__resubscribe {
      margin-top: @spacing-15;
      padding-top: @spacing-20;
      border-top: 1px solid var(--border-default);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: @spacing-15;

      p {
        margin: 0;
        font-size: @font-size-body-m;
        color: var(--text-muted);
      }
    }
  }
</style>
