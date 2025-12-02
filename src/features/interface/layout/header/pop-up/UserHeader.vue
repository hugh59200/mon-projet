<template>
  <div
    class="user-header"
    :initial="motion.initial"
    :enter="motion.enter"
    :hover="motion.hover"
    :tap="motion.tap"
    @click="goToProfile"
  >
    <!-- 👤 Avatar -->
    <div class="user-header__avatar">
      <img
        v-if="avatarPreview"
        :src="avatarPreview"
        alt="Avatar utilisateur"
        class="user-header__avatar-img"
      />
      <div
        v-else
        class="user-header__avatar-fallback"
      >
        <BasicText
          size="body-xl"
          weight="bold"
          color="white"
        >
          {{ initials }}
        </BasicText>
      </div>
    </div>

    <!-- 📧 Infos utilisateur -->
    <div class="user-header__info">
      <BasicText
        size="body-m"
        weight="bold"
        color="white"
        class="user-header__email"
        :title="user?.email || 'Utilisateur'"
      >
        {{ user?.email || 'Utilisateur' }}
      </BasicText>

      <BasicBadge
        v-if="isAdmin"
        type="success"
        size="small"
        label="Admin"
        class="user-header__badge"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { getProfile, getAvatarPublicUrl } from '@/api/supabase/profiles'
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  // ⚙️ Store utilisateur
  const { user, isAdmin } = useAuthStore()
  const router = useRouter()

  // 🎞️ Animation config (Motion One)
  const motion = {
    initial: {
      opacity: 0,
      y: 10,
      scale: 0.97,
    },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 24,
      },
    },
    hover: {
      scale: 1.03,
      backgroundColor: 'rgba(255,255,255,0.06)',
      transition: {
        type: 'spring',
        stiffness: 320,
        damping: 20,
      },
    },
    tap: {
      scale: 0.96,
      backgroundColor: 'rgba(255,255,255,0.08)',
    },
  }

  // 🧠 Avatar
  const avatarPreview = ref<string | null>(null)

  async function loadProfile() {
    if (!user) return
    const data = await getProfile(user.id)
    if (data) {
      avatarPreview.value = data.avatar_url ? getAvatarPublicUrl(data.avatar_url) : null
    }
  }

  // 🪪 Initiales fallback
  const initials = computed(() => {
    const email = user?.email || ''
    const base = email.split('@')[0] || ''
    const parts = base.replace(/[^a-zA-Z0-9]/g, ' ').split(' ')
    if (parts.length >= 2) return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()
    return base.slice(0, 2).toUpperCase()
  })

  // 🔗 Navigation vers le profil
  function goToProfile() {
    if (user) router.push('/profil')
  }

  onMounted(async () => {
    await loadProfile()
  })
</script>

<style scoped lang="less">
  /* ==========================================================
   👤 USER HEADER — Interactive + Motion One
   ========================================================== */

  .user-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    cursor: pointer;
    user-select: none;
    transition: background 0.3s ease;

    &__avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      background: fade(white, 5%);
      display: flex;
      align-items: center;
      justify-content: center;

      &-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }

      &-fallback {
        background: var(--primary-600);
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;
      flex: 1;
      min-width: 0;
    }

    &__email {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__badge {
      align-self: flex-start;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
  }
</style>
