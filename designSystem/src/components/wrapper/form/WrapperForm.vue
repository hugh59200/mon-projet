<template>
  <div
    class="wrapper-form"
    style="margin-top: 16px"
  >
    <BasicTabs
      class="wrapper-form__tabs--desktop"
      v-model="modelValue"
      :tabs
      :tabsPlacement
    />
    <BasicTab
      :tabKey="currentTab?.tabKey"
      :tabState="currentTab?.tabState"
      class="wrapper-form__tabs--mobile"
    />
    <div class="wrapper-form__main">
      <div
        v-if="isMobile || showStepper"
        class="wrapper-form__header"
      >
        <BasicButton
          :disabled="!canMovePrevious"
          label="Précédent"
          type="secondary"
          variant="ghost"
          size="small"
          iconName="arrow-left"
          @click="handleMovePrevious"
        />
        <BasicButton
          :disabled="!canMoveNext"
          label="Suivant"
          type="secondary"
          variant="ghost"
          size="small"
          iconRight
          iconName="arrow-right"
          @click="handleMoveNext"
        />
      </div>
      <div
        ref="scrollContainer"
        class="scroll-container scrollable scrollbar"
      >
        <div class="wrapper-form__content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { DEVICE_BREAKPOINT } from '@/plugin/device-breakpoint'
  import type { TabsModel } from '@designSystem/components/basic/tabs/BasicTabs.types'
  import { inject, ref, toRef, watch } from 'vue'
  import { useWrapperFormLogic, type TabsStepperEmit } from './useWrapperFormLogic'

  const modelValue = defineModel<TabsModel>()

  const props = withDefaults(
    defineProps<{
      tabs: TabProps[]
      showStepper?: boolean
      tabsPlacement?: 'center' | 'start'
      addTabInfo?: string
    }>(),
    {
      tabsPlacement: 'center',
    },
  )

  const { isMobile } = inject(DEVICE_BREAKPOINT)!

  const scrollContainer = ref<HTMLElement | null>(null)

  watch(modelValue, () => {
    requestAnimationFrame(() => {
      scrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
    })
  })

  const emit = defineEmits<TabsStepperEmit>()

  const { currentTab, canMovePrevious, canMoveNext, handleMovePrevious, handleMoveNext } =
    useWrapperFormLogic(modelValue, toRef(props, 'tabs'), emit)
</script>

<style scoped lang="less">
  .wrapper-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &__tabs {
      &--mobile {
        display: none;
      }
    }

    &__main {
      flex: 1;
      background-color: white;
      padding: @spacing-20 0;
      display: flex;
      flex-direction: column;
      gap: 24px;
      overflow: hidden;
    }

    &__header {
      display: none;
    }

    &__stepper {
      display: flex;
      justify-content: space-between;
      gap: @spacing-15;
    }

    &__title {
      color: @primary-600;
      font-weight: @font-weight-bold;
      font-size: @font-size-h4;
    }

    .scroll-container {
      flex: 1;
      margin-right: @spacing-5;
      overflow-x: hidden;
    }

    &__content {
      padding: 0 @spacing-15 0 @spacing-20;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }

  @media (max-width: 1000px) {
    .wrapper-form {
      &__title {
        display: none;
      }
      &__stepper {
        flex: 1;
      }
      &__header {
        padding: 0 @spacing-20;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 10;
      }

      &__content {
        padding: 0 12px;
        gap: 20px;
      }
      &__tabs--desktop {
        display: none;
      }
      &__tabs--mobile {
        max-width: 300px;
        width: 300px;
        height: 60px;
        align-self: center;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: @spacing-15 @spacing-20;
        gap: @spacing-5;
        user-select: none;
        font-size: @font-size-body-l;
        border-top-left-radius: @spacing-15;
        border-top-right-radius: @spacing-15;
        background-color: @white;

        :deep(.text) {
          font-weight: 900 !important;
        }
      }
    }
  }
</style>
