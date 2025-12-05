<template>
  <div
    class="header-logo"
    role="button"
    tabindex="0"
    @click="$router.push('/')"
    @keypress.enter="$router.push('/')"
  >
    <div class="header-logo__icon">
      <BasicIconNext
        name="fastPeptides"
        :size="28"
      />
    </div>
    <div class="header-logo__text">
      <span class="header-logo__fast">Fast</span>
      <span class="header-logo__peptides">Peptides</span>
    </div>
  </div>
</template>

<style scoped lang="less">
  @font-display:
    'Instrument Sans',
    'SF Pro Display',
    -apple-system,
    sans-serif;
  @bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  @ease: cubic-bezier(0.4, 0, 0.2, 1);

  .header-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;
    outline: none;
    text-decoration: none;

    &:focus-visible {
      outline: 2px solid var(--primary-500);
      outline-offset: 4px;
      border-radius: 8px;
    }

    &:hover {
      .header-logo__icon {
        transform: scale(1.02) rotate(3deg);
        box-shadow:
          0 0 20px rgba(var(--primary-500-rgb), 0.4),
          0 0 40px rgba(var(--primary-500-rgb), 0.2);
      }

      .header-logo__fast {
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      }

      .header-logo__peptides {
        text-shadow: 0 0 20px rgba(var(--primary-400-rgb), 0.5);
      }
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.15) 0%,
        rgba(var(--primary-600-rgb), 0.1) 100%
      );
      border: 1px solid rgba(var(--primary-500-rgb), 0.2);
      border-radius: 12px;
      color: var(--primary-400);
      transition: all 0.3s @bounce;
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    &__text {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    &__fast {
      font-family: @font-display;
      font-size: 22px;
      font-weight: 800;
      font-style: italic;
      color: @neutral-50;
      letter-spacing: -0.5px;
      transition: text-shadow 0.3s @ease;
    }

    &__peptides {
      font-family: @font-display;
      font-size: 22px;
      font-weight: 600;
      color: var(--primary-400);
      letter-spacing: 0.5px;
      transition: text-shadow 0.3s @ease;
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
      &__text {
        display: none;
      }

      &__icon {
        width: 40px;
        height: 40px;
        min-width: 40px;
      }
    }
  });
</style>
