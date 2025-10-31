<template>
  <nav class="auth-navbar">
    <!-- 🧭 Gauche -->
    <div class="auth-navbar__left">
      <BasicTooltip
        label="Ouvrir le menu"
        position="bottom"
      >
        <BasicIconNext
          :name="isReduced ? 'LayoutGrid' : 'Menu'"
          pointer
          @click="toggle"
        />
      </BasicTooltip>

      <!-- 🧬 Logo App (restauré comme avant) -->
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
        <!-- 🛒 Panier -->
        <BasicTooltip
          label="Voir mon panier"
          position="bottom"
          :visible="!showCartPopup"
        >
          <div
            class="cart-icon"
            ref="cartIcon"
            @click="router.push('/panier')"
          >
            <BasicIconNext
              name="ShoppingCart"
              :size="22"
            />

            <!-- 🔢 Badge -->
            <transition name="badge-pop">
              <div
                v-if="cart.totalItems > 0"
                class="cart-badge"
              >
                {{ cart.totalItems }}
              </div>
            </transition>

            <!-- ✨ Mini-popup d’ajout -->
            <CartItemPopup
              v-if="showCartPopup && lastAddedProduct"
              :product="lastAddedProduct"
              :protected-refs="[cartIcon]"
              @view-cart="goToCart"
              @checkout="goToCheckout"
              @hover="handleHover"
              @close="showCartPopup = false"
            />
          </div>
        </BasicTooltip>

        <!-- 👤 Menu utilisateur -->
        <BasicTooltip
          label="Mon compte"
          position="bottom"
          :visible="!menuOpen"
        >
          <div
            class="user-menu"
            @click="toggleMenu"
            ref="userMenu"
          >
            <BasicIconNext
              name="User"
              :size="20"
            />
            <transition name="fade-slide">
              <div
                v-if="menuOpen"
                class="user-dropdown"
              >
                <div class="user-header">
                  <BasicText
                    weight="bold"
                    size="body-m"
                    class="user-name"
                  >
                    {{ auth.user.fullName || 'Utilisateur' }}
                  </BasicText>
                  <BasicText
                    size="body-s"
                    color="neutral-300"
                    class="user-email"
                  >
                    {{ auth.user.email }}
                  </BasicText>
                </div>

                <div class="divider"></div>
                <div @click="goToProfile">Mon profil</div>
                <div
                  v-if="auth.isAdmin"
                  @click="goToAdmin"
                >
                  Espace Admin
                </div>

                <div class="divider"></div>
                <div @click="handleLogout">Se déconnecter</div>
              </div>
            </transition>
          </div>
        </BasicTooltip>
      </template>

      <template v-else>
        <BasicTooltip
          label="Se connecter"
          position="bottom"
        >
          <BasicButton
            label="Connexion"
            type="primary"
            size="small"
            @click="router.push('/auth/login')"
          />
        </BasicTooltip>
        <BasicTooltip
          label="Créer un compte"
          position="bottom"
        >
          <BasicButton
            label="Inscription"
            type="reverse"
            variant="outlined"
            size="small"
            @click="router.push('/auth/register')"
          />
        </BasicTooltip>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { useAdminTabStore } from '@/features/admin/stores/useAdminTabStore'
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import type { CartItem } from '@/features/catalogue/cart/Cart.types'
  import { useCartStore } from '@/features/catalogue/cart/useCartStore'
  import CartItemPopup from '@/features/catalogue/pop-up/CartItemPopup.vue'
  import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'
  import { storeToRefs } from 'pinia'
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  const cart = useCartStore()
  const showCartPopup = ref(false)
  const lastAddedProduct = ref<CartItem | null>(null)
  const isHovering = ref(false)
  let popupTimeout: ReturnType<typeof setTimeout> | null = null

  watch(
    () => cart.lastAddedItem,
    (newItem) => {
      if (!newItem) return
      lastAddedProduct.value = newItem
      showCartPopup.value = true
      startPopupTimer()
    },
  )

  function handleHover(state: boolean) {
    isHovering.value = state
    if (state && popupTimeout) clearTimeout(popupTimeout)
    else startPopupTimer()
  }

  function startPopupTimer() {
    if (popupTimeout) clearTimeout(popupTimeout)
    popupTimeout = setTimeout(() => {
      if (!isHovering.value) showCartPopup.value = false
    }, 3500)
  }

  const router = useRouter()
  const auth = useAuthStore()
  const sidebar = useSidebarStore()
  const adminTabStore = useAdminTabStore()
  const { isReduced } = storeToRefs(sidebar)
  const { toggle } = sidebar

  const cartIcon = ref<HTMLElement | null>(null)

  // 🔍 Surveille les ajouts au panier
  watch(
    () => cart.lastAddedItem,
    (newItem) => {
      if (!newItem) return
      lastAddedProduct.value = newItem
      showCartPopup.value = true
      startPopupTimer()
    },
  )

  // 🖱️ Gère le survol
  onMounted(() => {
    if (!cartIcon.value) return

    cartIcon.value.addEventListener('mouseenter', () => {
      isHovering.value = true
      if (popupTimeout) clearTimeout(popupTimeout)
    })

    cartIcon.value.addEventListener('mouseleave', () => {
      isHovering.value = false
      startPopupTimer()
    })
  })

  function goToCart() {
    showCartPopup.value = false
    router.push('/panier')
  }

  function goToCheckout() {
    showCartPopup.value = false
    router.push('/checkout')
  }

  // 👤 Menu utilisateur
  const menuOpen = ref(false)
  const userMenu = ref<HTMLElement | null>(null)

  function toggleMenu() {
    menuOpen.value = !menuOpen.value
  }

  function closeMenu(e: MouseEvent) {
    if (userMenu.value && !userMenu.value.contains(e.target as Node)) {
      menuOpen.value = false
    }
  }

  onMounted(() => document.addEventListener('click', closeMenu))
  onBeforeUnmount(() => document.removeEventListener('click', closeMenu))

  function goToProfile() {
    menuOpen.value = false
    router.push('/profil')
  }

  function goToAdmin() {
    menuOpen.value = false
    const target = adminTabStore.getRedirectRoute()
    router.push(target)
  }

  async function handleLogout() {
    menuOpen.value = false
    adminTabStore.clearLastTab()
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
    background: linear-gradient(90deg, @neutral-900, darken(@neutral-900, 5%));
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    user-select: none;

    &__left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &__logo {
      cursor: pointer;
      color: white;
      transition: opacity 0.2s ease;
      &:hover {
        opacity: 0.85;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }

  /* 🧩 Logo App */
  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.25s ease;
    &:hover {
      transform: scale(1.08);
    }
    .logo-img {
      width: 100%;
      height: 100%;
    }
  }

  /* 🛒 Panier */
  .cart-icon {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: transform 0.2s ease;
    &:hover {
      transform: scale(1.08);
    }

    .cart-badge {
      position: absolute;
      top: -6px;
      right: -5px;
      background: @danger-500;
      color: white;
      border-radius: 50%;
      height: 15px;
      width: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      box-shadow: 0 0 0 2px @neutral-900;
    }
  }

  /* ✨ Popup d’ajout au panier */
  .cart-popup {
    position: absolute;
    top: 36px;
    right: 0;
    background: @neutral-800;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    min-width: 220px;
    max-width: 260px;
    z-index: 4000;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: white;

    .popup-content {
      display: flex;
      align-items: center;
      gap: 10px;

      .popup-img {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        object-fit: cover;
        background: fade(@neutral-700, 40%);
      }

      .popup-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
    }

    .popup-actions {
      display: flex;
      justify-content: space-between;
      gap: 6px;
      margin-top: 4px;

      button {
        flex: 1;
        font-size: 13px;
        padding: 4px 0;
      }
    }
  }
</style>
