<template>
  <div class="payment-result-wrapper">
    <RouterView />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  .payment-result-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9fafb;
    padding: 40px 0;
  }
</style>
