<script setup lang="ts">
import { BasicIconNext } from '@designSystem/components/basic/icon'
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
    <div
      class="wishlist-wrapper"
      :class="{ 'wishlist-wrapper--active': hasItems }"
    >
      <button
        class="wishlist-btn"
        :aria-label="`Favoris (${count})`"
        @click="goToFavorites"
      >
        <BasicIconNext
          name="Heart"
          :size="20"
          :color="hasItems ? 'danger-400' : 'neutral-200'"
        />
        <div
          v-if="hasItems"
          class="wishlist-glow"
        ></div>
      </button>
      <Transition name="badge">
        <div
          v-if="hasItems"
          class="wishlist-badge"
        >
          {{ count > 9 ? '9+' : count }}
        </div>
      </Transition>
    </div>
  </BasicTooltip>
</template>

<style scoped lang="less">
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.wishlist-wrapper {
  position: relative;
  display: inline-flex;

  // Style quand actif (avec items)
  &--active .wishlist-btn {
    &:hover {
      background: rgba(var(--danger-500-rgb), 0.08);
    }
  }
}

.wishlist-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s @ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  &:active {
    opacity: 0.8;
  }
}

.wishlist-glow {
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

.wishlist-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, @danger-500 0%, @danger-600 100%);
  border-radius: 100px;
  font-size: 10px;
  font-weight: 700;
  color: white;
  box-shadow:
    0 2px 6px rgba(var(--danger-500-rgb), 0.4),
    0 0 0 2px var(--secondary-900);
  pointer-events: none;
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
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}
</style>
