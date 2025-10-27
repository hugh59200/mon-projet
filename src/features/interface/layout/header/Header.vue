<template>
  <nav class="auth-navbar">
    <!-- 🧭 Gauche -->
    <div class="auth-navbar__left">
      <BasicIconNext
        :name="isReduced ? 'LayoutGrid' : 'Menu'"
        pointer
        @click="toggle"
      />

      <div
        class="logo-icon"
        @click="router.push('/')"
      >
        <img
          src="@/assets/logo-app.png"
          alt="Logo Fast Peptides"
          class="logo-img"
        />
      </div>

      <BasicText
        size="body-l"
        weight="bold"
        class="auth-navbar__logo"
        @click="router.push('/')"
      >
        Fast Peptides
      </BasicText>
    </div>

    <!-- 🧩 Droite -->
    <div class="auth-navbar__right">
      <template v-if="auth.user">
        <BasicText
          size="body-m"
          class="auth-navbar__email"
        >
          {{ auth.user.email }}
        </BasicText>

        <!-- 👨‍💼 Admin -->
        <div
          v-if="auth.isAdmin"
          class="admin-chat-button"
          @click="router.push('/admin/chat')"
        >
          <BasicButton
            label="Admin"
            type="primary"
            size="small"
          />
          <transition name="badge-pop">
            <div
              v-if="chatNotif.unreadCount > 0"
              class="badge"
              title="Nouveaux messages"
            >
              {{ chatNotif.unreadCount }}
            </div>
          </transition>
        </div>

        <!-- 🛒 Panier -->
        <div
          class="cart-zone"
          @click="router.push('/panier')"
        >
          <BasicButton
            label="Panier"
            type="secondary"
            size="small"
          />
          <BasicBadge
            v-if="cart.totalItems > 0"
            :label="cart.totalItems.toString()"
          />
        </div>

        <BasicButton
          label="Paiement"
          type="secondary"
          size="small"
          :disabled="cart.totalItems === 0"
          @click="cart.totalItems > 0 && router.push('/checkout')"
        />

        <BasicButton
          label="Mon profil"
          type="secondary"
          size="small"
          @click="router.push('/profil')"
        />

        <BasicButton
          label="Se déconnecter"
          type="secondary"
          variant="outlined"
          size="small"
          @click="handleLogout"
        />
      </template>

      <template v-else>
        <BasicButton
          label="Connexion"
          type="primary"
          size="small"
          @click="router.push('/auth/login')"
        />
        <BasicButton
          label="Inscription"
          type="reverse"
          variant="outlined"
          size="small"
          @click="router.push('/auth/register')"
        />
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { useCartStore } from '@/features/cart/useCartStore'
  import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'
  import { useChatNotifStore } from '@/features/support/stores/useChatNotifStore'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const auth = useAuthStore()
  const cart = useCartStore()
  const sidebar = useSidebarStore()
  const chatNotif = useChatNotifStore()

  const { isReduced } = storeToRefs(sidebar)
  const { toggle } = sidebar

  async function handleLogout() {
    await auth.signOut()
  }
</script>

<style scoped lang="less">
  .auth-navbar {
    grid-area: header;
    z-index: 1000;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    background: @neutral-900;
    user-select: none;

    &__left {
      display: flex;
      align-items: center;
      gap: 16px;

      svg {
        fill: @white;
      }
    }

    &__logo {
      cursor: pointer;
      user-select: none;
      color: white;
      transition: opacity 0.2s ease;
      &:hover {
        opacity: 0.85;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    &__email {
      color: @neutral-200;
    }
  }

  /* 🧩 Bouton admin avec badge */
  .admin-chat-button {
    position: relative;
    display: inline-flex;
    align-items: center;

    .badge {
      position: absolute;
      top: -6px;
      right: -6px;
      background: @danger-600;
      color: white;
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      min-width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 0 2px fade(@neutral-900, 80%);
      transition: transform 0.2s ease;
    }
  }

  /* 🛍️ Zone panier */
  .cart-zone {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }

  /* 💫 Pop-in du badge */
  .badge-pop-enter-active {
    transition: all 0.25s ease;
  }
  .badge-pop-enter-from {
    transform: scale(0.6);
    opacity: 0;
  }
  .badge-pop-leave-to {
    transform: scale(0.6);
    opacity: 0;
  }

  /* 🧩 Logo */
  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    cursor: pointer;
    flex-shrink: 0;

    &:hover {
      transform: scale(1.05);
      transition: transform 0.25s ease;
    }

    .logo-img {
      width: 100%;
      height: 100%;
    }
  }
</style>
