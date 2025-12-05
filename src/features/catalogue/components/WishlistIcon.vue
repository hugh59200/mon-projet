<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '../stores/useWishlistStore'

const router = useRouter()
const { t } = useI18n()
const wishlistStore = useWishlistStore()

const count = computed(() => wishlistStore.count)
const hasItems = computed(() => count.value > 0)

function goToFavorites(): void {
  router.push({ name: 'favorites' })
}
</script>

<template>
  <BasicTooltip
    :label="hasItems ? '' : t('nav.favorites')"
    position="bottom"
  >
    <button
      class="wishlist-icon"
      :class="{ 'wishlist-icon--active': hasItems }"
      :aria-label="`Favoris (${count})`"
      @click="goToFavorites"
    >
      <div class="wishlist-icon__inner">
        <BasicIconNext
          name="Heart"
          :size="20"
          :color="hasItems ? 'danger-400' : 'neutral-200'"
        />
        <div
          v-if="hasItems"
          class="wishlist-icon__glow"
        ></div>
      </div>
      <Transition name="badge">
        <div
          v-if="hasItems"
          class="wishlist-icon__badge"
        >
          {{ count > 9 ? '9+' : count }}
        </div>
      </Transition>
    </button>
  </BasicTooltip>
</template>

<style scoped lang="less">
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.wishlist-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s @ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  &--active {
    border-color: rgba(var(--danger-500-rgb), 0.2);

    &:hover {
      border-color: rgba(var(--danger-500-rgb), 0.3);
      background: rgba(var(--danger-500-rgb), 0.08);
    }
  }

  &__inner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__glow {
    position: absolute;
    inset: -4px;
    background: radial-gradient(
      circle,
      rgba(var(--danger-500-rgb), 0.15) 0%,
      transparent 70%
    );
    border-radius: 50%;
    pointer-events: none;
    animation: pulse 2s ease-in-out infinite;
  }

  &__badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 13px;
    height: 13px;
    padding: 0 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, @danger-500 0%, @danger-600 100%);
    border-radius: 7px;
    font-size: 8px;
    font-weight: 700;
    color: white;
    box-shadow: 0 2px 6px rgba(var(--danger-500-rgb), 0.4);
  }
}

// Badge animation
.badge-enter-active,
.badge-leave-active {
  transition: all 0.3s @ease;
}

.badge-enter-from,
.badge-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

// Responsive - Mobile (≤ 720px)
.respond-mobile({
  .wishlist-icon {
    width: 32px;
    height: 32px;

    &__badge {
      min-width: 16px;
      height: 16px;
      font-size: 9px;
      top: -3px;
      right: -3px;
    }
  }
});
</style>
