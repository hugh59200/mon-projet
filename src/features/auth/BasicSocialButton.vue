<template>
  <BasicButton
    :icon-name="provider"
    variant="ghost"
    class="provider-social"
    :class="`provider-${provider}`"
    @click="$emit('click')"
  />
</template>

<script setup lang="ts">
  defineProps<{
    provider: 'google' | 'github' | 'facebook'
  }>()

  defineEmits(['click'])
</script>

<style scoped lang="less">
  /* ✅ Style par défaut */
  .provider-social {
    padding: 0;

    &:deep(.icon-container) {
      width: 36px;
      height: 36px;
      padding: 8px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border: 1px solid #e6e6e6;
      transition:
        transform 0.15s ease,
        box-shadow 0.2s ease;
    }

    &:hover :deep(.icon-container) {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
    }
  }

  /* ✅ GitHub : fond noir + logo blanc */
  .provider-github {
    &:deep(.icon-container) {
      background: #302f2f;
      border: none;

      svg {
        filter: invert(1);
      }
    }
  }

  /* ✅ Facebook : fond blanc, icône couleur, pas de fond flashy */
  .provider-facebook {
    &:deep(.icon-container) {
      background: #fff;
      border: 1px solid #c8caff;
    }
  }

  /* ✅ Google idem : fond blanc propre */
  .provider-google {
    &:deep(.icon-container) {
      background: #fff;
      border: 1px solid #e6e6e6;
    }
  }
</style>
