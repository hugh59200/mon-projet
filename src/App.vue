<template>
  <HeaderApp />
  <main>
    <RouterView />
  </main>
  <FooterApp />
</template>

<script setup lang="ts">
  import FooterApp from '@/features/interface/layout/footer/FooterApp.vue'
  import HeaderApp from '@/features/interface/layout/header/HeaderApp.vue'
  import { supabase } from '@/services/supabaseClient'

  supabase.from('test').select('*').then(console.log)
</script>

<style scoped lang="less">
  @import '/src/assets/Mont/Mont.less';

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
</style>
