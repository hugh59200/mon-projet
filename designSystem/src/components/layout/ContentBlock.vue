<template>
  <component
    :is="as"
    class="content-block"
    :class="[
      `content-block--${variant}`,
      `content-block--${resolvedTheme}`,
      `content-block--bg-${bg}`,
      !padding && `content-block--${size}`,
      {
        'content-block--no-border': noBorder,
        'content-block--interactive': interactive,
        'content-block--centered': centered,
        'content-block--has-bg-image': bgImage,
      },
    ]"
    :style="containerStyle"
  >
    <!-- Background image -->
    <div
      v-if="bgImage"
      class="content-block__bg-image"
    >
      <img
        :src="bgImage"
        alt=""
        aria-hidden="true"
      />
    </div>
    <!-- Content -->
    <div
      v-if="bgImage"
      class="content-block__content"
    >
      <slot />
    </div>
    <slot v-else />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

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
 * - auto: Utilise le thème global (défaut)
 * - light: Force le fond clair
 * - dark: Force le fond foncé
 *
 * Background (bg):
 * - default: Fond standard selon variante (défaut)
 * - elevated: Fond légèrement surélevé (plus clair en light, plus foncé en dark)
 * - muted: Fond atténué/subtil
 * - transparent: Fond transparent
 * - surface: Fond surface (neutre, pour imbrication)
 *
 * Tailles (padding prédéfini, ignoré si padding est défini):
 * - sm: Padding réduit (12px)
 * - md: Padding moyen (20px) - défaut
 * - lg: Padding large (28px)
 *
 * Layout:
 * - maxWidth: Largeur maximale (ex: '1200px')
 * - minHeight: Hauteur minimale (ex: '400px')
 * - padding: Padding personnalisé (ex: '20px', '16px 24px')
 * - margin: Margin personnalisé (ex: '20px auto', '0 0 24px')
 * - gap: Gap pour le contenu flex/grid (ex: '16px')
 * - borderRadius: Border radius personnalisé (ex: '24px')
 * - centered: Centre le bloc horizontalement (défaut: true)
 * - bgImage: Image de fond (URL ou import)
 * - bgOpacity: Opacité de l'image de fond (défaut: 0.4)
 */
const props = withDefaults(
  defineProps<{
    variant?: 'card' | 'flat' | 'info' | 'success' | 'warning' | 'danger'
    theme?: 'light' | 'dark' | 'auto'
    /** Niveau de fond - contrôle l'intensité/type du background */
    bg?: 'default' | 'elevated' | 'muted' | 'transparent' | 'surface'
    size?: 'sm' | 'md' | 'lg'
    as?: string
    noBorder?: boolean
    interactive?: boolean
    /** Largeur du bloc (ex: '100%', '500px') */
    width?: string
    /** Largeur maximale du bloc (ex: '1200px', '800px') */
    maxWidth?: string
    /** Hauteur minimale du bloc (ex: '400px') */
    minHeight?: string
    /** Padding personnalisé (ex: '20px', '16px 24px', '0') - remplace size */
    padding?: string
    /** Margin personnalisé (ex: '20px auto', '0 0 24px') */
    margin?: string
    /** Gap pour le contenu (ex: '16px') */
    gap?: string
    /** Border radius personnalisé (ex: '24px', '0') */
    borderRadius?: string
    /** Centre le bloc horizontalement (défaut: true) */
    centered?: boolean
    /** Image de fond (URL ou import) */
    bgImage?: string
    /** Opacité de l'image de fond (défaut: 0.4) */
    bgOpacity?: number
    /** Variable CSS pour l'opacité (ex: 'var(--bg-image-opacity-podium)') - prioritaire sur bgOpacity */
    bgOpacityVar?: string
  }>(),
  {
    variant: 'card',
    theme: 'auto',
    bg: 'default',
    size: 'md',
    as: 'div',
    noBorder: false,
    interactive: false,
    width: undefined,
    maxWidth: undefined,
    minHeight: undefined,
    padding: undefined,
    margin: undefined,
    gap: undefined,
    borderRadius: undefined,
    centered: true,
    bgImage: undefined,
    bgOpacity: 0.4,
    bgOpacityVar: undefined,
  },
)

const { theme: globalTheme } = useTheme()

// Si theme="auto", utilise le thème global, sinon utilise la valeur forcée
const resolvedTheme = computed(() => {
  if (props.theme === 'auto') {
    return globalTheme.value
  }
  return props.theme
})

// Opacité de l'image de fond (variable CSS ou valeur numérique)
const bgImageOpacity = computed(() => {
  if (props.bgOpacityVar) {
    return props.bgOpacityVar
  }
  return props.bgOpacity
})

// Style inline pour les props de layout
const containerStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.width) {
    style.width = props.width
  }

  if (props.maxWidth) {
    style.maxWidth = props.maxWidth
  }

  if (props.minHeight) {
    style.minHeight = props.minHeight
  }

  if (props.padding !== undefined) {
    style.padding = props.padding
  }

  if (props.margin) {
    style.margin = props.margin
  }

  if (props.gap) {
    style.gap = props.gap
  }

  if (props.borderRadius) {
    style.borderRadius = props.borderRadius
  }

  return Object.keys(style).length > 0 ? style : undefined
})
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

  // ============ BACKGROUND IMAGE ============
  &--has-bg-image {
    position: relative;
    overflow: hidden;
  }

  &__bg-image {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: v-bind('bgImageOpacity');
    }

    // Overlay pour assurer la lisibilité
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 100%);
    }
  }

  &__content {
    position: relative;
    z-index: 1;
  }

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

  &--no-border {
    border: none !important;
  }


  // ============ LIGHT THEME ============
  &--light {
    // CSS Variables aliasées vers les variables globales (semantic-theme.less)
    // Ces alias sont conservés pour rétrocompatibilité pendant la migration
    --content-block-text: var(--text-primary);
    --content-block-text-secondary: var(--text-secondary);
    --content-block-text-muted: var(--text-muted);
    --content-block-border: var(--border-default);
    --content-block-bg-subtle: var(--bg-subtle);

    // Card - Standard avec gradient subtil
    &.content-block--card {
      background:
        linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.02) 0%, transparent 50%),
        linear-gradient(315deg, rgba(var(--primary-400-rgb), 0.015) 0%, transparent 40%),
        @white;
      border: 1px solid rgba(var(--primary-500-rgb), 0.08);
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.03),
        0 4px 20px rgba(var(--primary-500-rgb), 0.04);

      // Background levels
      &.content-block--bg-elevated {
        background:
          linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.03) 0%, transparent 60%),
          linear-gradient(315deg, rgba(var(--primary-400-rgb), 0.02) 0%, transparent 50%),
          @white;
        border-color: rgba(var(--primary-500-rgb), 0.12);
        box-shadow:
          0 2px 8px rgba(0, 0, 0, 0.04),
          0 12px 32px rgba(var(--primary-500-rgb), 0.08);
      }
      &.content-block--bg-muted {
        background:
          linear-gradient(180deg, @neutral-50 0%, @neutral-100 100%);
        border-color: @neutral-200;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
      }
      &.content-block--bg-surface {
        background: @neutral-50;
        border-color: @neutral-200;
      }
      &.content-block--bg-transparent {
        background: transparent;
        box-shadow: none;
      }
    }

    // Flat - Sans ombre avec touche de couleur
    &.content-block--flat {
      background:
        linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.015) 0%, transparent 40%),
        @neutral-50;
      border: 1px solid @neutral-200;

      &.content-block--bg-elevated {
        background:
          linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.02) 0%, transparent 50%),
          @white;
      }
      &.content-block--bg-muted {
        background: @neutral-100;
      }
      &.content-block--bg-surface {
        background: @neutral-50;
      }
      &.content-block--bg-transparent {
        background: transparent;
      }
    }

    // Info - Neutre/Primaire
    &.content-block--info {
      background:
        linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.06) 0%, rgba(var(--primary-500-rgb), 0.02) 100%);
      border: 1px solid rgba(var(--primary-500-rgb), 0.15);
    }

    // Success
    &.content-block--success {
      background:
        linear-gradient(135deg, rgba(@success-500, 0.08) 0%, rgba(@success-400, 0.03) 100%);
      border: 1px solid rgba(@success-500, 0.2);
    }

    // Warning
    &.content-block--warning {
      background:
        linear-gradient(135deg, rgba(@warning-500, 0.1) 0%, rgba(@warning-400, 0.04) 100%);
      border: 1px solid rgba(@warning-500, 0.25);
    }

    // Danger
    &.content-block--danger {
      background:
        linear-gradient(135deg, rgba(@danger-500, 0.08) 0%, rgba(@danger-400, 0.03) 100%);
      border: 1px solid rgba(@danger-500, 0.2);
    }
  }

  // ============ DARK THEME ============
  &--dark {
    // CSS Variables aliasées vers les variables globales (semantic-theme.less)
    // En dark, on force les valeurs dark même si le thème global est light
    --content-block-text: @neutral-100;
    --content-block-text-secondary: @neutral-300;
    --content-block-text-muted: @neutral-400;
    --content-block-border: rgba(255, 255, 255, 0.1);
    --content-block-bg-subtle: rgba(255, 255, 255, 0.03);

    // Card - Standard dark avec glow subtil
    &.content-block--card {
      background:
        linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.06) 0%, transparent 40%),
        linear-gradient(315deg, rgba(var(--primary-400-rgb), 0.03) 0%, transparent 30%),
        var(--secondary-600);
      border: 1px solid rgba(var(--primary-500-rgb), 0.15);
      box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(255, 255, 255, 0.03) inset;

      // Background levels
      &.content-block--bg-elevated {
        background:
          linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.1) 0%, transparent 50%),
          linear-gradient(315deg, rgba(var(--primary-400-rgb), 0.05) 0%, transparent 40%),
          var(--secondary-500);
        border-color: rgba(var(--primary-500-rgb), 0.2);
        box-shadow:
          0 8px 40px rgba(0, 0, 0, 0.35),
          0 0 60px rgba(var(--primary-500-rgb), 0.08),
          0 0 0 1px rgba(255, 255, 255, 0.05) inset;
      }
      &.content-block--bg-muted {
        background:
          linear-gradient(180deg, var(--secondary-700) 0%, var(--secondary-800) 100%);
        border-color: rgba(255, 255, 255, 0.06);
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
      }
      &.content-block--bg-surface {
        background: var(--secondary-800);
        border-color: rgba(255, 255, 255, 0.05);
      }
      &.content-block--bg-transparent {
        background: transparent;
        box-shadow: none;
      }
    }

    // Flat - Sans ombre dark
    &.content-block--flat {
      background:
        linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.03) 0%, transparent 30%),
        var(--secondary-700);
      border: 1px solid rgba(255, 255, 255, 0.08);

      &.content-block--bg-elevated {
        background:
          linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.05) 0%, transparent 40%),
          var(--secondary-600);
      }
      &.content-block--bg-muted {
        background: var(--secondary-800);
      }
      &.content-block--bg-surface {
        background: var(--secondary-700);
      }
      &.content-block--bg-transparent {
        background: transparent;
      }
    }

    // Info - Dark
    &.content-block--info {
      background:
        linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.18) 0%, rgba(var(--primary-500-rgb), 0.06) 100%);
      border: 1px solid rgba(var(--primary-500-rgb), 0.35);
      box-shadow: 0 0 30px rgba(var(--primary-500-rgb), 0.1);
    }

    // Success - Dark
    &.content-block--success {
      background:
        linear-gradient(135deg, rgba(@success-500, 0.18) 0%, rgba(@success-500, 0.06) 100%);
      border: 1px solid rgba(@success-500, 0.35);
      box-shadow: 0 0 30px rgba(@success-500, 0.08);
    }

    // Warning - Dark
    &.content-block--warning {
      background:
        linear-gradient(135deg, rgba(@warning-500, 0.18) 0%, rgba(@warning-500, 0.06) 100%);
      border: 1px solid rgba(@warning-500, 0.35);
      box-shadow: 0 0 30px rgba(@warning-500, 0.08);
    }

    // Danger - Dark
    &.content-block--danger {
      background:
        linear-gradient(135deg, rgba(@danger-500, 0.18) 0%, rgba(@danger-500, 0.06) 100%);
      border: 1px solid rgba(@danger-500, 0.35);
      box-shadow: 0 0 30px rgba(@danger-500, 0.08);
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
