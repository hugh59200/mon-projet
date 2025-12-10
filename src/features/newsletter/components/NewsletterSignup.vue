<template>
  <div
    :class="[
      'newsletter-signup',
      `newsletter-signup--${variant}`,
      { 'newsletter-signup--success': isSuccess },
    ]"
  >
    <!-- Success State -->
    <Transition
      name="fade-scale"
      mode="out-in"
    >
      <div
        v-if="isSuccess"
        key="success"
        class="newsletter-signup__success"
      >
        <div class="newsletter-signup__success-icon">
          <BasicIconNext
            name="CheckCircle"
            :size="variant === 'premium' ? 48 : 32"
          />
        </div>
        <h4 class="newsletter-signup__success-title">{{ t('newsletter.success.title') }}</h4>
        <p class="newsletter-signup__success-desc">{{ t('newsletter.success.description') }}</p>
      </div>

      <!-- Form State -->
      <div
        v-else
        key="form"
        class="newsletter-signup__content"
      >
        <!-- Premium Layout -->
        <template v-if="variant === 'premium'">
          <!-- Promo Banner -->
          <div class="newsletter-signup__promo-banner">
            <span class="newsletter-signup__promo-badge">-10%</span>
            <span class="newsletter-signup__promo-text">{{ t('newsletter.promoBanner') }}</span>
          </div>

          <!-- Title & Description -->
          <div class="newsletter-signup__header-premium">
            <h4 class="newsletter-signup__title">{{ title || t('newsletter.title') }}</h4>
            <p class="newsletter-signup__desc">{{ description || t('newsletter.description') }}</p>
          </div>

          <!-- Form -->
          <form
            class="newsletter-signup__form"
            @submit.prevent="handleSubmit"
          >
            <div class="newsletter-signup__input-wrapper">
              <BasicInput
                v-model="email"
                type="email"
                :placeholder="t('newsletter.placeholder')"
                icon-name="Mail"
                icon-state="iconLeft"
                autocomplete="email"
                size="large"
                :disabled="isLoading"
                class="newsletter-signup__input"
                @keydown.enter="handleSubmit"
              />

              <BasicInput
                v-if="showNameField"
                v-model="firstName"
                type="text"
                :placeholder="t('newsletter.namePlaceholder')"
                icon-name="User"
                icon-state="iconLeft"
                autocomplete="given-name"
                size="large"
                :disabled="isLoading"
                class="newsletter-signup__input"
              />
            </div>

            <PremiumButton
              type="primary"
              variant="solid"
              size="lg"
              icon-right="ArrowRight"
              :label="t('newsletter.cta')"
              :loading="isLoading"
              html-type="submit"
              class="newsletter-signup__btn"
            />
          </form>

          <!-- Error message -->
          <Transition name="fade">
            <p
              v-if="errorMessage"
              class="newsletter-signup__error"
            >
              <BasicIconNext
                name="AlertCircle"
                :size="14"
              />
              {{ errorMessage }}
            </p>
          </Transition>

          <!-- Privacy note -->
          <p class="newsletter-signup__privacy">
            <BasicIconNext
              name="Lock"
              :size="12"
            />
            {{ t('newsletter.privacy') }}
          </p>
        </template>

        <!-- Other variants (compact, inline) -->
        <template v-else>
          <!-- Header -->
          <div class="newsletter-signup__header">
            <div class="newsletter-signup__icon-wrapper">
              <BasicIconNext
                name="Send"
                :size="20"
                class="newsletter-signup__icon"
              />
            </div>

            <div class="newsletter-signup__text">
              <h4 class="newsletter-signup__title">{{ title || t('newsletter.title') }}</h4>
              <p class="newsletter-signup__desc">
                {{ description || t('newsletter.description') }}
              </p>
            </div>
          </div>

          <!-- Form -->
          <form
            class="newsletter-signup__form"
            @submit.prevent="handleSubmit"
          >
            <!-- Compact title -->
            <span
              v-if="variant === 'compact'"
              class="newsletter-signup__compact-title"
            >
              {{ t('newsletter.compactTitle') }}
            </span>

            <div class="newsletter-signup__input-wrapper">
              <!-- Compact: input avec bouton intégré à droite -->
              <div
                v-if="variant === 'compact'"
                class="newsletter-signup__input-inline"
              >
                <BasicIconNext
                  name="Mail"
                  :size="16"
                  class="newsletter-signup__input-icon"
                />
                <input
                  v-model="email"
                  type="email"
                  :placeholder="t('newsletter.placeholder')"
                  autocomplete="email"
                  :disabled="isLoading"
                  class="newsletter-signup__input-field"
                  @keydown.enter="handleSubmit"
                />
                <PremiumButton
                  type="primary"
                  variant="solid"
                  size="sm"
                  icon-left="ArrowRight"
                  :loading="isLoading"
                  :disabled="isLoading"
                  class="newsletter-signup__input-btn"
                  @click="handleSubmit"
                />
              </div>

              <!-- Inline variant -->
              <BasicInput
                v-else
                v-model="email"
                type="email"
                :placeholder="t('newsletter.placeholder')"
                icon-name="Mail"
                icon-state="iconLeft"
                autocomplete="email"
                size="medium"
                :disabled="isLoading"
                class="newsletter-signup__input"
                @keydown.enter="handleSubmit"
              />
            </div>

            <PremiumButton
              v-if="variant !== 'compact'"
              type="primary"
              variant="solid"
              size="sm"
              icon-right="ArrowRight"
              :label="''"
              :loading="isLoading"
              html-type="submit"
              class="newsletter-signup__btn"
            />
          </form>

          <!-- Error message -->
          <Transition name="fade">
            <p
              v-if="errorMessage"
              class="newsletter-signup__error"
            >
              <BasicIconNext
                name="AlertCircle"
                :size="14"
              />
              {{ errorMessage }}
            </p>
          </Transition>

          <!-- Privacy note -->
          <p class="newsletter-signup__privacy">
            <BasicIconNext
              name="Lock"
              :size="12"
            />
            {{ t('newsletter.privacy') }}
          </p>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import type { NewsletterSource } from '@/api/supabase/newsletter'
  import { subscribeToNewsletter } from '@/api/supabase/newsletter'
  import { useLanguage } from '@/composables/useLanguage'
  import { ref } from 'vue'

  // ============================================
  // PROPS
  // ============================================

  interface Props {
    variant?: 'premium' | 'compact' | 'inline'
    source?: NewsletterSource
    title?: string
    description?: string
    showFeatures?: boolean
    showNameField?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'compact',
    source: 'website',
    title: '',
    description: '',
    showFeatures: true,
    showNameField: false,
  })

  // ============================================
  // COMPOSABLES
  // ============================================

  const { t, locale } = useLanguage()

  // ============================================
  // STATE
  // ============================================

  const email = ref('')
  const firstName = ref('')
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const errorMessage = ref('')

  // ============================================
  // METHODS
  // ============================================

  function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  async function handleSubmit() {
    errorMessage.value = ''

    // Validation
    if (!email.value.trim()) {
      errorMessage.value = t('newsletter.errors.required')
      return
    }

    if (!validateEmail(email.value)) {
      errorMessage.value = t('newsletter.errors.invalid')
      return
    }

    isLoading.value = true

    try {
      const result = await subscribeToNewsletter({
        email: email.value.trim(),
        firstName: firstName.value.trim() || undefined,
        source: props.source,
        locale: locale.value,
      })

      if (result.success) {
        isSuccess.value = true
        email.value = ''
        firstName.value = ''
      } else {
        switch (result.message) {
          case 'already_subscribed':
            errorMessage.value = t('newsletter.errors.alreadySubscribed')
            break
          default:
            errorMessage.value = t('newsletter.errors.generic')
        }
      }
    } catch {
      errorMessage.value = t('newsletter.errors.generic')
    } finally {
      isLoading.value = false
    }
  }
</script>

<style scoped lang="less">
  // Variables
  @ease: cubic-bezier(0.4, 0, 0.2, 1);
  @ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  // ============================================
  // BASE STYLES
  // ============================================

  .newsletter-signup {
    // ============================================
    // PREMIUM VARIANT - Design épuré et aligné
    // ============================================

    // ContentBlock gère le padding
    &--premium {
      background: transparent;
      overflow: hidden;

      .newsletter-signup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0;
      }

      // Promo Banner (bandeau rouge)
      .newsletter-signup__promo-banner {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        width: 100%;
        padding: 14px 24px;
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        position: relative;
        overflow: hidden;
        border-radius: 12px 12px 0 0;

        // Effet brillant subtil
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.15) 50%,
            transparent 100%
          );
          animation: shine 3s ease-in-out infinite;
        }
      }

      @keyframes shine {
        0% {
          left: -100%;
        }
        50%,
        100% {
          left: 100%;
        }
      }

      .newsletter-signup__promo-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 6px 14px;
        background: @white;
        color: #dc2626;
        font-size: 18px;
        font-weight: 800;
        border-radius: 6px;
        letter-spacing: -0.02em;
        position: relative;
        z-index: 1;
      }

      .newsletter-signup__promo-text {
        color: @white;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.02em;
        position: relative;
        z-index: 1;
      }

      // Header
      .newsletter-signup__header-premium {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 24px 24px 0;
      }

      .newsletter-signup__title {
        font-size: 24px;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
        letter-spacing: -0.02em;
      }

      .newsletter-signup__desc {
        font-size: 14px;
        color: var(--text-secondary);
        max-width: 320px;
        margin: 0 auto;
        line-height: 1.6;
      }

      // Benefits inline
      .newsletter-signup__benefits {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 12px 0;
      }

      .newsletter-signup__benefit {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 500;
        color: var(--text-muted);

        svg {
          color: var(--primary-400);
        }
      }

      // Form
      .newsletter-signup__form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 20px 24px 0;
        box-sizing: border-box;
      }

      .newsletter-signup__input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
      }

      .newsletter-signup__input {
        width: 100%;
      }

      .newsletter-signup__btn {
        width: 100%;
        margin-top: 4px;
      }

      .newsletter-signup__error {
        margin: 8px 24px 0;
      }

      .newsletter-signup__privacy {
        text-align: center;
        margin-top: 8px;
        padding: 0 24px 24px;
      }

      // Responsive
      .respond-mobile({
        .newsletter-signup__promo-banner {
          flex-direction: column;
          gap: 6px;
          padding: 12px 16px;
        }

        .newsletter-signup__promo-badge {
          font-size: 16px;
          padding: 5px 12px;
        }

        .newsletter-signup__promo-text {
          font-size: 12px;
        }

        .newsletter-signup__header-premium {
          padding: 20px 16px 0;
        }

        .newsletter-signup__title {
          font-size: 20px;
        }

        .newsletter-signup__desc {
          font-size: 13px;
        }

        .newsletter-signup__form {
          padding: 16px 16px 0;
        }

        .newsletter-signup__privacy {
          padding: 0 16px 20px;
        }
      });
    }

    // ============================================
    // COMPACT VARIANT (Footer)
    // ============================================

    &--compact {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .newsletter-signup__header {
        display: none;
      }

      .newsletter-signup__compact-title {
        font-size: 11px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.7);
        text-transform: uppercase;
        letter-spacing: 0.8px;
      }

      .newsletter-signup__form {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
      }

      .newsletter-signup__input-wrapper {
        width: 100%;
      }

      .newsletter-signup__input {
        width: 100%;

        input {
          background: transparent;
          border: none;
          color: @white;
          font-size: 13px;
          width: 100%;
          outline: none;

          &::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }
        }
      }

      // Input inline avec bouton intégré
      .newsletter-signup__input-inline {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        transition: all 0.2s @ease;

        &:focus-within {
          border-color: rgba(var(--primary-500-rgb), 0.4);
          background: rgba(255, 255, 255, 0.07);
        }
      }

      .newsletter-signup__input-icon {
        color: rgba(255, 255, 255, 0.4);
        flex-shrink: 0;
      }

      .newsletter-signup__input-field {
        flex: 1;
        background: transparent;
        border: none;
        color: @white;
        font-size: 13px;
        outline: none;
        min-width: 0;

        &::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        &:disabled {
          opacity: 0.6;
        }
      }

      .newsletter-signup__input-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s @ease;
        flex-shrink: 0;

        svg {
          color: @white;
        }

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-500) 100%);
          transform: translateX(2px);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      .newsletter-signup__input-btn-loading {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .newsletter-signup__btn {
        // Aligné à droite par le parent
      }

      .newsletter-signup__privacy {
        display: none;
      }
    }

    // ============================================
    // INLINE VARIANT
    // ============================================

    &--inline {
      .newsletter-signup__header {
        display: none;
      }

      .newsletter-signup__form {
        display: flex;
        gap: 8px;
      }

      .newsletter-signup__input-wrapper {
        flex: 1;
      }

      .newsletter-signup__privacy {
        display: none;
      }
    }

    // ============================================
    // SUCCESS STATE
    // ============================================

    &--success {
      .newsletter-signup__success {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 32px 20px;
        gap: 12px;
      }

      .newsletter-signup__success-icon {
        width: 72px;
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
          135deg,
          rgba(var(--success-500-rgb), 0.15) 0%,
          rgba(var(--success-600-rgb), 0.05) 100%
        );
        border-radius: 50%;
        animation: success-pop 0.5s @ease-spring;

        svg {
          color: var(--success-400);
        }
      }

      .newsletter-signup__success-title {
        font-size: 20px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 8px 0 0;
      }

      .newsletter-signup__success-desc {
        font-size: 14px;
        color: var(--text-secondary);
        max-width: 280px;
        margin: 0;
      }
    }

    // Success state for compact variant (footer)
    &--compact&--success {
      .newsletter-signup__success {
        flex-direction: row;
        align-items: center;
        text-align: left;
        padding: 16px 20px;
        gap: 14px;
      }

      .newsletter-signup__success-icon {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
      }

      .newsletter-signup__success-title {
        font-size: 14px;
        margin: 0;
      }

      .newsletter-signup__success-desc {
        font-size: 12px;
        max-width: none;
        margin: 2px 0 0;
      }
    }

    // ============================================
    // SHARED ELEMENTS
    // ============================================

    &__form {
      display: flex;
    }

    &__error {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 12px 0 0;
      padding: 10px 14px;
      background: rgba(var(--danger-500-rgb), 0.1);
      border: 1px solid rgba(var(--danger-500-rgb), 0.2);
      border-radius: 8px;
      font-size: 13px;
      color: var(--danger-400);

      svg {
        flex-shrink: 0;
      }
    }

    &__privacy {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 11px;
      color: var(--text-muted);
      margin: 0;

      svg {
        color: var(--text-muted);
        opacity: 0.7;
      }
    }
  }

  @keyframes success-pop {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  // Transitions Vue
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s @ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: all 0.4s @ease;
  }

  .fade-scale-enter-from {
    opacity: 0;
    transform: scale(0.95);
  }

  .fade-scale-leave-to {
    opacity: 0;
    transform: scale(1);
  }
</style>
