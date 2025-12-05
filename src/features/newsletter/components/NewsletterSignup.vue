<template>
  <div
    :class="[
      'newsletter-signup',
      `newsletter-signup--${variant}`,
      { 'newsletter-signup--success': isSuccess }
    ]"
  >
    <!-- Glow effect -->
    <div
      v-if="variant === 'premium'"
      class="newsletter-signup__glow"
    ></div>

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
        <!-- Header -->
        <div class="newsletter-signup__header">
          <div
            v-if="variant === 'premium'"
            class="newsletter-signup__badge"
          >
            <BasicIconNext
              name="Sparkles"
              :size="14"
            />
            <span>{{ t('newsletter.badge') }}</span>
          </div>

          <div class="newsletter-signup__icon-wrapper">
            <BasicIconNext
              :name="variant === 'premium' ? 'Mail' : 'Send'"
              :size="variant === 'premium' ? 24 : 20"
              class="newsletter-signup__icon"
            />
          </div>

          <div class="newsletter-signup__text">
            <h4 class="newsletter-signup__title">{{ title || t('newsletter.title') }}</h4>
            <p class="newsletter-signup__desc">{{ description || t('newsletter.description') }}</p>
          </div>
        </div>

        <!-- Features (Premium only) -->
        <ul
          v-if="variant === 'premium' && showFeatures"
          class="newsletter-signup__features"
        >
          <li
            v-for="feature in features"
            :key="feature"
          >
            <BasicIconNext
              name="Check"
              :size="16"
            />
            <span>{{ feature }}</span>
          </li>
        </ul>

        <!-- Form -->
        <form
          class="newsletter-signup__form"
          @submit.prevent="handleSubmit"
        >
          <div class="newsletter-signup__input-wrapper">
            <!-- Compact: use InputContainer directly for lighter look -->
            <InputContainer
              v-if="variant === 'compact'"
              v-model="email"
              size="small"
              variant="ghost"
              icon-name="Mail"
              icon-state="iconLeft"
              :disabled="isLoading"
              class="newsletter-signup__input"
            >
              <input
                v-model="email"
                type="email"
                :placeholder="t('newsletter.placeholder')"
                autocomplete="email"
                :disabled="isLoading"
                @keydown.enter="handleSubmit"
              />
            </InputContainer>

            <!-- Premium/Default: use BasicInput -->
            <BasicInput
              v-else
              v-model="email"
              type="email"
              :placeholder="t('newsletter.placeholder')"
              icon-name="Mail"
              icon-state="iconLeft"
              autocomplete="email"
              :size="variant === 'premium' ? 'large' : 'medium'"
              :disabled="isLoading"
              class="newsletter-signup__input"
              @keydown.enter="handleSubmit"
            />

            <!-- Name field for premium variant -->
            <BasicInput
              v-if="variant === 'premium' && showNameField"
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
            :size="variant === 'premium' ? 'lg' : 'sm'"
            :icon-left="variant === 'premium' ? 'ArrowRight' : undefined"
            :icon-right="variant === 'compact' ? 'ArrowRight' : undefined"
            :label="variant === 'premium' ? t('newsletter.cta') : ''"
            :loading="isLoading"
            :glow="variant === 'premium'"
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
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { subscribeToNewsletter } from '@/api/supabase/newsletter'
  import { useLanguage } from '@/composables/useLanguage'
  import InputContainer from '@designSystem/components/wrapper/inputContainer/InputContainer.vue'
  import type { NewsletterSource } from '@/api/supabase/newsletter'

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
  // COMPUTED
  // ============================================

  const features = computed(() => [
    t('newsletter.features.exclusive'),
    t('newsletter.features.research'),
    t('newsletter.features.promotions'),
    t('newsletter.features.unsubscribe'),
  ])

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
  @import '@designSystem/fondation/colors/colors.less';
  @import '@designSystem/fondation/breakpoints/responsive-mixins.less';

  // Variables
  @ease: cubic-bezier(0.4, 0, 0.2, 1);
  @ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  // ============================================
  // BASE STYLES
  // ============================================

  .newsletter-signup {
    position: relative;
    width: 100%;

    // ============================================
    // PREMIUM VARIANT
    // ============================================

    &--premium {
      padding: 40px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.08) 0%,
        rgba(var(--primary-700-rgb), 0.04) 50%,
        rgba(var(--secondary-900-rgb), 0.95) 100%
      );
      border: 1px solid rgba(var(--primary-500-rgb), 0.15);
      border-radius: 24px;
      overflow: hidden;

      .newsletter-signup__glow {
        position: absolute;
        top: -50%;
        left: 50%;
        transform: translateX(-50%);
        width: 200%;
        height: 100%;
        background: radial-gradient(
          ellipse at center top,
          rgba(var(--primary-400-rgb), 0.15) 0%,
          transparent 60%
        );
        pointer-events: none;
        animation: pulse-glow 4s ease-in-out infinite;
      }

      .newsletter-signup__content {
        position: relative;
        z-index: 1;
      }

      .newsletter-signup__header {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 16px;
        margin-bottom: 24px;
      }

      .newsletter-signup__badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        background: linear-gradient(
          135deg,
          rgba(var(--primary-500-rgb), 0.2) 0%,
          rgba(var(--primary-600-rgb), 0.1) 100%
        );
        border: 1px solid rgba(var(--primary-400-rgb), 0.3);
        border-radius: 100px;
        font-size: 11px;
        font-weight: 600;
        color: var(--primary-300);
        text-transform: uppercase;
        letter-spacing: 0.5px;

        svg {
          color: var(--primary-400);
        }
      }

      .newsletter-signup__icon-wrapper {
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
          135deg,
          rgba(var(--primary-500-rgb), 0.15) 0%,
          rgba(var(--primary-700-rgb), 0.05) 100%
        );
        border: 1px solid rgba(var(--primary-400-rgb), 0.2);
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(var(--primary-500-rgb), 0.15);
      }

      .newsletter-signup__icon {
        color: var(--primary-400);
      }

      .newsletter-signup__title {
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(135deg, @white 0%, rgba(255, 255, 255, 0.8) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0;
      }

      .newsletter-signup__desc {
        font-size: 15px;
        color: rgba(255, 255, 255, 0.6);
        max-width: 400px;
        margin: 4px auto 0;
        line-height: 1.5;
      }

      .newsletter-signup__features {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        list-style: none;
        padding: 0;
        margin: 0 0 28px;

        li {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.2s @ease;

          &:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(var(--primary-500-rgb), 0.2);
          }

          svg {
            color: var(--success-500);
            flex-shrink: 0;
          }
        }
      }

      .newsletter-signup__form {
        flex-direction: column;
        gap: 12px;
      }

      .newsletter-signup__input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
      }

      .newsletter-signup__input {
        width: 100%;
      }

      .newsletter-signup__btn {
        width: 100%;
        margin-top: 4px;
      }

      .newsletter-signup__privacy {
        text-align: center;
        margin-top: 16px;
      }

      // Responsive
      .respond-mobile({
        padding: 28px 20px;

        .newsletter-signup__title {
          font-size: 22px;
        }

        .newsletter-signup__features {
          grid-template-columns: 1fr;
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
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .newsletter-signup__icon-wrapper {
        flex-shrink: 0;
      }

      .newsletter-signup__icon {
        color: var(--primary-400);
      }

      .newsletter-signup__title {
        font-size: 13px;
        font-weight: 600;
        color: @white;
        margin: 0;
      }

      .newsletter-signup__desc {
        display: none;
      }

      .newsletter-signup__form {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .newsletter-signup__input-wrapper {
        flex: 0 1 200px;
        min-width: 0;
      }

      .newsletter-signup__input {
        width: 100%;

        // Style l'input natif transparent
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

      .newsletter-signup__btn {
        flex-shrink: 0;
      }

      .newsletter-signup__privacy {
        display: none;
      }

      // Responsive
      .respond-mobile({
        .newsletter-signup__form {
          flex-direction: column;
          gap: 10px;
        }

        .newsletter-signup__input-wrapper {
          flex: 1;
          width: 100%;
        }

        .newsletter-signup__btn {
          width: 100%;
        }
      });
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
        color: @white;
        margin: 8px 0 0;
      }

      .newsletter-signup__success-desc {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
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
      color: rgba(255, 255, 255, 0.35);
      margin: 0;

      svg {
        color: rgba(255, 255, 255, 0.25);
      }
    }
  }

  // ============================================
  // ANIMATIONS
  // ============================================

  @keyframes pulse-glow {
    0%,
    100% {
      opacity: 0.5;
      transform: translateX(-50%) scale(1);
    }
    50% {
      opacity: 0.8;
      transform: translateX(-50%) scale(1.05);
    }
  }

  @keyframes success-pop {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
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
    transform: scale(1.02);
  }
</style>
