<script setup lang="ts">
import { computed } from 'vue'
import { Heart } from 'lucide-vue-next'
import { useWishlistStore } from '../stores/useWishlistStore'

interface Props {
  productId: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
})

const wishlistStore = useWishlistStore()

const isActive = computed(() => wishlistStore.isInWishlist(props.productId))

function handleClick(event: Event): void {
  event.stopPropagation()
  event.preventDefault()
  wishlistStore.toggle(props.productId)
}
</script>

<template>
  <button
    class="wishlist-button"
    :class="{ 'wishlist-button--active': isActive }"
    :aria-label="isActive ? 'Retirer des favoris' : 'Ajouter aux favoris'"
    :aria-pressed="isActive"
    @click="handleClick"
  >
    <Heart
      :size="props.size"
      :stroke-width="2"
      class="wishlist-icon"
      :class="{ 'wishlist-icon--filled': isActive }"
    />
  </button>
</template>

<style scoped lang="less">
@import '@designSystem/fondation/colors/colors.less';
@import '@designSystem/fondation/spacing/spacing.less';

@ease: cubic-bezier(0.4, 0, 0.2, 1);

.wishlist-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: all 0.25s @ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  // Mobile: Taille compacte mais cliquable (≤ 720px)
  .respond-mobile({
    width: 32px;
    height: 32px;
  });

  .wishlist-icon {
    color: @neutral-400;
    transition: all 0.25s @ease;
  }

  &:hover {
    background: rgba(var(--danger-500-rgb), 0.85);
    box-shadow: 0 4px 12px rgba(var(--danger-500-rgb), 0.4);

    .wishlist-icon {
      color: white;
    }
  }

  &:active {
    transform: scale(0.95);
  }

  // État actif = même rendu que hover
  &--active {
    background: rgba(var(--danger-500-rgb), 0.85);
    box-shadow: 0 4px 12px rgba(var(--danger-500-rgb), 0.4);

    .wishlist-icon {
      color: white;
    }

    &:hover {
      background: rgba(var(--danger-500-rgb), 1);
      box-shadow: 0 4px 16px rgba(var(--danger-500-rgb), 0.5);
    }
  }
}

.wishlist-icon {
  &--filled {
    animation: heartPop 0.3s @ease;
  }
}

@keyframes heartPop {
  0%, 100% {
    transform: scale(1);
  }
}
</style>
