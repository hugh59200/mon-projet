<template>
  <header>
    <div class="left-content">
      <template v-if="headerText">
        <BasicText
          size="h3"
          weight="bold"
          color="white"
          wrapAll
        >
          {{ headerText?.titre }}
        </BasicText>
        <BasicText
          v-if="headerText?.sousTitre"
          size="body-xl"
          color="white"
          wrapAll
          style="margin-top: -6px"
        >
          {{ headerText?.sousTitre }}
        </BasicText>
      </template>
    </div>

    <div class="right-content">
      <div
        class="right-content__user-info"
        ref="menu"
      >
        <BasicText
          class="right-content__user-info--desktop userName"
          size="h5"
          weight="bold"
          color="white"
          @click="showMenu = !showMenu"
          focusable
          pointer
          nbMaxLines="2"
        >
          {{ fullName }}
        </BasicText>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { useHandleClickOutside } from '@/features/interface/composables/useHandleClickOutside'
  import { computed, ref } from 'vue'

  const menu = ref()

  const showMenu = ref(false)

  const headerText = computed<{ titre: string; sousTitre?: string } | undefined>(() => {
    return { titre: 'mon titre' }
  })

  const fullName = computed(() => {
    return 'mon nom'
  })

  const closeMenu = () => {
    showMenu.value = false
  }

  useHandleClickOutside(menu, () => {
    closeMenu()
  })
</script>

<style scoped lang="less">
  @import './HeaderApp.less';
</style>
