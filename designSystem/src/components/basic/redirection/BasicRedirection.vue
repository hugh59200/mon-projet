<template>
  <div class="basic-redirection">
    <div ref="topAnchor"><slot name="topAnchor" /></div>

    <div class="basic-redirection__bottom">
      <slot name="bottomAnchor" />
      <div
        v-show="showIf && isPastTop"
        class="basic-redirection__affix basic-redirection__affix--sticky"
      >
        <BasicTooltip
          label="Revenir au tableau"
          position="top"
        >
          <BasicButton
            class="basic-redirection__btn"
            v-bind="props"
            icon-name="ArrowUp"
            @click="onClick"
          />
        </BasicTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import type { BasicRedirectionProps } from './BasicRedirection.types'

  const props = withDefaults(defineProps<BasicRedirectionProps>(), {
    variant: 'outlined',
    showIf: true,
  })

  const emit = defineEmits<{ 'after-scroll': [] }>()

  const topAnchor = ref<HTMLElement | null>(null)
  const isPastTop = ref(false)

  function onClick() {
    const el = props.to ? document.querySelector<HTMLElement>(`#${props.to}`) : topAnchor.value
    el?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => emit('after-scroll'), 500)
  }

  let observer: IntersectionObserver | null = null
  onMounted(() => {
    if (!topAnchor.value) return
    observer = new IntersectionObserver(([entry]) => {
      isPastTop.value = entry!.isIntersecting
    })
    observer.observe(topAnchor.value)
  })
  onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped lang="less">
  .basic-redirection {
    display: flex;
    flex-direction: column;
    gap: @spacing-15;

    &__bottom {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: @spacing-15;
    }

    &__affix {
      display: flex;
      justify-content: flex-end;
    }

    &__affix--sticky {
      position: sticky;
      bottom: 0;
      z-index: 3;
    }

    &__btn {
      display: inline-flex;
      width: auto;
      opacity: 0.6;
      transition:
        opacity 0.2s ease,
        transform 0.2s ease,
        box-shadow 0.2s ease;
      &:hover,
      &:focus-visible {
        opacity: 1;
        transform: translateY(-1px);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      }
    }
  }
</style>
