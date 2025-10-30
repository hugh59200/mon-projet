<template>
  <div class="wrapper-form">
    <!-- 🧭 Onglets (géré entièrement dans BasicTabs) -->
    <BasicTabs
      v-model="modelValue"
      :tabs="tabs"
      :tabsPlacement="tabsPlacement"
    />

    <!-- 🧩 Contenu principal -->
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
          iconName="ArrowLeft"
          @click="handleMovePrevious"
        />
        <BasicButton
          :disabled="!canMoveNext"
          label="Suivant"
          type="secondary"
          variant="ghost"
          size="small"
          iconRight
          iconName="ArrowRight"
          @click="handleMoveNext"
        />
      </div>

      <div class="scroll-container scrollable scrollbar">
        <div class="wrapper-form__content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import type { TabsModel } from '@designSystem/components/basic/tabs/BasicTabs.types'
  import { ref, toRef, watch } from 'vue'
  import { useWrapperFormLogic, type TabsStepperEmit } from './useWrapperFormLogic'

  const modelValue = defineModel<TabsModel>()

  const props = withDefaults(
    defineProps<{
      tabs: TabProps[]
      showStepper?: boolean
      tabsPlacement?: 'center' | 'start'
      addTabInfo?: string
    }>(),
    { tabsPlacement: 'center' },
  )

  const { isMobile } = useDeviceBreakpoint()

  const scrollContainer = ref<HTMLElement | null>(null)

  watch(modelValue, (newValue, oldValue) => {
    if (newValue !== oldValue && !window.location.pathname.includes('/admin')) {
      requestAnimationFrame(() => {
        scrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
      })
    }
  })

  const emit = defineEmits<TabsStepperEmit>()
  const { canMovePrevious, canMoveNext, handleMovePrevious, handleMoveNext } = useWrapperFormLogic(
    modelValue,
    toRef(props, 'tabs'),
    emit,
  )
</script>

<style scoped lang="less">
  .wrapper-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: 20px 0;

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

    &__content {
      padding: 0 @spacing-15 0 @spacing-20;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .scroll-container {
      flex: 1;
      margin-right: @spacing-5;
      overflow-x: hidden;
    }

    @media (max-width: 1000px) {
      &__header {
        padding: 0 @spacing-20;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 10;
      }
    }
  }
</style>
