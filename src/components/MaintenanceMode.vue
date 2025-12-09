<template>
  <div class="maintenance">
    <div class="maintenance__container">
      <div class="maintenance__icon">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </div>
      <h1 class="maintenance__title">Maintenance Technique</h1>
      <p class="maintenance__text">
        Notre site est actuellement en maintenance pour améliorer votre expérience.
        <br />Nous serons de retour très bientôt.
      </p>
      <div class="maintenance__contact">
        <span>Contact :</span>
        <a href="mailto:contact@fast-peptides.com">contact@fast-peptides.com</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  .maintenance {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0a0f1a 0%, #1a1f2e 100%);
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      sans-serif;

    &__container {
      text-align: center;
      padding: 48px;
      max-width: 480px;
    }

    &__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 50%;
      color: #818cf8;
      margin-bottom: 32px;
    }

    &__title {
      font-size: 28px;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0 0 16px;
    }

    &__text {
      font-size: 16px;
      color: #94a3b8;
      line-height: 1.6;
      margin: 0 0 32px;
    }

    &__contact {
      font-size: 14px;
      color: #64748b;

      a {
        color: #818cf8;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
