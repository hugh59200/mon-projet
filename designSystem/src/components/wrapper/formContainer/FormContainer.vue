<template>
  <form :id>
    <div class="divider">
      <span v-if="!withoutDivider" />
    </div>
    <div class="form">
      <div
        v-if="$slots.title"
        class="form__title"
      >
        <BasicText
          size="h4"
          weight="bold"
          nb-max-lines="2"
        >
          <slot name="title"></slot>
        </BasicText>
      </div>
      <slot name="message"></slot>
      <div
        v-if="$slots['header-actions']"
        class="form__actions"
      >
        <slot name="header-actions"></slot>
      </div>
      <slot name="content"></slot>
    </div>
  </form>
</template>

<script setup lang="ts">
  type FormProps = {
    withoutDivider?: boolean
    requiredFields?: boolean
    id?: string // ID utilisé pour la redirection
  }

  withDefaults(defineProps<FormProps>(), {
    withoutDivider: false,
  })
</script>

<style lang="less">
  .form {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: @spacing-25;

    &__bloc {
      display: grid;
      align-items: end;
      grid-template-columns: repeat(36, 1fr);
      row-gap: @spacing-25;
      column-gap: 2%;
    }

    &__title {
      cursor: default;
      position: sticky;
      top: -5px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 75%, rgba(0, 0, 0, 0) 100%);
      z-index: 2;
      padding-bottom: @spacing-5;
    }

    &__actions {
      position: absolute;
      display: flex;
      gap: 8px;
      right: 0;
      top: -8px;
      z-index: 2;
    }
  }

  .divider {
    margin-bottom: @spacing-20;
    user-select: none;

    span {
      display: block;
      border: 1px @neutral-200 solid;
    }
  }

  @media (max-width: 900px) {
    .form {
      flex-direction: column;

      &__actions {
        display: flex;
        position: unset;
        z-index: 1;

        > * {
          flex: 1;
        }
      }
    }
  }
</style>
