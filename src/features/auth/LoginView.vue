<template>
  <AuthLayout>
    <AuthForm mode="login" />
  </AuthLayout>
</template>

<script setup lang="ts">
  import AuthForm from './AuthForm.vue'
  import AuthLayout from './layouts/AuthLayout.vue'
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
