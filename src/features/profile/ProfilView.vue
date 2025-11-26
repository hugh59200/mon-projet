<template>
  <div class="profil">
    <div class="profil__cover">
      <img
        src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80"
        alt="Bannière de profil"
        class="profil__cover-img"
      />
    </div>

    <div
      class="profil__container"
      v-motion-slide-visible-once-bottom
    >
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
          <div class="profil__avatar-overlay">
            <BasicIconNext
              name="Camera"
              :size="20"
            />
          </div>
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
              color="neutral-400"
            >
              <BasicIconNext
                name="Mail"
                :size="14"
                class="inline-icon"
              />
              {{ profile?.email || 'e-mail non renseignée' }}
            </BasicText>

            <BasicText
              v-if="profile?.role"
              size="body-s"
              color="primary-400"
              weight="semibold"
              class="profil__role"
            >
              <BasicIconNext
                name="Shield"
                :size="14"
                class="inline-icon"
              />
              {{ profile.role }}
            </BasicText>
          </div>
        </div>
      </div>
      <div class="profil__sections">
        <FilterSection
          title="Informations personnelles"
          v-model="sections.personal"
          icon="User"
        >
          <div class="profil__form-grid">
            <WrapperInput
              v-model="editableName"
              label="Nom complet"
              placeholder="Entrez votre nom"
              input-type="form"
              icon-left="User"
            />
            <WrapperInput
              v-model="phone"
              label="Téléphone"
              placeholder="+33 6 ..."
              input-type="form"
              icon-left="Phone"
            />
          </div>
          <WrapperInput
            v-model="address"
            label="Adresse postale"
            placeholder="12 rue du Peptide, 75000 Paris"
            input-type="form"
            icon-left="MapPin"
          />
          <div class="profil__actions">
            <BasicButton
              label="Enregistrer les modifications"
              type="primary"
              variant="filled"
              :disabled="loading || !hasPersonalChanges"
              :loading="loading"
              @click="updateProfileForm"
              icon-left="Save"
              block
            />
          </div>
        </FilterSection>

        <FilterSection
          title="Mes commandes récentes"
          v-model="sections.orders"
          icon="Box"
        >
          <div class="profil__orders">
            <div
              v-for="order in lastOrders"
              :key="order.id"
              class="profil__order-card"
              @click="goToOrder(order.id)"
            >
              <div class="profil__order-card-head">
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

              <div class="profil__order-card-body">
                <BasicText
                  size="body-m"
                  color="neutral-400"
                >
                  Total :
                  <strong class="text-primary">{{ order.total_amount }} €</strong>
                </BasicText>

                <BasicText
                  size="body-s"
                  color="neutral-500"
                >
                  Passée le {{ formatOrderDate(order.created_at!) }}
                </BasicText>
              </div>
            </div>

            <BasicText
              v-if="!lastOrders.length"
              size="body-m"
              color="neutral-500"
              align="center"
              class="profil__orders-empty"
            >
              Vous n’avez pas encore de commande. **Commencez vos achats !**
            </BasicText>
          </div>

          <BasicButton
            label="Voir toutes mes commandes"
            type="secondary"
            variant="outlined"
            block
            @click="$router.push('/profil/commandes')"
            icon-left="ArrowRight"
          />
        </FilterSection>

        <FilterSection
          title="Préférences & réglages"
          v-model="sections.preferences"
          icon="Settings"
        >
          <div class="profil__preferences">
            <div class="profil__pref-card">
              <BasicText
                size="body-m"
                weight="semibold"
                class="profil__pref-card-title"
              >
                Apparence
              </BasicText>

              <div class="profil__pref-card-row">
                <div class="profil__pref-card-info">
                  <BasicText
                    size="body-m"
                    weight="semibold"
                    color="neutral-100"
                  >
                    Thème de l’interface
                  </BasicText>
                  <BasicText
                    size="body-s"
                    color="neutral-400"
                  >
                    Sélectionnez l’ambiance couleur que vous préférez.
                  </BasicText>
                </div>

                <BasicThemeSelector v-model="isBrownTheme" />
              </div>
            </div>

            <div class="profil__pref-card">
              <BasicText
                size="body-m"
                weight="semibold"
                class="profil__pref-card-title"
              >
                Notifications
              </BasicText>

              <div class="profil__pref-card-list">
                <BasicCheckbox
                  v-model="newsletter"
                  label="Recevoir les newsletters et promotions"
                />
              </div>
            </div>
          </div>

          <BasicButton
            label="Sauvegarder mes préférences"
            type="primary"
            variant="filled"
            block
            :disabled="preferencesLoading || !hasPreferenceChanges"
            :loading="preferencesLoading"
            @click="savePreferences"
            icon-left="Download"
          />
        </FilterSection>

        <FilterSection
          title="Sécurité & gestion du compte"
          v-model="sections.security"
          icon="Lock"
        >
          <div class="profil__form-grid two-cols">
            <WrapperInput
              v-model="newPassword"
              type="password"
              label="Nouveau mot de passe"
              input-type="form"
              icon-left="Key"
            />
            <WrapperInput
              v-model="confirmPassword"
              type="password"
              label="Confirmez le mot de passe"
              input-type="form"
              icon-left="Key"
            />
          </div>
          <div class="profil__actions">
            <BasicButton
              label="Mettre à jour le mot de passe"
              type="secondary"
              variant="filled"
              :disabled="
                passwordLoading || newPassword !== confirmPassword || newPassword.length < 6
              "
              :loading="passwordLoading"
              @click="updatePasswordAction"
              icon-left="RefreshCw"
            />
          </div>
          <div class="profil__danger">
            <BasicButton
              label="Supprimer mon compte"
              type="danger"
              variant="outlined"
              @click="deleteOwnAccount"
              icon-left="Trash"
            />
          </div>
        </FilterSection>

        <FilterSection
          title="Assistance & support"
          v-model="sections.support"
          icon="MessageCircle"
        >
          <BasicText
            size="body-m"
            color="neutral-400"
            style="margin-bottom: 12px"
          >
            Vous avez une question sur une commande ou un produit ? Contactez notre support client
            pour une assistance immédiate.
          </BasicText>
          <BasicButton
            label="Ouvrir la messagerie"
            type="secondary"
            variant="outlined"
            @click="openMessaging"
            icon-left="Mail"
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
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, onMounted, ref, watch, type Ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { BasicThemeSelector } from '../../../designSystem/src'
  import { useAuthStore } from '../auth/stores/useAuthStore'
  import { useChatWidgetStore } from '../chat/user/useChatWidgetStore'
  import { useProfileSectionsStore } from './useProfileSectionsStore'

  const auth = useAuthStore()
  const chatStore = useChatWidgetStore()
  const sections = useProfileSectionsStore()
  const router = useRouter()
  const toast = useToastStore()

  const { loadProfile, updateProfile, changeAvatar, loadLastOrdersAction, updatePassword } =
    useProfileActions()
  const { deleteOwnAccount } = useUserActions()

  const isBrownTheme = ref(false)
  const profile = ref<Profiles | null>(null)
  const lastOrders = ref([]) as Ref<Partial<Orders>[]>

  const editableName = ref('')
  const phone = ref('')
  const address = ref('')
  const avatarPreview = ref<string | null>(null)

  const originalProfile = ref<{ full_name?: string; phone?: string; address?: string }>({})
  const originalNewsletter = ref(false)

  const newsletter = ref(false)
  const preferencesLoading = ref(false)

  const loading = ref(false) // Loader pour le profil
  const newPassword = ref('')
  const confirmPassword = ref('')
  const passwordLoading = ref(false)

  const hasPersonalChanges = computed(() => {
    return (
      editableName.value !== originalProfile.value.full_name ||
      phone.value !== originalProfile.value.phone ||
      address.value !== originalProfile.value.address
    )
  })

  const hasPreferenceChanges = computed(() => {
    return (
      newsletter.value !== originalNewsletter.value ||
      isBrownTheme.value.toString() !==
        (localStorage.getItem('theme-preference') === 'brown').toString()
    )
  })

  const THEME_STORAGE_KEY = 'theme-preference'

  watch(isBrownTheme, (isBrown) => {
    const html = document.documentElement
    html.classList.toggle('theme-brown', isBrown)
    html.classList.toggle('theme-blue', !isBrown)
    localStorage.setItem(THEME_STORAGE_KEY, isBrown ? 'brown' : 'blue')
  })

  function loadThemePreference() {
    const preference = localStorage.getItem(THEME_STORAGE_KEY)
    const isBrown = preference === 'brown'
    isBrownTheme.value = isBrown

    const html = document.documentElement
    // Application immédiate de la classe au montage
    html.classList.add(isBrown ? 'theme-brown' : 'theme-blue')
  }

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
    phone.value = data.phone ?? ''
    address.value = data.address ?? ''

    originalProfile.value = {
      full_name: editableName.value,
      phone: phone.value,
      address: address.value,
    }

    avatarPreview.value = data.avatar_url ? data.avatar_url : null
    lastOrders.value = await loadLastOrdersAction(auth.user.id)
    newsletter.value = false
    originalNewsletter.value = newsletter.value
  }

  async function handleAvatarSelect(e: Event) {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file || !auth.user) return

    const publicUrl = await changeAvatar(auth.user.id, file)

    if (publicUrl) {
      avatarPreview.value = publicUrl
      toast.show('Avatar mis à jour 🎨', 'success')
    }
  }

  async function updateProfileForm() {
    if (!auth.user || !hasPersonalChanges.value) return
    loading.value = true

    const updatedData = {
      full_name: editableName.value,
      phone: phone.value,
      address: address.value,
    }

    const success = await updateProfile(auth.user.id, updatedData)

    if (success) {
      originalProfile.value = updatedData

      if (profile.value) {
        profile.value.full_name = editableName.value
        profile.value.phone = phone.value
      }

      toast.show('Profil mis à jour avec succès! ✅', 'success')
    }
    loading.value = false
  }

  async function updatePasswordAction() {
    if (newPassword.value !== confirmPassword.value) {
      toast.show('Les mots de passe ne correspondent pas.', 'danger')
      return
    }
    if (newPassword.value.length < 6) {
      toast.show('Le mot de passe doit contenir au moins 6 caractères.', 'danger')
      return
    }

    passwordLoading.value = true

    const success = await updatePassword(newPassword.value)

    if (success) {
      toast.show('Mot de passe mis à jour! ✅', 'success')
      newPassword.value = ''
      confirmPassword.value = ''
    }

    passwordLoading.value = false
  }

  async function savePreferences() {
    if (!hasPreferenceChanges.value) return
    preferencesLoading.value = true

    const preferencesData = {
      newsletter: newsletter.value,
    }

    const success = await updateProfile(auth.user!.id, preferencesData)

    if (success) {
      originalNewsletter.value = newsletter.value
      toast.show('Préférences sauvegardées 👍', 'success')
    }

    preferencesLoading.value = false
  }

  function openMessaging() {
    if (auth.isAdmin) {
      router.push('/admin/messagerie')
    } else {
      chatStore.openChat()
    }
  }

  onMounted(async () => {
    loadThemePreference()
    await sections.loadFromSupabase()
    await fetchProfileData()
  })
</script>

<style lang="less">
  .profil {
    &__form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;

      &.two-cols {
        grid-template-columns: 1fr 1fr;
      }
    }

    &__actions {
      margin-top: 20px;
      .BasicButton {
        max-width: 300px;
      }
    }

    &__danger {
      margin-top: 30px;
      border-top: 1px dashed @neutral-800;
      padding-top: 20px;

      .BasicButton {
        max-width: 250px;
      }
    }

    /* -----------------------------
    🖼️ Cover
    ----------------------------- */
    &__cover {
      height: 280px;
      overflow: hidden;
      position: sticky;
      top: 0;
      z-index: 1;

      &-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: brightness(0.65) saturate(1.1);
      }
    }

    /* -----------------------------
    🧊 MAIN CONTAINER (glass)
    ----------------------------- */
    &__container {
      max-width: 950px;
      margin: -100px auto 70px;
      padding: 40px;

      background: rgba(var(--secondary-800-rgb), 0.9);

      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);

      border: 1px solid fade(@neutral-300, 15%);

      box-shadow: 0 25px 60px fade(#000, 50%);

      position: relative;
      z-index: 10;
    }

    /* -----------------------------
    👤 HEADER (titre + avatar)
    ----------------------------- */
    &__header {
      display: flex;
      align-items: center;
      gap: 30px;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 1px solid @neutral-800;
    }

    /* AVATAR */
    &__avatar {
      position: relative;
      width: 130px;
      height: 130px;
      border-radius: 50%;
      flex-shrink: 0;

      background: var(--secondary-700);
      border: 4px solid var(--secondary-900);

      box-shadow:
        0 6px 20px fade(@neutral-900, 50%),
        0 0 0 4px var(--primary-500);

      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: scale(1.05);
        box-shadow:
          0 8px 25px fade(@neutral-900, 60%),
          0 0 0 4px var(--primary-400);
      }

      &-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        color: @neutral-50;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 10;

        .profil__avatar:hover & {
          opacity: 1;
        }
      }

      .profil__avatar-placeholder {
        color: @neutral-300;
        background: var(--secondary-700);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
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
        z-index: 15;
      }
    }

    /* -----------------------------
    Header texte
    ----------------------------- */
    &__header-info {
      display: flex;
      flex-direction: column;
      gap: 8px;

      h3,
      [size='h3'] {
        color: @neutral-50;
      }
    }

    &__meta {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;

      .inline-icon {
        margin-right: 4px;
        position: relative;
        top: -1px;
      }

      .BasicText {
        color: @neutral-400;
      }

      .profil__role {
        color: var(--primary-400);
        background: rgba(var(--primary-500-rgb), 0.15);
        padding: 2px 8px;
        border-radius: 6px;
      }
    }

    /* -----------------------------
    SECTIONS
    ----------------------------- */
    &__sections {
      display: flex;
      flex-direction: column;
      gap: 30px;
      margin-top: 10px;

      :deep(.FilterSection) {
        /* ⬅️ AJOUT :deep() */
        border: 1px solid fade(@neutral-500, 10%);
        background: rgba(var(--secondary-900-rgb), 0.5);
        border-radius: 16px;
        padding: 20px;
      }

      :deep(.FilterSection__content) {
        /* ⬅️ AJOUT :deep() */
        padding-top: 20px;

        .BasicInput:not(:last-child) {
          margin-bottom: 12px;
        }
      }

      :deep(.FilterSection__head .BasicText) {
        /* ⬅️ AJOUT :deep() */
        color: @neutral-50;
      }
    }

    /* -----------------------------
    CARDS
    ----------------------------- */
    &__orders {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 18px;
      margin-bottom: 20px;
    }

    &__order-card,
    &__pref-card {
      background: @neutral-50;
      border: 1px solid @neutral-200;
      padding: 18px 22px;
      border-radius: 14px;
      transition: all 0.25s ease;

      .BasicText {
        color: @neutral-900;
      }
    }

    &__order-card {
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        border-color: var(--primary-400);
        box-shadow: 0 8px 25px rgba(var(--primary-500-rgb), 0.2);
      }

      &-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .BasicText {
          color: @neutral-900;
        }
      }

      &-body {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .BasicText {
          color: @neutral-600;
        }
      }

      .text-primary {
        color: var(--primary-500);
        font-weight: bold;
      }

      .profil__orders-empty {
        display: block;
        margin-top: 6px;
        text-align: center;
      }
    }

    /* -----------------------------
    PREFERENCES
    ----------------------------- */
    &__preferences {
      display: flex;
      flex-direction: column;
      gap: 16px; /* Espacement vertical entre les cartes */
      margin-bottom: 20px;
    }

    &__pref-card {
      cursor: default;
      display: flex;
      flex-direction: column;
      gap: 16px;

      &-title {
        color: @neutral-700;
        border-bottom: 1px solid @neutral-200;
        padding-bottom: 10px;
        margin-bottom: 10px;
      }

      &-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
      }

      &-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .BasicText[color='neutral-100'] {
          color: @neutral-900 !important;
        }
      }

      &-list {
        display: flex;
        flex-direction: column;
        gap: 14px;

        :deep(.BasicCheckbox) {
          /* ⬅️ AJOUT :deep() */
          /* Styles spécifiques aux checkboxes si besoin */
          .BasicText {
            color: @neutral-800; /* Assurer une couleur de texte appropriée dans la carte */
          }
        }
      }

      /* STYLE DU SÉLECTEUR DE THÈME */
      :deep(.BasicThemeSelector) {
        /* ⬅️ AJOUT :deep() */
        border: 1px solid @neutral-300;
        padding: 6px;
        border-radius: 12px;
        transition: all 0.3s ease;

        &:hover {
          border-color: @neutral-500;
        }

        .BasicThemeSelector__option {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          transition: all 0.3s ease;

          &--active {
            box-shadow: 0 0 0 3px var(--primary-500);
            transform: scale(1.05);
          }
        }
        .BasicText {
          font-weight: 500;
          color: @neutral-700;
        }
      }
    }

    /* Ciblage direct des WrapperInput dans les formulaires */
    :deep(.WrapperInput) {
      /* ⬅️ AJOUT :deep() pour tous les WrapperInput */
      .BasicInput {
        border-color: @neutral-300;
        background: @neutral-50;
      }
    }

    /* --- Media Queries --- */
    @media (max-width: 768px) {
      &__container {
        margin: -60px 20px 50px;
        padding: 30px 20px;
      }

      &__header {
        flex-direction: column;
        text-align: center;
        gap: 20px;
        border-bottom: none;
        padding-bottom: 0;
      }

      &__meta {
        justify-content: center;
      }

      &__form-grid {
        grid-template-columns: 1fr;
      }

      &__orders {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
