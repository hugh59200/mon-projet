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
        <div class="profil__avatar" :class="{ 'profil__avatar--uploading': isUploadingAvatar }">
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
            :disabled="isUploadingAvatar"
            @change="handleAvatarSelect"
          />
          <div class="profil__avatar-overlay">
            <BasicLoader v-if="isUploadingAvatar" size="small" />
            <BasicIconNext
              v-else
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
            {{ editableName || t('profile.title') }}
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
              {{ profile?.email || t('profile.emailNotSet') }}
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
          :title="t('profile.personalInfo')"
          v-model="sections.personal"
          icon="User"
        >
          <div class="profil__form-grid">
            <WrapperInput
              v-model="editableName"
              :label="t('profile.fullName')"
              :placeholder="t('profile.placeholders.fullName')"
              :hint="t('profile.hints.fullName')"
              input-type="form"
              icon-left="User"
            />
            <WrapperInput
              v-model="phone"
              :label="t('profile.phone')"
              :placeholder="t('profile.placeholders.phone')"
              :hint="t('profile.hints.phone')"
              input-type="form"
              icon-left="Phone"
            />
          </div>

          <div class="profil__form-divider"></div>
          <BasicText
            size="body-s"
            weight="bold"
            color="neutral-400"
            class="profil__form-subtitle"
          >
            {{ t('profile.defaultAddress').toUpperCase() }}
          </BasicText>

          <AddressAutocomplete
            v-if="country === 'France' || country === ''"
            v-model="address"
            :label="t('profile.addressLabel')"
            :placeholder="t('profile.placeholders.address')"
            :hint="t('profile.hints.address')"
            class="mb-4"
            @fill="onAddressFill"
          />
          <WrapperInput
            v-else
            v-model="address"
            :label="t('profile.addressLabel')"
            :placeholder="t('profile.placeholders.address')"
            :hint="t('profile.hints.address')"
            input-type="form"
            icon-left="MapPin"
            class="mb-4"
          />

          <div class="profil__form-grid">
            <WrapperInput
              v-model="zip"
              :label="t('profile.postalCode')"
              :placeholder="t('profile.placeholders.postalCode')"
              :hint="t('profile.hints.postalCode')"
              input-type="form"
              inputmode="numeric"
              pattern="[0-9]*"
              :maxlength="5"
              @input="onZipInput"
            />
            <WrapperInput
              v-model="city"
              :label="t('profile.city')"
              :placeholder="t('profile.placeholders.city')"
              :hint="t('profile.hints.city')"
              input-type="form"
              minlength="2"
            />
          </div>

          <WrapperInput
            v-model="country"
            :label="t('profile.country')"
            :placeholder="t('profile.placeholders.country')"
            :hint="t('profile.hints.country')"
            input-type="form"
            icon-left="Globe"
          />

          <div class="profil__actions">
            <PremiumButton
              type="primary"
              variant="solid"
              size="md"
              width="full"
              :label="t('profile.saveChanges')"
              icon-left="Save"
              :disabled="!hasPersonalChanges"
              :loading="loading"
              loading-text="Enregistrement..."
              :shine="true"
              :glow="hasPersonalChanges && !loading"
              @click="updateProfileForm"
            />
          </div>
        </FilterSection>

        <FilterSection
          :title="t('profile.recentOrders')"
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
                  {{ t('profile.orderNumber') }}{{ order.id?.slice(0, 8) }}
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
                  {{ t('profile.orderTotal') }}
                  <strong class="text-primary">{{ order.total_amount }} €</strong>
                </BasicText>

                <BasicText
                  size="body-s"
                  color="neutral-500"
                >
                  {{ t('profile.orderDate') }} {{ formatOrderDate(order.created_at!) }}
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
              {{ t('profile.noOrders') }} **{{ t('profile.startShopping') }}**
            </BasicText>
          </div>

          <PremiumButton
            type="secondary"
            variant="outline"
            size="md"
            width="full"
            :label="t('profile.viewAllOrders')"
            icon-right="ArrowRight"
            @click="$router.push('/profil/commandes')"
          />
        </FilterSection>

        <FilterSection
          :title="t('profile.preferences')"
          v-model="sections.preferences"
          icon="Settings"
        >
          <div class="profil__preferences">
            <div class="profil__pref-card profil__pref-card--premium">
              <div class="profil__pref-card-header">
                <BasicIconNext
                  name="Palette"
                  :size="20"
                  class="profil__pref-card-icon"
                />
                <BasicText
                  size="body-m"
                  weight="bold"
                  class="profil__pref-card-title"
                >
                  {{ t('profile.appearance') }}
                </BasicText>
              </div>

              <BasicText
                size="body-s"
                color="neutral-400"
                class="profil__pref-card-subtitle"
              >
                {{ t('profile.themeDesc') }}
              </BasicText>

              <PremiumThemeSelector
                v-model="isBrownTheme"
                label-color="neutral-800"
                description-color="neutral-600"
              />
            </div>

            <div class="profil__pref-card profil__pref-card--secondary">
              <div class="profil__pref-card-header">
                <BasicIconNext
                  name="Bell"
                  :size="20"
                  class="profil__pref-card-icon"
                />
                <BasicText
                  size="body-m"
                  weight="bold"
                  class="profil__pref-card-title"
                >
                  {{ t('profile.notifications') }}
                </BasicText>
              </div>

              <div class="profil__pref-card-list">
                <BasicCheckbox
                  v-model="newsletter"
                  :label="t('profile.newsletter')"
                />
              </div>
            </div>
          </div>

          <PremiumButton
            type="primary"
            variant="solid"
            size="md"
            width="full"
            :label="t('profile.savePreferences')"
            icon-left="Save"
            :disabled="preferencesLoading || !hasPreferenceChanges"
            :loading="preferencesLoading"
            loading-text="Enregistrement..."
            :shine="true"
            :glow="hasPreferenceChanges && !preferencesLoading"
            @click="savePreferences"
          />
        </FilterSection>

        <FilterSection
          :title="t('profile.security')"
          v-model="sections.security"
          icon="Lock"
        >
          <div class="profil__form-grid two-cols">
            <WrapperInput
              v-model="newPassword"
              type="password"
              :label="t('profile.newPassword')"
              :hint="t('profile.hints.newPassword')"
              input-type="form"
              icon-left="Key"
              minlength="8"
              :alert-label="newPassword && passwordStrength.score < 2 ? 'Mot de passe trop faible' : ''"
              :alert-type="newPassword && passwordStrength.score < 2 ? 'warning' : undefined"
            />
            <WrapperInput
              v-model="confirmPassword"
              type="password"
              :label="t('profile.confirmNewPassword')"
              :hint="t('profile.hints.confirmPassword')"
              input-type="form"
              icon-left="Key"
              minlength="8"
              :alert-label="confirmPassword && !passwordsMatch ? 'Les mots de passe ne correspondent pas' : ''"
              :alert-type="confirmPassword && !passwordsMatch ? 'danger' : undefined"
            />
          </div>

          <div v-if="newPassword" class="profil__password-strength">
            <div class="profil__password-strength-bar">
              <div
                class="profil__password-strength-fill"
                :style="{
                  width: `${(passwordStrength.score / 4) * 100}%`,
                  backgroundColor: passwordStrength.color
                }"
              />
            </div>
            <span class="profil__password-strength-label" :style="{ color: passwordStrength.color }">
              {{ t(`validation.password.${passwordStrength.label}`) }}
            </span>
          </div>

          <div class="profil__actions">
            <PremiumButton
              :label="t('profile.updatePassword')"
              type="secondary"
              variant="solid"
              :disabled="passwordLoading || !canUpdatePassword"
              :loading="passwordLoading"
              @click="updatePasswordAction"
              icon-left="RefreshCw"
            />
          </div>
          <div class="profil__danger">
            <PremiumButton
              :label="t('profile.deleteAccount')"
              type="danger"
              variant="outline"
              @click="deleteOwnAccount"
              icon-left="Trash"
            />
          </div>
        </FilterSection>

        <FilterSection
          :title="t('profile.support')"
          v-model="sections.support"
          icon="MessageCircle"
        >
          <BasicText
            size="body-m"
            color="neutral-400"
            style="margin-bottom: 12px"
          >
            {{ t('profile.supportDesc') }}
          </BasicText>
          <PremiumButton
            :label="t('profile.openMessaging')"
            type="secondary"
            variant="outline"
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
  import { useProfileActions } from './composables/useProfileActions'
  import { useUserActions } from '@/features/admin/users/composables/useUserActions'
  import type { Orders, Profiles } from '@/supabase/types/supabase.types'
  import { getLabelBadge, getTypeBadge } from '@/utils'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, onMounted, ref, watch, type Ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import PremiumThemeSelector from '@designSystem/components/basic/theme/PremiumThemeSelector.vue'
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useChatWidgetStore } from '@/features/chat/user/useChatWidgetStore'
  import { useProfileSectionsStore } from './useProfileSectionsStore'
  import { formatPostalCode } from '@/composables/validation/formatters'
  import { calculatePasswordStrength } from '@/composables/validation'
  import AddressAutocomplete from '@/features/shared/components/AddressAutocomplete.vue'

  const { t } = useI18n()
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
  const zip = ref('')
  const city = ref('')
  const country = ref('')
  const avatarPreview = ref<string | null>(null)

  const originalProfile = ref<{
    full_name?: string
    phone?: string
    address?: string
    zip?: string
    city?: string
    country?: string
  }>({})
  const originalNewsletter = ref(false)

  const newsletter = ref(false)
  const preferencesLoading = ref(false)

  const isUploadingAvatar = ref(false)

  const loading = ref(false)
  const newPassword = ref('')
  const confirmPassword = ref('')
  const passwordLoading = ref(false)
  const passwordStrength = computed(() => calculatePasswordStrength(newPassword.value))
  const passwordsMatch = computed(() => newPassword.value === confirmPassword.value)
  const canUpdatePassword = computed(() => {
    return (
      newPassword.value.length > 0 &&
      confirmPassword.value.length > 0 &&
      passwordsMatch.value &&
      passwordStrength.value.score >= 2
    )
  })

  const hasPersonalChanges = computed(() => {
    return (
      editableName.value !== originalProfile.value.full_name ||
      phone.value !== originalProfile.value.phone ||
      address.value !== originalProfile.value.address ||
      zip.value !== originalProfile.value.zip ||
      city.value !== originalProfile.value.city ||
      country.value !== originalProfile.value.country
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
    html.classList.add(isBrown ? 'theme-brown' : 'theme-blue')
  }

  function formatOrderDate(date: string) {
    return new Date(date).toLocaleDateString()
  }

  function goToOrder(id?: string) {
    if (!id) return
    router.push(`/profil/commandes/${id}`)
  }

  function onZipInput(event: Event) {
    const input = event.target as HTMLInputElement
    input.value = formatPostalCode(input.value, 'FR')
    zip.value = input.value
  }

  function onAddressFill(data: { address: string; city: string; postcode: string }) {
    address.value = data.address
    city.value = data.city
    zip.value = data.postcode
    if (!country.value) {
      country.value = 'France'
    }
  }

  async function fetchProfileData() {
    if (!auth.user) return

    const data = await loadProfile(auth.user.id)
    if (!data) return

    profile.value = data

    editableName.value = data.full_name ?? ''
    phone.value = data.phone ?? ''
    address.value = data.address ?? ''
    // @ts-ignore
    zip.value = data.zip ?? ''
    // @ts-ignore
    city.value = data.city ?? ''
    country.value = data.country ?? ''

    originalProfile.value = {
      full_name: editableName.value,
      phone: phone.value,
      address: address.value,
      zip: zip.value,
      city: city.value,
      country: country.value,
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

    isUploadingAvatar.value = true
    try {
      const publicUrl = await changeAvatar(auth.user.id, file)

      if (publicUrl) {
        avatarPreview.value = publicUrl
        toast.show('Avatar mis à jour', 'success')
      }
    } finally {
      isUploadingAvatar.value = false
    }
  }

  async function updateProfileForm() {
    if (!auth.user || !hasPersonalChanges.value) return
    loading.value = true

    const updatedData = {
      full_name: editableName.value,
      phone: phone.value,
      address: address.value,
      zip: zip.value,
      city: city.value,
      country: country.value,
    }

    // @ts-ignore
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
    if (!canUpdatePassword.value) {
      if (!passwordsMatch.value) {
        toast.show('Les mots de passe ne correspondent pas.', 'danger')
      } else if (passwordStrength.value.score < 2) {
        toast.show('Le mot de passe est trop faible.', 'warning')
      }
      return
    }

    passwordLoading.value = true

    const success = await updatePassword(newPassword.value)

    if (success) {
      toast.show('Mot de passe mis à jour !', 'success')
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
      gap: 20px;
      margin-bottom: 20px;

      &.two-cols {
        grid-template-columns: 1fr 1fr;
      }
    }

    &__form-divider {
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.15),
        transparent
      );
      margin: 28px 0 20px;
    }

    &__form-subtitle {
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 16px;
      display: block;
      color: @neutral-400;
    }

    &__actions {
      margin-top: 28px;
      .PremiumButton {
        max-width: 100%;
      }
    }

    &__password-strength {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 12px;
      margin-bottom: 8px;

      &-bar {
        flex: 1;
        height: 6px;
        background: @neutral-700;
        border-radius: 3px;
        overflow: hidden;
      }

      &-fill {
        height: 100%;
        border-radius: 3px;
        transition: all 0.3s ease;
      }

      &-label {
        font-size: 12px;
        font-weight: 600;
        min-width: 80px;
        text-align: right;
      }
    }

    &__danger {
      margin-top: 30px;
      border-top: 1px dashed @neutral-800;
      padding-top: 20px;

      .PremiumButton {
        max-width: 250px;
      }
    }

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

    &__container {
      width: 90%;
      max-width: 1000px;
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

    &__header {
      display: flex;
      align-items: center;
      gap: 30px;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 1px solid @neutral-800;
    }

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

        .profil__avatar:hover &,
        .profil__avatar--uploading & {
          opacity: 1;
        }
      }

      &--uploading {
        pointer-events: none;

        .profil__avatar-input {
          cursor: wait;
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

    &__sections {
      display: flex;
      flex-direction: column;
      gap: 32px;
      margin-top: 16px;

      :deep(.FilterSection) {
        border: 1px solid fade(@neutral-500, 12%);
        background: rgba(var(--secondary-900-rgb), 0.55);
        border-radius: 20px;
        padding: 28px 32px;
        transition: all 0.3s ease;

        &:hover {
          border-color: fade(@neutral-400, 15%);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
      }

      :deep(.FilterSection__content) {
        padding-top: 24px;

        .BasicInput:not(:last-child) {
          margin-bottom: 16px;
        }
      }

      :deep(.FilterSection__head .BasicText) {
        color: @neutral-50;
        font-size: 18px;
        letter-spacing: -0.3px;
      }
    }

    &__orders {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    &__order-card,
    &__pref-card {
      background: @neutral-50;
      border: 1px solid @neutral-200;
      padding: 22px 26px;
      border-radius: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      .BasicText {
        color: @neutral-900;
      }
    }

    &__order-card {
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-400), var(--primary-600));
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      &:hover {
        border-color: var(--primary-400);
        box-shadow: 0 12px 32px rgba(var(--primary-500-rgb), 0.2);

        &::before {
          transform: translateX(0);
        }
      }

      &-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;

        .BasicText {
          color: @neutral-900;
          font-size: 16px;
        }
      }

      &-body {
        display: flex;
        flex-direction: column;
        gap: 6px;

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
        margin-top: 8px;
        text-align: center;
      }
    }

    &__preferences {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-bottom: 24px;
    }

    &__pref-card {
      position: relative;
      cursor: default;
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 28px 32px;
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(255, 255, 255, 0.92) 100%
      );
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.08),
        0 1px 3px rgba(0, 0, 0, 0.05);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary-400), var(--primary-600));
        opacity: 0;
        transition: opacity 0.4s ease;
      }

      &:hover {
        box-shadow:
          0 20px 50px rgba(0, 0, 0, 0.12),
          0 2px 8px rgba(0, 0, 0, 0.08);

        &::before {
          opacity: 1;
        }
      }

      &--premium {
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(250, 250, 255, 0.95) 100%
        );
        border: 2px solid rgba(102, 126, 234, 0.15);

        &::before {
          background: linear-gradient(
            90deg,
            #667eea 0%,
            #764ba2 50%,
            #f093fb 100%
          );
        }

        &:hover {
          border-color: rgba(102, 126, 234, 0.25);
          box-shadow:
            0 20px 60px rgba(102, 126, 234, 0.15),
            0 2px 10px rgba(102, 126, 234, 0.1);
        }
      }

      &--secondary {
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.95) 0%,
          rgba(248, 250, 252, 0.92) 100%
        );
      }

      &-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-bottom: 16px;
        border-bottom: 2px solid rgba(0, 0, 0, 0.06);
      }

      &-icon {
        color: var(--primary-500);
        padding: 8px;
        background: rgba(var(--primary-500-rgb), 0.1);
        border-radius: 10px;
        transition: all 0.3s ease;

        .profil__pref-card:hover & {
          background: rgba(var(--primary-500-rgb), 0.15);
        }
      }

      &-title {
        color: @neutral-800;
        margin: 0;
        letter-spacing: -0.3px;
      }

      &-subtitle {
        margin: -8px 0 8px;
        line-height: 1.5;
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
        gap: 6px;

        .BasicText[color='neutral-100'] {
          color: @neutral-900 !important;
        }
      }

      &-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 12px 0;

        :deep(.BasicCheckbox) {
          padding: 10px 14px;
          border-radius: 10px;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(var(--primary-500-rgb), 0.05);
          }

          .BasicText {
            color: @neutral-800;
            font-weight: 500;
          }
        }
      }

      :deep(.premium-theme-selector) {
        .premium-theme-selector__option {
          background: rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.15);

          &:hover:not(.premium-theme-selector__option--active) {
            background: rgba(0, 0, 0, 0.08);
            border-color: rgba(0, 0, 0, 0.2);
          }

          &--active {
            background: rgba(var(--primary-500-rgb), 0.1);
            border-color: var(--primary-400);
          }
        }

        .premium-theme-selector__description {
          background: rgba(0, 0, 0, 0.03);
          border-color: rgba(0, 0, 0, 0.1);
        }

        .premium-theme-selector__sparkle {
          color: var(--primary-500);
        }
      }
    }

    :deep(.WrapperInput) {
      .BasicInput {
        border-color: @neutral-300;
        background: @neutral-50;
      }
    }

    .respond-tablet({
      &__container {
        width: 94%;
        padding: 32px;
      }

      &__avatar {
        width: 100px;
        height: 100px;
      }

      :deep(.FilterSection) {
        padding: 24px;
      }
    });

    .respond-mobile({
      &__cover {
        height: 180px;
      }

      &__container {
        width: calc(100% - 32px);
        margin: -60px auto 50px;
        padding: 24px 16px;
      }

      &__header {
        flex-direction: column;
        text-align: center;
        gap: 16px;
        border-bottom: none;
        padding-bottom: 0;
      }

      &__avatar {
        width: 90px;
        height: 90px;
      }

      &__meta {
        justify-content: center;
        flex-direction: column;
        gap: 8px;
      }

      &__form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      &__orders {
        grid-template-columns: 1fr;
      }

      &__order-card,
      &__pref-card {
        padding: 18px 20px;
      }

      :deep(.FilterSection) {
        padding: 20px 16px;
        border-radius: 16px;
      }

      &__sections {
        gap: 24px;
      }

      &__actions .PremiumButton {
        font-size: 14px;
      }

      &__danger .PremiumButton {
        max-width: 100%;
      }
    });
  }
</style>
