<template>
  <DialogComponent />
  <ToastContainer />
  <CGU />
</template>

<script setup lang="ts">
  import { registerPopupAutoCGU } from '@/features/interface/cgu'
  import CGU from '@/features/interface/cgu/CGU.vue'
  import DialogComponent from '@/features/interface/dialog/components/DialogComponent.vue'

  registerPopupAutoCGU()
</script>
