<template>
  <div class="loader"></div>
</template>

<script setup lang="ts"></script>

<style lang="less">
  .loader {
    width: 24px;
    height: 24px;
    border: 2px solid #ccc;
    border-top: 2px solid #999;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    font-size: 24px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
