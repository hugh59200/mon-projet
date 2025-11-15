<template>
  <div class="profil">
    <!-- COVER -->
    <ProfilCover
      :avatar="avatarPreview"
      @select-avatar="handleAvatarSelect"
    />

    <!-- CARD -->
    <div class="profil__container">
      <!-- HEADER -->
      <ProfilHeader
        :email="profile?.email!"
        :role="profile?.role!"
        v-model:name="editableName"
        :avatar="avatarPreview"
      />

      <!-- SECTIONS -->
      <div class="profil__sections">
        <!-- SECTION : INFO PERSO -->
        <ProfilPersonalInfo
          v-model:open="sections.personal"
          v-model:fullName="editableName"
          v-model:phone="phone"
          v-model:address="address"
          :loading="loading"
          @submit="updateProfileForm"
        />

        <!-- SECTION : COMMANDES -->
        <ProfilOrders
          v-model="sections.orders"
          :orders="lastOrders"
          @open-order="goToOrder"
        />

        <!-- SECTION : PREFERENCES -->
        <ProfilPreferences
          v-model="sections.preferences"
          v-model:newsletter="newsletter"
          v-model:smsAlerts="smsAlerts"
          @save="savePreferences"
        />

        <!-- SECTION : SÉCURITÉ -->
        <ProfilSecurity
          v-model="sections.security"
          :loading="passwordLoading"
          @update-password="updatePasswordAction"
          @delete-account="deleteOwnAccount"
        />

        <!-- SECTION : SUPPORT -->
        <FilterSection
          title="Assistance & support"
          v-model="sections.support"
        >
          <BasicText size="body-m">
            Vous avez une question ? Contactez notre support client.
          </BasicText>

          <BasicButton
            label="Ouvrir la messagerie"
            type="secondary"
            variant="outlined"
            @click="openMessaging"
          />
        </FilterSection>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  /* STORES & ROUTER */
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useChatWidgetStore } from '@/features/chat/user/useChatWidgetStore'
  import { onMounted, ref, type Ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useProfileSectionsStore } from './useProfileSectionsStore'

  /* DS COMPONENTS */
  import FilterSection from '@/features/shared/components/FilterSection.vue'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'

  /* SUB-COMPONENTS (new ones) */
  import ProfilCover from '@/features/profile/components/ProfilCover.vue'
  import ProfilHeader from '@/features/profile/components/ProfilHeader.vue'
  import ProfilOrders from '@/features/profile/components/ProfilOrders.vue'
  import ProfilPersonalInfo from '@/features/profile/components/ProfilPersonalInfo.vue'
  import ProfilPreferences from '@/features/profile/components/ProfilPreferences.vue'
  import ProfilSecurity from '@/features/profile/components/ProfilSecurity.vue'

  /* SUPABASE ACTIONS */
  import { useProfileActions } from '@/supabase/actions/useProfileActions'
  import { useUserActions } from '@/supabase/actions/useUserActions'
  import type { Orders, Profiles } from '@/supabase/types/supabase.types'

  const auth = useAuthStore()
  const router = useRouter()
  const chatStore = useChatWidgetStore()
  const sections = useProfileSectionsStore()

  const { loadProfile, updateProfile, changeAvatar, loadLastOrdersAction, updatePassword } =
    useProfileActions()
  const { deleteOwnAccount } = useUserActions()

  /* STATES */
  const profile = ref<Profiles | null>(null)
  const lastOrders = ref([]) as Ref<Partial<Orders>[]>

  const editableName = ref('')
  const avatarPreview = ref<string | null>(null)
  const phone = ref('')
  const address = ref('')

  const newsletter = ref(false)
  const smsAlerts = ref(false)

  const loading = ref(false)
  const passwordLoading = ref(false)

  function goToOrder(id?: string) {
    if (!id) return
    router.push(`/profil/commandes/${id}`)
  }

  /* FETCH PROFILE */
  async function fetchProfileData() {
    if (!auth.user) return

    const data = await loadProfile(auth.user.id)
    if (!data) return

    profile.value = data
    editableName.value = data.full_name ?? ''
    avatarPreview.value = data.avatar_url || null
    phone.value = data.phone ?? ''
    address.value = data.address ?? ''

    lastOrders.value = await loadLastOrdersAction(auth.user.id)
  }

  /* AVATAR UPDATE */
  async function handleAvatarSelect(file: File) {
    if (!auth.user || !file) return

    const publicUrl = await changeAvatar(auth.user.id, file)
    if (publicUrl) avatarPreview.value = publicUrl
  }

  /* PROFILE UPDATE */
  async function updateProfileForm() {
    if (!auth.user) return
    loading.value = true

    await updateProfile(auth.user.id, {
      full_name: editableName.value,
      phone: phone.value,
      address: address.value,
    })

    loading.value = false
  }

  /* PASSWORD */
  async function updatePasswordAction({ password }: { password: string }) {
    passwordLoading.value = true
    await updatePassword(password)
    passwordLoading.value = false
  }

  /* PREFERENCES (future API) */
  function savePreferences() {}

  /* SUPPORT */
  function openMessaging() {
    if (auth.isAdmin) router.push('/admin/messagerie')
    else chatStore.openChat()
  }

  /* ON MOUNT */
  onMounted(async () => {
    await sections.loadFromSupabase()
    await fetchProfileData()
  })
</script>

<style scoped lang="less">
  .profil {
    background: var(--surface-0);
    min-height: 100vh;

    &__container {
      background: var(--surface-1);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-xl);
      backdrop-filter: blur(10px);

      padding: 42px 48px;
      margin: -90px auto 60px;

      box-shadow: var(--surface-shadow);
      max-width: 1020px;
      transition: var(--transition-medium);

      &:hover {
        border-color: var(--surface-border-strong);
      }
    }

    &__sections {
      display: flex;
      flex-direction: column;
      gap: 26px;
      margin-top: 10px;
    }
  }
</style>
