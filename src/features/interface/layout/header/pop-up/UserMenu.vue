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
          <button
            class="user-menu__link"
            @click="goTo('/profil')"
          >
            <span class="user-menu__link-icon">
              <BasicIconNext
                name="UserCog"
                :size="18"
              />
            </span>
            <span>{{ t('nav.profile') }}</span>
          </button>
          <button
            class="user-menu__link"
            @click="goTo('/admin/messagerie')"
          >
            <span class="user-menu__link-icon">
              <BasicIconNext
                name="MessageSquare"
                :size="18"
              />
            </span>
            <span>{{ t('profile.support') }}</span>
            <span
              v-if="totalUnread > 0"
              class="user-menu__link-badge"
            >
              {{ totalUnread }}
            </span>
          </button>
          <button
            class="user-menu__link"
            @click="goTo('/admin/statistiques')"
          >
            <span class="user-menu__link-icon">
              <BasicIconNext
                name="BarChart3"
                :size="18"
              />
            </span>
            <span>{{ t('admin.stats') }}</span>
          </button>
          <button
            v-if="isAdmin"
            class="user-menu__link user-menu__link--accent"
            @click="goToAdmin"
          >
            <span class="user-menu__link-icon">
              <BasicIconNext
                name="Settings"
                :size="18"
              />
            </span>
            <span>{{ t('nav.admin') }}</span>
          </button>
        </nav>

        <div class="user-menu__divider"></div>

        <!-- Logout -->
        <button
          class="user-menu__logout"
          @click="handleLogout"
        >
          <BasicIconNext
            name="LogOut"
            :size="18"
          />
          <span>{{ t('nav.logout') }}</span>
        </button>
      </template>

      <!-- Guest -->
      <template v-else>
        <nav class="user-menu__nav">
          <button
            class="user-menu__link"
            @click="goTo('/suivi-commande')"
          >
            <span class="user-menu__link-icon">
              <BasicIconNext
                name="PackageSearch"
                :size="18"
              />
            </span>
            <span>{{ t('tracking.title') }}</span>
          </button>
        </nav>

        <div class="user-menu__divider user-menu__divider--subtle"></div>

        <nav class="user-menu__nav">
          <button
            class="user-menu__link user-menu__link--accent"
            @click="goTo('/auth/login')"
          >
            <span class="user-menu__link-icon">
              <BasicIconNext
                name="LogIn"
                :size="18"
              />
            </span>
            <span>{{ t('nav.login') }}</span>
          </button>
          <button
            class="user-menu__link"
            @click="goTo('/auth/register')"
          >
            <span class="user-menu__link-icon">
              <BasicIconNext
                name="UserPlus"
                :size="18"
              />
            </span>
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
  const isOpen = ref(false)

  const totalUnread = computed(() =>
    Object.values(notifStore.unreadByUser || {}).reduce((a, b) => a + (b || 0), 0),
  )

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

  // Trigger
  .user-trigger {
    position: relative;
    cursor: pointer;
    padding: 4px;

    &__avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(var(--secondary-800-rgb), 0.8);
      border: 1px solid rgba(var(--neutral-100-rgb), 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: @neutral-200;
      transition: all 0.3s @ease;
      position: relative;
      z-index: 1;
    }

    &__badge {
      position: absolute;
      top: 0;
      right: 0;
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
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(var(--primary-500-rgb), 0.2), transparent 70%);
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 0;
    }

    &:hover {
      .user-trigger__avatar {
        background: rgba(var(--secondary-700-rgb), 0.9);
        border-color: rgba(var(--primary-500-rgb), 0.3);
        color: @neutral-50;
        transform: scale(1.05);
      }

      .user-trigger__glow {
        opacity: 1;
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
      background: rgba(var(--neutral-100-rgb), 0.08);
      margin: 4px 0;

      &--subtle {
        background: rgba(var(--neutral-100-rgb), 0.04);
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
      color: @neutral-300;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s @ease;
      text-align: left;

      &:hover {
        background: rgba(var(--neutral-100-rgb), 0.04);
        color: @neutral-100;

        .user-menu__link-icon {
          color: var(--primary-400);
        }
      }

      &-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: @neutral-500;
        transition: color 0.2s;
      }

      &-badge {
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

      &--accent {
        color: var(--primary-400);

        .user-menu__link-icon {
          color: var(--primary-400);
        }

        &:hover {
          background: rgba(var(--primary-500-rgb), 0.1);
          color: var(--primary-300);
        }
      }
    }

    &__logout {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 10px 12px;
      border: none;
      border-radius: 10px;
      background: transparent;
      color: @danger-400;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: rgba(@danger-500, 0.1);
        color: @danger-300;
      }
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
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
