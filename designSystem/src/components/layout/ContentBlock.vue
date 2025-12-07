<template>
  <component
    :is="as"
    class="content-block"
    :class="[
      `content-block--${variant}`,
      `content-block--${theme}`,
      `content-block--${size}`,
      {
        'content-block--no-padding': noPadding,
        'content-block--no-border': noBorder,
        'content-block--interactive': interactive,
      },
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * ContentBlock - Composant de conteneur unifié
 *
 * Variantes:
 * - card: Bloc standard blanc/dark avec ombre légère
 * - flat: Bloc sans ombre (pour imbrication)
 * - info: Bloc informatif neutre
 * - success: Bloc de succès/confirmation
 * - warning: Bloc d'avertissement
 * - danger: Bloc d'alerte/erreur
 *
 * Thèmes:
 * - light: Fond clair (défaut)
 * - dark: Fond foncé pour mise en avant (décisions)
 *
 * Tailles:
 * - sm: Padding réduit (12px)
 * - md: Padding moyen (20px) - défaut
 * - lg: Padding large (28px)
 */
withDefaults(
  defineProps<{
    variant?: 'card' | 'flat' | 'info' | 'success' | 'warning' | 'danger'
    theme?: 'light' | 'dark'
    size?: 'sm' | 'md' | 'lg'
    as?: string
    noPadding?: boolean
    noBorder?: boolean
    interactive?: boolean
  }>(),
  {
    variant: 'card',
    theme: 'light',
    size: 'md',
    as: 'div',
    noPadding: false,
    noBorder: false,
    interactive: false,
  },
)
</script>

<style scoped lang="less">
@import '@designSystem/fondation/breakpoints/responsive-mixins.less';

// Variables locales
@ease: cubic-bezier(0.4, 0, 0.2, 1);

// ============================================================
// BASE
// ============================================================
.content-block {
  border-radius: 16px;
  transition: all 0.2s @ease;

  // ============ SIZES ============
  &--sm {
    padding: 12px 14px;
    border-radius: 12px;
  }

  &--md {
    padding: 20px 24px;
    border-radius: 16px;
  }

  &--lg {
    padding: 28px 32px;
    border-radius: 24px;
  }

  &--no-padding {
    padding: 0;
  }

  &--no-border {
    border: none !important;
  }

  // ============ LIGHT THEME ============
  &--light {
    // Card - Standard
    &.content-block--card {
      background: @white;
      border: 1px solid @neutral-100;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 4px 16px rgba(0, 0, 0, 0.04);
    }

    // Flat - Sans ombre
    &.content-block--flat {
      background: @neutral-50;
      border: 1px solid @neutral-200;
    }

    // Info - Neutre/Primaire
    &.content-block--info {
      background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.04) 0%, rgba(var(--primary-500-rgb), 0.08) 100%);
      border: 1px solid rgba(var(--primary-500-rgb), 0.15);
    }

    // Success
    &.content-block--success {
      background: linear-gradient(135deg, @success-50 0%, color-mix(in srgb, @success-100 50%, white) 100%);
      border: 1px solid @success-200;
    }

    // Warning
    &.content-block--warning {
      background: @warning-100;
      border: 1px solid @warning-300;
    }

    // Danger
    &.content-block--danger {
      background: linear-gradient(135deg, @danger-50 0%, color-mix(in srgb, @danger-100 60%, white) 100%);
      border: 2px solid @danger-200;
    }
  }

  // ============ DARK THEME ============
  &--dark {
    // Card - Standard dark
    &.content-block--card {
      background: var(--secondary-600);
      border: 1.5px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    // Flat - Sans ombre dark
    &.content-block--flat {
      background: var(--secondary-700);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    // Info - Dark
    &.content-block--info {
      background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.15) 0%, rgba(var(--primary-500-rgb), 0.08) 100%);
      border: 1px solid rgba(var(--primary-500-rgb), 0.3);
    }

    // Success - Dark
    &.content-block--success {
      background: linear-gradient(135deg, rgba(var(--success-500-rgb), 0.15) 0%, rgba(var(--success-500-rgb), 0.08) 100%);
      border: 1px solid rgba(var(--success-500-rgb), 0.3);
    }

    // Warning - Dark
    &.content-block--warning {
      background: linear-gradient(135deg, rgba(var(--warning-500-rgb), 0.15) 0%, rgba(var(--warning-500-rgb), 0.08) 100%);
      border: 1px solid rgba(var(--warning-500-rgb), 0.3);
    }

    // Danger - Dark
    &.content-block--danger {
      background: linear-gradient(135deg, rgba(var(--danger-500-rgb), 0.15) 0%, rgba(var(--danger-500-rgb), 0.08) 100%);
      border: 1px solid rgba(var(--danger-500-rgb), 0.3);
    }
  }

  // ============ INTERACTIVE ============
  &--interactive {
    cursor: pointer;

    &.content-block--light {
      &:hover {
        border-color: var(--primary-300);
        background: rgba(var(--primary-500-rgb), 0.02);
      }
    }

    &.content-block--dark {
      &:hover {
        background: var(--secondary-500);
        border-color: rgba(255, 255, 255, 0.15);
      }
    }
  }
}

// ============================================================
// RESPONSIVE
// ============================================================
.respond-tablet({
  .content-block {
    &--sm {
      padding: 10px 12px;
      border-radius: 10px;
    }

    &--md {
      padding: 16px 20px;
      border-radius: 14px;
    }

    &--lg {
      padding: 24px 28px;
      border-radius: 20px;
    }
  }
});

.respond-mobile({
  .content-block {
    &--sm {
      padding: 8px 10px;
      border-radius: 8px;
    }

    &--md {
      padding: 14px 16px;
      border-radius: 12px;
    }

    &--lg {
      padding: 18px 20px;
      border-radius: 16px;
    }
  }
});
</style>
