<template>
  <RouterLink
    to="/"
    class="header-logo"
  >
    <BasicIconNext
      name="fastPeptides"
      :size="32"
      color="primary-400"
    />
    <!-- Version complète (desktop/tablet) -->
    <div class="header-logo__text header-logo__text--full">
      <span class="header-logo__fast">Fast</span>
      <span class="header-logo__peptides">Peptides</span>
    </div>
    <!-- Version initiales (mobile) -->
    <div class="header-logo__text header-logo__text--short">
      <span class="header-logo__fast">F</span>
      <span class="header-logo__peptides">P</span>
    </div>
  </RouterLink>
</template>

<style scoped lang="less">
  @font-display:
    'Instrument Sans',
    'SF Pro Display',
    -apple-system,
    sans-serif;
  @ease: cubic-bezier(0.4, 0, 0.2, 1);

  .header-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    outline: none;
    transition: opacity 0.2s @ease;

    &:hover {
      opacity: 0.85;
    }

    &:active {
      opacity: 0.7;
    }

    &:focus-visible {
      outline: 2px solid var(--primary-500);
      outline-offset: 4px;
      border-radius: 4px;
    }

    &__text {
      display: flex;
      align-items: baseline;
      gap: 4px;

      &--short {
        display: none;
      }
    }

    &__fast {
      font-family: @font-display;
      font-size: 20px;
      font-weight: 800;
      font-style: italic;
      color: @neutral-50;
      letter-spacing: -0.5px;
    }

    &__peptides {
      font-family: @font-display;
      font-size: 20px;
      font-weight: 600;
      color: var(--primary-400);
      letter-spacing: 0.5px;
    }
  }

  // Responsive - Tablet
  .respond-tablet({
    .header-logo {
      &__fast,
      &__peptides {
        font-size: 18px;
      }
    }
  });

  // Responsive - Mobile
  .respond-mobile({
    .header-logo {
      gap: 8px;

      &__text--full {
        display: none;
      }

      &__text--short {
        display: flex;
        gap: 2px;
      }

      &__fast,
      &__peptides {
        font-size: 22px;
      }
    }
  });
</style>
