<template>
  <div class="profil">
    <BasicText
      size="h4"
      weight="bold"
      class="profil__title"
    >
      Mon profil
    </BasicText>

    <div
      v-if="profile"
      class="profil__content"
    >
      <!-- 🖼️ Avatar -->
      <div class="profil__avatar">
        <img
          v-if="avatarPreview"
          :src="avatarPreview"
          alt="Avatar"
          class="profil__avatar-img"
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
          @change="uploadAvatar"
        />
      </div>

      <!-- 🧑 Nom complet -->
      <BasicInput
        v-model="editableName"
        label="Nom complet"
        placeholder="Entrez votre nom"
        input-type="form"
      />

      <BasicText size="body-m">Email : {{ profile.email }}</BasicText>
      <BasicText size="body-m">Rôle : {{ profile.role }}</BasicText>

      <div class="profil__actions">
        <BasicButton
          label="Enregistrer"
          type="primary"
          variant="filled"
          :disabled="loading"
          @click="updateProfile"
        />
        <BasicButton
          label="Changer le mot de passe"
          type="secondary"
          variant="outlined"
          @click="showPasswordForm = !showPasswordForm"
        />
      </div>

      <!-- 🔐 Formulaire de mot de passe -->
      <transition name="fade">
        <div
          v-if="showPasswordForm"
          class="profil__password"
        >
          <BasicInput
            v-model="oldPassword"
            type="password"
            placeholder="Ancien mot de passe"
            input-type="form"
          />
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

          <BasicButton
            label="Mettre à jour le mot de passe"
            type="primary"
            variant="filled"
            :disabled="passwordLoading"
            @click="updatePassword"
          />
        </div>
      </transition>
    </div>

    <div
      v-else
      class="profil__loading"
    >
      <BasicText>Chargement du profil...</BasicText>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useToastStore } from '@/features/interface/toast/useToastStore'
  import { supabase } from '@/services/supabaseClient'
  import { onMounted, ref } from 'vue'
  import { useAuthStore } from './useAuthStore'

  const auth = useAuthStore()
  const toast = useToastStore()

  const profile = ref<any | null>(null)
  const editableName = ref('')
  const avatarPreview = ref<string | null>(null)
  const loading = ref(false)
  const showPasswordForm = ref(false)

  const oldPassword = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const passwordLoading = ref(false)

  async function loadProfile() {
    if (!auth.user) return
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', auth.user.id)
      .single()

    if (error) {
      toast.showToast('Erreur lors du chargement du profil', 'danger')
    } else {
      profile.value = data
      editableName.value = data.full_name ?? ''
      if (data.avatar_url) avatarPreview.value = getPublicUrl(data.avatar_url)
    }
  }

  function getPublicUrl(path: string) {
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    return data.publicUrl
  }

  async function uploadAvatar(e: Event) {
    const target = e.target as HTMLInputElement
    if (!target.files?.length || !auth.user) return

    const file = target.files[0]
    const fileExt = file?.name.split('.').pop()
    const filePath = `${auth.user.id}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file!, { upsert: true })

    if (uploadError) {
      toast.showToast('Erreur lors de l’upload de l’image', 'danger')
      return
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: filePath })
      .eq('id', auth.user.id)

    if (updateError) {
      toast.showToast('Erreur lors de la mise à jour du profil', 'danger')
    } else {
      avatarPreview.value = getPublicUrl(filePath)
      toast.showToast('Avatar mis à jour 🎨', 'success')
    }
  }

  async function updateProfile() {
    if (!profile.value) return
    loading.value = true
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: editableName.value })
      .eq('id', profile.value.id)
    loading.value = false

    if (error) toast.showToast('Erreur lors de la mise à jour', 'danger')
    else toast.showToast('Profil mis à jour ✅', 'success')
  }

  async function updatePassword() {
    if (newPassword.value !== confirmPassword.value) {
      toast.showToast('Les mots de passe ne correspondent pas ❌', 'danger')
      return
    }

    passwordLoading.value = true

    const { error } = await supabase.auth.updateUser({
      password: newPassword.value,
    })

    passwordLoading.value = false

    if (error) toast.showToast(error.message, 'danger')
    else {
      toast.showToast('Mot de passe mis à jour ✅', 'success')
      showPasswordForm.value = false
      oldPassword.value = newPassword.value = confirmPassword.value = ''
    }
  }

  onMounted(loadProfile)
</script>

<style scoped lang="less">
  .profil {
    max-width: 500px;
    margin: 60px auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    text-align: center;

    &__title {
      margin-bottom: 20px;
    }

    &__avatar {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto;
    }

    &__avatar-img,
    &__avatar-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      background: @neutral-100;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
    }

    &__avatar-input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    &__actions {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
    }

    &__password {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 16px;
    }
  }

  /* Animation fluide */
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
</style>
