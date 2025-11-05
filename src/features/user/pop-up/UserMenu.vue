<template>
  <FloatingDropdownWrapper
    v-model="isOpen"
    :width="230"
    align="right"
    arrow-align="auto"
    :close-delay="1000"
  >
    <!-- ✅ Avatar utilisateur -->
    <template #trigger>
      <div class="user-avatar">
        <BasicIconNext
          name="User"
          :size="22"
          class="avatar-icon"
        />
        <div
          v-if="totalUnread > 0"
          class="user-badge"
        >
          <BasicText
            size="body-s"
            weight="bold"
          >
            {{ totalUnread }}
          </BasicText>
        </div>
      </div>
    </template>

    <!-- ✅ Contenu du menu -->
    <div class="user-menu-content">
      <template v-if="auth.user">
        <!-- 🧑‍💼 En-tête pro 100% BasicText -->
        <div class="user-header-card">
          <div class="user-info">
            <BasicIconNext
              name="UserCircle2"
              :size="22"
              class="icon text--color-neutral-300"
            />
            <div class="user-info-texts">
              <div class="user-info-top">
                <BasicText
                  size="body-m"
                  weight="bold"
                  color="neutral-100"
                >
                  {{ auth.user.email || 'Utilisateur' }}
                </BasicText>

                <!-- ✅ Badge rôle (BasicText pur) -->
                <BasicText
                  size="body-s"
                  weight="semibold"
                  class="role-badge"
                  :class="auth.isAdmin ? 'role-admin' : 'role-user'"
                  :color="auth.isAdmin ? 'warning-600' : 'success-600'"
                >
                  {{ auth.isAdmin ? 'Admin' : 'User' }}
                </BasicText>
              </div>

              <BasicText
                size="body-s"
                color="neutral-400"
              >
                {{ auth.isAdmin ? 'Espace administrateur' : 'Espace personnel' }}
              </BasicText>
            </div>
          </div>
        </div>

        <div class="divider" />

        <!-- Liens principaux -->
        <div
          class="menu-item"
          @click="goToProfile"
        >
          <BasicIconNext
            name="UserCircle2"
            :size="18"
            class="icon"
          />
          <BasicText
            size="body-s"
            color="neutral-100"
          >
            Mon profil
          </BasicText>
        </div>

        <div
          class="menu-item"
          @click="router.push('/admin/messagerie')"
        >
          <BasicIconNext
            name="MessageSquare"
            :size="18"
            class="icon text--color-info-400"
          />
          <BasicText
            size="body-s"
            color="neutral-100"
          >
            Messagerie
          </BasicText>
        </div>

        <div
          class="menu-item"
          @click="router.push('/admin/statistiques')"
        >
          <BasicIconNext
            name="BarChart3"
            :size="18"
            class="icon text--color-success-400"
          />
          <BasicText
            size="body-s"
            color="neutral-100"
          >
            Statistiques
          </BasicText>
        </div>

        <div
          v-if="auth.isAdmin"
          class="menu-item"
          @click="goToAdmin"
        >
          <BasicIconNext
            name="Settings"
            :size="18"
            class="icon text--color-warning-400"
          />
          <BasicText
            size="body-s"
            color="neutral-100"
          >
            Espace Admin
          </BasicText>
        </div>

        <div class="divider" />

        <!-- Déconnexion -->
        <div
          class="menu-item"
          @click="handleLogout"
        >
          <BasicIconNext
            name="LogOut"
            :size="18"
            class="icon text--color-danger-400"
          />
          <BasicText
            size="body-s"
            color="neutral-100"
          >
            Se déconnecter
          </BasicText>
        </div>
      </template>

      <!-- Si non connecté -->
      <template v-else>
        <div
          class="menu-item"
          @click="router.push('/auth/login')"
        >
          <BasicIconNext
            name="LogIn"
            :size="18"
            class="icon text--color-success-400"
          />
          <BasicText
            size="body-s"
            color="neutral-100"
          >
            Connexion
          </BasicText>
        </div>
        <div
          class="menu-item"
          @click="router.push('/auth/register')"
        >
          <BasicIconNext
            name="UserPlus"
            :size="18"
            class="icon text--color-info-400"
          />
          <BasicText
            size="body-s"
            color="neutral-100"
          >
            Inscription
          </BasicText>
        </div>
      </template>
    </div>
  </FloatingDropdownWrapper>
</template>

<script setup lang="ts">
  import { useAdminTabStore } from '@/features/admin/stores/useAdminTabStore'
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { useChatNotifStore } from '@/features/chat/shared/stores/useChatNotifStore'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const auth = useAuthStore()
  const adminTabStore = useAdminTabStore()
  const notifStore = useChatNotifStore()
  const isOpen = ref(false)

  const totalUnread = computed(() =>
    Object.values(notifStore.unreadByUser || {}).reduce((a, b) => a + (b || 0), 0),
  )

  function goToProfile() {
    isOpen.value = false
    router.push('/profil')
  }

  function goToAdmin() {
    isOpen.value = false
    const target = adminTabStore.getRedirectRoute(true)
    router.push(target)
  }

  async function handleLogout() {
    isOpen.value = false
    adminTabStore.clearLastTab()
    await auth.signOut()
  }
</script>

<style scoped lang="less">
  .user-avatar {
    position: relative;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: fade(white, 6%);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition:
      background 0.25s ease,
      box-shadow 0.25s ease;

    &:hover {
      background: fade(white, 10%);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
    }

    .avatar-icon {
      color: white;
      opacity: 0.9;
    }

    .user-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: @primary-500;
      color: white;
      border-radius: 50%;
      height: 14px;
      width: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 0 2px @neutral-900;
      font-size: 11px;
    }
  }

  .user-menu-content {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .divider {
      height: 1px;
      background: fade(white, 10%);
      margin: 6px 0;
    }

    .user-header-card {
      background: fade(white, 8%);
      border-radius: 10px;
      padding: 10px 12px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

      .user-info {
        display: flex;
        align-items: center;
        gap: 10px;

        .icon {
          flex-shrink: 0;
          opacity: 0.9;
        }

        .user-info-texts {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
          width: 100%;
        }

        .user-info-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .role-badge {
          border-radius: 9999px;
          padding: 2px 8px;
          background: fade(white, 10%);
          text-align: center;
        }

        .role-admin {
          background: fade(@warning-600, 15%);
        }

        .role-user {
          background: fade(@success-600, 15%);
        }
      }
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 6px 4px;
      border-radius: 6px;
      transition: background 0.2s ease;

      &:hover {
        background: fade(white, 6%);
      }

      .icon {
        flex-shrink: 0;
        opacity: 0.9;
      }
    }
  }
</style>
