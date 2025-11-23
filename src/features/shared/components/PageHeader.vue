<template>
  <header
    class="page-header"
    v-responsive-animate.slide.once
  >
    <div
      class="page-header__wrapper"
      v-motion="{
        initial: { opacity: 0, y: -20 },
        enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
      }"
    >
      <div class="page-header__title-row">
        <BasicText
          size="h1"
          weight="bold"
          class="page-header__title"
        >
          {{ splitTitle.start }}
          <span v-if="splitTitle.end">{{ splitTitle.end }}</span>
        </BasicText>

        <slot name="icon"></slot>
      </div>

      <div
        v-if="displayDescription"
        class="page-header__subtitle"
      >
        {{ displayDescription }}
      </div>
    </div>

    <div
      v-if="showSeparator"
      class="page-header__separator"
    ></div>

    <div
      v-if="$slots.default"
      class="page-header__content"
    >
      <slot></slot>
    </div>
  </header>
</template>

<script setup lang="ts">
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const props = defineProps<{
    title?: string
    description?: string
    showSeparator?: boolean
    forceGradient?: boolean
  }>()

  const route = useRoute()

  const rawTitle = computed(() => {
    if (props.title) return props.title
    return (
      (route.meta.heading as string) ||
      (route.meta.title as string)?.replace(' – Fast Peptides', '') ||
      ''
    )
  })

  const splitTitle = computed(() => {
    const text = rawTitle.value.trim()
    if (!text) return { start: '', end: '' }

    const parts = text.split(' ')
    if (parts.length > 1) {
      const lastWord = parts.pop()
      return { start: parts.join(' '), end: lastWord }
    }

    return props.forceGradient ? { start: '', end: text } : { start: text, end: '' }
  })

  const displayDescription = computed(() => {
    return props.description || (route.meta.description as string) || ''
  })
</script>

<style scoped lang="less">
  .page-header {
    background: rgba(var(--secondary-900-rgb), 0.85);
    border: 1px solid color-mix(in srgb, @neutral-300 25%, transparent);

    box-shadow:
      0 8px 28px fade(#000, 35%),
      inset 0 0 0 1px fade(@white, 12%);

    border-radius: 18px;
    padding: 34px 32px;
    position: relative;
    overflow: hidden;
    text-align: center;
    margin-bottom: 10px; // Espacement standard bas

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(var(--primary-500-rgb), 0.3),
        transparent
      );
    }

    &__wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    &__title-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    &__title {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: @neutral-200;
      margin: 0;

      :deep(span) {
        background: linear-gradient(
          135deg,
          var(--secondary-600) 0%,
          var(--primary-500) 50%,
          var(--primary-400) 100%
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 1px 4px rgba(var(--primary-400-rgb), 0.15));

        display: inline-block;
      }
    }

    &__subtitle {
      font-size: 15px;
      color: @neutral-600;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.5;
    }

    &__separator {
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.06), transparent);
      margin: 20px auto 4px;
    }

    &__content {
      margin-top: 16px;
    }

    @media (max-width: 768px) {
      padding: 24px 20px;

      &__title {
        font-size: 28px;
      }
    }
  }
</style>
