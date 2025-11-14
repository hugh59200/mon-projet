<template>
  <div class="profil">
    <div class="profil__cover">
      <img
        src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80"
        alt="Cover"
        class="profil__cover-img"
      />
      <div class="profil__cover-overlay"></div>
    </div>

    <div class="profil__container">
      <div class="profil__header">
        <div class="profil__avatar">
          <img
            v-if="avatarPreview"
            :src="avatarPreview"
            class="profil__avatar-img"
            alt="Avatar"
          />

          <div
            v-else
            class="profil__avatar-placeholder"
          >
            <BasicIconNext
              name="User"
              :size="42"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            class="profil__avatar-input"
            @change="handleAvatarSelect"
          />
        </div>
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
              {{ profile?.email || 'Adresse e-mail non renseignée' }}
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
      <div class="profil__sections">
        <FilterSection
          title="Informations personnelles"
          v-model="sections.personal"
        >
          <BasicInput
            v-model="editableName"
            label="Nom complet"
            placeholder="Entrez votre nom"
            input-type="form"
          />
          <BasicInput
            v-model="phone"
            label="Téléphone"
            placeholder="+33 6 ..."
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
        <FilterSection
          title="Mes commandes"
          v-model="sections.orders"
        >
          <div class="profil__orders">
            <div
              v-if="lastOrders.length"
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
                  Commande #{{ order?.id?.slice(0, 8) }}
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

          <!-- 👇 Nouveau bloc apparence -->
          <div class="profil__theme-settings">
            <BasicText
              size="body-m"
              weight="bold"
            >
              Apparence
            </BasicText>

            <!-- Choix du thème -->
            <div class="profil__theme-row">
              <BasicText
                size="body-s"
                color="neutral-600"
              >
                Thème
              </BasicText>
              <div class="profil__pill-group">
                <button
                  type="button"
                  class="profil__pill"
                  :class="{ 'profil__pill--active': scheme === 'light' }"
                  @click="scheme = 'light'"
                >
                  Clair
                </button>
                <button
                  type="button"
                  class="profil__pill"
                  :class="{ 'profil__pill--active': scheme === 'dark' }"
                  @click="scheme = 'dark'"
                >
                  Sombre
                </button>
              </div>
            </div>

            <!-- Choix de la palette -->
            <div class="profil__theme-row">
              <BasicText
                size="body-s"
                color="neutral-600"
              >
                Palette de couleurs
              </BasicText>
              <div class="profil__pill-group">
                <button
                  v-for="option in paletteOptions"
                  :key="option.value"
                  type="button"
                  class="profil__pill"
                  :class="{ 'profil__pill--active': palette === option.value }"
                  @click="palette = option.value"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>

          <BasicButton
            label="Sauvegarder mes préférences"
            type="secondary"
            variant="filled"
            @click="savePreferences"
          />
        </FilterSection>

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
          <BasicButton
            label="Sauvegarder mes préférences"
            type="secondary"
            variant="filled"
            @click="savePreferences"
          />
        </FilterSection>
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
        <FilterSection
          title="Assistance & support"
          v-model="sections.support"
        >
          <p>Vous avez une question ? Contactez notre support client.</p>
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
  import { useProfileActions } from '@/supabase/actions/useProfileActions'
  import { useUserActions } from '@/supabase/actions/useUserActions'
  import type { Orders, Profiles } from '@/supabase/types/supabase.types'
  import { getLabelBadge, getTypeBadge } from '@/utils'
  import { useTheme } from 'storybook/internal/theming'
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

  // 👇 thème + palette
  const { palette, scheme } = useTheme()
  const paletteOptions = [
    { label: 'Lab (clean médical)', value: 'lab' },
    { label: 'Premium (pharma)', value: 'premium' },
    { label: 'Neo (biotech)', value: 'neo' },
  ] as const

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
    // si stockage en DB → appeler API
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
    background: @neutral-50;
    min-height: 100vh;
    position: relative;

    &__cover {
      position: relative;
      height: 240px;
      overflow: hidden;

      &-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: brightness(0.8);
      }

      &-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, fade(@neutral-900, 35%), transparent 70%);
      }
    }

    &__container {
      max-width: 900px;
      margin: -70px auto 60px;
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 10px 40px fade(@neutral-900, 15%);
      position: relative;
      z-index: 2;
    }

    &__header {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 40px;
      flex-wrap: wrap;
    }

    &__avatar {
      position: relative;
      width: 110px;
      height: 110px;
      border-radius: 50%;
      overflow: hidden;
      background: fade(@neutral-100, 60%);
      cursor: pointer;
      transition: all 0.35s ease;
      border: 2px solid transparent;
      box-shadow: 0 4px 12px fade(@neutral-900, 10%);

      &:hover {
        transform: scale(1.05);
        border-color: fade(@primary-500, 45%);
        animation: glow-border 2.8s infinite ease-in-out;
      }

      .profil__avatar-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: @neutral-400;
        background: fade(@neutral-100, 60%);
      }
    }

    &__theme-settings {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid fade(@neutral-200, 70%);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__theme-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__pill-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    &__pill {
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 12px;
      line-height: 1;
      border: 1px solid fade(@neutral-300, 80%);
      background: fade(@neutral-0, 90%);
      color: @neutral-700;
      cursor: pointer;
      transition: all 0.18s ease;
      outline: none;

      &:hover {
        background: fade(@neutral-100, 70%);
      }

      &--active {
        border-color: fade(@primary-500, 70%);
        background: fade(@primary-50, 85%);
        color: @primary-700;
        box-shadow: 0 0 0 1px fade(@primary-200, 70%);
      }

      &:focus-visible {
        box-shadow: 0 0 0 2px @focus-ring;
      }
    }

    /* ✨ Glow border animée */
    @keyframes glow-border {
      0% {
        box-shadow: 0 0 0 fade(@primary-500, 40%);
      }
      50% {
        box-shadow: 0 0 18px fade(@primary-400, 60%);
      }
      100% {
        box-shadow: 0 0 0 fade(@primary-500, 40%);
      }
    }

    &__avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__avatar-input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    &__header-info {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    &__meta {
      display: flex;
      align-items: center;
      gap: 8px; // ✅ espace correct entre email et rôle
      flex-wrap: wrap;
    }

    &__role {
      font-style: italic;
    }

    &__sections {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .filter-section {
      background: fade(@neutral-100, 60%);
      border: 1px solid fade(@neutral-200, 70%);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 10px fade(@neutral-900, 5%);
    }

    .profil__actions {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }

    .profil__preferences {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .profil__orders {
      display: flex;
      flex-direction: column;
      gap: 14px;

      .order-card {
        background: fade(@white, 80%);
        border: 1px solid fade(@neutral-300, 60%);
        border-radius: 10px;
        padding: 14px 18px;
        box-shadow: 0 2px 6px fade(@neutral-900, 5%);
        transition: all 0.25s ease;
        cursor: pointer; // 👈
        user-select: none;

        &:hover {
          background: fade(@secondary-50, 80%);
          border-color: fade(@secondary-400, 60%);
          box-shadow: 0 4px 10px fade(@neutral-900, 10%);
          transform: translateY(-1px);
        }

        &__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        &__body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-left: 2px;
        }
      }

      &-footer {
        margin-top: 14px;
        display: flex;
        justify-content: center;
      }
    }
  }
</style>
