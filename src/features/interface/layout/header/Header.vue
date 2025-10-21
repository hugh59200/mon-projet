<template>
  <nav class="auth-navbar">
    <div class="auth-navbar__left">
      <BasicIcon
        :name="isReduced ? 'menu-grid-reduced' : 'menu-grid'"
        active
        pointer
        @click="toggle"
      />
      <BasicText
        size="body-l"
        weight="bold"
        class="auth-navbar__logo"
      >
        Fast Peptides
      </BasicText>
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
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { useCartStore } from '@/features/cart/useCartStore'
  import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const auth = useAuthStore()
  const cart = useCartStore()
  const sidebar = useSidebarStore()
  const { isReduced } = storeToRefs(sidebar) // ✅ réactif
  const { toggle } = sidebar

  async function handleLogout() {
    await auth.signOut()
    router.push('/login')
  }
</script>

<style scoped lang="less">
  .auth-navbar {
    position: fixed; /* ✅ reste collé en haut */
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000; /* passe au-dessus de la sidebar */
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    background-color: @secondary-800;
    color: white;

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
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
</style>
