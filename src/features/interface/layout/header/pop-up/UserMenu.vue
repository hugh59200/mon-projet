<template>
  <FloatingDropdownWrapper
    v-model="isOpen"
    :width="280"
    align="right"
    arrow-align="auto"
    :close-delay="800"
    trigger-mode="click"
  >
    <template #trigger>
      <div class="user-trigger">
        <div class="user-trigger__avatar">
          <BasicIconNext
            name="User"
            :size="20"
          />
        </div>
        <Transition name="badge">
          <div
            v-if="totalUnread > 0"
            class="user-trigger__badge"
          >
            {{ totalUnread }}
          </div>
        </Transition>
        <div class="user-trigger__glow"></div>
      </div>
    </template>

    <div class="user-menu">
      <template v-if="user">
        <!-- User Header -->
        <UserHeader />

        <div class="user-menu__divider"></div>

        <!-- Navigation -->
        <nav class="user-menu__nav">
          <button class="user-menu__link" @click="goTo('/profil')">
            <BasicIconNext name="UserCog" :size="18" class="user-menu__icon" />
            <span>{{ t('nav.profile') }}</span>
          </button>
          <button class="user-menu__link" @click="goTo('/favoris')">
            <BasicIconNext name="Heart" :size="18" class="user-menu__icon" />
            <span>{{ t('nav.favorites') }}</span>
            <span v-if="wishlistCount > 0" class="user-menu__badge">{{ wishlistCount }}</span>
          </button>
          <button class="user-menu__link" @click="goTo('/admin/messagerie')">
            <BasicIconNext name="MessageSquare" :size="18" class="user-menu__icon" />
            <span>{{ t('profile.support') }}</span>
            <span v-if="totalUnread > 0" class="user-menu__badge">{{ totalUnread }}</span>
          </button>
          <button class="user-menu__link" @click="goTo('/admin/statistiques')">
            <BasicIconNext name="BarChart3" :size="18" class="user-menu__icon" />
            <span>{{ t('admin.stats') }}</span>
          </button>
          <button
            v-if="isAdmin"
            class="user-menu__link user-menu__link--accent"
            @click="goToAdmin"
          >
            <BasicIconNext name="Settings" :size="18" class="user-menu__icon" />
            <span>{{ t('nav.admin') }}</span>
          </button>
        </nav>

        <div class="user-menu__divider"></div>

        <!-- Logout -->
        <button class="user-menu__link user-menu__link--danger" @click="handleLogout">
          <BasicIconNext name="LogOut" :size="18" class="user-menu__icon" />
          <span>{{ t('nav.logout') }}</span>
        </button>
      </template>

      <!-- Guest -->
      <template v-else>
        <nav class="user-menu__nav">
          <button class="user-menu__link" @click="goTo('/suivi-commande')">
            <BasicIconNext name="PackageSearch" :size="18" class="user-menu__icon" />
            <span>{{ t('tracking.title') }}</span>
          </button>
          <button class="user-menu__link" @click="goTo('/favoris')">
            <BasicIconNext name="Heart" :size="18" class="user-menu__icon" />
            <span>{{ t('nav.favorites') }}</span>
            <span v-if="wishlistCount > 0" class="user-menu__badge">{{ wishlistCount }}</span>
          </button>
        </nav>

        <div class="user-menu__divider user-menu__divider--subtle"></div>

        <nav class="user-menu__nav">
          <button class="user-menu__link user-menu__link--accent" @click="goTo('/auth/login')">
            <BasicIconNext name="LogIn" :size="18" class="user-menu__icon" />
            <span>{{ t('nav.login') }}</span>
          </button>
          <button class="user-menu__link" @click="goTo('/auth/register')">
            <BasicIconNext name="UserPlus" :size="18" class="user-menu__icon" />
            <span>{{ t('nav.register') }}</span>
          </button>
        </nav>
      </template>
    </div>
  </FloatingDropdownWrapper>
</template>

<script setup lang="ts">
  import { useAdminTabStore } from '@/features/admin/stores/useAdminTabStore'
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useWishlistStore } from '@/features/catalogue/stores/useWishlistStore'
  import { useChatNotifStore } from '@/features/chat/shared/stores/useChatNotifStore'
  import { BasicIconNext } from '@designSystem/components/basic/icon'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import UserHeader from './UserHeader.vue'

  const { t } = useI18n()
  const router = useRouter()
  const { user, isAdmin, signOut } = useAuthStore()
  const notifStore = useChatNotifStore()
  const adminTabStore = useAdminTabStore()
  const wishlistStore = useWishlistStore()
  const isOpen = ref(false)

  const totalUnread = computed(() =>
    Object.values(notifStore.unreadByUser || {}).reduce((a, b) => a + (b || 0), 0),
  )
  const wishlistCount = computed(() => wishlistStore.count)

  const goTo = (path: string) => {
    isOpen.value = false
    router.push(path)
  }
  const goToAdmin = () => {
    isOpen.value = false
    router.push(adminTabStore.getRedirectRoute(true))
  }
  const handleLogout = async () => {
    isOpen.value = false
    adminTabStore.clearLastTab()
    await signOut()
  }
</script>

<style scoped lang="less">
  @ease: cubic-bezier(0.16, 1, 0.3, 1);

  // Le dropdown a toujours un fond sombre (via FloatingDropdownWrapper)
  // On utilise donc des couleurs fixes pour le texte
  @dropdown-text: @neutral-100;
  @dropdown-text-muted: @neutral-300;
  @dropdown-text-subtle: @neutral-500;
  @dropdown-border: rgba(255, 255, 255, 0.08);
  @dropdown-hover: rgba(255, 255, 255, 0.04);

  // Trigger
  .user-trigger {
    position: relative;
    cursor: pointer;
    padding: 0;

    &__avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: transparent;
      border: 1px solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      color: @neutral-200;
      transition: all 0.2s @ease;
      position: relative;
      z-index: 1;

      &:hover {
        background: rgba(255, 255, 255, 0.06);
      }
    }

    &__badge {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      background: var(--primary-600);
      color: @neutral-50;
      border-radius: 100px;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 0 2px var(--secondary-900);
      z-index: 2;
    }

    &__glow {
      display: none;
    }

    &:active {
      .user-trigger__avatar {
        opacity: 0.8;
      }
    }
  }

  // Menu
  .user-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__divider {
      height: 1px;
      background: @dropdown-border;
      margin: 4px 0;

      &--subtle {
        background: rgba(255, 255, 255, 0.04);
      }
    }

    &__nav {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__link {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 10px 12px;
      border: none;
      border-radius: 10px;
      background: transparent;
      color: @dropdown-text-muted;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s @ease;
      text-align: left;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: @dropdown-text;

        .user-menu__icon {
          color: var(--primary-400);
        }
      }

      &--accent {
        color: var(--primary-400);

        .user-menu__icon {
          color: var(--primary-400);
        }

        &:hover {
          background: rgba(var(--primary-500-rgb), 0.15);
          color: var(--primary-300);
        }
      }

      &--danger {
        color: @danger-400;

        .user-menu__icon {
          color: @danger-400;
        }

        &:hover {
          background: rgba(@danger-500, 0.15);
          color: @danger-300;

          .user-menu__icon {
            color: @danger-300;
          }
        }
      }
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: @dropdown-text-subtle;
      transition: color 0.2s;
      flex-shrink: 0;
    }

    &__badge {
      margin-left: auto;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      background: rgba(var(--primary-500-rgb), 0.15);
      color: var(--primary-400);
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  // Badge Animation
  .badge-enter-active {
    animation: badgePop 0.4s @ease;
  }
  .badge-leave-active {
    animation: badgePop 0.3s @ease reverse;
  }

  @keyframes badgePop {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
