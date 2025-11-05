<template>
  <transition
    name="fade-slide"
    appear
  >
    <div class="user-header">
      <!-- 💻 Desktop -->
      <div
        v-if="!isMobile && !isTablet"
        class="user-info user-info--desktop clickable"
        @click="goToProfile"
      >
        <div class="user-main">
          <!-- Avatar -->
          <div class="user-avatar-inline">
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="Avatar"
              class="avatar-image"
            />
            <div
              v-else
              class="avatar-fallback"
            >
              <BasicText
                size="body-s"
                weight="bold"
                color="white"
              >
                {{ initials }}
              </BasicText>
            </div>
          </div>

          <!-- Informations -->
          <div class="user-texts">
            <div class="user-header-row">
              <BasicText
                size="body-m"
                weight="bold"
                color="white"
                class="user-email"
              >
                {{ auth.user?.email || 'Utilisateur' }}
              </BasicText>
              <BasicBadge
                v-if="auth.isAdmin"
                type="success"
                size="small"
                label="Admin"
                class="user-badge"
              />
            </div>

            <BasicText
              size="body-s"
              color="neutral-300"
              class="user-role"
            >
              {{ auth.isAdmin ? 'Espace administrateur' : 'Mon espace personnel' }}
            </BasicText>
          </div>
        </div>
      </div>

      <!-- 📱 Mobile / tablette -->
      <div
        v-else
        class="user-info user-info--mobile clickable"
        @click="goToProfile"
      >
        <div class="user-main">
          <div class="user-avatar-small">
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="Avatar"
              class="avatar-image-small"
            />
            <div
              v-else
              class="avatar-fallback-small"
            >
              <BasicText
                size="body-s"
                weight="bold"
                color="white"
              >
                {{ initials }}
              </BasicText>
            </div>
          </div>

          <div class="user-mobile-texts">
            <BasicText
              size="body-s"
              weight="bold"
              color="white"
              wrap
            >
              {{ auth.user?.email || 'Utilisateur' }}
            </BasicText>

            <BasicBadge
              v-if="auth.isAdmin"
              type="success"
              size="small"
              label="Admin"
              class="user-badge"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const auth = useAuthStore()
  const { isMobile, isTablet } = useDeviceBreakpoint()

  // ✅ Avatar dynamique (Supabase ou profil custom)
  const avatarUrl = computed(() => {
    return auth.user?.user_metadata?.avatar_url || auth.profile?.avatar_url || null
  })

  // ✅ Initiales fallback
  const initials = computed(() => {
    const email = auth.user?.email || ''
    const base = email.split('@')[0] || ''
    const parts = base.replace(/[^a-zA-Z0-9]/g, ' ').split(' ')
    if (parts.length >= 2) return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()
    return base.slice(0, 2).toUpperCase()
  })

  // ✅ Navigation vers le profil
  function goToProfile() {
    router.push('/profil')
  }
</script>

<style scoped lang="less">
  .user-header {
    display: flex;
    flex-direction: column;
    padding: 8px 0;
    gap: 8px;

    .user-info {
      display: flex;
      flex-direction: column;

      &.clickable {
        cursor: pointer;
        border-radius: 8px;
        padding: 6px 8px;
        transition: all 0.25s ease;

        &:hover {
          background: fade(white, 6%);
          transform: translateY(-1px);
        }

        &:active {
          background: fade(white, 10%);
          transform: scale(0.98);
        }
      }

      &--desktop {
        .user-main {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar-inline {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          overflow: hidden;
          background: fade(white, 8%);
          display: flex;
          align-items: center;
          justify-content: center;

          .avatar-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .avatar-fallback {
            background: @primary-600;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .user-texts {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;

          .user-header-row {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;

            .user-email {
              word-break: break-all;
            }

            .user-badge {
              margin-top: -2px;
            }
          }

          .user-role {
            margin-top: 2px;
          }
        }
      }

      &--mobile {
        .user-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .user-avatar-small {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          background: fade(white, 8%);
          display: flex;
          align-items: center;
          justify-content: center;

          .avatar-image-small {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .avatar-fallback-small {
            background: @primary-600;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .user-mobile-texts {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;

          .user-badge {
            margin-top: 2px;
          }
        }
      }
    }
  }

  /* 🌫️ Animation d’apparition fluide */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.35s ease;
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(-6px);
  }

  .fade-slide-enter-to {
    opacity: 1;
    transform: translateY(0);
  }

  .fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
  }

  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }
</style>
