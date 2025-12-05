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

      <PremiumButton
        type="primary"
        variant="solid"
        size="sm"
        :label="t('nav.login')"
        @click="$router.push('/auth/login')"
      />
    </div>
  </template>

  <!-- Visitor (not logged in, no cart) -->
  <template v-else>
    <!-- Desktop/Tablet: Bouton login visible -->
    <PremiumButton
      v-if="!isMobile"
      type="primary"
      variant="solid"
      size="sm"
      :label="t('nav.login')"
      icon-left="LogIn"
      @click="$router.push('/auth/login')"
    />

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

  // Responsive - Mobile (≤ 720px)
  .respond-mobile({
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
  });
</style>
