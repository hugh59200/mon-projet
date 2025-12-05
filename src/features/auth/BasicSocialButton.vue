<template>
  <button
    class="social-btn"
    :class="`social-btn--${provider}`"
    @click="$emit('click')"
  >
    <BasicIconNext
      :name="provider"
      :size="24"
    />
  </button>
</template>

<script setup lang="ts">
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'

  defineProps<{
    provider: 'google' | 'github' | 'facebook'
  }>()

  defineEmits(['click'])
</script>

<style scoped lang="less">
  .social-btn {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @white;
    border: 1px solid @neutral-200;
    cursor: pointer;
    transition:
      background 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      border-color: @neutral-300;
      background: @neutral-50;
    }

    /* GitHub : fond noir + logo blanc */
    &--github {
      background: @neutral-900;
      border: none;

      :deep(svg) {
        filter: invert(1);
      }

      &:hover {
        background: @neutral-800;
      }
    }

    /* Facebook */
    &--facebook {
      border-color: @info-200;

      &:hover {
        border-color: @info-400;
        background: @info-50;
      }
    }

    /* Google */
    &--google {
      &:hover {
        border-color: @neutral-300;
      }
    }
  }
</style>
