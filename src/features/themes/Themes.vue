<template>
  <select v-model="palette">
    <option value="lab">Lab</option>
    <option value="premium">Premium</option>
    <option value="neo">Neo</option>
  </select>

  <button @click="scheme = scheme === 'light' ? 'dark' : 'light'">Toggle light/dark</button>
</template>
<script setup lang="ts">
  import { useTheme } from '@/features/themes/composables/useTheme'

  const { palette, scheme } = useTheme()
</script>
