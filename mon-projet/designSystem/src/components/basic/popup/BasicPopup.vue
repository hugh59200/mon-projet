<template>
  <div :class="['popup', `popup--${type}`]">
    <div class="titleWrapper">
      <BasicIcon
        class="mainIcon"
        active
        :name="IconMap[type]"
      />
      <BasicText
        v-if="titleText"
        class="titleText"
      >
        {{ TitleMap[type] }}
      </BasicText>
      <div class="closeIconMask">
        <BasicIcon
          v-if="hasCloseAction"
          class="closeIcon"
          name="close"
          @click="$emit('click')"
          pointer
        />
      </div>
    </div>
    <div class="contentWrapper">
      <BasicText
        v-if="firstParagraph"
        class="firstParagraph"
        size="body-m"
      >
        {{ firstParagraph }}
      </BasicText>
      <hr v-if="secondParagraph" />
      <BasicText
        v-if="secondParagraph"
        class="secondParagraph"
        size="body-m"
      >
        {{ secondParagraph }}
      </BasicText>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IconMap, TitleMap } from '@designSystem/components'
  import { type PopupProps } from '@designSystem/components'

  withDefaults(defineProps<PopupProps>(), {
    hasCloseAction: true,
    type: 'primary',
    titleText: 'A simple alert—check it out!',
    hasButtonAction: true,
  })
</script>

<style lang="less">
  @import './BasicPopup.less';
</style>
