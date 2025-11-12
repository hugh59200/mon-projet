<template>
  <ModalComponent
    v-model="visible"
    :closable="true"
  >
    <!-- 🧠 En-tête -->
    <template #header>
      {{ headerTitle }}
    </template>

    <!-- 🧱 Contenu -->
    <template #content>
      <div class="topic-form">
        <!-- 🏷️ Nom -->
        <WrapperInput
          v-model="form.label"
          label="Nom du topic"
          placeholder="Ex : Santé publique"
          required
        />

        <!-- 🖼️ Image -->
        <WrapperFormElements label="Image du topic (optionnelle)">
          <BasicInput
            readonly
            placeholder="Sélectionner une image..."
            icon-name="Upload"
            @click="openFilePicker"
            :value="selectedFile?.name || extractFileName(form.image) || ''"
          />

          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden-input"
            @change="handleFileChange"
          />

          <div
            v-if="imagePreview || form.image"
            class="image-preview"
          >
            <img
              :src="imagePreview || form.image || undefined"
              alt="Aperçu du topic"
            />
            <div class="image-actions">
              <BasicButton
                v-if="form.image"
                label="Supprimer l’image"
                type="secondary"
                size="small"
                variant="outlined"
                @click="handleRemoveImage"
              />
              <BasicButton
                label="Changer d’image"
                type="primary"
                size="small"
                variant="ghost"
                @click="openFilePicker"
              />
            </div>
          </div>
        </WrapperFormElements>
      </div>
    </template>

    <!-- 🧭 Actions -->
    <template #actions>
      <div class="justify-content-space-evenly flex">
        <BasicButton
          label="Enregistrer"
          type="primary"
          :disabled="loading"
          @click="handleSubmit"
        />
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import { useTopicImageHandler } from '@/features/admin/topics/composables/useTopicImageHandler'
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { createTopic, fetchTopicById, updateTopic } from '@/supabase/api/topics'
  import type { NewsTopics } from '@/supabase/types/supabase.types'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicInput from '@designSystem/components/basic/input/BasicInput.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import WrapperFormElements from '@designSystem/components/wrapper/formElements/WrapperFormElements.vue'
  import WrapperInput from '@designSystem/components/wrapper/input/WrapperInput.vue'
  import { computed, onMounted, ref } from 'vue'

  const visible = defineModel<boolean>()
  const props = defineProps<{ topicId?: string | null }>()
  const emit = defineEmits<{ (e: 'saved'): void }>()

  const toast = useToastStore()
  const loading = ref(false)

  const form = ref<Pick<NewsTopics, 'label' | 'image'>>({
    label: '',
    image: null,
  })

  // 🧩 Gestion d'image via le composable
  const {
    fileInputRef,
    selectedFile,
    imagePreview,
    openFilePicker,
    handleFileChange,
    extractFileName,
    uploadImage,
    removeImage,
  } = useTopicImageHandler(() => false)

  const headerTitle = computed(() => (props.topicId ? 'Modifier un topic' : 'Créer un topic'))

  async function handleSubmit() {
    if (!form.value.label.trim()) {
      toast.show('Le nom du topic est obligatoire', 'warning')
      return
    }

    loading.value = true
    try {
      let uploadedUrl: string | null = null

      // 🔹 Upload avec suppression de l’ancienne image + timestamp unique
      if (selectedFile.value) {
        uploadedUrl = await uploadImage(form.value.label, form.value.image ?? undefined)
        form.value.image = uploadedUrl
        imagePreview.value = uploadedUrl
      }

      // 🔹 Création ou mise à jour
      if (props.topicId) {
        // ✅ Mise à jour du topic avec la nouvelle image
        const updated = await updateTopic(props.topicId, {
          label: form.value.label,
          image: uploadedUrl ?? form.value.image ?? null,
        })

        // 🔁 Rafraîchir localement l'image avec cache-bust
        if (updated?.image) {
          form.value.image = `${updated.image}?v=${Date.now()}`
          imagePreview.value = form.value.image
        }

        toast.show('Topic mis à jour ✅', 'success')
      } else {
        await createTopic(form.value)
        toast.show('Topic créé ✅', 'success')
      }

      // ✅ Fermeture & rafraîchissement
      emit('saved')
      visible.value = false
    } catch (err: any) {
      toast.show(`Erreur : ${(err as Error).message}`, 'danger')
    } finally {
      loading.value = false
    }
  }

  // 🗑️ Suppression manuelle de l’image
  async function handleRemoveImage() {
    if (!form.value.image) return
    if (!confirm('Supprimer cette image définitivement ?')) return

    try {
      await removeImage(form.value.image)

      // ✅ MAJ côté front
      form.value.image = null
      imagePreview.value = null
      selectedFile.value = null

      // ✅ MAJ côté base Supabase
      if (props.topicId) {
        await updateTopic(props.topicId, { image: null })
      }

      toast.show('Image supprimée ✅', 'success')

      // 🧭 Fermeture de la modale + rafraîchissement parent
      emit('saved')
      visible.value = false
    } catch (err: any) {
      toast.show(`Erreur suppression image : ${(err as Error).message}`, 'danger')
    }
  }

  // 📦 Chargement du topic existant
  onMounted(async () => {
    if (props.topicId) {
      const data = await fetchTopicById(props.topicId)
      if (data) {
        form.value.label = data.label
        form.value.image = data.image
      }
    }
  })
</script>

<style scoped lang="less">
  .topic-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 16px;
  }

  .hidden-input {
    display: none;
  }

  .image-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    img {
      max-width: 240px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .image-actions {
      display: flex;
      gap: 10px;
      margin-top: 8px;
    }
  }
</style>
