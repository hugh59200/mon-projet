<template>
  <section class="auth-page">
    <AuthForm mode="reset" />
  </section>
</template>

<script setup lang="ts">
  import AuthForm from './AuthForm.vue'
</script>

<style scoped lang="less">
  .auth-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 120px);
    background-color: @neutral-50;
  }
</style>
