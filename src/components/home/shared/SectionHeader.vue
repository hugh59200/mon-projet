<template>
  <header
    class="section-header"
    :class="{ 'section-header--light': light }"
  >
    <span
      v-if="badge"
      class="section-header__badge"
    >
      {{ badge }}
    </span>
    <h2 class="section-header__title">{{ title }}</h2>
    <p
      v-if="description"
      class="section-header__desc"
    >
      {{ description }}
    </p>
  </header>
</template>

<script setup lang="ts">
  defineProps<{
    badge?: string
    title: string
    description?: string
    light?: boolean
  }>()
</script>

<style scoped lang="less">
  @font-display:
    'Instrument Sans',
    'SF Pro Display',
    -apple-system,
    sans-serif;
  @font-body:
    'Inter',
    'SF Pro Text',
    -apple-system,
    sans-serif;

  @light-text-primary: #1a202c;
  @light-text-secondary: #4a5568;

  .section-header {
    text-align: center;
    margin-bottom: 50px;

    &__badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(var(--primary-500-rgb), 0.15);
      border-radius: 100px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--primary-400);
      margin-bottom: 20px;
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(32px, 4vw, 48px);
      font-weight: 600;
      color: @neutral-50;
      margin: 0 0 16px;
      letter-spacing: -0.02em;
    }

    &__desc {
      font-family: @font-body;
      font-size: 18px;
      color: @neutral-300;
      margin: 0;
    }

    &--light {
      .section-header__badge {
        background: rgba(var(--primary-500-rgb), 0.1);
        color: var(--primary-600);
      }
      .section-header__title {
        color: @light-text-primary;
      }
      .section-header__desc {
        color: @light-text-secondary;
      }
    }
  }
</style>
