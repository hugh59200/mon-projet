<template>
  <div class="payment-result cancel">
    <h1>❌ Paiement annulé</h1>
    <p>Le paiement n’a pas été finalisé. Vous pouvez réessayer à tout moment.</p>

    <RouterLink
      to="/panier"
      class="btn"
    >
      Retourner au panier
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
  import { RouterLink } from 'vue-router'
</script>

<style scoped>
  .payment-result {
    max-width: 600px;
    margin: 100px auto;
    text-align: center;
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  h1 {
    color: #dc2626;
    margin-bottom: 16px;
  }
  .btn {
    display: inline-block;
    margin-top: 20px;
    background-color: #dc2626;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
  }
  .btn:hover {
    background-color: #b91c1c;
  }
</style>
