<template>
  <div class="profil">
    <!-- 🌈 Cover -->
    <div class="profil__cover">
      <img
        src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80"
        alt="Cover"
        class="profil__cover-img"
      />
      <div class="profil__cover-overlay"></div>
    </div>

    <div class="profil__container">
      <!-- 👤 Header -->
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
            🙂
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
            size="h5"
            weight="bold"
          >
            {{ editableName || 'Mon profil' }}
          </BasicText>
          <p class="profil__email">{{ profile?.email }}</p>
          <p class="profil__role">{{ profile?.role }}</p>
        </div>
      </div>

      <!-- 🧱 SECTIONS -->
      <div class="profil__sections">
        <!-- 🧩 INFOS PERSO -->
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
              @click="updateProfile"
            />
          </div>
        </FilterSection>

        <!-- 📦 COMMANDES -->
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
            >
              <div class="order-card__header">
                <strong>Commande #{{ order.id.slice(0, 8) }}</strong>
                <span :class="['status', order.status]">{{ order.status }}</span>
              </div>
              <div class="order-card__body">
                <p>Total : {{ order.total_amount }} €</p>
                <p>Date : {{ new Date(order.created_at).toLocaleDateString() }}</p>
              </div>
            </div>
            <p v-else>Aucune commande récente.</p>
          </div>
          <BasicButton
            label="Voir toutes mes commandes"
            type="secondary"
            variant="outlined"
            @click="$router.push('/profil/commandes')"
          />
        </FilterSection>

        <!-- 🪄 PRÉFÉRENCES -->
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

        <!-- 🔐 SÉCURITÉ -->
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
              @click="updatePassword"
            />
          </div>
          <div class="profil__danger">
            <BasicButton
              label="Supprimer mon compte"
              type="danger"
              variant="outlined"
              @click="deleteAccount"
            />
          </div>
        </FilterSection>

        <!-- 💬 SUPPORT -->
        <FilterSection
          title="Assistance & support"
          v-model="sections.support"
        >
          <p>Vous avez une question ? Contactez notre support client.</p>
          <BasicButton
            label="Ouvrir la messagerie"
            type="secondary"
            variant="outlined"
            @click="chatStore.openChat"
          />
        </FilterSection>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import FilterSection from '@/components/FilterSection.vue'
  import { supabase } from '@/supabase/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'
  import { useChatWidgetStore } from '../admin/chat/stores/useChatWidgetStore'
  import { useAuthStore } from '../auth/useAuthStore'
  import { useProfileSectionsStore } from './useProfileSectionsStore'

  const auth = useAuthStore()
  const toast = useToastStore()
  const sections = useProfileSectionsStore()
  const chatStore = useChatWidgetStore()

  const profile = ref<any | null>(null)
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
  const lastOrders = ref<any[]>([])

  async function loadProfile() {
    if (!auth.user) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', auth.user.id)
      .maybeSingle()
    if (data) {
      profile.value = data
      editableName.value = data.full_name ?? ''
      avatarPreview.value = data.avatar_url ? getPublicUrl(data.avatar_url) : null
      phone.value = data.phone ?? ''
      address.value = data.address ?? ''
    }
  }

  async function loadLastOrders() {
    if (!auth.user) return
    const { data } = await supabase
      .from('orders')
      .select('id, total_amount, created_at, status')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false })
      .limit(3)
    if (data) lastOrders.value = data
  }

  function getPublicUrl(path: string) {
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleAvatarSelect(e: Event) {
    const target = e.target as HTMLInputElement
    if (!target.files?.length || !auth.user) return
    const file = target.files[0]
    if (!file) return
    const ext = file.name.split('.').pop()
    const path = `${auth.user.id}-${Date.now()}.${ext}`

    await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    await supabase.from('profiles').update({ avatar_url: path }).eq('id', auth.user.id)
    avatarPreview.value = getPublicUrl(path)
    toast.show('Avatar mis à jour 🎨', 'success')
  }

  async function updateProfile() {
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: editableName.value, phone: phone.value, address: address.value })
      .eq('id', profile.value.id)
    if (error) toast.show('Erreur de mise à jour', 'danger')
    else toast.show('Profil mis à jour ✅', 'success')
  }

  async function updatePassword() {
    if (newPassword.value !== confirmPassword.value) {
      toast.show('Les mots de passe ne correspondent pas ❌', 'danger')
      return
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword.value })
    if (error) toast.show(error.message, 'danger')
    else toast.show('Mot de passe mis à jour ✅', 'success')
  }

  function savePreferences() {
    toast.show('Préférences enregistrées ✅', 'success')
  }

  async function deleteAccount() {
    toast.show('Suppression du compte non disponible côté client', 'warning')
  }

  onMounted(async () => {
    await auth.initAuth()
    await sections.loadFromSupabase()
    await loadProfile()
    await loadLastOrders()
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
      margin: -70px auto 60px; // chevauche légèrement la cover
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
      box-shadow: 0 4px 12px fade(@neutral-900, 10%);
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        transform: scale(1.05);
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

    &__sections {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* 🧩 Style des FilterSection → effet carte claire */
    .filter-section {
      background: fade(@neutral-100, 60%);
      border: 1px solid fade(@neutral-200, 70%);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 10px fade(@neutral-900, 5%);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Espacement harmonieux entre inputs, labels et boutons */
    .basic-input {
      margin-bottom: 8px;
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
      label {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .profil__orders {
      display: flex;
      flex-direction: column;
      gap: 12px;
      .order-card {
        border: 1px solid fade(@neutral-200, 50%);
        border-radius: 10px;
        padding: 12px 16px;
        background: fade(@neutral-100, 50%);
        box-shadow: 0 2px 6px fade(@neutral-900, 5%);
        transition: all 0.25s ease;
        &:hover {
          transform: translateY(-2px);
        }
        &__header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }
      }
    }

    .profil__danger {
      margin-top: 24px;
      text-align: center;
    }
  }
</style>
