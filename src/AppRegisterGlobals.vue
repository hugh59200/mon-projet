<template>
  <DialogComponent />
  <SablierComponent />
  <CGU />
  <vue3-snackbar
    :duration="5000"
    baseBackgroundColor="#fff"
    backgroundOpacity="0.05"
    messageClass="app-snackbar"
    border="bottom"
    bottom
  />
</template>

<script setup lang="ts">
  import CGU from '@/features/interface/cgu/CGU.vue'
  import DialogComponent from '@/features/interface/dialog/components/DialogComponent.vue'
  import SablierComponent from '@/features/interface/sablier/SablierComponent.vue'
  import { Vue3Snackbar } from 'vue3-snackbar'
  import { registerPopupAutoCGU } from './features/interface/cgu'
  import { registerAppSnackBarEventsManager } from './features/interface/shared/snack-bar'

  registerPopupAutoCGU()
  registerAppSnackBarEventsManager()
</script>

<style lang="less">
  .vue3-snackbar-message.app-snackbar {
    font-family: Mont, sans-serif;
    border-bottom: none;
    .vue3-snackbar-message-content {
      width: 300px;
    }
  }
</style>
