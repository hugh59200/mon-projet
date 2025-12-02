<template>
  <header
    class="page-header"
    :class="[
      `page-header--${variant}`,
      `page-header--${theme}`,
      { 'page-header--compact': compact },
      { 'page-header--with-back': showBack },
    ]"
  >
    <!-- Background décoratif -->
    <div
      v-if="variant === 'premium'"
      class="page-header__bg"
    >
      <div class="page-header__bg-gradient"></div>
      <div class="page-header__bg-pattern"></div>
      <div class="page-header__bg-orb page-header__bg-orb--1"></div>
      <div class="page-header__bg-orb page-header__bg-orb--2"></div>
      <div
        v-if="theme === 'dark'"
        class="page-header__bg-orb page-header__bg-orb--3"
      ></div>
    </div>

    <div class="page-header__container">
      <!-- Back button -->
      <button
        v-if="showBack"
        class="page-header__back"
        @click="handleBack"
      >
        <BasicIconNext name="ArrowLeft" :size="20" />
        <span>{{ translatedBackLabel }}</span>
      </button>

      <!-- Actions slot (en haut à droite) -->
      <div
        v-if="$slots.actions"
        class="page-header__actions"
      >
        <slot name="actions"></slot>
      </div>

      <!-- Header content -->
      <div class="page-header__content">
        <!-- Badge -->
        <div
          v-if="displayBadge || displayIcon || $slots.badge"
          class="page-header__badge"
        >
          <slot name="badge">
            <BasicIconNext
              v-if="displayIcon"
              :name="displayIcon"
              :size="16"
            />
            <span v-if="displayBadge">{{ displayBadge }}</span>
          </slot>
        </div>

        <!-- Title -->
        <h1 class="page-header__title">
          {{ splitTitle.start }}
          <span
            v-if="splitTitle.end"
            class="page-header__title-highlight"
          >
            {{ splitTitle.end }}
          </span>
        </h1>

        <!-- Subtitle -->
        <p
          v-if="displayDescription && !compact"
          class="page-header__subtitle"
        >
          {{ displayDescription }}
        </p>

        <!-- Stats slot -->
        <div
          v-if="$slots.stats"
          class="page-header__stats"
        >
          <slot name="stats"></slot>
        </div>
      </div>

      <!-- Default slot (contenu additionnel sous le header) -->
      <div
        v-if="$slots.default"
        class="page-header__extra"
      >
        <slot></slot>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import BasicIconNext, {
    type IconNameNext,
  } from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'

  export type PageHeaderVariant = 'simple' | 'card' | 'premium'
  export type PageHeaderTheme = 'light' | 'dark'

  const { t } = useI18n()

  const props = withDefaults(
    defineProps<{
      variant?: PageHeaderVariant
      theme?: PageHeaderTheme
      title?: string
      description?: string
      badge?: string
      icon?: string
      compact?: boolean
      showBack?: boolean
      backLabel?: string
      backTo?: string
    }>(),
    {
      variant: 'premium',
      theme: 'dark',
    },
  )

  const emit = defineEmits<{
    back: []
  }>()

  const route = useRoute()
  const router = useRouter()

  const translatedBackLabel = computed(() => props.backLabel || t('common.back'))

  const rawTitle = computed(() => {
    if (props.title) return props.title
    // Use headingKey if available, otherwise fallback to heading
    if (route.meta.headingKey) return t(route.meta.headingKey as string)
    if (route.meta.heading) return route.meta.heading as string
    // Use titleKey if available
    if (route.meta.titleKey) return t(route.meta.titleKey as string).replace(' – Fast Peptides', '')
    if (route.meta.title) return (route.meta.title as string).replace(' – Fast Peptides', '')
    return ''
  })

  const displayBadge = computed(() => {
    if (props.badge) return props.badge
    if (route.meta.badgeKey) return t(route.meta.badgeKey as string)
    if (route.meta.badge) return route.meta.badge as string
    return ''
  })

  const displayIcon = computed<IconNameNext | undefined>(() => {
    const icon = props.icon || route.meta.headerIcon
    return icon as IconNameNext | undefined
  })

  const displayDescription = computed(() => {
    if (props.description) return props.description
    if (route.meta.descriptionKey) return t(route.meta.descriptionKey as string)
    if (route.meta.description) return route.meta.description as string
    return ''
  })

  const splitTitle = computed(() => {
    const text = rawTitle.value.trim()
    if (!text) return { start: '', end: '' }

    const parts = text.split(' ')
    if (parts.length > 1) {
      const lastWord = parts.pop()
      return { start: parts.join(' ') + ' ', end: lastWord }
    }

    return { start: '', end: text }
  })

  function handleBack() {
    emit('back')
    if (props.backTo) {
      router.push(props.backTo)
    } else {
      router.back()
    }
  }
</script>

<style scoped lang="less">
  .page-header {
    position: relative;
    overflow: hidden;
    text-align: center;

    // ========================================
    // VARIANTS
    // ========================================

    // Simple: pas de fond, juste le texte
    &--simple {
      padding: 32px 24px;

      .page-header__title {
        font-size: 28px;
      }
    }

    // Card: fond sombre avec bordure (style admin)
    &--card {
      background: rgba(var(--secondary-900-rgb), 0.85);
      border: 1px solid color-mix(in srgb, @neutral-300 25%, transparent);
      box-shadow:
        0 8px 28px fade(#000, 35%),
        inset 0 0 0 1px fade(@white, 12%);
      padding: 34px 32px;
      margin-bottom: 10px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(var(--primary-500-rgb), 0.3),
          transparent
        );
      }
    }

    // Premium: avec background décoratif
    &--premium {
      padding: 48px 24px 40px;

      &.page-header--compact {
        padding: 32px 24px 24px;
        min-height: auto;

        .page-header__title {
          font-size: 32px;
        }
      }
    }

    // ========================================
    // THEMES
    // ========================================

    &--dark {
      .page-header__title {
        color: @neutral-100;
      }

      .page-header__subtitle {
        color: @neutral-400;
      }

      .page-header__badge {
        background: rgba(var(--primary-500-rgb), 0.12);
        border: 1px solid rgba(var(--primary-400-rgb), 0.2);
        color: var(--primary-400);

        svg {
          color: var(--primary-400);
        }
      }

      .page-header__back {
        background: rgba(var(--secondary-800-rgb), 0.6);
        border: 1px solid rgba(var(--neutral-700-rgb), 0.3);
        color: @neutral-400;

        &:hover {
          background: rgba(var(--secondary-700-rgb), 0.8);
          color: @neutral-200;
        }
      }

      .page-header__bg-gradient {
        background: linear-gradient(
          135deg,
          rgba(var(--secondary-900-rgb), 0.97) 0%,
          rgba(var(--secondary-800-rgb), 0.95) 50%,
          rgba(var(--secondary-900-rgb), 0.98) 100%
        );
      }

      .page-header__bg-orb {
        &--1 {
          background: radial-gradient(
            circle,
            rgba(var(--primary-500-rgb), 0.15) 0%,
            transparent 70%
          );
        }

        &--2 {
          background: radial-gradient(
            circle,
            rgba(var(--secondary-500-rgb), 0.12) 0%,
            transparent 70%
          );
        }

        &--3 {
          background: radial-gradient(
            circle,
            rgba(var(--primary-400-rgb), 0.08) 0%,
            transparent 70%
          );
        }
      }
    }

    &--light {
      .page-header__title {
        color: @neutral-900;
      }

      .page-header__subtitle {
        color: @neutral-500;
      }

      .page-header__badge {
        background: linear-gradient(
          135deg,
          rgba(var(--primary-500-rgb), 0.1) 0%,
          rgba(var(--primary-500-rgb), 0.05) 100%
        );
        border: 1px solid rgba(var(--primary-500-rgb), 0.15);

        svg {
          color: var(--primary-600);
        }

        span {
          color: var(--primary-700);
        }
      }

      .page-header__back {
        background: white;
        border: 1px solid @neutral-200;
        color: @neutral-700;

        &:hover {
          background: @neutral-50;
          border-color: var(--primary-300);
          color: var(--primary-700);
        }
      }

      .page-header__bg-gradient {
        background: linear-gradient(
          160deg,
          @neutral-50 0%,
          white 50%,
          rgba(var(--primary-500-rgb), 0.03) 100%
        );
      }

      .page-header__bg-orb {
        &--1 {
          background: radial-gradient(
            circle,
            rgba(var(--primary-400-rgb), 0.1) 0%,
            transparent 70%
          );
        }

        &--2 {
          background: radial-gradient(
            circle,
            rgba(var(--primary-300-rgb), 0.08) 0%,
            transparent 70%
          );
        }
      }

      .page-header__title-highlight {
        background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    // ========================================
    // BACKGROUND
    // ========================================
    &__bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }

    &__bg-gradient {
      position: absolute;
      inset: 0;
    }

    &__bg-pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(var(--primary-500-rgb), 0.03) 1px, transparent 1px);
      background-size: 24px 24px;
    }

    &__bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.5;

      &--1 {
        width: 400px;
        height: 400px;
        top: -150px;
        right: -100px;
      }

      &--2 {
        width: 300px;
        height: 300px;
        bottom: -100px;
        left: -50px;
      }

      &--3 {
        width: 250px;
        height: 250px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.3;
      }
    }

    // ========================================
    // CONTAINER
    // ========================================
    &__container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: min(1200px, 100%);
      margin: 0 auto;
      padding: 0 24px;

      @media (max-width: 768px) {
        padding: 0 16px;
      }
    }

    // ========================================
    // CONTENT
    // ========================================
    &__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    // ========================================
    // BADGE
    // ========================================
    &__badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.02em;
      margin-bottom: 8px;
      backdrop-filter: blur(8px);
    }

    // ========================================
    // TITLE
    // ========================================
    &__title {
      font-size: 42px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin: 0;
      line-height: 1.15;

      @media (max-width: 768px) {
        font-size: 32px;
      }

      @media (max-width: 480px) {
        font-size: 26px;
      }
    }

    &__title-highlight {
      background: linear-gradient(
        135deg,
        var(--secondary-500) 0%,
        var(--primary-500) 50%,
        var(--primary-400) 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 8px rgba(var(--primary-400-rgb), 0.2));
    }

    // ========================================
    // SUBTITLE
    // ========================================
    &__subtitle {
      font-size: 17px;
      max-width: 550px;
      margin: 4px auto 0;
      line-height: 1.6;

      @media (max-width: 768px) {
        font-size: 15px;
      }
    }

    // ========================================
    // STATS
    // ========================================
    &__stats {
      display: inline-flex;
      align-items: center;
      gap: 24px;
      margin-top: 20px;
      padding: 16px 32px;
      background: rgba(var(--secondary-800-rgb), 0.5);
      border: 1px solid rgba(var(--neutral-700-rgb), 0.3);
      border-radius: 16px;
      backdrop-filter: blur(10px);

      :deep(.stat) {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        &__value {
          font-size: 24px;
          font-weight: 700;
          color: @neutral-100;
          background: linear-gradient(135deg, var(--primary-400), var(--primary-500));
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        &__label {
          font-size: 12px;
          color: @neutral-500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }

      :deep(.stat-divider) {
        width: 1px;
        height: 32px;
        background: linear-gradient(
          180deg,
          transparent,
          rgba(var(--neutral-600-rgb), 0.5),
          transparent
        );
      }
    }

    // Stats light theme
    &--light .page-header__stats {
      background: white;
      border: 1px solid @neutral-100;
      box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.04),
        0 8px 24px rgba(0, 0, 0, 0.04);

      :deep(.stat__value) {
        color: var(--primary-600);
      }

      :deep(.stat__label) {
        color: @neutral-500;
      }

      :deep(.stat-divider) {
        background: @neutral-200;
      }
    }

    // ========================================
    // BACK BUTTON
    // ========================================
    &__back {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(8px);
      z-index: 3;

      &:hover {
        transform: translateX(-2px);

        svg {
          transform: translateX(-3px);
        }
      }

      svg {
        transition: transform 0.2s ease;
      }
    }

    // ========================================
    // ACTIONS
    // ========================================
    &__actions {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      gap: 12px;
      z-index: 3;
    }

    // ========================================
    // EXTRA (slot default)
    // ========================================
    &__extra {
      margin-top: 24px;
    }

    // ========================================
    // RESPONSIVE
    // ========================================
    @media (max-width: 768px) {
      &--premium {
        padding: 60px 16px 32px;
      }

      &--card {
        padding: 24px 20px;
      }

      &__back {
        position: relative;
        margin-bottom: 16px;
        align-self: flex-start;

        span {
          display: none;
        }
      }

      &__actions {
        position: relative;
        justify-content: center;
        margin-bottom: 16px;
      }

      &__stats {
        flex-wrap: wrap;
        gap: 16px;
        padding: 12px 16px;
      }
    }
  }
</style>
