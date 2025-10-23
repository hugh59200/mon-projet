<template>
  <div
    :class="['basic-card', { 'basic-card--clickable': isSelectionnable }]"
    @click="isSelectionnable ? handleClick() : undefined"
  >
    <BasicAvatar
      v-if="avatar"
      v-bind="avatar"
    />
    <section class="flex-1">
      <div class="flex flex-gap-2">
        <BasicText
          v-if="title"
          weight="bold"
          class="flex-1"
          wrap
          nb-max-lines="2"
        >
          {{ title }}
        </BasicText>
        <BasicIcon
          v-if="showFavoris"
          name="star"
          :active="isFavoris"
          @click="toggleFavoris"
          color="secondary-1000"
          pointer
        />
      </div>
      <div>
        <div
          v-for="subtitle in subtitles"
          :key="subtitle.text"
          class="subtitle"
        >
          <div
            v-if="subtitle.icon"
            class="subtitle__icon"
          >
            <BasicIcon
              :name="subtitle.icon"
              color="primary-600"
            />
          </div>
          <BasicText
            size="body-m"
            wrapAll
            :color="subtitle.icon ? 'neutral-500' : 'primary-800'"
          >
            {{ subtitle.text }}
          </BasicText>
        </div>
      </div>
      <BasicBadge
        v-if="badge"
        :label="badge.label"
        :type="badge.type"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
  import type { CardProps } from '@designSystem/components'
  import { computed } from 'vue'

  const emits = defineEmits(['card-click', 'toggle-favoris'])

  const props = withDefaults(defineProps<CardProps>(), {
    deletable: false,
    selectionnable: false,
    showFavoris: false,
    isFavoris: false,
  })

  const toggleFavoris = () => {
    emits('toggle-favoris')
  }

  const handleClick = () => {
    emits('card-click')
  }

  const isSelectionnable = computed(() => !!props.selectionnable || !!props.onCardClick)
</script>

<style lang="less">
  @import './BasicCard.less';
</style>
