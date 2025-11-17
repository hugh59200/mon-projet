<template>
  <div class="profil">
    <div class="profil__cover">
      <img
        src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80"
        alt="Cover"
        class="profil__cover-img"
      />
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
            <BasicText size="body-m">
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
  /* ==========================================================
     👤 PROFIL — Neural UI v3 (CONTRASTE AMÉLIORÉ)
     ========================================================== */

  .profil {
    background: transparent !important;
    min-height: 100vh;
    position: relative;

    /* -----------------------------
      🖼️ Cover
    ----------------------------- */
    &__cover {
      height: 260px;
      overflow: hidden;

      &-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: brightness(0.75) saturate(1.08);
      }
    }

    /* -----------------------------
      🧊 MAIN CONTAINER (darker glass)
    ----------------------------- */
    &__container {
      max-width: 900px;
      margin: -80px auto 70px;
      padding: 40px;

      background: linear-gradient(90deg, @secondary-700, darken(@secondary-700, 4%));

      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);

      border: 1px solid fade(@neutral-300, 22%);
      border-radius: 22px;

      box-shadow:
        0 18px 55px fade(#000, 45%),
        inset 0 0 0 1px fade(@neutral-50, 20%);

      position: relative;
      z-index: 2;
    }

    /* -----------------------------
      👤 HEADER (titre + avatar)
    ----------------------------- */
    &__header {
      display: flex;
      align-items: center;
      gap: 26px;
      margin-bottom: 36px;
      flex-wrap: wrap;
    }

    /* AVATAR */
    &__avatar {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 50%;

      background: fade(@neutral-700, 30%);
      border: 2px solid fade(@neutral-400, 35%);

      box-shadow:
        0 4px 18px fade(@neutral-900, 35%),
        0 0 0 3px fade(@white, 10%);

      overflow: hidden;
      transition: all 0.25s ease;

      &:hover {
        transform: scale(1.035);
        border-color: fade(@primary-500, 45%);
        box-shadow:
          0 0 20px fade(@primary-500, 35%),
          0 0 0 3px fade(@primary-400, 20%);
      }

      .profil__avatar-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: @neutral-300;
        background: fade(@neutral-700, 30%);
      }
    }

    .profil__avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profil__avatar-input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer !important;
    }

    /* -----------------------------
      Header texte
    ----------------------------- */
    &__header-info {
      display: flex;
      flex-direction: column;
      gap: 6px;

      h3,
      [size='h3'] {
        color: @neutral-50;
      }
    }

    &__meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;

      color: @neutral-300;
    }

    /* -----------------------------
      SECTIONS
    ----------------------------- */
    &__sections {
      display: flex;
      flex-direction: column;
      gap: 26px;
      margin-top: 10px;
    }
  }
</style>
