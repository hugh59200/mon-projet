<template>
  <div class="disclaimer">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p>
      <strong>Usage recherche uniquement (RUO)</strong>
      — Les produits proposés sont destinés exclusivement à la recherche scientifique in vitro.
    </p>
  </div>
</template>

<style scoped lang="less">
  @font-body:
    'Inter',
    'SF Pro Text',
    -apple-system,
    sans-serif;
  @light-text-secondary: #4a5568;

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

  @media (max-width: 768px) {
    .disclaimer {
      margin: 0 20px 40px;
      flex-direction: column;
      text-align: center;
    }
  }
</style>
