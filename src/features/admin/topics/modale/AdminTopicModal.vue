<template>
  <ModalComponent
    v-model="visible"
    :closable="true"
  >
    <template #header>
      {{ headerTitle }}
    </template>

    <template #content>
      <div class="topic-form">
        <WrapperInput
          v-model="form.label"
          label="Nom du topic"
          placeholder="Ex : Santé publique"
          required
        />

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
            v-if="imagePreview"
            class="image-preview"
          >
            <img
              :src="imagePreview"
              alt="Aperçu topic"
            />
            <BasicButton
              label="Supprimer"
              type="secondary"
              size="small"
              variant="outlined"
              @click="removeImage(form.image)"
            />
          </div>
        </WrapperFormElements>
      </div>
    </template>
    <template #actions>
      <div class="justify-content-space-evenly flex">
        <BasicButton
          label="Supprimer"
          type="secondary"
          variant="outlined"
          @click="handleRemoveImage"
        />
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
  import { createTopic, fetchTopicById, updateTopic } from '@/features/admin/api/topics'
  import { useTopicImageHandler } from '@/features/admin/topics/composables/useTopicImageHandler'
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import type { Tables } from '@/supabase/types/supabase'
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

  // Formulaire typé selon la table Supabase
  const form = ref<Pick<Tables<'news_topics'>, 'label' | 'image'>>({
    label: '',
    image: null,
  })

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
      // Upload d'image si sélectionnée
      if (selectedFile.value) {
        const uploadedUrl = await uploadImage(form.value.label)
        if (uploadedUrl) form.value.image = uploadedUrl
      }

      // Mise à jour ou création
      if (props.topicId) {
        await updateTopic(props.topicId, form.value)
        toast.show('Topic mis à jour ✅', 'success')
      } else {
        await createTopic(form.value)
        toast.show('Topic créé ✅', 'success')
      }

      emit('saved')
      visible.value = false
    } catch (err: any) {
      toast.show(`Erreur : ${(err as Error).message}`, 'danger')
    } finally {
      loading.value = false
    }
  }

  async function handleRemoveImage() {
    if (!form.value.image) return
    if (!confirm('Supprimer cette image définitivement ?')) return

    try {
      await removeImage(form.value.image)
      form.value.image = null
      imagePreview.value = null
      selectedFile.value = null
      toast.show('Image supprimée ✅', 'success')
    } catch (err: any) {
      toast.show(`Erreur suppression image : ${(err as Error).message}`, 'danger')
    }
  }

  // Chargement du topic existant
  onMounted(async () => {
    if (props.topicId) {
      const data = await fetchTopicById(props.topicId)
      if (data) form.value = { label: data.label, image: data.image }
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
    }
  }
</style>
