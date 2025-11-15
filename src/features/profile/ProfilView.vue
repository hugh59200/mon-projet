<template>
  <div class="profil">
    <!-- COVER -->
    <div class="profil__cover">
      <img
        src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80"
        alt="Cover"
        class="profil__cover-img"
      />
      <div class="profil__cover-overlay" />
    </div>

    <!-- CARD -->
    <div class="profil__container">
      <!-- HEADER -->
      <div class="profil__header">
        <!-- Avatar -->
        <div class="profil__avatar">
          <img
            v-if="avatarPreview"
            :src="avatarPreview"
            class="profil__avatar-img"
          />
          <div
            v-else
            class="profil__avatar-placeholder"
          >
            <BasicIconNext
              name="User"
              :size="44"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            class="profil__avatar-input"
            @change="handleAvatarSelect"
          />
        </div>

        <!-- User info -->
        <div class="profil__header-info">
          <BasicText
            size="h3"
            weight="bold"
          >
            {{ editableName || 'Mon profil' }}
          </BasicText>

          <div class="profil__meta">
            <BasicText
              size="body-m"
              color="neutral-700"
            >
              {{ profile?.email }}
            </BasicText>

            <BasicText
              v-if="profile?.role"
              size="body-s"
              color="neutral-500"
              class="profil__role"
            >
              • {{ profile.role }}
            </BasicText>
          </div>
        </div>
      </div>

      <!-- SECTIONS -->
      <div class="profil__sections">
        <!-- PERSONNAL INFO -->
        <FilterSection
          title="Informations personnelles"
          v-model="sections.personal"
        >
          <BasicInput
            v-model="editableName"
            label="Nom complet"
            input-type="form"
          />
          <BasicInput
            v-model="phone"
            label="Téléphone"
            placeholder="+33..."
            input-type="form"
          />
          <BasicInput
            v-model="address"
            label="Adresse"
            placeholder="12 rue du Peptide"
            input-type="form"
          />

          <div class="profil__actions">
            <BasicButton
              label="Enregistrer les modifications"
              type="primary"
              variant="filled"
              :disabled="loading"
              @click="updateProfileForm"
            />
          </div>
        </FilterSection>

        <!-- ORDERS -->
        <FilterSection
          title="Mes commandes"
          v-model="sections.orders"
        >
          <div class="profil__orders">
            <template v-if="lastOrders.length">
              <div
                v-for="order in lastOrders"
                :key="order.id"
                class="order-card"
                @click="goToOrder(order.id)"
              >
                <div class="order-card__header">
                  <BasicText
                    size="body-l"
                    weight="bold"
                  >
                    Commande #{{ order.id?.slice(0, 8) }}
                  </BasicText>

                  <BasicBadge
                    :label="getLabelBadge(order.status)"
                    :type="getTypeBadge(order.status)"
                    size="small"
                  />
                </div>

                <div class="order-card__body">
                  <BasicText
                    size="body-m"
                    color="neutral-700"
                  >
                    Total :
                    <strong>{{ order.total_amount }} €</strong>
                  </BasicText>

                  <BasicText
                    size="body-m"
                    color="neutral-500"
                  >
                    Date : {{ formatOrderDate(order.created_at!) }}
                  </BasicText>
                </div>
              </div>
            </template>

            <BasicText
              v-else
              size="body-m"
              color="neutral-500"
              align="center"
            >
              Aucune commande récente.
            </BasicText>
          </div>

          <div class="profil__orders-footer">
            <BasicButton
              label="Voir toutes mes commandes"
              type="secondary"
              variant="outlined"
              block
              @click="$router.push('/profil/commandes')"
            />
          </div>
        </FilterSection>

        <!-- PREFERENCES -->
        <FilterSection
          title="Préférences"
          v-model="sections.preferences"
        >
          <div class="profil__preferences">
            <BasicCheckbox
              v-model="newsletter"
              label="Recevoir les newsletters"
            />
            <BasicCheckbox
              v-model="smsAlerts"
              label="Recevoir les alertes SMS"
            />
          </div>

          <!-- THEME PANEL -->
          <ThemeAppearance />

          <BasicButton
            label="Sauvegarder mes préférences"
            type="secondary"
            variant="filled"
            @click="savePreferences"
          />
        </FilterSection>

        <!-- SECURITY -->
        <FilterSection
          title="Sécurité"
          v-model="sections.security"
        >
          <BasicInput
            v-model="newPassword"
            type="password"
            placeholder="Nouveau mot de passe"
            input-type="form"
          />
          <BasicInput
            v-model="confirmPassword"
            type="password"
            placeholder="Confirmez le mot de passe"
            input-type="form"
          />

          <div class="profil__actions">
            <BasicButton
              label="Mettre à jour le mot de passe"
              type="primary"
              variant="filled"
              :disabled="passwordLoading"
              @click="updatePasswordAction"
            />
          </div>

          <div class="profil__danger">
            <BasicButton
              label="Supprimer mon compte"
              type="danger"
              variant="outlined"
              @click="deleteOwnAccount"
            />
          </div>
        </FilterSection>

        <!-- SUPPORT -->
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
  import FilterSection from '@/features/shared/components/FilterSection.vue'
  import ThemeAppearance from '@/themes/components/ThemeAppearance.vue'

  import { useProfileActions } from '@/supabase/actions/useProfileActions'
  import { useUserActions } from '@/supabase/actions/useUserActions'
  import type { Orders, Profiles } from '@/supabase/types/supabase.types'

  import { getLabelBadge, getTypeBadge } from '@/utils'
  import { onMounted, ref, type Ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../auth/stores/useAuthStore'
  import { useChatWidgetStore } from '../chat/user/useChatWidgetStore'
  import { useProfileSectionsStore } from './useProfileSectionsStore'

  const auth = useAuthStore()
  const chatStore = useChatWidgetStore()
  const sections = useProfileSectionsStore()
  const router = useRouter()

  const { loadProfile, updateProfile, changeAvatar, loadLastOrdersAction, updatePassword } =
    useProfileActions()
  const { deleteOwnAccount } = useUserActions()

  const profile = ref<Profiles | null>(null)
  const lastOrders = ref([]) as Ref<Partial<Orders>[]>

  const editableName = ref('')
  const avatarPreview = ref<string | null>(null)
  const phone = ref('')
  const address = ref('')

  const newsletter = ref(false)
  const smsAlerts = ref(false)

  const loading = ref(false)
  const newPassword = ref('')
  const confirmPassword = ref('')
  const passwordLoading = ref(false)

  function formatOrderDate(date: string) {
    return new Date(date).toLocaleDateString()
  }

  function goToOrder(id?: string) {
    if (!id) return
    router.push(`/profil/commandes/${id}`)
  }

  async function fetchProfileData() {
    if (!auth.user) return

    const data = await loadProfile(auth.user.id)
    if (!data) return

    profile.value = data
    editableName.value = data.full_name ?? ''
    avatarPreview.value = data.avatar_url ? data.avatar_url : null
    phone.value = data.phone ?? ''
    address.value = data.address ?? ''

    lastOrders.value = await loadLastOrdersAction(auth.user.id)
  }

  async function handleAvatarSelect(e: Event) {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file || !auth.user) return

    const publicUrl = await changeAvatar(auth.user.id, file)
    if (publicUrl) avatarPreview.value = publicUrl
  }

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

  async function updatePasswordAction() {
    if (newPassword.value !== confirmPassword.value) return
    passwordLoading.value = true

    await updatePassword(newPassword.value)
    passwordLoading.value = false
  }

  function savePreferences() {
    // future API storage possible
  }

  function openMessaging() {
    if (auth.isAdmin) {
      router.push('/admin/messagerie')
    } else {
      chatStore.openChat()
    }
  }

  onMounted(async () => {
    await sections.loadFromSupabase()
    await fetchProfileData()
  })
</script>

<style scoped lang="less">
  .profil {
    background: var(--surface-0);
    min-height: 100vh;

    /* COVER */
    &__cover {
      height: 260px;
      position: relative;
      overflow: hidden;

      &-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: brightness(0.72);
      }

      &-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(var(--neutral-900-rgb), 0.45), transparent 65%);
      }
    }

    /* CARD */
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

    /* HEADER */
    &__header {
      display: flex;
      gap: 28px;
      align-items: center;

      padding-bottom: 28px;
      margin-bottom: 32px;

      border-bottom: 1px solid var(--surface-divider);
    }

    /* Avatar */
    &__avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;

      background: var(--surface-2);
      border: 2px solid rgba(var(--primary-400-rgb), 0.5);
      position: relative;

      transition: var(--transition-medium);

      &:hover {
        transform: scale(1.03);
        box-shadow: 0 0 18px rgba(var(--primary-400-rgb), 0.5);
      }

      &-input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
      }

      &-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--neutral-400);
        background: var(--surface-2);
      }
    }

    /* Text info header */
    &__header-info {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    &__meta {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      color: var(--neutral-600);
    }

    /* SECTIONS */
    &__sections {
      display: flex;
      flex-direction: column;
      gap: 26px;
      margin-top: 10px;
    }

    /* ACTIONS */
    &__actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    /* ORDERS */
    .order-card {
      background: var(--surface-1);
      border-radius: var(--radius-l);

      border: 1px solid var(--surface-border);
      padding: 16px 20px;

      cursor: pointer;
      transition: var(--transition-medium);

      &:hover {
        background: var(--surface-2);
        border-color: var(--surface-border-strong);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(var(--neutral-900-rgb), 0.1);
      }

      &__header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      &__body {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
    }

    /* Danger zone */
    &__danger {
      margin-top: 12px;
      border-top: 1px solid var(--surface-divider);
      padding-top: 16px;
    }
  }
</style>
