<template>
  <nav class="auth-navbar">
    <div class="auth-navbar__left">
      <div class="auth-navbar__left--icon">
        <BasicIcon
          :name="sidebar.isOpen ? 'menu-grid' : 'menu-grid-reduced'"
          active
          pointer
          @click="sidebar.toggle()"
        />
      </div>
      <div class="auth-navbar__left--logo">
        <BasicText
          size="body-l"
          weight="bold"
        >
          Fast Peptides
        </BasicText>
      </div>
    </div>

    <div class="auth-navbar__right">
      <template v-if="auth.user">
        <BasicText
          size="body-m"
          class="auth-navbar__email"
        >
          {{ auth.user.email }}
        </BasicText>

        <BasicButton
          v-if="auth.isAdmin"
          label="Administration"
          type="primary"
          variant="filled"
          size="small"
          @click="$router.push('/admin/users')"
        />

        <BasicButton
          label="Panier"
          type="secondary"
          size="small"
          @click="$router.push('/panier')"
        />
        <BasicBadge
          v-if="cart.totalItems > 0"
          :label="cart.totalItems.toString()"
        />
        <BasicButton
          label="Paiement"
          type="secondary"
          size="small"
          @click="$router.push('/paiement')"
        />
        <BasicButton
          label="Mon profil"
          type="secondary"
          size="small"
          @click="$router.push('/profil')"
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
          variant="filled"
          size="small"
          @click="router.push('/login')"
        />
        <BasicButton
          label="Inscription"
          type="reverse"
          variant="outlined"
          size="small"
          @click="router.push('/register')"
        />
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'
  import { useRouter } from 'vue-router'
  import { useCartStore } from '../cart/useCartStore'
  import { useAuthStore } from './useAuthStore'

  const router = useRouter()
  const auth = useAuthStore()
  const cart = useCartStore()
  const sidebar = useSidebarStore()

  async function handleLogout() {
    await auth.signOut()
    router.push('/login')
  }
</script>

<style scoped lang="less">
  .auth-navbar {
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 24px;
    background-color: @secondary-800;
    color: white;
    z-index: 1000;

    &__left {
      display: flex;
      align-items: center;

      &--icon {
        margin-right: 16px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;

        svg {
          fill: white;
        }
      }

      &--logo {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    &__email {
      margin-right: 12px;
      color: @neutral-100;
    }
  }
</style>
