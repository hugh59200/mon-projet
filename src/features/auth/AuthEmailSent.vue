<template>
  <div
    v-motion="{
      initial: { opacity: 0, y: 10 },
      enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
    }"
    class="auth-email"
  >
    <div class="auth-email__icon-wrapper">
      <BasicIconNext
        name="Mail"
        color="primary-600"
        :size="74"
      />
    </div>

    <BasicText
      size="h2"
      weight="bold"
      color="neutral-900"
    >
      Vérifiez votre e-mail
    </BasicText>

    <BasicText
      size="body-m"
      color="neutral-600"
      class="auth-email__subtitle"
    >
      Un lien de confirmation vient d’être envoyé à votre adresse.
      <br />
      Cliquez dessus pour activer votre compte Fast Peptides.
    </BasicText>
  </div>
</template>

<script setup lang="ts">
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
</script>

<style scoped lang="less">
  .auth-email {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 16px;
    padding: 20px;

    &__icon-wrapper {
      animation:
        popin 0.4s ease-out forwards,
        bounce-end 2.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    &__subtitle {
      line-height: 1.5;
      max-width: 300px;
      margin-top: 4px;
    }
  }

  /* Animations */
  @keyframes popin {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }
    60% {
      transform: scale(1.12);
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes bounce-end {
    0%,
    90% {
      transform: scale(1);
    }
    95% {
      transform: scale(1.15);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
