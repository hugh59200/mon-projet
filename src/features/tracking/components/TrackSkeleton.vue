<template>
  <div class="track-skeleton">
    <div class="track-skeleton__nav">
      <div class="track-skeleton__btn"></div>
    </div>
    <div class="track-skeleton__grid">
      <!-- Main Column -->
      <div class="track-skeleton__main">
        <div class="track-skeleton__card track-skeleton__card--status">
          <div class="track-skeleton__header">
            <div>
              <div class="track-skeleton__line track-skeleton__line--label"></div>
              <div class="track-skeleton__line track-skeleton__line--number"></div>
            </div>
            <div class="track-skeleton__badge"></div>
          </div>
          <div class="track-skeleton__timeline">
            <div class="track-skeleton__step" v-for="i in 4" :key="i">
              <div class="track-skeleton__step-icon"></div>
              <div class="track-skeleton__step-content">
                <div class="track-skeleton__step-label"></div>
                <div class="track-skeleton__step-date"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="track-skeleton__details">
          <div class="track-skeleton__card track-skeleton__card--detail" v-for="i in 2" :key="i">
            <div class="track-skeleton__detail-icon"></div>
            <div class="track-skeleton__detail-content">
              <div class="track-skeleton__line track-skeleton__line--small"></div>
              <div class="track-skeleton__line track-skeleton__line--medium"></div>
              <div class="track-skeleton__line track-skeleton__line--large"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Sidebar -->
      <div class="track-skeleton__sidebar">
        <div class="track-skeleton__card track-skeleton__card--summary">
          <div class="track-skeleton__summary-header"></div>
          <div class="track-skeleton__items">
            <div class="track-skeleton__item" v-for="i in 3" :key="i"></div>
          </div>
          <div class="track-skeleton__totals">
            <div class="track-skeleton__total-row" v-for="i in 3" :key="i"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="less">
.track-skeleton {
  max-width: 1200px;
  margin: 0 auto;

  &__nav {
    margin-bottom: 28px;
  }

  &__btn {
    width: 200px;
    height: 48px;
    background: @neutral-200;
    border-radius: 14px;
    animation: shimmer 1.5s infinite;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 32px;
    align-items: start;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__card {
    background: white;
    border-radius: 24px;
    border: 1px solid @neutral-100;
    overflow: hidden;

    &--status {
      padding: 32px;
    }

    &--detail {
      display: flex;
      gap: 20px;
      padding: 24px;
    }

    &--summary {
      padding: 28px;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
  }

  &__badge {
    width: 120px;
    height: 40px;
    background: @neutral-100;
    border-radius: 20px;
    animation: shimmer 1.5s infinite;
  }

  &__line {
    background: @neutral-200;
    border-radius: 6px;
    animation: shimmer 1.5s infinite;

    &--label {
      width: 100px;
      height: 14px;
      margin-bottom: 10px;
    }

    &--number {
      width: 220px;
      height: 32px;
    }

    &--small {
      width: 80px;
      height: 12px;
      margin-bottom: 8px;
    }

    &--medium {
      width: 160px;
      height: 18px;
      margin-bottom: 8px;
    }

    &--large {
      width: 100%;
      height: 16px;
    }
  }

  &__timeline {
    display: flex;
    justify-content: space-between;
    padding: 28px;
    background: @neutral-50;
    border-radius: 20px;
  }

  &__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    flex: 1;
  }

  &__step-icon {
    width: 52px;
    height: 52px;
    background: @neutral-200;
    border-radius: 50%;
    animation: shimmer 1.5s infinite;
  }

  &__step-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  &__step-label {
    width: 80px;
    height: 16px;
    background: @neutral-200;
    border-radius: 4px;
    animation: shimmer 1.5s infinite;
  }

  &__step-date {
    width: 100px;
    height: 12px;
    background: @neutral-100;
    border-radius: 4px;
    animation: shimmer 1.5s infinite;
  }

  &__details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  &__detail-icon {
    width: 52px;
    height: 52px;
    background: @neutral-100;
    border-radius: 14px;
    flex-shrink: 0;
    animation: shimmer 1.5s infinite;
  }

  &__detail-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__summary-header {
    width: 100%;
    height: 28px;
    background: @neutral-100;
    border-radius: 8px;
    margin-bottom: 24px;
    animation: shimmer 1.5s infinite;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }

  &__item {
    height: 72px;
    background: @neutral-50;
    border-radius: 14px;
    animation: shimmer 1.5s infinite;
  }

  &__totals {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid @neutral-100;
  }

  &__total-row {
    height: 20px;
    background: @neutral-100;
    border-radius: 4px;
    animation: shimmer 1.5s infinite;

    &:last-child {
      height: 28px;
      margin-top: 8px;
      background: @neutral-200;
    }
  }
}

@keyframes shimmer {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

// Responsive
.respond-tablet({
  .track-skeleton {
    &__grid {
      grid-template-columns: 1fr 360px;
      gap: 28px;
    }
  }
});

.respond-mobile({
  .track-skeleton {
    &__grid {
      grid-template-columns: 1fr;
    }

    &__details {
      grid-template-columns: 1fr;
    }
  }
});
</style>
