<template>
  <!-- Connected User -->
  <UserMenu v-if="auth.user" />

  <!-- Guest with Cart Items -->
  <template v-else-if="hasGuestCart">
    <div class="header-actions__guest">
      <div class="header-actions__guest-indicator">
        <BasicIconNext
          name="User"
          :size="14"
          color="primary-400"
        />
        <span>{{ t('nav.guest') }}</span>
      </div>

      <button
        class="header-actions__btn header-actions__btn--primary"
        @click="$router.push('/auth/login')"
      >
        {{ t('nav.login') }}
      </button>
    </div>
  </template>

  <!-- Visitor (not logged in, no cart) -->
  <template v-else>
    <!-- Desktop/Tablet: Bouton login visible -->
    <button
      v-if="!isMobile"
      class="header-actions__btn header-actions__btn--primary"
      @click="$router.push('/auth/login')"
    >
      <BasicIconNext
        name="LogIn"
        :size="16"
        color="white"
      />
      <span>{{ t('nav.login') }}</span>
    </button>

    <!-- Mobile: UserMenu dropdown -->
    <UserMenu v-else />
  </template>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import UserMenu from './pop-up/UserMenu.vue'

  const { t } = useI18n()
  const auth = useAuthStore()
  const cart = useCartStore()
  const { isMobile } = useDeviceBreakpoint()

  const hasGuestCart = computed(() => !auth.user && cart.items.length > 0)
</script>

<style scoped lang="less">
  @font-body:
    'Inter',
    'SF Pro Text',
    -apple-system,
    sans-serif;
  @ease: cubic-bezier(0.4, 0, 0.2, 1);

  .header-actions {
    &__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 10px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s @ease;
      white-space: nowrap;
      border: none;

      &--primary {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        color: white;
        box-shadow:
          0 2px 8px rgba(var(--primary-500-rgb), 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);

        &:hover {
          transform: translateY(-2px);
          box-shadow:
            0 4px 16px rgba(var(--primary-500-rgb), 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }

    &__guest {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px 6px 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 50px;
      backdrop-filter: blur(12px);
      transition: all 0.3s @ease;

      &:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.12);
      }
    }

    &__guest-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-right: 8px;
      border-right: 1px solid rgba(255, 255, 255, 0.1);

      span {
        font-family: @font-body;
        font-size: 13px;
        font-weight: 600;
        color: @neutral-300;
      }
    }
  }

  // Responsive
  @media (max-width: 1100px) {
    .header-actions__btn {
      padding: 8px 14px;
      font-size: 13px;
      gap: 6px;
    }
  }

  @media (max-width: 900px) {
    .header-actions__btn {
      padding: 8px 12px;

      span {
        display: none;
      }
    }
  }

  @media (max-width: 750px) {
    .header-actions__guest {
      padding: 4px;
      background: transparent;
      border: none;
      backdrop-filter: none;
      gap: 6px;
    }

    .header-actions__guest-indicator {
      display: none;
    }

    .header-actions__btn {
      padding: 8px 14px;

      span {
        display: inline;
      }
    }
  }
</style>
